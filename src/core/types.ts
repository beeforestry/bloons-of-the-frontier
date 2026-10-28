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
  UNSC = 'unsc', // UNSC human tech (original designs)
  Frontier = 'frontier', // Line Watch militia, paladins, arcane stonework
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
  Weak = 'weak',
  /** Closest to the player's HQ (last line of defence). */
  HQ = 'hq',
}
export const TARGETING_ORDER: TargetingMode[] = [TargetingMode.First, TargetingMode.Last, TargetingMode.Strong, TargetingMode.Weak, TargetingMode.Close, TargetingMode.HQ];
export const TARGETING_LABEL: Record<TargetingMode, string> = { first: 'First', last: 'Last', strong: 'Strongest', weak: 'Weakest', close: 'Closest', hq: 'Closest to HQ' };
/** Squad stance (Halo Wars style). */
export type Stance = 'aggressive' | 'hold' | 'retreat';
export type Formation = 'line' | 'column';
/** Extra hit properties threaded through every damage source. */
export interface HitOpts {
  /** Armor-piercing (ignores Ironback plating). Explosive & pierce>=3 count too. */
  ap?: boolean;
  /** Can hit true aircraft. */
  antiAir?: boolean;
  shred?: number;
  shieldBreak?: number;
  /** Veterancy receiver (Unit). */
  src?: { addXp?: (n: number) => void } | null;
  crit?: boolean;
}
export type AbilityId = 'stim' | 'emp' | 'hijack' | 'laser_sweep' | 'rally';

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
  /** Armor degradation per hit (corrosive glue / arcane): permanently strips this much armor (0..1). */
  armorShred?: number;
  /** Bonus damage multiplier vs energy shields (arcane strips shields). */
  shieldBreak?: number;
  /** Tesla: extra enemies a bolt arcs to (each jump deals 80%). */
  chain?: number;
  /** Chomper: instantly devours a non-boss enemy with at most this much HP (else bites for `damage`). */
  devour?: number;
}

/** Hypno-Shroom: converts non-boss enemies to fight for you at FULL health. All higher-is-better. */
export interface HypnoStats {
  /** Conversions per minute (cooldown = 60 / perMin). */
  perMin: number;
  /** Max hypnotized allies alive at once from this shroom. */
  maxConverted: number;
  /** Largest enemy (max HP of its current layer, after wave scaling) it can convert. */
  maxHp: number;
  range: number;
  /** Ally damage multiplier. */
  power: number;
}

/** Flora / sun aura: green radius that speeds up nearby towers & troops and boosts farm income. Never stacks with itself. */
export interface AuraStats { radius: number; ratePct: number; incomePct: number }
/** Sunflower: energy orbs that fuel MAC Blast / Heal Drop. */
export interface OrbStats { energy: number; perMin: number }

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
  /** Garrisoned troops take this much less damage (0.5 = -50%). */
  garrisonProtect?: number;
  /** Garrisoned troops get +range (0.35 = +35%). */
  garrisonRangePct?: number;
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
  aura?: AuraStats;
  orbs?: OrbStats;
  hypno?: HypnoStats;
  /** Path objects (Wall-Nut barrier / Cherry pod). */
  barrier?: { hp: number; blockCap: number; blast?: number; blastRadius?: number };
}

export type TowerKind = 'combat' | 'cover' | 'farm' | 'support' | 'path' | 'hypno';
export type ProjectileKind = 'dart' | 'pea' | 'gpea' | 'shuriken' | 'magic' | 'melon' | 'star' | 'bullet' | 'laser' | 'rail' | 'ice' | 'glue' | 'flak' | 'seed' | 'boomerang' | 'tesla' | 'arrow' | 'shell';

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
  /** Anti-air: can hit true aircraft (Hive Gargoyles). Only AA towers / units can. */
  antiAir?: boolean;
  /** Armor-piercing shots ignore Ironback plating. */
  armorPiercing?: boolean;
  /** Fires straight down a fixed lane direction chosen at placement (Repeater). */
  fixedLane?: boolean;
  defaultTargeting?: TargetingMode;
  /** Single-use path object. */
  singleUse?: boolean;
  /** Farm crates stack on the tower and bank at the end of the wave (Banana Drop). */
  bankCrates?: boolean;
  /** Player-triggered tower ability. */
  ability?: AbilityId;
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
  weapon: { name: string; type: DamageType; hitsAir: boolean; projectile?: ProjectileKind; hitscan?: boolean; splash?: number; antiAir?: boolean; armorPiercing?: boolean; beam?: boolean };
  /** Reactor tech level required to research this tier (defaults to tier index). */
  tech?: number;
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
  /** Army population per squad (PopulationManager cap: HQ + Reactors). */
  population: number;
  /** Reactor tech level required to train / drop this troop. */
  tech: number;
  /** Barracks training time (s) at Barracks tier 1. */
  trainTime: number;
  tiers: UnitTier[];
  /** Enemies one unit can hold (default 2). */
  blockCap?: number;
  /** Vehicle: fires while moving. */
  vehicle?: boolean;
  /** Scrap needed (on top of credits) to field / train this squad. */
  scrapCost?: number;
  hero?: boolean;
  abilities?: AbilityId[];
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
  /** True aircraft: only anti-air towers / units can hit it. */
  air?: boolean;
  /** Ironback plating: damage reduction vs non-piercing, non-explosive hits. */
  armored?: number;
  /** Energy shield HP that must be popped first (EMP strips it). */
  shield?: number;
  /** Multi-phase boss kit. Phase 1 (> 50% HP): heavy plating + shield. Phase 2: sub-wave spawns + attacks on your towers. */
  bossKit?: BossKit;
  /** Heavy / mechanical: drops scrap troops can gather. */
  scrap?: number;
  /** Heavy: EMP / Hijack stun works on it. */
  heavy?: boolean;
  color: string;
}

export interface BossKit {
  /** Phase-1 armor (0..1) — drops to `armor2` in phase 2. */
  armor1: number; armor2: number;
  /** Phase-2 sub-wave. */
  spawn: string; spawnCount: number; spawnEvery: number;
  /** Phase-2 attack vs player turrets/troops. */
  attack: 'laser' | 'bombs' | 'smash'; attackEvery: number; attackDamage: number; attackRadius: number;
  /** Phase 3 below 20% HP: attacks twice as often, double sub-waves, every attack style. */
  frenzy?: boolean;
}

export interface WaveGroup {
  enemy: string;
  count: number;
  spacing: number;
  delay: number;
}
export interface WaveData { groups: WaveGroup[]; bonus: number; boss?: boolean }

export interface Vec { x: number; y: number }

/** Halo-Wars base layer: HQ + pad buildings. All tier stats are "higher is better" (validated). */
export interface BuildingStats {
  maxHp: number;
  /** Credits per payout (Supply). Safe base income: paid straight into the bank during waves. */
  income?: number;
  payoutsPerMin?: number;
  waveBonus?: number;
  /** Tech level provided (Reactor). */
  tech?: number;
  /** Population cap provided (HQ base cap, Reactor +5...). */
  pop?: number;
  /** Leader-power energy regen / s. */
  energyRegen?: number;
  /** Barracks training speed multiplier. */
  trainSpeed?: number;
  /** Barracks: queue length. */
  queue?: number;
  /** HQ defence gun. */
  gun?: { damage: number; fireRate: number; range: number; pierce: number };
}
export interface BuildingTier {
  name: string;
  /** Credits to build (tier 0) / upgrade to this tier. */
  cost: number;
  /** Seconds of construction. */
  buildTime: number;
  blurb: string;
  visual: TierVisual;
  stats: BuildingStats;
}
export type BuildingKind = 'hq' | 'supply' | 'reactor' | 'barracks';
export interface BuildingData {
  id: BuildingKind;
  name: string;
  sprite: string;
  desc: string;
  icon: string;
  tiers: BuildingTier[];
}
export interface PowerData { id: 'mac' | 'heal'; name: string; icon: string; energy: number; cooldown: number; desc: string }
