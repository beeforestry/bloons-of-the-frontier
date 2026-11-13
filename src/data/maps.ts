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
  /** t50: painted decoration spots [spriteKey, x, y, sizePx] (3D plants/rocks in first person). */
  deco?: [string, number, number, number][];
  /** t53: metres per map pixel for first person / LOS (default 0.05; El Morro is true scale 0.25). */
  mpp?: number;
  /** t53: extra line-of-sight blockers [x, y, radiusPx, heightM] (El Morro's real wall faces from lidar). */
  walls?: [number, number, number, number][];
  /** t80: world vehicles parked on the grounds [unitId ('warthog' | 'scorpion'), x, y, angle rad] — enter / exit with F. */
  parked?: [string, number, number, number][];
  /** 3D heightfield + prop billboards for Possess (Tropical Island, El Morro). */
  terrain?: TerrainDef;
  grid: { cell: number; originX: number; originY: number; cols: number; rows: number; buildable: string[]; land?: string; landRes?: number };
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
/** t56: only these maps are offered in menus (others kept for tests/balance tools). */
export const PLAYABLE_IDS = ['morro', 'tropical'];
export const PLAYABLE_MAPS: MapDef[] = MAPS.filter((m) => PLAYABLE_IDS.includes(m.id));
export const DEFAULT_MAP = 'tropical';
