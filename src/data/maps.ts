// Map definitions. Composited procedurally (painted textures + cut-out props laid
// along exact lane polylines) by art_src/tools/compose_maps.py, so lane data, the
// buildable grid, the HQ and its build pads are exact. Re-run it after editing.
import raw from './maps.generated.json';
import type { Vec } from '../core/types';
export interface MapDef {
  id: string; name: string; image: string; width: number; height: number; pathWidth: number;
  /** Lane 0 (legacy single-path accessor). */
  waypoints: [number, number][];
  /** Every enemy lane: entry -> HQ gate. Branching roads are overlapping lanes. */
  lanes: [number, number][][];
  hq: [number, number];
  pads: [number, number][];
  /** Default rally point for trained squads. */
  rally: [number, number];
  /** Fixed garrisonable structures [kind, x, y] (El Morro's garitas). */
  envs?: [string, number, number][];
  /** Theme tag ('morro' = coastal fortress). */
  flavor?: string;
  grid: { cell: number; originX: number; originY: number; cols: number; rows: number; buildable: string[] };
}
export const MAPS: MapDef[] = raw as unknown as MapDef[];
export const toVec = ([x, y]: [number, number]): Vec => ({ x, y });
