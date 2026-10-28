// =============================================================================
// UNITS (Halo-Wars-style troops) + WORKER UNIT (Farmhand)
//  Squad: rally point, waypoint queue (Shift-click), patrol route, stance
//   (Aggressive / Hold / Retreat), targeting mode, formation and abilities.
//  Unit: health, weapon, veterancy (XP per kill -> up to 3 stars), garrisons
//   inside any Garrisonable (reduced damage + range bonus), blocks ground bugs.
//  WorkerUnit extends Unit: collects pickups, repairs towers, grows energy orbs
//   and runs OrganizeFarms().
// Tiers are researched per troop type (g.unitTier) and apply to living units.
// =============================================================================
import { ARMORY_FX } from '../data/armory';
import { TargetingMode, type AbilityId, type Formation, type Stance, type UnitData, type UnitTier, type Vec } from '../core/types';
import { nextId, dist, rand } from '../core/math';
import { BuffReceiver, Health, type Buffable } from '../systems/BuffSystem';
import { pickTarget } from '../systems/TargetingSystem';
import { RALLY, STIM, VET, VET_AURA } from '../data/abilities';
import type { Game } from '../game/Game';
import type { Tower } from './Tower';
import type { Pickup } from './Pickup';
import type { Enemy } from './Enemy';
import { gLeave, type Garrisonable } from './Garrison';

export class Squad {
  readonly uid = nextId();
  units: Unit[] = [];
  /** Structure this squad is walking to garrison (Halo Wars style 'enter building'). */
  garrisonTarget: Garrisonable | null = null;
  /** Shift-click waypoint queue. */
  waypoints: Vec[] = [];
  /** Patrol route (loops). */
  patrol: Vec[] | null = null;
  patrolIdx = 0;
  stance: Stance = 'aggressive';
  targeting: TargetingMode = TargetingMode.Close;
  /** Group formation slot layout ('circle' for a lone squad). */
  formation: Formation | 'circle' = 'circle';
  face = 0;
  abilityCd: Partial<Record<AbilityId, number>> = {};
  /** Ability flash for the selection ring pulse. */
  pulse = 0;
  constructor(readonly data: UnitData, public rally: Vec) {}
  get alive() { return this.units.some((u) => u.alive); }
  get center(): Vec {
    const us = this.units.filter((u) => u.alive); if (!us.length) return this.rally;
    return { x: us.reduce((s, u) => s + u.x, 0) / us.length, y: us.reduce((s, u) => s + u.y, 0) / us.length };
  }
  /** Formation offsets around the rally point. */
  slot(i: number): Vec {
    const n = this.units.length || 1;
    if (n === 1) return { ...this.rally };
    if (this.formation === 'line' || this.formation === 'column') {
      const k = i - (n - 1) / 2, sp = 18;
      const a = this.formation === 'line' ? this.face + Math.PI / 2 : this.face;
      return { x: this.rally.x + Math.cos(a) * k * sp, y: this.rally.y + Math.sin(a) * k * sp };
    }
    const a = (i / n) * Math.PI * 2 + 0.6, r = 16;
    return { x: this.rally.x + Math.cos(a) * r, y: this.rally.y + Math.sin(a) * r };
  }
  /** Every unit is at its slot (drives waypoint / patrol advancement). */
  arrived(): boolean { return this.units.every((u, i) => !u.alive || !!u.garrison || dist(u, this.slot(i)) < 14); }
}

export class Unit implements Buffable {
  readonly uid = nextId();
  x: number; y: number;
  alive = true;
  readonly buffs = new BuffReceiver();
  readonly health: Health;
  garrison: Garrisonable | null = null;
  /** Seconds left in the drop-pod landing animation. */
  dropT = 0.7;
  cooldown = rand(0, 0.4);
  specialT: number;
  attackAnim = 0;
  facing = 1;
  /** Veterancy. */
  xp = 0; stars = 0;
  stimT = 0;
  /** Rank-3 veteran aura (+10% rate) refresh timer, and Rally buff timer. */
  vetAuraT = 0; rallyT = 0;
  /** Selection-ring pulse when hit / on ability use. */
  hitPulse = 0;
  moving = false;
  /** Current beam target (Spartan Laser continuous beam). */
  beamTo: Enemy | null = null;
  private appliedTier = -1;
  private appliedStars = 0;
  private appliedPlating = false;

  constructor(readonly data: UnitData, readonly squad: Squad, readonly index: number, g: Game, at: Vec) {
    this.x = at.x; this.y = at.y;
    const t = data.tiers[g.unitTier(data.id)];
    this.health = new Health(t.stats.maxHp, t.stats.armor);
    this.specialT = t.special?.every ?? 0;
    this.buffs.onChange = (tot) => this.health.setBonus(tot.bonusMaxHp);
  }
  tier(g: Game) { return g.unitTier(this.data.id); }
  t(g: Game): UnitTier { return this.data.tiers[this.tier(g)]; }
  range(g: Game) { return this.t(g).stats.range * (1 + this.buffs.totals.bonusRangePct) * (this.garrison ? 1 + this.garrison.gRange() : 1); }
  get isWorker() { return this.data.role === 'worker'; }
  get blockCap() { return this.data.blockCap ?? 2; }
  get dmgMul() { return (1 + VET.dmg * this.stars) * (this.rallyT > 0 ? 1 + RALLY.dmg : 1); }
  get rateMul() { return (1 + VET.rate * this.stars) * (1 + this.buffs.totals.ratePct) * (this.stimT > 0 ? STIM.rate : 1) * (this.vetAuraT > 0 ? 1 + VET_AURA.rate : 1); }
  addXp = (n: number) => {
    if (!this.alive) return;
    this.xp += n;
    while (this.stars < 3 && this.xp >= VET.thresholds[this.stars]) this.stars++;
  };

  /** Projectile / acid / stomp damage. Garrisoned troops take reduced damage. */
  takeDamage(g: Game, n: number) {
    if (!this.alive || this.dropT > 0) return;
    if (this.garrison) n *= 1 - this.garrison.gProtect();
    this.health.damage(n);
    this.hitPulse = 1;
    if (!this.health.alive) this.kill(g);
  }
  kill(g: Game) {
    this.alive = false;
    this.buffs.clear();
    if (this.garrison) gLeave(this.garrison, this);
    g.fx({ kind: 'text', x: this.x, y: this.y - 20, text: 'KIA', color: '#ff5a5a', dur: 0.8 });
  }

  protected syncTier(g: Game) {
    const tier = this.tier(g);
    const plated = g.armory.has('plating');
    if (tier === this.appliedTier && this.stars === this.appliedStars && plated === this.appliedPlating) return;
    if (this.appliedTier >= 0 && tier !== this.appliedTier) g.fx({ kind: 'ring', x: this.x, y: this.y, r: 24, color: this.data.tiers[tier].visual.glow ?? '#fff', dur: 0.6 });
    if (this.stars > this.appliedStars) {
      g.fx({ kind: 'ring', x: this.x, y: this.y, r: 30, color: '#ffd84a', dur: 0.7 });
      g.fx({ kind: 'text', x: this.x, y: this.y - 34, text: '★'.repeat(this.stars) + ' Veteran!', color: '#ffd84a', dur: 1.1 });
      g.stats.promotions++;
    }
    this.appliedTier = tier; this.appliedStars = this.stars; this.appliedPlating = plated;
    const s = this.data.tiers[tier].stats;
    this.health.setBase(s.maxHp * (1 + VET.hp * this.stars) * (plated ? 1 + ARMORY_FX.plating : 1), s.armor);
  }

  protected moveTo(p: Vec, speed: number, dt: number): boolean {
    const d = dist(this, p);
    if (d < 3) return true;
    const step = Math.min(d, speed * dt);
    this.x += ((p.x - this.x) / d) * step;
    this.y += ((p.y - this.y) / d) * step;
    this.moving = true;
    if (Math.abs(p.x - this.x) > 1) this.facing = p.x > this.x ? 1 : -1;
    return false;
  }

  update(g: Game, dt: number) {
    if (!this.alive) return;
    this.moving = false;
    this.syncTier(g);
    this.hitPulse = Math.max(0, this.hitPulse - dt * 2.5);
    if (this.dropT > 0) { this.dropT -= dt; if (this.dropT <= 0) { g.fx({ kind: 'dust', x: this.x, y: this.y + 8, r: 22, color: '#d8c7a0', dur: 0.4 }); g.podImpact(this); } return; }
    const t = this.t(g), sq = this.squad;
    if (this.buffs.totals.regen > 0) this.health.heal(this.buffs.totals.regen * dt);
    if (this.stimT > 0) this.stimT -= dt;
    if (this.vetAuraT > 0) this.vetAuraT -= dt;
    if (this.rallyT > 0) this.rallyT -= dt;
    if (this.garrison) {
      this.x = this.garrison.x; this.y = this.garrison.y;
      this.health.heal(4 * dt);
    }
    this.attackAnim = Math.max(0, this.attackAnim - dt);
    this.cooldown -= dt;
    if (this.specialT > 0) this.specialT -= dt;
    this.beamTo = null;

    const speed = t.stats.speed * (this.stimT > 0 ? STIM.speed : 1) * (sq.stance === 'retreat' ? 1.8 : 1) * (g.armory.has('servos') ? 1 + ARMORY_FX.servosSpeed : 1) * g.roadSpeedMul(this);
    const melee = t.stats.range < 60;
    const home = sq.slot(this.index);
    const stance = sq.stance;
    let target: Enemy | null = null;
    if (stance === 'retreat') {
      if (!this.garrison) this.moveTo(home, speed, dt);
      return; // sprinting: no shooting
    }
    if (melee && !this.garrison) {
      // Kingdom-Rush style: engage ground enemies near our post (Hold: only adjacent ones)
      const reach = stance === 'hold' ? t.stats.range + 20 : 130;
      const origin = stance === 'hold' ? this : home;
      let best: Enemy | null = null, bd = reach;
      for (const e of g.enemies) {
        if (!e.alive || e.data.flying) continue;
        const d = dist(e, origin);
        if (d < bd) { bd = d; best = e; }
      }
      if (best) {
        if (dist(this, best) > t.stats.range + best.data.radius) { if (stance !== 'hold') this.moveTo(best, speed, dt); }
        else target = best;
      } else this.moveTo(home, speed, dt);
    } else {
      const f = { hitsAir: t.weapon.hitsAir, hitsGround: true, antiAir: !!t.weapon.antiAir };
      target = pickTarget(g.enemies, this, this.range(g), sq.targeting, f);
      if (this.garrison) { /* fire from cover */ }
      else if (this.data.vehicle) this.moveTo(home, speed, dt); // vehicles fire on the move
      else if (!target) {
        // Aggressive: hunt enemies near the post, then gather scrap piles near
        // the post (scrap is its own currency; Hold/Retreat squads don't wander).
        let chase: Enemy | null = null;
        if (stance === 'aggressive') chase = pickTarget(g.enemies, home, this.range(g) + 90, TargetingMode.Close, f);
        const scrap = !chase && stance === 'aggressive' && dist(this, home) < 40 ? g.pickups.find((p) => p.alive && p.kind === 'scrap' && !p.claimedBy && dist(p, home) < 220) : undefined;
        if (chase) this.moveTo(chase, speed, dt);
        else if (scrap) { scrap.claimedBy = this; this.moveTo(scrap, speed, dt); }
        else {
          const claimed = g.pickups.find((p) => p.claimedBy === this && p.alive);
          if (claimed) { if (this.moveTo(claimed, speed, dt) || dist(this, claimed) < 10) claimed.collect(g, 1, 'troops'); }
          else this.moveTo(home, speed, dt);
        }
      }
    }
    // troops grab scrap they walk over
    if (!this.garrison) for (const p of g.pickups) if (p.alive && p.kind === 'scrap' && (p.x - this.x) ** 2 + (p.y - this.y) ** 2 < 18 * 18) p.collect(g, 1, 'troops');
    if (target) {
      this.facing = target.x >= this.x ? 1 : -1;
      if (t.weapon.beam) this.beamTo = target;
      if (this.cooldown <= 0) {
        this.cooldown = 1 / (t.stats.attackRate * this.rateMul);
        this.attackAnim = 0.18;
        g.unitAttack(this, target, t);
      }
      if (t.special && this.specialT <= 0) {
        this.specialT = t.special.every;
        g.fx({ kind: 'text', x: this.x, y: this.y - 26, text: t.special.name + '!', color: '#ffd84a', dur: 0.7 });
        g.splash(target.x, target.y, t.special.splash, t.special.damage * this.dmgMul, t.special.type, this, 'boom', { antiAir: !!t.weapon.antiAir, src: this, ap: true });
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
  private orbT = 12;

  /** Order this worker to walk over and pack nearby FarmTowers into a tight grid. */
  orderOrganize(at: Vec) {
    if (this.task?.kind === 'collect') this.task.pickup.claimedBy = null;
    this.task = { kind: 'organize', at };
  }

  update(g: Game, dt: number) {
    if (!this.alive) return;
    this.moving = false;
    this.syncTier(g);
    if (this.dropT > 0) { this.dropT -= dt; return; }
    const s = this.t(g).stats;
    if (this.buffs.totals.regen > 0) this.health.heal(this.buffs.totals.regen * dt);
    // Sprout Farmhands grow energy orbs while a wave is on
    if (g.waves.active) { this.orbT -= dt; if (this.orbT <= 0) { this.orbT = 22; g.spawnPickup(this.x + rand(-14, 14), this.y + 10, 4 + this.tier(g) * 2, 'orb'); } }
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
        if (Math.random() < dt * 3) g.healNumber(tw.x + rand(-10, 10), tw.y - 30, (s.repair ?? 5) / 3);
      }
    }
  }
}
