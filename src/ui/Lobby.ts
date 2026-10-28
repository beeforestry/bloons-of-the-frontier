// =============================================================================
// Main-menu modes (Single Player / Co-Op Defense / 1v1 Versus) + the network
// lobby: 4-digit room code, copyable ?room=1234 link, player list with ready
// state, and host-only match settings.
// =============================================================================
import { NetSession, type Msg } from '../net/Net';
import { DEFAULT_SETTINGS, type MpSettings, type PlayerInfo, type Mode } from '../net/Sync';
import { MAPS } from '../data/maps';
import { DIFFICULTIES } from '../data/difficulty';
import { PCOLORS, PNAMES } from '../core/players';

export interface MpStart { net: NetSession; settings: MpSettings; players: PlayerInfo[]; localPid: number }
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export class Lobby {
  net: NetSession | null = null;
  settings: MpSettings = { ...DEFAULT_SETTINGS };
  players: PlayerInfo[] = [];
  localPid = 0;
  code = '';
  status = '';
  private el: HTMLElement;
  constructor(private onStart: (s: MpStart) => void) {
    const panel = document.querySelector('#menu .panel')!;
    const modes = document.createElement('div');
    modes.id = 'modes';
    modes.innerHTML = `<button class="mode-pick on" data-mode="solo">🎈 <b>Single Player</b><small>classic campaign</small></button>
      <button class="mode-pick" data-mode="coop">🤝 <b>Co-Op Defense</b><small>2–4 players · shared HQ</small></button>
      <button class="mode-pick" data-mode="versus">⚔ <b>1v1 Versus</b><small>Defender vs Invader</small></button>`;
    panel.insertBefore(modes, panel.querySelector('.diff-title'));
    this.el = document.createElement('div'); this.el.id = 'mp-panel'; this.el.hidden = true;
    panel.insertBefore(this.el, panel.querySelector('.hint'));
    for (const b of Array.from(modes.children) as HTMLElement[]) b.onclick = () => this.pickMode(b.dataset.mode as 'solo' | Mode);
    const room = new URLSearchParams(location.search).get('room');
    if (room && /^\d{4}$/.test(room)) { this.pickMode('coop', true); void this.join(room); }
  }
  private pickMode(m: 'solo' | Mode, silent = false) {
    if (this.net && !silent) return; // already in a lobby
    for (const b of Array.from(document.querySelectorAll<HTMLElement>('.mode-pick'))) b.classList.toggle('on', b.dataset.mode === m);
    document.body.classList.toggle('menu-mp', m !== 'solo');
    this.el.hidden = m === 'solo';
    if (m !== 'solo') { this.settings.mode = m; this.renderEntry(); }
  }
  private renderEntry() {
    this.el.innerHTML = `<div class="mp-entry">
      <button class="btn big go" id="mp-host">🏠 Host a ${this.settings.mode === 'coop' ? 'Co-Op' : 'Versus'} room</button>
      <div class="mp-join"><input id="mp-code" inputmode="numeric" maxlength="4" placeholder="1234" aria-label="Room code"><button class="btn big" id="mp-joinb">Join</button></div>
      </div><p class="mp-status" id="mp-status">${esc(this.status)}</p>
      <p class="hint">Peer-to-peer (WebRTC). Share the 4-digit code or the link. Works on most home/office networks; some strict mobile/corporate NATs can block direct connections.</p>`;
    (this.el.querySelector('#mp-host') as HTMLElement).onclick = () => void this.host();
    const inp = this.el.querySelector('#mp-code') as HTMLInputElement;
    (this.el.querySelector('#mp-joinb') as HTMLElement).onclick = () => { if (/^\d{4}$/.test(inp.value)) void this.join(inp.value); else this.setStatus('Enter the 4-digit room code'); };
    inp.onkeydown = (e) => { if (e.key === 'Enter') (this.el.querySelector('#mp-joinb') as HTMLElement).click(); };
  }
  private setStatus(s: string) { this.status = s; const e = this.el.querySelector('#mp-status'); if (e) e.textContent = s; }
  get link() { return `${location.origin}${location.pathname}?room=${this.code}`; }

  async host() {
    const n = new NetSession('host', this.settings.mode === 'versus' ? 2 : 4);
    this.setStatus('Opening room…');
    try { this.code = await n.host(); } catch (e) { this.setStatus(`Could not open a room: ${(e as Error).message}`); return; }
    this.net = n; this.localPid = 0;
    this.players = [{ pid: 0, name: 'P1 (host)', ready: true }];
    n.onJoin = (pid) => { this.players.push({ pid, name: `P${pid + 1}`, ready: false }); this.players.sort((a, b) => a.pid - b.pid); n.send(pid, { t: 'welcome', pid }); this.pushLobby(); };
    n.onLeave = (pid) => { this.players = this.players.filter((p) => p.pid !== pid); this.pushLobby(); };
    n.onMsg = (pid, m) => this.hostMsg(pid, m);
    n.onStatus = (s) => this.setStatus(s);
    history.replaceState(null, '', `?room=${this.code}`);
    this.renderLobby();
  }
  async join(code: string) {
    const n = new NetSession('client');
    this.setStatus(`Joining room ${code}…`);
    n.onMsg = (_p, m) => this.clientMsg(m);
    n.onLeave = () => { this.setStatus('Host closed the room'); this.net = null; this.renderEntry(); };
    try { await n.join(code); } catch (e) { this.setStatus((e as Error).message); this.renderEntry(); return; }
    this.net = n; this.code = code;
    n.send(0, { t: 'hello' });
    this.setStatus(`Connected to room ${code}`);
  }
  private hostMsg(pid: number, m: Msg) {
    const p = this.players.find((x) => x.pid === pid); if (!p) return;
    if (m.t === 'ready') { p.ready = !!m.on; this.pushLobby(); }
    if (m.t === 'hello') this.pushLobby();
  }
  private clientMsg(m: Msg) {
    if (m.t === 'welcome') this.localPid = m.pid as number;
    else if (m.t === 'full') this.setStatus('Room is full');
    else if (m.t === 'lobby') { this.players = m.players as PlayerInfo[]; this.settings = m.settings as MpSettings; this.pickMode(this.settings.mode, true); this.renderLobby(); }
    else if (m.t === 'start') { this.settings = m.settings as MpSettings; this.players = m.players as PlayerInfo[]; this.launch(); }
  }
  private pushLobby() { this.net?.broadcast({ t: 'lobby', players: this.players, settings: this.settings, code: this.code }); this.renderLobby(); }
  private get canStart() { const n = this.players.length; return n >= 2 && (this.settings.mode === 'coop' ? n <= 4 : n === 2) && this.players.every((p) => p.ready); }
  renderLobby() {
    const host = this.net?.role === 'host', s = this.settings;
    const me = this.players.find((p) => p.pid === this.localPid);
    const roleOf = (pid: number) => s.mode === 'coop' ? '' : (pid === 0) === (s.hostRole === 'defender') ? '🛡 Defender' : '🦠 Invader';
    const sel = (id: string, opts: [string | number, string][], v: string | number) => `<select id="${id}" ${host ? '' : 'disabled'}>${opts.map(([k, t]) => `<option value="${k}" ${String(k) === String(v) ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
    this.el.innerHTML = `<div class="lobby">
      <div class="lobby-code"><span>${s.mode === 'coop' ? '🤝 Co-Op Defense' : '⚔ 1v1 Versus'} · Room</span><b id="room-code">${this.code}</b>
        <button class="btn small" id="copy-link" title="${esc(this.link)}">🔗 Copy link</button></div>
      <input class="lobby-link" id="room-link" readonly value="${esc(this.link)}">
      <ul class="lobby-players">${this.players.map((p) => `<li style="--pc:${PCOLORS[p.pid]}"><i></i><b>P${p.pid + 1}</b> ${PNAMES[p.pid]}${p.pid === 0 ? ' · host' : ''}${p.pid === this.localPid ? ' (you)' : ''} <em>${roleOf(p.pid)}</em><span class="${p.ready ? 'ok' : 'wait'}">${p.ready ? '✔ Ready' : '… not ready'}</span></li>`).join('')}
        ${Array.from({ length: Math.max(0, (s.mode === 'coop' ? 2 : 2) - this.players.length) }, () => '<li class="empty"><i></i>Waiting for a player…</li>').join('')}</ul>
      <div class="lobby-settings">
        <label>Map ${sel('set-map', MAPS.map((m) => [m.id, m.name]), s.map)}</label>
        <label>Difficulty ${sel('set-diff', DIFFICULTIES.map((d) => [d.id, `${d.icon} ${d.name}`]), s.diff)}</label>
        <label>Starting ¢ ${sel('set-credits', [[400, '400'], [650, '650'], [900, '900'], [1500, '1500'], [3000, '3000']], s.credits)}</label>
        ${s.mode === 'coop' ? `<label>Wave timer ${sel('set-timer', [[0, 'Manual'], [15, '15 s'], [25, '25 s'], [40, '40 s']], s.waveTimer)}</label>`
          : `<label>Match ${sel('set-match', [[4, '4 min'], [6, '6 min'], [8, '8 min'], [12, '12 min']], s.matchMin)}</label><label>Host plays ${sel('set-role', [['defender', '🛡 Defender'], ['invader', '🦠 Invader']], s.hostRole)}</label>`}
        <label>Speed ${sel('set-speed', [[1, '1×'], [2, '2×']], s.speed)}</label>
      </div>
      <div class="row lobby-btns">
        ${host ? '' : `<button class="btn big ${me?.ready ? '' : 'go'}" id="btn-ready">${me?.ready ? '✖ Not ready' : '✔ Ready'}</button>`}
        ${host ? `<button class="btn big go" id="btn-mpstart" ${this.canStart ? '' : 'disabled'}>▶ Start match</button>` : '<span class="hint">The host starts the match</span>'}
        <button class="btn" id="btn-leave">Leave</button>
      </div>
      <p class="mp-status" id="mp-status">${esc(this.status)}</p></div>`;
    const $ = (id: string) => this.el.querySelector('#' + id) as HTMLElement | null;
    $('copy-link')!.onclick = () => { const i = $('room-link') as HTMLInputElement; i.select(); navigator.clipboard?.writeText(this.link).catch(() => document.execCommand('copy')); this.setStatus('Link copied — send it to your friends'); };
    $('btn-leave')!.onclick = () => { this.net?.close(); location.href = location.pathname; };
    const rd = $('btn-ready'); if (rd) rd.onclick = () => { const on = !me?.ready; if (me) me.ready = on; this.net?.send(0, { t: 'ready', on }); this.renderLobby(); };
    const st = $('btn-mpstart'); if (st) st.onclick = () => { if (!this.canStart) return; for (const p of this.players) this.net!.send(p.pid, { t: 'start', settings: this.settings, players: this.players }); this.launch(); };
    if (host) {
      const bind = (id: string, k: keyof MpSettings, num = false) => { const e = $(id) as HTMLSelectElement | null; if (e) e.onchange = () => { (this.settings as unknown as Record<string, unknown>)[k] = num ? +e.value : e.value; this.pushLobby(); }; };
      bind('set-map', 'map'); bind('set-diff', 'diff'); bind('set-credits', 'credits', true); bind('set-timer', 'waveTimer', true); bind('set-match', 'matchMin', true); bind('set-role', 'hostRole'); bind('set-speed', 'speed', true);
    }
  }
  private launch() {
    if (!this.net) return;
    this.net.onJoin = () => {}; // late joiners are not supported mid-match
    this.onStart({ net: this.net, settings: { ...this.settings }, players: this.players.map((p) => ({ ...p })), localPid: this.localPid });
  }
}
