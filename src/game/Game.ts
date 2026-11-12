// =============================================================================
// GAME: owns the world + systems and implements the interactions between them
// (firing, splash, deploying squads, garrisoning, organizing farms, leaks).
// Rendering and DOM UI only READ from this object.
// =============================================================================
import { Faction, TargetingMode, TARGETING_ORDER, type AbilityId, type ManualCtl, type CombatStats, type DamageType, type Formation, type HitOpts, type Stance, type UnitTier, type Vec } from '../core/types';
import { EventBus } from '../core/events';
import { dist, dist2, rand } from '../core/math';
import { MAPS, toVec, type MapDef } from '../data/maps';
import { TOWERS, towerById } from '../data/towers';
import { UNITS, unitById } from '../data/units';
import { ENEMIES } from '../data/enemies';
import { buildWaves } from '../data/waves';
import { DIFFICULTIES, applyCostMul, type Difficulty } from '../data/difficulty';
import { groundH } from '../data/terrain';
import { setHQ } from '../systems/TargetingSystem';
import { PathSystem } from '../systems/PathSystem';
import { SHORTCUT, Shortcut, routeThrough, segDistance, type ShortcutDef } from '../systems/Shortcuts';
import { PlacementSystem, type Cell, type Spot } from '../systems/PlacementSystem';
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
import { PROP_DEFS, PROP_PLAN, COVER, type MapProp } from '../data/props';
import { Barrier, EnvStructure, Obstacle, gEnter, gFree, gLeave, laneOffset, type EnvKind, type Garrisonable } from '../entities/Garrison';
import type { PickupKind } from '../entities/Pickup';
import type { Blocker } from '../entities/Enemy';
import { ABILITIES, EMP, HIJACK, RALLY, STIM, VET_AURA } from '../data/abilities';

/** Anything bugs / acid can hurt. */
export type Damageable = (Tower | Unit | Building | Barrier) & { takeDamage(g: Game, n: number): void };
export type SfxName = 'select' | 'command' | 'fire' | 'laser' | 'rail' | 'pop' | 'splat' | 'explosion' | 'ability' | 'mac' | 'coin' | 'orb' | 'upgrade' | 'error' | 'fuse' | 'emp' | 'hypno' | 'boss' | 'smash' | 'zap' | 'wave' | 'victory' | 'defeat';
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

/** Camera shake tuning: max amplitude (screen px), exponential decay rate (1/s), longest continuous run (s). */
/** First-person possession: direct (crosshair) hits deal +15% damage. */
export const MANUAL_BONUS = 1.15;
const SHAKE_CAP = 14, SHAKE_DECAY = 8, SHAKE_MAX_RUN = 1.2;

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
  unitTiers: Record<string, number> = {};
  /** Deploy cooldown per troop type. */
  deployCd: Record<string, number> = {};
  stats = { kills: 0, leaked: 0, organizes: 0, pickups: {} as Record<string, number>, supplyIncome: 0, trained: 0, macHits: 0, built: 0,
    combos: 0, powers: 0, hover: 0, hypno: 0, allyKills: 0, bossPhase2: 0, bossAttacks: 0, bossKills: 0, chain: 0, devoured: 0, vetAura: 0, rally: 0,
    orbs: 0, scrap: 0, promotions: 0, abilities: 0, possessions: 0, manualShots: 0, manualHits: 0, bananaBank: 0, cleared: 0, shieldsPopped: 0, crits: 0, layers: 0, shortcuts: 0, armory: 0, freeCollectors: 0, scrapBy: {} as Record<string, number> };
  acids: { x: number; y: number; tx: number; ty: number; t: number; target: Damageable; dmg: number }[] = [];
  /** Map objects: neutral garrisonable structures, destructible terrain, path barriers. */
  envs: EnvStructure[] = [];
  obstacles: Obstacle[] = [];
  /** t42 military prop clusters (block building, sandbags/barricades give troops cover). */
  props: MapProp[] = [];
  /** Bumped whenever towers are placed / sold so cached sniper line-of-sight tables rebuild. */
  losVer = 0;
  /** Blocked / opened shortcut trails (one or more per map). */
  shortcuts: Shortcut[] = [];
  barriers: Barrier[] = [];
  /** Juice: camera shake amplitude (px) + shockwave ripples, read by the renderer. */
  shakeAmt = 0;
  /** Screen-shake setting multiplier (Settings: Full 1 / Reduced 0.4 / Off 0). */
  shakeScale = 1;
  /** Settings: Reduce flashing (t48). */
  reduceFlash = false;
  /** Real (unscaled) seconds the camera has been shaking without a break, plus a cooldown
   *  that ignores new shakes after a long run, so sustained retriggers can never lock it on. */
  private shakeRun = 0;
  private shakeCool = 0;
  private realT = 0;
  private lastMinorShake = -1;
  private wasPaused = false;
  /** Shake call counter (tests). */
  shakeCalls = 0;
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
  mode: 'solo' | 'coop' | 'versus' | 'overrun' = 'solo';
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
    this.waves = new WaveManager(buildWaves(diff.waves), diff.hp, diff.count, diff.late);
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
    for (const e of this.props) if (dist(e, p) < 120) return null;
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
    // military prop clusters beside the lanes (deterministic so co-op clients match)
    PROP_PLAN.forEach(([kind, f, sd], i) => {
      for (const side of [120, 150, 95, 185, 220]) for (const df of [0, 0.03, -0.03]) {
        const p = laneOffset(this, i % L, f + df, side * sd);
        if (p.x < 60 || p.y < 60 || p.x > this.map.width - 60 || p.y > this.map.height - 60) continue;
        const cells = this.claimCells(p, PROP_DEFS[kind].radius);
        if (cells) { this.props.push({ kind, x: p.x, y: p.y, flip: i % 2 === 1, cells }); return; }
      }
    });
  }
  /** Troop cover: standing next to sandbags / a barricade cuts incoming damage. */
  inCover(p: Vec) { for (const pr of this.props) if (PROP_DEFS[pr.kind].cover && dist(pr, p) < PROP_DEFS[pr.kind].radius + COVER.pad) return true; return false; }
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
  get pop() { return this.squads.filter((s) => s.alive && !s.data.free).reduce((n, s) => n + (s.data.population ?? 0), 0); }
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
    if (this.state !== 'playing' || this.isClient || this.overrun) return;
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
    this.voice(id === 'mac' ? 'Orbital Barrage inbound!' : 'Medic drop away!');
    let ang = 0, x = at.x, y = at.y;
    if (id === 'mac') {
      const nl = this.nearestLane(at);
      if (nl.dist < 160) { const pp = this.paths[nl.lane].at(nl.d); ang = pp.ang; x = pp.x; y = pp.y; }
      else { const prev = this.paths[nl.lane].at(nl.d); ang = prev.ang; }
    }
    this.strikes.push({ kind: id, x, y, ang, t: 0, hit: new Set(), segs: 0, owner: this.actingPid, aim: { x: at.x, y: at.y } });
    this.toast(id === 'mac' ? 'Orbital Barrage inbound!' : 'Medical canister away!', id === 'mac' ? '#ffd84a' : '#9ff7b0');
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
  /** Camera shake (screen px). Max-combined (never additive), hard-capped, and rate-limited for
   *  routine splash shakes; a run longer than SHAKE_MAX_RUN forces a quiet cooldown. */
  shake(a: number, minor = false) {
    this.shakeCalls++;
    if (this.shakeScale <= 0 || !(a > 0) || this.shakeCool > 0) return;
    if (minor) { if (this.realT - this.lastMinorShake < 0.6) return; this.lastMinorShake = this.realT; a = Math.min(a, 6); }
    this.shakeAmt = Math.min(SHAKE_CAP * this.shakeScale, Math.max(this.shakeAmt, a * this.shakeScale));
  }
  /** Stop all camera shake now (pause, menu, map change, settings change). */
  resetShake() { this.shakeAmt = 0; this.shakeRun = 0; this.shakeCool = 0; }
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
      const beacon = tw.data.id === 'unsc_beacon';
      const rail = tw.data.id === 'unsc_rail';
      // Roof MG secondary (shotNo >= 900): bullet tracers, not the main gun's shell/rail.
      const sec = shotNo >= 900 && !!c.secondary;
      if (sec) {
        const ang = Math.atan2(targets[0].y - muzzle.y, targets[0].x - muzzle.x);
        this.projectiles.push(new Projectile({
          kind: 'bullet', x: muzzle.x, y: muzzle.y, angle: ang, speed: c.projectileSpeed ?? 1100,
          damage: dmg0, type: 'ballistic', pierce: c.pierce, hitsAir: tw.data.hitsAir, hitsGround: tw.data.hitsGround, hit,
        }));
        this.sfx('fire', tw.x, tw.y);
        return;
      }
      // Beacon: lock beam is drawn continuously from CombatTower.beamTo — only deal damage here.
      if (beacon) {
        for (const tgt of targets) this.beam(muzzle, tgt, dmg0, type, c.pierce, '#ffe9a0', 0, hit, { reach: dist(muzzle, tgt) + 40, silent: true });
        this.sfx('laser', tw.x, tw.y);
        return;
      }
      // Rail Lance: keep acquire range, but the slug travels/pierces far across the map (cooler long streak).
      const col = sniper ? '#fff6d0' : rail ? (tw.tier >= 2 ? '#c8f0ff' : tw.tier >= 1 ? '#9adfff' : '#7ec8ff') : '#ff4040';
      const w = sniper ? 2.2 : rail ? 5.5 + tw.tier * 2.2 : 2.5;
      const reach = rail ? 950 + tw.tier * 280 : sniper ? 4200 : undefined;
      const dur = rail ? 0.22 + tw.tier * 0.04 : 0.1;
      for (const tgt of targets) this.beam(muzzle, tgt, dmg0, type, c.pierce, col, w, hit, { reach, dur });
      this.sfx(rail || kind === 'rail' ? 'rail' : 'laser', tw.x, tw.y);
      return;
    }
    if (shotNo % 3 === 0) this.sfx('fire', tw.x, tw.y);
    const tgt = targets[0];
    const special = c.specialRate && shotNo % Math.round(1 / c.specialRate) === 0;
    if (kind === 'glue') { this.fireAcid(tw, tgt, c, muzzle, dmg0, type, hit); return; }
    if (kind === 'melon') {
      this.projectiles.push(new Projectile({ kind, x: muzzle.x, y: muzzle.y, angle: 0, speed: 0, damage: dmg0, type: 'fire', pierce: 1, splash: c.splash, hit,
        lob: { tx: tgt.x + Math.cos(tgt.ang) * tgt.data.speed * 0.5, ty: tgt.y + Math.sin(tgt.ang) * tgt.data.speed * 0.5, dur: 0.75 } }));
      return;
    }
    const shots = c.shots ?? 1;
    const base = (tw.fixedAim ?? Math.atan2(tgt.y - muzzle.y, tgt.x - muzzle.x)) + (kind === 'boomerang' ? -0.8 : 0);
    // Skyranger: chin minigun (bullet) + rocket pods on T1+ (shell every 4th volley)
    const heliRocket = tw.data.id === 'unsc_heli' && tw.tier >= 1 && shotNo % 4 === 0;
    for (let i = 0; i < shots; i++) {
      const spread = shots > 1 ? (i - (shots - 1) / 2) * (kind === 'shuriken' ? 0.22 : kind === 'boomerang' ? 0.5 : heliRocket ? 0.12 : 0.16) : 0;
      const pk = special ? 'gpea' : heliRocket ? 'shell' : kind;
      this.projectiles.push(new Projectile({
        kind: pk, x: muzzle.x, y: muzzle.y, angle: base + spread, speed: (heliRocket ? (c.projectileSpeed ?? 600) * 0.75 : c.projectileSpeed ?? 600),
        damage: (special ? c.specialDamage ?? c.damage : c.damage) * (crit ? 2 : 1) * (heliRocket ? 1.6 : 1), type: special || heliRocket ? 'explosive' : type, pierce: heliRocket ? Math.max(2, c.pierce) : c.pierce,
        splash: special ? c.splash : heliRocket ? 36 + tw.tier * 10 : kind === 'magic' || kind === 'flak' ? c.splash : undefined, slow: c.slow,
        homing: kind === 'magic' ? tgt : null, scale: special ? 1.8 : heliRocket ? 1.5 : tw.data.id === 'arcane_obelisk' ? 2 : 1, hit,
        hitsAir: tw.data.hitsAir, hitsGround: tw.data.hitsGround,
      }));
    }
  }
  // ------------------------------------------------------------------ first-person possession (t37)
  /** Every tower / unit currently possessed (any player). */
  possessed(): (Tower | Unit | Enemy)[] { return [...this.towers.filter((t) => t.alive && t.manual), ...this.units.filter((u) => u.alive && u.manual), ...this.enemies.filter((e) => e.alive && e.manual)]; }
  /** Take (ctl) or release (null) manual control of one of YOUR towers / units. Networked in co-op (Sync G_METHODS). */
  possessCtl(o: Tower | Unit | Enemy, ctl: ManualCtl | null): boolean {
    if (!o || !o.alive) return false;
    const pid = this.actingPid ?? 0;
    if (ctl) {
      if (o instanceof Tower && !o.t.combat) return false;
      if (o.possessedBy >= 0 && o.possessedBy !== pid) return false;
      if (!o.manual) { this.stats.possessions++; this.bus.emit('possess', { on: true, pid }); }
      o.manual = { ...ctl, pid }; o.possessedBy = pid;
      if (o instanceof Unit) { o.squad.manual = true; }
    } else {
      o.manual = null; o.possessedBy = -1;
      if (o instanceof Unit) { o.squad.manual = false; o.squad.rally = { x: o.x, y: o.y }; }
    }
    return true;
  }
  /** Can a possessed troop stand here? Inside the map, off rocks/logs, towers and buildings. */
  walkable(x: number, y: number): boolean {
    if (x < 12 || y < 12 || x > this.map.width - 12 || y > this.map.height - 12) return false;
    if (this.overrun && this.isWaterAt(x, y)) return false; // t78: Overrun is fought on foot / wheels — no wading into the sea
    for (const o of this.obstacles) if (o.alive && (o.x - x) ** 2 + (o.y - y) ** 2 < 26 * 26) return false;
    for (const t of this.towers) if (t.alive && (t.x - x) ** 2 + (t.y - y) ** 2 < 20 * 20) return false;
    for (const b of this.buildings) if (b.alive && (b.x - x) ** 2 + (b.y - y) ** 2 < (b.isHQ ? 70 : 40) ** 2) return false;
    return true;
  }
  /** The first enemy along a top-down ray (manual hitscan / melee fallback). */
  private rayEnemy(from: Vec, ang: number, len: number, antiAir: boolean, pad = 4): Enemy | null {
    const to = { x: from.x + Math.cos(ang) * len, y: from.y + Math.sin(ang) * len };
    let best: Enemy | null = null, bd = Infinity;
    for (const e of this.enemies) if (e.alive && (!e.data.air || antiAir) && segDist(e, from, to) < e.data.radius + pad) { const d = dist2(e, from); if (d < bd) { bd = d; best = e; } }
    return best;
  }
  /** A possessed tower pulls the trigger: its own projectile / damage / rate, aimed by the player. */
  manualTowerFire(tw: Tower, c: CombatStats, shotNo: number) {
    const m = tw.manual!, range = tw.range(c.range), antiAir = !!tw.data.antiAir || (tw.data.hitsAir ?? true);
    let tgt = m.target && m.target.alive && dist(m.target, tw) <= range * 1.25 + m.target.data.radius ? m.target : null;
    if (!tgt && (tw.data.hitscan || c.chain || c.devour != null)) tgt = this.rayEnemy({ x: tw.x, y: tw.y }, m.aim, range * 1.1, antiAir, 10);
    this.stats.manualShots++;
    const direct = !!tgt && tgt === m.target;
    const c2: CombatStats = direct ? { ...c, damage: c.damage * MANUAL_BONUS, specialDamage: c.specialDamage != null ? c.specialDamage * MANUAL_BONUS : undefined } : c;
    if (!tgt) {
      const ex = tw.x + Math.cos(m.aim) * range, ey = tw.y + Math.sin(m.aim) * range;
      if (tw.data.hitscan || c.chain || c.devour != null) { this.fx({ kind: 'beam', x: tw.x, y: tw.y - 14, x2: ex, y2: ey, color: '#ffe08a', width: 2, dur: 0.08 }); this.sfx('laser', tw.x, tw.y); return; }
      // a free shot down the crosshair: fake 'target' at the aim point (projectiles fly on and can still hit)
      tgt = { x: ex, y: ey, ang: m.aim, alive: false, data: { speed: 0, boss: false, radius: 0 }, maxHp: Infinity } as unknown as Enemy;
    }
    if (direct) this.stats.manualHits++;
    this.towerFire(tw, [tgt], c2, shotNo);
  }
  /** A possessed troop fires its own weapon down the crosshair. */
  manualUnitAttack(u: Unit, t: UnitTier) {
    const m = u.manual!, w = t.weapon, range = u.range(this), antiAir = !!w.antiAir || !!w.hitsAir;
    let tgt = m.target && m.target.alive && dist(m.target, u) <= range * 1.3 + m.target.data.radius ? m.target : null;
    const direct = !!tgt;
    if (!tgt && (t.stats.range < 60 || w.hitscan)) tgt = this.rayEnemy(u, m.aim, Math.max(range, 40) * 1.1, antiAir, t.stats.range < 60 ? 18 : 8);
    this.stats.manualShots++;
    if (tgt) { if (direct) this.stats.manualHits++; this.unitAttack(u, tgt, t, direct ? MANUAL_BONUS : 1); return; }
    if (t.stats.range < 60) { this.fx({ kind: 'text', x: u.x + Math.cos(m.aim) * 20, y: u.y - 12, text: '⚔', color: '#fff', dur: 0.2 }); return; }
    const from = { x: u.x + u.facing * 8, y: u.y - 12 };
    if (w.hitscan) { this.fx({ kind: 'beam', x: from.x, y: from.y, x2: u.x + Math.cos(m.aim) * range, y2: u.y + Math.sin(m.aim) * range, color: '#ffe08a', width: 1.5, dur: 0.08 }); return; }
    const crit = Math.random() < 0.08, dmg = t.stats.damage * u.dmgMul * (crit ? 2 : 1) * (this.armory.has('servos') ? 1 + ARMORY_FX.servosDmg : 1);
    this.projectiles.push(new Projectile({ kind: w.projectile ?? 'bullet', x: u.x, y: u.y - 10, angle: m.aim, speed: 800, damage: dmg, type: w.type, pierce: 1, splash: w.splash, hitsAir: w.hitsAir,
      hit: { antiAir: !!w.antiAir, ap: !!w.armorPiercing || this.armory.has('ap'), src: u, crit } }));
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
  beam(from: Vec, tgt: Enemy, dmg: number, type: DamageType, pierce: number, color: string, width: number, hit?: HitOpts, opts?: { reach?: number; dur?: number; silent?: boolean }) {
    // hitscan: hit target + up to (pierce-1) enemies along the line (reach can exceed lock range for long rail streaks)
    const ang = Math.atan2(tgt.y - from.y, tgt.x - from.x);
    const len = Math.max(dist(from, tgt) + 40, opts?.reach ?? (dist(from, tgt) + 60));
    const ex = from.x + Math.cos(ang) * len, ey = from.y + Math.sin(ang) * len;
    const hits = this.enemies.filter((e) => e.alive && (!e.data.air || hit?.antiAir) && segDist(e, from, { x: ex, y: ey }) < e.data.radius + 4)
      .sort((a, b) => dist2(a, from) - dist2(b, from)).slice(0, pierce);
    if (!hits.includes(tgt) && tgt.alive) hits.unshift(tgt);
    for (const e of hits) e.takeDamage(this, dmg, type, from, hit);
    if (!opts?.silent && width > 0) this.fx({ kind: 'beam', x: from.x, y: from.y, x2: ex, y2: ey, color, width, dur: opts?.dur ?? 0.1 });
  }
  /** Versus host controller (cards, threat energy, spells, telegraphs, Boss Push); null otherwise. */
  versus: { update(g: Game, dt: number): void } | null = null;
  /** t78 Overrun (first-person PvEvP survival). Null in every other mode. */
  overrun: { update(g: Game, dt: number): void; stepMonster(g: Game, e: Enemy, dt: number): void; placeOk?(id: string, at: Vec): boolean; prey?(e: Enemy, aim: number): unknown } | null = null;
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
  /** t45: lingering acid puddles (Glue Slinger) - corrode + slow whatever crosses them, ticking every 0.5 s. */
  acidPools: { x: number; y: number; r: number; t: number; dur: number; dps: number; slow?: number; type: DamageType; hit?: HitOpts; acc: number }[] = [];
  acidPool(x: number, y: number, p: { r: number; dur: number; dps: number }, slow: number | undefined, type: DamageType, hit?: HitOpts) {
    if (this.acidPools.length > 40) this.acidPools.shift();
    this.acidPools.push({ x, y, r: p.r, t: 0, dur: p.dur, dps: p.dps, slow, type, hit: hit ? { ...hit, crit: false } : undefined, acc: 0 });
  }
  private tickPools(dt: number) {
    for (const p of this.acidPools) {
      p.t += dt; p.acc += dt; if (p.acc < 0.5) continue; p.acc -= 0.5;
      for (const e of this.enemies) if (e.alive && !e.data.air && dist2(e, p) <= (p.r + e.data.radius * 0.5) ** 2) {
        e.takeDamage(this, p.dps * 0.5, p.type, p, p.hit);
        if (p.slow && !e.data.boss) { e.slowAmt = Math.max(e.slowAmt, p.slow * 0.75); e.slowT = Math.max(e.slowT, 0.6); e.markSlow(this); }
      }
    }
    this.acidPools = this.acidPools.filter((p) => p.t < p.dur);
  }
  /** t45 Glue Slinger delivery per tier, matching the sprite: T1 slingshot-lobbed glass vial, T2 hand sprayer stream, T3 hazmat cannon canister. */
  private fireAcid(tw: Tower, tgt: Enemy, c: CombatStats, muzzle: Vec, dmg: number, type: DamageType, hit: HitOpts) {
    const d = Math.cos(tw.aim) >= 0 ? 1 : -1; muzzle = { x: tw.x + d * 22, y: tw.y - [42, 32, 30][tw.tier] }; // slingshot pouch / sprayer nozzle / cannon mouth on the sprite
    const lead = (s: number) => ({ x: tgt.x + Math.cos(tgt.ang) * tgt.data.speed * s, y: tgt.y + Math.sin(tgt.ang) * tgt.data.speed * s });
    const base = { x: muzzle.x, y: muzzle.y, angle: 0, speed: 0, damage: dmg, type, pierce: 1, splash: c.splash, slow: c.slow, hit, hitsAir: tw.data.hitsAir, hitsGround: tw.data.hitsGround };
    if (tw.tier === 0) { const p = lead(0.4); this.projectiles.push(new Projectile({ ...base, kind: 'acid_vial', lob: { tx: p.x, ty: p.y, dur: 0.55, arc: 70 }, pool: { r: (c.splash ?? 28) * 0.75, dur: 2, dps: dmg * 0.3 } })); return; }
    if (tw.tier === 1) {
      const a = Math.atan2(tgt.y - muzzle.y, tgt.x - muzzle.x), sp = c.projectileSpeed ?? 500;
      for (let i = 0; i < 3; i++) { const pr = new Projectile({ ...base, kind: 'acid_spray', angle: a + (i - 1) * 0.05, speed: sp * (1 - i * 0.07), damage: dmg / 3, pool: i === 0 ? { r: (c.splash ?? 40) * 0.6, dur: 2.5, dps: dmg * 0.3 } : undefined }); pr.life = (c.range * 1.25) / (sp * (1 - i * 0.07)); this.projectiles.push(pr); }
      return;
    }
    const p = lead(0.3); this.projectiles.push(new Projectile({ ...base, kind: 'acid_can', lob: { tx: p.x, ty: p.y, dur: 0.48, arc: 42 }, pool: { r: (c.splash ?? 60) * 0.8, dur: 3, dps: dmg * 0.3 } }));
  }
  splash(x: number, y: number, r: number, dmg: number, type: DamageType, from?: Vec, look: 'boom' | 'boom_fire' | 'acid' = 'boom', hit?: HitOpts, slow?: number) {
    if (type === 'explosive' || type === 'fire') r *= this.comboMul(x, y, r);
    for (const e of this.enemies) if (e.alive && dist2(e, { x, y }) <= (r + e.data.radius) ** 2) {
      e.takeDamage(this, dmg, type, from, hit);
      if (slow && !e.data.boss) { e.slowAmt = Math.max(e.slowAmt, slow); e.slowT = 1.6; e.markSlow(this); }
    }
    if (type === 'explosive' || type === 'fire') {
      this.blastTerrain(x, y, r, dmg);
      if (r >= 70) { this.shake(r / 14, true); this.shock(x, y, r * 1.4, 0.4); }
      if (r >= 45) this.sfx('explosion', x, y);
    }
    if (look === 'acid') { this.fx({ kind: 'dust', x, y, r, color: '#8fe03a', dur: 0.5 }); this.fx({ kind: 'ring', x, y, r, color: '#b6ff4a', dur: 0.4 }); }
    else this.fx({ kind: look, x, y, r, dur: 0.35 });
  }
  unitAttack(u: Unit, tgt: Enemy, t: UnitTier, mul = 1) {
    const w = t.weapon, crit = Math.random() < 0.08, dmg = mul * t.stats.damage * u.dmgMul * (crit ? 2 : 1) * (this.armory.has('servos') ? 1 + ARMORY_FX.servosDmg : 1);
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
  // ------------------------------------------------------------------ t56 free placement (BTD6 style)
  /** Collision radius of a tower's base (px). Big vehicles (3x3) are ~3x wider. */
  towerRadius(id: string) { return (towerById(id).footprint ?? 1) * this.grid.cell * 0.4; }
  /** Farms stay on the light internal grid so the Farmhand can pack them; everything else is free-placed. */
  gridKind(id: string) { return towerById(id).kind === 'farm'; }
  /** Open water (terrain below the water plane). Flat maps without terrain have no water pads. */
  isWaterAt(x: number, y: number) {
    const ter = this.map.terrain; if (!ter) return false;
    return groundH(this.map, x, y) < ter.water + 0.55;
  }
  /** Land cell within `r` px of open water (shoreline for Harbor Beacon). */
  nearWater(x: number, y: number, r = 36) {
    if (this.isWaterAt(x, y)) return true;
    for (let a = 0; a < 8; a++) {
      const nx = x + Math.cos(a * Math.PI / 4) * r, ny = y + Math.sin(a * Math.PI / 4) * r;
      if (this.isWaterAt(nx, ny)) return true;
    }
    return false;
  }
  /** Surface allowed by the tower's placeOn (default land; airborne defaults to air). */
  surfaceOk(id: string, x: number, y: number) {
    const d = towerById(id);
    const place = d.placeOn ?? (d.airborne ? 'air' : 'land');
    const water = this.isWaterAt(x, y), land = this.grid.isLandAt(x, y);
    if (place === 'land') return land;
    if (place === 'water') return water;
    if (place === 'air') return water || land;
    if (place === 'amphibious') return water || (land && this.nearWater(x, y));
    return land;
  }
  /** Is a tower of `id` allowed with its centre at (x, y)? */
  spotOk(id: string, x: number, y: number, ignore?: Tower): boolean {
    const R = this.towerRadius(id), m = this.map;
    if (x < R || y < R || x > m.width - R || y > m.height - R) return false;
    if (this.nearestLane({ x, y }).dist < m.pathWidth / 2 + R * 0.55) return false;
    const k = R * 0.7;
    for (const [sx, sy] of [[x, y], [x + k, y], [x - k, y], [x, y + k], [x, y - k]]) {
      if (!this.surfaceOk(id, sx, sy)) return false;
      const o = this.grid.occupant(...(Object.values(this.grid.worldToCell({ x: sx, y: sy })) as [number, number]));
      if (o && o !== ignore && o.alive && this.gridKind(o.data.id)) return false;
    }
    for (const t of this.towers) if (t.alive && t !== ignore && Math.hypot(t.x - x, t.y - y) < (R + this.towerRadius(t.data.id)) * 0.92) return false;
    for (const b of this.buildings) if (b.alive && Math.hypot(b.x - x, b.y - y) < R + (b.isHQ ? 110 : 50)) return false;
    for (const e of this.envs) if (Math.hypot(e.x - x, e.y - y) < R + 34) return false;
    return true;
  }
  /** Spot for the placement ghost / click: farms snap to the grid; others are free (nudged up to ~12px if just off). */
  placementSpot(id: string, p: Vec): Spot | null {
    const fp = towerById(id).footprint ?? 1;
    if (this.gridKind(id)) {
      const c = this.grid.snap(p, fp); if (!c) return null;
      const q = this.grid.cellCenter(c.c, c.r), R = this.towerRadius(id);
      return this.towers.some((t) => t.alive && !this.gridKind(t.data.id) && Math.hypot(t.x - q.x, t.y - q.y) < (R + this.towerRadius(t.data.id)) * 0.92) ? null : c;
    }
    const tryAt = (x: number, y: number): Spot | null => this.spotOk(id, x, y) ? { ...this.grid.worldToCell({ x, y }), x: Math.round(x), y: Math.round(y) } : null;
    const s = tryAt(p.x, p.y); if (s) return s;
    for (const d of [6, 12]) for (let a = 0; a < 8; a++) { const r = tryAt(p.x + Math.cos(a * Math.PI / 4) * d, p.y + Math.sin(a * Math.PI / 4) * d); if (r) return r; }
    return null;
  }
  /** Alive tower whose base is under p (free-placed towers aren't one-per-cell). */
  towerAt(p: Vec): Tower | null {
    let best: Tower | null = null, bd = Infinity;
    for (const t of this.towers) { if (!t.alive) continue; const d = Math.hypot(t.x - p.x, t.y - p.y); if (d < this.towerRadius(t.data.id) + 8 && d < bd) { bd = d; best = t; } }
    if (best) return best;
    const c = this.grid.worldToCell(p); return this.grid.occupant(c.c, c.r);
  }
  /** Validity of a spot (spot.x set = free placement; bare cell = legacy cell-centre). */
  private spotValid(id: string, s: Spot) {
    const fp = towerById(id).footprint ?? 1;
    if (this.gridKind(id)) return this.grid.fits(s.c, s.r, fp);
    const q = s.x !== undefined ? { x: s.x, y: s.y! } : this.grid.cellCenter(s.c, s.r);
    return this.spotOk(id, q.x, q.y) || (s.x === undefined && this.grid.fits(s.c, s.r, fp));
  }
  canPlace(id: string, cell: Spot | null) {
    if (this.overrun?.placeOk && cell) return !(cell as { bad?: boolean }).bad && this.spotValid(id, cell) && this.overrun.placeOk(id, cell.x !== undefined ? { x: cell.x, y: cell.y! } : this.grid.cellCenter(cell.c, cell.r));
    return !!cell && !(cell as { bad?: boolean }).bad && this.spotValid(id, cell) && this.res.canAfford({ credits: towerById(id).tiers[0].cost });
  }
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
  placeTower(id: string, cell: Spot): Tower | null {
    const data = towerById(id);
    if (data.kind === 'path') return null;
    const fp = data.footprint ?? 1;
    if (cell.x !== undefined) cell = { ...cell, ...this.grid.worldToCell({ x: cell.x, y: cell.y! }) };
    if (!this.spotValid(id, cell)) { const need = data.placeOn === 'water' ? 'open water' : data.placeOn === 'amphibious' ? 'shore or water' : data.placeOn === 'air' ? 'clear land or water' : 'clear ground'; if (fp > 1 || data.placeOn) this.toast(`${data.name} needs ${need}`, '#ff8a7a'); return null; }
    if (!this.res.spend({ credits: data.tiers[0].cost })) { this.toast('Not enough credits', '#ff8a7a'); return null; }
    const t = new Tower(data, cell, this);
    t.owner = this.actingPid;
    this.occupyTower(t);
    this.towers.push(t); this.losVer++;
    if (data.fixedLane) {
      const nl = this.nearestLane(t), q = this.paths[nl.lane].at(nl.d);
      t.fixedAim = t.aim = Math.atan2(q.y - t.y, q.x - t.x);
      if (nl.dist < 20) t.fixedAim = t.aim = q.ang + Math.PI;
    }
    this.sfx('command');
    this.fx({ kind: 'dust', x: t.x, y: t.y + 16, r: 26, color: '#e8d8b0', dur: 0.4 });
    return t;
  }
  /** Grid kinds hold their n x n cells; free towers hold the free cells under their base circle. */
  occupyTower(t: Tower) {
    const fp = t.data.footprint ?? 1;
    if (this.gridKind(t.data.id)) { for (const q of this.grid.area(t.cell.c, t.cell.r, fp)) if (this.grid.isFree(q.c, q.r)) this.grid.occupy(t, q.c, q.r); }
    else this.grid.occupyCircle(t, t.x, t.y, this.towerRadius(t.data.id) * 0.9);
  }
  sellTower(t: Tower) {
    if (!t.alive) return;
    this.res.add(t.sellValue);
    this.grid.releaseOwner(t);
    t.remove();
    this.towers = this.towers.filter((x) => x !== t); this.losVer++;
    this.fx({ kind: 'text', x: t.x, y: t.y - 20, text: `+${t.sellValue}`, color: '#ffe14d', dur: 1 });
  }
  /** Relocate a movable vehicle (tank / gunship). Cancels auto-chase until it arrives. */
  moveTower(t: Tower, at: Vec): boolean {
    if (!t.alive || !t.data.movable || t.disabled) return false;
    if (!this.spotOk(t.data.id, at.x, at.y, t)) { this.toast(`Can't move ${t.data.name} there`, '#ff8a7a'); this.sfx('error'); return false; }
    t.orderMove(at.x, at.y);
    this.sfx('command');
    this.fx({ kind: 'ring', x: at.x, y: at.y, r: 28, color: '#7fd3ff', dur: 0.45 });
    return true;
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
  /** t36: every player starts with ONE free Sprout Farmhand collector beside their HQ
   *  (host / solo only; clients receive it in the snapshot). */
  spawnFreeCollector(pid = 0): Squad | null {
    if (this.isClient) return null;
    if (this.squads.some((s) => s.alive && s.data.id === 'farmhand' && (this.net === 'solo' || s.owner === pid))) return null;
    const prev = this.actingPid; this.actingPid = pid;
    const sq = this.spawnSquad(unitById('farmhand'), { x: this.hq.x - 150 + pid * 45, y: this.hq.y + 95 - pid * 20 }, false);
    this.actingPid = prev;
    this.stats.freeCollectors++;
    return sq;
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
    if (!ws.length) { this.toast('Your Sprout Farmhand is busy or missing'); return false; }
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
    if (this.paused !== this.wasPaused) { this.wasPaused = this.paused; this.resetShake(); }
    if (this.paused || this.state !== 'playing') { this.updateEffects(dtReal); return; }
    if (this.speed !== 1 && (this.overrun || this.towers.some((t) => t.manual) || this.units.some((u) => u.manual))) this.speed = 1; // possession forces 1x
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
    if (!this.isClient && !this.overrun) this.waves.update(this, dt);
    this.versus?.update(this, dt);
    this.overrun?.update(this, dt);
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
    this.tickPools(dt);
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
  /** Exponential, real-time shake decay (dt is unscaled frame time, so 4x speed or a slow
   *  tab can't keep it alive). */
  private decayShake(dtReal: number) {
    const dt = Number.isFinite(dtReal) && dtReal > 0 ? Math.min(0.25, dtReal) : 0;
    this.realT += dt;
    if (this.shakeCool > 0) this.shakeCool = Math.max(0, this.shakeCool - dt);
    if (this.shakeAmt > 0) {
      this.shakeRun += dt;
      this.shakeAmt *= Math.exp(-SHAKE_DECAY * dt);
      if (this.shakeRun > SHAKE_MAX_RUN) { this.shakeCool = 0.8; this.shakeRun = 0; this.shakeAmt *= 0.5; }
      if (this.shakeAmt < 0.25) { this.shakeAmt = 0; this.shakeRun = 0; }
    } else this.shakeRun = 0;
  }
  private updateEffects(dt: number) {
    for (const e of this.effects) e.t! += dt;
    this.effects = this.effects.filter((e) => e.t! < e.dur);
    for (const [k, e] of this.dmgAgg) if (e.t! >= DMG_AGG_WINDOW || e.t! >= e.dur) this.dmgAgg.delete(k);
    let n = 0; for (const e of this.effects) if (e.kind === 'dmg') n++;
    this.dmgLive = n;
    this.decayShake(dt);
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
