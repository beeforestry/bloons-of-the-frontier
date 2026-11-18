"""t103 e2e: element status combos (idea inspired by vega-star/lightkeepers, Apache-2.0; no code reused).
  A. Unit-level: statuses stamp, timers, and each combo (Conduct, Freeze incl. boss resist, Shatter, Steam, Wildfire,
     fire-melts-frost, burn DoT) with the tuned numbers.
  B. Real towers: Tesla Coil + Corrosive Glue (tier 2) + Frost Bastion next to a lane stamp statuses and trigger combos
     on live enemies; 2D screenshots of a combo + status icons; tower panel element line + ⚗ guide; menu guide button.
  C. First person: possess the Tesla Coil and see tinted (status) enemies + chain-lightning arc (screenshot).
Usage: /workspace/.venv-pw/bin/python tests/e2e_t103.py [--url URL] [--tag live] [--no-shots] [--only ABC]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--only', default='ABC'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't103'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url if args.url.endswith('/') or args.url.endswith('.html') else args.url + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if args.no_shots: return
    path = os.path.join(OUT, f'{args.tag}_{name}.png'); pg.screenshot(path=path); print('  shot', path, flush=True)
near = lambda a, b, tol: abs(a - b) <= tol
PLACE = """(id, lane, frac, off) => { const g = H.g, p = g.paths[lane];
  for (const o of [off, off + 18, off + 36, off + 54, -off, -off - 18, -off - 36, -off - 54]) for (const dd of [0, 30, -30, 60, -60, 90, -90]) {
    const b = p.at(Math.max(0, Math.min(p.length, p.length * frac + dd))); const x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
    const s = g.placementSpot ? g.placementSpot(id, { x, y }) : null; if (!s) continue; const t = g.placeTower(id, s); if (t) return [Math.round(t.x), Math.round(t.y), g.towers.indexOf(t)]; }
  return null; }"""
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
    combos = lambda: G('H.stats().elem')
    st = lambda uid: G(f'H.elemState({uid})')
    hit = lambda uid, el, dur, dmg, typ='magic', heavy=False: G(f'H.elemHit({uid}, {json.dumps(el)}, {dur}, {dmg}, {json.dumps(typ)}, {json.dumps(heavy)})')
    spawn = lambda eid='red', lane=0, frac=0.4, hp=200: G(f'H.spawn({json.dumps(eid)}, {lane}, {frac}, {hp})')

    # ---------------------------------------------------------------- A: unit-level combos
    if 'A' in args.only:
        load('tropical')
        ET = {t['id']: t for t in G('H.elemTowers()')}
        exp = {'unsc_destroyer': ('wet', [3, 3.5, 4]), 'glue_slinger': ('wet', [0, 2.5, 3]), 'flame_melon_mortar': ('burn', [3, 3.5, 4]), 'unsc_tank': ('burn', [0, 0, 3]),
               'frost_wallnut_bastion': ('chill', [2, 2.5, 3]), 'tesla_coil': ('shock', [1.5, 2, 2.5]), 'unsc_beacon': ('shock', [0, 1.5, 2]), 'unsc_rail': ('shock', [0, 1.5, 2])}
        check(all(k in ET and ET[k]['el'] == v[0] and ET[k]['tiers'] == v[1] for k, v in exp.items()) and len(ET) == len(exp), f'element towers / tier durations {ET}')
        G('H.g.paused = true')
        a = spawn(); hit(a, 'wet', 3, 1); s = st(a)
        check(near(s['wet'], 3, 0.05) and s['burn'] == 0, f'Soaked stamped (wet {s["wet"]:.2f}s)')
        # Conduct: soaked + shock -> chain to co-located neighbours (0.5*10 + 4 = 9 each)
        n1, n2 = spawn(), spawn(); h0 = st(n1)['hp']
        hit(a, 'shock', 2, 10); s, c1 = st(a), combos()
        check(c1.get('conduct', 0) >= 1 and s['wet'] <= 0, f'CONDUCT triggered on wet+shock ({c1}), wet consumed')
        check(near(h0 - st(n1)['hp'], 9, 0.6) and near(h0 - st(n2)['hp'], 9, 0.6), f'chain lightning hit neighbours for 9 each ({h0 - st(n1)["hp"]:.1f}, {h0 - st(n2)["hp"]:.1f})')
        # order independence: shock first, then wet
        a2 = spawn('red', 1, 0.5); spawn('red', 1, 0.5); hit(a2, 'shock', 2, 1); hit(a2, 'wet', 3, 1)
        check(combos().get('conduct', 0) >= 2, 'CONDUCT also when the water lands second')
        # Freeze
        f = spawn('red', 2, 0.3); hit(f, 'wet', 3, 1); hit(f, 'chill', 2, 1); s = st(f)
        check(combos().get('freeze', 0) >= 1 and near(s['stunT'], 1.4, 0.05) and s['frozenT'] > 1.3 and s['wet'] <= 0 and s['chill'] <= 0, f'FREEZE: stun {s["stunT"]:.2f}s, statuses consumed')
        hit(f, 'wet', 3, 1); hit(f, 'chill', 2, 1); s = st(f)
        check(s['wet'] > 0 or s['chill'] > 0, 'FREEZE immunity window (no instant re-freeze)')
        bosses = [e['id'] for e in G('H.enemyIds()') if e['boss']]
        if bosses:
            bz = spawn(bosses[0], 0, 0.2, 1); hit(bz, 'wet', 3, 1); hit(bz, 'chill', 2, 1); s = st(bz)
            check(s is not None and s['stunT'] <= 0.45, f'boss {bosses[0]} resists freeze (stun {s and round(s["stunT"], 2)}s ≤ 0.45)')
        # Shatter: chilled + heavy hit = +60 %; frozen + heavy = +100 %
        sh, ctl = spawn('red', 0, 0.6), spawn('red', 0, 0.62)
        hit(sh, 'chill', 2, 0.001); h1 = st(sh)['hp']; hit(sh, None, 0, 10, 'ballistic', True); hit(ctl, None, 0, 10, 'ballistic', True)
        d_sh, d_ctl = h1 - st(sh)['hp'], 200 - st(ctl)['hp']
        check(combos().get('shatter', 0) >= 1 and near(d_sh, 16, 0.3) and near(d_ctl, 10, 0.1), f'SHATTER chilled: {d_sh:.1f} vs {d_ctl:.1f} plain')
        fz = spawn('red', 1, 0.7); hit(fz, 'wet', 3, 0.001); hit(fz, 'chill', 2, 0.001); h1 = st(fz)['hp']; hit(fz, None, 0, 10, 'explosive'); s = st(fz)
        check(near(h1 - s['hp'], 20, 0.3) and s['frozenT'] <= 0 and s['stunT'] <= 0, f'SHATTER frozen: {h1 - s["hp"]:.1f} dmg, ice broken')
        # Steam: burning + water -> fire out, +20 % damage taken
        sm = spawn('red', 2, 0.5); hit(sm, 'burn', 3, 1); hit(sm, 'wet', 3, 0.001); s = st(sm)
        check(combos().get('steam', 0) >= 1 and s['burn'] <= 0 and s['steamT'] > 2.9, f'STEAM: burn out, steam {s["steamT"]:.2f}s')
        h1 = s['hp']; hit(sm, None, 0, 10); check(near(h1 - st(sm)['hp'], 12, 0.2), f'STEAM vulnerability: 10 -> {h1 - st(sm)["hp"]:.1f}')
        # Wildfire: explosion on a burning enemy spreads fire
        w0 = spawn('red', 0, 0.8); w1, w2 = spawn('red', 0, 0.8), spawn('red', 0, 0.8)
        hit(w0, 'burn', 3, 10); check(st(w1)['burn'] <= 0, 'neighbours not burning yet')
        hit(w0, None, 0, 1, 'explosive'); s1, s2 = st(w1), st(w2)
        check(combos().get('wildfire', 0) >= 1 and s1['burn'] > 2.9 and s2['burn'] > 2.9 and near(s1['burnDps'], 1.0, 0.01), f'WILDFIRE spread (burn {s1["burn"]:.2f}s, {s1["burnDps"]} dps)')
        # fire melts frost
        mf = spawn('red', 1, 0.2); hit(mf, 'chill', 2, 1); hit(mf, 'burn', 3, 10); s = st(mf)
        check(s['chill'] <= 0 and s['burn'] <= 0, 'fire + frost cancel')
        # burn damage over time (unpaused)
        bd = spawn('red', 2, 0.1, 500); hit(bd, 'burn', 3, 40); h1 = st(bd)['hp']
        G('H.g.paused = false'); pg.wait_for_timeout(2600); G('H.g.paused = true'); s = st(bd)
        check(s is not None and 3 <= h1 - s['hp'] <= 13, f'burn DoT ticks ({h1 - (s["hp"] if s else 0):.1f} dmg over ~2.6 s at 4 dps)')
        G('H.g.paused = false')

    # ---------------------------------------------------------------- B: real towers + 2D visuals + UI
    if 'B' in args.only:
        load('tropical')
        G('H.g.res.load({ credits: 1e7, scrap: 1e5 }, true)')
        lane, frac = 0, 0.45
        pts = None
        for frac in (0.45, 0.35, 0.55, 0.3, 0.6, 0.25, 0.65):
            t1 = G(f'({PLACE})("tesla_coil", {lane}, {frac}, 44)'); t2 = G(f'({PLACE})("glue_slinger", {lane}, {frac}, 70)'); t3 = G(f'({PLACE})("frost_wallnut_bastion", {lane}, {frac}, 96)')
            if t1 and t2 and t3: pts = (t1, t2, t3); break
            G('H.g.towers.forEach(t => t.sell ? null : null)')
        check(pts is not None, f'placed Tesla + Glue + Frost Bastion by lane {lane} at {frac}: {pts}')
        if pts:
            gi = pts[1][2]; G(f'H.g.towers[{gi}].upgrade(H.g)')
            check(G(f'H.g.towers[{gi}].tier') == 1, 'Glue Slinger upgraded to Corrosive Glue (wet unlocked)')
            G(f'H.focus({pts[0][0]}, {pts[0][1]}, 1.6)')
            G('H.g.speed = 1')
            # a slow, beefy stream so statuses and combos have time to stack
            G(f"(() => {{ let n = 0; const iv = setInterval(() => {{ for (const id of ['red', 'blue', 'green']) H.spawn(id, {lane}, Math.max(0, {frac} - 0.12), 40); if (++n > 30) clearInterval(iv); }}, 450); }})()")
            ok = until('H.stats().elemApplied > 5 && H.g.enemies.some(e => e.el.shock > 0 || e.el.wet > 0 || e.el.chill > 0)', 30000)
            check(ok, f'real towers stamp statuses (applied {G("H.stats().elemApplied")})')
            pg.wait_for_timeout(1200)
            G('(() => { const es = H.g.enemies.filter(e => e.alive && (e.el.wet > 0 || e.el.shock > 0 || e.el.chill > 0)); if (es.length) H.focus(es[0].x, es[0].y + 30, 2.2); })()')
            pg.wait_for_timeout(300); shot(pg, '2d_status_icons')
            ok = until('(H.stats().elem.conduct || 0) > 0', 30000); c = combos()
            check(ok, f'real Tesla + soaking glue trigger CONDUCT ({c})')
            # capture a frame with an arc / popup on screen
            n0 = c.get('conduct', 0); until(f'(H.stats().elem.conduct || 0) > {n0}', 8000); pg.wait_for_timeout(60); shot(pg, '2d_conduct_combo')
            ok = until('(H.stats().elem.freeze || 0) > 0', 30000); check(ok, f'real Glue + Frost Bastion trigger FREEZE ({combos()})')
            # tower panel element line + guide button
            G(f'H.selectTower({pts[0][2]})'); pg.wait_for_timeout(500)
            txt = pg.inner_text('#sel-panel') if pg.query_selector('#sel-panel') else pg.evaluate("() => (document.querySelector('.sp-elem')||{}).textContent || ''")
            el = pg.evaluate("() => (document.querySelector('.sp-elem')||{}).textContent || ''")
            check('Shocked' in el and 'Conduct' in el, f'tower panel element line: {el.strip()[:90]}')
            pg.click('#sp-combos'); pg.wait_for_selector('#combo-guide', timeout=4000)
            gt = pg.inner_text('#combo-guide')
            check(all(k in gt for k in ('CONDUCT', 'FREEZE', 'SHATTER', 'STEAM', 'WILDFIRE', 'CONDUCCIÓN', 'Lightkeepers')), 'combo guide lists 5 combos (EN + ES) + credit')
            shot(pg, '2d_combo_guide'); pg.click('#cg-close')
            check(pg.query_selector('#combo-guide') is None, 'guide closes')
        # menu button
        pg.goto(URL, timeout=90000); pg.wait_for_selector('#btn-combos', timeout=60000); pg.click('#btn-combos')
        check(pg.query_selector('#combo-guide') is not None, 'menu ⚗ Element combos button opens the guide')

    # ---------------------------------------------------------------- C: first person tint + arc
    if 'C' in args.only:
        load('tropical')
        G('H.g.res.load({ credits: 1e7, scrap: 1e5 }, true)')
        t = None
        for frac in (0.45, 0.35, 0.55, 0.3, 0.6):
            t = G(f'({PLACE})("tesla_coil", 0, {frac}, 44)')
            if t: g2 = G(f'({PLACE})("glue_slinger", 0, {frac}, 70)'); break
        check(t is not None, f'FP: tesla placed {t}')
        if t:
            G('H.g.towers.forEach(x => { if (x.data.id === "glue_slinger") x.upgrade(H.g) })')
            G(f"(() => {{ let n = 0; const iv = setInterval(() => {{ for (const id of ['red', 'blue', 'green', 'yellow']) H.spawn(id, 0, Math.max(0, {frac} - 0.1), 60); if (++n > 40) clearInterval(iv); }}, 500); }})()")
            G(f'H.selectTower({t[2]})'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
            ok = until('window.__possess && window.__possess.cur', 90000); check(ok, 'possessed the Tesla Coil')
            pg.wait_for_timeout(4000)
            n0 = G('H.stats().elemApplied')
            got = until(f'H.g.enemies.some(e => e.el.wet > 0 || e.el.shock > 0 || e.el.frozenT > 0)', 30000)
            check(got, 'FP: enemies carry statuses while possessed')
            # aim at the nearest soaked enemy
            pg.evaluate("""() => { const P = window.__possess.cur, g = window.__game.g; const e = g.enemies.filter(e => e.alive).sort((a, b) => (a.el.wet > 0 ? 0 : 1) - (b.el.wet > 0 ? 0 : 1))[0]; if (e && P.aimAt) P.aimAt(e.x, e.y, 0.8); if (P.el && P.el.msg) P.el.msg.style.visibility = 'hidden'; }""")
            c0 = G('H.stats().elem.conduct || 0'); until(f'(H.stats().elem.conduct || 0) > {c0}', 12000); pg.wait_for_timeout(40)
            shot(pg, 'fp_status_tint_conduct')
            nb = pg.evaluate("() => window.__possess.cur.elemIcons.filter(s => s.visible).length")
            check(nb > 0, f'FP: {nb} floating status badges over enemies')
            check(G('H.stats().elemApplied') > n0, 'FP: statuses keep stamping in first person')
    check(not errors, f'no console errors {errors[:3]}')
    b.close()
print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
