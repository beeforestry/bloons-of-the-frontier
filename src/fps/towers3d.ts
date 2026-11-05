// t44/t64: procedural 3D models for every tower and tier, matched to the 2D sprites
// (silhouette, palette, tier details) + CC0 PBR textures (fur/metal/cloth/wood/leaf…). Metres, y up, front = +X.
// Built once per (id, tier) from shared primitives, merged per material kind so a tower is a handful of textured meshes.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { inferMat, matOf, type MatKind } from './mats';

type V3 = [number, number, number];
interface PO { r?: V3; glow?: boolean; head?: boolean; seg?: number; mat?: MatKind }
const UNIT = new Map<string, THREE.BufferGeometry>();
function U(key: string, mk: () => THREE.BufferGeometry) {
  let g = UNIT.get(key);
  if (!g) { const s = mk(); g = s.index ? s.toNonIndexed() : s; if (!g.getAttribute('uv')) {
    // fallback planar UVs from XZ for any geo that lacks them
    const pos = g.getAttribute('position'), uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) { uv[i * 2] = pos.getX(i); uv[i * 2 + 1] = pos.getZ(i); }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  } UNIT.set(key, g); }
  return g;
}
const STAR = () => { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 0.45 : 1; s[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
  return new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5); };
const UP = new THREE.Vector3(0, 1, 0);
interface Part { g: THREE.BufferGeometry; m: THREE.Matrix4; c: number; glow: boolean; head: boolean; mat: MatKind }

/** Model builder: accumulate primitives, then merge. `off` translates, `head` routes parts to the aiming head. */
class B {
  parts: Part[] = []; head = false; off: V3 = [0, 0, 0]; pivot: V3 = [0, 0, 0]; private seed = 7;
  rnd() { this.seed = (this.seed * 16807) % 2147483647; return this.seed / 2147483647; }
  add(g: THREE.BufferGeometry, p: V3, s: V3, c: number, o: PO = {}, q?: THREE.Quaternion) {
    const qq = q ?? new THREE.Quaternion().setFromEuler(new THREE.Euler(...(o.r ?? [0, 0, 0]), 'YZX'));
    const m = new THREE.Matrix4().compose(new THREE.Vector3(p[0] + this.off[0], p[1] + this.off[1], p[2] + this.off[2]), qq, new THREE.Vector3(...s));
    const glow = !!o.glow;
    this.parts.push({ g, m, c, glow, head: o.head ?? this.head, mat: o.mat ?? inferMat(c, glow) });
  }
  box(w: number, h: number, d: number, p: V3, c: number, o?: PO) { this.add(U('box', () => new THREE.BoxGeometry(1, 1, 1)), p, [w, h, d], c, o); }
  cyl(rt: number, rb: number, h: number, p: V3, c: number, o: PO = {}) {
    const r = Math.max(rt, rb, 1e-4), a = +(rt / r).toFixed(2), b = +(rb / r).toFixed(2), s = o.seg ?? 10;
    this.add(U(`c${a}/${b}/${s}`, () => new THREE.CylinderGeometry(a, b, 1, s)), p, [r, h, r], c, o);
  }
  sph(rx: number, ry: number, rz: number, p: V3, c: number, o?: PO) { this.add(U('s', () => new THREE.SphereGeometry(1, 12, 8)), p, [rx, ry, rz], c, o); }
  hemi(rx: number, ry: number, rz: number, p: V3, c: number, o?: PO) { this.add(U('h', () => new THREE.SphereGeometry(1, 12, 5, 0, Math.PI * 2, 0, Math.PI / 2)), p, [rx, ry, rz], c, o); }
  tor(R: number, r: number, p: V3, c: number, o?: PO) { const k = +(r / R).toFixed(2); this.add(U('t' + k, () => new THREE.TorusGeometry(1, k, 5, 14)), p, [R, R, R], c, o); }
  star(r: number, th: number, p: V3, c: number, o?: PO) { this.add(U('star', STAR), p, [r, r, th], c, o); }
  /** cylinder from a to b (arms, legs, stems, barrels). */
  limb(a: V3, b: V3, r: number, c: number, o: PO & { r2?: number } = {}) {
    const va = new THREE.Vector3(...a), d = new THREE.Vector3(...b).sub(va), L = d.length();
    const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize()), mid = va.addScaledVector(d, 0.5);
    const r2 = o.r2 ?? r, R = Math.max(r, r2), k = `c${+(r2 / R).toFixed(2)}/${+(r / R).toFixed(2)}/${o.seg ?? 7}`;
    this.add(U(k, () => new THREE.CylinderGeometry(r2 / R, r / R, 1, o.seg ?? 7)), [mid.x, mid.y, mid.z], [R, L, R], c, o, q);
  }
  chain(pts: V3[], r: number, c: number, o: PO & { taper?: number } = {}) {
    for (let i = 0; i < pts.length - 1; i++) { const t = o.taper ?? 1, ra = r * Math.pow(t, i), rb = r * Math.pow(t, i + 1); this.limb(pts[i], pts[i + 1], ra, c, { ...o, r2: rb }); this.sph(rb, rb, rb, pts[i + 1], c, o); }
  }
  /** barrel along +X starting at p. */
  barrel(p: V3, len: number, r: number, c: number, o?: PO) { this.limb(p, [p[0] + len, p[1], p[2]], r, c, { seg: 8, ...o }); }
  leaf(p: V3, yaw: number, len: number, c: number, tilt = 0.35, w = 0.42) {
    const dx = Math.cos(yaw), dz = -Math.sin(yaw);
    this.sph(len, 0.035, len * w, [p[0] + dx * len * 0.85, p[1] + Math.sin(tilt) * len * 0.6, p[2] + dz * len * 0.85], c, { r: [0, yaw, tilt] });
  }
  ring(n: number, R: number, y: number, f: (x: number, z: number, a: number, i: number) => void, a0 = 0) { for (let i = 0; i < n; i++) { const a = a0 + (i / n) * Math.PI * 2; f(Math.cos(a) * R, Math.sin(a) * R, a, i); } }
}

// ---------------------------------------------------------------------------------------------- shared pieces
const C = { fur: 0x6b4a2f, face: 0xd9b48a, dark: 0x1b1b1e, dirt: 0x4a3323, grass: 0x4f8a2c, leaf: 0x3f7f2a, stone: 0x726d64, wood: 0x7a5232, olive: 0x4f5647, gold: 0xe0b030, metal: 0x5d6268 };
function mound(b: B, r = 1.0, c = C.dirt) {
  b.cyl(r * 0.85, r, 0.3, [0, 0.15, 0], c, { seg: 12 });
  for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.3, rr = r * (0.55 + 0.4 * b.rnd()); b.cyl(0, 0.06, 0.25, [Math.cos(a) * rr, 0.38, Math.sin(a) * rr], C.grass, { seg: 4 }); }
}
function plinth(b: B, c = 0x6d655a) { b.cyl(0.85, 0.95, 0.18, [0, 0.09, 0], c, { seg: 12 }); }
interface MO { fur?: number; face?: number; torso: number; legs?: number; arms?: number; boots?: number; hat?: 'wizard' | 'cowboy' | 'hood' | 'ninja' | 'helmet' | 'hazmat' | 'none'; hatC?: number;
  cape?: number; armor?: number; belt?: number; scarf?: number; robe?: boolean; crouch?: boolean; pack?: number; ghillie?: number; gem?: number; punch?: boolean; trim?: number }
/** A heroic ~2.2 m monkey facing +X. Returns right/left hand positions (in builder space, before `off`). */
function monkey(b: B, o: MO): { rh: V3; lh: V3 } {
  const fur = o.fur ?? C.fur, face = o.face ?? C.face, legs = o.legs ?? o.torso, arms = o.arms ?? o.torso, boots = o.boots ?? 0x2b2219, dy = o.crouch ? -0.38 : 0;
  // legs / robe
  if (o.robe) { b.cyl(0.34, 0.6, 1.15, [0, 0.58, 0], o.torso, { seg: 10 }); if (o.trim) b.tor(0.59, 0.035, [0, 0.04, 0], o.trim, { r: [Math.PI / 2, 0, 0] }); }
  else for (const s of [1, -1]) {
    const pts: V3[] = o.crouch ? (s > 0 ? [[-0.05, 0.6, 0.18], [0.38, 0.55, 0.22], [0.25, 0.08, 0.22]] : [[-0.05, 0.6, -0.18], [0.05, 0.12, -0.2], [-0.42, 0.1, -0.2]])
      : [[0, 0.95, 0.17 * s], [0.12, 0.5, 0.2 * s], [0, 0.1, 0.2 * s]];
    b.chain(pts, 0.12, legs, { taper: 0.85 }); const f = pts[2]; b.box(0.36, 0.15, 0.18, [f[0] + 0.08, 0.075, f[2]], boots);
  }
  // torso
  b.sph(0.34, 0.47, 0.38, [0, 1.36 + dy, 0], o.torso);
  b.sph(0.2, 0.26, 0.26, [0.17, 1.28 + dy, 0], o.armor ?? face);
  if (o.armor) { b.sph(0.3, 0.37, 0.35, [0.07, 1.42 + dy, 0], o.armor); for (const s of [1, -1]) b.sph(0.17, 0.13, 0.19, [0, 1.73 + dy, 0.42 * s], o.armor); }
  if (o.belt) b.tor(0.33, 0.05, [0, 1.05 + dy, 0], o.belt, { r: [Math.PI / 2, 0, 0] });
  if (o.scarf) { b.tor(0.23, 0.07, [0, 1.76 + dy, 0], o.scarf, { r: [Math.PI / 2, 0, 0] }); b.chain([[-0.15, 1.75 + dy, 0.08], [-0.4, 1.55 + dy, 0.18], [-0.55, 1.3 + dy, 0.12]], 0.06, o.scarf); }
  if (o.gem) b.sph(0.08, 0.08, 0.08, [0.36, 1.48 + dy, 0], o.gem, { glow: true });
  if (o.pack) b.box(0.3, 0.55, 0.48, [-0.38, 1.4 + dy, 0], o.pack);
  if (o.cape) b.box(0.06, 1.35, 0.85, [-0.42, 1.15 + dy, 0], o.cape, { r: [0, 0, -0.22] });
  // arms
  const sh = 1.68 + dy, rh: V3 = o.punch ? [0.78, sh - 0.05, 0.3] : [0.52, 1.42 + dy, 0.32], lh: V3 = o.punch ? [0.3, 1.25 + dy, -0.45] : [0.48, 1.4 + dy, -0.22];
  b.chain([[0, sh, 0.4], o.punch ? [0.4, sh - 0.02, 0.38] : [0.2, 1.36 + dy, 0.47], rh], 0.1, arms, { taper: 0.85 });
  b.chain([[0, sh, -0.4], o.punch ? [0.05, 1.35 + dy, -0.5] : [0.22, 1.33 + dy, -0.47], lh], 0.1, arms, { taper: 0.85 });
  b.sph(0.1, 0.1, 0.1, rh, face); b.sph(0.1, 0.1, 0.1, lh, face);
  // head
  const hy = 2.06 + dy;
  b.sph(0.31, 0.31, 0.31, [0, hy, 0], fur);
  b.sph(0.16, 0.21, 0.24, [0.19, hy - 0.03, 0], face); b.sph(0.12, 0.1, 0.16, [0.3, hy - 0.1, 0], face);
  for (const s of [1, -1]) { b.sph(0.045, 0.045, 0.045, [0.33, hy + 0.05, 0.09 * s], 0x111111); b.sph(0.05, 0.11, 0.1, [0, hy + 0.02, 0.31 * s], face); }
  b.box(0.06, 0.04, 0.3, [0.32, hy + 0.11, 0], fur);
  // tail
  b.chain([[-0.28, 1.0 + dy, 0], [-0.62, 0.78 + dy, 0.06], [-0.88, 1.02 + dy, 0.1], [-0.85, 1.4 + dy, 0.1]], 0.055, fur);
  const hc = o.hatC ?? o.torso;
  switch (o.hat) {
    case 'wizard': b.cyl(0.5, 0.5, 0.05, [0, hy + 0.2, 0], hc, { seg: 12 }); b.cyl(0, 0.33, 0.8, [-0.04, hy + 0.6, 0], hc, { r: [0, 0, 0.22] }); break;
    case 'cowboy': b.cyl(0.52, 0.52, 0.04, [0, hy + 0.22, 0], hc, { seg: 12 }); b.cyl(0.24, 0.29, 0.26, [0, hy + 0.36, 0], hc); break;
    case 'hood': b.sph(0.34, 0.35, 0.35, [-0.07, hy + 0.03, 0], hc); break;
    case 'ninja': b.sph(0.34, 0.35, 0.35, [-0.07, hy + 0.03, 0], hc); b.box(0.12, 0.12, 0.42, [0.26, hy - 0.08, 0], hc); b.chain([[-0.3, hy + 0.05, 0], [-0.6, hy - 0.1, 0.1], [-0.75, hy - 0.3, 0.05]], 0.04, hc); break;
    case 'helmet': b.hemi(0.36, 0.3, 0.36, [-0.02, hy + 0.04, 0], hc); break;
    case 'hazmat': b.sph(0.4, 0.4, 0.4, [0, hy, 0], hc); b.sph(0.12, 0.2, 0.28, [0.3, hy, 0], 0x9ad8ff, { glow: true }); break;
  }
  if (o.ghillie) for (let i = 0; i < 26; i++) { const a = b.rnd() * 6.28, y = 0.9 + b.rnd() * 1.3 + dy, r = 0.32 + b.rnd() * 0.12; b.sph(0.11, 0.09, 0.11, [Math.cos(a) * r * 0.8 - 0.05, y, Math.sin(a) * r], i % 3 ? o.ghillie : 0x6a7a3a); }
  return { rh, lh };
}
const P = (a: V3, dx: number, dy: number, dz: number): V3 => [a[0] + dx, a[1] + dy, a[2] + dz];
function turretBase(b: B, t: number) {
  b.head = false;
  b.cyl(1.15, 1.28, 0.75, [0, 0.38, 0], [0x535a4d, 0x4c5248, 0x474b42][t], { seg: 8 });
  b.cyl(0.72, 0.8, 0.14, [0, 0.82, 0], 0x33382f, { seg: 8 });
  b.box(0.1, 0.22, 0.6, [1.17, 0.38, 0], t ? 0x5a7ac0 : 0x3a6ad0, { glow: t === 0 });
  if (t >= 1) b.ring(4, 1.12, 0, (x, z, a) => b.box(0.35, 0.5, 0.06, [x, 0.4, z], 0x3e4239, { r: [0, -a + Math.PI / 2, 0] }), Math.PI / 4);
  if (t >= 2) b.ring(16, 1.22, 0, (x, z, a, i) => b.box(0.08, 0.12, 0.42, [x, 0.6, z], i % 2 ? 0xd8a020 : 0x222222, { r: [0, -a, 0] }));
  b.pivot = [0, 1.15, 0]; b.head = true;
}

// ---------------------------------------------------------------------------------------------- per tower
type Fn = (b: B, t: number) => void;
const T: Record<string, Fn> = {
  dart_monkey(b, t) {
    plinth(b); b.head = true; b.off = [0, 0.18, 0];
    const { rh, lh } = monkey(b, { torso: [0x5a3a20, 0x4f3420, 0x8a8f98][t], legs: 0x4a3a2a, armor: t === 2 ? 0xb9bec6 : undefined, scarf: t === 1 ? 0x2a4a8a : undefined, belt: t >= 1 ? 0x3a2a1a : undefined, gem: t === 2 ? 0xffc84a : undefined, pack: t >= 1 ? 0x4a3018 : undefined });
    const n = t + 1; for (let i = 0; i < n; i++) { const z = (i - (n - 1) / 2) * 0.07; b.barrel(P(rh, -0.1, 0.04, z), 0.5, 0.022, 0x8a6a40); b.cyl(0, 0.045, 0.14, P(rh, 0.47, 0.04, z), t === 2 ? C.gold : 0x9aa0a8, { r: [0, 0, -Math.PI / 2] }); b.box(0.08, 0.08, 0.01, P(rh, -0.08, 0.04, z), 0xc03030); }
    b.sph(0.06, 0.06, 0.06, lh, 0x8a6a40);
  },
  ninja_monkey(b, t) {
    plinth(b, 0x4a4a52); b.head = true; b.off = [0, 0.18, 0];
    const suit = [0x1c1d22, 0x1e2c5c, 0x7c1d1d][t];
    const { rh, lh } = monkey(b, { torso: suit, legs: suit, hat: 'ninja', hatC: t === 2 ? 0x5a1414 : 0x18181c, belt: t >= 1 ? 0xb02a2a : 0x333333, armor: t === 2 ? 0x3a1515 : undefined, scarf: t === 2 ? 0xd4a020 : undefined });
    const sc = t === 2 ? 0xffc840 : 0xa0a6ae;
    b.star(0.17, 0.03, P(rh, 0.12, 0.05, 0), sc, { r: [0, Math.PI / 2, 0], glow: t === 2 });
    if (t >= 1) b.star(0.15, 0.03, P(lh, 0.1, 0.06, 0), sc, { r: [0, Math.PI / 2, 0.4], glow: t === 2 });
    if (t >= 1) b.limb([-0.4, 1.3, -0.15], [-0.25, 2.2, 0.2], 0.035, 0x2a2a2a);
  },
  wizard_monkey(b, t) {
    plinth(b, 0x5a5468); b.head = true; b.off = [0, 0.18, 0];
    const robe = [0x2f4f8f, 0x5a2f8a, 0xd9d2e6][t], trim = [0x9ab0e0, C.gold, 0x6a3aa0][t];
    const { rh, lh } = monkey(b, { torso: robe, robe: true, trim, hat: 'wizard', hatC: t === 2 ? 0x8a6ac8 : robe, belt: trim });
    b.limb(P(lh, 0, -1.25, 0), P(lh, 0, 0.75 + t * 0.12, 0), 0.04, 0x6a4a2a);
    const top = P(lh, 0, 0.9 + t * 0.12, 0), cr = 0.1 + t * 0.03;
    b.cyl(0, cr, cr * 1.6, P(top, 0, cr * 0.8, 0), 0xb070ff, { glow: true, seg: 6 }); b.cyl(cr, 0, cr * 1.2, P(top, 0, -cr * 0.6, 0), 0x9050e0, { glow: true, seg: 6 });
    if (t >= 1) b.tor(cr * 1.3, 0.02, top, C.gold, { r: [Math.PI / 2, 0, 0] });
    if (t >= 1) { b.box(0.26, 0.07, 0.34, P(rh, 0.08, 0, 0), 0x5a2a1a); b.box(0.22, 0.02, 0.3, P(rh, 0.08, 0.045, 0), 0xf0e0b0, { glow: true }); }
    if (t === 2) b.ring(3, 0.75, 0, (x, z) => b.sph(0.08, 0.08, 0.08, [x, 2.4, z], 0xd0a0ff, { glow: true }));
  },
  super_monkey(b, t) {
    b.cyl(0.9, 0.9, 0.04, [0, 0.03, 0], [0xc02a2a, 0x3a7ad0, 0xe0b030][t], { glow: true, seg: 16 }); b.cyl(0.7, 0.7, 0.05, [0, 0.04, 0], 0x303030, { seg: 16 });
    b.head = true; b.off = [0, 0.55, 0];
    const top = [0xc02a2a, 0x1f3f9f, 0xd8b040][t], leg = [0x2a3a9a, 0x1a2a6a, 0xc89a30][t];
    monkey(b, { torso: top, legs: leg, arms: top, cape: [0xb01e1e, 0x1a2a6a, 0xd8a830][t], armor: t >= 1 ? [0, 0x3a6ad0, 0xf0d070][t] : undefined, gem: t >= 1 ? [0, 0x6ad0ff, 0xffffff][t] : 0xffd040, punch: true, boots: [0xb01e1e, 0x15204a, 0xb08020][t], hat: t === 1 ? 'helmet' : 'none', hatC: 0x2a4ab0 });
  },
  money_monkey(b, t) {
    const desk = 0x6a4026;
    b.box(1.0, 0.09, 1.9, [0.15, 0.86, 0], desk); for (const s of [1, -1]) b.box(0.9, 0.8, 0.45, [0.15, 0.4, 0.68 * s], 0x5a3420);
    b.box(0.45, 0.9, 0.6, [-0.95, 0.75, 0], 0x2a2a2a); // chair back
    b.off = [-0.7, -0.4, 0];
    monkey(b, { torso: [0x7a5a3a, 0xeeeeee, 0x22252a][t], arms: [0x7a5a3a, 0xeeeeee, 0x22252a][t], legs: 0x333333 });
    if (t >= 1) b.box(0.03, 0.4, 0.08, [0.36, 1.33, 0], t === 2 ? 0x8a1a1a : 0x2a4a8a);
    b.off = [0, 0, 0];
    if (t === 0) { b.box(0.4, 0.03, 0.5, [0.05, 0.92, 0], 0x333333); b.box(0.03, 0.32, 0.5, [0.25, 1.08, 0], 0x333333, { r: [0, 0, 0.25] }); b.box(0.02, 0.27, 0.44, [0.235, 1.08, 0], 0x7ab0ff, { r: [0, 0, 0.25], glow: true }); }
    else for (const z of t === 2 ? [-0.5, 0, 0.5] : [-0.3, 0.3]) { b.box(0.06, 0.42, 0.5, [0.35, 1.22, z], 0x222222); b.box(0.02, 0.36, 0.44, [0.31, 1.22, z], 0x2a8a4a, { glow: true }); b.box(0.06, 0.25, 0.06, [0.38, 0.98, z], 0x222222); }
    const coins = t === 0 ? 2 : t === 1 ? 3 : 5; for (let i = 0; i < coins; i++) b.cyl(0.11, 0.11, 0.1 + i * 0.05, [0.45, 0.95 + i * 0.025, -0.75 + i * 0.12], C.gold, { seg: 10 });
    if (t >= 1) b.sph(0.2, 0.24, 0.2, [0.4, 1.12, 0.78], 0xb08a50);
    if (t === 2) { b.box(0.7, 2.0, 0.75, [-0.6, 1.0, -1.3], 0x1c1f24); for (let i = 0; i < 6; i++) b.box(0.02, 0.05, 0.5, [-0.24, 0.35 + i * 0.28, -1.3], i % 2 ? 0x40ff80 : 0x40a0ff, { glow: true });
      b.ring(7, 0.5, 0, (x, z) => b.cyl(0, 0.32, 0.4 + b.rnd() * 0.25, [0.9 + x, 0.2, 1.2 + z], C.gold, { seg: 7 })); b.box(0.6, 0.6, 0.6, [0.9, 0.3, -1.2], 0x8a7a50); b.cyl(0.08, 0.08, 0.05, [1.21, 0.35, -1.2], 0x333333, { r: [0, 0, Math.PI / 2] }); }
  },
  solar_pea_fusion(b, t) {
    mound(b); for (let i = 0; i < 6; i++) b.leaf([0, 0.35, 0], i * 1.05 + 0.3, 0.55 + 0.1 * t, C.leaf, 0.25);
    b.chain([[0, 0.3, 0], [-0.08, 0.9, 0], [0.02, 1.5, 0]], 0.1, 0x4a8a2a); b.leaf([0, 1.0, 0], 2, 0.4, C.leaf, 0.5); b.leaf([0, 1.0, 0], -1.1, 0.4, C.leaf, 0.5);
    b.pivot = [0.02, 1.75, 0]; b.head = true; const hy = 1.75;
    if (t === 0) { b.sph(0.45, 0.42, 0.42, [0, hy, 0], 0x5a8a2a); for (const s of [-0.18, 0, 0.18]) b.tor(0.4, 0.02, [s, hy, 0], 0x3a6a1a, { r: [0, Math.PI / 2, 0] }); }
    else { b.sph(0.4, 0.4, 0.4, [-0.1, hy, 0], 0x6a5020); b.ring(12, 0.55 + t * 0.08, 0, (x, z, a) => b.sph(0.05, 0.12, 0.26, [-0.12, hy + x, z], 0xf5c518, { r: [a, 0, 0] })); }
    const nb = t + 1, zs = nb === 1 ? [0] : nb === 2 ? [-0.24, 0.24] : [-0.38, 0, 0.38];
    for (const z of zs) { b.barrel([0.15, hy, z], 0.45, 0.19, 0xd9b030, { seg: 12 }); b.cyl(0.16, 0.16, 0.04, [0.61, hy, z], 0xfff070, { r: [0, 0, Math.PI / 2], glow: true }); }
  },
  gatling_cherry_bomber(b, t) {
    mound(b); const trunk = [0x4a7a2a, 0x6a4a2a, 0x5a3a20][t];
    if (t === 0) b.chain([[0, 0.3, 0], [-0.1, 0.7, 0.05], [0, 1.05, 0]], 0.08, trunk); else b.cyl(0.2 + t * 0.06, 0.42 + t * 0.12, 0.9 + t * 0.1, [0, 0.7, 0], trunk, { seg: 7 });
    for (let i = 0; i < 5; i++) b.leaf([0, 0.35, 0], i * 1.3, 0.5, C.leaf, 0.3);
    b.pivot = [0, 1.25 + t * 0.15, 0]; b.head = true; const hy = b.pivot[1], tube = [0x5a8a3a, 0x5a8a3a, 0x3a4a2a][t];
    b.ring(6, 0.2 + t * 0.03, 0, (y, z) => b.barrel([-0.35, hy + y, z], 1.15 + t * 0.15, 0.1 + t * 0.015, tube, { seg: 7 }));
    for (const x of [-0.15, 0.3, 0.65]) b.tor(0.33 + t * 0.05, 0.05, [x, hy, 0], 0x6a4a2a, { r: [0, Math.PI / 2, 0] });
    const nc = 2 + t * 3; for (let i = 0; i < nc; i++) { const z = (i % 2 ? 1 : -1) * (0.32 + (i >> 1) * 0.12), x = -0.3 + (i >> 1) * 0.18, y = hy - 0.35 - (i % 3) * 0.08; b.sph(0.14, 0.14, 0.14, [x, y, z], 0xc0141c); b.limb([x, y + 0.12, z], [x - 0.05, hy + 0.15, z * 0.6], 0.015, 0x3a6a1a); }
  },
  flame_melon_mortar(b, t) {
    mound(b, 1.0, t === 2 ? 0x2a1d18 : C.dirt);
    if (t === 2) b.ring(6, 0.6, 0, (x, z, a) => b.box(0.5, 0.03, 0.06, [x, 0.31, z], 0xff5010, { r: [0, -a, 0], glow: true }));
    b.head = true; const tr = [0x5a4a2a, 0x4a3a24, 0x3a2a20][t], w = 0.2 + t * 0.06;
    const top: V3 = [0.45, 2.05 + t * 0.1, 0];
    b.chain([[0, 0.25, 0], [-0.25, 0.9, 0], [0.05, 1.6, 0], top], w, tr, { taper: 0.85 });
    if (t >= 1) b.chain([[0.02, 0.25, 0.1], [-0.2, 1.0, 0.12]], 0.05, 0xff6a20, { glow: true });
    b.cyl(0.45, 0.2, 0.3, P(top, 0.05, 0.1, 0), 0x4a6a2a);
    const mc = t === 2 ? 0x2a6a8a : 0x2f7a2f; b.sph(0.3, 0.28, 0.3, P(top, 0.05, 0.32, 0), mc); for (const r of [-0.6, 0, 0.6]) b.tor(0.29, 0.02, P(top, 0.05, 0.32, 0), 0x1a4a1a, { r: [0, r, 0] });
    const fc = t === 2 ? 0x60c8ff : 0xff8a20, n = 3 + t * 2; for (let i = 0; i < n; i++) { const a = (i / n) * 6.28; b.cyl(0, 0.08 + 0.02 * t, 0.25 + 0.1 * t + b.rnd() * 0.15, P(top, 0.05 + Math.cos(a) * 0.15, 0.62 + 0.1 * t, Math.sin(a) * 0.15), i % 2 ? fc : 0xffd040, { glow: true, seg: 5 }); }
  },
  star_emperor(b, t) {
    mound(b); const lc = [0x3f7a2a, 0x2a5a9a, 0x3a2a7a][t], lc2 = [0x5a9a3a, 0x4a7ac0, 0x5a3aa0][t];
    for (let i = 0; i < 4; i++) b.ring(7, 0.15, 0, (x, z, a) => b.leaf([0, 0.4 + i * 0.42, 0], a + i * 0.4, 0.75 - i * 0.14, i % 2 ? lc : lc2, 0.7 - i * 0.05, 0.35));
    b.cyl(0.08, 0.14, 1.9, [0, 1.1, 0], 0x3a5a2a);
    b.pivot = [0, 2.35, 0]; b.head = true;
    b.star(0.42, 0.14, [0, 2.35, 0], 0xffd030, { r: [0, Math.PI / 2, 0] }); b.sph(0.12, 0.12, 0.12, [0.06, 2.35, 0], 0xfff6a0, { glow: true });
    if (t === 2) { b.cyl(0.2, 0.16, 0.16, [0, 2.86, 0], C.gold); b.ring(5, 0.18, 0, (x, z) => b.cyl(0, 0.04, 0.16, [x, 3.0, z], C.gold, { seg: 4 })); b.ring(6, 0.9, 0, (x, z) => b.sph(0.05, 0.05, 0.05, [x, 1.6 + Math.abs(x), z], 0xfff0a0, { glow: true })); }
  },
  frost_wallnut_bastion(b, t) {
    mound(b, 1.2, t ? 0x3a3430 : C.dirt); b.head = true;
    const nr = t === 0 ? 1.0 : 0.82; b.sph(nr, nr * 0.95, nr, [0, nr * 0.95, 0], 0x8a6040);
    for (const r of [0, 0.9, 1.8, 2.6]) b.tor(nr * 0.98, 0.05, [0, nr * 0.95, 0], 0x5a3a24, { r: [Math.PI / 2 + 0.3, r, 0] });
    if (t === 0) for (let i = 0; i < 6; i++) b.cyl(0, 0.08, 0.35, [Math.cos(i) * 0.5, 1.8, Math.sin(i) * 0.5], 0xd8f0ff, { seg: 4, r: [0.3, i, 0] });
    else { const n = t === 1 ? 9 : 14; for (let i = 0; i < n; i++) { const a = (i / n) * 6.28 + (i % 2) * 0.2, r = 0.95 + b.rnd() * 0.3, h = (t === 1 ? 1.2 : 1.8) + b.rnd() * (t === 1 ? 0.6 : 1.1);
      b.cyl(0, 0.18 + b.rnd() * 0.1, h, [Math.cos(a) * r, h / 2 + 0.2, Math.sin(a) * r], i % 3 ? 0x8ad0ff : 0xc8ecff, { seg: 5, r: [0, 0, 0], glow: t === 2 && i % 4 === 0 }); }
      if (t === 2) b.sph(0.35, 0.35, 0.35, [0, 2.1, 0], 0x60c0ff, { glow: true }); }
  },
  unsc_autoturret(b, t) {
    turretBase(b, t); const hy = 1.15, hc = [0x5a6050, 0x55594c, 0x4c5046][t];
    b.sph(0.6 + t * 0.06, 0.48, 0.6 + t * 0.06, [0, hy, 0], hc); b.box(0.5, 0.35, 0.9, [-0.1, hy + 0.15, 0], 0x464b40);
    const zs = t === 2 ? [-0.18, 0.18] : [0]; for (const z of zs) { b.barrel([0.4, hy, z], 1.1 + t * 0.2, 0.09, 0x2a2d2e); b.cyl(0.13, 0.13, 0.22, [1.5 + t * 0.2, hy, z], 0x1e2022, { r: [0, 0, Math.PI / 2], seg: 8 }); }
    if (t >= 1) for (const s of [1, -1]) b.box(0.6, 0.35, 0.08, [0.1, hy, 0.62 * s], 0x3e4239);
    if (t === 2) { b.cyl(0.08, 0.08, 0.35, [0.1, hy + 0.5, 0], 0x222222, { r: [0, 0, Math.PI / 2] }); b.cyl(0.06, 0.06, 0.02, [0.28, hy + 0.5, 0], 0xff5050, { r: [0, 0, Math.PI / 2], glow: true }); }
  },
  unsc_flak(b, t) {
    turretBase(b, t); const hy = 1.15;
    b.sph(0.6, 0.52, 0.65, [0, hy, 0], [0x585e4f, 0x535849, 0x4c5046][t]); b.box(0.4, 0.3, 0.5, [-0.25, hy + 0.3, 0], 0x464b40);
    const zs = t === 0 ? [0] : t === 1 ? [-0.32, 0.32] : [-0.36, -0.18, 0.18, 0.36], r = t === 2 ? 0.07 : 0.1;
    for (const z of zs) { b.barrel([0.3, hy, z], 1.05 + t * 0.1, r, 0x2a2d2e); b.cyl(r * 1.5, r * 1.5, 0.25, [1.3 + t * 0.1, hy, z], 0x1e2022, { r: [0, 0, Math.PI / 2], seg: 8 }); }
    if (t >= 1) for (const s of [1, -1]) b.sph(0.3, 0.3, 0.2, [0, hy, 0.62 * s], 0x40453c);
    if (t === 2) { b.box(0.25, 0.14, 0.2, [-0.2, hy + 0.55, 0], 0x3a6aff, { glow: true }); b.tor(0.62, 0.03, [0, hy - 0.1, 0], 0xd8a020, { r: [Math.PI / 2, 0, 0] }); }
  },
  unsc_rail(b, t) {
    turretBase(b, t); const hy = 1.2;
    b.sph(0.95, 0.42, 0.5, [-0.1, hy, 0], [0x5a6068, 0x555b62, 0x4a4f55][t]); b.box(0.9, 0.2, 0.6, [-0.3, hy + 0.3, 0], 0x40454b);
    for (const s of [1, -1]) b.box(1.7 + t * 0.2, 0.1, 0.07, [1.35 + t * 0.1, hy, 0.13 * s], 0x2a2d30);
    const n = 6 + t * 2; for (let i = 0; i < n; i++) b.tor(0.13, 0.035, [0.65 + i * 0.22, hy, 0], 0x40e0ff, { r: [0, Math.PI / 2, 0], glow: true });
    b.barrel([0.5, hy, 0], 1.7 + t * 0.2, 0.05, 0x9af4ff, { glow: true });
    if (t >= 1) for (const s of [1, -1]) { b.sph(0.45, 0.15, 0.15, [-0.1, hy, 0.62 * s], 0x50555c); b.limb([-0.1, hy, 0.5 * s], [-0.1, hy, 0.3 * s], 0.05, 0x333333); }
    if (t === 2) { b.sph(0.2, 0.2, 0.2, [0.45, hy, 0], 0x80ffff, { glow: true }); for (const s of [1, -1]) b.box(1.2, 0.04, 0.04, [-0.1, hy + 0.2, 0.5 * s], 0xd8a020); }
  },
  unsc_firebase(b, t) {
    const m = [0x5b5f55, 0x4f534c, 0x464a44][t];
    b.ring(16, 1.45, 0, (x, z, a) => b.sph(0.32, 0.18, 0.2, [x, 0.17, z], 0xa89a70, { r: [0, -a + Math.PI / 2, 0] })); b.ring(14, 1.42, 0, (x, z, a) => b.sph(0.32, 0.17, 0.2, [x, 0.45, z], 0x9a8c64, { r: [0, -a + Math.PI / 2, 0] }), 0.2);
    b.box(2.1, 1.0, 1.9, [0, 0.5, 0], m); b.box(2.3, 0.14, 2.1, [0, 1.06, 0], 0x3e423b); b.box(0.06, 0.16, 1.2, [1.06, 0.72, 0], 0x111111);
    if (t === 0) { b.limb([-0.8, 1.1, -0.7], [-0.8, 2.6, -0.7], 0.03, 0x888888); b.box(0.04, 0.45, 0.7, [-0.8, 2.35, -0.35], 0x2a5ab0); b.sph(0.1, 0.1, 0.02, [-0.78, 2.35, -0.35], 0xffffff); }
    if (t === 2) { b.box(0.9, 1.0, 0.9, [-0.3, 1.6, 0], 0x3e423b); b.box(0.92, 0.1, 0.92, [-0.3, 2.13, 0], 0x2a2d28); b.limb([-0.3, 2.1, 0], [-0.3, 3.4, 0], 0.03, 0x999999); b.sph(0.06, 0.06, 0.06, [-0.3, 3.42, 0], 0xff3030, { glow: true });
      b.box(0.05, 0.5, 0.5, [1.06, 0.3, 0.6], 0xffa040, { glow: true }); b.ring(4, 1.0, 0, (x, z) => b.sph(0.05, 0.05, 0.05, [x * 1.05, 1.17, z * 0.95], 0xffd040, { glow: true }), Math.PI / 4); }
    if (t >= 1) { b.pivot = [0.5, 1.2, 0.5]; b.head = true; b.cyl(0.05, 0.05, 0.35, [0.5, 1.3, 0.5], 0x666666); b.hemi(0.45, 0.18, 0.45, [0.62, 1.55, 0.5], 0xb0b4b0, { r: [0, 0, -1.2] }); b.limb([0.62, 1.55, 0.5], [0.95, 1.65, 0.5], 0.02, 0x333333); }
  },
  unsc_depot(b, t) {
    b.box(2.4, 0.22, 2.4, [0, 0.11, 0], 0x55574e); b.ring(4, 1.2, 0, (x, z, a) => b.box(0.08, 0.04, 1.6, [x, 0.23, z], 0xd8a020, { r: [0, -a, 0] }));
    const cr = 0x5a6040; b.box(0.7, 0.55, 0.7, [-0.6, 0.5, -0.55], cr); b.box(0.7, 0.55, 0.7, [-0.6, 0.5, 0.25], cr); b.box(0.6, 0.45, 0.6, [-0.6, 1.0, -0.15], 0x4e5438);
    b.cyl(0.22, 0.22, 0.6, [0.75, 0.52, -0.75], 0x3a4a2a); b.cyl(0.22, 0.22, 0.6, [0.75, 0.52, -0.25], 0x3a4a2a);
    if (t >= 1) { b.box(0.9, 0.85, 1.6, [0.55, 0.65, 0.4], 0x4a6a8a); for (let i = 0; i < 6; i++) b.box(0.92, 0.8, 0.03, [0.55, 0.65, -0.35 + i * 0.25], 0x3a5a7a);
      b.limb([-0.95, 0.2, 0.95], [-0.95, 2.4, 0.95], 0.08, 0xd8a020); b.limb([-0.95, 2.35, 0.95], [0.4, 2.1, 0.2], 0.06, 0xd8a020); b.limb([0.4, 2.1, 0.2], [0.4, 1.4, 0.2], 0.01, 0x222222); }
    if (t === 2) { b.sph(0.5, 0.85, 0.5, [0.1, 1.95, -0.2], 0x8a8a7a); b.cyl(0.35, 0.5, 0.3, [0.1, 1.15, -0.2], 0x444444); b.limb([1.0, 0.2, -1.0], [1.0, 2.8, -1.0], 0.035, 0x999999); b.sph(0.07, 0.07, 0.07, [1.0, 2.85, -1.0], 0xffa030, { glow: true });
      b.ring(4, 1.55, 0, (x, z) => b.sph(0.06, 0.06, 0.06, [x * 0.75, 0.26, z * 0.75], 0xffa030, { glow: true }), Math.PI / 4); }
  },
  sniper_monkey(b, t) {
    b.head = true; for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) b.sph(0.3, 0.16, 0.22, [0.95, 0.16 + j * 0.3, (i - 1) * 0.42 + j * 0.2], 0xa89a70);
    const suit = [0x4a5a2a, 0x4f5a3a, 0x24262a][t];
    const { rh } = monkey(b, { torso: suit, legs: suit, crouch: true, ghillie: t === 0 ? 0x5a6a2a : undefined, hat: t === 0 ? 'hood' : 'helmet', hatC: [0x55652a, 0x4a5235, 0x18191c][t], pack: t >= 1 ? 0x3a3f2a : undefined, belt: t >= 1 ? 0x2a2a1a : undefined });
    const g: V3 = [0.15, rh[1] + 0.08, 0.1]; b.box(0.75, 0.13, 0.08, [g[0] + 0.25, g[1], g[2]], 0x2a2a2a); b.barrel([g[0] + 0.6, g[1] + 0.02, g[2]], 0.9 + t * 0.15, 0.03, 0x1a1a1a);
    b.cyl(0.05, 0.05, 0.35, [g[0] + 0.35, g[1] + 0.12, g[2]], 0x111111, { r: [0, 0, Math.PI / 2] }); b.box(0.3, 0.12, 0.07, [g[0] - 0.2, g[1] - 0.04, g[2]], t ? 0x333333 : 0x6a4a2a);
    b.limb([g[0] + 1.2, g[1] - 0.02, g[2]], [g[0] + 1.25, g[1] - 0.35, g[2] + 0.12], 0.012, 0x222222); b.limb([g[0] + 1.2, g[1] - 0.02, g[2]], [g[0] + 1.25, g[1] - 0.35, g[2] - 0.12], 0.012, 0x222222);
    if (t === 2) b.barrel([g[0] + 1.5, g[1] - 0.05, g[2]], 1.6, 0.012, 0xff3030, { glow: true });
  },
  glue_slinger(b, t) {
    plinth(b, 0x5a5a4a); b.head = true; b.off = [0, 0.18, 0];
    const { rh, lh } = monkey(b, { torso: [0x6b4a2f, 0x5a3a24, 0xe0c020][t], legs: t === 2 ? 0xe0c020 : 0x4a3a2a, arms: t === 2 ? 0xe0c020 : undefined, hat: t === 2 ? 'hazmat' : 'none', hatC: 0xe0c020, pack: t === 2 ? 0xc8a818 : undefined, boots: t === 2 ? 0x222222 : undefined });
    if (t === 1) b.box(0.08, 0.8, 0.5, [0.37, 1.25, 0], 0x3a2a20);
    if (t === 0) { b.limb(rh, P(rh, 0.15, 0.2, 0.08), 0.025, 0x6a4a2a); b.limb(rh, P(rh, 0.15, 0.2, -0.08), 0.025, 0x6a4a2a); b.limb(P(rh, -0.05, -0.15, 0), rh, 0.03, 0x6a4a2a);
      b.cyl(0.18, 0.15, 0.3, [0.2, 0.33, -0.55], 0x777777); b.cyl(0.16, 0.16, 0.02, [0.2, 0.49, -0.55], 0x8aff40, { glow: true }); }
    else { const L = t === 1 ? 0.45 : 0.8, r = t === 1 ? 0.07 : 0.12; b.barrel(P(rh, -0.15, 0, -0.05), L, r, t === 1 ? 0x3a5a2a : 0x333333); b.sph(r * 1.6, r * 1.6, r * 1.6, P(rh, 0, 0.12, -0.05), 0x6ad030);
      b.cyl(r * 0.8, r * 0.8, 0.04, P(rh, L - 0.15, 0, -0.05), 0x8aff40, { r: [0, 0, Math.PI / 2], glow: true }); b.sph(0.06, 0.06, 0.06, lh, 0x8aff40); }
  },
  banana_drop(b, t) {
    const ban = (p: V3) => { for (let i = 0; i < 4; i++) b.tor(0.13, 0.035, [p[0] + (i - 1.5) * 0.08, p[1], p[2]], 0xf0d020, { r: [0, Math.PI / 2, i * 0.3] }); };
    if (t === 0) { b.box(2.0, 0.15, 2.0, [0, 0.08, 0], 0x7a5a3a); for (const [x, z] of [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]] as [number, number][]) { b.box(0.8, 0.55, 0.8, [x, 0.43, z], C.wood); ban([x, 0.75, z]); }
      b.limb([-0.8, 0.2, -0.8], [-0.8, 2.6, -0.8], 0.03, 0x6a4a2a); b.box(0.04, 0.6, 0.8, [-0.8, 2.25, -0.4], 0xeee8d8); ban([-0.76, 2.25, -0.4]); }
    else if (t === 1) { b.box(1.8, 0.08, 1.4, [0, 1.0, 0], C.wood); for (const x of [-0.8, 0.8]) for (const z of [-0.6, 0.6]) b.limb([x, 0, z], [x, 1.0, z], 0.05, 0x5a3a20);
      b.box(0.7, 0.45, 0.6, [-0.3, 1.27, 0], C.wood); ban([-0.3, 1.55, 0]); ban([0.4, 1.12, 0.2]);
      b.limb([0.6, 1.0, -0.4], [0.6, 2.7, -0.4], 0.03, 0xdddddd); b.ring(8, 0, 0, (_, __, a, i) => b.cyl(0, 0.9, 0.45, [0.6, 2.55, -0.4], i % 2 ? 0xf0d040 : 0x4a9a3a, { seg: 8, r: [0, a, 0] })); }
    else { b.cyl(1.25, 1.35, 0.3, [0, 0.15, 0], 0x3a3d40, { seg: 8 }); b.ring(8, 1.2, 0, (x, z, a, i) => b.box(0.06, 0.06, 0.5, [x, 0.32, z], i % 2 ? 0xd8a020 : 0x222222, { r: [0, -a, 0] }));
      for (const [x, z] of [[-0.5, 0.5], [0.5, 0.6], [0.2, -0.6]] as [number, number][]) { b.box(0.6, 0.5, 0.6, [x, 0.55, z], 0xd8a020); ban([x, 0.85, z]); }
      b.limb([-0.8, 0.3, -0.6], [-0.8, 2.6, -0.6], 0.08, 0x555555); b.limb([-0.8, 2.55, -0.6], [0.4, 2.3, 0.0], 0.06, 0x555555); b.sph(0.08, 0.08, 0.08, [-0.8, 2.7, -0.6], 0xffa030, { glow: true });
      b.ring(4, 1.0, 0, (x, z) => b.sph(0.06, 0.06, 0.06, [x, 0.36, z], 0x40ff80, { glow: true }), Math.PI / 4); }
  },
  sunflower(b, t) {
    mound(b); for (let i = 0; i < 6; i++) b.leaf([0, 0.35, 0], i * 1.05, 0.5, C.leaf, 0.3);
    const head = (p: V3, s: number) => {
      b.cyl(0.32 * s, 0.32 * s, 0.14 * s, p, 0x6a4020, { r: [0, 0, Math.PI / 2], seg: 14 });
      b.ring(14, 0.42 * s, 0, (y, z, a) => b.sph(0.05 * s, 0.24 * s, 0.11 * s, [p[0] - 0.02, p[1] + y, p[2] + z], t === 2 ? 0xffd040 : 0xf5c518, { r: [a - Math.PI / 2, 0, 0] }));
      for (const z of [-0.1, 0.1]) b.sph(0.04 * s, 0.06 * s, 0.04 * s, [p[0] + 0.08 * s, p[1] + 0.06 * s, p[2] + z * s], 0x111111);
      b.tor(0.1 * s, 0.02, [p[0] + 0.08 * s, p[1] - 0.08 * s, p[2]], 0x111111, { r: [0, Math.PI / 2, 0] });
      if (t === 2) b.sph(0.12 * s, 0.3 * s, 0.3 * s, [p[0] + 0.02, p[1], p[2]], 0xffe680, { glow: true });
    };
    b.chain([[0, 0.3, 0], [-0.05, 1.0, 0], [0.05, 1.7, 0]], 0.07, 0x4a8a2a); b.leaf([0, 0.95, 0], 1.6, 0.4, C.leaf, 0.4); b.leaf([0, 1.2, 0], -1.5, 0.35, C.leaf, 0.4);
    if (t === 1) { b.chain([[0, 0.3, 0.1], [0.05, 0.9, 0.35], [0.1, 1.15, 0.45]], 0.05, 0x4a8a2a); head([0.15, 1.2, 0.45], 0.75); }
    b.pivot = [0.05, 1.95, 0]; b.head = true; head([0.08, 1.95, 0], t === 2 ? 1.35 : 1.05);
  },
  repeater_gatling(b, t) {
    mound(b); for (let i = 0; i < 7; i++) b.leaf([0, 0.35, 0], i * 0.9, 0.55, C.leaf, 0.3);
    if (t === 0) { for (const z of [-0.33, 0.33]) { b.chain([[0, 0.3, z * 0.5], [-0.05, 0.9, z], [0, 1.25, z]], 0.07, 0x4a8a2a); b.leaf([0, 0.9, z], z > 0 ? -1.4 : 1.4, 0.3, C.leaf); }
      b.pivot = [0, 1.4, 0]; b.head = true;
      for (const z of [-0.33, 0.33]) { b.sph(0.3, 0.3, 0.3, [0, 1.4, z], 0x6ab02a); b.barrel([0.15, 1.4, z], 0.4, 0.13, 0x6ab02a); b.cyl(0.11, 0.11, 0.02, [0.56, 1.4, z], 0x1a3a0a, { r: [0, 0, Math.PI / 2] }); for (const e of [-0.08, 0.08]) b.sph(0.04, 0.06, 0.04, [0.24, 1.5, z + e], 0x111111); }
      return; }
    const wood = t === 1 ? 0x6a4a2a : 0xb08a40; b.cyl(0.3, 0.5, 0.9, [0, 0.75, 0], 0x5a3a20, { seg: 7 });
    b.pivot = [0, 1.45, 0]; b.head = true; const hy = 1.45;
    b.barrel([-0.55, hy, 0], 0.9, 0.36, wood, { seg: 10 }); b.tor(0.37, 0.05, [-0.1, hy, 0], 0x3a2a14, { r: [0, Math.PI / 2, 0] });
    b.ring(6, 0.17, 0, (y, z) => b.barrel([0.3, hy + y, z], 0.75, 0.07, 0x333333, { seg: 6 }));
    b.cyl(0.28, 0.28, 0.06, [1.05, hy, 0], t === 2 ? 0x8aff40 : 0x333333, { r: [0, 0, Math.PI / 2], glow: t === 2 });
    for (let i = 0; i < 8; i++) { const a = i * 0.45; b.sph(0.09, 0.09, 0.09, [-0.25 + Math.sin(a) * 0.1, hy - 0.4 - Math.sin(a) * 0.25, 0.42 + Math.cos(a) * 0.05 - i * 0.04], 0x7ad030); }
    if (t === 2) for (const s of [1, -1]) b.leaf([-0.4, hy + 0.2, 0.2 * s], s > 0 ? -2.3 : 2.3, 0.6, 0xc8a040, 0.6);
  },
  wallnut_barrier(b) {
    mound(b, 1.0); for (let i = 0; i < 6; i++) b.chain([[0, 0.5, 0], [Math.cos(i) * 0.6, 0.25, Math.sin(i) * 0.6], [Math.cos(i) * 0.9, 0.05, Math.sin(i) * 0.9]], 0.06, 0x6a4a2a);
    b.head = true; b.sph(0.72, 0.95, 0.68, [0, 1.1, 0], 0x9a6a3a); b.tor(0.69, 0.03, [0, 1.1, 0], 0x6a4426, { r: [Math.PI / 2, 0, 0.2] });
    for (const z of [-0.2, 0.2]) { b.sph(0.1, 0.12, 0.08, [0.63, 1.25, z], 0xf4ead0); b.sph(0.05, 0.06, 0.05, [0.72, 1.24, z], 0x111111); b.box(0.04, 0.05, 0.22, [0.68, 1.42, z * 1.1], 0x3a2614, { r: [z > 0 ? -0.4 : 0.4, 0, 0] }); }
    b.box(0.04, 0.04, 0.24, [0.7, 0.92, 0], 0x3a2614);
    for (let i = 0; i < 5; i++) b.leaf([0, 2.0, 0], i * 1.25, 0.45, C.leaf, 0.5);
  },
  cherry_pod(b) {
    b.hemi(0.95, 0.4, 0.75, [0, 0.4, 0], 0x7a5a3a, { r: [Math.PI, 0, 0] }); b.tor(0.9, 0.06, [0, 0.4, 0], 0x6a4a2a, { r: [Math.PI / 2, 0, 0] });
    b.head = true;
    for (const z of [-0.38, 0.38]) { b.sph(0.45, 0.43, 0.45, [0, 0.75, z], 0xc0141c); b.sph(0.12, 0.08, 0.12, [-0.15, 1.05, z - 0.1], 0xff8080);
      for (const e of [-0.1, 0.1]) b.sph(0.06, 0.06, 0.04, [0.41, 0.85, z + e], 0x111111); b.box(0.04, 0.04, 0.16, [0.42, 0.97, z], 0x2a0a0a, { r: [z > 0 ? -0.5 : 0.5, 0, 0] }); b.box(0.04, 0.04, 0.2, [0.43, 0.6, z], 0x2a0a0a);
      b.chain([[0, 1.15, z * 0.9], [0.05, 1.6, z * 0.3], [0.1, 1.85, 0]], 0.03, 0x3a7a1a); }
    b.sph(0.14, 0.14, 0.14, [0.1, 1.95, 0], 0xffd040, { glow: true }); b.ring(6, 0.18, 0, (x, z) => b.cyl(0, 0.03, 0.2, [0.1 + x, 1.95, z], 0xff8020, { glow: true, seg: 4, r: [z * 5, 0, -x * 5] }));
  },
  stone_wall(b, t) {
    const st = [0x6a6660, 0x5e5a55, 0x4a4845][t], h = 0.9 + t * 0.25;
    b.ring(12, 1.35, 0, (x, z, a) => b.sph(0.32, 0.17, 0.2, [x * 1.05, 0.17, z * 0.95], 0xa89a70, { r: [0, -a + Math.PI / 2, 0] }));
    b.box(2.2, h, 0.32, [0, h / 2, 0.8], st); b.box(2.2, h, 0.32, [0, h / 2, -0.8], st); b.box(0.32, h, 1.9, [0.95, h / 2, 0], st); b.box(0.32, h, 1.9, [-0.95, h / 2, 0], st);
    b.box(1.7, 0.1, 1.3, [0, 0.12, 0], 0x4a4036);
    if (t >= 1) { for (let i = 0; i < 5; i++) { b.box(0.28, 0.25, 0.36, [-0.88 + i * 0.44, h + 0.12, 0.8], st); b.box(0.28, 0.25, 0.36, [-0.88 + i * 0.44, h + 0.12, -0.8], st); } b.box(0.05, 0.6, 0.45, [1.12, 0.3, 0], 0x2a2018); }
    if (t === 2) { b.box(0.9, 1.9, 0.9, [-0.2, 0.95, 0], 0x3e3c3a); b.box(0.92, 0.06, 0.92, [-0.2, 1.4, 0], 0x40a0ff, { glow: true }); b.box(1.0, 0.12, 1.0, [-0.2, 1.95, 0], 0x2a2a2a);
      b.limb([-0.2, 2.0, 0], [-0.2, 3.1, 0], 0.03, 0x999999); b.sph(0.06, 0.06, 0.06, [-0.2, 3.12, 0], 0xff3030, { glow: true }); }
  },
  boomerang_monkey(b, t) {
    plinth(b); b.head = true; b.off = [0, 0.18, 0];
    const { rh } = monkey(b, { torso: [0x6a4a2a, 0x4a3420, 0x9a6a30][t], legs: 0x4a3a2a, hat: t === 1 ? 'cowboy' : 'none', hatC: 0x5a3a20, belt: t === 1 ? 0x2a1a10 : undefined, armor: t === 2 ? 0xb08040 : undefined, scarf: t === 1 ? 0x8a2a2a : undefined });
    const bc = t === 2 ? 0xffc840 : 0x8a5a2a; b.box(0.42, 0.04, 0.1, P(rh, 0.12, 0.12, 0.08), bc, { r: [0, 0, 0.6], glow: t === 2 }); b.box(0.42, 0.04, 0.1, P(rh, 0.12, -0.08, 0.08), bc, { r: [0, 0, -0.6], glow: t === 2 });
    if (t >= 1) b.limb([-0.3, 1.0, -0.3], [-0.3, 1.9, -0.25], 0.025, 0x6a4a2a);
  },
  hypno_shroom(b, t) {
    mound(b, 1.0, 0x4a3a3a); b.cyl(0.38, 0.55, 1.2, [0, 0.75, 0], 0xf0d8e0, { seg: 10 });
    for (const z of [-0.15, 0.15]) { b.sph(0.05, 0.07, 0.05, [0.45, 1.05, z], 0x2a1a2a); b.box(0.02, 0.02, 0.1, [0.46, 1.13, z], 0x2a1a2a, { r: [z > 0 ? 0.3 : -0.3, 0, 0] }); }
    b.hemi(1.15, 0.8, 1.15, [0, 1.25, 0], [0xe060b0, 0xe868c0, 0xf070c0][t]); b.cyl(1.1, 1.15, 0.06, [0, 1.24, 0], 0xc8509a, { seg: 12 });
    for (let i = 0; i < 4; i++) { const r = 0.2 + i * 0.22; b.tor(r, 0.04, [0, 1.27 + 0.8 * Math.sqrt(Math.max(0, 1 - (r / 1.15) ** 2)), 0], 0x8a2ab0, { r: [Math.PI / 2, 0, 0] }); }
    if (t >= 1) b.ring(t === 1 ? 3 : 6, 0.95, 0, (x, z, _, i) => { const s = 0.3 + (i % 3) * 0.08; b.cyl(0.06, 0.08, s, [x, 0.3 + s / 2, z], 0xf0d8e0); b.hemi(s * 0.7, s * 0.5, s * 0.7, [x, 0.3 + s, z], 0xd050c0); }, 0.5);
    if (t === 2) for (let i = 0; i < 8; i++) b.sph(0.05, 0.05, 0.05, [Math.cos(i) * 1.2, 1.5 + (i % 3) * 0.4, Math.sin(i) * 1.2], 0xff80ff, { glow: true });
  },
  chomper(b, t) {
    mound(b); for (let i = 0; i < 6; i++) b.leaf([0, 0.35, 0], i * 1.05, 0.6, 0x3a7a2a, 0.3);
    const pc = [0x7a2a7a, 0x5a1a5a, 0x4a1a4a][t];
    if (t === 2) { b.sph(0.45, 0.6, 0.45, [0, 1.0, 0], 0x3a2a3a); b.tor(0.42, 0.05, [0, 1.15, 0], C.gold, { r: [Math.PI / 2, 0, 0] }); for (const s of [1, -1]) b.chain([[0, 1.0, 0.25 * s], [0.1, 0.5, 0.3 * s], [0, 0.1, 0.3 * s]], 0.12, 0x3a2a3a); }
    else b.chain([[0, 0.3, 0], [-0.15, 0.9, 0], [0.0, 1.45, 0]], 0.1, 0x3a7a2a);
    if (t >= 1) for (const s of [1, -1]) b.chain([[0, 1.0, 0.1 * s], [-0.3, 0.8, 0.45 * s], [-0.5, 0.95, 0.6 * s]], 0.05, pc);
    b.pivot = [0.1, 1.75, 0]; b.head = true; const p: V3 = [0.15, 1.75, 0];
    b.hemi(0.55, 0.42, 0.48, P(p, 0, 0.04, 0), pc, { r: [0, 0, -0.35] }); b.hemi(0.5, 0.3, 0.44, P(p, 0, -0.04, 0), pc, { r: [Math.PI, 0, 0.3] });
    b.sph(0.4, 0.05, 0.36, P(p, 0.12, -0.02, 0), 0xb03040);
    for (let i = 0; i < 7; i++) { const a = -1.2 + i * 0.4; b.cyl(0, 0.045, 0.16, P(p, 0.3 + Math.cos(a) * 0.15, 0.07, Math.sin(a) * 0.38), 0xf4f0e0, { seg: 4, r: [0, 0, Math.PI] }); b.cyl(0, 0.045, 0.14, P(p, 0.3 + Math.cos(a) * 0.15, -0.08, Math.sin(a) * 0.36), 0xf4f0e0, { seg: 4 }); }
    for (let i = 0; i < 5; i++) b.sph(0.07, 0.07, 0.07, P(p, -0.1 + i * 0.1, 0.36 - Math.abs(i - 2) * 0.04, 0), 0x9a4a9a);
    if (t === 2) { b.cyl(0.24, 0.2, 0.14, P(p, -0.1, 0.48, 0), C.gold); b.ring(5, 0.22, 0, (x, z) => b.cyl(0, 0.05, 0.18, P(p, -0.1 + x, 0.62, z), C.gold, { seg: 4 })); b.sph(0.05, 0.05, 0.05, P(p, 0.12, 0.5, 0), 0xff40a0, { glow: true }); }
  },
  tesla_coil(b, t) {
    const br = 0x6a4a3a, cu = t === 2 ? 0xd8a840 : 0xc07a3a, H = 1 + t * 0.12;
    b.cyl(0.95, 1.05, 0.5, [0, 0.25, 0], br, { seg: 8 }); b.cyl(0.65, 0.8, 0.75 * H, [0, 0.5 + 0.37 * H, 0], 0x7a5a48, { seg: 8 }); b.cyl(0.42, 0.55, 0.85 * H, [0, 0.5 + 0.75 * H + 0.42 * H, 0], 0x5a4a40, { seg: 8 });
    const top = 0.5 + 1.6 * H;
    for (const y of [0.5, 0.5 + 0.75 * H, top - 0.1]) b.tor(y > 1.5 ? 0.45 : y > 1 ? 0.62 : 0.8, 0.06, [0, y, 0], cu, { r: [Math.PI / 2, 0, 0] });
    for (let i = 0; i < 6; i++) b.tor(0.3 - i * 0.025, 0.035, [0, top + 0.1 + i * 0.12, 0], cu, { r: [Math.PI / 2, 0, 0] });
    b.limb([0, top, 0], [0, top + 0.85, 0], 0.08, 0x3a3a3a);
    b.sph(0.3, 0.3, 0.3, [0, top + 1.0, 0], t ? 0x80d8ff : cu, { glow: t > 0 });
    if (t >= 1) for (let i = 0; i < 3 + t * 2; i++) { const a = i * 2.1; b.limb([0, top + 1.0, 0], [Math.cos(a) * 0.7, top + 0.6 + (i % 2) * 0.4, Math.sin(a) * 0.7], 0.015, 0xa0e8ff, { glow: true }); }
    if (t === 2) { b.ring(6, 0.5, 0, (x, z) => b.limb([x, top + 0.2, z], [x * 0.6, top + 1.25, z * 0.6], 0.025, C.gold)); b.ring(8, 0.85, 0, (x, z) => b.sph(0.05, 0.05, 0.05, [x, 0.55, z], 0x60c8ff, { glow: true })); }
  },
  arcane_obelisk(b, t) {
    const st = 0x77746c; b.box(1.3, 0.3, 1.3, [0, 0.15, 0], st); b.box(1.0, 0.2, 1.0, [0, 0.4, 0], 0x6a6860);
    const H = 2.6 + t * 0.3; b.cyl(0.24, 0.5, H, [0, 0.5 + H / 2, 0], 0x625f68, { seg: 4, r: [0, Math.PI / 4, 0] }); b.cyl(0, 0.24, 0.4, [0, 0.7 + H, 0], 0x625f68, { seg: 4, r: [0, Math.PI / 4, 0] });
    for (let s = 0; s < 4; s++) { const a = (s * Math.PI) / 2, w = 0.36 - 0.0; for (let i = 0; i < 4; i++) { const y = 0.9 + i * H * 0.2, r = 0.5 - ((y - 0.5) / H) * 0.26; b.box(0.02, 0.18, 0.12, [Math.cos(a) * r * 0.72, y, Math.sin(a) * r * 0.72], 0xa060ff, { r: [0, -a, 0], glow: true }); } void w; }
    if (t >= 1) { const y = 1.15 + H; b.cyl(0, 0.2, 0.35, [0, y + 0.17, 0], 0xb080ff, { glow: true, seg: 4 }); b.cyl(0.2, 0, 0.3, [0, y - 0.15, 0], 0x9060e0, { glow: true, seg: 4 }); }
    if (t === 2) b.ring(4, 0.85, 0, (x, z) => { b.cyl(0, 0.1, 0.22, [x, 2.4, z], 0xd0a0ff, { glow: true, seg: 4 }); b.cyl(0.1, 0, 0.18, [x, 2.2, z], 0xa070ff, { glow: true, seg: 4 }); });
  },
};

// ---------------------------------------------------------------------------------------------- merge + cache (t64: textured by MatKind)
interface Bucket { g: THREE.BufferGeometry; mat: MatKind }
interface Built { base: Bucket[]; head: Bucket[]; pivot: V3; height: number }
const CACHE = new Map<string, Built>();
function mergeParts(parts: Part[], pivot?: V3): THREE.BufferGeometry | null {
  if (!parts.length) return null;
  const col = new THREE.Color(), gs = parts.map((p) => {
    const g = p.g.clone(); g.applyMatrix4(p.m); if (pivot) g.translate(-pivot[0], -pivot[1], -pivot[2]);
    const n = g.attributes.position.count, a = new Float32Array(n * 3); col.setHex(p.c);
    // gold/metal tints stay bright so the texture reads as ornate plating; others slightly lifted
    const lift = p.mat === 'gold' || p.mat === 'metal' || p.mat === 'iron' ? 1.15 : 1.05;
    for (let i = 0; i < n; i++) a.set([Math.min(1, col.r * lift), Math.min(1, col.g * lift), Math.min(1, col.b * lift)], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g;
  });
  const m = mergeGeometries(gs, false); gs.forEach((g) => g.dispose()); return m;
}
function buckets(parts: Part[], pivot?: V3): Bucket[] {
  const by = new Map<MatKind, Part[]>();
  for (const p of parts) { const k = p.mat; const a = by.get(k); if (a) a.push(p); else by.set(k, [p]); }
  const out: Bucket[] = [];
  for (const [mat, ps] of by) { const g = mergeParts(ps, pivot); if (g) out.push({ g, mat }); }
  return out;
}
export const HAS_3D = (id: string) => id in T;
function build(id: string, tier: number): Built | null {
  const k = id + ':' + tier; let r = CACHE.get(k); if (r) return r;
  const fn = T[id]; if (!fn) return null;
  const b = new B(); fn(b, tier);
  const pv = b.pivot;
  const base = buckets(b.parts.filter((p) => !p.head), undefined);
  const head = buckets(b.parts.filter((p) => p.head), pv);
  const box = new THREE.Box3(); for (const p of b.parts) { const g = p.g; if (!g.boundingBox) g.computeBoundingBox(); box.union(g.boundingBox!.clone().applyMatrix4(p.m)); }
  r = { base, head, pivot: pv, height: box.max.y };
  CACHE.set(k, r); return r;
}
/** New scene objects for a tower tier: `root` (static) holding `head` (rotate head.rotation.y = -aim). */
const SCALE: Record<string, number> = { dart_monkey: 1.2, ninja_monkey: 1.2, wizard_monkey: 1.2, super_monkey: 1.2, boomerang_monkey: 1.2, glue_slinger: 1.2, sniper_monkey: 1.2, cherry_pod: 1.3 };
export function towerMesh(id: string, tier: number): { root: THREE.Group; head: THREE.Group; height: number } | null {
  const bt = build(id, tier); if (!bt) return null;
  const root = new THREE.Group(), head = new THREE.Group(); head.position.set(...bt.pivot); root.add(head); root.scale.setScalar(SCALE[id] ?? 1);
  for (const b of bt.base) { const m = new THREE.Mesh(b.g, matOf(b.mat)); m.castShadow = b.mat !== 'glow'; root.add(m); }
  for (const b of bt.head) { const m = new THREE.Mesh(b.g, matOf(b.mat)); m.castShadow = b.mat !== 'glow'; head.add(m); }
  root.userData.tower3d = id + ':' + tier; root.userData.textured = true; return { root, head, height: bt.height * (SCALE[id] ?? 1) };
}
export const TOWER_3D_IDS = Object.keys(T);
