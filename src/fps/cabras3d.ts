// t99: Isla de Cabras (map 'tropical') first-person realism pass — the El Morro t80/t93 method applied to the island.
// Fine 0.5 m heights from the USGS 3DEP lidar (public domain) lined up with the NOAA 2017 aerial (CC0) the 2D map uses, with
// per-cell floor classes classified from that photo (sand / riprap rock / asphalt / brick promenade) and El Canuelo
// (Fortin San Juan de la Cruz) carved in from the HABS PR-52 measured drawings (US public domain): 24.4 m square, battered walls,
// terracotta cordon, parapet with embrasures, NE garita, east entrance + stair to the gun deck. Built by
// art_src/tools/cabras_fort3d.py -> public/assets/maps/tropical/cabras3d.dat. Geometry is original three.js code; textures are
// the repo's Poly Haven CC0 set. Across the bay mouth, El Morro itself (its t80 lidar fort grid) stands on the horizon.
// The 2D sim / LOS are untouched: these heights only feed first-person standing height (standH).
import * as THREE from 'three';
import { assetUrl } from '../assetUrl';
import { fortMesh, loadFort, FORT, type FineWin, type FortGrid } from './morro3d';
import { Merge, garita93, slab, tex, weathered } from './morro93';
import { detailGround } from './groundTex';

/** Fine window on the 4416 x 2976 tropical map (game px of sample (0,0), px per sample). Mirrors cabras_fort3d.py. */
export const CABRAS: FineWin = { x0: 2, y0: 34, step: 4, cols: 1104, rows: 644, off: -5 };
/** El Canuelo: centre (map px), fort axes (unit, map px space) and the HABS dimensions (m above mean low water). */
export const CANUELO = { x: 356, y: 1386, ua: [Math.SQRT1_2, Math.SQRT1_2] as const, ub: [-Math.SQRT1_2, Math.SQRT1_2] as const, hs: 12.2, cordon: 5.3, parapet: 6.7, deck: 5.6, doorA: -4, doorW: 1.5 };
const MPP = 0.125;
export interface CabrasGrid extends FortGrid { fl: Uint8Array }

let gridP: Promise<CabrasGrid> | null = null;
export function loadCabras(): Promise<CabrasGrid> {
  return (gridP ??= fetch(assetUrl('assets/maps/tropical/cabras3d.dat')).then((r) => { if (!r.ok) throw new Error('cabras3d ' + r.status); return r.arrayBuffer(); }).then(async (raw) => {
    const b = new Uint8Array(raw), gz = b[0] === 0x1f && b[1] === 0x8b;
    const buf = gz ? await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer() : raw;
    const n = CABRAS.cols * CABRAS.rows, q = new Uint16Array(buf, 0, n), h = new Float32Array(n);
    for (let i = 0; i < n; i++) h[i] = q[i] / 100 + CABRAS.off;
    return { h, cls: new Uint8Array(buf, n * 2, n), fl: new Uint8Array(buf, n * 3, n) };
  }));
}
/** Fine (0.5 m) height at map px, or null outside the window. */
export function cabrasH(f: FortGrid, x: number, y: number): number | null {
  const W = CABRAS, fx = (x - W.x0) / W.step, fy = (y - W.y0) / W.step;
  if (fx < 0 || fy < 0 || fx > W.cols - 1.001 || fy > W.rows - 1.001) return null;
  const i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, c = W.cols, h = f.h;
  return (h[j * c + i] * (1 - u) + h[j * c + i + 1] * u) * (1 - v) + (h[(j + 1) * c + i] * (1 - u) + h[(j + 1) * c + i + 1] * u) * v;
}
/** Fort-local (a, b) metres -> map px. */
export function canueloPx(a: number, b: number): [number, number] {
  const C = CANUELO; return [C.x + (a * C.ua[0] + b * C.ub[0]) / MPP, C.y + (a * C.ua[1] + b * C.ub[1]) / MPP];
}

export interface CabrasSet { group: THREE.Group; update(dt: number): void; stats: { garitas: number; cordon: number; embrasures: number; cannons: number; lintel: number; morro: number; tris: number } }

/** El Canuelo's set pieces (garita, cordon, entrance lintel, cistern, iron guns) — merged per material. */
export function cabrasSet(f: CabrasGrid, S: number): CabrasSet {
  const group = new THREE.Group(); group.name = 'cabras_set';
  const C = CANUELO, mg = new Merge(), tPl = tex('mr_plaster'), tDk = tex('mr_deck');
  const M = {
    weath: weathered(0xd9c7a2, tPl, 0.8, 0.6), weathDim: weathered(0x7a6c58, tPl, 0.5, 0.2), interior: weathered(0x4a433b, tPl, 0.4, 0.1),
    cordon: weathered(0xa2593d, tPl, 0.5, 0.15), earth: new THREE.MeshStandardMaterial({ map: tDk, color: 0x8f8574, roughness: 1 }),
    slit: new THREE.MeshBasicMaterial({ color: 0xe6edf2 }), dark: new THREE.MeshBasicMaterial({ color: 0x15120e }),
    iron: new THREE.MeshStandardMaterial({ color: 0x26282b, roughness: 0.55, metalness: 0.55 }), wood: new THREE.MeshStandardMaterial({ color: 0x5b3f26, roughness: 0.9 }),
  } as Record<string, THREE.Material>;
  const st = { garitas: 0, cordon: 0, embrasures: 0, cannons: 0, lintel: 0, morro: 0, tris: 0 };
  const P = (a: number, b: number): [number, number] => { const [x, y] = canueloPx(a, b); return [x * S, y * S]; };
  // garita on the NE (a+, b+) corner: floor at the parapet walk, door facing the gun deck, corbel hanging to the cordon
  { const [x, z] = P(C.hs - 1.0, C.hs - 1.0), out = [C.ua[0] + C.ub[0], C.ua[1] + C.ub[1]], L = Math.hypot(out[0], out[1]);
    const mt = new THREE.Matrix4().makeTranslation(x, C.parapet - 0.1, z).multiply(new THREE.Matrix4().makeRotationY(Math.atan2(out[0] / L, out[1] / L)));
    garita93(mg, M, mt); st.garitas++; }
  // terracotta cordon (rounded torus moulding) round all four faces + corner knuckles
  const corners: [number, number][] = [[C.hs, C.hs], [C.hs, -C.hs], [-C.hs, -C.hs], [-C.hs, C.hs]];
  for (let i = 0; i < 4; i++) {
    const [a0, b0] = corners[i], [a1, b1] = corners[(i + 1) % 4], p = P(a0 * 1.006, b0 * 1.006), q = P(a1 * 1.006, b1 * 1.006);
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]), rod = new THREE.CylinderGeometry(0.17, 0.17, len, 10, 1).rotateZ(Math.PI / 2);
    const m = new THREE.Matrix4().makeTranslation((p[0] + q[0]) / 2, C.cordon, (p[1] + q[1]) / 2).multiply(new THREE.Matrix4().makeRotationY(-Math.atan2(q[1] - p[1], q[0] - p[0])));
    mg.add(rod, M.cordon, [len / 1.2, 0.4], m); mg.add(new THREE.SphereGeometry(0.19, 10, 6).translate(p[0], C.cordon, p[1]), M.cordon, 0.6); st.cordon++;
  }
  // entrance: lintel block over the passage through the east wall (stair carved in the heights behind it), dark reveal + old door frame
  { const w = C.doorW / 2 + 0.06, p0 = P(C.doorA, C.hs + 0.6), p1 = P(C.doorA, C.hs + 0.02), p2 = P(C.doorA, C.hs - 2.0), p3 = P(C.doorA, C.hs - 2.45);
    mg.add(slab(p1, p2, -w, w, 3.55, C.parapet, 3.55, C.parapet), M.weath, 2.4); mg.add(slab(p0, p1, -w, w, 3.55, C.cordon - 0.5, 3.55, C.cordon - 0.5), M.weath, 1.0); mg.add(slab(p2, p3, -w, w, 3.55, C.deck, 3.55, C.deck), M.weath, 2.4);
    mg.add(slab(p0, P(C.doorA, C.hs + 0.75), -w - 0.25, w + 0.25, 1.4, 3.75, 1.4, 3.75), M.weathDim, 1.0); st.lintel++; }
  // cistern curb + mouth in the middle of the gun deck (HABS sheet 1)
  { const [x, z] = P(0.5, 1.5); mg.add(new THREE.CylinderGeometry(0.75, 0.8, 0.5, 18).translate(x, C.deck + 0.25, z), M.weath, 1.2); mg.add(new THREE.CircleGeometry(0.55, 16).rotateX(-Math.PI / 2).translate(x, C.deck + 0.51, z), M.dark, null); }
  // two iron guns on garrison carriages behind north-face embrasures (muzzle out through the notch)
  for (const s of [-4.6, 2.2]) {
    const [x, z] = P(C.hs - 3.1, s), mt = new THREE.Matrix4().makeTranslation(x, C.deck, z).multiply(new THREE.Matrix4().makeRotationY(Math.atan2(-C.ua[0], -C.ua[1])));
    mg.add(new THREE.BoxGeometry(0.95, 0.5, 1.7).translate(0, 0.35, -1.1), M.wood, null, mt);
    for (const sx of [-1, 1]) for (const zz of [-0.5, -1.7]) mg.add(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 10).rotateZ(Math.PI / 2).translate(sx * 0.52, 0.22, zz), M.wood, null, mt);
    mg.add(new THREE.CylinderGeometry(0.15, 0.24, 2.7, 12).rotateX(Math.PI / 2).translate(0, 0.78, -0.6), M.iron, null, mt); st.cannons++;
  }
  st.embrasures = 12;
  st.tris = mg.build(group, 'cabras_canuelo');
  group.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group, update: () => {}, stats: st };
}

/** El Morro across the bay mouth: its t80 lidar fort grid (2 m mesh) + aerial, moved from the El Morro map frame into this one.
 *  Frames (UTM 19N, tropical_real.py / morro_real.py): morro centre 803757 E 2044655 N, +x at 142.8 deg; tropical 802455 E 2044410 N, +x north. */
export async function distantMorro(S: number): Promise<THREE.Group> {
  const f = await loadFort();
  const photo = await new THREE.TextureLoader().loadAsync(assetUrl('assets/maps/morro/ground.jpg')); photo.colorSpace = THREE.SRGBColorSpace;
  const mat = detailGround(new THREE.MeshLambertMaterial({ map: photo }), { slope: true, stone: 0.25 });
  const g = fortMesh(f, photo, S, 4416, 2976, 4, mat); g.name = 'distant_morro';
  const a = (142.8 * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a), hw = 2208 * MPP, hh = 1488 * MPP;
  const tx = -hw * dy + hh * dx + (2044655 - 2044410) + hw, tz = -hw * dx - hh * dy + (803757 - 802455) + hh;
  g.matrixAutoUpdate = false; g.matrix.set(dy, 0, -dx, tx, 0, 1, 0, 0, dx, 0, dy, tz, 0, 0, 0, 1); g.updateMatrixWorld(true);
  g.traverse((o) => { o.castShadow = false; o.frustumCulled = false; });
  g.userData.morroCells = FORT.cols * FORT.rows;
  return g;
}
