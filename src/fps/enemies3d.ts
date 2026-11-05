// t67/t68/t71: 3D enemies from painted 2D v3 sprites — textures + Blender GLB meshes (t71).
import * as THREE from 'three';
import { assetUrl } from '../assetUrl';
import { loadGlbGeometry, BLOON_GLB_IDS } from './glbModels';

const cache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

/** Load a painted 2D enemy sprite as an sRGB texture (vendored v3 art — our look reference). */
export function enemySpriteTex(id: string): THREE.Texture {
  const key = id;
  let t = cache.get(key);
  if (t) return t;
  const file = id.startsWith('boss_') || id.startsWith('bug_') || id.startsWith('bloon_')
    ? id
    : (id === 'bile_titan' ? 'bug_titan' : id === 'gargoyle' ? 'bug_gargoyle'
      : ['red','blue','green','yellow','pink','lead','ceramic','moab'].includes(id) ? `bloon_${id}`
      : `bug_${id}`);
  t = loader.load(assetUrl(`assets/v3/${file}.webp`));
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  cache.set(key, t);
  return t;
}

/** Rubber balloon material tinted by instanceColor; optional sprite map for markings. */
export function bloonMaterial(id?: string): THREE.MeshLambertMaterial {
  const m = new THREE.MeshLambertMaterial({ color: 0xffffff });
  if (id) {
    const map = enemySpriteTex(id);
    m.map = map;
    m.color.set(0xffffff);
  }
  return m;
}

/** t71: Blender bloon GLB geometry (teardrop + knot; lead straps / ceramic bands). Falls back handled by caller. */
export function loadBloonGeometry(id: string): Promise<THREE.BufferGeometry> {
  const key = BLOON_GLB_IDS.includes(id as typeof BLOON_GLB_IDS[number]) ? id : 'red';
  return loadGlbGeometry(`bloon_${key}`);
}

/** t71: Blender scavenger bug GLB geometry. */
export function loadScavengerGeometry(): Promise<THREE.BufferGeometry> {
  return loadGlbGeometry('bug_scavenger');
}

export { BLOON_GLB_IDS };
