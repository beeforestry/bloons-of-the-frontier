// =============================================================================
// t109 Feature A (contracts) + shared threat-class helper for Overload Routing.
// One-wave, no stack, no price, optional (Neutral is the default / Auto Waves).
// Unlock at wave 21. Host confirms in co-op via the usual Game method sync.
// =============================================================================
import type { EnemyData } from '../core/types';

export const BRIEF_FROM = 11;
export const CONTRACT_FROM = 21;

export type ThreatClass = 'sky' | 'plated' | 'rush';
export type ContractId = 'neutral' | 'sky' | 'plate' | 'supply';

/** Mutually exclusive threat class used by Overload Routing (flying bosses are Sky). */
export function threatClass(d: EnemyData): ThreatClass {
  if (d.flying || d.air) return 'sky';
  if (d.heavy || (d.armored ?? 0) > 0 || !!d.shield || d.boss || d.bossKit) return 'plated';
  return 'rush';
}

export function isAir(d: EnemyData): boolean { return !!(d.flying || d.air); }
export function isPlateTarget(d: EnemyData): boolean {
  return (d.armored ?? 0) > 0 || !!d.shield || !!d.boss || !!d.bossKit;
}

export interface ContractDef {
  id: ContractId; name: string; short: string; tip: string;
}

export const CONTRACTS: ContractDef[] = [
  { id: 'sky', name: 'Sky Watch', short: 'Air +25% · Ground −10%', tip: 'Towers deal ×1.25 to flying / air enemies and ×0.90 to ground for this wave.' },
  { id: 'plate', name: 'Plate Watch', short: 'Armored +20% · Other −10%', tip: 'Towers deal ×1.20 to armored, shielded, and boss enemies and ×0.90 to others for this wave.' },
  { id: 'supply', name: 'Supply Run', short: 'Income + · Towers −12%', tip: '+20% wave-clear bonus and +15% farm income, but towers deal ×0.88 damage this wave.' },
  { id: 'neutral', name: 'Neutral', short: 'No modifier', tip: 'No damage or income change. Auto Waves stays on Neutral unless you pick a contract first.' },
];

export const CONTRACT_BY_ID: Record<ContractId, ContractDef> = Object.fromEntries(CONTRACTS.map((c) => [c.id, c])) as Record<ContractId, ContractDef>;

export function contractsUnlocked(nextWave: number): boolean { return nextWave >= CONTRACT_FROM; }
export function briefUnlocked(nextWave: number): boolean { return nextWave >= BRIEF_FROM; }

/** Tower damage multiplier from the current one-wave contract. */
export function contractTowerMul(id: ContractId, d: EnemyData): number {
  if (id === 'sky') return isAir(d) ? 1.25 : 0.9;
  if (id === 'plate') return isPlateTarget(d) ? 1.2 : 0.9;
  if (id === 'supply') return 0.88;
  return 1;
}

export const SUPPLY_WAVE_BONUS = 1.2;
export const SUPPLY_FARM = 1.15;
