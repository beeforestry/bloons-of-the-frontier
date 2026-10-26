// Dropped credits (farm crates, bug shards). Farmhands collect for full value;
// click to collect yourself; left alone they auto-deposit at 60% after 14 s.
import { nextId } from '../core/math';
import type { Game } from '../game/Game';
import type { Unit } from './Unit';

export const PICKUP_AUTO_SECONDS = 14;
export const PICKUP_AUTO_RATE = 0.6;

export class Pickup {
  readonly uid = nextId();
  age = 0;
  alive = true;
  claimedBy: Unit | null = null;
  constructor(public x: number, public y: number, readonly value: number) {}
  update(g: Game, dt: number) {
    this.age += dt;
    if (this.claimedBy && !this.claimedBy.alive) this.claimedBy = null;
    if (this.age > PICKUP_AUTO_SECONDS) this.collect(g, PICKUP_AUTO_RATE, 'auto');
  }
  collect(g: Game, rate: number, by: string) {
    if (!this.alive) return;
    this.alive = false;
    const v = Math.round(this.value * rate);
    g.res.add(v);
    g.stats.pickups[by] = (g.stats.pickups[by] ?? 0) + v;
    g.fx({ kind: 'text', x: this.x, y: this.y - 14, text: `+${v}${rate < 1 ? ' (auto)' : ''}`, color: rate < 1 ? '#d8d8a0' : '#ffe14d', dur: 0.9 });
  }
}
