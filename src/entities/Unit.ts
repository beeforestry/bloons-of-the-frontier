// =============================================================================
// UNITS (Halo-Wars-style troops) + WORKER UNIT (Farmhand)
//  Unit: health, weapon (range depends on weapon), moves to its squad's rally
//  point, attacks the nearest enemy, blocks ground bugs, can garrison inside a
//  CoverTower, receives CoverTower buffs (+max HP, +range %, regen).
//  WorkerUnit extends Unit: collects dropped credits, repairs towers and runs
//  OrganizeFarms().
// Tiers are researched per troop type (g.unitTier) and apply to living units.
// =============================================================================
import { TargetingMode, type UnitData, type UnitTier, type Vec } from '../core/types';
import { nextId, dist, rand } from '../core/math';
import { BuffReceiver, Health, type Buffable } from '../systems/BuffSystem';
import { pickTarget } from '../systems/TargetingSystem';
import type { Game } from '../game/Game';
import type { Tower } from './Tower';
import type { Pickup } from './Pickup';
import type { Enemy } from './Enemy';

export class Squad {
  readonly uid = nextId();
  units: Unit[] = [];
  /** Cover tower this squad is walking to garrison (Halo Wars style 'enter building'). */
  garrisonTarget: Tower | null = null;
  constructor(readonly data: UnitData, public rally: Vec) {}
  get alive() { return this.units.some((u) => u.alive); }
  /** Formation offsets around the rally point. */
  slot(i: number): Vec {
    const n = this.units.length || 1, a = (i / n) * Math.PI * 2 + 0.6, r = n === 1 ? 0 : 16;
    return { x: this.rally.x + Math.cos(a) * r, y: this.rally.y + Math.sin(a) * r };
  }
}

export class Unit implements Buffable {
  readonly uid = nextId();
  x: number; y: number;
  alive = true;
  readonly buffs = new BuffReceiver();
  readonly health: Health;
  garrison: Tower | null = null;
  /** Seconds left in the drop-pod landing animation. */
  dropT = 0.7;
  cooldown = rand(0, 0.4);
  specialT: number;
  attackAnim = 0;
  facing = 1;
  private appliedTier = -1;

  constructor(readonly data: UnitData, readonly squad: Squad, readonly index: number, g: Game, at: Vec) {
    this.x = at.x; this.y = at.y;
    const t = data.tiers[g.unitTier(data.id)];
    this.health = new Health(t.stats.maxHp, t.stats.armor);
    this.specialT = t.special?.every ?? 0;
    this.buffs.onChange = (tot) => this.health.setBonus(tot.bonusMaxHp);
  }
  tier(g: Game) { return g.unitTier(this.data.id); }
  t(g: Game): UnitTier { return this.data.tiers[this.tier(g)]; }
  range(g: Game) { return this.t(g).stats.range * (1 + this.buffs.totals.bonusRangePct) * (this.garrison ? 1.25 : 1); }
  get isWorker() { return this.data.role === 'worker'; }

  takeDamage(g: Game, n: number) {
    if (!this.alive || this.garrison || this.dropT > 0) return;
    this.health.damage(n);
    if (!this.health.alive) this.kill(g);
  }
  kill(g: Game) {
    this.alive = false;
    this.buffs.clear();
    if (this.garrison) this.garrison.cover?.ungarrison(this);
    g.fx({ kind: 'text', x: this.x, y: this.y - 20, text: 'KIA', color: '#ff5a5a', dur: 0.8 });
  }

  protected syncTier(g: Game) {
    const tier = this.tier(g);
    if (tier === this.appliedTier) return;
    if (this.appliedTier >= 0) g.fx({ kind: 'ring', x: this.x, y: this.y, r: 24, color: this.data.tiers[tier].visual.glow ?? '#fff', dur: 0.6 });
    this.appliedTier = tier;
    const s = this.data.tiers[tier].stats;
    this.health.setBase(s.maxHp, s.armor);
  }

  protected moveTo(p: Vec, speed: number, dt: number): boolean {
    const d = dist(this, p);
    if (d < 3) return true;
    const step = Math.min(d, speed * dt);
    this.x += ((p.x - this.x) / d) * step;
    this.y += ((p.y - this.y) / d) * step;
    if (Math.abs(p.x - this.x) > 1) this.facing = p.x > this.x ? 1 : -1;
    return false;
  }

  update(g: Game, dt: number) {
    if (!this.alive) return;
    this.syncTier(g);
    if (this.dropT > 0) { this.dropT -= dt; if (this.dropT <= 0) g.fx({ kind: 'dust', x: this.x, y: this.y + 8, r: 22, color: '#d8c7a0', dur: 0.4 }); return; }
    const t = this.t(g);
    if (this.buffs.totals.regen > 0) this.health.heal(this.buffs.totals.regen * dt);
    if (this.garrison) {
      this.x = this.garrison.x; this.y = this.garrison.y;
      this.health.heal(4 * dt);
    }
    this.attackAnim = Math.max(0, this.attackAnim - dt);
    this.cooldown -= dt;
    if (this.specialT > 0) this.specialT -= dt;

    const melee = t.stats.range < 60;
    const home = this.squad.slot(this.index);
    let target: Enemy | null = null;
    if (melee && !this.garrison) {
      // Kingdom-Rush style: engage ground enemies near our post
      let best: Enemy | null = null, bd = 95;
      for (const e of g.enemies) {
        if (!e.alive || e.data.flying) continue;
        const d = dist(e, home);
        if (d < bd) { bd = d; best = e; }
      }
      if (best) {
        if (dist(this, best) > t.stats.range + best.data.radius) this.moveTo(best, t.stats.speed, dt);
        else target = best;
      } else this.moveTo(home, t.stats.speed, dt);
    } else {
      target = pickTarget(g.enemies, this, this.range(g), TargetingMode.Close, { hitsAir: t.weapon.hitsAir, hitsGround: true });
      if (!target && !this.garrison) this.moveTo(home, t.stats.speed, dt);
    }
    if (target) {
      this.facing = target.x >= this.x ? 1 : -1;
      if (this.cooldown <= 0) {
        this.cooldown = 1 / t.stats.attackRate;
        this.attackAnim = 0.18;
        g.unitAttack(this, target, t);
      }
      if (t.special && this.specialT <= 0) {
        this.specialT = t.special.every;
        g.fx({ kind: 'text', x: this.x, y: this.y - 26, text: t.special.name + '!', color: '#ffd84a', dur: 0.7 });
        g.splash(target.x, target.y, t.special.splash, t.special.damage, t.special.type, this);
      }
    }
  }
}

type WorkerTask =
  | { kind: 'organize'; at: Vec }
  | { kind: 'collect'; pickup: Pickup }
  | { kind: 'repair'; tower: Tower };

export class WorkerUnit extends Unit {
  task: WorkerTask | null = null;
  status = 'idle';

  /** Order this worker to walk over and pack nearby FarmTowers into a tight grid. */
  orderOrganize(at: Vec) {
    if (this.task?.kind === 'collect') this.task.pickup.claimedBy = null;
    this.task = { kind: 'organize', at };
  }

  update(g: Game, dt: number) {
    if (!this.alive) return;
    this.syncTier(g);
    if (this.dropT > 0) { this.dropT -= dt; return; }
    const s = this.t(g).stats;
    if (this.buffs.totals.regen > 0) this.health.heal(this.buffs.totals.regen * dt);
    // pick a job when idle: collect > repair
    if (!this.task) {
      const pk = g.pickups.filter((p) => p.alive && !p.claimedBy && dist(p, this) < (s.pickupRadius ?? 150))
        .sort((a, b) => dist(a, this) - dist(b, this))[0];
      if (pk) { pk.claimedBy = this; this.task = { kind: 'collect', pickup: pk }; }
      else {
        const tw = g.towers.filter((t) => t.alive && t.health.frac < 0.999 && dist(t, this.squad.rally) < 300)
          .sort((a, b) => a.health.frac - b.health.frac)[0];
        if (tw) this.task = { kind: 'repair', tower: tw };
      }
    }
    const task = this.task;
    if (!task) { this.status = 'idle'; this.moveTo(this.squad.slot(this.index), s.speed, dt); return; }
    if (task.kind === 'organize') {
      this.status = 'organizing farms';
      if (this.moveTo(task.at, s.speed * 1.2, dt)) { g.executeOrganize(this); this.task = null; }
    } else if (task.kind === 'collect') {
      this.status = 'collecting';
      if (!task.pickup.alive) { this.task = null; return; }
      if (this.moveTo(task.pickup, s.speed, dt) || dist(this, task.pickup) < 10) { task.pickup.collect(g, 1, 'Farmhand'); this.task = null; }
    } else if (task.kind === 'repair') {
      this.status = 'repairing';
      const tw = task.tower;
      if (!tw.alive || tw.health.frac >= 0.999) { this.task = null; return; }
      if (dist(this, tw) > 34) this.moveTo(tw, s.speed, dt);
      else {
        tw.repair(g, (s.repair ?? 5) * dt);
        this.attackAnim = 0.1;
        if (Math.random() < dt * 3) g.fx({ kind: 'text', x: tw.x + rand(-10, 10), y: tw.y - 30, text: '+', color: '#7dff7a', dur: 0.5 });
      }
    }
  }
}
