// Balance metric (static): effective DPS per 100 credits (cumulative cost), HP per 100 credits,
// range and a "value score" for every tower / troop tier. `npx tsx scripts/balance.ts` -> balance/static.md + JSON.
import { writeFileSync, mkdirSync } from 'node:fs';
import { TOWERS } from '../src/data/towers';
import { UNITS } from '../src/data/units';
import type { TowerTier, UnitTier } from '../src/core/types';

export function towerDps(t: TowerTier): number {
  const c = t.combat; if (!c) return 0;
  let per = c.damage * (c.shots ?? 1) * Math.min(c.pierce, 4) ** 0.6;
  if (c.splash) per *= 1 + Math.min(c.splash, 120) / 60;
  if (c.chain) per *= 1 + c.chain * 0.8 * 0.7;
  if (c.specialRate && c.specialDamage) per += c.specialRate * c.specialDamage;
  let dps = per * c.fireRate;
  if (c.devour) dps += (c.devour * c.fireRate) * 0.5;
  return dps;
}
export function unitDps(t: UnitTier, n: number) { return t.stats.damage * t.stats.attackRate * n * (t.weapon.splash ? 1 + Math.min(t.weapon.splash, 100) / 60 : 1); }
const rows: Record<string, unknown>[] = [];
for (const tw of TOWERS) {
  let cum = 0;
  tw.tiers.forEach((t, i) => {
    cum += t.cost;
    const dps = towerDps(t);
    const util = t.hypno ? t.hypno.perMin * t.hypno.maxConverted * t.hypno.maxHp / 60 : t.farm ? t.farm.income * t.farm.payoutsPerMin / 60 : t.orbs ? t.orbs.energy * t.orbs.perMin / 60 : t.barrier ? (t.barrier.blast ?? 0) / 10 + t.maxHp / 60 : t.aura ? t.aura.ratePct * 100 : 0;
    rows.push({ kind: 'tower', id: tw.id, tier: i + 1, name: t.name, cost: cum, dps: +dps.toFixed(1), dpsPer100: +(dps / cum * 100).toFixed(2), hpPer100: +(t.maxHp / cum * 100).toFixed(1), range: t.combat?.range ?? t.hypno?.range ?? 0, util: +util.toFixed(2) });
  });
}
for (const u of UNITS) {
  let cum = 0; const n = (u as unknown as { squadSize?: number }).squadSize ?? 1;
  u.tiers.forEach((t, i) => {
    cum += t.cost;
    const dps = unitDps(t, n), hp = t.stats.maxHp * n * (1 + t.stats.armor);
    rows.push({ kind: 'unit', id: u.id, tier: i + 1, name: t.name, cost: cum + (u.scrapCost ?? 0) * 2, dps: +dps.toFixed(1), dpsPer100: +(dps / (cum + (u.scrapCost ?? 0) * 2) * 100).toFixed(2), hpPer100: +(hp / (cum + (u.scrapCost ?? 0) * 2) * 100).toFixed(1), range: t.stats.range, util: 0 });
  });
}
mkdirSync('balance', { recursive: true });
writeFileSync('balance/static.json', JSON.stringify(rows, null, 1));
const md = ['| kind | id | T | cum cost | DPS | DPS/100¢ | HP/100¢ | range | util |', '|---|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.kind} | ${r.id} | ${r.tier} | ${r.cost} | ${r.dps} | ${r.dpsPer100} | ${r.hpPer100} | ${r.range} | ${r.util} |`)].join('\n');
writeFileSync('balance/static.md', md + '\n');
console.log(md);
