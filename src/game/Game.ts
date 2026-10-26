// =============================================================================
// GAME: owns the world + systems and implements the interactions between them
// (firing, splash, deploying squads, garrisoning, organizing farms, leaks).
// Rendering and DOM UI only READ from this object.
// =============================================================================
import { Faction, TargetingMode, type CombatStats, type DamageType, type UnitTier, type Vec } from '../core/types';
import { EventBus } from '../core/events';
import { dist, dist2, rand } from '../core/math';
import { MAPS, toVec, type MapDef } from '../data/maps';
import { TOWERS, towerById } from '../data/towers';
import { UNITS, unitById } from '../data/units';
import { ENEMIES } from '../data/enemies';
import { WAVES } from '../data/waves';
import { PathSystem } from '../systems/PathSystem';
import { PlacementSystem, type Cell } from '../systems/PlacementSystem';
import { ResourceManager } from '../systems/ResourceManager';
import { WaveManager } from '../systems/WaveManager';
import { planOrganize } from '../systems/FarmOrganizer';
import type { Buffable } from '../systems/BuffSystem';
import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { Squad, Unit, WorkerUnit } from '../entities/Unit';
import { Projectile } from '../entities/Projectile';
import { Pickup } from '../entities/Pickup';
import { BuildPad, Building } from '../entities/Building';
import { BUILDINGS, HEAL, MAC, MAX_ENERGY, POWERS, buildingById } from '../data/buildings';
import type { BuildingKind } from '../core/types';

/** Anything bugs / acid can hurt. */
export type Damageable = (Tower | Unit | Building) & { takeDamage(g: Game, n: number): void };
export interface Strike { kind: 'mac' | 'heal'; x: number; y: number; ang: number; t: number; hit: Set<number>; segs: number }
export interface Decal { x: number; y: number; r: number; ang: number; t: number }

export const START_CREDITS = 700;
export const START_LIVES = BUILDINGS[0].tiers[0].stats.maxHp;

export interface Effect {
  kind: 'text' | 'ring' | 'pop' | 'splat' | 'boom' | 'boom_fire' | 'beam' | 'dust' | 'acid' | 'pod' | 'slide';
  x: number; y: number; r?: number; color?: string; text?: string; dur: number; t?: number;
  x2?: number; y2?: number; width?: number;
}

export class Game {
  readonly bus = new EventBus();
  readonly res: ResourceManager;
  readonly grid: PlacementSystem<Tower>;
  readonly paths: PathSystem[];
  /** Lane 0 (legacy accessor). */
  get path() { return this.paths[0]; }
  readonly waves = new WaveManager(WAVES);
  towers: Tower[] = [];
  units: Unit[] = [];
  squads: Squad[] = [];
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  pickups: Pickup[] = [];
  effects: Effect[] = [];
  /** Halo Wars base layer. */
  readonly hq: Building;
  pads: BuildPad[] = [];
  buildings: Building[] = [];
  energy = 40;
  powerCd: Record<string, number> = {};
  strikes: Strike[] = [];
  decals: Decal[] = [];
  /** HQ hit points double as "lives" for the HUD / tests. */
  get lives() { return Math.ceil(this.hq.health.hp); }
  state: 'playing' | 'won' | 'lost' = 'playing';
  time = 0;
  speed = 1;
  paused = false;
  /** Researched tier per troop type (Halo Wars style: upgrades all squads of that type). */
  private unitTiers: Record<string, number> = {};
  /** Deploy cooldown per troop type. */
  deployCd: Record<string, number> = {};
  stats = { kills: 0, leaked: 0, organizes: 0, pickups: {} as Record<string, number>, supplyIncome: 0, trained: 0, macHits: 0, built: 0 };
  acids: { x: number; y: number; tx: number; ty: number; t: number; target: Damageable; dmg: number }[] = [];

  constructor(readonly map: MapDef = MAPS[0]) {
    this.res = new ResourceManager(this.bus, START_CREDITS);
    this.grid = new PlacementSystem<Tower>(map);
    const lanes = map.lanes?.length ? map.lanes : [map.waypoints];
    this.paths = lanes.map((l) => new PathSystem(l.map(toVec), map.pathWidth));
    const rally = toVec(map.rally ?? [map.hq[0] - 300, map.hq[1]]);
    this.hq = new Building(buildingById('hq'), map.hq[0], map.hq[1], null, rally);
    this.hq.tier = 0;
    this.buildings.push(this.hq);
    this.pads = (map.pads ?? []).map((p, i) => new BuildPad(i, p[0], p[1]));
  }

  // ------------------------------------------------------------------ base layer
  get tech() { return this.buildings.filter((b) => b.built && b.data.id === 'reactor').reduce((s, b) => s + (b.t.stats.tech ?? 0), 0); }
  get popCap() { return this.buildings.filter((b) => b.built && (b.isHQ || b.data.id === 'reactor')).reduce((s, b) => s + (b.t.stats.pop ?? 0), 0); }
  get pop() { return this.squads.filter((s) => s.alive).reduce((n, s) => n + (s.data.population ?? 0), 0); }
  get energyRegen() { return this.buildings.filter((b) => b.built && (b.isHQ || b.data.id === 'reactor')).reduce((s, b) => s + (b.t.stats.energyRegen ?? 0), 0); }
  buildingsOf(id: BuildingKind) { return this.buildings.filter((b) => b.alive && b.data.id === id); }
  buildOnPad(pad: BuildPad, id: BuildingKind): Building | null {
    if (pad.building) { this.toast('Pad already in use'); return null; }
    const d = buildingById(id);
    if (d.id === 'hq') return null;
    if (!this.res.spend({ credits: d.tiers[0].cost })) { this.toast('Not enough credits', '#ff8a7a'); return null; }
    const b = new Building(d, pad.x, pad.y, pad, toVec(this.map.rally ?? [pad.x - 200, pad.y]));
    b.startConstruction(0);
    pad.building = b;
    this.buildings.push(b);
    this.stats.built++;
    this.fx({ kind: 'dust', x: pad.x, y: pad.y + 20, r: 40, color: '#e8d8b0', dur: 0.6 });
    this.toast(`Constructing ${d.name} (${d.tiers[0].buildTime}s)`);
    return b;
  }
  demolish(b: Building) {
    if (b.isHQ || !b.alive) return;
    const refund = Math.round(b.invested * 0.5);
    this.res.add(refund);
    for (const o of b.queue) this.res.add(Math.round(unitById(o.unitId).tiers[0].cost * 0.85));
    this.removeBuilding(b);
    this.fx({ kind: 'text', x: b.x, y: b.y - 30, text: `+${refund}`, color: '#ffe14d', dur: 1 });
  }
  private removeBuilding(b: Building) {
    b.alive = false;
    if (b.pad) b.pad.building = null;
    this.buildings = this.buildings.filter((x) => x !== b);
  }
  destroyBuilding(b: Building) {
    this.fx({ kind: 'boom_fire', x: b.x, y: b.y, r: 80, dur: 0.6 });
    this.decals.push({ x: b.x, y: b.y + 10, r: 70, ang: Math.random() * 6, t: 0 });
    if (b.isHQ) {
      this.bus.emit('lives', { lives: 0 });
      if (this.state === 'playing') { this.toast('The HQ has fallen!', '#ff6b6b'); this.state = 'lost'; this.bus.emit('gameover', { won: false }); }
      return;
    }
    this.toast(`${b.t.name} destroyed!`, '#ff6b6b');
    this.removeBuilding(b);
  }
  damageHQ(n: number, _src?: Enemy) {
    if (this.state !== 'playing') return;
    this.hq.takeDamage(this, n);
    this.bus.emit('lives', { lives: this.lives });
  }
  setRally(b: Building, at: Vec) { b.rally = { x: Math.max(10, Math.min(this.map.width - 10, at.x)), y: Math.max(10, Math.min(this.map.height - 10, at.y)) }; this.fx({ kind: 'ring', x: at.x, y: at.y, r: 22, color: '#ffd84a', dur: 0.6 }); }
  /** Nearest lane + arc-length position to a point (MAC Blast aiming, deploy helpers). */
  nearestLane(p: Vec) {
    let best = { lane: 0, d: 0, dist: Infinity };
    this.paths.forEach((ps, lane) => { const pr = ps.project(p); if (pr.dist < best.dist) best = { lane, d: pr.d, dist: pr.dist }; });
    return best;
  }
  canCast(id: string) { const p = POWERS.find((x) => x.id === id)!; return this.energy >= p.energy && (this.powerCd[id] ?? 0) <= 0; }
  /** Leader powers (Energy). MAC: strip strike along the lane tangent under `at`. Heal: canister drop. */
  castPower(id: 'mac' | 'heal', at: Vec): boolean {
    const p = POWERS.find((x) => x.id === id)!;
    if ((this.powerCd[id] ?? 0) > 0) { this.toast(`${p.name} recharging`); return false; }
    if (this.energy < p.energy) { this.toast(`Need ${p.energy} energy`, '#ff8a7a'); return false; }
    this.energy -= p.energy; this.powerCd[id] = p.cooldown;
    let ang = 0, x = at.x, y = at.y;
    if (id === 'mac') {
      const nl = this.nearestLane(at);
      if (nl.dist < 160) { const pp = this.paths[nl.lane].at(nl.d); ang = pp.ang; x = pp.x; y = pp.y; }
      else { const prev = this.paths[nl.lane].at(nl.d); ang = prev.ang; }
    }
    this.strikes.push({ kind: id, x, y, ang, t: 0, hit: new Set(), segs: 0 });
    this.toast(id === 'mac' ? 'MAC round inbound!' : 'Medical canister away!', id === 'mac' ? '#ffd84a' : '#9ff7b0');
    return true;
  }
  private updateStrikes(dt: number) {
    for (const s of this.strikes) {
      s.t += dt;
      if (s.kind === 'mac') {
        if (s.t < MAC.delay) continue;
        const N = 7, k = Math.min(N, Math.floor(((s.t - MAC.delay) / MAC.sweep) * N) + 1);
        const c = Math.cos(s.ang), sn = Math.sin(s.ang);
        while (s.segs < k) {
          const along = (s.segs / (N - 1) - 0.5) * MAC.length, px = s.x + c * along, py = s.y + sn * along, r = MAC.length / N * 0.9;
          this.fx({ kind: 'boom_fire', x: px, y: py, r: MAC.width, dur: 0.55 });
          this.decals.push({ x: px, y: py, r: MAC.width * 0.9, ang: Math.random() * 6, t: 0 });
          for (const e of this.enemies) {
            if (!e.alive || s.hit.has(e.uid)) continue;
            const dx = e.x - px, dy = e.y - py, a = dx * c + dy * sn, l = -dx * sn + dy * c;
            if (Math.abs(a) <= r * 0.6 + e.data.radius && Math.abs(l) <= MAC.width / 2 + e.data.radius) {
              s.hit.add(e.uid); this.stats.macHits++;
              e.knockback(e.data.boss ? MAC.bossKnockback : MAC.knockback);
              e.takeDamage(this, e.data.boss ? MAC.bossDamage : MAC.damage, 'explosive', { x: px, y: py });
            }
          }
          s.segs++;
        }
        if (s.segs >= N) s.t = 99;
      } else if (s.kind === 'heal' && s.t >= 0.7 && s.segs === 0) {
        s.segs = 1;
        const r2 = HEAL.radius ** 2;
        for (const u of this.units) if (u.alive && dist2(u, s) <= r2) u.health.heal(HEAL.unitHeal);
        for (const t of this.towers) if (t.alive && dist2(t, s) <= r2) { if (t.disabled) t.repair(this, 999); t.health.heal(HEAL.towerHeal); }
        for (const b of this.buildings) if (b.alive && dist2(b, s) <= (HEAL.radius + 60) ** 2) b.repair(this, HEAL.towerHeal);
        this.bus.emit('lives', { lives: this.lives });
        this.fx({ kind: 'ring', x: s.x, y: s.y, r: HEAL.radius, color: '#9ff7b0', dur: 0.9 });
        this.fx({ kind: 'text', x: s.x, y: s.y - 40, text: '+HEAL', color: '#9ff7b0', dur: 1.2 });
        s.t = 99;
      }
    }
    this.strikes = this.strikes.filter((s) => s.t < 50);
    for (const d of this.decals) d.t += dt;
    this.decals = this.decals.filter((d) => d.t < 40);
    if (this.decals.length > 80) this.decals.splice(0, this.decals.length - 80);
  }

  // ------------------------------------------------------------------ queries
  unitTier(id: string) { return this.unitTiers[id] ?? 0; }
  *buffables(): Iterable<Buffable> { yield* this.towers; yield* this.units; }
  troops() { return this.units.filter((u) => u.alive && !u.isWorker); }
  workers() { return this.units.filter((u): u is WorkerUnit => u.alive && u instanceof WorkerUnit); }
  farms() { return this.towers.filter((t) => t.alive && t.isFarm); }
  nearestTroop(p: Vec, r: number): Unit | null {
    let best: Unit | null = null, bd = r;
    for (const u of this.units) if (u.alive && !u.garrison && u.dropT <= 0 && !u.isWorker) { const d = dist(u, p); if (d < bd) { bd = d; best = u; } }
    return best;
  }
  /** A troop standing in this bug's way (max 3 bugs per troop). */
  findBlocker(e: Enemy): Unit | null {
    for (const u of this.units) {
      if (!u.alive || u.garrison || u.dropT > 0) continue;
      if (dist2(u, e) > (e.data.radius + 14) ** 2) continue;
      const load = this.enemies.filter((x) => x.blockedBy === u).length;
      if (load < 3) return u;
    }
    return null;
  }
  nearestFriendly(p: Vec, r: number): Damageable | null {
    let best: Damageable | null = null, bd = r;
    for (const b of this.buildings) if (b.alive) { const d = dist(b, p) - 40; if (d < bd) { bd = d; best = b; } }
    for (const t of this.towers) if (t.alive && !t.disabled) { const d = dist(t, p); if (d < bd) { bd = d; best = t; } }
    for (const u of this.units) if (u.alive && !u.garrison && u.dropT <= 0) { const d = dist(u, p); if (d < bd) { bd = d; best = u; } }
    return best;
  }

  // ------------------------------------------------------------------ effects
  fx(e: Effect) { e.t = 0; this.effects.push(e); if (this.effects.length > 600) this.effects.splice(0, 100); }
  toast(text: string, color?: string) { this.bus.emit('toast', { text, color }); }

  // ------------------------------------------------------------------ combat
  towerFire(tw: Tower, targets: Enemy[], c: CombatStats, shotNo: number) {
    const type = tw.data.damageType ?? 'sharp';
    const kind = tw.data.projectile ?? 'dart';
    const muzzle = { x: tw.x + Math.cos(tw.aim) * 18, y: tw.y - 14 + Math.sin(tw.aim) * 12 };
    if (tw.data.hitscan) {
      for (const tgt of targets) this.beam(muzzle, tgt, c.damage, type, c.pierce, kind === 'rail' ? '#8fd0ff' : '#ff4040', kind === 'rail' ? 5 : 2.5);
      return;
    }
    const tgt = targets[0];
    const special = c.specialRate && shotNo % Math.round(1 / c.specialRate) === 0;
    if (kind === 'melon') {
      this.projectiles.push(new Projectile({ kind, x: muzzle.x, y: muzzle.y, angle: 0, speed: 0, damage: c.damage, type: 'fire', pierce: 1, splash: c.splash,
        lob: { tx: tgt.x + Math.cos(tgt.ang) * tgt.data.speed * 0.5, ty: tgt.y + Math.sin(tgt.ang) * tgt.data.speed * 0.5, dur: 0.75 } }));
      return;
    }
    const shots = c.shots ?? 1;
    const base = Math.atan2(tgt.y - muzzle.y, tgt.x - muzzle.x);
    for (let i = 0; i < shots; i++) {
      const spread = shots > 1 ? (i - (shots - 1) / 2) * (kind === 'shuriken' ? 0.22 : 0.16) : 0;
      this.projectiles.push(new Projectile({
        kind: special ? 'gpea' : kind, x: muzzle.x, y: muzzle.y, angle: base + spread, speed: c.projectileSpeed ?? 600,
        damage: special ? c.specialDamage ?? c.damage : c.damage, type: special ? 'explosive' : type, pierce: c.pierce,
        splash: special ? c.splash : kind === 'magic' ? c.splash : undefined, slow: c.slow,
        homing: kind === 'magic' ? tgt : null, scale: special ? 1.8 : 1,
      }));
    }
  }
  beam(from: Vec, tgt: Enemy, dmg: number, type: DamageType, pierce: number, color: string, width: number) {
    // hitscan: hit target + up to (pierce-1) enemies along the line behind it
    const ang = Math.atan2(tgt.y - from.y, tgt.x - from.x), len = dist(from, tgt) + 60;
    const ex = from.x + Math.cos(ang) * len, ey = from.y + Math.sin(ang) * len;
    const hits = this.enemies.filter((e) => e.alive && segDist(e, from, { x: ex, y: ey }) < e.data.radius + 4)
      .sort((a, b) => dist2(a, from) - dist2(b, from)).slice(0, pierce);
    if (!hits.includes(tgt)) hits.unshift(tgt);
    for (const e of hits) e.takeDamage(this, dmg, type, from);
    this.fx({ kind: 'beam', x: from.x, y: from.y, x2: ex, y2: ey, color, width, dur: 0.08 });
  }
  splash(x: number, y: number, r: number, dmg: number, type: DamageType, from?: Vec, look: 'boom' | 'boom_fire' = 'boom') {
    for (const e of this.enemies) if (e.alive && dist2(e, { x, y }) <= (r + e.data.radius) ** 2) e.takeDamage(this, dmg, type, from);
    this.fx({ kind: look, x, y, r, dur: 0.35 });
  }
  unitAttack(u: Unit, tgt: Enemy, t: UnitTier) {
    const w = t.weapon, dmg = t.stats.damage;
    if (t.stats.range < 60) { tgt.takeDamage(this, dmg, w.type, u); this.fx({ kind: 'text', x: tgt.x, y: tgt.y - 12, text: '⚔', color: '#fff', dur: 0.25 }); return; }
    if (w.hitscan) { this.beam({ x: u.x, y: u.y - 10 }, tgt, dmg, w.type, 1, '#ffe08a', 1.5); return; }
    const ang = Math.atan2(tgt.y - u.y, tgt.x - u.x);
    this.projectiles.push(new Projectile({ kind: w.projectile ?? 'bullet', x: u.x, y: u.y - 10, angle: ang, speed: 800, damage: dmg, type: w.type, pierce: 1, splash: w.splash, hitsAir: w.hitsAir }));
  }
  lobAcid(from: Enemy, target: Damageable, dmg: number) {
    this.acids.push({ x: from.x, y: from.y - 30, tx: target.x, ty: target.y, t: 0, target, dmg });
  }
  stompUnits(e: Enemy, dmg: number) {
    for (const u of this.units) if (u.alive && !u.garrison && dist2(u, e) < (e.data.radius + 18) ** 2) u.takeDamage(this, dmg);
  }

  // ------------------------------------------------------------------ spawning
  spawnEnemy(id: string, progress: number, lateral = 0, lane = 0, hpMul = 1): Enemy {
    lane = Math.min(lane, this.paths.length - 1);
    const e = new Enemy(ENEMIES[id], progress, lateral, lane, hpMul);
    const ps = this.paths[lane]; e.pathLen = ps.length;
    const p = ps.at(progress);
    e.x = p.x; e.y = p.y;
    this.enemies.push(e);
    return e;
  }
  spawnPickup(x: number, y: number, value: number) {
    x = Math.max(16, Math.min(this.map.width - 16, x)); y = Math.max(16, Math.min(this.map.height - 16, y));
    this.pickups.push(new Pickup(x, y, value));
  }
  /** A bloon reached the HQ: it slams into the base for its total layer value. */
  leak(e: Enemy, lives: number) {
    this.stats.leaked += lives;
    this.fx({ kind: 'boom', x: e.x, y: e.y, r: 24 + Math.min(60, lives), dur: 0.35 });
    if (e.data.boss) this.toast(`${e.data.name} rammed the HQ! -${lives}`, '#ff6b6b');
    this.damageHQ(lives, e);
  }
  win() { if (this.state === 'playing') { this.state = 'won'; this.bus.emit('gameover', { won: true }); } }
  onWaveEnd() {
    for (const t of this.towers) if (t.alive && t.farm && !t.disabled) t.farm.onWaveEnd(t, this);
    for (const b of this.buildings) if (b.built && b.t.stats.waveBonus) { this.res.add(b.t.stats.waveBonus); this.stats.supplyIncome += b.t.stats.waveBonus; this.fx({ kind: 'text', x: b.x, y: b.y - 60, text: `+${b.t.stats.waveBonus}`, color: '#ffe14d', dur: 1.4 }); }
  }

  // ------------------------------------------------------------------ player actions
  canPlace(id: string, cell: Cell | null) { return !!cell && this.grid.isFree(cell.c, cell.r) && this.res.canAfford({ credits: towerById(id).tiers[0].cost }); }
  placeTower(id: string, cell: Cell): Tower | null {
    const data = towerById(id);
    if (!this.grid.isFree(cell.c, cell.r)) return null;
    if (!this.res.spend({ credits: data.tiers[0].cost })) { this.toast('Not enough credits', '#ff8a7a'); return null; }
    const t = new Tower(data, cell, this);
    this.grid.occupy(t, cell.c, cell.r);
    this.towers.push(t);
    this.fx({ kind: 'dust', x: t.x, y: t.y + 16, r: 26, color: '#e8d8b0', dur: 0.4 });
    return t;
  }
  sellTower(t: Tower) {
    if (!t.alive) return;
    this.res.add(t.sellValue);
    this.grid.release(t.cell.c, t.cell.r);
    t.cover?.ejectAll(this);
    t.remove();
    this.towers = this.towers.filter((x) => x !== t);
    this.fx({ kind: 'text', x: t.x, y: t.y - 20, text: `+${t.sellValue}`, color: '#ffe14d', dur: 1 });
  }
  cycleTargeting(t: Tower) {
    const order = [TargetingMode.First, TargetingMode.Last, TargetingMode.Strong, TargetingMode.Close];
    t.targeting = order[(order.indexOf(t.targeting) + 1) % order.length];
  }
  squadCount(id: string) { return this.squads.filter((s) => s.data.id === id && s.alive).length; }
  canDeploy(id: string) {
    const d = unitById(id);
    return (this.deployCd[id] ?? 0) <= 0 && (!d.maxSquads || this.squadCount(id) < d.maxSquads) && this.res.canAfford({ credits: d.tiers[0].cost }) && this.tech >= d.tech && this.pop + d.population <= this.popCap;
  }
  /** Why a troop can't be fielded right now (pop / tech / squad cap), or null. */
  fieldBlock(id: string): string | null {
    const d = unitById(id);
    if (this.tech < d.tech) return `Needs Tech ${d.tech} — build a Reactor`;
    if (this.pop + d.population > this.popCap) return `Population cap ${this.pop}/${this.popCap} — build a Reactor or upgrade the HQ`;
    if (d.maxSquads && this.squadCount(id) >= d.maxSquads) return `Max ${d.maxSquads} ${d.name} squads`;
    return null;
  }
  /** Halo-Wars-style deployment: a drop pod lands the squad at the rally point. */
  deploySquad(id: string, at: Vec): Squad | null {
    const d = unitById(id);
    if ((this.deployCd[id] ?? 0) > 0) { this.toast(`${d.name} on cooldown`); return null; }
    const block = this.fieldBlock(id);
    if (block) { this.toast(block, '#ff8a7a'); return null; }
    if (!this.res.spend({ credits: d.tiers[0].cost })) { this.toast('Not enough credits', '#ff8a7a'); return null; }
    const sq = this.spawnSquad(d, at, true);
    this.deployCd[id] = d.cooldown;
    return sq;
  }
  /** Create a squad at a point (drop pod, or walking out of a Barracks door). */
  spawnSquad(d: ReturnType<typeof unitById>, at: Vec, pod: boolean): Squad {
    at = { x: Math.max(20, Math.min(this.map.width - 20, at.x)), y: Math.max(20, Math.min(this.map.height - 20, at.y)) };
    const sq = new Squad(d, at);
    for (let i = 0; i < d.squadSize; i++) {
      const U = d.role === 'worker' ? WorkerUnit : Unit;
      sq.units.push(new U(d, sq, i, this, at));
    }
    sq.units.forEach((u, i) => { const s = sq.slot(i); u.x = s.x; u.y = s.y; });
    this.units.push(...sq.units);
    this.squads.push(sq);
    if (pod) this.fx({ kind: 'pod', x: at.x, y: at.y, r: 26, color: '#9fb3c8', dur: 0.7 });
    else for (const u of sq.units) u.dropT = 0;
    return sq;
  }
  moveSquad(sq: Squad, to: Vec) {
    sq.garrisonTarget = null;
    for (const u of sq.units) if (u.garrison) u.garrison.cover?.ungarrison(u);
    sq.rally = { x: Math.max(10, Math.min(this.map.width - 10, to.x)), y: Math.max(10, Math.min(this.map.height - 10, to.y)) };
    this.fx({ kind: 'ring', x: to.x, y: to.y, r: 18, color: '#7fd3ff', dur: 0.5 });
  }
  /** Order a squad to garrison the nearest CoverTower with free slots: it walks there, units enter on arrival. */
  garrisonSquad(sq: Squad, target?: Tower): number {
    const c = target ?? this.towers.filter((t) => t.alive && t.cover && !t.disabled && t.cover.free(t) > 0)
      .sort((a, b) => dist(a, sq.rally) - dist(b, sq.rally))[0];
    if (!c || sq.data.role === 'worker') { this.toast('No Cover tower with free slots'); return 0; }
    sq.garrisonTarget = c;
    sq.rally = { x: c.x, y: c.y + 30 };
    this.updateGarrisons();
    return sq.units.filter((u) => u.garrison === c).length || sq.units.length;
  }
  private updateGarrisons() {
    for (const sq of this.squads) {
      const c = sq.garrisonTarget;
      if (!c) continue;
      if (!c.alive || !c.cover || c.disabled) { sq.garrisonTarget = null; continue; }
      for (const u of sq.units) if (!u.garrison && u.dropT <= 0 && dist(u, c) < 72) c.cover.garrison(c, u);
      if (sq.units.every((u) => u.garrison) || c.cover.free(c) <= 0) sq.garrisonTarget = null;
    }
  }
  ungarrisonSquad(sq: Squad) { sq.garrisonTarget = null; for (const u of sq.units) if (u.garrison) u.garrison.cover?.ungarrison(u); }
  /** Tech required for the NEXT research tier of a troop. */
  researchTech(id: string) { const d = unitById(id), n = d.tiers[this.unitTier(id) + 1]; return n ? n.tech ?? this.unitTier(id) + 1 : 0; }
  researchUnit(id: string): boolean {
    const d = unitById(id), tier = this.unitTier(id), next = d.tiers[tier + 1];
    if (!next) return false;
    const need = this.researchTech(id);
    if (this.tech < need) { this.toast(`${next.name} needs Tech ${need} — build/upgrade a Reactor`, '#ff8a7a'); return false; }
    if (!this.res.spend({ credits: next.cost })) return false;
    this.unitTiers[id] = tier + 1;
    this.toast(`${d.name} upgraded to ${next.name}!`, next.visual.glow);
    return true;
  }

  // ------------------------------------------------------------------ Organize Farms
  /** UI button: send the nearest idle Farmhand to organize all farms in range. */
  orderOrganizeFarms(): boolean {
    const farms = this.farms();
    if (farms.length < 2) { this.toast('Build at least 2 farms (Money Monkey / Supply Depot) first'); return false; }
    const ws = this.workers();
    if (!ws.length) { this.toast('Deploy a Sprout Farmhand to organize farms'); return false; }
    const cx = farms.reduce((s, f) => s + f.x, 0) / farms.length, cy = farms.reduce((s, f) => s + f.y, 0) / farms.length;
    const w = ws.sort((a, b) => (a.task ? 1 : 0) - (b.task ? 1 : 0) || dist(a, { x: cx, y: cy }) - dist(b, { x: cx, y: cy }))[0];
    w.orderOrganize({ x: cx, y: cy + 20 });
    this.toast('Farmhand is heading over to organize the farms');
    return true;
  }
  /** Called when the worker arrives: pack farms within a large radius into a tight grid. */
  executeOrganize(w: WorkerUnit, radius = 1600) {
    const farms = this.farms().filter((f) => dist(f, w) <= radius && !f.slide);
    const beforeRegion = this.grid.largestFreeRegion();
    const plan = planOrganize(this.grid, farms);
    if (!plan) { this.toast('Farms are already as tight as they can be'); return; }
    // occupancy: release all, then occupy targets (atomic swap, no collisions)
    for (const m of plan.moves) this.grid.release(m.farm.cell.c, m.farm.cell.r);
    let moved = 0;
    for (const m of plan.moves) {
      this.grid.occupy(m.farm, m.to.c, m.to.r);
      if (m.to.c !== m.farm.cell.c || m.to.r !== m.farm.cell.r) {
        const to = this.grid.cellCenter(m.to.c, m.to.r);
        m.farm.slide = { fx: m.farm.x, fy: m.farm.y, tx: to.x, ty: to.y, t: 0, dur: 0.9 + Math.min(1.2, dist(m.farm, to) / 400) };
        moved++;
      }
      m.farm.cell = m.to;
    }
    const tc = plan.targets.reduce((a, t) => { const p = this.grid.cellCenter(t.c, t.r); return { x: a.x + p.x / plan.targets.length, y: a.y + p.y / plan.targets.length }; }, { x: 0, y: 0 });
    w.squad.rally = { x: tc.x, y: tc.y + 10 };
    this.stats.organizes++;
    const afterRegion = this.grid.largestFreeRegion();
    const note = `Farms packed: footprint ${plan.bboxBefore} -> ${plan.bboxAfter} cells, biggest open build area ${beforeRegion} -> ${afterRegion}`;
    this.bus.emit('organized', { moved, freedNote: note });
    this.toast(moved ? `Organized ${moved} farm(s)! ${note}` : 'Farms already organized', '#b6f78f');
  }

  // ------------------------------------------------------------------ main update
  update(dtReal: number) {
    if (this.paused || this.state !== 'playing') { this.updateEffects(dtReal); return; }
    let left = Math.min(0.1, dtReal) * this.speed;
    while (left > 1e-6) { const dt = Math.min(1 / 60, left); left -= dt; this.step(dt); }
    this.updateEffects(dtReal);
  }
  private step(dt: number) {
    this.time += dt;
    for (const k of Object.keys(this.deployCd)) this.deployCd[k] = Math.max(0, this.deployCd[k] - dt);
    for (const k of Object.keys(this.powerCd)) this.powerCd[k] = Math.max(0, this.powerCd[k] - dt);
    this.energy = Math.min(MAX_ENERGY, this.energy + this.energyRegen * dt);
    for (const b of [...this.buildings]) if (b.alive) b.update(this, dt);
    this.updateStrikes(dt);
    if (this.state !== 'playing') return;
    this.waves.update(this, dt);
    for (const t of this.towers) t.update(this, dt);
    for (const u of this.units) u.update(this, dt);
    this.updateGarrisons();
    for (const e of this.enemies) if (e.alive) e.update(this, dt);
    for (const p of this.projectiles) p.update(this, dt);
    for (const p of this.pickups) p.update(this, dt);
    for (const a of this.acids) {
      a.t += dt / 0.9;
      if (a.t >= 1) {
        if ((a.target as { alive: boolean }).alive) a.target.takeDamage(this, a.dmg);
        this.fx({ kind: 'acid', x: a.tx, y: a.ty, r: 28, dur: 0.5 });
      }
    }
    this.acids = this.acids.filter((a) => a.t < 1);
    this.enemies = this.enemies.filter((e) => e.alive);
    this.projectiles = this.projectiles.filter((p) => p.alive);
    this.pickups = this.pickups.filter((p) => p.alive);
    this.units = this.units.filter((u) => u.alive);
    for (const s of this.squads) s.units = s.units.filter((u) => u.alive);
    this.squads = this.squads.filter((s) => s.units.length);
  }
  private updateEffects(dt: number) {
    for (const e of this.effects) e.t! += dt;
    this.effects = this.effects.filter((e) => e.t! < e.dur);
  }
}

function segDist(p: Vec, a: Vec, b: Vec) {
  const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L));
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}

// Re-export data for UI convenience.
export { TOWERS, UNITS, Faction, rand };
