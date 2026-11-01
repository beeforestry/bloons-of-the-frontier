// t36 tower balance pass (one-shot): flattens DPS-per-credit so upgrades are smaller, smoother
// increments and no tower's top tier out-earns the rest. Keeps every numeric stat non-decreasing.
// `npx tsx scripts/rebalance_t36.ts [--apply]` prints the plan; --apply patches src/data/towers.ts.
import { readFileSync, writeFileSync } from 'node:fs';
import { TOWERS } from '../src/data/towers';
import { towerDps } from './balance';
import type { TowerTier } from '../src/core/types';

const APPLY = process.argv.includes('--apply');
const r2 = (n: number) => Math.round(n * 100) / 100, r5 = (n: number) => Math.round(n / 5) * 5;
// per-tower efficiency caps (DPS per 100¢ of cumulative cost) by tier; utility towers get lower caps
const CAP = [2.25, 2.65, 2.9], FLOOR = [1.15, 1.3, 1.45];
const UTIL: Record<string, number> = { glue_slinger: 0.85, frost_wallnut_bastion: 1, sniper_monkey: 0.8, unsc_flak: 0.9, solar_pea_fusion: 0.9, chomper: 0.9, tesla_coil: 0.95, hypno_shroom: 1 };
let src = readFileSync('src/data/towers.ts', 'utf8');
const out: string[] = ['| tower | tier | cost | → | DPS | → | DPS/100¢ | → |', '|---|---|---|---|---|---|---|---|'];
for (const tw of TOWERS) {
  if (!tw.tiers.every((t) => t.combat) || tw.tiers.every((t) => towerDps(t) === 0)) continue;
  const old = tw.tiers.map((t) => ({ cost: t.cost, dmg: t.combat!.damage, rate: t.combat!.fireRate, dps: towerDps(t) }));
  const cost = old.map((o, i) => i === 0 ? o.cost : r5(o.cost * (i === 1 ? 1.08 : 1.2)));
  const cum = cost.map((_, i) => cost.slice(0, i + 1).reduce((a, b) => a + b, 0));
  const u = UTIL[tw.id] ?? 1;
  const eff: number[] = [];
  old.forEach((o, i) => {
    const cur = o.dps / cum[i] * 100;
    let e = Math.max(Math.min(cur, CAP[i] * u), Math.min(FLOOR[i] * u, cur * 1.35));
    if (i > 0) e = Math.min(e, eff[i - 1] * 1.2 + 0.05);       // smooth: at most ~+18% efficiency per tier
    if (i > 0) e = Math.max(e, eff[i - 1] * 0.97);               // and never much worse per credit
    eff.push(e);
  });
  let pd = 0, pr = 0;
  const neu = old.map((o, i) => {
    const target = eff[i] * cum[i] / 100, f = Math.min(1.35, target / o.dps);
    let dmg = Math.max(pd, o.dmg * f ** 0.4);
    const per = (d: number, r: number) => towerDps({ ...tw.tiers[i], combat: { ...tw.tiers[i].combat!, damage: d, fireRate: r } } as TowerTier);
    let rate = o.rate * target / per(dmg, o.rate);
    if (rate < pr) { rate = pr; const lo = pd; let hi = dmg; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (per(m, rate) > target) hi = m; else dmg = m; } dmg = Math.max(pd, hi); }
    dmg = r2(Math.max(pd, dmg)); rate = r2(Math.max(pr, rate));
    if (i > 0 && dmg === pd && rate === pr) rate = r2(pr + 0.05);
    pd = dmg; pr = rate;
    return { cost: cost[i], dmg, rate, dps: per(dmg, rate) };
  });
  neu.forEach((n, i) => {
    const o = old[i];
    out.push(`| ${tw.id} | T${i + 1} | ${o.cost} | ${n.cost} | ${o.dps.toFixed(1)} | ${n.dps.toFixed(1)} | ${(o.dps / old.slice(0, i + 1).reduce((a, b) => a + b.cost, 0) * 100).toFixed(2)} | ${(n.dps / cum[i] * 100).toFixed(2)} |`);
    if (!APPLY) return;
    const t = tw.tiers[i];
    const at = src.indexOf(`id: '${tw.id}'`);
    const ni = src.indexOf(`name: '${t.name.replace(/'/g, "\\'")}', cost: ${o.cost}`, at);
    if (ni < 0) throw new Error(`tier not found ${tw.id} ${t.name}`);
    src = src.slice(0, ni) + src.slice(ni).replace(`cost: ${o.cost}`, `cost: ${n.cost}`);
    const ci = src.indexOf('combat: {', ni);
    const seg = src.slice(ci, src.indexOf('}', ci));
    const seg2 = seg.replace(/damage: [\d.]+/, `damage: ${n.dmg}`).replace(/fireRate: [\d.]+/, `fireRate: ${n.rate}`);
    src = src.slice(0, ci) + seg2 + src.slice(ci + seg.length);
  });
}
console.log(out.join('\n'));
if (APPLY) { writeFileSync('src/data/towers.ts', src); writeFileSync('balance/t36_towers.md', '# t36 tower rebalance (static)\n\n' + out.join('\n') + '\n'); }
