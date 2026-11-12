// t71: Blender-authored GLBs (painterly v3 look) for Possess — bloons, key towers, scavenger, viewmodel guns.
// Built by art_src/glb_t71/scripts/build_meshes.py (+ refine_sprite_towers.py). No ripped BTD/PvZ/Halo art.
// t72: tower_dart + gun_dart are the refined Dart Scout (art_src/glb_t72/scripts/build_dart_scout.py, matches dart_monkey_2.webp).
// t76: every first-person enemy (bloons, bugs, bosses) has its own GLB from art_src/glb_t76/scripts/build_enemies.py.
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

/** t76: every mesh primitive of a GLB as world-baked {geometry, material} parts — one InstancedMesh each. */
export type GlbPart = { geometry: THREE.BufferGeometry; material: THREE.Material };
const partsCache = new Map<string, Promise<GlbPart[]>>();
export function loadGlbParts(name: string): Promise<GlbPart[]> {
  let p = partsCache.get(name);
  if (!p) {
    p = loadScene(name).then((root) => {
      root.updateMatrixWorld(true);
      const parts: GlbPart[] = [];
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh || !m.geometry) return;
        const g = m.geometry.clone(); g.applyMatrix4(m.matrixWorld);
        parts.push({ geometry: g, material: Array.isArray(m.material) ? m.material[0] : m.material });
      });
      return parts;
    });
    partsCache.set(name, p);
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

/** t77: Vanguard deployable troops -> one Blender GLB per (unit, tier), modelled on public/assets/v3/<id>_<tier>.webp.
 *  Code ids stay unsc-era (marine/odst/spartan/warthog/scorpion); display names are Frontier Marines, Orbital Drop
 *  Troopers, Aegis Operative, Raider Buggy, Bulwark Scorpion. Infantry are instanced; the two vehicles are clones. */
export const UNIT_GLB_IDS = ['marine', 'odst', 'spartan', 'warthog', 'scorpion'] as const;
export const UNIT_GLB_VEHICLES = new Set<string>(['warthog', 'scorpion']);
export function unitGlb(id: string, tier: number): string | undefined {
  return (UNIT_GLB_IDS as readonly string[]).includes(id) ? `unit_${id}_${Math.max(0, Math.min(2, tier))}` : undefined;
}

/** t77: first-person viewmodel guns for the Vanguard troops, built from the same Blender parts as their world models.
 *  Exported along +X with the butt / mount pivot at the origin. tip = muzzle distance, barrel = muzzle height (m). */
export const UNIT_VM: Record<string, { tip: number; barrel: number }> = {
  gun_vg_rifle: { tip: 0.9, barrel: 0.022 }, gun_vg_rifle_scope: { tip: 0.9, barrel: 0.022 }, gun_vg_smg: { tip: 0.67, barrel: 0.02 },
  gun_vg_br: { tip: 0.96, barrel: 0.022 }, gun_aegis_beam: { tip: 0.98, barrel: 0.02 },
  gun_raider_mg: { tip: 2.05, barrel: 0.1 }, gun_raider_rotary: { tip: 1.16, barrel: 0 }, gun_raider_rotary_cyan: { tip: 1.16, barrel: 0 },
  gun_scorpion_cannon: { tip: 4.73, barrel: 0 }, gun_scorpion_cannon_blue: { tip: 4.62, barrel: 0 },
};
export function unitVmGlb(id: string, tier: number): string | undefined {
  const t = Math.max(0, Math.min(2, tier));
  switch (id) {
    case 'marine': return t ? 'gun_vg_rifle_scope' : 'gun_vg_rifle';
    case 'odst': return t ? 'gun_vg_br' : 'gun_vg_smg';
    case 'spartan': return t === 2 ? 'gun_aegis_beam' : 'gun_vg_rifle_scope';
    case 'warthog': return ['gun_raider_mg', 'gun_raider_rotary', 'gun_raider_rotary_cyan'][t];
    case 'scorpion': return t === 2 ? 'gun_scorpion_cannon_blue' : 'gun_scorpion_cannon';
    default: return undefined;
  }
}
