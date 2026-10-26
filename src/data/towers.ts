// =============================================================================
// TOWER DATA ("ScriptableObjects" as typed object literals).
// tiers[0] = base tower, tiers[1], tiers[2] = upgrades.
// GAME RULE: every tier must be strictly better AND look better (visual.level up).
// src/data/validate.ts checks this at dev boot and in `npm run validate`.
// =============================================================================
import { Faction, type TowerData } from '../core/types';

const G1 = '#7fd3ff', G2 = '#ffd84a'; // tier-1 / tier-2 glow colors (blue -> gold)

export const TOWERS: TowerData[] = [
  // ----------------------------------------------------------------- PRIMATES
  {
    id: 'dart_monkey', name: 'Dart Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'dart_monkey',
    desc: 'Cheap, reliable darts that pierce. Sharp: cannot pop Lead.', damageType: 'sharp', projectile: 'dart',
    tiers: [
      { name: 'Dart Monkey', cost: 200, blurb: 'Single darts, pierce 2.', visual: { level: 0, scale: 1 }, maxHp: 120,
        combat: { damage: 1, fireRate: 1.4, range: 150, pierce: 2, projectileSpeed: 640 } },
      { name: 'Sharp Shots', cost: 220, blurb: '+1 dmg, +pierce, +range.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 150,
        combat: { damage: 2, fireRate: 1.6, range: 165, pierce: 3, projectileSpeed: 700 } },
      { name: 'Triple Darts', cost: 450, blurb: 'Three darts per throw.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 180,
        combat: { damage: 2, fireRate: 2.0, range: 180, pierce: 4, shots: 3, projectileSpeed: 760 } },
    ],
  },
  {
    id: 'ninja_monkey', name: 'Ninja Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'ninja_monkey',
    desc: 'Fast shurikens at several targets at once.', damageType: 'sharp', projectile: 'shuriken',
    tiers: [
      { name: 'Ninja Monkey', cost: 400, blurb: '2 shurikens.', visual: { level: 0, scale: 1 }, maxHp: 120,
        combat: { damage: 1, fireRate: 2.2, range: 160, pierce: 3, shots: 2, projectileSpeed: 620 } },
      { name: 'Ninja Discipline', cost: 350, blurb: '3 shurikens, faster.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 150,
        combat: { damage: 2, fireRate: 2.6, range: 175, pierce: 4, shots: 3, projectileSpeed: 680 } },
      { name: 'Razor Stars', cost: 800, blurb: '4 razor stars, big pierce.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 180,
        combat: { damage: 3, fireRate: 3.0, range: 190, pierce: 5, shots: 4, projectileSpeed: 740 } },
    ],
  },
  {
    id: 'wizard_monkey', name: 'Wizard Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'wizard_monkey',
    desc: 'Homing magic bolts that burst. Magic pops Lead.', damageType: 'magic', projectile: 'magic',
    tiers: [
      { name: 'Wizard Monkey', cost: 380, blurb: 'Homing bolt, small burst.', visual: { level: 0, scale: 1 }, maxHp: 120,
        combat: { damage: 2, fireRate: 1.2, range: 160, pierce: 1, splash: 36, projectileSpeed: 380 } },
      { name: 'Arcane Burst', cost: 340, blurb: 'Bigger bursts, more damage.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 150,
        combat: { damage: 3, fireRate: 1.4, range: 175, pierce: 1, splash: 46, projectileSpeed: 420 } },
      { name: 'Archmage', cost: 780, blurb: 'Twin bolts, huge bursts.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 180,
        combat: { damage: 4, fireRate: 1.8, range: 190, pierce: 1, shots: 2, splash: 58, projectileSpeed: 460 } },
    ],
  },
  {
    id: 'super_monkey', name: 'Super Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'super_monkey',
    desc: 'Laser eyes: insanely fast hitscan beams. Energy pops Lead.', damageType: 'energy', projectile: 'laser', hitscan: true,
    tiers: [
      { name: 'Super Monkey', cost: 1600, blurb: 'Rapid laser beams.', visual: { level: 0, scale: 1 }, maxHp: 200,
        combat: { damage: 1, fireRate: 10, range: 190, pierce: 2 } },
      { name: 'Plasma Vision', cost: 1400, blurb: 'Plasma beams, more pierce.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 260,
        combat: { damage: 2, fireRate: 12, range: 205, pierce: 3 } },
      { name: 'Twin Blaster Overdrive', cost: 3000, blurb: 'Two beams at once.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 320,
        combat: { damage: 3, fireRate: 16, range: 220, pierce: 4, shots: 2 } },
    ],
  },
  {
    id: 'money_monkey', name: 'Money Monkey', faction: Faction.Primates, kind: 'farm', sprite: 'money_monkey',
    desc: 'FARM. No attack. Drops credit crates; Farmhands collect them for full value.',
    tiers: [
      { name: 'Money Monkey', cost: 450, blurb: 'Laptop trading.', visual: { level: 0, scale: 1 }, maxHp: 100,
        farm: { income: 20, payoutsPerMin: 6, waveBonus: 40 } },
      { name: 'Dual Monitors', cost: 500, blurb: 'Bigger, faster trades.', visual: { level: 1, scale: 1.05, glow: G1 }, maxHp: 130,
        farm: { income: 32, payoutsPerMin: 7.5, waveBonus: 90 } },
      { name: 'Server Farm', cost: 1000, blurb: 'Credits on autopilot.', visual: { level: 2, scale: 1.1, glow: G2 }, maxHp: 160,
        farm: { income: 50, payoutsPerMin: 10, waveBonus: 170 } },
    ],
  },
  // -------------------------------------------------------------------- FLORA
  {
    id: 'solar_pea_fusion', name: 'Solar Pea Fusion', faction: Faction.Flora, kind: 'combat', sprite: 'solar_pea_fusion',
    desc: 'Glowing golden peas. Cheap starter plant.', damageType: 'sharp', projectile: 'pea',
    tiers: [
      { name: 'Solar Pea Fusion', cost: 250, blurb: 'Golden peas.', visual: { level: 0, scale: 1 }, maxHp: 120,
        combat: { damage: 1, fireRate: 1.6, range: 150, pierce: 1, projectileSpeed: 520 } },
      { name: 'Twin Pods', cost: 220, blurb: 'Two peas per volley.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 150,
        combat: { damage: 2, fireRate: 1.8, range: 160, pierce: 1, shots: 2, projectileSpeed: 560 } },
      { name: 'Sun-Blast Triple', cost: 480, blurb: 'Three sun-blast peas, pierce 2.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 180,
        combat: { damage: 2, fireRate: 2.4, range: 175, pierce: 2, shots: 3, projectileSpeed: 600 } },
    ],
  },
  {
    id: 'gatling_cherry_bomber', name: 'Gatling Cherry Bomber', faction: Faction.Flora, kind: 'combat', sprite: 'gatling_cherry_bomber',
    desc: 'Rapid peas; every few shots is an exploding cherry (pops Lead).', damageType: 'sharp', projectile: 'gpea',
    tiers: [
      { name: 'Gatling Cherry', cost: 450, blurb: 'Cherry every 6th shot.', visual: { level: 0, scale: 1 }, maxHp: 140,
        combat: { damage: 1, fireRate: 5, range: 140, pierce: 1, projectileSpeed: 620, specialRate: 1 / 6, specialDamage: 6, splash: 50 } },
      { name: 'Overspin', cost: 380, blurb: 'Faster, cherry every 5th.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 170,
        combat: { damage: 1, fireRate: 6.5, range: 150, pierce: 1, projectileSpeed: 660, specialRate: 1 / 5, specialDamage: 8, splash: 58 } },
      { name: 'Cherry Storm', cost: 750, blurb: 'Cherry every 3rd shot.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 200,
        combat: { damage: 2, fireRate: 8, range: 160, pierce: 2, projectileSpeed: 700, specialRate: 1 / 3, specialDamage: 10, splash: 66 } },
    ],
  },
  {
    id: 'flame_melon_mortar', name: 'Flame Melon Mortar', faction: Faction.Flora, kind: 'combat', sprite: 'flame_melon_mortar',
    desc: 'Lobs flaming melons: huge splash, huge range. Fire pops Lead.', damageType: 'fire', projectile: 'melon',
    tiers: [
      { name: 'Flame Melon', cost: 550, blurb: 'Flaming melon lobs.', visual: { level: 0, scale: 1 }, maxHp: 140,
        combat: { damage: 6, fireRate: 0.45, range: 250, pierce: 1, splash: 70 } },
      { name: 'Hotter Melons', cost: 450, blurb: 'Bigger blast.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 170,
        combat: { damage: 9, fireRate: 0.55, range: 270, pierce: 1, splash: 85 } },
      { name: 'Inferno Melons', cost: 950, blurb: 'Inferno-grade splash.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 200,
        combat: { damage: 14, fireRate: 0.7, range: 290, pierce: 1, splash: 100 } },
    ],
  },
  {
    id: 'star_emperor', name: 'Star Emperor', faction: Faction.Flora, kind: 'combat', sprite: 'star_emperor',
    desc: 'Cosmic stars pierce whole lines of enemies. Magic pops Lead.', damageType: 'magic', projectile: 'star',
    tiers: [
      { name: 'Star Emperor', cost: 600, blurb: 'Piercing stars.', visual: { level: 0, scale: 1 }, maxHp: 150,
        combat: { damage: 3, fireRate: 1.3, range: 190, pierce: 4, projectileSpeed: 560 } },
      { name: 'Nova Crown', cost: 520, blurb: 'Pierce 7.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 180,
        combat: { damage: 4, fireRate: 1.5, range: 205, pierce: 7, projectileSpeed: 600 } },
      { name: 'Galaxy Spread', cost: 1100, blurb: 'Triple star spread.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 220,
        combat: { damage: 5, fireRate: 1.8, range: 220, pierce: 9, shots: 3, projectileSpeed: 640 } },
    ],
  },
  {
    // COVER TOWER (composition: cover + a weak combat module).
    id: 'frost_wallnut_bastion', name: 'Frost Wall-Nut Bastion', faction: Faction.Flora, kind: 'cover', sprite: 'frost_wallnut_bastion',
    desc: 'COVER. Aura gives friendly towers & troops +max HP and +range. Troops can garrison. Weak slowing ice shards.',
    damageType: 'cold', projectile: 'ice',
    tiers: [
      { name: 'Frost Bastion', cost: 350, blurb: 'Aura +20 HP, +10% range.', visual: { level: 0, scale: 1 }, maxHp: 300,
        cover: { auraRadius: 130, bonusMaxHp: 20, bonusRangePct: 0.1, garrisonSlots: 1, regen: 2 },
        combat: { damage: 1, fireRate: 0.8, range: 130, pierce: 1, slow: 0.3, projectileSpeed: 480 } },
      { name: 'Glacier Shell', cost: 300, blurb: 'Aura +35 HP, +15% range.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 420,
        cover: { auraRadius: 150, bonusMaxHp: 35, bonusRangePct: 0.15, garrisonSlots: 2, regen: 3 },
        combat: { damage: 1, fireRate: 1.0, range: 150, pierce: 1, slow: 0.4, projectileSpeed: 520 } },
      { name: 'Permafrost Citadel', cost: 650, blurb: 'Aura +55 HP, +22% range.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 600,
        cover: { auraRadius: 175, bonusMaxHp: 55, bonusRangePct: 0.22, garrisonSlots: 3, regen: 5 },
        combat: { damage: 2, fireRate: 1.2, range: 175, pierce: 2, slow: 0.5, projectileSpeed: 560 } },
    ],
  },
  // --------------------------------------------------------------------- UNSC
  {
    id: 'unsc_autoturret', name: 'Frontier Autoturret', faction: Faction.UNSC, kind: 'combat', sprite: 'proc:unsc_autoturret',
    desc: 'Rapid ballistic fire. Ballistic pops Lead.', damageType: 'ballistic', projectile: 'bullet',
    tiers: [
      { name: 'Autoturret', cost: 350, blurb: 'Single barrel.', visual: { level: 0, scale: 1 }, maxHp: 180,
        combat: { damage: 1, fireRate: 4, range: 150, pierce: 1, projectileSpeed: 900 } },
      { name: 'Heavy Rounds', cost: 320, blurb: 'Armor-piercing rounds.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 230,
        combat: { damage: 2, fireRate: 5, range: 165, pierce: 1, projectileSpeed: 950 } },
      { name: 'Twin Autocannon', cost: 700, blurb: 'Twin barrels, pierce 2.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 280,
        combat: { damage: 2, fireRate: 7, range: 180, pierce: 2, shots: 2, projectileSpeed: 1000 } },
    ],
  },
  {
    id: 'unsc_rail', name: 'Rail Lance Emplacement', faction: Faction.UNSC, kind: 'combat', sprite: 'proc:unsc_rail',
    desc: 'Long-range hitscan rail slugs that punch through lines. Great vs Chargers & MOABs.', damageType: 'energy', projectile: 'rail', hitscan: true,
    tiers: [
      { name: 'Rail Lance', cost: 950, blurb: 'Heavy rail slug.', visual: { level: 0, scale: 1 }, maxHp: 200,
        combat: { damage: 8, fireRate: 0.5, range: 280, pierce: 4 } },
      { name: 'Capacitor Bank', cost: 800, blurb: 'Faster charge, pierce 6.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 250,
        combat: { damage: 14, fireRate: 0.6, range: 300, pierce: 6 } },
      { name: 'Magnetic Accelerator', cost: 1700, blurb: 'Devastating slugs.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 300,
        combat: { damage: 22, fireRate: 0.75, range: 330, pierce: 9 } },
    ],
  },
  {
    id: 'unsc_firebase', name: 'Firebase Bunker', faction: Faction.UNSC, kind: 'cover', sprite: 'proc:unsc_firebase',
    desc: 'COVER. Aura +max HP / +range for towers & troops. Garrison troops inside: they fire from cover with +25% range.',
    tiers: [
      { name: 'Firebase', cost: 450, blurb: '2 garrison slots.', visual: { level: 0, scale: 1 }, maxHp: 400,
        cover: { auraRadius: 140, bonusMaxHp: 30, bonusRangePct: 0.15, garrisonSlots: 2, regen: 3 } },
      { name: 'Reinforced Firebase', cost: 380, blurb: '3 slots, stronger aura.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 550,
        cover: { auraRadius: 160, bonusMaxHp: 50, bonusRangePct: 0.2, garrisonSlots: 3, regen: 4 } },
      { name: 'Fortified Command Post', cost: 800, blurb: '4 slots, best aura.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 750,
        cover: { auraRadius: 185, bonusMaxHp: 80, bonusRangePct: 0.28, garrisonSlots: 4, regen: 6 } },
    ],
  },
  {
    id: 'unsc_depot', name: 'Supply Depot', faction: Faction.UNSC, kind: 'farm', sprite: 'proc:unsc_depot',
    desc: 'FARM. Requisitions credit crates. Farmhands collect them.',
    tiers: [
      { name: 'Supply Depot', cost: 500, blurb: 'Supply drops.', visual: { level: 0, scale: 1 }, maxHp: 140,
        farm: { income: 25, payoutsPerMin: 6, waveBonus: 50 } },
      { name: 'Logistics Hub', cost: 520, blurb: 'More, faster drops.', visual: { level: 1, scale: 1.05, glow: G1 }, maxHp: 180,
        farm: { income: 40, payoutsPerMin: 7.5, waveBonus: 100 } },
      { name: 'Orbital Requisition', cost: 1100, blurb: 'Orbital supply line.', visual: { level: 2, scale: 1.1, glow: G2 }, maxHp: 220,
        farm: { income: 60, payoutsPerMin: 9, waveBonus: 200 } },
    ],
  },
];


export const towerById = (id: string) => {
  const t = TOWERS.find((x) => x.id === id);
  if (!t) throw new Error('Unknown tower ' + id);
  return t;
};
