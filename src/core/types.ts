// =============================================================================
// Core enums + shared data shapes. This file is the browser equivalent of the
// Unity spec's Faction / TargetingMode / TowerData / UnitData / EnemyData.
// Data files in src/data/ are typed against these interfaces ("ScriptableObjects
// as plain TS objects"), so adding a tower = adding one object literal.
// =============================================================================

/** Player factions. Every tower, troop and ability carries one. */
export enum Faction {
  Primates = 'primates', // BTD6-style monkeys
  Flora = 'flora', // PvZ-style living plants
  UNSC = 'unsc', // UNSC / Frontier human tech (original designs)
  // FUTURE HOOKS - add a value here + an entry in FACTIONS (src/data/factions.ts):
  // Covenant = 'covenant',
  // Flood = 'flood',
}

/** BTD-style target priority. */
export enum TargetingMode {
  First = 'first',
  Last = 'last',
  Strong = 'strong',
  Close = 'close',
}
export const TARGETING_ORDER: TargetingMode[] = [TargetingMode.First, TargetingMode.Last, TargetingMode.Strong, TargetingMode.Close];

/** Damage types. Lead bloons ignore Sharp; Charger front armor ignores most non-explosive. */
export type DamageType = 'sharp' | 'explosive' | 'energy' | 'magic' | 'fire' | 'cold' | 'ballistic' | 'melee';

/** Visual description of one upgrade tier. `level` must strictly increase per tier (validated). */
export interface TierVisual {
  /** 0,1,2,... drives ring glow, pips, scale and procedural extra parts. */
  level: number;
  /** Optional sprite key override for this tier (e.g. money_monkey_l2). */
  sprite?: string;
  /** Glow color for the tier aura ring (higher tiers = flashier). */
  glow?: string;
  /** Draw scale multiplier (should be >= previous tier). */
  scale?: number;
}

/** Combat stats. All are "higher is better" so validation can compare them blindly. */
export interface CombatStats {
  damage: number;
  /** Shots per second. */
  fireRate: number;
  range: number;
  /** Targets one projectile can hit (hitscan: targets per beam). */
  pierce: number;
  /** Projectiles per shot (multishot) */
  shots?: number;
  /** Splash radius for explosive / magic bursts (0 = none). */
  splash?: number;
  projectileSpeed?: number;
  /** Every Nth shot is special (cherry bomb). Lower is better, so we store "bonusEvery" as frequency 1/N in `specialRate`. */
  specialRate?: number;
  specialDamage?: number;
  /** Slow strength 0..1 applied on hit (cold). */
  slow?: number;
}

export interface CoverStats {
  auraRadius: number;
  /** Flat +max HP granted to friendly towers/units inside. */
  bonusMaxHp: number;
  /** +% range granted (0.15 = +15%). */
  bonusRangePct: number;
  /** Units that can garrison inside and fire from the tower. */
  garrisonSlots: number;
  /** HP regen per second for units inside the aura. */
  regen: number;
}

export interface FarmStats {
  /** Credits per payout. */
  income: number;
  /** Payouts per minute (higher = better). */
  payoutsPerMin: number;
  /** End-of-wave bonus credits. */
  waveBonus: number;
}

export interface TowerTier {
  name: string;
  /** Cost to buy this tier (tier 0 = build cost). */
  cost: number;
  blurb: string;
  visual: TierVisual;
  /** Tower structural HP (bugs can damage towers). */
  maxHp: number;
  combat?: CombatStats;
  cover?: CoverStats;
  farm?: FarmStats;
}

export type TowerKind = 'combat' | 'cover' | 'farm';
export type ProjectileKind = 'dart' | 'pea' | 'gpea' | 'shuriken' | 'magic' | 'melon' | 'star' | 'bullet' | 'laser' | 'rail' | 'ice';

export interface TowerData {
  id: string;
  name: string;
  faction: Faction;
  kind: TowerKind;
  sprite: string;
  desc: string;
  hotkey?: string;
  damageType?: DamageType;
  projectile?: ProjectileKind;
  /** Hitscan beams instead of travelling projectiles. */
  hitscan?: boolean;
  /** Can it hit fliers (bloons)? default true. */
  hitsAir?: boolean;
  /** Can it hit ground (bugs)? default true. */
  hitsGround?: boolean;
  /** tiers[0] is the base tower; tiers[1..] are upgrades. */
  tiers: TowerTier[];
}

export interface UnitStats {
  maxHp: number;
  damage: number;
  /** Attacks per second. */
  attackRate: number;
  /** Weapon range: different weapons = different range. */
  range: number;
  speed: number;
  armor: number;
  /** Worker only: repair HP/s and pickup radius. */
  repair?: number;
  pickupRadius?: number;
}

export interface UnitTier {
  name: string;
  /** Research cost to unlock this tier for the whole troop type (tier 0 = squad deploy cost). */
  cost: number;
  blurb: string;
  visual: TierVisual;
  stats: UnitStats;
  /** Weapon at this tier. */
  weapon: { name: string; type: DamageType; hitsAir: boolean; projectile?: ProjectileKind; hitscan?: boolean; splash?: number };
  /** Optional special every N seconds (Line Watch Power Shot). */
  special?: { name: string; every: number; damage: number; type: DamageType; splash: number };
}

export interface UnitData {
  id: string;
  name: string;
  faction: Faction;
  role: 'troop' | 'worker';
  sprite: string;
  /** Sprite shown while attacking (optional). */
  attackSprite?: string;
  desc: string;
  squadSize: number;
  /** Max squads alive at once (0 = unlimited). */
  maxSquads: number;
  cooldown: number;
  tiers: UnitTier[];
}

export type EnemyFamily = 'bloon' | 'bug';
export interface EnemyData {
  id: string;
  name: string;
  family: EnemyFamily;
  sprite: string;
  hp: number;
  speed: number;
  /** Lives lost on leak (should include children). */
  leak: number;
  bounty: number;
  radius: number;
  size: number;
  /** Flying enemies (bloons) cannot be blocked by troops. */
  flying: boolean;
  /** Popping spawns these. */
  children?: { id: string; count: number };
  lead?: boolean;
  /** Front-armored (Charger): non-explosive hits from the front deal 25%. */
  frontArmor?: boolean;
  boss?: boolean;
  /** Bug melee DPS vs troops blocking it. */
  meleeDps?: number;
  /** Hunter leap: jumps `distance` px along the path every `every` seconds. */
  leap?: { every: number; distance: number };
  /** Spawner: births `id` x count every N seconds. */
  spawns?: { id: string; every: number; count: number };
  /** Bile Titan: lobs acid at towers/troops. */
  acid?: { every: number; damage: number; range: number };
  /** Swarm wander amplitude (px) off the path centerline. */
  swarm?: number;
  /** Chance (0..1) to drop a credit shard pickup on death. */
  dropChance?: number;
  color: string;
}

export interface WaveGroup {
  enemy: string;
  count: number;
  spacing: number;
  delay: number;
}
export interface WaveData { groups: WaveGroup[]; bonus: number }

export interface Vec { x: number; y: number }
