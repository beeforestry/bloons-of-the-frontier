// Difficulty presets (chosen on the map-select screen). Multipliers apply to enemy HP
// and speed, starting cash, every build / upgrade / research cost and the HQ's HP.
export type DifficultyId = 'easy' | 'medium' | 'hard' | 'impoppable';
export interface Difficulty {
  id: DifficultyId; name: string; icon: string; blurb: string;
  /** Waves to win (the last one is a boss finale). */
  waves: number;
  hp: number; speed: number; cash: number; cost: number; hq: number;
}
export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy', name: 'Easy', icon: '🌱', blurb: '40 waves · -20% enemy HP · cheaper builds · tougher HQ', waves: 40, hp: 0.8, speed: 0.92, cash: 900, cost: 0.9, hq: 1.4 },
  { id: 'medium', name: 'Medium', icon: '⚔', blurb: '60 waves · the standard frontier', waves: 60, hp: 1, speed: 1, cash: 750, cost: 1, hq: 1 },
  { id: 'hard', name: 'Hard', icon: '🔥', blurb: '100 waves · +20% HP, faster enemies · ends with the GIANT FINAL BOSS', waves: 100, hp: 1.2, speed: 1.08, cash: 750, cost: 1.05, hq: 1 },
  { id: 'impoppable', name: 'Impoppable', icon: '💀', blurb: '100 waves · +45% HP · pricey builds · fragile HQ · final boss', waves: 100, hp: 1.45, speed: 1.12, cash: 600, cost: 1.15, hq: 0.6 },
];
export const difficultyById = (id: string) => DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1];

import { TOWERS } from './towers';
import { UNITS } from './units';
import { BUILDINGS } from './buildings';
const BASE_COST = new WeakMap<object, number>();
/** Scale every tower / troop / building cost for the run (idempotent: from the authored base). */
export function applyCostMul(mul: number) {
  for (const d of [...TOWERS, ...UNITS, ...BUILDINGS] as { tiers: { cost: number }[] }[]) for (const t of d.tiers) {
    if (!BASE_COST.has(t)) BASE_COST.set(t, t.cost);
    const b = BASE_COST.get(t)!;
    t.cost = mul === 1 ? b : Math.max(5, Math.round((b * mul) / 5) * 5);
  }
}
