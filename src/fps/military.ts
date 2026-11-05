// t42: real-world-scaled military models for first person (lazy three.js chunk only).
// Sources (all CC0): Quaternius Animated Tank Pack (tanks), kazuma "Helicopter" (Poly Pizza),
// Kenney Weapon Pack (guns), Kenney Survival Kit (crates, barrels, tent, fortified fence).
// Converted by art_src/tools/mil_convert.mjs -> public/assets/military/*.glb (meshopt, no skins).
// Every model is normalised here: metres, base on y=0, centred, FRONT = +X (three yaw = -aim).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { assetUrl } from '../assetUrl';
import { matOf, type MatKind } from './mats';

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const cache = new Map<string, Promise<THREE.Group>>();
function raw(name: string) {
  let p = cache.get(name);
  if (!p) { p = loader.loadAsync(assetUrl(`assets/military/${name}.glb`)).then((g) => g.scene); cache.set(name, p); }
  return p;
}
const lam = (c: number, kind: MatKind = 'paint') => {
  const m = (matOf(kind) as THREE.MeshStandardMaterial).clone();
  if ('color' in m) m.color.setHex(c);
  return m;
};
const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T => { o.position.set(x, y, z); return o; };

/** Real-world sizes (metres): longest horizontal extent. */
export const SIZE = {
  tank: [7.6, 8.6, 9.6], heli: [11, 12, 13.2],
  barrel: 0.95, crate: 0.8, crate_large: 1.25, tent: 4.2, barrier: 2.6, sandbags: 2.6,
  gun_rifle: 0.86, gun_rocket: 1.15, gun_sniper: 1.18, gun_shotgun: 0.98, gun_pistol: 0.21, gun_smg: 0.52,
} as const;
/** Model front axis in the source file (radians to rotate about Y so the front becomes +X). */
const FRONT: Record<string, number> = { tank_1: Math.PI, tank_2: Math.PI, tank_3: Math.PI, heli: Math.PI / 2 };

/** Wrap a clone so it is `len` metres long, sits on y=0, centred on x/z, front = +X. */
export function normalise(src: THREE.Object3D, len: number, yaw = 0, height?: number): THREE.Group {
  const inner = src.clone(true); inner.rotation.y = yaw; inner.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(inner), sz = box.getSize(new THREE.Vector3());
  const k = height ? height / sz.y : len / Math.max(sz.x, sz.z);
  const wrap = new THREE.Group(), mid = new THREE.Group(); mid.add(inner);
  inner.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
  mid.scale.setScalar(k); wrap.add(mid);
  return wrap;
}
function recolor(o: THREE.Object3D, f: (name: string, c: THREE.Color) => number | null, dropMap = false, kind: MatKind = 'metal') {
  const proto = matOf(kind) as THREE.MeshStandardMaterial;
  o.traverse((m) => {
    const mesh = m as THREE.Mesh; if (!mesh.isMesh) return;
    const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[];
    mesh.material = mats.map((mt) => {
      const n = f(mt.name, mt.color ?? new THREE.Color(1, 1, 1));
      const out = proto.clone();
      out.color.set(n ?? mt.color ?? 0xffffff);
      if (!dropMap && mt.map) { out.map = mt.map; out.color.set(0xffffff); }
      out.name = mt.name; out.vertexColors = !!mesh.geometry.attributes.color;
      return out;
    }) as unknown as THREE.Material;
    if ((mesh.material as unknown as THREE.Material[]).length === 1) mesh.material = (mesh.material as unknown as THREE.Material[])[0];
    mesh.castShadow = true;
  });
}

// ---------------------------------------------------------------- tanks (3 tiers)
/** Tank tier t: hull + a turret pivot (`userData.turret`) that aims independently. */
export async function tank(t: number): Promise<THREE.Group> {
  const name = `tank_${Math.min(2, t) + 1}`, src = await raw(name);
  const g = normalise(src, SIZE.tank[Math.min(2, t)], FRONT[name]);
  // T2 (heavy) repainted Vanguard dark olive so it reads as the top tier next to the tan/olive ones
  if (t === 2) recolor(g, (n) => ({ Main: 0x6a7a50, Main_Dark: 0x4a5538, Main_Light: 0x8a9a68, Main_Details: 0x3a4030, Wheels: 0x3a4034 } as Record<string, number>)[n] ?? null, true, 'paint');
  else recolor(g, () => null);
  // re-parent turret + gun under a pivot at the turret centre so it can traverse
  const inner = g.children[0].children[0];
  inner.updateMatrixWorld(true); g.updateMatrixWorld(true);
  const parts = [] as THREE.Object3D[]; inner.traverse((o) => { if (/Turret|Gun/i.test(o.name) && (o as THREE.Mesh).isMesh) parts.push(o); });
  const tur = parts.find((p) => /Turret/i.test(p.name));
  const pivot = new THREE.Group();
  if (tur) {
    const c = new THREE.Box3().setFromObject(tur).getCenter(new THREE.Vector3());
    pivot.position.set(c.x, 0, c.z); g.add(pivot); pivot.updateMatrixWorld(true);
    for (const p of parts) pivot.attach(p);
  }
  g.userData.turret = pivot;
  // tier extras: T1 side skirts, T2 reactive armour + independent roof gunner (matches last-tier secondary)
  const dark = lam(0x2a2e26, 'iron'), olive = lam(0x56603f, 'metal');
  if (t >= 1) {
    const b0 = new THREE.Box3().setFromObject(g);
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.1), olive), b0.min.x + 1.4 + i * 1.05, b0.max.y * 0.38, s * (b0.max.z + 0.02)));
  }
  if (t >= 2) {
    const b = new THREE.Box3().setFromObject(g);
    for (const s of [-1, 1]) for (let i = 0; i < 5; i++) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, 0.14), olive), b.min.x + 1.3 + i * 1.05, b.max.y * 0.42, s * (b.max.z + 0.02)));
    const ant = at(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 2.6, 4), dark), -1.2, 0, -0.7); ant.position.y = new THREE.Box3().setFromObject(pivot).max.y + 1.2; pivot.add(ant);
    // independent roof gunner cupola + MG
    const top = new THREE.Box3().setFromObject(pivot);
    const gunner = new THREE.Group();
    gunner.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.35, 8), olive), 0, 0.2, 0));
    gunner.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), lam(0x3a4030)), 0, 0.42, 0)); // helmet
    const mg = new THREE.Group(); mg.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.2, 0.2), dark), 0, 0, 0));
    mg.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.25, 6).rotateZ(Math.PI / 2), dark), 0.75, 0.03, 0));
    at(mg, 0.15, 0.55, 0.35); gunner.add(mg);
    at(gunner, (top.min.x + top.max.x) / 2 - 0.35 - pivot.position.x, top.max.y + 0.05, 0.35);
    pivot.add(gunner); g.userData.gunner = gunner;
  }
  g.userData.kind = 'tank'; g.userData.textured = true; return g;
}

/** Remove triangles lying entirely above `frac` of the model height (thin rotor blades). */
function stripTop(g: THREE.Group, frac: number) {
  g.updateMatrixWorld(true);
  const H = new THREE.Box3().setFromObject(g).max.y * frac, v = new THREE.Vector3();
  g.traverse((o) => {
    const m = o as THREE.Mesh; if (!m.isMesh) return;
    const geo = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(), pos = geo.attributes.position;
    const keep: number[] = [];
    for (let i = 0; i < pos.count; i += 3) {
      let hi = true; for (let k = 0; k < 3; k++) { v.fromBufferAttribute(pos, i + k).applyMatrix4(m.matrixWorld); if (v.y < H) hi = false; }
      if (!hi) keep.push(i, i + 1, i + 2);
    }
    const out = new THREE.BufferGeometry();
    for (const [name, a] of Object.entries(geo.attributes)) {
      const at2 = a as THREE.BufferAttribute, arr = new (at2.array.constructor as Float32ArrayConstructor)(keep.length * at2.itemSize);
      keep.forEach((src, j) => { for (let c = 0; c < at2.itemSize; c++) arr[j * at2.itemSize + c] = at2.array[src * at2.itemSize + c]; });
      out.setAttribute(name, new THREE.BufferAttribute(arr, at2.itemSize, at2.normalized));
    }
    m.geometry = out;
  });
}
// ---------------------------------------------------------------- helicopter (3 tiers)
/** Attack helicopter tier t, olive drab; `userData.rotor` / `userData.tail` spin. Base at y=0 (skids). */
export async function heli(t: number): Promise<THREE.Group> {
  const src = await raw('heli'), L = SIZE.heli[Math.min(2, t)];
  const g = normalise(src, L, FRONT.heli);
  // hide the source rotor blades (light grey material) and replace with a big spinning rotor
  const camo = [0x8a9a58, 0x7a8a4e, 0x6a7a44][Math.min(2, t)];
  stripTop(g, 0.9); // drop the source's static rotor blades (replaced by the spinning rotor below)
  // t64: paint/cloth kinds + brighter olives so the gunship reads in FP (old near-black metal looked like a silhouette).
  recolor(g, (n) => (n === 'Material.001' ? camo : n === 'Material.003' ? 0x3a4230 : n === 'Material.004' ? 0x4a5538 : 0x5a6840), true, 'paint');
  const b = new THREE.Box3().setFromObject(g), H = b.max.y, len = b.max.x - b.min.x;
  const blade = lam(0x1d201c, 'iron'), rotor = new THREE.Group();
  const nb = t >= 2 ? 5 : 4;
  for (let i = 0; i < nb; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(L * 0.47, 0.05, 0.32).translate(L * 0.235, 0, 0), blade); m.rotation.y = (i / nb) * Math.PI * 2; rotor.add(m); }
  rotor.add(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.4, 8), blade));
  const disc = new THREE.Mesh(new THREE.CircleGeometry(L * 0.47, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }));
  rotor.add(disc); rotor.position.set(b.min.x + len * 0.55, H + 0.15, 0); g.add(rotor);
  const tail = new THREE.Group();
  for (let i = 0; i < 2; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.16, L * 0.16, 0.04), blade); m.rotation.z = i * Math.PI / 2; tail.add(m); }
  tail.position.set(b.min.x + 0.25, H * 0.72, 0.28); g.add(tail);
  g.userData.rotor = rotor; g.userData.tail = tail;
  // weapons per tier: T0 chin gun, T1 + stub wings w/ rocket pods, T2 + strike rails + 2nd pods
  const dark = lam(0x22261f, 'iron'), pod = lam(0x3a4130, 'metal');
  const nose = b.max.x - len * 0.12;
  const chin = new THREE.Group(); chin.add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), dark));
  for (const s of [-0.07, 0.07]) chin.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 6).rotateZ(Math.PI / 2), dark), 0.65, 0, s));
  at(chin, nose, H * 0.18, 0); g.add(chin);
  if (t >= 1) {
    const wx = b.min.x + len * 0.55;
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 3.4), dark), wx, H * 0.38, 0));
    for (const s of [-1, 1]) {
      g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.5, 10).rotateZ(Math.PI / 2), pod), wx, H * 0.3, s * 1.2));
      if (t >= 2) {
        g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.5, 10).rotateZ(Math.PI / 2), pod), wx, H * 0.3, s * 1.65));
        for (const k of [0, 1]) g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.6, 6).rotateZ(Math.PI / 2), lam(0x6a6f60)), wx + 0.1, H * 0.22 - k * 0.22, s * 0.75));
      }
    }
  }
  g.userData.kind = 'heli'; g.userData.textured = true; return g;
}

// ---------------------------------------------------------------- naval (t57) — procedural, CC0 metal palette
/** Tidebreaker Destroyer: waterline hull ~12-16 m, deck guns aim via userData.turret. */
export function destroyer(t: number): THREE.Group {
  const g = new THREE.Group(), L = [12, 14, 16][Math.min(2, t)];
  const dark = lam(0x2a3038, 'iron'), hull = lam(0x5a6a78, 'metal'), deck = lam(0x6a7888, 'metal');
  const white = lam(0xd8dce0, 'paint'), rust = lam(0x6a4a3a, 'rust'), gold = lam(0xffb35a, 'gold');
  // hull with slight bow rake + waterline rust streak
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(L, 1.4, 3.2 + t * 0.3), hull), 0, 0.7, 0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(L * 0.98, 0.18, 3.25 + t * 0.3), rust), 0, 0.12, 0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(L * 0.92, 0.35, 3.0 + t * 0.25), deck), 0, 1.5, 0));
  g.add(at(new THREE.Mesh(new THREE.ConeGeometry(1.7 + t * 0.1, 2.8, 4).rotateZ(-Math.PI / 2), hull), L / 2 + 0.4, 0.85, 0));
  // deck detail plates
  for (let i = 0; i < 3 + t; i++) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 1.4), dark), -L * 0.25 + i * 1.5, 1.7, 0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6 + t * 0.3, 2.2), white), -0.5, 2.4, 0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.4), dark), -0.3, 3.5 + t * 0.15, 0));
  // bridge windows
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.08), lam(0x7ad0ff, 'paint')), -0.5, 2.9, 1.12));
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2 + t * 0.4, 6), dark), 0.4, 4.5 + t * 0.2, 0));
  if (t >= 1) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.6), lam(0x8fa0b0, 'metal')), 0.4, 5.6, 0));
  if (t >= 2) g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), gold), 0.4, 6.2, 0));
  const turret = new THREE.Group();
  const guns = 1 + t;
  for (let i = 0; i < guns; i++) {
    const gx = L * 0.22 - i * 2.4;
    const cup = new THREE.Group();
    cup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.5, 10), dark));
    cup.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.2 + t * 0.3, 8).rotateZ(Math.PI / 2), dark), 1.2, 0.1, 0));
    if (t >= 2) cup.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.35), gold), 0, 0.32, 0));
    at(cup, gx, 1.85, 0); turret.add(cup);
  }
  g.add(turret); g.userData.turret = turret; g.userData.kind = 'destroyer'; g.userData.textured = true;
  g.traverse((m) => { const mesh = m as THREE.Mesh; if (mesh.isMesh) mesh.castShadow = true; });
  return g;
}
/** Harbor Beacon lighthouse: tall striped tower with glowing lantern (userData.lamp). */
export function beacon(t: number): THREE.Group {
  const g = new THREE.Group(), H = 8 + t * 1.5;
  const dark = lam(0x3e4650, 'iron'), cream = lam(0xf4efe3, 'paint'), red = lam(0xc62828, 'paint');
  const stone = lam(0x8a9098, 'concrete'), gold = lam(0xe0b030, 'gold');
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 0.6, 12), stone), 0, 0.3, 0));
  // rocky pier ring
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.35 + (i % 3) * 0.08, 8, 6), stone), Math.cos(a) * 1.7, 0.25, Math.sin(a) * 1.7));
  }
  const bands = 3 + t;
  for (let i = 0; i < bands; i++) {
    const y0 = 0.6 + i * (H * 0.7 / bands), h = H * 0.7 / bands;
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.85 - i * 0.04, 0.9 - i * 0.04, h, 12), i % 2 ? red : cream), 0, y0 + h / 2, 0));
  }
  const lampY = 0.6 + H * 0.72 + 0.5;
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.35, 10), dark), 0, lampY, 0));
  // glass lantern cage
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.0 + t * 0.15, 10, 1, true), lam(0xa8d8ff, 'paint')), 0, lampY + 0.55, 0));
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.45 + t * 0.08, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd24a }));
  at(lamp, 0, lampY + 0.55, 0); g.add(lamp);
  g.add(at(new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.04, 6, 16), dark), 0, lampY, 0));
  if (t >= 1) g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.08, 12), gold), 0, lampY + 1.05, 0));
  if (t >= 2) g.add(at(new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.55, 8), dark), 0, lampY + 1.4, 0));
  g.userData.lamp = lamp; g.userData.kind = 'beacon'; g.userData.textured = true;
  g.traverse((m) => { const mesh = m as THREE.Mesh; if (mesh.isMesh && mesh !== lamp) mesh.castShadow = true; });
  return g;
}

// ---------------------------------------------------------------- props
/** Map prop clusters (2D sprite + 3D model share these): sandbag nest, supply stack, tent, barricade, fuel dump. */
import type { PropKind } from '../data/props';
export type { PropKind };
export const PROP_KINDS: PropKind[] = ['sandbags', 'supply', 'tent', 'barrier', 'fuel'];
/** Procedural sandbag wall (3 staggered rows of pillowy bags), SIZE.sandbags long. */
export function sandbagWall(): THREE.Group {
  const g = new THREE.Group(), bag = new THREE.SphereGeometry(0.5, 10, 6).scale(0.62, 0.26, 0.34);
  const cols = [0xb39f74, 0xa8946a, 0xbfad82].map((c) => lam(c, 'cloth'));
  const L = SIZE.sandbags, n = 4;
  for (let row = 0; row < 3; row++) for (let i = 0; i < n - (row % 2); i++) {
    const m = new THREE.Mesh(bag, cols[(i + row) % 3]); m.castShadow = true;
    m.position.set(-L / 2 + 0.33 + i * 0.62 + (row % 2) * 0.31, 0.13 + row * 0.24, 0); m.rotation.y = ((i * 7 + row * 3) % 5 - 2) * 0.04; g.add(m);
    if (row === 0) { const m2 = m.clone(); m2.position.z = 0.3; g.add(m2); }
  }
  return g;
}
/** Horseshoe sandbag nest (3 walls), ~3.4 m across: the classic firing position. */
export function sandbags(): THREE.Group {
  const g = new THREE.Group();
  const a = sandbagWall(); a.position.z = -1.2; g.add(a);
  const b = sandbagWall(); b.rotation.y = Math.PI / 2.6; b.position.set(-1.7, 0, 0.1); g.add(b);
  const c = sandbagWall(); c.rotation.y = -Math.PI / 2.6; c.position.set(1.7, 0, 0.1); g.add(c);
  return g;
}
async function piece(name: string, len: number, x: number, z: number, ry = 0, y = 0, col?: number) {
  const o = normalise(await raw(name), len); o.position.set(x, y, z); o.rotation.y = ry;
  if (col !== undefined) recolor(o, () => col, name === 'barrel'); else recolor(o, () => null);
  return o;
}
export async function prop(k: PropKind): Promise<THREE.Group> {
  if (k === 'sandbags') return sandbags();
  const g = new THREE.Group();
  if (k === 'supply') { // ammo crates + barrels on a pallet footprint ~3 x 2.4 m
    g.add(await piece('crate_large', SIZE.crate_large, -0.7, -0.3, 0.1, 0, 0x8a7a4e), await piece('crate_large', SIZE.crate_large, 0.62, -0.42, -0.08, 0, 0x7d7048));
    g.add(await piece('crate', SIZE.crate, -0.55, -0.25, 0.3, SIZE.crate_large * 0.98, 0x9a8a5a), await piece('crate', SIZE.crate, 0.4, 0.75, 0.6, 0, 0x8a7a4e));
    g.add(await piece('barrel', SIZE.barrel, 1.45, 0.55, 0, 0, 0x4f5f3a), await piece('barrel', SIZE.barrel, -1.35, 0.8, 0, 0, 0x4f5f3a));
  } else if (k === 'fuel') {
    for (const [x, z] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [1.4, 0.1]]) g.add(await piece('barrel', SIZE.barrel, x, z, x * 2, 0, x > 1 ? 0x8a2e22 : 0x4f5f3a));
  } else if (k === 'tent') {
    const t = await piece('tent', SIZE.tent, 0, 0, 0); recolor(t, () => 0x6f7550, true); g.add(t);
  } else if (k === 'barrier') {
    g.add(await piece('barrier', SIZE.barrier, -1.25, 0, 0.15, 0, 0x8a7a5a), await piece('barrier', SIZE.barrier, 1.25, 0, -0.15, 0, 0x8a7a5a));
  }
  return g;
}

// ---------------------------------------------------------------- first-person guns + gloved hands
export type GunKind = 'rifle' | 'rocket' | 'sniper' | 'shotgun' | 'pistol' | 'smg';
const GUN_MAT: Record<string, number> = { Gray8: 0x2a2d2f, Gray6: 0x42474a, Gray5: 0x6b6450, FrontColor: 0x4c5156 };
/** Gun model pointing -Z (camera forward), stock at z=0, grip origin; `userData.muzzle` = local tip. */
/** t51: textured PBR guns from Poly Haven (CC0): bolt_action_rifle_7_62 (rifle/sniper/shotgun/smg; the scope
 *  only on the sniper) and service_pistol, converted by art_src/tools/fp_assets_t51.mjs (512 px WebP base/ARM/normal).
 *  The rocket launcher stays on the Kenney Weapon Pack model (no CC0 textured launcher found), given a metal finish. */
const PH_GUN: Partial<Record<GunKind, string>> = { rifle: 'gun_rifle_ph', sniper: 'gun_rifle_ph', shotgun: 'gun_rifle_ph', smg: 'gun_rifle_ph', pistol: 'gun_pistol_ph' };
export async function gun(k: GunKind): Promise<THREE.Group> {
  const key = ('gun_' + k) as keyof typeof SIZE, ph = PH_GUN[k];
  let src: THREE.Object3D;
  if (ph) {
    src = (await raw(ph)).clone(true);
    const drop: THREE.Object3D[] = []; src.traverse((o) => { if (k !== 'sniper' && /scope/i.test(o.name)) drop.push(o); }); for (const o of drop) o.removeFromParent();
    src.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const mt = (m.material as THREE.MeshStandardMaterial).clone(); mt.envMapIntensity = 0.9; m.material = mt; m.castShadow = true; });
  } else src = await raw(key);
  const g = normalise(src, SIZE[key] as number);
  if (!ph) {
    recolor(g, (n) => GUN_MAT[n] ?? null);
    g.traverse((o) => { const mesh = o as THREE.Mesh, m = mesh.material as THREE.MeshLambertMaterial | undefined; if (!m || !m.color) return; // lift near-black parts to gunmetal; metal finish
      const c = m.color.getHSL({ h: 0, s: 0, l: 0 }).l < 0.12 ? new THREE.Color(0x3b4043) : m.color;
      mesh.material = new THREE.MeshStandardMaterial({ color: c, metalness: 0.55, roughness: 0.45, vertexColors: m.vertexColors }); });
  }
  g.updateMatrixWorld(true);
  // guns lie along Z. The muzzle is the end with the thinner (y) profile: barrel vs stock/grip.
  const b = new THREE.Box3().setFromObject(g), L = b.max.z - b.min.z, v = new THREE.Vector3();
  const prof = { lo: [Infinity, -Infinity], hi: [Infinity, -Infinity] };
  g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const p = m.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld); const e = v.z < b.min.z + L * 0.15 ? prof.lo : v.z > b.max.z - L * 0.15 ? prof.hi : null; if (e) { e[0] = Math.min(e[0], v.y); e[1] = Math.max(e[1], v.y); } } });
  const muzzleAtMinZ = prof.lo[1] - prof.lo[0] < prof.hi[1] - prof.hi[0];
  const out = new THREE.Group(); out.add(g);
  if (!muzzleAtMinZ) g.rotation.y = Math.PI; // muzzle -> -Z (camera forward)
  const muzzleY = muzzleAtMinZ ? (prof.lo[0] + prof.lo[1]) / 2 : (prof.hi[0] + prof.hi[1]) / 2;
  out.userData = { len: L, h: b.max.y, muzzle: new THREE.Vector3(0, muzzleY, -L / 2 - 0.02), gunKind: k, textured: !!ph };
  return out;
}
// t51: tactical leather gloves + woven fabric sleeves (Poly Haven brown_leather / denim_fabric_04, CC0, 256 px WebP)
let handTex: { glove: THREE.Texture; gloveN: THREE.Texture; fab: THREE.Texture; fabN: THREE.Texture } | null = null;
function texOf(f: string, srgb: boolean, rep: number) {
  const t = new THREE.TextureLoader().load(assetUrl(`assets/tex/${f}.webp`)); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
}
/** Gloved hand (palm block + wrapped fingers + thumb) and a sleeve, in metres. */
export function hand(sleeve = 0x4f5b3c, glove = 0x5a4a3a): THREE.Group {
  handTex ??= { glove: texOf('glove', true, 1), gloveN: texOf('glove_n', false, 1), fab: texOf('fabric', true, 2), fabN: texOf('fabric_n', false, 2) };
  const h = new THREE.Group();
  const gm = new THREE.MeshStandardMaterial({ color: glove, map: handTex.glove, normalMap: handTex.gloveN, roughness: 0.62, metalness: 0, envMapIntensity: 0.7 });
  const sm = new THREE.MeshStandardMaterial({ color: new THREE.Color(sleeve).multiplyScalar(1.6), map: handTex.fab, normalMap: handTex.fabN, roughness: 0.95, metalness: 0 });
  gm.name = 'glove_leather'; sm.name = 'sleeve_fabric';
  h.add(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 0.085), gm));
  for (let i = 0; i < 4; i++) h.add(at(new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.05, 2, 6).rotateZ(Math.PI / 2), gm), 0.02, 0.06 - i * 0.026, -0.05));
  h.add(at(new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.05, 2, 6).rotateX(Math.PI / 2.4), gm), -0.045, 0.04, -0.035));
  h.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.06, 10).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.7 })), 0, -0.065, 0.02)); // cuff
  const arm = at(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.42, 10), sm), 0.02, -0.28, 0.06); h.add(arm);
  h.userData.glove = true;
  return h;
}
export function gunFor(id: string, vehicle?: boolean): GunKind {
  if (vehicle) return 'rifle';
  return ({ odst: 'rifle', marine: 'rifle', spartan: 'rocket', line_watch: 'shotgun', paladin: 'pistol', ranger: 'sniper', monkey_soldier: 'smg' } as Record<string, GunKind>)[id] ?? 'rifle';
}

// ---------------------------------------------------------------- t50 burnt wrecks (Tropical warzone)
/** Burnt-out tank / downed helicopter: same CC0 models, charred + rusted, tilted, rotor gone. */
export async function wreck(k: 'tank' | 'tank2' | 'heli', seed = 0): Promise<THREE.Group> {
  const name = k === 'heli' ? 'heli' : k === 'tank2' ? 'tank_2' : 'tank_1';
  const g = normalise(await raw(name), k === 'heli' ? SIZE.heli[1] : SIZE.tank[1], FRONT[name]);
  if (k === 'heli') stripTop(g, 0.9);
  const pal = [0x2b2723, 0x35302a, 0x221f1c, 0x4a3324, 0x5a3b26];
  let i = seed; recolor(g, () => pal[(i++ * 7 + seed) % pal.length], true);
  const inner = g.children[0];
  if (k === 'heli') { inner.rotation.z = 0.42; inner.rotation.x = 0.12; inner.position.y = -0.35; }
  else {
    inner.rotation.z = 0.05 + (seed % 3) * 0.03; inner.position.y = -0.18;
    // blown turret: lift + skew the turret parts
    inner.traverse((o) => { if (/Turret|Gun/i.test(o.name) && (o as THREE.Mesh).isMesh) { o.rotation.y += 0.6 + seed * 0.2; o.rotation.z += 0.12; } });
  }
  g.userData.kind = 'wreck'; return g;
}
