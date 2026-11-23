// =============================================================================
// t106 "Capa 4" global boosts
//   Overload Core — permanent per-match purchase: +5% damage for every tower per level; price ×1.6 each level.
//   Rage          — global ability: every tower fires faster for a few seconds, then a cooldown. Team-shared in co-op.
//   Scaling crit  — tower crit chance rises a little every wave (capped); crits deal ×CRIT.mul.
//   Knockback     — impact towers (Melon Mortar, Battle Tank) shove enemies BACK ALONG THEIR PATH (path distance, never
//                   off the road). Bosses resist; repeated shoves fade (diminishing returns) so nothing gets stun-locked.
// All tuning lives here.
// =============================================================================
export const OVERLOAD = { dmgPer: 0.05, base: 500, k: 1.6, max: 12 };
export const RAGE = { mul: 1.5, dur: 9, cd: 30 };
export const CRIT = { base: 0.1, perWave: 0.004, cap: 0.33, mul: 2.5 };
export const KNOCK = { bossK: 0.3, resAdd: 0.35, resMax: 0.85, resDecay: 0.45 };

/** Price of the NEXT Overload level (500, 800, 1280, 2050 …, rounded to 10). */
export const overloadCost = (lvl: number) => Math.round((OVERLOAD.base * OVERLOAD.k ** lvl) / 10) * 10;
/** Global tower damage multiplier from Overload (Balanced routing). */
export const overloadMul = (lvl: number) => 1 + OVERLOAD.dmgPer * lvl;

/** t109 Overload Routing: Balanced (current +5%/lvl) or first min(level,6) levels
 *  go +9% to one class / +1% to the others; remaining levels stay +5% global. */
export const ROUTING_FROM = 31;
export const ROUTING_MIN_LEVEL = 4;
export type OverloadRoute = 'balanced' | 'sky' | 'plated' | 'rush';
export const OVERLOAD_ROUTES: { id: OverloadRoute; name: string; tip: string }[] = [
  { id: 'balanced', name: 'Balanced', tip: 'Every Overload level is +5% tower damage against every threat class.' },
  { id: 'sky', name: 'Sky', tip: 'First 6 levels: +9% vs flying / air, +1% vs others. Extra levels stay +5% global.' },
  { id: 'plated', name: 'Plated', tip: 'First 6 levels: +9% vs heavy, armored, shielded, or ground bosses, +1% vs others. Extra levels stay +5% global.' },
  { id: 'rush', name: 'Rush', tip: 'First 6 levels: +9% vs everything else (fast ground trash), +1% vs Sky/Plated. Extra levels stay +5% global.' },
];
export function routingUnlocked(nextWave: number, level: number): boolean {
  return nextWave >= ROUTING_FROM && level >= ROUTING_MIN_LEVEL;
}
export function overloadRouteMul(level: number, route: OverloadRoute, cls: 'sky' | 'plated' | 'rush'): number {
  if (level <= 0) return 1;
  if (route === 'balanced') return overloadMul(level);
  const routed = Math.min(level, 6), rest = Math.max(0, level - 6);
  return 1 + (cls === route ? 0.09 : 0.01) * routed + OVERLOAD.dmgPer * rest;
}

/** Tower crit chance at wave index `w` (0-based, 0 before the first wave). */
export const critChance = (w: number) => Math.min(CRIT.cap, CRIT.base + CRIT.perWave * Math.max(0, w));

/** t106 balance: Overload + Rage + scaling crit add a lot of late power, so enemy HP gets a matching ramp
 *  (none before wave 10, full `k` by wave 60, then keeps growing on 100-wave runs). Per difficulty. */
export const BOOST_HP: Record<string, number> = { easy: 0, medium: 0.25, hard: 0.7, impoppable: 0.7 };
export const boostHpMul = (k: number, i: number) => 1 + k * Math.max(0, Math.min(1, (i - 10) / 50)) * (1 + Math.max(0, i - 60) / 20);
