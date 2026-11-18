// t107 PHYSICS-LITE DEATH EFFECTS — shared death events.
// The sim (host / solo) records one event per kill (and a light one per balloon layer pop) with the
// cause and the direction of the killing hit. The 2D Renderer (Debris) and the first-person view
// (Possess) each consume the queue with their own cursor, so the effects are purely cosmetic and
// cost nothing in headless bot runs. Co-op clients get the events in the host snapshot (DE) and
// replay them locally.
export type DeathCause = 'normal' | 'boom' | 'burn' | 'ice' | 'shock';
export const DEATH_CAUSES: DeathCause[] = ['normal', 'boom', 'burn', 'ice', 'shock'];
export interface DeathEvent {
  seq: number; uid: number; id: string; x: number; y: number;
  /** Unit vector of the killing hit (from the shooter / projectile towards the enemy). */
  dx: number; dy: number;
  /** Enemy facing (rad) at death. */
  ang: number;
  cause: DeathCause; boss: boolean;
  /** Balloon layer popped (outer skin shreds) — the enemy itself lives on as the next layer. */
  layer: boolean;
  /** Frozen enemy broken by a heavy hit (the SHATTER combo) -> extra ice shards. */
  shatter: boolean;
}
export const DEATH_TUNE = {
  /** Active 2D fragment caps by render quality (0 high, 1 medium, 2 low); mobile uses the last one. */
  caps2d: [240, 150, 80],
  /** Active first-person part caps (desktop / mobile-or-low). */
  caps3d: [40, 18],
  /** Boss kill: brief slow motion (solo only) + shake. */
  bossSlow: { dur: 0.5, k: 0.35 },
  queue: 96,
};
