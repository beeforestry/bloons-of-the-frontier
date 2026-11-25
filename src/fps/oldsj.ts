// t101b: Old San Juan backdrop behind El Morro (first person). Real terrain + real layout, no third-party meshes:
//  * ground: USGS 3DEP 1 m lidar DEM (PR_PRVI_E_2018, tile x80y205 — US public domain), resampled to 3 m in the El Morro map frame;
//  * colour: NOAA NGS 2017-09-24 aerial (layer 20170924b-rgb, public domain / CC0), resampled into the same frame;
//  * buildings: footprints classified from that aerial (bright roofs vs streets / trees / sea) and extruded 2-4 storeys (3.7 m);
//    facades shaded in the city's pastel palette with a regular window grid — a procedural silhouette, not a model of any one house.
// Built by art_src/tools/oldsj_backdrop.py -> public/assets/maps/morro/oldsj.{dat,jpg}. Map frame = morro_real.py FRAME (game px, 0.125 m/px).
import * as THREE from 'three';
import { assetUrl } from '../assetUrl';
import osmRaw from '../data/osm.generated.json';
import { tex as repoTex, weathered } from './morro93';

// t124: low city-wall volumes (Muralla de San Juan, © OpenStreetMap contributors, ODbL 1.0; tools/osm/build_layers.py) —
// only the parts outside the playable map, standing on the backdrop's lidar ground. Walls: the repo's CC0 Poly Haven plaster.
const OSMW = osmRaw as unknown as { wall?: { h: number; thick: number }; maps: Record<string, { walls?: { id: number; pts: [number, number][] }[] }> };
export const OLDSJ_WALLS = OSMW.maps.morro?.walls ?? [];

/** Grid window in El Morro map px: origin, px per sample, size. Mirrors oldsj_backdrop.py. */
export const OLDSJ = { x0: -9500, y0: -2500, step: 24, cols: 438, rows: 438 };

async function gunzip(raw: ArrayBuffer): Promise<ArrayBuffer> {
  const b = new Uint8Array(raw); if (!(b[0] === 0x1f && b[1] === 0x8b)) return raw;
  return new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
}

/** The backdrop (ground mesh + extruded blocks) in El Morro map space (x = px * S, z = py * S, y = metres). Cells inside the playable map are skipped. */
export async function oldSanJuan(S: number, mapW: number, mapH: number, opts: { skipMap?: boolean } = {}): Promise<THREE.Group> {
  const W = OLDSJ, n = W.cols * W.rows;
  const [buf, tex] = await Promise.all([
    fetch(assetUrl('assets/maps/morro/oldsj.dat')).then((r) => { if (!r.ok) throw new Error('oldsj ' + r.status); return r.arrayBuffer(); }).then(gunzip),
    new THREE.TextureLoader().loadAsync(assetUrl('assets/maps/morro/oldsj.jpg')),
  ]);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const q = new Uint8Array(buf, 0, n), qa = new Uint8Array(buf, n, n), skipMap = opts.skipMap !== false;
  const gh = (k: number) => q[k] / 4 - 2, inMap = (x: number, y: number) => skipMap && x > 0 && y > 0 && x < mapW && y < mapH;
  // ---- ground (bare-earth lidar), aerial-coloured
  const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  for (let j = 0; j < W.rows; j++) for (let i = 0; i < W.cols; i++) {
    const k = j * W.cols + i; pos[k * 3] = (W.x0 + i * W.step) * S; pos[k * 3 + 1] = gh(k); pos[k * 3 + 2] = (W.y0 + j * W.step) * S;
    uv[k * 2] = i / (W.cols - 1); uv[k * 2 + 1] = 1 - j / (W.rows - 1);
  }
  const idx: number[] = [];
  for (let j = 0; j < W.rows - 1; j++) for (let i = 0; i < W.cols - 1; i++) {
    const a = j * W.cols + i, b = a + 1, c = a + W.cols, d = c + 1;
    if (Math.max(q[a], q[b], q[c], q[d]) / 4 - 2 < 0.25) continue; // open sea: the water plane covers it
    if (inMap(W.x0 + (i + 0.5) * W.step, W.y0 + (j + 0.5) * W.step)) continue; // the playable map has its own (finer) terrain
    idx.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setAttribute('bld', new THREE.BufferAttribute(new Float32Array(n), 1));
  geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere();
  // ---- buildings: one 3 m column per built sample, roofs keep the aerial, walls only where the neighbour is lower (vertical faces)
  const bp: number[] = [], bn: number[] = [], bu: number[] = [];
  const top = (i: number, j: number) => { if (i < 0 || j < 0 || i >= W.cols || j >= W.rows) return -99; const k = j * W.cols + i; return qa[k] ? gh(k) + qa[k] / 4 : -99; };
  const quad = (p: number[][], nx: number, ny: number, nz: number, u: number[][]) => { for (const t of [0, 1, 2, 0, 2, 3]) { bp.push(...p[t]); bn.push(nx, ny, nz); bu.push(...u[t]); } };
  let blocks = 0;
  for (let j = 0; j < W.rows; j++) for (let i = 0; i < W.cols; i++) {
    const k = j * W.cols + i; if (!qa[k]) continue;
    const px = W.x0 + i * W.step, py = W.y0 + j * W.step; if (inMap(px, py)) continue;
    blocks++;
    const h = W.step / 2, x0 = (px - h) * S, x1 = (px + h) * S, z0 = (py - h) * S, z1 = (py + h) * S, y1 = top(i, j);
    let base = gh(k); for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii >= 0 && jj >= 0 && ii < W.cols && jj < W.rows) base = Math.min(base, gh(jj * W.cols + ii)); }
    base -= 0.6;
    const u0 = (i - 0.5) / (W.cols - 1), u1 = (i + 0.5) / (W.cols - 1), v0 = 1 - (j - 0.5) / (W.rows - 1), v1 = 1 - (j + 0.5) / (W.rows - 1), uc: number[] = [(u0 + u1) / 2, (v0 + v1) / 2];
    quad([[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], 0, 1, 0, [[u0, v0], [u0, v1], [u1, v1], [u1, v0]]);
    const side = (nt: number, p: number[][], nx: number, nz: number) => { const lo = Math.max(base, nt); if (lo >= y1 - 0.05) return; quad(p.map(([x, z], m) => [x, m < 2 ? lo : y1, z]), nx, 0, nz, [uc, uc, uc, uc]); };
    side(top(i - 1, j), [[x0, z0], [x0, z1], [x0, z1], [x0, z0]], -1, 0);
    side(top(i + 1, j), [[x1, z1], [x1, z0], [x1, z0], [x1, z1]], 1, 0);
    side(top(i, j - 1), [[x1, z0], [x0, z0], [x0, z0], [x1, z0]], 0, -1);
    side(top(i, j + 1), [[x0, z1], [x1, z1], [x1, z1], [x0, z1]], 0, 1);
  }
  const bg = new THREE.BufferGeometry();
  bg.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3)); bg.setAttribute('normal', new THREE.Float32BufferAttribute(bn, 3)); bg.setAttribute('uv', new THREE.Float32BufferAttribute(bu, 2));
  bg.setAttribute('bld', new THREE.Float32BufferAttribute(new Float32Array(bp.length / 3).fill(1), 1)); bg.computeBoundingSphere();
  const mat = new THREE.MeshLambertMaterial({ map: tex });
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float bld; varying float vB; varying vec3 vWP; varying vec3 vWN;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vB = bld; vWP = (modelMatrix * vec4(transformed, 1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vB; varying vec3 vWP; varying vec3 vWN;')
      .replace('#include <map_fragment>', `#include <map_fragment>
  {
    vec3 N = normalize(vWN); float wall = (1.0 - smoothstep(0.3, 0.62, abs(N.y))) * step(0.02, vB);
    if (wall > 0.0) {
      vec2 cell = floor(vWP.xz / 9.0); float hs = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
      // Old San Juan facade palette: yellow, coral, sky blue, mint, pink, white, ochre, lilac
      vec3 P[8]; P[0] = vec3(0.86, 0.70, 0.30); P[1] = vec3(0.82, 0.45, 0.36); P[2] = vec3(0.47, 0.66, 0.80); P[3] = vec3(0.58, 0.78, 0.64);
      P[4] = vec3(0.86, 0.60, 0.66); P[5] = vec3(0.90, 0.88, 0.82); P[6] = vec3(0.80, 0.58, 0.34); P[7] = vec3(0.68, 0.60, 0.80);
      vec3 pc = P[int(hs * 7.99)];
      float along = abs(N.x) > abs(N.z) ? vWP.z : vWP.x;
      float fy = fract(vWP.y / 3.7), fa = fract(along / 3.0);
      float win = step(0.22, fy) * step(fy, 0.8) * step(0.32, fa) * step(fa, 0.68);
      float cornice = smoothstep(0.9, 0.97, fy);
      vec3 c = mix(pc, vec3(0.16, 0.13, 0.12), win * 0.8); c = mix(c, vec3(0.93, 0.91, 0.86), cornice * 0.6);
      diffuseColor.rgb = mix(diffuseColor.rgb, c, wall);
    }
  }`);
  };
  mat.customProgramCacheKey = () => 'oldsj';
  const grp = new THREE.Group(); grp.name = 'old_san_juan';
  const ground = new THREE.Mesh(geo, mat), blk = new THREE.Mesh(bg, mat); ground.name = 'oldsj_ground'; blk.name = 'oldsj_blocks';
  grp.add(ground, blk);
  // ---- t124: city walls — a 2 m thick, ~2.6 m high masonry band along each OSM wall line, top following the ground
  const wl = OSMW.wall ?? { h: 2.6, thick: 2.0 }, gAt = (px: number, py: number) => {
    const fx = Math.min(W.cols - 1.001, Math.max(0, (px - W.x0) / W.step)), fy = Math.min(W.rows - 1.001, Math.max(0, (py - W.y0) / W.step));
    const i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, k = j * W.cols + i;
    return (gh(k) * (1 - u) + gh(k + 1) * u) * (1 - v) + (gh(k + W.cols) * (1 - u) + gh(k + W.cols + 1) * u) * v;
  };
  const wp: number[] = [], wuv: number[] = []; let wallM = 0;
  const wq = (a: number[], b: number[], c: number[], d: number[], ua: number[], ub: number[], uc: number[], ud: number[]) => { for (const [p, q] of [[a, ua], [b, ub], [c, uc], [a, ua], [c, uc], [d, ud]]) { wp.push(...p); wuv.push(...q); } };
  for (const w of OLDSJ_WALLS) {
    const pts: number[][] = []; // resample every <= 3 m so the top follows the ground
    for (let k = 0; k < w.pts.length - 1; k++) { const [ax, ay] = w.pts[k], [bx, by] = w.pts[k + 1], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) * S / 3)); for (let m = 0; m < n; m++) pts.push([ax + (bx - ax) * m / n, ay + (by - ay) * m / n]); }
    pts.push(w.pts[w.pts.length - 1]);
    if (pts.some(([x, y]) => inMap(x, y))) continue;
    const half = wl.thick / 2 / S; let run = 0;
    const off = pts.map((p, k) => { const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [-dy / L * half, dx / L * half]; });
    for (let k = 0; k < pts.length - 1; k++) {
      const [ax, ay] = pts[k], [bx, by] = pts[k + 1], seg = Math.hypot(bx - ax, by - ay) * S, ga = gAt(ax, ay), gb = gAt(bx, by);
      if (Math.max(ga, gb) < 0.4) { run += seg; continue; } // skip where the line runs over open sea
      const A = [ax + off[k][0], ay + off[k][1]], B = [bx + off[k + 1][0], by + off[k + 1][1]], C = [bx - off[k + 1][0], by - off[k + 1][1]], D = [ax - off[k][0], ay - off[k][1]];
      const ta = ga + wl.h, tb = gb + wl.h, ba = ga - 1.2, bb = gb - 1.2, u0 = run / 2.2, u1 = (run + seg) / 2.2, v0 = 0, v1 = (wl.h + 1.2) / 2.2;
      const P3 = (p: number[], y: number) => [p[0] * S, y, p[1] * S];
      wq(P3(A, ba), P3(B, bb), P3(B, tb), P3(A, ta), [u0, v0], [u1, v0], [u1, v1], [u0, v1]);   // one face
      wq(P3(C, bb), P3(D, ba), P3(D, ta), P3(C, tb), [u1, v0], [u0, v0], [u0, v1], [u1, v1]);   // other face
      wq(P3(A, ta), P3(B, tb), P3(C, tb), P3(D, ta), [u0, 0], [u1, 0], [u1, wl.thick / 2.2], [u0, wl.thick / 2.2]); // walk top
      if (k === 0) wq(P3(D, ba), P3(A, ba), P3(A, ta), P3(D, ta), [0, v0], [1, v0], [1, v1], [0, v1]);
      if (k === pts.length - 2) wq(P3(B, bb), P3(C, bb), P3(C, tb), P3(B, tb), [0, v0], [1, v0], [1, v1], [0, v1]);
      run += seg; wallM += seg;
    }
  }
  if (wp.length) {
    const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3)); wg.setAttribute('uv', new THREE.Float32BufferAttribute(wuv, 2));
    wg.computeVertexNormals(); wg.computeBoundingSphere();
    const wm = weathered(0xb3a690, repoTex('mr_plaster'), 0.85, 0.55, THREE.DoubleSide); const walls = new THREE.Mesh(wg, wm); walls.name = 'oldsj_walls'; grp.add(walls);
  }
  grp.userData.walls = Math.round(wallM);
  grp.userData.tris = idx.length / 3 + bp.length / 9 + wp.length / 9; grp.userData.built = blocks;
  return grp;
}
