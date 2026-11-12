// =============================================================================
// t78 OVERRUN — first-person PvEvP survival (data only, no DOM / three.js).
//  Survivors pick a Vanguard unit (infantry or vehicle) and spawn together in first
//  person; AI hive bugs hunt them across the map. A fallen survivor picks a monster
//  class and comes back hunting the rest. Kills earn points; survivors spend points
//  on base-tier towers placed from the tactical (2D) map. Survive the timer to win.
// =============================================================================

/** Playable survivor units (internal unit ids; display names are the in-game ones). */
export interface OvUnit { id: string; name: string; role: string; hp: number; /** armour cap + damage multiplier in Overrun */ armor: number; dmg: number; vehicle?: boolean; blurb: string; portrait: string; body: number }
export const OV_UNITS: OvUnit[] = [
  { id: 'marine', name: 'Frontier Marines', role: 'Rifleman', hp: 170, armor: 1, dmg: 1.3, blurb: 'Assault rifle, hits air + ground. Balanced all-rounder.', portrait: 'assets/v3/marine_0.webp', body: 0.45 },
  { id: 'odst', name: 'Orbital Drop Troopers', role: 'Shock trooper', hp: 200, armor: 1, dmg: 1.2, blurb: 'Fast SMG trooper. Q: Stim (+fire rate, +speed) · 2: EMP.', portrait: 'assets/v3/odst_0.webp', body: 0.45 },
  { id: 'spartan', name: 'Aegis Operative', role: 'Heavy hero', hp: 380, armor: 3, dmg: 1, blurb: 'Piercing Aegis Beam melts lines of bugs. Slow to turn a crowd.', portrait: 'assets/v3/spartan_0.webp', body: 0.5 },
  { id: 'warthog', name: 'Raider Buggy', role: 'Fast vehicle', hp: 320, armor: 2, dmg: 1.1, vehicle: true, blurb: 'Fastest unit. Chaingun fires on the move — kite the swarm.', portrait: 'assets/v3/warthog_0.webp', body: 1.9 },
  { id: 'scorpion', name: 'Bulwark Scorpion', role: 'Heavy vehicle', hp: 440, armor: 3, dmg: 0.45, vehicle: true, blurb: 'Slow tank. 90mm shells splash crowds; reloads slowly up close.', portrait: 'assets/v3/scorpion_0.webp', body: 2.5 },
];
export const ovUnit = (id: string) => OV_UNITS.find((u) => u.id === id) ?? OV_UNITS[0];

/** AI-monster bite stats (per bite; discrete hits so armour reads like it does in the main game). */
export const OV_BITE: Record<string, { dmg: number; every: number }> = {
  scavenger: { dmg: 5, every: 0.7 }, hunter: { dmg: 9, every: 0.8 }, charger: { dmg: 20, every: 1.0 }, brood: { dmg: 6, every: 0.8 },
  ironback: { dmg: 14, every: 1.0 }, warden: { dmg: 9, every: 0.9 },
};

/** Monster classes a turned player can pick (own enemy GLB + bite + one ability). */
export interface OvMonster { id: string; name: string; hp: number; speed: number; bite: number; every: number; ability: string; abilCd: number; blurb: string; portrait: string }
export const OV_MONSTERS: OvMonster[] = [
  { id: 'scavenger', name: 'Scavenger', hp: 80, speed: 1.15, bite: 10, every: 0.55, ability: 'Skitter', abilCd: 5, blurb: 'Fastest. Weak bite — swarm with the hive.', portrait: 'assets/v3/bug_scavenger.webp' },
  { id: 'hunter', name: 'Hunter', hp: 140, speed: 1.0, bite: 18, every: 0.7, ability: 'Pounce', abilCd: 4, blurb: 'Pounce across the gap and maul a straggler.', portrait: 'assets/v3/bug_hunter.webp' },
  { id: 'charger', name: 'Charger', hp: 340, speed: 1.0, bite: 32, every: 0.95, ability: 'Charge', abilCd: 7, blurb: 'Armoured head. Charge breaks lines and towers.', portrait: 'assets/v3/bug_charger.webp' },
  { id: 'brood', name: 'Brood Sac', hp: 260, speed: 1.15, bite: 10, every: 0.7, ability: 'Spawn brood', abilCd: 14, blurb: 'Slow tank that births three Scavengers on command.', portrait: 'assets/v3/bug_brood.webp' },
];
export const ovMonster = (id: string) => OV_MONSTERS.find((m) => m.id === id) ?? OV_MONSTERS[0];

/** Points per kill (AI monster by type; a turned player is worth the most). */
export const OV_POINTS: Record<string, number> = { scavenger: 10, hunter: 25, charger: 60, brood: 45, ironback: 55, warden: 45 };
export const OV_TURNED_POINTS = 120;
/** Share of the value paid to a tower's owner when no survivor tagged the kill. */
export const OV_TOWER_SHARE = 0.5;

/** Survivor tower shop: existing base-tier towers, priced in points. */
export interface OvShopItem { id: string; cost: number; label: string; icon: string }
export const OV_SHOP: OvShopItem[] = [
  { id: 'stone_wall', cost: 90, label: 'Barricade wall', icon: 'assets/v3/stone_wall_0.webp' },
  { id: 'dart_monkey', cost: 120, label: 'Dart sentry', icon: 'assets/v3/dart_monkey_0.webp' },
  { id: 'glue_slinger', cost: 150, label: 'Slows + corrodes', icon: 'assets/v3/glue_slinger_0.webp' },
  { id: 'unsc_firebase', cost: 180, label: 'Cover bunker', icon: 'assets/v3/unsc_firebase_0.webp' },
  { id: 'unsc_autoturret', cost: 200, label: 'Auto MG', icon: 'assets/v3/unsc_autoturret_head_0.webp' },
  { id: 'sniper_monkey', cost: 220, label: 'Long-range', icon: 'assets/v3/sniper_monkey_0.webp' },
  { id: 'tesla_coil', cost: 300, label: 'Chain lightning', icon: 'assets/v3/tesla_coil_0.webp' },
];
export const OV_MAX_TOWERS = 6;
/** Towers must go down within this many px of your survivor (protection, not a remote fortress). */
export const OV_PLACE_RANGE = 560;

export const OV_MAPS = ['tropical', 'morro'];
export const OV_DEFAULT_MIN = 5;
export const OV_DISPLAY = 'Overrun';
