// =============================================================================
// Pooled particle system (struct-of-arrays, zero allocation per frame).
// Kinds: glow sparks / trails (additive, cached radial sprites), dust puffs,
// pollen & leaves (ambient near flora). Hard cap scales with quality level.
// =============================================================================
export const enum PK { Glow = 0, Dust = 1, Pollen = 2, Leaf = 3, Ember = 4 }
const CAP = 2400;
export const QUALITY_CAPS = [2000, 900, 350];

export class Particles {
  readonly x = new Float32Array(CAP); readonly y = new Float32Array(CAP);
  readonly vx = new Float32Array(CAP); readonly vy = new Float32Array(CAP);
  readonly life = new Float32Array(CAP); readonly max = new Float32Array(CAP);
  readonly size = new Float32Array(CAP); readonly kind = new Uint8Array(CAP);
  readonly color = new Uint32Array(CAP); readonly rot = new Float32Array(CAP);
  n = 0;
  /** Current cap (lowered by the FPS governor). */
  cap = QUALITY_CAPS[0];
  private glowCache = new Map<number, HTMLCanvasElement>();
  spawn(k: PK, x: number, y: number, vx: number, vy: number, life: number, size: number, rgb: number) {
    if (this.n >= this.cap) {
      if (k === PK.Pollen || k === PK.Leaf) return; // ambient first to go
      // overwrite the oldest-ish slot (cheap ring behaviour)
      const i = (Math.random() * this.n) | 0; this.set(i, k, x, y, vx, vy, life, size, rgb); return;
    }
    this.set(this.n++, k, x, y, vx, vy, life, size, rgb);
  }
  private set(i: number, k: PK, x: number, y: number, vx: number, vy: number, life: number, size: number, rgb: number) {
    this.x[i] = x; this.y[i] = y; this.vx[i] = vx; this.vy[i] = vy; this.life[i] = life; this.max[i] = life;
    this.size[i] = size; this.kind[i] = k; this.color[i] = rgb; this.rot[i] = Math.random() * 6.28;
  }
  update(dt: number) {
    let i = 0;
    while (i < this.n) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this.copy(--this.n, i); continue; }
      const k = this.kind[i];
      if (k === PK.Dust) { this.vx[i] *= 1 - 2.5 * dt; this.vy[i] *= 1 - 2.5 * dt; this.size[i] += dt * 10; }
      else if (k === PK.Pollen) { this.vx[i] += Math.sin(this.life[i] * 3 + i) * 12 * dt; }
      else if (k === PK.Leaf) { this.vx[i] += Math.sin(this.life[i] * 2 + i) * 30 * dt; this.rot[i] += dt * 3; }
      else if (k === PK.Ember) { this.vy[i] -= 30 * dt; }
      this.x[i] += this.vx[i] * dt; this.y[i] += this.vy[i] * dt;
      i++;
    }
  }
  private copy(from: number, to: number) {
    this.x[to] = this.x[from]; this.y[to] = this.y[from]; this.vx[to] = this.vx[from]; this.vy[to] = this.vy[from];
    this.life[to] = this.life[from]; this.max[to] = this.max[from]; this.size[to] = this.size[from];
    this.kind[to] = this.kind[from]; this.color[to] = this.color[from]; this.rot[to] = this.rot[from];
  }
  /** Cached soft radial glow sprite per colour (built once, drawn with drawImage). */
  glow(rgb: number): HTMLCanvasElement {
    let c = this.glowCache.get(rgb);
    if (!c) {
      c = document.createElement('canvas'); c.width = c.height = 32;
      const x = c.getContext('2d')!, r = (rgb >> 16) & 255, g = (rgb >> 8) & 255, b = rgb & 255;
      const gr = x.createRadialGradient(16, 16, 0, 16, 16, 16);
      gr.addColorStop(0, `rgba(255,255,255,1)`); gr.addColorStop(0.25, `rgba(${r},${g},${b},0.9)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = gr; x.fillRect(0, 0, 32, 32);
      this.glowCache.set(rgb, c);
    }
    return c;
  }
  /** Draw with view culling. Additive kinds are batched in one composite pass. */
  draw(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
    // pass 1: normal blend (dust, pollen, leaves)
    for (let i = 0; i < this.n; i++) {
      const k = this.kind[i]; if (k === PK.Glow || k === PK.Ember) continue;
      const x = this.x[i], y = this.y[i]; if (x < x0 || y < y0 || x > x1 || y > y1) continue;
      const a = Math.min(1, this.life[i] / this.max[i] * 1.5), s = this.size[i], c = this.color[i];
      ctx.globalAlpha = k === PK.Dust ? a * 0.45 : a * 0.85;
      ctx.fillStyle = `#${c.toString(16).padStart(6, '0')}`;
      if (k === PK.Leaf) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(this.rot[i]);
        ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.45, 0, 0, 6.283); ctx.fill(); ctx.restore();
      } else { ctx.beginPath(); ctx.arc(x, y, s, 0, 6.283); ctx.fill(); }
    }
    // pass 2: additive glow
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.n; i++) {
      const k = this.kind[i]; if (k !== PK.Glow && k !== PK.Ember) continue;
      const x = this.x[i], y = this.y[i]; if (x < x0 || y < y0 || x > x1 || y > y1) continue;
      const a = this.life[i] / this.max[i], s = this.size[i] * (0.5 + a * 0.5);
      ctx.globalAlpha = a;
      ctx.drawImage(this.glow(this.color[i]), x - s, y - s, s * 2, s * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
}
