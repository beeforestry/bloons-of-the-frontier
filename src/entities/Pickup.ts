// Dropped loot.
//  credit: farm crates / bug shards. Farmhands collect for full value; click to
//          collect; left alone they auto-deposit at 60% after 14 s.
//  orb:    Sunflower / Farmhand energy orbs (fuel MAC + Heal). Click or they
//          float home on their own after 7 s.
//  scrap:  heavy enemies, ceramic/lead bloons and cleared terrain drop scrap
//          piles. Scrap is its OWN currency (never converted to credits): troops
//          (and Farmhands) gather it for full value, a click grabs it, and piles
//          left alone are salvaged at only 40% after 22 s.
import { nextId } from '../core/math';
import { MAX_ENERGY } from '../data/buildings';
import type { Game } from '../game/Game';
import type { Unit } from './Unit';

export const PICKUP_AUTO_SECONDS = 14;
export const PICKUP_AUTO_RATE = 0.6;
export type PickupKind = 'credit' | 'orb' | 'scrap';

export class Pickup {
  readonly uid = nextId();
  age = 0;
  alive = true;
  claimedBy: Unit | null = null;
  /** Being pulled toward the collector (renderer can draw a trail). */
  vacuum = false;
  constructor(public x: number, public y: number, readonly value: number, readonly kind: PickupKind = 'credit') {}
  get autoAt() { return this.kind === 'orb' ? 7 : this.kind === 'scrap' ? 22 : PICKUP_AUTO_SECONDS; }
  update(g: Game, dt: number) {
    this.age += dt;
    if (g.isClient) return; // the host collects; the mirror shows synced positions
    if (this.claimedBy && !this.claimedBy.alive) this.claimedBy = null;
    // Collector vacuum: with a Farmhand on the field NOTHING is missed. Pickups the collector
    // isn't already walking to drift toward it (map-wide) and bank at the full rate.
    const ws = g.workers();
    if (ws.length && this.age > 1.2) {
      const w = this.claimedBy && this.claimedBy.alive ? this.claimedBy : ws.reduce((a, b) => ((a.x - this.x) ** 2 + (a.y - this.y) ** 2 <= (b.x - this.x) ** 2 + (b.y - this.y) ** 2 ? a : b));
      const dx = w.x - this.x, dy = w.y - this.y, L = Math.hypot(dx, dy) || 1, v = Math.min(L, (260 + this.age * 60) * dt);
      this.x += (dx / L) * v; this.y += (dy / L) * v; this.vacuum = true;
      if (L < 18 || this.age > this.autoAt + 6) { this.collect(g, 1, 'Farmhand'); return; }
      return;
    }
    if (this.age > this.autoAt) this.collect(g, this.kind === 'orb' ? 1 : this.kind === 'scrap' ? 0.4 : PICKUP_AUTO_RATE, 'auto');
  }
  collect(g: Game, rate: number, by: string) {
    if (!this.alive) return;
    if (g.isClient) { g.netCollect?.(this, rate, by); return; }
    this.alive = false;
    const v = Math.round(this.value * rate);
    if (this.kind === 'orb') {
      g.energy = Math.min(MAX_ENERGY, g.energy + v);
      g.stats.orbs += v;
      g.fx({ kind: 'text', x: this.x, y: this.y - 14, text: `+${v}⚡`, color: '#9ff7ff', dur: 0.9 });
      g.sfx('orb');
      return;
    }
    if (this.kind === 'scrap') {
      g.res.add(v, 'scrap');
      g.stats.scrap += v;
      g.stats.scrapBy[by] = (g.stats.scrapBy[by] ?? 0) + v;
      g.fx({ kind: 'text', x: this.x, y: this.y - 14, text: `+${v}🔩${rate < 1 ? ' (salvaged)' : ''}`, color: rate < 1 ? '#a9b4bf' : '#cfe3f0', dur: 1 });
      g.sfx('coin');
      return;
    }
    g.res.add(v);
    g.stats.pickups[by] = (g.stats.pickups[by] ?? 0) + v;
    g.fx({ kind: 'text', x: this.x, y: this.y - 14, text: `+${v}${rate < 1 ? ' (auto)' : ''}`, color: rate < 1 ? '#d8d8a0' : '#ffe14d', dur: 0.9 });
    g.sfx('coin');
  }
}
