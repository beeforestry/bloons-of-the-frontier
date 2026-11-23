// Cliff spray (autopilot 2026-11-23): white water thrown up where the swell hits El Morro's cliffs / sea walls
// and (smaller) the Isla de Cabras riprap, in first person.
// - Sites come from the ocean's shore pass (Ocean.setShore): water cells right against land that rises steeply
//   above sea level, with a seaward normal (gradient of the distance-to-land field) and a strength from the rise.
// - Bursts are timed by the same CPU swell mirror the ocean uses (Ocean.heightAt): when a crest climbs past a
//   per-site threshold at a nearby site, that site throws a fan of droplets + a slower, larger mist puff.
//   Every ambience breaker crash (Sfx) also throws one big burst at a strong cliff site in front of the eye,
//   so the sound and the white water line up.
// - One pooled THREE.Points draw call (soft procedural blobs, no textures), CPU-integrated (gravity, drag,
//   onshore wind drift), capped per quality: full 900 / medium 480 / low 220 (low: timer bursts, no swell).
import * as THREE from 'three';
import type { Ocean } from './ocean';

export type SpraySites = { n: number; x: Float32Array; z: Float32Array; nx: Float32Array; nz: Float32Array; str: Float32Array };
export type SprayInfo = { sites: number; near: number; live: number; cap: number; bursts: number; crashBursts: number; spawned: number; maxH: number; mode: string };

const CAP = { full: 900, medium: 480, low: 220 } as const;
const PRE = {
  morro: { up: 5.5, upStr: 6.5, out: 1.8, windX: -1.6, windZ: 0, perBurst: 10, perStr: 16, mist: 0.28, size: 1.0, prob: 0.6, thr: 0.42 },
  cabras: { up: 2.4, upStr: 2.6, out: 1.1, windX: 0, windZ: 0.7, perBurst: 4, perStr: 7, mist: 0.22, size: 0.7, prob: 0.35, thr: 0.5 },
};

const VERT = /* glsl */`
#include <common>
#include <fog_pars_vertex>
attribute float aLife; attribute float aSize; attribute float aSeed;
uniform float uScale;
varying float vLife; varying float vSeed;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vLife = aLife; vSeed = aSeed;
  float grow = mix(0.45, 1.6, sqrt(aLife));
  gl_PointSize = min(320.0, aSize * grow * uScale / max(0.5, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const FRAG = /* glsl */`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uCol; uniform vec3 uShade;
varying float vLife; varying float vSeed;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0; float r = length(p);
  if (r > 1.0 || vLife >= 1.0) discard;
  // lumpy blob: a few soft lobes so the puffs don't read as perfect discs
  float mist = step(1.0, vSeed), sd = fract(vSeed);
  float a0 = atan(p.y, p.x);
  float lump = 0.78 + 0.22 * sin(a0 * 3.0 + sd * 20.0) * sin(a0 * 5.0 - sd * 11.0);
  float body = 1.0 - smoothstep(0.25 * lump, 0.95 * lump, r);
  // droplet clusters: speckled (a few bright sub-blobs) and thinning out as they fly; mist: soft and thin
  vec2 q = gl_PointCoord * 4.0 + sd * 13.0; float sp = 0.5 + 0.5 * sin(q.x * 2.1 + sin(q.y * 1.7)) * sin(q.y * 2.3 - sin(q.x * 1.3));
  float speck = mix(mix(0.55, 1.15, sp), 1.0, mist) * mix(1.0, 0.7 + 0.3 * sp, vLife * (1.0 - mist));
  float fade = smoothstep(0.0, 0.08, vLife) * (1.0 - smoothstep(0.4, 1.0, vLife));
  float a = body * speck * fade * mix(0.62 + 0.2 * fract(sd * 7.31), 0.32, mist);
  if (a < 0.01) discard;
  vec3 col = mix(uCol, uShade, smoothstep(-0.2, 0.9, p.y) * 0.6);
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`;

export class Spray {
  readonly points: THREE.Points; readonly info: SprayInfo;
  private mat: THREE.ShaderMaterial; private geo: THREE.BufferGeometry;
  private pos: Float32Array; private vel: Float32Array; private age: Float32Array; private life: Float32Array; private lifeA: Float32Array; private size: Float32Array; private seed: Float32Array; private mist: Uint8Array;
  private n = 0; private cap: number; private P: (typeof PRE)['morro'];
  private sites: SpraySites | null = null; private ver = -1; private prevH = new Float32Array(0); private near: number[] = []; private nearT = 0; private rnd = 0x9e3779b9;
  private lastCrash = -1;
  constructor(readonly ocean: Ocean, readonly kind: 'morro' | 'cabras', war = false) {
    this.P = PRE[kind]; this.cap = CAP[ocean.info.mode];
    const M = CAP.full;
    this.pos = new Float32Array(M * 3); this.vel = new Float32Array(M * 3); this.age = new Float32Array(M); this.life = new Float32Array(M);
    this.lifeA = new Float32Array(M).fill(1); this.size = new Float32Array(M); this.seed = new Float32Array(M); this.mist = new Uint8Array(M);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aLife', new THREE.BufferAttribute(this.lifeA, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aSeed', new THREE.BufferAttribute(this.seed, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo.setDrawRange(0, 0);
    this.mat = new THREE.ShaderMaterial({
      uniforms: { ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog), uScale: { value: 400 }, uCol: { value: new THREE.Color(war ? 0xd8d4cc : 0xf4f8f8) }, uShade: { value: new THREE.Color(war ? 0x8c8a86 : 0xb9c8cc) } },
      vertexShader: VERT, fragmentShader: FRAG, fog: true, transparent: true, depthWrite: false,
    });
    this.points = new THREE.Points(this.geo, this.mat); this.points.name = 'spray'; this.points.frustumCulled = false; this.points.renderOrder = 2;
    this.info = { sites: 0, near: 0, live: 0, cap: this.cap, bursts: 0, crashBursts: 0, spawned: 0, maxH: 0, mode: ocean.info.mode };
  }
  private r() { this.rnd ^= this.rnd << 13; this.rnd ^= this.rnd >>> 17; this.rnd ^= this.rnd << 5; return ((this.rnd >>> 0) % 100000) / 100000; }
  /** Throw a burst at site i; k scales count + height (1 = a normal crest, ~2.5 = an ambience breaker crash). */
  burst(i: number, k = 1) {
    const s = this.sites; if (!s || i < 0 || i >= s.n) return;
    const P = this.P, str = s.str[i], cnt = Math.round((P.perBurst + P.perStr * str) * k);
    const y0 = this.ocean.heightAt(s.x[i], s.z[i]);
    for (let c = 0; c < cnt && this.n < this.cap; c++) {
      const j = this.n++, mist = this.r() < P.mist;
      const along = (this.r() - 0.5) * 2.4, tx = -s.nz[i], tz = s.nx[i];
      this.pos[j * 3] = s.x[i] + s.nx[i] * 0.4 + tx * along; this.pos[j * 3 + 1] = y0 + 0.2; this.pos[j * 3 + 2] = s.z[i] + s.nz[i] * 0.4 + tz * along;
      const up = (P.up + P.upStr * str) * Math.min(1.8, Math.sqrt(k)) * (mist ? 0.45 : 0.55 + 0.6 * this.r());
      const out = P.out * (0.3 + this.r()) * (mist ? 0.5 : 1), side = (this.r() - 0.5) * 1.6;
      this.vel[j * 3] = s.nx[i] * out + tx * side; this.vel[j * 3 + 1] = up; this.vel[j * 3 + 2] = s.nz[i] * out + tz * side;
      this.age[j] = 0; this.life[j] = mist ? 2.2 + this.r() * 1.6 : 1.0 + this.r() * 0.9;
      this.size[j] = P.size * (mist ? 3.4 + this.r() * 2.4 : 0.55 + this.r() * 0.8) * (0.7 + 0.5 * str) * (k > 1.5 ? 1.25 : 1); this.seed[j] = this.r() * 0.999 + (mist ? 1 : 0); this.lifeA[j] = 0; this.mist[j] = mist ? 1 : 0;
      this.info.spawned++;
    }
    this.info.bursts++;
  }
  /** Ambience breaker crash: big burst at the strongest cliff site in view (25..140 m ahead). */
  crash(cam: THREE.Camera) {
    const s = this.sites; if (!s) return -1;
    const f = new THREE.Vector3(); cam.getWorldDirection(f); const c = cam.position;
    let best = -1, bs = 0;
    for (const i of this.near) {
      const dx = s.x[i] - c.x, dz = s.z[i] - c.z, d = Math.hypot(dx, dz); if (d < 15 || d > 160) continue;
      const fac = (dx * f.x + dz * f.z) / d; if (fac < 0.35) continue;
      const sc = s.str[i] * (0.6 + fac) * (1 - d / 220) + this.r() * 0.15; if (sc > bs) { bs = sc; best = i; }
    }
    if (best < 0) return -1;
    this.burst(best, 2.6); const tx = -s.nz[best], tz = s.nx[best];
    for (const o of [-1, 1]) { // the crest hits a stretch of wall, not a point
      let b2 = -1, bd = 1e9; for (const i of this.near) { const d = Math.abs((s.x[i] - s.x[best] - tx * o * 5) ** 2 + (s.z[i] - s.z[best] - tz * o * 5) ** 2); if (d < bd && i !== best) { bd = d; b2 = i; } }
      if (b2 >= 0 && bd < 30) this.burst(b2, 1.7);
    }
    this.info.crashBursts++; return best;
  }
  update(dt: number, cam: THREE.PerspectiveCamera, viewH: number, crashes = -1) {
    const o = this.ocean, s = o.spraySites;
    if (o.sitesVer !== this.ver) { this.sites = s; this.ver = o.sitesVer; this.prevH = new Float32Array(s ? s.n : 0); this.near = []; this.nearT = 0; this.info.sites = s ? s.n : 0; }
    this.cap = CAP[o.info.mode]; this.info.cap = this.cap; this.info.mode = o.info.mode;
    if (this.n > this.cap) this.n = this.cap; // quality dropped: trim the pool
    this.mat.uniforms.uScale.value = viewH / (2 * Math.tan((cam.fov * Math.PI) / 360));
    const c = cam.position;
    if (s && (this.nearT -= dt) <= 0) {
      this.nearT = 0.4; const R2 = 170 * 170, cand: [number, number][] = [];
      for (let i = 0; i < s.n; i++) { const d = (s.x[i] - c.x) ** 2 + (s.z[i] - c.z) ** 2; if (d < R2) cand.push([d, i]); }
      if (cand.length > 360) cand.sort((a, b) => a[0] - b[0]);
      const fresh = cand.slice(0, 360).map((e) => e[1]), had = new Set(this.near);
      for (const i of fresh) if (!had.has(i)) this.prevH[i] = o.heightAt(s.x[i], s.z[i]) - o.level;
      this.near = fresh; this.info.near = fresh.length;
    }
    // swell-timed bursts
    if (s && dt > 0) {
      const amp = Math.max(0.05, o.info.amp), low = o.info.mode === 'low';
      for (const i of this.near) {
        if (low) { if (this.r() < dt * 0.035 * (0.4 + s.str[i])) this.burst(i, 0.8); continue; }
        const h = o.heightAt(s.x[i], s.z[i]) - o.level, thr = amp * (this.P.thr + 0.18 * (((i * 2654435761) >>> 0) % 997) / 997);
        if (this.prevH[i] < thr && h >= thr && this.r() < this.P.prob * (0.5 + 0.5 * s.str[i])) this.burst(i, 0.7 + 0.6 * Math.min(1, (h - thr) / (amp * 0.3) + 0.4));
        this.prevH[i] = h;
      }
      if (crashes >= 0) { if (this.lastCrash >= 0 && crashes > this.lastCrash) this.crash(cam); this.lastCrash = crashes; }
    }
    // integrate (swap-remove dead particles so the live ones stay packed in the draw range)
    const P = this.P; let maxH = 0;
    for (let j = 0; j < this.n; ) {
      this.age[j] += dt;
      if (this.age[j] >= this.life[j]) { this.n--; this.copy(this.n, j); continue; }
      const mist = this.mist[j] === 1, drag = Math.exp(-(mist ? 1.6 : 0.5) * dt), grav = mist ? 2.0 : 9.81, wk = dt * (mist ? 1.4 : 0.6);
      this.vel[j * 3] = this.vel[j * 3] * drag + P.windX * wk;
      this.vel[j * 3 + 1] = this.vel[j * 3 + 1] * drag - grav * dt; this.vel[j * 3 + 2] = this.vel[j * 3 + 2] * drag + P.windZ * wk;
      this.pos[j * 3] += this.vel[j * 3] * dt; this.pos[j * 3 + 1] += this.vel[j * 3 + 1] * dt; this.pos[j * 3 + 2] += this.vel[j * 3 + 2] * dt;
      if (this.pos[j * 3 + 1] < o.level - 0.4) this.age[j] = this.life[j];
      this.lifeA[j] = this.age[j] / this.life[j]; maxH = Math.max(maxH, this.pos[j * 3 + 1] - o.level);
      j++;
    }
    this.info.live = this.n; this.info.maxH = +maxH.toFixed(2);
    this.geo.setDrawRange(0, this.n);
    for (const k of ['position', 'aLife', 'aSize', 'aSeed']) (this.geo.attributes[k] as THREE.BufferAttribute).needsUpdate = true;
  }
  private copy(from: number, to: number) {
    if (from === to) return;
    for (let a = 0; a < 3; a++) { this.pos[to * 3 + a] = this.pos[from * 3 + a]; this.vel[to * 3 + a] = this.vel[from * 3 + a]; }
    this.age[to] = this.age[from]; this.life[to] = this.life[from]; this.lifeA[to] = this.lifeA[from]; this.size[to] = this.size[from]; this.seed[to] = this.seed[from]; this.mist[to] = this.mist[from];
  }
  dispose() { this.geo.dispose(); this.mat.dispose(); }
}
