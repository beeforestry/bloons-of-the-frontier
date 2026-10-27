// Travelling projectiles (darts, peas, shurikens, homing magic, lobbed melons, acid).
import type { DamageType, HitOpts, ProjectileKind } from '../core/types';
import { canHit } from '../systems/TargetingSystem';
import { dist2 } from '../core/math';
import type { Game } from '../game/Game';
import type { Enemy } from './Enemy';

export interface ProjectileOpts {
  kind: ProjectileKind; x: number; y: number; angle: number; speed: number; damage: number; type: DamageType;
  pierce: number; splash?: number; slow?: number; homing?: Enemy | null; lob?: { tx: number; ty: number; dur: number };
  hitsAir?: boolean; hitsGround?: boolean; scale?: number; hit?: HitOpts;
}

export class Projectile {
  x: number; y: number; vx: number; vy: number; angle: number;
  alive = true; life = 2.2; spin = 0;
  private hit = new Set<Enemy>();
  private pierce: number;
  private lobT = 0; private sx: number; private sy: number;
  readonly origin: { x: number; y: number };
  constructor(readonly o: ProjectileOpts) {
    this.x = this.sx = o.x; this.y = this.sy = o.y; this.angle = o.angle;
    this.vx = Math.cos(o.angle) * o.speed; this.vy = Math.sin(o.angle) * o.speed;
    this.pierce = o.pierce;
    this.origin = { x: o.x, y: o.y };
  }
  /** Height above ground for lobbed shots (render offset). */
  height = 0;
  update(g: Game, dt: number) {
    this.life -= dt;
    this.spin += dt * 14;
    if (this.life <= 0) { this.alive = false; return; }
    const o = this.o;
    if (o.lob) {
      this.lobT += dt / o.lob.dur;
      const t = Math.min(1, this.lobT);
      this.x = this.sx + (o.lob.tx - this.sx) * t; this.y = this.sy + (o.lob.ty - this.sy) * t;
      this.height = Math.sin(t * Math.PI) * 90;
      if (t >= 1) { this.alive = false; g.splash(this.x, this.y, o.splash ?? 40, o.damage, o.type, this.origin, o.kind === 'melon' ? 'boom_fire' : 'boom', o.hit, o.slow); }
      return;
    }
    if (o.homing && o.homing.alive) {
      const want = Math.atan2(o.homing.y - this.y, o.homing.x - this.x);
      let d = want - this.angle;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      this.angle += Math.max(-8 * dt, Math.min(8 * dt, d));
      this.vx = Math.cos(this.angle) * o.speed; this.vy = Math.sin(this.angle) * o.speed;
    }
    this.x += this.vx * dt; this.y += this.vy * dt;
    if (this.x < -50 || this.y < -50 || this.x > g.map.width + 50 || this.y > g.map.height + 50) { this.alive = false; return; }
    for (const e of g.enemies) {
      if (!e.alive || this.hit.has(e)) continue;
      if (!canHit(e, { hitsAir: o.hitsAir, hitsGround: o.hitsGround, antiAir: o.hit?.antiAir })) continue;
      if (dist2(e, this) > (e.data.radius + 6) ** 2) continue;
      this.hit.add(e);
      if (o.splash) { this.alive = false; g.splash(this.x, this.y, o.splash, o.damage, o.type, this.origin, o.kind === 'flak' ? 'boom_fire' : 'boom', o.hit, o.slow); return; }
      e.takeDamage(g, o.damage, o.type, this.origin, o.hit);
      if (o.slow) { e.slowAmt = Math.max(e.slowAmt, o.slow); e.slowT = 1.6; }
      if (--this.pierce <= 0) { this.alive = false; return; }
    }
  }
}
