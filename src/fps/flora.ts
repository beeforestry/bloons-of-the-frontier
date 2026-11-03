// t50: real 3D plants + rocks for first person (replaces the cone-tree ring and the billboard props).
// Models: Kenney Nature Kit 2.1 (CC0, see CREDITS_military.md) in public/assets/flora/*.glb (~240 kB total,
// loaded lazily with the Possess chunk). Each model is baked to unit height and drawn as one
// InstancedMesh per material, so a whole map of trees is a handful of draw calls (phone-friendly).
// Burnt variant = same geometry with charred bark, shrunken dead crown (warzone / fortress).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetUrl } from '../assetUrl';

export const FLORA = {
  palm: 'tree_palmTall', palm_bend: 'tree_palmBend', palm_tall: 'tree_palmDetailedTall',
  oak: 'tree_oak', tree: 'tree_default', tree_detailed: 'tree_detailed', pine: 'tree_pineTallA_detailed', pine_round: 'tree_pineRoundC',
  bush: 'plant_bushDetailed', bush_big: 'plant_bushLarge',
  rock: 'rock_largeC', rock_big: 'rock_largeA', rock_tall: 'rock_tallB', rock_small: 'rock_smallC',
  stump: 'stump_old', stump_round: 'stump_roundDetailed', log: 'log_large',
} as const;
export type FloraKind = keyof typeof FLORA;
const LEAF = /leaf|grass/i, PALM = /palm/;
// realistic tints (the kit's flat colours are cartoon teal/orange)
const COL: Record<string, [number, number]> = { // [normal, burnt]
  leafsGreen: [0x4f7a2c, 0x2b241c], leafsDark: [0x2f5a30, 0x26211b], grass: [0x46702c, 0x2e2820],
  woodBark: [0x6e5238, 0x221c17], woodBarkDark: [0x56402e, 0x1f1a16], woodInner: [0xb89a72, 0x3a2e24],
  dirt: [0x8a857c, 0x4f4b46], _defaultMat: [0x7a6a50, 0x2a2420],
};
const ROCKY = /^rock/;

const loader = new GLTFLoader();
type Part = { geo: THREE.BufferGeometry; mat: string };
const parts = new Map<string, Promise<Part[]>>();
/** Bake a model into unit-height parts (one per material), base at y=0, origin kept (trunk base). */
function load(kind: FloraKind, burnt: boolean): Promise<Part[]> {
  const key = kind + (burnt ? '#b' : '');
  let p = parts.get(key);
  if (!p) {
    p = loader.loadAsync(assetUrl(`assets/flora/${FLORA[kind]}.glb`)).then((gl) => {
      const sc = gl.scene; sc.updateMatrixWorld(true);
      const by = new Map<string, THREE.BufferGeometry[]>();
      sc.traverse((o) => {
        const m = o as THREE.Mesh; if (!m.isMesh) return;
        let geo = m.geometry.clone().applyMatrix4(m.matrixWorld);
        for (const a of Object.keys(geo.attributes)) if (a !== 'position' && a !== 'normal') geo.deleteAttribute(a);
        if (geo.index) geo = geo.toNonIndexed();
        const n = (m.material as THREE.Material).name || '_defaultMat';
        (by.get(n) ?? by.set(n, []).get(n)!).push(geo);
      });
      const all = [...by.values()].flat(), box = new THREE.Box3();
      for (const g of all) { g.computeBoundingBox(); box.union(g.boundingBox!); }
      const k = 1 / Math.max(1e-3, box.max.y - box.min.y);
      const out: Part[] = [];
      for (const [mat, gs] of by) {
        const geo = mergeGeometries(gs)!; geo.translate(0, -box.min.y, 0); geo.scale(k, k, k);
        if (burnt && LEAF.test(mat) && !ROCKY.test(kind)) { // dead crown: shrink toward its own centre + droop
          geo.computeBoundingBox(); const c = geo.boundingBox!.getCenter(new THREE.Vector3());
          const f = PALM.test(kind) ? 0.78 : 0.68;
          geo.translate(-c.x, -c.y, -c.z); geo.scale(f, f * (PALM.test(kind) ? 0.7 : 0.85), f); geo.translate(c.x, c.y - (PALM.test(kind) ? 0.03 : 0.06), c.z);
        }
        geo.computeVertexNormals(); out.push({ geo, mat });
      }
      return out;
    });
    parts.set(key, p);
  }
  return p;
}

export interface FloraItem { k: FloraKind; x: number; y: number; z: number; h: number; rot: number; burnt?: boolean; tilt?: number }
const matCache = new Map<string, THREE.MeshLambertMaterial>();
function material(name: string, kind: FloraKind, burnt: boolean) {
  const rock = ROCKY.test(kind), key = name + (burnt ? 'b' : '') + (rock ? 'r' : '');
  let m = matCache.get(key);
  if (!m) {
    const pair = rock && name === 'grass' ? [0x5d6b3e, 0x3a342c] : (COL[name] ?? COL._defaultMat);
    m = new THREE.MeshLambertMaterial({ color: pair[burnt ? 1 : 0], flatShading: true });
    if (burnt && LEAF.test(name) && PALM.test(kind)) m.color.setHex(0x4e3c27); // dead brown palm fronds
    matCache.set(key, m);
  }
  return m;
}

/** All items as instanced meshes (one per kind x variant x material). Resolves once every model is in. */
export async function floraField(items: FloraItem[], shadows: boolean): Promise<THREE.Group> {
  const grp = new THREE.Group(); grp.name = 'flora';
  const groups = new Map<string, FloraItem[]>();
  for (const it of items) { const k = it.k + (it.burnt ? '#b' : ''); (groups.get(k) ?? groups.set(k, []).get(k)!).push(it); }
  const d = new THREE.Object3D(), c = new THREE.Color();
  await Promise.all([...groups].map(async ([key, list]) => {
    const kind = key.split('#')[0] as FloraKind, burnt = key.endsWith('#b');
    for (const part of await load(kind, burnt)) {
      const im = new THREE.InstancedMesh(part.geo, material(part.mat, kind, burnt), list.length);
      list.forEach((it, i) => {
        d.position.set(it.x, it.y, it.z); d.rotation.set(it.tilt ?? 0, it.rot, (it.tilt ?? 0) * 0.6); d.scale.setScalar(it.h); d.updateMatrix();
        im.setMatrixAt(i, d.matrix);
        const v = 0.86 + (((i * 2654435761) >>> 0) % 1000) / 1000 * 0.28; im.setColorAt(i, c.setScalar(v));
      });
      im.castShadow = shadows; im.receiveShadow = shadows; im.userData.flora = kind; im.frustumCulled = false; grp.add(im);
    }
  }));
  return grp;
}

/** 2D decoration sprite key -> 3D model + height (m) from its painted size (px). null = not a plant/rock. */
export function decoTo3D(key: string, sizePx: number): { k: FloraKind; h: number; burnt?: boolean } | null {
  const m = sizePx * 0.05;
  switch (key) {
    case 'oak': return { k: 'oak', h: m * 1.15 };
    case 'pine': return { k: 'pine', h: m * 1.5 };
    case 'rtree': return { k: 'tree_detailed', h: m * 1.2 };
    case 'palm': return { k: 'palm', h: m * 1.2 };
    case 'palm2': return { k: 'palm_tall', h: m * 1.25 };
    case 'bpalm': return { k: 'palm', h: m * 1.2, burnt: true };
    case 'bpalm2': return { k: 'palm_bend', h: m * 1.1, burnt: true };
    case 'deadtree': case 'deadtree2': return { k: 'tree', h: m * 1.2, burnt: true };
    case 'hedge': case 'monstera': case 'bamboo': return { k: 'bush_big', h: m * 0.32 };
    case 'rose': case 'fern': case 'redflower': case 'tbush': return { k: 'bush', h: m * 0.24 };
    case 'boulders': case 'vinerock': case 'searocks': case 'trock': return { k: (sizePx * 7) % 3 < 1.5 ? 'rock_big' : 'rock', h: m * 0.22 };
    case 'mossrock': return { k: 'rock', h: m * 0.24 };
    case 'rubble': return { k: 'rock_small', h: m * 0.16 };
    case 'stump': return { k: 'stump', h: m * 0.16 };
    case 'log': return { k: 'log', h: m * 0.12 };
    default: return null;
  }
}
