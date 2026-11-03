"""t51 e2e: textured first person — textured CC0 plants (LOD), textured guns + leather gloves, ACES/HDRI/bloom
with a quality fallback, tank cockpit without the rifle. Screenshots -> screenshots/t51/<tag>_*.png.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t51.py [--url URL] [--no-shots] [--tag after] [--before]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='after'); ap.add_argument('--before', action='store_true'); ap.add_argument('--dist', default=''); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't51'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=args.dist or os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
errors, fails = [], []
def check(c, msg):
    if args.before: print('  info ' + msg + ' = ' + str(bool(c)), flush=True); return
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name, clip=None):
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, f'{args.tag}_{name}.png'), clip=clip)
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
    def load(m):
        if not args.before: m += '&fpq=high'  # pin high quality (swiftshader would auto-downgrade within seconds)
        pg.goto(URL + sep + 'map=' + m, timeout=60000); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(500); G('H.sandbox(); H.addCredits(90000)')
    def possess_unit(x, y):
        G(f'H.deploy("odst", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.squadIndex("odst"))'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur && window.__possess.cur.scene', 30000)
        until('window.__possess.cur.vm.flora > 0', 25000); until('window.__possess.cur.vm.kind.startsWith("gun_")', 15000); pg.wait_for_timeout(3000); P('P.el.msg.style.visibility = "hidden"')
        return ok
    near = lambda pts, me: sorted(pts, key=lambda w: (w[1] - me['x']) ** 2 + (w[2] - me['y']) ** 2)
    def textured_checks(m):
        t = P('P.vm.tex || {}'); print('  vm.tex', t, 'flora', P('P.vm.flora'), 'quality', P('P.vm.quality'))
        check(t.get('flora', 0) >= 2, f'{m}: plants use textured (mapped) materials')
        check(t.get('lod', 0) >= 1, f'{m}: distant plants switch to a lighter LOD')
        check(t.get('gun', 0) >= 1 and t.get('glove', 0) >= 1, f'{m}: textured gun + leather gloves')
        check(P('P.renderer.toneMapping') == 4 and P('!!P.scene.environment'), f'{m}: ACES tone mapping + HDRI environment')
    # ---- Tropical warzone
    load('tropical')
    pt = G('H.lanePoint(0, 0.42)'); check(possess_unit(pt['x'] + 55, pt['y'] + 60), 'tropical: possessed')
    textured_checks('tropical')
    check(until('window.__possess.cur.war && window.__possess.cur.war.count.wrecks >= 4', 15000), 'tropical: wrecks still load')
    check(P('(() => { let n = 0; P.scene.traverse(o => { if (o.isMesh && o.userData.stray) n++; }); return n; })()') == 0, 'tropical: no stray env boxes')
    me = P('({ x: P.obj.x, y: P.obj.y })')
    W = near(G('H.g.map.terrain.props.filter(p => p[0].startsWith("wtank") || p[0] === "wheli")'), me)
    P(f'P.aimAt({W[0][1]}, {W[0][2]}, 0); P.pitch = -0.05'); pg.mouse.move(800, 480); pg.wait_for_timeout(1500); shot(pg, 'tropical_fp')
    pg.wait_for_timeout(300); shot(pg, 'gun_closeup', {'x': 700, 'y': 420, 'width': 900, 'height': 540})
    print(f'  tropical fps≈{P("P.fps || 0")}')
    pg.keyboard.press('e'); pg.wait_for_timeout(400)
    # palm close-up: stand next to a burnt palm
    pa = [p for p in G('H.g.map.terrain.props') if p[0] in ('bpalm', 'bpalm2')]
    lp = G('H.lanePoint(0, 0.2)'); pa = near(pa, lp)[0]
    check(possess_unit(pa[1] + 70, pa[2] + 40), 'tropical: possessed next to a palm')
    P(f'P.aimAt({pa[1]}, {pa[2]}, 4); P.pitch = 0.25'); pg.wait_for_timeout(1500); shot(pg, 'tropical_palm_closeup')
    pg.keyboard.press('e'); pg.wait_for_timeout(400)
    # ---- Garden
    load('garden')
    pt = G('H.lanePoint(0, 0.3)'); check(possess_unit(pt['x'] + 70, pt['y'] + 60), 'garden: possessed')
    textured_checks('garden')
    me = P('({ x: P.obj.x, y: P.obj.y })'); d = near(G('H.g.map.deco.filter(p => ["oak","pine","rtree"].includes(p[0]))'), me)
    if d: P(f'P.aimAt({d[0][1]}, {d[0][2]}, 0); P.pitch = 0.05')
    pg.mouse.move(800, 480); pg.wait_for_timeout(1500); shot(pg, 'garden_fp'); print(f'  garden fps≈{P("P.fps || 0")}')
    pg.keyboard.press('e'); pg.wait_for_timeout(400)
    bu = near(G('H.g.map.deco.filter(p => ["hedge","rose","fern","redflower","monstera","bamboo"].includes(p[0]))'), G('H.lanePoint(0, 0.5)'))
    if bu:
        check(possess_unit(bu[0][1] + 45, bu[0][2] + 30), 'garden: possessed next to a bush')
        P(f'P.aimAt({bu[0][1]}, {bu[0][2]}, 0); P.pitch = -0.35'); pg.wait_for_timeout(1500); shot(pg, 'garden_bush_closeup')
        pg.keyboard.press('e'); pg.wait_for_timeout(400)
    # ---- Tank cockpit: no rifle viewmodel; low quality fallback
    spot = G("""(() => { const g = H.g, p = H.lanePoint(0, 0.5); let best = null, bd = 1e18;
        for (let r = 1; r < g.grid.rows - 3; r++) for (let c = 1; c < g.grid.cols - 3; c++) { if (!g.grid.fits(c, r, 3)) continue; const q = g.grid.cellCenter(c + 1, r + 1), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd && d > 90 * 90) { bd = d; best = [c, r]; } } return best; })()""")
    if spot and G(f'H.placeTower("unsc_tank", {spot[0]}, {spot[1]})'):
        ti = G('H.g.towers.findIndex(t => t.data.id === "unsc_tank")'); G(f'H.g.towers[{ti}].upgrade(H.g)'); G(f'H.selectTower({ti})')
        pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
        check(until('window.__possess && window.__possess.cur && window.__possess.cur.vm.kind === "tank_cannon"', 30000), 'tank: cockpit viewmodel')
        pg.wait_for_timeout(2500); P('P.el.msg.style.visibility = "hidden"')
        check(P('(() => { let n = 0; P.gun.traverse(o => { if (o.userData.gunKind) n++; }); return n; })()') == 0, 'tank: no rifle in the cockpit view')
        shot(pg, 'tank_cockpit'); pg.keyboard.press('e'); pg.wait_for_timeout(400)
    else: check(False, 'tank placed')
    # low-quality fallback (forced): no bloom composer, still renders
    if not args.before:
        pg.goto(URL + sep + 'map=garden&fpq=low'); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(500); G('H.sandbox(); H.addCredits(90000)')
        pt = G('H.lanePoint(0, 0.3)'); possess_unit(pt['x'] + 70, pt['y'] + 60)
        check(P('P.vm.quality') == 'low' and not P('!!P.composer'), 'low quality: no bloom pass, no env')
        pg.keyboard.press('e'); pg.wait_for_timeout(400)
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
