// =============================================================================
// t78 OVERRUN screens: class select (before spawn), monster picker (after you fall),
// match HUD (timer / survivors / monsters / points), the tactical tower shop and
// the end screen. Lives in #ov-ui above the first-person view (z 40).
// =============================================================================
import type { Game } from '../game/Game';
import type { ViewState } from '../render/Renderer';
import type { Overrun, OvPlayer } from './Overrun';
import { OV_UNITS, OV_MONSTERS, OV_SHOP, OV_MAX_TOWERS, OV_POINTS, OV_TURNED_POINTS, ovUnit, ovMonster } from './data';
import { towerById } from '../data/towers';
import { assetUrl } from '../assetUrl';
import { PCOLORS } from '../core/players';
import type { Unit } from '../entities/Unit';
import type { Enemy } from '../entities/Enemy';
import './overrun.css';

export interface OvUIHost {
  g: Game; ov: Overrun; view: ViewState; mp: boolean;
  /** run an Overrun action as the local player (solo/host: direct; client: via the host). */
  act(a: string, d: Record<string, unknown>): string;
  /** enter first person on the local survivor / monster. */
  enterFP(o: Unit | Enemy): void;
  /** is the first-person view open? */
  inFP(): boolean;
  /** centre the 2D camera on a point. */
  focus(x: number, y: number): void;
  menu(): void;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const mmss = (t: number) => { const s = Math.max(0, Math.ceil(t)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const pname = (p: OvPlayer) => (p.bot ? `${ovUnit(p.cls).name} (AI)` : `P${p.pid + 1}`);

export class OverrunUI {
  readonly root: HTMLElement;
  private el: Record<string, HTMLElement> = {};
  private fpFor = -1; private fpKind = '';
  /** the player chose the tactical map: don't throw them back into first person. */
  tactical = false;
  private lastHp = -1; private hurt = 0;
  private screen = '';
  private picked = '';
  private timer = 0;
  constructor(readonly h: OvUIHost) {
    document.body.classList.add('ov-mode');
    this.root = document.createElement('div'); this.root.id = 'ov-ui';
    this.root.innerHTML = `
      <div class="ov-hud" id="ov-hud">
        <span class="ov-chip ov-time" title="Survive until the timer runs out">⏱ <b id="ov-time">0:00</b></span>
        <span class="ov-chip" title="Survivors still standing">🧍 <b id="ov-surv">0</b></span>
        <span class="ov-chip" title="Monsters on the island">🪲 <b id="ov-mon">0</b></span>
        <span class="ov-chip ov-pts" title="Points: earned by kills, spent on towers">★ <b id="ov-pts">0</b> pts</span>
        <span class="ov-chip" title="Your kills">☠ <b id="ov-kills">0</b></span>
        <span class="ov-chip ov-role" id="ov-role"></span>
      </div>
      <div class="ov-feed" id="ov-feed"></div>
      <div class="ov-vig" id="ov-vig"></div>
      <div class="ov-shop" id="ov-shop" hidden></div>
      <button class="ov-fp btn big go" id="ov-fp" hidden>🎯 Back to first person (E)</button>
      <div class="ov-screen" id="ov-screen" hidden></div>`;
    document.body.appendChild(this.root);
    for (const id of ['ov-hud', 'ov-time', 'ov-surv', 'ov-mon', 'ov-pts', 'ov-kills', 'ov-role', 'ov-feed', 'ov-vig', 'ov-shop', 'ov-fp', 'ov-screen']) this.el[id] = this.root.querySelector('#' + id)!;
    this.el['ov-fp'].onclick = () => this.backToFP();
    h.ov.onFeed = (t) => this.feed(t);
    addEventListener('keydown', (e) => {
      if (this.h.inFP() || (e.target as HTMLElement)?.tagName === 'INPUT') return;
      const k = e.key.toLowerCase();
      if ((k === 'e' || k === 'tab') && !this.el['ov-fp'].hidden) { e.preventDefault(); e.stopImmediatePropagation(); this.backToFP(); }
    }, true);
    this.timer = window.setInterval(() => this.tick(), 120);
    this.tick();
  }
  get me() { return this.h.ov.me; }
  /** FP view closed: the player is on the tactical map until they press E / the button. */
  onExitFP() { this.tactical = true; this.tick(); }
  backToFP() {
    const p = this.me; this.tactical = false;
    const o = p?.role === 'survivor' ? p.unit : p?.role === 'turned' ? p.enemy : null;
    this.h.view.placing = null;
    if (o?.alive) { this.fpFor = (o as { uid: number }).uid; this.h.enterFP(o); }
  }
  private feed(t: string) {
    const d = document.createElement('div'); d.textContent = t; this.el['ov-feed'].prepend(d);
    while (this.el['ov-feed'].children.length > 5) this.el['ov-feed'].lastElementChild!.remove();
    setTimeout(() => d.classList.add('old'), 5000); setTimeout(() => d.remove(), 7000);
  }

  tick() {
    const { g, ov } = this.h, p = this.me;
    if (!p) return;
    // HUD chips
    this.el['ov-time'].textContent = ov.phase === 'pick' ? mmss(ov.total) : mmss(ov.timeLeft);
    this.el['ov-surv'].textContent = String(ov.survivors().length);
    this.el['ov-mon'].textContent = String(g.enemies.filter((e) => e.alive && e.hunt && e.turnedBy < 0).length);
    this.el['ov-pts'].textContent = String(p.points);
    this.el['ov-kills'].textContent = String(p.kills);
    this.el['ov-role'].textContent = p.role === 'survivor' ? `🧍 ${ovUnit(p.cls).name}` : p.role === 'turned' ? `🪲 ${ovMonster(p.mon).name}` : p.role === 'turning' ? '🪲 Turning…' : p.role === 'out' ? '💀 Overrun' : '…';
    this.el['ov-role'].className = 'ov-chip ov-role ' + (p.role === 'turned' || p.role === 'turning' ? 'bug' : '');
    this.el['ov-hud'].hidden = ov.phase === 'pick';
    document.body.classList.toggle('ov-tactical', !this.h.inFP() && ov.phase === 'live');
    // hurt vignette (local survivor / monster)
    const body = p.role === 'survivor' ? p.unit : p.role === 'turned' ? p.enemy : null;
    const hp = body ? ((body as Unit).health ? (body as Unit).health.hp : (body as Enemy).hp) : -1;
    if (this.lastHp >= 0 && hp >= 0 && hp < this.lastHp - 0.5) this.hurt = 1;
    this.lastHp = hp; this.hurt = Math.max(0, this.hurt - 0.25);
    const frac = body ? hp / Math.max(1, (body as Unit).health ? (body as Unit).health.max : (body as Enemy).maxHp) : 1;
    this.el['ov-vig'].style.opacity = String(Math.min(1, this.hurt * 0.8 + (frac < 0.35 ? 0.35 : 0)));
    // screens
    const want = ov.phase === 'done' ? 'end' : ov.phase === 'pick' ? (p.cls ? 'wait' : 'pick') : p.role === 'turning' ? 'turn' : p.role === 'out' ? 'out' : '';
    if (want !== this.screen || want === 'pick' || want === 'wait' || want === 'turn') this.render(want);
    // auto first person: on spawn (survivor) and on each respawn (monster)
    if (ov.phase === 'live' && !this.h.inFP()) {
      const o = p.role === 'survivor' ? p.unit : p.role === 'turned' ? p.enemy : null, kind = p.role;
      if (o?.alive && ((o as { uid: number }).uid !== this.fpFor || kind !== this.fpKind) && !this.screen) { this.fpKind = kind; this.tactical = false; this.fpFor = (o as { uid: number }).uid; this.h.view.placing = null; this.h.enterFP(o); }
    }
    // tactical: shop (survivors) + back-to-FP button
    const tac = ov.phase === 'live' && !this.h.inFP() && !this.screen;
    this.el['ov-fp'].hidden = !tac || !(p.role === 'survivor' || p.role === 'turned');
    this.el['ov-shop'].hidden = !tac || p.role !== 'survivor';
    if (!this.el['ov-shop'].hidden) this.renderShop(p);
  }
  private shopSig = '';
  private renderShop(p: OvPlayer) {
    const sig = `${p.points}|${p.towers}|${this.h.view.placing ?? ''}`;
    if (sig === this.shopSig) return; this.shopSig = sig;
    const full = p.towers >= OV_MAX_TOWERS;
    this.el['ov-shop'].innerHTML = `<div class="ov-shop-h"><b>Tactical map</b> · ★ ${p.points} pts · towers ${p.towers}/${OV_MAX_TOWERS}</div>
      <div class="ov-shop-hint">${this.h.view.placing ? 'Click near your unit to place · right-click / Esc cancels' : 'Kills earn points. Spend them on towers near your unit (they guard you, bugs can chew them down).'}</div>
      <div class="ov-shop-row">${OV_SHOP.map((it) => {
        const ok = p.points >= it.cost && !full, on = this.h.view.placing === it.id;
        return `<button class="ov-buy${on ? ' on' : ''}" data-id="${it.id}" ${ok ? '' : 'disabled'} title="${esc(towerById(it.id).name)} — ${esc(it.label)}"><img src="${assetUrl(it.icon)}" alt=""><b>${esc(towerById(it.id).name)}</b><small>${esc(it.label)}</small><em>★ ${it.cost}</em></button>`;
      }).join('')}</div>`;
    this.el['ov-shop'].querySelectorAll<HTMLButtonElement>('.ov-buy').forEach((b) => b.onclick = () => {
      const id = b.dataset.id!; this.h.view.placing = this.h.view.placing === id ? null : id; this.shopSig = '';
      const u = this.me?.unit; if (u && this.h.view.placing) this.h.focus(u.x, u.y);
      this.tick();
    });
  }
  /** Map click while placing (tactical view). */
  place(x: number, y: number): boolean {
    const id = this.h.view.placing; if (!id) return false;
    const why = this.h.act('place', { id, x: Math.round(x), y: Math.round(y) });
    if (why) { this.h.g.toast(why, '#ff8a7a'); this.h.g.sfx('error'); }
    else { this.h.view.placing = null; this.h.g.toast(`${towerById(id).name} placed`, '#9ff7b0'); }
    this.shopSig = ''; return true;
  }

  private render(kind: string) {
    const { ov } = this.h, sc = this.el['ov-screen'], p = this.me!;
    this.screen = kind; sc.hidden = !kind; sc.className = 'ov-screen ' + kind;
    if (!kind) { sc.innerHTML = ''; return; }
    if (kind === 'pick' || kind === 'wait') {
      const others = ov.players.filter((q) => q !== p);
      const roster = others.length ? `<div class="ov-roster">${others.map((q) => `<span style="--pc:${PCOLORS[q.pid % PCOLORS.length]}"><i></i>${esc(pname(q))} · ${q.cls ? '✔ ' + esc(ovUnit(q.cls).name) : 'choosing…'}</span>`).join('')}</div>` : '';
      const sig = kind + '|' + roster + '|' + this.picked;
      if (sc.dataset.sig === sig) return; sc.dataset.sig = sig;
      sc.innerHTML = `<div class="ov-card"><h2>🪲 Overrun</h2>
        <p class="ov-sub">The hive is loose on ${esc(this.h.g.map.name)}. Pick your unit — the team spawns together in first person. Survive <b>${Math.round(ov.total / 60)} min</b>. Fall, and you rise as a monster.</p>
        <div class="ov-grid">${OV_UNITS.map((u) => `<button class="ov-pick${u.vehicle ? ' veh' : ''}${p.cls === u.id || this.picked === u.id ? ' on' : ''}" data-cls="${u.id}" ${kind === 'wait' ? 'disabled' : ''}>
          <img src="${assetUrl(u.portrait)}" alt=""><b>${esc(u.name)}</b><small>${u.vehicle ? '🚙 VEHICLE · ' : ''}${esc(u.role)} · ❤ ${u.hp}</small><p>${esc(u.blurb)}</p></button>`).join('')}</div>
        ${roster}${kind === 'wait' ? '<p class="ov-wait">Waiting for the squad to pick…</p>' : ''}
        <p class="ov-help">Kills earn ★ points (Scavenger ${OV_POINTS.scavenger} · Hunter ${OV_POINTS.hunter} · Charger ${OV_POINTS.charger} · turned player ${OV_TURNED_POINTS}). Press <b>E</b> for the tactical map to place towers.</p></div>`;
      sc.querySelectorAll<HTMLButtonElement>('.ov-pick').forEach((b) => b.onclick = () => {
        const why = this.h.act('pick', { id: b.dataset.cls }); if (why) { this.h.g.toast(why, '#ff8a7a'); return; }
        this.picked = b.dataset.cls!; this.tick();
      });
      return;
    }
    if (kind === 'turn') {
      const sig = `turn|${p.mon}|${Math.ceil(p.respawnT)}`;
      if (sc.dataset.sig === sig) return; sc.dataset.sig = sig;
      sc.innerHTML = `<div class="ov-card bug"><h2>☠ You were overrun</h2>
        <p class="ov-sub">The hive takes you. Choose what you rise as — hunt down the survivors. ${p.respawnT > 0 ? `Respawn in <b>${Math.ceil(p.respawnT)}</b>s` : p.mon ? 'Rising…' : '<b>Pick a monster</b>'}</p>
        <div class="ov-grid">${OV_MONSTERS.map((m) => `<button class="ov-pick bug${p.mon === m.id ? ' on' : ''}" data-mon="${m.id}">
          <img src="${assetUrl(m.portrait)}" alt=""><b>${esc(m.name)}</b><small>❤ ${m.hp} · bite ${m.bite} · ${esc(m.ability)}</small><p>${esc(m.blurb)}</p></button>`).join('')}</div>
        <p class="ov-help">Click / hold to bite · WASD prowl · Q or Space: ability. You can't place towers as a monster.</p></div>`;
      sc.querySelectorAll<HTMLButtonElement>('.ov-pick').forEach((b) => b.onclick = () => { const why = this.h.act('turn', { id: b.dataset.mon }); if (why) this.h.g.toast(why, '#ff8a7a'); else { p.mon = b.dataset.mon!; sc.dataset.sig = ''; this.tick(); } });
      return;
    }
    if (kind === 'out') {
      if (sc.dataset.sig === 'out') return; sc.dataset.sig = 'out';
      sc.innerHTML = `<div class="ov-card small"><h2>☠ Overrun</h2><p class="ov-sub">You fell. Watching the last stand…</p></div>`;
      return;
    }
    if (kind === 'end') {
      if (sc.dataset.sig === 'end') return; sc.dataset.sig = 'end';
      const surv = ov.result === 'survivors', mine = p.role === 'survivor' || (p.role !== 'turned' && p.role !== 'turning' && surv);
      const won = surv ? mine : p.role === 'turned' || p.role === 'turning';
      const title = surv ? (won ? '🏆 You survived the Overrun!' : '🪲 The survivors held out') : won ? '🪲 The hive wins — they were all overrun' : '💀 Overrun — the last survivor fell';
      const rows = ov.players.map((q) => `<tr style="--pc:${PCOLORS[q.pid % PCOLORS.length]}"><td><i></i>${esc(pname(q))}</td><td>${q.role === 'survivor' ? '🧍 ' + esc(ovUnit(q.cls).name) : q.mon ? '🪲 ' + esc(ovMonster(q.mon).name) : '💀'}</td><td>${q.kills}</td><td>${q.earned}</td><td>${q.deaths}</td></tr>`).join('');
      sc.innerHTML = `<div class="ov-card end ${won ? 'won' : 'lost'}"><h2>${title}</h2>
        <p class="ov-sub">${surv ? `Time survived ${mmss(ov.total)}` : `Fell with ${mmss(ov.timeLeft)} left`} · ${this.h.g.stats.kills} monsters killed</p>
        <table class="ov-table"><tr><th>Player</th><th>Ended as</th><th>Kills</th><th>★ earned</th><th>Deaths</th></tr>${rows}</table>
        <div class="row"><button class="btn big go" id="ov-again">↻ Main menu</button></div></div>`;
      (sc.querySelector('#ov-again') as HTMLElement).onclick = () => this.h.menu();
    }
  }
  dispose() { clearInterval(this.timer); this.root.remove(); document.body.classList.remove('ov-mode', 'ov-tactical'); }
}
