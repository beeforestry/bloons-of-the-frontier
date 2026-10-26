// =============================================================================
// UPGRADE RULE VALIDATOR
// User's game rule: "all upgrades of all towers and units must have better stats
// that match their improved looks. Higher-tier visuals = stronger stats."
//
// For every consecutive pair of tiers we require:
//   1. No numeric stat goes down (all stats are defined "higher is better").
//   2. Overall power strictly increases (DPS / aura strength / income).
//   3. visual.level strictly increases and visual.scale never shrinks,
//      so the stronger tier always looks stronger too.
//   4. A module (combat/cover/farm, special) present in a tier is kept by later tiers.
// Runs at dev boot (console warnings) and in `npm run validate` (CI gate).
// =============================================================================
import type { TowerData, TowerTier, UnitData, UnitTier } from '../core/types';
import { TOWERS } from './towers';
import { UNITS } from './units';
import { ENEMIES } from './enemies';
import { WAVES } from './waves';
import ART_MANIFEST from '../render/art.manifest.json';
import { BUILDINGS } from './buildings';
import { MAPS } from './maps';
import type { BuildingData, BuildingTier } from '../core/types';

export interface Issue { owner: string; tier: number; msg: string }

function compareNumbers(owner: string, tier: number, label: string, prev: Record<string, any> | undefined, next: Record<string, any> | undefined, out: Issue[]) {
  if (!prev) return;
  if (!next) { out.push({ owner, tier, msg: `${label} module was removed (upgrades may not lose abilities)` }); return; }
  for (const k of Object.keys(prev)) {
    const a = prev[k], b = next[k];
    if (typeof a !== 'number') continue;
    if (typeof b !== 'number') out.push({ owner, tier, msg: `${label}.${k} missing in upgraded tier` });
    else if (b < a - 1e-9) out.push({ owner, tier, msg: `${label}.${k} goes DOWN ${a} -> ${b}` });
  }
}

export function towerPower(t: TowerTier): number {
  let p = t.maxHp * 0.01;
  if (t.combat) {
    const c = t.combat;
    p += c.damage * c.fireRate * (c.shots ?? 1) * (1 + 0.25 * (c.pierce - 1)) * (1 + (c.splash ?? 0) / 60) * (c.range / 150);
    p += (c.specialRate ?? 0) * (c.specialDamage ?? 0) * c.fireRate + (c.slow ?? 0);
  }
  if (t.cover) p += (t.cover.auraRadius / 100) * (t.cover.bonusMaxHp / 10 + t.cover.bonusRangePct * 20) + t.cover.garrisonSlots + t.cover.regen;
  if (t.farm) p += (t.farm.income * t.farm.payoutsPerMin) / 10 + t.farm.waveBonus / 20;
  return p;
}
export function unitPower(t: UnitTier): number {
  const s = t.stats;
  return s.maxHp * (1 + s.armor * 0.1) * 0.05 + s.damage * s.attackRate * (s.range > 60 ? 1.5 : 1) + (t.weapon.hitsAir ? 2 : 0) + (t.weapon.splash ?? 0) / 20 +
    (t.special ? t.special.damage / t.special.every : 0) + (s.repair ?? 0) + (s.pickupRadius ?? 0) / 50 + s.speed / 100;
}

function checkVisual(owner: string, i: number, a: { level: number; scale?: number }, b: { level: number; scale?: number }, out: Issue[]) {
  if (!(b.level > a.level)) out.push({ owner, tier: i, msg: `visual.level must increase (${a.level} -> ${b.level}) so the upgrade looks better` });
  if ((b.scale ?? 1) < (a.scale ?? 1)) out.push({ owner, tier: i, msg: `visual.scale shrinks (${a.scale} -> ${b.scale})` });
}

export function validateTower(t: TowerData): Issue[] {
  const out: Issue[] = [];
  if (!t.faction) out.push({ owner: t.id, tier: 0, msg: 'missing faction' });
  t.tiers.forEach((tier, i) => {
    if (!(tier.cost > 0)) out.push({ owner: t.id, tier: i, msg: 'cost must be > 0' });
    if (t.kind === 'combat' && !tier.combat) out.push({ owner: t.id, tier: i, msg: 'combat tower tier without combat stats' });
    if (t.kind === 'cover' && !tier.cover) out.push({ owner: t.id, tier: i, msg: 'cover tower tier without cover stats' });
    if (t.kind === 'farm' && !tier.farm) out.push({ owner: t.id, tier: i, msg: 'farm tower tier without farm stats' });
    if (i === 0) return;
    const a = t.tiers[i - 1];
    if (tier.maxHp < a.maxHp) out.push({ owner: t.id, tier: i, msg: `maxHp goes DOWN ${a.maxHp} -> ${tier.maxHp}` });
    compareNumbers(t.id, i, 'combat', a.combat, tier.combat, out);
    compareNumbers(t.id, i, 'cover', a.cover, tier.cover, out);
    compareNumbers(t.id, i, 'farm', a.farm, tier.farm, out);
    if (!(towerPower(tier) > towerPower(a))) out.push({ owner: t.id, tier: i, msg: 'overall power did not increase' });
    checkVisual(t.id, i, a.visual, tier.visual, out);
  });
  return out;
}

export function validateUnit(u: UnitData): Issue[] {
  const out: Issue[] = [];
  if (!u.faction) out.push({ owner: u.id, tier: 0, msg: 'missing faction' });
  u.tiers.forEach((tier, i) => {
    if (!(tier.cost > 0)) out.push({ owner: u.id, tier: i, msg: 'cost must be > 0' });
    if (i === 0) return;
    const a = u.tiers[i - 1];
    compareNumbers(u.id, i, 'stats', a.stats, tier.stats, out);
    compareNumbers(u.id, i, 'special', a.special, tier.special, out);
    if (a.weapon.hitsAir && !tier.weapon.hitsAir) out.push({ owner: u.id, tier: i, msg: 'weapon loses anti-air' });
    if (!(unitPower(tier) > unitPower(a))) out.push({ owner: u.id, tier: i, msg: 'overall power did not increase' });
    checkVisual(u.id, i, a.visual, tier.visual, out);
  });
  return out;
}

export function buildingPower(t: BuildingTier): number {
  const s = t.stats, g = s.gun;
  return s.maxHp * 0.01 + (s.income ?? 0) * (s.payoutsPerMin ?? 0) / 10 + (s.waveBonus ?? 0) / 20 + (s.tech ?? 0) * 3 + (s.pop ?? 0) +
    (s.energyRegen ?? 0) * 4 + (s.trainSpeed ?? 0) * 3 + (s.queue ?? 0) + (g ? g.damage * g.fireRate * g.pierce * (g.range / 150) : 0);
}
/** Buildings follow the same rule: every tier strictly stronger and visibly more advanced. */
export function validateBuilding(b: BuildingData): Issue[] {
  const out: Issue[] = [];
  b.tiers.forEach((tier, i) => {
    if (!(tier.cost > 0) || !(tier.buildTime > 0)) out.push({ owner: b.id, tier: i, msg: 'cost and buildTime must be > 0' });
    if (!ART.has(`${b.sprite}_${i}`)) out.push({ owner: b.id, tier: i, msg: `no tier art ${b.sprite}_${i}` });
    if (i === 0) return;
    const a = b.tiers[i - 1];
    const { gun: ga, ...sa } = a.stats, { gun: gb, ...sb } = tier.stats;
    compareNumbers(b.id, i, 'stats', sa, sb, out);
    compareNumbers(b.id, i, 'gun', ga, gb, out);
    if (!(buildingPower(tier) > buildingPower(a))) out.push({ owner: b.id, tier: i, msg: 'overall power did not increase' });
    checkVisual(b.id, i, a.visual, tier.visual, out);
  });
  return out;
}

/** Art rule: every tier ships its own painted sprite (so each upgrade visibly changes). */
const ART = new Set(Object.keys(ART_MANIFEST as Record<string, number[]>));
const artKey = (k: string) => k.replace(/^proc:/, '');
export function validateArt(): Issue[] {
  const out: Issue[] = [];
  for (const t of TOWERS) t.tiers.forEach((_, i) => { const k = artKey(t.sprite); if (!ART.has(`${k}_${i}`) && !ART.has(`${k}_head_${i}`)) out.push({ owner: t.id, tier: i, msg: `no tier art ${k}_${i}` }); });
  for (const u of UNITS) u.tiers.forEach((_, i) => { const k = artKey(u.sprite); if (!ART.has(`${k}_${i}`)) out.push({ owner: u.id, tier: i, msg: `no tier art ${k}_${i}` }); });
  for (const e of Object.values(ENEMIES)) if (!ART.has(artKey(e.sprite))) out.push({ owner: e.id, tier: 0, msg: `no art ${e.sprite}` });
  return out;
}

export function validateAll(): Issue[] {
  const out: Issue[] = validateArt();
  for (const t of TOWERS) out.push(...validateTower(t));
  for (const u of UNITS) out.push(...validateUnit(u));
  for (const b of BUILDINGS) out.push(...validateBuilding(b));
  for (const k of ['pad_empty', 'pad_build', 'fx_heal_pod', 'fx_crater']) if (!ART.has(k)) out.push({ owner: 'base', tier: 0, msg: `no art ${k}` });
  for (const u of UNITS) {
    if (!(u.population > 0)) out.push({ owner: u.id, tier: 0, msg: 'population must be > 0' });
    let prev = -1;
    u.tiers.forEach((t, i) => { const need = t.tech ?? i; if (need < prev) out.push({ owner: u.id, tier: i, msg: 'research tech requirement goes down' }); prev = need; });
  }
  for (const m of MAPS) {
    if (!m.lanes?.length) out.push({ owner: m.id, tier: 0, msg: 'map has no lanes' });
    for (const [li, l] of (m.lanes ?? []).entries()) { const e = l[l.length - 1]; if (Math.hypot(e[0] - m.hq[0], e[1] - m.hq[1]) > 260) out.push({ owner: m.id, tier: li, msg: 'lane does not end at the HQ' }); }
    if ((m.pads?.length ?? 0) < 4) out.push({ owner: m.id, tier: 0, msg: 'needs at least 4 build pads' });
  }
  for (const e of Object.values(ENEMIES)) {
    if (e.children && !ENEMIES[e.children.id]) out.push({ owner: e.id, tier: 0, msg: `unknown child ${e.children.id}` });
    if (e.spawns && !ENEMIES[e.spawns.id]) out.push({ owner: e.id, tier: 0, msg: `unknown spawn ${e.spawns.id}` });
  }
  WAVES.forEach((w, i) => w.groups.forEach((g) => { if (!ENEMIES[g.enemy]) out.push({ owner: `wave${i + 1}`, tier: 0, msg: `unknown enemy ${g.enemy}` }); }));
  return out;
}
