// =============================================================================
// BASE LAYER (Halo Wars): BuildPad + Building (HQ / Supply / Reactor / Barracks)
//  BuildPad: Empty -> Constructing (credits paid, building scales in over its
//  build time) -> Built. Destroyed pad buildings leave the pad empty again.
//  Building: HP (bugs + Bile Titan acid can hit it), tier upgrades (built while
//  the old tier keeps working), and per-kind behaviour:
//   HQ       - lose condition, base pop cap, energy, defence gun
//   Supply   - safe income straight to the bank during waves (+wave bonus)
//   Reactor  - tech + pop cap + energy (read by Game.tech / popCap / energyRegen)
//   Barracks - one-at-a-time training queue, hold-at-door, rally point
// =============================================================================
import { TargetingMode, type BuildingData, type BuildingTier, type Vec } from '../core/types';
import { nextId } from '../core/math';
import { Health } from '../systems/BuffSystem';
import { pickTargets } from '../systems/TargetingSystem';
import { unitById } from '../data/units';
import { TRAIN_DISCOUNT } from '../data/buildings';
import type { Game } from '../game/Game';

export class BuildPad {
  readonly uid = nextId();
  building: Building | null = null;
  constructor(readonly index: number, readonly x: number, readonly y: number) {}
  get state(): 'empty' | 'constructing' | 'built' { return !this.building ? 'empty' : this.building.tier < 0 ? 'constructing' : 'built'; }
}

export interface TrainOrder { unitId: string; t: number; dur: number; held: string | null }

export class Building {
  readonly uid = nextId();
  alive = true;
  /** -1 while the first construction is running. */
  tier = -1;
  readonly health: Health;
  /** Construction / upgrade in progress. */
  build: { t: number; dur: number; to: number } | null = null;
  queue: TrainOrder[] = [];
  rally: Vec;
  invested = 0;
  private incomeT = 3;
  private gunCd = 0;
  aim = 0; recoil = 0; hitFlash = 0;
  constructor(readonly data: BuildingData, readonly x: number, readonly y: number, readonly pad: BuildPad | null, rally: Vec) {
    this.health = new Health(data.tiers[0].stats.maxHp);
    this.rally = { ...rally };
  }
  get t(): BuildingTier { return this.data.tiers[Math.max(0, this.tier)]; }
  get built() { return this.tier >= 0; }
  get nextTier(): BuildingTier | undefined { return this.data.tiers[this.tier + 1]; }
  get isHQ() { return this.data.id === 'hq'; }
  /** Construction progress 0..1 (1 when idle). */
  get progress() { return this.build ? Math.min(1, this.build.t / this.build.dur) : 1; }
  get door(): Vec { return { x: this.x - 30, y: this.y + (this.isHQ ? 70 : 44) }; }

  startConstruction(to: number) {
    const tier = this.data.tiers[to];
    this.build = { t: 0, dur: tier.buildTime, to };
    this.invested += tier.cost;
  }
  upgrade(g: Game): boolean {
    const n = this.nextTier;
    if (!n || this.build || !this.built) return false;
    if (!g.res.spend({ credits: n.cost })) { g.toast('Not enough credits', '#ff8a7a'); return false; }
    this.startConstruction(this.tier + 1);
    g.toast(`Upgrading to ${n.name} (${n.buildTime}s)`);
    return true;
  }
  takeDamage(g: Game, n: number) {
    if (!this.alive) return;
    this.health.damage(n);
    this.hitFlash = 0.1;
    if (!this.health.alive) g.destroyBuilding(this);
  }
  repair(_g: Game, n: number) { this.health.heal(n); }

  /** Barracks: queue a squad (credits paid now). */
  enqueue(g: Game, unitId: string): boolean {
    if (this.data.id !== 'barracks' || !this.built) return false;
    const d = unitById(unitId);
    if (this.queue.length >= (this.t.stats.queue ?? 3)) { g.toast('Training queue full'); return false; }
    if (g.tech < d.tech) { g.toast(`${d.name} needs Tech ${d.tech} (build a Reactor)`, '#ff8a7a'); return false; }
    const cost = Math.round(d.tiers[0].cost * TRAIN_DISCOUNT);
    if (!g.res.spend({ credits: cost })) { g.toast('Not enough credits', '#ff8a7a'); return false; }
    this.queue.push({ unitId, t: 0, dur: d.trainTime, held: null });
    return true;
  }
  cancel(g: Game, i: number) {
    const o = this.queue[i]; if (!o) return;
    g.res.add(Math.round(unitById(o.unitId).tiers[0].cost * TRAIN_DISCOUNT));
    this.queue.splice(i, 1);
  }

  update(g: Game, dt: number) {
    this.recoil = Math.max(0, this.recoil - dt * 6);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    if (this.build) {
      this.build.t += dt;
      if (Math.random() < dt * 4) g.fx({ kind: 'dust', x: this.x + (Math.random() - 0.5) * 60, y: this.y + 30, r: 14, color: '#cdb58a', dur: 0.5 });
      if (this.build.t >= this.build.dur) {
        const first = this.tier < 0;
        this.tier = this.build.to; this.build = null;
        this.health.setBase(this.t.stats.maxHp, 0);
        if (first) this.health.hp = this.health.max;
        g.fx({ kind: 'ring', x: this.x, y: this.y, r: 60, color: this.t.visual.glow ?? '#ffffff', dur: 0.7 });
        g.fx({ kind: 'text', x: this.x, y: this.y - 60, text: `${this.t.name} online!`, color: '#b6f78f', dur: 1.4 });
        g.bus.emit('toast', { text: `${this.t.name} complete`, color: '#b6f78f' });
      }
    }
    if (!this.built) return;
    const s = this.t.stats;
    if (s.income && g.waves.active) {
      this.incomeT -= dt;
      if (this.incomeT <= 0) {
        this.incomeT = 60 / (s.payoutsPerMin ?? 10);
        g.res.add(s.income);
        g.stats.supplyIncome += s.income;
        g.fx({ kind: 'text', x: this.x, y: this.y - 50, text: `+${s.income}`, color: '#ffe14d', dur: 1 });
      }
    }
    if (s.gun) {
      this.gunCd -= dt;
      if (this.gunCd <= 0) {
        const tg = pickTargets(g.enemies, this, s.gun.range, TargetingMode.Close, { hitsAir: true, hitsGround: true }, s.gun.pierce);
        if (tg.length) {
          this.gunCd = 1 / s.gun.fireRate; this.recoil = 1;
          this.aim = Math.atan2(tg[0].y - this.y, tg[0].x - this.x);
          const from = { x: this.x + Math.cos(this.aim) * 30, y: this.y - 70 };
          for (const e of tg) g.beam(from, e, s.gun.damage, 'ballistic', 1, '#ffe08a', 2.5);
        } else this.gunCd = 0.1;
      }
    }
    if (this.data.id === 'barracks' && this.queue.length) {
      const o = this.queue[0], d = unitById(o.unitId);
      if (o.t < o.dur) o.t += dt * (s.trainSpeed ?? 1);
      if (o.t >= o.dur) {
        // Hold at the door while pop / tech / squad cap is short.
        o.held = g.tech < d.tech ? `needs Tech ${d.tech}` : g.pop + d.population > g.popCap ? 'pop cap full' : d.maxSquads && g.squadCount(d.id) >= d.maxSquads ? `max ${d.maxSquads} squads` : null;
        if (!o.held) {
          this.queue.shift();
          const sq = g.spawnSquad(d, this.door, false);
          sq.rally = { ...this.rally };
          g.fx({ kind: 'ring', x: this.door.x, y: this.door.y, r: 24, color: '#7fd3ff', dur: 0.5 });
          g.stats.trained++;
        }
      }
    }
  }
}
