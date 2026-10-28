// =============================================================================
// SYNC: host-authoritative multiplayer on top of the single-player Game.
//  * HOST runs the real simulation. Every player action (its own included) goes
//    through exec(pid, …): permission check -> swap that player's wallet into
//    g.res / energy / cooldowns -> run the normal Game method -> swap back.
//  * CLIENTS run a MIRROR: the same Game, but g.net='client' freezes the wallet,
//    blocks spawns / damage / leaks, and actions become commands sent to the
//    host. ~15 Hz snapshots reconcile entities (enemies blended along their path,
//    troops lerped), so motion stays smooth between snapshots.
//  * Events (pings, combos, telegraphs, spells, power casts, game over, toasts
//    meant for one player) are sent immediately as reliable messages.
// Single player never constructs this class, so it is completely unaffected.
// =============================================================================
import type { Game, PingKind } from '../game/Game';
import { Tower } from '../entities/Tower';
import { Squad, Unit, WorkerUnit } from '../entities/Unit';
import { Building, BuildPad } from '../entities/Building';
import { Enemy } from '../entities/Enemy';
import { Pickup, type PickupKind } from '../entities/Pickup';
import { Barrier, EnvStructure, Obstacle, gEnter, gLeave, type Garrisonable } from '../entities/Garrison';
import { Shortcut } from '../systems/Shortcuts';
import { towerById } from '../data/towers';
import { unitById } from '../data/units';
import { buildingById } from '../data/buildings';
import type { NetSession, Msg } from './Net';
import { Versus } from './Versus';
import type { DifficultyId } from '../data/difficulty';
import { PCOLORS } from '../core/players';
import type { Vec } from '../core/types';

export type Mode = 'coop' | 'versus';
export interface MpSettings { mode: Mode; map: string; diff: DifficultyId; credits: number; waveTimer: number; speed: 1 | 2; matchMin: number; hostRole: 'defender' | 'invader' }
export interface PlayerInfo { pid: number; name: string; ready: boolean }
export const DEFAULT_SETTINGS: MpSettings = { mode: 'coop', map: 'garden', diff: 'medium', credits: 650, waveTimer: 25, speed: 1, matchMin: 8, hostRole: 'defender' };
export const SNAP_HZ = 15;

type Wallet = { res: ReturnType<Game['res']['dump']>; energy: number; powerCd: Record<string, number>; deployCd: Record<string, number>; acc: number };
type Ref = { $: string; u?: number; i?: number; p?: number; x?: number; y?: number };

/** Game methods that become network commands on a client (and permission-checked on the host). */
const G_METHODS = ['placeTower', 'placeBarrier', 'sellTower', 'cycleTargeting', 'setTargeting', 'deploySquad', 'moveSquad', 'moveGroup', 'patrolSquad', 'setStance',
  'garrisonSquad', 'ungarrisonSquad', 'useAbility', 'researchUnit', 'buyArmory', 'buildOnPad', 'demolish', 'setRally', 'castPower', 'orderOrganizeFarms', 'demolishShortcut', 'startFreeplay', 'setAutoArmy', 'setSquadAuto'] as const;
/** Applied optimistically on the client too (instant response; the snapshot corrects). */
const OPTIMISTIC = new Set(['moveSquad', 'moveGroup', 'patrolSquad', 'setStance', 'setTargeting', 'cycleTargeting']);
/** Proto methods (Tower / Building instances). */
const P_METHODS: [typeof Tower | typeof Building, string, string][] = [[Tower, 'upgrade', 'tw.upgrade'], [Tower, 'useAbility', 'tw.useAbility'], [Building, 'upgrade', 'bd.upgrade'], [Building, 'enqueue', 'bd.enqueue'], [Building, 'cancel', 'bd.cancel']];
let ACTIVE: Sync | null = null;
let patched = false;
function patchProtos() {
  if (patched) return; patched = true;
  for (const [C, m, key] of P_METHODS) {
    const proto = C.prototype as unknown as Record<string, (...a: unknown[]) => unknown>;
    const orig = proto[m];
    ORIG[key] = orig;
    proto[m] = function (this: unknown, ...a: unknown[]) {
      const g = a[0] as Game, rest = a.slice(1), s = ACTIVE;
      if (!s || s.inExec || g.net === 'solo') return orig.call(this, g, ...rest);
      return s.local(key, [this, ...rest]);
    };
  }
}
const ORIG: Record<string, (...a: unknown[]) => unknown> = {};

export class Sync {
  readonly isHost: boolean;
  inExec = false;
  /** Host: wallets of every player whose money is NOT currently in g.res. */
  wallets = new Map<number, Wallet>();
  resPid = 0;
  allowAlly = new Map<number, boolean>();
  players: PlayerInfo[];
  versus: Versus | null = null;
  /** Co-op auto wave timer (host). */
  waveCountdown = 0;
  private snapT = 0;
  private gOrig: Record<string, (...a: unknown[]) => unknown> = {};
  /** Client: host uid -> local object, and back. */
  private h2l = new Map<number, object>();
  private l2h = new WeakMap<object, number>();
  /** Client: last snapshot (for HUD / tests). */
  last: Record<string, unknown> | null = null;
  snaps = 0;
  allCredits: number[] = [];
  /** UI hooks (NetHud). */
  onEvent: (ev: Record<string, unknown>) => void = () => {};
  onPlayers: () => void = () => {};
  private hostAcc = 0;

  constructor(readonly g: Game, readonly net: NetSession, readonly settings: MpSettings, players: PlayerInfo[], readonly localPid: number) {
    this.isHost = net.role === 'host';
    this.players = players;
    ACTIVE = this; patchProtos();
    g.net = this.isHost ? 'host' : 'client';
    g.mode = settings.mode;
    g.localPid = g.actingPid = localPid;
    g.speed = settings.speed;
    if (settings.mode === 'versus') this.resPid = this.defenderPid;
    const n = players.length;
    // starting resources (host setting) for every wallet
    g.res.load({ ...g.res.dump(), credits: settings.credits, scrap: 0 }, true);
    if (this.isHost) {
      for (const p of players) if (p.pid !== this.resPid) this.wallets.set(p.pid, { res: { ...g.res.dump() }, energy: g.energy, powerCd: {}, deployCd: {}, acc: 0 });
      if (settings.mode === 'coop' && n > 1) g.res.splitHook = (amt, type) => this.split(amt, type);
      if (settings.mode === 'versus') {
        this.versus = new Versus(settings.matchMin * 60, this.invaderPid, this.defenderPid);
        this.versus.emit = (ev) => this.event(ev);
        (g as unknown as { versus: Versus }).versus = this.versus;
        g.waves.start = () => false; // no scripted waves in versus: the invader is the wave
      }
      this.waveCountdown = settings.mode === 'coop' ? settings.waveTimer : 0;
      g.netHook.onCombo = (x, y) => this.event({ k: 'combo', x: Math.round(x), y: Math.round(y) });
      net.onMsg = (pid, m) => this.hostMsg(pid, m);
      const roster = players.map((p) => ({ ...p }));
      net.onLeave = (pid) => { this.players = this.players.filter((p) => p.pid !== pid); g.toast(`P${pid + 1} disconnected — their towers keep fighting (rejoin with code ${net.code})`, '#ff8a7a'); this.onPlayers(); };
      // rejoin by code: the seat (pid) comes back with its wallet, towers and squads; the next snapshot restores everything
      net.onJoin = (pid) => {
        const info = roster.find((p) => p.pid === pid); if (!info) return;
        if (!this.players.some((p) => p.pid === pid)) { this.players.push({ ...info }); this.players.sort((x, y) => x.pid - y.pid); }
        net.send(pid, { t: 'start', settings, players: roster, rejoin: true });
        g.toast(`P${pid + 1} rejoined`, '#8affb0'); this.onPlayers(); this.snapT = 0;
      };
    } else {
      g.res.frozen = true;
      net.onMsg = (_pid, m) => this.clientMsg(m);
      net.onLeave = () => { const bye = net.endReason === 'bye'; g.toast(bye ? 'The host left the match' : 'Lost connection to the host', '#ff6b6b'); this.onEvent({ k: 'disconnected', bye }); };
      g.netCollect = (p, rate, by) => { const u = this.l2h.get(p); if (u !== undefined) { p.alive = false; this.send({ t: 'op', op: 'collect', u, rate, by }); } };
    }
    // Route every player action through local() (host: permission + wallet swap; client: command)
    const gg = g as unknown as Record<string, (...a: unknown[]) => unknown>;
    for (const m of G_METHODS) { const o = gg[m].bind(g); this.gOrig[m] = o; gg[m] = (...a: unknown[]) => this.local(m, a); }
    const ws = g.waves.start.bind(g.waves); this.gOrig['waves.start'] = ws as never;
    g.waves.start = ((gm: Game) => this.local('waves.start', [gm])) as never;
  }
  get coop() { return this.settings.mode === 'coop'; }
  get defenderPid() { return this.settings.hostRole === 'defender' ? 0 : 1; }
  get invaderPid() { return this.settings.hostRole === 'defender' ? 1 : 0; }
  get localRole(): 'coop' | 'defender' | 'invader' { return this.coop ? 'coop' : this.localPid === this.defenderPid ? 'defender' : 'invader'; }
  color(pid: number) { return PCOLORS[pid] ?? '#fff'; }
  dispose() { if (ACTIVE === this) ACTIVE = null; this.net.close(); }

  // ------------------------------------------------------------------ actions
  /** Entry point for every local action. */
  local(name: string, args: unknown[]): unknown {
    if (this.g.aiDepth > 0 && this.gOrig[name]) return this.gOrig[name](...args); // Auto Army (host sim) orders
    if (this.isHost) return this.exec(this.localPid, name, args);
    // client: optimistic visuals for orders, then ship the command
    let ret: unknown = null;
    if (OPTIMISTIC.has(name)) { this.inExec = true; try { ret = this.gOrig[name](...args); } finally { this.inExec = false; } }
    if (!this.allowedLocal(name, args)) return name === 'deploySquad' || name === 'buildOnPad' ? null : false;
    this.send({ t: 'cmd', n: name, a: this.ser(args) });
    if (name === 'castPower') this.g.sfx('command');
    // truthy results let the UI leave placement mode; object-returning calls return null (snapshot brings the object)
    if (name === 'deploySquad' || name === 'buildOnPad') return null;
    return ret ?? true;
  }
  /** Client-side early rejection with a friendly toast (the host re-checks everything). */
  private allowedLocal(name: string, args: unknown[]): boolean {
    const why = this.deny(this.localPid, name, args);
    if (why) { this.g.toast(why, '#ff8a7a'); this.g.sfx('error'); return false; }
    return true;
  }
  /** Permission rules. Returns a reason string when the action is not allowed. */
  deny(pid: number, name: string, args: unknown[]): string | null {
    const g = this.g;
    if (!this.coop) {
      const inv = pid === this.invaderPid;
      if (inv && !name.startsWith('vs.')) return 'You are the Invader — play cards and spells from your hand';
      if (!inv && name.startsWith('vs.')) return 'Only the Invader can do that';
      if (name === 'startFreeplay') return 'No freeplay in Versus';
      return null;
    }
    if (name === 'startFreeplay' && pid !== 0) return 'Only the host can start Freeplay';
    const a0 = args[0];
    const ownTower = (t: unknown) => !(t instanceof Tower) || t.owner === pid;
    if (['sellTower', 'cycleTargeting', 'tw.upgrade', 'tw.useAbility'].includes(name) && !ownTower(a0)) return `That's P${(a0 as Tower).owner + 1}'s tower — only its owner can upgrade or sell it`;
    if (name === 'setTargeting' && a0 instanceof Tower && !ownTower(a0)) return `That's P${a0.owner + 1}'s tower`;
    if (['demolish', 'setRally', 'bd.upgrade', 'bd.enqueue', 'bd.cancel'].includes(name) && a0 instanceof Building && !a0.isHQ && a0.owner !== pid) return `That's P${a0.owner + 1}'s building`;
    const canSq = (s: unknown) => !(s instanceof Squad) || s.owner === pid || !!this.allowAlly.get(s.owner);
    if (['moveSquad', 'patrolSquad', 'setStance', 'garrisonSquad', 'ungarrisonSquad', 'useAbility', 'setSquadAuto'].includes(name) && !canSq(a0)) return `P${(a0 as Squad).owner + 1} hasn't allowed ally control`;
    if (name === 'setTargeting' && !canSq(a0)) return 'Not your squad';
    if (name === 'moveGroup' && Array.isArray(a0) && !a0.some(canSq)) return 'Not your squads';
    void g;
    return null;
  }
  /** HOST: run an action as player `pid` with that player's wallet. */
  exec(pid: number, name: string, args: unknown[]): unknown {
    const g = this.g;
    const why = this.deny(pid, name, args);
    if (why) { this.toastTo(pid, why); return name === 'deploySquad' || name === 'buildOnPad' ? null : false; }
    if (name === 'moveGroup' && Array.isArray(args[0])) args[0] = (args[0] as unknown[]).filter((s) => !(s instanceof Squad) || s.owner === pid || this.allowAlly.get(s.owner));
    const swap = pid !== this.resPid && this.wallets.has(pid);
    const saved = swap ? this.walletOf(-1) : null;
    const hook = g.res.splitHook, toast = g.toast.bind(g);
    if (swap) this.loadWallet(this.wallets.get(pid)!);
    g.res.splitHook = null; g.actingPid = pid; this.inExec = true;
    if (pid !== this.localPid) g.toast = (text: string, color?: string) => this.toastTo(pid, text, color);
    let ret: unknown;
    try {
      if (name === 'waves.start') ret = (this.gOrig['waves.start'] as (g: Game) => boolean)(g);
      else if (ORIG[name]) { const [self, ...rest] = args; ret = ORIG[name].call(self, g, ...rest); }
      else if (name === 'vs.card') ret = this.versus?.playCard(g, args[0] as string, args[1] as number);
      else if (name === 'vs.spell') ret = this.versus?.castSpell(g, args[0] as string, args[1] as Vec, (args[2] as Tower) ?? null);
      else if (name === 'collect') { const p = args[0] as Pickup; if (p?.alive) p.collect(g, args[1] as number, args[2] as string); }
      else ret = this.gOrig[name](...args);
    } finally {
      this.inExec = false; g.actingPid = this.localPid; g.res.splitHook = hook; g.toast = toast;
      if (swap) { const w = this.wallets.get(pid)!; Object.assign(w, this.walletOf(w.acc)); this.loadWallet(saved!); }
    }
    if (typeof ret === 'string' && name.startsWith('vs.')) { this.toastTo(pid, ret); ret = false; }
    if (name === 'castPower' && ret) { const at = args[1] as Vec; this.event({ k: 'power', id: args[0], x: at.x, y: at.y, pid }); }
    return ret;
  }
  private walletOf(acc: number): Wallet { const g = this.g; return { res: g.res.dump(), energy: g.energy, powerCd: { ...g.powerCd }, deployCd: { ...g.deployCd }, acc }; }
  private loadWallet(w: Wallet) { const g = this.g; g.res.load(w.res, true); g.energy = w.energy; g.powerCd = { ...w.powerCd }; g.deployCd = { ...w.deployCd }; }
  /** Co-op income split: the earner (tower/troop owner) keeps 50%, the rest is shared evenly. */
  private split(amount: number, type: 'credits' | 'power' | 'scrap') {
    const g = this.g, pids = this.players.map((p) => p.pid), n = pids.length;
    const owner = g.actingPid !== this.localPid || this.inExec ? g.actingPid : (g as unknown as { curOwner: number }).curOwner;
    const shareOf = (pid: number) => (owner >= 0 && pids.includes(owner) ? (pid === owner ? 0.5 : 0) + 0.5 / n : 1 / n) * amount;
    for (const pid of pids) {
      if (pid === this.resPid) continue;
      const w = this.wallets.get(pid); if (!w) continue;
      if (type === 'credits') { w.acc += shareOf(pid); const whole = Math.floor(w.acc); w.acc -= whole; w.res.credits += whole; w.res.earned = (w.res.earned ?? 0) + whole; }
      else if (type === 'scrap') w.res.scrap += Math.round(shareOf(pid));
    }
    if (type !== 'credits') return Math.round(shareOf(this.resPid));
    this.hostAcc += shareOf(this.resPid); const whole = Math.floor(this.hostAcc); this.hostAcc -= whole; return whole;
  }
  toastTo(pid: number, text: string, color = '#ff8a7a') {
    if (pid === this.localPid) { this.g.bus.emit('toast', { text, color }); return; }
    this.net.send(pid, { t: 'ev', k: 'toast', text, color });
  }
  /** Ping / donate / ally-control / versus ops (same API on host and client). */
  op(op: string, data: Record<string, unknown>) {
    if (this.isHost) this.hostOp(this.localPid, op, data);
    else this.send({ t: 'op', op, ...data });
  }
  ping(kind: PingKind, at: Vec) { this.op('ping', { kind, x: Math.round(at.x), y: Math.round(at.y) }); }
  donate(to: number, amount: number) { this.op('donate', { to, amount }); }
  setAllow(on: boolean) { this.op('allow', { on }); }
  card(id: string, lane: number) { this.op('card', { id, lane }); }
  spell(id: string, at: Vec) { this.op('spell', { id, x: at.x, y: at.y }); }

  private hostOp(pid: number, op: string, d: Record<string, unknown>) {
    const g = this.g;
    if (op === 'ping') { const ev = { k: 'ping', kind: d.kind, x: d.x, y: d.y, pid }; this.event(ev); return; }
    if (op === 'allow') { this.allowAlly.set(pid, !!d.on); this.event({ k: 'allow', pid, on: !!d.on }); return; }
    if (op === 'donate') {
      if (!this.coop) return;
      const to = d.to as number, amt = Math.max(0, Math.floor(d.amount as number));
      if (to === pid || !this.players.some((p) => p.pid === to)) return;
      const have = this.creditsOf(pid), give = Math.min(have, amt);
      if (give <= 0) { this.toastTo(pid, 'Nothing to donate'); return; }
      this.addCredits(pid, -give); this.addCredits(to, give);
      this.event({ k: 'donate', from: pid, to, amount: give });
      return;
    }
    if (op === 'card') { this.exec(pid, 'vs.card', [d.id, d.lane]); return; }
    if (op === 'spell') {
      const at = { x: d.x as number, y: d.y as number };
      const tw = g.towers.filter((t) => t.alive).sort((a, b) => Math.hypot(a.x - at.x, a.y - at.y) - Math.hypot(b.x - at.x, b.y - at.y))[0] ?? null;
      this.exec(pid, 'vs.spell', [d.id, at, tw]); return;
    }
    if (op === 'collect') { const p = g.pickups.find((k) => k.uid === d.u); if (p) this.exec(pid, 'collect', [p, d.rate, d.by]); }
  }
  creditsOf(pid: number) { return pid === this.resPid ? this.g.res.credits : this.wallets.get(pid)?.res.credits ?? 0; }
  private addCredits(pid: number, n: number) {
    if (pid === this.resPid) { const w = this.g.res.dump(); w.credits += n; this.g.res.load(w, pid !== this.localPid); }
    else { const w = this.wallets.get(pid); if (w) w.res.credits += n; }
  }
  /** Broadcast an event and apply it locally. */
  event(ev: Record<string, unknown>) { if (this.isHost) this.net.broadcast({ t: 'ev', ...ev }); this.applyEvent(ev); }
  private applyEvent(ev: Record<string, unknown>) {
    const g = this.g;
    switch (ev.k) {
      case 'ping': g.addPing({ x: ev.x as number, y: ev.y as number, kind: ev.kind as PingKind, pid: ev.pid as number }); break;
      case 'combo': if (!this.isHost) g.fx({ kind: 'text', x: ev.x as number, y: (ev.y as number) - 30, text: 'COMBO! +20% AoE', color: '#ffd84a', dur: 1.2 }); break;
      case 'toast': g.bus.emit('toast', { text: ev.text as string, color: ev.color as string }); break;
      case 'tele': if (!this.isHost) { g.telegraphs.push({ x: ev.x as number, y: ev.y as number, lane: ev.lane as number, t: 0, dur: ev.dur as number, label: ev.label as string }); g.sfx('boss'); } break;
      case 'spell': if (!this.isHost) this.spellFx(ev); break;
      case 'power': if (!this.isHost) this.powerFx(ev); break;
      case 'allow': this.allowAlly.set(ev.pid as number, !!ev.on); break;
      case 'donate': g.toast(`P${(ev.from as number) + 1} donated ¢${ev.amount} to P${(ev.to as number) + 1}`, PCOLORS[ev.from as number]); break;
      case 'vsend': break;
    }
    this.onEvent(ev);
  }
  private spellFx(ev: Record<string, unknown>) {
    const g = this.g, x = ev.x as number, y = ev.y as number;
    if (ev.id === 'emp') { const tw = ev.tw != null ? (this.h2l.get(ev.tw as number) as Tower | undefined) : undefined; const p = tw ?? { x, y }; g.fx({ kind: 'emp', x: p.x, y: p.y, r: 60, dur: 0.6 }); g.fx({ kind: 'text', x: p.x, y: p.y - 50, text: 'JAMMED 5s', color: '#7fe8ff', dur: 1.2 }); g.sfx('emp'); }
    else { g.fx({ kind: 'ring', x, y, r: 170, color: ev.id === 'surge' ? '#ff9a2a' : '#c8c8c8', dur: 0.8 }); g.fx({ kind: 'text', x, y: y - 30, text: ev.id === 'surge' ? 'SPEED SURGE' : 'SMOKE SCREEN', color: '#ffb35a', dur: 1.2 }); }
  }
  /** Client: replay a MAC / heal cast locally for the visuals (damage is host-only). */
  private powerFx(ev: Record<string, unknown>) {
    const g = this.g, e = g.energy, cd = { ...g.powerCd };
    g.energy = 999; g.powerCd = {}; this.inExec = true;
    try { this.gOrig.castPower(ev.id, { x: ev.x, y: ev.y }); } finally { this.inExec = false; g.energy = e; g.powerCd = cd; }
  }

  // ------------------------------------------------------------------ messages
  private send(m: Msg) { this.net.send(0, m); }
  private hostMsg(pid: number, m: Msg) {
    if (m.t === 'cmd') { const args = this.deser(m.a as unknown[]); if (args) this.exec(pid, m.n as string, args); }
    else if (m.t === 'op') this.hostOp(pid, m.op as string, m);
    else if (m.t === 'digest') this.net.send(pid, { t: 'digest', d: this.digest() });
  }
  private clientMsg(m: Msg) {
    if (m.t === 's') this.apply(m);
    else if (m.t === 'ev') this.applyEvent(m);
    else if (m.t === 'digest') this.hostDigest = m.d as ReturnType<Sync['digest']>;
  }
  hostDigest: ReturnType<Sync['digest']> | null = null;
  requestDigest() { this.hostDigest = null; this.send({ t: 'digest' }); }

  // ------------------------------------------------------------------ refs
  private hid(o: object) { return this.isHost ? (o as { uid: number }).uid : this.l2h.get(o); }
  ser(v: unknown): unknown {
    const g = this.g;
    if (v === null || v === undefined || typeof v !== 'object') return v;
    if (Array.isArray(v)) return v.map((x) => this.ser(x));
    if (v instanceof Tower) return { $: 'tw', u: this.hid(v) };
    if (v instanceof Squad) return { $: 'sq', u: this.hid(v) };
    if (v instanceof Unit) return { $: 'un', u: this.hid(v) };
    if (v instanceof Building) return { $: 'bd', p: v.isHQ ? -1 : v.pad?.index ?? -2 };
    if (v instanceof BuildPad) return { $: 'pad', i: v.index };
    if (v instanceof EnvStructure) return { $: 'env', i: g.envs.indexOf(v) };
    if (v instanceof Shortcut) return { $: 'sc', i: g.shortcuts.indexOf(v) };
    if (v instanceof Obstacle) return { $: 'ob', x: v.x, y: v.y };
    if (v instanceof Pickup) return { $: 'pk', u: this.hid(v) };
    if (v instanceof Enemy) return { $: 'en', u: this.hid(v) };
    if (v === this.g) return { $: 'g' };
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) o[k] = this.ser(x);
    return o;
  }
  /** HOST: resolve refs; returns null if something referenced no longer exists. */
  deser(a: unknown[]): unknown[] | null {
    const g = this.g; let bad = false;
    const r = (v: unknown): unknown => {
      if (v === null || typeof v !== 'object') return v;
      if (Array.isArray(v)) return v.map(r);
      const ref = v as Ref;
      if (ref.$) {
        let o: unknown;
        switch (ref.$) {
          case 'tw': o = g.towers.find((t) => t.uid === ref.u); break;
          case 'sq': o = g.squads.find((s) => s.uid === ref.u); break;
          case 'un': o = g.units.find((s) => s.uid === ref.u); break;
          case 'bd': o = ref.p === -1 ? g.hq : g.pads[ref.p!]?.building ?? undefined; break;
          case 'pad': o = g.pads[ref.i!]; break;
          case 'env': o = g.envs[ref.i!]; break;
          case 'sc': o = g.shortcuts[ref.i!]; break;
          case 'ob': o = g.obstacles.find((b) => Math.abs(b.x - ref.x!) < 1 && Math.abs(b.y - ref.y!) < 1); break;
          case 'pk': o = g.pickups.find((p) => p.uid === ref.u); break;
          case 'en': o = g.enemies.find((e) => e.uid === ref.u); break;
          case 'g': o = g; break;
        }
        if (o === undefined) bad = true;
        return o;
      }
      const out: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v)) out[k] = r(x);
      return out;
    };
    const res = a.map(r);
    return bad ? null : res;
  }

  // ------------------------------------------------------------------ host loop
  update(dt: number) {
    const g = this.g;
    if (!this.isHost) return;
    // HQ fell inside Game.step (which stops stepping once lost): settle the versus result here.
    if (this.versus && g.state === 'lost' && this.versus.s.phase !== 'done') this.versus.finish(g, 'invader');
    // other wallets regenerate energy + tick cooldowns like the local one
    const scaled = dt * g.speed;
    if (g.state === 'playing' && !g.paused) for (const w of this.wallets.values()) {
      w.energy = Math.min(100, w.energy + g.energyRegen * scaled);
      for (const k of Object.keys(w.powerCd)) w.powerCd[k] = Math.max(0, w.powerCd[k] - scaled);
      for (const k of Object.keys(w.deployCd)) w.deployCd[k] = Math.max(0, w.deployCd[k] - scaled);
    }
    // co-op wave timer: auto-send the next wave
    if (this.coop && this.settings.waveTimer > 0 && g.state === 'playing') {
      if (g.waves.active) this.waveCountdown = this.settings.waveTimer;
      else { this.waveCountdown -= scaled; if (this.waveCountdown <= 0) { this.waveCountdown = this.settings.waveTimer; this.exec(this.localPid, 'waves.start', [g]); } }
    }
    this.snapT -= dt;
    if (this.snapT <= 0 && this.net.conns.size) { this.snapT = 1 / SNAP_HZ; this.broadcastSnap(); }
  }
  private r1 = (n: number) => Math.round(n * 10) / 10;
  private broadcastSnap() {
    const g = this.g, r1 = this.r1;
    const en = (e: Enemy) => [e.uid, e.data.id, e.lane, r1(e.progress), r1(e.lateral), r1(e.hp), Math.round(e.maxHp), r1(e.shield), (e.ally ? 1 : 0) | (e.atBase ? 2 : 0) | (e.shieldDown ? 4 : 0), r1(e.stunT), r1(e.slowT), r1(e.smokeT), r1(e.surgeT), e.bossPhase, r1(e.allyPower), Math.round(e.x), Math.round(e.y)];
    const garCode = (u: Unit) => { const ga = u.garrison; if (!ga) return 0; if (ga instanceof Tower) return 't' + ga.uid; const i = g.envs.indexOf(ga as EnvStructure); return i >= 0 ? 'e' + i : 0; };
    const base = {
      t: 's', tm: r1(g.time), st: g.state, sp: g.speed, pa: g.paused ? 1 : 0,
      w: [g.waves.index, g.waves.active ? 1 : 0, g.waves.freeplay ? 1 : 0, Math.ceil(this.waveCountdown)],
      hq: [r1(g.hq.health.hp), Math.round(g.hq.health.max)],
      all: this.players.map((p) => [p.pid, Math.floor(this.creditsOf(p.pid))]),
      E: [...g.enemies.filter((e) => e.alive).map(en), ...g.allies.filter((e) => e.alive).map(en)],
      T: g.towers.filter((t) => t.alive).map((t) => [t.uid, t.data.id, t.cell.c, t.cell.r, t.tier, t.owner, t.targeting, r1(t.health.hp), r1(t.disabledT), r1(t.abilityCd), t.sweep ? 1 : 0, t.farm?.crates ?? 0]),
      S: g.squads.filter((s) => s.alive).map((s) => [s.uid, s.data.id, s.owner, s.stance, s.targeting, Math.round(s.rally.x), Math.round(s.rally.y), s.units.filter((u) => u.alive).map((u) => [u.uid, u.index, Math.round(u.x), Math.round(u.y), r1(u.health.hp), u.stars, garCode(u), u.dropT > 0 ? 1 : 0]), (s.auto ? 1 : 0) | (s.manual ? 2 : 0), s.autoTask]),
      B: g.buildings.filter((b) => b.alive).map((b) => [b.isHQ ? -1 : b.pad!.index, b.data.id, b.tier, r1(b.health.hp), b.build ? [r1(b.build.t), b.build.dur, b.build.to] : 0, b.queue.map((q) => [q.unitId, r1(q.t), q.dur, q.held]), Math.round(b.rally.x), Math.round(b.rally.y), b.owner]),
      X: g.barriers.filter((b) => b.alive).map((b) => [b.uid, b.data.id, Math.round(b.x), Math.round(b.y), b.lane, r1(b.hp), b.owner]),
      P: g.pickups.filter((p) => p.alive).map((p) => [p.uid, Math.round(p.x), Math.round(p.y), p.value, p.kind]),
      O: g.obstacles.map((o) => (o.alive ? r1(o.hp) : -1)),
      U: (g as unknown as { unitTiers: Record<string, number> }).unitTiers,
      A: [...g.armory],
      AA: g.autoArmy,
      V: this.versus ? this.versus.s : null,
      AL: [...this.allowAlly].filter(([, v]) => v).map(([k]) => k),
    };
    for (const pid of this.net.conns.keys()) {
      const w = pid === this.resPid ? this.walletOf(0) : this.wallets.get(pid);
      if (!w) continue;
      this.net.send(pid, { ...base, wl: { res: w.res, en: r1(w.energy), pcd: w.powerCd, dcd: w.deployCd } });
    }
  }

  // ------------------------------------------------------------------ client reconcile
  private map<T extends object>(hostUid: number, o: T) { this.h2l.set(hostUid, o); this.l2h.set(o, hostUid); return o; }
  apply(s: Msg) {
    const g = this.g;
    this.last = s; this.snaps++;
    g.syncing = true;
    try {
      g.speed = s.sp as number; g.paused = !!s.pa; // host pause freezes every mirror
      const [wi, wa, wf, cd] = s.w as number[];
      g.waves.index = wi; g.waves.active = !!wa; g.waves.freeplay = !!wf; this.waveCountdown = cd;
      const [hp, hmax] = s.hq as number[];
      if (g.hq.health.max !== hmax) g.hq.health.setBase(hmax, g.hq.health.armor);
      g.hq.health.hp = hp;
      const wl = s.wl as { res: Wallet['res']; en: number; pcd: Record<string, number>; dcd: Record<string, number> };
      g.res.frozen = false; g.res.load(wl.res); g.res.frozen = true;
      g.energy = wl.en; g.powerCd = wl.pcd; g.deployCd = wl.dcd;
      this.allCredits = [];
      for (const [pid, c] of s.all as number[][]) this.allCredits[pid] = c;
      (g as unknown as { unitTiers: Record<string, number> }).unitTiers = s.U as Record<string, number>;
      g.armory.clear(); for (const a of s.A as string[]) g.armory.add(a as never);
      if (Array.isArray(s.AA)) g.autoArmy = (s.AA as boolean[]).map(Boolean);
      this.allowAlly.clear(); for (const p of s.AL as number[]) this.allowAlly.set(p, true);
      if (s.V) this.vs = s.V as Versus['s'];
      this.syncEnemies(s.E as unknown[][]);
      this.syncTowers(s.T as unknown[][]);
      this.syncSquads(s.S as unknown[][]);
      this.syncBuildings(s.B as unknown[][]);
      this.syncBarriers(s.X as unknown[][]);
      this.syncPickups(s.P as unknown[][]);
      this.syncObstacles(s.O as number[]);
      const st = s.st as Game['state'];
      if (st !== g.state) { const was = g.state; g.state = st; if (st !== 'playing') g.bus.emit('gameover', { won: st === 'won' }); else if (was === 'won') g.waves.freeplay = true; }
    } finally { g.syncing = false; }
  }
  /** Client copy of the versus state (TE, timer, cooldowns). */
  vs: Versus['s'] | null = null;
  private syncEnemies(E: unknown[][]) {
    const g = this.g, seen = new Set<number>();
    for (const row of E) {
      const [uid, id, lane, prog, lat, hp, maxHp, sh, fl, stun, slow, smoke, surge, phase, ap, hx, hy] = row as [number, string, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
      seen.add(uid);
      let e = this.h2l.get(uid) as Enemy | undefined;
      if (!e || !e.alive) {
        e = g.spawnEnemy(id, prog, lat, lane, 1);
        this.map(uid, e);
      }
      const ally = !!(fl & 1);
      if (ally && !e.ally) { e.ally = true; g.allies.push(e); g.fx({ kind: 'ring', x: e.x, y: e.y, r: 34, color: '#d86bff', dur: 0.6 }); }
      e.maxHp = maxHp; e.hp = hp; e.shield = sh; e.atBase = !!(fl & 2); e.shieldDown = !!(fl & 4);
      e.stunT = stun; if (slow > 0) e.slowT = Math.max(e.slowT, slow);
      e.smokeT = smoke; e.surgeT = surge; e.targetable = smoke <= 0; e.bossPhase = phase; e.allyPower = ap;
      const dp = prog - e.progress;
      if (Math.abs(dp) > 80 || Math.abs(dp) < 0.05 || ally) e.progress = prog; else e.progress += dp * 0.3;
      e.lateral = lat;
      if (ally) { e.x += (hx - e.x) * 0.5; e.y += (hy - e.y) * 0.5; }
    }
    for (const list of [g.enemies, g.allies]) for (const e of list) {
      const u = this.l2h.get(e);
      if (e.alive && (u === undefined || !seen.has(u))) { e.alive = false; g.fx({ kind: 'pop', x: e.x, y: e.y, r: e.data.radius, color: e.data.color, dur: 0.3 } as never); if (u !== undefined) this.h2l.delete(u); }
    }
    g.enemies = g.enemies.filter((e) => e.alive && !e.ally);
    g.allies = g.allies.filter((e) => e.alive);
  }
  private syncTowers(T: unknown[][]) {
    const g = this.g, seen = new Set<number>();
    for (const row of T) {
      const [uid, id, c, r, tier, owner, targeting, hp, dis, acd, sweep, crates] = row as [number, string, number, number, number, number, Tower['targeting'], number, number, number, number, number];
      seen.add(uid);
      let t = this.h2l.get(uid) as Tower | undefined;
      if (!t) {
        const occ = g.grid.occupant(c, r); if (occ && !this.l2h.has(occ)) { g.grid.release(c, r); }
        t = new Tower(towerById(id), { c, r }, g);
        g.grid.occupy(t, c, r); g.towers.push(t); this.map(uid, t);
        g.fx({ kind: 'dust', x: t.x, y: t.y + 16, r: 26, color: '#e8d8b0', dur: 0.4 });
      }
      if (t.cell.c !== c || t.cell.r !== r) { // moved by Organize Farms
        g.grid.release(t.cell.c, t.cell.r); const fx = t.x, fy = t.y; t.cell = { c, r };
        const q = g.grid.cellCenter(c, r); t.x = q.x; t.y = q.y; g.grid.occupy(t, c, r);
        t.slide = { fx, fy, tx: q.x, ty: q.y, t: 0, dur: 0.6 };
      }
      if (t.tier > tier && t.data.tiers[tier]) { // client got ahead (rejected optimistic upgrade / corruption): host wins
        t.tier = tier; t.invested = t.data.tiers.slice(0, tier + 1).reduce((a2, n) => a2 + n.cost, 0); t.health.setBase(t.data.tiers[tier].maxHp, 0);
        (t as unknown as { attachModules(): void }).attachModules(); t.cover?.aura.refresh(); t.flora?.aura.refresh();
      }
      while (t.tier < tier) { // replay the tier-up locally (no spend)
        const n = t.data.tiers[t.tier + 1]; t.tier++; t.invested += n.cost; t.health.setBase(n.maxHp, 0);
        (t as unknown as { attachModules(): void }).attachModules(); t.cover?.aura.refresh(); t.flora?.aura.refresh();
        g.fx({ kind: 'ring', x: t.x, y: t.y, r: 40, color: n.visual.glow ?? '#fff', dur: 0.6 });
        g.fx({ kind: 'text', x: t.x, y: t.y - 40, text: n.name + '!', color: '#ffe27a', dur: 1 }); g.sfx('upgrade');
      }
      t.owner = owner; t.targeting = targeting; t.health.hp = hp; t.disabledT = dis;
      if (sweep && !t.sweep) { this.inExec = true; try { t.abilityCd = 0; ORIG['tw.useAbility'].call(t, g); } finally { this.inExec = false; } }
      t.abilityCd = acd;
      if (t.farm) t.farm.crates = crates;
    }
    for (const t of [...g.towers]) { const u = this.l2h.get(t); if (u === undefined || !seen.has(u)) { g.grid.release(t.cell.c, t.cell.r); t.remove(); if (u !== undefined) this.h2l.delete(u); } }
    g.towers = g.towers.filter((t) => t.alive);
  }
  private syncSquads(S: unknown[][]) {
    const g = this.g, seen = new Set<number>();
    for (const row of S) {
      const [uid, id, owner, stance, targeting, rx, ry, units, af, atask] = row as [number, string, number, Squad['stance'], Squad['targeting'], number, number, unknown[][], number, string];
      seen.add(uid);
      let sq = this.h2l.get(uid) as Squad | undefined;
      const d = unitById(id);
      if (!sq) {
        sq = g.spawnSquad(d, { x: rx, y: ry }, false); this.map(uid, sq);
        sq.units.length = 0; g.units = g.units.filter((u) => u.squad !== sq);
      }
      sq.owner = owner; sq.targeting = targeting;
      sq.auto = !!(af & 1); sq.manual = !!(af & 2); sq.autoTask = atask ?? '';
      if (sq.stance !== stance) sq.stance = stance;
      const moved = Math.hypot(sq.rally.x - rx, sq.rally.y - ry) > 4;
      if (moved && (sq.owner !== this.localPid || (sq.auto && !sq.manual))) { sq.rally = { x: rx, y: ry }; sq.waypoints = []; }
      const useen = new Set<number>();
      for (const ur of units) {
        const [uuid, index, x, y, hp, stars, gar, drop] = ur as [number, number, number, number, number, number, string | 0, number];
        useen.add(uuid);
        let u = this.h2l.get(uuid) as Unit | undefined;
        if (!u) {
          const U = d.role === 'worker' ? WorkerUnit : Unit;
          u = new U(d, sq, index, g, { x, y }); u.x = x; u.y = y; u.dropT = drop ? 0.4 : 0;
          sq.units.push(u); g.units.push(u); this.map(uuid, u);
        }
        const far = Math.hypot(u.x - x, u.y - y);
        if (far > 60 || far < 0.3) { u.x = x; u.y = y; } else { u.x += (x - u.x) * 0.35; u.y += (y - u.y) * 0.35; }
        u.health.hp = hp; u.stars = stars;
        const tgt: Garrisonable | null = !gar ? null : gar[0] === 't' ? (this.h2l.get(+gar.slice(1)) as Tower | undefined) ?? null : g.envs[+gar.slice(1)] ?? null;
        if (u.garrison !== tgt) { if (u.garrison) gLeave(u.garrison, u); if (tgt) gEnter(tgt, u); }
      }
      for (const u of sq.units) { const h = this.l2h.get(u); if (h === undefined || !useen.has(h)) { u.alive = false; if (u.garrison) gLeave(u.garrison, u); if (h !== undefined) this.h2l.delete(h); } }
      sq.units = sq.units.filter((u) => u.alive);
    }
    for (const sq of g.squads) { const u = this.l2h.get(sq); if (u === undefined || !seen.has(u)) { for (const x of sq.units) { x.alive = false; if (x.garrison) gLeave(x.garrison, x); } sq.units = []; } }
    g.units = g.units.filter((u) => u.alive);
    g.squads = g.squads.filter((s) => s.units.length);
  }
  private syncBuildings(B: unknown[][]) {
    const g = this.g, seen = new Set<Building>();
    for (const row of B) {
      const [pad, id, tier, hp, build, queue, rx, ry, owner] = row as [number, string, number, number, number[] | 0, [string, number, number, string | null][], number, number, number];
      let b: Building | undefined | null = pad === -1 ? g.hq : g.pads[pad]?.building;
      if (!b || b.data.id !== id) {
        const pd = g.pads[pad]; if (!pd) continue;
        if (b) { b.alive = false; g.buildings = g.buildings.filter((x) => x !== b); }
        b = new Building(buildingById(id as 'supply'), pd.x, pd.y, pd, { x: rx, y: ry });
        pd.building = b; g.buildings.push(b);
        g.fx({ kind: 'dust', x: pd.x, y: pd.y + 20, r: 40, color: '#e8d8b0', dur: 0.6 });
      }
      seen.add(b);
      if (b.tier !== tier) { const first = b.tier < 0; b.tier = tier; if (tier >= 0) { b.health.setBase(b.t.stats.maxHp, 0); if (first) b.health.hp = b.health.max; } }
      b.health.hp = hp; b.owner = owner; b.rally = { x: rx, y: ry };
      b.build = build ? { t: build[0], dur: build[1], to: build[2] } : null;
      b.queue = queue.map(([unitId, t, dur, held]) => ({ unitId, t, dur, held }));
    }
    for (const b of [...g.buildings]) if (!seen.has(b)) { b.alive = false; if (b.pad) b.pad.building = null; g.fx({ kind: 'boom_fire', x: b.x, y: b.y, r: 70, dur: 0.6 }); }
    g.buildings = g.buildings.filter((b) => b.alive || b.isHQ);
  }
  private syncBarriers(X: unknown[][]) {
    const g = this.g, seen = new Set<number>();
    for (const [uid, id, x, y, lane, hp, owner] of X as [number, string, number, number, number, number, number][]) {
      seen.add(uid);
      let b = this.h2l.get(uid) as Barrier | undefined;
      if (!b) { b = new Barrier(towerById(id), x, y, lane); g.barriers.push(b); this.map(uid, b); }
      b.hp = hp; b.owner = owner;
    }
    for (const b of g.barriers) { const u = this.l2h.get(b); if (u === undefined || !seen.has(u)) { b.alive = false; g.fx({ kind: 'boom', x: b.x, y: b.y, r: 30, dur: 0.35 }); } }
    g.barriers = g.barriers.filter((b) => b.alive);
  }
  private syncPickups(P: unknown[][]) {
    const g = this.g, seen = new Set<number>();
    for (const [uid, x, y, value, kind] of P as [number, number, number, number, PickupKind][]) {
      seen.add(uid);
      let p = this.h2l.get(uid) as Pickup | undefined;
      if (!p) { p = g.spawnPickup(x, y, value, kind); this.map(uid, p); }
      if (p.alive) { p.x += (x - p.x) * 0.5; p.y += (y - p.y) * 0.5; }
    }
    for (const p of g.pickups) { const u = this.l2h.get(p); if (u === undefined || !seen.has(u)) p.alive = false; }
    g.pickups = g.pickups.filter((p) => p.alive);
  }
  private syncObstacles(O: number[]) {
    const g = this.g;
    O.forEach((hp, i) => { const o = g.obstacles[i]; if (!o) return; if (hp < 0 && o.alive) g.clearObstacle(o); else if (hp >= 0) o.hp = hp; });
  }

  // ------------------------------------------------------------------ desync check
  /** Compact state digest; the test compares host vs client. */
  digest() {
    const g = this.g;
    return {
      towers: g.towers.filter((t) => t.alive).map((t) => `${t.data.id}@${t.cell.c},${t.cell.r}:${t.tier}:${t.owner}`).sort(),
      buildings: g.buildings.filter((b) => b.alive).map((b) => `${b.data.id}:${b.tier}:${b.owner}`).sort(),
      squads: g.squads.filter((s) => s.alive).map((s) => `${s.data.id}:${s.owner}:${s.units.length}`).sort(),
      enemies: g.enemies.filter((e) => e.alive).length,
      hq: Math.round(g.hq.health.hp), wave: g.waves.index, state: g.state,
    };
  }
}
