// =============================================================================
// t105 HIDDEN CROSS-TYPE FUSION RECIPES
// Two DIFFERENT max-tier towers of the same owner, side by side, can fuse into a tower that is never
// sold in the shop. The Fuse button shows "???" until the player has discovered the recipe once
// (localStorage 'bof.recipes'); the Almanac (Element guide) lists cryptic hints + discovered entries.
// Stats derive from the parents' last tiers so the result is always stronger than either parent.
// =============================================================================
import type { CombatStats, TowerData, TowerTier } from '../core/types';
import { HIDDEN_TOWERS, TOWERS } from './towers';

export interface Recipe {
  id: string;
  /** The tower whose spot the result takes (the other one dissolves into it). */
  a: string;
  /** Any of these partners works. */
  b: string[];
  /** Almanac hint shown before discovery. */
  hint: string;
}

export const RECIPES: Recipe[] = [
  { id: 'storm_core', a: 'tesla_coil', b: ['frost_wallnut_bastion'], hint: 'Where hoarfrost stands beside the thunder…' },
  { id: 'inferno_battery', a: 'flame_melon_mortar', b: ['dart_monkey', 'solar_pea_fusion'], hint: 'Give the fire-lobber a quick-handed friend…' },
  { id: 'elite_barracks', a: 'unsc_firebase', b: ['sunflower'], hint: 'A bunker that basks in sunlight…' },
];

const byId = (id: string) => TOWERS.find((t) => t.id === id)!;
const last = (d: TowerData) => d.tiers[d.tiers.length - 1];
const full = (d: TowerData) => d.tiers.reduce((s, t) => s + t.cost, 0);
const r2 = (n: number) => Math.round(n * 100) / 100;
/** Fusion fee for a recipe: 30% of the parents' average full cost. */
export function recipeFee(r: Recipe, bId = r.b[0]): number { return Math.round((0.3 * (full(byId(r.a)) + full(byId(bId)))) / 2 / 5) * 5; }

function build(): TowerData[] {
  const tesla = last(byId('tesla_coil')), frost = last(byId('frost_wallnut_bastion')), melon = last(byId('flame_melon_mortar')),
    dart = last(byId('dart_monkey')), fb = last(byId('unsc_firebase')), sun = last(byId('sunflower'));
  const cost = (r: Recipe) => full(byId(r.a)) + full(byId(r.b[0])) + recipeFee(r);
  const tier = (name: string, r: Recipe, blurb: string, color: string, rest: Partial<TowerTier>, hp: number): TowerTier =>
    ({ name, cost: cost(r), blurb, visual: { level: 3, scale: 1.25, glow: color }, maxHp: hp, ...rest });
  const [rs, ri, re] = RECIPES;
  const tc = tesla.combat!, fc = frost.combat!, mc = melon.combat!;
  const storm: CombatStats = { ...tc, damage: r2(tc.damage * 1.35), fireRate: r2(tc.fireRate * 1.1), range: Math.round(Math.max(tc.range, fc.range) * 1.05),
    chain: (tc.chain ?? 0) + 3, slow: Math.min(0.75, Math.max(tc.slow ?? 0, fc.slow ?? 0) + 0.1), status: Math.max(tc.status ?? 0, fc.status ?? 0) };
  const inferno: CombatStats = { ...mc, damage: r2(mc.damage * 1.15), fireRate: r2(mc.fireRate * 1.35), shots: 3, splash: Math.round((mc.splash ?? 0) * 1.1),
    range: Math.max(mc.range, dart.combat!.range), status: r2((mc.status ?? 0) * 1.15) };
  return [
    { id: 'storm_core', name: 'Storm Core', faction: byId('tesla_coil').faction, kind: 'combat', sprite: byId('tesla_coil').sprite, hidden: true, lookId: 'tesla_coil', lookTier: 2,
      mark: { color: '#8fe8ff', glyph: 'SC' }, damageType: 'energy', element: 'shock', element2: 'chill', projectile: 'tesla', hitscan: true, hitsAir: true, antiAir: true,
      desc: 'HIDDEN FUSION (Tesla Coil + Frost Oakshield). A frozen thunderhead: chain lightning that alternates ⚡ Shock and ❄ Chill, slows everything it touches, and keeps the Bastion\'s cover aura.',
      tiers: [tier('Storm Core', rs, 'Chain lightning ×1.35 dmg, +3 jumps, alternating Shock / Chill, slow, cover aura.', '#8fe8ff', { combat: storm, cover: { ...frost.cover! } }, tesla.maxHp + frost.maxHp)] },
    { id: 'inferno_battery', name: 'Inferno Battery', faction: byId('flame_melon_mortar').faction, kind: 'combat', sprite: byId('flame_melon_mortar').sprite, hidden: true, lookId: 'flame_melon_mortar', lookTier: 2,
      mark: { color: '#ff6a2a', glyph: 'IB' }, damageType: 'fire', element: 'burn', projectile: 'melon',
      desc: 'HIDDEN FUSION (Flame Melon Mortar + a quick shooter). Lobs a three-bomb volley of burning, exploding melons — Burning + explosion triggers Wildfire.',
      tiers: [tier('Inferno Battery', ri, '3-melon volleys, +35% rate, ×1.15 dmg, longer burn.', '#ff6a2a', { combat: inferno }, melon.maxHp + dart.maxHp)] },
    { id: 'elite_barracks', name: 'Elite Barracks', faction: byId('unsc_firebase').faction, kind: 'cover', sprite: byId('unsc_firebase').sprite, hidden: true, lookId: 'unsc_firebase', lookTier: 2,
      mark: { color: '#7aff9a', glyph: 'EB' },
      desc: 'HIDDEN FUSION (Firebase + Sunflower). Veteran garrison: +2 slots, tougher and longer-ranged troops, stronger cover aura, plus a sun aura (+attack speed, +income).',
      tiers: [tier('Elite Barracks', re, '+2 slots, ×1.4 aura HP, troops −80% damage taken, sun aura.', '#7aff9a', {
        cover: { auraRadius: Math.round(fb.cover!.auraRadius * 1.1), bonusMaxHp: Math.round(fb.cover!.bonusMaxHp * 1.4), bonusRangePct: r2(fb.cover!.bonusRangePct * 1.2),
          garrisonSlots: fb.cover!.garrisonSlots + 2, regen: r2(fb.cover!.regen * 1.5), garrisonProtect: Math.min(0.8, (fb.cover!.garrisonProtect ?? 0.5) + 0.15),
          garrisonRangePct: r2((fb.cover!.garrisonRangePct ?? 0.35) + 0.1) },
        aura: { radius: Math.round(sun.aura!.radius * 1.05), ratePct: r2(sun.aura!.ratePct * 1.15), incomePct: sun.aura!.incomePct } }, fb.maxHp + sun.maxHp)] },
  ];
}
if (!HIDDEN_TOWERS.length) HIDDEN_TOWERS.push(...build());

export const recipeById = (id: string) => RECIPES.find((r) => r.id === id);
/** The recipe two tower ids make (order-free), or null. */
export function recipeFor(x: string, y: string): Recipe | null {
  for (const r of RECIPES) if ((r.a === x && r.b.includes(y)) || (r.a === y && r.b.includes(x))) return r;
  return null;
}
/** Parents' powers vs the recipe tower (validator). */
export function recipeParents(r: Recipe): TowerData[] { return [byId(r.a), ...r.b.map(byId)]; }

// ---- discovery (per browser) ----
const KEY = 'bof.recipes';
export function discovered(): string[] {
  try { const v = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch { return []; }
}
export function isDiscovered(id: string) { return discovered().includes(id); }
export function discover(id: string): boolean {
  const d = discovered(); if (d.includes(id)) return false;
  d.push(id); try { globalThis.localStorage?.setItem(KEY, JSON.stringify(d)); } catch { /* private mode */ }
  return true;
}
