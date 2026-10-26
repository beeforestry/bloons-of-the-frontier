// =============================================================================
// RENDERER: draws the world onto a 2D canvas. Read-only view of Game.
// Tier visuals: a distinct painted sprite per tier + scale + glow ring + tier pips.
// =============================================================================
import type { Game, Effect } from '../game/Game';
import type { Tower } from '../entities/Tower';
import type { Unit, Squad } from '../entities/Unit';
import type { Enemy } from '../entities/Enemy';
import type { Projectile } from '../entities/Projectile';
import type { TierVisual } from '../core/types';
import type { Cell } from '../systems/PlacementSystem';
import { TOWERS, towerById } from '../data/towers';
const TOWER_BY_SPRITE = (k: string) => TOWERS.find((t) => t.sprite === k);
import { IMG, HEAD_PIVOT, body, flashOf, head, type Img } from './sprites';

export interface ViewState {
  placing: string | null;           // tower id being placed
  deploying: string | null;         // unit id being deployed (click sets rally)
  hoverCell: Cell | null;
  mouse: { x: number; y: number } | null;
  selTower: Tower | null;
  selSquad: Squad | null;
}

const TOWER_PX = 78, UNIT_PX = 44;

export class Renderer {
  readonly ctx: CanvasRenderingContext2D;
  constructor(readonly canvas: HTMLCanvasElement, readonly g: Game) {
    canvas.width = g.map.width; canvas.height = g.map.height;
    this.ctx = canvas.getContext('2d')!;
  }

  draw(v: ViewState) {
    const { ctx: c, g } = this;
    const bg = IMG['map:' + g.map.image];
    if (bg) c.drawImage(bg, 0, 0, g.map.width, g.map.height); else { c.fillStyle = '#6aa84f'; c.fillRect(0, 0, g.map.width, g.map.height); }
    if (v.placing || v.selTower?.isFarm) this.gridOverlay(v);
    this.auras(v);
    for (const p of g.pickups) this.pickup(p.x, p.y, p.age);
    // y-sorted world objects
    const objs: { y: number; f: () => void }[] = [];
    for (const t of g.towers) objs.push({ y: t.y, f: () => this.tower(t, t === v.selTower) });
    for (const u of g.units) if (!u.garrison) objs.push({ y: u.y, f: () => this.unit(u, v.selSquad === u.squad) });
    for (const e of g.enemies) if (!e.data.flying) objs.push({ y: e.y, f: () => this.enemy(e) });
    objs.sort((a, b) => a.y - b.y).forEach((o) => o.f());
    for (const e of g.enemies) if (e.data.flying) this.enemy(e);
    for (const p of g.projectiles) this.projectile(p);
    for (const a of g.acids) this.acid(a);
    for (const e of g.effects) this.effect(e);
    if (v.selSquad) this.rally(v.selSquad);
    if (v.placing && v.hoverCell) this.ghost(v.placing, v.hoverCell);
    if (v.deploying && v.mouse) { c.globalAlpha = 0.7; this.ringAt(v.mouse.x, v.mouse.y, 24, '#7fd3ff', 3); c.globalAlpha = 1; }
  }

  // ---------------------------------------------------------------- overlays
  private gridOverlay(v: ViewState) {
    const { ctx: c, g } = this, gr = g.grid, s = gr.cell;
    for (let r = 0; r < gr.rows; r++) for (let col = 0; col < gr.cols; col++) {
      if (!gr.isBuildable(col, r)) continue;
      const free = gr.isFree(col, r);
      const occ = gr.occupant(col, r);
      c.fillStyle = free ? 'rgba(255,255,255,0.10)' : (occ as Tower | null)?.isFarm ? 'rgba(255,215,64,0.22)' : 'rgba(255,80,80,0.14)';
      c.fillRect(gr.ox + col * s + 1, gr.oy + r * s + 1, s - 2, s - 2);
      c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 1;
      c.strokeRect(gr.ox + col * s + 1.5, gr.oy + r * s + 1.5, s - 3, s - 3);
    }
    void v;
  }
  private auras(v: ViewState) {
    const c = this.ctx;
    for (const t of this.g.towers) {
      if (!t.cover || t.disabled) continue;
      const r = t.t.cover!.auraRadius, sel = t === v.selTower;
      const gr = c.createRadialGradient(t.x, t.y, r * 0.2, t.x, t.y, r);
      gr.addColorStop(0, 'rgba(120,200,255,0)'); gr.addColorStop(1, sel ? 'rgba(120,200,255,0.28)' : 'rgba(120,200,255,0.12)');
      c.fillStyle = gr; c.beginPath(); c.arc(t.x, t.y, r, 0, 7); c.fill();
      c.setLineDash([8, 6]); this.ringAt(t.x, t.y, r, sel ? 'rgba(160,220,255,0.9)' : 'rgba(160,220,255,0.35)', 2); c.setLineDash([]);
    }
  }
  private ringAt(x: number, y: number, r: number, col: string, w = 2) { const c = this.ctx; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); }
  private range(x: number, y: number, r: number, ok = true) {
    const c = this.ctx;
    c.fillStyle = ok ? 'rgba(255,255,255,0.12)' : 'rgba(255,60,60,0.16)'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    this.ringAt(x, y, r, ok ? 'rgba(255,255,255,0.6)' : 'rgba(255,80,80,0.7)', 2);
  }
  private ghost(id: string, cell: Cell) {
    const g = this.g, d = towerById(id), t0 = d.tiers[0], p = g.grid.cellCenter(cell.c, cell.r);
    const ok = g.canPlace(id, cell);
    const r = t0.combat?.range ?? t0.cover?.auraRadius ?? 40;
    this.range(p.x, p.y, r, ok);
    this.ctx.globalAlpha = 0.65;
    this.towerImg(d.sprite, 0, p.x, p.y, t0.visual, 0, false);
    this.ctx.globalAlpha = 1;
  }
  private rally(sq: Squad) {
    const c = this.ctx, r = sq.rally;
    c.strokeStyle = '#7fd3ff'; c.lineWidth = 2; c.setLineDash([4, 4]);
    for (const u of sq.units) { c.beginPath(); c.moveTo(u.x, u.y); c.lineTo(r.x, r.y); c.stroke(); }
    c.setLineDash([]);
    c.fillStyle = '#7fd3ff'; c.beginPath(); c.moveTo(r.x, r.y); c.lineTo(r.x, r.y - 26); c.lineTo(r.x + 16, r.y - 20); c.lineTo(r.x, r.y - 14); c.fill();
    c.strokeStyle = '#1d2128'; c.lineWidth = 2; c.beginPath(); c.moveTo(r.x, r.y); c.lineTo(r.x, r.y - 26); c.stroke();
  }

  // ---------------------------------------------------------------- towers
  /** Fit an image into a square box (largest side = sz). */
  private fitWH(im: Img, sz: number) { const k = sz / Math.max(im.width, im.height); return [im.width * k, im.height * k]; }
  /** Draw an image with its FEET at (x, footY), optional flip / squash / rotation about the feet. */
  private feet(im: Img, x: number, footY: number, w: number, h: number, flip = false, sx = 1, sy = 1, rot = 0) {
    const c = this.ctx;
    c.save(); c.translate(x, footY); if (rot) c.rotate(rot); c.scale(flip ? -sx : sx, sy); c.drawImage(im, -w / 2, -h, w, h); c.restore();
  }
  private shadowAt(x: number, y: number, rx: number, ry: number, a = 0.3) {
    const c = this.ctx, gr = c.createRadialGradient(x, y, 1, x, y, rx);
    gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = gr; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill();
  }
  private additive(im: Img | undefined, x: number, y: number, sz: number, rot = 0, alpha = 1) {
    if (!im) return; const c = this.ctx, [w, h] = this.fitWH(im, sz);
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha *= alpha; c.translate(x, y); if (rot) c.rotate(rot); c.drawImage(im, -w / 2, -h / 2, w, h); c.restore();
  }
  /** Tower art: painted 3/4 body (flips to face the target), turret heads rotate on their base,
   *  idle breathing, fire recoil (squash + kick back), muzzle flash for gun-type towers. */
  private towerImg(key: string, tier: number, x: number, y: number, vis: TierVisual, aim: number, flash: boolean, recoil = 0, phase = 0) {
    const c = this.ctx, sz = TOWER_PX * (vis.scale ?? 1), footY = y + 20;
    const im = body(key, tier), hd = head(key, tier), time = this.g.time + phase;
    if (vis.glow) {
      const gr = c.createRadialGradient(x, footY - 2, 4, x, footY - 2, sz * 0.55);
      gr.addColorStop(0, vis.glow + '99'); gr.addColorStop(1, vis.glow + '00');
      c.fillStyle = gr; c.beginPath(); c.ellipse(x, footY - 2, sz * 0.55, sz * 0.24, 0, 0, 7); c.fill();
    }
    this.shadowAt(x + 4, footY - 2, sz * 0.42, sz * 0.15);
    if (!im) { c.fillStyle = '#888'; c.fillRect(x - 20, y - 20, 40, 40); return; }
    const td = TOWER_BY_SPRITE(key);
    const hover = td?.id === 'super_monkey' ? Math.sin(time * 2.4) * 3 - 6 : 0;
    const breathe = 1 + Math.sin(time * 2.1) * 0.012;
    const [w, h] = this.fitWH(im, hd ? sz * 0.92 : sz);
    const img = flash ? flashOf(im) : im;
    if (hd) { // static base + rotating head with barrel recoil
      this.feet(img, x, footY, w, h);
      const [hw, hh] = this.fitWH(hd, sz * (key.includes('rail') ? 1.05 : 0.9));
      const py = footY - h * 0.62, kick = recoil * 6;
      c.save(); c.translate(x, py); c.rotate(aim); c.translate(-kick, 0);
      c.drawImage(hd, -hw * HEAD_PIVOT, -hh / 2, hw, hh); c.restore();
      if (recoil > 0.55 && td?.projectile === 'bullet') this.additive(IMG.fx_muzzle, x + Math.cos(aim) * hw * (1 - HEAD_PIVOT), py + Math.sin(aim) * hw * (1 - HEAD_PIVOT), 30 + tier * 6, aim, (recoil - 0.55) / 0.45);
      return;
    }
    const flip = Math.cos(aim) < -0.2;
    const sq = recoil * 0.07; // squash on fire
    this.feet(img, x - (flip ? -1 : 1) * recoil * 3, footY + hover, w, h, flip, breathe + sq * 0.6, breathe - sq);
    const pj = td?.projectile;
    if (recoil > 0.6 && (pj === 'pea' || pj === 'gpea' || pj === 'bullet')) {
      const dir = flip ? -1 : 1;
      const mx = x + dir * w * 0.42, my = footY + hover - h * (pj === 'pea' ? 0.66 : 0.62);
      this.additive(IMG.fx_muzzle, mx, my, 26 + tier * 4, flip ? Math.PI : 0, (recoil - 0.6) / 0.4);
    }
    if (td?.id === 'wizard_monkey' || td?.id === 'star_emperor') { // magical shimmer that grows per tier
      this.additive(td.id === 'wizard_monkey' ? IMG.fx_magic : IMG.fx_star, x + (flip ? -1 : 1) * w * 0.3, footY - h * 0.85, 12 + tier * 5, time, 0.35 + 0.25 * Math.sin(time * 3));
    }
  }
  private img(im: Img, x: number, y: number, sz: number, flip = false, rot = 0) {
    const c = this.ctx, [w, h] = this.fitWH(im, sz);
    c.save(); c.translate(x, y); if (rot) c.rotate(rot); if (flip) c.scale(-1, 1); c.drawImage(im, -w / 2, -h / 2, w, h); c.restore();
  }
  private tower(t: Tower, sel: boolean) {
    const c = this.ctx;
    if (sel) {
      const r = t.combat ? t.range(t.t.combat!.range) : t.cover ? t.t.cover!.auraRadius : 0;
      if (r) this.range(t.x, t.y, r);
    }
    if (t.slide) { // dust trail while sliding into the organized grid
      c.fillStyle = 'rgba(230,210,160,0.55)';
      for (let i = 0; i < 4; i++) { const k = i / 4; c.beginPath(); c.arc(t.slide.fx + (t.x - t.slide.fx) * k, t.slide.fy + (t.y - t.slide.fy) * k + 18, 4 + i * 2, 0, 7); c.fill(); }
    }
    if (t.disabled) c.globalAlpha = 0.55;
    this.towerImg(t.data.sprite, t.tier, t.x, t.y, t.t.visual, t.aim, false, t.recoil, (t.uid % 7) * 0.9);
    c.globalAlpha = 1;
    this.pips(t.x, t.y + 26, t.tier, t.t.visual.glow);
    if (t.health.frac < 0.999) this.bar(t.x, t.y - 38, 40, t.health.frac, t.disabled ? '#888' : '#5fe06a');
    if (t.disabled) this.label(t.x, t.y - 46, 'OFFLINE', '#ff8a7a');
    if (t.cover && t.cover.garrisoned.length) this.label(t.x, t.y + 40, '👤'.repeat(t.cover.garrisoned.length), '#fff', 11);
    if (sel) { c.strokeStyle = '#fff'; c.lineWidth = 2; c.setLineDash([5, 4]); c.strokeRect(t.x - 24, t.y - 24, 48, 48); c.setLineDash([]); }
  }
  private pips(x: number, y: number, tier: number, glow?: string) {
    const c = this.ctx;
    for (let i = 0; i <= tier; i++) {
      const px = x + (i - tier / 2) * 10;
      c.fillStyle = tier === 0 ? '#ddd' : glow ?? '#ffd24a'; c.strokeStyle = '#1d2128'; c.lineWidth = 1.5;
      c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 2 : 4.6; c.lineTo(px + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke();
    }
  }
  private bar(x: number, y: number, w: number, f: number, col: string) {
    const c = this.ctx;
    c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(x - w / 2 - 1, y - 1, w + 2, 6);
    c.fillStyle = col; c.fillRect(x - w / 2, y, w * Math.max(0, f), 4);
  }
  private label(x: number, y: number, s: string, col: string, size = 12) {
    const c = this.ctx; c.font = `bold ${size}px Fredoka, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineWidth = 3; c.strokeStyle = 'rgba(0,0,0,0.75)'; c.strokeText(s, x, y); c.fillStyle = col; c.fillText(s, x, y);
  }

  // ---------------------------------------------------------------- units
  private prev = new Map<number, { x: number; y: number; walk: number; moving: number }>();
  /** Part-based unit motion: walk hop + sway while moving, breathing idle, recoil + muzzle flash
   *  (ranged) or a forward lunge (melee) when attacking. Drop pods fall with a burn trail. */
  private unit(u: Unit, sel: boolean) {
    const c = this.ctx, g = this.g, tier = g.unitTier(u.data.id), t = u.data.tiers[tier];
    if (u.dropT > 0) { // orbital drop pod falling
      const k = u.dropT / 0.7, pod = IMG.drop_pod, py = u.y - k * 240;
      this.shadowAt(u.x, u.y + 12, 18 * (1 - k * 0.5), 6, 0.45 * (1 - k));
      if (pod) {
        this.additive(IMG.fx_boom_fire ?? IMG.fx_boom, u.x, py - 30, 34, 0, 0.8);
        this.feet(pod, u.x, py + 14, 22, 30);
      }
      return;
    }
    const st = this.prev.get(u.uid) ?? { x: u.x, y: u.y, walk: Math.random() * 6, moving: 0 };
    const d = Math.hypot(u.x - st.x, u.y - st.y);
    st.moving = d > 0.05 ? Math.min(1, st.moving + 0.25) : Math.max(0, st.moving - 0.1);
    st.walk += d * 0.22; st.x = u.x; st.y = u.y; this.prev.set(u.uid, st);
    const im = body(u.data.sprite, tier), sz = UNIT_PX * (t.visual.scale ?? 1) * (u.isWorker ? 0.9 : 1);
    const footY = u.y + 14;
    if (t.visual.glow) { c.fillStyle = t.visual.glow + '44'; c.beginPath(); c.ellipse(u.x, footY - 1, sz * 0.42, sz * 0.15, 0, 0, 7); c.fill(); }
    this.shadowAt(u.x + 2, footY - 1, sz * 0.32, sz * 0.11, 0.35);
    if (sel) this.ringAt(u.x, footY - 2, sz * 0.45, '#7fd3ff', 2);
    if (im) {
      const [w, h] = this.fitWH(im, sz);
      const hop = Math.abs(Math.sin(st.walk)) * 2.6 * st.moving;
      const sway = Math.sin(st.walk) * 0.07 * st.moving;
      const breathe = 1 + Math.sin(g.time * 2.6 + u.uid) * 0.015 * (1 - st.moving);
      const atk = u.attackAnim > 0 ? Math.min(1, u.attackAnim / 0.18) : 0;
      const ranged = t.stats.range >= 60, dir = u.facing < 0 ? -1 : 1;
      const lunge = ranged ? -atk * 2 : atk * 6, rot = sway + (ranged ? 0 : atk * 0.18 * dir);
      this.feet(im, u.x + lunge * dir, footY - hop, w, h, u.facing < 0, 1, breathe, rot);
      if (ranged && atk > 0.35 && !u.isWorker) this.additive(IMG.fx_muzzle, u.x + dir * w * 0.5, footY - hop - h * 0.66, 16 + tier * 3, dir < 0 ? Math.PI : 0, atk);
    }
    if (u.health.frac < 0.999) this.bar(u.x, u.y - sz * 0.75, 24, u.health.frac, '#7fd3ff');
    if (u.isWorker && (u as Unit & { status?: string }).status && (u as Unit & { status: string }).status !== 'idle')
      this.label(u.x, u.y - sz * 0.9, ({ 'organizing farms': '🧹', collecting: '¢', repairing: '🔧' } as Record<string, string>)[(u as Unit & { status: string }).status] ?? '', '#ffe14d', 12);
  }

  // ---------------------------------------------------------------- enemies
  /** Bloons float (bob + sway, string wiggle via rotation); bugs scuttle (stride-synced
   *  bob + alternating squash that reads as leg motion) and flip to face their heading. */
  private enemy(e: Enemy) {
    const c = this.ctx, d = e.data, im = body(d.sprite), time = this.g.time + (e.uid % 13) * 0.7;
    const bug = d.family === 'bug';
    if (!im) { c.fillStyle = d.color; c.beginPath(); c.arc(e.x, e.y, d.radius, 0, 7); c.fill(); return; }
    const flip = Math.cos(e.ang) < -0.05;
    let w: number, h: number, footY: number;
    if (bug) {
      [w, h] = this.fitWH(im, d.size * 1.15);
      footY = e.y + h * 0.42;
      const stride = e.progress / Math.max(8, d.size * 0.22);
      const fighting = !!e.blockedBy;
      const bob = Math.abs(Math.sin(stride)) * (d.boss ? 2 : 1.6) + (fighting ? Math.abs(Math.sin(time * 14)) * 2 : 0);
      const sx = 1 + Math.sin(stride * 2) * 0.035, sy = 1 - Math.sin(stride * 2) * 0.035;
      const rot = Math.sin(stride) * 0.04 + (fighting ? Math.sin(time * 14) * 0.06 : 0);
      this.shadowAt(e.x, footY - 2, w * 0.45, Math.max(4, h * 0.14), 0.38);
      this.feet(im, e.x, footY - bob, w, h, flip, sx, sy, rot);
      if (e.hitFlash > 0) { c.globalAlpha = Math.min(1, e.hitFlash * 8) * 0.6; this.feet(flashOf(im), e.x, footY - bob, w, h, flip, sx, sy, rot); c.globalAlpha = 1; }
    } else {
      const moab = d.boss;
      [w, h] = this.fitWH(im, moab ? d.size : d.size * 1.1);
      const bob = Math.sin(time * 3.1) * (moab ? 2 : 3), sway = moab ? Math.sin(time * 1.3) * 0.03 : Math.sin(time * 2.3) * 0.08;
      this.shadowAt(e.x, e.y + h * 0.55 + 10, w * 0.32, w * 0.1, 0.22);
      c.save(); c.translate(e.x, e.y + bob); c.rotate(sway); if (moab && flip) c.scale(-1, 1);
      c.drawImage(im, -w / 2, -h / 2, w, h);
      if (e.hitFlash > 0) { c.globalAlpha = Math.min(1, e.hitFlash * 8) * 0.6; c.drawImage(flashOf(im), -w / 2, -h / 2, w, h); }
      c.restore();
      footY = e.y;
    }
    if (e.slowAmt > 0) { c.fillStyle = 'rgba(150,220,255,0.3)'; c.beginPath(); c.ellipse(e.x, e.y, w * 0.5, h * 0.45, 0, 0, 7); c.fill(); }
    if (d.boss || (d.hp > 1 && e.hp < d.hp)) this.bar(e.x, e.y - h * 0.6 - 4, d.boss ? 70 : 28, e.hp / d.hp, d.boss ? '#ff5a5a' : '#ffb347');
    void footY;
  }

  // ---------------------------------------------------------------- projectiles & fx
  private projectile(p: Projectile) {
    const c = this.ctx, k = p.o.kind, s = p.o.scale ?? 1, y = p.y - p.height;
    const ang = Math.atan2(p.vy, p.vx);
    switch (k) {
      case 'dart': if (IMG.fx_dart) this.img(IMG.fx_dart, p.x, y, 24 * s, false, ang); break;
      case 'pea': this.additive(IMG.fx_pea, p.x, y, 22 * s, ang); break;
      case 'gpea': if (IMG.fx_cherry) { this.additive(IMG.fx_pea_cherry, p.x, y, 22 * s, ang, 0.7); this.img(IMG.fx_cherry, p.x, y, 12 * s, false, p.spin * 0.3); } break;
      case 'ice': if (IMG.fx_ice) this.img(IMG.fx_ice, p.x, y, 18 * s, false, ang); break;
      case 'shuriken': if (IMG.fx_shuriken) this.img(IMG.fx_shuriken, p.x, y, 15 * s, false, p.spin); break;
      case 'star': this.additive(IMG.fx_star, p.x, y, 22 * s, p.spin); break;
      case 'magic': this.additive(IMG.fx_magic, p.x, y, 24 * s, p.spin); break;
      case 'melon':
        this.shadowAt(p.x, p.y, 10, 4, 0.35);
        this.additive(IMG.fx_boom_fire, p.x, y - 4, 30, p.spin * 0.5, 0.75);
        if (IMG.fx_melon) this.img(IMG.fx_melon, p.x, y, 20, false, p.spin * 0.3); break;
      case 'bullet': if (IMG.fx_bullet) { c.strokeStyle = 'rgba(255,220,140,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(p.x, y); c.lineTo(p.x - Math.cos(ang) * 14, y - Math.sin(ang) * 14); c.stroke(); this.img(IMG.fx_bullet, p.x, y, 9 * s, false, ang); } break;
      default: c.fillStyle = '#ffe08a'; c.beginPath(); c.arc(p.x, y, 3 * s, 0, 7); c.fill();
    }
  }
  private acid(a: { x: number; y: number; tx: number; ty: number; t: number }) {
    const x = a.x + (a.tx - a.x) * a.t, y = a.y + (a.ty - a.y) * a.t - Math.sin(a.t * Math.PI) * 110;
    this.additive(IMG.fx_acid, x, y, 30, a.t * 6);
  }
  private pickup(x: number, y: number, age: number) {
    const im = IMG.fx_crate; if (!im) return;
    const bob = Math.sin(age * 4) * 2;
    this.shadowAt(x, y + 10, 12, 4, 0.35);
    if (age > 11) this.ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(age * 10));
    this.img(im, x, y + bob, 28); this.additive(IMG.fx_coin, x + 6, y + bob - 12 - (age * 8) % 6, 10, 0, 0.6); this.ctx.globalAlpha = 1;
  }
  private effect(e: Effect) {
    const c = this.ctx, k = Math.min(1, e.t! / e.dur);
    c.globalAlpha = 1 - k;
    switch (e.kind) {
      case 'text': this.label(e.x, e.y - k * 22, e.text ?? '', e.color ?? '#fff', 14); break;
      case 'ring': this.ringAt(e.x, e.y, (e.r ?? 20) * (0.5 + k), e.color ?? '#fff', 3); break;
      case 'pop': { // balloon pop: shockwave + rubber shreds in the balloon's color
        c.globalAlpha = 1;
        this.additive(IMG.fx_pop, e.x, e.y, (e.r ?? 20) * 2.4 * (0.5 + k * 0.9), k, 1 - k);
        c.globalAlpha = 1 - k; c.fillStyle = e.color ?? '#fff';
        for (let i = 0; i < 6; i++) { const a = i * 1.047 + 0.3, rr = (e.r ?? 20) * (0.4 + k * 1.2); c.save(); c.translate(e.x + Math.cos(a) * rr, e.y + Math.sin(a) * rr + k * k * 10); c.rotate(a + k * 4); c.fillRect(-3, -1.5, 6, 3); c.restore(); }
        break;
      }
      case 'splat': { // bug death: ichor splash + carapace chips
        c.globalAlpha = 1;
        this.additive(IMG.fx_acid, e.x, e.y, (e.r ?? 16) * 2.2 * (0.5 + k * 0.6), 0, (1 - k) * 0.6);
        c.globalAlpha = 1 - k; c.fillStyle = e.color ?? '#8a5a2b';
        for (let i = 0; i < 6; i++) { const a = i * 1.05; c.beginPath(); c.arc(e.x + Math.cos(a) * (6 + k * 14), e.y + Math.sin(a) * (6 + k * 14), 3.2, 0, 7); c.fill(); }
        break;
      }
      case 'boom': case 'boom_fire': {
        c.globalAlpha = 1;
        const im = e.kind === 'boom' ? IMG.fx_boom : IMG.fx_boom_fire;
        if (im) this.additive(im, e.x, e.y, (e.r ?? 40) * 2.1 * (0.55 + 0.6 * k), k * 0.6, 1 - k * k); else this.ringAt(e.x, e.y, e.r ?? 40, '#ffa040', 4);
        break;
      }
      case 'acid': c.globalAlpha = 1; this.additive(IMG.fx_acid, e.x, e.y, (e.r ?? 24) * 2 * (0.6 + k * 0.6), 0, 1 - k); break;
      case 'beam': {
        c.strokeStyle = e.color ?? '#fff'; c.lineWidth = (e.width ?? 2) * (1 - k * 0.5); c.shadowColor = e.color ?? '#fff'; c.shadowBlur = 10;
        c.beginPath(); c.moveTo(e.x, e.y); c.lineTo(e.x2!, e.y2!); c.stroke(); c.shadowBlur = 0;
        c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = Math.max(1, (e.width ?? 2) * 0.35); c.beginPath(); c.moveTo(e.x, e.y); c.lineTo(e.x2!, e.y2!); c.stroke();
        if ((e.width ?? 2) >= 4) { c.globalAlpha = 1; this.additive(IMG.fx_spark, e.x, e.y, 34, k * 3, 1 - k); }
        break;
      }
      case 'dust': c.fillStyle = e.color ?? '#e8d8b0'; for (let i = 0; i < 5; i++) { const a = i * 1.26; c.beginPath(); c.arc(e.x + Math.cos(a) * (e.r ?? 20) * k, e.y + Math.sin(a) * 6 * k, 5 * (1 + k), 0, 7); c.fill(); } break;
      case 'pod': this.ringAt(e.x, e.y + 10, (e.r ?? 24) * (0.4 + k), e.color ?? '#9fb3c8', 4); break;
      default: break;
    }
    c.globalAlpha = 1;
  }
}
