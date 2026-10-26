// TARGETING SYSTEM: BTD-style priorities shared by towers, troops and garrisons.
import { TargetingMode, type Vec } from '../core/types';
import { dist2 } from '../core/math';
import type { Enemy } from '../entities/Enemy';

export interface TargetFilter { hitsAir: boolean; hitsGround: boolean; exclude?: Set<Enemy> }

export function inRange(enemies: Enemy[], origin: Vec, range: number, f: TargetFilter): Enemy[] {
  // An enemy counts as in range when any part of its body is inside the circle.
  return enemies.filter((e) => e.alive && e.targetable && (e.data.flying ? f.hitsAir : f.hitsGround) &&
    !f.exclude?.has(e) && dist2(e, origin) <= (range + e.data.radius) ** 2);
}

export function pickTarget(enemies: Enemy[], origin: Vec, range: number, mode: TargetingMode, f: TargetFilter): Enemy | null {
  let best: Enemy | null = null, score = -Infinity;
  for (const e of inRange(enemies, origin, range, f)) {
    let s: number;
    switch (mode) {
      case TargetingMode.First: s = -e.remaining; break;
      case TargetingMode.Last: s = e.remaining; break;
      case TargetingMode.Strong: s = e.strength * 1e4 - e.remaining; break;
      case TargetingMode.Close: s = -dist2(e, origin); break;
    }
    if (s > score) { score = s; best = e; }
  }
  return best;
}

/** Up to n distinct targets in priority order (multishot / garrisons). */
export function pickTargets(enemies: Enemy[], origin: Vec, range: number, mode: TargetingMode, f: TargetFilter, n: number): Enemy[] {
  const out: Enemy[] = [], ex = new Set<Enemy>(f.exclude ?? []);
  for (let i = 0; i < n; i++) {
    const t = pickTarget(enemies, origin, range, mode, { ...f, exclude: ex });
    if (!t) break;
    out.push(t); ex.add(t);
  }
  return out;
}
