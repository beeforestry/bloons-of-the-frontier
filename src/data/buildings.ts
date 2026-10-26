// =============================================================================
// BUILDING DATA (Halo Wars base layer): the HQ plus the three pad buildings.
//  - HQ: the game is lost when it falls. Sets base pop cap + energy regen and
//    carries a defence gun. Upgrading it raises everything.
//  - Supply Pad: SAFE base income (paid straight into the bank) - the
//    counterweight to exposed field farms (bigger payouts, but bugs and acid
//    can knock them offline and their crates must be collected).
//  - Reactor: unlocks tech tiers (+1 tech per tier) and +5 pop cap (more per tier).
//  - Barracks: trains squads one at a time from a queue, holds finished squads
//    at the door while pop/tech is short, and marches them to its rally point.
// GAME RULE (validated): every tier strictly stronger and visibly more advanced.
// =============================================================================
import type { BuildingData, PowerData } from '../core/types';
const G1 = '#7fd3ff', G2 = '#ffd84a';

export const BUILDINGS: BuildingData[] = [
  {
    id: 'hq', name: 'Frontier HQ', sprite: 'hq', icon: '🏛', desc: 'Command HQ. If it falls, the frontier is lost. Sets pop cap & energy, and its gun covers the base.',
    tiers: [
      { name: 'Field HQ', cost: 1, buildTime: 0.1, blurb: 'Sandbagged command post.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 200, pop: 10, energyRegen: 1.2, gun: { damage: 3, fireRate: 2, range: 240, pierce: 1 } } },
      { name: 'Fortified HQ', cost: 900, buildTime: 20, blurb: '+HP, +4 pop, faster energy, heavier gun.', visual: { level: 1, scale: 1.05, glow: G1 },
        stats: { maxHp: 300, pop: 14, energyRegen: 1.7, gun: { damage: 5, fireRate: 3, range: 260, pierce: 2 } } },
      { name: 'Command Citadel', cost: 1800, buildTime: 30, blurb: 'Armoured citadel: +HP, +4 pop, max energy flow, twin guns.', visual: { level: 2, scale: 1.1, glow: G2 },
        stats: { maxHp: 420, pop: 18, energyRegen: 2.3, gun: { damage: 8, fireRate: 4, range: 290, pierce: 3 } } },
    ],
  },
  {
    id: 'supply', name: 'Supply Pad', sprite: 'supply', icon: '📦', desc: 'Safe base income: credits go straight to the bank during waves (no crates to collect, protected by the base). Lower yield than field farms.',
    tiers: [
      { name: 'Supply Pad', cost: 250, buildTime: 8, blurb: '+9 credits every 6 s during waves.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 120, income: 9, payoutsPerMin: 10, waveBonus: 25 } },
      { name: 'Supply Depot', cost: 320, buildTime: 12, blurb: 'Bigger shipments.', visual: { level: 1, scale: 1.05, glow: G1 },
        stats: { maxHp: 170, income: 13, payoutsPerMin: 11, waveBonus: 50 } },
      { name: 'Logistics Hub', cost: 600, buildTime: 16, blurb: 'Automated freight lifts.', visual: { level: 2, scale: 1.1, glow: G2 },
        stats: { maxHp: 230, income: 19, payoutsPerMin: 12, waveBonus: 90 } },
    ],
  },
  {
    id: 'reactor', name: 'Reactor', sprite: 'reactor', icon: '⚛', desc: 'Unlocks TECH (troop tiers, Line Watch) and raises the army pop cap. Also feeds leader-power energy.',
    tiers: [
      { name: 'Reactor', cost: 350, buildTime: 10, blurb: '+1 tech, +5 pop, +0.4 energy/s.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 140, tech: 1, pop: 5, energyRegen: 0.4 } },
      { name: 'Advanced Reactor', cost: 450, buildTime: 14, blurb: '+2 tech, +7 pop, +0.7 energy/s.', visual: { level: 1, scale: 1.05, glow: G1 },
        stats: { maxHp: 200, tech: 2, pop: 7, energyRegen: 0.7 } },
      { name: 'Fusion Reactor', cost: 750, buildTime: 18, blurb: '+3 tech, +10 pop, +1.1 energy/s.', visual: { level: 2, scale: 1.1, glow: G2 },
        stats: { maxHp: 260, tech: 3, pop: 10, energyRegen: 1.1 } },
    ],
  },
  {
    id: 'barracks', name: 'Barracks', sprite: 'barracks', icon: '🪖', desc: 'Trains squads one at a time (15% cheaper than drop pods, no cooldown). Squads march to the rally point.',
    tiers: [
      { name: 'Barracks', cost: 300, buildTime: 9, blurb: 'Queue 3, normal speed.', visual: { level: 0, scale: 1 },
        stats: { maxHp: 150, trainSpeed: 1, queue: 3 } },
      { name: 'Drill Barracks', cost: 400, buildTime: 13, blurb: 'Queue 4, +40% training speed.', visual: { level: 1, scale: 1.05, glow: G1 },
        stats: { maxHp: 210, trainSpeed: 1.4, queue: 4 } },
      { name: 'Spartan Academy', cost: 700, buildTime: 17, blurb: 'Queue 5, double training speed.', visual: { level: 2, scale: 1.1, glow: G2 },
        stats: { maxHp: 280, trainSpeed: 2, queue: 5 } },
    ],
  },
];
export const PAD_BUILDINGS = BUILDINGS.filter((b) => b.id !== 'hq');
export const buildingById = (id: string) => { const b = BUILDINGS.find((x) => x.id === id); if (!b) throw new Error('Unknown building ' + id); return b; };
/** Barracks training discount vs. an orbital drop pod. */
export const TRAIN_DISCOUNT = 0.85;

export const POWERS: PowerData[] = [
  { id: 'mac', name: 'MAC Blast', icon: '☄', energy: 60, cooldown: 25, desc: 'Orbital MAC strike along the lane under the cursor: heavy damage in a long strip and knocks enemies back. Great on straight lanes, awkward on bends.' },
  { id: 'heal', name: 'Heal Drop', icon: '✚', energy: 35, cooldown: 15, desc: 'Drops a medical canister: heals troops, towers and buildings in a radius and brings offline towers back.' },
];
export const MAX_ENERGY = 100;
export const MAC = { length: 560, width: 76, damage: 260, bossDamage: 520, knockback: 140, bossKnockback: 40, delay: 0.9, sweep: 0.5 };
export const HEAL = { radius: 170, unitHeal: 70, towerHeal: 160 };
