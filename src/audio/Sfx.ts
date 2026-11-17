// =============================================================================
// WebAudio synth SFX: no asset files. Each sound is a short oscillator/noise
// envelope. Throttled per name so a 40-tower wave doesn't turn into static.
// Audio unlocks on the first pointer/key (browser autoplay policy).
// =============================================================================
import type { FpSfxName, SfxName } from '../game/Game';

export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private last = new Map<string, number>();
  muted = false;
  volume = 0.35;
  /** t55: modest default, saved by the 🔉 button (0 = muted). */
  setVolume(v: number) { this.volume = v; this.muted = v <= 0; if (this.master) this.master.gain.value = v; }
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') void this.ctx.resume(); return; }
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = this.volume; this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 0.6, b = this.ctx.createBuffer(1, len, this.ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noise = b;
    } catch { this.ctx = null; }
  }
  private tone(type: OscillatorType, f0: number, f1: number, dur: number, vol: number, delay = 0) {
    const c = this.ctx!, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master!); o.start(t); o.stop(t + dur + 0.02);
  }
  private burst(dur: number, vol: number, freq: number, q = 0.8, delay = 0) {
    const c = this.ctx!, t = c.currentTime + delay, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.noise; f.type = 'lowpass'; f.frequency.setValueAtTime(freq, t); f.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.15), t + dur); f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.master!); s.start(t); s.stop(t + dur);
  }
  play(n: SfxName) {
    if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
    const now = performance.now(), gap = n === 'wave' || n === 'victory' || n === 'defeat' ? 500 : n === 'fire' || n === 'pop' || n === 'laser' ? 45 : n === 'explosion' ? 90 : 60;
    if (now - (this.last.get(n) ?? 0) < gap) return;
    this.last.set(n, now);
    switch (n) {
      case 'select': this.tone('sine', 880, 1320, 0.07, 0.18); break;
      case 'command': this.tone('triangle', 520, 780, 0.06, 0.16); this.tone('triangle', 780, 1040, 0.05, 0.12, 0.06); break;
      case 'fire': this.burst(0.05, 0.12, 3500, 1.5); break;
      case 'laser': this.tone('sawtooth', 1600, 400, 0.09, 0.06); break;
      case 'rail': this.tone('square', 2400, 200, 0.18, 0.08); this.burst(0.12, 0.1, 6000); break;
      case 'pop': this.tone('sine', 900 + Math.random() * 500, 200, 0.06, 0.14); break;
      case 'splat': this.burst(0.09, 0.14, 900); break;
      // heavier boom: sharp crack, sub-bass thump, rolling debris tail
      case 'explosion': this.burst(0.08, 0.55, 7000, 1.2); this.burst(0.7, 0.6, 1100); this.tone('sine', 95, 28, 0.6, 0.55); this.tone('triangle', 60, 24, 0.8, 0.3, 0.03); this.burst(0.5, 0.18, 500, 0.6, 0.18); break;
      case 'smash': this.tone('sine', 70, 22, 0.7, 0.65); this.burst(0.6, 0.5, 700); this.burst(0.3, 0.2, 2400, 1, 0.1); break;
      case 'boss': this.tone('sawtooth', 110, 55, 0.9, 0.2); this.tone('sawtooth', 116, 58, 0.9, 0.16); this.tone('sine', 55, 30, 1.1, 0.4); break;
      case 'hypno': for (let i = 0; i < 4; i++) this.tone('sine', 400 + i * 180, 900 - i * 120, 0.22, 0.1, i * 0.07); break;
      case 'zap': this.tone('square', 3200, 600, 0.06, 0.06); this.burst(0.08, 0.12, 8000, 4); break;
      case 'mac': this.tone('sawtooth', 3000, 60, 0.35, 0.18); this.burst(0.9, 0.7, 2200); this.tone('sine', 80, 30, 0.9, 0.5); break;
      case 'ability': this.tone('triangle', 400, 1200, 0.25, 0.2); this.tone('sine', 1200, 1600, 0.15, 0.12, 0.12); break;
      case 'emp': this.tone('square', 200, 1800, 0.12, 0.12); this.tone('sine', 1800, 90, 0.5, 0.18, 0.1); break;
      case 'coin': this.tone('square', 1320, 1320, 0.05, 0.07); this.tone('square', 1760, 1760, 0.08, 0.07, 0.05); break;
      case 'orb': this.tone('sine', 660, 1980, 0.18, 0.14); break;
      case 'upgrade': for (let i = 0; i < 3; i++) this.tone('triangle', 520 * (1 + i * 0.25), 520 * (1 + i * 0.25), 0.08, 0.14, i * 0.06); break;
      case 'error': this.tone('square', 200, 140, 0.15, 0.1); break;
      case 'wave': this.tone('square', 392, 392, 0.12, 0.09); this.tone('square', 523, 523, 0.12, 0.09, 0.13); this.tone('square', 784, 784, 0.25, 0.1, 0.26); break;
      case 'victory': [523, 659, 784, 1047].forEach((f, i) => this.tone('triangle', f, f, i === 3 ? 0.6 : 0.16, 0.16, i * 0.15)); break;
      case 'defeat': [392, 330, 262, 196].forEach((f, i) => this.tone('sawtooth', f, f * 0.97, i === 3 ? 0.8 : 0.22, 0.1, i * 0.24)); break;
      case 'fuse': this.burst(0.6, 0.12, 5000, 3); break;
    }
  }

  // ---------------------------------------------------------------------------
  // t101: first-person audio. Your own gun is close to your ear, so it gets a
  // fuller report than the 2D map ticks: a sharp crack, a body thump and a short
  // echo tail, tuned per weapon (rifle, Marksman scope rifle, SMG, chaingun,
  // tank cannon, beam, rail, darts, bow, melee, monster bite). Plus hit tick,
  // kill confirm, footsteps, scope-in click, and a vehicle engine loop.
  // ---------------------------------------------------------------------------
  private fpLast = new Map<string, number>();
  fpPlayed = 0;
  fp(n: FpSfxName, k = 1) {
    if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
    const now = performance.now(), gap = n === 'step' ? 120 : n === 'chaingun' ? 38 : n === 'hit' || n === 'kill' ? 50 : 28;
    if (now - (this.fpLast.get(n) ?? 0) < gap) return;
    this.fpLast.set(n, now); this.fpPlayed++;
    const j = 0.94 + Math.random() * 0.12; // small per-shot pitch jitter so auto fire doesn't sound like a loop
    switch (n) {
      case 'rifle': this.burst(0.035, 0.5, 6500 * j, 1.2); this.tone('sine', 170 * j, 48, 0.13, 0.36); this.burst(0.28, 0.12, 1400, 0.7, 0.03); this.burst(0.35, 0.04, 700, 0.6, 0.16); break;
      case 'marksman': // big supersonic crack, chest thump, long valley echo, then the bolt cycling
        this.burst(0.05, 0.62, 9000, 1.3); this.tone('sine', 125, 32, 0.28, 0.5); this.burst(0.5, 0.14, 1000, 0.6, 0.1); this.burst(0.7, 0.06, 600, 0.6, 0.38);
        this.tone('square', 2300, 1700, 0.025, 0.05, 0.55); this.burst(0.03, 0.08, 5000, 2, 0.56); this.tone('square', 1900, 1500, 0.025, 0.05, 0.7); this.burst(0.03, 0.08, 4200, 2, 0.71); break;
      case 'smg': this.burst(0.04, 0.26, 2400 * j, 1); this.tone('triangle', 320 * j, 110, 0.05, 0.12); this.burst(0.03, 0.05, 6000, 3, 0.025); break;
      case 'chaingun': this.burst(0.03, 0.34, 5200 * j, 1.1); this.tone('sine', 130 * j, 55, 0.07, 0.26); break;
      case 'cannon': this.burst(0.1, 0.7, 5000, 1); this.tone('sine', 72, 24, 0.95, 0.72); this.tone('triangle', 48, 22, 1.1, 0.3, 0.02); this.burst(1.0, 0.36, 700, 0.6, 0.05); this.burst(0.8, 0.12, 320, 0.5, 0.45);
        this.tone('square', 900, 700, 0.04, 0.05, 0.9); this.burst(0.05, 0.1, 3500, 2, 0.92); break; // shell casing clank + breech
      case 'beam': this.tone('sawtooth', 1900 * j, 480, 0.13, 0.12); this.tone('sine', 3600 * j, 1100, 0.1, 0.07); this.burst(0.06, 0.08, 9000, 4); break;
      case 'rail': this.tone('sine', 300, 2400, 0.12, 0.07); this.tone('square', 2600, 150, 0.24, 0.13, 0.11); this.burst(0.16, 0.28, 8500, 2, 0.11); this.tone('sine', 90, 30, 0.4, 0.3, 0.11); break;
      case 'dart': this.burst(0.11, 0.22, 3200 * j, 4); this.tone('sine', 720 * j, 280, 0.09, 0.07); break;
      case 'arrow': this.tone('triangle', 180 * j, 95, 0.12, 0.2); this.burst(0.16, 0.14, 2600, 5, 0.02); break; // string thrum + flight hiss
      case 'melee': this.burst(0.18, 0.3, 2600 * j, 3); this.tone('triangle', 230 * j, 85, 0.13, 0.22, 0.05); break;
      case 'bite': this.burst(0.08, 0.42, 1600 * j, 2); this.tone('sawtooth', 150 * j, 55, 0.11, 0.2); this.burst(0.05, 0.2, 3000, 3, 0.07); break;
      case 'hit': this.tone('square', 2500, 2400, 0.03, 0.06); this.burst(0.025, 0.08, 7000, 3); break;
      case 'kill': this.tone('triangle', 1320, 1320, 0.05, 0.13); this.tone('triangle', 1980, 1980, 0.1, 0.13, 0.06); break;
      case 'step': this.burst(0.07, 0.11 * k, 650 + Math.random() * 350, 0.8); this.tone('sine', 85 + Math.random() * 20, 50, 0.06, 0.06 * k); break;
      case 'scope': this.tone('square', 1500, 1300, 0.025, 0.05); this.burst(0.04, 0.09, 4500, 2); this.tone('sine', 400, 380, 0.05, 0.03, 0.04); break;
    }
  }
  private eng: { o1: OscillatorNode; o2: OscillatorNode; f: BiquadFilterNode; g: GainNode } | null = null;
  engineLevel = 0;
  /** Vehicle engine loop: idles low when parked, revs with speed; heavy = tank. */
  engine(on: boolean, speed: number, heavy: boolean) {
    const c = this.ctx;
    if (!c || c.state !== 'running') return;
    if (!on && !this.eng) return;
    if (!this.eng) {
      const o1 = c.createOscillator(), o2 = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
      o1.type = 'sawtooth'; o2.type = 'square'; f.type = 'lowpass'; f.Q.value = 2; g.gain.value = 0.0001;
      o1.connect(f); o2.connect(f); f.connect(g); g.connect(this.master!); o1.start(); o2.start();
      this.eng = { o1, o2, f, g };
    }
    const e = this.eng, t = c.currentTime, s = Math.max(0, Math.min(1, speed));
    const base = heavy ? 34 + 26 * s : 52 + 64 * s;
    e.o1.frequency.setTargetAtTime(base, t, 0.18); e.o2.frequency.setTargetAtTime(base * 0.503, t, 0.18);
    e.f.frequency.setTargetAtTime((heavy ? 260 : 380) + 520 * s, t, 0.2);
    this.engineLevel = on && !this.muted ? (heavy ? 0.2 : 0.14) * (0.6 + 0.4 * s) : 0;
    e.g.gain.setTargetAtTime(Math.max(0.0001, this.engineLevel), t, on ? 0.15 : 0.08);
    if (!on) { const old = e; this.eng = null; setTimeout(() => { try { old.o1.stop(); old.o2.stop(); old.g.disconnect(); } catch { /* already stopped */ } }, 600); }
  }
}
