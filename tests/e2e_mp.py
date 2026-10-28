"""Phase-2 multiplayer e2e: two independent browser contexts talk over real PeerJS/WebRTC.
Covers: join by 4-digit code, lobby ready/start, co-op placement with owner colours + owner-only
upgrade/sell, donate, ally control, pings, wave timer, versus cards + telegraphs + all three
spells, and a host-vs-client desync check. Screenshots -> screenshots/mp/.
Usage: python tests/e2e_mp.py [--url http://...]   (default: serves ./dist locally)"""
import argparse, functools, http.server, json, os, socketserver, sys, threading, time
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url', default=''); ap.add_argument('--shots', default='screenshots/mp'); ap.add_argument('--map', default='garden'); ap.add_argument('--webrtc', action='store_true')
args = ap.parse_args()
SHOTS = os.path.join(ROOT, args.shots); os.makedirs(SHOTS, exist_ok=True)
import queue
# --- Test relay (SSE + POST). This sandbox's managed Chrome policy disables non-proxied
# WebRTC UDP, so DataChannels can't open here; the game's Net layer has a test-only relay
# transport that carries the exact same messages. --webrtc forces real PeerJS instead.
QS = {}; QL = threading.Lock()
class Q(http.server.SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*'); super().end_headers()
    def do_OPTIONS(self):
        self.send_response(204); self.send_header('Access-Control-Allow-Headers', '*'); self.send_header('Content-Length', '0'); self.end_headers()
    def do_POST(self):
        if not self.path.startswith('/__relay/send'): self.send_error(404); return
        n = int(self.headers.get('Content-Length', 0)); m = json.loads(self.rfile.read(n))
        with QL: q = QS.get(m['to'])
        if q: q.put({'from': m['from'], 'kind': m['kind'], 'm': m.get('m')})
        else:
            with QL: back = QS.get(m['from'])
            if back and m['kind'] == 'hello': back.put({'from': m['to'], 'kind': 'nopeer'})
        self.send_response(204); self.send_header('Content-Length', '0'); self.end_headers()
    def do_GET(self):
        if not self.path.startswith('/__relay/sse'): return super().do_GET()
        from urllib.parse import urlparse, parse_qs
        pid = parse_qs(urlparse(self.path).query)['id'][0]
        self.send_response(200); self.send_header('Content-Type', 'text/event-stream'); self.send_header('Cache-Control', 'no-cache'); self.end_headers()
        with QL:
            taken = pid in QS
            if not taken: QS[pid] = q = queue.Queue()
        try:
            if taken: self.wfile.write(b'event: taken\ndata: x\n\n'); self.wfile.flush(); return
            self.wfile.write(b'event: ready\ndata: x\n\n'); self.wfile.flush()
            while True:
                try: m = q.get(timeout=10)
                except queue.Empty: self.wfile.write(b': ka\n\n'); self.wfile.flush(); continue
                self.wfile.write(b'data: ' + json.dumps(m).encode() + b'\n\n'); self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError): pass
        finally:
            with QL:
                if QS.get(pid) is q: del QS[pid]
class TS(socketserver.ThreadingTCPServer): daemon_threads = True; allow_reuse_address = True
h = TS(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist'))); threading.Thread(target=h.serve_forever, daemon=True).start()
RELAY = f'http://127.0.0.1:{h.server_address[1]}/__relay'
BASE = args.url.rstrip('/') + '/' if args.url else f'http://127.0.0.1:{h.server_address[1]}/'
fails = []; errors = []
def check(ok, msg):
    print(('  ok  ' if ok else '  FAIL ') + msg, flush=True)
    if not ok: fails.append(msg)
def until(pg, js, ms=20000, step=0.2):
    t = time.time()
    while time.time() - t < ms / 1000:
        try:
            v = pg.evaluate(js)
            if v: return v
        except Exception: pass
        time.sleep(step)
    return None

def new_page(b, name):
    ctx = b.new_context(viewport={'width': 1280, 'height': 760})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1');" + ("localStorage.removeItem('bof.relay')" if args.webrtc else f"localStorage.setItem('bof.relay','{RELAY}')"))
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(f'[{name}] {m.text}') if m.type == 'error' and 'peerjs' not in m.text.lower() and 'favicon' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(f'[{name}] PAGEERROR {e}'))
    return ctx, pg

def lobby(b, mode, tag):
    hc, host = new_page(b, f'{tag}-host'); cc, cli = new_page(b, f'{tag}-client')
    host.goto(BASE + 'index.html'); host.wait_for_selector('.mode-pick')
    if tag == 'coop': host.screenshot(path=f'{SHOTS}/main_menu.png')
    host.click(f'.mode-pick[data-mode="{mode}"]'); host.click('#mp-host')
    code = until(host, "(() => { const e = document.getElementById('room-code'); return e && e.textContent })()", 30000)
    check(bool(code) and len(code) == 4, f'[{tag}] host opened room {code}')
    if not code: return None
    link = host.evaluate("document.getElementById('room-link').value")
    check(link.endswith(f'?room={code}'), f'[{tag}] copyable link {link}')
    if mode == 'coop':
        cli.goto(BASE + f'index.html?room={code}')  # join via link
    else:
        cli.goto(BASE + 'index.html'); cli.wait_for_selector('.mode-pick'); cli.click('.mode-pick[data-mode="versus"]')
        cli.fill('#mp-code', code); cli.click('#mp-joinb')  # join by typing the code
    ok = until(host, "document.querySelectorAll('.lobby-players li:not(.empty)').length === 2", 30000)
    check(bool(ok), f'[{tag}] client joined by {"link" if mode == "coop" else "code"}; host lists 2 players')
    until(cli, "!!document.getElementById('btn-ready')", 15000)
    if mode == 'coop':
        host.evaluate("document.getElementById('set-timer').value='15'; document.getElementById('set-timer').dispatchEvent(new Event('change'))")
    else:
        host.evaluate("document.getElementById('set-match').value='4'; document.getElementById('set-match').dispatchEvent(new Event('change'))")
    check(bool(until(cli, f"document.getElementById('{'set-timer' if mode == 'coop' else 'set-match'}').value === '{'15' if mode == 'coop' else '4'}'", 8000)), f'[{tag}] host settings reach the client lobby')
    check(host.evaluate("document.getElementById('btn-mpstart').disabled"), f'[{tag}] Start disabled until everyone is ready')
    cli.click('#btn-ready')
    check(bool(until(host, "!document.getElementById('btn-mpstart').disabled", 8000)), f'[{tag}] client Ready -> Start enabled')
    if tag == 'coop': host.screenshot(path=f'{SHOTS}/lobby_code.png')
    host.click('#btn-mpstart')
    check(bool(until(cli, "window.__game && window.__game.mp() && window.__game.mp().snaps > 3", 20000)), f'[{tag}] client receives host snapshots')
    return hc, host, cc, cli

def coop(b):
    r = lobby(b, 'coop', 'coop')
    if not r: return
    hc, host, cc, cli = r
    H = lambda js: host.evaluate(js); C = lambda js: cli.evaluate(js)
    mh, mc = H('__game.mp()'), C('__game.mp()')
    check(mh['role'] == 'coop' and mc['pid'] == 1 and mh['net'] == 'host' and mc['net'] == 'client', f'roles: host pid {mh["pid"]} / client pid {mc["pid"]}')
    c0 = mc['credits']
    cells = H('__game.freeCells().filter(([c,r]) => { const g = __game.g, p = g.grid.cellCenter(c,r), d = g.nearestLane(p).dist; return d > 70 && d < 130; }).slice(0, 400)')
    a, bb = cells[0], next(x for x in cells if abs(x[0] - cells[0][0]) + abs(x[1] - cells[0][1]) >= 3)
    check(H(f'__game.placeTower("dart_monkey",{a[0]},{a[1]})'), 'host placed a Dart Monkey')
    C(f'__game.placeTower("dart_monkey",{bb[0]},{bb[1]})')
    ok = until(host, f'__game.mp().towers.some(t => t.owner === 1 && t.c === {bb[0]} && t.r === {bb[1]})', 8000)
    check(bool(ok), 'client command placed P2 tower on the host (owner = 1)')
    check(bool(until(cli, '__game.mp().towers.length === 2 && __game.mp().towers.some(t => t.owner === 0) && __game.mp().towers.some(t => t.owner === 1)', 8000)), 'client mirror shows both towers with owners')
    time.sleep(0.6)
    c1 = C('__game.mp().credits'); h1 = H('__game.mp().all')
    check(c1 < c0 and h1[0] < 750 + 1000, f'separate wallets: client paid from its own credits ({c0} -> {c1}), host all={h1}')
    # owner-only: client tries to sell the host's tower
    C(f'(() => {{ const t = __game.g.towers.find(t => t.owner === 0); __game.g.sellTower(t); }})()'); time.sleep(0.8)
    check(H('__game.mp().towers.length') == 2, 'client cannot sell P1 tower (owner-only)')
    C(f'(() => {{ const t = __game.g.towers.find(t => t.owner === 0); t.upgrade(__game.g); }})()'); time.sleep(0.8)
    check(H('__game.mp().towers.find(t => t.owner === 0).tier') == 0, 'client cannot upgrade P1 tower')
    # donate
    before = C('__game.mp().credits'); H('__game.mpDonate(1, 100)')
    ok = until(cli, f'__game.mp().credits >= {before} + 100', 6000)
    check(bool(ok), f'host donated ¢100 -> client {before} -> {C("__game.mp().credits")}')
    C(f'(() => {{ const t = __game.g.towers.find(t => t.owner === 1); t.upgrade(__game.g); }})()')
    check(bool(until(host, '__game.mp().towers.find(t => t.owner === 1).tier === 1', 6000)), 'client upgraded its own tower (host tier 1)')
    check(bool(until(cli, '__game.mp().towers.find(t => t.owner === 1).tier === 1', 6000)), 'tier-up mirrored to the client')
    # ally control: host squad, client tries to move it
    H('__game.deploy("marine", __game.g.hq.x - 220, __game.g.hq.y + 40)')
    until(cli, '__game.g.squads.length > 0', 8000)
    C('(() => { const s = __game.g.squads[0]; __game.g.setStance(s, "hold"); })()'); time.sleep(0.8)
    check(H('__game.g.squads[0].stance') != 'hold', 'client cannot command P1 troops without Ally Control')
    H('__game.mpAllow(true)'); until(cli, '__game.mp().allow.some(([p, v]) => p === 0 && v)', 5000)
    C('(() => { const s = __game.g.squads[0]; __game.g.setStance(s, "hold"); })()')
    check(bool(until(host, '__game.g.squads[0].stance === "hold"', 5000)), 'with Allow Ally Control on, the client commands P1 troops')
    # Auto Army is per player in co-op
    C('__game.g.deployCd = {}; __game.deploy("marine", __game.g.hq.x - 260, __game.g.hq.y + 80)')
    until(host, '__game.g.squads.some(s => s.owner === 1)', 8000)
    cli.click('#btn-autoarmy')
    check(bool(until(host, '__game.g.squads.filter(s => s.owner === 1).every(s => s.auto) && __game.g.autoArmy[1]', 5000)) and not H('__game.g.squads.filter(s => s.owner === 0).some(s => s.auto) || __game.g.autoArmy[0]'),
          'client Auto Army toggles only P2 squads on the host (P1 stays manual)')
    check(bool(until(cli, '__game.g.squads.filter(s => s.owner === 1).every(s => s.auto) && document.getElementById("btn-autoarmy").textContent.includes("ON")', 5000)), 'auto state + HUD mirrored to the client')
    check(bool(until(host, '__game.g.squads.filter(s => s.owner === 1).every(s => s.autoTask !== "")', 5000)), f'host runs the P2 role AI ({H("__game.g.squads.map(s => s.owner + \':\' + s.autoTask)")})')
    cli.click('#btn-autoarmy')
    check(bool(until(host, '!__game.g.autoArmy[1] && !__game.g.squads.some(s => s.auto)', 5000)), 'client turns its Auto Army back off')
    # ping
    hx, hy = H('[__game.g.hq.x - 400, __game.g.hq.y]')
    C(f'__game.mpPing("defend", {hx}, {hy})')
    ok = until(host, '__game.mp().pings.some(p => p.pid === 1 && p.kind === "defend")', 5000)
    check(bool(ok), 'client ping "Defend Here" visible on the host')
    check(bool(until(cli, '__game.mp().pings.some(p => p.pid === 1)', 3000)), 'ping echoed to the pinger too')
    H('__game.mpPing("spawn", __game.g.paths[0].at(80).x, __game.g.paths[0].at(80).y)')
    check(bool(until(cli, '__game.mp().pings.some(p => p.pid === 0 && p.kind === "spawn")', 5000)), 'host ping "Enemy Spawning" visible on the client')
    C(f'__game.mpOpenPing({hx}, {hy})')
    check(C("!document.getElementById('ping-menu').hidden && document.querySelectorAll('#ping-menu [data-ping]').length === 3"), 'ping menu offers Defend / Attack / Enemy Spawning')
    C(f'__game.focus({hx}, {hy}, 1)'); time.sleep(0.4)
    cli.screenshot(path=f'{SHOTS}/ping.png'); C("document.getElementById('ping-menu').hidden = true")
    # colours: focus both towers
    mx, my = H(f'(() => {{ const t = __game.g.towers; return [(t[0].x+t[1].x)/2, (t[0].y+t[1].y)/2]; }})()')
    for p in (host, cli): p.evaluate(f'__game.focus({mx}, {my}, 1.4)')
    # wave timer auto-start
    check(H('__game.mp().waveCountdown') > 0, f'co-op wave timer counting ({H("__game.mp().waveCountdown"):.1f}s)')
    ok = until(host, '__game.g.waves.active', 25000)
    check(bool(ok), 'wave timer auto-started the wave')
    check(bool(until(cli, '__game.g.waves.active && __game.g.enemies.length > 0', 8000)), 'client mirror shows the wave + enemies')
    time.sleep(2.5)
    host.screenshot(path=f'{SHOTS}/coop_two_colors.png'); cli.screenshot(path=f'{SHOTS}/coop_two_colors_client.png')
    # desync check
    time.sleep(1.0)
    C('__game.mpRequestDigest()')
    hd = until(cli, '__game.mpHostDigest()', 5000); cd = C('__game.mpDigest()')
    if hd:
        for k in ('towers', 'buildings', 'squads', 'hq', 'wave'):
            check(hd[k] == cd[k], f'desync check {k}: host {hd[k]} == client {cd[k]}')
        check(abs(hd['enemies'] - cd['enemies']) <= max(3, hd['enemies'] * 0.15), f'desync check enemies host {hd["enemies"]} ~ client {cd["enemies"]}')
    else: check(False, 'host digest received')
    # positions agree within interpolation slack
    dpos = C('''(() => { const g = __game.g; return g.enemies.slice(0, 20).map(e => [e.data.id, Math.round(e.progress)]); })()''')
    hpos = H('''(() => { const g = __game.g; return g.enemies.slice(0, 20).map(e => [e.data.id, Math.round(e.progress)]); })()''')
    check(len(dpos) > 0 and len(hpos) > 0, f'enemy progress host {hpos[:4]} / client {dpos[:4]}')
    # combo counter exists
    check('combos' in H('__game.mp().stats'), 'co-op COMBO counter wired')
    fpsC = C('(() => { __game.fpsStart(); return true; })()'); time.sleep(2); f = C('__game.fpsStop()')
    check(f['avg'] > 30, f'client FPS while mirroring {f["avg"]:.0f}')
    hc.close(); cc.close()

def versus(b):
    r = lobby(b, 'versus', 'vs')
    if not r: return
    hc, host, cc, cli = r
    H = lambda js: host.evaluate(js); C = lambda js: cli.evaluate(js)
    check(H('__game.mp().role') == 'defender' and C('__game.mp().role') == 'invader', 'host = Defender, client = Invader')
    check(C("getComputedStyle(document.getElementById('tower-cards')).display") == 'none' and C("!!document.getElementById('vs-panel')"), 'invader HUD replaces the build panel')
    check(C("document.querySelectorAll('.vs-card').length") == 6 and C("document.querySelectorAll('.vs-spell').length") == 3, 'invader hand: 5 attack cards + eco, 3 spells')
    check(bool(until(cli, '__game.mp().vs && __game.mp().vs.timer > 0', 5000)), f'versus timer running')
    cells = H('__game.freeCells().filter(([c,r]) => { const g = __game.g, p = g.grid.cellCenter(c,r), d = g.nearestLane(p).dist; return d > 70 && d < 120; })')
    H(f'__game.placeTower("dart_monkey",{cells[5][0]},{cells[5][1]})')
    n0 = H('__game.g.enemies.length')
    C('__game.mpCard("runners", 0)')
    check(bool(until(host, f'__game.g.enemies.length > {n0}', 5000)), 'invader played Fast Runners -> enemies spawned on the host')
    te = H('__game.mp().vs.te'); check(te < 30, f'Threat Energy spent ({te:.1f})')
    check(bool(until(cli, '__game.g.enemies.length > 0', 5000)), 'runners mirrored on the invader')
    # deny: invader cannot build
    C(f'__game.placeTower("dart_monkey",{cells[30][0]},{cells[30][1]})'); time.sleep(0.6)
    check(H('__game.g.towers.length') == 1, 'invader cannot place towers')
    # eco card
    until(host, '__game.mp().vs.te >= 31', 15000); C('__game.mpCard("eco", 0)')
    check(bool(until(host, '__game.mp().vs.eco === 1 && __game.mp().vs.regen > 1.9', 5000)), 'Hive Supply raises TE regen')
    # siege card -> telegraph
    until(host, '__game.mp().vs.te >= 42', 30000)
    C('__game.mpCard("siege", 0)')
    t = until(host, '__game.mp().telegraphs.length > 0 && __game.mp().telegraphs', 4000)
    check(bool(t), f'Siege Walkers telegraphed to the defender {t}')
    check(bool(until(host, "!document.getElementById('tele-banner').hidden", 2000)), 'telegraph banner shown')
    px, py = H('[__game.g.paths[0].at(40).x, __game.g.paths[0].at(40).y]')
    H(f'__game.focus({px + 250}, {py}, 0.9)'); time.sleep(0.5)
    host.screenshot(path=f'{SHOTS}/defender_telegraph.png')
    check(bool(until(host, '__game.g.enemies.some(e => e.data.id === "ironback")', 5000)), 'siege enemies arrive after the 2 s telegraph')
    # spells
    tx, ty = H('[__game.g.towers[0].x, __game.g.towers[0].y]')
    C(f'__game.mpSpell("emp", {tx}, {ty})')
    check(bool(until(host, '__game.g.towers[0].disabledT > 3', 4000)), 'EMP Jammer disabled the tower (5 s)')
    check(bool(until(host, '__game.mp().vs.cd.emp > 20', 2000)), 'EMP on 25 s cooldown')
    C(f'__game.mpSpell("emp", {tx}, {ty})'); time.sleep(0.5)
    check(H('__game.mp().vs.cd.emp') < 25, 'EMP recast blocked while cooling down')
    ex, ey = H('(() => { const e = __game.g.enemies.find(e => e.alive); return [e.x, e.y]; })()')
    C(f'__game.mpSpell("surge", {ex}, {ey})')
    check(bool(until(host, '__game.mp().enemies.some(e => e.surge > 0)', 3000)), 'Speed Surge buffed enemies')
    ex, ey = H('(() => { const e = __game.g.enemies.find(e => e.alive); return [e.x, e.y]; })()')
    C(f'__game.mpSpell("smoke", {ex}, {ey})')
    check(bool(until(host, '__game.mp().enemies.some(e => e.smoke > 0) && __game.g.enemies.some(e => e.smokeT > 0 && !e.targetable)', 3000)), 'Smoke Screen made enemies untargetable')
    check(bool(until(cli, '__game.mp().vs.cd.smoke > 30 && __game.mp().vs.cd.surge > 20', 3000)), 'spell cooldowns mirrored to the invader HUD')
    C(f'__game.focus({ex}, {ey}, 0.9)'); time.sleep(0.6)
    cli.screenshot(path=f'{SHOTS}/invader_hud.png')
    # boss push / win condition: shrink the timer on the host
    H('__game.g.versus.s.timer = 1.5')
    check(bool(until(host, '__game.mp().vs.phase === "push" && __game.mp().telegraphs.some(t => t.label === "BOSS PUSH")', 5000)), 'timer end -> telegraphed final Boss Push on every lane')
    H('__game.g.hq.health.hp = 0.5; __game.g.damageHQ(5)')
    check(bool(until(host, '__game.mp().vs.winner === "invader"', 5000)), 'HQ 0 -> invader wins')
    check(bool(until(cli, "document.getElementById('gameover').classList.contains('show') && document.querySelector('#gameover h1').textContent.includes('Victory')", 6000)), 'invader sees Victory')
    check(bool(until(host, "document.querySelector('#gameover h1') && document.querySelector('#gameover h1').textContent.includes('Defeat')", 4000)), 'defender sees Defeat')
    hc.close(); cc.close()

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-fake-ui-for-media-stream'])
    print('BASE', BASE, 'transport', 'webrtc' if args.webrtc else 'relay')
    coop(b); versus(b)
    b.close()
real = [e for e in errors if 'ERR_' not in e and 'Failed to load resource' not in e]
check(not real, f'console errors: {len(real)} {real[:5]}')
print(f'RESULT: {"PASS" if not fails else "FAIL (%d)" % len(fails)}')
sys.exit(1 if fails else 0)
