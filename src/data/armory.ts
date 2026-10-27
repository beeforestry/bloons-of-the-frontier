// =============================================================================
// SALVAGE ARMORY: scrap-only tech (bought from the HQ panel). Scrap is the
// gathered salvage currency; these are permanent army-wide upgrades.
// =============================================================================
export type ArmoryId = 'plating' | 'ap' | 'servos';
export interface ArmoryTech { id: ArmoryId; name: string; scrap: number; desc: string }
export const ARMORY: ArmoryTech[] = [
  { id: 'plating', name: 'Salvaged Plating', scrap: 40, desc: 'All troops & vehicles +20% max HP.' },
  { id: 'ap', name: 'AP Rounds', scrap: 60, desc: 'Troop & vehicle guns pierce armor plating.' },
  { id: 'servos', name: 'Overdrive Servos', scrap: 90, desc: 'Troops & vehicles +15% damage, +10% move speed.' },
];
export const ARMORY_FX = { plating: 0.2, servosDmg: 0.15, servosSpeed: 0.1 };
/** Scrap salvaged when clearing terrain. */
export const SALVAGE = { rock: 5, log: 3, shortcut: 35 };
