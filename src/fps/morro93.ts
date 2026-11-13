// t93: El Morro first-person graphics pass — floors, the main ramp, the wide stair with casemates, a walkable 3D Plaza de Armas
// arcade (+ chapel front and well), brick gun-pivot rings on the gun decks, and weathered walk-in garitas with their narrow approach.
// Look references (NOT shipped): Sebastian's shared photos (Boricua Online, Hello Little Home, Not About The Miles — copyrighted, used
// only to judge layout / colour), HABS PR-7-SAJU-6 photos (public domain) and Wikimedia ground photos (see CREDITS_military.md t93).
// Shipped textures: Poly Haven CC0 (red_laterite_soil_stones, gravel_floor_02, dirty_concrete, damaged_plaster, castle_brick_02_red,
// plaster_02) + procedural canvas (ring decals, doors, chapel front, grime). Geometry is original three.js code seated on the
// USGS 3DEP lidar fort grid (public domain). The 2D sim / LOS are untouched: carving only edits the first-person fine heights.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetUrl } from '../assetUrl';
import { FORT, PLAZA, fortH, grimeTex, type FortGrid, type GaritaSpot } from './morro3d';

const MPP = 0.125; // El Morro metres per map px
/** Main ramp (map px): plaza -> cut through the east terreplein -> big arch (xa) -> causeway down onto the Santa Barbara deck (x1). */
export const RAMP = { y: 1590, xa: 2818, x1: 2985, half: 2.8, gravel: 1.4, wall: 0.5 };
/** Wide stair: lower court (x0) up to the battery deck (x1), y0 = court-side face with casemate arches. */
export const WIDE = { x0: 2745, x1: 2866, y0: 1888, y1: 1946 };
/** Retaining wall between the lower court (north-west side) and the gun deck, pierced by casemates. */
export const CASEMATE: [number, number, number, number] = [2878, 1888, 3000, 1828];
export const COURT = { x0: 2740, x1: 3110, y0: 1690, y1: 1968, hMax: 18.6 };
export const WELL: [number, number] = [2545, 1805]; // the HQ (2D game building) stands on the plaza centre

const C = FORT.cols, R = FORT.rows, ST = FORT.step;
function eachIn(x0: number, y0: number, x1: number, y1: number, fn: (k: number, x: number, y: number) => void) {
  const i0 = Math.max(0, Math.ceil((Math.min(x0, x1) - FORT.x0) / ST)), i1 = Math.min(C - 1, Math.floor((Math.max(x0, x1) - FORT.x0) / ST));
  const j0 = Math.max(0, Math.ceil((Math.min(y0, y1) - FORT.y0) / ST)), j1 = Math.min(R - 1, Math.floor((Math.max(y0, y1) - FORT.y0) / ST));
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) fn(j * C + i, FORT.x0 + i * ST, FORT.y0 + j * ST);
}
function inPoly(x: number, y: number, P: [number, number][]) {
  let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; }
  return c;
}
const median = (a: number[], d = 0) => { if (!a.length) return d; a.sort((p, q) => p - q); return a[a.length >> 1]; };
function medH(f: FortGrid, x: number, y: number, r: number) { const a: number[] = []; for (let dy = -r; dy <= r; dy += 4) for (let dx = -r; dx <= r; dx += 4) { const h = fortH(f, x + dx, y + dy); if (h != null) a.push(h); } return median(a); }
function prof(knots: [number, number][], x: number) {
  if (x <= knots[0][0]) return knots[0][1];
  for (let i = 1; i < knots.length; i++) if (x <= knots[i][0]) { const [xa, ha] = knots[i - 1], [xb, hb] = knots[i]; return ha + ((x - xa) / (xb - xa)) * (hb - ha); }
  return knots[knots.length - 1][1];
}

export interface Facade { ax: number; ay: number; bx: number; by: number; ox: number; oy: number; depth: number; H: number; portal: number | null; chapel: boolean }
export interface Ring { x: number; y: number; h: number; ca: number; sa: number }
export interface T93 { spots: GaritaSpot[]; hP: number; facades: Facade[]; knots: [number, number][]; hCourt: number; hDeck: number; fl: Uint8Array; rings: Ring[]; red: number; deck: number }

/** Plaza walls: for each long edge of the traced plaza, find the real lidar wall face and set the arcade 2.6 m in front of it. */
function plazaFacades(f: FortGrid, hP: number): Facade[] {
  const cx = PLAZA.reduce((s, p) => s + p[0], 0) / PLAZA.length, cy = PLAZA.reduce((s, p) => s + p[1], 0) / PLAZA.length;
  const out: Facade[] = []; const D = 2.6;
  let longest = -1, best = 0;
  for (let i = 0; i < PLAZA.length; i++) {
    let [ax, ay] = PLAZA[i], [bx, by] = PLAZA[(i + 1) % PLAZA.length]; const len0 = Math.hypot(bx - ax, by - ay) * MPP; if (len0 < 8) continue;
    let ox = (by - ay), oy = -(bx - ax); const nl = Math.hypot(ox, oy); ox /= nl; oy /= nl;
    if ((cx - ax) * ox + (cy - ay) * oy > 0) { ox = -ox; oy = -oy; } // outward
    // find the real lidar wall face near each end (median of 3 probes) -> the facade follows the face, 2.6 m in front of it
    const probe = (t: number) => { for (let d = -6; d <= 9; d += 0.25) { const h = fortH(f, ax + (bx - ax) * t + (ox * d) / MPP, ay + (by - ay) * t + (oy * d) / MPP); if (h != null && h > hP + 1.5) return d; } return null; };
    const endF = (ts: number[]) => median(ts.map(probe).filter((d): d is number => d != null), 0);
    const fa = endF([0.1, 0.15, 0.2]), fb = endF([0.8, 0.85, 0.9]);
    const dk: number[] = []; for (let t = 0.2; t <= 0.81; t += 0.15) { const h2 = fortH(f, ax + (bx - ax) * t + (ox * 6) / MPP, ay + (by - ay) * t + (oy * 6) / MPP); if (h2 != null) dk.push(h2); }
    const deck = median(dk, hP + 6);
    { const k = 0.15 / 0.7, pa = [ax + (bx - ax) * 0.15 + (ox * (fa - D)) / MPP, ay + (by - ay) * 0.15 + (oy * (fa - D)) / MPP], pb = [ax + (bx - ax) * 0.85 + (ox * (fb - D)) / MPP, ay + (by - ay) * 0.85 + (oy * (fb - D)) / MPP];
      ax = pa[0] + (pa[0] - pb[0]) * k; ay = pa[1] + (pa[1] - pb[1]) * k; bx = pb[0] + (pb[0] - pa[0]) * k; by = pb[1] + (pb[1] - pa[1]) * k;
      let nx = (by - ay), ny = -(bx - ax); const nn = Math.hypot(nx, ny); nx /= nn; ny /= nn; if (nx * ox + ny * oy < 0) { nx = -nx; ny = -ny; } ox = nx; oy = ny; }
    const sh = 0;
    const len = Math.hypot(bx - ax, by - ay) * MPP, ux = (bx - ax) / (len / MPP), uy = (by - ay) / (len / MPP);
    const sax = ax + ox * sh, say = ay + oy * sh, sbx = bx + ox * sh, sby = by + oy * sh;
    // the ramp portal: where the main ramp's axis crosses this (shifted) wall; keep that end nearly untrimmed so the arch fits
    const tp = (sby - say) !== 0 ? (RAMP.y - say) / (sby - say) : -1, hasP = tp > -0.1 && tp < 1.1 && Math.max(sax, sbx) > 2600 && ox > 0.5;
    const ta = (hasP && tp < 0.5 ? 0.6 : D) / MPP, tb = (hasP && tp >= 0.5 ? 0.6 : D) / MPP;
    const fc: Facade = { ax: sax + ux * ta, ay: say + uy * ta, bx: sbx - ux * tb, by: sby - uy * tb, ox, oy, depth: D, H: Math.max(4.5, Math.min(9, deck - hP)), portal: null, chapel: false };
    if (hasP) fc.portal = (RAMP.y - fc.ay) / (fc.by - fc.ay);
    if (len > best) { best = len; longest = out.length; }
    out.push(fc);
  }
  if (longest >= 0) out[longest].chapel = true;
  // only the east wall (the one crossing the ramp axis furthest east) gets the portal; the neighbouring arcade stops short of the ramp mouth
  const xAt = (fc: Facade) => fc.ax + (fc.bx - fc.ax) * (fc.portal as number);
  const pf = out.filter((fc) => fc.portal != null).sort((a, b) => xAt(b) - xAt(a))[0];
  const keep = (RAMP.half + 3) / MPP;
  for (const fc of out) {
    if (fc === pf) continue; fc.portal = null;
    for (const e of ['a', 'b'] as const) {
      const ex = e === 'a' ? fc.ax : fc.bx, ey = e === 'a' ? fc.ay : fc.by, ox2 = e === 'a' ? fc.bx : fc.ax, oy2 = e === 'a' ? fc.by : fc.ay;
      if (ex < 2560 || Math.abs(ey - RAMP.y) >= keep || Math.abs(oy2 - ey) < 1) continue;
      const ty = ey < RAMP.y ? RAMP.y - keep : RAMP.y + keep, t = (ty - ey) / (oy2 - ey); if (t <= 0 || t > 0.7) continue;
      const nx = ex + (ox2 - ex) * t, ny = ey + (oy2 - ey) * t;
      if (e === 'a') { fc.ax = nx; fc.ay = ny; } else { fc.bx = nx; fc.by = ny; }
    }
  }
  return out;
}

/**
 * Edit the fine first-person heights (once per loaded grid): ramp + its trench, wide stair, casemate wall line, garita walks.
 * Also classifies the floors (1 = reddish earth, 2 = pale gun deck) and finds the gun positions for the brick rings.
 */
export function carveMorro(f: FortGrid & { t93?: T93 }, spots: GaritaSpot[]): T93 {
  if (f.t93) return f.t93;
  const h = f.h, cls = f.cls, fl = new Uint8Array(C * R), occ = new Uint8Array(C * R);
  for (let k = 0; k < fl.length; k++) fl[k] = cls[k] >= 1 && h[k] > 8 ? 2 : 0;
  const xs = PLAZA.map((p) => p[0]), ys = PLAZA.map((p) => p[1]);
  const pl: number[] = []; eachIn(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), (k, x, y) => { if (inPoly(x, y, PLAZA)) pl.push(h[k]); });
  const hP = median(pl, 35.6);
  const facades = plazaFacades(f, hP);
  // floors: the sunken Plaza de Armas and the lower court are packed reddish earth
  eachIn(Math.min(...xs) - 30, Math.min(...ys) - 30, Math.max(...xs) + 30, Math.max(...ys) + 30, (k, x, y) => { if (inPoly(x, y, PLAZA) && h[k] < hP + 1.2) { fl[k] = 1; occ[k] = 1; } else if (Math.abs(h[k] - hP) < 0.6 && inPoly(x, y, PLAZA.map(([px, py]) => [px + Math.sign(px - 2560) * 24, py] as [number, number]))) { fl[k] = 1; occ[k] = 1; } });
  const hCourt = medH(f, 2840, 1800, 24), hDeck = medH(f, 2930, 1920, 16);
  eachIn(COURT.x0, COURT.y0, COURT.x1, COURT.y1, (k) => { if (h[k] < COURT.hMax) { fl[k] = 1; occ[k] = 1; } });
  // main ramp: plaza level -> gentle in the cut -> steep below the arch -> battery deck
  const portal = facades.find((fc) => fc.portal != null);
  const x0 = portal ? portal.ax + (portal.bx - portal.ax) * (portal.portal as number) : 2640;
  const hEnd = medH(f, RAMP.x1 + 20, RAMP.y, 12);
  const knots: [number, number][] = [[x0, hP], [Math.max(x0 + 8, 2668), hP], [RAMP.xa, hP - 4], [RAMP.x1, hEnd]];
  const hw = RAMP.half / MPP, ww = (RAMP.half + RAMP.wall) / MPP;
  eachIn(x0 - 40, RAMP.y - ww - 40, RAMP.x1 + 48, RAMP.y + ww + 40, (k, x, y) => {
    const dy = Math.abs(y - RAMP.y), p = prof(knots, x); occ[k] = 1;
    if (x > RAMP.x1 + 2 || (x < x0 - 30 && dy > hw)) return;
    if (dy <= hw) { h[k] = p; cls[k] = 1; fl[k] = 1; occ[k] = 1; }
    else if (dy <= ww + 2) { occ[k] = 1; if (x > RAMP.xa + 8) { h[k] = p + 1.1; cls[k] = 2; fl[k] = 0; } else if (h[k] > p + 2) cls[k] = Math.max(cls[k], 1); }
  });
  // wide stair (court -> deck) and a clean court strip in front of its casemate side
  eachIn(WIDE.x0, WIDE.y0, WIDE.x1, WIDE.y1, (k, x) => { h[k] = hCourt + ((x - WIDE.x0) / (WIDE.x1 - WIDE.x0)) * (hDeck - hCourt); cls[k] = 1; fl[k] = 1; occ[k] = 1; });
  eachIn(WIDE.x0 - 6, WIDE.y0 - 10, WIDE.x1 + 4, WIDE.y0 - 1, (k) => { h[k] = hCourt; fl[k] = 1; occ[k] = 1; });
  // casemate retaining wall: crisp line, court on the north-west side, battery deck (with a 0.9 m parapet lip) on the south-east
  { const [ax, ay, bx, by] = CASEMATE, L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, nx = -uy, ny = ux;
    eachIn(Math.min(ax, bx) - 30, Math.min(ay, by) - 30, Math.max(ax, bx) + 30, Math.max(ay, by) + 30, (k, x, y) => {
      const s = (x - ax) * ux + (y - ay) * uy, d = ((x - ax) * nx + (y - ay) * ny) * MPP; if (s < 0 || s > L || Math.abs(d) > 3) return;
      occ[k] = 1; if (d < 0) { h[k] = hCourt; fl[k] = 1; } else if (d < 0.8) { h[k] = hDeck + 0.9; cls[k] = 2; fl[k] = 0; } else { h[k] = hDeck; fl[k] = 2; }
    }); }
  // garitas: a narrow walk between two high parapets from the gun deck to the sentry-box door; you can step inside
  for (const sp of spots) {
    eachIn(sp.x - 64, sp.y - 64, sp.x + 64, sp.y + 64, (k, x, y) => {
      const s = -((x - sp.x) * sp.ca + (y - sp.y) * sp.sa) * MPP, l = ((x - sp.x) * -sp.sa + (y - sp.y) * sp.ca) * MPP, r = Math.hypot(s, l);
      if (r < 7) occ[k] = 1;
      if (r <= 0.85 || (s >= 0 && s <= 5.45 && Math.abs(l) <= 0.55)) { h[k] = sp.deck; cls[k] = 1; fl[k] = 1; }
      else if (s >= 0.3 && s <= 5.6 && Math.abs(l) <= 1.55) { h[k] = sp.deck; cls[k] = 1; fl[k] = 0; } // under the walk's parapet meshes
    });
  }
  let red = 0, deck = 0; for (let k = 0; k < fl.length; k++) { if (fl[k] === 1) red++; else if (fl[k] === 2) deck++; }
  const t: T93 = { spots, hP, facades, knots, hCourt, hDeck, fl, rings: placeRings(f, fl, occ), red, deck };
  f.t93 = t; return t;
}

/** Gun positions: flat deck cells right at the foot of a parapet (0.6-2.8 m higher), open deck behind; >= 6.5 m apart. */
function placeRings(f: FortGrid, fl: Uint8Array, occ: Uint8Array): Ring[] {
  const h = f.h, cls = f.cls, out: Ring[] = [];
  const at = (i: number, j: number) => (i < 0 || j < 0 || i >= C || j >= R ? -1 : j * C + i);
  for (let j = 4; j < R - 4; j += 3) for (let i = 4; i < C - 4; i += 3) {
    const k = j * C + i; if (cls[k] !== 1 || fl[k] !== 2 || occ[k] || h[k] < 10) continue;
    const h0 = h[k]; let ok = true;
    for (const [di, dj] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) { const q = at(i + di, j + dj); if (q < 0 || Math.abs(h[q] - h0) > 0.25) { ok = false; break; } }
    if (!ok) continue;
    let bd = 99, ba = 0;
    for (let a = 0; a < 16; a++) {
      const ca = Math.cos((a / 16) * Math.PI * 2), sa = Math.sin((a / 16) * Math.PI * 2);
      for (let m = 1; m <= 7; m++) {
        const q = at(Math.round(i + ca * m), Math.round(j + sa * m)); if (q < 0) break; const dh = h[q] - h0;
        if (dh > 0.6) { if (dh < 2.8 && cls[q] === 2 && m < bd) { bd = m; ba = a; } break; }
        if (Math.abs(dh) > 0.3) break;
      }
    }
    if (bd > 7) continue;
    const ca = Math.cos((ba / 16) * Math.PI * 2), sa = Math.sin((ba / 16) * Math.PI * 2);
    for (let m = 1; m <= 7 && ok; m++) { const q = at(Math.round(i - ca * m), Math.round(j - sa * m)); if (q < 0 || occ[q] || Math.abs(h[q] - h0) > 0.3) ok = false; }
    for (let m = -6; m <= 6 && ok; m += 3) { const q = at(Math.round(i - sa * m), Math.round(j + ca * m)); if (q < 0 || Math.abs(h[q] - h0) > 0.35) ok = false; }
    if (!ok) continue;
    const x = FORT.x0 + (i + ca * (bd - 0.6)) * ST, y = FORT.y0 + (j + sa * (bd - 0.6)) * ST;
    if (out.some((r) => Math.hypot(r.x - x, r.y - y) * MPP < 6.5)) continue;
    out.push({ x, y, h: h0, ca, sa }); if (out.length >= 90) return out;
  }
  return out;
}

// ---------------------------------------------------------------- textures / materials
const TL = new THREE.TextureLoader();
function tex(n: string) { const t = TL.load(assetUrl(`assets/tex/${n}.webp`)); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat = false) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
let grime: THREE.Texture | null = null;
/** Weathered lime plaster: CC0 map + black rain/mould streaks, ochre wash patches and a damp foot (world-space grime overlay). */
function weathered(color: number, map: THREE.Texture, streak = 0.75, wash = 0.55, side: THREE.Side = THREE.FrontSide) {
  grime ??= (() => { const g = grimeTex(); g.colorSpace = THREE.NoColorSpace; return g; })();
  const m = new THREE.MeshStandardMaterial({ map, color, roughness: 0.95, metalness: 0, side });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.t_gr93 = { value: grime };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP93;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWP93 = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP93; uniform sampler2D t_gr93;').replace('#include <map_fragment>', `#include <map_fragment>
{
  vec2 wp = vec2(vWP93.x + vWP93.z, vWP93.y);
  vec4 gm = texture2D(t_gr93, wp / vec2(4.5, 5.5)); float big = texture2D(t_gr93, vWP93.xz / 17.0 + vWP93.y / 29.0).b;
  diffuseColor.rgb *= 1.0 - gm.r * ${streak.toFixed(2)};
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.06, 0.88, 0.6), smoothstep(0.47, 0.62, big) * ${wash.toFixed(2)});
  diffuseColor.rgb *= 0.86 + 0.26 * big;
}`);
  };
  m.customProgramCacheKey = () => `w93|${streak}|${wash}|${side}`;
  return m;
}
function woodDoorTex() {
  return canvasTex(128, 256, (c) => {
    c.fillStyle = '#4a2f1b'; c.fillRect(0, 0, 128, 256);
    for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#553620' : '#4d311d'; c.fillRect(i * 21 + 2, 0, 19, 256); c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(i * 21, 0, 2, 256); }
    c.fillStyle = '#2b1c10'; for (const y of [40, 128, 216]) c.fillRect(0, y, 128, 8);
    c.fillStyle = '#1b1411'; for (let i = 0; i < 18; i++) c.fillRect(8 + (i % 6) * 21, 42 + Math.floor(i / 6) * 88, 4, 4);
  });
}
/** Brick gun-pivot rings (the semicircular traverse tracks in the deck): transparent decal, diameter along the parapet. */
function ringTex() {
  return canvasTex(512, 256, (c) => {
    const k = 512 / 6.4, cx = 256, cy = 252; let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const arc = (r: number, w: number) => { // brick on edge: radial bricks ~0.23 m long with lime mortar joints, uneven, worn
      const n = Math.max(8, Math.round((Math.PI * r) / 0.23));
      c.strokeStyle = 'rgba(176,164,146,0.85)'; c.lineWidth = (w + 0.05) * k; c.beginPath(); c.arc(cx, cy, r * k, Math.PI, 2 * Math.PI); c.stroke(); // mortar bed
      for (let i = 0; i < n; i++) {
        const a0 = Math.PI + (i / n) * Math.PI + 0.01, a1 = Math.PI + ((i + 1) / n) * Math.PI - 0.01, t = rnd();
        c.strokeStyle = `rgba(${Math.round(128 + t * 46)},${Math.round(70 + t * 30)},${Math.round(52 + t * 22)},${(0.78 + rnd() * 0.2).toFixed(2)})`; c.lineWidth = w * k;
        c.beginPath(); c.arc(cx, cy, r * k, a0, a1); c.stroke();
        if (rnd() < 0.25) { c.strokeStyle = 'rgba(60,48,40,0.35)'; c.lineWidth = w * k * 0.5; c.beginPath(); c.arc(cx, cy, r * k, a0, a0 + (a1 - a0) * 0.6); c.stroke(); } // grime
      }
    };
    arc(3.0, 0.3); arc(2.0, 0.26); arc(1.05, 0.22);
    c.fillStyle = 'rgba(132,124,110,0.95)'; c.beginPath(); c.arc(cx, cy, 0.4 * k, Math.PI, 2 * Math.PI); c.fill(); // pivot stone
    c.fillStyle = 'rgba(52,46,40,0.9)'; c.beginPath(); c.arc(cx, cy - 6, 0.08 * k, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(140,78,58,0.85)'; c.fillRect(cx - 3.2 * k, cy - 0.12 * k, 6.4 * k, 0.24 * k); // brick sill along the parapet
  });
}
/** The plaza chapel front (white frontispiece, paired pilasters, pediment with cross, niche) — door left transparent. */
function chapelTex(W: number, H: number, door: { w: number; spring: number }) {
  const px = 512 / W, py = 512 / H;
  return canvasTex(512, 512, (c) => {
    const X = (m: number) => 256 + m * px, Y = (m: number) => 512 - m * py;
    c.fillStyle = '#f1ece0'; c.fillRect(X(-3.3), Y(H - 0.2), 6.6 * px, (H - 0.2) * py);
    c.fillStyle = '#e0a94a'; c.fillRect(X(-2.4), Y(H - 1.6), 4.8 * px, (H - 1.9) * py);              // ochre field
    c.fillStyle = '#f4f0e6'; for (const x of [-3.2, -2.55, 1.95, 2.6]) c.fillRect(X(x), Y(H - 1.2), 0.6 * px, (H - 1.2) * py); // pilasters
    c.fillRect(X(-3.4), Y(H - 1.0), 6.8 * px, 0.4 * py);                                              // entablature
    c.beginPath(); c.moveTo(X(-3.2), Y(H - 1.0)); c.lineTo(X(0), Y(H - 0.05)); c.lineTo(X(3.2), Y(H - 1.0)); c.closePath(); c.fill(); // pediment
    c.strokeStyle = '#c9bfae'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#7d6a55'; c.fillRect(X(-0.05), Y(H - 0.15), 0.1 * px, 0.6 * py); c.fillRect(X(-0.22), Y(H - 0.35), 0.44 * px, 0.08 * py);
    c.fillStyle = '#d9cdb8'; c.beginPath(); c.arc(X(0), Y(H - 2.1), 0.42 * px, Math.PI, 0); c.lineTo(X(0.42), Y(H - 3.0)); c.lineTo(X(-0.42), Y(H - 3.0)); c.closePath(); c.fill(); // niche
    c.fillStyle = '#f7f3ea'; const r = door.w / 2 + 0.35; c.beginPath(); c.moveTo(X(-r), Y(0)); c.lineTo(X(-r), Y(door.spring)); c.arc(X(0), Y(door.spring), r * px, Math.PI, 0); c.lineTo(X(r), Y(0)); c.closePath(); c.fill(); // door surround
    c.globalCompositeOperation = 'destination-out'; const d = door.w / 2;
    c.beginPath(); c.moveTo(X(-d), Y(0)); c.lineTo(X(-d), Y(door.spring)); c.arc(X(0), Y(door.spring), d * px, Math.PI, 0); c.lineTo(X(d), Y(0)); c.closePath(); c.fill();
    c.globalCompositeOperation = 'source-over';
    const g = c.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, 'rgba(60,50,40,0.0)'); g.addColorStop(1, 'rgba(60,50,40,0.18)'); c.fillStyle = g; c.globalCompositeOperation = 'source-atop'; c.fillRect(0, 0, 512, 512);
  });
}

// ---------------------------------------------------------------- geometry helpers
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
/** Hexahedron from 8 corners (bottom 0-3, top 4-7, same order), faces auto-oriented outward, flat normals. */
function prism(v: THREE.Vector3[]): THREE.BufferGeometry {
  const F = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
  const ctr = v.reduce((a, b) => a.clone().add(b), V(0, 0, 0)).multiplyScalar(1 / 8), out: number[] = [];
  for (const q of F) {
    let [a, b, c, d] = q.map((i) => v[i]); const fc = a.clone().add(b).add(c).add(d).multiplyScalar(0.25);
    const n = b.clone().sub(a).cross(c.clone().sub(a)); if (n.lengthSq() < 1e-10) { const n2 = c.clone().sub(a).cross(d.clone().sub(a)); if (n2.dot(fc.clone().sub(ctr)) < 0) [b, d] = [d, b]; } else if (n.dot(fc.clone().sub(ctr)) < 0) [b, d] = [d, b];
    for (const p of [a, b, c, a, c, d]) out.push(p.x, p.y, p.z);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); g.computeVertexNormals(); return g;
}
/** A slab along p->q (world xz), lateral offsets l0..l1 (left = +perp), bottom/top heights at each end. */
function slab(p: [number, number], q: [number, number], l0: number, l1: number, bp: number, tp: number, bq: number, tq: number) {
  const dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz), nx = -dz / L, nz = dx / L;
  const c = (o: [number, number], l: number, y: number) => V(o[0] + nx * l, y, o[1] + nz * l);
  return prism([c(p, l0, bp), c(p, l1, bp), c(q, l1, bq), c(q, l0, bq), c(p, l0, tp), c(p, l1, tp), c(q, l1, tq), c(q, l0, tq)]);
}
interface Notch { c: number; w: number; spring: number }
/** Wall outline W x H (x centred, y up) with arched openings cut up from the bottom edge. */
function notchShape(W: number, H: number, notches: Notch[], y0 = 0) {
  const s = new THREE.Shape(); s.moveTo(-W / 2, y0);
  for (const n of [...notches].sort((a, b) => a.c - b.c)) { const r = n.w / 2; s.lineTo(n.c - r, y0); s.lineTo(n.c - r, n.spring); s.absarc(n.c, n.spring, r, Math.PI, 0, true); s.lineTo(n.c + r, y0); }
  s.lineTo(W / 2, y0); s.lineTo(W / 2, H); s.lineTo(-W / 2, H); s.lineTo(-W / 2, y0); return s;
}
function archPath(c: number, w: number, y0: number, spring: number) { const p = new THREE.Path(), r = w / 2; p.moveTo(c - r, y0); p.lineTo(c + r, y0); p.lineTo(c + r, spring); p.absarc(c, spring, r, 0, Math.PI, false); p.lineTo(c - r, y0); return p; }
function halfRing(ri: number, ro: number) { const s = new THREE.Shape(); s.moveTo(-ro, 0); s.absarc(0, 0, ro, Math.PI, 0, true); s.lineTo(ri, 0); s.absarc(0, 0, ri, 0, Math.PI, false); s.lineTo(-ro, 0); return s; }
const extrude = (s: THREE.Shape, depth: number) => new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 14 });
/** Local frame: x along u (world xz unit), y up, z = (-uz, 0, ux), origin o (world). */
function frame(o: THREE.Vector3, ux: number, uz: number) { return new THREE.Matrix4().makeBasis(V(ux, 0, uz), V(0, 1, 0), V(-uz, 0, ux)).setPosition(o); }
/** Turn a solid's faces inside-out (vaults / casemate rooms seen from within). */
function inside(g: THREE.BufferGeometry) {
  const n = g.index ? g.toNonIndexed() : g, p = n.attributes.position as THREE.BufferAttribute, uv = n.attributes.uv as THREE.BufferAttribute | undefined;
  for (let i = 0; i < p.count; i += 3) { for (const a of [p, uv]) { if (!a) continue; for (let c = 0; c < a.itemSize; c++) { const t = a.array[(i + 1) * a.itemSize + c]; (a.array as Float32Array)[(i + 1) * a.itemSize + c] = a.array[(i + 2) * a.itemSize + c]; (a.array as Float32Array)[(i + 2) * a.itemSize + c] = t; } } }
  n.computeVertexNormals(); return n;
}
/** Collects geometry per material, bakes transforms + world-scaled UVs, merges into one mesh per material. */
class Merge {
  private m = new Map<THREE.Material, THREE.BufferGeometry[]>();
  add(geo: THREE.BufferGeometry, mat: THREE.Material, uv: number | [number, number] | null = 2.4, mtx?: THREE.Matrix4) {
    let g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (mtx) g.applyMatrix4(mtx);
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    if (!g.attributes.normal) g.computeVertexNormals();
    const p = g.attributes.position as THREE.BufferAttribute, n = g.attributes.normal as THREE.BufferAttribute;
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(p.count * 2), 2));
    const u = g.attributes.uv as THREE.BufferAttribute;
    if (typeof uv === 'number') for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
      if (ay > 0.6) u.setXY(i, x / uv, z / uv); else if (ax > az) u.setXY(i, z / uv, y / uv); else u.setXY(i, x / uv, y / uv);
    } else if (uv) for (let i = 0; i < p.count; i++) u.setXY(i, u.getX(i) * uv[0], u.getY(i) * uv[1]);
    (this.m.get(mat) ?? this.m.set(mat, []).get(mat)!).push(g);
    if (geo !== g) geo.dispose();
  }
  build(group: THREE.Group, name: string) {
    let tris = 0;
    for (const [mat, gs] of this.m) {
      const geo = mergeGeometries(gs, false); if (!geo) continue; gs.forEach((g) => g.dispose());
      const mesh = new THREE.Mesh(geo, mat); mesh.name = name; mesh.castShadow = !(mat as THREE.MeshStandardMaterial).transparent; mesh.receiveShadow = true;
      if ((mat as THREE.MeshStandardMaterial).transparent) mesh.userData.arcade = true; // keep decals out of the shadow pass
      group.add(mesh); tris += geo.attributes.position.count / 3;
    }
    this.m.clear(); return tris;
  }
}

export interface T93Set { group: THREE.Group; stats: { garitas: number; approaches: number; bays: number; chapel: number; rampSteps: number; wideSteps: number; casemates: number; rings: number; cannons: number; arches: number; red: number; deck: number; tris: number } }

/** Build every t93 set piece (all merged per material: a dozen draw calls). Heights come from the carved fine grid. */
export function morroT93(f: FortGrid, S: number, t: T93): T93Set {
  const group = new THREE.Group(); group.name = 'morro_t93';
  const tPl = tex('mr_plaster'), tBr = tex('mr_brick'), tGv = tex('mr_gravel'), tEa = tex('mr_earth'), tDk = tex('mr_deck'), tP2 = tex('plaster');
  const M = {
    weath: weathered(0xe2dacb, tPl), weathDim: weathered(0x6e665b, tPl, 0.5, 0.2), interior: weathered(0x4a433b, tPl, 0.4, 0.1),
    yellow: weathered(0xe7ae4c, tP2, 0.35, 0.15), white: weathered(0xf4efe3, tP2, 0.35, 0.05), vault: weathered(0xcfc9bb, tP2, 0.3, 0.05),
    brick: new THREE.MeshStandardMaterial({ map: tBr, color: 0xd8c4b4, roughness: 0.92 }), gravel: new THREE.MeshStandardMaterial({ map: tGv, color: 0xa99d88, roughness: 1 }),
    step: new THREE.MeshStandardMaterial({ map: tDk, color: 0x9a948a, roughness: 0.95 }), earth: new THREE.MeshStandardMaterial({ map: tEa, color: new THREE.Color().setRGB(3.4, 4.2, 4.4), roughness: 1 }),
    deckTop: new THREE.MeshStandardMaterial({ map: tDk, color: 0xd9d2c4, roughness: 0.95 }), door: new THREE.MeshStandardMaterial({ map: woodDoorTex(), roughness: 0.85 }),
    iron: new THREE.MeshStandardMaterial({ color: 0x26282b, roughness: 0.55, metalness: 0.55 }), wood: new THREE.MeshStandardMaterial({ color: 0x5b3f26, roughness: 0.9 }),
    slit: new THREE.MeshBasicMaterial({ color: 0xe6edf2 }), water: new THREE.MeshStandardMaterial({ color: 0x1d2322, roughness: 0.15, metalness: 0.2 }),
    ring: new THREE.MeshStandardMaterial({ map: ringTex(), transparent: true, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, depthWrite: false }),
  };
  const mg = new Merge(); const W = (px: number) => px * S;
  const st = { garitas: 0, approaches: 0, bays: 0, chapel: 0, rampSteps: 0, wideSteps: 0, casemates: 0, rings: 0, cannons: 0, arches: 0, red: t.red, deck: t.deck, tris: 0 };

  // ------------------------------------------------ Plaza de Armas: 3D arcade (real arched openings, vaulted bays you can walk into)
  const hP = t.hP;
  for (const fc of t.facades) {
    let ax = fc.ax, ay = fc.ay, bx = fc.bx, by = fc.by; let L = Math.hypot(bx - ax, by - ay) * MPP; if (L < 4) continue;
    let ux = (bx - ax) / (L / MPP), uz = (by - ay) / (L / MPP);
    if (Math.abs(-uz - fc.ox) + Math.abs(ux - fc.oy) > 0.2) { [ax, ay, bx, by] = [bx, by, ax, ay]; ux = -ux; uz = -uz; } // z axis = outward (into the wall)
    const portalT = fc.portal == null ? null : (ax === fc.ax ? fc.portal : 1 - fc.portal);
    const o = V(W((ax + bx) / 2), hP - 0.15, W((ay + by) / 2)), mt = frame(o, ux, uz), H = fc.H + 0.15, D = fc.depth;
    const n = Math.max(1, Math.round(L / 4.6)), bw = L / n, w = Math.min(2.6, bw - 1.2), spring = Math.min(2.6, H - 1.9 - w / 2);
    const notches: Notch[] = [], bays: number[] = [];
    const pw = 2 * RAMP.half, pc = portalT == null ? null : Math.max(-L / 2 + pw / 2 + 0.6, Math.min(L / 2 - pw / 2 - 0.6, -L / 2 + portalT * L));
    for (let i = 0; i < n; i++) { const c = -L / 2 + bw * (i + 0.5); if (pc != null && Math.abs(c - pc) < 4.6) continue; if (fc.chapel && Math.abs(c) < 4.6) continue; notches.push({ c, w, spring }); bays.push(c); }
    if (pc != null) notches.push({ c: pc, w: pw, spring: Math.min(3.4, H - 0.8 - pw / 2) });
    const door = { w: 1.7, spring: 2.5 }; if (fc.chapel) { notches.push({ c: 0, w: door.w, spring: door.spring }); st.chapel = 1; }
    mg.add(extrude(notchShape(L, H, notches), 0.55), M.yellow, 2.4, mt);
    // white trim: pilasters between bays, archivolts, cornice + string course
    for (let i = 0; i <= n; i++) { const c = -L / 2 + bw * i; if ((pc != null && Math.abs(c - pc) < pw / 2 + 0.6) || (fc.chapel && Math.abs(c) < 3.6)) continue; const g = new THREE.BoxGeometry(0.55, H - 0.6, 0.72).translate(c, (H - 0.6) / 2, 0.21); mg.add(g, M.white, 2.4, mt); }
    for (const nt of notches) { if (fc.chapel && nt.c === 0) continue; const g = extrude(halfRing(nt.w / 2, nt.w / 2 + 0.24), 0.66).translate(nt.c, nt.spring, -0.06); mg.add(g, M.white, 2.4, mt); }
    mg.add(new THREE.BoxGeometry(L, 0.45, 0.9).translate(0, H - 0.22, 0.2), M.white, 2.4, mt);
    mg.add(new THREE.BoxGeometry(L, 0.16, 0.66).translate(0, H - 1.05, 0.2), M.white, 2.4, mt);
    mg.add(new THREE.BoxGeometry(L, 0.45, D + 0.6).translate(0, H + 0.2, (D + 0.6) / 2), M.deckTop, 3.0, mt); // roof deck over the bays
    // vaulted bays behind each arch (walk-in), wooden door at the back
    for (const c of bays) {
      const rw = w + 0.5, r = rw / 2, depth = D - 0.55;
      const vault = new THREE.CylinderGeometry(r, r, depth, 12, 1, true, -Math.PI / 2, Math.PI).rotateX(-Math.PI / 2).translate(c, spring, 0.55 + depth / 2);
      mg.add(inside(vault), M.vault, [3, 1], mt);
      for (const sx of [-1, 1]) mg.add(new THREE.BoxGeometry(0.3, spring, depth).translate(c + sx * (r + 0.15), spring / 2, 0.55 + depth / 2), M.vault, 2.4, mt);
      mg.add(new THREE.BoxGeometry(rw, spring + r, 0.2).translate(c, (spring + r) / 2, D + 0.1), M.vault, 2.4, mt);
      mg.add(new THREE.PlaneGeometry(1.3, 2.3).rotateY(Math.PI).translate(c, 1.15, D - 0.02), M.door, null, mt);
      st.bays++;
    }
    if (pc != null) { // portal passage walls from the arcade to the ramp cut
      for (const sx of [-1, 1]) mg.add(new THREE.BoxGeometry(0.5, H, D + 0.4).translate(pc + sx * (pw / 2 + 0.25), H / 2, (D + 0.4) / 2), M.yellow, 2.4, mt);
      st.arches++;
    }
    if (fc.chapel) {
      const ct = new THREE.MeshStandardMaterial({ map: chapelTex(8, H, door), transparent: true, alphaTest: 0.5, roughness: 0.9 });
      mg.add(new THREE.PlaneGeometry(8, H).rotateY(Math.PI).translate(0, H / 2, -0.03), ct, null, mt);
      mg.add(new THREE.BoxGeometry(door.w + 0.1, door.spring + door.w / 2 + 0.1, 0.12).translate(0, (door.spring + door.w / 2) / 2, 0.5), M.door, [1, 1], mt);
    }
  }
  // the well (white plaster curb, stone rim, dark water)
  { const x = W(WELL[0]), z = W(WELL[1]);
    mg.add(new THREE.CylinderGeometry(1.25, 1.35, 0.95, 8).translate(x, hP + 0.45, z), M.white, 2.4);
    mg.add(new THREE.CylinderGeometry(1.42, 1.42, 0.14, 8).translate(x, hP + 0.98, z), M.step, 1.5);
    mg.add(new THREE.CylinderGeometry(1.0, 1.0, 0.02, 16).translate(x, hP + 0.72, z), M.water, null);
    for (const sx of [-1, 1]) mg.add(new THREE.BoxGeometry(0.08, 1.6, 0.08).translate(x + sx * 1.05, hP + 1.75, z), M.iron, null);
    mg.add(new THREE.BoxGeometry(2.2, 0.08, 0.08).translate(x, hP + 2.55, z), M.iron, null); }

  // ------------------------------------------------ main ramp: gravel centre, brick curbs, stone stairs on both sides, arch, causeway walls
  const k = t.knots, x0 = k[0][0], ry = W(RAMP.y), P = (x: number) => prof(k, x);
  for (let x = x0; x < RAMP.x1 - 0.5; x += 8) {
    const xb = Math.min(RAMP.x1, x + 8), ha = P(x), hb = P(xb);
    mg.add(slab([W(x), ry], [W(xb), ry], -RAMP.gravel, RAMP.gravel, ha - 0.35, ha + 0.04, hb - 0.35, hb + 0.04), M.gravel, 1.6);
    for (const sx of [-1, 1]) mg.add(slab([W(x), ry], [W(xb), ry], sx * RAMP.gravel, sx * (RAMP.gravel + 0.22), ha - 0.35, ha + 0.16, hb - 0.35, hb + 0.16), M.brick, 1.2);
    if (x > RAMP.xa + 6) for (const sx of [-1, 1]) {
      mg.add(slab([W(x), ry], [W(xb), ry], sx * RAMP.half, sx * (RAMP.half + RAMP.wall), Math.min(ha, hb) - 9, ha + 1.1, Math.min(ha, hb) - 9, hb + 1.1), M.weath, 2.4);
      mg.add(slab([W(x), ry], [W(xb), ry], sx * (RAMP.half - 0.04), sx * (RAMP.half + RAMP.wall + 0.04), ha + 1.1, ha + 1.24, hb + 1.1, hb + 1.24), M.brick, 1.2);
    }
  }
  { let x = x0; while (x < RAMP.x1 - 1) { // individual steps, run follows the local slope (~0.16 m rise)
      const sl = Math.abs(P(x + 4) - P(x)) / (4 * MPP), run = Math.min(1.4, Math.max(0.32, 0.165 / Math.max(sl, 1e-3))) / MPP, xb = Math.min(RAMP.x1, x + run);
      const top = P(x) + 0.03, bot = P(xb) - 0.35;
      for (const sx of [-1, 1]) mg.add(slab([W(x), ry], [W(xb), ry], sx * (RAMP.gravel + 0.22), sx * RAMP.half, bot, top, bot, top), M.step, 1.2);
      st.rampSteps += 2; x = xb; } }
  { // the arch through the terreplein wall (looking up the ramp: gravel + side stairs vanish into it)
    const xa = RAMP.xa, base = P(xa) - 0.6, top = Math.max(medH(f, xa - 40, RAMP.y - 60, 8), medH(f, xa - 40, RAMP.y + 60, 8)) + 0.3, Wd = 2 * (RAMP.half + RAMP.wall) + 7;
    const spring = Math.min(4.2, top - base - 1.2 - RAMP.half) + 0.6, th = 2.4;
    const mt = frame(V(W(xa) - th / 2, base, ry), 0, -1);
    mg.add(extrude(notchShape(Wd, top - base, [{ c: 0, w: 2 * RAMP.half, spring }]), th), M.weath, 2.4, mt);
    for (const z of [-0.08, th - 0.5]) mg.add(extrude(halfRing(RAMP.half, RAMP.half + 0.45), 0.58).translate(0, spring, z), M.brick, 1.2, mt);
    st.arches++;
  }

  // ------------------------------------------------ wide stair: lower court -> battery deck, casemate arches under its court side
  { const L = (WIDE.x1 - WIDE.x0) * MPP, dH = t.hDeck - t.hCourt, n = Math.max(8, Math.round(L / 0.36)), zc = W((WIDE.y0 + WIDE.y1) / 2), hw = ((WIDE.y1 - WIDE.y0) * MPP) / 2;
    for (let i = 0; i < n; i++) {
      const xa = W(WIDE.x0) + (L * i) / n, xb = W(WIDE.x0) + (L * (i + 1)) / n, top = t.hCourt + (dH * (i + 1)) / n + 0.02;
      mg.add(slab([xa, zc], [xb, zc], -hw + 0.3, hw - 0.3, top - 0.45, top, top - 0.45, top), M.step, 1.2); st.wideSteps++;
    }
    for (const sx of [-1, 1]) mg.add(slab([W(WIDE.x0), zc], [W(WIDE.x1), zc], sx * (hw - 0.3), sx * hw, t.hCourt - 0.3, t.hCourt + 0.3, t.hDeck - 0.3, t.hDeck + 0.3), M.brick, 1.2);
    // court-side wall (parapet over the flight) pierced by casemates
    const sh = new THREE.Shape(); sh.moveTo(0, -0.1); sh.lineTo(L, -0.1); sh.lineTo(L, dH + 1.0); sh.lineTo(0, 1.0); sh.lineTo(0, -0.1);
    const cs: number[] = []; for (let s = L - 1.7; s - 1 >= 1 + (2.2 * L) / dH; s -= 2.7) cs.push(s);
    for (const s of cs) sh.holes.push(archPath(s, 2.0, 0, 1.7));
    const mt = frame(V(W(WIDE.x0), t.hCourt, W(WIDE.y0) - 1.2), 1, 0);
    mg.add(extrude(sh, 1.6), M.weath, 2.4, mt);
    mg.add(slab([W(WIDE.x0), W(WIDE.y0) - 0.4], [W(WIDE.x1), W(WIDE.y0) - 0.4], -0.86, 0.86, t.hCourt + 1.0, t.hCourt + 1.14, t.hDeck + 1.0, t.hDeck + 1.14), M.brick, 1.2);
    for (const s of cs) { mg.add(inside(new THREE.BoxGeometry(2.0, 2.7, 3.0).translate(s, 1.35, 1.6 + 1.5)), M.interior, 2.0, mt); st.casemates++; }
  }
  { // casemate retaining wall between the lower court and the battery deck
    const [ax, ay, bx, by] = CASEMATE, L = Math.hypot(bx - ax, by - ay) * MPP, ux = (bx - ax) / (L / MPP), uz = (by - ay) / (L / MPP), dH = t.hDeck - t.hCourt;
    const sh = new THREE.Shape(); sh.moveTo(-L / 2, -0.1); sh.lineTo(L / 2, -0.1); sh.lineTo(L / 2, dH + 0.9); sh.lineTo(-L / 2, dH + 0.9); sh.lineTo(-L / 2, -0.1);
    const cs = [-L / 3, 0, L / 3]; for (const c of cs) sh.holes.push(archPath(c, 2.4, 0, 2.0));
    const mt = frame(V(W((ax + bx) / 2) + uz * 0.9, t.hCourt, W((ay + by) / 2) - ux * 0.9), ux, uz);
    mg.add(extrude(sh, 1.9), M.weath, 2.4, mt);
    mg.add(new THREE.BoxGeometry(L, 0.14, 2.05).translate(0, dH + 0.97, 0.95), M.brick, 1.2, mt);
    for (const c of cs) { mg.add(inside(new THREE.BoxGeometry(2.4, 3.2, 3.6).translate(c, 1.6, 1.9 + 1.8)), M.interior, 2.0, mt); mg.add(new THREE.PlaneGeometry(1.1, 2.0).rotateY(Math.PI).translate(c, 1.0, 1.9 + 3.55), M.door, null, mt); st.casemates++; }
  }

  // ------------------------------------------------ brick gun-pivot rings (+ a cannon on every other one)
  const ringGeo = new THREE.PlaneGeometry(6.4, 3.2).translate(0, 1.6, 0).rotateX(-Math.PI / 2);
  t.rings.forEach((r, i) => {
    const mt = new THREE.Matrix4().makeTranslation(W(r.x), r.h + 0.03, W(r.y)).multiply(new THREE.Matrix4().makeRotationY(Math.atan2(r.ca, r.sa)));
    mg.add(ringGeo, M.ring, null, mt); st.rings++;
    if (i % 2 === 0) { // iron gun on a wooden garrison carriage, muzzle to the embrasure
      mg.add(new THREE.BoxGeometry(0.95, 0.5, 1.7).translate(0, 0.35, -1.1), M.wood, null, mt);
      for (const sx of [-1, 1]) for (const z of [-0.5, -1.7]) mg.add(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 10).rotateZ(Math.PI / 2).translate(sx * 0.52, 0.22, z), M.wood, null, mt);
      mg.add(new THREE.CylinderGeometry(0.15, 0.24, 2.7, 12).rotateX(Math.PI / 2).translate(0, 0.78, -0.6), M.iron, null, mt);
      mg.add(new THREE.SphereGeometry(0.2, 10, 6).translate(0, 0.78, -2.0), M.iron, null, mt);
      st.cannons++;
    }
  });
  ringGeo.dispose();

  // ------------------------------------------------ garitas (t94u): weathered sentry box + narrow walk between high parapets
  for (const sp of t.spots) {
    const mt = new THREE.Matrix4().makeTranslation(W(sp.x), sp.deck, W(sp.y)).multiply(new THREE.Matrix4().makeRotationY(Math.atan2(sp.ca, sp.sa)));
    garita93(mg, M, mt); st.garitas++;
    // approach (local: -z = inward toward the gun deck)
    const p: [number, number] = [0, -0.35], q: [number, number] = [0, -5.45];
    mg.add(slab([0, -0.8], q, -0.58, 0.58, -0.3, 0.03, -0.3, 0.03), M.earth, 2.0, mt);
    for (const sx of [-1, 1]) {
      mg.add(slab(p, q, sx * 0.55, sx * 1.35, -3, 1.9, -3, 1.9), M.weath, 2.4, mt);
      mg.add(slab(p, q, sx * 0.51, sx * 0.6, 0, 0.3, 0, 0.3), M.brick, 1.0, mt);
      mg.add(slab(p, q, sx * 0.52, sx * 1.38, 1.9, 2.0, 1.9, 2.0), M.weathDim, 2.4, mt); // rounded-off coping
    }
    st.approaches++;
  }
  st.tris = mg.build(group, 'morro_t93');
  return { group, stats: st };
}

/** Garita in its local frame (floor at y 0, door facing -z): corbel, open-doored drum with a deep dark interior, dome + ball finial. */
function garita93(mg: Merge, M: Record<string, THREE.Material>, mt: THREE.Matrix4) {
  const gap = 0.78, r0 = 1.0, ri = 0.78, hb = 2.3, door = 1.8;
  const corbel = new THREE.LatheGeometry([new THREE.Vector2(0.05, -1.9), new THREE.Vector2(0.35, -1.75), new THREE.Vector2(0.62, -1.3), new THREE.Vector2(0.84, -0.7), new THREE.Vector2(1.0, -0.2), new THREE.Vector2(1.08, -0.05), new THREE.Vector2(1.08, 0.05)], 20);
  mg.add(corbel, M.weath, [3, 1], mt);
  const ts = Math.PI + gap / 2, tl = Math.PI * 2 - gap;
  mg.add(new THREE.CylinderGeometry(r0, r0 + 0.04, hb, 26, 1, true, ts, tl).translate(0, hb / 2, 0), M.weath, [3.4, 1], mt);
  mg.add(inside(new THREE.CylinderGeometry(ri, ri, hb, 20, 1, true, ts, tl).translate(0, hb / 2, 0)), M.interior, [2.5, 1], mt);
  for (const sg of [-1, 1]) { const a = Math.PI + (sg * gap) / 2; mg.add(slab([Math.sin(a) * ri, Math.cos(a) * ri], [Math.sin(a) * (r0 + 0.02), Math.cos(a) * (r0 + 0.02)], 0, -sg * 0.06, 0, door, 0, door), M.weathDim, 1.0, mt); }
  mg.add(new THREE.CylinderGeometry(r0, r0, hb - door, 10, 1, true, Math.PI - gap / 2, gap).translate(0, (hb + door) / 2, 0), M.weath, [0.6, 0.3], mt); // lintel
  mg.add(inside(new THREE.CylinderGeometry(ri, ri, hb - door, 8, 1, true, Math.PI - gap / 2, gap).translate(0, (hb + door) / 2, 0)), M.interior, [0.5, 0.3], mt);
  mg.add(new THREE.BoxGeometry(2 * Math.sin(gap / 2) * r0, 0.04, r0 - ri + 0.04).translate(0, door, -(r0 + ri) / 2), M.weathDim, 1.0, mt);
  mg.add(new THREE.CircleGeometry(ri, 18).rotateX(-Math.PI / 2).translate(0, 0.02, 0), M.earth, 1.2, mt);
  mg.add(new THREE.CylinderGeometry(r0 + 0.13, r0 + 0.1, 0.18, 26).translate(0, hb + 0.08, 0), M.weath, [3.4, 0.2], mt); // cornice
  mg.add(new THREE.SphereGeometry(r0 + 0.04, 26, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.8, 1).translate(0, hb + 0.17, 0), M.weath, [3, 1], mt);
  mg.add(inside(new THREE.SphereGeometry(ri, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.7, 1).translate(0, hb, 0)), M.interior, [2, 1], mt);
  mg.add(new THREE.CylinderGeometry(0.08, 0.15, 0.32, 10).translate(0, hb + 0.17 + 0.8 * (r0 + 0.04) + 0.12, 0), M.weath, [0.5, 0.3], mt);
  mg.add(new THREE.SphereGeometry(0.17, 12, 8).translate(0, hb + 0.17 + 0.8 * (r0 + 0.04) + 0.42, 0), M.weath, [0.6, 0.6], mt); // ball finial
  for (const a of [0, -1.15, 1.15]) { // observation slits: dark outside, a sliver of sky seen from within
    mg.add(new THREE.BoxGeometry(0.09, 0.5, 0.06).rotateY(a).translate(Math.sin(a) * (r0 + 0.01), 1.6, Math.cos(a) * (r0 + 0.01)), M.interior, null, mt);
    mg.add(new THREE.BoxGeometry(0.06, 0.45, 0.02).rotateY(a).translate(Math.sin(a) * (ri - 0.01), 1.6, Math.cos(a) * (ri - 0.01)), M.slit, null, mt);
  }
}
