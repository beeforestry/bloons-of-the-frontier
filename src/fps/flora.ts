// t50: real 3D plants + rocks for first person (replaces the cone-tree ring and the billboard props).
// Models: Kenney Nature Kit 2.1 (CC0, see CREDITS_military.md) in public/assets/flora/*.glb (~240 kB total,
// loaded lazily with the Possess chunk). Each model is baked to unit height and drawn as one
// InstancedMesh per material, so a whole map of trees is a handful of draw calls (phone-friendly).
// Burnt variant = same geometry with charred bark, shrunken dead crown (warzone / fortress).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { assetUrl } from '../assetUrl';

// t51: fully textured CC0 plants (Grab3D, grab3d.com — see CREDITS_military.md) replace the flat-colour Kenney
// trees/palms/bushes: public/assets/flora_tex/<file>.glb, 512 px WebP base+normal, meshopt, each with a
// simplified "lod1" mesh drawn beyond LOD_FAR metres. Rocks, stumps and logs stay on the Kenney models.
const TEXF: Partial<Record<FloraKind | 'fern' | 'grass' | 'dead', string>> = {
  palm: 'palm', palm_bend: 'palm', palm_tall: 'palm', oak: 'oak', tree: 'oak', tree_detailed: 'jungle',
  pine: 'pine', pine_round: 'pine', bush: 'bush', bush_big: 'bush', fern: 'fern', grass: 'grass', dead: 'dead',
};
/** Near (full-detail) radius per model, metres; grass is dropped entirely past GRASS_MAX. */
export const LOD_FAR: Record<string, number> = { palm: 22, oak: 20, jungle: 20, pine: 20, dead: 20, bush: 10, fern: 9, grass: 7 };
const GRASS_MAX = 34;
const tloader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
type TexModel = { lod: THREE.BufferGeometry[]; mat: THREE.MeshStandardMaterial };
const texModels = new Map<string, Promise<TexModel>>();
const lowMats = new WeakMap<TexModel, THREE.Material[]>();
/** Burnt variant: the same texture desaturated and charred (warzone palms / dead trees). */
function charred<M extends THREE.Material>(m: M): M {
  m.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.rgb = vec3(dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11))) * vec3(0.62, 0.47, 0.36);'); };
  m.customProgramCacheKey = () => 'charred'; return m;
}
function matFor(tm: TexModel, detail: number, burnt = false): THREE.Material {
  let l = lowMats.get(tm); if (!l) lowMats.set(tm, (l = []));
  if (burnt) return (l[3 + detail] ??= charred(detail === 0 ? new THREE.MeshLambertMaterial({ map: tm.mat.map, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ map: tm.mat.map, normalMap: detail >= 2 ? tm.mat.normalMap : null, roughness: 0.95, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.4 })));
  if (detail >= 2) return tm.mat;
  return (l[detail] ??= detail === 1
    ? new THREE.MeshStandardMaterial({ map: tm.mat.map, roughness: 0.9, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.6 })
    : new THREE.MeshLambertMaterial({ map: tm.mat.map, side: THREE.DoubleSide }));
}
/** Unit-height LOD0/LOD1 geometry (base y=0, trunk at origin) + the model's PBR material. */
function loadTex(file: string): Promise<TexModel> {
  let p = texModels.get(file);
  if (!p) {
    p = tloader.loadAsync(assetUrl(`assets/flora_tex/${file}.glb`)).then((gl) => {
      gl.scene.updateMatrixWorld(true);
      // meshopt/quantized attributes are normalised ints: de-quantise to float before baking the node transform
      const deq = (src: THREE.BufferGeometry) => { const g = src.clone(); for (const k of ['position', 'normal', 'uv']) { const a = g.getAttribute(k) as THREE.BufferAttribute | undefined; if (!a || a.array instanceof Float32Array) continue;
        const f = new Float32Array(a.count * a.itemSize); for (let i = 0; i < a.count; i++) for (let c = 0; c < a.itemSize; c++) f[i * a.itemSize + c] = a.getComponent(i, c); g.setAttribute(k, new THREE.BufferAttribute(f, a.itemSize)); } return g; };
      const get = (n: string) => { const m = gl.scene.getObjectByName(n) as THREE.Mesh; return { m, g: deq(m.geometry).applyMatrix4(m.matrixWorld) }; };
      const a = get('lod0'), b = get('lod1');
      a.g.computeBoundingBox(); const box = a.g.boundingBox!, k = 1 / Math.max(1e-3, box.max.y - box.min.y);
      for (const g of [a.g, b.g]) { g.translate(0, -box.min.y, 0); g.scale(k, k, k); }
      const src = a.m.material as THREE.MeshStandardMaterial;
      const mat = new THREE.MeshStandardMaterial({ map: src.map, normalMap: src.normalMap, roughness: 0.88, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.6 });
      if (mat.normalMap) mat.normalScale.set(0.8, 0.8);
      mat.name = 'flora_tex_' + file;
      return { lod: [a.g, b.g], mat };
    });
    texModels.set(file, p);
  }
  return p;
}

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

export type FloraKey = FloraKind | 'fern' | 'grass' | 'dead';
export interface FloraItem { k: FloraKey; x: number; y: number; z: number; h: number; rot: number; burnt?: boolean; tilt?: number }
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
/** `detail`: 2 = PBR + normal maps (high), 1 = PBR base colour only (medium), 0 = Lambert base colour (low). */
export async function floraField(items: FloraItem[], shadows: boolean, detail = 2): Promise<THREE.Group> {
  const grp = new THREE.Group(); grp.name = 'flora';
  const groups = new Map<string, FloraItem[]>(), tex = new Map<string, FloraItem[]>();
  for (const it of items) {
    if (it.burnt && (it.k === 'tree' || it.k === 'oak' || it.k === 'tree_detailed')) it.k = 'dead';
    const f = TEXF[it.k];
    if (f) { const fk = f + (it.burnt ? '#b' : ''); (tex.get(fk) ?? tex.set(fk, []).get(fk)!).push(it); continue; }
    const k = it.k + (it.burnt ? '#b' : ''); (groups.get(k) ?? groups.set(k, []).get(k)!).push(it);
  }
  const d = new THREE.Object3D(), c = new THREE.Color();
  // textured plants: two instanced meshes per model (near LOD0 / far LOD1), re-bucketed by updateLod()
  const lodSets: { file: string; near: THREE.InstancedMesh; far: THREE.InstancedMesh; mats: THREE.Matrix4[]; cols: THREE.Color[]; pos: THREE.Vector3[] }[] = [];
  await Promise.all([...tex].map(async ([fk, list]) => {
    const [file, b] = fk.split('#'), burnt = !!b, tm = await loadTex(file), mat = matFor(tm, detail, burnt);
    const near = new THREE.InstancedMesh(tm.lod[0], mat, list.length), far = new THREE.InstancedMesh(tm.lod[1], mat, list.length);
    near.userData.texModel = far.userData.texModel = tm; near.userData.burnt = far.userData.burnt = burnt;
    const set = { file, near, far, mats: [] as THREE.Matrix4[], cols: [] as THREE.Color[], pos: [] as THREE.Vector3[] };
    list.forEach((it, i) => {
      d.position.set(it.x, it.y, it.z); d.rotation.set(it.tilt ?? 0, it.rot, (it.tilt ?? 0) * 0.6); d.scale.setScalar(it.h); d.updateMatrix();
      const v = 0.88 + (((i * 2654435761) >>> 0) % 1000) / 1000 * 0.24;
      // burnt = charred tint over the real texture (warzone palms / fortress trees)
      set.mats.push(d.matrix.clone()); set.cols.push(new THREE.Color(v, v, v)); set.pos.push(new THREE.Vector3(it.x, it.y + it.h * 0.4, it.z));
    });
    for (const m of [near, far]) {
      m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 3), 3);
      m.castShadow = shadows; m.receiveShadow = shadows; m.userData.flora = file; m.userData.tex = true; m.frustumCulled = false; grp.add(m);
    }
    far.castShadow = false; far.userData.lod = 1;
    lodSets.push(set);
  }));
  const last = new THREE.Vector3(1e9, 0, 0), lastDir = new THREE.Vector3(), cp = new THREE.Vector3(), fw = new THREE.Vector3(), dv = new THREE.Vector3();
  /** Put each textured plant in its near (full) or far (simplified) mesh and skip the ones well behind the
   *  camera (instanced meshes can't frustum-cull per instance). Cheap; call a few times a second. */
  grp.userData.updateLod = (cam: THREE.Camera, force = false) => {
    cam.getWorldPosition(cp); cam.getWorldDirection(fw); fw.y = 0; fw.normalize();
    if (!force && last.distanceToSquared(cp) < 2.25 && lastDir.dot(fw) > 0.97) return; last.copy(cp); lastDir.copy(fw);
    let nFar = 0;
    for (const s of lodSets) {
      let a = 0, b = 0; const R = LOD_FAR[s.file] ?? 26;
      for (let i = 0; i < s.mats.length; i++) {
        dv.subVectors(s.pos[i], cp); dv.y = 0; const d = dv.length();
        if (d > 9 && dv.dot(fw) < -0.3 * d) continue; // behind the view cone (hfov ~100 deg + margin)
        if (s.file === 'grass' && d > GRASS_MAX) continue;
        const isFar = d > R, m = isFar ? s.far : s.near, j = isFar ? b++ : a++;
        m.setMatrixAt(j, s.mats[i]); m.setColorAt(j, s.cols[i]);
      }
      s.near.count = a; s.far.count = b; nFar += b;
      for (const m of [s.near, s.far]) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
    }
    grp.userData.far = nFar;
  };
  grp.userData.texKinds = lodSets.length;
  /** Runtime quality drop (slow frames): cheaper plant materials, no shadows. */
  grp.userData.setDetail = (dl: number) => grp.traverse((o) => { const m = o as THREE.InstancedMesh; if (!m.userData.texModel) return; m.material = matFor(m.userData.texModel as TexModel, dl, !!m.userData.burnt); if (dl === 0) m.castShadow = m.receiveShadow = false; });
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
export function decoTo3D(key: string, sizePx: number): { k: FloraKey; h: number; burnt?: boolean } | null {
  const m = sizePx * 0.05;
  // t80 El Morro: spots placed from the real aerial (art_src/tools/morro_fort3d.py); size = true height in decimetres
  if (key.startsWith('mr_')) {
    const h = sizePx / 10;
    return key === 'mr_tree' ? { k: 'tree', h } : key === 'mr_bush' ? { k: 'bush', h } : key === 'mr_fern' ? { k: 'fern', h } : key === 'mr_grass' ? { k: 'grass', h } : null;
  }
  switch (key) {
    case 'oak': return { k: 'oak', h: m * 1.15 };
    case 'pine': return { k: 'pine', h: m * 1.5 };
    case 'rtree': return { k: 'tree_detailed', h: m * 1.2 };
    case 'palm': return { k: 'palm', h: m * 1.2 };
    case 'palm2': return { k: 'palm_tall', h: m * 1.25 };
    case 'bpalm': return { k: 'palm', h: m * 1.2, burnt: true };
    case 'bpalm2': return { k: 'palm_bend', h: m * 1.1, burnt: true };
    case 'deadtree': case 'deadtree2': return { k: 'tree', h: m * 1.2, burnt: true };
    case 'hedge': case 'bamboo': return { k: 'bush_big', h: m * 0.32 };
    case 'monstera': case 'fern': case 'tbush': return { k: 'fern', h: m * 0.22 };
    case 'rose': case 'redflower': return { k: 'bush', h: m * 0.24 };
    case 'boulders': case 'vinerock': case 'searocks': case 'trock': return { k: (sizePx * 7) % 3 < 1.5 ? 'rock_big' : 'rock', h: m * 0.22 };
    case 'mossrock': return { k: 'rock', h: m * 0.24 };
    case 'rubble': return { k: 'rock_small', h: m * 0.16 };
    case 'stump': return { k: 'stump', h: m * 0.16 };
    case 'log': return { k: 'log', h: m * 0.12 };
    default: return null;
  }
}
