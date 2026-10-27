// =============================================================================
// WebAudio synth SFX: no asset files. Each sound is a short oscillator/noise
// envelope. Throttled per name so a 40-tower wave doesn't turn into static.
// Audio unlocks on the first pointer/key (browser autoplay policy).
// =============================================================================
import type { SfxName } from '../game/Game';

export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private last = new Map<string, number>();
  muted = false;
  volume = 0.35;
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
  private burst(dur: number, vol: number, freq: number, q = 0.8) {
    const c = this.ctx!, t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.noise; f.type = 'lowpass'; f.frequency.setValueAtTime(freq, t); f.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.15), t + dur); f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.master!); s.start(t); s.stop(t + dur);
  }
  play(n: SfxName) {
    if (!this.ctx || this.muted || this.ctx.state !== 'running') return;
    const now = performance.now(), gap = n === 'fire' || n === 'pop' || n === 'laser' ? 45 : n === 'explosion' ? 90 : 60;
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
      case 'explosion': this.burst(0.45, 0.5, 1400); this.tone('sine', 120, 40, 0.4, 0.35); break;
      case 'mac': this.tone('sawtooth', 3000, 60, 0.35, 0.18); this.burst(0.9, 0.7, 2200); this.tone('sine', 80, 30, 0.9, 0.5); break;
      case 'ability': this.tone('triangle', 400, 1200, 0.25, 0.2); this.tone('sine', 1200, 1600, 0.15, 0.12, 0.12); break;
      case 'emp': this.tone('square', 200, 1800, 0.12, 0.12); this.tone('sine', 1800, 90, 0.5, 0.18, 0.1); break;
      case 'coin': this.tone('square', 1320, 1320, 0.05, 0.07); this.tone('square', 1760, 1760, 0.08, 0.07, 0.05); break;
      case 'orb': this.tone('sine', 660, 1980, 0.18, 0.14); break;
      case 'upgrade': for (let i = 0; i < 3; i++) this.tone('triangle', 520 * (1 + i * 0.25), 520 * (1 + i * 0.25), 0.08, 0.14, i * 0.06); break;
      case 'error': this.tone('square', 200, 140, 0.15, 0.1); break;
      case 'fuse': this.burst(0.6, 0.12, 5000, 3); break;
    }
  }
}
