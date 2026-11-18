// t107 first-person death effects: the dying enemy's GLB breaks into 2-4 parts (its own primitives,
// or triangle chunks of the biggest one) that get an impulse from the hit direction, fall under
// gravity, bounce on the ground height, spin and shrink away. Meshes are pooled; the chunk
// geometries and the charred / iced material variants are cached per source, so a kill costs a few
// matrix writes and no allocation after warm-up.
import * as THREE from 'three';
import type { DeathCause } from '../systems/Deaths';

export interface PartSrc { geometry: THREE.BufferGeometry; material: THREE.Material; local?: THREE.Matrix4 }
interface Live { m: THREE.Mesh; vx: number; vy: number; vz: number; wx: number; wy: number; wz: number; t: number; life: number; floor: number; s: THREE.Vector3; rest: boolean }
type Chunk = { geo: THREE.BufferGeometry; c: THREE.Vector3; r: number };

const GRAV = 15.5;
const R = (a: number, b: number) => a + Math.random() * (b - a);

/** Split a geometry into k pieces along its longest axes (by triangle centroid); each re-centred. */
function split(src: THREE.BufferGeometry, k: number): Chunk[] {
  const g = src.index ? src.toNonIndexed() : src;
  const pos = g.getAttribute('position') as THREE.BufferAttribute; const nTri = Math.floor(pos.count / 3);
  g.computeBoundingBox(); const bb = g.boundingBox!, size = bb.getSize(new THREE.Vector3());
  const axes = (['x', 'y', 'z'] as const).slice().sort((a, b) => size[b] - size[a]);
  const a0 = axes[0], a1 = axes[1];
  const cell = (cx: number, cy: number) => {
    if (k <= 1) return 0;
    if (k === 4) return (cx > (bb.min[a0] + bb.max[a0]) / 2 ? 1 : 0) + (cy > (bb.min[a1] + bb.max[a1]) / 2 ? 2 : 0);
    return Math.min(k - 1, Math.floor(((cx - bb.min[a0]) / Math.max(1e-6, size[a0])) * k));
  };
  const buckets: number[][] = Array.from({ length: k }, () => []);
  const v = new THREE.Vector3();
  for (let t = 0; t < nTri; t++) {
    let sx = 0, sy = 0, sz = 0;
    for (let j = 0; j < 3; j++) { v.fromBufferAttribute(pos, t * 3 + j); sx += v.x; sy += v.y; sz += v.z; }
    const c = { x: sx / 3, y: sy / 3, z: sz / 3 };
    buckets[cell(c[a0], c[a1])].push(t);
  }
  const out: Chunk[] = [];
  for (const tris of buckets) {
    if (!tris.length) continue;
    const geo = new THREE.BufferGeometry();
    for (const name of Object.keys(g.attributes)) {
      const at = g.getAttribute(name) as THREE.BufferAttribute, isz = at.itemSize, arr = new Float32Array(tris.length * 3 * isz);
      let o = 0; for (const t of tris) for (let j = 0; j < 3; j++) for (let q = 0; q < isz; q++) arr[o++] = at.getComponent(t * 3 + j, q);
      geo.setAttribute(name, new THREE.BufferAttribute(arr, isz, at.normalized));
    }
    geo.computeBoundingBox(); const c = geo.boundingBox!.getCenter(new THREE.Vector3()); geo.translate(-c.x, -c.y, -c.z);
    geo.computeBoundingSphere();
    out.push({ geo, c, r: geo.boundingSphere?.radius ?? 0.3 });
  }
  return out;
}

export class FpDeaths {
  private pool: THREE.Mesh[] = [];
  readonly live: Live[] = [];
  private chunks = new Map<string, Chunk[]>();
  private mats = new Map<string, THREE.Material>();
  stats = { events: 0, parts: 0, peak: 0, skipped: 0, byCause: {} as Record<string, number> };
  private M = new THREE.Matrix4(); private P = new THREE.Vector3(); private Q = new THREE.Quaternion(); private S = new THREE.Vector3(); private O = new THREE.Vector3();
  constructor(private scene: THREE.Scene, public cap: number) {}
  private chunk(geo: THREE.BufferGeometry, k: number): Chunk[] {
    const key = geo.uuid + ':' + k; let c = this.chunks.get(key);
    if (!c) { c = split(geo, k); this.chunks.set(key, c); }
    return c;
  }
  private mat(m: THREE.Material, cause: DeathCause): THREE.Material {
    if (cause !== 'burn' && cause !== 'ice') return m;
    const key = m.uuid + cause; let v = this.mats.get(key);
    if (!v) {
      v = m.clone(); const mm = v as THREE.MeshStandardMaterial;
      if (mm.color) mm.color.setHex(cause === 'burn' ? 0x2e231b : 0xcdeeff);
      if (mm.emissive) mm.emissive.setHex(cause === 'burn' ? 0x2a0c00 : 0x123848);
      this.mats.set(key, v);
    }
    return v;
  }
  /**
   * Break one enemy apart. `world` = the enemy model matrix; parts are its primitives (with an optional
   * local matrix for template children). dir = unit hit direction on the ground plane (x, z).
   */
  spawn(parts: PartSrc[], world: THREE.Matrix4, dirX: number, dirZ: number, cause: DeathCause, boss: boolean, floor: number) {
    if (!parts.length) return 0;
    this.stats.events++; this.stats.byCause[cause] = (this.stats.byCause[cause] ?? 0) + 1;
    let n = boss ? 4 : cause === 'boom' ? 4 : 3;
    const room = this.cap - this.live.length;
    if (room < 2 && !boss) { this.stats.skipped++; return 0; }
    n = Math.max(2, Math.min(n, room + (boss ? 4 : 0)));
    // pick pieces: biggest primitives whole, or chunks of the biggest one
    const vc = (p: PartSrc) => p.geometry.getAttribute('position').count;
    const sorted = parts.slice().sort((a, b) => vc(b) - vc(a));
    const pieces: { src: PartSrc; ch: Chunk }[] = [];
    if (sorted.length >= n) for (let i = 0; i < n; i++) pieces.push({ src: sorted[i], ch: this.chunk(sorted[i].geometry, 1)[0] });
    else {
      const k = Math.min(4, n - (sorted.length - 1));
      for (const ch of this.chunk(sorted[0].geometry, k)) pieces.push({ src: sorted[0], ch });
      for (let i = 1; i < sorted.length && pieces.length < n; i++) pieces.push({ src: sorted[i], ch: this.chunk(sorted[i].geometry, 1)[0] });
    }
    world.decompose(this.P, this.Q, this.S); const centre = this.P.clone();
    const sp = (cause === 'boom' ? 1.7 : 1) * (boss ? 1.3 : 1), spread = cause === 'boom' ? 1.8 : 0.8, life = (boss ? 2.4 : cause === 'boom' ? 1.7 : 1.3);
    let made = 0;
    for (const pc of pieces) {
      if (this.live.length >= this.cap && !boss) break;
      const m = this.pool.pop() ?? (() => { const x = new THREE.Mesh(); x.frustumCulled = false; x.castShadow = false; return x; })();
      m.geometry = pc.ch.geo; m.material = this.mat(pc.src.material, cause);
      this.M.copy(world); if (pc.src.local) this.M.multiply(pc.src.local);
      this.M.multiply(new THREE.Matrix4().makeTranslation(pc.ch.c.x, pc.ch.c.y, pc.ch.c.z));
      this.M.decompose(m.position, m.quaternion, m.scale);
      this.O.copy(m.position).sub(centre); this.O.y = 0; const ol = this.O.length() || 1;
      const a = Math.atan2(dirZ, dirX) + R(-spread, spread), s = R(2.2, 4.6) * sp;
      const L: Live = { m, vx: Math.cos(a) * s + (this.O.x / ol) * 1.2 * sp, vy: R(2.6, 5.2) * (cause === 'boom' ? 1.4 : 1), vz: Math.sin(a) * s + (this.O.z / ol) * 1.2 * sp,
        wx: R(-7, 7), wy: R(-5, 5), wz: R(-7, 7), t: 0, life: life * R(0.8, 1.15), floor: floor + pc.ch.r * m.scale.y * 0.35, s: m.scale.clone(), rest: false };
      if (!m.parent) this.scene.add(m); m.visible = true;
      this.live.push(L); made++;
    }
    this.stats.parts += made; this.stats.peak = Math.max(this.stats.peak, this.live.length);
    return made;
  }
  update(dt: number) {
    const L = this.live;
    for (let i = 0; i < L.length;) {
      const p = L[i]; p.t += dt;
      if (p.t >= p.life) { p.m.visible = false; this.pool.push(p.m); L[i] = L[L.length - 1]; L.pop(); continue; }
      const m = p.m;
      if (!p.rest) {
        p.vy -= GRAV * dt; m.position.x += p.vx * dt; m.position.y += p.vy * dt; m.position.z += p.vz * dt;
        m.rotation.x += p.wx * dt; m.rotation.y += p.wy * dt; m.rotation.z += p.wz * dt;
        if (m.position.y <= p.floor) {
          m.position.y = p.floor;
          if (p.vy < -1.6) { p.vy = -p.vy * 0.35; p.vx *= 0.55; p.vz *= 0.55; p.wx *= 0.5; p.wy *= 0.5; p.wz *= 0.5; }
          else { p.rest = true; }
        }
      }
      const f = p.t / p.life, k = f < 0.7 ? 1 : Math.max(0.02, 1 - (f - 0.7) / 0.3);
      m.scale.set(p.s.x * k, p.s.y * k, p.s.z * k);
      i++;
    }
  }
  dispose() {
    for (const p of this.live) this.scene.remove(p.m); for (const m of this.pool) this.scene.remove(m);
    for (const c of this.chunks.values()) for (const x of c) x.geo.dispose();
    for (const m of this.mats.values()) m.dispose();
    this.live.length = 0; this.pool.length = 0; this.chunks.clear(); this.mats.clear();
  }
}
