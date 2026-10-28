// =============================================================================
// NET: thin WebRTC P2P layer over PeerJS (public PeerJS cloud broker for
// signalling, Google/Twilio public STUN for NAT traversal, no TURN relay).
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
  onJoin: (pid: number) => void = () => {};
  onLeave: (pid: number) => void = () => {};
  onStatus: (s: string) => void = () => {};
  /** Bytes sent (debug / HUD). */
  sent = 0;
  constructor(readonly role: 'host' | 'client', readonly maxPlayers = 4) {}

  private opts() { return { debug: 1 as const, config: { iceServers: ICE } }; }

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
    return new Promise((resolve, reject) => {
      const attempt = (c: string, left: number) => {
        const p = new Peer(PEER_PREFIX + c, this.opts());
        p.on('open', () => { this.peer = p; this.code = c; this.onStatus(`Room ${c} open`); resolve(c); });
        p.on('error', (err: { type?: string; message?: string }) => {
          if (err.type === 'unavailable-id' && left > 0) { p.destroy(); attempt(randCode(), left - 1); return; }
          if (!this.peer) { reject(new Error(err.message ?? String(err.type))); return; }
          this.onStatus(`Network: ${err.type ?? err.message}`);
        });
        p.on('connection', (conn) => this.accept(conn));
        p.on('disconnected', () => { this.onStatus('Broker link lost — reconnecting…'); try { p.reconnect(); } catch { /* */ } });
      };
      attempt(code, tries);
    });
  }
  private accept(conn: Conn) {
    conn.on('open', () => {
      let pid = 1; while (this.conns.has(pid)) pid++;
      if (pid >= this.maxPlayers) { conn.send({ t: 'full' }); setTimeout(() => conn.close(), 300); return; }
      this.conns.set(pid, conn);
      conn.on('data', (d) => this.onMsg(pid, d as Msg));
      conn.on('close', () => { if (this.conns.get(pid) === conn) { this.conns.delete(pid); this.onLeave(pid); } });
      this.onJoin(pid);
    });
  }
  /** Client: connect to room `code`; resolves once the DataChannel is open. */
  join(code: string, timeoutMs = 20000): Promise<void> {
    const ru = relayUrl();
    if (ru) return new Promise((resolve, reject) => {
      this.code = code;
      const to = setTimeout(() => reject(new Error('Timed out connecting (NAT/firewall may block P2P)')), timeoutMs);
      const ep = new RelayEndpoint(ru, 'c-' + Math.random().toString(36).slice(2), () => {
        const conn = ep.connect(PEER_PREFIX + code);
        conn.on('open', () => { clearTimeout(to); this.conns.set(0, conn); resolve(); });
        conn.on('data', (d) => this.onMsg(0, d as Msg));
        conn.on('close', () => { this.conns.delete(0); this.onLeave(0); });
        conn.on('error', () => { clearTimeout(to); reject(new Error(`Room ${code} not found`)); });
      });
      this.relay = ep;
    });
    return new Promise((resolve, reject) => {
      const p = new Peer(this.opts());
      this.peer = p; this.code = code;
      const to = setTimeout(() => reject(new Error('Timed out connecting (NAT/firewall may block P2P)')), timeoutMs);
      p.on('open', () => {
        const conn = p.connect(PEER_PREFIX + code, { reliable: true, serialization: 'json' });
        conn.on('open', () => { clearTimeout(to); this.conns.set(0, conn); resolve(); });
        conn.on('data', (d) => this.onMsg(0, d as Msg));
        conn.on('close', () => { this.conns.delete(0); this.onLeave(0); });
      });
      p.on('error', (err: { type?: string; message?: string }) => {
        clearTimeout(to);
        reject(new Error(err.type === 'peer-unavailable' ? `Room ${code} not found` : err.message ?? String(err.type)));
      });
    });
  }
  send(pid: number, m: Msg) {
    const c = this.conns.get(pid); if (!c || !c.open) return;
    try { c.send(m); this.sent++; } catch { /* channel closing */ }
  }
  broadcast(m: Msg) { for (const pid of this.conns.keys()) this.send(pid, m); }
  close() { for (const c of this.conns.values()) try { c.close(); } catch { /* */ } this.conns.clear(); try { this.peer?.destroy(); } catch { /* */ } this.peer = null; this.relay?.destroy(); this.relay = null; }
}
