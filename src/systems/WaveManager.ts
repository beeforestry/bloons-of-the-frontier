// WAVE MANAGER: builds a spawn timeline per wave, spawns on schedule, detects
// wave clear (pays wave + farm bonuses) and victory after the last wave.
// Runs a difficulty-sized wave list (hand-authored 1-20, procedural after, boss
// finale) and, after victory, endless FREEPLAY with ever-scaling procedural waves.
import type { WaveData } from '../core/types';
import type { Game } from '../game/Game';
import { procWave } from '../data/waves';
import { planWave, waveScale, type WavePlan } from './WavePreview';

export class WaveManager {
  index = 0; // waves completed / index of next wave
  active = false;
  auto = false;
  /** BTD6-style endless mode after victory. */
  freeplay = false;
  private t = 0;
  private queue: { t: number; id: string; lane: number }[] = [];
  hpMul = 1;
  /** Per-map enemy HP ease (tighter / longer-lane maps are a touch more forgiving). */
  mapEase = 1;
  /** t106: Capa-4 power offset (BOOST_HP of the difficulty). */
  boostHp = 0;
  /** Map id used by planWave (Cabras-only 16–21 tweaks). */
  mapId = '';
  constructor(readonly waves: WaveData[], readonly diffHp = 1, readonly diffCount = 1, readonly diffLate = 1) {}
  get total() { return this.waves.length; }
  get current() { return this.active ? this.index + 1 : this.index; }
  get remainingToSpawn() { return this.queue.length; }
  /** Wave data for 0-based index i (procedural in freeplay). */
  wave(i: number): WaveData | undefined { return this.waves[i] ?? (this.freeplay ? procWave(i + 1) : undefined); }
  get next(): WaveData | undefined { return this.wave(this.index); }
  /** Pending spawn ids (wave preview for the active wave). */
  pending() { return this.queue.map((q) => q.id); }
  /** Lane-accurate pending queue (for Threat Brief / tests). */
  pendingSpawns() { return this.queue.map((q) => ({ id: q.id, lane: q.lane, t: q.t })); }

  /** Same spawn plan start() will (or did) use. `index` is 0-based. */
  plan(g: Game, index = this.index): WavePlan | null {
    const w = this.wave(index);
    if (!w) return null;
    return planWave({
      mapId: this.mapId, index, wave: w, lanes: Math.max(1, g.paths.length),
      diffHp: this.diffHp, diffCount: this.diffCount, diffLate: this.diffLate,
      mapEase: this.mapEase, boostHp: this.boostHp,
    });
  }

  start(g: Game): boolean {
    const planned = this.plan(g);
    if (this.active || !planned || g.state !== 'playing') return false;
    this.queue = planned.queue.map((q) => ({ t: q.t, id: q.id, lane: q.lane }));
    this.hpMul = planned.hpMul;
    this.t = 0;
    this.active = true;
    g.onWaveStart();
    g.bus.emit('wave', { wave: this.index + 1, total: this.total, active: true });
    g.bus.emit('toast', { text: `${this.freeplay ? 'Freeplay wave' : 'Wave'} ${this.index + 1} incoming!${planned.boss ? ' ⚠ BOSS WAVE' : ''}`, color: planned.boss ? '#ff6b6b' : undefined });
    if (planned.boss) g.sfx('boss');
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
      const bonus = Math.round(w.bonus * g.waveBonusMul());
      this.active = false;
      this.index++;
      g.res.add(bonus);
      g.onWaveEnd();
      g.onWaveContractClear();
      g.bus.emit('wave', { wave: this.index, total: this.total, active: false });
      g.bus.emit('toast', { text: `Wave ${this.index} cleared! +${bonus}` });
      if (this.index >= this.waves.length && !this.freeplay) g.win();
    }
  }
}

export { waveScale };
