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
  /** 3D heightfield + prop billboards for Possess (Tropical Island). */
  terrain?: TerrainDef;
  grid: { cell: number; originX: number; originY: number; cols: number; rows: number; buildable: string[] };
}
export interface TerrainDef {
  cols: number; rows: number; off: number; scale: number; water: number;
  /** base64 uint8 heights: metres = off + byte * scale. */
  data: string;
  /** Prop-free ground image for the 3D mesh. */
  ground: string;
  /** [spriteKey, x, y, sizePx] — same spots as the painted 2D decorations. */
  props: [string, number, number, number][];
}
export const MAPS: MapDef[] = raw as unknown as MapDef[];
export const toVec = ([x, y]: [number, number]): Vec => ({ x, y });
