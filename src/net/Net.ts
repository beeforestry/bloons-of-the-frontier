// =============================================================================
// NET: thin WebRTC P2P layer over PeerJS (public PeerJS cloud broker for
// signalling, Google/Twilio public STUN for NAT traversal, and the free Open Relay
// TURN service as a best-effort fallback for networks where direct P2P fails).
// Star topology: the HOST is authoritative; every client has one reliable
// DataChannel to the host. Room code = 4 digits -> host peer id `bof-frontier-1234`.
// =============================================================================
import { Peer, type DataConnection } from 'peerjs';
import { meteredUrl } from '../config/turn';

export const PEER_PREFIX = 'bof-frontier-';
export const ICE: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
];
export type Msg = { t: string; [k: string]: unknown };

/** ICE config, in priority order (t47):
 *  1. localStorage['bof.ice'] = JSON iceServers[] (manual override, e.g. your own TURN);
 *  2. Metered TURN: credentials fetched from the Metered API (app + key from src/config/turn.ts,
 *     injected at build time), cached for the session; turns:443/TCP is ensured for strict networks;
 *  3. public STUN + Open Relay (shared free TURN, static-auth secret -> client-minted TURN REST creds, no SLA). */
const TURN_HOST = 'staticauth.openrelay.metered.ca', TURN_SECRET = 'openrelayprojectsecret';
export type IceSource = 'custom' | 'metered' | 'openrelay' | 'stun';
export let iceSource: IceSource = 'stun';
let meteredCache: Promise<RTCIceServer[] | null> | null = null;
const urlsOf = (s: RTCIceServer) => (Array.isArray(s.urls) ? s.urls : [s.urls]);
async function metered(): Promise<RTCIceServer[] | null> {
  const url = meteredUrl(); if (!url) return null;
  return (meteredCache ??= (async () => {
    try {
      const ac = new AbortController(), t = setTimeout(() => ac.abort(), 6000);
      const r = await fetch(url, { signal: ac.signal }); clearTimeout(t);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const list = (await r.json()) as RTCIceServer[];
      if (!Array.isArray(list) || !list.some((x) => urlsOf(x).some((u) => /^turns?:/.test(u)))) throw new Error('no TURN in response');
      // strict firewalls often only allow TLS on 443: make sure a turns:443/TCP route exists
      if (!list.some((x) => urlsOf(x).some((u) => u.startsWith('turns:')))) {
        const t0 = list.find((x) => urlsOf(x).some((u) => u.startsWith('turn:')))!;
        const host = urlsOf(t0).find((u) => u.startsWith('turn:'))!.slice(5).split(/[:?]/)[0];
        list.push({ urls: `turns:${host}:443?transport=tcp`, username: t0.username, credential: t0.credential });
      }
      return list;
    } catch (e) { console.warn('[net] Metered TURN unavailable, falling back to Open Relay:', (e as Error).message); meteredCache = null; return null; }
  })());
}
export async function iceServers(): Promise<RTCIceServer[]> {
  try { const o = localStorage.getItem('bof.ice'); if (o) { iceSource = 'custom'; return JSON.parse(o) as RTCIceServer[]; } } catch { /* */ }
  const m = await metered();
  if (m) { iceSource = 'metered'; return [...ICE.slice(0, 1), ...m]; }
  const out = [...ICE]; iceSource = 'stun';
  try {
    const username = `${Math.floor(Date.now() / 1000) + 6 * 3600}:bof`;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(TURN_SECRET), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(username)));
    const credential = btoa(String.fromCharCode(...sig));
    out.push({ urls: [`turn:${TURN_HOST}:80`, `turn:${TURN_HOST}:80?transport=tcp`, `turn:${TURN_HOST}:443`, `turns:${TURN_HOST}:443?transport=tcp`], username, credential });
    iceSource = 'openrelay';
  } catch { /* no WebCrypto (insecure origin): STUN only */ }
  return out;
}
export const ICE_LABEL: Record<IceSource, string> = { custom: 'custom ICE (bof.ice)', metered: 'Metered TURN', openrelay: 'Open Relay TURN (free, best-effort)', stun: 'STUN only (no relay)' };

/** Connection stages shown in the lobby, and specific failure reasons. */
export type Stage = 'signal' | 'room' | 'link' | 'done';
export type FailCode = 'not-found' | 'signal' | 'ice' | 'timeout' | 'full' | 'started' | 'closed' | 'webrtc';
export class NetError extends Error { constructor(readonly code: FailCode, msg: string) { super(msg); } }

/** Lobby "Test connection": gather ICE candidates with the current config and report which kinds appear.
 *  relay = TURN works (connects almost anywhere); srflx only = direct P2P via STUN (fails on strict NATs). */
export async function testIce(timeoutMs = 9000): Promise<{ host: number; srflx: number; relay: number; source: IceSource; ms: number }> {
  const t0 = performance.now(), servers = await iceServers();
  const pc = new RTCPeerConnection({ iceServers: servers });
  const n = { host: 0, srflx: 0, relay: 0 };
  try {
    pc.createDataChannel('probe');
    await new Promise<void>((res) => {
      const to = setTimeout(res, timeoutMs);
      pc.onicecandidate = (e) => {
        if (!e.candidate) { clearTimeout(to); res(); return; }
        const typ = (e.candidate.type ?? / typ (\w+)/.exec(e.candidate.candidate)?.[1]) as string | undefined;
        if (typ === 'host' || typ === 'srflx' || typ === 'relay') n[typ]++; else if (typ === 'prflx') n.srflx++;
      };
      void pc.createOffer().then((o) => pc.setLocalDescription(o)).catch(() => { clearTimeout(to); res(); });
    });
  } finally { pc.close(); }
  return { ...n, source: iceSource, ms: Math.round(performance.now() - t0) };
}
/** Stable per-browser seat token: rejoining with it gives back the same player slot. */
export function seatToken(): string {
  try { let t = localStorage.getItem('bof.mpTok'); if (!t) { t = Math.random().toString(36).slice(2, 12); localStorage.setItem('bof.mpTok', t); } return t; }
  catch { return Math.random().toString(36).slice(2, 12); }
}
const HB_MS = 2000, DEAD_MS = 9000;

const randCode = () => String(1000 + Math.floor(Math.random() * 9000));

// ---------------------------------------------------------------------------
// TEST-ONLY relay transport. Some CI sandboxes block WebRTC UDP by policy, so the
// e2e suite sets localStorage['bof.relay'] = '<url>' and runs the *same* Net/Sync
// protocol over a tiny SSE+POST relay served by the test harness. Never active
// for real players (the key is never written by the game).
// ---------------------------------------------------------------------------
type Conn = Pick<DataConnection, 'send' | 'close' | 'open'> & { on(ev: string, f: (d?: unknown) => void): void };
const relayUrl = (): string | null => { try { return localStorage.getItem('bof.relay'); } catch { return null; } };
class RelayConn {
  open = false; private h: Record<string, ((d?: unknown) => void)[]> = {};
  constructor(private ep: RelayEndpoint, readonly peer: string) {}
  on(ev: string, f: (d?: unknown) => void) { (this.h[ev] ??= []).push(f); }
  fire(ev: string, d?: unknown) { for (const f of this.h[ev] ?? []) f(d); }
  send(m: unknown) { this.ep.post(this.peer, 'data', m); }
  close() { if (!this.open) return; this.open = false; this.ep.post(this.peer, 'close'); this.ep.conns.delete(this.peer); this.fire('close'); }
}
class RelayEndpoint {
  conns = new Map<string, RelayConn>();
  onConn: (c: RelayConn) => void = () => {};
  es: EventSource;
  constructor(readonly base: string, readonly id: string, onReady: (ok: boolean) => void) {
    this.es = new EventSource(`${base}/sse?id=${encodeURIComponent(id)}`);
    this.es.addEventListener('ready', () => onReady(true));
    this.es.addEventListener('taken', () => { onReady(false); this.es.close(); });
    this.es.onmessage = (ev) => {
      const { from, kind, m } = JSON.parse(ev.data) as { from: string; kind: string; m?: unknown };
      let c = this.conns.get(from);
      if (kind === 'hello') { c = new RelayConn(this, from); this.conns.set(from, c); this.onConn(c); c.open = true; this.post(from, 'welcome'); c.fire('open'); return; }
      if (kind === 'nopeer') { c?.fire('error', { type: 'peer-unavailable' }); return; }
      if (!c) return;
      if (kind === 'welcome') { c.open = true; c.fire('open'); }
      else if (kind === 'data') c.fire('data', m);
      else if (kind === 'close') { c.open = false; this.conns.delete(from); c.fire('close'); }
    };
  }
  private q: Promise<unknown> = Promise.resolve();
  /** Posts are chained so the relay preserves order like a reliable DataChannel. */
  post(to: string, kind: string, m?: unknown) {
    const body = JSON.stringify({ from: this.id, to, kind, m });
    this.q = this.q.then(() => fetch(`${this.base}/send`, { method: 'POST', body }).catch(() => {}));
  }
  connect(to: string): RelayConn { const c = new RelayConn(this, to); this.conns.set(to, c); this.post(to, 'hello'); return c; }
  destroy() { for (const c of [...this.conns.values()]) c.close(); this.es.close(); }
}

export class NetSession {
  peer: Peer | null = null;
  relay: RelayEndpoint | null = null;
  /** 'webrtc' normally; 'relay' only under the e2e harness. */
  transport: 'webrtc' | 'relay' = relayUrl() ? 'relay' : 'webrtc';
  code = '';
  /** host: pid -> connection; client: 0 -> host connection. */
  conns = new Map<number, Conn>();
  onMsg: (pid: number, m: Msg) => void = () => {};
  onJoin: (pid: number, rejoin: boolean) => void = () => {};
  onLeave: (pid: number) => void = () => {};
  onStatus: (s: string) => void = () => {};
  /** join progress: stage + detail ('direct' / 'relay' once linked). */
  onStage: (st: Stage, detail?: string) => void = () => {};
  stage: Stage = 'signal';
  private setStage(st: Stage, d?: string) { this.stage = st; this.onStage(st, d); }
  /** Bytes sent (debug / HUD). */
  sent = 0;
  constructor(readonly role: 'host' | 'client', readonly maxPlayers = 4) {}

  private async opts() { return { debug: 1 as const, config: { iceServers: await iceServers() } }; }
  /** host: seat token -> pid (kept after a drop so a rejoin restores the slot). */
  private seats = new Map<string, number>();
  /** host: once the match starts only these pids may (re)join. */
  private locked: number[] | null = null;
  lockSlots(pids: number[]) { this.locked = [...pids]; }
  private lastRx = new Map<Conn, number>();
  private hb = 0;
  /** client: why the link ended ('bye' = host left on purpose). */
  endReason = '';
  private startHb() {
    if (this.hb) return;
    this.hb = window.setInterval(() => {
      const now = performance.now();
      for (const [pid, c] of [...this.conns]) {
        this.send(pid, { t: 'hb' });
        const rx = this.lastRx.get(c) ?? now;
        if (now - rx > DEAD_MS) { this.lastRx.delete(c); try { c.close(); } catch { /* */ } if (this.conns.get(pid) === c) { this.conns.delete(pid); this.onLeave(pid); } }
      }
    }, HB_MS);
  }
  private rx(c: Conn) { this.lastRx.set(c, performance.now()); }

  /** Host: claim a free 4-digit room code (retries on collision). */
  host(code = randCode(), tries = 6): Promise<string> {
    const ru = relayUrl();
    if (ru) return new Promise((resolve, reject) => {
      const attempt = (c: string, left: number) => {
        const ep = new RelayEndpoint(ru, PEER_PREFIX + c, (ok) => {
          if (ok) { this.relay = ep; this.code = c; ep.onConn = (conn) => this.accept(conn); this.onStatus(`Room ${c} open`); resolve(c); }
          else if (left > 0) attempt(randCode(), left - 1); else reject(new Error('No free room code'));
        });
      };
      attempt(code, tries);
    });
    return this.opts().then((opts) => new Promise((resolve, reject) => {
      const attempt = (c: string, left: number) => {
        const p = new Peer(PEER_PREFIX + c, opts);
        p.on('open', () => { this.peer = p; this.code = c; this.onStatus(`Room ${c} open`); resolve(c); });
        p.on('error', (err: { type?: string; message?: string }) => {
          if (err.type === 'unavailable-id' && left > 0) { p.destroy(); attempt(randCode(), left - 1); return; }
          if (!this.peer) { reject(new Error(brokerErr(err))); return; }
          this.onStatus(`Network: ${err.type ?? err.message}`);
        });
        p.on('connection', (conn) => this.accept(conn));
        p.on('disconnected', () => { this.onStatus('Matchmaking link lost — reconnecting…'); setTimeout(() => { try { if (!p.destroyed) p.reconnect(); } catch { /* */ } }, 1000); });
      };
      attempt(code, tries);
    }));
  }
  private accept(conn: Conn) {
    let pid = -1;
    conn.on('data', (d) => {
      const m = d as Msg; this.rx(conn);
      if (m.t === 'hb') return;
      if (pid < 0) { if (m.t === 'hello') this.seat(conn, String(m.tok ?? '')).then((p) => { pid = p; }); return; }
      if (this.conns.get(pid) === conn) this.onMsg(pid, m);
    });
    conn.on('close', () => { this.lastRx.delete(conn); if (pid >= 0 && this.conns.get(pid) === conn) { this.conns.delete(pid); this.onLeave(pid); } });
  }
  /** Pick the slot for a new connection: its old seat if free, else the lowest free one. */
  private async seat(conn: Conn, tok: string): Promise<number> {
    const free = (p: number) => !this.conns.has(p);
    const deny = (t: string) => { conn.send({ t }); setTimeout(() => conn.close(), 400); return -1; };
    let pid = tok ? this.seats.get(tok) ?? -1 : -1;
    if (pid >= 0 && !free(pid)) pid = -1;
    if (this.locked) {
      if (pid < 0 || !this.locked.includes(pid)) pid = this.locked.find((p) => p !== 0 && free(p)) ?? -1;
      if (pid < 0) return deny('started');
    } else if (pid < 0) {
      pid = 1; while (this.conns.has(pid)) pid++;
      if (pid >= this.maxPlayers) return deny('full');
    }
    const rejoin = this.seats.get(tok) === pid || !!this.locked;
    if (tok) { for (const [k, v] of this.seats) if (v === pid) this.seats.delete(k); this.seats.set(tok, pid); }
    this.conns.set(pid, conn); this.rx(conn); this.startHb();
    conn.send({ t: 'welcome', pid, rejoin });
    this.onJoin(pid, rejoin);
    return pid;
  }
  /** Client: connect to room `code`; resolves once the host has given us a seat. Rejects with a NetError. */
  join(code: string, timeoutMs = 25000): Promise<void> {
    this.code = code;
    return new Promise((resolve, reject) => {
      let done = false, poll = 0;
      const fail = (c: FailCode, msg: string) => { if (done) return; done = true; clearTimeout(to); clearInterval(poll); this.close(); reject(new NetError(c, msg)); };
      const NF = `Room ${code} not found — check the code, or ask the host to open it again.`;
      const to = setTimeout(() => {
        if (this.stage === 'signal') fail('signal', "Couldn't reach the signaling (matchmaking) server.");
        else if (this.stage === 'link') fail('ice', `Found room ${code}, but no direct route and the TURN relay failed (${ICE_LABEL[iceSource]}).`);
        else fail('timeout', `Timed out waiting for room ${code} to answer — the host may have closed it or lost internet.`);
      }, timeoutMs);
      const wire = (conn: Conn) => {
        this.setStage('room');
        // watch the underlying RTCPeerConnection: an answer = room found; ICE 'failed' = no route even via relay
        const pc = () => (conn as unknown as { peerConnection?: RTCPeerConnection }).peerConnection;
        poll = window.setInterval(() => {
          const p = pc(); if (!p || done) return;
          if (this.stage === 'room' && p.remoteDescription) this.setStage('link');
          if (p.iceConnectionState === 'failed') fail('ice', `Found room ${code}, but no direct route and the TURN relay failed (${ICE_LABEL[iceSource]}).`);
        }, 250);
        conn.on('open', () => { if (this.stage !== 'link') this.setStage('link'); this.rx(conn); conn.send({ t: 'hello', tok: seatToken() }); });
        conn.on('data', (d) => {
          const m = d as Msg; this.rx(conn);
          if (m.t === 'hb') return;
          if (!done) {
            if (m.t === 'full') return fail('full', `Room ${code} is full.`);
            if (m.t === 'started') return fail('started', `Room ${code} is already in a match (no free seat).`);
            if (m.t !== 'welcome') return;
            done = true; clearTimeout(to); clearInterval(poll); this.conns.set(0, conn); this.startHb();
            void routeKind(pc()).then((k) => { this.route = k; this.setStage('done', k); });
            resolve();
          }
          if (m.t === 'bye') this.endReason = 'bye';
          this.onMsg(0, m);
        });
        conn.on('close', () => { this.lastRx.delete(conn); if (!done) return fail('closed', `Room ${code} closed while joining.`); if (this.conns.get(0) === conn) { this.conns.delete(0); this.onLeave(0); } });
        conn.on('error', (e) => { if ((e as { type?: string })?.type === 'peer-unavailable') fail('not-found', NF); });
      };
      this.setStage('signal');
      const ru = relayUrl();
      if (ru) {
        const ep = new RelayEndpoint(ru, 'c-' + Math.random().toString(36).slice(2), () => wire(ep.connect(PEER_PREFIX + code)));
        ep.es.onerror = () => { if (this.stage === 'signal') fail('signal', "Couldn't reach the signaling (matchmaking) server."); };
        this.relay = ep; return;
      }
      void this.opts().then((opts) => {
        if (done) return;
        const p = new Peer(opts);
        this.peer = p;
        p.on('open', () => wire(p.connect(PEER_PREFIX + code, { reliable: true, serialization: 'json' }) as unknown as Conn));
        p.on('error', (err: { type?: string; message?: string }) => {
          if (err.type === 'peer-unavailable') fail('not-found', NF);
          else if (!this.conns.size) { const w = err.type === 'browser-incompatible' || err.type === 'webrtc'; fail(w ? 'webrtc' : 'signal', brokerErr(err)); }
        });
      });
    });
  }
  /** 'direct' | 'relay' once linked ('' for the test relay transport). */
  route = '';
  send(pid: number, m: Msg) {
    const c = this.conns.get(pid); if (!c || !c.open) return;
    try { c.send(m); this.sent++; } catch { /* channel closing */ }
  }
  broadcast(m: Msg) { for (const pid of this.conns.keys()) this.send(pid, m); }
  /** Host: tell everyone we're leaving on purpose (so clients don't offer a rejoin). */
  bye() { this.broadcast({ t: 'bye' }); }
  close() { clearInterval(this.hb); this.hb = 0; for (const c of this.conns.values()) try { c.close(); } catch { /* */ } this.conns.clear(); try { this.peer?.destroy(); } catch { /* */ } this.peer = null; this.relay?.destroy(); this.relay = null; }
}

/** Which path the selected ICE candidate pair uses. */
async function routeKind(pc?: RTCPeerConnection): Promise<string> {
  if (!pc) return '';
  try {
    const st = await pc.getStats(); let pair: { localCandidateId?: string } | undefined;
    st.forEach((r: { type: string; selected?: boolean; nominated?: boolean; state?: string }) => { if (r.type === 'candidate-pair' && (r.selected || (r.nominated && r.state === 'succeeded'))) pair = r as typeof pair; });
    const loc = pair?.localCandidateId ? st.get(pair.localCandidateId) as { candidateType?: string } | undefined : undefined;
    return loc?.candidateType === 'relay' ? 'relay' : loc ? 'direct' : '';
  } catch { return ''; }
}
function brokerErr(err: { type?: string; message?: string }) {
  if (err.type === 'network' || err.type === 'server-error' || err.type === 'socket-error' || err.type === 'socket-closed')
    return "Couldn't reach the matchmaking server — check your internet connection";
  if (err.type === 'browser-incompatible' || err.type === 'webrtc') return 'This browser does not support WebRTC peer-to-peer';
  return err.message ?? String(err.type);
}
