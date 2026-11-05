// t64: shared first-person PBR material library (CC0 Poly Haven + procedural fur/leaf/skin).
// Vertex colours tint the albedo so existing tower palettes still read; maps add close-up detail.
import * as THREE from 'three';
import { assetUrl } from '../assetUrl';

export type MatKind = 'fur' | 'skin' | 'cloth' | 'leather' | 'metal' | 'gold' | 'rust' | 'iron' | 'wood' | 'bark' | 'leaf' | 'stone' | 'paint' | 'concrete' | 'glow';

interface Spec { map: string; nor?: string; rep: number; metal: number; rough: number; flat?: boolean }
const SPEC: Record<Exclude<MatKind, 'glow'>, Spec> = {
  fur: { map: 'fur', nor: 'fur_n', rep: 2.2, metal: 0, rough: 0.92 },
  skin: { map: 'skin', nor: undefined, rep: 1.4, metal: 0, rough: 0.78 },
  cloth: { map: 'cloth', nor: 'cloth_n', rep: 2.8, metal: 0, rough: 0.95 },
  leather: { map: 'leather', nor: 'leather_n', rep: 2.0, metal: 0, rough: 0.7 },
  metal: { map: 'metal', nor: 'metal_n', rep: 1.6, metal: 0.72, rough: 0.42 },
  gold: { map: 'metal', nor: 'metal_n', rep: 1.8, metal: 0.85, rough: 0.35 },
  rust: { map: 'rust', nor: 'rust_n', rep: 1.8, metal: 0.35, rough: 0.78 },
  iron: { map: 'iron', nor: 'iron_n', rep: 1.4, metal: 0.65, rough: 0.55 },
  wood: { map: 'wood', nor: 'wood_n', rep: 1.6, metal: 0, rough: 0.88 },
  bark: { map: 'bark', nor: 'bark_n', rep: 1.5, metal: 0, rough: 0.95 },
  leaf: { map: 'leaf', nor: 'leaf_n', rep: 2.4, metal: 0, rough: 0.9 },
  stone: { map: 'concrete', nor: 'concrete_n', rep: 1.8, metal: 0, rough: 0.92 },
  paint: { map: 'plaster', nor: 'plaster_n', rep: 2.0, metal: 0.05, rough: 0.7 },
  concrete: { map: 'concrete', nor: 'concrete_n', rep: 1.5, metal: 0, rough: 0.9 },
};

const texCache = new Map<string, THREE.Texture>();
function tex(name: string, srgb: boolean, rep: number) {
  const key = name + ':' + rep + (srgb ? ':s' : '');
  let t = texCache.get(key);
  if (t) return t;
  t = new THREE.TextureLoader().load(assetUrl(`assets/tex/${name}.webp`));
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rep, rep);
  t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(key, t);
  return t;
}

const matCache = new Map<string, THREE.Material>();
const GLOW = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });

/** Quality: 0 = flat Lambert (low), 1 = textured no normal (med), 2 = full PBR (high). */
let quality = 2;
export function setMatQuality(q: number) { quality = q; matCache.clear(); }

export function matOf(kind: MatKind): THREE.Material {
  if (kind === 'glow') return GLOW;
  const key = kind + ':' + quality;
  let m = matCache.get(key);
  if (m) return m;
  const s = SPEC[kind];
  if (quality <= 0) {
    m = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  } else {
    const map = tex(s.map, true, s.rep);
    const nor = quality >= 2 && s.nor ? tex(s.nor, false, s.rep) : null;
    // Medium (no normals): clamp metalness so vehicles don't go black before/without HDRI.
    const metal = quality >= 2 ? s.metal : Math.min(s.metal, kind === 'gold' ? 0.55 : 0.28);
    m = new THREE.MeshStandardMaterial({
      map, normalMap: nor, vertexColors: true,
      metalness: metal, roughness: Math.max(s.rough, quality < 2 ? 0.55 : s.rough),
      envMapIntensity: kind === 'metal' || kind === 'gold' || kind === 'iron' ? (quality >= 2 ? 1.1 : 0.85) : 0.55,
      flatShading: !!s.flat,
    });
  }
  m.name = 'fp_' + kind;
  matCache.set(key, m);
  return m;
}

/** Infer a material kind from an RGB hex (tower palette colours). */
export function inferMat(c: number, glow = false): MatKind {
  if (glow) return 'glow';
  const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
  // gold / brass
  if (r > 170 && g > 120 && b < 110 && r >= g && g > b + 20) return 'gold';
  // leaf / plant green
  if (g > r + 15 && g > b + 10 && g > 70) return 'leaf';
  // skin / face peach
  if (r > 170 && g > 130 && b > 90 && r > g && g > b && (r - b) < 140) return 'skin';
  // fur / brown
  if (r > 55 && r < 170 && g > 30 && g < 120 && b < 90 && r > g && g >= b - 10) return 'fur';
  // wood / warm brown darker
  if (r > 70 && g > 35 && b < 70 && r > g * 1.15 && g > b) return 'wood';
  // bark-ish very dark brown
  if (r > 40 && r < 100 && g > 25 && g < 70 && b < 55 && r >= g) return 'bark';
  // cyan / magic crystal-ish → paint (emissive handled by glow path)
  if (b > r + 40 && b > g) return 'paint';
  // red accents
  if (r > 150 && g < 90 && b < 90) return 'leather';
  // near-grey metals
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx - mn < 35) {
    if (mx < 55) return 'iron';
    if (mx < 130) return 'metal';
    return 'paint';
  }
  // olive drab / camo
  if (g > 60 && g < 140 && r > 40 && r < 130 && b < 90 && Math.abs(r - g) < 40) return 'cloth';
  return 'paint';
}

/** Apply a tinted PBR material to every mesh under `root` (military GLBs, props). */
export function dress(root: THREE.Object3D, kind: MatKind = 'metal', tintMul = 1) {
  const base = matOf(kind);
  root.traverse((o) => {
    const mesh = o as THREE.Mesh; if (!mesh.isMesh) return;
    const src = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial | THREE.MeshLambertMaterial;
    const col = (src && 'color' in src && src.color) ? src.color.clone() : new THREE.Color(1, 1, 1);
    col.multiplyScalar(tintMul);
    const m = (base as THREE.MeshStandardMaterial).clone();
    if ('color' in m) m.color.copy(col);
    if ('map' in m && m.map) m.map = m.map; // shared
    mesh.material = m;
    mesh.castShadow = true;
  });
}
