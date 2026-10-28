// =============================================================================
// GARRISONS + MAP OBJECTS
//  Garrisonable: anything troops can enter (cover towers, stone walls, combat
//  towers (1 slot), and neutral map structures: bunker / watchtower / ruins).
//  Garrisoned troops take less projectile damage (protect) and gain range.
//  Obstacle: destructible rocks / fallen logs blocking build cells; explosive
//  splash, Cherry Pods and the MAC clear them and free the cells.
//  Barrier: path objects (Wall-Nut blocker, Cherry Bomb pod) placed ON the road.
// =============================================================================
import { nextId } from '../core/math';
import type { TowerData, Vec } from '../core/types';
import type { Cell } from '../systems/PlacementSystem';
import type { Game } from '../game/Game';
import type { Unit } from './Unit';

export interface Garrisonable {
  uid: number; x: number; y: number; alive: boolean;
  garrisoned: Unit[];
  gName(): string;
  gSlots(): number;
  /** Damage reduction for troops inside (0..1). */
  gProtect(): number;
  /** Range bonus for troops inside. */
  gRange(): number;
  gOpen(): boolean;
}
export const gFree = (s: Garrisonable) => s.gSlots() - s.garrisoned.length;
export function gEnter(s: Garrisonable, u: Unit): boolean {
  if (gFree(s) <= 0 || !s.gOpen() || u.garrison || u.isWorker || u.data.vehicle) return false;
  s.garrisoned.push(u); u.garrison = s;
  return true;
}
export function gLeave(s: Garrisonable, u: Unit) {
  s.garrisoned = s.garrisoned.filter((x) => x !== u);
  if (u.garrison === s) { u.y += 30; u.garrison = null; }
}
export function gEject(s: Garrisonable) { for (const u of [...s.garrisoned]) gLeave(s, u); }

export type EnvKind = 'bunker' | 'watchtower' | 'ruins' | 'garita';
const ENV_INFO: Record<EnvKind, { name: string; slots: number; sprite: string }> = {
  bunker: { name: 'Old Bunker', slots: 4, sprite: 'env_bunker' },
  watchtower: { name: 'Stone Watchtower', slots: 2, sprite: 'env_watchtower' },
  ruins: { name: 'Ruins', slots: 3, sprite: 'env_ruins' },
  garita: { name: 'Garita (El Morro Sentry Box)', slots: 2, sprite: 'env_garita' },
};
/** Neutral map structure: +35% range, -50% projectile damage for troops inside. */
export class EnvStructure implements Garrisonable {
  readonly uid = nextId();
  alive = true;
  garrisoned: Unit[] = [];
  cells: Cell[] = [];
  constructor(readonly kind: EnvKind, public x: number, public y: number) {}
  get sprite() { return ENV_INFO[this.kind].sprite; }
  gName() { return ENV_INFO[this.kind].name; }
  gSlots() { return ENV_INFO[this.kind].slots; }
  gProtect() { return 0.5; }
  gRange() { return 0.35; }
  gOpen() { return true; }
  update() { this.garrisoned = this.garrisoned.filter((u) => u.alive); }
}

export class Obstacle {
  readonly uid = nextId();
  alive = true;
  hp: number; readonly maxHp: number;
  cells: Cell[] = [];
  hitFlash = 0;
  /** Set when this obstacle chokes a blocked shortcut trail. */
  shortcut: import('../systems/Shortcuts').Shortcut | null = null;
  constructor(readonly kind: 'rock' | 'log', public x: number, public y: number, public ang = 0, hp?: number) { this.hp = this.maxHp = hp ?? (kind === 'rock' ? 140 : 90); }
  get sprite() { return this.kind === 'rock' ? 'obs_rock' : 'obs_log'; }
  /** Only explosive / fire blasts and the MAC can clear terrain. A shortcut
   *  rockslide only yields to big blasts (MAC / pods / Cherry) or Demolish,
   *  so opening it is always a deliberate choice. */
  blast(g: Game, n: number) {
    if (!this.alive || g.isClient) return;
    if (this.shortcut && n < 999) { if (Math.random() < 0.05) g.fx({ kind: 'text', x: this.x, y: this.y - 40, text: 'too solid — MAC or Demolish', color: '#d8c8a8', dur: 0.8 }); return; }
    this.hp -= n; this.hitFlash = 0.1;
    if (this.hp <= 0) g.clearObstacle(this);
  }
}

export class Barrier {
  readonly uid = nextId();
  alive = true;
  hp: number; readonly maxHp: number;
  readonly garrison = null;
  dropT = 0;
  fuse = -1;
  hitFlash = 0;
  constructor(readonly data: TowerData, public x: number, public y: number, readonly lane: number) {
    const b = data.tiers[0].barrier!;
    this.hp = this.maxHp = b.hp;
  }
  get b() { return this.data.tiers[0].barrier!; }
  get blockCap() { return this.b.blockCap; }
  get isPod() { return !!this.b.blast; }
  owner = 0;
  takeDamage(g: Game, n: number) {
    if (!this.alive || g.isClient) return;
    this.hp -= n; this.hitFlash = 0.08;
    if (this.hp <= 0) { if (this.isPod) this.detonate(g); else { this.alive = false; g.fx({ kind: 'splat', x: this.x, y: this.y, r: 30, color: '#b5823d', dur: 0.4 }); g.toast('Wall-Nut barrier broke!', '#ffb35a'); } }
  }
  update(g: Game, dt: number) {
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    if (!this.isPod || g.isClient) return;
    if (this.fuse < 0) {
      for (const e of g.enemies) if (e.alive && !e.data.air && (e.x - this.x) ** 2 + (e.y - this.y) ** 2 < 60 * 60) { this.fuse = 0.7; g.sfx('fuse'); break; }
    } else { this.fuse -= dt; if (this.fuse <= 0) this.detonate(g); }
  }
  detonate(g: Game) {
    if (!this.alive) return;
    this.alive = false;
    const b = this.b;
    g.bigBlast(this.x, this.y, b.blastRadius!, b.blast!, 'fire', { ap: true });
  }
}

/** Helper: point at a given fraction along a lane, offset sideways. */
export function laneOffset(g: Game, lane: number, frac: number, side: number): Vec {
  const ps = g.paths[lane], p = ps.at(ps.length * frac);
  return { x: p.x - Math.sin(p.ang) * side, y: p.y + Math.cos(p.ang) * side };
}
