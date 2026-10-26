// Map definitions. Paths + buildable masks are traced from the painted map art
// by art_src/tools/build_maps.py (re-run it after swapping map images).
import raw from './maps.generated.json';
import type { Vec } from '../core/types';
export interface MapDef {
  id: string; name: string; image: string; width: number; height: number; pathWidth: number;
  waypoints: [number, number][];
  grid: { cell: number; originX: number; originY: number; cols: number; rows: number; buildable: string[] };
}
export const MAPS: MapDef[] = raw as unknown as MapDef[];
export const toVec = ([x, y]: [number, number]): Vec => ({ x, y });
