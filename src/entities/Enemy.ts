// =============================================================================
// ENEMY: one class for bloons and hive bugs, behaviour driven by EnemyData.
//  - Bloons: layered (popping spawns children, overflow damage carries over),
//    Lead ignores Sharp, MOAB is a boss blimp. Flying: can't be blocked.
//  - Bugs: ground; blocked & fought by troops. Scavengers swarm (free-roam
//    toward nearby troops), Hunters leap, Chargers have front armor, Brood Sacs
//    spawn Scavengers, Bile Titans lob acid at towers/troops.
// =============================================================================
import type { DamageType, EnemyData, Vec } from '../core/types';
import { nextId, rand, dist } from '../core/math';
import { ENEMIES, totalLeak, totalStrength } from '../data/enemies';
import type { Game } from '../game/Game';
import type { Unit } from './Unit';

export class Enemy {
  readonly uid = nextId();
  hp: number;
  x = 0; y = 0; ang = 0;
  alive = true;
  targetable = true;
  /** Arc-length distance along the path (drives First/Last targeting). */
  progress: number;
  lateral: number;
  private phase = Math.random() * 10;
  slowT = 0; slowAmt = 0;
  blockedBy: Unit | null = null;
  hitFlash = 0;
  private leapT: number; leapAnim: { from: number; to: number; t: number } | null = null;
  private spawnT: number; private acidT: number;
  private divert = 0;
  readonly strengthOfChildren: number;

  constructor(readonly data: EnemyData, progress: number, lateral = 0) {
    this.hp = data.hp;
    this.progress = progress;
    this.lateral = lateral || (data.swarm ? rand(-data.swarm, data.swarm) : 0);
    this.leapT = data.leap ? data.leap.every * rand(0.5, 1) : 0;
    this.spawnT = data.spawns?.every ?? 0;
    this.acidT = data.acid ? data.acid.every * 0.6 : 0;
    this.strengthOfChildren = data.children ? data.children.count * totalStrength(data.children.id) : 0;
  }
  get strength() { return this.hp + this.strengthOfChildren; }

  update(g: Game, dt: number) {
    const d = this.data;
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    if (this.slowT > 0) { this.slowT -= dt; if (this.slowT <= 0) this.slowAmt = 0; }
    const speedMul = 1 - this.slowAmt;

    // --- blocking by troops (ground only; Bile Titans stomp through)
    if (!d.flying && !this.leapAnim) {
      if (this.blockedBy && (!this.blockedBy.alive || this.blockedBy.garrison || dist(this.blockedBy, this) > 46)) this.blockedBy = null;
      if (!this.blockedBy && !(d.boss && d.family === 'bug')) this.blockedBy = g.findBlocker(this);
    }

    // --- special behaviours
    if (d.leap && !this.leapAnim) {
      this.leapT -= dt;
      if (this.leapT <= 0) {
        this.leapT = d.leap.every;
        this.leapAnim = { from: this.progress, to: this.progress + d.leap.distance, t: 0 };
        this.blockedBy = null;
      }
    }
    if (d.spawns) {
      this.spawnT -= dt;
      if (this.spawnT <= 0) {
        this.spawnT = d.spawns.every;
        for (let i = 0; i < d.spawns.count; i++) g.spawnEnemy(d.spawns.id, Math.max(0, this.progress - 10 - i * 8));
        g.fx({ kind: 'ring', x: this.x, y: this.y, r: 30, color: '#e8c35a', dur: 0.4 });
      }
    }
    if (d.acid) {
      this.acidT -= dt;
      if (this.acidT <= 0) {
        const tgt = g.nearestFriendly(this, d.acid.range);
        if (tgt) { this.acidT = d.acid.every; g.lobAcid(this, tgt, d.acid.damage); } else this.acidT = 0.5;
      }
    }

    // --- movement
    if (this.leapAnim) {
      const L = this.leapAnim;
      L.t += dt / 0.45;
      this.progress = L.from + (L.to - L.from) * Math.min(1, L.t);
      if (L.t >= 1) this.leapAnim = null;
    } else if (this.blockedBy) {
      // melee the blocker
      this.blockedBy.takeDamage(g, (d.meleeDps ?? 0) * dt);
    } else {
      this.progress += d.speed * speedMul * dt;
      if (d.boss && d.family === 'bug' && d.meleeDps) g.stompUnits(this, d.meleeDps * dt);
    }
    // swarm free-roam: scavengers veer toward nearby troops, then rejoin the path
    if (d.swarm && d.swarm > 10 && !this.blockedBy) {
      const u = g.nearestTroop(this, 80);
      if (u) {
        const p = g.path.at(this.progress), nx = -Math.sin(p.ang), ny = Math.cos(p.ang);
        const side = (u.x - p.x) * nx + (u.y - p.y) * ny;
        this.divert += Math.sign(side) * 60 * dt;
        this.divert = Math.max(-36, Math.min(36, this.divert));
      } else this.divert *= 1 - Math.min(1, dt * 1.5);
    }
    this.phase += dt * 6;
    const p = g.path.at(this.progress);
    const wob = d.swarm ? Math.sin(this.phase) * Math.min(4, d.swarm * 0.25) : 0;
    const off = this.lateral + wob + this.divert;
    this.x = p.x - Math.sin(p.ang) * off;
    this.y = p.y + Math.cos(p.ang) * off;
    if (this.leapAnim) this.y -= Math.sin(Math.min(1, this.leapAnim.t) * Math.PI) * 30;
    this.ang = p.ang;
    if (this.progress >= g.path.length) {
      this.alive = false;
      g.leak(this, totalLeak(d.id));
    }
  }

  /** Apply damage; returns damage actually dealt. `from` is used for Charger front armor. */
  takeDamage(g: Game, amount: number, type: DamageType, from?: Vec): number {
    if (!this.alive || amount <= 0) return 0;
    const d = this.data;
    if (d.lead && type === 'sharp') { g.fx({ kind: 'text', x: this.x, y: this.y - 16, text: 'clink', color: '#c9d1dc', dur: 0.5 }); return 0; }
    if (d.frontArmor && from && type !== 'explosive') {
      const fx = from.x - this.x, fy = from.y - this.y, L = Math.hypot(fx, fy) || 1;
      const dot = (fx / L) * Math.cos(this.ang) + (fy / L) * Math.sin(this.ang);
      if (dot > 0.35) { amount *= 0.25; if (Math.random() < 0.15) g.fx({ kind: 'text', x: this.x, y: this.y - 24, text: 'armored!', color: '#ffb35a', dur: 0.5 }); }
    }
    this.hitFlash = 0.08;
    const dealt = Math.min(this.hp, amount);
    this.hp -= amount;
    if (this.hp <= 0) this.die(g, -this.hp);
    return dealt;
  }

  private die(g: Game, overflow: number) {
    const d = this.data;
    this.alive = false;
    g.res.add(d.bounty);
    g.stats.kills++;
    g.fx({ kind: d.family === 'bloon' ? 'pop' : 'splat', x: this.x, y: this.y, r: d.size * 0.5, color: d.color, dur: d.boss ? 0.7 : 0.3 });
    if (d.dropChance && Math.random() < d.dropChance) g.spawnPickup(this.x, this.y, d.boss ? 60 : 10 + Math.round(d.bounty));
    if (d.children) {
      const child = ENEMIES[d.children.id];
      for (let i = 0; i < d.children.count; i++) {
        const e = g.spawnEnemy(child.id, Math.max(0, this.progress - i * 10), d.family === 'bloon' ? (i - (d.children.count - 1) / 2) * 10 : 0);
        if (i === 0 && overflow > 0 && d.family === 'bloon') e.takeDamage(g, overflow, 'magic');
      }
    }
  }
}
