// WAVE MANAGER: builds a spawn timeline per wave, spawns on schedule, detects
// wave clear (pays wave + farm bonuses) and victory after the last wave.
import type { WaveData } from '../core/types';
import type { Game } from '../game/Game';

export class WaveManager {
  index = 0; // waves completed / index of next wave
  active = false;
  auto = false;
  private t = 0;
  private queue: { t: number; id: string }[] = [];
  constructor(readonly waves: WaveData[]) {}
  get total() { return this.waves.length; }
  get current() { return this.active ? this.index + 1 : this.index; }
  get remainingToSpawn() { return this.queue.length; }

  start(g: Game): boolean {
    if (this.active || this.index >= this.waves.length) return false;
    const w = this.waves[this.index];
    this.queue = [];
    for (const grp of w.groups) for (let i = 0; i < grp.count; i++) this.queue.push({ t: grp.delay + i * grp.spacing, id: grp.enemy });
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
    while (this.queue.length && this.queue[0].t <= this.t) g.spawnEnemy(this.queue.shift()!.id, 0);
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
