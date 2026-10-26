// Path following: arc-length parameterized polyline traced from the map art.
import type { Vec } from '../core/types';
import { clamp } from '../core/math';

interface Seg { a: Vec; b: Vec; len: number; cum: number; ang: number }
export interface PathPoint { x: number; y: number; ang: number }

export class PathSystem {
  readonly segs: Seg[] = [];
  readonly length: number;
  constructor(readonly points: Vec[], readonly width: number) {
    let cum = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1], len = Math.hypot(b.x - a.x, b.y - a.y);
      if (len < 1e-6) continue;
      this.segs.push({ a, b, len, cum, ang: Math.atan2(b.y - a.y, b.x - a.x) });
      cum += len;
    }
    this.length = cum;
  }
  /** Point at arc-length distance d along the path. */
  at(d: number): PathPoint {
    d = clamp(d, 0, this.length);
    // binary search segment
    let lo = 0, hi = this.segs.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (this.segs[mid].cum <= d) lo = mid; else hi = mid - 1;
    }
    const s = this.segs[lo], t = (d - s.cum) / s.len;
    return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t, ang: s.ang };
  }
  /** Closest arc-length parameter + distance from p to the path. */
  project(p: Vec): { d: number; dist: number } {
    let best = { d: 0, dist: Infinity };
    for (const s of this.segs) {
      const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
      const t = clamp(((p.x - s.a.x) * dx + (p.y - s.a.y) * dy) / (s.len * s.len), 0, 1);
      const x = s.a.x + dx * t, y = s.a.y + dy * t, dd = Math.hypot(p.x - x, p.y - y);
      if (dd < best.dist) best = { d: s.cum + t * s.len, dist: dd };
    }
    return best;
  }
}
