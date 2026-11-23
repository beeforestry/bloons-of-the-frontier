// t108 GMMG-3: 2D walk cycle for the painted bug sprites (one still image each). The leg band of the sprite (lower part)
// is warped into WALK_FRAMES frames: alternating leg groups swing forward/back and lift, more at the feet than at the hips,
// so the legs scuttle while the body stays put. Frames are built once per sprite (ImageData warp, cached) and picked from
// the distance walked, so legs stop when the bug stops. Balloons have no legs and are never warped.
import type { Img } from './sprites';

export const WALK_FRAMES = 8;
/** Per-sprite gait: band = where the legs start (fraction of height from the top), groups = alternating leg groups across
 *  the width (spiders 6 ≈ tripod gait, bipeds 2 = left/right leg), amp = foot swing (fraction of width), lift = foot lift. */
interface Gait { band: number; groups: number; amp: number; lift: number; xs?: [number, number] }
const GAIT: Record<string, Gait> = {
  bug_scavenger: { band: 0.34, groups: 6, amp: 0.05, lift: 0.05 },
  bug_hunter: { band: 0.5, groups: 4, amp: 0.045, lift: 0.04 },
  bug_charger: { band: 0.55, groups: 6, amp: 0.035, lift: 0.04 },
  bug_brood: { band: 0.6, groups: 6, amp: 0.035, lift: 0.04 },
  bug_titan: { band: 0.55, groups: 4, amp: 0.035, lift: 0.04 },
  bug_ironback: { band: 0.55, groups: 6, amp: 0.04, lift: 0.045 },
  bug_warden: { band: 0.55, groups: 6, amp: 0.04, lift: 0.045 },
  boss_scarab: { band: 0.62, groups: 6, amp: 0.035, lift: 0.035 },
  boss_dreadnought: { band: 0.7, groups: 2, amp: 0.06, lift: 0.035, xs: [0.18, 0.72] }, // legs only (the mace hangs at the right)
  boss_leviathan: { band: 0.55, groups: 6, amp: 0.035, lift: 0.04 },
};
const DEF: Gait = { band: 0.55, groups: 6, amp: 0.04, lift: 0.04 };
const cache = new Map<string, HTMLCanvasElement[] | null>();
export const walkStats = { built: 0, frames: WALK_FRAMES };
(window as unknown as { __walk?: unknown }).__walk = { stats: walkStats, frame: (k: string, im: Img, s: number) => walkFrame(k, im, s), frames: (k: string, im: Img) => walkFrames(k, im) };
/** Leg-warped frames for a sprite (null if it can't be read yet, e.g. still loading). */
export function walkFrames(key: string, im: Img): HTMLCanvasElement[] | null {
  const ck = key + ':' + im.width + 'x' + im.height;
  if (cache.has(ck)) return cache.get(ck)!;
  if ((im as HTMLImageElement).complete === false || !im.width) return null;
  const W = im.width, H = im.height, G = GAIT[key] ?? DEF;
  let src: ImageData;
  try { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d', { willReadFrequently: true })!; x.drawImage(im, 0, 0); src = x.getImageData(0, 0, W, H); }
  catch { cache.set(ck, null); return null; }
  const y0 = Math.floor(H * G.band), A = W * G.amp * 1.3, L = H * G.lift * 1.2, out: HTMLCanvasElement[] = [];
  // alternating leg groups across the width, smoothed at the borders so no seams appear
  const grp = new Float32Array(W); for (let x = 0; x < W; x++) {
    const u = (x + 0.5) / W, xs = G.xs, wx = xs ? Math.min(1, Math.max(0, (u - xs[0]) / 0.06), Math.max(0, (xs[1] - u) / 0.06)) : 1;
    grp[x] = wx * Math.tanh(3 * Math.sin(Math.PI * G.groups * (xs ? (u - xs[0]) / (xs[1] - xs[0]) : u)));
  }
  for (let f = 0; f < WALK_FRAMES; f++) {
    const ph = (f / WALK_FRAMES) * Math.PI * 2, s = Math.sin(ph), co = Math.cos(ph);
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x2 = c.getContext('2d')!;
    const dst = x2.createImageData(W, H), d = dst.data, sd = src.data;
    d.set(sd.subarray(0, y0 * W * 4)); // body unchanged
    for (let y = y0; y < H; y++) {
      const t = Math.pow((y - y0) / Math.max(1, H - y0), 1.25); // 0 at the hips -> 1 at the feet
      for (let x = 0; x < W; x++) {
        const g = grp[x], dx = s * g * A * t, dy = Math.max(0, co * g) * L * t;
        const sx = Math.round(x - dx), sy = Math.round(y + dy), o = (y * W + x) * 4;
        if (sx < 0 || sx >= W || sy < 0 || sy >= H) { d[o + 3] = 0; continue; }
        const i = (sy * W + sx) * 4; d[o] = sd[i]; d[o + 1] = sd[i + 1]; d[o + 2] = sd[i + 2]; d[o + 3] = sd[i + 3];
      }
    }
    x2.putImageData(dst, 0, 0); out.push(c);
  }
  walkStats.built++; cache.set(ck, out); return out;
}
/** Frame for a walked distance `stride` (radians of gait phase). */
export function walkFrame(key: string, im: Img, stride: number): Img {
  const fr = walkFrames(key, im); if (!fr) return im;
  const i = Math.floor(((stride / (Math.PI * 2)) % 1 + 1) % 1 * WALK_FRAMES) % WALK_FRAMES; return fr[i];
}
/** After a GPU reset the cached canvases come back blank. */
export function clearWalkCache() { cache.clear(); }
