// =============================================================================
// t105 TIER-3 SPECIALIZATION
// Reaching the last tier, the player picks one of two permanent branches. A branch
// is the regular last tier re-tuned toward one playstyle: boosted stats (×) on the
// last tier, trade-off stats (< 1) are cut but never below tier 2, so every branch is
// still strictly better than tier 2 (the validator checks). Some branches add or
// strengthen an element status (t103 combos). Each branch has its own colour + emblem
// (2D glow/badge, FP ring/badge).
// =============================================================================
import type { Element, TowerData, TowerTier } from '../core/types';

export interface Branch {
  key: string; name: string; icon: string; color: string; blurb: string;
  /** Multipliers on the last tier's stats (combat / cover / aura / farm). < 1 = trade-off, floored at tier 2. */
  mul?: Record<string, number>;
  /** Flat additions (pierce, shots, chain, garrisonSlots, slow, armorShred ...). */
  add?: Record<string, number>;
  /** Element status this branch stamps (seconds via combat.status). */
  element?: Element; status?: number;
}
export const SPECS: Record<string, [Branch, Branch]> = {
  dart_monkey: [
    { key: 'longshot', name: 'Longshot Marksman', icon: '🎯', color: '#ff6b5a', blurb: 'Heavy darts: ×1.25 damage, +8% range.', mul: { damage: 1.25, range: 1.08 } },
    { key: 'rapid', name: 'Rapid Volley', icon: '💨', color: '#5ad1ff', blurb: '+33% throw rate.', mul: { fireRate: 1.33 } },
  ],
  ninja_monkey: [
    { key: 'frost', name: 'Frost Kunai', icon: '❄', color: '#9fe8ff', blurb: 'Kunai stamp ❄ Chilled (2 s) and slow 25%.', add: { slow: 0.25 }, mul: { damage: 1.1 }, element: 'chill', status: 2 },
    { key: 'shadow', name: 'Shadow Blade', icon: '🗡', color: '#b06bff', blurb: '×1.3 damage.', mul: { damage: 1.3 } },
  ],
  wizard_monkey: [
    { key: 'storm', name: 'Stormcaller', icon: '⚡', color: '#d6f6ff', blurb: 'Bolts stamp ⚡ Shocked (2 s), ×1.15 damage.', mul: { damage: 1.15 }, element: 'shock', status: 2 },
    { key: 'pyro', name: 'Pyromancer', icon: '🔥', color: '#ff8a3a', blurb: 'Bolts stamp 🔥 Burning (2.5 s), ×1.25 splash.', mul: { splash: 1.25 }, element: 'burn', status: 2.5 },
  ],
  super_monkey: [
    { key: 'plasma', name: 'Plasma Lance', icon: '🔆', color: '#ff5ad1', blurb: '×1.3 damage.', mul: { damage: 1.3 } },
    { key: 'hyper', name: 'Hyper Beam', icon: '⚡', color: '#7affc8', blurb: '+30% fire rate.', mul: { fireRate: 1.3 } },
  ],
  sniper_monkey: [
    { key: 'deadeye', name: 'Deadeye', icon: '🎯', color: '#ff6b5a', blurb: '×1.35 damage.', mul: { damage: 1.35 } },
    { key: 'suppress', name: 'Suppressor', icon: '🔁', color: '#9fe8ff', blurb: '+30% fire rate, hits slow 20%.', mul: { fireRate: 1.3 }, add: { slow: 0.2 } },
  ],
  boomerang_monkey: [
    { key: 'razor', name: 'Razor Arc', icon: '🪃', color: '#ffb35a', blurb: '×1.3 damage.', mul: { damage: 1.3 } },
    { key: 'twin', name: 'Twin Glaives', icon: '✳', color: '#5ad1ff', blurb: '+30% throw rate.', mul: { fireRate: 1.3 } },
  ],
  solar_pea_fusion: [
    { key: 'sunburst', name: 'Sunburst', icon: '☀', color: '#ffd84a', blurb: 'Hotter peas ×1.2 damage, stronger + wider sun aura.', mul: { damage: 1.2, ratePct: 1.4, radius: 1.15 } },
    { key: 'pods', name: 'Gatling Pods', icon: '💨', color: '#7aff7a', blurb: '+30% fire rate.', mul: { fireRate: 1.3 } },
  ],
  gatling_cherry_bomber: [
    { key: 'firestorm', name: 'Firestorm', icon: '🔥', color: '#ff7a3a', blurb: 'Berries stamp 🔥 Burning (2 s), ×1.2 splash.', mul: { splash: 1.2 }, element: 'burn', status: 2 },
    { key: 'overclock', name: 'Overclock', icon: '⚙', color: '#c8c8ff', blurb: '+30% fire rate, ×1.2 cherry bombs.', mul: { fireRate: 1.3, specialDamage: 1.2 } },
  ],
  flame_melon_mortar: [
    { key: 'napalm', name: 'Napalm Melons', icon: '🔥', color: '#ff5a2a', blurb: 'Burn lasts 60% longer, ×1.15 splash.', mul: { status: 1.6, splash: 1.15 } },
    { key: 'siege', name: 'Siege Melons', icon: '💥', color: '#ffd84a', blurb: '×1.25 damage, +8% range.', mul: { damage: 1.25, range: 1.08 } },
  ],
  tesla_coil: [
    { key: 'web', name: 'Arc Web', icon: '🕸', color: '#9fd8ff', blurb: '+2 chain jumps.', add: { chain: 2 } },
    { key: 'overcharge', name: 'Overcharge', icon: '⚡', color: '#fff36a', blurb: '×1.25 damage, Shocked lasts 50% longer.', mul: { damage: 1.25, status: 1.5 } },
  ],
  unsc_autoturret: [
    { key: 'hail', name: 'Hailstorm', icon: '🌧', color: '#5ad1ff', blurb: '+30% fire rate.', mul: { fireRate: 1.3 } },
    { key: 'ap', name: 'AP Rounds', icon: '🛡', color: '#ff6b5a', blurb: '×1.25 damage, armor shred.', mul: { damage: 1.25 }, add: { armorShred: 0.08 } },
  ],
  unsc_flak: [
    { key: 'shred', name: 'Skyshredder', icon: '✈', color: '#ff6b5a', blurb: '×1.3 damage.', mul: { damage: 1.3 } },
    { key: 'barrage', name: 'Flak Barrage', icon: '💥', color: '#ffd84a', blurb: '+20% fire rate, ×1.1 splash.', mul: { fireRate: 1.2, splash: 1.1 } },
  ],
  unsc_tank: [
    { key: 'siege', name: 'Siege Breaker', icon: '💥', color: '#ffb35a', blurb: '×1.2 damage, ×1.2 splash.', mul: { damage: 1.2, splash: 1.2 } },
    { key: 'hunter', name: 'Hunter Killer', icon: '🎯', color: '#7affc8', blurb: '+30% fire rate, +5% range.', mul: { fireRate: 1.3, range: 1.05 } },
  ],
  unsc_destroyer: [
    { key: 'tidal', name: 'Tidal Barrage', icon: '🌊', color: '#4ab8ff', blurb: 'Soaked lasts 60% longer, ×1.2 splash.', mul: { status: 1.6, splash: 1.2 } },
    { key: 'broadside', name: 'Broadside', icon: '💣', color: '#ff8a5a', blurb: '×1.3 damage per shell.', mul: { damage: 1.3 } },
  ],
  glue_slinger: [
    { key: 'corrode', name: 'Corrosive Vat', icon: '☣', color: '#a6ff4a', blurb: '×1.2 damage, ×1.5 armor shred.', mul: { damage: 1.2, armorShred: 1.5 } },
    { key: 'tar', name: 'Tar Pit', icon: '🫧', color: '#c8a26a', blurb: 'Slow +15%, ×1.2 splash.', mul: { splash: 1.2 }, add: { slow: 0.15 } },
  ],
  frost_wallnut_bastion: [
    { key: 'keep', name: 'Glacier Keep', icon: '🏰', color: '#bfe8ff', blurb: 'Aura ×1.5 HP, +1 garrison slot, +10% protection.', mul: { bonusMaxHp: 1.5, auraRadius: 1.1 }, add: { garrisonSlots: 1, garrisonProtect: 0.1 } },
    { key: 'permafrost', name: 'Permafrost', icon: '❄', color: '#7ad8ff', blurb: 'Ice shots: ×1.4 damage, Chilled 50% longer, slow +10%.', mul: { damage: 1.4, status: 1.5 }, add: { slow: 0.1 } },
  ],
};
const CAP: Record<string, number> = { slow: 0.75, armorShred: 1, garrisonProtect: 0.85 };
const r2 = (n: number) => Math.round(n * 100) / 100;
function mod(last: Record<string, unknown> | undefined, prev: Record<string, unknown> | undefined, b: Branch): Record<string, unknown> | undefined {
  if (!last) return last;
  const out: Record<string, unknown> = { ...last };
  for (const [k, m] of Object.entries(b.mul ?? {})) {
    const v = last[k]; if (typeof v !== 'number') continue;
    const floor = typeof prev?.[k] === 'number' ? (prev[k] as number) : 0;
    out[k] = m < 1 ? Math.max(floor, r2(v * m)) : Math.max(v, r2(v * m));
  }
  for (const [k, a] of Object.entries(b.add ?? {})) {
    const v = typeof last[k] === 'number' ? (last[k] as number) : 0;
    out[k] = r2(Math.min(CAP[k] ?? Infinity, Math.max(v, v + a)));
  }
  return out;
}
const cache = new Map<string, TowerTier>();
/** Sim/test switch: `off` hides every branch (balance A/B runs via window.__game.tune). */
export const SPEC_TUNE = { off: false };
export const specsFor = (id: string) => (SPEC_TUNE.off ? null : SPECS[id] ?? null);
/** The last tier as re-tuned by branch `b` (0 / 1). */
export function branchTier(d: TowerData, b: number): TowerTier {
  const key = d.id + ':' + b; let t = cache.get(key); if (t) return t;
  const last = d.tiers[d.tiers.length - 1], prev = d.tiers[d.tiers.length - 2], br = SPECS[d.id][b];
  const combat = mod(last.combat as unknown as Record<string, unknown>, prev?.combat as unknown as Record<string, unknown>, br) as unknown as TowerTier['combat'];
  if (combat && br.element) combat.status = Math.max(combat.status ?? 0, br.status ?? 2);
  t = {
    ...last, name: br.name, blurb: br.blurb,
    visual: { ...last.visual, glow: br.color },
    combat,
    cover: mod(last.cover as unknown as Record<string, unknown>, prev?.cover as unknown as Record<string, unknown>, br) as unknown as TowerTier['cover'],
    aura: mod(last.aura as unknown as Record<string, unknown>, prev?.aura as unknown as Record<string, unknown>, br) as unknown as TowerTier['aura'],
    farm: mod(last.farm as unknown as Record<string, unknown>, prev?.farm as unknown as Record<string, unknown>, br) as unknown as TowerTier['farm'],
  };
  cache.set(key, t); return t;
}
/** Element stamped by a tower given its branch (branch element wins over the tower's own). */
export const branchElement = (d: TowerData, b: number | null): Element | undefined => (b != null && !SPEC_TUNE.off && SPECS[d.id]?.[b]?.element) || d.element;

/** t105: colour + glyph for a specialized (or hidden-recipe) tower, or null (2D badge + FP emblem). */
export function branchMark(t: { data: TowerData; branch: number | null; tier: number }): { color: string; glyph: string } | null {
  if (t.data.hidden && t.data.mark) return t.data.mark;
  const sp = t.branch != null ? SPECS[t.data.id] : null;
  if (!sp || t.tier < t.data.tiers.length - 1) return null;
  const b = sp[t.branch!]; return { color: b.color, glyph: b.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() };
}
