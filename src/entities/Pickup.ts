// Dropped loot.
//  credit: farm crates / bug shards. Farmhands collect for full value; click to
//          collect; left alone they auto-deposit at 60% after 14 s.
//  orb:    Sunflower / Farmhand energy orbs (fuel MAC + Heal). Click or they
//          float home on their own after 7 s.
//  scrap:  heavy / mechanical enemies drop scrap; any troop walking over it (or
//          a click) banks bonus credits; it rusts to 40% after 20 s.
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
  constructor(public x: number, public y: number, readonly value: number, readonly kind: PickupKind = 'credit') {}
  get autoAt() { return this.kind === 'orb' ? 7 : this.kind === 'scrap' ? 20 : PICKUP_AUTO_SECONDS; }
  update(g: Game, dt: number) {
    this.age += dt;
    if (this.claimedBy && !this.claimedBy.alive) this.claimedBy = null;
    if (this.age > this.autoAt) this.collect(g, this.kind === 'orb' ? 1 : this.kind === 'scrap' ? 0.4 : PICKUP_AUTO_RATE, 'auto');
  }
  collect(g: Game, rate: number, by: string) {
    if (!this.alive) return;
    this.alive = false;
    const v = Math.round(this.value * rate);
    if (this.kind === 'orb') {
      g.energy = Math.min(MAX_ENERGY, g.energy + v);
      g.stats.orbs += v;
      g.fx({ kind: 'text', x: this.x, y: this.y - 14, text: `+${v}⚡`, color: '#9ff7ff', dur: 0.9 });
      g.sfx('orb');
      return;
    }
    g.res.add(v);
    if (this.kind === 'scrap') g.stats.scrap += v;
    g.stats.pickups[by] = (g.stats.pickups[by] ?? 0) + v;
    g.fx({ kind: 'text', x: this.x, y: this.y - 14, text: `+${v}${this.kind === 'scrap' ? ' scrap' : ''}${rate < 1 ? ' (auto)' : ''}`, color: rate < 1 ? '#d8d8a0' : '#ffe14d', dur: 0.9 });
    g.sfx('coin');
  }
}
