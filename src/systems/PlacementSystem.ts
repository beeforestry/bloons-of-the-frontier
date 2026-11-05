// =============================================================================
// PLACEMENT SYSTEM: grid occupancy, validity, forgiving snap, place / sell / move.
// Buildable cells come from the traced map mask (path, water, trees excluded).
// =============================================================================
import type { Vec } from '../core/types';
import type { MapDef } from '../data/maps';

export interface Cell { c: number; r: number }
/** t56 free placement: a cell (bookkeeping) plus the exact world spot. */
export interface Spot extends Cell { x?: number; y?: number }
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
    // t56: "land" for free placement. Cells the coarse grid dropped only because they hug the lane are land too
    // (the exact lane clearance is checked per spot). Optional fine mask `land` (base64 bits, `landRes` px) wins.
    const lanes = map.lanes ?? [map.waypoints], pw = map.pathWidth, hq = map.hq, pads = map.pads ?? [];
    this.land = this.buildable.slice();
    const segD = (px: number, py: number, a: number[], b: number[]) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / L)); return Math.hypot(px - a[0] - t * dx, py - a[1] - t * dy); };
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const i = this.idx(c, r); if (this.buildable[i]) continue;
      const p = this.cellCenter(c, r);
      if (Math.abs(p.x - hq[0]) < 130 && Math.abs(p.y - hq[1]) < 130) continue;
      if (pads.some(([x, y]) => Math.abs(p.x - x) < 70 && Math.abs(p.y - y) < 70)) continue;
      let d = Infinity; for (const l of lanes) for (let k = 0; k < l.length - 1; k++) d = Math.min(d, segD(p.x, p.y, l[k] as number[], l[k + 1] as number[]));
      if (d > pw / 2 + this.cell * 0.42 + 4) continue;
      let nb = false; for (let dc = -1; dc <= 1 && !nb; dc++) for (let dr = -1; dr <= 1; dr++) if (this.inBounds(c + dc, r + dr) && this.buildable[this.idx(c + dc, r + dr)]) { nb = true; break; }
      if (nb) this.land[i] = true;
    }
    const fine = (g as { land?: string; landRes?: number });
    if (fine.land && fine.landRes) {
      const bin = atob(fine.land), res = fine.landRes, fc = Math.ceil(map.width / res);
      this.fineLand = (x: number, y: number) => { const k = Math.floor(y / res) * fc + Math.floor(x / res); return k >= 0 && k >> 3 < bin.length && ((bin.charCodeAt(k >> 3) >> (k & 7)) & 1) === 1; };
    }
  }
  private land: boolean[];
  private fineLand: ((x: number, y: number) => boolean) | null = null;
  /** Free placement: world point is on buildable land (not water / trees / HQ / env / obstacles). */
  isLandAt(x: number, y: number) {
    const { c, r } = this.worldToCell({ x, y });
    if (!this.inBounds(c, r)) return false;
    const i = this.idx(c, r);
    if (this.blocked.has(i)) return false;
    if (this.fineLand) return this.fineLand(x, y);
    return this.land[i];
  }
  /** Release every cell held by t (free-placed towers hold the cells under their footprint circle). */
  releaseOwner(t: T) { for (let i = 0; i < this.occ.length; i++) if (this.occ[i] === t) this.occ[i] = null; }
  /** Mark free cells whose centre lies inside the circle as held by t (keeps farms / envs off it). */
  occupyCircle(t: T, x: number, y: number, rad: number) {
    const a = this.worldToCell({ x: x - rad, y: y - rad }), b = this.worldToCell({ x: x + rad, y: y + rad });
    const own = this.worldToCell({ x, y });
    for (let r = a.r; r <= b.r; r++) for (let c = a.c; c <= b.c; c++) {
      if (!this.inBounds(c, r)) continue;
      const p = this.cellCenter(c, r), i = this.idx(c, r);
      if ((Math.hypot(p.x - x, p.y - y) <= rad || (c === own.c && r === own.r)) && !this.occ[i] && !this.blocked.has(i)) this.occ[i] = t;
    }
  }
  private idx(c: number, r: number) { return r * this.cols + c; }
  inBounds(c: number, r: number) { return c >= 0 && r >= 0 && c < this.cols && r < this.rows; }
  isBuildable(c: number, r: number) { return this.inBounds(c, r) && this.buildable[this.idx(c, r)]; }
  occupant(c: number, r: number): T | null { return this.inBounds(c, r) ? this.occ[this.idx(c, r)] : null; }
  isFree(c: number, r: number) { return this.isBuildable(c, r) && !this.occupant(c, r); }

  worldToCell(p: Vec): Cell { return { c: Math.floor((p.x - this.ox) / this.cell), r: Math.floor((p.y - this.oy) / this.cell) }; }
  cellCenter(c: number, r: number): Vec { return { x: this.ox + (c + 0.5) * this.cell, y: this.oy + (r + 0.5) * this.cell }; }

  /** Forgiving placement: the hovered cell if free, else the nearest free neighbour within 1 cell of the cursor. */
  snap(p: Vec, n = 1): Cell | null {
    const base = this.worldToCell(p);
    if (this.fits(base.c, base.r, n)) return base;
    let best: Cell | null = null, bd = Infinity;
    for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) {
      const c = base.c + dc, r = base.r + dr;
      if (!this.fits(c, r, n)) continue;
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
  /** Cells of an n x n footprint centred on (c, r) (n odd; big vehicles use 3). */
  area(c: number, r: number, n = 1): Cell[] { const h = (n - 1) >> 1, out: Cell[] = []; for (let dc = -h; dc <= h; dc++) for (let dr = -h; dr <= h; dr++) out.push({ c: c + dc, r: r + dr }); return out; }
  fits(c: number, r: number, n = 1) { return this.area(c, r, n).every((q) => this.isFree(q.c, q.r)); }
  occupyArea(t: T, c: number, r: number, n = 1) { for (const q of this.area(c, r, n)) this.occupy(t, q.c, q.r); }
  releaseArea(c: number, r: number, n = 1) { for (const q of this.area(c, r, n)) this.release(q.c, q.r); }
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
