// t122: 2D friendly-unit walk cycles. Six-frame sheets baked from the full-res v3
// idle sprites (scripts/gen_unit_walk.py). Loaded lazily the first time that unit
// type is drawn, so the initial asset payload is unchanged. Enemies keep GMMG-3.
import { assetUrl } from '../assetUrl';
import type { Img } from './sprites';

export const UNIT_WALK_FPS = 8;
export const UNIT_WALK_FRAMES = 6;

export const UNIT_WALK_IDS = [
  'farmhand_0', 'farmhand_1',
  'line_watch_0', 'line_watch_1', 'line_watch_2', 'line_watch_3',
  'marine_0', 'marine_1', 'marine_2',
  'monkey_soldier_0', 'monkey_soldier_1', 'monkey_soldier_2',
  'odst_0', 'odst_1', 'odst_2',
  'paladin_0', 'paladin_1', 'paladin_2',
  'ranger_0', 'ranger_1', 'ranger_2',
  'spartan_0', 'spartan_1', 'spartan_2',
] as const;

const HAS = new Set<string>(UNIT_WALK_IDS);
const frames = new Map<string, HTMLCanvasElement[]>();
const loading = new Set<string>();
const failed = new Set<string>();
export const unitWalkStats = { requested: 0, loaded: 0, failed: 0 };
/** Incremented by the 2D renderer; tests use the deltas. */
export const unitWalkDrawn = { walk: 0, other: 0 };

export const walkKey = (sprite: string, tier: number) => `${sprite}_${tier}`;

/** Start loading the walk sheet for this unit type if we have one. No-op if already in flight. */
export function requestUnitWalk(sprite: string, tier: number) {
  const id = walkKey(sprite, tier);
  if (!HAS.has(id) || frames.has(id) || loading.has(id) || failed.has(id)) return;
  loading.add(id);
  unitWalkStats.requested++;
  const im = new Image();
  im.onload = () => {
    const fw = im.width / UNIT_WALK_FRAMES, fh = im.height;
    const out: HTMLCanvasElement[] = [];
    for (let i = 0; i < UNIT_WALK_FRAMES; i++) {
      const c = document.createElement('canvas');
      c.width = fw; c.height = fh;
      c.getContext('2d')!.drawImage(im, i * fw, 0, fw, fh, 0, 0, fw, fh);
      out.push(c);
    }
    frames.set(id, out);
    loading.delete(id);
    unitWalkStats.loaded++;
  };
  im.onerror = () => { failed.add(id); loading.delete(id); unitWalkStats.failed++; };
  im.src = assetUrl(`assets/v3/walk/${id}_walk.webp`);
}

/** Current walk frame at ~8 FPS, or undefined until the sheet has loaded. */
export function unitWalkFrame(sprite: string, tier: number, time: number): Img | undefined {
  const fr = frames.get(walkKey(sprite, tier));
  if (!fr?.length) return;
  const i = Math.floor(((time * UNIT_WALK_FPS) % fr.length + fr.length) % fr.length);
  return fr[i];
}

export function unitWalkLoaded(sprite: string, tier: number) {
  return frames.has(walkKey(sprite, tier));
}

if (typeof window !== 'undefined') {
  (window as unknown as { __unitWalk?: unknown }).__unitWalk = {
    stats: unitWalkStats, drawn: unitWalkDrawn, request: requestUnitWalk, frame: unitWalkFrame,
    loaded: unitWalkLoaded, ids: UNIT_WALK_IDS, fps: UNIT_WALK_FPS,
  };
}
