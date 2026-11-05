// Faction registry: colors + labels for UI tabs, range rings and health bars.
import { Faction } from '../core/types';
export interface FactionInfo { id: Faction; name: string; color: string; accent: string; icon: string; blurb: string }
export const FACTIONS: FactionInfo[] = [
  { id: Faction.Primates, name: 'Primates', color: '#d98c3f', accent: '#ffd27a', icon: '🐒', blurb: 'Primate towers: darts, shadows, arcane bolts, lasers and money.' },
  { id: Faction.Flora, name: 'Flora', color: '#4fbf45', accent: '#b6f78f', icon: '🌱', blurb: 'Living plants: peas, berries, melons, stars and the Oakshield bastion.' },
  { id: Faction.UNSC, name: 'Vanguard', color: '#4d86d9', accent: '#a9cdff', icon: '🛡️', blurb: 'Human tech: turrets, rail lances, flak AA, firebases, supply, drop troopers, raiders and an Aegis Operative.' },
  { id: Faction.Frontier, name: 'Frontier', color: '#b98b52', accent: '#f1d29a', icon: '🏰', blurb: 'Line Watch: stone walls to garrison, the Arcane Obelisk, and Paladin Captains.' },
];
export const factionInfo = (f: Faction) => FACTIONS.find((x) => x.id === f)!;
