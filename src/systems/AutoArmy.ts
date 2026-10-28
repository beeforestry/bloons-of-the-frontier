// =============================================================================
// AUTO ARMY: optional role AI for troop squads (global HUD toggle per player,
// per-squad toggle in the unit panel, hotkey G). Host-authoritative: runs on
// the host / solo sim only, the snapshot mirrors the result to clients.
//  * Infantry / vehicles / heroes: hold the most threatened lane (threat =
//    enemy strength weighted by how close it is to the HQ, spread across
//    squads), intercept leaks that get close to the HQ, garrison nearby cover
//    (bunkers, garitas, cover towers) when enemies approach, fall back to the
//    HQ to heal below 35% HP and return once patched up (85%).
//  * Paladins are the medics: they follow the most wounded squad and mend
//    nearby troops (Holy Paladins and up), and still fight what reaches them.
//  * Workers: re-organize farms whenever new farms are built.
//  * Heroes / ODST auto-cast EMP / Hijack / Stim / Rally on good targets.
//  * Anti-air troops shoot flyers first (handled in Unit.update).
// Manual orders (move, patrol, garrison, stance) pause the AI for that squad;
// it resumes by itself once the order is finished.
// =============================================================================
import { dist } from '../core/math';
import type { Vec } from '../core/types';
import { EMP, HIJACK, RALLY } from '../data/abilities';
import type { Game } from '../game/Game';
import type { Enemy } from '../entities/Enemy';
import { gFree, gLeave, type Garrisonable } from '../entities/Garrison';
import type { Squad } from '../entities/Unit';

export const AUTO = {
  think: 0.5,        // s between decisions per squad
  lowHp: 0.35, healedHp: 0.85,
  hqHeal: 0.08,      // fraction of max HP per s while resting at the HQ
  interceptRem: 520, // enemies this close to the HQ (path distance) are leaks to intercept
  threatR: 300,      // enemies this close make a squad look for cover
  coverR: 220,       // max walk to a garrison
  medicR: 90, medicHps: 3,
  postFrac: 0.7,     // idle post along the duty lane
  aoeMin: 3,         // enemies in radius before an AoE ability fires
};

const medic = (sq: Squad) => sq.data.id === 'paladin';
const avgHp = (sq: Squad) => { const us = sq.units.filter((u) => u.alive); return us.length ? us.reduce((s, u) => s + u.health.frac, 0) / us.length : 1; };
const hostile = (g: Game) => g.enemies.filter((e) => e.alive && e.targetable && !e.ally);

/** Threat per lane: enemy strength, weighted up as they get closer to the HQ. */
function laneThreat(g: Game, es: Enemy[]): number[] {
  const t = g.paths.map(() => 0);
  for (const e of es) { const L = g.paths[e.lane]?.length ?? 1; t[e.lane] = (t[e.lane] ?? 0) + Math.max(1, e.strength) * (1 + 2 * Math.max(0, 1 - e.remaining / L)); }
  return t;
}

/** Point a squad holds on its lane: ahead of the lead enemy there, else the idle post. */
function postOn(g: Game, lane: number, es: Enemy[]): Vec {
  const p = g.paths[lane];
  const lead = es.filter((e) => e.lane === lane).sort((a, b) => a.remaining - b.remaining)[0];
  let f = AUTO.postFrac * p.length;
  if (lead) f = Math.min(p.length * 0.9, Math.max(p.length * 0.45, lead.progress + 140));
  const q = p.at(f); return { x: q.x, y: q.y };
}

function go(g: Game, sq: Squad, to: Vec, task: string) {
  sq.autoTask = task;
  if (dist(sq.rally, to) < 36) return;
  for (const u of sq.units) if (u.garrison) gLeave(u.garrison, u);
  sq.garrisonTarget = null; sq.waypoints = []; sq.patrol = null; sq.formation = 'circle';
  if (sq.stance === 'retreat') sq.stance = 'aggressive';
  sq.rally = { x: to.x, y: to.y };
}

function abilities(g: Game, sq: Squad, es: Enemy[]) {
  const c = sq.center, ab = g.squadAbilities(sq);
  const near = (r: number) => es.filter((e) => dist(e, c) <= r + e.data.radius);
  for (const id of ab) {
    if ((sq.abilityCd[id] ?? 0) > 0) continue;
    let fire = false;
    if (id === 'emp' || id === 'hijack') {
      const n = near(id === 'emp' ? EMP.radius : HIJACK.radius);
      fire = n.length >= AUTO.aoeMin || n.some((e) => e.data.boss || e.data.heavy || e.shield > 0 || e.data.armored);
    } else if (id === 'stim') fire = near(170).length >= 4 && avgHp(sq) > 0.6;
    else if (id === 'rally') fire = near(RALLY.radius).length >= 2 && g.units.filter((u) => u.alive && !u.isWorker && dist(u, c) <= RALLY.radius).length >= 3;
    if (fire && g.aiOrder(() => g.useAbility(sq, id))) { sq.autoTask = `cast ${id}`; return; }
  }
}

/** Per-frame (cheap): HQ rest healing + medic aura. */
function heals(g: Game, dt: number) {
  const door = g.hq.door;
  for (const sq of g.squads) {
    if (!sq.alive) continue;
    if (sq.auto && sq.autoHeal) for (const u of sq.units) if (u.alive && dist(u, door) < 130) u.health.heal(u.health.max * AUTO.hqHeal * dt);
    if (medic(sq) && g.unitTier(sq.data.id) >= 1) for (const m of sq.units) if (m.alive && !m.garrison)
      for (const u of g.units) if (u.alive && u !== m && !u.isWorker && u.health.frac < 1 && dist(u, m) < AUTO.medicR) u.health.heal(AUTO.medicHps * dt);
  }
}

export function autoArmyUpdate(g: Game, dt: number) {
  if (g.isClient) return;
  heals(g, dt);
  const auto = g.squads.filter((s) => s.auto && s.alive);
  if (!auto.length) return;
  let es: Enemy[] | null = null, threat: number[] | null = null;
  const duty = new Map<number, number>(); // lane -> squads already assigned (spread)
  for (const s of auto) if (s.autoLane >= 0 && !s.manual && !s.autoHeal) duty.set(s.autoLane, (duty.get(s.autoLane) ?? 0) + 1);
  const intercepted = new Set<Enemy>();
  for (const sq of auto) {
    // manual order in progress: resume once it is done
    if (sq.manual) {
      const done = !sq.garrisonTarget && !sq.waypoints.length && !sq.patrol && sq.stance !== 'retreat' && (sq.arrived() || sq.units.every((u) => !u.alive || u.garrison));
      if (done) { sq.autoIdle += dt; if (sq.autoIdle > 1.5) { sq.manual = false; sq.autoIdle = 0; sq.autoT = 0; } }
      else sq.autoIdle = 0;
      sq.autoTask = 'manual order';
      continue;
    }
    sq.autoT -= dt; if (sq.autoT > 0) continue;
    sq.autoT = AUTO.think + (sq.uid % 7) * 0.02;
    es ??= hostile(g); threat ??= laneThreat(g, es);
    if (sq.data.role === 'worker') {
      const n = g.farms().length;
      if (n >= 2 && n !== sq.autoOrgN && !g.workers().some((w) => w.task?.kind === 'organize')) { sq.autoOrgN = n; const w = g.workers().find((w) => w.squad === sq); if (w) { const fs = g.farms(); w.orderOrganize({ x: fs.reduce((s, f) => s + f.x, 0) / n, y: fs.reduce((s, f) => s + f.y, 0) / n + 20 }); } }
      sq.autoTask = 'collecting / farms';
      continue;
    }
    const c = sq.center, hp = avgHp(sq);
    abilities(g, sq, es);
    // 1) retreat to heal, then return
    if (sq.autoHeal && hp >= AUTO.healedHp) sq.autoHeal = false;
    if (!sq.autoHeal && hp < AUTO.lowHp && !medic(sq)) { sq.autoHeal = true; if (sq.autoLane >= 0) duty.set(sq.autoLane, Math.max(0, (duty.get(sq.autoLane) ?? 1) - 1)); }
    if (sq.autoHeal) { go(g, sq, { x: g.hq.door.x, y: g.hq.door.y + 20 }, 'healing at HQ'); continue; }
    // 2) medics follow the wounded
    if (medic(sq)) {
      const hurt = g.squads.filter((q) => q !== sq && q.alive && q.data.role !== 'worker' && avgHp(q) < 0.8 && dist(q.center, c) < 900).sort((a, b) => avgHp(a) - avgHp(b))[0];
      if (hurt) { const hc = hurt.center; go(g, sq, { x: hc.x + 22, y: hc.y + 10 }, 'healing the wounded'); continue; }
    }
    // 3) intercept leaks near the HQ
    const leak = es.filter((e) => e.remaining < AUTO.interceptRem && !intercepted.has(e) && !(e.data.air && !sq.units[0]?.t(g).weapon.antiAir)).sort((a, b) => a.remaining - b.remaining)[0];
    if (leak && dist(leak, c) < 900) {
      intercepted.add(leak);
      const p = g.paths[leak.lane], ahead = p.at(Math.min(p.length - 30, leak.progress + 70));
      go(g, sq, ahead, 'intercepting a leak'); continue;
    }
    // 4) take cover when enemies approach
    const cover = !sq.data.vehicle && es.some((e) => dist(e, c) < AUTO.threatR);
    if (sq.units.some((u) => u.garrison)) {
      const gar = sq.units.find((u) => u.garrison)!.garrison!;
      if (es.some((e) => dist(e, gar) < AUTO.threatR + 120)) { sq.autoTask = 'garrisoned'; sq.autoIdle = 0; continue; }
      sq.autoIdle += AUTO.think; if (sq.autoIdle < 6) { sq.autoTask = 'garrisoned'; continue; }
      sq.autoIdle = 0;
    }
    if (cover && !sq.garrisonTarget) {
      const alive = sq.units.filter((u) => u.alive).length;
      const gs: Garrisonable | undefined = g.garrisonables().filter((x) => x.alive && x.gOpen() && gFree(x) >= alive && dist(x, c) < AUTO.coverR).sort((a, b) => dist(a, c) - dist(b, c))[0];
      if (gs) { g.aiOrder(() => g.garrisonSquad(sq, gs)); sq.autoTask = 'taking cover'; continue; }
    }
    if (sq.garrisonTarget) { sq.autoTask = 'taking cover'; continue; }
    // 5) defend the most threatened lane (spread across squads)
    let best = sq.autoLane >= 0 ? sq.autoLane : 0, bs = -1;
    const anyThreat = threat.some((t) => t > 0);
    for (let l = 0; l < g.paths.length; l++) {
      const n = (duty.get(l) ?? 0) - (l === sq.autoLane ? 1 : 0);
      const s = (anyThreat ? threat[l] : 1) / (1 + n) * (l === sq.autoLane ? 1.25 : 1); // stickiness
      if (s > bs) { bs = s; best = l; }
    }
    if (best !== sq.autoLane) { if (sq.autoLane >= 0) duty.set(sq.autoLane, Math.max(0, (duty.get(sq.autoLane) ?? 1) - 1)); duty.set(best, (duty.get(best) ?? 0) + 1); sq.autoLane = best; }
    go(g, sq, postOn(g, best, es), `defending lane ${best + 1}`);
  }
}
