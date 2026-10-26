// 20 waves mixing bloons and hive bugs. [enemy, count, spacing s, start delay s]
import type { WaveData } from '../core/types';
type Row = [string, number, number, number];
const W = (bonus: number, ...rows: Row[]): WaveData => ({ bonus, groups: rows.map(([enemy, count, spacing, delay]) => ({ enemy, count, spacing, delay })) });

export const WAVES: WaveData[] = [
  W(100, ['red', 14, 0.9, 0], ['scavenger', 6, 0.7, 4]),
  W(110, ['red', 16, 0.6, 0], ['blue', 8, 0.9, 4], ['scavenger', 10, 0.4, 7]),
  W(120, ['blue', 14, 0.6, 0], ['scavenger', 14, 0.35, 3], ['hunter', 3, 2, 8]),
  W(130, ['green', 14, 0.6, 0], ['hunter', 6, 1.2, 4], ['scavenger', 16, 0.3, 8]),
  W(140, ['blue', 24, 0.4, 0], ['green', 10, 0.6, 6], ['brood', 1, 1, 8]),
  W(150, ['yellow', 12, 0.7, 0], ['charger', 1, 1, 5], ['scavenger', 18, 0.3, 6]),
  W(160, ['green', 22, 0.4, 0], ['lead', 2, 3, 6], ['hunter', 8, 0.8, 8]),
  W(170, ['pink', 10, 0.6, 0], ['lead', 4, 2.2, 3], ['brood', 2, 4, 6], ['charger', 1, 1, 12]),
  W(180, ['yellow', 24, 0.35, 0], ['ceramic', 3, 2, 8], ['hunter', 10, 0.6, 5]),
  W(200, ['bile_titan', 1, 1, 6], ['pink', 16, 0.45, 0], ['scavenger', 24, 0.25, 3]),
  W(210, ['ceramic', 6, 1.4, 0], ['charger', 3, 3, 3], ['pink', 24, 0.3, 6]),
  W(220, ['lead', 8, 1.0, 0], ['brood', 3, 3, 3], ['hunter', 14, 0.5, 6], ['yellow', 20, 0.3, 9]),
  W(230, ['pink', 36, 0.22, 0], ['charger', 4, 2, 4], ['ceramic', 8, 1.1, 8]),
  W(240, ['lead', 12, 0.8, 0], ['bile_titan', 1, 1, 6], ['scavenger', 30, 0.2, 4]),
  W(260, ['moab', 1, 1, 4], ['yellow', 24, 0.3, 0], ['hunter', 16, 0.5, 6]),
  W(270, ['ceramic', 14, 0.7, 0], ['charger', 6, 1.6, 4], ['brood', 3, 3, 8]),
  W(280, ['bile_titan', 2, 8, 0], ['pink', 40, 0.2, 2], ['hunter', 20, 0.35, 6]),
  W(300, ['moab', 2, 6, 10], ['charger', 8, 1.2, 0], ['ceramic', 12, 0.7, 4], ['scavenger', 40, 0.15, 6]),
  W(320, ['moab', 3, 7, 0], ['bile_titan', 2, 8, 4], ['lead', 14, 0.6, 6], ['brood', 4, 2.5, 8]),
  W(0, ['moab', 5, 5, 0], ['bile_titan', 3, 6, 3], ['charger', 10, 1, 2], ['ceramic', 16, 0.5, 6], ['hunter', 24, 0.3, 9]),
];
