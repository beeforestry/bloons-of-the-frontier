// t80: El Morro (Castillo San Felipe del Morro, San Juan) as a real 3D fortress in first person.
// The walls are NOT a third-party model: they are extruded from the same public-domain data the map already uses —
// the USGS 3DEP 1 m lidar (sharpened so wall faces are ~vertical, parapets + gun embrasures cut every ~5.5 m) on a 0.5 m
// grid, with the NOAA 2017 aerial (CC0) on the decks / lawns and weathered ochre plaster (Poly Haven CC0 + procedural
// mould streaks) on the wall faces. Built by art_src/tools/morro_fort3d.py -> public/assets/maps/morro/fort3d.dat.
// Look references (HABS PR-48 drawings/photos, Wikimedia ground photos): garitas (round domed sentry boxes on corbels at the
// bastion salients), the yellow Plaza de Armas with white arches, the grey/black lighthouse, the three flags over the plaza.
import * as THREE from 'three';
import { assetUrl } from '../assetUrl';

/** Fort window on the 4416 x 2976 morro map (game px of sample (0,0), px per sample). Mirrors morro_fort3d.py. */
export const FORT = { x0: 1682, y0: 642, step: 4, cols: 540, rows: 500, off: -5 };
export interface FortGrid { h: Float32Array; cls: Uint8Array }
/** Plaza de Armas outline (game px) — the long sunken court with the well, traced on the aerial. */
export const PLAZA: [number, number][] = [[2477, 1305], [2520, 1300], [2560, 1420], [2655, 1560], [2560, 1915], [2477, 1905]];
/** Garitas: the 4 garrisonable ones (map envs) + three more at real bastion salients seen on the aerial / HABS site plan. */
export const EXTRA_GARITAS: [number, number][] = [[2292, 2428], [3655, 1700], [2700, 1150]];
export const LIGHTHOUSE: [number, number] = [2300, 1980];
export const FLAGS: [number, number, string][] = [[2425, 1360, 'us'], [2425, 1420, 'pr'], [2425, 1480, 'burgundy']];

let gridP: Promise<FortGrid> | null = null;
export function loadFort(): Promise<FortGrid> {
  return (gridP ??= fetch(assetUrl('assets/maps/morro/fort3d.dat')).then((r) => { if (!r.ok) throw new Error('fort3d ' + r.status); return r.arrayBuffer(); }).then(async (raw) => {
    const b = new Uint8Array(raw), gz = b[0] === 0x1f && b[1] === 0x8b; // gzip (unless a server already decoded it)
    const buf = gz ? await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer() : raw;
    const n = FORT.cols * FORT.rows, q = new Uint16Array(buf, 0, n), h = new Float32Array(n);
    for (let i = 0; i < n; i++) h[i] = q[i] / 100 + FORT.off;
    return { h, cls: new Uint8Array(buf, n * 2, n) };
  }));
}
/** Fine (0.5 m) height at map px, or null outside the fort window. */
export function fortH(f: FortGrid, x: number, y: number): number | null {
  const fx = (x - FORT.x0) / FORT.step, fy = (y - FORT.y0) / FORT.step;
  if (fx < 0 || fy < 0 || fx > FORT.cols - 1.001 || fy > FORT.rows - 1.001) return null;
  const i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, c = FORT.cols, h = f.h;
  return (h[j * c + i] * (1 - u) + h[j * c + i + 1] * u) * (1 - v) + (h[(j + 1) * c + i] * (1 - u) + h[(j + 1) * c + i + 1] * u) * v;
}
/** Highest fine height within r px (garita / flag seating on the parapet). */
function maxNear(f: FortGrid, x: number, y: number, r: number) {
  let best = -99, bx = x, by = y;
  for (let dy = -r; dy <= r; dy += 2) for (let dx = -r; dx <= r; dx += 2) { const h = fortH(f, x + dx, y + dy); if (h != null && h > best) { best = h; bx = x + dx; by = y + dy; } }
  return { h: best, x: bx, y: by };
}

// ---------------------------------------------------------------- textures (procedural, original)
function canvas(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat = true) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
/** Weathering overlay tile (R = mould streak darkness, G = exposed-stone mask, B = mottling), tiled 6 m x 6 m on the walls. */
export function grimeTex() {
  return canvas(256, 256, (c) => {
    const img = c.createImageData(256, 256), d = img.data; let s = 9;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const cols = Array.from({ length: 256 }, () => 0); // vertical streak strength per column
    for (let k = 0; k < 46; k++) { const x = Math.floor(rnd() * 256), w = 1 + Math.floor(rnd() * 7), a = 0.25 + rnd() * 0.75; for (let i = -w; i <= w; i++) cols[(x + i + 256) % 256] = Math.max(cols[(x + i + 256) % 256], a * (1 - Math.abs(i) / (w + 1))); }
    const blobs = Array.from({ length: 22 }, () => [rnd() * 256, rnd() * 256, 10 + rnd() * 34]);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const p = (y * 256 + x) * 4, fade = 0.55 + 0.45 * Math.sin((y / 256) * Math.PI * 2 + cols[x] * 3);
      let st = 0; for (const [bx, by, br] of blobs) { const dx = Math.min(Math.abs(x - bx), 256 - Math.abs(x - bx)), dy = Math.min(Math.abs(y - by), 256 - Math.abs(y - by)); st = Math.max(st, 1 - Math.hypot(dx, dy * 1.4) / br); }
      d[p] = Math.min(255, cols[x] * fade * 255); d[p + 1] = Math.min(255, Math.max(0, st * 2 - 0.35) * 255); d[p + 2] = 128 + (rnd() - 0.5) * 60; d[p + 3] = 255;
    }
    c.putImageData(img, 0, 0);
  });
}
/** One arcade bay of the Plaza de Armas (yellow plaster, white pilasters + archivolt, dark vaulted doorway). 4.5 m x 7 m. */
function arcadeTex() {
  return canvas(256, 400, (c) => {
    c.fillStyle = '#e2ad3e'; c.fillRect(0, 0, 256, 400);
    const g = c.createLinearGradient(0, 0, 0, 400); g.addColorStop(0, 'rgba(255,240,200,0.12)'); g.addColorStop(1, 'rgba(80,50,10,0.18)'); c.fillStyle = g; c.fillRect(0, 0, 256, 400);
    c.fillStyle = '#f4efe2'; c.fillRect(0, 18, 256, 16); c.fillRect(0, 0, 256, 6); // cornice + string course
    c.fillRect(0, 34, 26, 366); c.fillRect(230, 34, 26, 366);                     // pilasters
    c.fillRect(0, 384, 256, 16);                                                  // plinth
    const ax = 128, top = 150, w = 78;
    c.beginPath(); c.moveTo(ax - w - 14, 400); c.lineTo(ax - w - 14, top); c.arc(ax, top, w + 14, Math.PI, 0); c.lineTo(ax + w + 14, 400); c.closePath(); c.fill(); // white archivolt
    const dg = c.createLinearGradient(0, top - w, 0, 400); dg.addColorStop(0, '#1d1814'); dg.addColorStop(0.5, '#2c241d'); dg.addColorStop(1, '#3a3027');
    c.fillStyle = dg; c.beginPath(); c.moveTo(ax - w, 400); c.lineTo(ax - w, top); c.arc(ax, top, w, Math.PI, 0); c.lineTo(ax + w, 400); c.closePath(); c.fill();
    c.fillStyle = 'rgba(240,235,220,0.18)'; c.beginPath(); c.arc(ax, top + 40, w * 0.8, Math.PI, 0); c.fill(); // whitewashed vault glimpsed inside
    c.fillStyle = '#5a3a22'; c.fillRect(ax - 34, 250, 68, 134); c.fillStyle = '#3d2716'; for (let i = 0; i < 5; i++) c.fillRect(ax - 32 + i * 14, 252, 3, 130); // wooden door
  });
}
function flagTex(kind: string) {
  return canvas(192, 120, (c) => {
    if (kind === 'pr') {
      for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#e8262f'; c.fillRect(0, i * 24, 192, 24); }
      c.fillStyle = '#2a64b4'; c.beginPath(); c.moveTo(0, 0); c.lineTo(104, 60); c.lineTo(0, 120); c.closePath(); c.fill();
      c.fillStyle = '#fff'; star(c, 34, 60, 16);
    } else if (kind === 'us') {
      for (let i = 0; i < 13; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#c8242f'; c.fillRect(0, (i * 120) / 13, 192, 120 / 13 + 1); }
      c.fillStyle = '#25336e'; c.fillRect(0, 0, 80, 65); c.fillStyle = '#fff'; for (let y = 0; y < 5; y++) for (let x = 0; x < 6; x++) c.fillRect(6 + x * 12 + (y % 2) * 6, 6 + y * 12, 3, 3);
    } else { // Cross of Burgundy (the Spanish garrison flag flown at El Morro)
      c.fillStyle = '#f6f2e6'; c.fillRect(0, 0, 192, 120); c.strokeStyle = '#c0242c'; c.lineWidth = 16; c.lineCap = 'round';
      c.beginPath(); c.moveTo(30, 12); c.lineTo(162, 108); c.moveTo(162, 12); c.lineTo(30, 108); c.stroke();
    }
  }, false);
}
function star(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.42 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill();
}

// ---------------------------------------------------------------- fort mesh
/**
 * The fort heightfield mesh. `ground` = the aerial photo already used for the lidar terrain (same UVs: map px / map size).
 * `step` = samples per vertex (1 = 0.5 m, 2 = 1 m). Wall faces get ochre plaster + mould streaks; decks/lawns keep the photo.
 */
export function fortMesh(f: FortGrid, ground: THREE.Texture, S: number, mapW: number, mapH: number, step: number, base: THREE.MeshLambertMaterial, fl?: Uint8Array): THREE.Group {
  const cols = Math.floor((FORT.cols - 1) / step) + 1, rows = Math.floor((FORT.rows - 1) / step) + 1;
  const pos = new Float32Array(cols * rows * 3), uv = new Float32Array(cols * rows * 2), cls = new Float32Array(cols * rows), flo = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = Math.min(FORT.cols - 1, c * step), j = Math.min(FORT.rows - 1, r * step), k = r * cols + c, s = j * FORT.cols + i;
    const px = FORT.x0 + i * FORT.step, py = FORT.y0 + j * FORT.step;
    // window border sinks 1.5 m (a skirt under the lidar terrain that surrounds it -> no cracks at the seam)
    const edge = r === 0 || c === 0 || r === rows - 1 || c === cols - 1;
    pos[k * 3] = px * S; pos[k * 3 + 1] = f.h[s] - (edge ? 1.5 : 0); pos[k * 3 + 2] = py * S;
    uv[k * 2] = px / mapW; uv[k * 2 + 1] = 1 - py / mapH; cls[k] = f.cls[s]; flo[k] = fl ? fl[s] : 0;
  }
  // smooth normals over the whole grid (central differences), so chunk seams light identically
  const nrm = new Float32Array(cols * rows * 3), d = FORT.step * step * S;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const H = (cc: number, rr: number) => pos[(Math.max(0, Math.min(rows - 1, rr)) * cols + Math.max(0, Math.min(cols - 1, cc))) * 3 + 1];
    const nx = (H(c - 1, r) - H(c + 1, r)) / (2 * d), nz = (H(c, r - 1) - H(c, r + 1)) / (2 * d), L = Math.hypot(nx, 1, nz), k = (r * cols + c) * 3;
    nrm[k] = nx / L; nrm[k + 1] = 1 / L; nrm[k + 2] = nz / L;
  }
  const mat = fortMaterial(base, ground);
  // 64-vertex chunks: frustum culling (camera AND the tight sun-shadow box) skips most of the fort every frame
  const CH = 64, grp = new THREE.Group(); grp.name = 'fort3d'; let tris = 0;
  for (let r0 = 0; r0 < rows - 1; r0 += CH - 1) for (let c0 = 0; c0 < cols - 1; c0 += CH - 1) {
    const rN = Math.min(CH, rows - r0), cN = Math.min(CH, cols - c0);
    const P = new Float32Array(rN * cN * 3), N = new Float32Array(rN * cN * 3), U = new Float32Array(rN * cN * 2), C = new Float32Array(rN * cN), F = new Float32Array(rN * cN);
    for (let r = 0; r < rN; r++) for (let c = 0; c < cN; c++) {
      const src = (r0 + r) * cols + (c0 + c), dst = r * cN + c;
      P.set(pos.subarray(src * 3, src * 3 + 3), dst * 3); N.set(nrm.subarray(src * 3, src * 3 + 3), dst * 3); U.set(uv.subarray(src * 2, src * 2 + 2), dst * 2); C[dst] = cls[src]; F[dst] = flo[src];
    }
    const idx = new Uint16Array((rN - 1) * (cN - 1) * 6); let n = 0;
    for (let r = 0; r < rN - 1; r++) for (let c = 0; c < cN - 1; c++) {
      const a = r * cN + c, b = a + 1, e = a + cN, g = e + 1;
      // split each quad along the diagonal with the smaller height jump (keeps wall tops straight)
      if (Math.abs(P[a * 3 + 1] - P[g * 3 + 1]) <= Math.abs(P[b * 3 + 1] - P[e * 3 + 1])) idx.set([a, e, g, a, g, b], n); else idx.set([a, e, b, b, e, g], n);
      n += 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(N, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(U, 2)); geo.setAttribute('aCls', new THREE.BufferAttribute(C, 1)); geo.setAttribute('aFl', new THREE.BufferAttribute(F, 1));
    geo.setIndex(new THREE.BufferAttribute(idx, 1)); geo.computeBoundingSphere(); geo.computeBoundingBox();
    const m = new THREE.Mesh(geo, mat); m.receiveShadow = true; m.castShadow = true; m.name = 'fort3d_chunk'; grp.add(m); tris += idx.length / 3;
  }
  grp.userData.verts = cols * rows; grp.userData.tris = tris; grp.userData.chunks = grp.children.length;
  return grp;
}
/** Lidar-terrain detail material + the t80 wall-face shader (triplanar ochre plaster, exposed rubble stone, mould streaks, courses). */
function fortMaterial(mat: THREE.MeshLambertMaterial, ground: THREE.Texture) {
  mat.map = ground;
  const L = new THREE.TextureLoader(), pl = L.load(assetUrl('assets/tex/plaster.webp')), pr = L.load(assetUrl('assets/tex/lh_rock.webp'));
  // t93: floors — Poly Haven CC0 red laterite soil (plazas / lower court / garita walks) and dirty concrete (pale gun decks)
  const te = L.load(assetUrl('assets/tex/mr_earth.webp')), td = L.load(assetUrl('assets/tex/mr_deck.webp'));
  for (const t of [pl, pr, te, td]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; }
  const grime = grimeTex(); grime.colorSpace = THREE.NoColorSpace;
  const prev = mat.onBeforeCompile.bind(mat), prevKey = mat.customProgramCacheKey.bind(mat);
  mat.onBeforeCompile = (sh, r) => {
    prev(sh, r);
    sh.uniforms.t_pl = { value: pl }; sh.uniforms.t_st = { value: pr }; sh.uniforms.t_gr = { value: grime }; sh.uniforms.t_ea = { value: te }; sh.uniforms.t_dk = { value: td };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aCls; attribute float aFl; varying float vCls; varying float vFl; varying vec3 vFN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCls = aCls; vFl = aFl; vFN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vCls; varying float vFl; varying vec3 vFN; uniform sampler2D t_pl; uniform sampler2D t_st; uniform sampler2D t_gr; uniform sampler2D t_ea; uniform sampler2D t_dk;\n' + WALL_GLSL)
      .replace('diffuseColor.rgb *= mix(vec3(1.0), det, 0.9);\n}', `diffuseColor.rgb *= mix(vec3(1.0), det, 0.9);
}
{
  // t80: wall faces of the fort -> weathered ochre plaster / rubble stone with black mould streaks (El Morro ground photos)
  float wall = smoothstep(0.66, 0.36, vFN.y) * smoothstep(0.2, 0.8, vCls);
  if (wall > 0.001) {
    vec3 n = normalize(vFN); vec2 w = abs(n.xz) + 0.001; w /= (w.x + w.y);
    vec3 c = wallCol(vec2(vGW.z, vGW.y)) * w.x + wallCol(vec2(vGW.x, vGW.y)) * w.y;
    c *= 0.8 + 0.2 * smoothstep(-2.0, 6.0, vGW.y);           // damp, darker foot of the wall
    diffuseColor.rgb = mix(diffuseColor.rgb, c, wall);
  }
  // t93: floors (flat faces only). 1 = reddish packed earth / aggregate (Plaza de Armas, lower court, garita walks),
  // 2 = pale worn lime-concrete gun deck (terreplein); the aerial keeps the large-scale stains on the decks.
  float flt93 = smoothstep(0.72, 0.9, vFN.y);
  float bg93 = texture2D(t_gr, vGW.xz / 23.0 + 0.11).b;
  if (vFl > 0.5 && vFl < 1.5 && flt93 > 0.0) {
    vec3 tx = texture2D(t_ea, vGW.xz / 2.7).rgb; float tl = dot(tx, vec3(0.2126, 0.7152, 0.0722)) / 0.0655;
    vec3 e = vec3(0.46, 0.22, 0.13) * mix(vec3(1.0), clamp(tx / vec3(0.1306, 0.0499, 0.0279), 0.3, 3.0), 0.25) * mix(1.0, clamp(tl, 0.2, 2.5), 0.75) * (0.82 + 0.36 * bg93);
    e = mix(e, e * vec3(1.12, 1.02, 0.9), smoothstep(0.55, 0.8, texture2D(t_gr, vGW.xz / 9.0).b));  // paler trodden patches
    diffuseColor.rgb = mix(diffuseColor.rgb, e, flt93 * 0.94);
  } else if (vFl > 1.5 && flt93 > 0.0) {
    vec3 a = diffuseColor.rgb; float al = dot(a, vec3(0.2126, 0.7152, 0.0722));
    vec3 d = texture2D(t_dk, vGW.xz / 3.6).rgb * vec3(1.0, 0.95, 0.86) * clamp(0.62 + al * 1.6, 0.55, 1.2) * (0.88 + 0.2 * bg93);
    diffuseColor.rgb = mix(a, d, flt93 * 0.78);
  }
}`);
  };
  mat.customProgramCacheKey = () => prevKey() + '|fort93';
  mat.needsUpdate = true;
  return mat;
}
const WALL_GLSL = `
vec3 wallCol(vec2 p) {
  vec3 pl = texture2D(t_pl, p / 2.4).rgb, st = texture2D(t_st, p / 2.8).rgb;
  vec4 gm = texture2D(t_gr, p / vec2(7.0, 9.0)); float big = texture2D(t_gr, p / 31.0 + 0.37).b;
  float pll = dot(pl, vec3(0.2126, 0.7152, 0.0722)), stl = dot(st, vec3(0.2126, 0.7152, 0.0722));
  vec3 ochre = vec3(0.46, 0.34, 0.18) * (0.7 + pll * 1.2) * (0.8 + big * 0.35);           // lime plaster, ochre wash
  float course = smoothstep(0.0, 0.07, fract(p.y / 0.46)) * smoothstep(1.0, 0.93, fract(p.y / 0.46));
  float joint = smoothstep(0.0, 0.05, fract(p.x / 0.9 + floor(p.y / 0.46) * 0.5));
  vec3 stone = vec3(0.34, 0.31, 0.26) * (0.55 + stl * 2.2) * mix(0.62, 1.0, course * joint); // rubble / ashlar where plaster fell off
  float bare = clamp(gm.g * 1.3 + (0.55 - big) * 0.9, 0.0, 1.0);
  vec3 c = mix(ochre, stone, clamp(bare * 0.95 + 0.12, 0.0, 1.0));
  return c * (1.0 - gm.r * 0.82) * (0.86 + 0.14 * big);                                                           // vertical black mould streaks
}`;

// ---------------------------------------------------------------- set pieces
const plasterMat = () => new THREE.MeshStandardMaterial({ color: 0xd9a24a, roughness: 0.95, metalness: 0 });
/** A garita: round sentry box on a stepped corbel, domed top with a finial, three slit windows, door toward the rampart. */
export function garita(): THREE.Group {
  const g = new THREE.Group(), m = plasterMat(), dark = new THREE.MeshBasicMaterial({ color: 0x17130e }), trim = new THREE.MeshStandardMaterial({ color: 0xe9dcc0, roughness: 0.9 });
  const corbel = new THREE.LatheGeometry([new THREE.Vector2(0.05, -1.7), new THREE.Vector2(0.35, -1.55), new THREE.Vector2(0.62, -1.15), new THREE.Vector2(0.82, -0.6), new THREE.Vector2(0.98, -0.1), new THREE.Vector2(1.02, 0)], 18);
  const body = new THREE.CylinderGeometry(0.9, 0.95, 2.3, 18), ring = new THREE.CylinderGeometry(1.05, 1.05, 0.14, 18);
  const dome = new THREE.SphereGeometry(0.98, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, y: number, sy = 1) => { const o = new THREE.Mesh(geo, mat); o.position.y = y; o.scale.y = sy; o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  add(corbel, m, 0); add(ring, trim, 0.05); add(body, m, 1.2); add(ring, trim, 2.38); add(dome, m, 2.42, 0.8);
  add(new THREE.CylinderGeometry(0.06, 0.12, 0.45, 8), trim, 3.4); add(new THREE.SphereGeometry(0.11, 8, 6), trim, 3.66);
  for (const a of [-1.2, 0, 1.2]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.06), dark); s.position.set(Math.sin(a) * 0.93, 1.6, Math.cos(a) * 0.93); s.rotation.y = a; g.add(s); }
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.5), dark); door.position.set(0, 0.85, -0.955); door.rotation.y = Math.PI; g.add(door);
  g.userData.garita = true; return g;
}
/** El Morro's lighthouse (1908 tower): square tapering tower, pale grey with white corner pilasters, black gallery + lantern. */
export function lighthouse(): THREE.Group {
  const g = new THREE.Group(), body = new THREE.MeshStandardMaterial({ color: 0xc9c5ba, roughness: 0.9 }), white = new THREE.MeshStandardMaterial({ color: 0xf1eee6, roughness: 0.85 });
  const black = new THREE.MeshStandardMaterial({ color: 0x1b1d1f, roughness: 0.5, metalness: 0.4 }), glass = new THREE.MeshStandardMaterial({ color: 0xfff1b8, emissive: 0xffd77a, emissiveIntensity: 0.6, roughness: 0.2 });
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
  add(new THREE.BoxGeometry(5.6, 3.2, 5.6), body, 0, 1.6, 0);                      // keeper's base
  add(new THREE.BoxGeometry(5.9, 0.3, 5.9), white, 0, 3.3, 0);
  add(new THREE.CylinderGeometry(1.75, 2.25, 10, 4, 1).rotateY(Math.PI / 4), body, 0, 8.4, 0); // tapering square shaft
  for (const [x, z] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) add(new THREE.BoxGeometry(0.35, 10, 0.35), white, x * 1.45, 8.4, z * 1.45);
  for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.45, 0.9, 0.08), black, 0, 5.5 + i * 2.8, 2.02 - i * 0.1);   // windows
  add(new THREE.BoxGeometry(4.2, 0.35, 4.2), white, 0, 13.55, 0);                   // cornice
  add(new THREE.CylinderGeometry(2.2, 2.2, 0.18, 16), black, 0, 13.85, 0);         // gallery deck
  add(new THREE.CylinderGeometry(2.15, 2.15, 0.9, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x1b1d1f, wireframe: true }), 0, 14.4, 0); // railing
  add(new THREE.CylinderGeometry(1.0, 1.0, 1.7, 8), glass, 0, 14.8, 0);            // lantern glass
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; add(new THREE.BoxGeometry(0.07, 1.7, 0.07), black, Math.cos(a) * 1.02, 14.8, Math.sin(a) * 1.02); }
  add(new THREE.ConeGeometry(1.2, 0.9, 8), black, 0, 16.1, 0); add(new THREE.SphereGeometry(0.16, 8, 6), black, 0, 16.6, 0);
  g.userData.lighthouse = true; return g;
}
function flagpole(kind: string, t: number): THREE.Group {
  const g = new THREE.Group(), pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 11, 8), new THREE.MeshStandardMaterial({ color: 0xdedbd3, roughness: 0.6, metalness: 0.3 }));
  pole.position.y = 5.5; pole.castShadow = true; g.add(pole);
  const geo = new THREE.PlaneGeometry(2.4, 1.5, 12, 1); geo.translate(1.2, 0, 0);
  const flag = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: flagTex(kind), side: THREE.DoubleSide, roughness: 0.9 }));
  flag.position.y = 10.1; flag.userData.wave = t; g.add(flag); g.userData.flag = flag; return g;
}

export interface MorroSet { group: THREE.Group; garitas: number; arcades: number; update(dt: number): void }
/** A garita seat: salient tip (map px), outward unit dir, parapet top + the gun deck behind it (m). */
export interface GaritaSpot { x: number; y: number; ca: number; sa: number; top: number; deck: number }
/** t80 placement (salient tip, facing downhill/out) + t93 the gun-deck level behind it, for the walk-in approach. */
export function garitaSpots(f: FortGrid, envs: [number, number][]): GaritaSpot[] {
  const out: GaritaSpot[] = [];
  for (const [x, y] of [...envs, ...EXTRA_GARITAS]) {
    const top = maxNear(f, x, y, 90); if (top.h < -50) continue;
    // face outward = downhill from the salient; then walk out to the parapet edge (where the wall face drops away)
    let gx = 0, gy = 0; for (let a = 0; a < 24; a++) { const ca = Math.cos(a / 24 * Math.PI * 2), sa = Math.sin(a / 24 * Math.PI * 2), h = fortH(f, top.x + ca * 80, top.y + sa * 80); if (h != null) { gx -= ca * (h - top.h); gy -= sa * (h - top.h); } }
    const ang = Math.atan2(gy, gx), ca = Math.cos(ang), sa = Math.sin(ang);
    let ex = top.x, ey = top.y, deck = top.h;
    for (let d = 0; d < 120; d += 2) { const h = fortH(f, top.x + ca * d, top.y + sa * d); if (h == null || h < top.h - 2.5) break; ex = top.x + ca * d; ey = top.y + sa * d; deck = Math.max(deck - 0.05, h); }
    // gun deck behind the salient (median 5-9 m inward), never more than 2.2 m under the parapet top
    const hs: number[] = []; for (let d = 40; d <= 72; d += 4) { const h = fortH(f, ex - ca * d, ey - sa * d); if (h != null) hs.push(h); }
    hs.sort((p, q) => p - q); const inner = hs.length ? hs[hs.length >> 1] : deck;
    out.push({ x: ex + ca * 4, y: ey + sa * 4, ca, sa, top: deck, deck: Math.min(deck, Math.max(inner, deck - 2.2)) });
  }
  return out;
}
/** Garitas, lighthouse, plaza arcade facades and flags, all seated on the fine heights. envs = the map's garrisonable garitas.
 *  t93: with `t93` the garitas / arcades / plaza floor come from morro93 instead (weathered walk-in garitas, 3D arcade). */
export function morroSet(f: FortGrid, S: number, envs: [number, number][], t93 = false): MorroSet {
  const group = new THREE.Group(); group.name = 'morro_set';
  let garitas = 0;
  if (!t93) for (const sp of garitaSpots(f, envs)) {
    const o = garita();
    o.position.set(sp.x * S, sp.top + 0.1, sp.y * S);
    o.rotation.y = Math.atan2(sp.ca, sp.sa); group.add(o); garitas++;
  }
  // lighthouse on the upper level
  { const b = maxNear(f, LIGHTHOUSE[0], LIGHTHOUSE[1], 12), lh = lighthouse(); lh.position.set(LIGHTHOUSE[0] * S, b.h - 0.3, LIGHTHOUSE[1] * S); lh.rotation.y = 0.21; group.add(lh); }
  // Plaza de Armas: yellow arcade facades on the inside of every plaza wall, floor to the deck above
  const tex = arcadeTex(); let arcades = 0;
  if (!t93) {
  const cx = PLAZA.reduce((s, p) => s + p[0], 0) / PLAZA.length, cy = PLAZA.reduce((s, p) => s + p[1], 0) / PLAZA.length;
  const floor = fortH(f, cx, cy) ?? 0;
  for (let i = 0; i < PLAZA.length; i++) {
    const [ax, ay] = PLAZA[i], [bx, by] = PLAZA[(i + 1) % PLAZA.length];
    const len = Math.hypot(bx - ax, by - ay) * S; if (len < 3) continue;
    // deck height just outside this edge (median of a few probes)
    const nx = (by - ay), ny = -(bx - ax), nl = Math.hypot(nx, ny), ox = nx / nl, oy = ny / nl;
    const sgn = ((cx - ax) * ox + (cy - ay) * oy) > 0 ? -1 : 1; // outward normal
    const hs: number[] = []; for (let k = 1; k < 6; k++) { const t = k / 6, h = fortH(f, ax + (bx - ax) * t + ox * sgn * 40, ay + (by - ay) * t + oy * sgn * 40); if (h != null) hs.push(h); }
    hs.sort((p, q) => p - q); const deck = hs.length ? hs[hs.length >> 1] : floor + 6;
    const H = Math.max(4.5, Math.min(11, deck - floor + 0.4));
    const t = tex.clone(); t.needsUpdate = true; t.repeat.set(Math.max(1, Math.round(len / 4.5)), 1);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(len, H), new THREE.MeshStandardMaterial({ map: t, roughness: 0.92 }));
    const mx = (ax + bx) / 2 + ox * sgn * -5, my = (ay + by) / 2 + oy * sgn * -5; // 0.6 m in front of the lidar wall face
    pl.position.set(mx * S, floor - 0.2 + H / 2, my * S);
    pl.rotation.y = Math.atan2(-(ox * -sgn), -(oy * -sgn)) + Math.PI; // face into the plaza
    pl.receiveShadow = true; pl.userData.arcade = true; group.add(pl); arcades++;
  }
  // flat paved floor + the well in the middle
  { const shape = new THREE.Shape(PLAZA.map(([x, y]) => new THREE.Vector2(x * S, y * S))); const geo = new THREE.ShapeGeometry(shape).rotateX(Math.PI / 2);
    const fl = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x9c8b72, roughness: 1, side: THREE.DoubleSide })); fl.position.y = floor + 0.05; fl.receiveShadow = true; fl.name = 'plaza_floor'; group.add(fl);
    const well = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0xe6dccb, roughness: 0.9 })); well.position.set(2508 * S, floor + 0.45, 1645 * S); well.castShadow = true; group.add(well); }
  }
  const flags: THREE.Mesh[] = [];
  FLAGS.forEach(([x, y, k], i) => { const b = maxNear(f, x, y, 10), p = flagpole(k, i * 1.3); p.position.set(b.x * S, b.h, b.y * S); group.add(p); flags.push(p.userData.flag as THREE.Mesh); });
  let time = 0;
  const update = (dt: number) => {
    time += dt;
    for (const fl of flags) { const pos = (fl.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i); pos.setZ(i, Math.sin(x * 2.2 - time * 5 + (fl.userData.wave as number)) * 0.12 * (x / 2.4)); } pos.needsUpdate = true; }
  };
  return { group, garitas, arcades, update };
}
