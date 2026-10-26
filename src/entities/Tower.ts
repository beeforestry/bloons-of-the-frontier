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
import { pickTargets } from '../systems/TargetingSystem';
import type { Cell } from '../systems/PlacementSystem';
import type { Game } from '../game/Game';
import type { Unit } from './Unit';

export class Tower implements Buffable {
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
  recoil = 0;
  combat?: CombatTower;
  cover?: CoverTower;
  farm?: FarmTower;

  constructor(readonly data: TowerData, public cell: Cell, g: Game) {
    const c = g.grid.cellCenter(cell.c, cell.r);
    this.x = c.x; this.y = c.y;
    this.invested = data.tiers[0].cost;
    this.health = new Health(data.tiers[0].maxHp);
    this.buffs.onChange = (t) => this.health.setBonus(t.bonusMaxHp);
    this.attachModules();
  }
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
  }

  upgrade(g: Game): boolean {
    const n = this.nextTier;
    if (!n || this.disabled || !g.res.spend({ credits: n.cost })) return false;
    this.tier++;
    this.invested += n.cost;
    this.health.setBase(n.maxHp, 0);
    this.attachModules();
    this.cover?.aura.refresh();
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
    if (!this.health.alive) {
      this.disabledT = 10;
      this.cover?.aura.dispose();
      this.cover?.ejectAll(g);
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
  }

  update(g: Game, dt: number) {
    this.recoil = Math.max(0, this.recoil - dt * 6);
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
  }
}

/** Combat module: BTD-style targeting + projectile or hitscan attacks. */
export class CombatTower {
  cooldown = 0.2;
  shotCount = 0;
  update(tw: Tower, g: Game, dt: number) {
    const c = tw.t.combat!;
    this.cooldown -= dt;
    if (this.cooldown > 0) return;
    const range = tw.range(c.range);
    const shots = c.shots ?? 1;
    const filter = { hitsAir: tw.data.hitsAir ?? true, hitsGround: tw.data.hitsGround ?? true };
    const targets = pickTargets(g.enemies, tw, range, tw.targeting, filter, tw.data.hitscan ? shots : 1);
    if (!targets.length) { this.cooldown = 0.05; return; }
    this.cooldown = 1 / c.fireRate;
    this.shotCount++;
    tw.aim = Math.atan2(targets[0].y - tw.y, targets[0].x - tw.x);
    tw.recoil = 1;
    g.towerFire(tw, targets, c, this.shotCount);
  }
}

/** Cover module: aura of +max HP / +range % / regen, plus garrison slots. */
export class CoverTower {
  readonly aura: AuraEmitter;
  garrisoned: Unit[] = [];
  constructor(tw: Tower) {
    this.aura = new AuraEmitter(
      'cover:' + tw.uid,
      () => ({ sourceId: 'cover:' + tw.uid, stackKey: 'cover', bonusMaxHp: tw.t.cover!.bonusMaxHp, bonusRangePct: tw.t.cover!.bonusRangePct, regen: tw.t.cover!.regen }),
      () => tw.t.cover!.auraRadius,
    );
  }
  free(tw: Tower) { return tw.t.cover!.garrisonSlots - this.garrisoned.length; }
  garrison(tw: Tower, u: Unit): boolean {
    if (this.free(tw) <= 0 || tw.disabled || u.garrison || u.isWorker) return false;
    this.garrisoned.push(u);
    u.garrison = tw;
    return true;
  }
  ungarrison(u: Unit) {
    this.garrisoned = this.garrisoned.filter((x) => x !== u);
    if (u.garrison) { u.y += 30; u.garrison = null; }
  }
  ejectAll(_g: Game) { for (const u of [...this.garrisoned]) this.ungarrison(u); }
  update(tw: Tower, g: Game, dt: number) {
    this.aura.tick(dt, tw, g.buffables(), tw);
    this.garrisoned = this.garrisoned.filter((u) => u.alive);
  }
}

/** Farm module: drops credit crates (Farmhands collect them) + wave-end bonus. */
export class FarmTower {
  timer = 3;
  update(tw: Tower, g: Game, dt: number) {
    if (!g.waves.active) return; // farms work during waves (King-Rush pacing)
    const f = tw.t.farm!;
    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 60 / f.payoutsPerMin;
      const a = Math.random() * Math.PI * 2;
      g.spawnPickup(tw.x + Math.cos(a) * 30, tw.y + 12 + Math.sin(a) * 18, f.income);
    }
  }
  onWaveEnd(tw: Tower, g: Game) {
    const b = tw.t.farm!.waveBonus;
    g.res.add(b);
    g.fx({ kind: 'text', x: tw.x, y: tw.y - 36, text: `+${b}`, color: '#ffe14d', dur: 1.2 });
  }
}
