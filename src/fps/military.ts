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
  // Procedural meshes have no color attribute; vertexColors:true would multiply by black.
  m.vertexColors = false;
  if ('color' in m) {
    m.color.setHex(c);
    // Lift near-black bases that crush under metalness without an HDRI (t64/t65 silhouette bug).
    const lum = 0.2126 * m.color.r + 0.7152 * m.color.g + 0.0722 * m.color.b;
    if (lum < 0.08) {
      m.color.offsetHSL(0, 0, 0.14);
      if ('metalness' in m) m.metalness = Math.min(m.metalness, 0.28);
      if ('roughness' in m) m.roughness = Math.max(m.roughness, 0.62);
    }
  }
  return m;
};
const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T => { o.position.set(x, y, z); return o; };

// t65: photoreal CC0 photo materials (Poly Haven / ambientCG), vendored under public/assets/tex/.
const photoCache = new Map<string, THREE.Texture>();
function photoTex(name: string, srgb: boolean, rep = 2) {
  const key = name + ':' + rep + (srgb ? ':s' : '');
  let t = photoCache.get(key);
  if (t) return t;
  t = new THREE.TextureLoader().load(assetUrl(`assets/tex/${name}.webp`));
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rep, rep);
  t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  photoCache.set(key, t);
  return t;
}
/** Build a MeshStandardMaterial from a vendored photo albedo (+ optional normal/rough). No vertexColors. */
function photoMat(opts: {
  map: string; nor?: string; roughMap?: string; rep?: number;
  color?: number; metal?: number; rough?: number; flat?: boolean;
}): THREE.MeshStandardMaterial {
  const rep = opts.rep ?? 2.2;
  const m = new THREE.MeshStandardMaterial({
    map: photoTex(opts.map, true, rep),
    normalMap: opts.nor ? photoTex(opts.nor, false, rep) : null,
    roughnessMap: opts.roughMap ? photoTex(opts.roughMap, false, rep) : null,
    color: opts.color ?? 0xffffff,
    metalness: opts.metal ?? 0.1,
    roughness: opts.rough ?? 0.7,
    envMapIntensity: 0.85,
    flatShading: !!opts.flat,
    vertexColors: false,
  });
  // Clamp so medium-quality / no-HDRI never crushes to a black silhouette.
  m.metalness = Math.min(m.metalness, 0.22);
  m.roughness = Math.max(m.roughness, 0.55);
  // Soft fill — dusk + SwiftShader have almost no env light; keep painted steel readable.
  m.emissive = new THREE.Color(0x1a1c14);
  m.emissiveIntensity = 0.35;
  return m;
}

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
  // t65: photoreal painted-steel MBT — Poly Haven metal_plate + ambientCG Metal035, olive/tan bake.
  const hullMap = t >= 2 ? 'tank_olive' : 'tank_tan';
  const hull = photoMat({ map: hullMap, nor: 'tank_n', roughMap: 'tank_rough', rep: 2.4, color: 0xffffff, metal: 0.08, rough: 0.72 });
  const hullDark = photoMat({ map: hullMap, nor: 'tank_n', roughMap: 'tank_rough', rep: 2.8, color: 0xd8dcc8, metal: 0.1, rough: 0.75 });
  const track = photoMat({ map: 'tank_track', nor: 'tank_track_n', rep: 3.2, color: 0x6a6860, metal: 0.05, rough: 0.92 });
  const iron = photoMat({ map: 'tank_iron', nor: 'tank_iron_n', rep: 1.8, color: 0xc8c8c0, metal: 0.22, rough: 0.55 });
  g.traverse((o) => {
    const mesh = o as THREE.Mesh; if (!mesh.isMesh) return;
    const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[];
    const n = mats[0]?.name ?? '';
    let mat = hull;
    if (/Wheel/i.test(n) || /Wheel/i.test(mesh.name)) mat = track;
    else if (/Gun/i.test(n) || /Gun/i.test(mesh.name)) mat = iron;
    else if (/Dark|Detail/i.test(n)) mat = hullDark;
    else if (t === 2 && /Main_Light/i.test(n)) mat = photoMat({ map: hullMap, nor: 'tank_n', roughMap: 'tank_rough', rep: 2.0, color: 0xd0d8c0, metal: 0.18, rough: 0.55 });
    mesh.material = mat; mesh.castShadow = true;
  });
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
  const dark = iron, olive = hull;
  if (t >= 1) {
    const b0 = new THREE.Box3().setFromObject(g);
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.1), olive), b0.min.x + 1.4 + i * 1.05, b0.max.y * 0.38, s * (b0.max.z + 0.02)));
  }
  if (t >= 2) {
    const b = new THREE.Box3().setFromObject(g);
    for (const s of [-1, 1]) for (let i = 0; i < 5; i++) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, 0.14), olive), b.min.x + 1.3 + i * 1.05, b.max.y * 0.42, s * (b.max.z + 0.02)));
    // Roof = main turret body (largest XZ footprint). Using every Turret_* mesh floated the
    // cupola on top of a small hatch (Turret_2 ~3.2 m) above the flat roof (Turret_1 ~2.75 m).
    pivot.updateMatrixWorld(true);
    let best: THREE.Mesh | null = null, bestArea = -1;
    pivot.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !/Turret/i.test(mesh.name)) return;
      const b = new THREE.Box3().setFromObject(mesh), s = b.getSize(new THREE.Vector3());
      const area = s.x * s.z;
      if (area > bestArea) { bestArea = area; best = mesh; }
    });
    const roofBox = best ? new THREE.Box3().setFromObject(best) : new THREE.Box3().setFromObject(pivot);
    const roofY = roofBox.max.y;
    const roofCx = (roofBox.min.x + roofBox.max.x) / 2 - pivot.position.x;
    const ant = at(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 2.6, 4), dark), -1.2, roofY + 1.2, -0.7);
    pivot.add(ant);
    // Independent roof gunner cupola + MG, parented to the turret pivot so it turns with the tank.
    const gunner = new THREE.Group();
    // Base ring sunk into the turret roof so the cupola clearly reads as mounted, not hovering.
    gunner.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.4, 0.12, 10), olive), 0, 0.04, 0));
    gunner.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.32, 8), olive), 0, 0.26, 0));
    gunner.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), photoMat({ map: 'tank_track', nor: 'tank_track_n', rep: 1.5, color: 0x8a9068, metal: 0.05, rough: 0.85 })), 0, 0.48, 0)); // helmet
    const mg = new THREE.Group(); mg.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.2), dark), 0, 0, 0));
    mg.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.15, 6).rotateZ(Math.PI / 2), dark), 0.7, 0.02, 0));
    at(mg, 0.12, 0.48, 0.28); gunner.add(mg);
    at(gunner, roofCx - 0.35, roofY - 0.08, 0.35);
    pivot.add(gunner); g.userData.gunner = gunner;
  }
  g.userData.kind = 'tank'; g.userData.textured = true; return g;
}

/** Remove triangles with any vertex above world-Y `cutY` (clears rotor blades + mast stubs).
 *  Meshopt GLBs use interleaved normalised Int16 attrs — always read via getX/getComponent. */
function stripAbove(g: THREE.Group, cutY: number) {
  g.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  g.traverse((o) => {
    const m = o as THREE.Mesh; if (!m.isMesh) return;
    const geo0 = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
    const pos0 = geo0.attributes.position, n = pos0.count;
    const posArr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { posArr[i * 3] = pos0.getX(i); posArr[i * 3 + 1] = pos0.getY(i); posArr[i * 3 + 2] = pos0.getZ(i); }
    const keep: number[] = [];
    for (let i = 0; i < n; i += 3) {
      let above = false;
      for (let k = 0; k < 3; k++) {
        v.set(posArr[(i + k) * 3], posArr[(i + k) * 3 + 1], posArr[(i + k) * 3 + 2]).applyMatrix4(m.matrixWorld);
        if (v.y > cutY) above = true;
      }
      if (!above) keep.push(i, i + 1, i + 2);
    }
    if (keep.length === 0) { m.visible = false; return; }
    const out = new THREE.BufferGeometry();
    const outPos = new Float32Array(keep.length * 3);
    keep.forEach((src, j) => { outPos[j * 3] = posArr[src * 3]; outPos[j * 3 + 1] = posArr[src * 3 + 1]; outPos[j * 3 + 2] = posArr[src * 3 + 2]; });
    out.setAttribute('position', new THREE.BufferAttribute(outPos, 3));
    for (const name of Object.keys(geo0.attributes)) {
      if (name === 'position') continue;
      const a = geo0.attributes[name] as THREE.BufferAttribute;
      const arr = new Float32Array(keep.length * a.itemSize);
      for (let j = 0; j < keep.length; j++) for (let c = 0; c < a.itemSize; c++) arr[j * a.itemSize + c] = a.getComponent(keep[j], c);
      out.setAttribute(name, new THREE.BufferAttribute(arr, a.itemSize));
    }
    out.computeVertexNormals();
    m.geometry = out;
  });
}
// ---------------------------------------------------------------- helicopter (3 tiers)
/** Attack helicopter tier t, olive drab; `userData.rotor` / `userData.tail` spin. Base at y=0 (skids). */
export async function heli(t: number): Promise<THREE.Group> {
  const src = await raw('heli'), L = SIZE.heli[Math.min(2, t)];
  const g = normalise(src, L, FRONT.heli);
  // Capture cabin-roof hub BEFORE stripping blades. Old code used post-strip bbox max.y, which
  // still included straddling blade stubs → spinning rotor floated ~0.8 m above the fuselage.
  g.updateMatrixWorld(true);
  const pre = new THREE.Box3().setFromObject(g);
  const hubY = pre.min.y + (pre.max.y - pre.min.y) * 0.78;
  const hubX = pre.min.x + (pre.max.x - pre.min.x) * 0.55;
  stripAbove(g, hubY + 0.05); // drop source blades + mast stubs
  // t65: olive painted-steel photo mat (same bake as Bulwark) so the gunship isn't a flat silhouette.
  const camoTint = [0xffffff, 0xe8f0d8, 0xd0dcb8][Math.min(2, t)];
  const body = photoMat({ map: 'tank_olive', nor: 'tank_n', roughMap: 'tank_rough', rep: 2.6, color: camoTint, metal: 0.08, rough: 0.7 });
  const bodyDark = photoMat({ map: 'tank_olive', nor: 'tank_n', roughMap: 'tank_rough', rep: 3.0, color: 0xc8d0b0, metal: 0.1, rough: 0.72 });
  g.traverse((o) => {
    const mesh = o as THREE.Mesh; if (!mesh.isMesh) return;
    const n = ((Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material)?.name ?? '';
    mesh.material = /003|004/.test(n) ? bodyDark : body;
    mesh.castShadow = true;
  });
  const b = new THREE.Box3().setFromObject(g), H = b.max.y, len = b.max.x - b.min.x;
  const blade = photoMat({ map: 'tank_iron', nor: 'tank_iron_n', rep: 2.5, color: 0x6a7068, metal: 0.35, rough: 0.5 }), rotor = new THREE.Group();
  // Short mast so the hub reads as mounted on the roof, not hovering.
  rotor.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, Math.max(0.35, hubY + 0.32 - H), 8), blade), 0, -(hubY + 0.32 - H) / 2, 0));
  const nb = t >= 2 ? 5 : 4;
  for (let i = 0; i < nb; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(L * 0.47, 0.05, 0.32).translate(L * 0.235, 0, 0), blade); m.rotation.y = (i / nb) * Math.PI * 2; rotor.add(m); }
  rotor.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.28, 8), blade));
  const disc = new THREE.Mesh(new THREE.CircleGeometry(L * 0.47, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }));
  rotor.add(disc); rotor.position.set(hubX, hubY + 0.32, 0); g.add(rotor);
  const tail = new THREE.Group();
  for (let i = 0; i < 2; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.16, L * 0.16, 0.04), blade); m.rotation.z = i * Math.PI / 2; tail.add(m); }
  // Tail boom tip: rear (min.x), mid-height of remaining fuselage, slight +Z for the fin.
  tail.position.set(b.min.x + 0.35, Math.min(H * 0.92, hubY * 0.88), 0.42); g.add(tail);
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
/** Harbor Beacon lighthouse: photoreal white/red striped tower + lantern (CC0 photo mats, t65). */
export function beacon(t: number): THREE.Group {
  const g = new THREE.Group(), H = 8 + t * 1.5;
  // Photo materials — never pure-black * high metalness (that was the t65 black-pylon bug).
  const cream = photoMat({ map: 'lh_cream', nor: 'lh_paint_n', rep: 1.6, color: 0xfffaf0, metal: 0.0, rough: 0.82 });
  const red = photoMat({ map: 'lh_red', nor: 'lh_red_n', rep: 1.8, color: 0xffe0e0, metal: 0.0, rough: 0.78 });
  const brick = photoMat({ map: 'lh_brick', nor: 'lh_brick_n', rep: 2.4, metal: 0, rough: 0.9 });
  const rock = photoMat({ map: 'lh_rock', nor: 'lh_rock_n', rep: 1.8, metal: 0, rough: 0.95 });
  const slate = photoMat({ map: 'lh_slate', nor: 'tank_iron_n', rep: 2.0, metal: 0.25, rough: 0.55 });
  const rail = photoMat({ map: 'tank_iron', nor: 'tank_iron_n', rep: 3.0, color: 0xd0d6dc, metal: 0.35, rough: 0.4 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xc8e8ff, metalness: 0.05, roughness: 0.12, transparent: true, opacity: 0.42,
    envMapIntensity: 1.0, vertexColors: false, side: THREE.DoubleSide,
  });
  // Rocky pier + brick plinth
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.95, 0.55, 14), rock), 0, 0.28, 0));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.35 + (i % 3) * 0.08, 8, 6), rock), Math.cos(a) * 1.75, 0.22, Math.sin(a) * 1.75));
  }
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 0.45, 14), brick), 0, 0.7, 0));
  // Door
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.9, 0.12), lam(0x5a3a28, 'wood')), 0, 1.15, 1.05));
  // Alternating cream / red bands (silhouette matches painted unsc_beacon_*.webp)
  const bands = 4 + t;
  const shaftH = H * 0.68;
  for (let i = 0; i < bands; i++) {
    const h = shaftH / bands, y0 = 0.95 + i * h;
    const r0 = 0.95 - i * 0.035, r1 = 0.9 - i * 0.035;
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, h, 16), i % 2 ? red : cream), 0, y0 + h / 2, 0));
  }
  const galleryY = 0.95 + shaftH;
  // Gallery deck + railings
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.12, 16), slate), 0, galleryY, 0));
  g.add(at(new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.045, 6, 24), rail), 0, galleryY + 0.35, 0));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 5), rail), Math.cos(a) * 1.2, galleryY + 0.18, Math.sin(a) * 1.2));
  }
  // Lantern room — closed glass cage with warm lamp
  const lampY = galleryY + 0.7 + t * 0.05;
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 1.15 + t * 0.12, 14), glassMat), 0, lampY, 0));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.1 + t * 0.12, 0.07), slate), Math.cos(a) * 0.78, lampY, Math.sin(a) * 0.78));
  }
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.42 + t * 0.06, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd24a }));
  at(lamp, 0, lampY, 0); g.add(lamp);
  // Dark conical roof + finial
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.1, 14), slate), 0, lampY + 0.65 + t * 0.06, 0));
  g.add(at(new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.7 + t * 0.05, 14), slate), 0, lampY + 1.05 + t * 0.08, 0));
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), rail), 0, lampY + 1.45 + t * 0.1, 0));
  if (t >= 1) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.08), cream), 0.55, 0.95 + shaftH * 0.45, 0.7));
  if (t >= 2) g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 5), slate), 0.9, galleryY - 0.5, 0));
  g.userData.lamp = lamp; g.userData.kind = 'beacon'; g.userData.textured = true;
  g.traverse((m) => { const mesh = m as THREE.Mesh; if (mesh.isMesh && mesh !== lamp) mesh.castShadow = true; });
  return g;
}

// ---------------------------------------------------------------- props
/** Map prop clusters (2D sprite + 3D model share these): sandbag nest, supply stack, tent, barricade, fuel dump. */
import type { PropKind } from '../data/props';
export type { PropKind };
export const PROP_KINDS: PropKind[] = ['sandbags', 'supply', 'tent', 'barrier', 'fuel'];
/** One connected sandbag pile (t67): overlapping bags with no floaty gaps — reads as a single berm. */
export function sandbagWall(): THREE.Group {
  const g = new THREE.Group();
  const bag = new THREE.SphereGeometry(0.55, 10, 7).scale(0.72, 0.3, 0.4);
  // Cloth albedo — prefer vendored photo if present, else flat tan
  let mat: THREE.MeshStandardMaterial;
  try {
    const tex = photoTex('sandbag', true, 1.4);
    mat = new THREE.MeshStandardMaterial({ map: tex, color: 0xe8d9b0, roughness: 0.92, metalness: 0, envMapIntensity: 0.5, vertexColors: false });
    mat.emissive = new THREE.Color(0x1a1810); mat.emissiveIntensity = 0.2;
  } catch {
    mat = lam(0xb39f74, 'cloth') as THREE.MeshStandardMaterial;
  }
  const L = SIZE.sandbags;
  // Dense overlapping grid — bags share volume so nothing floats between them
  for (let row = 0; row < 4; row++) {
    const n = 5 - (row % 2);
    for (let i = 0; i < n; i++) {
      for (let z = 0; z < 2; z++) {
        const m = new THREE.Mesh(bag, mat); m.castShadow = true; m.receiveShadow = true;
        const x = -L / 2 + 0.28 + i * 0.52 + (row % 2) * 0.26;
        const y = 0.14 + row * 0.22;
        const zz = (z - 0.5) * 0.32 + (row % 2) * 0.06;
        m.position.set(x, y, zz);
        m.rotation.set(((i + row) % 5 - 2) * 0.05, ((i * 7 + row) % 5 - 2) * 0.08, ((i + z) % 3 - 1) * 0.06);
        g.add(m);
      }
    }
  }
  // Soft under-fill so the pile reads as one mass from the side
  const fill = new THREE.Mesh(new THREE.BoxGeometry(L * 0.95, 0.35, 0.85), mat);
  fill.position.set(0, 0.18, 0); fill.castShadow = true; g.add(fill);
  return g;
}
/** Horseshoe nest: three connected piles meeting at the corners (no gap at the joins). */
export function sandbags(): THREE.Group {
  const g = new THREE.Group();
  const a = sandbagWall(); a.position.z = -0.95; g.add(a);
  const b = sandbagWall(); b.rotation.y = Math.PI / 2.5; b.position.set(-1.35, 0, 0.15); g.add(b);
  const c = sandbagWall(); c.rotation.y = -Math.PI / 2.5; c.position.set(1.35, 0, 0.15); g.add(c);
  // Corner plugs so the horseshoe is one continuous berm
  const plug = photoMat({ map: 'sandbag', nor: 'sandbag_n', rep: 1.2, color: 0xe0d0a8, metal: 0, rough: 0.95 });
  for (const [x, z] of [[-1.1, -0.7], [1.1, -0.7]] as [number, number][]) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 6).scale(1.1, 0.7, 1.0), plug);
    m.position.set(x, 0.35, z); m.castShadow = true; g.add(m);
  }
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
  if (k === 'heli') {
    g.updateMatrixWorld(true);
    const pre = new THREE.Box3().setFromObject(g);
    stripAbove(g, pre.min.y + (pre.max.y - pre.min.y) * 0.78);
  }
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
