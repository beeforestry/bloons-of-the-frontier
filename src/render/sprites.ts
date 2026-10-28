// =============================================================================
// SPRITES (art v3): one unified realistic painterly 3/4-view set, generated from
// the user's concept art and processed by art_src/tools (cutout -> split -> WebP).
// Keys: `<id>_<tier>` for towers/units, `<id>_head_<tier>` for rotating turret
// heads (+ `turret_base_<tier>`), `bug_*`, `bloon_*`, `fx_*`. Every tier is a
// distinct, visibly more advanced painting (upgrade rule).
// =============================================================================
import { assetUrl } from '../assetUrl';
import MANIFEST from './art.manifest.json';
export type Img = HTMLImageElement | HTMLCanvasElement;
export const IMG: Record<string, Img> = {};
export const ART_KEYS = Object.keys(MANIFEST as Record<string, number[]>);

const FILES: Record<string, string> = {};
for (const k of ART_KEYS) FILES[k] = `assets/v3/${k}.webp`;
for (const k of ['sun', 'heart', 'frame']) FILES['ui_' + k] = `assets/ui/${k}.png`;

function load(key: string, src: string) {
  return new Promise<void>((res) => {
    const im = new Image();
    im.onload = () => { IMG[key] = im; res(); };
    im.onerror = () => { console.warn('missing asset', src); res(); };
    im.src = assetUrl(src);
  });
}

export async function loadSprites(mapImages: string[]) {
  await Promise.all([...Object.entries(FILES).map(([k, v]) => load(k, v)), ...mapImages.map((m) => load('map:' + m, m))]);
  for (const k of ['unsc_autoturret', 'unsc_rail', 'unsc_flak']) for (let t = 0; t < 3; t++) IMG[`${k}_icon_${t}`] = turretIcon(k, t);
  tint('fx_pea', 'fx_pea_cherry', [255, 70, 60]);
  tint('fx_boom', 'fx_boom_fire', [255, 150, 60]);
}

function canvas(w: number, h = w): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return [c, c.getContext('2d')!];
}
function tint(src: string, dst: string, rgb: number[]) {
  const im = IMG[src]; if (!im) return;
  const [c, g] = canvas(im.width, im.height); g.drawImage(im, 0, 0);
  g.globalCompositeOperation = 'source-atop'; g.globalAlpha = 0.55; g.fillStyle = `rgb(${rgb.join(',')})`; g.fillRect(0, 0, c.width, c.height);
  IMG[dst] = c;
}
/** Composite base + head (aimed 3/4 right) used for HUD thumbnails. */
function turretIcon(k: string, t: number) {
  const b = IMG[`turret_base_${t}`], h = IMG[`${k}_head_${t}`];
  const [c, g] = canvas(256);
  if (b) g.drawImage(b, (256 - b.width) / 2, 256 - b.height);
  if (h) { const s = 230 / h.width; g.save(); g.translate(128, 256 - (b?.height ?? 120) * 0.62); g.rotate(-0.35); g.drawImage(h, -h.width * s * HEAD_PIVOT, -h.height * s / 2, h.width * s, h.height * s); g.restore(); }
  return c;
}
/** Turret heads are painted with the rotating housing at ~28% of their width. */
export const HEAD_PIVOT = 0.28;

/** Colour-tinted copy (hypnotized allies): multiply-ish wash that keeps the painted detail. */
const tintCache = new Map<string, HTMLCanvasElement>();
export function tintOf(im: Img, col: string, k = 0.55): HTMLCanvasElement {
  const key = (im as HTMLImageElement).src ?? String(im.width) + col;
  let c = tintCache.get(key + col);
  if (!c) {
    const [cc, g] = canvas(im.width, im.height);
    g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = k; g.fillStyle = col; g.fillRect(0, 0, cc.width, cc.height);
    tintCache.set(key + col, (c = cc));
  }
  return c;
}
/** White silhouette for hit flashes. */
const flashCache = new Map<Img, HTMLCanvasElement>();
export function flashOf(im: Img): HTMLCanvasElement {
  let c = flashCache.get(im);
  if (!c) {
    const [cc, g] = canvas(im.width, im.height);
    g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#fff'; g.fillRect(0, 0, cc.width, cc.height);
    flashCache.set(im, (c = cc));
  }
  return c;
}

const norm = (key: string) => key.replace(/^proc:/, '');
/** Resolve a data sprite key (+tier) to an image (HUD-friendly: turrets return a base+head composite). */
export function sprite(key: string, tier = 0): Img | undefined {
  const k = norm(key);
  for (let t = tier; t >= 0; t--) { const im = IMG[`${k}_icon_${t}`] ?? IMG[`${k}_${t}`]; if (im) return im; }
  return IMG[k];
}
/** World body sprite: for turrets this is the static base; the head is drawn separately. */
export function body(key: string, tier = 0): Img | undefined {
  const k = norm(key);
  if (IMG[`${k}_head_${tier}`]) return IMG[`turret_base_${tier}`];
  for (let t = tier; t >= 0; t--) { const im = IMG[`${k}_${t}`]; if (im) return im; }
  return IMG[k];
}
export function head(key: string, tier: number): Img | undefined {
  return IMG[`${norm(key)}_head_${tier}`];
}
