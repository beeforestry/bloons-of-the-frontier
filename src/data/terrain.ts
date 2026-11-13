// Heightfield terrain (t40, Tropical Island). Shared height function: the 3D Possess view uses it
// for the ground mesh AND for every unit, enemy, tower, prop and the camera, so all of them sit on
// the same surface. The 2D sim is unaffected (balloons follow the same lane polyline).
import type { MapDef, TerrainDef } from './maps';

const cache = new WeakMap<TerrainDef, Float32Array>();
/** Decoded heights (metres), row-major cols x rows over [0,width] x [0,height] map px. */
export function heights(t: TerrainDef): Float32Array {
  let h = cache.get(t); if (h) return h;
  const bin = atob(t.data); h = new Float32Array(bin.length);
  for (let i = 0; i < bin.length; i++) h[i] = t.off + bin.charCodeAt(i) * t.scale;
  cache.set(t, h); return h;
}
/** Ground height in metres at map pixel (x, y). 0 on flat maps. */
export function groundH(map: MapDef, x: number, y: number): number {
  const t = map.terrain; if (!t) return 0;
  const h = heights(t), fx = Math.min(t.cols - 1.001, Math.max(0, (x / map.width) * (t.cols - 1))), fy = Math.min(t.rows - 1.001, Math.max(0, (y / map.height) * (t.rows - 1)));
  const i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, c = t.cols;
  return (h[j * c + i] * (1 - u) + h[j * c + i + 1] * u) * (1 - v) + (h[(j + 1) * c + i] * (1 - u) + h[(j + 1) * c + i + 1] * u) * v;
}
/** t80: optional finer 3D-only surface (El Morro's 0.5 m fort heights) consulted by standH — first person only;
 *  the 2D sim / LOS keep using groundH so co-op peers stay deterministic. */
let fine: { id: string; at: (x: number, y: number) => number | null } | null = null;
export function setFineHeights(id: string | null, at?: (x: number, y: number) => number | null) { fine = id && at ? { id, at } : null; }
/** Standing height: never below the water surface (docks / shallows). */
export function standH(map: MapDef, x: number, y: number): number {
  const f = fine && fine.id === map.id ? fine.at(x, y) : null;
  const g = f ?? groundH(map, x, y); return map.terrain ? Math.max(map.terrain.water + 0.05, g) : g;
}
