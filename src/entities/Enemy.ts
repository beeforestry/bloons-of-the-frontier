// =============================================================================
// ENEMY: one class for bloons and hive bugs, behaviour driven by EnemyData.
//  - Bloons: layered. A popped layer DOWNGRADES IN PLACE to its child (same
//    uid, position and path progress), pays that layer's reward, and the
//    excess damage carries into the next layer. Multi-child bloons (lead,
//    ceramic, MOAB) also release extra siblings. Lead ignores Sharp, MOAB is a
//    boss blimp. Flying: can't be blocked.
//  - Bugs: ground; blocked & fought by troops. Scavengers swarm (free-roam
//    toward nearby troops), Hunters leap, Chargers have front armor, Brood Sacs
//    spawn Scavengers, Bile Titans lob acid at towers/troops.
// =============================================================================
import type { DamageType, EnemyData, HitOpts, Vec } from '../core/types';
import { nextId, rand, dist } from '../core/math';
import { ENEMIES, totalLeak, totalStrength } from '../data/enemies';
import type { Game } from '../game/Game';
/** Anything that can physically hold a ground enemy (troops, Wall-Nut barriers). */
export interface Blocker { x: number; y: number; alive: boolean; garrison: unknown; takeDamage(g: Game, n: number): void }

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
  blockedBy: Blocker | null = null;
  /** Ironback plating left (0..1 damage reduction). Corroded by glue / arcane. */
  armor: number;
  shield: number; readonly maxShield: number; shieldDown = false; private shieldIdle = 0;
  /** EMP / Hijack stun. */
  stunT = 0;
  /** Last unit that hit this enemy (veterancy XP on kill). */
  lastSrc: HitOpts['src'] = null;
  hitFlash = 0;
  private leapT: number; leapAnim: { from: number; to: number; t: number } | null = null;
  private spawnT: number; private acidT: number;
  private divert = 0;
  strengthOfChildren: number;
  maxHp: number;
  /** Wave HP scaling, kept across layer downgrades. */
  readonly hpMul: number;
  /** Layers popped off this bloon so far. */
  layersPopped = 0;
  /** Old path this enemy keeps following when a shortcut opens behind it (else g.paths[lane]). */
  route: import('../systems/PathSystem').PathSystem | null = null;
  /** Bug parked at the HQ gate, mauling the base. */
  atBase = false;
  /** Which lane (Game.paths index) this enemy follows. */
  lane: number;
  pathLen = 1;

  constructor(public data: EnemyData, progress: number, lateral = 0, lane = 0, hpMul = 1) {
    this.hpMul = hpMul;
    this.hp = this.maxHp = Math.max(1, Math.round(data.hp * hpMul));
    this.armor = data.armored ?? 0;
    this.shield = this.maxShield = Math.round((data.shield ?? 0) * hpMul);
    this.lane = lane;
    this.progress = progress;
    this.lateral = lateral || (data.swarm ? rand(-data.swarm, data.swarm) : 0);
    this.leapT = data.leap ? data.leap.every * rand(0.5, 1) : 0;
    this.spawnT = data.spawns?.every ?? 0;
    this.acidT = data.acid ? data.acid.every * 0.6 : 0;
    this.strengthOfChildren = data.children ? data.children.count * totalStrength(data.children.id) : 0;
  }
  get strength() { return this.hp + this.shield + this.strengthOfChildren; }
  /** EMP: strips the energy shield for good, stuns heavies. */
  emp(g: Game, stun: number) {
    if (!this.alive) return;
    if (this.maxShield > 0 && !this.shieldDown) { this.shield = 0; this.shieldDown = true; g.fx({ kind: 'ring', x: this.x, y: this.y, r: 34, color: '#7fe8ff', dur: 0.4 }); g.fx({ kind: 'text', x: this.x, y: this.y - 30, text: 'SHIELD DOWN', color: '#7fe8ff', dur: 0.8 }); }
    if (this.data.heavy || this.data.armored || this.data.shield) this.stunT = Math.max(this.stunT, stun);
  }
  /** Distance left to the HQ: comparable across lanes of different lengths (First/Last targeting). */
  get remaining() { return this.pathLen - this.progress; }
  /** MAC Blast knockback. */
  knockback(d: number) { if (!this.alive) return; this.progress = Math.max(0, this.progress - d); this.atBase = false; this.blockedBy = null; this.leapAnim = null; }

  update(g: Game, dt: number) {
    const d = this.data;
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    if (this.slowT > 0) { this.slowT -= dt; if (this.slowT <= 0) this.slowAmt = 0; }
    if (this.maxShield > 0 && !this.shieldDown && this.shield < this.maxShield) { this.shieldIdle += dt; if (this.shieldIdle > 4) this.shield = Math.min(this.maxShield, this.shield + 10 * dt); }
    const path = this.route ?? g.paths[this.lane] ?? g.path; this.pathLen = path.length;
    if (this.stunT > 0) { this.stunT -= dt; return; }
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
        for (let i = 0; i < d.spawns.count; i++) g.spawnEnemy(d.spawns.id, Math.max(0, this.progress - 10 - i * 8), 0, this.lane);
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
    } else if (this.atBase) {
      // bugs that reach the gate maul the HQ until killed
      g.damageHQ((d.meleeDps ?? 0) * 0.25 * dt, this);
      if (Math.random() < dt * 1.5) g.fx({ kind: 'text', x: this.x, y: this.y - 20, text: '⚔', color: '#ff8a7a', dur: 0.3 });
    } else {
      this.progress += d.speed * speedMul * dt;
      if (d.boss && d.family === 'bug' && d.meleeDps) g.stompUnits(this, d.meleeDps * dt);
    }
    // swarm free-roam: scavengers veer toward nearby troops, then rejoin the path
    if (d.swarm && d.swarm > 10 && !this.blockedBy) {
      const u = g.nearestTroop(this, 80);
      if (u) {
        const p = path.at(this.progress), nx = -Math.sin(p.ang), ny = Math.cos(p.ang);
        const side = (u.x - p.x) * nx + (u.y - p.y) * ny;
        this.divert += Math.sign(side) * 60 * dt;
        this.divert = Math.max(-36, Math.min(36, this.divert));
      } else this.divert *= 1 - Math.min(1, dt * 1.5);
    }
    this.phase += dt * 6;
    const p = path.at(this.progress);
    const wob = d.swarm ? Math.sin(this.phase) * Math.min(4, d.swarm * 0.25) : 0;
    const off = this.lateral + wob + this.divert;
    this.x = p.x - Math.sin(p.ang) * off;
    this.y = p.y + Math.cos(p.ang) * off;
    if (this.leapAnim) this.y -= Math.sin(Math.min(1, this.leapAnim.t) * Math.PI) * 30;
    this.ang = p.ang;
    if (this.progress >= path.length - (d.family === 'bug' && d.meleeDps ? 6 + (this.uid % 5) * 8 : 0)) {
      if (d.family === 'bug' && d.meleeDps) { this.atBase = true; this.progress = Math.min(this.progress, path.length - 6); }
      else { this.alive = false; g.leak(this, totalLeak(d.id)); }
    }
  }

  /** Apply damage; returns damage actually dealt. `from` is used for Charger front armor. */
  takeDamage(g: Game, amount: number, type: DamageType, from?: Vec, hit?: HitOpts): number {
    if (!this.alive || amount <= 0) return 0;
    const d = this.data;
    if (d.air && !hit?.antiAir) return 0;
    if (hit?.src) this.lastSrc = hit.src;
    // energy shield soaks everything first (arcane shieldBreak multiplies)
    if (this.shield > 0) {
      this.shieldIdle = 0;
      const sb = hit?.shieldBreak ?? 1, take = Math.min(this.shield, amount * sb);
      this.shield -= take; amount -= take / sb; this.hitFlash = 0.08;
      g.dmgNumber(this.x, this.y - d.size * 0.4, take, '#7fe8ff', false, this.uid);
      if (this.shield <= 0) { this.shieldDown = true; g.fx({ kind: 'pop', x: this.x, y: this.y, r: d.size * 0.6, color: '#7fe8ff', dur: 0.35 }); g.sfx('pop'); }
      if (amount <= 0.001) return take;
    }
    if (this.armor > 0) {
      if (hit?.shred) this.armor = Math.max(0, this.armor - hit.shred);
      const pierces = hit?.ap || type === 'explosive';
      if (!pierces) { amount *= 1 - this.armor; if (Math.random() < 0.06) g.fx({ kind: 'text', x: this.x, y: this.y - 28, text: 'PLATED', color: '#c9d1dc', dur: 0.5 }); }
    }
    if (d.lead && type === 'sharp') { g.fx({ kind: 'text', x: this.x, y: this.y - 16, text: 'clink', color: '#c9d1dc', dur: 0.5 }); return 0; }
    if (d.frontArmor && from && type !== 'explosive') {
      const fx = from.x - this.x, fy = from.y - this.y, L = Math.hypot(fx, fy) || 1;
      const dot = (fx / L) * Math.cos(this.ang) + (fy / L) * Math.sin(this.ang);
      if (dot > 0.35) { amount *= 0.25; if (Math.random() < 0.15) g.fx({ kind: 'text', x: this.x, y: this.y - 24, text: 'armored!', color: '#ffb35a', dur: 0.5 }); }
    }
    this.hitFlash = 0.08;
    const dealt = Math.min(this.hp, amount);
    g.dmgNumber(this.x, this.y - d.size * 0.4, amount, hit?.crit ? '#ffe14d' : '#ffffff', hit?.crit, this.uid);
    this.hp -= amount;
    if (this.hp <= 0) this.popLayers(g, -this.hp);
    return dealt;
  }

  /** The bloon this layer downgrades into (null for red bloons and bugs). */
  private get childLayer(): EnemyData | null {
    const c = this.data.family === 'bloon' ? this.data.children : undefined;
    return c ? ENEMIES[c.id] : null;
  }
  /** Become another enemy type in place (keeps uid, lane, progress, slow/stun). */
  setType(next: EnemyData) {
    this.data = next;
    this.maxHp = this.hp = Math.max(1, Math.round(next.hp * this.hpMul));
    this.armor = next.armored ?? 0;
    this.strengthOfChildren = next.children ? next.children.count * totalStrength(next.children.id) : 0;
  }
  /**
   * Layer pop loop (fixes for the pasted model): reward is paid once PER LAYER
   * popped (not per hit), overflow carries into the next layer, and the chain
   * always terminates (pink -> yellow -> green -> blue -> red -> gone).
   */
  private popLayers(g: Game, overflow: number) {
    let over = overflow;
    for (let guard = 0; guard < 16; guard++) {
      const child = this.childLayer;
      if (!child) { this.die(g, over); return; }
      const d = this.data, count = d.children!.count;
      this.reward(g, d);
      this.layersPopped++;
      // extra siblings (lead / ceramic / MOAB hold more than one bloon)
      for (let i = 1; i < count; i++) {
        const e = g.spawnEnemy(child.id, Math.max(0, this.progress - i * 10), this.lateral + (i - (count - 1) / 2) * 10, this.lane, this.hpMul);
        e.route = this.route;
      }
      this.setType(child);
      this.hitFlash = 0.12;
      this.hp -= over;
      if (this.hp > 0) return;
      over = -this.hp;
    }
    this.die(g, 0);
  }
  /** Bounty / kill / XP / scrap / pop fx for one popped layer. */
  private reward(g: Game, d: EnemyData) {
    g.res.add(d.bounty);
    g.stats.kills++;
    g.stats.layers = (g.stats.layers ?? 0) + 1;
    this.lastSrc?.addXp?.(d.boss ? 10 : d.heavy ? 3 : 1);
    if (d.scrap) g.spawnPickup(this.x + rand(-8, 8), this.y + rand(-8, 8), d.scrap, 'scrap');
    g.sfx(d.family === 'bloon' ? 'pop' : 'splat');
    g.fx({ kind: d.family === 'bloon' ? 'pop' : 'splat', x: this.x, y: this.y, r: d.size * 0.5, color: d.color, dur: d.boss ? 0.7 : 0.3 });
    if (d.dropChance && Math.random() < d.dropChance) g.spawnPickup(this.x, this.y, d.boss ? 60 : 10 + Math.round(d.bounty));
  }

  private die(g: Game, overflow: number) {
    const d = this.data;
    this.alive = false;
    this.reward(g, d);
    if (d.children) { // bugs (Bile Titan) burst into separate children
      const child = ENEMIES[d.children.id];
      for (let i = 0; i < d.children.count; i++) {
        const e = g.spawnEnemy(child.id, Math.max(0, this.progress - i * 10), d.family === 'bloon' ? (i - (d.children.count - 1) / 2) * 10 : 0, this.lane, this.maxHp / Math.max(1, d.hp));
        e.route = this.route;
        if (i === 0 && overflow > 0 && d.family === 'bloon') e.takeDamage(g, overflow, 'magic');
      }
    }
  }
}
