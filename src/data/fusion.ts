// =============================================================================
// t104 SAME-TYPE TOWER FUSION
// Two towers of the same type, both at their last tier and right next to each
// other, fuse into one "Fused" super-tower: one spot is freed, the survivor gets
// a synthetic extra tier (every stat multiplied, never lower), a gold aura,
// a ★ badge and a bigger model. Fee = 40% of one tower's full price. Sell value stays
// 70% of everything invested (both towers + fee).
// =============================================================================
import type { TowerData, TowerTier } from '../core/types';
import { SPECS, branchTier } from './specs';

export const FUSION = {
  /** Fee as a fraction of one tower's full price (all tiers). */
  feeK: 0.4,
  /** Extra reach (px) beyond the two base radii for "adjacent". */
  reach: 40,
  glow: '#ffd84a',
};
/** Stat multipliers (×) / additions (+) / caps for the fused tier. Unknown numeric keys get ×1.15. */
const MUL: Record<string, number> = {
  damage: 1.4, fireRate: 1.1, range: 1.08, splash: 1.2, projectileSpeed: 1.1, specialDamage: 1.4, specialRate: 1, shots: 1,
  shieldBreak: 1.25, devour: 1.5, lockRamp: 1.2, lockRampMax: 1.2, status: 1.25, armorShred: 1.25, slow: 1.15,
  auraRadius: 1.15, bonusMaxHp: 1.5, bonusRangePct: 1.25, regen: 1.5, garrisonProtect: 1.1, garrisonRangePct: 1.2,
  income: 2.1, payoutsPerMin: 1, waveBonus: 2.1,
  radius: 1.15, ratePct: 1.3, incomePct: 1.3, energy: 2, perMin: 1.3, maxConverted: 1, maxHp: 1.6, power: 1.3,
};
const ADD: Record<string, number> = { pierce: 1, chain: 1, garrisonSlots: 1, maxConverted: 1 };
const CAP: Record<string, number> = { slow: 0.75, armorShred: 1, garrisonProtect: 0.8 };
const round = (n: number) => Math.round(n * 100) / 100;

function boost(o: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === 'number') {
      let n = v * (MUL[k] ?? 1.15) + (ADD[k] ?? 0);
      if (CAP[k] != null) n = Math.max(v, Math.min(CAP[k], n));
      out[k] = Math.max(v, round(n));
    } else if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = boost(v as Record<string, unknown>); // e.g. tank roof MG
    else out[k] = v;
  }
  return out;
}

const cache = new Map<string, TowerTier>();
/** The synthetic fused tier for a tower type (last tier, multiplied). */
export function fusedTier(d: TowerData, branch: number | null = null): TowerTier {
  const b = branch != null && SPECS[d.id] ? branch : null, key = d.id + ':' + b;
  let t = cache.get(key); if (t) return t;
  const last = b != null ? branchTier(d, b) : d.tiers[d.tiers.length - 1]; // t105: a specialised pair fuses its branch
  t = {
    ...last,
    name: `${last.name} ★ Fused`,
    cost: Math.round(d.tiers.reduce((a, x) => a + x.cost, 0) * FUSION.feeK / 5) * 5,
    blurb: 'Two max-tier towers forged into one: ×1.4 damage, +10% fire rate, +8% range, +1 pierce, ×1.8 armour.',
    maxHp: Math.round(last.maxHp * 1.8),
    visual: { ...last.visual, level: last.visual.level + 1, scale: round((last.visual.scale ?? 1) * 1.15), glow: FUSION.glow },
    combat: last.combat && (boost(last.combat as unknown as Record<string, unknown>) as unknown as TowerTier['combat']),
    cover: last.cover && (boost(last.cover as unknown as Record<string, unknown>) as unknown as TowerTier['cover']),
    farm: last.farm && (boost(last.farm as unknown as Record<string, unknown>) as unknown as TowerTier['farm']),
    aura: last.aura && (boost(last.aura as unknown as Record<string, unknown>) as unknown as TowerTier['aura']),
    orbs: last.orbs && (boost(last.orbs as unknown as Record<string, unknown>) as unknown as TowerTier['orbs']),
    hypno: last.hypno && (boost(last.hypno as unknown as Record<string, unknown>) as unknown as TowerTier['hypno']),
  };
  cache.set(key, t); return t;
}
/** Towers that can fuse (path objects / single-use pods cannot). */
export const canFuseType = (d: TowerData) => d.kind !== 'path' && !d.singleUse;
export const fusionFee = (d: TowerData, branch: number | null = null) => fusedTier(d, branch).cost;
