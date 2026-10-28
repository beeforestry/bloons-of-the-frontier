// =============================================================================
// TOWER = shared base (data, tier, health, buffs, placement cell, targeting)
// + COMPOSED modules. A tower gets whichever modules its tier data declares:
//   CombatTower  - targeting + projectile/hitscan attacks     (tier.combat)
//   CoverTower   - buff aura + garrison slots                 (tier.cover)
//   FarmTower    - periodic credit crates + wave bonus        (tier.farm)
// e.g. the Frost Wall-Nut Bastion is Cover + (weak) Combat.
// =============================================================================
import { TargetingMode, type TowerData, type TowerTier } from '../core/types';
import { nextId, easeInOut } from '../core/math';
import { AuraEmitter, BuffReceiver, Health, type Buffable } from '../systems/BuffSystem';
import { pickTargets, canHit } from '../systems/TargetingSystem';
import type { Cell } from '../systems/PlacementSystem';
import type { Game } from '../game/Game';
import type { Unit } from './Unit';
import type { Enemy } from './Enemy';
import { gEject, type Garrisonable } from './Garrison';
import { ABILITIES, SWEEP } from '../data/abilities';

export class Tower implements Buffable, Garrisonable {
  readonly uid = nextId();
  tier = 0;
  x: number; y: number;
  alive = true;
  readonly buffs = new BuffReceiver();
  readonly health: Health;
  invested: number;
  targeting = TargetingMode.First;
  /** Knocked out by acid: offline until repaired / timer runs out. */
  disabledT = 0;
  slide: { fx: number; fy: number; tx: number; ty: number; t: number; dur: number } | null = null;
  aim = -Math.PI / 2;
  /** Rendered aim: eases toward `aim` (smooth turret / arm tracking). */
  aimVis = -Math.PI / 2;
  recoil = 0;
  /** 0..1 wind-up toward the next shot (draw-back / plant crouch before firing). */
  charge = 0;
  /** Seconds since the last shot (throw / reload motion). */
  sinceFire = 9;
  /** Has a live target (aiming pose vs idle). */
  engaged = false;
  combat?: CombatTower;
  cover?: CoverTower;
  farm?: FarmTower;
  flora?: FloraTower;
  hypno?: HypnoTower;
  /** Troops inside (cover towers: many slots; combat towers: 1). */
  garrisoned: Unit[] = [];
  /** Repeater: fixed firing direction. */
  fixedAim: number | null = null;
  abilityCd = 0;
  sweep: { t: number; a0: number; a1: number; tick: number } | null = null;
  /** Selection-ring pulse (damage / ability). */
  pulse = 0;

  constructor(readonly data: TowerData, public cell: Cell, g: Game) {
    const c = g.grid.cellCenter(cell.c, cell.r);
    this.x = c.x; this.y = c.y;
    this.invested = data.tiers[0].cost;
    this.health = new Health(data.tiers[0].maxHp);
    this.buffs.onChange = (t) => this.health.setBonus(t.bonusMaxHp);
    this.attachModules();
    if (data.defaultTargeting) this.targeting = data.defaultTargeting;
  }
  gName() { return this.t.name; }
  gSlots() { return this.t.cover?.garrisonSlots ?? (this.t.combat ? 1 : 0); }
  gProtect() { return this.t.cover?.garrisonProtect ?? 0.5; }
  gRange() { return this.t.cover?.garrisonRangePct ?? 0.35; }
  gOpen() { return this.alive && !this.disabled; }
  get t(): TowerTier { return this.data.tiers[this.tier]; }
  get nextTier(): TowerTier | undefined { return this.data.tiers[this.tier + 1]; }
  get sellValue() { return Math.floor(this.invested * 0.7); }
  get isFarm() { return !!this.farm; }
  get disabled() { return this.disabledT > 0; }
  /** Buffed range (CoverTower aura adds a %). */
  range(base: number) { return base * (1 + this.buffs.totals.bonusRangePct); }

  private attachModules() {
    if (this.t.combat && !this.combat) this.combat = new CombatTower();
    if (this.t.cover && !this.cover) this.cover = new CoverTower(this);
    if (this.t.farm && !this.farm) this.farm = new FarmTower();
    if ((this.t.aura || this.t.orbs) && !this.flora) this.flora = new FloraTower(this);
    if (this.t.hypno && !this.hypno) this.hypno = new HypnoTower();
  }

  upgrade(g: Game): boolean {
    const n = this.nextTier;
    if (!n || this.disabled || !g.res.spend({ credits: n.cost })) return false;
    this.tier++;
    this.invested += n.cost;
    this.health.setBase(n.maxHp, 0);
    this.attachModules();
    this.cover?.aura.refresh();
    this.flora?.aura.refresh();
    g.sfx('upgrade');
    g.fx({ kind: 'ring', x: this.x, y: this.y, r: 40, color: n.visual.glow ?? '#fff', dur: 0.6 });
    g.fx({ kind: 'text', x: this.x, y: this.y - 40, text: n.name + '!', color: '#ffe27a', dur: 1 });
    return true;
  }

  repair(g: Game, amount: number) {
    if (this.disabled) {
      this.disabledT -= amount * 0.25; // workers bring knocked-out towers back faster
      if (this.disabledT <= 0) this.revive(g);
      return;
    }
    this.health.heal(amount);
  }
  takeDamage(g: Game, n: number) {
    if (!this.alive || this.disabled) return;
    this.health.damage(n);
    this.pulse = 1;
    if (!this.health.alive) {
      this.disabledT = 10;
      this.cover?.aura.dispose();
      this.flora?.aura.dispose();
      gEject(this);
      g.fx({ kind: 'text', x: this.x, y: this.y - 30, text: 'OFFLINE', color: '#ff5a5a', dur: 1.2 });
    }
  }
  private revive(g: Game) {
    this.disabledT = 0;
    this.health.revive(0.35);
    g.fx({ kind: 'text', x: this.x, y: this.y - 30, text: 'ONLINE', color: '#7dff7a', dur: 1 });
  }
  remove() {
    this.alive = false;
    this.cover?.aura.dispose();
    this.flora?.aura.dispose();
    gEject(this);
  }
  /** Player ability (Super Monkey Laser Sweep). */
  useAbility(g: Game): boolean {
    const id = this.data.ability; if (!id || this.abilityCd > 0 || this.disabled) return false;
    this.abilityCd = ABILITIES[id].cooldown - this.tier * 4;
    this.pulse = 1;
    this.sweep = { t: 0, a0: this.aim - SWEEP.arc / 2, a1: this.aim + SWEEP.arc / 2, tick: 0 };
    g.sfx('ability'); g.stats.abilities++;
    g.fx({ kind: 'text', x: this.x, y: this.y - 50, text: 'LASER SWEEP!', color: '#ff6b6b', dur: 1 });
    return true;
  }
  get abilityMax() { return this.data.ability ? ABILITIES[this.data.ability].cooldown - this.tier * 4 : 1; }

  update(g: Game, dt: number) {
    this.recoil = Math.max(0, this.recoil - dt * 6);
    this.sinceFire += dt;
    { // eased aim tracking (critically damped toward the logical aim)
      let d = this.aim - this.aimVis; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      this.aimVis += d * Math.min(1, dt * (this.sweep ? 30 : 11));
    }
    this.pulse = Math.max(0, this.pulse - dt * 2);
    if (this.abilityCd > 0) this.abilityCd -= dt;
    this.garrisoned = this.garrisoned.filter((u) => u.alive);
    if (this.sweep) this.updateSweep(g, dt);
    if (this.slide) {
      const s = this.slide;
      s.t += dt / s.dur;
      const k = easeInOut(Math.min(1, s.t));
      this.x = s.fx + (s.tx - s.fx) * k; this.y = s.fy + (s.ty - s.fy) * k;
      if (Math.random() < dt * 20) g.fx({ kind: 'dust', x: this.x + (Math.random() - 0.5) * 30, y: this.y + 18, r: 10, color: '#cdb58a', dur: 0.4 });
      if (s.t >= 1) this.slide = null;
    }
    if (this.disabled) {
      this.disabledT -= dt;
      if (this.disabledT <= 0) this.revive(g);
      return;
    }
    if (this.buffs.totals.regen > 0) this.health.heal(this.buffs.totals.regen * dt * 0.5);
    this.combat?.update(this, g, dt);
    this.cover?.update(this, g, dt);
    this.farm?.update(this, g, dt);
    this.flora?.update(this, g, dt);
    this.hypno?.update(this, g, dt);
  }
  private updateSweep(g: Game, dt: number) {
    const s = this.sweep!, c = this.t.combat!;
    s.t += dt / SWEEP.dur; s.tick -= dt;
    const a = s.a0 + (s.a1 - s.a0) * Math.min(1, s.t);
    this.aim = a;
    if (s.tick <= 0) {
      s.tick = 0.05;
      const len = this.range(c.range) * SWEEP.lenMul, from = { x: this.x, y: this.y - 16 };
      g.sweepBeam(from, a, len, c.damage * SWEEP.mult, this);
    }
    if (s.t >= 1) this.sweep = null;
  }
}

/** Combat module: BTD-style targeting + projectile or hitscan attacks. */
export class CombatTower {
  cooldown = 0.2;
  period = 1;
  trackT = 0;
  shotCount = 0;
  update(tw: Tower, g: Game, dt: number) {
    const c = tw.t.combat!;
    this.cooldown -= dt;
    // wind-up: ramps 0->1 over the last 35% of the reload while engaged
    tw.charge = tw.engaged ? Math.max(0, Math.min(1, 1 - this.cooldown / Math.max(0.05, this.period * 0.35))) : Math.max(0, tw.charge - dt * 3);
    if (this.cooldown > 0) {
      // keep tracking the current priority target between shots (eased in Tower.update)
      this.trackT -= dt;
      if (this.trackT <= 0 && tw.fixedAim === null && !tw.sweep) {
        this.trackT = 0.12;
        const f = { hitsAir: tw.data.hitsAir ?? true, hitsGround: tw.data.hitsGround ?? true, antiAir: !!tw.data.antiAir };
        const t0 = pickTargets(g.enemies, tw, tw.range(c.range), tw.targeting, f, 1)[0];
        tw.engaged = !!t0;
        if (t0) tw.aim = Math.atan2(t0.y - tw.y, t0.x - tw.x);
      }
      return;
    }
    if (tw.sweep) return;
    const range = tw.range(c.range);
    const shots = c.shots ?? 1;
    const filter = { hitsAir: tw.data.hitsAir ?? true, hitsGround: tw.data.hitsGround ?? true, antiAir: !!tw.data.antiAir };
    let targets: Enemy[];
    if (tw.fixedAim !== null) {
      // Repeater: only enemies inside the fixed firing corridor
      const ca = Math.cos(tw.fixedAim), sa = Math.sin(tw.fixedAim);
      targets = g.enemies.filter((e) => {
        if (!e.alive || !canHit(e, filter)) return false;
        const dx = e.x - tw.x, dy = e.y - tw.y, along = dx * ca + dy * sa, perp = Math.abs(-dx * sa + dy * ca);
        return along > 0 && along < range && perp < 30 + e.data.radius;
      }).slice(0, 1);
    } else targets = pickTargets(g.enemies, tw, range, tw.targeting, filter, tw.data.hitscan ? shots : 1);
    if (!targets.length) { this.cooldown = 0.05; tw.engaged = false; tw.charge = Math.max(0, tw.charge - dt * 3); return; }
    tw.engaged = true;
    if (tw.fixedAim === null) tw.aim = Math.atan2(targets[0].y - tw.y, targets[0].x - tw.x);
    this.cooldown = 1 / (c.fireRate * (1 + tw.buffs.totals.ratePct));
    this.period = this.cooldown; tw.sinceFire = 0;
    this.shotCount++;
    tw.aim = tw.fixedAim ?? Math.atan2(targets[0].y - tw.y, targets[0].x - tw.x);
    tw.recoil = 1;
    g.towerFire(tw, targets, c, this.shotCount);
  }
}

/** Cover module: aura of +max HP / +range % / regen, plus garrison slots. */
export class CoverTower {
  readonly aura: AuraEmitter;
  constructor(tw: Tower) {
    this.aura = new AuraEmitter(
      'cover:' + tw.uid,
      () => ({ sourceId: 'cover:' + tw.uid, stackKey: 'cover', bonusMaxHp: tw.t.cover!.bonusMaxHp, bonusRangePct: tw.t.cover!.bonusRangePct, regen: tw.t.cover!.regen }),
      () => tw.t.cover!.auraRadius,
    );
  }
  update(tw: Tower, g: Game, dt: number) {
    this.aura.tick(dt, tw, g.buffables(), tw);
  }
}

/** Farm module: drops credit crates (Farmhands collect them) + wave-end bonus.
 *  Banana Drop (bankCrates): crates stack on the pad and all bank at wave end. */
export class FarmTower {
  timer = 3;
  crates = 0;
  update(tw: Tower, g: Game, dt: number) {
    if (!g.waves.active) return; // farms work during waves (King-Rush pacing)
    const f = tw.t.farm!;
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 60 / f.payoutsPerMin;
      const v = Math.round(f.income * (1 + tw.buffs.totals.incomePct));
      if (tw.data.bankCrates) { this.crates += v; g.fx({ kind: 'text', x: tw.x, y: tw.y - 34, text: '📦', color: '#ffe14d', dur: 0.6 }); return; }
      const a = Math.random() * Math.PI * 2;
      g.spawnPickup(tw.x + Math.cos(a) * 30, tw.y + 12 + Math.sin(a) * 18, v);
    }
  }
  onWaveEnd(tw: Tower, g: Game) {
    const b = Math.round(tw.t.farm!.waveBonus * (1 + tw.buffs.totals.incomePct)) + this.crates;
    if (this.crates) g.stats.bananaBank += this.crates;
    this.crates = 0;
    g.res.add(b);
    g.fx({ kind: 'text', x: tw.x, y: tw.y - 36, text: `+${b}`, color: '#ffe14d', dur: 1.2 });
  }
}

/** Flora / sun module: green aura (+attack speed, +farm income; stackKey 'flora' never stacks)
 *  and Sunflower energy orbs. */
export class FloraTower {
  readonly aura: AuraEmitter;
  orbT = 6;
  constructor(tw: Tower) {
    const id = 'flora:' + tw.uid;
    this.aura = new AuraEmitter(id,
      () => ({ sourceId: id, stackKey: 'flora', bonusMaxHp: 0, bonusRangePct: 0, regen: 0, ratePct: tw.t.aura?.ratePct ?? 0, incomePct: tw.t.aura?.incomePct ?? 0 }),
      () => tw.t.aura?.radius ?? 0);
  }
  update(tw: Tower, g: Game, dt: number) {
    if (tw.t.aura) this.aura.tick(dt, tw, g.buffables(), tw);
    const o = tw.t.orbs;
    if (o && g.waves.active) {
      this.orbT -= dt;
      if (this.orbT <= 0) { this.orbT = 60 / o.perMin; const a = Math.random() * 6.28; g.spawnPickup(tw.x + Math.cos(a) * 26, tw.y + 14 + Math.sin(a) * 14, o.energy, 'orb'); }
    }
  }
}

/** Hypno-Shroom: puffs hypnotic spores at a non-boss enemy, converting it to fight
 *  for you at FULL health (walks back up the lane brawling enemies). Tiers raise
 *  conversions/min, how many allies it can hold and the max enemy size. */
export class HypnoTower {
  timer = 2.5;
  mine: Enemy[] = [];
  update(tw: Tower, g: Game, dt: number) {
    const h = tw.t.hypno!;
    this.mine = this.mine.filter((e) => e.alive);
    const full = this.mine.length >= h.maxConverted;
    this.timer -= dt;
    const period = 60 / h.perMin;
    tw.charge = full ? 0 : Math.max(0, Math.min(1, 1 - this.timer / Math.max(0.3, period * 0.35)));
    if (full || this.timer > 0) return;
    const r = tw.range(h.range);
    let best: Enemy | null = null, bs = -1;
    for (const e of g.enemies) {
      if (!e.alive || e.data.boss || e.data.air || e.maxHp > h.maxHp || e.ally) continue;
      const d2 = (e.x - tw.x) ** 2 + (e.y - tw.y) ** 2;
      if (d2 > (r + e.data.radius) ** 2) continue;
      const s = e.maxHp * 1e4 - e.remaining; // strongest it can hold
      if (s > bs) { bs = s; best = e; }
    }
    if (!best) { this.timer = 0.25; tw.engaged = false; return; }
    tw.engaged = true;
    tw.aim = Math.atan2(best.y - tw.y, best.x - tw.x);
    this.timer = period / (1 + tw.buffs.totals.ratePct);
    tw.recoil = 1; tw.sinceFire = 0;
    g.hypnotize(best, tw, h.power);
    this.mine.push(best);
  }
}
