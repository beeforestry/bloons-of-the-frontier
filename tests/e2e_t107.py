"""t107 e2e: PHYSICS-LITE DEATH EFFECTS.
  A. Normal kills: bugs break into sprite slices + a body that tips over in the hit direction, balloons pop into rubber shreds
     (+ light shreds per layer); pieces fly biased along the hit, fall under gravity, bounce, fade and are cleaned up (~1.2 s).
  B. Explosion: more pieces, wider spread, no standing body, a scorch mark that lingers; small shake.
  C. Burn (charred pieces + embers), ice (ice shards), SHATTER combo (frozen + heavy hit -> extra shards), shock (sparks).
  D. Boss: stronger version (more pieces, lingers longer, slow-mo + shake).
  E. Caps: a 90-kill burst stays under the global cap; mobile viewport uses the lower cap + heavy-load mode.
  F. Real fight: towers killing a wave produce death events of several causes, no errors.
  G. First person: the enemy GLB splits into 2-4 parts with hit impulse + gravity, lands on the ground, pooled + capped, cause variants.
  H. Co-op: the client replays the host's death events (2D debris) with the same causes.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t107.py [--url URL] [--tag live] [--no-shots] [--only ABCDEFGH]"""
import argparse, functools, http.server, json, os, socketserver, threading, time, queue
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--only', default='ABCDEFGH'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't107'); os.makedirs(OUT, exist_ok=True)
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
URL = (args.url if args.url.endswith('/') or args.url.endswith('.html') else args.url + '/') if args.url else f'http://127.0.0.1:{h.server_address[1]}/index.html'
BASEURL = URL[:-len('index.html')] if URL.endswith('index.html') else URL
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS', 'favicon')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if args.no_shots: return
    path = os.path.join(OUT, f'{args.tag}_{name}.png'); pg.screenshot(path=path); print('  shot', path, flush=True)
PLACE = """(id, lane, frac, off) => { const g = H.g, p = g.paths[lane];
  for (const o of [off, off + 18, off + 36, off + 54, -off, -off - 18, -off - 36, -off - 54]) for (const dd of [0, 30, -30, 60, -60, 90, -90]) {
    const b = p.at(Math.max(0, Math.min(p.length, p.length * frac + dd))); const x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
    const s = g.placementSpot(id, { x, y }); if (!s) continue; const t = g.placeTower(id, s); if (t) return g.towers.indexOf(t); }
  return -1; }"""
NEXTTO = """(id, i, k = 1) => { const g = H.g, a = g.towers[i], R = (g.towerRadius(id) + g.towerRadius(a.data.id) + 6) * k;
  for (let s = 0; s < 24; s++) { const an = s * Math.PI / 12, q = g.placementSpot(id, { x: a.x + Math.cos(an) * R, y: a.y + Math.sin(an) * R }); if (!q) continue;
    const t = g.placeTower(id, q); if (t) return g.towers.indexOf(t); } return -1; }"""
MAXUP = "(i) => { const t = H.g.towers[i]; while (t.upgrade(H.g)) {} return t.tier; }"
PLACE = """(id, lane, frac, off) => { const g = H.g, n = g.paths.length;
  for (const L of [lane % n, ...[...Array(n).keys()].filter((i) => i !== lane % n)]) { const p = g.paths[L];
    for (const df of [0, 0.03, -0.03, 0.06, -0.06, 0.1, -0.1, 0.15, -0.15, 0.2, -0.2, 0.3, -0.3]) { const f = Math.min(0.95, Math.max(0.05, frac + df));
      for (const o of [off, off + 18, off + 36, -off, -off - 18, -off - 36, off + 60, -off - 60]) for (const dd of [0, 30, -30]) {
        const b = p.at(Math.max(0, Math.min(p.length, p.length * f + dd))); const x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
        const s = g.placementSpot(id, { x, y }); if (!s) continue; const t = g.placeTower(id, s); if (t) return g.towers.indexOf(t); } } }
  return -1; }"""
MAXB = "(i, b) => { const t = H.g.towers[i]; while (t.upgrade(H.g, b)) {} return t.tier; }"
SIM = "(n) => { const g = H.g; const p = g.paused; g.paused = false; for (let k = 0; k < n; k++) g.step(1 / 60); g.paused = p; return g.stats; }"
with sync_playwright() as p:
    br = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = br.new_context(viewport={'width': 1440, 'height': 860}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    def load(m='tropical'):
        pg.goto(URL + sep + f'map={m}&diff=medium', timeout=90000); pg.wait_for_function('window.__game', timeout=60000); pg.wait_for_timeout(800)
    bi = lambda i: G(f'H.branchInfo({i})')
    warn = []
    DF = lambda: G('H.deathFx()')
    def arena(specs, frac=0.45, focus=1.7):
        """Spawn enemies side by side along lane 0 (frozen in place), focus the camera on them; returns uids."""
        G('H.killAllEnemies()'); G('H.g.paused = false')
        uids = [G(f'H.spawn("{e}", 0, {frac + i * 0.012:.4f}, 1)') for i, e in enumerate(specs)]
        G(f'(() => {{ const g = H.g; g.enemies.forEach(x => x.speedK = 0); const m = g.enemies[Math.floor(g.enemies.length / 2)]; H.focus(m.x, m.y, {focus}); }})()')
        pg.wait_for_timeout(450); return uids
    def kill(uids, typ, elem=None, side=-60):
        for u in uids:
            G(f'(() => {{ const e = H.g.enemies.find(x => x.uid === {u}); return e && H.killWith({u}, "{typ}", e.x + {side}, e.y, {json.dumps(elem) if elem else "undefined"}); }})()')
    def gtime_wait(dt, ms=30000):
        t0 = G('H.g.time'); until(f'H.g.time > {t0} + {dt}', ms)
    def load(m='morro'):
        pg.goto(URL + sep + f'map={m}&diff=medium', timeout=90000); pg.wait_for_function('window.__game', timeout=60000); pg.wait_for_timeout(800)
        pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(200000)')

    # ---------------------------------------------------------------- A: normal kills
    if 'A' in args.only:
        load()
        s0 = DF(); uids = arena(['hunter', 'charger', 'red', 'ironback', 'scavenger'])
        kill(uids, 'sharp'); pg.wait_for_timeout(60); d = DF()
        ev = d['stats']['events'] - s0['stats']['events']; per = (d['stats']['spawned'] - s0['stats']['spawned']) / max(1, ev)
        check(ev == 5 and all(x['cause'] == 'normal' for x in d['last'][-5:]), f'5 kills -> 5 normal death events ({[x["cause"] for x in d["last"][-5:]]})')
        check(3 <= per <= 7, f'{per:.1f} pieces per kill (3-6 + knot)')
        k = d['kinds']; check(k.get('3', 0) >= 3 and k.get('0', 0) >= 6, f'bugs: tipping bodies ({k.get("3", 0)}) + sprite slices ({k.get("0", 0)})')
        check(k.get('1', 0) >= 3 and k.get('5', 0) >= 1, f'balloon: rubber shreds ({k.get("1", 0)}) + knot ({k.get("5", 0)})')
        dirs = G('H.g.deaths.slice(-5).map(d => d.dx)'); check(all(x > 0.9 for x in dirs), f'hit from the left -> hit direction +x {dirs}')
        pg.wait_for_timeout(120); shot(pg, 'death_normal')
        flown = G('H.debrisBias()')
        check(flown is not None and flown > 0.6, f'pieces fly biased along the hit: {flown and round(flown, 2)} of the flying pieces moving +x')
        z1 = DF()['maxZ']; gtime_wait(0.9); z2 = DF()
        check(z1 > 5 and z2['maxZ'] < z1, f'gravity: max height {z1:.0f}px -> {z2["maxZ"]:.0f}px')
        gtime_wait(1.0); check(DF()['debris'] == 0, 'all fragments cleaned up within ~2 s')
        # balloon layers: a pink pops 4 layers before it dies -> light layer shreds each time
        s0 = DF(); u = arena(['pink']); kill(u[:1], 'sharp'); pg.wait_for_timeout(60)
        lay = G(f'H.g.deaths.filter(d => d.seq > {s0["seq"]} && d.layer).length'); fin = G(f'H.g.deaths.filter(d => d.seq > {s0["seq"]} && !d.layer).length')
        check(lay == 4 and fin == 1, f'pink -> 4 layer pops (shreds) + 1 final pop ({lay}, {fin})')

    # ---------------------------------------------------------------- B: explosion
    if 'B' in args.only:
        load(); s0 = DF(); uids = arena(['hunter', 'charger', 'scavenger', 'ironback'])
        sh0 = G('H.g.shakeAmt || 0')
        kill(uids, 'explosive'); pg.wait_for_timeout(60); d = DF()
        ev = d['stats']['events'] - s0['stats']['events']; per = (d['stats']['spawned'] - s0['stats']['spawned']) / max(1, ev)
        check(all(x['cause'] == 'boom' for x in d['last'][-4:]), 'explosive kills -> boom events')
        check(per >= 6, f'{per:.1f} pieces per explosion kill (more than normal)')
        check(d['ground'] >= 3 and d['kinds'].get('3', 0) == 0, f'scorch marks ({d["ground"]}), bodies blown apart (no tipping body)')
        check(G('H.g.shakeAmt || 0') > sh0, 'small camera shake')
        pg.wait_for_timeout(100); shot(pg, 'death_explosion')
        gtime_wait(1.8); d2 = DF(); check(d2['ground'] >= 3 and d2['debris'] < d['debris'], f'scorch lingers after the pieces ({d2["ground"]} scorch, {d2["debris"]} pieces)')

    # ---------------------------------------------------------------- C: burn / ice / shatter / shock
    if 'C' in args.only:
        load()
        u = arena(['hunter', 'charger', 'scavenger']); kill(u, 'fire', 'burn'); pg.wait_for_timeout(60)
        check(all(x['cause'] == 'burn' for x in DF()['last'][-3:]), 'fire kills -> burn (charred pieces + embers + ash)')
        pg.wait_for_timeout(100); shot(pg, 'death_burn')
        u = arena(['hunter', 'charger', 'blue']); kill(u, 'cold', 'chill'); pg.wait_for_timeout(60); d = DF()
        check(all(x['cause'] == 'ice' for x in d['last'][-3:]) and d['kinds'].get('2', 0) >= 10, f'cold kills -> ice shards ({d["kinds"].get("2", 0)})')
        # SHATTER: chill, then a heavy (explosive) hit kills it
        u = arena(['charger', 'hunter', 'ironback'])
        for x in u: G(f'(() => {{ const e = H.g.enemies.find(q => q.uid === {x}); e.el.chill = 3; e.el.frozenT = 2; }})()')
        st0 = G('(H.g.stats.elem && H.g.stats.elem.shatter) || 0'); s0 = DF()
        kill(u, 'explosive'); pg.wait_for_timeout(60); d = DF()
        sh = G(f'H.g.deaths.filter(d => d.seq > {s0["seq"]} && d.cause === "ice" && d.shatter).length')
        check(sh == 3 and G('(H.g.stats.elem && H.g.stats.elem.shatter) || 0') > st0, f'SHATTER combo kills -> ice + shatter events ({sh})')
        shards = d['kinds'].get('2', 0)
        check(shards >= 24, f'shatter throws a big burst of ice shards ({shards})')
        pg.wait_for_timeout(90); shot(pg, 'death_ice_shatter')
        u = arena(['hunter', 'charger']); kill(u, 'energy', 'shock'); pg.wait_for_timeout(60)
        check(all(x['cause'] == 'shock' for x in DF()['last'][-2:]), 'shock kills -> sparks')

    # ---------------------------------------------------------------- D: boss
    if 'D' in args.only:
        load(); s0 = DF(); u = arena(['boss_scarab'], 0.45, 1.0)
        kill(u, 'explosive'); pg.wait_for_timeout(40); d = DF()
        n = d['stats']['spawned'] - s0['stats']['spawned']
        check(d['last'][-1]['boss'] and n >= 10, f'boss death: {n} pieces')
        check(d['slowT'] > 0, f'boss kill triggers slow motion ({d["slowT"]:.2f}s left)')
        pg.wait_for_timeout(100); shot(pg, 'death_boss')
        gtime_wait(1.3); check(DF()['debris'] > 0, 'boss debris lingers longer (still there after 1.3 s)')

    # ---------------------------------------------------------------- E: caps
    if 'E' in args.only:
        load()
        G('H.killAllEnemies()'); us = [G(f'H.spawn("hunter", 0, {0.40 + (i % 30) * 0.004:.4f}, 1)') for i in range(90)]
        G('(() => { const g = H.g; g.enemies.forEach(x => x.speedK = 0); const m = g.enemies[15]; H.focus(m.x, m.y, 1.0); })()'); pg.wait_for_timeout(400)
        kill(us, 'explosive'); pg.wait_for_timeout(50); d = DF()
        check(d['debris'] <= d['cap'] and d['stats']['skipped'] + d['stats']['simplified'] > 0, f'90 kills at once: {d["debris"]} pieces <= cap {d["cap"]} (skipped {d["stats"]["skipped"]}, simplified {d["stats"]["simplified"]})')
        mctx = br.new_context(viewport={'width': 412, 'height': 860}, device_scale_factor=2, is_mobile=True, has_touch=True); mctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
        mp = mctx.new_page(); mp.on('pageerror', lambda e: errors.append(f'[mobile] {e}'))
        mp.goto(URL + sep + 'map=morro&diff=medium', timeout=90000); mp.wait_for_function('window.__game', timeout=60000); mp.wait_for_timeout(1200)
        mp.evaluate("""(() => { const H = window.__game, g = H.g; H.killAllEnemies(); for (let i = 0; i < 60; i++) H.spawn('hunter', 0, 0.4 + (i % 20) * 0.005, 1);
          g.enemies.forEach(x => x.speedK = 0); const m = g.enemies[10]; H.focus(m.x, m.y, 1.0); })()"""); mp.wait_for_timeout(400)
        mp.evaluate("(() => { const H = window.__game; for (const e of [...H.g.enemies]) H.killWith(e.uid, 'explosive', e.x - 50, e.y); })()"); mp.wait_for_timeout(60)
        md = mp.evaluate('window.__game.deathFx()')
        check(md['cap'] <= 60 and md['debris'] <= md['cap'], f'mobile: lower cap {md["cap"]}, {md["debris"]} pieces live')
        mctx.close()

    # ---------------------------------------------------------------- F: real fight
    if 'F' in args.only:
        load(); s0 = DF()
        for i, tid in enumerate(['flame_melon_mortar', 'dart_monkey', 'tesla_coil', 'frost_wallnut_bastion', 'dart_monkey', 'flame_melon_mortar']):
            k = G(f'({PLACE})("{tid}", 0, {0.3 + i * 0.05:.3f}, 70)')
            if k >= 0: G(f'(() => {{ const t = H.g.towers[{k}]; while (t.upgrade(H.g, 0)) {{}} }})()')
        G('(() => { const g = H.g; g.waves.active = true; for (let i = 0; i < 40; i++) H.spawn(i % 3 ? "hunter" : "pink", 0, 0.1 + (i % 10) * 0.01, 2); const t = g.towers[0]; H.focus(t.x, t.y, 1.0); })()')
        gtime_wait(10, 90000); d = DF()
        causes = {k: v - s0['byCause'].get(k, 0) for k, v in d['byCause'].items() if v - s0['byCause'].get(k, 0) > 0}
        check(sum(causes.values()) >= 30 and len(causes) >= 2, f'towers killing a wave -> death events by cause {causes}')
        G('H.killAllEnemies()')

    # ---------------------------------------------------------------- G: first person
    if 'G' in args.only:
        load()
        at = G(f'({PLACE})("unsc_autoturret", 0, 0.35, 70)')
        G(f'H.selectTower({at})'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur', 90000); check(ok, 'possessed the Autoturret'); pg.wait_for_timeout(5000)
        FD = lambda: G('(() => { const P = window.__possess.cur, D = P.deathParts; return { live: D.live.length, cap: D.cap, stats: D.stats, ys: D.live.map(p => p.m.position.y), floor: D.live.map(p => p.floor) }; })()')
        def fp_round(typ, elem, specs=('hunter', 'charger', 'red', 'ironback')):
            G('H.killAllEnemies()'); us = [G(f'H.spawn("{e}", 0, {0.374 + i * 0.007:.4f}, 1)') for i, e in enumerate(specs)]
            G('H.g.enemies.forEach(x => x.speedK = 0)')
            G("""(() => { const P = window.__possess.cur, e = H.g.enemies[1]; if (P.aimAt) P.aimAt(e.x, e.y, P.eye().y - 1.2); if (P.el && P.el.msg) P.el.msg.style.visibility = 'hidden'; })()""")
            gtime_wait(1.2, 60000); s = FD()['stats']['parts']; kill(us, typ, elem, -40); gtime_wait(0.1, 30000); return FD(), s
        f1, p0 = fp_round('sharp', None)
        check(f1['live'] >= 8 and f1['stats']['parts'] - p0 >= 8, f'FP: 4 kills -> {f1["stats"]["parts"] - p0} GLB parts (2-4 each)')
        shot(pg, 'death_fp')
        until(f'window.__possess.cur.deathParts.stats.landed >= {f1["stats"]["landed"]} + 6', 60000); f2 = FD()
        check(f2['stats']['landed'] - f1['stats']['landed'] >= 6 and f2['stats']['bounces'] > f1['stats']['bounces'], f'FP: parts fall, bounce and come to rest on the ground ({f2["stats"]["landed"] - f1["stats"]["landed"]} landed)')
        f3, _ = fp_round('explosive', None); fb = f3['stats']['byCause']
        f4, _ = fp_round('cold', 'chill'); f5, _ = fp_round('fire', 'burn')
        check(all(f5['stats']['byCause'].get(k, 0) >= 4 for k in ('normal', 'boom', 'ice', 'burn')), f'FP cause variants {f5["stats"]["byCause"]}')
        G('H.killAllEnemies()'); us = [G(f'H.spawn("hunter", 0, {0.385 + (i % 10) * 0.004:.4f}, 1)') for i in range(30)]
        G('H.g.enemies.forEach(x => x.speedK = 0)'); gtime_wait(0.3, 60000); kill(us, 'explosive', None, -40); gtime_wait(0.1, 30000); fc = FD()
        check(fc['live'] <= fc['cap'], f'FP: 30 kills at once -> {fc["live"]} parts <= cap {fc["cap"]} (skipped {fc["stats"]["skipped"]})')
        gtime_wait(3.0, 90000); check(FD()['live'] == 0, 'FP: parts pooled away after ~2.5 s')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(800)

    # ---------------------------------------------------------------- H: co-op sync
    if 'H' in args.only:
        b2 = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
        def newp(br, name):
            c = br.new_context(viewport={'width': 1280, 'height': 760}); c.add_init_script(f"localStorage.setItem('bof.tutorialDone','1');localStorage.setItem('bof.relay','{RELAY}')")
            q = c.new_page(); q.on('pageerror', lambda e: errors.append(f'[{name}] {e}')); return q
        def wait(q, js, ms=20000):
            t0 = time.time()
            while time.time() - t0 < ms / 1000:
                try:
                    v = q.evaluate(js)
                    if v: return v
                except Exception: pass
                time.sleep(0.2)
            return None
        host, cli = newp(br, 'host'), newp(b2, 'client')
        host.goto(BASEURL + 'index.html'); host.wait_for_selector('.mode-pick'); host.click('.mode-pick[data-mode="coop"]'); host.click('#mp-host')
        code = wait(host, "(() => { const e = document.getElementById('room-code'); return e && e.textContent })()", 30000)
        check(bool(code), f'co-op room {code}')
        if code:
            cli.goto(BASEURL + f'index.html?room={code}')
            wait(host, "document.querySelectorAll('.lobby-players li:not(.empty)').length === 2", 30000); wait(cli, "!!document.getElementById('btn-ready')", 15000)
            cli.click('#btn-ready'); wait(host, "!document.getElementById('btn-mpstart').disabled", 8000); host.click('#btn-mpstart')
            check(bool(wait(cli, "window.__game && window.__game.mp() && window.__game.mp().snaps > 3", 20000)), 'client receives snapshots')
            host.evaluate('__game.g.res.add(10000)')
            host.evaluate("""(() => { const H = window.__game, g = H.g; H.killAllEnemies(); for (let i = 0; i < 6; i++) H.spawn(i % 2 ? 'hunter' : 'charger', 0, 0.45 + i * 0.01, 1); g.enemies.forEach(e => e.speedK = 0); })()""")
            ok = wait(cli, '__game.g.enemies.length >= 6', 8000); check(bool(ok), 'client mirrors the 6 enemies')
            cli.evaluate('(() => { const g = __game.g, m = g.enemies[3]; __game.focus(m.x, m.y, 1.6); })()'); time.sleep(0.5)
            c0 = cli.evaluate('__game.deathFx()')
            host.evaluate("""(() => { const H = window.__game, g = H.g, es = [...g.enemies]; es.forEach((e, i) => H.killWith(e.uid, i < 2 ? 'explosive' : i < 4 ? 'cold' : 'sharp', e.x - 50, e.y, i < 2 ? undefined : i < 4 ? 'chill' : undefined)); })()""")
            ok = wait(cli, f"__game.deathFx().stats.events >= {c0['stats']['events']} + 6", 8000)
            c1 = cli.evaluate('__game.deathFx()')
            bc = {k: v - c0['byCause'].get(k, 0) for k, v in c1['byCause'].items()}
            check(bool(ok) and bc.get('boom', 0) >= 2 and bc.get('ice', 0) >= 2 and bc.get('normal', 0) >= 2, f'client replays the host kills with the same causes {bc}')
            check(c1['debris'] > 0 or c1['stats']['spawned'] > c0['stats']['spawned'], f'client draws the debris locally ({c1["stats"]["spawned"] - c0["stats"]["spawned"]} pieces)')
            check(cli.evaluate('__game.g.enemies.length') == 0, 'killed enemies removed on the client')
        b2.close()
    check(not errors, f'no console errors {errors[:3]}')
    br.close()
print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
