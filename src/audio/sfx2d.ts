/**
 * Browser-only, procedural 2D SFX for Balloons of the Frontier.
 * No media files, network requests, third-party audio, or ambience/3D audio changes.
 *
 * The game should call set2dSfxSettings() when its existing audio preferences change,
 * and call unlock2dSfx() from an existing user gesture (e.g. Start/Resume).
 * Event hooks are deliberately single-call APIs.
 */

export type EnemyDeathSound = 'normal' | 'explosion' | 'burn' | 'ice' | 'electric' | 'shock' | 'boss' | 'boom';
export type GameCue =
  | 'place'
  | 'upgrade'
  | 'sell'
  | 'fusion'
  | 'rage-start'
  | 'rage-end'
  | 'overload-level'
  | 'wave-start'
  | 'wave-end';

export interface SfxSettings {
  muted: boolean;
  /** Linear, 0..1. Mirror the existing game's EFFECTS/master volume setting. */
  volume: number;
}

export interface SfxDiagnostics {
  activeVoices: number;
  peakVoices: number;
  voiceCap: number;
  played: number;
  skippedDuplicate: number;
  skippedVoiceCap: number;
  skippedMuted: number;
  contextState: AudioContextState | 'unavailable';
  compressorEnabled: boolean;
}

export const MAX_2D_SFX_VOICES = 12;

interface ActiveVoice {
  end: number;
  priority: number;
  output: GainNode;
  sources: AudioScheduledSourceNode[];
  pending: number;
  finished: boolean;
}

const settings: SfxSettings = { muted: false, volume: 1 };
let context: AudioContext | undefined;
let master: GainNode | undefined;
let compressor: DynamicsCompressorNode | undefined;
let noise: AudioBuffer | undefined;
const activeVoices = new Set<ActiveVoice>();
const lastPlayedAt = new Map<string, number>();
const counters = {
  peakVoices: 0,
  played: 0,
  skippedDuplicate: 0,
  skippedVoiceCap: 0,
  skippedMuted: 0,
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));

function getContext(): AudioContext | undefined {
  if (context) return context;
  const AC = typeof AudioContext !== 'undefined'
    ? AudioContext
    : (typeof window !== 'undefined'
      ? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : undefined);
  if (!AC) return undefined;
  try {
    try { context = new AC({ latencyHint: 'interactive' }); }
    catch { context = new AC(); }
    compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -25;
    compressor.knee.value = 13;
    compressor.ratio.value = 7;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.17;
    master = context.createGain();
    compressor.connect(master);
    master.connect(context.destination);
    updateMasterVolume();
    return context;
  } catch {
    context = undefined;
    return undefined;
  }
}

function updateMasterVolume(): void {
  if (!master || !context) return;
  const target = settings.muted ? 0 : settings.volume;
  master.gain.setTargetAtTime(target, context.currentTime, 0.012);
}

/** Connect to the game's existing persisted settings; do not create new preferences. */
export function set2dSfxSettings(update: Partial<SfxSettings>): void {
  if (update.muted !== undefined) settings.muted = update.muted;
  if (update.volume !== undefined) settings.volume = clamp(update.volume, 0, 1);
  updateMasterVolume();
}

/** Call this from an existing Start/Resume or other user-gesture handler. */
export function unlock2dSfx(): void {
  const ctx = getContext();
  if (ctx?.state === 'suspended') void ctx.resume().catch(() => undefined);
}

function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noise) return noise;
  // Reused 500 ms white noise, generated with code, never downloaded or decoded.
  const length = Math.ceil(ctx.sampleRate / 2);
  noise = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noise.getChannelData(0);
  // Deterministic PRNG avoids per-hit Math.random work and makes tests reproducible.
  let seed = 0x69420abc;
  for (let i = 0; i < length; i += 1) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    data[i] = (seed >>> 0) / 2147483648 - 1;
  }
  return noise;
}

function finishVoice(voice: ActiveVoice): void {
  if (voice.finished) return;
  voice.finished = true;
  activeVoices.delete(voice);
  for (const source of voice.sources) {
    source.onended = null;
    try { source.stop(); } catch { /* already stopped or not started */ }
    try { source.disconnect(); } catch { /* a source may already be disconnected */ }
  }
  try { voice.output.disconnect(); } catch { /* context may have closed */ }
}

/** Allocate at most MAX_2D_SFX_VOICES complete sound events at once. */
function beginVoice(key: string, cooldownMs: number, priority: number):
  | { ctx: AudioContext; voice: ActiveVoice; start: number }
  | undefined {
  if (settings.muted || settings.volume <= 0) {
    counters.skippedMuted += 1;
    return undefined;
  }
  const ctx = getContext();
  if (!ctx) return undefined;
  if (ctx.state !== 'running') {
    // Do not fill the voice pool with suspended voices on restricted mobile browsers.
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    return undefined;
  }
  const nowMs = ctx.currentTime * 1000;
  const previous = lastPlayedAt.get(key) ?? Number.NEGATIVE_INFINITY;
  if (nowMs - previous < cooldownMs) {
    counters.skippedDuplicate += 1;
    return undefined;
  }
  // Avoid allocation and graph construction if a storm of attacks exceeds the cap.
  // Reserve two of the twelve voices for priority cues/deaths. No voice stealing:
  // even a 16 ms crossfade would temporarily exceed the hard voice cap.
  const availableToClass = priority <= 0 ? MAX_2D_SFX_VOICES - 2 : MAX_2D_SFX_VOICES;
  if (activeVoices.size >= availableToClass) {
    counters.skippedVoiceCap += 1;
    return undefined;
  }
  const output = ctx.createGain();
  output.gain.value = 1;
  output.connect(compressor!);
  const voice: ActiveVoice = { end: ctx.currentTime, priority, output, sources: [], pending: 0, finished: false };
  activeVoices.add(voice);
  counters.peakVoices = Math.max(counters.peakVoices, activeVoices.size);
  counters.played += 1;
  // Only remember accepted events, or a cap-full frame could silence the next one.
  lastPlayedAt.set(key, nowMs);
  return { ctx, voice, start: ctx.currentTime + 0.002 };
}

function registerSource(voice: ActiveVoice, source: AudioScheduledSourceNode, endsAt: number): void {
  voice.pending += 1;
  voice.end = Math.max(voice.end, endsAt);
  voice.sources.push(source);
  source.onended = () => {
    voice.pending -= 1;
    if (voice.pending === 0) finishVoice(voice);
  };
}

interface ToneOptions {
  hz: number;
  duration: number;
  volume?: number;
  shape?: OscillatorType;
  fall?: number;
  delay?: number;
  attack?: number;
}

function tone(ctx: AudioContext, voice: ActiveVoice, start: number, opts: ToneOptions): void {
  const at = start + (opts.delay ?? 0);
  const dur = Math.max(0.018, opts.duration);
  const gain = ctx.createGain();
  const osc = ctx.createOscillator();
  osc.type = opts.shape ?? 'sine';
  osc.frequency.setValueAtTime(Math.max(35, opts.hz), at);
  if (opts.fall) osc.frequency.exponentialRampToValueAtTime(Math.max(35, opts.hz * opts.fall), at + dur * 0.88);
  const peak = opts.volume ?? 0.15;
  const attack = Math.min(opts.attack ?? 0.008, dur * 0.25);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain);
  gain.connect(voice.output);
  registerSource(voice, osc, at + dur);
  // Clean up the envelope when this oscillator finishes.
  osc.onended = (() => {
    try { gain.disconnect(); } catch { /* source graph already released */ }
    voice.pending -= 1;
    if (voice.pending === 0) finishVoice(voice);
  });
  osc.start(at);
  osc.stop(at + dur + 0.002);
}

interface NoiseOptions {
  duration: number;
  volume: number;
  lowpass?: number;
  highpass?: number;
  delay?: number;
}

function burst(ctx: AudioContext, voice: ActiveVoice, start: number, opts: NoiseOptions): void {
  const at = start + (opts.delay ?? 0);
  const dur = clamp(opts.duration, 0.015, 0.45);
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = opts.highpass ? 'highpass' : 'lowpass';
  filter.frequency.setValueAtTime(opts.highpass ?? opts.lowpass ?? 1800, at);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(opts.volume, at + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(voice.output);
  registerSource(voice, src, at + dur);
  src.onended = () => {
    try { filter.disconnect(); gain.disconnect(); } catch { /* already disconnected */ }
    voice.pending -= 1;
    if (voice.pending === 0) finishVoice(voice);
  };
  src.start(at);
  src.stop(at + dur + 0.002);
}

function strHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Known combat towers get a hand-tuned family/pitch; unknown ids keep the hash timbre. */
const FIRE_VOICE: Record<string, { family: number; base: number }> = {
  dart_monkey: { family: 0, base: 420 },
  boomerang_monkey: { family: 1, base: 360 },
  ninja_monkey: { family: 0, base: 560 },
  sniper_monkey: { family: 3, base: 240 },
  wizard_monkey: { family: 4, base: 520 },
  super_monkey: { family: 2, base: 880 },
  glue_slinger: { family: 5, base: 280 },
  tesla_coil: { family: 2, base: 1400 },
  arcane_obelisk: { family: 4, base: 430 },
  solar_pea_fusion: { family: 4, base: 640 },
  gatling_cherry_bomber: { family: 3, base: 260 },
  flame_melon_mortar: { family: 3, base: 180 },
  star_emperor: { family: 4, base: 700 },
  repeater_gatling: { family: 1, base: 480 },
  chomper: { family: 5, base: 160 },
  hypno_shroom: { family: 4, base: 300 },
  unsc_autoturret: { family: 1, base: 400 },
  unsc_rail: { family: 3, base: 200 },
  unsc_flak: { family: 3, base: 300 },
  unsc_tank: { family: 3, base: 140 },
  unsc_heli: { family: 1, base: 320 },
  unsc_destroyer: { family: 3, base: 110 },
  unsc_beacon: { family: 2, base: 720 },
};

/**
 * Each tower ID gets a reproducible timbre: different pitch, waveform,
 * chirp direction, rhythmic transient, and optional noise layer.
 * Upgrade tiers add harmonics without lengthening the attack significantly.
 * Use the game's stable tower type ID, not an instance ID.
 */
export function playTowerFire(type: string, upgradeTier = 0): void {
  const id = type.trim().toLowerCase() || 'unknown';
  const allocation = beginVoice(`fire:${id}`, 21, 0);
  if (!allocation) return;
  const { ctx, voice, start } = allocation;
  const hash = strHash(id);
  const curated = FIRE_VOICE[id];
  const family = curated?.family ?? hash % 6;
  const base = curated?.base ?? (180 + ((hash >>> 6) % 500));
  const tier = clamp(Math.floor(upgradeTier), 0, 5);
  const rich = tier / 5;
  const shapes: OscillatorType[] = ['sine', 'triangle', 'square', 'sawtooth', 'triangle', 'sine'];
  const falls = [0.42, 0.78, 1.43, 0.5, 1.75, 0.63];
  const durations = [0.09, 0.13, 0.08, 0.18, 0.12, 0.1];
  const hz = base * (family === 4 ? 1.3 : 1);
  tone(ctx, voice, start, {
    hz,
    duration: durations[family],
    volume: 0.105 + 0.02 * rich,
    shape: shapes[family],
    fall: falls[family],
    attack: 0.004,
  });
  if (tier >= 1) {
    tone(ctx, voice, start, {
      hz: hz * (family % 2 ? 1.5 : 2),
      duration: durations[family] * 0.7,
      volume: 0.026 + 0.022 * rich,
      shape: 'sine',
      fall: falls[family] * 0.95,
    });
  }
  if (tier >= 3) {
    tone(ctx, voice, start, {
      hz: hz * 2.7,
      duration: 0.055,
      delay: 0.01,
      volume: 0.022 + 0.018 * rich,
      shape: 'triangle',
      fall: 0.8,
    });
  }
  if (family === 2 || family === 3 || tier >= 5) {
    burst(ctx, voice, start, { duration: 0.032 + rich * 0.012, volume: 0.018 + rich * 0.016, highpass: 900 });
  }
}

/** One distinct short sound for each 2D enemy kill/elemental death. */
export function playEnemyDeath(kind: EnemyDeathSound): void {
  const resolved: Exclude<EnemyDeathSound, 'shock' | 'boom'> =
    kind === 'shock' ? 'electric' : kind === 'boom' ? 'explosion' : kind;
  const allocation = beginVoice(`death:${resolved}`, resolved === 'normal' ? 22 : 34, resolved === 'boss' ? 2 : 0);
  if (!allocation) return;
  const { ctx, voice, start } = allocation;
  switch (resolved) {
    case 'normal': // quick, soft bubble pop
      tone(ctx, voice, start, { hz: 390, duration: 0.07, volume: 0.10, fall: 0.37, shape: 'sine' });
      burst(ctx, voice, start, { duration: 0.03, volume: 0.027, highpass: 750 });
      break;
    case 'explosion': // low thump and debris
      tone(ctx, voice, start, { hz: 145, duration: 0.26, volume: 0.16, fall: 0.24, shape: 'triangle' });
      burst(ctx, voice, start, { duration: 0.21, volume: 0.15, lowpass: 1000 });
      break;
    case 'burn': // sizzle and down-sliding heat
      burst(ctx, voice, start, { duration: 0.21, volume: 0.065, highpass: 2700 });
      tone(ctx, voice, start, { hz: 670, duration: 0.21, volume: 0.047, fall: 0.48, shape: 'sawtooth' });
      break;
    case 'ice': // two brittle glassy notes
      tone(ctx, voice, start, { hz: 1650, duration: 0.14, volume: 0.078, fall: 0.76, shape: 'sine' });
      tone(ctx, voice, start, { hz: 2250, delay: 0.034, duration: 0.12, volume: 0.053, fall: 0.55, shape: 'triangle' });
      burst(ctx, voice, start, { duration: 0.075, volume: 0.075, highpass: 3800 });
      break;
    case 'electric': // short staccato crackle
      for (let i = 0; i < 3; i += 1) {
        tone(ctx, voice, start, { hz: 900 + i * 380, duration: 0.042, delay: i * 0.032, volume: 0.048, fall: i % 2 ? 0.42 : 1.8, shape: 'square' });
      }
      burst(ctx, voice, start, { duration: 0.105, volume: 0.046, highpass: 2600 });
      break;
    case 'boss': // deeper and larger, still less than one second
      tone(ctx, voice, start, { hz: 120, duration: 0.72, volume: 0.21, fall: 0.22, shape: 'sawtooth' });
      tone(ctx, voice, start, { hz: 250, duration: 0.48, volume: 0.11, fall: 0.24, shape: 'triangle' });
      burst(ctx, voice, start, { duration: 0.40, volume: 0.19, lowpass: 1300 });
      burst(ctx, voice, start, { duration: 0.16, delay: 0.20, volume: 0.12, highpass: 1200 });
      break;
  }
}

/** Distinct UI/event cues. Two voice slots are reserved for priority cues. */
export function playGameCue(kind: GameCue): void {
  const longCooldown = kind.startsWith('rage') || kind.startsWith('wave') ? 180 : 52;
  const allocation = beginVoice(`cue:${kind}`, longCooldown, 2);
  if (!allocation) return;
  const { ctx, voice, start } = allocation;
  const note = (hz: number, duration: number, delay = 0, volume = 0.11, shape: OscillatorType = 'sine'): void => {
    tone(ctx, voice, start, { hz, duration, delay, volume, shape, fall: 0.95 });
  };
  switch (kind) {
    case 'place':
      note(410, 0.10, 0, 0.10, 'triangle'); note(615, 0.12, 0.055, 0.07);
      break;
    case 'upgrade':
      note(420, 0.12, 0, 0.075, 'triangle'); note(560, 0.13, 0.075, 0.086, 'triangle'); note(840, 0.19, 0.145, 0.07);
      break;
    case 'sell':
      note(700, 0.12, 0, 0.09, 'triangle'); note(390, 0.19, 0.09, 0.095, 'sine');
      break;
    case 'fusion':
      note(260, 0.33, 0, 0.11, 'sawtooth'); note(520, 0.32, 0.09, 0.11, 'triangle'); note(1040, 0.36, 0.22, 0.09);
      burst(ctx, voice, start, { duration: 0.21, delay: 0.14, volume: 0.065, highpass: 2300 });
      break;
    case 'rage-start':
      note(170, 0.32, 0, 0.13, 'sawtooth'); note(255, 0.35, 0.12, 0.11, 'triangle');
      burst(ctx, voice, start, { duration: 0.22, volume: 0.075, lowpass: 2000 });
      break;
    case 'rage-end':
      note(440, 0.21, 0, 0.09, 'triangle'); note(240, 0.29, 0.13, 0.105, 'sine');
      break;
    case 'overload-level':
      note(330, 0.13, 0, 0.09, 'triangle'); note(660, 0.15, 0.085, 0.08, 'square'); note(990, 0.22, 0.17, 0.068);
      burst(ctx, voice, start, { duration: 0.13, delay: 0.15, volume: 0.038, highpass: 3100 });
      break;
    case 'wave-start':
      note(330, 0.17, 0, 0.10, 'triangle'); note(440, 0.17, 0.13, 0.10, 'triangle'); note(660, 0.26, 0.26, 0.09);
      break;
    case 'wave-end':
      note(660, 0.15, 0, 0.09); note(550, 0.15, 0.13, 0.085); note(440, 0.3, 0.25, 0.10, 'triangle');
      break;
  }
}

export function get2dSfxDiagnostics(): SfxDiagnostics {
  return {
    activeVoices: activeVoices.size,
    peakVoices: counters.peakVoices,
    voiceCap: MAX_2D_SFX_VOICES,
    played: counters.played,
    skippedDuplicate: counters.skippedDuplicate,
    skippedVoiceCap: counters.skippedVoiceCap,
    skippedMuted: counters.skippedMuted,
    contextState: context?.state ?? 'unavailable',
    compressorEnabled: compressor !== undefined,
  };
}


/** Reset counters between tests. Does not close the AudioContext. */
export function reset2dSfxDiagnostics(): void {
  for (const voice of [...activeVoices]) finishVoice(voice);
  counters.peakVoices = 0;
  counters.played = 0;
  counters.skippedDuplicate = 0;
  counters.skippedVoiceCap = 0;
  counters.skippedMuted = 0;
  lastPlayedAt.clear();
}

/** Optional lifecycle hook on application teardown. */
export function dispose2dSfx(): void {
  for (const voice of activeVoices) finishVoice(voice);
  activeVoices.clear();
  lastPlayedAt.clear();
  noise = undefined;
  if (context) void context.close().catch(() => undefined);
  context = undefined;
  master = undefined;
  compressor = undefined;
}
