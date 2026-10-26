// WAVE MANAGER: builds a spawn timeline per wave, spawns on schedule, detects
// wave clear (pays wave + farm bonuses) and victory after the last wave.
import type { WaveData } from '../core/types';
import type { Game } from '../game/Game';

export class WaveManager {
  index = 0; // waves completed / index of next wave
  active = false;
  auto = false;
  private t = 0;
  private queue: { t: number; id: string; lane: number }[] = [];
  hpMul = 1;
  constructor(readonly waves: WaveData[]) {}
  get total() { return this.waves.length; }
  get current() { return this.active ? this.index + 1 : this.index; }
  get remainingToSpawn() { return this.queue.length; }

  start(g: Game): boolean {
    if (this.active || this.index >= this.waves.length) return false;
    const w = this.waves[this.index];
    this.queue = [];
    const sc = waveScale(this.index + 1), lanes = Math.max(1, g.paths.length);
    this.hpMul = sc.hp;
    w.groups.forEach((grp, gi) => {
      const n = Math.round(grp.count * (grp.count > 2 ? sc.count : 1));
      const spacing = grp.spacing / Math.sqrt(sc.count);
      // spread spawns round-robin over every entry lane
      for (let i = 0; i < n; i++) this.queue.push({ t: grp.delay + i * spacing, id: grp.enemy, lane: (gi + i) % lanes });
    });
    this.queue.sort((a, b) => a.t - b.t);
    this.t = 0;
    this.active = true;
    g.bus.emit('wave', { wave: this.index + 1, total: this.total, active: true });
    g.bus.emit('toast', { text: `Wave ${this.index + 1} incoming!` });
    return true;
  }

  update(g: Game, dt: number) {
    if (!this.active) {
      if (this.auto && g.state === 'playing') this.start(g);
      return;
    }
    this.t += dt;
    while (this.queue.length && this.queue[0].t <= this.t) { const q = this.queue.shift()!; g.spawnEnemy(q.id, 0, 0, q.lane, this.hpMul); }
    if (!this.queue.length && !g.enemies.some((e) => e.alive)) {
      const w = this.waves[this.index];
      this.active = false;
      this.index++;
      g.res.add(w.bonus);
      g.onWaveEnd();
      g.bus.emit('wave', { wave: this.index, total: this.total, active: false });
      g.bus.emit('toast', { text: `Wave ${this.index} cleared! +${w.bonus}` });
      if (this.index >= this.waves.length) g.win();
    }
  }
}

/** Late-game ramp (bigger maps + base economy => tougher waves): HP and crowd scaling from wave 4. */
export function waveScale(wave: number) {
  const k = Math.max(0, wave - 3);
  return { hp: 1 + 0.065 * k, count: 1 + 0.035 * k };
}
