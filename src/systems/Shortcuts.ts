// =============================================================================
// BLOCKED SHORTCUTS: each map has an overgrown trail that cuts off a long
// stretch of road, choked by a rockslide. Clearing the blocker (MAC, Cherry Pod
// / drop-pod blasts, or a scrap-paid Demolish order) OPENS the trail:
//  - every lane that passes the trail's entry re-routes through it (enemies
//    get a shorter path: the risk),
//  - the trail becomes a fast road for friendly troops (+35% move speed) and
//    the rubble drops salvage scrap (the reward).
// Chords are precomputed per map by art_src/tools/find_shortcuts.py.
// =============================================================================
import type { Vec } from '../core/types';
import { PathSystem } from './PathSystem';
import type { Cell } from './PlacementSystem';
import type { Obstacle } from '../entities/Garrison';

export interface ShortcutDef { fromLane: number; d1: number; toLane: number; d2: number; a: [number, number]; b: [number, number]; saved: number }
export const SHORTCUT = { blockerHp: 320, demolishScrap: 20, roadSpeed: 1.35, laneSnap: 14 };

export class Shortcut {
  open = false;
  blocker: Obstacle | null = null;
  cells: Cell[] = [];
  /** Lanes re-routed when it opened: lane -> arc length saved. */
  rerouted: Record<number, number> = {};
  /** What opening it would do (computed at map setup, shown in the UI). */
  preview = { lanes: [] as number[], saved: 0, seconds: 0 };
  readonly a: Vec; readonly b: Vec;
  constructor(readonly def: ShortcutDef) { this.a = { x: def.a[0], y: def.a[1] }; this.b = { x: def.b[0], y: def.b[1] }; }
  get mid(): Vec { return { x: (this.a.x + this.b.x) / 2, y: (this.a.y + this.b.y) / 2 }; }
  get length() { return Math.hypot(this.b.x - this.a.x, this.b.y - this.a.y); }
}

/** Polyline of `p` from its start up to arc length d (inclusive end point). */
function prefix(p: PathSystem, d: number): Vec[] {
  const out: Vec[] = [];
  for (const s of p.segs) { if (s.cum >= d) break; out.push(s.a); }
  const e = p.at(d); out.push({ x: e.x, y: e.y });
  return out;
}
/** Polyline of `p` from arc length d to its end. */
function suffix(p: PathSystem, d: number): Vec[] {
  const s0 = p.at(d), out: Vec[] = [{ x: s0.x, y: s0.y }];
  for (const s of p.segs) if (s.cum + s.len > d + 1e-6) out.push(s.b);
  return out;
}

/**
 * Re-route every lane that passes the shortcut's entry. Returns the new paths
 * (same indices; unchanged lanes are returned as-is) and the per-lane saving.
 */
export function routeThrough(paths: PathSystem[], sc: Shortcut, width: number): { paths: PathSystem[]; saved: Record<number, number> } {
  const out = [...paths], saved: Record<number, number> = {};
  const C = sc.length;
  paths.forEach((pk, k) => {
    const pa = pk.project(sc.a);
    if (pa.dist > SHORTCUT.laneSnap) return;
    // exit onto this lane if the exit lies on it, else onto the shortcut's target lane
    const pbk = pk.project(sc.b);
    const j = pbk.dist <= SHORTCUT.laneSnap ? k : sc.def.toLane;
    const pj = paths[j], db = j === k ? pbk.d : pj.project(sc.b).d;
    const s = (pk.length - pa.d) - (C + pj.length - db);
    if (s < 40) return;
    const pts = [...prefix(pk, pa.d), ...suffix(pj, db)];
    out[k] = new PathSystem(pts, width);
    saved[k] = Math.round(s);
  });
  return { paths: out, saved };
}

/** Distance from p to segment ab. */
export function segDistance(p: Vec, a: Vec, b: Vec) {
  const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L2));
  return Math.hypot(p.x - a.x - dx * t, p.y - a.y - dy * t);
}
