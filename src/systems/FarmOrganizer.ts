// =============================================================================
// FARM ORGANIZER (the WorkerUnit's "Organize Farms" brain). Pure grid logic:
//  1. Take the farms to organize; compute their centroid (in cell space).
//  2. Allowed cells = buildable cells that are free OR held by one of these farms.
//  3. Try tight rectangles (closest to square first, least waste) anchored at
//     cells spiralling out from the centroid; first rectangle whose first N
//     cells are all allowed wins (ties -> nearest to centroid).
//  4. Fallback: the N allowed cells nearest the centroid (compact blob).
//  5. Assign farms -> target cells greedily by shortest move.
// The caller then updates occupancy (release all, occupy targets) and animates.
// =============================================================================
import type { Cell, PlacementSystem, Occupant } from './PlacementSystem';

export interface FarmLike extends Occupant { cell: Cell }
export interface OrganizePlan<F extends FarmLike> { moves: { farm: F; to: Cell }[]; targets: Cell[]; bboxBefore: number; bboxAfter: number }

const bboxArea = (cells: Cell[]) => {
  if (!cells.length) return 0;
  const cs = cells.map((c) => c.c), rs = cells.map((c) => c.r);
  return (Math.max(...cs) - Math.min(...cs) + 1) * (Math.max(...rs) - Math.min(...rs) + 1);
};

/** Largest 4-connected region of cells that would be free if farms sat on `taken`. */
function largestRegion(grid: PlacementSystem<any>, allowed: (c: number, r: number) => boolean, taken: Cell[]): number {
  const W = grid.cols, H = grid.rows, seen = new Uint8Array(W * H);
  for (const t of taken) seen[t.r * W + t.c] = 1;
  let best = 0;
  const stack: number[] = [];
  for (let i = 0; i < W * H; i++) {
    if (seen[i] || !allowed(i % W, Math.floor(i / W))) continue;
    let size = 0; seen[i] = 1; stack.push(i);
    while (stack.length) {
      const k = stack.pop()!, c = k % W, r = (k - c) / W; size++;
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nc = c + dc, nr = r + dr, j = nr * W + nc;
        if (nc < 0 || nr < 0 || nc >= W || nr >= H || seen[j] || !allowed(nc, nr)) continue;
        seen[j] = 1; stack.push(j);
      }
    }
    best = Math.max(best, size);
  }
  return best;
}

export function planOrganize<F extends FarmLike>(grid: PlacementSystem<any>, farms: F[], searchRadius = 7): OrganizePlan<F> | null {
  const n = farms.length;
  if (n < 2) return null;
  const set = new Set<Occupant>(farms);
  const allowed = (c: number, r: number) => {
    if (!grid.isBuildable(c, r)) return false;
    const o = grid.occupant(c, r);
    return !o || set.has(o);
  };
  const cx = farms.reduce((s, f) => s + f.cell.c, 0) / n;
  const cy = farms.reduce((s, f) => s + f.cell.r, 0) / n;

  // candidate rectangle shapes: most compact first (perimeter), small waste allowed
  const dims: { w: number; h: number }[] = [];
  for (let w = 1; w <= n; w++) { const h = Math.ceil(n / w); dims.push({ w, h }); }
  const shapeCost = (d: { w: number; h: number }) => d.w + d.h + (d.w * d.h - n) * 0.5;
  dims.sort((a, b) => shapeCost(a) - shapeCost(b) || Math.abs(a.w - a.h) - Math.abs(b.w - b.h));

  let best: { cells: Cell[]; score: number } | null = null;
  for (const { w, h } of dims.slice(0, 4)) {
    for (let dr = -searchRadius; dr <= searchRadius; dr++) for (let dc = -searchRadius; dc <= searchRadius; dc++) {
      const c0 = Math.round(cx - (w - 1) / 2) + dc, r0 = Math.round(cy - (h - 1) / 2) + dr;
      const cells: Cell[] = [];
      for (let k = 0; k < n; k++) cells.push({ c: c0 + (k % w), r: r0 + Math.floor(k / w) });
      if (!cells.every((p) => allowed(p.c, p.r))) continue;
      const mx = c0 + (w - 1) / 2, my = r0 + (h - 1) / 2;
      // score = distance from centroid + penalty for waste/squareness
      //         - bonus for the biggest contiguous build area left open (don't wall off space)
      const score = Math.hypot(mx - cx, my - cy) + (w * h - n) * 0.6 + Math.abs(w - h) * 0.3 - largestRegion(grid, allowed, cells) * 0.35;
      if (!best || score < best.score) best = { cells, score };
    }
    if (best) break; // the best-shaped rectangle that fits anywhere nearby wins
  }
  const found = best as { cells: Cell[]; score: number } | null;
  let targets = found?.cells;
  if (!targets) {
    const pool: { c: number; r: number; d: number }[] = [];
    for (let r = 0; r < grid.rows; r++) for (let c = 0; c < grid.cols; c++) if (allowed(c, r)) pool.push({ c, r, d: Math.hypot(c - cx, r - cy) });
    pool.sort((a, b) => a.d - b.d);
    if (pool.length < n) return null;
    targets = pool.slice(0, n).map(({ c, r }) => ({ c, r }));
  }
  // greedy assignment by shortest move
  const pairs: { f: F; t: Cell; d: number }[] = [];
  for (const f of farms) for (const t of targets) pairs.push({ f, t, d: Math.hypot(f.cell.c - t.c, f.cell.r - t.r) });
  pairs.sort((a, b) => a.d - b.d);
  const usedF = new Set<F>(), usedT = new Set<Cell>(), moves: { farm: F; to: Cell }[] = [];
  for (const p of pairs) {
    if (usedF.has(p.f) || usedT.has(p.t)) continue;
    usedF.add(p.f); usedT.add(p.t); moves.push({ farm: p.f, to: p.t });
  }
  return { moves, targets, bboxBefore: bboxArea(farms.map((f) => f.cell)), bboxAfter: bboxArea(targets) };
}
