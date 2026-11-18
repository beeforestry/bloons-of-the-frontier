"""t104 e2e: same-type tower FUSION + PREDICTIVE AIMING.
  A. Fusion rules: two max-tier Dart Monkeys side by side fuse (fee, one spot freed, every stat up, bigger, sell = 70% of
     everything invested); not before max tier, not across types, not far apart, not twice; tower-panel ⚛ Fuse button;
     save -> Continue restores the fused tower; 2D screenshot (gold aura + ★ badge).
  B. Predictive aiming: Enemy.predict matches where the enemy really is 0.6 s later; quick hit-rate sim (lead off vs on);
     a first-person (possessed) direct shot (Dart Monkey centre dart) leads the target, a free crosshair shot does not.
  C. First person: possess a tower next to the fused one -> gold halo/column/★ badge model decoration (screenshot);
     possessing the fused tower names it "★ Fused".
  D. Co-op sync: client fuses its own two towers through the host; host + client both show the fused tower;
     client cannot fuse the host's towers.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t104.py [--url URL] [--tag live] [--no-shots] [--only ABCD]"""
import argparse, functools, http.server, json, os, socketserver, threading, time, queue
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--only', default='ABCD'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't104'); os.makedirs(OUT, exist_ok=True)
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
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1440, 'height': 860}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
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
    fz = lambda i: G(f'H.fusion({i})')
    fused_i = -1

    # ---------------------------------------------------------------- A: fusion rules + panel + save/resume
    if 'A' in args.only or 'C' in args.only:
        load('tropical'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(200000)')
        a = G(f'({PLACE})("dart_monkey", 0, 0.32, 64)'); bb = G(f'({NEXTTO})("dart_monkey", {a})')
        check(a >= 0 and bb >= 0, f'two Dart Monkeys side by side ({a}, {bb})')
        check(fz(a)['partner'] == -1, 'tier 1 towers cannot fuse yet')
        G(f'({MAXUP})({a})'); check(fz(a)['partner'] == -1, 'only one at max tier: still no fusion')
        G(f'({MAXUP})({bb})')
        fa, fb = fz(a), fz(bb)
        check(fa['max'] and fb['max'] and fa['partner'] == bb and fb['partner'] == a, f'both max tier + adjacent -> partners ({fa["partner"]}, {fb["partner"]})')
        # panel button
        G(f'H.focus({(fa["x"] + fb["x"]) / 2}, {(fa["y"] + fb["y"]) / 2}, 1.8)'); G(f'H.selectTower({a})'); pg.wait_for_timeout(400); ok = pg.wait_for_selector('#sp-fuse', timeout=6000) is not None
        txt = pg.inner_text('#sp-fuse'); check(ok and 'Fuse' in txt and str(fa['fee']) in txt, f'tower panel shows ⚛ Fuse button: {txt.splitlines()[0]!r}')
        shot(pg, 'fuse_ready_panel')
        bpos = (fb['x'], fb['y']); cr0 = G('H.g.res.credits'); n0 = G('H.g.towers.length')
        pg.click('#sp-fuse'); pg.wait_for_timeout(300)
        fi = G(f'H.g.towers.findIndex(t => t.uid === {fa["uid"]})'); f = fz(fi); fused_i = fi
        check(f['fused'] and G('H.g.towers.length') == n0 - 1, f'fused: {f["name"]!r}, towers {n0} -> {n0 - 1}')
        check(near := abs((cr0 - G('H.g.res.credits')) - fa['fee']) < 1, f'fee ¢{fa["fee"]} charged')
        check(f['dmg'] > fa['dmg'] and f['rate'] > fa['rate'] and f['range'] > fa['range'] and f['pierce'] > fa['pierce'] and f['maxHp'] > fa['maxHp'] and f['scale'] > fa['scale'],
              f'every stat up: dmg {fa["dmg"]}->{f["dmg"]}, rate {fa["rate"]}->{f["rate"]}, range {fa["range"]}->{f["range"]}, pierce {fa["pierce"]}->{f["pierce"]}, hp {fa["maxHp"]}->{f["maxHp"]}, scale {fa["scale"]}->{f["scale"]}')
        inv = fa['invested'] + fb['invested'] + fa['fee']
        check(f['invested'] == inv and f['sell'] == int(inv * 0.7), f'sell = 70% of both towers + fee: {f["sell"]} (invested {inv})')
        check(G(f'!!H.g.placementSpot("dart_monkey", {{ x: {bpos[0]}, y: {bpos[1]} }})'), 'the partner spot is free again')
        check(not G(f'H.fuse({fi})') and fz(fi)['fused'], 'a fused tower cannot fuse again')
        pg.wait_for_timeout(200); G(f'H.selectTower({fi})'); pg.wait_for_timeout(250)
        sub = pg.inner_text('#sel-panel'); check('FUSED' in sub, 'panel tags the tower ★ FUSED')
        # cross-type + distance
        n1 = G(f'({PLACE})("ninja_monkey", 0, 0.6, 64)'); G(f'({MAXUP})({n1})'); n2 = G(f'({NEXTTO})("dart_monkey", {n1})'); G(f'({MAXUP})({n2})')
        check(n1 >= 0 and n2 >= 0 and fz(n1)['partner'] == -1 and fz(n2)['partner'] == -1, 'different types never fuse')
        d3 = G(f'({PLACE})("dart_monkey", 0, 0.8, 64)'); G(f'({MAXUP})({d3})')
        check(d3 >= 0 and fz(d3)['partner'] == -1 and not G(f'H.fuse({d3}, {n2})'), 'far-apart max towers do not fuse (fuseTowers refuses too)')
        # 2D look
        G(f'H.selectTower(-1)'); fx_, fy_ = f['x'], f['y']
        G(f'(() => {{ const g = H.g; g.paused = false; }})()')
        G(f"(() => {{ let n = 0; const iv = setInterval(() => {{ for (const id of ['red', 'blue', 'green']) H.spawn(id, 0, 0.22, 20); if (++n > 30) clearInterval(iv); }}, 600); }})()")
        G(f'(() => {{ const r = H.g; if (H.focus) H.focus({fx_}, {fy_}, 1.9); }})()'); pg.wait_for_timeout(2500)
        shot(pg, 'fused_tower_2d')
        # save + Continue
        sv = G('H.save()'); st = [t for t in sv['towers'] if t.get('fu')]
        check(len(st) == 1 and st[0]['id'] == 'dart_monkey', f'save stores the fused flag {st}')
        pg.goto(URL, timeout=90000); pg.wait_for_selector('#btn-continue', timeout=30000); pg.wait_for_timeout(500); pg.click('#btn-continue')
        pg.wait_for_function('window.__game && window.__game.g && window.__game.g.towers.length > 0', timeout=60000); pg.wait_for_timeout(800)
        r = G('H.g.towers.filter(t => t.fused).map(t => ({ id: t.data.id, n: t.t.name, sell: t.sellValue, dmg: t.t.combat.damage }))')
        check(len(r) == 1 and r[0]['dmg'] == f['dmg'] and r[0]['sell'] == f['sell'], f'Continue restores the fused tower {r}')
        fused_i = G('H.g.towers.findIndex(t => t.fused)')

    # ---------------------------------------------------------------- B: predictive aiming
    if 'B' in args.only:
        load('tropical'); G('H.g.paused = false')
        # all in one synchronous block (no animation frame can run in between)
        P = G("""(() => { const g = H.g, e = g.spawnEnemy('pink', g.paths[0].length * 0.3, 0, 0, 50); for (let i = 0; i < 5; i++) g.update(0.05);
          const pr = e.predict(g, 0.6); for (let i = 0; i < 12; i++) g.update(0.05); const r = { pr, now: { x: e.x, y: e.y } };
          e.stunT = 1; const p2 = e.predict(g, 0.5); r.st = Math.hypot(p2.x - e.x, p2.y - e.y); e.alive = false; return r; })()""")
        err = ((P['pr']['x'] - P['now']['x']) ** 2 + (P['pr']['y'] - P['now']['y']) ** 2) ** 0.5
        check(err < 6, f'Enemy.predict(0.6 s) error {err:.1f} px for a fast Pink')
        check(P['st'] < 0.01, 'a stunned enemy is predicted to stay put')
        # quick hit-rate sim: Autoturret + Dart, same stream, lead off vs on
        SIM = """([id, lead]) => { const g = H.g; g.leadAim = lead; let seed = 3; Math.random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
          for (const e of g.enemies) e.alive = false; g.enemies = []; g.projectiles = []; for (const t of [...g.towers]) g.sellTower(t); g.res.add(1e7);
          const i = (""" + PLACE + """)(id, 0, 0.4, 90); const tw = g.towers[i]; while (tw.upgrade(g)) {}
          Object.assign(g.stats, { projShots: 0, projHits: 0, projAimShots: 0, projAimHits: 0 }); const p = g.paths[0], st = Math.max(0, p.length * 0.4 - 600), en = p.length * 0.4 + 700;
          const mix = ['yellow', 'pink', 'scavenger', 'green', 'hunter']; let t = 0, k = 0;
          while (t < 30) { if (k < 16 && t >= k * 1.5) { g.spawnEnemy(mix[k % 5], st, 0, 0, 400); k++; } g.update(0.05); t += 0.05;
            for (const e of g.enemies) if (e.alive && e.progress > en) e.alive = false; g.hq.health.hp = g.hq.health.max; }
          return [g.stats.projAimHits, g.stats.projAimShots]; }"""
        tot = {False: [0, 0], True: [0, 0]}
        for tid in ('unsc_autoturret', 'dart_monkey', 'star_emperor'):
            for lead in (False, True):
                hh, ss = pg.evaluate(f'(() => {{ const H = window.__game; return ({SIM})({json.dumps([tid, lead])}); }})()'); tot[lead][0] += hh; tot[lead][1] += ss
        off, on = 100 * tot[False][0] / max(1, tot[False][1]), 100 * tot[True][0] / max(1, tot[True][1])
        check(on >= off + 5 and on >= 95, f'aimed-shot hit rate (autoturret + dart + star, tropical): lead OFF {off:.1f}% -> ON {on:.1f}%')
        G('H.g.leadAim = true')
        # first-person direct shot leads; free crosshair shot unchanged
        FP = """(lead) => { const g = H.g; g.leadAim = lead; for (const e of g.enemies) e.alive = false; g.enemies = []; g.projectiles = [];
          let tw = g.towers.find(t => t.data.id === 'dart_monkey'); if (!tw) { tw = g.towers[(""" + PLACE + """)('dart_monkey', 0, 0.4, 90)]; while (tw.upgrade(g)) {} }
          const e = g.spawnEnemy('pink', g.paths[0].length * 0.4 - 160, 0, 0, 400);
          for (let i = 0; i < 4; i++) e.update(g, 0.05);
          tw.manual = { aim: Math.atan2(e.y - tw.y, e.x - tw.x), fire: true, target: e, mx: 0, my: 0 };
          g.manualTowerFire(tw, tw.t.combat, 1); const pr = g.projectiles.filter(q => q.o.aimed).pop();
          const sp = tw.t.combat.projectileSpeed; let q = { x: e.x, y: e.y }; for (let i = 0; i < 4; i++) q = e.predict(g, Math.hypot(q.x - pr.x, q.y - pr.y) / sp);
          const dl = (pt) => Math.abs(Math.sin(pr.angle) * (pt.x - pr.x) - Math.cos(pr.angle) * (pt.y - pr.y));
          tw.manual.target = null; tw.manual.aim = 0.7; g.projectiles = []; g.manualTowerFire(tw, tw.t.combat, 2); const free = g.projectiles.filter(q => q.o.aimed).pop();
          const R = tw.range(tw.t.combat.range), ap = { x: tw.x + Math.cos(0.7) * R, y: tw.y + Math.sin(0.7) * R };
          const dFree = Math.abs(Math.sin(free.angle) * (ap.x - free.x) - Math.cos(free.angle) * (ap.y - free.y));
          tw.manual = null; return { ang: pr.angle, dPred: dl(q), dNow: dl(e), dFree }; }"""
        offr = G(f'({FP})(false)'); onr = G(f'({FP})(true)')
        check(onr['dPred'] < 4 and offr['dNow'] < 4 and abs(onr['ang'] - offr['ang']) > 0.01, f'FP direct shot leads: ray→predicted {onr["dPred"]:.1f}px (lead on), ray→current {offr["dNow"]:.1f}px (lead off), Δangle {abs(onr["ang"] - offr["ang"]):.3f}')
        check(onr['dFree'] < 0.5 and offr['dFree'] < 0.5, f'FP free crosshair shot (no target) flies at the crosshair point either way ({onr["dFree"]:.2f} / {offr["dFree"]:.2f} px)')

    # ---------------------------------------------------------------- C: first-person look
    if 'C' in args.only and fused_i >= 0:
        G('H.g.paused = false; H.addCredits(80000)')
        if G('H.g.towers.findIndex(t => t.fused)') < 0:  # section B reloaded the page: build a fresh fused pair
            a = G(f'({PLACE})("dart_monkey", 0, 0.32, 64)'); bb = G(f'({NEXTTO})("dart_monkey", {a})'); G(f'({MAXUP})({a})'); G(f'({MAXUP})({bb})'); G(f'H.fuse({a}, {bb})')
        fused_i = G('H.g.towers.findIndex(t => t.fused)')
        # add an Autoturret next to the fused tower and possess it
        at = G(f'({NEXTTO})("unsc_autoturret", {fused_i}, 1.6)')
        check(at >= 0, f'Autoturret next to the fused tower ({at})')
        if at >= 0:
            G(f'H.selectTower({at})'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
            ok = until('window.__possess && window.__possess.cur', 90000); check(ok, 'possessed the Autoturret')
            pg.wait_for_timeout(3500)
            fx = G(f'(() => {{ const P = window.__possess.cur, g = H.g, f = g.towers.find(t => t.fused); if (P.aimAt) P.aimAt(f.x, f.y, 0.4); if (P.el && P.el.msg) P.el.msg.style.visibility = "hidden"; return P.fusedFx ? P.fusedFx.size : -1; }})()')
            pg.wait_for_timeout(1200)
            check(fx == 1, f'FP: fused tower carries the gold halo / column / ★ badge decoration ({fx})')
            shot(pg, 'fused_tower_fp')
            pg.keyboard.press('Escape'); pg.wait_for_timeout(1200)
            if G('!!(window.__possess && window.__possess.cur)'): G('window.__possess.cur && window.__possess.exit && window.__possess.exit()'); pg.wait_for_timeout(800)
        fi = G('H.g.towers.findIndex(t => t.fused)')
        G(f'H.selectTower({fi})')
        if pg.query_selector('#sp-possess'):
            pg.click('#sp-possess'); ok = until('window.__possess && window.__possess.cur', 90000); pg.wait_for_timeout(1500)
            nm = pg.evaluate("(() => { const e = document.querySelector('.ps-me .nm'); return e ? e.textContent : ''; })()")
            check(ok and 'Fused' in nm, f'possessing the fused tower: {nm!r}')

    # ---------------------------------------------------------------- D: co-op sync
    if 'D' in args.only:
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
        host, cli = newp(b, 'host'), newp(b2, 'client')
        host.goto(BASEURL + 'index.html'); host.wait_for_selector('.mode-pick'); host.click('.mode-pick[data-mode="coop"]'); host.click('#mp-host')
        code = wait(host, "(() => { const e = document.getElementById('room-code'); return e && e.textContent })()", 30000)
        check(bool(code), f'co-op room {code}')
        if code:
            cli.goto(BASEURL + f'index.html?room={code}')
            wait(host, "document.querySelectorAll('.lobby-players li:not(.empty)').length === 2", 30000); wait(cli, "!!document.getElementById('btn-ready')", 15000)
            cli.click('#btn-ready'); wait(host, "!document.getElementById('btn-mpstart').disabled", 8000); host.click('#btn-mpstart')
            check(bool(wait(cli, "window.__game && window.__game.mp() && window.__game.mp().snaps > 3", 20000)), 'client receives snapshots')
            host.evaluate('__game.g.res.add(200000)'); host.evaluate('__game.mpDonate(1, 60000)')
            wait(cli, '__game.mp().credits > 50000', 8000)
            HP = PLACE.replace('H.g', '__game.g'); HN = NEXTTO.replace('H.g', '__game.g')
            # host pair (P1) + client pair (P2)
            h1 = host.evaluate(f'({HP})("dart_monkey", 0, 0.3, 64)'); h2 = host.evaluate(f'({HN})("dart_monkey", {h1})')
            host.evaluate(f'(() => {{ for (const i of [{h1}, {h2}]) {{ const t = __game.g.towers[i]; while (t.upgrade(__game.g)) {{}} }} }})()')
            spot = host.evaluate(f"""(() => {{ const g = __game.g, p = g.paths[0]; for (const o of [64, 82, 100, -64, -82]) for (const dd of [0, 40, -40, 80]) {{
              const b = p.at(p.length * 0.6 + dd), x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
              const s = g.placementSpot('dart_monkey', {{ x, y }}); if (!s) continue; const R = g.towerRadius('dart_monkey') * 2 + 6;
              for (let k = 0; k < 12; k++) {{ const s2 = g.placementSpot('dart_monkey', {{ x: s.x + Math.cos(k * 0.5236) * R, y: s.y + Math.sin(k * 0.5236) * R }}); if (s2 && Math.hypot(s2.x - s.x, s2.y - s.y) > R * 0.9) return [s, s2]; }} }} return null; }})()""")
            check(spot is not None, 'found two adjacent free spots for the client')
            if spot:
                cli.evaluate(f'__game.g.placeTower("dart_monkey", {json.dumps(spot[0])})'); time.sleep(0.6); cli.evaluate(f'__game.g.placeTower("dart_monkey", {json.dumps(spot[1])})')
                check(bool(wait(host, '__game.g.towers.filter(t => t.owner === 1).length === 2', 8000)), 'client placed 2 Dart Monkeys (owner P2) on the host')
                for _ in range(6):
                    cli.evaluate('__game.g.towers.filter(t => t.owner === 1).forEach(t => t.upgrade(__game.g))'); time.sleep(0.5)
                check(bool(wait(host, '__game.g.towers.filter(t => t.owner === 1 && t.isMaxTier).length === 2', 8000)), 'client upgraded both to max tier')
                wait(cli, '__game.g.towers.filter(t => t.owner === 1 && t.isMaxTier).length === 2', 8000)
                # client tries to fuse the host's pair -> denied
                cli.evaluate('(() => { const g = __game.g, m = g.towers.filter(t => t.owner === 0); g.fuseTowers(m[0], m[1]); })()'); time.sleep(1)
                check(host.evaluate('__game.g.towers.filter(t => t.fused).length') == 0, "client cannot fuse P1's towers")
                cli.evaluate('(() => { const g = __game.g, m = g.towers.filter(t => t.owner === 1); g.fuseTowers(m[0], m[1]); })()')
                okh = wait(host, '__game.g.towers.filter(t => t.owner === 1).length === 1 && __game.g.towers.some(t => t.owner === 1 && t.fused)', 8000)
                okc = wait(cli, '__game.g.towers.filter(t => t.owner === 1).length === 1 && __game.g.towers.some(t => t.owner === 1 && t.fused)', 8000)
                check(bool(okh) and bool(okc), 'client fusion runs on the host and the fused tower mirrors back to the client')
                hs = host.evaluate('(() => { const t = __game.g.towers.find(t => t.fused); return [t.t.combat.damage, t.sellValue]; })()')
                cs = cli.evaluate('(() => { const t = __game.g.towers.find(t => t.fused); return t ? [t.t.combat.damage, t.sellValue] : null; })()')
                check(cs is not None and cs[0] == hs[0] and abs(cs[1] - hs[1]) <= 1, f'host / client fused stats + sell value agree {hs} / {cs}')
        b2.close()
    check(not errors, f'no console errors {errors[:3]}')
    b.close()
print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
