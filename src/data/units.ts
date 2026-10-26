// =============================================================================
// UNIT DATA: deployable troops (Halo Wars style squads) + Farmhand workers.
// Unit tiers are researched per troop type and apply to every living squad
// of that type (existing units visibly change sprite / gear).
// GAME RULE: each tier strictly better + better looking (validated).
// =============================================================================
import { Faction, type UnitData } from '../core/types';

/** Workers carry no weapon; a placeholder keeps the data shape uniform. */
const NO_WEAPON = { name: 'Tools', type: 'melee' as const, hitsAir: false };
const G1 = '#7fd3ff', G2 = '#ffd84a', G3 = '#ff6bf0';

export const UNITS: UnitData[] = [
  {
    id: 'marine', name: 'Frontier Marines', faction: Faction.UNSC, role: 'troop', sprite: 'marine',
    desc: 'Squad of 3 riflemen. Hit air & ground. Drop in by pod at your rally point.',
    squadSize: 3, maxSquads: 4, cooldown: 6,
    tiers: [
      { name: 'Marines', cost: 225, blurb: 'Assault rifles.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 40, damage: 1, attackRate: 4, range: 120, speed: 70, armor: 0 },
        weapon: { name: 'Assault Rifle', type: 'ballistic', hitsAir: true, hitscan: true } },
      { name: 'Veteran Marines', cost: 300, blurb: '+HP, armor, accuracy.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 55, damage: 1.5, attackRate: 4.5, range: 130, speed: 72, armor: 1 },
        weapon: { name: 'Battle Rifle', type: 'ballistic', hitsAir: true, hitscan: true } },
      { name: 'Orbital Drop Troopers', cost: 600, blurb: 'Elite armor + frag grenades.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 75, damage: 2, attackRate: 5, range: 140, speed: 78, armor: 2 },
        weapon: { name: 'Battle Rifle', type: 'ballistic', hitsAir: true, hitscan: true },
        special: { name: 'Frag Grenade', every: 6, damage: 12, type: 'explosive', splash: 50 } },
    ],
  },
  {
    id: 'monkey_soldier', name: 'Monkey Soldiers', faction: Faction.Primates, role: 'troop', sprite: 'monkey_soldier',
    desc: 'Pair of dart-throwing monkey commandos. Fast and cheap.',
    squadSize: 2, maxSquads: 4, cooldown: 5,
    tiers: [
      { name: 'Monkey Soldiers', cost: 160, blurb: 'Dart slingers.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 30, damage: 2, attackRate: 1.5, range: 90, speed: 85, armor: 0 },
        weapon: { name: 'Darts', type: 'sharp', hitsAir: true, projectile: 'dart' } },
      { name: 'Monkey Rangers', cost: 220, blurb: '+HP, faster darts.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 45, damage: 3, attackRate: 1.8, range: 100, speed: 90, armor: 1 },
        weapon: { name: 'Razor Darts', type: 'sharp', hitsAir: true, projectile: 'dart' } },
      { name: 'Monkey Commandos', cost: 480, blurb: 'Bomb darts pop Lead.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 65, damage: 4, attackRate: 2.2, range: 115, speed: 95, armor: 2 },
        weapon: { name: 'Bomb Darts', type: 'explosive', hitsAir: true, projectile: 'dart', splash: 26 } },
    ],
  },
  {
    // Line Watch: four painted tiers (militia -> knight -> musketeer -> elite).
    id: 'line_watch', name: 'Line Watch', faction: Faction.UNSC, role: 'troop', sprite: 'line_watch',
    desc: 'Frontier militia that blocks bugs. Tier 3 Musketeers shoot balloons too.',
    squadSize: 3, maxSquads: 3, cooldown: 7,
    tiers: [
      { name: 'Militia', cost: 200, blurb: 'Sword & shield. Melee, ground only.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 35, damage: 3, attackRate: 1.2, range: 30, speed: 60, armor: 0 },
        weapon: { name: 'Short Sword', type: 'melee', hitsAir: false } },
      { name: 'Knights', cost: 260, blurb: 'Plate armor.', visual: { level: 1, scale: 1.05, glow: G1 },
        stats: { maxHp: 60, damage: 5, attackRate: 1.25, range: 32, speed: 62, armor: 2 },
        weapon: { name: 'Longsword', type: 'melee', hitsAir: false } },
      { name: 'Musketeers', cost: 560, blurb: 'Musket + bayonet. Hits air.', visual: { level: 2, scale: 1.1, glow: G2 },
        stats: { maxHp: 85, damage: 7, attackRate: 1.3, range: 140, speed: 64, armor: 3 },
        weapon: { name: 'Musket', type: 'ballistic', hitsAir: true, projectile: 'bullet' } },
      { name: 'Elite Line Watch', cost: 900, blurb: '+20% speed, +33% dmg, Power Shot.', visual: { level: 3, scale: 1.15, glow: G3 },
        stats: { maxHp: 110, damage: 9.3, attackRate: 1.56, range: 150, speed: 77, armor: 4 },
        weapon: { name: 'Rifled Musket', type: 'ballistic', hitsAir: true, projectile: 'bullet' },
        special: { name: 'Power Shot', every: 7, damage: 45, type: 'explosive', splash: 40 } },
    ],
  },
  {
    id: 'farmhand', name: 'Sprout Farmhand', faction: Faction.Flora, role: 'worker', sprite: 'farmhand',
    desc: 'WORKER. Collects dropped credits, repairs towers, and can ORGANIZE FARMS into a tight grid to free up space.',
    squadSize: 1, maxSquads: 4, cooldown: 3,
    tiers: [
      { name: 'Farmhand', cost: 75, blurb: 'Collect, repair, organize.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 25, damage: 0, attackRate: 0, range: 0, speed: 95, armor: 0, repair: 8, pickupRadius: 170 },
        weapon: NO_WEAPON },
      { name: 'Foreman', cost: 150, blurb: 'Faster, repairs more, wider pickup.', visual: { level: 1, scale: 1.08, glow: G1 },
        stats: { maxHp: 40, damage: 0, attackRate: 0, range: 0, speed: 115, armor: 1, repair: 14, pickupRadius: 230 },
        weapon: NO_WEAPON },
    ],
  },
];

export const unitById = (id: string) => {
  const u = UNITS.find((x) => x.id === id);
  if (!u) throw new Error('Unknown unit ' + id);
  return u;
};
