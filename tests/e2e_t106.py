"""t106 e2e: CAPA 4 — TARGETING MODES, OVERLOAD CORE, RAGE, SCALING CRIT, PATH KNOCKBACK, SELL 70%.
  A. Targeting: 6 modes (First/Last/Strongest/Weakest/Closest/Closest to Exit) with icon buttons + tip; each picks the right enemy
     (Marksman, a fused tower, a recipe tower); a Marksman on Last actually shoots the last enemy; modes cycle (T); save/Continue keeps them.
  B. Overload Core: price 500 / 800 / 1280 (×1.6), +5% damage per level on real shots, HUD level; Continue restores it.
  C. Rage: HUD button + X hotkey, ×1.5 rate for 9 s, 30 s cooldown shown on the button, red vignette; refuses while cooling.
  D. Crit: 10% at wave 0 rising +0.4%/wave to a 33% cap, ×2.5 damage, "✦" popups, HUD shows the %.
  E. Knockback: Melon Mortar / Battle Tank shove enemies back ALONG the path (still on the road), bosses resist, diminishing returns.
  F. Sell: 70% of everything invested for plain / branch / fused / recipe towers; panel shows the refund.
  G. First person: while possessing, the other towers keep their targeting modes (Marksman on Last).
  H. Co-op: client triggers Rage + buys Overload through the host; both agree on level / rage / cooldown; client wallet pays.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t106.py [--url URL] [--tag live] [--no-shots] [--only ABCDEFGH]"""
import argparse, functools, http.server, json, os, socketserver, threading, time, queue
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--only', default='ABCDEFGH'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't106'); os.makedirs(OUT, exist_ok=True)
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
    pg.on('console', lambda m: warn.append(m.text) if '[validate]' in m.text else None)
    TAP = """(() => { const g = H.g; if (window.__tap) return; const P = Object.getPrototypeOf(g.enemies[0] || g.spawnEnemy('red', 10)); if (!g.enemies[0]) H.killAllEnemies();
      const o = P.takeDamage; window.__tap = { n: 0, sum: 0, crit: 0, by: {} };
      P.takeDamage = function (gg, a, ty, fr, hit) { const T = window.__tap; if (a > 0 && !(hit && hit.dot)) { T.n++; T.sum += a; if (hit && hit.crit) T.crit++; T.by[this.uid] = (T.by[this.uid] || 0) + a; } return o.call(this, gg, a, ty, fr, hit); }; })()"""
    RESET = "(() => { window.__tap.n = 0; window.__tap.sum = 0; window.__tap.crit = 0; window.__tap.by = {}; return true; })()"
    MODES = ['first', 'last', 'strong', 'weak', 'close', 'hq']
    def tgt_setup(kind_js):
        """Spawn 3 enemies spread along lane 0 around the tower; returns uids dict."""
        return G(f"""(() => {{ const g = H.g; H.killAllEnemies(); g.waves.active = false;
          const a = H.spawn('red', 0, 0.40, 40), b = H.spawn('ceramic', 0, 0.48, 3), c = H.spawn('blue', 0, 0.56, 40);
          for (const e of g.enemies) {{ e.speedK = 0; }} return {{ red: a, cer: b, blue: c }}; }})()""")
    def expect(i, u):
        """Expected picks for tower i given 3 enemies, computed independently from positions."""
        return G(f"""(() => {{ const g = H.g, t = g.towers[{i}], es = g.enemies.filter(e => e.alive), hq = g.hq;
          const by = (f) => es.reduce((a, b) => f(b) > f(a) ? b : a).uid;
          return {{ first: by(e => -e.remaining), last: by(e => e.remaining), strong: {u['cer']}, weak: by(e => -(e.hp + e.shield)),
            close: by(e => -Math.hypot(e.x - t.x, e.y - t.y)), hq: by(e => -Math.hypot(e.x - hq.x, e.y - hq.y)) }}; }})()""")

    # ---------------------------------------------------------------- A: targeting modes
    if 'A' in args.only:
        load('morro'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(900000)')
        check(not warn, f'in-game validator: no data issues ({warn[:2]})')
        mk = G(f'({PLACE})("sniper_monkey", 0, 0.48, 70)'); check(mk >= 0, f'Marksman placed ({mk})')
        u = tgt_setup(''); exp = expect(mk, u)
        G(f'H.focus(H.g.towers[{mk}].x, H.g.towers[{mk}].y, 1.3)'); G(f'H.selectTower({mk})'); pg.wait_for_timeout(400)
        btns = pg.evaluate("[...document.querySelectorAll('#sel-panel [data-tgt]')].map(b => [b.dataset.tgt, b.textContent.trim(), b.title])")
        check(len(btns) == 6 and all(b[2] for b in btns) and any('Closest to Exit' in b[1] or 'Exit' in b[1] for b in btns), f'panel: 6 targeting buttons with icon + title, incl. Closest to Exit {[b[1] for b in btns]}')
        tip = pg.evaluate("(document.querySelector('#sel-panel .tgt-tip') || {}).textContent || ''"); check(len(tip) > 10, f'panel tip line for the current mode: {tip!r}')
        res = {}
        for m in MODES:
            pg.click(f'#sel-panel [data-tgt="{m}"]'); pg.wait_for_timeout(120)
            res[m] = (G(f'H.g.towers[{mk}].targeting'), G(f'H.pick({mk})'))
        check(all(res[m][0] == m for m in MODES), 'clicking each button sets the tower mode')
        bad = [m for m in MODES if res[m][1] != exp[m]]
        check(not bad, f'Marksman picks the expected enemy in all 6 modes (bad: {bad}; picks {dict((m, res[m][1]) for m in MODES)} exp {exp})')
        check(exp['first'] != exp['last'] and exp['strong'] == u['cer'], 'setup distinguishes First / Last / Strongest')
        pg.click('#sel-panel [data-tgt="last"]'); pg.wait_for_timeout(150); shot(pg, 'targeting_panel')
        # real shots: Marksman on Last hits the last enemy, on First the first one
        G(TAP); G(RESET); G(f'({SIM})(150)'); dmg = G('window.__tap.by')
        check(dmg.get(str(exp['last']), 0) > 0 and all(v == 0 for k, v in dmg.items() if k != str(exp['last'])), f'Last: real shots land on the last enemy only {dmg}')
        # cycle with T
        G(f'H.setTargeting({mk}, "hq")'); pg.keyboard.press('t'); pg.wait_for_timeout(150)
        check(G(f'H.g.towers[{mk}].targeting') == 'first', 'T cycles Closest to Exit -> First')
        # fused tower
        d0 = G(f'({PLACE})("dart_monkey", 0, 0.47, 60)'); G(f'({MAXB})({d0}, 0)'); d1 = G(f'({NEXTTO})("dart_monkey", {d0})'); G(f'({MAXB})({d1}, 0)')
        G(f'H.setTargeting({d0}, "last")'); ok = G(f'H.fusion({d0}).partner') >= 0
        if ok: G(f'H.fuse({d0}, {d1})')
        fi = G('H.g.towers.findIndex(t => t.alive && t.fused)')
        check(fi >= 0, f'fused Dart built ({fi})')
        if fi >= 0:
            u = tgt_setup(''); e2 = expect(fi, u); pk = {}
            for m in MODES: G(f'H.setTargeting({fi}, "{m}")'); pk[m] = G(f'H.pick({fi})')
            inr = G(f'H.g.enemies.filter(e => Math.hypot(e.x - H.g.towers[{fi}].x, e.y - H.g.towers[{fi}].y) <= H.g.towers[{fi}].range(H.g.towers[{fi}].t.combat.range) + e.data.radius).length')
            badf = [m for m in MODES if pk[m] is not None and inr == 3 and pk[m] != e2[m]]
            check(inr >= 1 and not badf, f'fused tower honours every mode ({inr} in range, bad {badf})')
        # recipe tower inherits mode + honours it
        tc = G(f'({PLACE})("tesla_coil", 0, 0.5, 70)'); fr = G(f'({NEXTTO})("frost_wallnut_bastion", {tc})')
        G(f'(() => {{ for (const i of [{tc}, {fr}]) {{ const t = H.g.towers[i]; while (t.upgrade(H.g, 0)) {{}} }} }})()')
        G(f'H.setTargeting({tc}, "strong")'); G(f'H.g.fuseRecipe(H.g.towers[{tc}], H.g.towers[{fr}])')
        sc = G('H.g.towers.findIndex(t => t.alive && t.data.id === "storm_core")')
        check(sc >= 0 and G(f'H.g.towers[{sc}].targeting') == 'strong', f'Storm Core inherits the Tesla mode (Strongest) ({sc})')
        if sc >= 0:
            u = tgt_setup(''); e3 = expect(sc, u); pk = {}
            for m in MODES: G(f'H.setTargeting({sc}, "{m}")'); pk[m] = G(f'H.pick({sc})')
            inr = G(f'H.g.enemies.filter(e => Math.hypot(e.x - H.g.towers[{sc}].x, e.y - H.g.towers[{sc}].y) <= H.g.towers[{sc}].range(H.g.towers[{sc}].t.combat.range) + e.data.radius).length')
            badr = [m for m in MODES if inr == 3 and pk[m] != e3[m]]
            check(inr >= 1 and not badr, f'recipe tower honours every mode ({inr} in range, bad {badr})')
        # predictive aiming still on with a non-default mode
        G(f'H.setTargeting({mk}, "strong")'); G('H.killAllEnemies()'); s0 = G('H.g.stats.projAimShots')
        G('(() => { const g = H.g; g.waves.active = true; for (let k = 0; k < 6; k++) H.spawn("ceramic", 0, 0.2 + k * 0.05, 4); })()'); G(f'({SIM})(400)')
        check(G('H.g.stats.projAimShots') > s0 or G('H.g.stats.projShots') > 0, f'projectile towers keep leading targets with custom modes (aim shots {G("H.g.stats.projAimShots")})')
        G('H.killAllEnemies()')
        # save / continue keeps modes
        modes_before = G('H.g.towers.filter(t => t.alive).map(t => t.targeting).sort()')
        G('H.save()'); pg.goto(URL, timeout=90000); pg.wait_for_selector('#btn-continue', timeout=30000); pg.wait_for_timeout(500); pg.click('#btn-continue')
        pg.wait_for_function('window.__game && window.__game.g && window.__game.g.towers.length > 0', timeout=60000); pg.wait_for_timeout(800)
        check(G('H.g.towers.filter(t => t.alive).map(t => t.targeting).sort()') == modes_before, 'Continue restores every targeting mode')

    # ---------------------------------------------------------------- B: overload core
    if 'B' in args.only:
        load('morro'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(20000)')
        costs = []
        for _ in range(4):
            bo = G('H.boosts()'); costs.append(bo['cost']); c0 = G('H.g.res.credits')
            pg.evaluate("document.getElementById('btn-overload').click()"); pg.wait_for_timeout(120)
            check(abs((c0 - G('H.g.res.credits')) - bo['cost']) < 1, f'Overload level {bo["overload"] + 1} costs ¢{bo["cost"]}')
        check(costs == [500, 800, 1280, 2050], f'price ladder ×1.6: {costs}')
        hud = pg.inner_text('#ovl'); check(G('H.boosts().overload') == 4 and '4' in hud, f'HUD shows Overload level ({hud!r}) -> +20% damage')
        G('H.g.res.load({ credits: 100, scrap: 0 }, true)'); pg.evaluate("document.getElementById('btn-overload').click()")
        check(G('H.boosts().overload') == 4, 'cannot buy Overload without the money')
        # real damage +20%: compare one Marksman shot at lvl 0 vs lvl 4 (no crits)
        G('H.addCredits(9000)'); mk = G(f'({PLACE})("sniper_monkey", 0, 0.5, 70)')
        def shotdmg():
            G(TAP); return G(f"""(() => {{ const g = H.g; H.killAllEnemies(); const C = H.tune.CRIT, cb = [C.base, C.perWave]; C.base = 0; C.perWave = 0;
              const id = H.spawn('hunter', 0, 0.5, 1e5), e = g.enemies.find(x => x.uid === id); e.speedK = 0; {RESET};
              g.towers[{mk}].cooldown = 0; const p = g.paused; g.paused = false; for (let k = 0; k < 600; k++) g.step(1 / 60); g.paused = p; C.base = cb[0]; C.perWave = cb[1]; return window.__tap.sum / Math.max(1, window.__tap.n); }})()""")
        d4 = shotdmg(); G('H.g.overload = 0'); d0 = shotdmg(); G('H.g.overload = 4')
        check(d0 > 0 and abs(d4 / d0 - 1.2) < 0.03, f'one Marksman shot: {d0:.1f} -> {d4:.1f} dmg at Overload 4 (×{d4 / max(d0, 1e-9):.3f})')
        shot(pg, 'overload_hud')
        G('H.save()'); pg.goto(URL, timeout=90000); pg.wait_for_selector('#btn-continue', timeout=30000); pg.wait_for_timeout(500); pg.click('#btn-continue')
        pg.wait_for_function('window.__game && window.__game.g && window.__game.g.towers.length > 0', timeout=60000); pg.wait_for_timeout(800)
        check(G('H.boosts().overload') == 4, 'Continue restores the Overload level')

    # ---------------------------------------------------------------- C: rage
    if 'C' in args.only:
        load('morro'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(20000)')
        dt = G(f'({PLACE})("dart_monkey", 0, 0.45, 60)')
        G('(() => { const g = H.g; g.waves.active = true; for (let k = 0; k < 12; k++) { const id = H.spawn("hunter", 0, 0.42 + k * 0.006, 1e5); const e = g.enemies.find(x => x.uid === id); e.speedK = 0; } })()')
        G(TAP)
        def rate(n=600):
            G(RESET); return G(f'(() => {{ const g = H.g; const p = g.paused; g.paused = false; for (let k = 0; k < {n}; k++) g.step(1 / 60); g.paused = p; return window.__tap.n; }})()')
        r0 = rate(300)
        check(pg.query_selector('#btn-rage') is not None, 'HUD has a Rage button')
        G(f'H.focus(H.g.towers[{dt}].x, H.g.towers[{dt}].y, 1.5)')
        pg.keyboard.press('x'); pg.wait_for_timeout(100); b = G('H.boosts()')
        check(b['rageT'] > 8 and b['rateMul'] == 1.5 and b['stats']['rages'] == 1, f'X hotkey triggers Rage: {b["rageT"]:.1f}s ×{b["rateMul"]}')
        pg.wait_for_timeout(500)
        check(pg.evaluate("document.body.classList.contains('raging')") and 'on' in (pg.get_attribute('#btn-rage', 'class') or ''), 'visible effect: body.raging vignette + glowing button')
        shot(pg, 'rage_active')
        r1 = rate(300)
        check(r1 > r0 * 1.3, f'shots in 5 s: {r0} normal -> {r1} raging')
        check(not G('H.rage()'), 'cannot re-trigger while active')
        G(f'({SIM})(300)'); b = G('H.boosts()')
        check(b['rageT'] == 0 and b['rateMul'] == 1 and b['rageCd'] > 20, f'Rage ends after 9 s; cooldown {b["rageCd"]:.1f}s left')
        pg.wait_for_timeout(400); lbl = pg.inner_text('#btn-rage')
        check(any(ch.isdigit() for ch in lbl) and not G('H.rage()'), f'button shows the cooldown ({lbl!r}) and refuses')
        G(f'({SIM})(1900)'); check(G('H.rage()'), 'Rage ready again after the cooldown')
        G('H.killAllEnemies()')

    # ---------------------------------------------------------------- D: crit
    if 'D' in args.only:
        load('morro'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(20000)')
        pcts = {}
        for w in (0, 10, 25, 60, 120):
            G(f'H.g.waves.index = {w}'); pg.wait_for_timeout(260); pcts[w] = (round(G('H.boosts().crit'), 4), pg.inner_text('#crit'))
        check(pcts[0][0] == 0.1 and pcts[10][0] == 0.14 and pcts[25][0] == 0.2 and pcts[60][0] == 0.33 and pcts[120][0] == 0.33, f'crit chance by wave {pcts}')
        check('10' in pcts[0][1] and '33' in pcts[120][1], 'HUD shows the crit %')
        G('H.g.waves.index = 0'); mk = G(f'({PLACE})("sniper_monkey", 0, 0.5, 70)')
        def one(r):
            G(TAP); return G(f"""(() => {{ const g = H.g; H.killAllEnemies(); const C = H.tune.CRIT, cb = [C.base, C.perWave, C.cap]; C.base = {r}; C.perWave = 0; C.cap = 1;
              const id = H.spawn('hunter', 0, 0.5, 1e5), e = g.enemies.find(x => x.uid === id); e.speedK = 0; {RESET};
              g.towers[{mk}].cooldown = 0; const p = g.paused; g.paused = false; for (let k = 0; k < 600; k++) g.step(1 / 60); g.paused = p; [C.base, C.perWave, C.cap] = cb; return window.__tap.sum / Math.max(1, window.__tap.n); }})()""")
        n = one(0); c = one(1)
        check(n > 0 and abs(c / n - 2.5) < 0.05, f'crit hits ×2.5: {n:.1f} -> {c:.1f}')
        # statistical rate at wave 25 (~20%)
        G('H.g.waves.index = 25'); G('H.g.sellTower(H.g.towers.find(t => t.alive && t.data.id === "sniper_monkey"))')
        G('(() => { const g = H.g; H.killAllEnemies(); g.waves.active = true; for (let k = 0; k < 10; k++) { const id = H.spawn("hunter", 0, 0.45 + k * 0.01, 1e4); const e = g.enemies.find(x => x.uid === id); e.speedK = 0; } })()')
        dt = G(f'({PLACE})("dart_monkey", 0, 0.5, 60)'); G(f'({NEXTTO})("dart_monkey", {dt})'); G(f'({NEXTTO})("dart_monkey", {dt}, 2)'); G(RESET); G(f'({SIM})(3600)')
        ncrit = G('window.__tap.crit'); nsh = G('window.__tap.n')
        sig = 3 * (0.2 * 0.8 / max(nsh, 1)) ** 0.5 + 0.01
        check(nsh > 60 and abs(ncrit / max(nsh, 1) - 0.2) < sig, f'observed crit rate at wave 25: {ncrit}/{nsh} = {ncrit / max(nsh, 1):.2f} (expected ~0.20)')
        G(f'H.focus(H.g.towers[{dt}].x, H.g.towers[{dt}].y, 1.8)'); G('Math.__R = Math.random; Math.random = () => Math.__R() * 0.25')
        pg.wait_for_timeout(700); pops = G("H.g.effects ? H.g.effects.filter(e => e.kind === 'dmg' && e.crit).map(e => e.text).slice(0, 4) : []")
        check(any(t.startswith('✦') for t in pops), f'crit popups marked with ✦ {pops}')
        shot(pg, 'crit_popups'); G('Math.random = Math.__R'); G('H.killAllEnemies()')

    # ---------------------------------------------------------------- E: knockback
    if 'E' in args.only:
        load('morro'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(90000)')
        kbs = G("""(() => { const out = {}; for (const id of ['flame_melon_mortar', 'unsc_tank']) { const d = H.towerData ? H.towerData(id) : null; out[id] = d; } return out; })()""")
        r = G("""(() => { const g = H.g; H.killAllEnemies(); const id = H.spawn('ceramic', 0, 0.5, 50), e = g.enemies.find(x => x.uid === id); e.speedK = 0;
          g.paused = true; g.step(1 / 60); const p0 = e.progress; e.shove(g, 20); const p1 = e.progress; e.shove(g, 20); const p2 = e.progress; e.shove(g, 20); const p3 = e.progress;
          g.step(1 / 60); const path = g.paths[e.lane], q = path.at(e.progress); const off = Math.hypot(q.x - e.x, q.y - e.y);
          const bid = H.spawn('boss_scarab', 0, 0.5, 1), b = g.enemies.find(x => x.uid === bid); b.speed = 0; b.baseSpeed = 0; const b0 = b.progress; b.shove(g, 20);
          return { d1: p0 - p1, d2: p1 - p2, d3: p2 - p3, off, lat: Math.abs(e.lateral || 0) + Math.abs(e.divert || 0), boss: b0 - b.progress, res: e.kbRes }; })()""")
        check(abs(r['d1'] - 20) < 0.5, f'first shove: {r["d1"]:.1f}px back along the path')
        check(r['d1'] > r['d2'] > r['d3'] > 0, f'diminishing returns: {r["d1"]:.1f} > {r["d2"]:.1f} > {r["d3"]:.1f} (res {r["res"]:.2f})')
        check(r['off'] < r['lat'] + 30, f'enemy stays on its road after shoves (off-path {r["off"]:.1f}px)')
        check(0 <= r['boss'] < 5, f'boss resists: {r["boss"]:.1f}px')
        G('(() => { const g = H.g; g.enemies.forEach(e => e.kbRes = 0); })()'); G(f'({SIM})(240)')
        check(G('H.g.enemies.filter(e => e.alive).every(e => (e.kbRes || 0) < 0.05)'), 'resistance decays over time')
        G('H.killAllEnemies()')
        mm = G(f'({PLACE})("flame_melon_mortar", 0, 0.5, 80)'); G(f'(() => {{ const t = H.g.towers[{mm}]; while (t.upgrade(H.g, 0)) {{}} }})()')
        k0 = G('H.g.stats.knockbacks')
        G('(() => { const g = H.g; g.waves.active = true; for (let k = 0; k < 8; k++) { const id = H.spawn("ceramic", 0, 0.44 + k * 0.01, 200); } })()')
        G(f'H.focus(H.g.towers[{mm}].x, H.g.towers[{mm}].y, 1.3)'); G(f'({SIM})(600)')
        kb = G('H.g.stats.knockbacks') - k0
        onroad = G('H.g.enemies.filter(e => e.alive).every(e => { const q = H.g.paths[e.lane].at(e.progress); return Math.hypot(q.x - e.x, q.y - e.y) < Math.abs(e.lateral || 0) + 40; })')
        check(kb > 3 and onroad, f'Melon Mortar shoves enemies in a real fight ({kb} knockbacks), all still on the road')
        shot(pg, 'knockback_mortar'); G('H.killAllEnemies()')

    # ---------------------------------------------------------------- F: sell 70%
    if 'F' in args.only:
        load('morro'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(900000)')
        def sellcheck(i, label):
            inv = G(f'H.g.towers[{i}].invested'); sv = G(f'H.g.towers[{i}].sellValue')
            G(f'H.selectTower({i})'); pg.wait_for_timeout(250); txt = pg.inner_text('#sp-sell'); tt = pg.get_attribute('#sp-sell', 'title') or ''
            c0 = G('H.g.res.credits'); G(f'H.g.sellTower(H.g.towers[{i}])'); got = G('H.g.res.credits') - c0
            check(sv == int(inv * 0.7) and abs(got - sv) < 1 and str(sv) in txt and str(inv) in txt and 'Refund' in tt, f'{label}: invested ¢{inv} -> refund ¢{got:.0f} (70%), button {txt!r}')
        a = G(f'({PLACE})("dart_monkey", 0, 0.3, 60)'); sellcheck(a, 'plain Dart')
        a = G(f'({PLACE})("dart_monkey", 0, 0.3, 60)'); G(f'({MAXB})({a}, 1)'); G(f'H.selectTower({a})'); pg.wait_for_timeout(250); shot(pg, 'sell_refund'); sellcheck(a, 'branch Dart (t3)')
        d0 = G(f'({PLACE})("dart_monkey", 0, 0.47, 60)'); G(f'({MAXB})({d0}, 0)'); d1 = G(f'({NEXTTO})("dart_monkey", {d0})'); G(f'({MAXB})({d1}, 0)')
        G(f'H.fuse({d0}, {d1})'); fi = G('H.g.towers.findIndex(t => t.alive && t.fused)')
        if fi >= 0: sellcheck(fi, 'fused Dart')
        else: check(False, 'fused Dart built')
        tc = G(f'({PLACE})("tesla_coil", 0, 0.6, 70)'); fr = G(f'({NEXTTO})("frost_wallnut_bastion", {tc})')
        G(f'(() => {{ for (const i of [{tc}, {fr}]) {{ const t = H.g.towers[i]; while (t.upgrade(H.g, 0)) {{}} }} }})()'); G(f'H.g.fuseRecipe(H.g.towers[{tc}], H.g.towers[{fr}])')
        sc = G('H.g.towers.findIndex(t => t.alive && t.data.id === "storm_core")')
        if sc >= 0: sellcheck(sc, 'recipe Storm Core')
        else: check(False, 'Storm Core built')

    # ---------------------------------------------------------------- G: first person keeps other towers' modes
    if 'G' in args.only:
        load('morro'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(90000)')
        mk = G(f'({PLACE})("sniper_monkey", 0, 0.48, 70)'); at = G(f'({PLACE})("unsc_autoturret", 0, 0.3, 70)')
        G(f'H.setTargeting({mk}, "last")')
        G(f'H.selectTower({at})'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur', 90000); check(ok, 'possessed the Autoturret'); pg.wait_for_timeout(2500)
        u = tgt_setup(''); exp = expect(mk, u)
        G('H.g.paused = false'); G(TAP); G(RESET); G(f'H.g.towers[{mk}].cooldown = 0'); G(f'H.g.towers[{at}].t.combat && (H.g.towers[{at}].cooldown = 99)')
        t0g = G('H.g.time'); until(f'H.g.time > {t0g} + 1.5', 90000); dmg = G('window.__tap.by')
        check(G(f'H.pick({mk})') == exp['last'] and dmg.get(str(exp['last']), 0) != 0, f'in first person, the Marksman (Last) still shoots the last enemy {dmg}')
        shot(pg, 'fp_rage') if G('H.rage()') and not pg.wait_for_timeout(800) else None
        pg.keyboard.press('Escape'); pg.wait_for_timeout(800); G('H.killAllEnemies()')

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
            host.evaluate('__game.g.res.add(400000)'); host.evaluate('__game.mpDonate(1, 150000)')
            wait(cli, '__game.mp().credits > 100000', 8000)
            hc0 = host.evaluate('__game.g.res.credits'); cc0 = cli.evaluate('__game.mp().credits')
            cli.evaluate("document.getElementById('btn-overload').click()")
            okh = wait(host, '__game.g.overload === 1', 8000); okc = wait(cli, '__game.g.overload === 1', 8000)
            check(bool(okh) and bool(okc), 'client buys Overload through the host; both see level 1')
            hc1 = host.evaluate('__game.g.res.credits'); cc1 = wait(cli, f'__game.mp().credits < {cc0} - 400 && __game.mp().credits', 6000)
            check(abs(hc1 - hc0) < 50 and bool(cc1), f'the client wallet paid (host ¢{hc0:.0f}->¢{hc1:.0f}, client ¢{cc0:.0f}->¢{cc1 or 0:.0f})')
            host.evaluate('(() => { const g = __game.g; g.waves.active = true; })()')
            cli.keyboard.press('x')
            okh = wait(host, '__game.g.rageT > 0', 8000); okc = wait(cli, '__game.g.rageT > 0 && __game.g.rageCd > 20', 8000)
            check(bool(okh) and bool(okc), 'client X triggers the shared Rage; host + client both raging')
            okv = wait(cli, "document.body.classList.contains('raging')", 4000); check(bool(okv), 'client shows the rage vignette')
            host.evaluate('__game.rage()'); time.sleep(0.5)
            check(host.evaluate('__game.g.stats.rages') == 1, 'shared cooldown: host cannot re-trigger right after')
        b2.close()
    check(not errors, f'no console errors {errors[:3]}')
    br.close()
print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
