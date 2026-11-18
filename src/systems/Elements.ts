// =============================================================================
// t103 ELEMENT STATUS COMBOS
// Idea credit: "Lightkeepers" by vega-star (https://github.com/vega-star/lightkeepers,
// Apache-2.0), a tower-defense tech demo about combining elements. Inspiration only:
// no code or art from it is used here.
//
// Some towers stamp an element status on what they hit (TowerData.element, from
// the first tier whose combat stats carry `status` = seconds). When a second,
// different status lands on an enemy that already carries one, they react:
//   💧 Soaked + ⚡ Shocked  -> CONDUCT   chain lightning arcs to nearby enemies
//   💧 Soaked + ❄ Chilled   -> FREEZE    frozen solid (short stun; heavies/bosses resist)
//   ❄ Chilled + heavy hit   -> SHATTER   that hit deals bonus damage (more if frozen)
//   🔥 Burning + 💧 Soaked  -> STEAM     burn goes out, armor plating offline + damage taken up
//   🔥 Burning + explosion  -> WILDFIRE  the fire jumps to nearby enemies
//   🔥 + ❄ cancel each other (fire melts the frost).
// Statuses live only on the host sim; everything here is deterministic per hit.
// =============================================================================
import type { DamageType, Element, HitOpts } from '../core/types';
import type { Enemy } from '../entities/Enemy';
import type { Effect, Game } from '../game/Game';

export const ELEMENTS: Record<Element, { icon: string; name: string; es: string; color: string }> = {
  wet: { icon: '💧', name: 'Soaked', es: 'Empapado', color: '#5fb4ff' },
  burn: { icon: '🔥', name: 'Burning', es: 'Ardiendo', color: '#ff8a3a' },
  chill: { icon: '❄', name: 'Chilled', es: 'Helado', color: '#bfeaff' },
  shock: { icon: '⚡', name: 'Shocked', es: 'Electrizado', color: '#ffe95a' },
};

export type ComboId = 'conduct' | 'freeze' | 'shatter' | 'steam' | 'wildfire';
export const COMBOS: Record<ComboId, { name: string; es: string; recipe: string; desc: string; descEs: string; color: string }> = {
  conduct: { name: 'CONDUCT', es: 'CONDUCCIÓN', recipe: '💧 + ⚡', color: '#d6f6ff',
    desc: 'Chain lightning arcs from the soaked enemy to up to 4 neighbours.', descEs: 'Un rayo en cadena salta del enemigo mojado a hasta 4 vecinos.' },
  freeze: { name: 'FREEZE', es: 'CONGELADO', recipe: '💧 + ❄', color: '#9fe3ff',
    desc: 'Frozen solid for a moment. Heavies resist, bosses mostly shrug it off.', descEs: 'Queda congelado un momento. Los pesados resisten y los jefes casi no.' },
  shatter: { name: 'SHATTER', es: 'ESTALLIDO', recipe: '❄ + 💥', color: '#e8fbff',
    desc: 'A heavy hit (explosive, rail, Marksman, tank, bite) on a chilled enemy deals +60% (+100% if frozen).', descEs: 'Un golpe pesado a un enemigo helado hace +60% (+100% si está congelado).' },
  steam: { name: 'STEAM', es: 'VAPOR', recipe: '🔥 + 💧', color: '#f2f2f2',
    desc: 'Puts the fire out, but the steam knocks plating offline and the enemy takes +20% damage.', descEs: 'Apaga el fuego, pero el vapor anula el blindaje y recibe +20% de daño.' },
  wildfire: { name: 'WILDFIRE', es: 'INCENDIO', recipe: '🔥 + 💥', color: '#ffb04a',
    desc: 'An explosion on a burning enemy spreads the fire to up to 5 enemies nearby.', descEs: 'Una explosión sobre un enemigo en llamas propaga el fuego a hasta 5 cercanos.' },
};

/** All tuning in one place (balance-checked with tests/balance_sim.py). */
export const ELEM_TUNE = {
  /** Burn damage per second = triggering hit damage × this (min 0.4). */
  burnDpsK: 0.1,
  conduct: { jumps: 4, radius: 120, k: 0.5, flat: 4, cd: 0.25 },
  freeze: { dur: 1.4, heavyK: 0.6, bossK: 0.3, immune: 5 },
  shatter: { k: 0.6, frozenK: 1.0 },
  steam: { dur: 3, amp: 0.2, bossAmp: 0.1 },
  wildfire: { radius: 80, max: 5, cd: 1.5, dur: 3 },
  /** Balance/debug switch: 'all' or combo ids to turn off (tests/balance_sim.py --pre). */
  off: [] as string[],
};

export interface ElemState {
  wet: number; burn: number; chill: number; shock: number;
  burnDps: number; burnAcc: number;
  frozenT: number; steamT: number;
  freezeCd: number; fireCd: number; conductCd: number;
}
export const newElemState = (): ElemState => ({ wet: 0, burn: 0, chill: 0, shock: 0, burnDps: 0, burnAcc: 0, frozenT: 0, steamT: 0, freezeCd: 0, fireCd: 0, conductCd: 0 });
export const ELEM_ORDER: Element[] = ['wet', 'burn', 'chill', 'shock'];

const popAt = new Map<ComboId, number>();
function count(g: Game, id: ComboId, e: Enemy) {
  const s = g.stats.elem; s[id] = (s[id] ?? 0) + 1;
  if (!g.stats.elemFirst) { g.stats.elemFirst = true; g.toast(`⚗ ${COMBOS[id].name}! Two elements combined. Select a tower and press ⚗ ? for all combos.`, COMBOS[id].color); }
  // one popup per combo kind every 0.3 s keeps busy lanes readable
  if (g.time - (popAt.get(id) ?? -9) < 0.3) return;
  popAt.set(id, g.time);
  const c = COMBOS[id];
  g.fx({ kind: 'text', x: e.x, y: e.y - e.data.size * 0.5 - 22, text: `${c.recipe} ${c.name}!`, color: c.color, dur: 1.0 });
  g.fx({ kind: 'ring', x: e.x, y: e.y, r: e.data.radius + 18, color: c.color, dur: 0.4 });
}
const isHeavy = (type: DamageType, hit?: HitOpts) => !!hit?.heavy || type === 'explosive';

/** Damage multiplier for this hit (Steam vulnerability, Shatter bonus). Called before shields/armor. */
export function preHit(g: Game, e: Enemy, type: DamageType, hit?: HitOpts): number {
  const s = e.el; let k = 1;
  if (s.steamT > 0) k *= 1 + (e.data.boss ? ELEM_TUNE.steam.bossAmp : ELEM_TUNE.steam.amp);
  if ((s.chill > 0 || s.frozenT > 0) && isHeavy(type, hit) && hit?.elem !== 'chill') {
    const frozen = s.frozenT > 0;
    k *= 1 + (frozen ? ELEM_TUNE.shatter.frozenK : ELEM_TUNE.shatter.k);
    s.chill = 0; e.shatterT = 0.4; // t107: ice-shard death effect
    if (frozen) { s.frozenT = 0; e.stunT = 0; g.fx({ kind: 'pop', x: e.x, y: e.y, r: e.data.size * 0.6, color: '#dff8ff', dur: 0.35 }); }
    count(g, 'shatter', e); g.sfx('smash', e.x, e.y);
  }
  return k;
}

function conduct(g: Game, e: Enemy, dmg: number) {
  const T = ELEM_TUNE.conduct, s = e.el;
  s.wet = 0;
  if (ELEM_TUNE.off.includes('conduct')) return;
  if (g.time < s.conductCd) return;
  s.conductCd = g.time + T.cd;
  const near = g.enemies.filter((o) => o !== e && o.alive && !o.ally && o.targetable && (o.x - e.x) ** 2 + (o.y - e.y) ** 2 < T.radius * T.radius)
    .sort((a, b) => ((a.x - e.x) ** 2 + (a.y - e.y) ** 2) - ((b.x - e.x) ** 2 + (b.y - e.y) ** 2)).slice(0, T.jumps);
  const arc = dmg * T.k + T.flat;
  let from = { x: e.x, y: e.y - 6 };
  for (const o of near) {
    g.fx({ kind: 'beam', x: from.x, y: from.y, x2: o.x, y2: o.y - 6, color: '#d6f6ff', width: 3, dur: 0.18, jag: 1 } as Effect);
    o.takeDamage(g, arc, 'energy', from, { ap: true, antiAir: true });
    from = { x: o.x, y: o.y - 6 };
  }
  count(g, 'conduct', e); g.sfx('zap', e.x, e.y);
}

function freeze(g: Game, e: Enemy) {
  const T = ELEM_TUNE.freeze, s = e.el;
  const k = e.data.boss ? T.bossK : e.data.heavy || e.data.armored ? T.heavyK : 1;
  const t = T.dur * k;
  s.wet = 0; s.chill = 0; s.frozenT = t; s.freezeCd = g.time + T.immune;
  e.stunT = Math.max(e.stunT, t);
  count(g, 'freeze', e);
}

function steam(g: Game, e: Enemy) {
  const s = e.el;
  s.burn = 0; s.wet = 0; s.burnDps = 0; s.steamT = ELEM_TUNE.steam.dur;
  g.fx({ kind: 'dust', x: e.x, y: e.y - 8, r: e.data.radius + 16, color: '#f4f4f4', dur: 0.6 });
  count(g, 'steam', e);
}

function setBurn(e: Enemy, dur: number, dps: number) {
  const s = e.el;
  if (s.chill > 0 || s.frozenT > 0) { s.chill = 0; s.frozenT = 0; return; } // fire melts the frost; they cancel
  s.burn = Math.max(s.burn, dur); s.burnDps = Math.max(s.burnDps, dps);
}

function wildfire(g: Game, e: Enemy) {
  const T = ELEM_TUNE.wildfire, s = e.el;
  if (g.time < s.fireCd) return;
  s.fireCd = g.time + T.cd;
  const near = g.enemies.filter((o) => o !== e && o.alive && !o.ally && (o.x - e.x) ** 2 + (o.y - e.y) ** 2 < T.radius * T.radius && o.el.burn <= 0)
    .slice(0, T.max);
  if (!near.length) return;
  for (const o of near) { setBurn(o, T.dur, s.burnDps); o.el.fireCd = g.time + T.cd; g.fx({ kind: 'boom_fire', x: o.x, y: o.y, r: 16, dur: 0.3 }); }
  count(g, 'wildfire', e);
}

/** After a hit landed: stamp the hit's element and resolve combos. */
export function onHit(g: Game, e: Enemy, dealt: number, type: DamageType, hit?: HitOpts) {
  if (!e.alive || e.ally || ELEM_TUNE.off.includes('all')) return;
  const s = e.el, el = hit?.elem;
  if (s.burn > 0 && type === 'explosive' && el !== 'wet') wildfire(g, e);
  if (!el) return;
  const dur = hit?.elemDur ?? 2;
  g.stats.elemApplied++;
  switch (el) {
    case 'wet':
      if (s.burn > 0) { steam(g, e); return; }
      if (s.shock > 0) { conduct(g, e, dealt); return; }
      if (s.chill > 0 && g.time >= s.freezeCd) { freeze(g, e); return; }
      s.wet = Math.max(s.wet, dur); return;
    case 'shock':
      s.shock = Math.max(s.shock, dur);
      if (s.wet > 0) conduct(g, e, dealt);
      return;
    case 'chill':
      if (s.burn > 0) { s.burn = 0; s.burnDps = 0; return; }
      if (s.wet > 0 && g.time >= s.freezeCd) { freeze(g, e); return; }
      s.chill = Math.max(s.chill, dur); return;
    case 'burn':
      if (s.wet > 0) { steam(g, e); return; }
      setBurn(e, dur, Math.max(0.4, dealt * ELEM_TUNE.burnDpsK)); return;
  }
}

/** Per-frame status timers + burn damage-over-time (host only). */
export function tick(g: Game, e: Enemy, dt: number) {
  const s = e.el;
  if (s.wet > 0) s.wet -= dt;
  if (s.chill > 0) s.chill -= dt;
  if (s.shock > 0) s.shock -= dt;
  if (s.steamT > 0) s.steamT -= dt;
  if (s.frozenT > 0) s.frozenT -= dt;
  if (s.burn > 0) {
    s.burn -= dt; s.burnAcc += dt;
    if (s.burnAcc >= 0.5) { s.burnAcc -= 0.5; e.takeDamage(g, s.burnDps * 0.5, 'fire', undefined, { antiAir: true }); }
    if (s.burn <= 0) { s.burnDps = 0; s.burnAcc = 0; }
  }
}

/** Short status list for UIs / FP tint: [element, seconds left]. */
export const activeElems = (e: Enemy): Element[] => ELEM_ORDER.filter((k) => e.el[k] > 0);
