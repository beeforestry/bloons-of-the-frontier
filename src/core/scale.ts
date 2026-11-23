// t108: per-map 2D scale. The two live maps (El Morro, Isla de Cabras) are real-scale aerials at 0.125 m/px (4416 px wide),
// shown whole at ~0.3x zoom, so the 78 px tower / 44 px trooper sprites and 150 px dart range read tiny and the range rings
// barely reach the lane. On those maps sprites are drawn bigger and every ranged attack reaches further (melee untouched).
// Set once per Game (deterministic: both co-op peers load the same map).
import type { MapDef } from '../data/maps';
export const SCALE = { range: 1, sprite: 1 };
/** Range / sprite multipliers for a map (1 / 1 on the hidden small-scale maps). */
export function mapScale(map: Pick<MapDef, 'mpp'>): { range: number; sprite: number } {
  return (map.mpp ?? 0.05) >= 0.1 ? { range: 1.4, sprite: 1.6 } : { range: 1, sprite: 1 };
}
export function setMapScale(map: Pick<MapDef, 'mpp'>) { Object.assign(SCALE, mapScale(map)); }
/** A ranged attack's reach on the current map (melee < 60 px stays as is). */
export const scaledRange = (r: number) => (r >= 60 ? r * SCALE.range : r);
