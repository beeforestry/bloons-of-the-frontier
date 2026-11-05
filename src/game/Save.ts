// =============================================================================
// t55 Save / resume (single player only). Versioned JSON in localStorage.
// Autosaved at each wave end and on page hide; the main menu offers "Continue".
// A save that fails the version / map-size check is ignored (and cleared).
// =============================================================================
import type { Game } from './Game';
import type { TargetingMode } from '../core/types';
import type { DifficultyId } from '../data/difficulty';
import { unitById } from '../data/units';
import { buildingById } from '../data/buildings';
import { PLAYABLE_MAPS as MAPS } from '../data/maps';

export const SAVE_KEY = 'bof.save', SAVE_V = 2; // v2 (t56): towers carry exact x, y (v1 cell saves migrate to cell centres)
export interface SaveData {
  v: number; at: number; map: string; mapW: number; mapH: number; diff: DifficultyId;
  wave: number; freeplay: boolean; credits: number; scrap: number; energy: number; hq: number;
  unitTiers: Record<string, number>; armory: string[];
  towers: { id: string; c: number; r: number; x?: number; y?: number; tier: number; tg: TargetingMode }[];
  buildings: { pad: number; id: string; tier: number }[];
  squads: { id: string; x: number; y: number; n: number; auto: boolean; tg: TargetingMode }[];
}
const ls = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* quota/private */ } }, del: (k: string) => { try { localStorage.removeItem(k); } catch { /* */ } } };

export function snapshot(g: Game, diff: DifficultyId): SaveData {
  const w = g.res.dump();
  return {
    v: SAVE_V, at: Date.now(), map: g.map.id, mapW: g.map.width, mapH: g.map.height, diff,
    wave: g.waves.index, freeplay: g.waves.freeplay, credits: Math.floor(w.credits), scrap: Math.floor(w.scrap), energy: g.energy, hq: Math.ceil(g.hq.health.hp),
    unitTiers: { ...g.unitTiers }, armory: [...g.armory],
    towers: g.towers.filter((t) => t.alive).map((t) => ({ id: t.data.id, c: t.cell.c, r: t.cell.r, x: Math.round(t.x), y: Math.round(t.y), tier: t.tier, tg: t.targeting })),
    buildings: g.buildings.filter((b) => b.alive && b.built && b.pad).map((b) => ({ pad: g.pads.indexOf(b.pad!), id: b.data.id, tier: b.tier })).filter((b) => b.pad >= 0),
    squads: g.squads.filter((s) => s.alive).map((s) => { const c = s.center; return { id: s.data.id, x: Math.round(c.x), y: Math.round(c.y), n: s.units.filter((u) => u.alive).length, auto: s.auto, tg: s.targeting }; }),
  };
}
export function writeSave(g: Game, diff: DifficultyId) {
  if (g.mode !== 'solo' || g.net !== 'solo' || g.state !== 'playing') return;
  ls.set(SAVE_KEY, JSON.stringify(snapshot(g, diff)));
}
export function clearSave() { ls.del(SAVE_KEY); }
/** The stored save if it is this version and its map still has the same size; otherwise null (and cleared). */
export function readSave(): SaveData | null {
  const raw = ls.get(SAVE_KEY); if (!raw) return null;
  try {
    const s = JSON.parse(raw) as SaveData, m = MAPS.find((x) => x.id === s.map);
    if ((s.v === SAVE_V || s.v === 1) && m && m.width === s.mapW && m.height === s.mapH && Array.isArray(s.towers)) return s;
  } catch { /* corrupt */ }
  clearSave(); return null;
}
/** Rebuild a fresh Game (same map + difficulty) to the saved state. Unknown ids are skipped. */
export function applySave(g: Game, s: SaveData) {
  g.res.load({ credits: 1e9, scrap: 1e9 }, true); // pay for the rebuild, then restore the real wallet
  for (const t of s.towers) {
    try {
      const tw = g.placeTower(t.id, t.x !== undefined && !g.gridKind(t.id) ? { c: t.c, r: t.r, x: t.x, y: t.y } : { c: t.c, r: t.r }); if (!tw) continue;
      while (tw.tier < t.tier && tw.upgrade(g)) { /* */ }
      tw.targeting = t.tg;
    } catch { /* tower id gone */ }
  }
  for (const b of s.buildings) {
    try {
      const pad = g.pads[b.pad]; buildingById(b.id as never); if (!pad) continue;
      const bb = g.buildOnPad(pad, b.id as never); if (!bb) continue;
      bb.tier = Math.min(b.tier, bb.data.tiers.length - 1); bb.build = null; bb.health.setBase(bb.t.stats.maxHp, 0); bb.health.hp = bb.health.max;
    } catch { /* building id gone */ }
  }
  for (const q of s.squads) {
    try {
      const sq = g.spawnSquad(unitById(q.id), { x: q.x, y: q.y }, false);
      const extra = sq.units.splice(Math.max(1, q.n)); if (extra.length) g.units = g.units.filter((u) => !extra.includes(u));
      sq.auto = q.auto; sq.targeting = q.tg;
    } catch { /* unit id gone */ }
  }
  for (const [id, t] of Object.entries(s.unitTiers ?? {})) g.unitTiers[id] = t;
  for (const a of s.armory ?? []) g.armory.add(a as never);
  g.waves.freeplay = !!s.freeplay; g.waves.skipTo(s.wave + 1);
  g.energy = s.energy ?? g.energy; g.hq.health.hp = Math.max(1, Math.min(g.hq.health.max, s.hq));
  g.res.load({ credits: s.credits, scrap: s.scrap }, true);
  g.effects.length = 0;
}
