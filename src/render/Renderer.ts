// =============================================================================
// RENDERER: draws the world onto a 2D canvas. Read-only view of Game.
// Tier visuals: a distinct painted sprite per tier + scale + glow ring + tier pips.
// =============================================================================
import type { Game, Effect, Strike } from '../game/Game';
import { PCOLORS } from '../core/players';
import type { Building, BuildPad } from '../entities/Building';
import { MAC, HEAL } from '../data/buildings';
import type { Tower } from '../entities/Tower';
import type { Unit, Squad } from '../entities/Unit';
import type { Enemy } from '../entities/Enemy';
import type { Projectile } from '../entities/Projectile';
import type { TierVisual } from '../core/types';
import type { Cell } from '../systems/PlacementSystem';
import { TOWERS, towerById } from '../data/towers';
const TOWER_BY_SPRITE = (k: string) => TOWERS.find((t) => t.sprite === k);
import { IMG, HEAD_PIVOT, body, flashOf, head, tintOf, type Img } from './sprites';
import { Faction } from '../core/types';
import { Particles, PK, QUALITY_CAPS } from './Particles';
import type { Barrier, EnvStructure, Obstacle } from '../entities/Garrison';
import type { Pickup } from '../entities/Pickup';
import type { Shortcut } from '../systems/Shortcuts';
const hex = (s: string) => parseInt(s.replace('#', '').slice(0, 6), 16);
const FLORA_TOWERS = new Set(['sunflower', 'solar_pea_fusion', 'gatling_cherry_bomber', 'frost_wallnut_bastion', 'flame_melon_mortar', 'repeater_gatling', 'hypno_shroom', 'chomper']);
/** Tower animation state handed to towerImg (wind-up, throw, plant sway). */
export interface TowerAnim { charge: number; since: number; engaged: boolean; }

export interface ViewState {
  placing: string | null;           // tower id being placed
  deploying: string | null;         // unit id being deployed (click sets rally)
  hoverCell: Cell | null;
  mouse: { x: number; y: number } | null;
  selTower: Tower | null;
  selSquad: Squad | null;
  selBuilding: Building | null;
  selPad: BuildPad | null;
  /** Leader power being aimed. */
  power: 'mac' | 'heal' | null;
  /** Barracks whose rally point is being placed. */
  rallyFor: Building | null;
  /** Multi-selection (box select). selSquad is the primary. */
  selSquads: Squad[];
  /** Drag-select box in world coords. */
  box: { x0: number; y0: number; x1: number; y1: number } | null;
  boxMode: boolean; queueMode: boolean; patrolMode: boolean; patrolPts: { x: number; y: number }[];
  showFps: boolean;
}
export interface Camera { x: number; y: number; zoom: number }

const TOWER_PX = 78, UNIT_PX = 44, BLD_PX = 168, HQ_PX = 236, PAD_PX = 120;

export class Renderer {
  readonly ctx: CanvasRenderingContext2D;
  /** Camera: world point at the top-left of the view + zoom (CSS px per world px). */
  readonly cam: Camera = { x: 0, y: 0, zoom: 1 };
  /** View size in CSS px. */
  vw = 1; vh = 1; private dpr = 1;
  /** Pooled particles (trails, sparks, dust, pollen, leaves). */
  readonly parts = new Particles();
  /** 0 = full, 1 = reduced, 2 = minimal (set by the FPS governor in main.ts). */
  quality = 0;
  setQuality(q: number) { this.quality = Math.max(0, Math.min(2, q)); this.parts.cap = QUALITY_CAPS[this.quality]; this.g.dmgNumbers = this.quality < 2; }
  private lastT = 0;
  /** View bounds in world px (culling). */
  private vx0 = 0; private vy0 = 0; private vx1 = 0; private vy1 = 0;
  private inView(x: number, y: number, m = 120) { return x > this.vx0 - m && x < this.vx1 + m && y > this.vy0 - m && y < this.vy1 + m; }
  private shadowSprite: HTMLCanvasElement | null = null;
  private ghosts = new Map<number, number>();
  /** Per-frame draw stats (FPS overlay). */
  drawn = { objs: 0, parts: 0 };
  constructor(readonly canvas: HTMLCanvasElement, readonly g: Game) {
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.cam.zoom = this.minZoom; this.clamp();
  }
  /** Match the backing store to the element size (crisp on HiDPI / mobile). */
  resize() {
    const r = this.canvas.getBoundingClientRect();
    const fit = this.vw > 0 && Math.abs(this.cam.zoom - this.minZoom) < 1e-6;
    this.vw = Math.max(1, r.width || this.canvas.clientWidth || 800); this.vh = Math.max(1, r.height || this.canvas.clientHeight || 500);
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(this.vw * this.dpr), H = Math.round(this.vh * this.dpr);
    if (this.canvas.width !== W || this.canvas.height !== H) { this.canvas.width = W; this.canvas.height = H; }
    // stay "fit to map" across layout changes (HUD panels / rotation) if we were fitted
    if (fit) this.cam.zoom = this.minZoom;
    this.clamp();
  }
  /** Zoom at which the whole map fits the view. */
  get minZoom() { const b = this.bounds; return Math.min(this.vw / (b.x1 - b.x0), this.vh / (b.y1 - b.y0)); }
  private _b: { x0: number; y0: number; x1: number; y1: number } | null = null;
  /** Camera bounds: the map, grown to include every lane entry/exit that lies off the map
   *  (e.g. El Morro's sea lane starts below the image) + a margin, so full zoom-out shows it. */
  get bounds() {
    if (this._b) return this._b;
    const m = this.g.map, P = 70; let x0 = 0, y0 = 0, x1 = m.width, y1 = m.height;
    for (const ln of m.lanes) for (const [x, y] of ln) {
      if (x < 0) x0 = Math.min(x0, x - P); if (y < 0) y0 = Math.min(y0, y - P);
      if (x > m.width) x1 = Math.max(x1, x + P); if (y > m.height) y1 = Math.max(y1, y + P);
    }
    return (this._b = { x0, y0, x1, y1 });
  }
  /** Fill the off-map margin with a mirror of the adjoining map strip (sea continues as sea). */
  private edgeFill(c: CanvasRenderingContext2D, bg: CanvasImageSource & { width: number; height: number }) {
    const b = this.bounds, m = this.g.map, kx = bg.width / m.width, ky = bg.height / m.height;
    const mir = (sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, fx: number, fy: number) => {
      c.save(); c.translate(dx, dy); c.scale(fx, fy); c.drawImage(bg, sx * kx, sy * ky, sw * kx, sh * ky, 0, 0, sw, sh); c.restore();
    };
    const dB = b.y1 - m.height, dT = -b.y0, dR = b.x1 - m.width, dL = -b.x0;
    if (dB > 0) mir(0, m.height - dB, m.width, dB, 0, m.height + dB, 1, -1);
    if (dT > 0) mir(0, 0, m.width, dT, 0, 0, 1, -1);
    if (dR > 0) mir(m.width - dR, 0, dR, m.height, m.width + dR, 0, -1, 1);
    if (dL > 0) mir(0, 0, dL, m.height, 0, 0, -1, 1);
    if (dB > 0 && dL > 0) mir(0, m.height - dB, dL, dB, 0, m.height + dB, -1, -1);
    if (dB > 0 && dR > 0) mir(m.width - dR, m.height - dB, dR, dB, m.width + dR, m.height + dB, -1, -1);
    if (dT > 0 && dL > 0) mir(0, 0, dL, dT, 0, 0, -1, -1);
    if (dT > 0 && dR > 0) mir(m.width - dR, 0, dR, dT, m.width + dR, 0, -1, -1);
    // fade the margin so it reads as "beyond the map edge", not more map
    const fade = (x0: number, y0: number, x1: number, y1: number, rx: number, ry: number, rw: number, rh: number) => {
      const gr = c.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, 'rgba(10,14,20,0.15)'); gr.addColorStop(1, 'rgba(10,14,20,0.8)');
      c.fillStyle = gr; c.fillRect(rx, ry, rw, rh);
    };
    if (dB > 0) fade(0, m.height, 0, b.y1, b.x0, m.height, b.x1 - b.x0, dB);
    if (dT > 0) fade(0, 0, 0, b.y0, b.x0, b.y0, b.x1 - b.x0, dT);
    if (dR > 0) fade(m.width, 0, b.x1, 0, m.width, 0, dR, m.height);
    if (dL > 0) fade(0, 0, b.x0, 0, b.x0, 0, dL, m.height);
  }
  get maxZoom() { return 2.2; }
  clamp() {
    const c = this.cam, b = this.bounds, W = b.x1 - b.x0, H = b.y1 - b.y0;
    c.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, c.zoom));
    const vwW = this.vw / c.zoom, vhW = this.vh / c.zoom;
    c.x = vwW >= W ? b.x0 + (W - vwW) / 2 : Math.max(b.x0, Math.min(b.x1 - vwW, c.x));
    c.y = vhW >= H ? b.y0 + (H - vhW) / 2 : Math.max(b.y0, Math.min(b.y1 - vhW, c.y));
  }
  screenToWorld(sx: number, sy: number) { return { x: this.cam.x + sx / this.cam.zoom, y: this.cam.y + sy / this.cam.zoom }; }
  worldToScreen(wx: number, wy: number) { return { x: (wx - this.cam.x) * this.cam.zoom, y: (wy - this.cam.y) * this.cam.zoom }; }
  /** Zoom keeping the world point under (sx, sy) fixed. */
  zoomAt(sx: number, sy: number, factor: number) {
    const before = this.screenToWorld(sx, sy);
    this.cam.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.cam.zoom * factor));
    this.cam.x = before.x - sx / this.cam.zoom; this.cam.y = before.y - sy / this.cam.zoom;
    this.clamp();
  }
  /** Centre the view on a world point (optionally at a zoom). */
  focus(wx: number, wy: number, zoom?: number) {
    if (zoom) this.cam.zoom = zoom;
    this.clamp();
    this.cam.x = wx - this.vw / this.cam.zoom / 2; this.cam.y = wy - this.vh / this.cam.zoom / 2;
    this.clamp();
  }
  pan(dxScreen: number, dyScreen: number) { this.cam.x += dxScreen / this.cam.zoom; this.cam.y += dyScreen / this.cam.zoom; this.clamp(); }

  draw(v: ViewState) {
    const { ctx: c, g } = this;
    const now = performance.now(), rdt = this.lastT ? Math.min(0.1, (now - this.lastT) / 1000) : 0.016; this.lastT = now;
    const gdt = g.paused ? 0 : rdt * g.speed;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#141a14'; c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const z = this.cam.zoom * this.dpr;
    const sh = g.shakeAmt, sx = sh ? (Math.random() * 2 - 1) * sh : 0, sy = sh ? (Math.random() * 2 - 1) * sh : 0;
    c.setTransform(z, 0, 0, z, (-this.cam.x + sx) * z, (-this.cam.y + sy) * z);
    this.vx0 = this.cam.x; this.vy0 = this.cam.y; this.vx1 = this.cam.x + this.vw / this.cam.zoom; this.vy1 = this.cam.y + this.vh / this.cam.zoom;
    const bg = IMG['map:' + g.map.image];
    if (bg) { this.edgeFill(c, bg as never); c.drawImage(bg, 0, 0, g.map.width, g.map.height); } else { c.fillStyle = '#6aa84f'; c.fillRect(0, 0, g.map.width, g.map.height); }
    for (const sc of g.shortcuts) this.shortcutTrail(sc);
    for (const d of g.decals) if (this.inView(d.x, d.y)) this.decal(d.x, d.y, d.r, d.ang, d.t);
    if (v.placing || v.selTower?.isFarm) this.gridOverlay(v);
    this.auras(v);
    for (const p of g.pads) if (!p.building) this.pad(p, p === v.selPad);
    for (const p of g.pickups) if (this.inView(p.x, p.y)) this.pickup(p);
    // y-sorted world objects (culled)
    const objs: { y: number; f: () => void }[] = [];
    const sel = new Set(v.selSquads);
    for (const b of g.buildings) objs.push({ y: b.y + 30, f: () => this.building(b, b === v.selBuilding) });
    for (const t of g.towers) if (this.inView(t.x, t.y)) objs.push({ y: t.y, f: () => this.tower(t, t === v.selTower) });
    for (const e of g.envs) if (this.inView(e.x, e.y, 160)) objs.push({ y: e.y + 20, f: () => this.env(e, v) });
    for (const o of g.obstacles) if (this.inView(o.x, o.y)) objs.push({ y: o.y, f: () => this.obstacle(o) });
    for (const b of g.barriers) if (this.inView(b.x, b.y)) objs.push({ y: b.y, f: () => this.barrier(b) });
    const mp = g.net !== 'solo';
    for (const u of g.units) if (!u.garrison && this.inView(u.x, u.y)) objs.push({ y: u.y, f: () => { if (mp && g.mode === 'coop') this.ownerRing(u.x, u.y + 12, 13, PCOLORS[u.squad.owner] ?? '#fff'); this.unit(u, sel.has(u.squad) || v.selSquad === u.squad); } });
    for (const e of g.enemies) if (!e.data.flying && this.inView(e.x, e.y)) objs.push({ y: e.y, f: () => this.enemy(e) });
    for (const e of g.allies) if (this.inView(e.x, e.y)) objs.push({ y: e.y, f: () => this.enemy(e) });
    objs.sort((a, b) => a.y - b.y).forEach((o) => o.f());
    this.drawn.objs = objs.length;
    // Auto Army badge: green ⟳ when the squad runs its role AI, amber ⏸ while a manual order overrides it
    for (const q of g.squads) if (q.auto && q.alive) {
      const u = q.units.find((x) => x.alive); if (!u || !this.inView(u.x, u.y)) continue;
      const bx = u.x + 13, by = u.y - 30, c = this.ctx;
      c.beginPath(); c.arc(bx, by, 7.5, 0, Math.PI * 2); c.fillStyle = q.manual ? 'rgba(80,50,0,0.85)' : 'rgba(10,60,30,0.85)'; c.fill();
      c.lineWidth = 2; c.strokeStyle = q.manual ? '#ffc04a' : '#6cf59a'; c.stroke();
      c.fillStyle = q.manual ? '#ffc04a' : '#bfffd5'; c.font = 'bold 10px system-ui,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(q.manual ? 'II' : 'A', bx, by + 0.5); c.textBaseline = 'alphabetic';
    }
    for (const e of g.enemies) if (e.data.flying && this.inView(e.x, e.y)) this.enemy(e);
    this.emitAmbient(gdt);
    for (const p of g.projectiles) if (this.inView(p.x, p.y, 40)) this.projectile(p, gdt);
    for (const a of g.acids) this.acid(a);
    this.parts.update(gdt);
    this.parts.draw(c, this.vx0 - 20, this.vy0 - 20, this.vx1 + 20, this.vy1 + 20);
    this.drawn.parts = this.parts.n;
    for (const e of g.effects) if (e.kind === 'beam' || this.inView(e.x, e.y, 200)) this.effect(e);
    for (const t of g.towers) if (t.sweep) this.sweepFx(t);
    for (const st of g.strikes) this.strike(st, gdt);
    // rally points: barracks always (faint), selected squads full with waypoint / patrol lines
    for (const b of g.buildingsOf('barracks')) if (b !== v.selBuilding) { c.globalAlpha = 0.5; this.flag(b.door, b.rally, '#ffd84a'); c.globalAlpha = 1; }
    for (const q of (v.selSquads.length ? v.selSquads : v.selSquad ? [v.selSquad] : [])) if (q.alive) this.rally(q);
    const rb = v.rallyFor ?? (v.selBuilding?.data.id === 'barracks' ? v.selBuilding : null);
    if (rb) this.flag(rb.door, rb.rally, '#ffd84a');
    if (v.patrolMode) for (let i = 0; i < v.patrolPts.length; i++) { const p = v.patrolPts[i]; this.ringAt(p.x, p.y, 12, '#b6f78f', 3); this.label(p.x, p.y - 18, `${i + 1}`, '#b6f78f', 12); }
    if (v.power === 'mac' && v.mouse) this.macPreview(v.mouse.x, v.mouse.y);
    if (v.power === 'heal' && v.mouse) { c.setLineDash([8, 6]); this.ringAt(v.mouse.x, v.mouse.y, HEAL.radius, '#9ff7b0', 3); c.setLineDash([]); }
    if (v.rallyFor && v.mouse) { c.globalAlpha = 0.7; this.ringAt(v.mouse.x, v.mouse.y, 22, '#ffd84a', 3); c.globalAlpha = 1; }
    if (v.placing && v.mouse && towerById(v.placing).kind === 'path') this.roadGhost(v.placing, v.mouse);
    else if (v.placing && v.hoverCell) this.ghost(v.placing, v.hoverCell);
    if (v.deploying && v.mouse) { c.globalAlpha = 0.7; this.ringAt(v.mouse.x, v.mouse.y, 24, '#7fd3ff', 3); c.globalAlpha = 1; }
    if (v.box) this.dragBox(v.box);
    for (const t of g.telegraphs) this.telegraph(t);
    for (const p of g.pings) this.ping(p);
    this.shockwaves();
  }
  /** Owner colour ellipse under co-op towers / troops. */
  private ownerRing(x: number, y: number, r: number, col: string) {
    const c = this.ctx; c.globalAlpha = 0.85; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, r, r * 0.42, 0, 0, 7); c.stroke();
    c.globalAlpha = 0.18; c.fillStyle = col; c.fill(); c.globalAlpha = 1;
  }
  /** Versus: red pulsing warning where a major / boss card is about to spawn (2 s ahead). */
  private telegraph(t: { x: number; y: number; t: number; dur: number; label: string }) {
    const c = this.ctx, k = t.t / t.dur, pulse = 0.5 + 0.5 * Math.sin(t.t * 14);
    c.globalAlpha = 0.25 + 0.35 * pulse; c.fillStyle = '#ff2a2a'; c.beginPath(); c.arc(t.x, t.y, 70 + 30 * k, 0, 7); c.fill();
    c.globalAlpha = 1; this.ringAt(t.x, t.y, 70 + 30 * k, '#ff4a4a', 4);
    c.setLineDash([10, 8]); this.ringAt(t.x, t.y, 110 - 40 * k, '#ffb0b0', 2); c.setLineDash([]);
    this.label(t.x, t.y - 96, `⚠ ${t.label} in ${Math.max(0, t.dur - t.t).toFixed(1)}s`, '#ff6b6b', 18, 4);
  }
  private ping(p: { x: number; y: number; kind: string; pid: number; t: number }) {
    const c = this.ctx, col = PCOLORS[p.pid] ?? '#fff', k = (p.t % 1.2) / 1.2;
    const info = p.kind === 'defend' ? { icon: '🛡', text: 'DEFEND HERE', c2: '#7fd3ff' } : p.kind === 'attack' ? { icon: '⚔', text: 'ATTACK HERE', c2: '#ffb35a' } : { icon: '⚠', text: 'ENEMY SPAWNING', c2: '#ff6b6b' };
    c.globalAlpha = Math.max(0, 1 - k); this.ringAt(p.x, p.y, 20 + k * 60, info.c2, 4); c.globalAlpha = 1;
    this.ringAt(p.x, p.y, 18, col, 4);
    c.fillStyle = col; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - 10, p.y - 26); c.lineTo(p.x + 10, p.y - 26); c.closePath(); c.fill();
    this.label(p.x, p.y - 40, `${info.icon} ${info.text}`, info.c2, 16, 4);
    this.label(p.x, p.y - 58, `P${p.pid + 1}`, col, 13, 3);
  }
  /** Shockwave ripple: the frame inside an expanding annulus is redrawn slightly magnified
   *  (cheap refraction) plus a bright ring. Screen-space, one drawImage per ripple. */
  private shockwaves() {
    const c = this.ctx, g = this.g;
    if (!g.shocks.length) return;
    const z = this.cam.zoom * this.dpr;
    for (const s of g.shocks) {
      const k = s.t / s.dur, r = s.r * (0.15 + 0.85 * Math.sqrt(k)), w = Math.max(10, s.r * 0.18) * (1 - k * 0.5);
      if (this.quality < 2) {
        const p = this.worldToScreen(s.x, s.y), cx = p.x * this.dpr, cy = p.y * this.dpr, R = r * z, W = w * z, m = 1.06 - 0.04 * k;
        c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
        c.beginPath(); c.arc(cx, cy, R + W, 0, 6.283); c.arc(cx, cy, Math.max(1, R - W), 0, 6.283, true); c.clip();
        c.globalAlpha = 0.9 * (1 - k);
        c.drawImage(this.canvas, cx - cx * m, cy - cy * m, this.canvas.width * m, this.canvas.height * m);
        c.restore();
      }
      c.globalAlpha = 0.7 * (1 - k); c.globalCompositeOperation = 'lighter';
      this.ringAt(s.x, s.y, r, '#fff3d0', Math.max(2, w * 0.35));
      c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    }
  }
  private dragBox(b: { x0: number; y0: number; x1: number; y1: number }) {
    const c = this.ctx, x = Math.min(b.x0, b.x1), y = Math.min(b.y0, b.y1), w = Math.abs(b.x1 - b.x0), h = Math.abs(b.y1 - b.y0);
    const t = this.g.time;
    c.fillStyle = 'rgba(127,211,255,0.12)'; c.fillRect(x, y, w, h);
    c.strokeStyle = '#7fd3ff'; c.lineWidth = 2 / this.cam.zoom; c.setLineDash([8 / this.cam.zoom, 5 / this.cam.zoom]); c.lineDashOffset = -t * 30;
    c.strokeRect(x, y, w, h); c.setLineDash([]); c.lineDashOffset = 0;
    // corner brackets
    c.lineWidth = 3 / this.cam.zoom; const L = Math.min(14 / this.cam.zoom, w / 3, h / 3);
    c.beginPath();
    for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { c.moveTo(cx + dx * L, cy); c.lineTo(cx, cy); c.lineTo(cx, cy + dy * L); }
    c.stroke();
    // highlight troops inside
    for (const u of this.g.units) if (!u.garrison && u.alive && u.data.role !== 'worker' && u.x >= x && u.x <= x + w && u.y >= y && u.y <= y + h) this.ringAt(u.x, u.y + 12, 13, 'rgba(255,255,255,0.8)', 2);
  }
  /** Ambient flora pollen + drifting leaves, Marine dust kick-up. */
  private emitAmbient(dt: number) {
    if (!dt) return;
    const P = this.parts, q = this.quality;
    if (q < 2) for (const t of this.g.towers) {
      if (!FLORA_TOWERS.has(t.data.id) || !this.inView(t.x, t.y, 60)) continue;
      const rate = (t.data.id === 'sunflower' ? 2.6 : 1.1) * (q ? 0.4 : 1) * (1 + t.tier * 0.4);
      if (Math.random() < rate * dt) P.spawn(PK.Pollen, t.x + (Math.random() - 0.5) * 50, t.y - 10 - Math.random() * 30, (Math.random() - 0.5) * 8, -6 - Math.random() * 8, 3 + Math.random() * 2, 1.4 + Math.random(), t.data.id === 'sunflower' ? 0xfff27a : 0xe9ffb0);
      if (Math.random() < rate * 0.35 * dt) P.spawn(PK.Leaf, t.x + (Math.random() - 0.5) * 60, t.y - 30 - Math.random() * 20, 6 + Math.random() * 10, 10 + Math.random() * 8, 3.5, 3 + Math.random() * 2, Math.random() < 0.5 ? 0x6fae3c : 0x9cc94a);
    }
    for (const u of this.g.units) {
      if (!u.moving || u.garrison || u.dropT > 0 || !this.inView(u.x, u.y, 30)) continue;
      const vehicle = !!u.data.vehicle, rate = (vehicle ? 14 : 5) * (q === 2 ? 0.3 : 1);
      if (Math.random() < rate * dt) P.spawn(PK.Dust, u.x + (Math.random() - 0.5) * (vehicle ? 26 : 10), u.y + 13, (Math.random() - 0.5) * 20 - u.facing * 15, -4 - Math.random() * 6, 0.6, vehicle ? 5 : 3, 0xcdb894);
      if (u.stimT > 0 && Math.random() < 10 * dt) P.spawn(PK.Glow, u.x, u.y - 8, (Math.random() - 0.5) * 20, -20, 0.4, 7, 0xff7ad1);
    }
  }
  private sweepFx(t: Tower) {
    const c = this.ctx, a = t.aim, len = t.range(t.t.combat!.range) * 1.35, fx = t.x, fy = t.y - 16, ex = fx + Math.cos(a) * len, ey = fy + Math.sin(a) * len;
    c.save(); c.globalCompositeOperation = 'lighter';
    c.strokeStyle = 'rgba(255,40,70,0.45)'; c.lineWidth = 22; c.beginPath(); c.moveTo(fx, fy); c.lineTo(ex, ey); c.stroke();
    c.strokeStyle = 'rgba(255,200,210,0.95)'; c.lineWidth = 6; c.beginPath(); c.moveTo(fx, fy); c.lineTo(ex, ey); c.stroke();
    c.restore();
    for (let i = 0; i < 4; i++) { const k = Math.random(); this.parts.spawn(PK.Glow, fx + (ex - fx) * k, fy + (ey - fy) * k, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, 0.35, 10, 0xff4466); }
    this.additive(IMG.fx_boom_fire, ex, ey, 60, this.g.time * 4, 0.7);
  }
  private roadGhost(id: string, m: { x: number; y: number }) {
    const spot = this.g.roadSpot(m), d = towerById(id), b = d.tiers[0].barrier!;
    const p = spot ?? m;
    if (b.blastRadius) { this.range(p.x, p.y, b.blastRadius, !!spot); } else this.ringAt(p.x, p.y, 26, spot ? '#b6f78f' : '#ff8a7a', 3);
    this.ctx.globalAlpha = 0.7; const im = body(d.sprite, 0); if (im) { const [w, h] = this.fitWH(im, 58); this.feet(im, p.x, p.y + 16, w, h); } this.ctx.globalAlpha = 1;
  }
  private env(e: EnvStructure, v: ViewState) {
    const im = IMG[e.sprite] ?? body(e.sprite), sz = e.kind === 'watchtower' ? 150 : e.kind === 'garita' ? 120 : 130, footY = e.y + 36;
    this.shadowAt(e.x + 8, footY - 6, sz * 0.46, sz * 0.15, 0.42);
    if (im) { const [w, h] = this.fitWH(im, sz); this.feet(im, e.x, footY, w, h); }
    const n = e.garrisoned.length, slots = e.gSlots();
    const hot = v.selSquads.length > 0 && v.mouse && Math.hypot(v.mouse.x - e.x, v.mouse.y - e.y) < 70;
    if (hot) { this.ctx.setLineDash([6, 5]); this.ringAt(e.x, e.y + 10, 66, '#ffd84a', 2.5); this.ctx.setLineDash([]); }
    this.label(e.x, footY + 10, `${'●'.repeat(n)}${'○'.repeat(slots - n)}`, n ? '#7fd3ff' : 'rgba(255,255,255,0.7)', 11);
    if (hot || n) this.label(e.x, footY - sz * 0.82, `${e.gName()} · −50% dmg · +35% range`, '#fff', 11);
  }
  /** Road colour sampled from the map art (so an opened shortcut matches the roads). */
  private roadCol: string | null = null;
  private roadColor(): string {
    if (this.roadCol) return this.roadCol;
    const bg = IMG['map:' + this.g.map.image];
    if (!bg) return '#8a6c48';
    try {
      const cv = document.createElement('canvas'); cv.width = cv.height = 1;
      const x = cv.getContext('2d')!, P = this.g.paths[0];
      let r = 0, gg = 0, b = 0; const N = 9;
      for (let i = 1; i <= N; i++) {
        const q = P.at(P.length * i / (N + 1));
        x.drawImage(bg, q.x - 4, q.y - 4, 8, 8, 0, 0, 1, 1);
        const d = x.getImageData(0, 0, 1, 1).data; r += d[0]; gg += d[1]; b += d[2];
      }
      this.roadCol = `rgb(${Math.round(r / N)},${Math.round(gg / N)},${Math.round(b / N)})`;
    } catch { this.roadCol = '#8a6c48'; }
    return this.roadCol;
  }
  /** Blocked shortcut: overgrown dashed trail + sign. Open: a real road with direction chevrons. */
  private shortcutTrail(sc: Shortcut) {
    const c = this.ctx, W = this.g.map.pathWidth, z = this.cam.zoom, { a, b } = sc;
    const ang = Math.atan2(b.y - a.y, b.x - a.x), m = sc.mid;
    c.save(); c.lineCap = 'round';
    if (sc.open) {
      c.strokeStyle = 'rgba(40,28,16,0.55)'; c.lineWidth = W + 10; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      c.strokeStyle = this.roadColor(); c.lineWidth = W; c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.08)'; c.lineWidth = W * 0.45; c.stroke();
      // chevrons show the enemy direction
      c.strokeStyle = 'rgba(255,210,122,0.55)'; c.lineWidth = 4;
      const L = sc.length, off = (this.g.time * 40) % 70;
      for (let d = 50 + off; d < L - 40; d += 70) {
        const px = a.x + Math.cos(ang) * d, py = a.y + Math.sin(ang) * d;
        c.beginPath();
        c.moveTo(px - Math.cos(ang - 0.6) * 12, py - Math.sin(ang - 0.6) * 12); c.lineTo(px, py);
        c.lineTo(px - Math.cos(ang + 0.6) * 12, py - Math.sin(ang + 0.6) * 12); c.stroke();
      }
    } else {
      c.setLineDash([W * 0.55, W * 0.4]);
      c.strokeStyle = 'rgba(60,42,24,0.42)'; c.lineWidth = W * 0.8; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      c.setLineDash([10, 12]); c.strokeStyle = 'rgba(255,200,90,0.75)'; c.lineWidth = 3; c.stroke();
      c.setLineDash([]);
      for (const p of [a, b]) { c.fillStyle = 'rgba(255,200,90,0.9)'; c.beginPath(); c.arc(p.x, p.y, 7, 0, 7); c.fill(); }
      const sec = sc.preview.seconds;
      const px = 13 / z;
      this.label(m.x, m.y - 70, '⛔ BLOCKED SHORTCUT', '#ffd27a', Math.max(px, 14));
      this.label(m.x, m.y - 70 + Math.max(px, 14) * 1.25, `clear it: enemies save ~${sec.toFixed(1)}s · troops +35% road`, '#f3e6c8', Math.max(px * 0.85, 11));
    }
    c.restore();
  }
  private obstacle(o: Obstacle) {
    if (o.shortcut) { // rockslide: boulders + a fallen trunk across the trail
      const rock = IMG.obs_rock ?? body('obs_rock'), log = IMG.obs_log ?? body('obs_log');
      this.shadowAt(o.x + 4, o.y + 18, 70, 18, 0.45);
      const fl = o.hitFlash > 0;
      if (log) { const [w, h] = this.fitWH(log, 130); this.feet(fl ? flashOf(log) : log, o.x + 6, o.y + 30, w, h, true); }
      if (rock) { const [w, h] = this.fitWH(rock, 104); this.feet(fl ? flashOf(rock) : rock, o.x - 24, o.y + 22, w, h, false); const [w2, h2] = this.fitWH(rock, 76); this.feet(fl ? flashOf(rock) : rock, o.x + 34, o.y + 16, w2, h2, true); }
      if (o.hp < o.maxHp) this.bar(o.x, o.y - 60, 60, o.hp / o.maxHp, '#c9a36a', o.uid);
      return;
    }
    const im = IMG[o.sprite] ?? body(o.sprite), sz = o.kind === 'log' ? 110 : 84;
    this.shadowAt(o.x + 4, o.y + 14, sz * 0.45, sz * 0.14, 0.4);
    if (im) { const [w, h] = this.fitWH(im, sz); this.feet(o.hitFlash > 0 ? flashOf(im) : im, o.x, o.y + 22, w, h, o.ang > 1.5); }
    if (o.hp < o.maxHp) this.bar(o.x, o.y - sz * 0.45, 46, o.hp / o.maxHp, '#c9a36a', o.uid);
  }
  private barrier(b: Barrier) {
    const c = this.ctx, im = body(b.data.sprite, 0), pod = b.isPod;
    const sz = pod ? 50 : 62, fuse = b.fuse > 0 ? 1 + Math.sin(this.g.time * 40) * 0.08 : 1;
    this.shadowAt(b.x + 3, b.y + 12, sz * 0.4, sz * 0.13, 0.42);
    if (im) { const [w, h] = this.fitWH(im, sz); this.feet(b.hitFlash > 0 ? flashOf(im) : im, b.x, b.y + 16, w, h, false, fuse, fuse); }
    if (b.fuse > 0) { this.additive(IMG.fx_spark, b.x + 8, b.y - sz * 0.7, 26, this.g.time * 9, 0.9); c.globalAlpha = 0.4; this.ringAt(b.x, b.y, b.b.blastRadius!, '#ff7040', 2); c.globalAlpha = 1; }
    if (!pod && b.hp < b.maxHp) this.bar(b.x, b.y - sz * 0.75, 40, b.hp / b.maxHp, '#e3b35a', b.uid);
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
      const a = t.t.aura; if (!a || t.disabled || !this.inView(t.x, t.y, a.radius)) continue;
      const sel = t === v.selTower, r = a.radius * (1 + Math.sin(this.g.time * 1.8 + t.uid) * 0.015);
      const gr = c.createRadialGradient(t.x, t.y, r * 0.15, t.x, t.y, r);
      gr.addColorStop(0, 'rgba(140,255,120,0)'); gr.addColorStop(0.8, sel ? 'rgba(140,255,120,0.16)' : 'rgba(140,255,120,0.07)'); gr.addColorStop(1, sel ? 'rgba(140,255,120,0.3)' : 'rgba(140,255,120,0.14)');
      c.fillStyle = gr; c.beginPath(); c.arc(t.x, t.y, r, 0, 7); c.fill();
      c.setLineDash([3, 7]); this.ringAt(t.x, t.y, r, sel ? 'rgba(170,255,140,0.9)' : 'rgba(170,255,140,0.4)', 2); c.setLineDash([]);
    }
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
  private flag(from: { x: number; y: number }, r: { x: number; y: number }, col: string) {
    const c = this.ctx;
    c.strokeStyle = col; c.lineWidth = 2; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(from.x, from.y); c.lineTo(r.x, r.y); c.stroke(); c.setLineDash([]);
    c.fillStyle = col; c.beginPath(); c.moveTo(r.x, r.y); c.lineTo(r.x, r.y - 30); c.lineTo(r.x + 20, r.y - 23); c.lineTo(r.x, r.y - 16); c.fill();
    c.strokeStyle = '#1d2128'; c.lineWidth = 2; c.beginPath(); c.moveTo(r.x, r.y); c.lineTo(r.x, r.y - 30); c.stroke();
  }
  // ---------------------------------------------------------------- base layer
  private decal(x: number, y: number, r: number, ang: number, t: number) {
    const im = IMG.fx_crater; if (!im) return;
    const c = this.ctx; c.globalAlpha = Math.max(0, Math.min(0.85, (40 - t) / 10));
    this.img(im, x, y, r * 2.1, false, ang); c.globalAlpha = 1;
  }
  private pad(p: BuildPad, sel: boolean) {
    const c = this.ctx, im = IMG.pad_empty;
    if (im) { const [w, h] = this.fitWH(im, PAD_PX); c.drawImage(im, p.x - w / 2, p.y - h / 2, w, h); }
    const pulse = 0.5 + 0.5 * Math.sin(this.g.time * 3 + p.index);
    this.ringAt(p.x, p.y, 50 + pulse * 4, sel ? '#ffd84a' : `rgba(127,211,255,${0.25 + pulse * 0.3})`, sel ? 3 : 2);
    this.label(p.x, p.y, '+', sel ? '#ffd84a' : '#cfeeff', 26);
  }
  private building(b: Building, sel: boolean) {
    const c = this.ctx, g = this.g, px = b.isHQ ? HQ_PX : BLD_PX;
    const tier = Math.max(0, b.tier), vis = b.t.visual, sz = px * (vis.scale ?? 1), footY = b.y + (b.isHQ ? 70 : 46);
    if (sel && b.t.stats.gun) this.range(b.x, b.y, b.t.stats.gun.range);
    if (b.pad && IMG.pad_empty) { const [w, h] = this.fitWH(IMG.pad_empty, PAD_PX); c.drawImage(IMG.pad_empty, b.x - w / 2, b.y - h / 2, w, h); }
    if (vis.glow && b.built) {
      const gr = c.createRadialGradient(b.x, footY - 6, 6, b.x, footY - 6, sz * 0.55);
      gr.addColorStop(0, vis.glow + '88'); gr.addColorStop(1, vis.glow + '00');
      c.fillStyle = gr; c.beginPath(); c.ellipse(b.x, footY - 6, sz * 0.6, sz * 0.24, 0, 0, 7); c.fill();
    }
    this.shadowAt(b.x + 6, footY - 8, sz * 0.48, sz * 0.16, 0.4);
    const im = body(b.data.sprite, tier);
    if (im) {
      const [w, h] = this.fitWH(im, sz);
      if (!b.built) { // first construction: the structure rises out of the scaffold
        const k = b.progress, sc = IMG.pad_build;
        c.save(); c.beginPath(); c.rect(b.x - w, footY - h * k, w * 2, h * k + 4); c.clip();
        c.globalAlpha = 0.55 + 0.45 * k; this.feet(im, b.x, footY, w, h, false, 0.85 + 0.15 * k, 0.85 + 0.15 * k); c.restore(); c.globalAlpha = 1;
        if (sc) { const [sw, sh] = this.fitWH(sc, sz * 0.9); this.feet(sc, b.x, footY + 4, sw, sh); }
      } else {
        const breathe = 1 + Math.sin(g.time * 1.6 + b.uid) * 0.006;
        this.feet(b.hitFlash > 0 ? flashOf(im) : im, b.x, footY, w, h, false, 1, breathe);
        if (b.build && IMG.pad_build) { c.globalAlpha = 0.75; const [sw, sh] = this.fitWH(IMG.pad_build, sz * 0.8); this.feet(IMG.pad_build, b.x + sz * 0.18, footY + 6, sw * 0.6, sh * 0.6); c.globalAlpha = 1; }
        if (b.recoil > 0.5) this.additive(IMG.fx_muzzle, b.x + Math.cos(b.aim) * 34, b.y - 70 + Math.sin(b.aim) * 10, 30 + tier * 8, b.aim, b.recoil);
        if (b.data.id === 'reactor') this.additive(IMG.fx_magic ?? IMG.fx_spark, b.x, footY - h * 0.62, 40 + tier * 14, g.time, 0.3 + 0.2 * Math.sin(g.time * 3));
      }
    }
    if (b.build) this.bar(b.x, footY - sz * 0.92, 70, b.progress, '#ffd84a');
    if (b.built) this.pips(b.x, footY + 10, tier, vis.glow);
    if (b.health.frac < 0.999 || b.isHQ) this.bar(b.x, footY - sz * 0.92 - (b.build ? 9 : 0), b.isHQ ? 110 : 64, b.health.frac, b.isHQ ? '#ff6b6b' : '#5fe06a');
    if (b.data.id === 'barracks' && b.queue.length) {
      const o = b.queue[0];
      this.label(b.x, footY - sz * 0.92 - 16, o.held ? `⏸ ${o.held}` : `🪖 ${Math.round((o.t / o.dur) * 100)}% (+${b.queue.length - 1})`, o.held ? '#ff8a7a' : '#cfeeff', 12);
    }
    if (sel) { c.strokeStyle = '#ffd84a'; c.lineWidth = 2.5; c.setLineDash([7, 5]); c.beginPath(); c.ellipse(b.x, footY - 6, sz * 0.5, sz * 0.2, 0, 0, 7); c.stroke(); c.setLineDash([]); }
  }
  private macStripPath(x: number, y: number, ang: number) {
    const c = this.ctx; c.save(); c.translate(x, y); c.rotate(ang); c.beginPath(); c.rect(-MAC.length / 2, -MAC.width / 2, MAC.length, MAC.width); c.restore();
  }
  private macPreview(mx: number, my: number) {
    const g = this.g, nl = g.nearestLane({ x: mx, y: my });
    const p = g.paths[nl.lane].at(nl.d), on = nl.dist < 160;
    const x = on ? p.x : mx, y = on ? p.y : my, c = this.ctx;
    this.macStripPath(x, y, p.ang);
    c.fillStyle = 'rgba(255,80,40,0.18)'; c.fill(); c.strokeStyle = 'rgba(255,120,60,0.9)'; c.lineWidth = 3; c.setLineDash([12, 8]); c.stroke(); c.setLineDash([]);
  }
  private strike(st: Strike, dt: number) {
    const c = this.ctx;
    if (st.kind === 'mac') {
      if (st.t < MAC.delay) {
        const k = st.t / MAC.delay, pulse = 0.5 + 0.5 * Math.sin(st.t * 30);
        this.macStripPath(st.x, st.y, st.ang);
        c.fillStyle = `rgba(255,60,30,${0.12 + 0.2 * pulse})`; c.fill(); c.strokeStyle = '#ff5030'; c.lineWidth = 3; c.stroke();
        // incoming round: a white-hot streak dropping from orbit
        const ty = st.y - (1 - k) * 900;
        c.save(); c.globalCompositeOperation = 'lighter';
        c.strokeStyle = 'rgba(255,120,60,0.35)'; c.lineWidth = 26 + 20 * k; c.beginPath(); c.moveTo(st.x - 40, ty - 300); c.lineTo(st.x, ty); c.stroke();
        c.strokeStyle = 'rgba(255,240,200,0.9)'; c.lineWidth = 6 + 10 * k; c.stroke(); c.restore();
        if (dt) for (let i = 0; i < 6; i++) { const q = Math.random(); this.parts.spawn(PK.Glow, st.x - 40 * q + (Math.random() - 0.5) * 10, ty - 300 * q, (Math.random() - 0.5) * 40, -40, 0.45, 12 + 10 * k, Math.random() < 0.5 ? 0xffb060 : 0xfff0c0); }
        this.additive(IMG.fx_spark ?? IMG.fx_boom, st.x, ty, 60 + 60 * k, st.t * 5);
      } else if (st.segs < 7) {
        this.additive(IMG.fx_boom_fire, st.x, st.y, MAC.width * 3, st.t, 0.6);
      }
    } else if (st.kind === 'heal' && st.t < 0.7) {
      const k = st.t / 0.7, im = IMG.fx_heal_pod, py = st.y - (1 - k) * 500;
      this.shadowAt(st.x, st.y + 10, 30 * k + 6, 9 * k + 3, 0.4);
      c.setLineDash([6, 6]); this.ringAt(st.x, st.y, HEAL.radius, 'rgba(159,247,176,0.8)', 2); c.setLineDash([]);
      if (im) { const [w, h] = this.fitWH(im, 64); this.feet(im, st.x, py + 14, w, h); }
    }
  }
  private rally(sq: Squad) {
    const c = this.ctx, r = sq.rally, ctr = sq.center;
    c.strokeStyle = '#7fd3ff'; c.lineWidth = 2; c.setLineDash([4, 4]); c.lineDashOffset = -this.g.time * 20;
    c.beginPath(); c.moveTo(ctr.x, ctr.y); c.lineTo(r.x, r.y); c.stroke();
    if (sq.waypoints.length) {
      c.strokeStyle = '#ffd84a'; c.beginPath(); c.moveTo(r.x, r.y); for (const w of sq.waypoints) c.lineTo(w.x, w.y); c.stroke();
      sq.waypoints.forEach((w, i) => { this.ringAt(w.x, w.y, 9, '#ffd84a', 2.5); this.label(w.x, w.y - 15, `${i + 1}`, '#ffd84a', 11); });
    }
    if (sq.patrol) {
      c.strokeStyle = '#b6f78f'; c.beginPath(); sq.patrol.forEach((w, i) => (i ? c.lineTo(w.x, w.y) : c.moveTo(w.x, w.y))); c.closePath(); c.stroke();
      for (const w of sq.patrol) this.ringAt(w.x, w.y, 8, '#b6f78f', 2.5);
    }
    if (sq.garrisonTarget) { c.strokeStyle = '#ffd84a'; c.beginPath(); c.moveTo(ctr.x, ctr.y); c.lineTo(sq.garrisonTarget.x, sq.garrisonTarget.y); c.stroke(); }
    c.setLineDash([]); c.lineDashOffset = 0;
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
  /** Soft contact shadow from one cached radial sprite (no per-call gradient). */
  private shadowAt(x: number, y: number, rx: number, ry: number, a = 0.3) {
    if (!this.shadowSprite) {
      const s = document.createElement('canvas'); s.width = s.height = 64;
      const x2 = s.getContext('2d')!, gr = x2.createRadialGradient(32, 32, 1, 32, 32, 32);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      x2.fillStyle = gr; x2.fillRect(0, 0, 64, 64); this.shadowSprite = s;
    }
    const c = this.ctx, ga = c.globalAlpha; c.globalAlpha = ga * a;
    c.drawImage(this.shadowSprite, x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ga;
  }
  private additive(im: Img | undefined, x: number, y: number, sz: number, rot = 0, alpha = 1) {
    if (!im) return; const c = this.ctx, [w, h] = this.fitWH(im, sz);
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha *= alpha; c.translate(x, y); if (rot) c.rotate(rot); c.drawImage(im, -w / 2, -h / 2, w, h); c.restore();
  }
  /** Tower art: painted 3/4 body (flips to face the target), turret heads rotate on their base,
   *  idle breathing, fire recoil (squash + kick back), muzzle flash for gun-type towers. */
  private towerImg(key: string, tier: number, x: number, y: number, vis: TierVisual, aim: number, flash: boolean, recoil = 0, phase = 0, an?: TowerAnim) {
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
    const flip = Math.cos(aim) < -0.2, dir = flip ? -1 : 1;
    const sq = recoil * 0.07; // squash on fire
    const flora = td?.faction === Faction.Flora, monkey = td?.faction === Faction.Primates && td.id !== 'super_monkey' && td.kind === 'combat';
    const ch = an ? an.charge : 0, wind = ch > 0 ? ch * ch : 0; // eased wind-up
    const since = an ? an.since : 9, thr = since < 0.28 ? 1 - since / 0.28 : 0; // follow-through after a shot
    if (flora) {
      // plants: idle sway about the root, coil back during wind-up, snap forward on fire
      const sway = Math.sin(time * 1.7) * 0.045 + Math.sin(time * 3.9) * 0.015;
      const rot = sway - dir * wind * 0.16 + dir * thr * thr * 0.2;
      this.feet(img, x, footY, w, h, flip, breathe + sq * 0.5 + wind * 0.04, breathe - sq - wind * 0.06, rot);
    } else if (monkey && an) {
      // part-based monkey: legs/base band static, torso + arms band pivots at the waist.
      // Wind-up = arm drawn back, fire = overhand throw arc, then settle; idle = breathing + look.
      const tilt = Math.max(-0.18, Math.min(0.18, Math.sin(aim) * 0.22)) * dir; // aim the weapon up/down
      const idle = an.engaged ? 0 : Math.sin(time * 0.9) * 0.05;
      const upRot = tilt - dir * wind * 0.26 + dir * thr * Math.sin(thr * Math.PI) * 0.42 + idle;
      this.splitFeet(img, x - dir * recoil * 3, footY + hover, w, h, flip, upRot, breathe - sq);
    } else this.feet(img, x - dir * recoil * 3, footY + hover, w, h, flip, breathe + sq * 0.6 + wind * 0.03, breathe - sq - wind * 0.04);
    if (td?.id === 'hypno_shroom') this.additive(IMG.fx_magic, x, footY - h * 0.75, 22 + tier * 8 + Math.sin(time * 4) * 4, time * 1.5, 0.35 + wind * 0.5);
    if (td?.id === 'tesla_coil' && (wind > 0.2 || thr > 0)) this.additive(IMG.fx_spark, x, footY - h * 0.92, 26 + tier * 8, time * 9, 0.4 + wind * 0.6);
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
  /** Two-part body: bottom 46% (legs / base) drawn upright, top part rotated around the waist
   *  so arms + weapon visibly swing, aim and throw. Slight overlap hides the seam. */
  private splitFeet(im: Img, x: number, footY: number, w: number, h: number, flip: boolean, upRot: number, sy = 1) {
    const c = this.ctx, iw = im.width, ih = im.height, cut = 0.54, ov = 0.04;
    c.save(); c.translate(x, footY); c.scale(flip ? -1 : 1, sy);
    c.drawImage(im, 0, ih * cut, iw, ih * (1 - cut), -w / 2, -h * (1 - cut), w, h * (1 - cut)); // legs
    c.translate(0, -h * (1 - cut)); c.rotate(flip ? -upRot : upRot);
    c.drawImage(im, 0, 0, iw, ih * (cut + ov), -w / 2, -h * cut, w, h * (cut + ov)); // torso + arms
    c.restore();
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
    if (this.g.net !== 'solo' && this.g.mode === 'coop') this.ownerRing(t.x, t.y + 18, 30, PCOLORS[t.owner] ?? '#fff');
    if (t.disabled) c.globalAlpha = 0.55;
    this.towerImg(t.data.sprite, t.tier, t.x, t.y, t.t.visual, t.aimVis, false, t.recoil, (t.uid % 7) * 0.9, { charge: t.charge, since: t.sinceFire, engaged: t.engaged });
    if (t.hypno) { const n = t.hypno.mine.filter((e) => e.alive).length; if (n) this.label(t.x, t.y - 44, '🌀'.repeat(n), '#ff7ae6', 11); }
    c.globalAlpha = 1;
    this.pips(t.x, t.y + 26, t.tier, t.t.visual.glow);
    if (t.health.frac < 0.999 || (this.g.net !== 'solo' && this.g.mode === 'coop')) this.bar(t.x, t.y - 38, 40, t.health.frac, t.disabled ? '#888' : this.g.net !== 'solo' && this.g.mode === 'coop' ? PCOLORS[t.owner] ?? '#5fe06a' : '#5fe06a', t.uid);
    if (t.disabled) this.label(t.x, t.y - 46, 'OFFLINE', '#ff8a7a');
    if (t.garrisoned.length) this.label(t.x, t.y + 40, '●'.repeat(t.garrisoned.length) + '○'.repeat(Math.max(0, t.gSlots() - t.garrisoned.length)), '#7fd3ff', 11);
    if (t.farm && t.farm.crates > 0) { const n = Math.min(6, Math.ceil(t.farm.crates / 15)); for (let i = 0; i < n; i++) if (IMG.fx_crate) this.img(IMG.fx_crate, t.x + 26 + (i % 2) * 12, t.y + 14 - Math.floor(i / 2) * 11, 18); this.label(t.x + 32, t.y - 24, `¢${t.farm.crates}`, '#ffe14d', 11); }
    if (t.data.ability && t.abilityCd <= 0) this.additive(IMG.fx_spark, t.x, t.y - 46, 22 + Math.sin(this.g.time * 6) * 4, this.g.time * 2, 0.8);
    if (sel || t.pulse > 0) {
      const pu = t.pulse; c.strokeStyle = pu > 0 ? `rgba(255,${Math.round(220 - pu * 120)},120,${0.6 + pu * 0.4})` : '#fff'; c.lineWidth = 2 + pu * 3;
      c.setLineDash(sel ? [5, 4] : []); c.beginPath(); c.ellipse(t.x, t.y + 18, 30 + pu * 10, 12 + pu * 4, 0, 0, 7); c.stroke(); c.setLineDash([]);
    }
  }
  private pips(x: number, y: number, tier: number, glow?: string) {
    const c = this.ctx;
    for (let i = 0; i <= tier; i++) {
      const px = x + (i - tier / 2) * 10;
      c.fillStyle = tier === 0 ? '#ddd' : glow ?? '#ffd24a'; c.strokeStyle = '#1d2128'; c.lineWidth = 1.5;
      c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 2 : 4.6; c.lineTo(px + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke();
    }
  }
  /** Crisp health bar: pixel-snapped (in screen space), dark frame, damage ghost that drains behind. */
  private bar(x: number, y: number, w: number, f: number, col: string, id?: number) {
    const c = this.ctx, z = this.cam.zoom, px = 1 / z;
    f = Math.max(0, Math.min(1, f));
    let gf = f;
    if (id !== undefined) { const prev = this.ghosts.get(id) ?? f; gf = prev > f ? prev - Math.max(0.004, (prev - f) * 0.06) : f; this.ghosts.set(id, gf); if (this.ghosts.size > 3000) this.ghosts.clear(); }
    const sn = (v: number) => Math.round(v * z) / z;
    const h = Math.max(4, 5 * px), X = sn(x - w / 2), Y = sn(y);
    c.fillStyle = 'rgba(8,10,14,0.85)'; c.fillRect(X - px, Y - px, sn(w) + 2 * px, h + 2 * px);
    if (gf > f) { c.fillStyle = 'rgba(255,255,255,0.75)'; c.fillRect(X, Y, sn(w * gf), h); }
    c.fillStyle = col; c.fillRect(X, Y, sn(w * f), h);
    c.fillStyle = 'rgba(255,255,255,0.28)'; c.fillRect(X, Y, sn(w * f), h * 0.4);
  }
  /** Damage-number screen sizes drawn since the last reset (test hook). */
  dmgPxSeen = { min: Infinity, max: 0, n: 0 };
  private label(x: number, y: number, s: string, col: string, size = 12, stroke = 3) {
    const c = this.ctx; c.font = `bold ${size}px Fredoka, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineWidth = stroke; c.strokeStyle = 'rgba(0,0,0,0.75)'; c.strokeText(s, x, y); c.fillStyle = col; c.fillText(s, x, y);
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
    if (sel || u.hitPulse > 0 || u.squad.pulse > 0) {
      const pu = Math.max(u.hitPulse, u.squad.pulse);
      const col = u.squad.pulse > u.hitPulse ? `rgba(127,232,255,${0.5 + pu * 0.5})` : u.hitPulse > 0 ? `rgba(255,${Math.round(200 - pu * 140)},${Math.round(200 - pu * 140)},${0.55 + pu * 0.45})` : '#7fd3ff';
      c.strokeStyle = col; c.lineWidth = 2 + pu * 2; c.beginPath(); c.ellipse(u.x, footY - 2, sz * 0.45 + pu * 6, sz * 0.18 + pu * 2, 0, 0, 7); c.stroke();
    }
    if (u.beamTo && u.beamTo.alive) {
      c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(255,60,40,0.5)'; c.lineWidth = 7; c.beginPath(); c.moveTo(u.x + u.facing * 10, u.y - 12); c.lineTo(u.beamTo.x, u.beamTo.y); c.stroke();
      c.strokeStyle = 'rgba(255,230,220,0.95)'; c.lineWidth = 2; c.stroke(); c.restore();
      if (Math.random() < 0.5) this.parts.spawn(PK.Glow, u.beamTo.x, u.beamTo.y, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, 0.3, 8, 0xff5040);
    }
    if (im) {
      const [w, h] = this.fitWH(im, sz);
      const hop = Math.abs(Math.sin(st.walk)) * 2.6 * st.moving;
      const sway = Math.sin(st.walk) * 0.07 * st.moving;
      const breathe = 1 + Math.sin(g.time * 2.6 + u.uid) * 0.015 * (1 - st.moving);
      const atk = u.attackAnim > 0 ? Math.min(1, u.attackAnim / 0.18) : 0;
      const ranged = t.stats.range >= 60, dir = u.facing < 0 ? -1 : 1;
      const lunge = ranged ? -atk * 2 : atk * 6, rot = sway + (ranged ? 0 : atk * 0.18 * dir);
      if (u.data.vehicle) this.feet(im, u.x + lunge * dir, footY - hop * 0.4 - Math.sin(st.walk * 3) * 0.8 * st.moving, w, h, u.facing < 0, 1, breathe, sway * 0.3);
      else this.limbs(im, u.x + lunge * dir, footY - hop, w, h, u.facing < 0, breathe, rot, st.walk, st.moving, ranged ? -atk * 0.12 : atk * 0.3);
      if (ranged && atk > 0.35 && !u.isWorker) this.additive(IMG.fx_muzzle, u.x + dir * w * 0.5, footY - hop - h * 0.66, 16 + tier * 3, dir < 0 ? Math.PI : 0, atk);
    }
    if (u.health.frac < 0.999) this.bar(u.x, u.y - sz * 0.75, 24, u.health.frac, '#7fd3ff', u.uid);
    if (u.stars) this.label(u.x, u.y - sz * 0.75 - (u.health.frac < 0.999 ? 9 : 2), '★'.repeat(u.stars), '#ffd84a', 10);
    if (u.isWorker && (u as Unit & { status?: string }).status && (u as Unit & { status: string }).status !== 'idle')
      this.label(u.x, u.y - sz * 0.9, ({ 'organizing farms': '🧹', collecting: '¢', repairing: '🔧' } as Record<string, string>)[(u as Unit & { status: string }).status] ?? '', '#ffe14d', 12);
  }

  /** Troop rig: legs band skews alternately with the walk phase (stride), torso bobs and
   *  counter-rotates (arm swing), weapon arm kicks on recoil / swings on melee. */
  private limbs(im: Img, x: number, footY: number, w: number, h: number, flip: boolean, breathe: number, rot: number, walk: number, moving: number, arm: number) {
    const c = this.ctx, iw = im.width, ih = im.height, cut = 0.62;
    const stride = Math.sin(walk) * 0.32 * moving, f = flip ? -1 : 1;
    c.save(); c.translate(x, footY); if (rot) c.rotate(rot); c.scale(f, 1);
    // legs: two half-width slices sheared in opposite directions = alternating steps
    const lh = h * (1 - cut);
    for (let side = 0; side < 2; side++) {
      const sk = (side ? -stride : stride);
      c.save(); c.transform(1, 0, sk, 1, 0, 0);
      c.drawImage(im, side * iw / 2, ih * cut, iw / 2, ih * (1 - cut), -w / 2 + side * w / 2, -lh, w / 2, lh);
      c.restore();
    }
    c.translate(0, -lh); c.scale(1, breathe); c.rotate(-stride * 0.18 + arm);
    c.drawImage(im, 0, 0, iw, ih * (cut + 0.04), -w / 2, -h * cut, w, h * (cut + 0.04));
    c.restore();
  }
  // ---------------------------------------------------------------- enemies
  /** Bloons float (bob + sway, string wiggle via rotation); bugs scuttle (stride-synced
   *  bob + alternating squash that reads as leg motion) and flip to face their heading. */
  private enemy(e: Enemy) {
    if (e.smokeT > 0) { this.ctx.globalAlpha = 0.4; this.enemyBody(e); this.ctx.globalAlpha = 1; return; }
    if (e.surgeT > 0) { const c = this.ctx; c.globalAlpha = 0.5; c.fillStyle = '#ff9a2a'; c.beginPath(); c.ellipse(e.x - Math.cos(e.ang) * 14, e.y - Math.sin(e.ang) * 14 + 6, e.data.radius * 1.4, e.data.radius * 0.6, e.ang, 0, 7); c.fill(); c.globalAlpha = 1; }
    this.enemyBody(e);
  }
  private enemyBody(e: Enemy) {
    const c = this.ctx, d = e.data, im0 = body(d.sprite), time = this.g.time + (e.uid % 13) * 0.7;
    const im = im0 && e.ally ? tintOf(im0, '#ff3fd2') : im0;
    if (d.bossKit && e.bossPhase >= 2) { const R = d.size * 0.55; c.globalAlpha = 0.35 + 0.2 * Math.sin(time * 8); this.additive(IMG.fx_spark, e.x, e.y, R * 2.2, time, e.bossPhase === 3 ? 0.9 : 0.5); c.globalAlpha = 1; }
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
    if (e.shield > 0) { // energy dome
      const k = e.shield / e.maxShield, R = Math.max(w, h) * 0.62, gr = c.createRadialGradient(e.x, e.y - 4, R * 0.5, e.x, e.y - 4, R);
      gr.addColorStop(0, 'rgba(120,230,255,0)'); gr.addColorStop(0.85, `rgba(120,230,255,${0.18 + 0.2 * k})`); gr.addColorStop(1, `rgba(200,250,255,${0.5 + 0.3 * k})`);
      c.fillStyle = gr; c.beginPath(); c.arc(e.x, e.y - 4, R, 0, 7); c.fill();
      c.globalAlpha = 0.5 + 0.3 * Math.sin(time * 6); this.ringAt(e.x, e.y - 4, R, '#bff4ff', 1.5); c.globalAlpha = 1;
    }
    if (e.armor > 0.05 && !bug) this.label(e.x + w * 0.4, e.y - h * 0.4, '⛨', '#cfd6de', 11);
    else if (e.armor > 0.05) { c.globalAlpha = 0.85; this.label(e.x + w * 0.42, e.y - h * 0.5, '⛨', e.armor < (d.armored ?? 0) ? '#ff9a6a' : '#cfd6de', 12); c.globalAlpha = 1; }
    if (e.stunT > 0) for (let i = 0; i < 3; i++) { const a = time * 5 + i * 2.1; this.label(e.x + Math.cos(a) * 14, e.y - h * 0.6 + Math.sin(a) * 4, '✦', '#fff27a', 10); }
    if (d.air) { this.shadowAt(e.x, e.y + h + 26, w * 0.35, w * 0.1, 0.25); }
    if (e.ally) { // hypnotized: swirl + magenta ring, fights for you
      c.globalAlpha = 0.8; this.ringAt(e.x, e.y + h * 0.3, d.radius + 6, '#ff4dd8', 2); c.globalAlpha = 1;
      this.label(e.x, e.y - h * 0.6 - 14, '🌀', '#ff7ae6', 13);
      this.bar(e.x, e.y - h * 0.6 - 4, 28, e.hp / e.maxHp, '#ff7ae6', e.uid);
      return;
    }
    if (e.empT > 0) { c.globalAlpha = 0.6; this.ringAt(e.x, e.y, d.radius + 8, '#7fe8ff', 2); c.globalAlpha = 1; }
    if (e.maxShield > 0 && e.shield > 0) this.bar(e.x, e.y - h * 0.6 - 10, d.boss ? 70 : 28, e.shield / e.maxShield, '#7fe8ff');
    if (d.boss || (e.maxHp > 1 && e.hp < e.maxHp)) this.bar(e.x, e.y - h * 0.6 - 4, d.boss ? 70 : 28, e.hp / e.maxHp, d.boss ? '#ff5a5a' : '#ffb347', e.uid);
    void footY;
  }

  // ---------------------------------------------------------------- projectiles & fx
  private projectile(p: Projectile, dt: number) {
    const c = this.ctx, k = p.o.kind, s = p.o.scale ?? 1, y = p.y - p.height;
    const ang = Math.atan2(p.vy, p.vx);
    // glowing trails on high-tier / magical shots
    if (dt && this.quality < 2) {
      const trail: Record<string, number> = { magic: 0xc77dff, star: 0xffe066, flak: 0xffa040, glue: 0xa6ff4d, seed: 0xb6f78f, gpea: 0xff5a5a, melon: 0xff8a3a };
      const col = trail[k] ?? (s > 1.3 ? 0xfff0b0 : 0);
      if (col && Math.random() < (this.quality ? 0.5 : 1)) this.parts.spawn(k === 'melon' ? PK.Ember : PK.Glow, p.x + (Math.random() - 0.5) * 4, y + (Math.random() - 0.5) * 4, -p.vx * 0.05 + (Math.random() - 0.5) * 20, -p.vy * 0.05 + (Math.random() - 0.5) * 20, 0.35, (k === 'magic' ? 9 : 6) * s, col);
    }
    switch (k) {
      case 'flak': this.additive(IMG.fx_boom_fire, p.x, y, 16 * s, p.spin, 0.9); c.fillStyle = '#ffd08a'; c.beginPath(); c.arc(p.x, y, 3, 0, 7); c.fill(); break;
      case 'glue': c.fillStyle = '#9be04a'; c.beginPath(); c.ellipse(p.x, y, 7 * s, 5 * s, ang, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(p.x - 2, y - 2, 2, 0, 7); c.fill(); break;
      case 'seed': this.additive(IMG.fx_pea, p.x, y, 18 * s, ang); break;
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
      case 'boomerang': { // spinning crescent
        c.save(); c.translate(p.x, y); c.rotate(p.spin * 1.6);
        c.fillStyle = '#d7a35a'; c.strokeStyle = '#6b4a22'; c.lineWidth = 1.5;
        c.beginPath(); c.arc(0, 0, 11 * s, 0.2, Math.PI - 0.2); c.arc(0, 3 * s, 8 * s, Math.PI - 0.35, 0.35, true); c.closePath(); c.fill(); c.stroke(); c.restore(); break;
      }
      case 'arrow':
        c.strokeStyle = '#6b4a22'; c.lineWidth = 2; c.beginPath(); c.moveTo(p.x, y); c.lineTo(p.x - Math.cos(ang) * 18, y - Math.sin(ang) * 18); c.stroke();
        c.fillStyle = '#d9dde2'; c.beginPath(); c.moveTo(p.x + Math.cos(ang) * 5, y + Math.sin(ang) * 5); c.lineTo(p.x + Math.cos(ang + 2.4) * 5, y + Math.sin(ang + 2.4) * 5); c.lineTo(p.x + Math.cos(ang - 2.4) * 5, y + Math.sin(ang - 2.4) * 5); c.fill(); break;
      case 'shell':
        this.additive(IMG.fx_boom_fire, p.x - Math.cos(ang) * 8, y - Math.sin(ang) * 8, 18, p.spin, 0.6);
        c.fillStyle = '#3a3f45'; c.beginPath(); c.ellipse(p.x, y, 6, 4, ang, 0, 7); c.fill(); break;
      default: c.fillStyle = '#ffe08a'; c.beginPath(); c.arc(p.x, y, 3 * s, 0, 7); c.fill();
    }
  }
  private acid(a: { x: number; y: number; tx: number; ty: number; t: number }) {
    const x = a.x + (a.tx - a.x) * a.t, y = a.y + (a.ty - a.y) * a.t - Math.sin(a.t * Math.PI) * 110;
    this.additive(IMG.fx_acid, x, y, 30, a.t * 6);
  }
  private pickup(p: Pickup) {
    const { x, y, age } = p, bob = Math.sin(age * 4) * 2;
    if (p.kind === 'orb') {
      const pulse = 1 + Math.sin(age * 6) * 0.12;
      this.shadowAt(x, y + 14, 10, 3, 0.25);
      this.ctx.drawImage(this.parts.glow(0xfff27a), x - 18 * pulse, y - 18 * pulse + bob - 6, 36 * pulse, 36 * pulse);
      this.additive(IMG.fx_star, x, y + bob - 6, 16, age * 2, 0.9);
      if (Math.random() < 0.15) this.parts.spawn(PK.Glow, x, y - 6, (Math.random() - 0.5) * 20, -15, 0.5, 5, 0xfff27a);
      return;
    }
    if (p.kind === 'scrap') {
      const im = IMG.fx_scrap; this.shadowAt(x, y + 8, 12, 4, 0.35);
      if (age > 16) this.ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(age * 10));
      if (im) this.img(im, x, y, 26, false, (p.uid % 5) * 0.6); else { this.ctx.fillStyle = '#8a8f96'; this.ctx.fillRect(x - 7, y - 5, 14, 10); }
      this.ctx.globalAlpha = 1; return;
    }
    const im = IMG.fx_crate; if (!im) return;
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
        if ((e as Effect & { jag?: number }).jag) { // lightning: re-jittered zig-zag each frame
          c.strokeStyle = e.color ?? '#9fe7ff'; c.lineWidth = (e.width ?? 2) * (1 - k * 0.5); c.globalCompositeOperation = 'lighter';
          c.beginPath(); c.moveTo(e.x, e.y); const n = 7;
          for (let i = 1; i < n; i++) { const q = i / n; c.lineTo(e.x + (e.x2! - e.x) * q + (Math.random() - 0.5) * 16, e.y + (e.y2! - e.y) * q + (Math.random() - 0.5) * 16); }
          c.lineTo(e.x2!, e.y2!); c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 1; c.stroke(); c.globalCompositeOperation = 'source-over';
          this.additive(IMG.fx_spark, e.x2!, e.y2!, 22, k * 5, 0.9); break;
        }
        c.strokeStyle = e.color ?? '#fff'; c.lineWidth = (e.width ?? 2) * (1 - k * 0.5); c.shadowColor = e.color ?? '#fff'; c.shadowBlur = 10;
        c.beginPath(); c.moveTo(e.x, e.y); c.lineTo(e.x2!, e.y2!); c.stroke(); c.shadowBlur = 0;
        c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = Math.max(1, (e.width ?? 2) * 0.35); c.beginPath(); c.moveTo(e.x, e.y); c.lineTo(e.x2!, e.y2!); c.stroke();
        if ((e.width ?? 2) >= 4) { c.globalAlpha = 1; this.additive(IMG.fx_spark, e.x, e.y, 34, k * 3, 1 - k); }
        if ((e.width ?? 2) >= 4 && k < 0.2 && this.quality < 2) for (let i = 0; i < 2; i++) { const q = Math.random(); this.parts.spawn(PK.Glow, e.x + (e.x2! - e.x) * q, e.y + (e.y2! - e.y) * q, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 0.3, 8, hex(e.color ?? '#ffffff')); }
        if (k < 0.2) { c.globalAlpha = 1; this.additive(IMG.fx_spark, e.x2!, e.y2!, 14 + (e.width ?? 2) * 3, k * 5, 0.8); }
        break;
      }
      case 'dust': c.fillStyle = e.color ?? '#e8d8b0'; for (let i = 0; i < 5; i++) { const a = i * 1.26; c.beginPath(); c.arc(e.x + Math.cos(a) * (e.r ?? 20) * k, e.y + Math.sin(a) * 6 * k, 5 * (1 + k), 0, 7); c.fill(); } break;
      case 'pod': this.ringAt(e.x, e.y + 10, (e.r ?? 24) * (0.4 + k), e.color ?? '#9fb3c8', 4); break;
      case 'dmg': { // floating damage number: pop-in scale, rise, fade
        c.globalAlpha = k < 0.7 ? 1 : (1 - k) / 0.3;
        const pop = k < 0.15 ? 0.6 + k / 0.15 * 0.6 : 1.2 - Math.min(0.2, (k - 0.15));
        // Zoom-independent: size is chosen in SCREEN pixels (clamped to a readable
        // minimum when zoomed out) and converted back to world units.
        const z = this.cam.zoom, px = dmgTextPx(z, !!e.crit, e.hits ?? 1), sz = px * pop / z;
        this.dmgPxSeen.min = Math.min(this.dmgPxSeen.min, px); this.dmgPxSeen.max = Math.max(this.dmgPxSeen.max, px); this.dmgPxSeen.n++;
        this.label(e.x + (e.vx ?? 0) * k / z, e.y - 10 / z - k * 30 / z, e.text ?? '', e.color ?? '#fff', sz, Math.max(2, sz * 0.22));
        break;
      }
      case 'emp': {
        c.globalAlpha = 1 - k; const R = (e.r ?? 100) * (0.2 + 0.8 * Math.sqrt(k));
        const gr = c.createRadialGradient(e.x, e.y, R * 0.6, e.x, e.y, R);
        gr.addColorStop(0, 'rgba(127,232,255,0)'); gr.addColorStop(1, 'rgba(127,232,255,0.45)');
        c.fillStyle = gr; c.beginPath(); c.arc(e.x, e.y, R, 0, 7); c.fill(); this.ringAt(e.x, e.y, R, '#dff9ff', 3);
        for (let i = 0; i < 8; i++) { const a = i * 0.785 + k * 3; c.strokeStyle = '#bff4ff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(e.x + Math.cos(a) * R * 0.3, e.y + Math.sin(a) * R * 0.3); c.lineTo(e.x + Math.cos(a + 0.2) * R * 0.7, e.y + Math.sin(a - 0.1) * R * 0.7); c.lineTo(e.x + Math.cos(a) * R, e.y + Math.sin(a) * R); c.stroke(); }
        break;
      }
      default: break;
    }
    c.globalAlpha = 1;
  }
}

/** Damage-number sizing (screen px). Scales gently with zoom but is clamped so
 *  numbers stay readable fully zoomed out and never balloon when zoomed in.
 *  Aggregated numbers (many merged hits) grow a little. */
export const DMG_TEXT = { base: 15, critBase: 20, min: 14, critMin: 18, max: 24, critMax: 30 };
export function dmgTextPx(zoom: number, crit: boolean, hits = 1): number {
  const T = DMG_TEXT, grow = 1 + Math.min(0.35, Math.log2(Math.max(1, hits)) * 0.08);
  const raw = (crit ? T.critBase : T.base) * Math.sqrt(Math.max(0.05, zoom));
  return Math.max(crit ? T.critMin : T.min, Math.min(crit ? T.critMax : T.max, raw)) * grow;
}
