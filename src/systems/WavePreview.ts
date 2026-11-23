// =============================================================================
// t109 Threat Brief: the same post-scaling spawn plan WaveManager.start() uses,
// plus Cabras-only 16–21 authored tweaks (so the wave-19 preview matches actual
// spawns). Feature B/D and new enemies are out of scope.
// =============================================================================
import type { EnemyData, WaveData, WaveGroup } from '../core/types';
import { ENEMIES } from '../data/enemies';
import { boostHpMul } from './Boosts';
import { threatClass, type ThreatClass } from './Contracts';

/** Isla de Cabras only: authored-group overrides applied before count scaling. */
const CABRAS_TWEAKS: Record<number, Record<string, Partial<Pick<WaveGroup, 'count' | 'spacing' | 'delay'>>>> = {
  // Variant A: 3 Sky Colossi would scale up (count>2); 2 stay authored. 10s spacing.
  19: { moab: { count: 2, spacing: 10 } },
};

export function adjustWaveGroups(mapId: string, waveNum: number, groups: WaveGroup[]): WaveGroup[] {
  if (mapId !== 'tropical') return groups;
  const tw = CABRAS_TWEAKS[waveNum];
  if (!tw) return groups;
  return groups.map((g) => {
    const o = tw[g.enemy];
    return o ? { ...g, ...o } : g;
  });
}

/** Matches Game.spawnEnemy: named bosses with a kit scale HP at ~half the wave curve. */
export function spawnHpMul(base: number, d: EnemyData): number {
  return d.bossKit && base > 1 ? 1 + (base - 1) * 0.45 : base;
}
export function effectiveHp(d: EnemyData, baseHpMul: number): number {
  const m = spawnHpMul(baseHpMul, d);
  return Math.max(1, Math.round(d.hp * m)) + Math.round((d.shield ?? 0) * m);
}

export interface PlannedSpawn { t: number; id: string; lane: number }
export interface PlannedGroup {
  id: string; name: string; count: number; hp: number; cls: ThreatClass;
  air: boolean; armored: boolean; shielded: boolean; boss: boolean;
  lanes: number[]; delay: number; spacing: number;
}
export interface WavePlan {
  wave: number; bonus: number; boss: boolean; hpMul: number;
  scale: { hp: number; count: number };
  queue: PlannedSpawn[];
  groups: PlannedGroup[];
}

export function planWave(opts: {
  mapId: string; index: number; wave: WaveData; lanes: number;
  diffHp: number; diffCount: number; diffLate: number; mapEase: number; boostHp: number;
}): WavePlan {
  const { mapId, index, lanes, diffHp, diffCount, diffLate, mapEase, boostHp } = opts;
  const groups = adjustWaveGroups(mapId, index + 1, opts.wave.groups);
  const sc = waveScale(index + 1);
  const ramp = Math.min(1, 0.35 + index / 25);
  const lr = Math.max(0, Math.min(1, (index - 14) / 20)), cm = 1 + (diffCount - 1) * lr;
  const hpMul = sc.hp * (diffHp > 1 ? 1 + (diffHp - 1) * ramp : diffHp) * (1 + (diffLate - 1) * lr) * mapEase * boostHpMul(boostHp, index);
  const queue: PlannedSpawn[] = [];
  const planned: PlannedGroup[] = [];
  groups.forEach((grp, gi) => {
    const big = grp.count > 2, n = Math.round(grp.count * (big ? sc.count * cm : 1));
    const spacing = grp.spacing / Math.sqrt(sc.count * (big ? cm : 1));
    const laneHits: number[] = [];
    for (let i = 0; i < n; i++) {
      const lane = (gi + i) % Math.max(1, lanes);
      queue.push({ t: grp.delay + i * spacing, id: grp.enemy, lane });
      laneHits.push(lane);
    }
    const d = ENEMIES[grp.enemy];
    planned.push({
      id: grp.enemy, name: d?.name ?? grp.enemy, count: n, hp: d ? effectiveHp(d, hpMul) : 0,
      cls: d ? threatClass(d) : 'rush',
      air: !!(d?.flying || d?.air), armored: (d?.armored ?? 0) > 0 || !!d?.bossKit,
      shielded: !!(d?.shield || d?.bossKit), boss: !!(d?.boss || d?.bossKit),
      lanes: laneHits, delay: grp.delay, spacing,
    });
  });
  queue.sort((a, b) => a.t - b.t);
  return { wave: index + 1, bonus: opts.wave.bonus, boss: !!opts.wave.boss, hpMul, scale: sc, queue, groups: planned };
}

/** Merge groups of the same id (counts, lanes) and pick the three most dangerous. */
export function topThreats(groups: PlannedGroup[], n = 3): PlannedGroup[] {
  const m = new Map<string, PlannedGroup>();
  for (const g of groups) {
    const p = m.get(g.id);
    if (!p) m.set(g.id, { ...g, lanes: [...g.lanes] });
    else { p.count += g.count; p.lanes.push(...g.lanes); }
  }
  return [...m.values()].sort((a, b) => {
    const da = (a.boss ? 1e9 : 0) + a.hp * a.count, db = (b.boss ? 1e9 : 0) + b.hp * b.count;
    return db - da;
  }).slice(0, n);
}

export function laneSplit(lanes: number[], totalLanes: number): string {
  if (!lanes.length || totalLanes <= 1) return totalLanes <= 1 ? 'single lane' : '';
  const c = new Array(totalLanes).fill(0);
  for (const L of lanes) c[L % totalLanes]++;
  const used = c.map((n, i) => n ? `L${i + 1}×${n}` : '').filter(Boolean);
  return used.join(' · ');
}

export function fmtHp(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k`;
  return String(n);
}

/** Ramp: HP and crowd scaling from wave 4; steeper HP past 40 and in freeplay (crowd capped for 60 FPS). */
export function waveScale(wave: number) {
  const k = Math.max(0, wave - 3), late = Math.max(0, wave - 40), fp = Math.max(0, wave - 100);
  return { hp: 1 + 0.065 * k + 0.09 * late + 0.004 * fp * fp, count: Math.min(2.6, 1 + 0.035 * k) };
}
