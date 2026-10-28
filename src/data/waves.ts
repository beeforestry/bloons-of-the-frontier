// 20 waves mixing bloons and hive bugs. Counter-check enemies arrive from wave 4:
// Ironback (armored: needs pierce/explosive/AP), Shield Warden (pop the shield / EMP),
// Hive Gargoyle (air: anti-air only — Flak, Sniper, Super Monkey, rifles). [enemy, count, spacing s, start delay s]
import type { WaveData } from '../core/types';
type Row = [string, number, number, number];
const W = (bonus: number, ...rows: Row[]): WaveData => ({ bonus, groups: rows.map(([enemy, count, spacing, delay]) => ({ enemy, count, spacing, delay })) });

export const WAVES: WaveData[] = [
  W(100, ['red', 14, 0.9, 0], ['scavenger', 6, 0.7, 4]),
  W(110, ['red', 16, 0.6, 0], ['blue', 8, 0.9, 4], ['scavenger', 10, 0.4, 7]),
  W(120, ['blue', 14, 0.6, 0], ['scavenger', 14, 0.35, 3], ['hunter', 3, 2, 8]),
  W(130, ['green', 14, 0.6, 0], ['hunter', 6, 1.2, 4], ['scavenger', 14, 0.3, 8], ['ironback', 2, 3, 10]),
  W(140, ['blue', 22, 0.4, 0], ['green', 10, 0.6, 6], ['brood', 1, 1, 8], ['warden', 2, 3, 10]),
  W(150, ['yellow', 12, 0.7, 0], ['charger', 1, 1, 5], ['scavenger', 16, 0.3, 6], ['gargoyle', 4, 1.4, 9]),
  W(160, ['green', 22, 0.4, 0], ['lead', 2, 3, 6], ['hunter', 8, 0.8, 8], ['ironback', 3, 2.5, 4]),
  W(170, ['pink', 10, 0.6, 0], ['lead', 4, 2.2, 3], ['brood', 2, 4, 6], ['warden', 4, 2, 8], ['gargoyle', 4, 1.2, 12]),
  W(180, ['yellow', 24, 0.35, 0], ['ceramic', 3, 2, 8], ['hunter', 10, 0.6, 5], ['ironback', 4, 2, 10], ['gargoyle', 6, 0.9, 6]),
  W(200, ['bile_titan', 1, 1, 6], ['pink', 16, 0.45, 0], ['scavenger', 22, 0.25, 3], ['warden', 6, 1.5, 9]),
  W(210, ['ceramic', 6, 1.4, 0], ['charger', 3, 3, 3], ['pink', 22, 0.3, 6], ['gargoyle', 8, 0.8, 4], ['ironback', 5, 1.6, 10]),
  W(220, ['boss_scarab', 1, 1, 12], ['lead', 8, 1.0, 0], ['brood', 3, 3, 3], ['hunter', 14, 0.5, 6], ['warden', 6, 1.4, 5], ['gargoyle', 6, 0.8, 9]),
  W(230, ['pink', 32, 0.22, 0], ['charger', 4, 2, 4], ['ceramic', 8, 1.1, 8], ['ironback', 8, 1.2, 6]),
  W(240, ['lead', 12, 0.8, 0], ['bile_titan', 1, 1, 6], ['scavenger', 26, 0.2, 4], ['warden', 8, 1.2, 8], ['gargoyle', 10, 0.6, 3]),
  W(260, ['moab', 1, 1, 4], ['yellow', 24, 0.3, 0], ['hunter', 16, 0.5, 6], ['ironback', 8, 1, 8], ['gargoyle', 10, 0.6, 10]),
  W(270, ['boss_zeppelin', 1, 1, 10], ['ceramic', 14, 0.7, 0], ['charger', 6, 1.6, 4], ['brood', 3, 3, 8], ['warden', 10, 1, 3]),
  W(280, ['bile_titan', 2, 8, 0], ['pink', 36, 0.2, 2], ['hunter', 18, 0.35, 6], ['gargoyle', 14, 0.5, 5], ['ironback', 10, 0.9, 10]),
  W(300, ['moab', 2, 6, 10], ['charger', 8, 1.2, 0], ['ceramic', 12, 0.7, 4], ['scavenger', 36, 0.15, 6], ['warden', 12, 0.9, 8]),
  W(320, ['moab', 3, 7, 0], ['bile_titan', 2, 8, 4], ['lead', 14, 0.6, 6], ['brood', 4, 2.5, 8], ['gargoyle', 18, 0.4, 3], ['ironback', 12, 0.8, 9]),
  W(400, ['boss_dreadnought', 1, 1, 14], ['moab', 5, 5, 0], ['bile_titan', 3, 6, 3], ['charger', 10, 1, 2], ['ceramic', 16, 0.5, 6], ['hunter', 22, 0.3, 9], ['warden', 14, 0.8, 4], ['gargoyle', 22, 0.35, 7], ['ironback', 14, 0.7, 11]),
];

// ---------------------------------------------------------------------------
// Procedural waves past the hand-authored 20 (and endless Freeplay). Deterministic
// per wave number. Every 10th wave brings a phase boss (rotating Scarab / Zeppelin /
// Dreadnought, two at once from wave 50), every 5th a MOAB pack. The finale of a
// difficulty is built by finaleWave().
// ---------------------------------------------------------------------------
function rng(seed: number) { let s = (seed * 2654435761) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const POOLS: [number, string[]][] = [
  [0, ['pink', 'yellow', 'hunter', 'scavenger', 'ironback', 'warden', 'gargoyle', 'lead', 'ceramic', 'charger', 'brood']],
  [35, ['ceramic', 'lead', 'charger', 'ironback', 'warden', 'gargoyle', 'hunter', 'brood', 'pink']],
  [60, ['ceramic', 'charger', 'ironback', 'warden', 'gargoyle', 'moab', 'bile_titan', 'lead']],
];
const BOSSES = ['boss_scarab', 'boss_zeppelin', 'boss_dreadnought'];
const HEAVY = new Set(['moab', 'bile_titan', 'charger', 'brood']);
export function procWave(n: number): WaveData {
  const r = rng(n * 97 + 13), pool = [...POOLS].reverse().find(([from]) => n >= from)![1];
  const groups: WaveData['groups'] = [];
  const k = 4 + Math.floor(r() * 3);
  for (let i = 0; i < k; i++) {
    const enemy = pool[Math.floor(r() * pool.length)];
    const base = HEAVY.has(enemy) ? 2 + n / 25 : 10 + n / 4;
    groups.push({ enemy, count: Math.round(base * (0.7 + r() * 0.6)), spacing: HEAVY.has(enemy) ? 2.2 : 0.35 + r() * 0.4, delay: i * 2.5 + r() * 3 });
  }
  if (n % 5 === 0) groups.push({ enemy: 'moab', count: 1 + Math.floor(n / 30), spacing: 5, delay: 6 });
  if (n % 10 === 0) {
    groups.push({ enemy: BOSSES[(n / 10) % 3], count: 1, spacing: 1, delay: 12 });
    if (n >= 50) groups.push({ enemy: BOSSES[(n / 10 + 1) % 3], count: 1, spacing: 1, delay: 30 });
  }
  return { groups, bonus: Math.min(900, 300 + n * 6), boss: n % 10 === 0 };
}
/** The last wave of a difficulty: wave 100 = the GIANT FINAL BOSS; shorter runs end on a boss trio. */
export function finaleWave(n: number): WaveData {
  const w = procWave(n);
  if (n >= 100) w.groups = [{ enemy: 'boss_leviathan', count: 1, spacing: 1, delay: 8 }, { enemy: 'ceramic', count: 30, spacing: 0.4, delay: 0 }, { enemy: 'charger', count: 8, spacing: 2, delay: 20 }, { enemy: 'gargoyle', count: 14, spacing: 0.8, delay: 26 }];
  else w.groups = [...w.groups.filter((g) => !g.enemy.startsWith('boss_')), ...BOSSES.map((enemy, i) => ({ enemy, count: 1, spacing: 1, delay: 10 + i * 22 }))];
  w.boss = true; w.bonus = 0;
  return w;
}
/** Wave list for a run of `total` waves. */
export function buildWaves(total: number): WaveData[] {
  const out: WaveData[] = [];
  for (let n = 1; n <= total; n++) out.push(n === total ? finaleWave(n) : n <= WAVES.length ? { ...WAVES[n - 1], bonus: WAVES[n - 1].bonus || 400 } : procWave(n));
  return out;
}
