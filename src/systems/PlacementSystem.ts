// =============================================================================
// PLACEMENT SYSTEM: grid occupancy, validity, forgiving snap, place / sell / move.
// Buildable cells come from the traced map mask (path, water, trees excluded).
// =============================================================================
import type { Vec } from '../core/types';
import type { MapDef } from '../data/maps';

export interface Cell { c: number; r: number }
export interface Occupant { uid: number }
export const SELL_REFUND = 0.7;

export class PlacementSystem<T extends Occupant = Occupant> {
  readonly cell: number; readonly ox: number; readonly oy: number; readonly cols: number; readonly rows: number;
  private buildable: boolean[];
  private occ: (T | null)[];
  constructor(map: MapDef) {
    const g = map.grid;
    this.cell = g.cell; this.ox = g.originX; this.oy = g.originY; this.cols = g.cols; this.rows = g.rows;
    this.buildable = g.buildable.join('').split('').map((ch) => ch === '1');
    this.occ = new Array(this.cols * this.rows).fill(null);
  }
  private idx(c: number, r: number) { return r * this.cols + c; }
  inBounds(c: number, r: number) { return c >= 0 && r >= 0 && c < this.cols && r < this.rows; }
  isBuildable(c: number, r: number) { return this.inBounds(c, r) && this.buildable[this.idx(c, r)]; }
  occupant(c: number, r: number): T | null { return this.inBounds(c, r) ? this.occ[this.idx(c, r)] : null; }
  isFree(c: number, r: number) { return this.isBuildable(c, r) && !this.occupant(c, r); }

  worldToCell(p: Vec): Cell { return { c: Math.floor((p.x - this.ox) / this.cell), r: Math.floor((p.y - this.oy) / this.cell) }; }
  cellCenter(c: number, r: number): Vec { return { x: this.ox + (c + 0.5) * this.cell, y: this.oy + (r + 0.5) * this.cell }; }

  /** Forgiving placement: the hovered cell if free, else the nearest free neighbour within 1 cell of the cursor. */
  snap(p: Vec): Cell | null {
    const base = this.worldToCell(p);
    if (this.isFree(base.c, base.r)) return base;
    let best: Cell | null = null, bd = Infinity;
    for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) {
      const c = base.c + dc, r = base.r + dr;
      if (!this.isFree(c, r)) continue;
      const cc = this.cellCenter(c, r), d = Math.hypot(cc.x - p.x, cc.y - p.y);
      if (d < bd && d < this.cell * 0.95) { bd = d; best = { c, r }; }
    }
    return best;
  }
  occupy(t: T, c: number, r: number) {
    if (!this.isFree(c, r)) throw new Error(`cell ${c},${r} not free`);
    this.occ[this.idx(c, r)] = t;
  }
  /** Map obstacles / env structures: temporarily make buildable cells unbuildable. */
  private blocked = new Set<number>();
  block(c: number, r: number): boolean {
    if (!this.isFree(c, r)) return false;
    const i = this.idx(c, r); this.buildable[i] = false; this.blocked.add(i); return true;
  }
  unblock(c: number, r: number) { const i = this.idx(c, r); if (this.blocked.delete(i)) this.buildable[i] = true; }
  isBlocked(c: number, r: number) { return this.inBounds(c, r) && this.blocked.has(this.idx(c, r)); }
  release(c: number, r: number) { if (this.inBounds(c, r)) this.occ[this.idx(c, r)] = null; }
  /** Count of free buildable cells (HUD "space left" + Organize Farms report). */
  freeCount() { let n = 0; for (let i = 0; i < this.occ.length; i++) if (this.buildable[i] && !this.occ[i]) n++; return n; }
  /** Size of the largest 4-connected region of free cells: the real "usable space" metric. */
  largestFreeRegion(): number {
    const seen = new Uint8Array(this.occ.length); let best = 0;
    for (let i = 0; i < this.occ.length; i++) {
      if (seen[i] || !this.buildable[i] || this.occ[i]) continue;
      let n = 0; const st = [i]; seen[i] = 1;
      while (st.length) {
        const k = st.pop()!; n++;
        const c = k % this.cols, r = (k / this.cols) | 0;
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nc = c + dc, nr = r + dr;
          if (!this.inBounds(nc, nr)) continue;
          const j = this.idx(nc, nr);
          if (!seen[j] && this.buildable[j] && !this.occ[j]) { seen[j] = 1; st.push(j); }
        }
      }
      best = Math.max(best, n);
    }
    return best;
  }
}
