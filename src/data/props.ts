// =============================================================================
// MAP PROPS (t42): military clutter clusters placed beside the lanes on every map.
// They block tower placement, give nearby troops cover (sandbags / barricades),
// and are drawn from sprites rendered off CC0 3D models (Kenney Survival Kit) in 2D
// and as the real 3D models in first person.
// =============================================================================
export type PropKind = 'sandbags' | 'supply' | 'tent' | 'barrier' | 'fuel';
/** radius: blocked-cell radius (px, ~20.5 px/m); cover: troops within radius+COVER.pad take less damage. */
export const PROP_DEFS: Record<PropKind, { radius: number; cover: boolean }> = {
  sandbags: { radius: 48, cover: true },
  supply: { radius: 40, cover: false },
  tent: { radius: 52, cover: false },
  barrier: { radius: 44, cover: true },
  fuel: { radius: 30, cover: false },
};
export const COVER = { pad: 34, reduce: 0.25 };
/** [kind, lane fraction, side] - tried at several offsets until a free spot is found. */
export const PROP_PLAN: [PropKind, number, number][] = [
  ['sandbags', 0.14, 1], ['supply', 0.26, -1], ['tent', 0.38, 1], ['barrier', 0.5, -1], ['fuel', 0.6, 1],
  ['sandbags', 0.7, -1], ['supply', 0.8, 1], ['tent', 0.9, -1], ['barrier', 0.22, 1], ['sandbags', 0.46, 1], ['fuel', 0.32, -1],
];
export interface MapProp { kind: PropKind; x: number; y: number; flip: boolean; cells: { c: number; r: number }[] }
