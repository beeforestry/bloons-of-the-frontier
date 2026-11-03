"""t50 e2e: 3D Kenney flora in first person on every map, Tropical warzone (2D repaint + FP wrecks/smoke/ash).
Screenshots -> screenshots/t50/.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t50.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't50'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, name + '.png'))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    def possess_at(f, off):
        p = G(f'H.lanePoint(0, {f})'); G(f'H.deploy("odst", {p["x"] + off[0]}, {p["y"] + off[1]})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.squadIndex("odst"))'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur && window.__possess.cur.scene', 30000)
        until('window.__possess.cur.vm.flora > 0', 20000); pg.wait_for_timeout(2500); P('P.el.msg.style.visibility = "hidden"')
        return ok
    # ---- Tropical warzone: 2D full map + mid-wave
    pg.goto(URL + sep + 'map=tropical'); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(600)
    G('H.sandbox(); H.addCredits(90000)')
    props = G('H.g.map.terrain.props.map(p => p[0])')
    check(not any(k in ('tbush', 'palm', 'palm2') for k in props), 'tropical: no cute bushes / green palms left')
    check(sum(k.startswith('w') and k != 'wire' for k in props) >= 4 and 'bunker' in props and 'wire' in props, f'tropical: wrecks/bunkers/wire placed ({len(props)} props)')
    G('H.camFocus && H.camFocus(1104, 744, 0.5)'); pg.wait_for_timeout(500); shot(pg, 'tropical_2d_full')
    G('H.startWave()'); pg.wait_for_timeout(9000); shot(pg, 'tropical_2d_midwave')
    check(G('H.g.enemies.filter(e => e.alive).length') > 0, 'tropical: wave running')
    # ---- Tropical FP: wreck + smoke + burnt palms
    check(possess_at(0.42, (55, 60)), 'tropical: possessed')
    war = P('P.war && P.war.count'); fl = P('P.vm.flora')
    print('  war', war, 'flora', fl)
    check(bool(war) and war['smoke'] >= 4 and war['props'] >= 4, 'tropical FP: smoke columns + bunkers/wire/sandbags')
    check(until('window.__possess.cur.war.count.wrecks >= 4', 15000), 'tropical FP: wreck models loaded')
    check(P('!!P.scene.getObjectByName("ash") && !!P.scene.getObjectByName("flora")'), 'tropical FP: ash + 3D flora present')
    check(P('(() => { let s = 0; P.scene.traverse(o => { if (o.isSprite && o.userData.prop && o.userData.prop !== "prflag") s++; }); return s; })()') == 0, 'tropical FP: no billboard plants left')
    W = G('H.g.map.terrain.props.filter(p => p[0].startsWith("wtank") || p[0] === "wheli")')
    me = P('({ x: P.obj.x, y: P.obj.y })'); W.sort(key=lambda w: (w[1] - me['x']) ** 2 + (w[2] - me['y']) ** 2)
    P(f'P.aimAt({W[0][1]}, {W[0][2]}, 0); P.pitch = -0.05'); pg.mouse.move(800, 480); pg.wait_for_timeout(1500); shot(pg, 'tropical_fp_wreck_smoke')
    P(f'P.aimAt({W[1][1]}, {W[1][2]}, 0); P.pitch = 0.02'); pg.wait_for_timeout(1200); shot(pg, 'tropical_fp_view2')
    print(f'  tropical fps≈{P("P.fps || 0")}')
    pg.keyboard.press('e'); pg.wait_for_timeout(400)
    # ---- other maps: 3D trees
    for m, f, off in (('garden', 0.3, (70, 60)), ('jungle', 0.35, (60, 60))):
        pg.goto(URL + sep + 'map=' + m); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(400); G('H.sandbox(); H.addCredits(90000)')
        check(possess_at(f, off), f'{m}: possessed')
        n = P('P.vm.flora'); im = P('(() => { const f = P.scene.getObjectByName("flora"); return f ? f.children.length : 0; })()')
        check(n >= 100 and im >= 6, f'{m}: 3D flora instanced ({n} items, {im} instanced meshes)')
        d = G('H.g.map.deco.filter(p => ["oak","pine","palm","rtree","palm2"].includes(p[0]))')
        me = P('({ x: P.obj.x, y: P.obj.y })'); d.sort(key=lambda w: (w[1] - me['x']) ** 2 + (w[2] - me['y']) ** 2)
        if d: P(f'P.aimAt({d[0][1]}, {d[0][2]}, 0); P.pitch = 0.05')
        pg.mouse.move(800, 480); pg.wait_for_timeout(1500); shot(pg, f'{m}_fp_trees'); print(f'  {m} fps≈{P("P.fps || 0")}')
        pg.keyboard.press('e'); pg.wait_for_timeout(400)
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
