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

export const START_CREDITS = 700;
export const START_LIVES = 150;

export interface Effect {
  kind: 'text' | 'ring' | 'pop' | 'splat' | 'boom' | 'boom_fire' | 'beam' | 'dust' | 'acid' | 'pod' | 'slide';
  x: number; y: number; r?: number; color?: string; text?: string; dur: number; t?: number;
  x2?: number; y2?: number; width?: number;
}

export class Game {
  readonly bus = new EventBus();
  readonly res: ResourceManager;
  readonly grid: PlacementSystem<Tower>;
  readonly path: PathSystem;
  readonly waves = new WaveManager(WAVES);
  towers: Tower[] = [];
  units: Unit[] = [];
  squads: Squad[] = [];
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  pickups: Pickup[] = [];
  effects: Effect[] = [];
  lives = START_LIVES;
  state: 'playing' | 'won' | 'lost' = 'playing';
  time = 0;
  speed = 1;
  paused = false;
  /** Researched tier per troop type (Halo Wars style: upgrades all squads of that type). */
  private unitTiers: Record<string, number> = {};
  /** Deploy cooldown per troop type. */
  deployCd: Record<string, number> = {};
  stats = { kills: 0, leaked: 0, organizes: 0, pickups: {} as Record<string, number> };
  acids: { x: number; y: number; tx: number; ty: number; t: number; target: Tower | Unit; dmg: number }[] = [];

  constructor(readonly map: MapDef = MAPS[0]) {
    this.res = new ResourceManager(this.bus, START_CREDITS);
    this.grid = new PlacementSystem<Tower>(map);
    this.path = new PathSystem(map.waypoints.map(toVec), map.pathWidth);
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
  nearestFriendly(p: Vec, r: number): Tower | Unit | null {
    let best: Tower | Unit | null = null, bd = r;
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
  lobAcid(from: Enemy, target: Tower | Unit, dmg: number) {
    this.acids.push({ x: from.x, y: from.y - 30, tx: target.x, ty: target.y, t: 0, target, dmg });
  }
  stompUnits(e: Enemy, dmg: number) {
    for (const u of this.units) if (u.alive && !u.garrison && dist2(u, e) < (e.data.radius + 18) ** 2) u.takeDamage(this, dmg);
  }

  // ------------------------------------------------------------------ spawning
  spawnEnemy(id: string, progress: number, lateral = 0): Enemy {
    const e = new Enemy(ENEMIES[id], progress, lateral);
    const p = this.path.at(progress);
    e.x = p.x; e.y = p.y;
    this.enemies.push(e);
    return e;
  }
  spawnPickup(x: number, y: number, value: number) {
    x = Math.max(16, Math.min(this.map.width - 16, x)); y = Math.max(16, Math.min(this.map.height - 16, y));
    this.pickups.push(new Pickup(x, y, value));
  }
  leak(e: Enemy, lives: number) {
    this.lives = Math.max(0, this.lives - lives);
    this.stats.leaked += lives;
    this.bus.emit('lives', { lives: this.lives });
    if (e.data.boss) this.toast(`${e.data.name} broke through! -${lives}`, '#ff6b6b');
    if (this.lives <= 0 && this.state === 'playing') { this.state = 'lost'; this.bus.emit('gameover', { won: false }); }
  }
  win() { if (this.state === 'playing') { this.state = 'won'; this.bus.emit('gameover', { won: true }); } }
  onWaveEnd() { for (const t of this.towers) if (t.alive && t.farm && !t.disabled) t.farm.onWaveEnd(t, this); }

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
    return (this.deployCd[id] ?? 0) <= 0 && (!d.maxSquads || this.squadCount(id) < d.maxSquads) && this.res.canAfford({ credits: d.tiers[0].cost });
  }
  /** Halo-Wars-style deployment: a drop pod lands the squad at the rally point. */
  deploySquad(id: string, at: Vec): Squad | null {
    const d = unitById(id);
    if ((this.deployCd[id] ?? 0) > 0) { this.toast(`${d.name} on cooldown`); return null; }
    if (d.maxSquads && this.squadCount(id) >= d.maxSquads) { this.toast(`Max ${d.maxSquads} ${d.name} squads`); return null; }
    if (!this.res.spend({ credits: d.tiers[0].cost })) { this.toast('Not enough credits', '#ff8a7a'); return null; }
    at = { x: Math.max(20, Math.min(this.map.width - 20, at.x)), y: Math.max(20, Math.min(this.map.height - 20, at.y)) };
    const sq = new Squad(d, at);
    for (let i = 0; i < d.squadSize; i++) {
      const U = d.role === 'worker' ? WorkerUnit : Unit;
      sq.units.push(new U(d, sq, i, this, at));
    }
    sq.units.forEach((u, i) => { const s = sq.slot(i); u.x = s.x; u.y = s.y; });
    this.units.push(...sq.units);
    this.squads.push(sq);
    this.deployCd[id] = d.cooldown;
    this.fx({ kind: 'pod', x: at.x, y: at.y, r: 26, color: '#9fb3c8', dur: 0.7 });
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
  researchUnit(id: string): boolean {
    const d = unitById(id), tier = this.unitTier(id), next = d.tiers[tier + 1];
    if (!next || !this.res.spend({ credits: next.cost })) return false;
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
  executeOrganize(w: WorkerUnit, radius = 640) {
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
        a.target.takeDamage(this, a.dmg);
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
