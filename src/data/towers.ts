// =============================================================================
// TOWER DATA ("ScriptableObjects" as typed object literals).
// tiers[0] = base tower, tiers[1], tiers[2] = upgrades.
// GAME RULE: every tier must be strictly better AND look better (visual.level up).
// src/data/validate.ts checks this at dev boot and in `npm run validate`.
// =============================================================================
import { Faction, TargetingMode, type TowerData } from '../core/types';

const G1 = '#7fd3ff', G2 = '#ffd84a'; // tier-1 / tier-2 glow colors (blue -> gold)

export const TOWERS: TowerData[] = [
  // ----------------------------------------------------------------- PRIMATES
  {
    id: 'dart_monkey', name: 'Dart Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'dart_monkey',
    desc: 'Cheap, reliable darts that pierce. Sharp: cannot pop Lead.', damageType: 'sharp', projectile: 'dart',
    tiers: [
      { name: 'Dart Monkey', cost: 200, blurb: 'Single darts, pierce 2.', visual: { level: 0, scale: 1 }, maxHp: 120,
        combat: { damage: 1.03, fireRate: 1.47, range: 150, pierce: 2, projectileSpeed: 640 } },
      { name: 'Sharp Shots', cost: 240, blurb: '+1 dmg, +pierce, +range.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 150,
        combat: { damage: 2, fireRate: 1.6, range: 165, pierce: 3, projectileSpeed: 700 } },
      { name: 'Triple Darts', cost: 540, blurb: 'Three darts per throw.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 180,
        combat: { damage: 2, fireRate: 1.65, range: 180, pierce: 4, shots: 3, projectileSpeed: 760 } },
    ],
  },
  {
    id: 'ninja_monkey', name: 'Ninja Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'ninja_monkey',
    desc: 'Fast shurikens at several targets at once.', damageType: 'sharp', projectile: 'shuriken',
    tiers: [
      { name: 'Ninja Monkey', cost: 400, blurb: '2 shurikens.', visual: { level: 0, scale: 1 }, maxHp: 120,
        combat: { damage: 1, fireRate: 2.2, range: 160, pierce: 3, shots: 2, projectileSpeed: 620 } },
      { name: 'Ninja Discipline', cost: 380, blurb: '3 shurikens, faster.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 150,
        combat: { damage: 1.59, fireRate: 2.2, range: 175, pierce: 4, shots: 3, projectileSpeed: 680 } },
      { name: 'Razor Stars', cost: 960, blurb: '4 razor stars, big pierce.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 180,
        combat: { damage: 2.46, fireRate: 2.23, range: 190, pierce: 5, shots: 4, projectileSpeed: 740 } },
    ],
  },
  {
    id: 'wizard_monkey', name: 'Wizard Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'wizard_monkey',
    desc: 'Homing magic bolts that burst. Magic pops Lead.', damageType: 'magic', projectile: 'magic',
    tiers: [
      { name: 'Wizard Monkey', cost: 380, blurb: 'Homing bolt, small burst.', visual: { level: 0, scale: 1 }, maxHp: 120,
        combat: { damage: 3, fireRate: 1.2, range: 160, pierce: 1, splash: 36, projectileSpeed: 380 } },
      { name: 'Arcane Burst', cost: 365, blurb: 'Bigger bursts, more damage.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 150,
        combat: { damage: 4.05, fireRate: 1.53, range: 175, pierce: 1, splash: 46, projectileSpeed: 420 } },
      { name: 'Archmage', cost: 935, blurb: 'Twin bolts, huge bursts.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 180,
        combat: { damage: 5.25, fireRate: 1.53, range: 190, pierce: 1, shots: 2, splash: 58, projectileSpeed: 460 } },
    ],
  },
  {
    id: 'super_monkey', name: 'Super Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'super_monkey',
    desc: 'Laser eyes: insanely fast hitscan beams. Hits aircraft. Ability: Laser Sweep. Energy pops Lead.', damageType: 'energy', projectile: 'laser', hitscan: true, antiAir: true, ability: 'laser_sweep',
    tiers: [
      { name: 'Super Monkey', cost: 1600, blurb: 'Rapid laser beams.', visual: { level: 0, scale: 1 }, maxHp: 200,
        combat: { damage: 1.08, fireRate: 11.23, range: 190, pierce: 2 } },
      { name: 'Plasma Vision', cost: 1510, blurb: 'Plasma beams, more pierce.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 260,
        combat: { damage: 1.97, fireRate: 11.7, range: 205, pierce: 3 } },
      { name: 'Twin Blaster Overdrive', cost: 3600, blurb: 'Two beams at once.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 320,
        combat: { damage: 2.34, fireRate: 11.7, range: 220, pierce: 4, shots: 2 } },
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
    desc: 'Glowing golden peas. Small sun aura: +attack speed nearby (flora auras never stack).', damageType: 'sharp', projectile: 'pea',
    tiers: [
      { name: 'Solar Pea Fusion', cost: 250, blurb: 'Golden peas.', visual: { level: 0, scale: 1 }, maxHp: 120,
        combat: { damage: 1.13, fireRate: 1.92, range: 150, pierce: 1, projectileSpeed: 520 }, aura: { radius: 90, ratePct: 0.04, incomePct: 0 } },
      { name: 'Twin Pods', cost: 240, blurb: 'Two peas per volley.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 150,
        combat: { damage: 1.45, fireRate: 1.92, range: 160, pierce: 1, shots: 2, projectileSpeed: 560 }, aura: { radius: 100, ratePct: 0.06, incomePct: 0 } },
      { name: 'Sun-Blast Triple', cost: 575, blurb: 'Three sun-blast peas, pierce 2.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 180,
        combat: { damage: 1.69, fireRate: 1.92, range: 175, pierce: 2, shots: 3, projectileSpeed: 600 }, aura: { radius: 115, ratePct: 0.08, incomePct: 0 } },
    ],
  },
  {
    id: 'gatling_cherry_bomber', name: 'Gatling Cherry Bomber', faction: Faction.Flora, kind: 'combat', sprite: 'gatling_cherry_bomber',
    desc: 'Rapid peas; every few shots is an exploding cherry (pops Lead).', damageType: 'sharp', projectile: 'gpea',
    tiers: [
      { name: 'Gatling Cherry', cost: 450, blurb: 'Cherry every 6th shot.', visual: { level: 0, scale: 1 }, maxHp: 140,
        combat: { damage: 0.87, fireRate: 3.89, range: 140, pierce: 1, projectileSpeed: 620, specialRate: 1 / 6, specialDamage: 6, splash: 50 } },
      { name: 'Overspin', cost: 410, blurb: 'Faster, cherry every 5th.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 170,
        combat: { damage: 0.99, fireRate: 6.41, range: 150, pierce: 1, projectileSpeed: 660, specialRate: 1 / 5, specialDamage: 8, splash: 58 } },
      { name: 'Cherry Storm', cost: 900, blurb: 'Cherry every 3rd shot.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 200,
        combat: { damage: 1.69, fireRate: 6.41, range: 160, pierce: 2, projectileSpeed: 700, specialRate: 1 / 3, specialDamage: 10, splash: 66 } },
    ],
  },
  {
    id: 'flame_melon_mortar', name: 'Flame Melon Mortar', faction: Faction.Flora, kind: 'combat', sprite: 'flame_melon_mortar',
    desc: 'Lobs flaming melons: huge splash, huge range. Fire pops Lead.', damageType: 'fire', projectile: 'melon',
    tiers: [
      { name: 'Flame Melon', cost: 550, blurb: 'Flaming melon lobs.', visual: { level: 0, scale: 1 }, maxHp: 140,
        combat: { damage: 8, fireRate: 0.45, range: 250, pierce: 1, splash: 70 } },
      { name: 'Hotter Melons', cost: 485, blurb: 'Bigger blast.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 170,
        combat: { damage: 12, fireRate: 0.55, range: 270, pierce: 1, splash: 85 } },
      { name: 'Inferno Melons', cost: 1140, blurb: 'Inferno-grade splash.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 200,
        combat: { damage: 19, fireRate: 0.7, range: 290, pierce: 1, splash: 100 } },
    ],
  },
  {
    id: 'star_emperor', name: 'Star Emperor', faction: Faction.Flora, kind: 'combat', sprite: 'star_emperor',
    desc: 'Cosmic stars pierce whole lines of enemies. Magic pops Lead.', damageType: 'magic', projectile: 'star',
    tiers: [
      { name: 'Star Emperor', cost: 600, blurb: 'Piercing stars.', visual: { level: 0, scale: 1 }, maxHp: 150,
        combat: { damage: 3, fireRate: 1.3, range: 190, pierce: 4, projectileSpeed: 560 } },
      { name: 'Nova Crown', cost: 560, blurb: 'Pierce 7.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 180,
        combat: { damage: 4.33, fireRate: 1.69, range: 205, pierce: 7, projectileSpeed: 600 } },
      { name: 'Galaxy Spread', cost: 1320, blurb: 'Triple star spread.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 220,
        combat: { damage: 4.33, fireRate: 1.74, range: 220, pierce: 9, shots: 3, projectileSpeed: 640 } },
    ],
  },
  {
    // COVER TOWER (composition: cover + a weak combat module).
    id: 'frost_wallnut_bastion', name: 'Frost Wall-Nut Bastion', faction: Faction.Flora, kind: 'cover', sprite: 'frost_wallnut_bastion',
    desc: 'COVER. Aura gives friendly towers & troops +max HP and +range. Troops can garrison. Weak slowing ice shards.',
    damageType: 'cold', projectile: 'ice',
    tiers: [
      { name: 'Frost Bastion', cost: 350, blurb: 'Aura +20 HP, +10% range.', visual: { level: 0, scale: 1 }, maxHp: 300,
        cover: { auraRadius: 130, bonusMaxHp: 20, bonusRangePct: 0.1, garrisonSlots: 1, regen: 2, garrisonProtect: 0.4, garrisonRangePct: 0.15 },
        combat: { damage: 1.13, fireRate: 0.96, range: 130, pierce: 1, slow: 0.3, projectileSpeed: 480 } },
      { name: 'Glacier Shell', cost: 325, blurb: 'Aura +35 HP, +15% range.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 420,
        cover: { auraRadius: 150, bonusMaxHp: 35, bonusRangePct: 0.15, garrisonSlots: 2, regen: 3, garrisonProtect: 0.45, garrisonRangePct: 0.18 },
        combat: { damage: 1.13, fireRate: 1.79, range: 150, pierce: 1, slow: 0.4, projectileSpeed: 520 } },
      { name: 'Permafrost Citadel', cost: 780, blurb: 'Aura +55 HP, +22% range.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 600,
        cover: { auraRadius: 175, bonusMaxHp: 55, bonusRangePct: 0.22, garrisonSlots: 3, regen: 5, garrisonProtect: 0.5, garrisonRangePct: 0.22 },
        combat: { damage: 2.26, fireRate: 1.79, range: 175, pierce: 2, slow: 0.5, projectileSpeed: 560 } },
    ],
  },
  // --------------------------------------------------------------------- UNSC
  {
    id: 'unsc_autoturret', name: 'Frontier Autoturret', faction: Faction.UNSC, kind: 'combat', sprite: 'proc:unsc_autoturret',
    desc: 'Rapid ballistic fire. Ballistic pops Lead.', damageType: 'ballistic', projectile: 'bullet',
    tiers: [
      { name: 'Autoturret', cost: 350, blurb: 'Single barrel.', visual: { level: 0, scale: 1 }, maxHp: 180,
        combat: { damage: 1, fireRate: 4.01, range: 150, pierce: 1, projectileSpeed: 900 } },
      { name: 'Heavy Rounds', cost: 345, blurb: 'Armor-piercing rounds.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 230,
        combat: { damage: 2, fireRate: 4.98, range: 165, pierce: 1, projectileSpeed: 950 } },
      { name: 'Twin Autocannon', cost: 840, blurb: 'Twin barrels, pierce 2.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 280,
        combat: { damage: 2, fireRate: 5.03, range: 180, pierce: 2, shots: 2, projectileSpeed: 1000 } },
    ],
  },
  {
    id: 'unsc_rail', name: 'Rail Lance Emplacement', faction: Faction.UNSC, kind: 'combat', sprite: 'proc:unsc_rail',
    desc: 'Long-range hitscan rail slugs that punch through lines. Great vs Chargers & MOABs.', damageType: 'energy', projectile: 'rail', hitscan: true,
    tiers: [
      { name: 'Rail Lance', cost: 950, blurb: 'Heavy rail slug.', visual: { level: 0, scale: 1 }, maxHp: 200,
        combat: { damage: 8.57, fireRate: 0.55, range: 280, pierce: 4 } },
      { name: 'Capacitor Bank', cost: 865, blurb: 'Faster charge, pierce 6.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 250,
        combat: { damage: 17.05, fireRate: 0.6, range: 300, pierce: 6 } },
      { name: 'Magnetic Accelerator', cost: 2040, blurb: 'Devastating slugs.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 300,
        combat: { damage: 30.95, fireRate: 0.79, range: 330, pierce: 9 } },
    ],
  },
  {
    id: 'unsc_firebase', name: 'Firebase Bunker', faction: Faction.UNSC, kind: 'cover', sprite: 'proc:unsc_firebase',
    desc: 'COVER. Aura +max HP / +range for towers & troops. Garrison troops inside: they fire from cover with +25% range.',
    tiers: [
      { name: 'Firebase', cost: 450, blurb: '2 garrison slots.', visual: { level: 0, scale: 1 }, maxHp: 400,
        cover: { auraRadius: 140, bonusMaxHp: 30, bonusRangePct: 0.15, garrisonSlots: 2, regen: 3, garrisonProtect: 0.5, garrisonRangePct: 0.25 } },
      { name: 'Reinforced Firebase', cost: 380, blurb: '3 slots, stronger aura.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 550,
        cover: { auraRadius: 160, bonusMaxHp: 50, bonusRangePct: 0.2, garrisonSlots: 3, regen: 4, garrisonProtect: 0.55, garrisonRangePct: 0.28 } },
      { name: 'Fortified Command Post', cost: 800, blurb: '4 slots, best aura.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 750,
        cover: { auraRadius: 185, bonusMaxHp: 80, bonusRangePct: 0.28, garrisonSlots: 4, regen: 6, garrisonProtect: 0.6, garrisonRangePct: 0.32 } },
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
  // ------------------------------------------------------------ PRIMATES (t25)
  {
    id: 'sniper_monkey', name: 'Sniper Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'sniper_monkey',
    desc: 'Infinite range. Defaults to Strongest. Armor-piercing rounds shred Ironbacks; hits aircraft.', damageType: 'ballistic', projectile: 'rail', hitscan: true,
    antiAir: true, armorPiercing: true, defaultTargeting: TargetingMode.Strong,
    tiers: [
      { name: 'Sniper Monkey', cost: 450, blurb: 'Heavy AP round, map-wide.', visual: { level: 0, scale: 1 }, maxHp: 110,
        combat: { damage: 6.57, fireRate: 0.63, range: 4000, pierce: 1 } },
      { name: 'Full Metal Jacket', cost: 455, blurb: 'Pierce 2, faster bolt.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 140,
        combat: { damage: 9.94, fireRate: 0.69, range: 4000, pierce: 2 } },
      { name: 'Elite Deadeye', cost: 1140, blurb: 'Devastating AP, pierce 3.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 170,
        combat: { damage: 17.54, fireRate: 0.87, range: 4000, pierce: 3 } },
    ],
  },
  {
    id: 'glue_slinger', name: 'Corrosive Glue Slinger', faction: Faction.Primates, kind: 'combat', sprite: 'glue_slinger',
    desc: 'Glue globs slow by 40% and corrode armor (Ironbacks lose plating).', damageType: 'sharp', projectile: 'glue',
    tiers: [
      { name: 'Glue Slinger', cost: 270, blurb: '40% slow, corrodes armor.', visual: { level: 0, scale: 1 }, maxHp: 110,
        combat: { damage: 1.13, fireRate: 1.32, range: 150, pierce: 2, slow: 0.4, armorShred: 0.12, projectileSpeed: 460 } },
      { name: 'Corrosive Glue', cost: 300, blurb: 'Stronger acid, splash.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 140,
        combat: { damage: 1.82, fireRate: 1.32, range: 160, pierce: 3, slow: 0.45, armorShred: 0.2, splash: 30, projectileSpeed: 500 } },
      { name: 'Bloon Dissolver', cost: 745, blurb: 'Melts plating fast.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 170,
        combat: { damage: 2.92, fireRate: 1.54, range: 175, pierce: 4, slow: 0.5, armorShred: 0.3, splash: 40, projectileSpeed: 540 } },
    ],
  },
  {
    id: 'banana_drop', name: 'Banana Supply Drop', faction: Faction.Primates, kind: 'farm', sprite: 'banana_drop', bankCrates: true,
    desc: 'FARM. Stacks banana crates on its pad during the wave; every crate converts to credits when the wave ends (no collection needed).',
    tiers: [
      { name: 'Banana Drop', cost: 420, blurb: 'Crates bank at wave end.', visual: { level: 0, scale: 1 }, maxHp: 110,
        farm: { income: 18, payoutsPerMin: 6, waveBonus: 45 } },
      { name: 'Banana Republic', cost: 480, blurb: 'Bigger crates.', visual: { level: 1, scale: 1.05, glow: G1 }, maxHp: 140,
        farm: { income: 30, payoutsPerMin: 7.5, waveBonus: 95 } },
      { name: 'Banana Central', cost: 980, blurb: 'Crate airlift.', visual: { level: 2, scale: 1.1, glow: G2 }, maxHp: 170,
        farm: { income: 48, payoutsPerMin: 9.5, waveBonus: 180 } },
    ],
  },
  // --------------------------------------------------------------- FLORA (t25)
  {
    id: 'sunflower', name: 'Sunflower', faction: Faction.Flora, kind: 'support', sprite: 'sunflower',
    desc: 'SUPPORT. Green sun aura: +attack speed for towers & troops and +farm income. Grows energy orbs that fuel MAC Blast & Heal (click or they auto-collect). Flora auras never stack.',
    tiers: [
      { name: 'Sunflower', cost: 300, blurb: '+12% rate, +10% income aura.', visual: { level: 0, scale: 1 }, maxHp: 110,
        aura: { radius: 140, ratePct: 0.12, incomePct: 0.1 }, orbs: { energy: 6, perMin: 3 } },
      { name: 'Twin Sunflower', cost: 320, blurb: '+18% rate, +15% income.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 140,
        aura: { radius: 160, ratePct: 0.18, incomePct: 0.15 }, orbs: { energy: 8, perMin: 4 } },
      { name: 'Solar Bloom', cost: 700, blurb: '+25% rate, +22% income.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 170,
        aura: { radius: 185, ratePct: 0.25, incomePct: 0.22 }, orbs: { energy: 10, perMin: 5 } },
    ],
  },
  {
    id: 'repeater_gatling', name: 'Repeater Seed Gatling', faction: Faction.Flora, kind: 'combat', sprite: 'repeater_gatling',
    desc: 'Locks to the nearest lane direction at placement and hoses it with seeds: very high damage density down that line.', damageType: 'sharp', projectile: 'seed', fixedLane: true,
    tiers: [
      { name: 'Repeater Gatling', cost: 520, blurb: 'Fixed-lane seed stream.', visual: { level: 0, scale: 1 }, maxHp: 140,
        combat: { damage: 1, fireRate: 6.5, range: 240, pierce: 2, projectileSpeed: 700 } },
      { name: 'Twin Repeater', cost: 495, blurb: 'Twin streams.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 170,
        combat: { damage: 1.27, fireRate: 6.5, range: 260, pierce: 2, shots: 2, projectileSpeed: 760 } },
      { name: 'Seed Minigun', cost: 1175, blurb: 'Triple seed torrent.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 200,
        combat: { damage: 1.63, fireRate: 6.59, range: 280, pierce: 3, shots: 3, projectileSpeed: 820 } },
    ],
  },
  {
    id: 'wallnut_barrier', name: 'Wall-Nut Barrier Sprout', faction: Faction.Flora, kind: 'path', sprite: 'wallnut_barrier', singleUse: true,
    desc: 'PATH. Place ON the road: a high-HP blocker that holds up to 6 ground bugs. Dies when chewed through.',
    tiers: [
      { name: 'Wall-Nut Barrier', cost: 180, blurb: '600 HP road block.', visual: { level: 0, scale: 1 }, maxHp: 600,
        barrier: { hp: 600, blockCap: 6 } },
    ],
  },
  {
    id: 'cherry_pod', name: 'Cherry Bomb Blast Pod', faction: Faction.Flora, kind: 'path', sprite: 'cherry_pod', singleUse: true,
    desc: 'PATH, single use. Place ON the road; when an enemy gets close the fuse burns (0.7s) and it erupts in a huge fire blast. Also clears rocks & logs.',
    tiers: [
      { name: 'Cherry Pod', cost: 240, blurb: 'Huge fire AoE.', visual: { level: 0, scale: 1 }, maxHp: 80,
        barrier: { hp: 80, blockCap: 0, blast: 60, blastRadius: 120 } },
    ],
  },
  // ---------------------------------------------------------------- UNSC (t24)
  {
    id: 'unsc_flak', name: 'Flak AA Battery', faction: Faction.UNSC, kind: 'combat', sprite: 'proc:unsc_flak',
    desc: 'ANTI-AIR. Flak bursts shred aircraft (Hive Gargoyles are AA-only) and bloons. Cannot hit ground bugs.', damageType: 'explosive', projectile: 'flak',
    antiAir: true, hitsGround: false,
    tiers: [
      { name: 'Flak Battery', cost: 400, blurb: 'Twin flak, burst 34.', visual: { level: 0, scale: 1 }, maxHp: 170,
        combat: { damage: 2, fireRate: 2.2, range: 210, pierce: 1, splash: 34, projectileSpeed: 900 } },
      { name: 'Quad Flak', cost: 410, blurb: 'Faster, bigger bursts.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 210,
        combat: { damage: 2.45, fireRate: 2.2, range: 230, pierce: 1, splash: 42, shots: 2, projectileSpeed: 950 } },
      { name: 'Skyguard Array', cost: 985, blurb: 'Radar-guided flak storm.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 260,
        combat: { damage: 2.57, fireRate: 2.2, range: 255, pierce: 2, splash: 50, shots: 3, projectileSpeed: 1000 } },
    ],
  },
  // ------------------------------------------------- UNSC heavy vehicles (t42)
  // Real-size vehicles on a 3x3-cell pad (7.2 m): ~8 m tank, ~11 m gunship. Balanced to the DPS/100c curve (balance/static.md).
  {
    id: 'unsc_tank', name: 'M808 Battle Tank', faction: Faction.UNSC, kind: 'combat', sprite: 'proc:unsc_tank', footprint: 3,
    desc: 'Heavy armour on a 3x3 pad. Slow, crushing high-explosive shells with big splash. Ground targets only.', damageType: 'explosive', projectile: 'shell',
    hitsAir: false, defaultTargeting: TargetingMode.Strong,
    tiers: [
      { name: 'Light Tank', cost: 1100, blurb: 'Desert-tan light tank, 90 mm gun.', visual: { level: 0, scale: 1 }, maxHp: 600,
        combat: { damage: 7, fireRate: 0.5, range: 230, pierce: 3, splash: 45, projectileSpeed: 620 } },
      { name: 'Main Battle Tank', cost: 950, blurb: 'Olive MBT: 120 mm, roof MG, more armour.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 800,
        combat: { damage: 11, fireRate: 0.6, range: 250, pierce: 4, splash: 55, projectileSpeed: 680 } },
      { name: 'Siege Tank', cost: 2200, blurb: 'Heavy siege gun, reactive armour, shreds plating.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 1050,
        combat: { damage: 20, fireRate: 0.75, range: 275, pierce: 5, splash: 65, armorShred: 1, projectileSpeed: 740 } },
    ],
  },
  {
    id: 'unsc_heli', name: 'AH-9 Gunship', faction: Faction.UNSC, kind: 'combat', sprite: 'proc:unsc_heli', footprint: 3, airborne: true,
    desc: 'Hovering attack helicopter on a 3x3 helipad. Chin gun hits ground AND air (incl. Gargoyles).', damageType: 'ballistic', projectile: 'bullet',
    antiAir: true,
    tiers: [
      { name: 'Scout Gunship', cost: 900, blurb: 'Chin cannon.', visual: { level: 0, scale: 1 }, maxHp: 380,
        combat: { damage: 2, fireRate: 5, range: 200, pierce: 1, projectileSpeed: 1000 } },
      { name: 'Attack Gunship', cost: 800, blurb: 'Stub wings + rocket pods, twin fire.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 480,
        combat: { damage: 2, fireRate: 6, range: 220, pierce: 1, shots: 2, projectileSpeed: 1050 } },
      { name: 'Hellfire Gunship', cost: 1900, blurb: 'Hellfire rails, heavy rounds, pierce 2.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 600,
        combat: { damage: 3, fireRate: 7, range: 245, pierce: 2, shots: 2, projectileSpeed: 1100 } },
    ],
  },
  // ------------------------------------------------------------ FRONTIER (t24/25)
  {
    id: 'stone_wall', name: 'Stone Wall', faction: Faction.Frontier, kind: 'cover', sprite: 'stone_wall',
    desc: 'COVER / GARRISON. Thick masonry: garrisoned troops take far less damage and shoot farther.',
    tiers: [
      { name: 'Stone Wall', cost: 220, blurb: '2 slots, -55% dmg, +20% range.', visual: { level: 0, scale: 1 }, maxHp: 500,
        cover: { auraRadius: 90, bonusMaxHp: 15, bonusRangePct: 0.05, garrisonSlots: 2, regen: 1, garrisonProtect: 0.55, garrisonRangePct: 0.2 } },
      { name: 'Rampart', cost: 260, blurb: '3 slots, -62% dmg, +26% range.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 700,
        cover: { auraRadius: 100, bonusMaxHp: 25, bonusRangePct: 0.08, garrisonSlots: 3, regen: 2, garrisonProtect: 0.62, garrisonRangePct: 0.26 } },
      { name: 'Keep Wall', cost: 560, blurb: '4 slots, -70% dmg, +32% range.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 950,
        cover: { auraRadius: 115, bonusMaxHp: 40, bonusRangePct: 0.1, garrisonSlots: 4, regen: 3, garrisonProtect: 0.7, garrisonRangePct: 0.32 } },
    ],
  },
  {
    id: 'boomerang_monkey', name: 'Boomerang Monkey', faction: Faction.Primates, kind: 'combat', sprite: 'boomerang_monkey',
    desc: 'Curving boomerangs slice through a crowd on the way out AND back. Sharp: cannot pop Lead.', damageType: 'sharp', projectile: 'boomerang',
    tiers: [
      { name: 'Boomerang Monkey', cost: 325, blurb: 'Out-and-back blade, pierce 5.', visual: { level: 0, scale: 1 }, maxHp: 130,
        combat: { damage: 1.13, fireRate: 1.32, range: 165, pierce: 5, projectileSpeed: 480 } },
      { name: 'Glaive Thrower', cost: 325, blurb: 'Razor glaives: +dmg, pierce 8.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 160,
        combat: { damage: 2.23, fireRate: 1.65, range: 180, pierce: 8, projectileSpeed: 540 } },
      { name: 'Glaive Lord', cost: 900, blurb: 'Two glaives per throw, shreds armor.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 200,
        combat: { damage: 3, fireRate: 1.7, range: 195, pierce: 12, shots: 2, projectileSpeed: 600, armorShred: 0.1 } },
    ],
  },
  {
    id: 'hypno_shroom', name: 'Hypno-Shroom', faction: Faction.Flora, kind: 'hypno', sprite: 'hypno_shroom',
    desc: 'Puffs hypnotic spores: the strongest non-boss enemy in range switches sides at FULL health and marches back down the road fighting its old friends.',
    tiers: [
      { name: 'Hypno-Shroom', cost: 450, blurb: '1 convert at a time, up to 30 HP enemies.', visual: { level: 0, scale: 1 }, maxHp: 90,
        hypno: { perMin: 4.3, maxConverted: 1, maxHp: 30, range: 150, power: 1 } },
      { name: 'Mesmer-Shroom', cost: 550, blurb: '2 converts, up to 120 HP, faster spores.', visual: { level: 1, scale: 1.08, glow: G1 }, maxHp: 120,
        hypno: { perMin: 6, maxConverted: 2, maxHp: 120, range: 170, power: 1.4 } },
      { name: 'Grand Hypnotist', cost: 1200, blurb: '4 converts, up to 400 HP (Ironbacks, Chargers), x2 power.', visual: { level: 2, scale: 1.16, glow: G2 }, maxHp: 160,
        hypno: { perMin: 8.5, maxConverted: 4, maxHp: 400, range: 190, power: 2 } },
    ],
  },
  {
    id: 'chomper', name: 'Chomper', faction: Faction.Flora, kind: 'combat', sprite: 'chomper', hitsAir: false, damageType: 'melee',
    desc: 'Short-range snapping plant: swallows small enemies WHOLE (no bounty lost), bites big ones hard. Ground only.',
    tiers: [
      { name: 'Chomper', cost: 300, blurb: 'Devours enemies up to 20 HP.', visual: { level: 0, scale: 1 }, maxHp: 180,
        combat: { damage: 7.47, fireRate: 0.35, range: 80, pierce: 1, devour: 20 } },
      { name: 'Big Chomper', cost: 430, blurb: 'Devours up to 60 HP, faster chewing.', visual: { level: 1, scale: 1.08, glow: G1 }, maxHp: 240,
        combat: { damage: 13.78, fireRate: 0.4, range: 90, pierce: 1, devour: 60 } },
      { name: 'Royal Chomper', cost: 1080, blurb: 'Devours up to 160 HP; armor-cracking bite.', visual: { level: 2, scale: 1.16, glow: G2 }, maxHp: 320,
        combat: { damage: 26.82, fireRate: 0.44, range: 100, pierce: 1, devour: 160, armorShred: 0.15 } },
    ],
  },
  {
    id: 'tesla_coil', name: 'Tesla Coil', faction: Faction.Frontier, kind: 'combat', sprite: 'tesla_coil', damageType: 'energy', projectile: 'tesla', hitscan: true,
    desc: 'Frontier storm-tech: lightning arcs to the target then CHAINS between nearby enemies (80% per jump). Shocks shields. Hits aircraft.', hitsAir: true, antiAir: true,
    tiers: [
      { name: 'Tesla Coil', cost: 550, blurb: 'Chains to 3 enemies.', visual: { level: 0, scale: 1 }, maxHp: 150,
        combat: { damage: 4, fireRate: 0.9, range: 160, pierce: 1, chain: 3, shieldBreak: 2 } },
      { name: 'Storm Spire', cost: 540, blurb: 'Chains to 5, more voltage.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 190,
        combat: { damage: 6.53, fireRate: 0.95, range: 175, pierce: 1, chain: 5, shieldBreak: 2.5 } },
      { name: 'Thunder Citadel', cost: 1380, blurb: 'Chains to 8; stuns briefly.', visual: { level: 2, scale: 1.14, glow: G2 }, maxHp: 240,
        combat: { damage: 10.55, fireRate: 1.13, range: 190, pierce: 1, chain: 8, shieldBreak: 3, slow: 0.5 } },
    ],
  },
  {
    id: 'arcane_obelisk', name: 'Arcane Mystic Obelisk', faction: Faction.Frontier, kind: 'combat', sprite: 'arcane_obelisk', armorPiercing: true,
    desc: 'Slow, heavy arcane blasts: strip energy shields, destroy armor plating, splash. Magic pops Lead.', damageType: 'magic', projectile: 'magic',
    tiers: [
      { name: 'Mystic Obelisk', cost: 650, blurb: 'Shield-breaking blasts.', visual: { level: 0, scale: 1 }, maxHp: 160,
        combat: { damage: 12, fireRate: 0.4, range: 200, pierce: 1, splash: 50, armorShred: 0.5, shieldBreak: 3, projectileSpeed: 380 } },
      { name: 'Runed Obelisk', cost: 650, blurb: 'Bigger blasts.', visual: { level: 1, scale: 1.06, glow: G1 }, maxHp: 200,
        combat: { damage: 20, fireRate: 0.5, range: 220, pierce: 1, splash: 62, armorShred: 0.7, shieldBreak: 4, projectileSpeed: 420 } },
      { name: 'Astral Monolith', cost: 1560, blurb: 'Annihilates plating.', visual: { level: 2, scale: 1.12, glow: G2 }, maxHp: 240,
        combat: { damage: 29.87, fireRate: 0.54, range: 240, pierce: 2, splash: 75, armorShred: 1, shieldBreak: 5, projectileSpeed: 460 } },
    ],
  },
];


export const towerById = (id: string) => {
  const t = TOWERS.find((x) => x.id === id);
  if (!t) throw new Error('Unknown tower ' + id);
  return t;
};
