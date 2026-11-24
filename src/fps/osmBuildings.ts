// t123: first-person buildings from OpenStreetMap footprints (© OpenStreetMap contributors, ODbL 1.0; tools/osm/build_layers.py).
// El Morro: the Polvorín de Santa Elena (gabled powder magazine inside its enclosure wall), the bay-side battery and two ruined
// guard houses — the bare-earth lidar has none of them. Isla de Cabras: the park hall and pavilions with their green hip roofs.
// Outlines are the real OSM footprints; heights from OSM building:levels where tagged, else measured off the NOAA aerial
// shadows. Roofs / tops are textured with the same NOAA aerial as the 2D map (so they match it), walls with the repo's CC0
// plaster. Solids for possessed troops come from the same outlines (src/data/osmBlocks.ts).
import * as THREE from 'three';
import type { OsmBlock } from '../data/maps';
import { RUIN_T, POST_R, pavilionPosts, inside } from '../data/osmBlocks';
import { Merge, tex, weathered } from './morro93';

type P = [number, number];
/** Unit normal of edge a->b pointing into the polygon. */
function inward(p: P[], a: P, b: P): P {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, n: P = [-dy / L, dx / L];
  return inside((a[0] + b[0]) / 2 + n[0] * 0.5, (a[1] + b[1]) / 2 + n[1] * 0.5, p) ? n : [-n[0], -n[1]];
}
/** Inset a simple polygon by d px (mitred, miter capped at 3 d). */
function inset(p: P[], d: number): P[] {
  const n = p.length, out: P[] = [];
  for (let i = 0; i < n; i++) {
    const a = p[(i + n - 1) % n], b = p[i], c = p[(i + 1) % n], n1 = inward(p, a, b), n2 = inward(p, b, c);
    const p1: P = [a[0] + n1[0] * d, a[1] + n1[1] * d], d1: P = [b[0] - a[0], b[1] - a[1]], p2: P = [b[0] + n2[0] * d, b[1] + n2[1] * d], d2: P = [c[0] - b[0], c[1] - b[1]];
    const den = d1[0] * d2[1] - d1[1] * d2[0];
    let q: P = Math.abs(den) < 1e-9 ? [b[0] + n1[0] * d, b[1] + n1[1] * d] : (() => { const t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den; return [p1[0] + d1[0] * t, p1[1] + d1[1] * t] as P; })();
    if (Math.hypot(q[0] - b[0], q[1] - b[1]) > 3 * d) { const mx = n1[0] + n2[0], my = n1[1] + n2[1], L = Math.hypot(mx, my) || 1; q = [b[0] + (mx / L) * d, b[1] + (my / L) * d]; }
    out.push(q);
  }
  return out;
}

export interface OsmSet { group: THREE.Group; stats: { blocks: number; tris: number; kinds: Record<string, number> } }

/** Build every block. `gh(x, y)` = first-person ground metres at map px; `photo` = the 2D map's aerial ground texture. */
export function osmBuildings(blocks: OsmBlock[], S: number, mapW: number, mapH: number, gh: (x: number, y: number) => number, photo: THREE.Texture | null): OsmSet {
  const group = new THREE.Group(); group.name = 'osm_buildings';
  const tPl = tex('mr_plaster'), tP2 = tex('plaster');
  const M = {
    stone: weathered(0xb3a690, tPl, 0.85, 0.55), stoneTop: weathered(0x8f8573, tPl, 0.6, 0.3),
    cream: weathered(0xeee4cf, tP2, 0.35, 0.1), post: weathered(0xf1ece2, tP2, 0.3, 0.05),
    roof: photo ? new THREE.MeshLambertMaterial({ map: photo }) : new THREE.MeshLambertMaterial({ color: 0x3f8f72 }),
    under: new THREE.MeshLambertMaterial({ color: 0x4b463e }),
  } as Record<string, THREE.Material>;
  const mg = new Merge(); const st = { blocks: 0, tris: 0, kinds: {} as Record<string, number> };
  const X = (px: number) => px * S, aer = (x: number, y: number): [number, number] => [x / mapW, 1 - y / mapH];
  // ---- primitives (positions in map px for x/z, metres for y)
  /** one triangle, wound so its normal faces up (or down with `down`); aerial uv unless given */
  const tri = (pos: number[], uv: number[], a: number[], b: number[], c: number[], down = false) => {
    const ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    if ((ny < 0) !== down) [b, c] = [c, b];
    for (const v of [a, b, c]) { pos.push(X(v[0]), v[1], X(v[2])); uv.push(...aer(v[0], v[2])); }
  };
  const geo = (pos: number[], uv?: number[]) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals(); return g; };
  /** vertical wall quads along a ring, facing out of it (`out`) or into it, y0..y1 */
  const walls = (ring: P[], y0: number, y1: number, out: boolean) => {
    const pos: number[] = [];
    for (let i = 0; i < ring.length; i++) {
      let a = ring[i], b = ring[(i + 1) % ring.length];
      const n = inward(ring, a, b), dx = b[0] - a[0], dy = b[1] - a[1], facesIn = -dy * n[0] + dx * n[1] > 0; // quad normal ∝ (-dy, dx)
      if (facesIn === out) [a, b] = [b, a];
      pos.push(X(a[0]), y0, X(a[1]), X(b[0]), y0, X(b[1]), X(b[0]), y1, X(b[1]), X(a[0]), y0, X(a[1]), X(b[0]), y1, X(b[1]), X(a[0]), y1, X(a[1]));
    }
    return geo(pos);
  };
  /** flat cap over a ring at height y (aerial uv), optionally a hole ring (wall tops) */
  const cap = (ring: P[], y: number, hole?: P[]) => {
    const pos: number[] = [], uv: number[] = [];
    if (hole) {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length], c = hole[(i + 1) % hole.length], d = hole[i];
        for (const [p0, p1, p2] of [[a, b, c], [a, c, d]]) tri(pos, uv, [p0[0], y, p0[1]], [p1[0], y, p1[1]], [p2[0], y, p2[1]]);
      }
    } else {
      const v2 = ring.map(([x, z]) => new THREE.Vector2(x, z)), ids = THREE.ShapeUtils.triangulateShape(v2, []);
      for (const [i, j, k] of ids) tri(pos, uv, [ring[i][0], y, ring[i][1]], [ring[j][0], y, ring[j][1]], [ring[k][0], y, ring[k][1]]);
    }
    return geo(pos, uv);
  };
  /** hip roof over a rectangle: eave at y0, ridge (or apex) at y0 + h; `neck` < 1 stops at that fraction and adds a lantern */
  const hip = (r: P[], y0: number, h: number, neck = 1) => {
    const c: P = [(r[0][0] + r[2][0]) / 2, (r[0][1] + r[2][1]) / 2];
    const lAB = Math.hypot(r[1][0] - r[0][0], r[1][1] - r[0][1]), lBC = Math.hypot(r[2][0] - r[1][0], r[2][1] - r[1][1]);
    const ax: P = lAB >= lBC ? [(r[1][0] - r[0][0]) / lAB, (r[1][1] - r[0][1]) / lAB] : [(r[2][0] - r[1][0]) / lBC, (r[2][1] - r[1][1]) / lBC];
    const half = Math.abs(lAB - lBC) / 2;
    // top ring = rectangle scaled toward the ridge segment
    const toTop = (p: P, t: number): P => { const d = (p[0] - c[0]) * ax[0] + (p[1] - c[1]) * ax[1], rd = Math.sign(d) * Math.min(Math.abs(d), half); const q: P = [c[0] + ax[0] * rd, c[1] + ax[1] * rd]; return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; };
    const top = r.map((p) => toTop(p, neck)), yT = y0 + h * neck;
    const pos: number[] = [], uv: number[] = [], up: number[] = [], uu: number[] = [];
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], ta = top[i], tb = top[(i + 1) % 4];
      const A = [a[0], y0, a[1]], B = [b[0], y0, b[1]], TA = [ta[0], yT, ta[1]], TB = [tb[0], yT, tb[1]];
      tri(pos, uv, A, B, TB); tri(pos, uv, A, TB, TA);
      const d = (v: number[]) => [v[0], v[1] - 0.06, v[2]]; tri(up, uu, d(A), d(B), d(TB), true); tri(up, uu, d(A), d(TB), d(TA), true);
    }
    mg.add(geo(pos, uv), M.roof, null); mg.add(geo(up, uu), M.under, null);
    if (neck < 1) { // lantern: short clerestory wall + its own small hip cap
      const lt = top.map((p) => toTop(p, 0.15)) as P[];
      mg.add(walls(lt, yT - 0.05, yT + 0.55, true), M.cream, 1.2); hip(lt.map((p) => [c[0] + (p[0] - c[0]) * 1.25, c[1] + (p[1] - c[1]) * 1.25] as P), yT + 0.55, h * (1 - neck) * 0.9);
      mg.add(cap(top, yT - 0.02), M.roof, null);
    }
  };
  /** gabled roof over a rectangle (ridge along the long axis); gable triangles in `wallMat` */
  const gable = (r: P[], y0: number, h: number, wallMat: THREE.Material) => {
    const lAB = Math.hypot(r[1][0] - r[0][0], r[1][1] - r[0][1]), lBC = Math.hypot(r[2][0] - r[1][0], r[2][1] - r[1][1]);
    const q = lAB >= lBC ? [r[1], r[2], r[3], r[0]] as P[] : r; // q[0]q[1] = short side
    const m1: P = [(q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2], m2: P = [(q[2][0] + q[3][0]) / 2, (q[2][1] + q[3][1]) / 2], yR = y0 + h;
    const pos: number[] = [], uv: number[] = [], gp: number[] = [];
    const A = [q[0][0], y0, q[0][1]], B = [q[1][0], y0, q[1][1]], C = [q[2][0], y0, q[2][1]], D = [q[3][0], y0, q[3][1]], R1 = [m1[0], yR, m1[1]], R2 = [m2[0], yR, m2[1]];
    tri(pos, uv, B, C, R2); tri(pos, uv, B, R2, R1); tri(pos, uv, D, A, R1); tri(pos, uv, D, R1, R2);
    const cx = (m1[0] + m2[0]) / 2, cz = (m1[1] + m2[1]) / 2;
    for (let [a, b2, rr] of [[A, B, R1], [C, D, R2]]) { // gable ends, facing away from the middle
      const nx = (b2[2] - a[2]) * (rr[1] - a[1]) - (b2[1] - a[1]) * (rr[2] - a[2]), nz = (b2[1] - a[1]) * (rr[0] - a[0]) - (b2[0] - a[0]) * (rr[1] - a[1]);
      if (nx * (a[0] - cx) + nz * (a[2] - cz) > 0) [a, b2] = [b2, a]; // (nx, nz) = -(b2 - a) x (rr - a)
      for (const v of [a, b2, rr]) gp.push(X(v[0]), v[1], X(v[2]));
    }
    mg.add(geo(pos, uv), M.roof, null); mg.add(geo(gp), wallMat, 1.6);
  };
  for (const b of blocks) {
    const ring = b.poly as P[], pts = [...ring, [(b.rect[0][0] + b.rect[2][0]) / 2, (b.rect[0][1] + b.rect[2][1]) / 2] as P];
    const hs = pts.map(([x, y]) => gh(x, y)), gMin = Math.min(...hs), gAvg = hs.reduce((s, v) => s + v, 0) / hs.length, y0 = gMin - 0.6;
    const T = RUIN_T / S; st.kinds[b.kind] = (st.kinds[b.kind] ?? 0) + 1; st.blocks++;
    if (b.kind === 'ruin' || b.kind === 'magazine') { // perimeter wall (thickness RUIN_T, outer face on the OSM outline)
      const top = gAvg + (b.kind === 'ruin' ? b.h : b.wall ?? 2.6), inn = inset(ring, T);
      mg.add(walls(ring, y0, top, true), M.stone, 2.2); mg.add(walls(inn, y0, top, false), M.stone, 2.2); mg.add(cap(ring, top, inn), M.stoneTop, 2.0);
    }
    if (b.kind === 'magazine' && b.core) { // vaulted powder magazine: buttressed masonry block with a gabled roof
      const core = b.core as P[], eave = gAvg + b.h * 0.62;
      mg.add(walls(core, y0, eave, true), M.stone, 2.2); gable(b.rect.length === 4 ? inset(b.rect as P[], (4.0 - 0.25) / S) : core, eave, b.h * 0.38, M.stone);
      const n = core.length; // buttresses along the long walls (every 4.2 m)
      for (let i = 0; i < n; i++) {
        const a = core[i], c = core[(i + 1) % n], L = Math.hypot(c[0] - a[0], c[1] - a[1]) * S; if (L < 20) continue;
        const [ix, iy] = inward(core, a, c), ox = -ix, oy = -iy; let ux = (c[0] - a[0]) * S / L, uy = (c[1] - a[1]) * S / L;
        if (-uy * ox + ux * oy < 0) { ux = -ux; uy = -uy; } // keep the basis right-handed (z = outward)
        const hb = eave - y0 - 0.8, basis = new THREE.Matrix4().makeBasis(new THREE.Vector3(ux, 0, uy), new THREE.Vector3(0, 1, 0), new THREE.Vector3(ox, 0, oy));
        for (let k = 1; k < Math.floor(L / 4.2); k++) {
          const t = (k * 4.2) / L, px = a[0] + (c[0] - a[0]) * t, py = a[1] + (c[1] - a[1]) * t;
          mg.add(new THREE.BoxGeometry(0.9, hb, 1.1).translate(0, y0 + hb / 2, 0.5), M.stone, 2.0, basis.clone().setPosition(X(px), 0, X(py)));
        }
      }
    }
    if (b.kind === 'battery') { const top = gAvg + b.h; mg.add(walls(ring, y0, top, true), M.stone, 2.2); mg.add(cap(ring, top), M.roof, null); }
    if (b.kind === 'hall') {
      const core = (b.core ?? ring) as P[], eave = gAvg + b.h;
      mg.add(walls(core, y0, eave, true), M.cream, 2.4); mg.add(cap(core, gAvg + 0.08), M.under, null);
      hip(b.rect as P[], eave, b.roof ?? 3, 0.78);
    }
    if (b.kind === 'pavilion') {
      const eave = gAvg + b.h;
      for (const [px, py] of pavilionPosts(b, S)) mg.add(new THREE.CylinderGeometry(POST_R, POST_R * 1.15, eave - y0, 10).translate(X(px), (eave + y0) / 2, X(py)), M.post, 1.0);
      hip(b.rect as P[], eave, b.roof ?? 1.6, (b.roof ?? 1.6) > 2 ? 0.78 : 1);
    }
  }
  st.tris = mg.build(group, 'osm_bld');
  group.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group, stats: st };
}
