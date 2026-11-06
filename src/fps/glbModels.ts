// t71: Blender-authored GLBs (painterly v3 look) for Possess — bloons, key towers, scavenger, viewmodel guns.
// Built by art_src/glb_t71/scripts/build_meshes.py (+ refine_sprite_towers.py). No ripped BTD/PvZ/Halo art.
// t72: tower_dart + gun_dart are the refined Dart Scout (art_src/glb_t72/scripts/build_dart_scout.py, matches dart_monkey_2.webp).
// t73: tower_sniper + gun_sniper are the refined Marksman Scout (art_src/glb_t73/scripts/build_marksman.py, matches sniper_monkey_2.webp).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { assetUrl } from '../assetUrl';

const loader = new GLTFLoader();
const sceneCache = new Map<string, Promise<THREE.Group>>();
const geoCache = new Map<string, Promise<THREE.BufferGeometry>>();

function loadScene(name: string): Promise<THREE.Group> {
  let p = sceneCache.get(name);
  if (!p) {
    p = loader.loadAsync(assetUrl(`assets/glb/${name}.glb`)).then((g) => {
      const root = g.scene;
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.castShadow = true;
        m.receiveShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && 'envMapIntensity' in mat) mat.envMapIntensity = 0.85;
      });
      return root;
    });
    sceneCache.set(name, p);
  }
  return p;
}

/** First mesh geometry from a GLB (merged world-baked), suitable for InstancedMesh. */
export function loadGlbGeometry(name: string): Promise<THREE.BufferGeometry> {
  let p = geoCache.get(name);
  if (!p) {
    p = loadScene(name).then((root) => {
      root.updateMatrixWorld(true);
      const geos: THREE.BufferGeometry[] = [];
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh || !m.geometry) return;
        const g = m.geometry.clone();
        g.applyMatrix4(m.matrixWorld);
        geos.push(g);
      });
      if (!geos.length) return new THREE.SphereGeometry(0.5, 12, 8);
      // Prefer single geo; if multiple, merge via BufferGeometryUtils-less simple path: use largest
      geos.sort((a, b) => (b.getAttribute('position')?.count ?? 0) - (a.getAttribute('position')?.count ?? 0));
      const geo = geos[0];
      geo.computeVertexNormals();
      return geo;
    });
    geoCache.set(name, p);
  }
  return p;
}

export function loadGlbClone(name: string): Promise<THREE.Group> {
  return loadScene(name).then((s) => s.clone(true));
}

/** Tower id → Blender hero GLB (max-tier silhouette / sprite-projected). */
export const TOWER_GLB: Record<string, string> = {
  dart_monkey: 'tower_dart',
  ninja_monkey: 'tower_ninja',
  wizard_monkey: 'tower_wizard',
  sniper_monkey: 'tower_sniper',
  super_monkey: 'tower_apex',
  glue_slinger: 'tower_glue',
};

/** Projectile / tower role → Blender viewmodel gun GLB. */
export const GUN_GLB: Record<string, string> = {
  dart: 'gun_dart',
  shuriken: 'gun_shuriken',
  magic: 'gun_staff',
  laser: 'gun_laser',
  rail: 'gun_sniper',
  glue: 'gun_glue',
  bullet: 'gun_sniper',
};

export const BLOON_GLB_IDS = ['red', 'blue', 'green', 'yellow', 'pink', 'lead', 'ceramic'] as const;
