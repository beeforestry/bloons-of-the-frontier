// =============================================================================
// ENEMY DATA: classic layered bloons + original hive-bug designs
// (inspired by sci-fi bug swarms; original painted art in public/assets/v3).
// =============================================================================
import type { EnemyData } from '../core/types';

/** Base (red) bloon speed in px/s; layer speeds are ratios of this. */
export const BLOON_BASE_SPEED = 62;
const B = (o: Partial<EnemyData> & Pick<EnemyData, 'id' | 'name' | 'sprite' | 'hp' | 'speed' | 'color'>): EnemyData => ({
  family: 'bloon', leak: 1, bounty: 1, radius: 14, size: 44, flying: true, ...o,
});
const BUG = (o: Partial<EnemyData> & Pick<EnemyData, 'id' | 'name' | 'sprite' | 'hp' | 'speed' | 'color'>): EnemyData => ({
  family: 'bug', leak: 1, bounty: 2, radius: 12, size: 36, flying: false, meleeDps: 4, swarm: 6, dropChance: 0.04, ...o,
});

export const ENEMIES: Record<string, EnemyData> = Object.fromEntries(
  [
    // ---- Bloons: popping a layer reveals the child. Flying: troops can't block them.
    // Sebastian's BLOON_TYPES layer model: a popped layer DOWNGRADES IN PLACE to its
    // child (same position & path progress). hp / reward / colour are his values;
    // speed = his ratio × our base red speed (62 px/s), applied with dt.
    //   RED 1hp ×1.0 · BLUE 2hp ×1.4 · GREEN 3hp ×1.8 · YELLOW 4hp ×3.2 · PINK 5hp ×3.5
    // (his PINK→PINK loop is fixed: pink downgrades to yellow.)
    B({ id: 'red', name: 'Red Bloon', sprite: 'bloon_red', hp: 1, speed: BLOON_BASE_SPEED * 1.0, color: '#ff3333', bounty: 1 }),
    B({ id: 'blue', name: 'Blue Bloon', sprite: 'bloon_blue', hp: 2, speed: BLOON_BASE_SPEED * 1.4, color: '#3388ff', bounty: 2, children: { id: 'red', count: 1 }, size: 48 }),
    B({ id: 'green', name: 'Green Bloon', sprite: 'bloon_green', hp: 3, speed: BLOON_BASE_SPEED * 1.8, color: '#33cc33', bounty: 3, children: { id: 'blue', count: 1 } }),
    B({ id: 'yellow', name: 'Yellow Bloon', sprite: 'bloon_yellow', hp: 4, speed: BLOON_BASE_SPEED * 3.2, color: '#ffcc00', bounty: 4, children: { id: 'green', count: 1 } }),
    B({ id: 'pink', name: 'Pink Bloon', sprite: 'bloon_pink', hp: 5, speed: BLOON_BASE_SPEED * 3.5, color: '#ff66cc', bounty: 5, children: { id: 'yellow', count: 1 } }),
    B({ id: 'lead', name: 'Lead Bloon', sprite: 'bloon_lead', hp: 6, speed: 50, color: '#5b6270', lead: true, children: { id: 'pink', count: 2 }, bounty: 3, size: 48, scrap: 2 }),
    B({ id: 'ceramic', name: 'Ceramic Bloon', sprite: 'bloon_ceramic', hp: 22, speed: 70, color: '#e9e4dc', children: { id: 'pink', count: 2 }, bounty: 4, size: 50, radius: 16, scrap: 3 }),
    B({ id: 'moab', name: 'M.O.A.B.', sprite: 'bloon_moab', hp: 400, speed: 24, color: '#5aa0e8', children: { id: 'ceramic', count: 4 }, bounty: 40, size: 124, radius: 36, boss: true, heavy: true, scrap: 30 }),
    // ---- Hive bugs: ground units; troops block & fight them.
    BUG({ id: 'scavenger', name: 'Scavenger', sprite: 'bug_scavenger', hp: 4, speed: 92, color: '#d9792b', swarm: 16, meleeDps: 3, size: 30, radius: 10 }),
    BUG({ id: 'hunter', name: 'Hunter', sprite: 'bug_hunter', hp: 14, speed: 66, color: '#c4562b', leap: { every: 3.5, distance: 95 }, meleeDps: 7, bounty: 5, size: 42, swarm: 10 }),
    BUG({ id: 'charger', name: 'Charger', sprite: 'bug_charger', heavy: true, scrap: 12, hp: 90, speed: 44, color: '#8a5a2b', frontArmor: true, meleeDps: 14, bounty: 15, leak: 5, size: 66, radius: 20, swarm: 2, dropChance: 0.3 }),
    BUG({ id: 'brood', name: 'Brood Sac', sprite: 'bug_brood', hp: 70, speed: 30, color: '#b38a2e', spawns: { id: 'scavenger', every: 5, count: 3 }, meleeDps: 4, bounty: 14, leak: 4, size: 58, radius: 18, swarm: 2, dropChance: 0.3 }),
    BUG({ id: 'bile_titan', name: 'Bile Titan', sprite: 'bug_titan', heavy: true, scrap: 40, hp: 900, speed: 18, color: '#6a7d2a', boss: true, acid: { every: 4, damage: 30, range: 170 }, meleeDps: 25, bounty: 80, leak: 40, size: 128, radius: 36, swarm: 0, children: { id: 'scavenger', count: 4 }, dropChance: 1 }),
    // ---- t24 counters: armored (pierce/explosive/AP), shielded (pop shield / EMP), aircraft (AA only)
    BUG({ id: 'ironback', name: 'Ironback', sprite: 'bug_ironback', hp: 60, speed: 40, color: '#6f7780', armored: 0.8, heavy: true, scrap: 10, meleeDps: 12, bounty: 14, leak: 4, size: 64, radius: 20, swarm: 2, dropChance: 0.2 }),
    BUG({ id: 'warden', name: 'Shield Warden', sprite: 'bug_warden', hp: 40, shield: 50, speed: 46, color: '#46c6e8', heavy: true, scrap: 8, meleeDps: 8, bounty: 12, leak: 3, size: 58, radius: 18, swarm: 3, dropChance: 0.2 }),
    // ---- t28 multi-phase bosses. Phase 1: heavy plating + energy shield. Phase 2 (<50% HP):
    // sub-wave spawns and attacks that target YOUR turrets & troops. Never hypnotizable.
    BUG({ id: 'boss_scarab', name: 'Heavy Scarab Walker', sprite: 'boss_scarab', hp: 1400, shield: 250, speed: 15, color: '#8a6f4a', boss: true, heavy: true, scrap: 70,
      meleeDps: 30, bounty: 180, leak: 60, size: 230, radius: 52, swarm: 0, dropChance: 1,
      bossKit: { armor1: 0.5, armor2: 0.2, spawn: 'hunter', spawnCount: 4, spawnEvery: 7, attack: 'laser', attackEvery: 5, attackDamage: 70, attackRadius: 460 } }),
    B({ id: 'boss_zeppelin', name: 'Giant Bloon-Zeppelin', sprite: 'boss_zeppelin', hp: 2000, shield: 350, speed: 13, color: '#7a5ae8', boss: true, heavy: true, scrap: 70,
      bounty: 200, leak: 70, size: 240, radius: 56, children: { id: 'moab', count: 2 }, dropChance: 1,
      bossKit: { armor1: 0.55, armor2: 0.15, spawn: 'ceramic', spawnCount: 3, spawnEvery: 6, attack: 'bombs', attackEvery: 4.5, attackDamage: 55, attackRadius: 380 } }),
    BUG({ id: 'boss_dreadnought', name: 'Zombie Dreadnought', sprite: 'boss_dreadnought', hp: 3000, shield: 400, speed: 11, color: '#5d7a3a', boss: true, heavy: true, scrap: 90,
      meleeDps: 40, bounty: 260, leak: 80, size: 250, radius: 58, swarm: 0, dropChance: 1, children: { id: 'charger', count: 3 },
      bossKit: { armor1: 0.65, armor2: 0.25, spawn: 'scavenger', spawnCount: 8, spawnEvery: 5, attack: 'smash', attackEvery: 4.5, attackDamage: 90, attackRadius: 210 } }),
    // FINAL BOSS (wave 100 on Hard / Impoppable; freeplay milestones): three phases via
    // bossKit (phase 2 at 50%) + a phase-3 frenzy below 20% (see Enemy.updateBoss).
    BUG({ id: 'boss_leviathan', name: 'Hive Leviathan — Final Boss', sprite: 'boss_leviathan', hp: 9000, shield: 1500, speed: 8, color: '#b03a5a', boss: true, heavy: true, scrap: 250,
      meleeDps: 80, bounty: 1500, leak: 9999, size: 380, radius: 84, swarm: 0, dropChance: 1, children: { id: 'boss_scarab', count: 2 },
      bossKit: { armor1: 0.7, armor2: 0.3, spawn: 'charger', spawnCount: 4, spawnEvery: 6, attack: 'smash', attackEvery: 4, attackDamage: 140, attackRadius: 260, frenzy: true } }),
    BUG({ id: 'gargoyle', name: 'Hive Gargoyle', sprite: 'bug_gargoyle', hp: 16, speed: 78, color: '#9a6bd1', flying: true, air: true, acid: { every: 3.2, damage: 6, range: 150 }, meleeDps: 0, bounty: 6, leak: 2, size: 54, radius: 16, swarm: 0, dropChance: 0.05 }),
  ].map((e) => [e.id, e]),
);

/** Total HP including every child layer (used for Strong targeting + leak math). */
export function totalStrength(id: string): number {
  const e = ENEMIES[id];
  return e.hp + (e.children ? e.children.count * totalStrength(e.children.id) : 0);
}
/** Lives lost if this enemy (and everything inside it) leaks. */
export function totalLeak(id: string): number {
  const e = ENEMIES[id];
  return e.leak + (e.children && e.family === 'bloon' ? e.children.count * totalLeak(e.children.id) : 0);
}
