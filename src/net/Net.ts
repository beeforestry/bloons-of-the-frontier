// =============================================================================
// NET: thin WebRTC P2P layer over PeerJS (public PeerJS cloud broker for
// signalling, Google/Twilio public STUN for NAT traversal, and the free Open Relay
// TURN service as a best-effort fallback for networks where direct P2P fails).
// Star topology: the HOST is authoritative; every client has one reliable
// DataChannel to the host. Room code = 4 digits -> host peer id `bof-frontier-1234`.
// =============================================================================
import { Peer, type DataConnection } from 'peerjs';

export const PEER_PREFIX = 'bof-frontier-';
export const ICE: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
];
export type Msg = { t: string; [k: string]: unknown };

/** TURN fallback: Open Relay (metered.ca) publishes a static-auth secret, so short-lived
 *  credentials can be minted client-side (TURN REST: user = expiry:tag, pass = b64 HMAC-SHA1).
 *  It is a shared free service with no SLA. Players with their own TURN can set
 *  localStorage['bof.ice'] = JSON iceServers[] to override. */
const TURN_HOST = 'staticauth.openrelay.metered.ca', TURN_SECRET = 'openrelayprojectsecret';
export async function iceServers(): Promise<RTCIceServer[]> {
  try { const o = localStorage.getItem('bof.ice'); if (o) return JSON.parse(o) as RTCIceServer[]; } catch { /* */ }
  const out = [...ICE];
  try {
    const username = `${Math.floor(Date.now() / 1000) + 6 * 3600}:bof`;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(TURN_SECRET), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(username)));
    const credential = btoa(String.fromCharCode(...sig));
    out.push({ urls: [`turn:${TURN_HOST}:80`, `turn:${TURN_HOST}:80?transport=tcp`, `turn:${TURN_HOST}:443`, `turns:${TURN_HOST}:443?transport=tcp`], username, credential });
  } catch { /* no WebCrypto (insecure origin): STUN only */ }
  return out;
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
  /** Client: connect to room `code`; resolves once the host has given us a seat. */
  join(code: string, timeoutMs = 25000): Promise<void> {
    this.code = code;
    return new Promise((resolve, reject) => {
      let done = false;
      const fail = (msg: string) => { if (done) return; done = true; clearTimeout(to); this.close(); reject(new Error(msg)); };
      const to = setTimeout(() => fail(this.sawHost
        ? `Found room ${code} but couldn't open a direct link — a strict NAT/firewall is blocking peer-to-peer (TURN relay fallback also failed). Try another network (e.g. phone hotspot).`
        : `Timed out reaching room ${code} — check your connection and try again.`), timeoutMs);
      const wire = (conn: Conn) => {
        conn.on('open', () => { this.sawHost = true; this.rx(conn); conn.send({ t: 'hello', tok: seatToken() }); });
        conn.on('data', (d) => {
          const m = d as Msg; this.rx(conn);
          if (m.t === 'hb') return;
          if (!done) {
            if (m.t === 'full') return fail(`Room ${code} is full`);
            if (m.t === 'started') return fail(`Room ${code} is already in a match (no free seat)`);
            if (m.t !== 'welcome') return;
            done = true; clearTimeout(to); this.conns.set(0, conn); this.startHb(); resolve();
          }
          if (m.t === 'bye') this.endReason = 'bye';
          this.onMsg(0, m);
        });
        conn.on('close', () => { this.lastRx.delete(conn); if (!done) return fail(`Room ${code} closed while joining`); if (this.conns.get(0) === conn) { this.conns.delete(0); this.onLeave(0); } });
        conn.on('error', (e) => { if ((e as { type?: string })?.type === 'peer-unavailable') fail(`Room ${code} not found — check the code, or ask the host to open it again`); });
      };
      const ru = relayUrl();
      if (ru) {
        const ep = new RelayEndpoint(ru, 'c-' + Math.random().toString(36).slice(2), () => wire(ep.connect(PEER_PREFIX + code)));
        this.relay = ep; return;
      }
      void this.opts().then((opts) => {
        if (done) return;
        const p = new Peer(opts);
        this.peer = p;
        p.on('open', () => wire(p.connect(PEER_PREFIX + code, { reliable: true, serialization: 'json' }) as unknown as Conn));
        p.on('error', (err: { type?: string; message?: string }) => {
          if (err.type === 'peer-unavailable') fail(`Room ${code} not found — check the code, or ask the host to open it again`);
          else if (!this.conns.size) fail(brokerErr(err));
        });
      });
    });
  }
  private sawHost = false;
  send(pid: number, m: Msg) {
    const c = this.conns.get(pid); if (!c || !c.open) return;
    try { c.send(m); this.sent++; } catch { /* channel closing */ }
  }
  broadcast(m: Msg) { for (const pid of this.conns.keys()) this.send(pid, m); }
  /** Host: tell everyone we're leaving on purpose (so clients don't offer a rejoin). */
  bye() { this.broadcast({ t: 'bye' }); }
  close() { clearInterval(this.hb); this.hb = 0; for (const c of this.conns.values()) try { c.close(); } catch { /* */ } this.conns.clear(); try { this.peer?.destroy(); } catch { /* */ } this.peer = null; this.relay?.destroy(); this.relay = null; }
}

function brokerErr(err: { type?: string; message?: string }) {
  if (err.type === 'network' || err.type === 'server-error' || err.type === 'socket-error' || err.type === 'socket-closed')
    return "Couldn't reach the matchmaking server — check your internet connection";
  if (err.type === 'browser-incompatible' || err.type === 'webrtc') return 'This browser does not support WebRTC peer-to-peer';
  return err.message ?? String(err.type);
}
