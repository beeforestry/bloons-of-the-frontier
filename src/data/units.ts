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
    desc: 'Squad of 3 riflemen. Hit air (incl. aircraft) & ground. Drop in by pod at your rally point.', blockCap: 2,
    squadSize: 3, maxSquads: 6, cooldown: 6, population: 2, tech: 0, trainTime: 7,
    tiers: [
      { name: 'Marines', cost: 225, blurb: 'Assault rifles.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 40, damage: 1, attackRate: 4, range: 120, speed: 70, armor: 0 },
        weapon: { name: 'Assault Rifle', type: 'ballistic', hitsAir: true, hitscan: true, antiAir: true } },
      { name: 'Veteran Marines', cost: 300, blurb: '+HP, armor, accuracy.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 55, damage: 1.5, attackRate: 4.5, range: 130, speed: 72, armor: 1 },
        weapon: { name: 'Battle Rifle', type: 'ballistic', hitsAir: true, hitscan: true, antiAir: true } },
      { name: 'Marine Vanguard', cost: 600, blurb: 'Elite armor + frag grenades.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 75, damage: 2, attackRate: 5, range: 140, speed: 78, armor: 2 },
        weapon: { name: 'Battle Rifle', type: 'ballistic', hitsAir: true, hitscan: true, antiAir: true },
        special: { name: 'Frag Grenade', every: 6, damage: 12, type: 'explosive', splash: 50 } },
    ],
  },
  {
    id: 'monkey_soldier', name: 'Monkey Soldiers', faction: Faction.Primates, role: 'troop', sprite: 'monkey_soldier',
    desc: 'Pair of dart-throwing monkey commandos. Fast and cheap.',
    squadSize: 2, maxSquads: 6, cooldown: 5, population: 1, tech: 0, trainTime: 5,
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
    id: 'line_watch', name: 'Line Watch', faction: Faction.Frontier, blockCap: 2, role: 'troop', sprite: 'line_watch',
    desc: 'Frontier militia that blocks bugs. Tier 3 Musketeers shoot balloons too.',
    squadSize: 3, maxSquads: 4, cooldown: 7, population: 3, tech: 1, trainTime: 9,
    tiers: [
      { name: 'Militia', cost: 200, blurb: 'Sword & shield. Melee, ground only.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 35, damage: 3, attackRate: 1.2, range: 30, speed: 60, armor: 0 },
        weapon: { name: 'Short Sword', type: 'melee', hitsAir: false } },
      { name: 'Knights', cost: 260, blurb: 'Plate armor.', visual: { level: 1, scale: 1.05, glow: G1 },
        stats: { maxHp: 60, damage: 5, attackRate: 1.25, range: 32, speed: 62, armor: 2 },
        weapon: { name: 'Longsword', type: 'melee', hitsAir: false } },
      { name: 'Musketeers', cost: 560, blurb: 'Musket + bayonet. Hits air.', visual: { level: 2, scale: 1.1, glow: G2 },
        stats: { maxHp: 85, damage: 7, attackRate: 1.3, range: 140, speed: 64, armor: 3 },
        weapon: { name: 'Musket', type: 'ballistic', hitsAir: true, projectile: 'bullet', antiAir: true } },
      { name: 'Elite Line Watch', cost: 900, blurb: '+20% speed, +33% dmg, Power Shot.', visual: { level: 3, scale: 1.15, glow: G3 },
        stats: { maxHp: 110, damage: 9.3, attackRate: 1.56, range: 150, speed: 77, armor: 4 },
        weapon: { name: 'Rifled Musket', type: 'ballistic', hitsAir: true, projectile: 'bullet', antiAir: true },
        special: { name: 'Power Shot', every: 7, damage: 45, type: 'explosive', splash: 40 } },
    ],
  },
  {
    // t24 Orbital Drop Troopers == t25 Orbital Helljumpers (merged): drop anywhere, hold heavy pushes.
    id: 'odst', name: 'Orbital Helljumpers (ODST)', faction: Faction.UNSC, role: 'troop', sprite: 'odst', blockCap: 4, abilities: ['stim', 'emp'],
    desc: 'Orbital Drop Shock Troopers. Pod-drop ANYWHERE off the road to plug heavy pushes (each holds 4 bugs). Stim: +60% fire rate/+40% speed. EMP: strips shields & stuns heavies nearby. Hit aircraft.',
    squadSize: 3, maxSquads: 3, cooldown: 10, population: 3, tech: 1, trainTime: 10,
    tiers: [
      { name: 'Helljumpers', cost: 420, blurb: 'SMGs, Stim, local EMP.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 70, damage: 1.5, attackRate: 5, range: 125, speed: 80, armor: 2 },
        weapon: { name: 'Silenced SMG', type: 'ballistic', hitsAir: true, hitscan: true, antiAir: true } },
      { name: 'Shock Troopers', cost: 480, blurb: '+HP, battle rifles.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 95, damage: 2.2, attackRate: 5.5, range: 135, speed: 84, armor: 3 },
        weapon: { name: 'Battle Rifle', type: 'ballistic', hitsAir: true, hitscan: true, antiAir: true } },
      { name: 'Hellbringer ODST', cost: 900, blurb: 'Elite armor, frag volleys.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 125, damage: 3, attackRate: 6, range: 145, speed: 88, armor: 4 },
        weapon: { name: 'Battle Rifle', type: 'ballistic', hitsAir: true, hitscan: true, antiAir: true },
        special: { name: 'Frag Volley', every: 5, damage: 18, type: 'explosive', splash: 60 } },
    ],
  },
  {
    id: 'spartan', name: 'Spartan-II', faction: Faction.UNSC, role: 'troop', sprite: 'spartan', hero: true, scrapCost: 60, blockCap: 5, abilities: ['hijack'],
    desc: 'HERO (one only). Continuous Spartan Laser that pierces lines and hits aircraft. Ability EMP Drop: stuns every heavy/armored enemy in a radius and pops shields.',
    squadSize: 1, maxSquads: 1, cooldown: 30, population: 4, tech: 2, trainTime: 16,
    tiers: [
      { name: 'Spartan-II', cost: 1500, blurb: 'Spartan Laser, EMP Drop.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 420, damage: 1.4, attackRate: 12, range: 210, speed: 92, armor: 5 },
        weapon: { name: 'Spartan Laser', type: 'energy', hitsAir: true, hitscan: true, antiAir: true, armorPiercing: true, beam: true } },
      { name: 'Mjolnir Mk V', cost: 1300, blurb: 'Shields + hotter laser.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 560, damage: 2, attackRate: 13, range: 225, speed: 96, armor: 6 },
        weapon: { name: 'Spartan Laser', type: 'energy', hitsAir: true, hitscan: true, antiAir: true, armorPiercing: true, beam: true } },
      { name: 'Mjolnir Mk VI', cost: 2600, blurb: 'Legendary. Laser melts MOABs.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 750, damage: 2.8, attackRate: 15, range: 240, speed: 100, armor: 8 },
        weapon: { name: 'Spartan Laser', type: 'energy', hitsAir: true, hitscan: true, antiAir: true, armorPiercing: true, beam: true },
        special: { name: 'Ground Pound', every: 8, damage: 40, type: 'explosive', splash: 70 } },
    ],
  },
  {
    id: 'warthog', name: 'Warthog', faction: Faction.UNSC, role: 'troop', sprite: 'warthog', vehicle: true, scrapCost: 30, blockCap: 3,
    desc: 'Fast 4x4 with a mounted chaingun that FIRES WHILE MOVING. Great for patrol routes.',
    squadSize: 1, maxSquads: 3, cooldown: 12, population: 3, tech: 1, trainTime: 12,
    tiers: [
      { name: 'Warthog', cost: 520, blurb: 'M41 chaingun.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 220, damage: 1.2, attackRate: 8, range: 150, speed: 170, armor: 3 },
        weapon: { name: 'M41 Chaingun', type: 'ballistic', hitsAir: true, hitscan: true } },
      { name: 'Gauss Hog', cost: 560, blurb: 'Gauss-chaingun punches armor.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 290, damage: 1.7, attackRate: 9, range: 170, speed: 180, armor: 4 },
        weapon: { name: 'Gauss Chaingun', type: 'energy', hitsAir: true, hitscan: true, armorPiercing: true } },
      { name: 'Rocket Hog', cost: 1100, blurb: 'Explosive rounds + flak: splash and anti-air.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 380, damage: 2.4, attackRate: 10, range: 190, speed: 190, armor: 5 },
        weapon: { name: 'Rocket Chaingun', type: 'explosive', hitsAir: true, hitscan: true, armorPiercing: true, splash: 30, antiAir: true } },
    ],
  },
  {
    id: 'paladin', name: 'Paladin Captains', faction: Faction.Frontier, role: 'troop', sprite: 'paladin', blockCap: 3,
    desc: 'Heavy plate melee pair. Each Paladin holds up to 3 enemies; hammer blows splash.',
    squadSize: 2, maxSquads: 3, cooldown: 9, population: 3, tech: 1, trainTime: 10,
    tiers: [
      { name: 'Paladin Captains', cost: 380, blurb: 'Warhammer + tower shield.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 160, damage: 8, attackRate: 1.0, range: 34, speed: 58, armor: 4 },
        weapon: { name: 'Warhammer', type: 'melee', hitsAir: false, splash: 28 } },
      { name: 'Holy Paladins', cost: 420, blurb: 'Blessed plate.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 220, damage: 12, attackRate: 1.1, range: 36, speed: 60, armor: 5 },
        weapon: { name: 'Blessed Hammer', type: 'melee', hitsAir: false, splash: 34 } },
      { name: 'Paladin Lords', cost: 880, blurb: 'Radiant smite.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 300, damage: 17, attackRate: 1.2, range: 38, speed: 62, armor: 6 },
        weapon: { name: 'Radiant Hammer', type: 'melee', hitsAir: false, splash: 40 },
        special: { name: 'Smite', every: 6, damage: 40, type: 'magic', splash: 60 } },
    ],
  },
  {
    id: 'farmhand', name: 'Sprout Farmhand', faction: Faction.Flora, role: 'worker', sprite: 'farmhand',
    desc: 'COLLECTOR (max 1 per player). Immune and untargetable. Auto-collects EVERY credit, orb and scrap pickup on the whole map, repairs towers, and can ORGANIZE FARMS.',
    squadSize: 1, maxSquads: 1, cooldown: 3, population: 1, tech: 0, trainTime: 4,
    tiers: [
      { name: 'Farmhand', cost: 75, blurb: 'Collect, repair, organize.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 25, damage: 0, attackRate: 0, range: 0, speed: 95, armor: 0, repair: 8, pickupRadius: 100000 },
        weapon: NO_WEAPON },
      { name: 'Foreman', cost: 150, blurb: 'Faster, repairs more, quicker vacuum.', visual: { level: 1, scale: 1.08, glow: G1 },
        stats: { maxHp: 40, damage: 0, attackRate: 0, range: 0, speed: 115, armor: 1, repair: 14, pickupRadius: 120000 },
        weapon: NO_WEAPON },
    ],
  },
  {
    id: 'scorpion', name: 'M808 Scorpion', faction: Faction.UNSC, role: 'troop', sprite: 'scorpion', vehicle: true, scrapCost: 80, blockCap: 6,
    desc: 'Main battle tank. 90mm shells splash crowds and crack armor; holds 6 bugs at the treads. Slow and pricey (scrap).',
    squadSize: 1, maxSquads: 2, cooldown: 20, population: 5, tech: 2, trainTime: 18,
    tiers: [
      { name: 'Scorpion', cost: 1100, blurb: '90mm HE shells.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 600, damage: 22, attackRate: 0.55, range: 210, speed: 60, armor: 8 },
        weapon: { name: '90mm Cannon', type: 'explosive', hitsAir: false, projectile: 'shell', splash: 55, armorPiercing: true } },
      { name: 'Scorpion Mk II', cost: 900, blurb: 'Heavier shells, coax MG.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 780, damage: 34, attackRate: 0.65, range: 225, speed: 64, armor: 10 },
        weapon: { name: '105mm Cannon', type: 'explosive', hitsAir: false, projectile: 'shell', splash: 65, armorPiercing: true } },
      { name: 'Grizzly', cost: 1800, blurb: 'Twin cannons: huge splash.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 1000, damage: 50, attackRate: 0.8, range: 240, speed: 66, armor: 12 },
        weapon: { name: 'Twin 120mm', type: 'explosive', hitsAir: false, projectile: 'shell', splash: 80, armorPiercing: true } },
    ],
  },
  {
    id: 'ranger', name: 'Frontier Rangers', faction: Faction.Frontier, role: 'troop', sprite: 'ranger', blockCap: 2,
    desc: 'Kingdom Rush-style archers: long-range volleys that hit aircraft. Fragile up close.',
    squadSize: 3, maxSquads: 4, cooldown: 8, population: 2, tech: 0, trainTime: 8,
    tiers: [
      { name: 'Rangers', cost: 260, blurb: 'Longbows.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 45, damage: 2, attackRate: 1.6, range: 200, speed: 86, armor: 0 },
        weapon: { name: 'Longbow', type: 'sharp', projectile: 'arrow', hitsAir: true, antiAir: true } },
      { name: 'Wardens of the Wild', cost: 320, blurb: 'Bodkin arrows pierce armor.', visual: { level: 1, scale: 1.06, glow: G1 },
        stats: { maxHp: 60, damage: 3, attackRate: 1.9, range: 220, speed: 90, armor: 1 },
        weapon: { name: 'Bodkin Bow', type: 'sharp', projectile: 'arrow', hitsAir: true, antiAir: true, armorPiercing: true } },
      { name: 'Elven Marksmen', cost: 650, blurb: 'Rapid volleys, longest reach.', visual: { level: 2, scale: 1.12, glow: G2 },
        stats: { maxHp: 80, damage: 4.5, attackRate: 2.3, range: 245, speed: 94, armor: 2 },
        weapon: { name: 'Elven Longbow', type: 'magic', projectile: 'arrow', hitsAir: true, antiAir: true, armorPiercing: true } },
    ],
  },
];

export const unitById = (id: string) => {
  const u = UNITS.find((x) => x.id === id);
  if (!u) throw new Error('Unknown unit ' + id);
  return u;
};
