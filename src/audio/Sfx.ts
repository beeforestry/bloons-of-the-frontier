// =============================================================================
// WebAudio synth SFX: no asset files. Each sound is a short oscillator/noise
// envelope. Throttled per name so a 40-tower wave doesn't turn into static.
// Audio unlocks on the first pointer/key (browser autoplay policy).
// =============================================================================
import type { AmbientKind, FpSfxName, SfxName, Listener3d, Sfx3dName } from '../game/Game';

/** 2026-11-24: 2D recipe names that can also play positionally in first person (pops, hits, blasts). */
const SP_2D = new Set<string>(['pop', 'splat', 'explosion', 'smash', 'zap', 'boss', 'mac', 'laser', 'hypno', 'emp', 'fuse']);
/** Base loudness per positional voice (before distance): heavy guns carry, darts and pops don't. */
const SP_LOUD: Record<string, number> = { cannon: 1, explosion: 1, mac: 1, smash: 0.9, boss: 0.9, marksman: 0.85, rail: 0.8, chaingun: 0.7, rifle: 0.65, smg: 0.55, beam: 0.5, laser: 0.5,
  zap: 0.5, emp: 0.6, dart: 0.4, arrow: 0.4, melee: 0.45, bite: 0.45, pop: 0.42, splat: 0.42, hypno: 0.4, fuse: 0.35, hit: 0.3 };
/** Inverse-distance model reference (m): full level within REF, then REF / d. */
const SP_REF = 5;

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
  /** 2026-11-24: while a positional voice is being built, recipes route into its chain (dst) at scale vs; spEnd = last stop time. */
  private dst: AudioNode | null = null; private vs = 1; private spEnd = 0;
  private tone(type: OscillatorType, f0: number, f1: number, dur: number, vol: number, delay = 0) {
    const c = this.ctx!, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain(); vol *= this.vs; this.spEnd = Math.max(this.spEnd, t + dur + 0.02);
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.dst ?? this.master!); o.start(t); o.stop(t + dur + 0.02);
  }
  private burst(dur: number, vol: number, freq: number, q = 0.8, delay = 0) {
    const c = this.ctx!, t = c.currentTime + delay, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); vol *= this.vs; this.spEnd = Math.max(this.spEnd, t + dur);
    s.buffer = this.noise; f.type = 'lowpass'; f.frequency.setValueAtTime(freq, t); f.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.15), t + dur); f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.dst ?? this.master!); s.start(t); s.stop(t + dur);
  }
  play(n: SfxName) {
    if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
    const now = performance.now(), gap = n === 'wave' || n === 'victory' || n === 'defeat' ? 500 : n === 'fire' || n === 'pop' || n === 'laser' ? 45 : n === 'explosion' ? 90 : 60;
    if (now - (this.last.get(n) ?? 0) < gap) return;
    this.last.set(n, now);
    this.recipe2d(n);
  }
  private recipe2d(n: SfxName) {
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
    this.fpRecipe(n, k);
  }
  private fpRecipe(n: FpSfxName, k = 1) {
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
  // ---------------------------------------------------------------------------
  // 2026-11-24: positional 3D sound in first person. While you're possessing something, every
  // other tower's / troop's / teammate's shot and every nearby pop, splat and blast plays from where
  // it happens: an HRTF PannerNode per voice (equal-power on the low quality tier), inverse-distance
  // falloff (full within 5 m, then 5/d), a distance lowpass for air absorption (far guns go dull),
  // and a hard cap on simultaneous voices (14 desktop / 8 touch / 6 low). When the cap is full a new
  // sound steals the quietest voice only if it is clearly louder; inaudible sounds (< 2.5% after
  // falloff) are culled before any node is created. Your own gun stays the close, unpanned report.
  // ---------------------------------------------------------------------------
  private sp: Listener3d | null = null;
  private spBus: GainNode | null = null;
  private spVoices: { n: string; out: GainNode; pan: PannerNode; lp: BiquadFilterNode; end: number; pri: number; d: number; az: number }[] = [];
  private spLast = new Map<string, number>();
  private spMeterN: { l: AnalyserNode; r: AnalyserNode } | null = null;
  spStats = { played: 0, culled: 0, stolen: 0, dropped: 0, throttled: 0, own: 0, peak: 0, byName: {} as Record<string, number>, last: null as null | { n: string; d: number; gain: number; az: number; lp: number } };
  /** Possess hands over its (mutated-in-place) listener each frame; null = left first person. */
  listen(l: Listener3d | null) {
    const c = this.ctx;
    if (!l) { if (this.sp) { this.sp = null; for (const v of this.spVoices) this.spKill(v, 0.03); this.spVoices = []; } return; }
    this.sp = l;
    if (!c) return;
    if (!this.spBus) {
      this.spBus = c.createGain(); this.spBus.gain.value = 0.9; this.spBus.connect(this.master!);
      // the browser loads its HRTF database lazily (first HRTF panner); warm it up on entry so the first shots are already panned
      try { const w = c.createPanner(), z = c.createGain(); w.panningModel = 'HRTF'; z.gain.value = 0; w.connect(z); z.connect(c.destination); setTimeout(() => { try { w.disconnect(); z.disconnect(); } catch { /* */ } }, 3000); } catch { /* */ }
    }
    const L = c.listener, fx = -Math.sin(l.yaw), fz = -Math.cos(l.yaw);
    if (L.positionX) { L.positionX.value = l.x; L.positionY.value = l.y; L.positionZ.value = l.z; L.forwardX.value = fx; L.forwardY.value = 0; L.forwardZ.value = fz; L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0; }
    else { L.setPosition(l.x, l.y, l.z); L.setOrientation(fx, 0, fz, 0, 1, 0); }
  }
  get spOn() { return !!this.sp; }
  private spKill(v: { out: GainNode; pan: PannerNode }, fade: number) {
    const c = this.ctx!; try { v.out.gain.cancelScheduledValues(c.currentTime); v.out.gain.setTargetAtTime(0, c.currentTime, fade / 3); } catch { /* */ }
    setTimeout(() => { try { v.pan.disconnect(); v.out.disconnect(); } catch { /* */ } }, fade * 1000 + 80);
  }
  /** Play n at map pixel (px, py), lift metres above the ground there. Returns true when first person owns the sound
   *  (played, culled or dropped), false when not in first person (the caller falls back to the 2D sound). */
  at3d(n: Sfx3dName, px: number, py: number, lift = 1.5, own = false): boolean {
    const l = this.sp; if (!l) return false;
    if (own) { this.spStats.own++; return true; } // your own gun already has its close-up report
    const c = this.ctx;
    if (!c || this.muted || c.state !== 'running' || !this.spBus) return true;
    const x = px * l.S, z = py * l.S, y = l.ground(px, py) + lift;
    const dx = x - l.x, dy = y - l.y, dz = z - l.z, d = Math.hypot(dx, dy, dz);
    const loud = SP_LOUD[n] ?? 0.5, gain = loud * (d <= SP_REF ? 1 : SP_REF / d);
    if (gain < 0.025) { this.spStats.culled++; return true; }
    // same sound from the same ~8 m cell within 70 ms = one voice (a 40-tower volley isn't 40 voices)
    const key = n + ((x / 8) | 0) + ':' + ((z / 8) | 0), now = performance.now();
    if (now - (this.spLast.get(key) ?? -1e9) < 70) { this.spStats.throttled++; return true; }
    this.spLast.set(key, now); if (this.spLast.size > 400) this.spLast.clear();
    const t = c.currentTime;
    this.spVoices = this.spVoices.filter((v) => { if (v.end > t) return true; try { v.pan.disconnect(); v.out.disconnect(); } catch { /* */ } return false; });
    if (this.spVoices.length >= l.cap) {
      let qi = 0; for (let i = 1; i < this.spVoices.length; i++) if (this.spVoices[i].pri < this.spVoices[qi].pri) qi = i;
      if (gain <= this.spVoices[qi].pri * 1.25) { this.spStats.dropped++; return true; }
      this.spKill(this.spVoices[qi], 0.03); this.spVoices.splice(qi, 1); this.spStats.stolen++;
    }
    const fx = -Math.sin(l.yaw), fz = -Math.cos(l.yaw), rx = Math.cos(l.yaw), rz = -Math.sin(l.yaw);
    const az = Math.round(Math.atan2(dx * rx + dz * rz, dx * fx + dz * fz) * 180 / Math.PI); // + = to your right
    const out = c.createGain(), lp = c.createBiquadFilter(), pan = c.createPanner();
    const lpf = Math.round(Math.max(1600, Math.min(20000, 22000 * Math.exp(-d / 70))));
    lp.type = 'lowpass'; lp.frequency.value = lpf; lp.Q.value = 0.5;
    pan.panningModel = l.hrtf ? 'HRTF' : 'equalpower'; pan.distanceModel = 'inverse'; pan.refDistance = SP_REF; pan.rolloffFactor = 1; pan.maxDistance = 10000;
    if (pan.positionX) { pan.positionX.value = x; pan.positionY.value = y; pan.positionZ.value = z; } else pan.setPosition(x, y, z);
    out.connect(lp); lp.connect(pan); pan.connect(this.spBus);
    this.dst = out; this.vs = SP_2D.has(n) ? Math.min(1.4, loud * 1.6) : loud * 0.85; this.spEnd = t;
    try { if (SP_2D.has(n)) this.recipe2d(n as SfxName); else this.fpRecipe(n as FpSfxName); }
    finally { this.dst = null; this.vs = 1; }
    this.spVoices.push({ n, out, pan, lp, end: this.spEnd + 0.05, pri: gain, d, az });
    this.spStats.played++; this.spStats.byName[n] = (this.spStats.byName[n] ?? 0) + 1; this.spStats.peak = Math.max(this.spStats.peak, this.spVoices.length);
    this.spStats.last = { n, d: +d.toFixed(1), gain: +gain.toFixed(3), az, lp: lpf };
    return true;
  }
  spInfo() {
    const t = this.ctx?.currentTime ?? 0, live = this.spVoices.filter((v) => v.end > t);
    return { on: !!this.sp, hrtf: !!this.sp?.hrtf, cap: this.sp?.cap ?? 0, active: live.length, voices: live.map((v) => ({ n: v.n, d: +v.d.toFixed(1), az: v.az })), ...this.spStats, byName: { ...this.spStats.byName } };
  }
  /** Tests: left / right RMS of the positional bus over ms (proves HRTF panning + falloff on the real audio graph). */
  async spMeter(ms = 500): Promise<{ l: number; r: number }> {
    const c = this.ctx; if (!c || !this.spBus) return { l: 0, r: 0 };
    if (!this.spMeterN) { const sp = c.createChannelSplitter(2), l = c.createAnalyser(), r = c.createAnalyser(); l.fftSize = r.fftSize = 2048; this.spBus.connect(sp); sp.connect(l, 0); sp.connect(r, 1); this.spMeterN = { l, r }; }
    const { l, r } = this.spMeterN, bl = new Float32Array(2048), br = new Float32Array(2048); let sl = 0, sr = 0; const end = performance.now() + ms;
    while (performance.now() < end) { l.getFloatTimeDomainData(bl); r.getFloatTimeDomainData(br); for (let i = 0; i < 2048; i++) { sl += bl[i] * bl[i]; sr += br[i] * br[i]; } await new Promise((res) => setTimeout(res, 20)); }
    return { l: +Math.sqrt(sl).toFixed(4), r: +Math.sqrt(sr).toFixed(4) };
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
  // ---------------------------------------------------------------------------
  // ambience (2026-11-18): first-person ambience. A quiet looping bed under the guns so the
  // fort and the island don't feel like a silent box:
  //  - El Morro: deep surf booming against the cliffs below the walls, a strong
  //    Atlantic wind that gusts harder the higher you stand (ramparts, garita),
  //    the odd gull.
  //  - Isla de Cabras: brighter, faster lapping surf on the riprap, a lighter
  //    breeze, gulls calling often.
  // All synthesized (looped filtered noise + LFO swells, glided sine gull
  // calls), so no audio files and no licensing questions.
  // ---------------------------------------------------------------------------
  private amb: { kind: AmbientKind; src: AudioBufferSourceNode; surfF: BiquadFilterNode; surfG: GainNode; windF: BiquadFilterNode; windG: GainNode; lfos: OscillatorNode[]; out: GainNode } | null = null;
  private ambBuf: AudioBuffer | null = null;
  private ambNext = 0; private ambGullAt = 0; private ambCrashAt = 0;
  ambKind: AmbientKind | null = null; ambLevel = 0; ambWind = 0; ambSurf = 0; ambNear = 0.5; gulls = 0; crashes = 0;
  private gullCall(pan: number, vol: number, delay = 0) {
    // "kyow-kyow": 2-3 falling glides with a fast vibrato, slightly panned
    const c = this.ctx!, n = 2 + (Math.random() < 0.5 ? 1 : 0), f0 = 1500 + Math.random() * 500;
    const p = c.createStereoPanner(); p.pan.value = pan; p.connect(this.amb ? this.amb.out : this.master!);
    for (let i = 0; i < n; i++) {
      const t = c.currentTime + delay + i * (0.2 + Math.random() * 0.06), o = c.createOscillator(), v = c.createOscillator(), vg = c.createGain(), g = c.createGain(), bp = c.createBiquadFilter();
      o.type = 'triangle'; o.frequency.setValueAtTime(f0 * 0.82, t); o.frequency.linearRampToValueAtTime(f0, t + 0.04); o.frequency.exponentialRampToValueAtTime(f0 * 0.6, t + 0.17);
      v.frequency.value = 28 + Math.random() * 8; vg.gain.value = 45; v.connect(vg); vg.connect(o.frequency);
      bp.type = 'bandpass'; bp.frequency.value = f0; bp.Q.value = 1.4;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);
      o.connect(bp); bp.connect(g); g.connect(p); o.start(t); v.start(t); o.stop(t + 0.22); v.stop(t + 0.22);
    }
    this.gulls++;
  }
  private waveCrash(vol: number) {
    // a single breaker hitting rock: rising hiss, low thud, foam tail
    const c = this.ctx!, t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.ambBuf; f.type = 'lowpass'; f.frequency.setValueAtTime(300, t); f.frequency.linearRampToValueAtTime(1400, t + 0.5); f.frequency.exponentialRampToValueAtTime(260, t + 2.6);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
    s.connect(f); f.connect(g); g.connect(this.amb!.out); s.start(t, Math.random() * 2); s.stop(t + 2.9);
    const o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(70, t + 0.4); o.frequency.exponentialRampToValueAtTime(32, t + 1.2);
    og.gain.setValueAtTime(0.0001, t + 0.4); og.gain.exponentialRampToValueAtTime(vol * 0.8, t + 0.46); og.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    o.connect(og); og.connect(this.amb!.out); o.start(t + 0.4); o.stop(t + 1.4);
    this.crashes++;
  }
  private ambStop() {
    const a = this.amb; if (!a) return; this.amb = null; this.ambKind = null; this.ambLevel = 0; this.ambWind = 0; this.ambSurf = 0;
    const t = this.ctx!.currentTime; a.out.gain.setTargetAtTime(0.0001, t, 0.25);
    setTimeout(() => { try { a.src.stop(); a.lfos.forEach((l) => l.stop()); a.out.disconnect(); } catch { /* already stopped */ } }, 1500);
  }
  /** Ambience bed for first person. height = eye height above sea level in metres (more wind up high);
   *  near = 0..1 closeness to / facing open water (2026-11-19: surf louder at the shore, softer inland). */
  ambient(kind: AmbientKind | null, height = 0, near = 0.5) {
    const c = this.ctx;
    if (!c || c.state !== 'running') return;
    if (!kind || this.muted) { this.ambStop(); return; }
    const now = performance.now();
    if (this.amb && this.amb.kind === kind && now < this.ambNext) return;
    this.ambNext = now + 250;
    if (this.amb && this.amb.kind !== kind) this.ambStop();
    if (!this.ambBuf) {
      // 4 s of brown-ish noise (integrated white noise): a soft, rumbly sea that loops without a click
      const len = Math.floor(c.sampleRate * 4), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      let last = 0; for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
      const fade = Math.floor(c.sampleRate * 0.05); for (let i = 0; i < fade; i++) { const k = i / fade; d[len - fade + i] = d[len - fade + i] * (1 - k) + d[i] * k; }
      this.ambBuf = b;
    }
    const morro = kind === 'morro';
    if (!this.amb) {
      const out = c.createGain(); out.gain.value = 0.0001; out.connect(this.master!);
      const src = c.createBufferSource(); src.buffer = this.ambBuf; src.loop = true;
      // surf: lowpassed bed whose loudness swells with two slow, detuned LFOs (sets of waves)
      const surfF = c.createBiquadFilter(), surfG = c.createGain(); surfF.type = 'lowpass'; surfF.frequency.value = morro ? 420 : 760; surfF.Q.value = 0.6; surfG.gain.value = morro ? 0.5 : 0.42;
      const l1 = c.createOscillator(), l1g = c.createGain(), l2 = c.createOscillator(), l2g = c.createGain();
      l1.frequency.value = morro ? 0.09 : 0.16; l1g.gain.value = morro ? 0.28 : 0.22; l2.frequency.value = morro ? 0.053 : 0.11; l2g.gain.value = 0.14;
      l1.connect(l1g); l1g.connect(surfG.gain); l2.connect(l2g); l2g.connect(surfG.gain);
      // wind: bandpassed noise with a wandering centre frequency (gusts whistle up and down)
      const windF = c.createBiquadFilter(), windG = c.createGain(); windF.type = 'bandpass'; windF.frequency.value = morro ? 620 : 900; windF.Q.value = 0.9; windG.gain.value = 0.0001;
      const l3 = c.createOscillator(), l3g = c.createGain(); l3.frequency.value = 0.07; l3g.gain.value = morro ? 260 : 200; l3.connect(l3g); l3g.connect(windF.frequency);
      src.connect(surfF); surfF.connect(surfG); surfG.connect(out); src.connect(windF); windF.connect(windG); windG.connect(out);
      src.start(0, Math.random() * 3); [l1, l2, l3].forEach((l) => l.start());
      this.amb = { kind, src, surfF, surfG, windF, windG, lfos: [l1, l2, l3], out };
      this.ambGullAt = now + 1500 + Math.random() * 3000; this.ambCrashAt = now + 2500 + Math.random() * 3000;
      this.ambKind = kind;
    }
    const a = this.amb, t = c.currentTime, h = Math.max(0, Math.min(1, height / 45));
    // up on the walls the wind takes over and the surf below gets a bit farther away
    this.ambWind = +((morro ? 0.16 : 0.09) + (morro ? 0.3 : 0.16) * h).toFixed(3);
    a.windG.gain.setTargetAtTime(this.ambWind, t, 0.8);
    this.ambLevel = 0.32;
    a.out.gain.setTargetAtTime(this.ambLevel, t, 0.6);
    a.surfF.frequency.setTargetAtTime((morro ? 420 : 760) * (1 - 0.25 * h) * (0.85 + 0.3 * near), t, 0.8);
    this.ambNear = +near.toFixed(2); this.ambSurf = +((morro ? 0.5 : 0.42) * (0.55 + 0.75 * near)).toFixed(3);
    a.surfG.gain.setTargetAtTime(this.ambSurf, t, 0.9);
    if (now >= this.ambGullAt) { this.gullCall(Math.random() * 1.6 - 0.8, (morro ? 0.05 : 0.08) * (0.6 + Math.random() * 0.4)); this.ambGullAt = now + (morro ? 9000 : 4500) + Math.random() * (morro ? 12000 : 7000); }
    if (now >= this.ambCrashAt) { this.waveCrash((morro ? 0.4 : 0.2) * (1 - 0.4 * h) * (0.6 + 0.6 * near)); this.ambCrashAt = now + (morro ? 6000 : 4500) + Math.random() * 5000; }
  }
}
