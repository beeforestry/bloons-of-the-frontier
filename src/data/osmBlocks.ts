// t123: solid footprints of the OpenStreetMap buildings first person draws (src/fps/osmBuildings.ts builds the meshes from the
// same outlines, so what blocks a possessed troop is exactly what it sees — no invisible walls). Map px in, metres out.
// Footprints: © OpenStreetMap contributors (ODbL 1.0), projected by tools/osm/build_layers.py.
import type { MapDef, OsmBlock } from './maps';

/** Wall thickness (m) of ruin walls / the magazine's enclosure, pavilion post radius (m), trooper body radius (m). */
export const RUIN_T = 0.7, POST_R = 0.14, BODY = 0.35;

type P = [number, number];
export function inside(x: number, y: number, poly: P[]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[j];
    if ((ay > y) !== (by > y) && x < ((bx - ax) * (y - ay)) / (by - ay || 1e-9) + ax) c = !c;
  }
  return c;
}
function edgeDist(x: number, y: number, poly: P[]) {
  let d = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j], [bx, by] = poly[i], dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)); d = Math.min(d, Math.hypot(x - ax - t * dx, y - ay - t * dy));
  }
  return d;
}
/** Signed distance (m) from the outline: + inside, − outside. */
function sdist(x: number, y: number, poly: P[], mpp: number) { const d = edgeDist(x, y, poly) * mpp; return inside(x, y, poly) ? d : -d; }

/** Pavilion posts (map px): the roof-frame corners pulled 0.45 m inward, plus posts every ~4 m along the sides of big ones. */
export function pavilionPosts(b: OsmBlock, mpp: number): P[] {
  const cx = b.rect.reduce((s, p) => s + p[0], 0) / 4, cy = b.rect.reduce((s, p) => s + p[1], 0) / 4;
  const k = (0.45 / mpp) * Math.SQRT2;
  const cs = b.rect.map(([x, y]) => { const dx = cx - x, dy = cy - y, L = Math.hypot(dx, dy) || 1; return [x + (dx / L) * k, y + (dy / L) * k] as P; });
  const out: P[] = [];
  for (let i = 0; i < 4; i++) {
    const a = cs[i], c = cs[(i + 1) % 4], n = Math.max(1, Math.round((Math.hypot(c[0] - a[0], c[1] - a[1]) * mpp) / 4));
    for (let j = 0; j < n; j++) out.push([a[0] + ((c[0] - a[0]) * j) / n, a[1] + ((c[1] - a[1]) * j) / n]);
  }
  return out;
}

/** How deep (m) a body at (x, y) would sit inside a block (<= 0 = free). */
export function blockDepthOf(b: OsmBlock, x: number, y: number, mpp: number): number {
  switch (b.kind) {
    case 'ruin': return RUIN_T / 2 + BODY - Math.abs(sdist(x, y, b.poly, mpp) - RUIN_T / 2);
    case 'magazine': return Math.max(RUIN_T / 2 + BODY - Math.abs(sdist(x, y, b.poly, mpp) - RUIN_T / 2), b.core ? sdist(x, y, b.core, mpp) + BODY : -1);
    case 'hall': return sdist(x, y, b.core ?? b.poly, mpp) + BODY;
    case 'battery': return sdist(x, y, b.poly, mpp) + BODY;
    case 'pavilion': { let d = -1; for (const [px, py] of pavilionPosts(b, mpp)) d = Math.max(d, POST_R + BODY - Math.hypot(x - px, y - py) * mpp); return d; }
  }
  return -1;
}

const BOX = new WeakMap<OsmBlock, number[]>();
/** Deepest overlap (m) with any of the map's OSM blocks; cheap bbox reject first. */
export function blockDepth(map: MapDef, x: number, y: number): number {
  const bl = map.blocks; if (!bl) return 0;
  const mpp = map.mpp ?? 0.05, pad = 1.5 / mpp; let best = 0;
  for (const b of bl) {
    let bb = BOX.get(b);
    if (!bb) { bb = [Infinity, Infinity, -Infinity, -Infinity]; for (const [px, py] of b.poly) { bb[0] = Math.min(bb[0], px); bb[1] = Math.min(bb[1], py); bb[2] = Math.max(bb[2], px); bb[3] = Math.max(bb[3], py); } BOX.set(b, bb); }
    if (x < bb[0] - pad || x > bb[2] + pad || y < bb[1] - pad || y > bb[3] + pad) continue;
    const d = blockDepthOf(b, x, y, mpp); if (d > best) best = d;
  }
  return best;
}

/** Is an OSM footprint (or a point inside one) within rM metres of (x, y)? Keeps towers from being placed into / against a building. */
export function footprintNear(m: MapDef, x: number, y: number, rM: number): boolean {
  const mpp = m.mpp ?? 0.05;
  for (const b of m.blocks ?? []) {
    const P = (b.kind === 'pavilion' ? b.rect : b.poly) as P[];
    if (inside(x, y, P) || edgeDist(x, y, P) * mpp < rM) return true;
  }
  return false;
}
