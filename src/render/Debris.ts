// t107 PHYSICS-LITE DEATH EFFECTS (2D). Pooled fragments with a fake height axis:
// pieces fly out along the ground plane (biased in the killing hit's direction), rise and fall
// under simple gravity, bounce once or twice, spin, then fade. Everything is preallocated and
// recycled; a global cap (lower on mobile / low quality) and a load governor keep it cheap.
import type { DeathCause, DeathEvent } from '../systems/Deaths';
import type { Img } from './sprites';

export const enum FK { Slice = 0, Shred = 1, Shard = 2, Body = 3, Scorch = 4, Knot = 5 }
export interface Frag {
  k: FK; x: number; y: number; z: number; vx: number; vy: number; vz: number;
  a: number; va: number; t: number; life: number; w: number; h: number;
  im: Img | null; sx: number; sy: number; sw: number; sh: number; flip: boolean;
  color: string; tip: number; rest: boolean;
}
const GRAV = 900;
const mk = (): Frag => ({ k: FK.Slice, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, a: 0, va: 0, t: 0, life: 1, w: 8, h: 8, im: null, sx: 0, sy: 0, sw: 1, sh: 1, flip: false, color: '#fff', tip: 0, rest: false });
const R = (a: number, b: number) => a + Math.random() * (b - a);

export interface DebrisSource {
  /** Sprite image + on-screen size for the enemy type, or null (balloons / missing art). */
  look(id: string): { im: Img | null; w: number; h: number; family: string; color: string; size: number } | null;
  /** Charred / iced variants of a sprite (cached tints). */
  tint(im: Img, cause: DeathCause): Img;
  /** Particle hooks (embers, ash, sparks, glints) into the shared particle pool. */
  spark(x: number, y: number, vx: number, vy: number, life: number, size: number, rgb: number, kind: 'glow' | 'ember' | 'dust'): void;
}

export class Debris {
  private pool: Frag[] = [];
  readonly live: Frag[] = [];
  readonly ground: Frag[] = []; // scorch marks (drawn under the y-sorted world)
  cap = 240;
  /** Heavy load (big wave / mobile / low quality): fewer pieces per kill, cheaper drawing. */
  heavy = false;
  /** Stats for tests / the FPS overlay. */
  stats = { spawned: 0, events: 0, skipped: 0, peak: 0, byCause: {} as Record<string, number>, simplified: 0 };
  private cursor = 0;
  private take(): Frag | null {
    if (this.live.length >= this.cap) return null;
    const f = this.pool.pop() ?? mk(); f.t = 0; f.rest = false; f.tip = 0; f.im = null; this.live.push(f); this.stats.spawned++; return f;
  }
  get n() { return this.live.length + this.ground.length; }
  /** Pull every new death event out of the game queue. */
  consume(deaths: DeathEvent[], seq: number, src: DebrisSource, inView: (x: number, y: number) => boolean) {
    if (this.cursor > seq) this.cursor = 0; // new game
    for (const d of deaths) {
      if (d.seq <= this.cursor) continue;
      this.cursor = d.seq;
      if (!inView(d.x, d.y)) continue;
      this.spawn(d, src);
    }
    this.cursor = Math.max(this.cursor, seq);
  }
  spawn(d: DeathEvent, src: DebrisSource) {
    const L = src.look(d.id); if (!L) return;
    this.stats.events++; this.stats.byCause[d.cause] = (this.stats.byCause[d.cause] ?? 0) + 1;
    const load = this.live.length / this.cap;
    if ((load > 0.95 || (this.heavy && load > 0.8)) && !d.boss) { this.stats.skipped++; return; }
    const simple = (load > 0.6 || this.heavy) && !d.boss; if (simple) this.stats.simplified++;
    const bloon = L.family === 'bloon', big = d.boss;
    // piece count: 3-6 normally, more for explosions / bosses, layer pops are light shreds
    let n = d.layer ? 3 : bloon ? 5 : 4;
    if (d.cause === 'boom') n += 2; if (big) n += 4; if (d.shatter) n += 1;
    if (simple) n = Math.max(2, Math.ceil(n / 2));
    const linger = big ? 1.7 : d.cause === 'boom' ? 1.3 : 1;
    const spread = d.cause === 'boom' ? 1.9 : 0.85, sp = d.cause === 'boom' ? 1.6 : 1;
    const hitA = Math.atan2(d.dy, d.dx), w = L.w, h = L.h;
    const im = L.im ? (d.cause === 'burn' || d.cause === 'ice' ? src.tint(L.im, d.cause) : L.im) : null;
    const footY = bloon ? d.y + h * 0.55 + 6 : d.y + h * 0.42;
    const launch = (f: Frag, lift: number) => {
      const a = hitA + R(-spread, spread), s = R(80, 220) * sp * (big ? 1.3 : 1);
      f.vx = Math.cos(a) * s; f.vy = Math.sin(a) * s * 0.55; f.vz = R(140, 320) * sp * lift;
      f.a = R(0, 6.28); f.va = R(-12, 12); f.life = R(0.6, 1.2) * linger;
    };
    if (bloon && (!im || !big)) {
      // rubber shreds + the knot
      for (let i = 0; i < n; i++) {
        const f = this.take(); if (!f) break;
        f.k = FK.Shred; f.color = L.color; f.w = R(0.18, 0.32) * w * (d.layer ? 0.8 : 1); f.h = f.w * R(0.35, 0.6);
        f.x = d.x + R(-0.3, 0.3) * w; f.y = footY; f.z = footY - d.y + R(-0.3, 0.3) * h; launch(f, 1); f.va *= 1.5; f.tip = Math.random();
      }
      if (!d.layer) { const f = this.take(); if (f) { f.k = FK.Knot; f.color = L.color; f.w = f.h = Math.max(4, w * 0.12); f.x = d.x; f.y = footY; f.z = footY - d.y - h * 0.45; launch(f, 0.5); } }
    } else if (im) {
      const IW = im.width, IH = im.height, flip = !bloon && Math.cos(hitA) < -0.05 ? true : false;
      // body tips over in the hit direction (bugs / creatures; not for explosions, which blow it apart)
      const tipBody = !bloon && d.cause !== 'boom' && !d.layer;
      const topK = tipBody ? 0.45 : 1; // fraction of the sprite that breaks into flying pieces
      if (tipBody) {
        const f = this.take();
        if (f) {
          f.k = FK.Body; f.im = im; f.sx = 0; f.sy = IH * topK; f.sw = IW; f.sh = IH * (1 - topK); f.flip = flip;
          f.w = w; f.h = h * (1 - topK); f.x = d.x; f.y = footY; f.z = 0; f.vx = d.dx * 40; f.vy = d.dy * 12; f.vz = 0;
          f.a = 0; f.va = (Math.cos(hitA) >= 0 ? 1 : -1) * R(1.2, 1.5); f.life = (big ? 2.2 : 1.1) * (d.cause === 'burn' ? 1.2 : 1); f.rest = true;
        }
        n -= 1;
      }
      const cols = Math.max(1, Math.min(3, Math.round(Math.sqrt(n * 1.5)))), rows = Math.max(1, Math.ceil(n / cols));
      for (let i = 0; i < n; i++) {
        const f = this.take(); if (!f) break;
        const cx = i % cols, cy = Math.floor(i / cols) % rows;
        const jx = R(-0.08, 0.08), jy = R(-0.08, 0.08);
        const u0 = Math.max(0, cx / cols + jx), v0 = Math.max(0, (cy / rows) * topK + jy * topK);
        const uw = Math.min(1 - u0, 1 / cols * R(0.85, 1.1)), vh = Math.min(topK - v0, topK / rows * R(0.85, 1.1));
        if (uw <= 0.02 || vh <= 0.02) { this.give(f); continue; }
        f.k = FK.Slice; f.im = im; f.sx = u0 * IW; f.sy = v0 * IH; f.sw = uw * IW; f.sh = vh * IH; f.flip = flip;
        f.w = uw * w; f.h = vh * h;
        const ux = (u0 + uw / 2 - 0.5) * (flip ? -1 : 1), vy = v0 + vh / 2;
        f.x = d.x + ux * w; f.y = footY; f.z = bloon ? footY - d.y + (0.5 - vy) * h : (1 - vy) * h * 0.92;
        launch(f, 1);
        // pieces on the far side of the hit fly further
        const side = ux * Math.cos(hitA) > 0 ? 1.25 : 0.85; f.vx *= side; f.vy *= side;
      }
      if (bloon) for (let i = 0; i < 3; i++) { const f = this.take(); if (!f) break; f.k = FK.Shred; f.color = L.color; f.w = R(0.08, 0.14) * w; f.h = f.w * 0.5; f.x = d.x; f.y = footY; f.z = footY - d.y; launch(f, 1); }
    }
    // ice shards (SHATTER = a proper burst of them)
    if (d.cause === 'ice') {
      const m = simple ? 3 : d.shatter ? 10 : 6;
      for (let i = 0; i < m; i++) { const f = this.take(); if (!f) break; f.k = FK.Shard; f.color = Math.random() < 0.5 ? '#dff8ff' : '#9fdcff'; f.w = R(4, 9) * (big ? 1.8 : 1); f.h = f.w * R(1.4, 2.4); f.x = d.x + R(-0.2, 0.2) * w; f.y = footY; f.z = h * R(0.2, 0.7); launch(f, 1.1); f.va *= 1.4; f.life *= 0.9; }
    }
    // explosion scorch (lingers on the ground)
    if (d.cause === 'boom' && !d.layer && this.ground.length < 24) {
      const f = this.pool.pop() ?? mk(); f.k = FK.Scorch; f.x = d.x; f.y = footY; f.w = Math.max(14, L.size * (big ? 0.7 : 0.42)); f.h = f.w * 0.42; f.t = 0; f.life = big ? 4 : 2.4; f.a = R(0, 6.28); this.ground.push(f);
    }
    // particles: embers + ash / sparks / ice glints / plain dust
    const pk = simple ? 0.5 : 1, cy = footY - h * 0.45;
    if (d.cause === 'burn') {
      for (let i = 0; i < 9 * pk; i++) src.spark(d.x + R(-0.3, 0.3) * w, cy + R(-10, 10), R(-30, 30) + d.dx * 30, R(-70, -20), R(0.6, 1.2), R(2, 3.5), Math.random() < 0.5 ? 0xffa040 : 0xff6020, 'ember');
      for (let i = 0; i < 5 * pk; i++) src.spark(d.x + R(-0.3, 0.3) * w, cy, R(-20, 20), R(-30, -10), R(0.8, 1.3), R(3, 5), 0x4a4440, 'dust');
    } else if (d.cause === 'shock') {
      for (let i = 0; i < 10 * pk; i++) { const a = R(0, 6.28), s = R(120, 300); src.spark(d.x, cy, Math.cos(a) * s, Math.sin(a) * s, R(0.15, 0.35), R(5, 9), Math.random() < 0.5 ? 0xfff27a : 0xbff4ff, 'glow'); }
    } else if (d.cause === 'ice') {
      for (let i = 0; i < 5 * pk; i++) { const a = R(0, 6.28), s = R(40, 140); src.spark(d.x, cy, Math.cos(a) * s, Math.sin(a) * s, R(0.25, 0.5), R(5, 8), 0xdff8ff, 'glow'); }
    } else if (d.cause === 'boom') {
      for (let i = 0; i < 8 * pk; i++) { const a = R(0, 6.28), s = R(60, 200); src.spark(d.x, cy, Math.cos(a) * s, Math.sin(a) * s * 0.6, R(0.3, 0.6), R(6, 10), 0xffb050, 'glow'); }
      for (let i = 0; i < 4 * pk; i++) src.spark(d.x + R(-12, 12), footY, R(-30, 30), R(-20, -5), 0.9, R(5, 8), 0x6a5a48, 'dust');
    }
    this.stats.peak = Math.max(this.stats.peak, this.live.length);
  }
  private give(f: Frag) { const i = this.live.indexOf(f); if (i >= 0) { this.live[i] = this.live[this.live.length - 1]; this.live.pop(); } this.pool.push(f); }
  update(dt: number) {
    if (!dt) return;
    const L = this.live;
    for (let i = 0; i < L.length;) {
      const f = L[i]; f.t += dt;
      if (f.t >= f.life) { L[i] = L[L.length - 1]; L.pop(); this.pool.push(f); continue; }
      if (f.k === FK.Body) { // tip over around the feet, slide a little, then lie still
        f.tip = Math.min(1, f.tip + dt / 0.32); f.x += f.vx * dt * (1 - f.tip); f.y += f.vy * dt * (1 - f.tip);
      } else if (!f.rest) {
        f.x += f.vx * dt; f.y += f.vy * dt; f.z += f.vz * dt; f.vz -= GRAV * dt; f.a += f.va * dt;
        if (f.k === FK.Shred) { f.vx *= 1 - 1.6 * dt; f.vy *= 1 - 1.6 * dt; f.vz += GRAV * 0.45 * dt; } // light rubber flutters
        if (f.z <= 0) {
          f.z = 0;
          if (f.vz < -70) { f.vz = -f.vz * 0.33; f.vx *= 0.55; f.vy *= 0.55; f.va *= 0.5; }
          else { f.rest = true; f.vz = 0; }
        }
      }
      i++;
    }
    const G = this.ground;
    for (let i = 0; i < G.length;) { const f = G[i]; f.t += dt; if (f.t >= f.life) { G[i] = G[G.length - 1]; G.pop(); this.pool.push(f); continue; } i++; }
  }
  drawGround(c: CanvasRenderingContext2D) {
    for (const f of this.ground) {
      const a = Math.min(1, (f.life - f.t) / (f.life * 0.5)) * 0.38;
      c.globalAlpha = a; c.fillStyle = '#1b130c';
      c.beginPath(); c.ellipse(f.x, f.y, f.w, f.h, 0, 0, 6.283); c.fill();
      c.globalAlpha = a * 0.7; c.fillStyle = '#3a2614';
      for (let k = 0; k < 5; k++) { const q = f.a + k * 1.256; c.beginPath(); c.ellipse(f.x + Math.cos(q) * f.w * 0.9, f.y + Math.sin(q) * f.h * 0.9, f.w * 0.22, f.h * 0.22, 0, 0, 6.283); c.fill(); }
    }
    c.globalAlpha = 1;
  }
  draw(c: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
    if (!this.live.length) return;
    // compose each fragment's transform onto the camera matrix directly (no save/restore per piece)
    const B = c.getTransform(), lite = this.heavy;
    const put = (x: number, y: number, a: number, flip: boolean) => {
      const co = Math.cos(a), si = Math.sin(a), fx = flip ? -1 : 1;
      c.setTransform((B.a * co + B.c * si) * fx, (B.b * co + B.d * si) * fx, B.a * -si + B.c * co, B.b * -si + B.d * co, B.a * x + B.c * y + B.e, B.b * x + B.d * y + B.f);
    };
    for (const f of this.live) {
      if (f.x < x0 || f.x > x1 || f.y < y0 || f.y > y1) continue;
      const fade = Math.min(1, (f.life - f.t) / (f.life * 0.4));
      if (!lite && f.z > 3 && f.k !== FK.Shard) { c.setTransform(B); c.globalAlpha = 0.22 * fade; c.fillStyle = '#000'; c.beginPath(); c.ellipse(f.x, f.y, f.w * 0.35, f.w * 0.12, 0, 0, 6.283); c.fill(); }
      c.globalAlpha = fade;
      if (f.k === FK.Body) {
        const e = 1 - (1 - f.tip) * (1 - f.tip); // ease-out
        put(f.x, f.y, f.va * e, f.flip);
        c.drawImage(f.im!, f.sx, f.sy, f.sw, f.sh, -f.w / 2, -f.h, f.w, f.h);
        continue;
      }
      put(f.x, f.y - f.z, f.a, f.k === FK.Slice && f.flip);
      if (f.k === FK.Slice) c.drawImage(f.im!, f.sx, f.sy, f.sw, f.sh, -f.w / 2, -f.h / 2, f.w, f.h);
      else if (f.k === FK.Shred) { // torn rubber: a curled, jagged strip
        const w = f.w / 2, h = f.h / 2, k = f.tip;
        c.fillStyle = f.color;
        c.beginPath(); c.moveTo(-w, -h * 0.4); c.quadraticCurveTo(0, -h * (1.6 + k), w, -h * 0.2); c.lineTo(w * 0.6, h * 0.3); c.lineTo(w * 0.2, h * 0.9); c.lineTo(-w * 0.3, h * 0.4); c.lineTo(-w * 0.8, h); c.closePath(); c.fill();
        if (!lite) { c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1; c.stroke(); c.globalAlpha = fade * 0.35; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(-w * 0.2, -h * 0.5, w * 0.35, h * 0.2, 0, 0, 6.283); c.fill(); }
      } else if (f.k === FK.Knot) {
        c.fillStyle = f.color; c.beginPath(); c.moveTo(0, -f.h / 2); c.lineTo(f.w / 2, f.h / 2); c.lineTo(-f.w / 2, f.h / 2); c.closePath(); c.fill();
      } else if (f.k === FK.Shard) {
        c.fillStyle = f.color;
        c.beginPath(); c.moveTo(0, -f.h / 2); c.lineTo(f.w / 2, f.h * 0.15); c.lineTo(0, f.h / 2); c.lineTo(-f.w / 2, -f.h * 0.1); c.closePath(); c.fill();
        if (!lite) { c.strokeStyle = '#ffffff'; c.lineWidth = 1; c.stroke(); }
      }
    }
    c.setTransform(B); c.globalAlpha = 1;
  }
  clear() { for (const f of this.live) this.pool.push(f); for (const f of this.ground) this.pool.push(f); this.live.length = 0; this.ground.length = 0; }
}
