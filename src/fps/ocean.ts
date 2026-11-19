// Living ocean (autopilot 2026-11-19): procedural first-person sea for El Morro and Isla de Cabras.
// - Gentle swells: summed Gerstner waves displaced in the vertex shader on a grid that is dense over the
//   play area (~3 m) and quadratically coarser out to the horizon; each wave fades where the grid is too
//   coarse for it (no aliasing), and in shallow water (from the shore texture) so the beach is not flooded.
// - Fresnel: dark teal/navy body looking down, the sky/horizon colour (same gradient as the sky dome) at
//   grazing angles, plus a sharp sun glint and a broad sun path toward sunDir.
// - Shore foam / surf: a depth + distance-to-land texture sampled from the shared terrain heights (and the
//   0.5 m fine fort / El Canuelo heights once they load) drives contact foam at the waterline, breaking
//   lines that roll toward the shore, crest whitecaps and (El Morro) surge on the cliffs.
// Everything is procedural (no assets). Low quality: a 24x24 grid with no vertex waves and a single
// normal sample (fresnel + foam kept, so it still reads as sea), for phones / slow frames.
import * as THREE from 'three';

export type OceanKind = 'morro' | 'cabras';
export type OceanMode = 'full' | 'medium' | 'low';
type Wave = { dx: number; dz: number; len: number; amp: number; q: number };
const W = (dx: number, dz: number, len: number, amp: number, q = 0.55): Wave => { const l = Math.hypot(dx, dz); return { dx: dx / l, dz: dz / l, len, amp, q }; };
/** Per-map look. El Morro's map has the Atlantic on its +x side (swell runs toward -x onto the cliffs);
 *  Isla de Cabras has open water on its -z side (swell runs toward +z onto the beach / riprap). */
export const OCEAN_PRESET = {
  morro: { deep: 0x031a2e, mid: 0x0a3a5a, shallow: 0x15646e, alphaShallow: 0.74, foam: 1.0, breakW: 26, bandLen: 9, bandSpeed: 0.11, cliff: 1.0, caps: 0.55, detail: 0.55,
    waves: [W(-1, 0.25, 78, 0.38), W(-1, -0.2, 47, 0.24), W(-0.8, 0.6, 27, 0.13), W(-0.66, -0.75, 16, 0.07), W(-1, 0.1, 10.5, 0.035)] },
  cabras: { deep: 0x0b4f6c, mid: 0x147f93, shallow: 0x3cc6bd, alphaShallow: 0.5, foam: 0.9, breakW: 12, bandLen: 5.5, bandSpeed: 0.15, cliff: 0.35, caps: 0.18, detail: 0.42,
    waves: [W(-0.3, 1, 52, 0.15), W(0.25, 1, 31, 0.1), W(-0.65, 0.76, 19, 0.06), W(0.8, 0.6, 12, 0.035), W(0, 1, 8, 0.018)] },
};
const NW = 5, DEPTH_MAX = 4.5, DIST_MAX = 48, G = 9.81;

/** Tiled fbm value noise (procedural, RepeatWrapping) for foam breakup. */
function noiseTex(n = 128): THREE.DataTexture {
  let seed = 1234567; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const out = new Uint8Array(n * n * 4), acc = new Float32Array(n * n);
  for (const [cell, w] of [[8, 0.5], [16, 0.28], [32, 0.15], [64, 0.07]] as const) {
    const g = new Float32Array(cell * cell).map(() => rnd());
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const fx = (x / n) * cell, fy = (y / n) * cell, i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
      const a = g[j * cell + i], b = g[j * cell + ((i + 1) % cell)], c = g[((j + 1) % cell) * cell + i], d = g[((j + 1) % cell) * cell + ((i + 1) % cell)];
      acc[y * n + x] += w * ((a * (1 - su) + b * su) * (1 - sv) + (c * (1 - su) + d * su) * sv);
    }
  }
  for (let i = 0; i < n * n; i++) { const v = Math.max(0, Math.min(255, Math.round(acc[i] * 255))); out[i * 4] = v; out[i * 4 + 1] = v; out[i * 4 + 2] = v; out[i * 4 + 3] = 255; }
  for (let i = 0; i < n * n; i++) out[i * 4 + 1] = Math.max(0, Math.min(255, Math.round(acc[(i + n * 37 + 53) % (n * n)] * 255)));
  const t = new THREE.DataTexture(out, n, n, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.needsUpdate = true;
  return t;
}

/** Grid centred on the origin: n x n segments, linear inside +-inner (fraction f of the indices), quadratic out to size/2. */
function oceanGeo(size: number, n: number, inner: number, f: number): THREE.BufferGeometry {
  const half = size / 2, cs: number[] = [];
  for (let i = 0; i <= n; i++) { const u = (i / n) * 2 - 1, a = Math.abs(u); cs.push(Math.sign(u) * (a <= f ? (a / f) * inner : inner + (half - inner) * ((a - f) / (1 - f)) ** 2)); }
  const pos = new Float32Array((n + 1) ** 2 * 3), sp = new Float32Array((n + 1) ** 2), idx: number[] = [];
  const spc = (k: number) => Math.max(cs[Math.min(n, k + 1)] - cs[k], cs[k] - cs[Math.max(0, k - 1)]);
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) { const k = j * (n + 1) + i; pos.set([cs[i], 0, cs[j]], k * 3); sp[k] = Math.max(spc(i), spc(j)); }
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const a = j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSp', new THREE.BufferAttribute(sp, 1)); g.setIndex(idx);
  g.computeBoundingSphere(); if (g.boundingSphere) g.boundingSphere.radius += 2;
  return g;
}

const VERT = /* glsl */`
#include <common>
#include <fog_pars_vertex>
attribute float aSp;
uniform float uTime, uAmp; uniform vec4 uWave[${NW}]; uniform vec4 uWave2[${NW}]; uniform sampler2D uShore; uniform vec4 uMap;
varying vec3 vW; varying vec3 vN; varying float vCrest; varying vec2 vShoreUv;
void main() {
  vec3 p = position; vec4 wp0 = modelMatrix * vec4(p, 1.0);
  vec2 suv = (wp0.xz - uMap.xy) / uMap.zw; vShoreUv = suv;
  float inside = step(0.0, suv.x) * step(suv.x, 1.0) * step(0.0, suv.y) * step(suv.y, 1.0);
  float depth = mix(1.0, texture2D(uShore, clamp(suv, 0.0, 1.0)).r, inside) * ${DEPTH_MAX.toFixed(1)};
  float att = uAmp * (0.08 + 0.92 * smoothstep(0.0, 3.0, depth));
  vec3 d = vec3(0.0); vec3 n = vec3(0.0, 1.0, 0.0); float crest = 0.0, tot = 1e-4;
  for (int i = 0; i < ${NW}; i++) {
    vec4 w = uWave[i]; vec4 w2 = uWave2[i]; // w: dir.xy, k, amp ; w2: speed, q, -, -
    float fade = 1.0 - smoothstep(w2.z * 0.22, w2.z * 0.45, aSp); // drop waves the local grid can't carry
    float a = w.w * att * fade; float f = w.z * (dot(w.xy, wp0.xz) - w2.x * uTime);
    float s = sin(f), c = cos(f);
    d.x += w2.y * a * w.x * c; d.z += w2.y * a * w.y * c; d.y += a * s;
    n.x -= w.x * w.z * a * c; n.z -= w.y * w.z * a * c; n.y -= w2.y * w.z * a * s;
    crest += a * s; tot += w.w * att * fade;
  }
  p += d; vCrest = crest / tot; vN = normalize(n);
  vec4 wp = modelMatrix * vec4(p, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;

const FRAG = /* glsl */`
#include <common>
#include <fog_pars_fragment>
uniform float uTime; uniform sampler2D uNorm, uNoise, uShore; uniform vec3 uDeep, uMid, uShallow, uHor, uZen, uWarm, uSun, uSunCol, uFoamCol;
uniform float uAlphaShallow, uFoam, uBreakW, uBandLen, uBandSpeed, uCliff, uCaps, uDetail;
varying vec3 vW; varying vec3 vN; varying float vCrest; varying vec2 vShoreUv;
void main() {
  float inside = step(0.0, vShoreUv.x) * step(vShoreUv.x, 1.0) * step(0.0, vShoreUv.y) * step(vShoreUv.y, 1.0);
  vec4 sh = texture2D(uShore, clamp(vShoreUv, 0.0, 1.0));
  float depth = mix(1.0, sh.r, inside) * ${DEPTH_MAX.toFixed(1)}, dist = mix(1.0, sh.g, inside) * ${DIST_MAX.toFixed(1)};
  float camD = distance(cameraPosition, vW), lodF = 1.0 / (1.0 + camD / 90.0);
  vec2 uv = vW.xz;
  vec3 n1 = texture2D(uNorm, uv / 9.0 + uTime * vec2(0.021, 0.013)).xyz * 2.0 - 1.0;
#ifndef OCEAN_LOW
  vec3 n2 = texture2D(uNorm, uv / 23.0 - uTime * vec2(0.009, 0.017)).xyz * 2.0 - 1.0; n1 = (n1 + n2) * 0.5;
#endif
  vec3 N = normalize(vN + vec3(n1.x, 0.0, n1.y) * uDetail * lodF);
  vec3 V = normalize(cameraPosition - vW);
  float ndv = max(dot(N, V), 0.0), fres = 0.02 + 0.98 * pow(1.0 - ndv, 5.0);
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  float sd = max(dot(R, uSun), 0.0);
  vec3 sky = mix(uHor, uZen, pow(R.y, 0.55)) + uWarm * pow(sd, 5.0) * 0.75;
  float sh01 = smoothstep(0.2, 4.0, depth);
  vec3 body = mix(uShallow, mix(uMid, uDeep, smoothstep(0.35, 1.0, ndv)), sh01);
  body += uMid * max(vCrest, 0.0) * 0.35 * max(dot(-V, uSun) * 0.5 + 0.5, 0.0); // light through the crests
  vec3 col = mix(body, sky * 0.8, fres * 0.62);
  col += uSunCol * (pow(sd, 900.0) * 30.0 + pow(sd, 90.0) * 1.2 + pow(sd, 14.0) * 0.05);
  // ---- foam
  float nz = texture2D(uNoise, uv / 14.0 + uTime * vec2(0.006, 0.01)).r, nz2 = texture2D(uNoise, uv / 4.5 - uTime * vec2(0.02, 0.006)).g;
  float brk = smoothstep(0.38, 0.75, nz * 0.75 + nz2 * 0.45);
  float zone = 1.0 - smoothstep(1.5, uBreakW, dist);
  float sw = 1.3 + 1.4 * nz + 0.9 * sin(uTime * 0.75 + nz * 5.0); // swash line runs up and back
  float contact = (1.0 - smoothstep(sw * 0.45, sw, dist)) * (0.55 + 0.45 * brk);
  float edge = smoothstep(0.03, 0.14, depth) * (1.0 - smoothstep(0.28, 0.5 + 0.35 * nz + 0.12 * sin(uTime * 0.75 + nz * 5.0), depth)) * (1.0 - smoothstep(3.0, 8.0, dist)) * (0.45 + 0.55 * brk); // visible edge of flat shallows
  float ph = fract(dist / uBandLen + uTime * uBandSpeed + nz * 0.8);
  float band = smoothstep(0.72, 0.96, ph) * (1.0 - smoothstep(0.96, 1.0, ph)) * zone * brk;
  float wash = (1.0 - smoothstep(0.0, 2.5, dist)) * (0.55 + 0.45 * sin(uTime * 1.1 + nz * 9.0)) * smoothstep(0.25, 0.6, nz2);
  float cliff = uCliff * (1.0 - smoothstep(0.5, 7.0, dist)) * smoothstep(0.9, 3.0, depth) * smoothstep(0.3, 0.75, 0.5 + 0.5 * sin(uTime * 0.8 - dist * 0.45 + nz * 7.0)) * (0.5 + 0.5 * brk);
#ifndef OCEAN_LOW
  float caps = uCaps * smoothstep(0.5, 0.95, vCrest) * smoothstep(0.5, 0.78, nz2 * 0.6 + nz * 0.6) * (1.0 + 2.0 * zone);
#else
  float caps = 0.0;
#endif
  float foam = max(max(max(contact, edge) * 0.9, band * 0.9), max(wash * 0.6, max(cliff, caps))) * uFoam * inside;
#ifndef OCEAN_LOW
  float lace = texture2D(uNoise, uv / 1.6 + uTime * vec2(0.03, -0.02)).b; // lacy, streaky foam instead of flat paint
  foam *= 0.35 + 0.85 * smoothstep(0.3, 0.62, lace + foam * 0.25);
#endif
  foam = clamp(foam, 0.0, 1.0);
  col = mix(col, uFoamCol * (0.85 + 0.15 * N.y), foam);
  float alpha = mix(uAlphaShallow, 0.97, smoothstep(0.15, 2.6, depth));
  alpha = max(max(alpha, fres), foam);
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;

export type OceanInfo = { mode: OceanMode; kind: OceanKind; waves: number; amp: number; verts: number; grid: number; fine: number; shoreCells: number; foamCells: number; time: number; near: number };

export class Ocean {
  readonly mesh: THREE.Mesh; readonly mat: THREE.ShaderMaterial; readonly info: OceanInfo;
  private shoreTex: THREE.DataTexture; private distW: Float32Array; private gw: number; private gh: number;
  private preset: (typeof OCEAN_PRESET)[OceanKind]; private sizes: Record<OceanMode, number> = { full: 260, medium: 150, low: 24 };
  constructor(readonly kind: OceanKind, mode: OceanMode, readonly size: number, readonly mapW: number, readonly mapD: number, readonly level: number,
    normal: THREE.Texture, sunDir: THREE.Vector3, war = false, readonly cell = 1.5) {
    const P = (this.preset = OCEAN_PRESET[kind]);
    this.gw = Math.max(2, Math.round(mapW / cell) + 1); this.gh = Math.max(2, Math.round(mapD / cell) + 1);
    this.shoreTex = new THREE.DataTexture(new Uint8Array(this.gw * this.gh * 4).fill(255), this.gw, this.gh, THREE.RGBAFormat);
    this.shoreTex.magFilter = this.shoreTex.minFilter = THREE.LinearFilter; this.shoreTex.needsUpdate = true; this.distW = new Float32Array(this.gw * this.gh);
    const nrm = normal.clone(); nrm.wrapS = nrm.wrapT = THREE.RepeatWrapping; nrm.repeat.set(1, 1); nrm.needsUpdate = true;
    const c = (h: number) => new THREE.Color(h);
    const u: Record<string, THREE.IUniform> = {
      uTime: { value: 0 }, uAmp: { value: 1 }, uShore: { value: this.shoreTex }, uMap: { value: new THREE.Vector4(0, 0, mapW, mapD) },
      uWave: { value: P.waves.map((w) => new THREE.Vector4(w.dx, w.dz, (Math.PI * 2) / w.len, w.amp)) },
      uWave2: { value: P.waves.map((w) => new THREE.Vector4(Math.sqrt(G / ((Math.PI * 2) / w.len)), w.q, w.len, 0)) },
      uNorm: { value: nrm }, uNoise: { value: noiseTex() },
      uDeep: { value: c(P.deep) }, uMid: { value: c(P.mid) }, uShallow: { value: c(P.shallow) },
      uHor: { value: c(war ? 0x9b9387 : 0xdde4df) }, uZen: { value: c(war ? 0x5e646c : 0x5f97cf) }, uWarm: { value: c(war ? 0xe0a060 : 0xffe2b8) },
      uSun: { value: sunDir.clone().normalize() }, uSunCol: { value: c(war ? 0xffb878 : 0xffe6c4) }, uFoamCol: { value: c(0xeef3f2) },
      uAlphaShallow: { value: P.alphaShallow }, uFoam: { value: P.foam }, uBreakW: { value: P.breakW }, uBandLen: { value: P.bandLen }, uBandSpeed: { value: P.bandSpeed },
      uCliff: { value: P.cliff }, uCaps: { value: P.caps }, uDetail: { value: P.detail },
    };
    this.mat = new THREE.ShaderMaterial({ uniforms: { ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog), ...u }, vertexShader: VERT, fragmentShader: FRAG, fog: true, transparent: true });
    this.mesh = new THREE.Mesh(oceanGeo(size, this.sizes[mode], Math.max(mapW, mapD) * 0.5 + 45, 0.75), this.mat);
    this.mesh.position.set(mapW / 2, level, mapD / 2); this.mesh.name = 'sea'; this.mesh.userData.ocean = true; this.mesh.frustumCulled = false;
    this.info = { mode, kind, waves: 0, amp: 0, verts: 0, grid: 0, fine: 0, shoreCells: 0, foamCells: 0, time: 0, near: 0 };
    this.setMode(mode, true);
  }
  /** Switch quality: low = coarse grid, no vertex waves, single normal sample, no crest caps. */
  setMode(mode: OceanMode, first = false) {
    if (!first && mode === this.info.mode) return;
    if (!first) { const old = this.mesh.geometry; this.mesh.geometry = oceanGeo(this.size, this.sizes[mode], Math.max(this.mapW, this.mapD) * 0.5 + 45, 0.75); old.dispose(); }
    const low = mode === 'low';
    this.mat.defines = low ? { OCEAN_LOW: 1 } : {}; this.mat.needsUpdate = true;
    this.mat.uniforms.uAmp.value = low ? 0 : 1;
    this.info.mode = mode; this.info.grid = this.sizes[mode]; this.info.verts = this.mesh.geometry.attributes.position.count;
    this.info.waves = low ? 0 : this.preset.waves.length; this.info.amp = low ? 0 : +this.preset.waves.reduce((s, w) => s + w.amp, 0).toFixed(3);
  }
  /** Rebuild the depth / distance-to-land texture from a ground sampler (metres in, metres out). */
  setShore(ground: (xm: number, zm: number) => number, fine = false) {
    const { gw, gh, cell } = this, n = gw * gh, depth = new Float32Array(n), dL = new Float32Array(n), dW = this.distW, BIG = 1e6;
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const k = j * gw + i, d = this.level - ground(Math.min(this.mapW, i * cell), Math.min(this.mapD, j * cell)); depth[k] = d; dL[k] = d <= 0 ? 0 : BIG; dW[k] = d > 0 ? 0 : BIG; }
    chamfer(dL, gw, gh, cell); chamfer(dW, gw, gh, cell);
    const px = this.shoreTex.image.data as Uint8Array; let shore = 0, foam = 0;
    for (let k = 0; k < n; k++) {
      px[k * 4] = Math.round(Math.max(0, Math.min(1, depth[k] / DEPTH_MAX)) * 255); px[k * 4 + 1] = Math.round(Math.min(1, dL[k] / DIST_MAX) * 255); px[k * 4 + 2] = 0; px[k * 4 + 3] = 255;
      if (depth[k] > 0 && dL[k] <= cell * 1.5) shore++;
      if (depth[k] > 0 && dL[k] < this.preset.breakW) foam++;
    }
    this.shoreTex.needsUpdate = true; this.info.shoreCells = shore; this.info.foamCells = foam; this.info.fine = fine ? 1 : 0;
  }
  /** Metres from (x, z) to the nearest open water (0 over water / off the map). */
  waterDist(x: number, z: number): number {
    if (x < 0 || z < 0 || x > this.mapW || z > this.mapD) return 0;
    return this.distW[Math.round(z / this.cell) * this.gw + Math.round(x / this.cell)] ?? 0;
  }
  /** CPU mirror of the vertex swell (deep water, full grid) — sea surface height at world (x, z) now. */
  heightAt(x: number, z: number): number {
    if (this.info.mode === 'low') return this.level;
    let y = this.level; const t = this.mat.uniforms.uTime.value as number;
    for (const w of this.preset.waves) { const k = (Math.PI * 2) / w.len; y += w.amp * Math.sin(k * (w.dx * x + w.dz * z - Math.sqrt(G / k) * t)); }
    return y;
  }
  update(dt: number) { this.mat.uniforms.uTime.value += dt; this.info.time = +(this.mat.uniforms.uTime.value as number).toFixed(2); }
  dispose() { this.mesh.geometry.dispose(); this.mat.dispose(); this.shoreTex.dispose(); (this.mat.uniforms.uNoise.value as THREE.Texture).dispose(); (this.mat.uniforms.uNorm.value as THREE.Texture).dispose(); }
}

/** Two-pass 3x3 chamfer distance transform in place (0 = source cells). */
function chamfer(d: Float32Array, w: number, h: number, c: number) {
  const dg = c * Math.SQRT2;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i; let v = d[k];
    if (i > 0) v = Math.min(v, d[k - 1] + c);
    if (j > 0) { v = Math.min(v, d[k - w] + c); if (i > 0) v = Math.min(v, d[k - w - 1] + dg); if (i < w - 1) v = Math.min(v, d[k - w + 1] + dg); }
    d[k] = v;
  }
  for (let j = h - 1; j >= 0; j--) for (let i = w - 1; i >= 0; i--) {
    const k = j * w + i; let v = d[k];
    if (i < w - 1) v = Math.min(v, d[k + 1] + c);
    if (j < h - 1) { v = Math.min(v, d[k + w] + c); if (i < w - 1) v = Math.min(v, d[k + w + 1] + dg); if (i > 0) v = Math.min(v, d[k + w - 1] + dg); }
    d[k] = v;
  }
}
