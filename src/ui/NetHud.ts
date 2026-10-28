// =============================================================================
// Multiplayer HUD: co-op player strip (colours, credits, Donate, Allow Ally
// Control, wave timer), the Invader's hand (Threat Energy, cards, eco, lane
// select, spells), versus match timer, telegraph banner, ping menu, and the
// multiplayer game-over screen.
// =============================================================================
import type { Game, PingKind } from '../game/Game';
import type { Sync } from '../net/Sync';
import { CARDS, SPELLS, TE_MAX, ECO_MAX } from '../net/Versus';
import { PCOLORS, PNAMES } from '../core/players';
import type { Vec } from '../core/types';

const fmtT = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, '0')}`;

export class NetHud {
  lane = 0;
  armed: 'emp' | 'surge' | 'smoke' | null = null;
  private bar: HTMLElement;
  private vsPanel: HTMLElement | null = null;
  private banner: HTMLElement;
  private pingMenu: HTMLElement;
  private t = 0;
  private sig = '';
  constructor(readonly g: Game, readonly s: Sync) {
    const b = document.body;
    b.classList.add('mp', s.coop ? 'mp-coop' : 'mp-versus', `role-${s.localRole}`);
    b.style.setProperty('--me', PCOLORS[s.localPid]);
    this.bar = document.createElement('div'); this.bar.id = 'mp-bar';
    document.getElementById('topbar')!.insertBefore(this.bar, document.querySelector('#topbar .spacer'));
    this.banner = document.createElement('div'); this.banner.id = 'tele-banner'; this.banner.hidden = true;
    document.getElementById('stage')!.appendChild(this.banner);
    this.pingMenu = document.createElement('div'); this.pingMenu.id = 'ping-menu'; this.pingMenu.hidden = true;
    document.getElementById('stage')!.appendChild(this.pingMenu);
    if (s.localRole === 'invader') this.buildInvader();
    s.onEvent = (ev) => this.onEvent(ev);
    g.bus.on('gameover', (r) => setTimeout(() => this.gameOver(r.won), 0));
    if (!s.coop) for (const id of ['btn-start', 'btn-auto']) { const e = document.getElementById(id); if (e) e.hidden = true; }
    document.addEventListener('pointerdown', (ev) => { if (!this.pingMenu.hidden && !this.pingMenu.contains(ev.target as Node)) this.pingMenu.hidden = true; }, true);
  }
  private credits(pid: number) { return this.s.isHost ? this.s.creditsOf(pid) : pid === this.s.localPid ? this.g.res.credits : this.s.allCredits[pid] ?? 0; }
  private get vs() { return this.s.isHost ? this.s.versus?.s ?? null : this.s.vs; }

  update(dt: number) {
    this.t -= dt; if (this.t > 0) return; this.t = 0.2;
    const s = this.s, g = this.g;
    if (s.coop) {
      const allow = !!s.allowAlly.get(s.localPid);
      const timer = s.settings.waveTimer > 0 && !g.waves.active && g.state === 'playing' ? `<span class="mp-timer" id="wave-timer">⏱ Next wave ${Math.max(0, Math.ceil(s.waveCountdown))}s</span>` : '';
      const sig = `${s.players.map((p) => p.pid + ':' + Math.floor(this.credits(p.pid))).join()}|${allow}|${timer}`;
      if (sig === this.sig) return; this.sig = sig;
      this.bar.innerHTML = s.players.map((p) => `<span class="mp-chip${p.pid === s.localPid ? ' me' : ''}" style="--pc:${PCOLORS[p.pid]}" title="${PNAMES[p.pid]}"><i></i>P${p.pid + 1} ¢${Math.floor(this.credits(p.pid))}${p.pid !== s.localPid ? `<button class="btn tiny" data-donate="${p.pid}" title="Give P${p.pid + 1} ¢100">🎁100</button>` : ''}</span>`).join('')
        + `<label class="mp-allow" title="Let teammates command your troops"><input type="checkbox" id="allow-ally" ${allow ? 'checked' : ''}> Allow Ally Control</label>${timer}`;
      for (const el of Array.from(this.bar.querySelectorAll<HTMLElement>('[data-donate]'))) el.onclick = () => s.donate(+el.dataset.donate!, 100);
      (this.bar.querySelector('#allow-ally') as HTMLInputElement).onchange = (e) => { const on = (e.target as HTMLInputElement).checked; s.allowAlly.set(s.localPid, on); s.setAllow(on); };
      return;
    }
    const v = this.vs; if (!v) return;
    const role = s.localRole;
    const head = v.phase === 'battle' ? `⏳ ${fmtT(v.timer)}` : v.phase === 'push' ? '💀 FINAL BOSS PUSH' : v.winner === 'defender' ? '🛡 Defender wins' : '🦠 Invader wins';
    this.bar.innerHTML = `<span class="mp-chip" style="--pc:${PCOLORS[v.def]}"><i></i>🛡 P${v.def + 1}${role === 'defender' ? ' (you)' : ''}</span><span class="vs-timer" id="vs-timer">${head}</span><span class="mp-chip" style="--pc:#d86bff"><i></i>🦠 P${v.inv + 1}${role === 'invader' ? ' (you)' : ''} · ${Math.floor(v.te)} TE</span>`;
    if (role === 'invader') this.paintInvader();
  }
  // ------------------------------------------------------------------ invader
  private buildInvader() {
    const side = document.getElementById('side')!;
    this.vsPanel = document.createElement('div'); this.vsPanel.id = 'vs-panel';
    side.prepend(this.vsPanel);
    this.vsPanel.addEventListener('click', (ev) => {
      const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-card],[data-spell],[data-lane]'); if (!el) return;
      if (el.dataset.lane) { this.lane = +el.dataset.lane; this.sig = ''; this.paintInvader(); }
      else if (el.dataset.card) this.s.card(el.dataset.card, this.lane);
      else if (el.dataset.spell) { const id = el.dataset.spell as 'emp'; this.armed = this.armed === id ? null : id; this.paintInvader(true); this.g.toast(this.armed ? `${SPELLS.find((x) => x.id === id)!.name}: click the map${id === 'emp' ? ' on a tower' : ''}` : 'Spell cancelled'); }
    });
  }
  private paintInvader(force = false) {
    const v = this.vs, p = this.vsPanel; if (!v || !p) return;
    const lanes = this.g.paths.length;
    const sig = `${Math.floor(v.te)}|${v.eco}|${this.lane}|${this.armed}|${Object.values(v.cd).map((c) => Math.ceil(c)).join()}|${v.phase}`;
    if (!force && sig === p.dataset.sig) return; p.dataset.sig = sig;
    p.innerHTML = `<h3>🦠 Invader</h3>
      <div class="te"><span>Threat Energy <b id="te-val">${Math.floor(v.te)}</b>/${TE_MAX} · +${v.regen.toFixed(1)}/s</span><i style="width:${(v.te / TE_MAX) * 100}%"></i></div>
      <div class="lanes">Lane ${Array.from({ length: lanes }, (_, i) => `<button class="btn small ${i === this.lane ? 'on' : ''}" data-lane="${i}">${i + 1}</button>`).join('')}</div>
      <div class="cards">${CARDS.map((c) => `<button class="vs-card ${v.te >= c.cost && !(c.eco && v.eco >= ECO_MAX) ? '' : 'poor'} ${c.major ? 'major' : ''}" data-card="${c.id}" title="${c.desc}"><span class="ic">${c.icon}</span><b>${c.name}</b><em>${c.cost} TE</em><small>${c.eco ? `Hive ${v.eco}/${ECO_MAX}` : c.desc}</small></button>`).join('')}</div>
      <h4>Spells</h4><div class="spells">${SPELLS.map((sp) => { const cd = v.cd[sp.id] ?? 0; return `<button class="vs-spell ${this.armed === sp.id ? 'armed' : ''} ${cd > 0 ? 'cool' : ''}" data-spell="${sp.id}" title="${sp.desc}"><span class="ic">${sp.icon}</span><b>${sp.name}</b><em>${cd > 0 ? Math.ceil(cd) + 's' : `${sp.cd}s cd`}</em></button>`; }).join('')}</div>
      <p class="hint">Cards spawn at the lane gate. Siege Walkers and Bosses are telegraphed to the Defender 2 s ahead. Survive-timer ends with a Boss Push on every lane.</p>`;
  }
  /** Map click while a spell is armed (returns true if consumed). */
  mapClick(p: Vec): boolean {
    if (this.s.localRole !== 'invader') return false;
    if (this.armed) { this.s.spell(this.armed, p); this.armed = null; this.paintInvader(true); return true; }
    return true; // the invader never builds or selects
  }
  // ------------------------------------------------------------------ pings
  openPing(sx: number, sy: number, at: Vec) {
    const m = this.pingMenu;
    m.innerHTML = ([['defend', '🛡 Defend Here'], ['attack', '⚔ Attack Here'], ['spawn', '⚠ Enemy Spawning']] as [PingKind, string][]).map(([k, t]) => `<button class="btn small" data-ping="${k}">${t}</button>`).join('');
    m.style.left = `${sx}px`; m.style.top = `${sy}px`; m.hidden = false;
    for (const b of Array.from(m.querySelectorAll<HTMLElement>('[data-ping]'))) b.onclick = (ev) => { ev.stopPropagation(); this.s.ping(b.dataset.ping as PingKind, at); m.hidden = true; };
  }
  private bannerT = 0;
  private winner: 'defender' | 'invader' | null = null;
  private onEvent(ev: Record<string, unknown>) {
    if (ev.k === 'tele') {
      this.banner.hidden = false; this.banner.textContent = `⚠ ${ev.label} incoming — Lane ${(ev.lane as number) + 1} in ${ev.dur}s`;
      clearTimeout(this.bannerT); this.bannerT = window.setTimeout(() => { this.banner.hidden = true; }, ((ev.dur as number) + 1.5) * 1000);
    } else if (ev.k === 'disconnected') {
      this.banner.hidden = false; clearTimeout(this.bannerT);
      if (ev.bye) this.banner.innerHTML = '⚠ The host left — the match has ended <button class="btn small" id="mp-tomenu">Menu</button>';
      else this.banner.innerHTML = '⚠ Lost connection to the host <button class="btn small go" id="mp-rejoin">↻ Rejoin</button> <button class="btn small" id="mp-tomenu">Menu</button>';
      const rj = document.getElementById('mp-rejoin'); if (rj) rj.onclick = () => location.reload();
      document.getElementById('mp-tomenu')!.onclick = () => { location.href = location.pathname; };
    } else if (ev.k === 'vsend') { this.winner = ev.winner as 'defender' | 'invader'; this.gameOver(false); }
  }
  private gameOver(won: boolean) {
    const o = document.getElementById('gameover')!, s = this.s, g = this.g;
    let title: string, line: string;
    if (s.coop) { title = won ? '🏆 Team Victory!' : '💥 The shared HQ fell'; line = `Wave ${g.waves.index} · Kills ${g.stats.kills} · Combos ${g.stats.combos}`; }
    else {
      const w = this.winner ?? this.vs?.winner ?? (g.state === 'won' ? 'defender' : 'invader');
      const me = s.localRole === w;
      title = me ? '🏆 Victory!' : '💥 Defeat'; line = w === 'defender' ? 'The Defender survived the timer and the Boss Push.' : 'The Invader broke the HQ.';
    }
    o.innerHTML = `<div class="panel"><h1>${title}</h1><p>${line}</p><div class="row go-btns"><button class="btn big" id="btn-mpmenu">Back to menu</button></div></div>`;
    o.classList.add('show');
    (o.querySelector('#btn-mpmenu') as HTMLElement).onclick = () => { s.dispose(); location.href = location.pathname; };
  }
}
