// WAVE MANAGER: builds a spawn timeline per wave, spawns on schedule, detects
// wave clear (pays wave + farm bonuses) and victory after the last wave.
// Runs a difficulty-sized wave list (hand-authored 1-20, procedural after, boss
// finale) and, after victory, endless FREEPLAY with ever-scaling procedural waves.
import type { WaveData } from '../core/types';
import type { Game } from '../game/Game';
import { procWave } from '../data/waves';

export class WaveManager {
  index = 0; // waves completed / index of next wave
  active = false;
  auto = false;
  /** BTD6-style endless mode after victory. */
  freeplay = false;
  private t = 0;
  private queue: { t: number; id: string; lane: number }[] = [];
  hpMul = 1;
  constructor(readonly waves: WaveData[], readonly diffHp = 1) {}
  get total() { return this.waves.length; }
  get current() { return this.active ? this.index + 1 : this.index; }
  get remainingToSpawn() { return this.queue.length; }
  /** Wave data for 0-based index i (procedural in freeplay). */
  wave(i: number): WaveData | undefined { return this.waves[i] ?? (this.freeplay ? procWave(i + 1) : undefined); }
  get next(): WaveData | undefined { return this.wave(this.index); }
  /** Pending spawn ids (wave preview for the active wave). */
  pending() { return this.queue.map((q) => q.id); }

  start(g: Game): boolean {
    const w = this.wave(this.index);
    if (this.active || !w || g.state !== 'playing') return false;
    this.queue = [];
    const sc = waveScale(this.index + 1), lanes = Math.max(1, g.paths.length);
    this.hpMul = sc.hp * this.diffHp;
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
    g.bus.emit('toast', { text: `${this.freeplay ? 'Freeplay wave' : 'Wave'} ${this.index + 1} incoming!${w.boss ? ' ⚠ BOSS WAVE' : ''}`, color: w.boss ? '#ff6b6b' : undefined });
    if (w.boss) g.sfx('boss');
    return true;
  }
  /** Debug / test: jump straight to wave n (1-based) without playing the ones before. */
  skipTo(n: number) { if (!this.active) this.index = Math.max(0, n - 1); }

  update(g: Game, dt: number) {
    if (!this.active) {
      if (this.auto && g.state === 'playing') this.start(g);
      return;
    }
    this.t += dt;
    while (this.queue.length && this.queue[0].t <= this.t) { const q = this.queue.shift()!; g.spawnEnemy(q.id, 0, 0, q.lane, this.hpMul); }
    if (!this.queue.length && !g.enemies.some((e) => e.alive)) {
      const w = this.wave(this.index)!;
      this.active = false;
      this.index++;
      g.res.add(w.bonus);
      g.onWaveEnd();
      g.bus.emit('wave', { wave: this.index, total: this.total, active: false });
      g.bus.emit('toast', { text: `Wave ${this.index} cleared! +${w.bonus}` });
      if (this.index >= this.waves.length && !this.freeplay) g.win();
    }
  }
}

/** Ramp: HP and crowd scaling from wave 4; steeper HP past 40 and in freeplay (crowd capped for 60 FPS). */
export function waveScale(wave: number) {
  const k = Math.max(0, wave - 3), late = Math.max(0, wave - 40), fp = Math.max(0, wave - 100);
  return { hp: 1 + 0.065 * k + 0.09 * late + 0.004 * fp * fp, count: Math.min(2.6, 1 + 0.035 * k) };
}
