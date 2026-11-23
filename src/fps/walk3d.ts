// t108 GMMG-3: first-person leg walk cycle for the legged enemy GLBs (bugs, Scarab Walker, Leviathan, the Dreadnought biped).
// The GLBs are single static meshes, so the gait is a vertex-shader warp: vertices low in the model (legs) and — for the
// many-legged bugs — out to the sides swing forward/back along the body and lift, in diagonal pairs (trot), more at the feet.
// Phase comes from the distance each enemy actually walked (per-instance aWalk for the instanced bugs, a uniform for bosses).
import * as THREE from 'three';

export interface WalkBox { h: number; x: number; z: number }
export const walkInfo = { materials: 0 };
/** Model-space extents (height, half width, half length) of a set of geometries. */
export function walkBox(geos: THREE.BufferGeometry[]): WalkBox {
  const b = new THREE.Box3(), t = new THREE.Box3();
  for (const g of geos) { g.computeBoundingBox(); if (g.boundingBox) b.union(t.copy(g.boundingBox)); }
  return { h: Math.max(0.1, b.max.y), x: Math.max(0.05, b.max.x, -b.min.x), z: Math.max(0.05, b.max.z, -b.min.z) };
}
const f = (n: number) => n.toFixed(4);
/** Clone `mat` with the leg warp. biped = two legs under the body (no side mask). */
export function walkMaterial(mat: THREE.Material, box: WalkBox, biped = false): THREE.Material {
  const m = mat.clone(), u = { value: 0 }; m.userData.walkU = u; walkInfo.materials++;
  const top = box.h * (biped ? 0.4 : 0.48), x0 = biped ? 0 : box.x * 0.32, x1 = biped ? 0.001 : box.x * 0.75;
  const amp = (biped ? 0.16 : 0.13) * box.z, lift = box.h * (biped ? 0.06 : 0.1);
  const prev = mat.onBeforeCompile?.bind(mat), key = `walk${biped ? 'b' : 'm'}${f(top)}${f(x0)}${f(amp)}`;
  m.onBeforeCompile = (sh, r) => {
    prev?.(sh, r);
    sh.uniforms.uWalkU = u;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aWalk; uniform float uWalkU;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
{
  float wph = uWalkU + aWalk;
  float hw = 1.0 - smoothstep(0.0, ${f(top)}, transformed.y);
  float lw = ${biped ? '1.0' : `smoothstep(${f(x0)}, ${f(x1)}, abs(transformed.x))`};
  float gp = clamp(transformed.x / ${f(box.x * 0.15)}, -1.0, 1.0)${biped ? '' : ` * clamp(transformed.z / ${f(box.z * 0.2)}, -1.0, 1.0)`};
  float k = hw * lw;
  transformed.z += sin(wph) * gp * ${f(amp)} * k;
  transformed.y += max(0.0, cos(wph) * gp) * ${f(lift)} * k;
}`);
  };
  const pk = mat.customProgramCacheKey?.bind(mat); m.customProgramCacheKey = () => (pk ? pk() : '') + key;
  return m;
}
/** GLBs that walk on legs (balloons, blimps and the flying Gargoyle don't). */
export const WALK_GLB: Record<string, 'many' | 'biped'> = {
  bug_scavenger: 'many', bug_hunter: 'many', bug_charger: 'many', bug_brood: 'many', bug_ironback: 'many', bug_warden: 'many',
  bug_titan: 'many', boss_scarab: 'many', boss_leviathan: 'many', boss_dreadnought: 'biped',
};
/** Metres walked per full gait cycle for a model drawn at scale k. */
export const strideM = (k: number, biped: boolean) => (biped ? 1.6 : 0.9) * k;
