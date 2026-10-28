// =============================================================================
// 1v1 ASYMMETRIC VERSUS (host-authoritative). The DEFENDER plays the normal kit
// and earns credits from kills; the INVADER spends regenerating Threat Energy
// on enemy cards per lane, eco cards that raise regen, and three spells.
// Major / boss cards are TELEGRAPHED (red marker) 2 s before they spawn.
// Win: defender survives the match timer + the final Boss Push; invader wins
// the moment the HQ hits 0.
// =============================================================================
import type { Game } from '../game/Game';
import type { Tower } from '../entities/Tower';
import { dist } from '../core/math';

export interface Card { id: string; name: string; icon: string; cost: number; desc: string; spawn?: [string, number][]; gap?: number; major?: boolean; eco?: number }
/** Costs balanced against the defender economy: a card's bounty is ~45-70% of its TE cost in credits,
 *  and TE regen (1.6/s base, +0.4 per eco card) buys roughly one mid card every ~15 s. */
export const CARDS: Card[] = [
  { id: 'runners', name: 'Fast Runners', icon: '💨', cost: 12, desc: '6 Pink bloons — very fast', spawn: [['pink', 6]], gap: 0.3 },
  { id: 'armored', name: 'Armored Bloons', icon: '🛡', cost: 24, desc: '2 Lead + 2 Ceramic (lead ignores sharp)', spawn: [['lead', 2], ['ceramic', 2]], gap: 0.7 },
  { id: 'shielded', name: 'Shielded Troopers', icon: '🔷', cost: 28, desc: '3 Shield Wardens + Hunters', spawn: [['warden', 3], ['hunter', 3]], gap: 0.6 },
  { id: 'siege', name: 'Siege Walkers', icon: '🦏', cost: 42, desc: '2 Ironbacks + 2 Chargers (MAJOR: telegraphed)', spawn: [['ironback', 2], ['charger', 2]], gap: 1.1, major: true },
  { id: 'boss', name: 'Boss', icon: '💀', cost: 95, desc: 'Bile Titan + M.O.A.B. (BOSS: telegraphed)', spawn: [['bile_titan', 1], ['moab', 1]], gap: 2.5, major: true },
  { id: 'eco', name: 'Hive Supply', icon: '🧬', cost: 30, desc: '+0.4 Threat Energy / s (max 5)', eco: 0.4 },
];
export interface Spell { id: 'emp' | 'surge' | 'smoke'; name: string; icon: string; cd: number; desc: string; radius?: number }
export const SPELLS: Spell[] = [
  { id: 'emp', name: 'EMP Jammer', icon: '⚡', cd: 25, desc: 'Disable one tower for 5 s' },
  { id: 'surge', name: 'Speed Surge', icon: '⏩', cd: 30, desc: '+30% enemy speed in an area for 4 s', radius: 170 },
  { id: 'smoke', name: 'Smoke Screen', icon: '🌫', cd: 40, desc: 'Enemies in an area are untargetable for 3 s', radius: 170 },
];
export const TE_MAX = 100, TE_BASE = 1.6, ECO_MAX = 5, TELEGRAPH_S = 2;

export interface VersusState { te: number; regen: number; eco: number; timer: number; total: number; phase: 'battle' | 'push' | 'done'; cd: Record<string, number>; inv: number; def: number; winner: 'defender' | 'invader' | null; played: number }

export class Versus {
  s: VersusState;
  private q: { t: number; id: string; lane: number; major: boolean }[] = [];
  private pushUids = new Set<number>();
  private pushT = -1;
  /** Event sink (host broadcasts to clients). */
  emit: (ev: Record<string, unknown>) => void = () => {};
  constructor(matchSeconds: number, inv: number, def: number) {
    this.s = { te: 30, regen: TE_BASE, eco: 0, timer: matchSeconds, total: matchSeconds, phase: 'battle', cd: { emp: 0, surge: 0, smoke: 0 }, inv, def, winner: null, played: 0 };
  }
  /** Card HP grows over the match so late cards stay relevant vs upgraded towers. */
  hpMul() { const el = this.s.total - Math.max(0, this.s.timer); return 1 + el / 150; }
  lanePoint(g: Game, lane: number) { const p = g.paths[Math.min(lane, g.paths.length - 1)].at(40); return { x: p.x, y: p.y }; }

  playCard(g: Game, id: string, lane: number): string | null {
    const c = CARDS.find((x) => x.id === id); if (!c) return 'Unknown card';
    if (this.s.phase === 'done') return 'Match over';
    if (this.s.te < c.cost) return `Need ${c.cost} Threat Energy`;
    if (c.eco && this.s.eco >= ECO_MAX) return 'Hive Supply maxed';
    this.s.te -= c.cost; this.s.played++;
    if (c.eco) { this.s.eco++; this.s.regen = TE_BASE + this.s.eco * c.eco; g.toast(`Invader grew the hive: +${c.eco} TE/s`, '#d86bff'); return null; }
    lane = Math.max(0, Math.min(g.paths.length - 1, lane));
    const delay = c.major ? TELEGRAPH_S : 0;
    if (c.major) this.telegraph(g, lane, c.name);
    let t = delay;
    for (const [eid, n] of c.spawn ?? []) for (let i = 0; i < n; i++) { this.q.push({ t, id: eid, lane, major: !!c.major }); t += c.gap ?? 0.5; }
    this.q.sort((a, b) => a.t - b.t);
    return null;
  }
  telegraph(g: Game, lane: number, label: string) {
    const p = this.lanePoint(g, lane);
    g.telegraphs.push({ x: p.x, y: p.y, lane, t: 0, dur: TELEGRAPH_S, label });
    this.emit({ k: 'tele', x: p.x, y: p.y, lane, dur: TELEGRAPH_S, label });
    g.sfx('boss');
  }
  castSpell(g: Game, id: string, at: { x: number; y: number }, tower: Tower | null): string | null {
    const sp = SPELLS.find((x) => x.id === id); if (!sp) return 'Unknown spell';
    if ((this.s.cd[id] ?? 0) > 0) return `${sp.name} recharging (${Math.ceil(this.s.cd[id])}s)`;
    if (id === 'emp') {
      const tw = tower && tower.alive ? tower : g.towers.filter((t) => t.alive).sort((a, b) => dist(a, at) - dist(b, at))[0];
      if (!tw || dist(tw, at) > 140) return 'Target a tower';
      tw.disabledT = Math.max(tw.disabledT, 5);
      g.fx({ kind: 'emp', x: tw.x, y: tw.y, r: 60, dur: 0.6 }); g.fx({ kind: 'text', x: tw.x, y: tw.y - 50, text: 'JAMMED 5s', color: '#7fe8ff', dur: 1.2 });
      g.sfx('emp');
    } else {
      const r = sp.radius ?? 160;
      let n = 0;
      for (const e of g.enemies) if (e.alive && dist(e, at) <= r) { n++; if (id === 'surge') e.surgeT = 4; else { e.smokeT = 3; e.targetable = false; } }
      g.fx({ kind: 'ring', x: at.x, y: at.y, r, color: id === 'surge' ? '#ff9a2a' : '#c8c8c8', dur: 0.8 });
      g.fx({ kind: 'text', x: at.x, y: at.y - 30, text: id === 'surge' ? `SPEED SURGE ×${n}` : `SMOKE SCREEN ×${n}`, color: id === 'surge' ? '#ffb35a' : '#e0e0e0', dur: 1.2 });
      g.sfx('ability');
    }
    this.s.cd[id] = sp.cd;
    this.emit({ k: 'spell', id, x: at.x, y: at.y, tw: tower?.uid ?? null });
    return null;
  }
  update(g: Game, dt: number) {
    if (g.isClient || this.s.phase === 'done') return;
    const s = this.s;
    s.te = Math.min(TE_MAX, s.te + s.regen * dt);
    for (const k of Object.keys(s.cd)) s.cd[k] = Math.max(0, s.cd[k] - dt);
    for (const q of this.q) q.t -= dt;
    while (this.q.length && this.q[0].t <= 0) {
      const q = this.q.shift()!;
      const e = g.spawnEnemy(q.id, 0, 0, q.lane, this.hpMul());
      if (this.pushT >= 0) this.pushUids.add(e.uid);
    }
    if (s.phase === 'battle') {
      s.timer -= dt;
      if (s.timer <= 0) { // final Boss Push on every lane (telegraphed)
        s.phase = 'push'; s.timer = 0; this.pushT = 0;
        g.toast('⚠ FINAL BOSS PUSH — survive it to win!', '#ff6b6b');
        for (let l = 0; l < g.paths.length; l++) {
          this.telegraph(g, l, 'BOSS PUSH');
          this.q.push({ t: TELEGRAPH_S, id: 'boss_scarab', lane: l, major: true });
          for (let i = 0; i < 4; i++) this.q.push({ t: TELEGRAPH_S + 1 + i * 0.6, id: 'charger', lane: l, major: true });
        }
        this.q.sort((a, b) => a.t - b.t);
      }
    } else if (s.phase === 'push') {
      this.pushT += dt;
      const left = g.enemies.some((e) => e.alive && this.pushUids.has(e.uid)) || this.q.length > 0;
      if (!left && this.pushT > TELEGRAPH_S + 4 && g.hq.health.hp > 0) this.finish(g, 'defender');
    }
    if (g.hq.health.hp <= 0 || g.state === 'lost') this.finish(g, 'invader');
  }
  finish(g: Game, w: 'defender' | 'invader') {
    if (this.s.phase === 'done') return;
    this.s.phase = 'done'; this.s.winner = w;
    if (w === 'defender') g.win(); else if (g.state === 'playing') { g.state = 'lost'; g.bus.emit('gameover', { won: false }); }
    this.emit({ k: 'vsend', winner: w });
  }
}
