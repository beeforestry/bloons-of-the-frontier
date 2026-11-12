// =============================================================================
// t78 OVERRUN controller (sim side). Host / solo are authoritative; a co-op client
// keeps a mirror (applySnap) and only predicts its own turned monster's movement.
//  * pick: every human chooses a survivor unit -> the team spawns together.
//  * live: a spawn director sends free-roaming hive bugs at the survivors; bugs
//    bite survivors and chew towers in their way, never each other / turned players.
//  * a fallen survivor (while others still stand) picks a monster class and
//    respawns as it; the lone/last survivor falling ends the match (turned win).
//  * kills pay points to the survivor who tagged the bug (or 50% to the tower's
//    owner); points buy base-tier towers placed near your survivor.
// =============================================================================
import type { Game } from '../game/Game';
import { Enemy } from '../entities/Enemy';
import { Squad, Unit } from '../entities/Unit';
import { Tower } from '../entities/Tower';
import { unitById } from '../data/units';
import { towerById } from '../data/towers';
import { ENEMIES } from '../data/enemies';
import { dist } from '../core/math';
import type { Vec } from '../core/types';
import { OV_UNITS, OV_BITE, OV_POINTS, OV_TURNED_POINTS, OV_TOWER_SHARE, OV_SHOP, OV_MAX_TOWERS, OV_PLACE_RANGE, ovUnit, ovMonster, OV_MONSTERS } from './data';

export type OvRole = 'pick' | 'survivor' | 'turning' | 'turned' | 'out';
export interface OvPlayer {
  pid: number; bot: boolean; role: OvRole; cls: string; mon: string;
  points: number; earned: number; kills: number; deaths: number; respawnT: number; towers: number;
  unit: Unit | null; enemy: Enemy | null; unitUid: number; enemyUid: number; hurtT: number;
}
export interface OvOpts { minutes: number; bots: number; humans: number[]; localPid: number }
type Snap = { ph: string; tl: number; tt: number; res: string; pl: unknown[][]; fd: [number, string][] };

const AI_MIX: [string, (p: number) => number, number][] = [
  // id, weight by match progress (0..1), pack size
  ['scavenger', () => 1, 4], ['hunter', (p) => 0.25 + 0.55 * p, 1], ['charger', (p) => (p > 0.18 ? 0.12 + 0.25 * p : 0), 1],
  ['brood', (p) => (p > 0.3 ? 0.12 : 0), 1], ['warden', (p) => (p > 0.42 ? 0.1 : 0), 1], ['ironback', (p) => (p > 0.55 ? 0.12 : 0), 1],
];
const BODY_M: Record<string, number> = {}; // monster body radius in metres (visual size)

export class Overrun {
  phase: 'pick' | 'live' | 'done' = 'pick';
  total: number; timeLeft: number;
  result: '' | 'survivors' | 'turned' = '';
  players: OvPlayer[] = [];
  feed: [number, string][] = []; private feedN = 0;
  /** AI monsters (host). */
  mobs = new Set<Enemy>();
  private spawnT = 4; private pickT = 45; private regenAcc = 0;
  /** metres per map px (positions) and the walk-speed scale (same rule as possessed troops). */
  readonly S: number; readonly K: number;
  readonly localPid: number;
  /** test hook: freeze the spawn director. */
  noSpawn = false;
  /** UI hook: an event for the local screen (kill feed, deaths...). */
  onFeed: (text: string) => void = () => {};

  constructor(readonly g: Game, readonly opts: OvOpts) {
    this.S = g.map.mpp ?? 0.05; this.K = Math.min(1, 0.05 / this.S);
    this.total = this.timeLeft = Math.round(opts.minutes * 60);
    this.localPid = opts.localPid;
    for (const pid of opts.humans) this.players.push(this.newPlayer(pid, false));
    const botCls = ['odst', 'warthog', 'marine'];
    for (let i = 0; i < opts.bots; i++) { const p = this.newPlayer(10 + i, true); p.cls = botCls[i % botCls.length]; this.players.push(p); }
    g.overrun = this;
  }
  private newPlayer(pid: number, bot: boolean): OvPlayer {
    return { pid, bot, role: 'pick', cls: '', mon: '', points: 0, earned: 0, kills: 0, deaths: 0, respawnT: 0, towers: 0, unit: null, enemy: null, unitUid: -1, enemyUid: -1, hurtT: 99 };
  }
  get host() { return !this.g.isClient; }
  player(pid: number) { return this.players.find((p) => p.pid === pid) ?? null; }
  get me() { return this.player(this.localPid); }
  humans() { return this.players.filter((p) => !p.bot); }
  survivors() { return this.players.filter((p) => p.role === 'survivor'); }
  /** px from metres on this map. */
  px(m: number) { return m / this.S; }
  private say(text: string) { this.feed.push([++this.feedN, text]); if (this.feed.length > 6) this.feed.shift(); this.onFeed(text); }

  // ------------------------------------------------------------------ actions (host / solo)
  /** Player action. Returns a reason string on refusal, '' on success. */
  action(pid: number, a: string, d: Record<string, unknown>): string {
    if (!this.host) return 'host only';
    const p = this.player(pid); if (!p) return 'not in this match';
    if (a === 'pick') {
      const id = String(d.id ?? '');
      if (!OV_UNITS.some((u) => u.id === id)) return 'unknown unit';
      if (this.phase !== 'pick' || p.role !== 'pick') return 'already deployed';
      p.cls = id;
      if (this.humans().every((h) => h.cls)) this.beginLive();
      return '';
    }
    if (a === 'turn') {
      const id = String(d.id ?? '');
      if (!OV_MONSTERS.some((m) => m.id === id)) return 'unknown monster';
      if (p.role !== 'turning') return 'not respawning';
      p.mon = id; if (p.respawnT <= 0) this.spawnTurned(p);
      return '';
    }
    if (a === 'place') return this.place(p, String(d.id ?? ''), { x: +(d.x as number), y: +(d.y as number) });
    return 'unknown action';
  }
  /** Can the local survivor afford / reach a tower spot (placement ghost colour). */
  placeOk(id: string, at: Vec): boolean {
    const p = this.me, it = OV_SHOP.find((s) => s.id === id), u = p?.unit;
    return !!p && !!it && p.role === 'survivor' && p.points >= it.cost && p.towers < OV_MAX_TOWERS && !!u && u.alive && dist(u, at) <= OV_PLACE_RANGE;
  }
  place(p: OvPlayer, id: string, at: Vec): string {
    const g = this.g, it = OV_SHOP.find((s) => s.id === id);
    if (!it) return 'Not in the Overrun shop';
    if (this.phase !== 'live') return 'Wait for the match to start';
    if (p.role !== 'survivor' || !p.unit?.alive) return 'Only survivors can place towers';
    if (p.points < it.cost) return `Need ${it.cost} pts (have ${p.points})`;
    if (p.towers >= OV_MAX_TOWERS) return `Tower limit reached (${OV_MAX_TOWERS})`;
    if (dist(p.unit, at) > OV_PLACE_RANGE) return 'Too far from your unit — place towers near you';
    const s = g.placementSpot(id, at); if (!s) return "Can't build there";
    const t = new Tower(towerById(id), { ...g.grid.worldToCell({ x: s.x ?? at.x, y: s.y ?? at.y }), x: s.x, y: s.y }, g);
    t.owner = p.pid; g.occupyTower(t); g.towers.push(t); g.losVer++;
    p.points -= it.cost; p.towers++;
    g.fx({ kind: 'dust', x: t.x, y: t.y + 16, r: 26, color: '#e8d8b0', dur: 0.4 }); g.sfx('command', t.x, t.y);
    g.stats.built = (g.stats.built ?? 0) + 1;
    return '';
  }

  // ------------------------------------------------------------------ match flow
  private beginLive() {
    const g = this.g, base = g.map.rally ?? [g.map.hq[0] - 300, g.map.hq[1]];
    const team = this.players.filter((p) => p.cls);
    team.forEach((p, i) => {
      const a = (i / Math.max(1, team.length)) * Math.PI * 2, r = team.length > 1 ? 70 : 0;
      const at = this.landNear({ x: base[0] + Math.cos(a) * r, y: base[1] + Math.sin(a) * r });
      this.spawnSurvivor(p, at);
    });
    this.phase = 'live'; this.spawnT = 5;
    g.toast(`Overrun — survive ${Math.round(this.total / 60)} minutes!`, '#ffd84a');
  }
  private spawnSurvivor(p: OvPlayer, at: Vec) {
    const g = this.g, d = { ...unitById(p.cls), squadSize: 1 };
    const prev = g.actingPid; g.actingPid = p.pid;
    const sq: Squad = g.spawnSquad(d, at, false);
    g.actingPid = prev;
    sq.stance = 'aggressive';
    const u = sq.units[0], ou = ovUnit(p.cls); u.armorMax = ou.armor; u.ovDmg = ou.dmg; u.hpMul = ou.hp / d.tiers[0].stats.maxHp;
    p.unit = u; p.unitUid = u.uid; p.role = 'survivor';
  }
  /** The nearest walkable dry spot to p (spiral search). */
  landNear(p: Vec): Vec {
    const g = this.g;
    for (let r = 0; r < 900; r += 24) for (let k = 0; k < Math.max(1, r / 6); k++) {
      const a = (k / Math.max(1, r / 6)) * Math.PI * 2, q = { x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r };
      if (g.walkable(q.x, q.y) && g.grid.isLandAt(q.x, q.y)) return q;
    }
    return p;
  }
  /** A monster spawn point: dry land 380-720 px from the team, never close to any survivor. */
  spawnPoint(): Vec {
    const g = this.g, sv = this.survivors().map((p) => p.unit).filter((u): u is Unit => !!u?.alive);
    const c = sv.length ? { x: sv.reduce((s, u) => s + u.x, 0) / sv.length, y: sv.reduce((s, u) => s + u.y, 0) / sv.length } : { x: g.map.width / 2, y: g.map.height / 2 };
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2, r = 380 + Math.random() * 340, q = { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r };
      if (!g.walkable(q.x, q.y) || !g.grid.isLandAt(q.x, q.y)) continue;
      if (sv.some((u) => dist(u, q) < 330)) continue;
      return q;
    }
    return this.landNear({ x: c.x + 500, y: c.y });
  }
  private spawnMob(id: string, at: Vec, hpMul: number): Enemy {
    const g = this.g, e = g.spawnEnemy(id, 0, 0, 0, hpMul);
    e.hunt = true; e.x = at.x; e.y = at.y; e.ov.side = Math.random() < 0.5 ? 1 : -1;
    e.ov.spawnT = (ENEMIES[id].spawns?.every ?? 0) * 0.8;
    this.mobs.add(e);
    return e;
  }
  private spawnTurned(p: OvPlayer) {
    const g = this.g, m = ovMonster(p.mon || 'hunter'), at = this.spawnPoint();
    const e = g.spawnEnemy(m.id, 0, 0, 0, 1);
    e.hunt = true; e.turnedBy = p.pid; e.x = at.x; e.y = at.y;
    e.maxHp = e.hp = m.hp; e.ov.hpK = 1;
    p.enemy = e; p.enemyUid = e.uid; p.role = 'turned'; p.mon = m.id;
    g.fx({ kind: 'splat', x: at.x, y: at.y, r: 40, color: '#8fdc5a', dur: 0.6 });
    this.say(`P${p.pid + 1} rises as a ${m.name}!`);
  }
  private end(res: 'survivors' | 'turned') {
    const g = this.g; if (this.phase === 'done') return;
    this.phase = 'done'; this.result = res;
    if (res === 'survivors') g.win();
    else if (g.state === 'playing') { g.state = 'lost'; g.bus.emit('gameover', { won: false }); }
  }

  // ------------------------------------------------------------------ per step
  update(g: Game, dt: number) {
    // survivor HP scaling also on client mirrors (snapshot carries hp, not max)
    for (const u of g.units) if (u.alive && u.hpMul === 1) { const ou = OV_UNITS.find((x) => x.id === u.data.id); if (ou) { u.armorMax = ou.armor; u.ovDmg = ou.dmg; u.hpMul = ou.hp / u.data.tiers[0].stats.maxHp; } }
    if (!this.host) return;
    if (this.phase === 'pick') {
      if (this.humans().length > 1) { this.pickT -= dt; if (this.pickT <= 0) { for (const h of this.humans()) if (!h.cls) h.cls = 'marine'; this.beginLive(); } }
      return;
    }
    if (this.phase !== 'live') return;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    const prog = 1 - this.timeLeft / Math.max(1, this.total);
    // ---- deaths & kills
    for (const e of [...this.mobs]) if (!e.alive) { this.mobs.delete(e); this.credit(e, OV_POINTS[e.data.id] ?? 10); }
    for (const p of this.players) {
      if (p.role === 'survivor' && p.unit && !p.unit.alive) this.survivorDown(p);
      else if (p.role === 'turned' && p.enemy && !p.enemy.alive) {
        this.credit(p.enemy, OV_TURNED_POINTS);
        p.enemy = null; p.enemyUid = -1; p.role = 'turning'; p.respawnT = 5; p.deaths++;
        this.say(`P${p.pid + 1}'s ${ovMonster(p.mon).name} was killed`);
      } else if (p.role === 'turning') { p.respawnT = Math.max(0, p.respawnT - dt); if (p.respawnT <= 0 && p.mon) this.spawnTurned(p); }
    }
    if (this.phase !== 'live') return;
    // ---- survivor regen out of combat, bots follow the humans
    this.regenAcc += dt;
    const lead = this.survivors().find((p) => !p.bot)?.unit;
    for (const p of this.survivors()) {
      const u = p.unit; if (!u?.alive) continue;
      p.hurtT += dt;
      if (p.hurtT > 4) u.health.heal(u.health.max * 0.04 * dt);
      if (u.manual && !p.bot) u.squad.rally = { x: u.x, y: u.y }; // released later -> hold where the player left it
      if (p.bot && this.regenAcc > 0.5) { const sq = u.squad, i = this.players.indexOf(p); const tgt = lead?.alive ? { x: lead.x + Math.cos(i * 2.1) * 90, y: lead.y + Math.sin(i * 2.1) * 90 } : sq.rally; if (dist(sq.rally, tgt) > 60) sq.rally = this.landNear(tgt); }
    }
    if (this.regenAcc > 0.5) this.regenAcc = 0;
    // ---- broken towers are gone for good in Overrun (no Farmhand to revive them)
    for (const t of [...g.towers]) if (t.alive && t.disabled) { g.grid.releaseOwner(t); t.remove(); g.towers = g.towers.filter((x) => x !== t); g.losVer++; const o = this.player(t.owner); if (o) o.towers = Math.max(0, o.towers - 1); g.fx({ kind: 'boom', x: t.x, y: t.y, r: 30, dur: 0.5 }); }
    // ---- win / lose
    if (!this.survivors().length) { this.end('turned'); return; }
    if (this.timeLeft <= 0) { this.end('survivors'); return; }
    // ---- spawn director
    if (this.noSpawn) return;
    this.spawnT -= dt;
    const n = this.survivors().length, cap = Math.round((6 + 13 * prog) * (1 + 0.35 * (n - 1)));
    if (this.spawnT <= 0) {
      this.spawnT = (3.0 - 1.8 * prog) / Math.sqrt(n);
      if (this.mobs.size < cap) {
        const at = this.spawnPoint(), hpMul = 1 + 0.5 * prog + 0.25 * (n - 1);
        const ws = AI_MIX.map(([, w]) => w(prog)), tot = ws.reduce((a, b) => a + b, 0);
        let r = Math.random() * tot, k = 0; while (k < ws.length - 1 && (r -= ws[k]) > 0) k++;
        const [id, , pack] = AI_MIX[k];
        for (let i = 0; i < Math.min(pack, cap - this.mobs.size); i++) this.spawnMob(id, { x: at.x + (i % 2) * 18 - 9, y: at.y + Math.floor(i / 2) * 18 }, hpMul);
      }
    }
  }
  /** Points for a dead monster: the survivor who last hit it, else half to the nearest tower's owner. */
  private credit(e: Enemy, pts: number) {
    const src = e.lastSrc as unknown;
    let pid = -1, val = pts;
    if (src instanceof Unit) pid = src.squad.owner;
    if (pid < 0 || this.player(pid)?.role !== 'survivor') {
      pid = -1;
      const t = this.g.towers.filter((x) => x.alive).sort((a, b) => dist(a, e) - dist(b, e))[0];
      if (t && dist(t, e) < 520) { pid = t.owner; val = Math.round(pts * OV_TOWER_SHARE); }
    }
    const p = pid >= 0 ? this.player(pid) : null;
    if (!p || p.bot) return;
    p.points += val; p.earned += val; p.kills++;
    this.g.fx({ kind: 'text', x: e.x, y: e.y - 30, text: `+${val}`, color: '#ffd84a', dur: 1 });
  }
  private survivorDown(p: OvPlayer) {
    const g = this.g, at = p.unit ? { x: p.unit.x, y: p.unit.y } : null;
    p.unit = null; p.unitUid = -1; p.deaths++;
    const left = this.survivors().filter((q) => q !== p).length;
    if (p.bot) { p.role = 'out'; this.say(`${ovUnit(p.cls).name} (AI) was overrun`); if (at && left) this.spawnMob('hunter', at, 1); }
    else if (left > 0) { p.role = 'turning'; p.respawnT = 3; this.say(`P${p.pid + 1} was overrun — turning…`); }
    else p.role = 'out';
    g.sfx('splat', at?.x, at?.y);
  }

  // ------------------------------------------------------------------ monster behaviour (Enemy.update -> here)
  stepMonster(g: Game, e: Enemy, dt: number) {
    const ov = e.ov, d = e.data;
    ov.biteCd -= dt; ov.abilCd -= dt; ov.dashT -= dt;
    if (e.turnedBy >= 0 && e.manual) { this.stepTurned(g, e, dt); return; }
    if (!this.host) { // mirror: glide to the host position between snapshots
      const t = e.ov as unknown as { tx?: number; ty?: number };
      if (t.tx != null) { const k = 1 - Math.exp(-12 * dt); e.x += (t.tx - e.x) * k; e.y += (t.ty! - e.y) * k; }
      return;
    }
    const me = this.bodyM(e);
    // prey: nearest survivor; a tower in the way gets chewed first
    let prey: Unit | null = null, pd = Infinity;
    for (const u of g.units) if (u.alive && u.dropT <= 0) { const dd = dist(u, e); if (dd < pd) { pd = dd; prey = u; } }
    let tw: Tower | null = null, td = Infinity;
    for (const t of g.towers) if (t.alive && !t.disabled) { const dd = dist(t, e) - g.towerRadius(t.data.id); if (dd < td) { td = dd; tw = t; } }
    e.progress = 0; e.pathLen = prey ? pd : 99999; // 'First' targeting = closest to the survivors
    const towerFirst = !!tw && td < this.px(me + 1.4) && (!prey || td < pd);
    const tgt: Unit | Tower | null = towerFirst ? tw : prey;
    if (!tgt) return;
    const reach = towerFirst ? td : pd - this.px(this.unitBody(tgt as Unit));
    const ang = Math.atan2(tgt.y - e.y, tgt.x - e.x);
    if (reach > this.px(me + 0.9)) {
      if (d.leap && ov.abilCd <= 0 && pd < this.px(16) && pd > this.px(4)) { ov.dashT = 0.35; ov.abilCd = d.leap.every; }
      let sp = d.speed * this.K * (1 - e.slowAmt) * (ov.dashT > 0 ? 3.6 : 1);
      if (d.id === 'charger' && pd < this.px(22)) sp *= 1.7;
      this.moveMonster(g, e, ang, sp * dt);
    } else if (ov.biteCd <= 0) {
      const b = OV_BITE[d.id] ?? { dmg: (d.meleeDps ?? 4) * 0.8, every: 0.8 };
      ov.biteCd = b.every; this.bite(g, e, tgt, b.dmg * (e.ov.hpK ?? 1));
    }
    e.ang = ang;
    if (d.spawns) { ov.spawnT -= dt; if (ov.spawnT <= 0) { ov.spawnT = d.spawns.every * 1.6; if (this.mobs.size < 40) for (let i = 0; i < 2; i++) this.spawnMob(d.spawns.id, { x: e.x + (i ? 14 : -14), y: e.y + 10 }, 1); } }
    this.separate(g, e, me);
  }
  /** A turned player's monster: WASD prowl, click bite, ability on Q / Space. */
  private stepTurned(g: Game, e: Enemy, dt: number) {
    const m = e.manual!, cls = ovMonster(e.data.id), ov = e.ov as Enemy['ov'] & { ab?: number; chargeT?: number };
    const L = Math.hypot(m.mx, m.my);
    if (m.ab != null && m.ab !== ov.ab) { const first = ov.ab == null; ov.ab = m.ab; if (!first) this.monsterAbility(g, e); }
    if (L > 0.05) {
      const sp = e.data.speed * cls.speed * this.K * (1 - e.slowAmt) * (ov.dashT > 0 ? (e.data.id === 'hunter' ? 4 : e.data.id === 'charger' ? 2.3 : 1.8) : 1);
      this.moveMonster(g, e, Math.atan2(m.my, m.mx), sp * Math.min(1, L) * dt, true);
    }
    e.ang = m.aim;
    if (m.fire && ov.biteCd <= 0) {
      ov.biteCd = cls.every; ov.bites++;
      if (this.host) {
        const tgt = this.biteTarget(g, e, m.aim);
        if (tgt) this.bite(g, e, tgt, cls.bite * (ov.dashT > 0 && e.data.id === 'charger' ? 1.5 : 1));
        else g.fx({ kind: 'text', x: e.x + Math.cos(m.aim) * 20, y: e.y + Math.sin(m.aim) * 20 - 10, text: '·', color: '#ccc', dur: 0.2 });
      }
    }
    if (this.host) this.separate(g, e, this.bodyM(e));
  }
  /** Survivor / tower in front of a turned monster within bite reach. */
  /** First-person crosshair feedback: would a bite now land? */
  prey(e: Enemy, aim: number) { return this.biteTarget(this.g, e, aim); }
  biteTarget(g: Game, e: Enemy, aim: number): Unit | Tower | null {
    const me = this.bodyM(e);
    let best: Unit | Tower | null = null, bd = Infinity;
    const consider = (o: Unit | Tower, body: number) => {
      const dd = dist(o, e), reach = this.px(me + body + 1.8);
      if (dd > reach) return;
      let da = Math.abs(Math.atan2(o.y - e.y, o.x - e.x) - aim); if (da > Math.PI) da = 2 * Math.PI - da;
      if (da > 1.0 && dd > this.px(me + body + 0.2)) return;
      if (dd < bd) { bd = dd; best = o; }
    };
    for (const u of g.units) if (u.alive && u.dropT <= 0) consider(u, this.unitBody(u));
    for (const t of g.towers) if (t.alive && !t.disabled) consider(t, g.towerRadius(t.data.id) * this.S);
    return best;
  }
  monsterAbility(g: Game, e: Enemy) {
    const ov = e.ov, cls = ovMonster(e.data.id);
    if (ov.abilCd > 0) return false;
    ov.abilCd = cls.abilCd;
    if (e.data.id === 'brood') { if (this.host) for (let i = 0; i < 3; i++) this.spawnMob('scavenger', { x: e.x + Math.cos(i * 2.1) * 16, y: e.y + Math.sin(i * 2.1) * 16 }, 1); g.fx({ kind: 'ring', x: e.x, y: e.y, r: 30, color: '#e8c35a', dur: 0.4 }); }
    else ov.dashT = e.data.id === 'hunter' ? 0.4 : e.data.id === 'charger' ? 1.6 : 1.2;
    g.sfx('ability', e.x, e.y);
    return true;
  }
  private bite(g: Game, e: Enemy, tgt: Unit | Tower, dmg: number) {
    tgt.takeDamage(g, dmg);
    if (tgt instanceof Unit) { const p = this.player(tgt.squad.owner); if (p) p.hurtT = 0; }
    if (Math.random() < 0.35) g.fx({ kind: 'text', x: tgt.x, y: tgt.y - 24, text: 'CHOMP', color: '#ff8a5a', dur: 0.45 });
    g.fx({ kind: 'splat', x: (tgt.x + e.x) / 2, y: (tgt.y + e.y) / 2, r: 10, color: '#c0392b', dur: 0.25 });
  }
  /** Step toward `ang`, sliding around rocks / towers / water (tries ±35° / 70° / 105°). */
  private moveMonster(g: Game, e: Enemy, ang: number, step: number, axes = false) {
    if (step <= 0) return;
    const side = e.ov.side;
    for (const off of [0, 0.6, -0.6, 1.2, -1.2, 1.8, -1.8]) {
      const a = ang + off * side, nx = e.x + Math.cos(a) * step, ny = e.y + Math.sin(a) * step;
      if (g.walkable(nx, ny)) { e.x = nx; e.y = ny; if (off) { e.ov.stuckT += step; if (e.ov.stuckT > 220) { e.ov.side = -side; e.ov.stuckT = 0; } } else e.ov.stuckT = 0; return; }
      if (axes) break;
    }
    if (axes) { const nx = e.x + Math.cos(ang) * step, ny = e.y + Math.sin(ang) * step; if (g.walkable(nx, e.y)) e.x = nx; else if (g.walkable(e.x, ny)) e.y = ny; }
  }
  /** Keep monsters from stacking into one blob. */
  private separate(g: Game, e: Enemy, me: number) {
    for (const o of g.enemies) {
      if (o === e || !o.alive || !o.hunt) continue;
      const dx = e.x - o.x, dy = e.y - o.y, dd = Math.hypot(dx, dy), want = this.px((me + this.bodyM(o)) * 0.9);
      if (dd > 0.01 && dd < want) { const push = (want - dd) * 0.25, nx = e.x + (dx / dd) * push, ny = e.y + (dy / dd) * push; if (g.walkable(nx, ny)) { e.x = nx; e.y = ny; } }
    }
  }
  /** Visual body radius (m) of a monster, matching the first-person model scale. */
  bodyM(e: Enemy) { return BODY_M[e.data.id] ??= Math.max(0.35, e.data.radius * 0.05 * 1.15); }
  unitBody(u: Unit) { return ovUnit(u.data.id).body; }

  // ------------------------------------------------------------------ network (host -> clients)
  snapshot(uidOf: (o: object) => number = (o) => (o as { uid: number }).uid): Snap {
    return {
      ph: this.phase, tl: Math.round(this.timeLeft * 10) / 10, tt: this.total, res: this.result, fd: this.feed,
      pl: this.players.map((p) => [p.pid, p.bot ? 1 : 0, p.role, p.cls, p.mon, p.points, p.earned, p.kills, p.deaths, Math.round(p.respawnT * 10) / 10, p.towers, p.unit ? uidOf(p.unit) : -1, p.enemy ? uidOf(p.enemy) : -1]),
    };
  }
  /** Client: mirror the host state; `local(hostUid)` resolves to the mirrored entity. */
  applySnap(s: Snap, local: (uid: number) => object | undefined) {
    this.phase = s.ph as Overrun['phase']; this.timeLeft = s.tl; this.total = s.tt; this.result = s.res as Overrun['result'];
    for (const [n, t] of s.fd) if (n > this.feedN) { this.feedN = n; this.feed.push([n, t]); if (this.feed.length > 6) this.feed.shift(); this.onFeed(t); }
    for (const row of s.pl) {
      const [pid, bot, role, cls, mon, pts, earned, kills, deaths, rt, towers, uu, eu] = row as [number, number, OvRole, string, string, number, number, number, number, number, number, number, number];
      let p = this.player(pid); if (!p) { p = this.newPlayer(pid, !!bot); this.players.push(p); }
      Object.assign(p, { role, cls, mon, points: pts, earned, kills, deaths, respawnT: rt, towers, unitUid: uu, enemyUid: eu });
      p.unit = uu >= 0 ? (local(uu) as Unit | undefined) ?? null : null;
      p.enemy = eu >= 0 ? (local(eu) as Enemy | undefined) ?? null : null;
    }
  }

  // ------------------------------------------------------------------ test hooks
  hooks() {
    const g = this.g;
    return {
      ov: this,
      state: () => ({ phase: this.phase, timeLeft: this.timeLeft, total: this.total, result: this.result, gstate: g.state, mobs: this.mobs.size,
        monsters: g.enemies.filter((e) => e.alive && e.hunt).length, towers: g.towers.filter((t) => t.alive).map((t) => ({ id: t.data.id, owner: t.owner, x: Math.round(t.x), y: Math.round(t.y) })),
        players: this.players.map((p) => ({ pid: p.pid, bot: p.bot, role: p.role, cls: p.cls, mon: p.mon, points: p.points, earned: p.earned, kills: p.kills, deaths: p.deaths, respawnT: p.respawnT, towers: p.towers,
          unit: p.unit ? { id: p.unit.data.id, x: Math.round(p.unit.x), y: Math.round(p.unit.y), hp: Math.round(p.unit.health.hp), max: Math.round(p.unit.health.max), manual: !!p.unit.manual } : null,
          enemy: p.enemy ? { id: p.enemy.data.id, x: Math.round(p.enemy.x), y: Math.round(p.enemy.y), hp: Math.round(p.enemy.hp), max: p.enemy.maxHp, manual: !!p.enemy.manual } : null })) }),
      setTime: (s: number) => { this.timeLeft = s; },
      noSpawn: (on: boolean) => { this.noSpawn = on; },
      addPoints: (n: number, pid = this.localPid) => { const p = this.player(pid); if (p) { p.points += n; p.earned += n; } return p?.points ?? 0; },
      /** Spawn AI monsters right next to a survivor (default: the local one). */
      spawnNear: (id: string, n = 1, distPx = 60, pid = this.localPid) => {
        const u = this.player(pid)?.unit ?? this.survivors()[0]?.unit; if (!u) return 0;
        for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; this.spawnMob(id, this.landNear({ x: u.x + Math.cos(a) * distPx, y: u.y + Math.sin(a) * distPx }), 1); }
        return n;
      },
      killUnit: (pid = this.localPid) => { const u = this.player(pid)?.unit; if (!u?.alive) return false; u.takeDamage(g, 1e6); return !u.alive; },
      killMobs: () => { let n = 0; for (const e of this.mobs) if (e.alive) { e.alive = false; n++; } return n; },
      skipRespawn: () => { for (const p of this.players) if (p.role === 'turning') p.respawnT = 0; },
    };
  }
}
