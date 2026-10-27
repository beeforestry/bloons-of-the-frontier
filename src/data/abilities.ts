// Player-triggered abilities (HUD cooldown icons, hotkeys 1-3).
import type { AbilityId } from '../core/types';
export interface AbilityData { id: AbilityId; name: string; icon: string; cooldown: number; desc: string }
export const ABILITIES: Record<AbilityId, AbilityData> = {
  stim: { id: 'stim', name: 'Stim', icon: '💉', cooldown: 20, desc: 'Stim pack: +60% fire rate and +40% speed for 6 s (costs 10% HP).' },
  emp: { id: 'emp', name: 'EMP', icon: '⚡', cooldown: 28, desc: 'Local EMP (radius 130): strips energy shields for good and stuns heavy / armored bugs for 2 s.' },
  hijack: { id: 'hijack', name: 'EMP Drop', icon: '🌀', cooldown: 35, desc: 'Spartan Hijack / EMP Drop (radius 180): stuns every heavy or armored enemy for 3.5 s, pops shields, 30 damage.' },
  laser_sweep: { id: 'laser_sweep', name: 'Laser Sweep', icon: '🔆', cooldown: 30, desc: 'Super Monkey sweeps a massive laser across a 140° arc (hits aircraft).' },
};
export const STIM = { dur: 6, rate: 1.6, speed: 1.4, hpCost: 0.1 };
export const EMP = { radius: 130, stun: 2 };
export const HIJACK = { radius: 180, stun: 3.5, damage: 30 };
export const SWEEP = { dur: 1.3, arc: 2.45, mult: 4, lenMul: 1.35 };
/** Veterancy: XP per kill; 3 stars max. Each star: +10% dmg, +15% fire rate, +10% max HP. */
export const VET = { thresholds: [5, 15, 35], dmg: 0.1, rate: 0.15, hp: 0.1 };
