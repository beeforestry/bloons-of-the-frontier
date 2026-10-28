// =============================================================================
// GAME: owns the world + systems and implements the interactions between them
// (firing, splash, deploying squads, garrisoning, organizing farms, leaks).
// Rendering and DOM UI only READ from this object.
// =============================================================================
import { Faction, TargetingMode, TARGETING_ORDER, type AbilityId, type CombatStats, type DamageType, type Formation, type HitOpts, type Stance, type UnitTier, type Vec } from '../core/types';
import { EventBus } from '../core/events';
import { dist, dist2, rand } from '../core/math';
import { MAPS, toVec, type MapDef } from '../data/maps';
import { TOWERS, towerById } from '../data/towers';
import { UNITS, unitById } from '../data/units';
import { ENEMIES } from '../data/enemies';
import { buildWaves } from '../data/waves';
import { DIFFICULTIES, applyCostMul, type Difficulty } from '../data/difficulty';
import { setHQ } from '../systems/TargetingSystem';
import { PathSystem } from '../systems/PathSystem';
import { SHORTCUT, Shortcut, routeThrough, segDistance, type ShortcutDef } from '../systems/Shortcuts';
import { PlacementSystem, type Cell } from '../systems/PlacementSystem';
import { ResourceManager, type Cost } from '../systems/ResourceManager';
import { ARMORY, ARMORY_FX, SALVAGE, type ArmoryId } from '../data/armory';
import { WaveManager } from '../systems/WaveManager';
import { autoArmyUpdate } from '../systems/AutoArmy';
import { planOrganize } from '../systems/FarmOrganizer';
import type { Buffable } from '../systems/BuffSystem';
import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { Squad, Unit, WorkerUnit } from '../entities/Unit';
import { Projectile } from '../entities/Projectile';
import { Pickup } from '../entities/Pickup';
import { BuildPad, Building } from '../entities/Building';
import { BUILDINGS, HEAL, MAC, MAX_ENERGY, POWERS, TRAIN_DISCOUNT, buildingById } from '../data/buildings';
import type { BuildingKind } from '../core/types';
import { Barrier, EnvStructure, Obstacle, gEnter, gFree, gLeave, laneOffset, type EnvKind, type Garrisonable } from '../entities/Garrison';
import type { PickupKind } from '../entities/Pickup';
import type { Blocker } from '../entities/Enemy';
import { ABILITIES, EMP, HIJACK, RALLY, STIM, VET_AURA } from '../data/abilities';

/** Anything bugs / acid can hurt. */
export type Damageable = (Tower | Unit | Building | Barrier) & { takeDamage(g: Game, n: number): void };
export type SfxName = 'select' | 'command' | 'fire' | 'laser' | 'rail' | 'pop' | 'splat' | 'explosion' | 'ability' | 'mac' | 'coin' | 'orb' | 'upgrade' | 'error' | 'fuse' | 'emp' | 'hypno' | 'boss' | 'smash' | 'zap';
export interface Strike { kind: 'mac' | 'heal'; x: number; y: number; ang: number; t: number; hit: Set<number>; segs: number; owner?: number; /** MAC: the exact aimed point (clears terrain there even when the sweep snaps to a lane). */ aim?: Vec }
export interface Decal { x: number; y: number; r: number; ang: number; t: number }

export const START_CREDITS = 750;
export { PCOLORS } from '../core/players';
export type PingKind = 'defend' | 'attack' | 'spawn';
export interface Ping { x: number; y: number; kind: PingKind; pid: number; t: number }
export interface Telegraph { x: number; y: number; lane: number; t: number; dur: number; label: string }
/** Balance pass (sim): enemy HP ease per map. */
export const MAP_EASE: Record<string, number> = { jungle: 0.88, fortress: 0.95, morro: 0.8 };
export const START_LIVES = BUILDINGS[0].tiers[0].stats.maxHp;

export interface Effect {
  kind: 'text' | 'ring' | 'pop' | 'splat' | 'boom' | 'boom_fire' | 'beam' | 'dust' | 'acid' | 'pod' | 'slide' | 'dmg' | 'emp';
  x: number; y: number; r?: number; color?: string; text?: string; dur: number; t?: number;
  x2?: number; y2?: number; width?: number; crit?: boolean; vx?: number;
  /** Aggregated damage-number total / hit count. */
  val?: number; hits?: number;
}
/** Seconds during which repeated hits on one enemy merge into a single number. */
export const DMG_AGG_WINDOW = 0.35;
const fmtDmg = (n: number) => (n >= 10 ? `${Math.round(n)}` : `${Math.round(n * 10) / 10}`);

export class Game {
  readonly bus = new EventBus();
  readonly res: ResourceManager;
  readonly grid: PlacementSystem<Tower>;
  readonly paths: PathSystem[];
  /** Lane 0 (legacy accessor). */
  get path() { return this.paths[0]; }
  readonly waves: WaveManager;
  /** Hypnotized enemies fighting for the player (never in `enemies`, so nothing targets them). */
  allies: Enemy[] = [];
  /** Voice-line hook (main.ts wires speechSynthesis). */
  voiceHook: (line: string) => void = () => {};
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
  stats = { kills: 0, leaked: 0, organizes: 0, pickups: {} as Record<string, number>, supplyIncome: 0, trained: 0, macHits: 0, built: 0,
    combos: 0, powers: 0, hover: 0, hypno: 0, allyKills: 0, bossPhase2: 0, bossAttacks: 0, bossKills: 0, chain: 0, devoured: 0, vetAura: 0, rally: 0,
    orbs: 0, scrap: 0, promotions: 0, abilities: 0, bananaBank: 0, cleared: 0, shieldsPopped: 0, crits: 0, layers: 0, shortcuts: 0, armory: 0, scrapBy: {} as Record<string, number> };
  acids: { x: number; y: number; tx: number; ty: number; t: number; target: Damageable; dmg: number }[] = [];
  /** Map objects: neutral garrisonable structures, destructible terrain, path barriers. */
  envs: EnvStructure[] = [];
  obstacles: Obstacle[] = [];
  /** Blocked / opened shortcut trails (one or more per map). */
  shortcuts: Shortcut[] = [];
  barriers: Barrier[] = [];
  /** Juice: camera shake amplitude (px) + shockwave ripples, read by the renderer. */
  shakeAmt = 0;
  shocks: { x: number; y: number; r: number; t: number; dur: number }[] = [];
  /** WebAudio hook (main.ts wires Sfx); no-op headless. */
  sfxHook: (n: SfxName, x?: number, y?: number) => void = () => {};
  /** Floating damage numbers on/off (quality governor) + live count. */
  dmgNumbers = true;
  private dmgLive = 0;
  /** Group-move formation for multi-select. */
  formation: Formation = 'line';
  private blockLoad = new Map<Blocker, number>();
  // ------------------------------------------------------------------ multiplayer (phase 2)
  /** 'solo' = single player (untouched), 'host' = authoritative sim, 'client' = mirror that only renders/interpolates. */
  net: 'solo' | 'host' | 'client' = 'solo';
  mode: 'solo' | 'coop' | 'versus' = 'solo';
  /** Player whose wallet / ownership applies to the action being executed (host swaps wallets per command). */
  actingPid = 0;
  /** Auto Army toggle per player (new squads inherit it). */
  autoArmy: boolean[] = [false, false];
  /** >0 while the Auto Army AI is issuing orders (host-internal: bypasses MP command routing). */
  aiDepth = 0;
  /** Run a squad order on behalf of the Auto Army AI (doesn't count as a manual override). */
  aiOrder<T>(f: () => T): T { this.aiDepth++; try { return f(); } finally { this.aiDepth--; } }
  private manualOrder(sq: Squad) { if (!this.aiDepth && sq.auto) { sq.manual = true; sq.autoIdle = 0; sq.autoHeal = false; } }
  /** HUD toggle: Auto Army on/off for the acting player's squads. */
  setAutoArmy(on: boolean) {
    const pid = this.actingPid; this.autoArmy[pid] = on;
    for (const sq of this.ownedSquads(pid)) this.applySquadAuto(sq, on);
    this.toast(on ? '🤖 Auto Army ON — squads act on their own' : 'Auto Army OFF — squads wait for orders', on ? '#8ff7b0' : '#ffd84a');
    this.sfx('command');
  }
  /** Unit panel toggle for one squad. */
  setSquadAuto(sq: Squad, on: boolean) { this.applySquadAuto(sq, on); }
  private applySquadAuto(sq: Squad, on: boolean) { sq.auto = on; sq.manual = false; sq.autoHeal = false; sq.autoLane = -1; sq.autoT = 0; sq.autoTask = on ? 'thinking' : ''; }
  /** This tab's player id (0 = host). */
  localPid = 0;
  /** Client mirror: true only while applying a host snapshot (allows entity creation). */
  syncing = false;
  /** Network hooks: client actions become commands, the host reports events (pings, combos, telegraphs). */
  netHook: { onSpawnEnemy?: (e: Enemy) => void; onCombo?: (x: number, y: number) => void } = {};
  get isClient() { return this.net === 'client'; }
  /** Map pings (Defend Here / Attack Here / Enemy Spawning) and versus spawn telegraphs; rendered for everyone. */
  pings: Ping[] = [];
  telegraphs: Telegraph[] = [];
  addPing(p: Omit<Ping, 't'>) { this.pings.push({ ...p, t: 0 }); if (this.pings.length > 12) this.pings.shift(); this.sfx('select'); }
  /** Client: clicking / hovering a pickup asks the host to bank it. */
  netCollect: ((p: Pickup, rate: number, by: string) => void) | null = null;
  /** MP: pause/resume for everyone (client -> host request; host broadcasts via snapshots). */
  netPause: ((on: boolean) => void) | null = null;
  /** Per-player collector cap etc.: squads owned by the acting player (solo: all). */
  ownedSquads(pid = this.actingPid) { return this.squads.filter((s) => s.alive && (this.net === 'solo' || s.owner === pid)); }

  constructor(readonly map: MapDef = MAPS[0], readonly diff: Difficulty = DIFFICULTIES[1]) {
    applyCostMul(diff.cost);
    this.waves = new WaveManager(buildWaves(diff.waves), diff.hp);
    this.waves.mapEase = MAP_EASE[map.id] ?? 1;
    this.res = new ResourceManager(this.bus, diff.cash ?? START_CREDITS);
    this.grid = new PlacementSystem<Tower>(map);
    const lanes = map.lanes?.length ? map.lanes : [map.waypoints];
    this.paths = lanes.map((l) => new PathSystem(l.map(toVec), map.pathWidth));
    const rally = toVec(map.rally ?? [map.hq[0] - 300, map.hq[1]]);
    this.hq = new Building(buildingById('hq'), map.hq[0], map.hq[1], null, rally);
    this.hq.tier = 0;
    if (diff.hq !== 1) { const m = Math.round(this.hq.health.max * diff.hq); this.hq.health.setBase(m, this.hq.health.armor); this.hq.health.hp = m; }
    setHQ(this.hq);
    this.buildings.push(this.hq);
    this.pads = (map.pads ?? []).map((p, i) => new BuildPad(i, p[0], p[1]));
    this.setupMapObjects();
  }

  // ------------------------------------------------------------------ map objects
  /** Claim free buildable cells around p (env structures / obstacles); null if the spot is bad. */
  private claimCells(p: Vec, radius: number) {
    const cc = this.grid.worldToCell(p);
    if (!this.grid.isFree(cc.c, cc.r)) return null;
    for (const pd of this.pads) if (dist(pd, p) < 140) return null;
    if (dist(this.hq, p) < 220) return null;
    for (const e of [...this.envs, ...this.obstacles]) if (dist(e, p) < 150) return null;
    for (const sc of this.shortcuts) if (segDistance(p, sc.a, sc.b) < radius + this.map.pathWidth * 0.5 + 24) return null;
    const cells: Cell[] = [], n = Math.ceil(radius / this.grid.cell) + 1;
    for (let dc = -n; dc <= n; dc++) for (let dr = -n; dr <= n; dr++) {
      const c = cc.c + dc, r = cc.r + dr, q = this.grid.cellCenter(c, r);
      if (dist(q, p) <= radius && this.grid.block(c, r)) cells.push({ c, r });
    }
    return cells;
  }
  private setupMapObjects() {
    const L = this.paths.length;
    this.setupShortcuts();
    // fixed structures authored into the map (El Morro's garitas)
    for (const [k, x, y] of (this.map.envs ?? [])) {
      const e = new EnvStructure(k as EnvKind, x, y), cc = this.grid.worldToCell(e);
      for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) if (this.grid.block(cc.c + dc, cc.r + dr)) e.cells.push({ c: cc.c + dc, r: cc.r + dr });
      this.envs.push(e);
    }
    const kinds: EnvKind[] = this.map.envs?.length ? ['bunker', 'ruins'] : ['bunker', 'watchtower', 'ruins'];
    const fr = [0.34, 0.55, 0.74];
    kinds.forEach((k, i) => {
      for (const side of [110, -110, 140, -140, 85, -85, 175, -175]) {
        for (const df of [0, 0.04, -0.04, 0.08]) {
          const p = laneOffset(this, i % L, fr[i] + df, side);
          const cells = this.claimCells(p, 40);
          if (cells) { const e = new EnvStructure(k, p.x, p.y); e.cells = cells; this.envs.push(e); return; }
        }
      }
    });
    const of = [0.2, 0.45, 0.64, 0.86, 0.3];
    of.forEach((f, i) => {
      const kind = i % 2 ? 'log' : 'rock';
      for (const side of [95, -95, 125, -125, 160, -160]) {
        const p = laneOffset(this, (i + 1) % L, f, side);
        const cells = this.claimCells(p, kind === 'log' ? 46 : 34);
        if (cells) { const o = new Obstacle(kind, p.x, p.y, (i * 1.3) % 3); o.cells = cells; this.obstacles.push(o); return; }
      }
    });
  }
  /** Reserve the trail's cells (never buildable) and choke it with a rockslide blocker. */
  private setupShortcuts() {
    const defs = ((this.map as { shortcuts?: ShortcutDef[] }).shortcuts ?? []);
    const W = this.map.pathWidth;
    for (const def of defs) {
      const sc = new Shortcut(def);
      const g = this.grid, n = Math.ceil(sc.length / g.cell) + 2;
      const c0 = g.worldToCell({ x: Math.min(sc.a.x, sc.b.x), y: Math.min(sc.a.y, sc.b.y) });
      for (let c = c0.c - 2; c <= c0.c + n; c++) for (let r = c0.r - 2; r <= c0.r + n; r++) {
        if (segDistance(g.cellCenter(c, r), sc.a, sc.b) < W * 0.5 + g.cell * 0.35 && g.block(c, r)) sc.cells.push({ c, r });
      }
      const m = sc.mid;
      const o = new Obstacle('rock', m.x, m.y, 0, SHORTCUT.blockerHp);
      o.shortcut = sc; sc.blocker = o;
      this.obstacles.push(o);
      this.shortcuts.push(sc);
      sc.preview = this.shortcutPreview(sc);
    }
  }
  /** Seconds a red bloon saves on lane `k` if this shortcut opens (for the UI). */
  shortcutPreview(sc: Shortcut) {
    const r = routeThrough(this.paths, sc, this.map.pathWidth).saved, best = Math.max(0, ...Object.values(r));
    return { lanes: Object.keys(r).map(Number), saved: best, seconds: best / ENEMIES.red.speed };
  }
  /** Open a shortcut: re-route lanes, carry enemies over, salvage scrap, fast troop road. */
  openShortcut(sc: Shortcut) {
    if (sc.open) return;
    const { paths, saved } = routeThrough(this.paths, sc, this.map.pathWidth);
    sc.open = true; sc.rerouted = saved;
    for (const [ks, s] of Object.entries(saved)) {
      const k = Number(ks), oldP = this.paths[k], newP = paths[k];
      const entry = oldP.project(sc.a).d;
      for (const e of this.enemies) {
        if (!e.alive || e.lane !== k || e.route) continue;
        if (e.progress <= entry) continue; // still before the fork: takes the shortcut
        // already past the fork: if it's on the shared tail, shift its progress; else keep the old road
        const here = oldP.at(e.progress), pr = newP.project(here);
        if (pr.dist < 3 && pr.d > entry + sc.length - 1) e.progress = pr.d;
        else e.route = oldP;
      }
      this.paths[k] = newP;
      void s;
    }
    this.stats.shortcuts++;
    const m = sc.mid, sec = Math.max(0, ...Object.values(saved)) / ENEMIES.red.speed;
    for (let i = 0; i < 5; i++) this.spawnPickup(m.x + rand(-40, 40), m.y + rand(-24, 24), Math.round(SALVAGE.shortcut / 5), 'scrap');
    this.toast(`Shortcut opened! Enemies now save ~${sec.toFixed(1)}s on lane ${Object.keys(saved).map((k) => +k + 1).join(' & ')} — troops get a fast road (+${Math.round((SHORTCUT.roadSpeed - 1) * 100)}% speed). Salvage +${SALVAGE.shortcut}🔩 to gather.`, '#ffd27a');
    this.fx({ kind: 'text', x: m.x, y: m.y - 50, text: 'SHORTCUT OPEN!', color: '#ffd27a', dur: 2 });
    this.shock(m.x, m.y, 260, 0.6);
  }
  /** Scrap-paid demolition order on a shortcut blocker. */
  demolishShortcut(sc: Shortcut): boolean {
    if (sc.open || !sc.blocker) return false;
    if (!this.res.spend({ credits: 0, scrap: SHORTCUT.demolishScrap })) { this.toast(`Demolish needs ${SHORTCUT.demolishScrap}🔩 scrap (have ${this.res.scrap})`, '#ff8a7a'); return false; }
    this.clearObstacle(sc.blocker);
    return true;
  }
  /** Friendly troops move faster on an opened shortcut road. */
  roadSpeedMul(p: Vec) {
    for (const sc of this.shortcuts) if (sc.open && segDistance(p, sc.a, sc.b) < this.map.pathWidth * 0.75) return SHORTCUT.roadSpeed;
    return 1;
  }
  clearObstacle(o: Obstacle) {
    if (!o.alive || (this.isClient && !this.syncing)) return;
    o.alive = false;
    for (const c of o.cells) this.grid.unblock(c.c, c.r);
    this.obstacles = this.obstacles.filter((x) => x !== o);
    this.stats.cleared++;
    this.fx({ kind: 'dust', x: o.x, y: o.y, r: 60, color: '#bfae8e', dur: 0.8 });
    if (o.shortcut) this.openShortcut(o.shortcut);
    else {
      const salv = SALVAGE[o.kind];
      this.spawnPickup(o.x + rand(-10, 10), o.y + rand(-6, 6), salv, 'scrap');
      this.fx({ kind: 'text', x: o.x, y: o.y - 30, text: `${o.kind === 'rock' ? 'Rocks' : 'Fallen tree'} cleared! +${o.cells.length} build spots`, color: '#b6f78f', dur: 1.6 });
    }
    this.shake(5);
    this.sfx('explosion', o.x, o.y);
  }
  /** Explosive damage chips terrain. */
  private blastTerrain(x: number, y: number, r: number, dmg: number) {
    for (const o of [...this.obstacles]) if (dist(o, { x, y }) < r + 40) o.blast(this, dmg);
  }
  garrisonables(): Garrisonable[] { return [...this.towers.filter((t) => t.alive && t.gSlots() > 0 && !t.disabled), ...this.envs]; }

  // ------------------------------------------------------------------ base layer
  /** Debug/test-only tech + pop override (never set by gameplay). */
  techBonus = 0; popBonus = 0;
  get tech() { return this.techBonus + this.buildings.filter((b) => b.built && b.data.id === 'reactor').reduce((s, b) => s + (b.t.stats.tech ?? 0), 0); }
  get popCap() { return this.popBonus + this.buildings.filter((b) => b.built && (b.isHQ || b.data.id === 'reactor')).reduce((s, b) => s + (b.t.stats.pop ?? 0), 0); }
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
    b.owner = this.actingPid;
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
    for (const o of b.queue) { const c = this.deployCost(o.unitId, true); this.res.add(c.credits); this.res.add(c.scrap ?? 0, 'scrap'); }
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
  /** Leaky bucket: bugs mauling the HQ gate deal at most ~3.5% of max HQ per second combined,
   *  so a single swarm can't wipe a full base in one wave (sim: one-wave 190 -> 0 deaths). */
  private hqMelee = 0; private hqMeleeT = 0;
  /** Hard/Impoppable early-game catch-up: +25% pop bounty through wave 20 (sim: bots that
   *  spent every credit still went broke by wave 10-11 vs the first Bile Titan). */
  get bountyMul() { return this.diff.hp > 1 && this.waves.index <= 20 ? 1.25 : 1; }
  damageHQ(n: number, _src?: Enemy) {
    if (this.state !== 'playing' || this.isClient) return;
    if (_src?.atBase) {
      const cap = this.hq.health.max * 0.035;
      this.hqMelee = Math.min(cap, this.hqMelee + cap * (this.time - this.hqMeleeT)); this.hqMeleeT = this.time;
      n = Math.min(n, this.hqMelee); this.hqMelee -= n; if (n <= 0) return;
    }
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
    this.energy -= p.energy; this.powerCd[id] = p.cooldown; this.stats.powers++;
    this.voice(id === 'mac' ? 'MAC round inbound!' : 'Medic drop away!');
    let ang = 0, x = at.x, y = at.y;
    if (id === 'mac') {
      const nl = this.nearestLane(at);
      if (nl.dist < 160) { const pp = this.paths[nl.lane].at(nl.d); ang = pp.ang; x = pp.x; y = pp.y; }
      else { const prev = this.paths[nl.lane].at(nl.d); ang = prev.ang; }
    }
    this.strikes.push({ kind: id, x, y, ang, t: 0, hit: new Set(), segs: 0, owner: this.actingPid, aim: { x: at.x, y: at.y } });
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
          this.curOwner = s.owner ?? 0;
          const along = (s.segs / (N - 1) - 0.5) * MAC.length, px = s.x + c * along, py = s.y + sn * along, r = MAC.length / N * 0.9 * this.comboMul(s.x + c * along, s.y + sn * along, MAC.width);
          this.fx({ kind: 'boom_fire', x: px, y: py, r: MAC.width, dur: 0.55 });
          this.blastTerrain(px, py, MAC.width, 999);
          if (s.segs === 0) {
            this.shake(16); this.sfx('mac', px, py);
            if (s.aim && dist(s.aim, { x: px, y: py }) > MAC.width) { this.blastTerrain(s.aim.x, s.aim.y, MAC.width * 0.8, 999); this.fx({ kind: 'boom_fire', x: s.aim.x, y: s.aim.y, r: MAC.width * 0.8, dur: 0.55 }); }
          }
          if (s.segs % 2 === 0) this.shock(px, py, MAC.width * 2.2, 0.6);
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
        for (const u of this.units) if (u.alive && dist2(u, s) <= r2) { const h = u.health.heal(HEAL.unitHeal); if (h > 0) this.healNumber(u.x, u.y - 24, h); }
        this.sfx('ability', s.x, s.y);
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
  /** A troop or Wall-Nut barrier standing in this bug's way (each holds blockCap bugs). */
  findBlocker(e: Enemy): Blocker | null {
    for (const b of this.barriers) {
      if (!b.alive || !b.blockCap || dist2(b, e) > (e.data.radius + 24) ** 2) continue;
      const load = this.blockLoad.get(b) ?? 0;
      if (load < b.blockCap) { this.blockLoad.set(b, load + 1); return b; }
    }
    for (const a of this.allies) {
      if (!a.alive || a.data.flying || dist2(a, e) > (e.data.radius + a.data.radius + 6) ** 2) continue;
      const load = this.blockLoad.get(a) ?? 0;
      if (load < a.blockCap) { this.blockLoad.set(a, load + 1); return a; }
    }
    for (const u of this.units) {
      if (!u.alive || u.garrison || u.dropT > 0 || u.isWorker) continue;
      if (dist2(u, e) > (e.data.radius + 14) ** 2) continue;
      const load = this.blockLoad.get(u) ?? 0;
      if (load < u.blockCap) { this.blockLoad.set(u, load + 1); return u; }
    }
    return null;
  }
  // ------------------------------------------------------------------ t28: hypnosis, bosses, vet aura
  /** Hypno-Shroom: the enemy switches sides at FULL health and marches back down the road. */
  hypnotize(e: Enemy, tw: Tower | null, power: number): boolean {
    if (!e.alive || e.ally || e.data.boss || e.data.bossKit || this.isClient) return false;
    e.ally = true; e.allyPower = power;
    // sturdier converts: tiny bloons get a hypno HP floor, still converted at FULL health
    e.maxHp = Math.max(e.maxHp, Math.round(30 + 40 * power));
    e.hp = e.maxHp; e.shield = e.maxShield; e.shieldDown = false;
    e.stunT = 0; e.slowT = 0; e.blockedBy = null; e.atBase = false;
    this.enemies = this.enemies.filter((x) => x !== e);
    this.allies.push(e);
    this.stats.hypno++;
    this.fx({ kind: 'ring', x: e.x, y: e.y, r: 40, color: '#ff4dd8', dur: 0.7 });
    if (tw) this.fx({ kind: 'beam', x: tw.x, y: tw.y - 20, x2: e.x, y2: e.y, color: '#ff4dd8', width: 5, dur: 0.25 });
    this.fx({ kind: 'text', x: e.x, y: e.y - e.data.radius - 16, text: 'HYPNOTIZED!', color: '#ff7ae6', dur: 1.2 });
    this.sfx('hypno', e.x, e.y);
    return true;
  }
  /** Boss crossed a phase threshold. */
  bossPhaseChange(e: Enemy) {
    this.stats.bossPhase2++;
    const p3 = e.bossPhase === 3;
    this.toast(p3 ? `${e.data.name}: PHASE 3 — FRENZY!` : `${e.data.name}: PHASE 2 — shield down, it's calling reinforcements!`, '#ff6b6b');
    this.fx({ kind: 'ring', x: e.x, y: e.y, r: e.data.radius * 3, color: p3 ? '#ff3355' : '#ffb35a', dur: 0.9 });
    this.fx({ kind: 'boom', x: e.x, y: e.y, r: e.data.radius * 1.4, dur: 0.6 });
    this.shake(14); this.shock(e.x, e.y, 320, 0.7);
    this.sfx('boss', e.x, e.y); this.voice(p3 ? 'It is enraged! Hold the line!' : 'Shield is down! Light it up!');
  }
  /** Damage every friendly (tower / troop / barrier / building) near a point. */
  hurtFriendlies(x: number, y: number, r: number, dmg: number) {
    const p = { x, y }, r2 = r * r;
    for (const t of this.towers) if (t.alive && !t.disabled && dist2(t, p) <= r2) t.takeDamage(this, dmg);
    for (const u of this.units) if (u.alive && u.dropT <= 0 && !u.isWorker && dist2(u, p) <= r2) u.takeDamage(this, dmg);
    for (const b of this.barriers) if (b.alive && dist2(b, p) <= r2) b.takeDamage(this, dmg);
    for (const b of this.buildings) if (b.alive && dist2(b, p) <= (r + 40) ** 2) b.takeDamage(this, dmg * 0.5);
  }
  /** Phase-2 boss attack on the player's defenses. Returns false if nothing in reach. */
  bossAttack(e: Enemy): boolean {
    const k = e.data.bossKit!, tgt = this.nearestFriendly(e, k.attackRadius);
    if (!tgt) return false;
    this.stats.bossAttacks++;
    const style = e.bossPhase === 3 ? (['laser', 'bombs', 'smash'] as const)[this.stats.bossAttacks % 3] : k.attack;
    if (style === 'laser') {
      // sweeping laser: a beam from the boss through the target and beyond
      const a = Math.atan2(tgt.y - e.y, tgt.x - e.x), L = Math.hypot(tgt.x - e.x, tgt.y - e.y) + 120;
      const x2 = e.x + Math.cos(a) * L, y2 = e.y + Math.sin(a) * L;
      for (let i = 0; i <= 8; i++) { const f = i / 8; this.hurtFriendlies(e.x + (x2 - e.x) * f, e.y + (y2 - e.y) * f, 26, k.attackDamage / 4); }
      this.fx({ kind: 'beam', x: e.x, y: e.y - e.data.radius * 0.4, x2, y2, color: '#ff3355', width: 14, dur: 0.35 });
      this.fx({ kind: 'boom_fire', x: tgt.x, y: tgt.y, r: 40, dur: 0.4 });
      this.sfx('laser', e.x, e.y);
    } else if (style === 'bombs') {
      for (let i = 0; i < 3; i++) {
        const bx = tgt.x + rand(-50, 50), by = tgt.y + rand(-50, 50);
        this.hurtFriendlies(bx, by, 60, k.attackDamage);
        this.fx({ kind: 'boom', x: bx, y: by, r: 60, dur: 0.5 });
      }
      this.shake(8); this.sfx('explosion', tgt.x, tgt.y);
    } else {
      const r = Math.min(k.attackRadius, 160 + e.data.radius);
      this.hurtFriendlies(e.x, e.y, r, k.attackDamage);
      this.fx({ kind: 'ring', x: e.x, y: e.y, r, color: '#c9b48a', dur: 0.6 });
      this.fx({ kind: 'dust', x: e.x, y: e.y + 10, r: r * 0.8, color: '#a8926a', dur: 0.7 });
      this.shake(12); this.shock(e.x, e.y, r * 1.5, 0.6); this.sfx('smash', e.x, e.y);
    }
    if (this.stats.bossAttacks % 3 === 1) this.voice('Under attack!');
    return true;
  }
  /** 3-star veterans inspire nearby troops (+10% fire rate). */
  private vetAuraTick() {
    const vets = this.units.filter((u) => u.alive && u.stars >= 3);
    if (!vets.length) return;
    const r2 = VET_AURA.radius ** 2;
    for (const u of this.units) if (u.alive && vets.some((v) => v !== u && dist2(v, u) <= r2)) u.vetAuraT = 0.25;
  }
  /** Abilities a squad can use now: its kit + Rally once it has a 3-star veteran. */
  squadAbilities(sq: Squad): AbilityId[] {
    const a = [...(sq.data.abilities ?? [])];
    if (sq.units.some((u) => u.alive && u.stars >= 3)) a.push('rally');
    return a;
  }
  nearestFriendly(p: Vec, r: number): Damageable | null {
    let best: Damageable | null = null, bd = r;
    for (const b of this.buildings) if (b.alive) { const d = dist(b, p) - 40; if (d < bd) { bd = d; best = b; } }
    for (const t of this.towers) if (t.alive && !t.disabled) { const d = dist(t, p); if (d < bd) { bd = d; best = t; } }
    for (const u of this.units) if (u.alive && u.dropT <= 0 && !u.isWorker) { const d = dist(u, p); if (d < bd) { bd = d; best = u; } }
    for (const b of this.barriers) if (b.alive) { const d = dist(b, p); if (d < bd) { bd = d; best = b; } }
    return best;
  }

  // ------------------------------------------------------------------ effects
  fx(e: Effect) { e.t = 0; this.effects.push(e); if (this.effects.length > 600) this.effects.splice(0, 100); }
  sfx(n: SfxName, x?: number, y?: number) { this.sfxHook(n, x, y); }
  shake(a: number) { this.shakeAmt = Math.min(22, Math.max(this.shakeAmt, a)); }
  shock(x: number, y: number, r: number, dur = 0.5) { this.shocks.push({ x, y, r, t: 0, dur }); if (this.shocks.length > 8) this.shocks.shift(); }
  /**
   * Floating damage numbers: crit yellow, normal white, shield cyan. Rapid hits
   * on the same enemy (key = enemy uid) within DMG_AGG_WINDOW merge into one
   * growing number instead of a spray of tiny ones. Throttled.
   */
  private dmgAgg = new Map<string, Effect>();
  dmgNumber(x: number, y: number, n: number, color: string, crit = false, key?: number) {
    if (!this.dmgNumbers || n < 0.05) return;
    const k = key !== undefined ? `${key}:${color}` : '';
    const prev = k ? this.dmgAgg.get(k) : undefined;
    if (prev && prev.t! < DMG_AGG_WINDOW && prev.t! < prev.dur) {
      prev.val = (prev.val ?? 0) + n; prev.hits = (prev.hits ?? 1) + 1;
      prev.crit = prev.crit || crit;
      prev.text = fmtDmg(prev.val) + (prev.crit ? '!' : '');
      prev.x = x; prev.y = y;
      prev.t = Math.min(prev.t!, 0.06); // stay fresh while the hits keep coming
      return;
    }
    if (this.dmgLive > (crit ? 90 : 60)) return;
    if (!k && !crit && n < 1 && Math.random() > 0.35) return;
    this.dmgLive++;
    const e: Effect = { kind: 'dmg', x: x + rand(-8, 8), y, text: fmtDmg(n) + (crit ? '!' : ''), color, crit, dur: crit ? 0.9 : 0.75, vx: rand(-20, 20), val: n, hits: 1 };
    this.fx(e);
    if (k) { this.dmgAgg.set(k, e); if (this.dmgAgg.size > 400) this.dmgAgg.clear(); }
  }
  healNumber(x: number, y: number, n: number) { if (n >= 0.5) this.fx({ kind: 'dmg', x: x + rand(-6, 6), y, text: `+${Math.round(n)}`, color: '#7dff7a', dur: 0.8, vx: 0 }); }
  /** Big explosion: damage + terrain + shake + shockwave (Cherry Pod, ODST pods, Spartan). */
  bigBlast(x: number, y: number, r: number, dmg: number, type: DamageType, hit?: HitOpts) {
    this.splash(x, y, r, dmg, type, { x, y }, 'boom_fire', { antiAir: false, ...hit });
    this.blastTerrain(x, y, r, 999);
    this.shake(Math.min(14, 4 + r / 12)); this.shock(x, y, r * 1.6, 0.5);
    this.sfx('explosion', x, y);
  }
  /** Drop-pod landing: ODST / Spartan pods hit the ground hard. */
  podImpact(u: Unit) {
    if (u.index !== 0 || !(u.data.id === 'odst' || u.data.hero)) return;
    this.bigBlast(u.x, u.y, 55, 20, 'explosive', { src: u });
  }
  /** Super Monkey Laser Sweep tick: a long line hitting everything (incl. aircraft). */
  sweepBeam(from: Vec, ang: number, len: number, dmg: number, tw: Tower) {
    const ex = from.x + Math.cos(ang) * len, ey = from.y + Math.sin(ang) * len;
    for (const e of this.enemies) if (e.alive && segDist(e, from, { x: ex, y: ey }) < e.data.radius + 10) e.takeDamage(this, dmg, 'energy', from, { antiAir: true, ap: true });
    this.fx({ kind: 'beam', x: from.x, y: from.y, x2: ex, y2: ey, color: '#ff3355', width: 9, dur: 0.07 });
    void tw;
  }
  toast(text: string, color?: string) { this.bus.emit('toast', { text, color }); }

  // ------------------------------------------------------------------ combat
  towerFire(tw: Tower, targets: Enemy[], c: CombatStats, shotNo: number) {
    const type = tw.data.damageType ?? 'sharp';
    const kind = tw.data.projectile ?? 'dart';
    const muzzle = { x: tw.x + Math.cos(tw.aim) * 18, y: tw.y - 14 + Math.sin(tw.aim) * 12 };
    const crit = Math.random() < 0.08; if (crit) this.stats.crits++;
    const hit: HitOpts = { antiAir: !!tw.data.antiAir, ap: !!tw.data.armorPiercing || c.pierce >= 3, shred: c.armorShred, shieldBreak: c.shieldBreak, crit };
    const dmg0 = c.damage * (crit ? 2 : 1);
    if (c.chain) { this.teslaChain(tw, targets[0], dmg0, c, hit); return; }
    if (c.devour != null) {
      const tgt = targets[0];
      if (!tgt.data.boss && tgt.maxHp <= c.devour && !tgt.data.children) {
        this.stats.devoured++;
        tgt.takeDamage(this, tgt.hp + tgt.shield + 9999, 'magic', tw, { ...hit, ap: true, shieldBreak: 99 });
        this.fx({ kind: 'text', x: tgt.x, y: tgt.y - 26, text: 'CHOMP!', color: '#c6ff6a', dur: 0.8 });
      } else tgt.takeDamage(this, dmg0, 'melee', tw, hit);
      this.fx({ kind: 'splat', x: tgt.x, y: tgt.y, r: 20, color: '#8fdc5a', dur: 0.3 });
      this.sfx('splat', tw.x, tw.y);
      return;
    }
    if (tw.data.hitscan) {
      const sniper = tw.data.id === 'sniper_monkey';
      for (const tgt of targets) this.beam(muzzle, tgt, dmg0, type, c.pierce, sniper ? '#fff6d0' : kind === 'rail' ? '#8fd0ff' : '#ff4040', sniper ? 2 : kind === 'rail' ? 5 : 2.5, hit);
      this.sfx(kind === 'rail' ? 'rail' : 'laser', tw.x, tw.y);
      return;
    }
    if (shotNo % 3 === 0) this.sfx('fire', tw.x, tw.y);
    const tgt = targets[0];
    const special = c.specialRate && shotNo % Math.round(1 / c.specialRate) === 0;
    if (kind === 'melon') {
      this.projectiles.push(new Projectile({ kind, x: muzzle.x, y: muzzle.y, angle: 0, speed: 0, damage: dmg0, type: 'fire', pierce: 1, splash: c.splash, hit,
        lob: { tx: tgt.x + Math.cos(tgt.ang) * tgt.data.speed * 0.5, ty: tgt.y + Math.sin(tgt.ang) * tgt.data.speed * 0.5, dur: 0.75 } }));
      return;
    }
    const shots = c.shots ?? 1;
    const base = (tw.fixedAim ?? Math.atan2(tgt.y - muzzle.y, tgt.x - muzzle.x)) + (kind === 'boomerang' ? -0.8 : 0);
    for (let i = 0; i < shots; i++) {
      const spread = shots > 1 ? (i - (shots - 1) / 2) * (kind === 'shuriken' ? 0.22 : kind === 'boomerang' ? 0.5 : 0.16) : 0;
      this.projectiles.push(new Projectile({
        kind: special ? 'gpea' : kind, x: muzzle.x, y: muzzle.y, angle: base + spread, speed: c.projectileSpeed ?? 600,
        damage: (special ? c.specialDamage ?? c.damage : c.damage) * (crit ? 2 : 1), type: special ? 'explosive' : type, pierce: c.pierce,
        splash: special ? c.splash : kind === 'magic' || kind === 'flak' || kind === 'glue' ? c.splash : undefined, slow: c.slow,
        homing: kind === 'magic' ? tgt : null, scale: special ? 1.8 : tw.data.id === 'arcane_obelisk' ? 2 : 1, hit,
        hitsAir: tw.data.hitsAir, hitsGround: tw.data.hitsGround,
      }));
    }
  }
  /** Tesla Coil: lightning jumps target -> nearest unhit enemy (80% damage per jump). */
  teslaChain(tw: Tower, first: Enemy, dmg: number, c: CombatStats, hit: HitOpts) {
    let from: Vec = { x: tw.x, y: tw.y - 40 }, cur: Enemy | null = first;
    const done = new Set<Enemy>();
    for (let j = 0; j <= (c.chain ?? 0) && cur; j++) {
      done.add(cur);
      cur.takeDamage(this, dmg, 'energy', tw, hit);
      if (c.slow) { cur.slowAmt = Math.max(cur.slowAmt, c.slow); cur.slowT = 0.5; cur.markSlow(this); }
      this.fx({ kind: 'beam', x: from.x, y: from.y, x2: cur.x, y2: cur.y, color: '#9fe7ff', width: j ? 2.5 : 4, dur: 0.12, jag: 1 } as Effect);
      if (j) this.stats.chain++;
      from = cur; dmg *= 0.8;
      let best: Enemy | null = null, bd = 120 * 120;
      for (const e of this.enemies) if (e.alive && !done.has(e) && (!e.data.air || hit.antiAir)) { const d = dist2(e, from); if (d < bd) { bd = d; best = e; } }
      cur = best;
    }
    this.sfx('zap', tw.x, tw.y);
  }
  beam(from: Vec, tgt: Enemy, dmg: number, type: DamageType, pierce: number, color: string, width: number, hit?: HitOpts) {
    // hitscan: hit target + up to (pierce-1) enemies along the line behind it
    const ang = Math.atan2(tgt.y - from.y, tgt.x - from.x), len = dist(from, tgt) + 60;
    const ex = from.x + Math.cos(ang) * len, ey = from.y + Math.sin(ang) * len;
    const hits = this.enemies.filter((e) => e.alive && (!e.data.air || hit?.antiAir) && segDist(e, from, { x: ex, y: ey }) < e.data.radius + 4)
      .sort((a, b) => dist2(a, from) - dist2(b, from)).slice(0, pierce);
    if (!hits.includes(tgt)) hits.unshift(tgt);
    for (const e of hits) e.takeDamage(this, dmg, type, from, hit);
    this.fx({ kind: 'beam', x: from.x, y: from.y, x2: ex, y2: ey, color, width, dur: 0.08 });
  }
  /** Versus host controller (cards, threat energy, spells, telegraphs, Boss Push); null otherwise. */
  versus: { update(g: Game, dt: number): void } | null = null;
  /** Owner (player id) of whatever is currently firing (towers / units / projectiles / MAC). */
  curOwner = -1;
  private comboT = 0;
  /** Co-op synergy: an explosion on enemies an ALLY slowed/glued in the last 2.5 s gets +20% AoE. */
  comboMul(x: number, y: number, r: number): number {
    if (this.mode !== 'coop') return 1;
    for (const e of this.enemies) if (e.alive && e.slowBy >= 0 && e.slowBy !== this.curOwner && this.time - e.slowAt < 2.5 && dist2(e, { x, y }) <= (r + e.data.radius) ** 2) {
      this.stats.combos++;
      if (this.time - this.comboT > 0.4) { this.comboT = this.time; this.fx({ kind: 'text', x, y: y - 40, text: 'COMBO! +20% AoE', color: '#ffd84a', dur: 1.1 }); this.netHook.onCombo?.(x, y); }
      return 1.2;
    }
    return 1;
  }
  splash(x: number, y: number, r: number, dmg: number, type: DamageType, from?: Vec, look: 'boom' | 'boom_fire' = 'boom', hit?: HitOpts, slow?: number) {
    if (type === 'explosive' || type === 'fire') r *= this.comboMul(x, y, r);
    for (const e of this.enemies) if (e.alive && dist2(e, { x, y }) <= (r + e.data.radius) ** 2) {
      e.takeDamage(this, dmg, type, from, hit);
      if (slow && !e.data.boss) { e.slowAmt = Math.max(e.slowAmt, slow); e.slowT = 1.6; e.markSlow(this); }
    }
    if (type === 'explosive' || type === 'fire') {
      this.blastTerrain(x, y, r, dmg);
      if (r >= 70) { this.shake(r / 14); this.shock(x, y, r * 1.4, 0.4); }
      if (r >= 45) this.sfx('explosion', x, y);
    }
    this.fx({ kind: look, x, y, r, dur: 0.35 });
  }
  unitAttack(u: Unit, tgt: Enemy, t: UnitTier) {
    const w = t.weapon, crit = Math.random() < 0.08, dmg = t.stats.damage * u.dmgMul * (crit ? 2 : 1) * (this.armory.has('servos') ? 1 + ARMORY_FX.servosDmg : 1);
    if (crit) this.stats.crits++;
    const hit: HitOpts = { antiAir: !!w.antiAir, ap: !!w.armorPiercing || this.armory.has('ap'), src: u, crit };
    if (t.stats.range < 60) {
      if (w.splash) this.splash(tgt.x, tgt.y, w.splash, dmg, w.type, u, 'boom', { ...hit, ap: true });
      else tgt.takeDamage(this, dmg, w.type, u, hit);
      this.fx({ kind: 'text', x: tgt.x, y: tgt.y - 12, text: '⚔', color: '#fff', dur: 0.25 }); return;
    }
    const from = { x: u.x + u.facing * 8, y: u.y - 12 };
    if (w.hitscan) {
      if (w.splash) { this.splash(tgt.x, tgt.y, w.splash, dmg, w.type, from, 'boom', hit); this.fx({ kind: 'beam', x: from.x, y: from.y, x2: tgt.x, y2: tgt.y, color: '#ffb35a', width: 3, dur: 0.1 }); return; }
      if (w.beam) this.beam(from, tgt, dmg, w.type, 6, '#ff5040', 3, hit);
      else this.beam(from, tgt, dmg, w.type, 1, '#ffe08a', 1.5, hit);
      return;
    }
    const ang = Math.atan2(tgt.y - u.y, tgt.x - u.x);
    this.projectiles.push(new Projectile({ kind: w.projectile ?? 'bullet', x: u.x, y: u.y - 10, angle: ang, speed: 800, damage: dmg, type: w.type, pierce: 1, splash: w.splash, hitsAir: w.hitsAir, hit }));
  }
  lobAcid(from: Enemy, target: Damageable, dmg: number) {
    this.acids.push({ x: from.x, y: from.y - 30, tx: target.x, ty: target.y, t: 0, target, dmg });
  }
  stompUnits(e: Enemy, dmg: number) {
    for (const u of this.units) if (u.alive && !u.garrison && !u.isWorker && dist2(u, e) < (e.data.radius + 18) ** 2) u.takeDamage(this, dmg);
    for (const b of this.barriers) if (b.alive && dist2(b, e) < (e.data.radius + 24) ** 2) b.takeDamage(this, dmg * 3);
  }

  // ------------------------------------------------------------------ spawning
  spawnEnemy(id: string, progress: number, lateral = 0, lane = 0, hpMul = 1): Enemy {
    lane = Math.min(lane, this.paths.length - 1);
    // bosses scale at ~half the wave HP curve so late bosses stay beatable (final boss ~70k on Hard)
    if (ENEMIES[id].bossKit && hpMul > 1) hpMul = 1 + (hpMul - 1) * 0.45;
    const e = new Enemy(ENEMIES[id], progress, lateral, lane, hpMul);
    if (this.isClient && !this.syncing) { e.alive = false; return e; } // host owns spawning
    e.speedK = this.diff.speed > 1 ? 1 + (this.diff.speed - 1) * Math.min(1, 0.35 + this.waves.index / 25) : this.diff.speed;
    if (e.data.bossKit) { this.toast(`⚠ ${e.data.name} approaches! Phase 1: plated + shielded`, '#ff6b6b'); this.sfx('boss'); this.voice('Under attack! Boss inbound!'); }
    const ps = this.paths[lane]; e.pathLen = ps.length;
    const p = ps.at(progress);
    e.x = p.x; e.y = p.y;
    this.enemies.push(e);
    this.netHook.onSpawnEnemy?.(e);
    return e;
  }
  spawnPickup(x: number, y: number, value: number, kind: PickupKind = 'credit') {
    x = Math.max(16, Math.min(this.map.width - 16, x)); y = Math.max(16, Math.min(this.map.height - 16, y));
    const p = new Pickup(x, y, value, kind);
    if (this.isClient && !this.syncing) { p.alive = false; return p; }
    this.pickups.push(p);
    return p;
  }
  /** A bloon reached the HQ: it slams into the base for its total layer value. */
  leak(e: Enemy, lives: number) {
    if (this.isClient) return;
    // Non-boss leaks are capped at 20% of max HQ so one MOAB/Titan slipping through hurts
    // badly but can't end a healthy run on its own (sim showed all-or-nothing wave walls).
    if (!e.data.boss) lives = Math.min(lives, Math.max(1, Math.round(this.hq.health.max * 0.2)));
    this.stats.leaked += lives;
    this.fx({ kind: 'boom', x: e.x, y: e.y, r: 24 + Math.min(60, lives), dur: 0.35 });
    if (e.data.boss) this.toast(`${e.data.name} rammed the HQ! -${lives}`, '#ff6b6b');
    this.damageHQ(lives, e);
  }
  win() { if (this.state === 'playing') { this.state = 'won'; this.bus.emit('gameover', { won: true }); } }
  /** BTD6-style Freeplay: keep going after victory with endless procedural waves. */
  startFreeplay() {
    if (this.state !== 'won') return false;
    this.state = 'playing'; this.waves.freeplay = true;
    this.toast('FREEPLAY — waves keep scaling forever. How long can the frontier hold?', '#ffd84a');
    return true;
  }
  voice(line: string) { this.voiceHook(line); }
  onWaveEnd() {
    for (const t of this.towers) if (t.alive && t.farm && !t.disabled) t.farm.onWaveEnd(t, this);
    for (const b of this.buildings) if (b.built && b.t.stats.waveBonus) { this.res.add(b.t.stats.waveBonus); this.stats.supplyIncome += b.t.stats.waveBonus; this.fx({ kind: 'text', x: b.x, y: b.y - 60, text: `+${b.t.stats.waveBonus}`, color: '#ffe14d', dur: 1.4 }); }
  }

  // ------------------------------------------------------------------ player actions
  canPlace(id: string, cell: Cell | null) { return !!cell && this.grid.isFree(cell.c, cell.r) && this.res.canAfford({ credits: towerById(id).tiers[0].cost }); }
  /** Path objects go ON the road: returns the snapped road point or null. */
  roadSpot(p: Vec): (Vec & { lane: number }) | null {
    const nl = this.nearestLane(p);
    if (nl.dist > this.map.pathWidth * 0.75 + 10) return null;
    const q = this.paths[nl.lane].at(nl.d);
    if (nl.d < 60 || nl.d > this.paths[nl.lane].length - 120) return null;
    for (const b of this.barriers) if (b.alive && dist(b, q) < 34) return null;
    return { x: q.x, y: q.y, lane: nl.lane };
  }
  placeBarrier(id: string, at: Vec): Barrier | null {
    const data = towerById(id), spot = this.roadSpot(at);
    if (!spot) { this.toast('Place it ON the road (not too close to the gate)', '#ff8a7a'); this.sfx('error'); return null; }
    if (!this.res.spend({ credits: data.tiers[0].cost })) { this.toast('Not enough credits', '#ff8a7a'); return null; }
    const b = new Barrier(data, spot.x, spot.y, spot.lane);
    b.owner = this.actingPid;
    this.barriers.push(b);
    this.fx({ kind: 'dust', x: b.x, y: b.y + 10, r: 26, color: '#c9b48a', dur: 0.5 });
    this.sfx('command');
    return b;
  }
  placeTower(id: string, cell: Cell): Tower | null {
    const data = towerById(id);
    if (data.kind === 'path') return null;
    if (!this.grid.isFree(cell.c, cell.r)) return null;
    if (!this.res.spend({ credits: data.tiers[0].cost })) { this.toast('Not enough credits', '#ff8a7a'); return null; }
    const t = new Tower(data, cell, this);
    t.owner = this.actingPid;
    this.grid.occupy(t, cell.c, cell.r);
    this.towers.push(t);
    if (data.fixedLane) {
      const nl = this.nearestLane(t), q = this.paths[nl.lane].at(nl.d);
      t.fixedAim = t.aim = Math.atan2(q.y - t.y, q.x - t.x);
      if (nl.dist < 20) t.fixedAim = t.aim = q.ang + Math.PI;
    }
    this.sfx('command');
    this.fx({ kind: 'dust', x: t.x, y: t.y + 16, r: 26, color: '#e8d8b0', dur: 0.4 });
    return t;
  }
  sellTower(t: Tower) {
    if (!t.alive) return;
    this.res.add(t.sellValue);
    this.grid.release(t.cell.c, t.cell.r);
    t.remove();
    this.towers = this.towers.filter((x) => x !== t);
    this.fx({ kind: 'text', x: t.x, y: t.y - 20, text: `+${t.sellValue}`, color: '#ffe14d', dur: 1 });
  }
  cycleTargeting(t: Tower) {
    const order = TARGETING_ORDER;
    t.targeting = order[(order.indexOf(t.targeting) + 1) % order.length];
  }
  setTargeting(o: Tower | Squad, m: TargetingMode) { o.targeting = m; this.sfx('command'); }
  squadCount(id: string) { return this.ownedSquads().filter((s) => s.data.id === id).length; }
  /** Credits + scrap to field a squad (Barracks training discounts credits only). */
  deployCost(id: string, train = false): Cost {
    const d = unitById(id);
    return { credits: train ? Math.round(d.tiers[0].cost * TRAIN_DISCOUNT) : d.tiers[0].cost, scrap: d.scrapCost ?? 0 };
  }
  // ------------------------------------------------------------------ Salvage Armory (scrap-only tech)
  readonly armory = new Set<ArmoryId>();
  buyArmory(id: ArmoryId): boolean {
    const a = ARMORY.find((x) => x.id === id);
    if (!a || this.armory.has(id)) return false;
    if (!this.res.spend({ credits: 0, scrap: a.scrap })) { this.toast(`${a.name} needs ${a.scrap}🔩 scrap (have ${this.res.scrap})`, '#ff8a7a'); return false; }
    this.armory.add(id);
    this.stats.armory++;
    this.toast(`Salvage Armory: ${a.name} — ${a.desc}`, '#cfe3f0');
    this.sfx('upgrade');
    for (const sq of this.squads) for (const u of sq.units) if (u.alive) this.fx({ kind: 'ring', x: u.x, y: u.y, r: 22, color: '#cfe3f0', dur: 0.6 });
    return true;
  }
  /** "520¢ + 30🔩" style label. */
  costLabel(c: Cost) { return `¢${c.credits}${c.scrap ? ` + ${c.scrap}🔩` : ''}`; }
  /** Short reason a cost can't be paid. */
  poorReason(c: Cost) { return this.res.scrap < (c.scrap ?? 0) ? `Need ${c.scrap}🔩 scrap (have ${this.res.scrap}) — troops gather scrap` : 'Not enough credits'; }
  canDeploy(id: string) {
    const d = unitById(id);
    return (this.deployCd[id] ?? 0) <= 0 && (!d.maxSquads || this.squadCount(id) < d.maxSquads) && this.res.canAfford(this.deployCost(id)) && this.tech >= d.tech && this.pop + d.population <= this.popCap;
  }
  /** Why a troop can't be fielded right now (pop / tech / squad cap), or null. */
  fieldBlock(id: string): string | null {
    const d = unitById(id);
    if (this.tech < d.tech) return `Needs Tech ${d.tech} — build a Reactor`;
    if (this.pop + d.population > this.popCap) return `Population cap ${this.pop}/${this.popCap} — build a Reactor or upgrade the HQ`;
    if (d.maxSquads && this.squadCount(id) >= d.maxSquads) return `Max ${d.maxSquads} ${d.name} squads`;
    if (this.res.scrap < (d.scrapCost ?? 0)) return `Needs ${d.scrapCost}🔩 scrap (have ${this.res.scrap}) — troops gather scrap`;
    return null;
  }
  /** Halo-Wars-style deployment: a drop pod lands the squad at the rally point. */
  deploySquad(id: string, at: Vec): Squad | null {
    const d = unitById(id);
    if ((this.deployCd[id] ?? 0) > 0) { this.toast(`${d.name} on cooldown`); return null; }
    const block = this.fieldBlock(id);
    if (block) { this.toast(block, '#ff8a7a'); return null; }
    const cost = this.deployCost(id);
    if (!this.res.spend(cost)) { this.toast(this.poorReason(cost), '#ff8a7a'); return null; }
    const sq = this.spawnSquad(d, at, true);
    this.deployCd[id] = d.cooldown;
    return sq;
  }
  /** Create a squad at a point (drop pod, or walking out of a Barracks door). */
  spawnSquad(d: ReturnType<typeof unitById>, at: Vec, pod: boolean): Squad {
    at = { x: Math.max(20, Math.min(this.map.width - 20, at.x)), y: Math.max(20, Math.min(this.map.height - 20, at.y)) };
    const sq = new Squad(d, at);
    sq.owner = this.actingPid;
    sq.auto = !!this.autoArmy[sq.owner];
    if (this.isClient && !this.syncing) return sq; // host fields squads; the snapshot brings them
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
  private clampMap(p: Vec): Vec { return { x: Math.max(10, Math.min(this.map.width - 10, p.x)), y: Math.max(10, Math.min(this.map.height - 10, p.y)) }; }
  /** Move order. queue=true (Shift-click / Queue mode) appends a waypoint instead. */
  moveSquad(sq: Squad, to: Vec, queue = false) {
    to = this.clampMap(to);
    this.manualOrder(sq);
    if (sq.stance === 'retreat') sq.stance = 'aggressive';
    if (queue && (sq.waypoints.length || !sq.arrived())) { sq.waypoints.push(to); this.fx({ kind: 'ring', x: to.x, y: to.y, r: 12, color: '#ffd84a', dur: 0.5 }); return; }
    sq.garrisonTarget = null; sq.waypoints = []; sq.patrol = null;
    for (const u of sq.units) if (u.garrison) gLeave(u.garrison, u);
    sq.rally = to;
    this.fx({ kind: 'ring', x: to.x, y: to.y, r: 18, color: '#7fd3ff', dur: 0.5 });
  }
  /** Patrol between the squad's post and the given points (loops). */
  patrolSquad(sq: Squad, pts: Vec[]) {
    if (!pts.length) return;
    this.manualOrder(sq);
    sq.garrisonTarget = null; sq.waypoints = [];
    for (const u of sq.units) if (u.garrison) gLeave(u.garrison, u);
    sq.patrol = [{ ...sq.rally }, ...pts.map((p) => this.clampMap(p))]; sq.patrolIdx = 1;
    sq.rally = sq.patrol[1];
    for (const p of pts) this.fx({ kind: 'ring', x: p.x, y: p.y, r: 14, color: '#b6f78f', dur: 0.6 });
  }
  /** Multi-select move: squads spread into a line or column across the move direction. */
  moveGroup(sqs: Squad[], to: Vec, queue = false, formation: Formation = this.formation) {
    if (sqs.length) this.voice(queue ? 'Orders received!' : 'Moving out!');
    sqs = sqs.filter((s) => s.alive);
    if (sqs.length <= 1) { if (sqs[0]) this.moveSquad(sqs[0], to, queue); return; }
    const cx = sqs.reduce((s, q) => s + q.center.x, 0) / sqs.length, cy = sqs.reduce((s, q) => s + q.center.y, 0) / sqs.length;
    const ang = Math.atan2(to.y - cy, to.x - cx), sp = 46;
    // assign slots by projection so squads don't cross paths
    const across = (q: Squad) => formation === 'line' ? -(q.center.x - cx) * Math.sin(ang) + (q.center.y - cy) * Math.cos(ang) : -((q.center.x - cx) * Math.cos(ang) + (q.center.y - cy) * Math.sin(ang));
    const order = [...sqs].sort((a, b) => across(a) - across(b));
    order.forEach((q, i) => {
      const k = i - (order.length - 1) / 2;
      const a = formation === 'line' ? ang + Math.PI / 2 : ang;
      const off = formation === 'line' ? k * sp : -i * sp;
      q.formation = formation; q.face = ang;
      this.moveSquad(q, { x: to.x + Math.cos(a) * off, y: to.y + Math.sin(a) * off }, queue);
    });
  }
  setStance(sq: Squad, st: Stance) {
    if (st === 'retreat') this.manualOrder(sq);
    if (st === 'retreat') {
      const c = sq.center, home = this.hq.door, dh = dist(c, home);
      const cover = sq.data.role === 'worker' || sq.data.vehicle ? undefined : this.garrisonables().filter((x) => gFree(x) >= 1 && dist(x, c) < Math.min(700, dh))
        .sort((a, b) => dist(a, c) - dist(b, c))[0];
      sq.waypoints = []; sq.patrol = null;
      if (cover) this.garrisonSquad(sq, cover); else { this.moveSquad(sq, home); }
      sq.stance = 'retreat';
      this.fx({ kind: 'text', x: c.x, y: c.y - 30, text: 'RETREAT!', color: '#ffb35a', dur: 0.9 });
    } else sq.stance = st;
    this.sfx('command');
  }
  /** Order a squad into the nearest Garrisonable (cover tower, stone wall, combat tower, bunker / watchtower / ruins). */
  garrisonSquad(sq: Squad, target?: Garrisonable): number {
    const c = target ?? this.garrisonables().filter((t) => gFree(t) > 0)
      .sort((a, b) => dist(a, sq.center) - dist(b, sq.center))[0];
    if (!c || sq.data.role === 'worker' || sq.data.vehicle) { this.toast(sq.data.vehicle ? 'Vehicles cannot garrison' : 'No structure with free slots'); return 0; }
    this.manualOrder(sq);
    sq.garrisonTarget = c; sq.waypoints = []; sq.patrol = null;
    if (sq.stance !== 'retreat') sq.stance = 'aggressive';
    sq.rally = { x: c.x, y: c.y + 30 };
    this.updateGarrisons();
    this.sfx('command');
    return sq.units.filter((u) => u.garrison === c).length || sq.units.length;
  }
  private updateGarrisons() {
    for (const sq of this.squads) {
      const c = sq.garrisonTarget;
      if (!c) continue;
      if (!c.alive || !c.gOpen()) { sq.garrisonTarget = null; continue; }
      for (const u of sq.units) if (!u.garrison && u.dropT <= 0 && dist(u, c) < 72) gEnter(c, u);
      if (sq.units.every((u) => u.garrison) || gFree(c) <= 0) sq.garrisonTarget = null;
    }
  }
  ungarrisonSquad(sq: Squad) { this.manualOrder(sq); sq.garrisonTarget = null; for (const u of sq.units) if (u.garrison) gLeave(u.garrison, u); }
  /** Waypoints, patrol loops, retreat completion. */
  private updateSquads() {
    for (const sq of this.squads) {
      sq.pulse = Math.max(0, sq.pulse - 1 / 60 * 2);
      for (const k of Object.keys(sq.abilityCd) as AbilityId[]) sq.abilityCd[k] = Math.max(0, (sq.abilityCd[k] ?? 0) - 1 / 60);
      if (sq.garrisonTarget) continue;
      if (sq.stance === 'retreat') { if (sq.arrived() || sq.units.every((u) => u.garrison)) sq.stance = 'hold'; continue; }
      if (!sq.arrived()) continue;
      if (sq.waypoints.length) sq.rally = sq.waypoints.shift()!;
      else if (sq.patrol) { sq.patrolIdx = (sq.patrolIdx + 1) % sq.patrol.length; sq.rally = sq.patrol[sq.patrolIdx]; }
    }
  }
  /** Squad abilities: ODST Stim / EMP, Spartan EMP Drop (Hijack). */
  useAbility(sq: Squad, id: AbilityId): boolean {
    if (!sq.alive || !this.squadAbilities(sq).includes(id) || (sq.abilityCd[id] ?? 0) > 0) return false;
    const a = ABILITIES[id], c = sq.center;
    sq.abilityCd[id] = a.cooldown; sq.pulse = 1; this.stats.abilities++;
    if (id === 'rally') {
      for (const u of this.units) if (u.alive && dist(u, c) <= RALLY.radius) { u.rallyT = RALLY.dur; u.health.heal(u.health.max * RALLY.heal); u.hitPulse = 1; this.healNumber(u.x, u.y - 20, u.health.max * RALLY.heal); }
      this.stats.rally++;
      this.fx({ kind: 'ring', x: c.x, y: c.y, r: RALLY.radius, color: '#ffd84a', dur: 0.8 });
      this.fx({ kind: 'text', x: c.x, y: c.y - 40, text: 'RALLY!', color: '#ffd84a', dur: 1 });
      this.sfx('ability', c.x, c.y); this.voice('Rally on me!');
    } else if (id === 'stim') {
      for (const u of sq.units) { u.stimT = STIM.dur; u.health.damage(u.health.hp * STIM.hpCost); u.hitPulse = 1; }
      this.fx({ kind: 'text', x: c.x, y: c.y - 34, text: 'STIM!', color: '#ff7ad1', dur: 0.9 });
      this.sfx('ability', c.x, c.y);
    } else {
      const R = id === 'emp' ? EMP.radius : HIJACK.radius, stun = id === 'emp' ? EMP.stun : HIJACK.stun;
      for (const e of this.enemies) if (e.alive && dist(e, c) <= R + e.data.radius) {
        const had = e.shield > 0; e.emp(this, stun); if (had) this.stats.shieldsPopped++;
        if (id === 'hijack' && (e.data.heavy || e.data.armored)) e.takeDamage(this, HIJACK.damage, 'energy', c, { ap: true, antiAir: true, src: sq.units[0] });
      }
      this.fx({ kind: 'emp', x: c.x, y: c.y, r: R, color: '#7fe8ff', dur: 0.7 });
      this.fx({ kind: 'text', x: c.x, y: c.y - 40, text: a.name + '!', color: '#7fe8ff', dur: 1 });
      this.shock(c.x, c.y, R * 1.2, 0.55); this.shake(id === 'hijack' ? 9 : 5);
      this.sfx('emp', c.x, c.y);
    }
    for (const u of sq.units) u.hitPulse = 1;
    return true;
  }
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
    if (!this.isClient) this.waves.update(this, dt);
    this.versus?.update(this, dt);
    for (const t of this.towers) { const n0 = this.projectiles.length; this.curOwner = t.owner; t.update(this, dt); for (let i = n0; i < this.projectiles.length; i++) this.projectiles[i].owner = t.owner; }
    for (const u of this.units) { const n0 = this.projectiles.length; this.curOwner = u.squad.owner; u.update(this, dt); for (let i = n0; i < this.projectiles.length; i++) this.projectiles[i].owner = u.squad.owner; }
    this.curOwner = -1;
    this.vetAuraTick();
    this.updateGarrisons();
    this.updateSquads();
    autoArmyUpdate(this, dt);
    for (const b of this.barriers) b.update(this, dt);
    for (const e of this.envs) e.update();
    for (const o of this.obstacles) o.hitFlash = Math.max(0, o.hitFlash - dt);
    this.blockLoad.clear();
    for (const e of this.enemies) if (e.alive && e.blockedBy) this.blockLoad.set(e.blockedBy, (this.blockLoad.get(e.blockedBy) ?? 0) + 1);
    for (const e of this.enemies) if (e.alive) e.update(this, dt);
    for (const a of this.allies) if (a.alive) a.updateAlly(this, dt);
    for (const p of this.projectiles) { this.curOwner = p.owner; p.update(this, dt); }
    this.curOwner = -1;
    for (const p of this.pickups) p.update(this, dt);
    for (const a of this.acids) {
      a.t += dt / 0.9;
      if (a.t >= 1) {
        if ((a.target as { alive: boolean }).alive) a.target.takeDamage(this, a.dmg);
        this.fx({ kind: 'acid', x: a.tx, y: a.ty, r: 28, dur: 0.5 });
      }
    }
    this.acids = this.acids.filter((a) => a.t < 1);
    this.enemies = this.enemies.filter((e) => e.alive && !e.ally);
    this.allies = this.allies.filter((a) => a.alive);
    this.projectiles = this.projectiles.filter((p) => p.alive);
    this.pickups = this.pickups.filter((p) => p.alive);
    this.units = this.units.filter((u) => u.alive);
    for (const s of this.squads) s.units = s.units.filter((u) => u.alive);
    this.squads = this.squads.filter((s) => s.units.length);
    this.barriers = this.barriers.filter((b) => b.alive);
  }
  private updateEffects(dt: number) {
    for (const e of this.effects) e.t! += dt;
    this.effects = this.effects.filter((e) => e.t! < e.dur);
    for (const [k, e] of this.dmgAgg) if (e.t! >= DMG_AGG_WINDOW || e.t! >= e.dur) this.dmgAgg.delete(k);
    let n = 0; for (const e of this.effects) if (e.kind === 'dmg') n++;
    this.dmgLive = n;
    this.shakeAmt = Math.max(0, this.shakeAmt - dt * 40);
    for (const s of this.shocks) s.t += dt;
    this.shocks = this.shocks.filter((s) => s.t < s.dur);
    for (const p of this.pings) p.t += dt;
    this.pings = this.pings.filter((p) => p.t < 6);
    for (const t of this.telegraphs) t.t += dt;
    this.telegraphs = this.telegraphs.filter((t) => t.t < t.dur);
  }
}

function segDist(p: Vec, a: Vec, b: Vec) {
  const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L));
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}

// Re-export data for UI convenience.
export { TOWERS, UNITS, Faction, rand };
