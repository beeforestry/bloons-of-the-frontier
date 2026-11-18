// =============================================================================
// t105 PROXIMITY EFFECTS
// Towers standing right next to an elemental or support tower pick up a small bonus:
//   ❄ next to an ice tower (element chill)  -> every 3rd hit also stamps Chilled (1 s)
//   🔥 next to a fire tower (element burn)  -> every 3rd hit also stamps Burning (1 s)
//   ☀ next to a support tower (aura)        -> +6% attack speed (own 'prox' stack, never stacks with itself)
// The stamp goes through the normal element system (src/systems/Elements.ts), so proximity can set
// up combos (e.g. a Soaking destroyer beside a Frost Bastion -> Freeze; a Shocking tesla beside a fire
// tower doesn't combo, burn + chill cancel). Only the NEAREST elemental neighbour counts, never one that
// matches the tower's own element. Recomputed every 0.5 s; cheap (towers are few).
// =============================================================================
import type { Element } from '../core/types';
import type { Game } from '../game/Game';
import type { Tower } from '../entities/Tower';
import { dist } from '../core/math';

export const PROX = {
  /** Extra gap allowed between the two tower bases (px) — "next to". */
  gap: 70,
  every: 0.5,
  /** Every Nth shot carries the neighbour's element. */
  stampEvery: 3,
  /** Seconds of the proximity status. */
  dur: 1,
  /** Attack speed from an adjacent support tower. */
  rate: 0.06,
  elems: ['chill', 'burn'] as Element[],
};

export interface ProxState { elem: Element | null; elemFrom: Tower | null; support: Tower | null }

const isSupport = (t: Tower) => !!t.t.aura && t.data.kind !== 'combat';
export function proxReach(g: Game, a: Tower, b: Tower) { return g.towerRadius(a.data.id) + g.towerRadius(b.data.id) + PROX.gap; }

export function updateProximity(g: Game) {
  const ts = g.towers.filter((t) => t.alive);
  for (const t of ts) {
    if (!t.t.combat || t.data.kind === 'path') { if (t.prox) { t.prox = null; t.buffs.remove('prox'); } continue; }
    let elem: Element | null = null, from: Tower | null = null, ed = Infinity, sup: Tower | null = null, sd = Infinity;
    const own = t.elem;
    for (const o of ts) {
      if (o === t || o.disabled) continue;
      const d = dist(o, t); if (d > proxReach(g, t, o)) continue;
      const oe = o.elem;
      if (oe && PROX.elems.includes(oe) && oe !== own && o.t.combat?.status && d < ed) { ed = d; elem = oe; from = o; }
      if (isSupport(o) && d < sd) { sd = d; sup = o; }
    }
    t.prox = elem || sup ? { elem, elemFrom: from, support: sup } : null;
    if (sup) t.buffs.apply({ sourceId: 'prox', stackKey: 'prox', bonusMaxHp: 0, bonusRangePct: 0, regen: 0, ratePct: PROX.rate, incomePct: 0 });
    else t.buffs.remove('prox');
  }
}
/** Tower panel lines ("Neighbour effects"). */
export function proxLines(t: Tower): string[] {
  const p = t.prox; if (!p) return [];
  const out: string[] = [];
  if (p.elem && p.elemFrom) out.push(`${p.elem === 'chill' ? '❄ Chill' : '🔥 Burn'} on every ${PROX.stampEvery}rd hit <i>(${p.elemFrom.t.name})</i>`);
  if (p.support) out.push(`☀ +${Math.round(PROX.rate * 100)}% attack speed <i>(${p.support.t.name})</i>`);
  return out;
}
