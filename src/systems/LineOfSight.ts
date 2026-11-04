// LINE OF SIGHT (t44): tall objects block the Sniper Monkey's shots.
// Cheap 2.5D test: a polar visibility table per sniper (angle bins x distance steps),
// built once by marching rays over terrain height + blocker cylinders (props, palms,
// rocks, towers, vehicles, garitas) and cached until a tower is placed or sold.
import type { Vec } from '../core/types';
import type { MapDef } from '../data/maps';
import type { MapProp, PropKind } from '../data/props';
import { groundH } from '../data/terrain';

export const LOS = { bins: 240, step: 16, maxDist: 2700, eye: 2.6, target: 1.3, mPerPx: 0.05 };
const NS = Math.ceil(LOS.maxDist / LOS.step);
/** Obstacle heights in metres (2D radius in px). */
export const PROP_H: Record<PropKind, number> = { sandbags: 1.1, supply: 1.7, tent: 3.2, barrier: 1.2, fuel: 2.4 };
const MAP_PROP: Record<string, [number, number]> = { palm: [9, 0.12], palm2: [8, 0.12], trock: [2.8, 0.32], tbush: [1.6, 0.3],
  // t50 warzone props
  bpalm: [8, 0.1], bpalm2: [7, 0.1], deadtree2: [7, 0.12], rubble: [1.2, 0.3], wtank: [2.6, 0.34], wtank2: [2.6, 0.34], wheli: [3, 0.3], bunker: [3, 0.4], sandbags: [1.1, 0.3] }; // [h, radius as fraction of sprite size]
const TOWER_H: Record<string, number> = { unsc_tank: 3.4, unsc_heli: 3.0, tesla_coil: 4.4, arcane_obelisk: 4.2, unsc_depot: 3.6, unsc_firebase: 3.2, stone_wall: 3.0, star_emperor: 3.2, frost_wallnut_bastion: 2.8 };
export interface Blocker { x: number; y: number; r: number; h: number }
interface LosTower { x: number; y: number; data: { id: string; footprint?: number }; alive: boolean; los?: LosCache }
/** need[b*NS+s]: lowest visible target height (decimetres above ground, 255 = never) per angle bin / distance step. */
export interface LosCache { ver: number; x: number; y: number; need: Uint8Array; firstBlock: Float32Array }
interface LosGame { map: MapDef; props: MapProp[]; towers: LosTower[]; envs: { x: number; y: number }[]; losVer: number }

export function blockers(g: LosGame, self?: LosTower): Blocker[] {
  const out: Blocker[] = [];
  for (const p of g.props) out.push({ x: p.x, y: p.y, r: 30, h: PROP_H[p.kind] });
  for (const [k, x, y, s] of g.map.terrain?.props ?? []) { const d = MAP_PROP[k]; if (d) out.push({ x, y, r: Math.max(14, s * d[1]), h: d[0] }); }
  for (const t of g.towers) if (t.alive && t !== self) out.push({ x: t.x, y: t.y, r: (t.data.footprint ?? 1) * 48 * 0.4, h: TOWER_H[t.data.id] ?? 2.4 });
  if (g.map.flavor === 'morro') for (const e of g.envs) out.push({ x: e.x, y: e.y, r: 34, h: 4.5 });
  for (const [x, y, r, h] of g.map.walls ?? []) out.push({ x, y, r, h }); // t53: real fort wall faces
  return out;
}

/** Build (or reuse) the visibility table for a sniper at its spot. */
export function losTable(g: LosGame, t: LosTower): LosCache {
  const c = t.los; if (c && c.ver === g.losVer && c.x === t.x && c.y === t.y) return c;
  const bl = blockers(g, t).filter((b) => Math.hypot(b.x - t.x, b.y - t.y) > b.r + 20);
  const mpp = g.map.mpp ?? LOS.mPerPx, z0 = groundH(g.map, t.x, t.y) + LOS.eye, need = new Uint8Array(LOS.bins * NS), firstBlock = new Float32Array(LOS.bins).fill(Infinity);
  for (let b = 0; b < LOS.bins; b++) {
    const a = ((b + 0.5) / LOS.bins) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
    const near = bl.filter((o) => { const dx = o.x - t.x, dy = o.y - t.y, al = dx * ca + dy * sa; return al > 0 && Math.abs(-dx * sa + dy * ca) < o.r; }).map((o) => { const dx = o.x - t.x, dy = o.y - t.y, al = dx * ca + dy * sa, pp = -dx * sa + dy * ca, hw = Math.sqrt(o.r * o.r - pp * pp); return [al - hw, al + hw, o.h] as const; });
    let maxSlope = -Infinity;
    for (let s = 1; s <= NS; s++) {
      const d = s * LOS.step, x = t.x + ca * d, y = t.y + sa * d, dm = d * mpp, gz = groundH(g.map, x, y);
      const req = maxSlope === -Infinity ? 0 : z0 + maxSlope * dm - gz; need[b * NS + s - 1] = Math.max(0, Math.min(255, Math.ceil(req * 10)));
      if (req > LOS.target && firstBlock[b] === Infinity) firstBlock[b] = d;
      let top = gz; for (const [d0, d1, h] of near) if (d >= d0 - LOS.step / 2 && d <= d1 + LOS.step / 2) top = Math.max(top, gz + h);
      maxSlope = Math.max(maxSlope, (top - z0) / dm);
    }
  }
  return (t.los = { ver: g.losVer, x: t.x, y: t.y, need, firstBlock });
}

/** Target centre height (m) as drawn in first person: bloons float ~1.3 m (MOAB-class 2.6), bugs/troops ~0.5-1 m; aircraft fly over everything. */
export function targetH(e: { data: { air?: boolean; family?: string; boss?: unknown; id: string; radius: number } }): number {
  return e.data.air ? Infinity : e.data.family === 'bloon' ? (e.data.boss || e.data.id === 'moab' ? 2.6 : 1.3) : Math.max(0.5, e.data.radius * LOS.mPerPx * 0.8);
}
/** Can tower t see a target of height h (m) at point p? */
export function canSee(g: LosGame, t: LosTower, p: Vec, h = LOS.target): boolean {
  if (h === Infinity) return true;
  const dx = p.x - t.x, dy = p.y - t.y, d = Math.hypot(dx, dy); if (d < LOS.step) return true;
  const s = Math.min(NS, Math.round(d / LOS.step)); if (s < 1) return true;
  let a = Math.atan2(dy, dx); if (a < 0) a += Math.PI * 2;
  const b = Math.min(LOS.bins - 1, Math.floor((a / (Math.PI * 2)) * LOS.bins));
  const n = losTable(g, t).need[b * NS + s - 1]; return n < 255 && h * 10 >= n;
}
export const usesLOS = (id: string) => id === 'sniper_monkey';
