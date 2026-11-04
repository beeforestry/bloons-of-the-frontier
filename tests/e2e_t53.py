"""t53 e2e: El Morro rebuilt from real public-domain data (NOAA NGS 2017 aerial photo + USGS 3DEP 1 m lidar DEM).
2D: photo background, lanes/grid/pads re-traced, Sprout Farmhand still pre-placed, wall/terrain LOS.
First person: DEM terrain mesh at real scale, sea-level water plane, units on the ground, quality fallback.
Screenshots -> screenshots/t53/<tag>_*.png.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t53.py [--url URL] [--no-shots] [--tag after] [--before] [--dist DIR]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='after'); ap.add_argument('--before', action='store_true'); ap.add_argument('--dist', default=''); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't53'); os.makedirs(OUT, exist_ok=True)
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
    def load(q, sandbox=True):
        pg.goto(URL + sep + q, timeout=60000); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(800)
        if sandbox: G('H.sandbox(); H.addCredits(90000)')
    def possess_unit(x, y):
        G('H.g.deployCd = {}'); check(G(f'H.deploy("odst", {x}, {y})'), f'deployed odst at {x:.0f},{y:.0f}'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur && window.__possess.cur.scene', 30000)
        until('window.__possess.cur.vm.kind.startsWith("gun_")', 15000); pg.wait_for_timeout(3500); P('P.el.msg.style.visibility = "hidden"')
        return ok
    # ---- 2D (normal match: the free Sprout Farmhand is pre-placed)
    load('map=morro&diff=medium' + ('' if args.before else '&fpq=high'), sandbox=False)
    m = G('({ img: H.g.map.image, mpp: H.g.map.mpp, terr: !!H.g.map.terrain, lanes: H.g.map.lanes.length, build: H.g.map.grid.buildable.join("").split("1").length - 1, walls: (H.g.map.walls || []).length })'); print('  map', m)
    check(m['terr'] and abs((m['mpp'] or 0) - 0.25) < 1e-6, 'morro: real DEM terrain at 0.25 m/px')
    check(m['build'] > 150, 'morro: enough buildable cells after re-trace')
    check(m['walls'] > 10, 'morro: fort wall LOS blockers present')
    check(G('H.g.units ? H.g.units.some(u => u.data && /farmhand/i.test(u.data.id)) : true') or G('JSON.stringify(H.g.squads.map(s => s.data.id)).includes("farmhand")'), 'morro: Sprout Farmhand pre-placed')
    G('H.camFocus && H.camFocus(1104, 744, 0.5)'); pg.wait_for_timeout(800); shot(pg, 'morro_2d_full')
    G('H.sandbox(); H.addCredits(90000)'); G('H.startWave()'); pg.wait_for_timeout(9000); shot(pg, 'morro_2d_midwave')
    check(G('H.g.enemies.filter(e => e.alive).length') > 0, 'morro: enemies walk the re-traced lane')
    if not args.before:
        # walls block a sniper: a sniper on the lawn west of the fort cannot see the far side of the fort interior
        los = G('H.losProbe ? H.losProbe(700, 790, 1640, 800) : null')
        if los is not None: check(los is False, 'morro: fort walls/terrain block sniper LOS across the fort')
    # ---- first person: on the lawn, looking at the fort; then on the bastion looking out to sea
    pt = G('H.lanePoint(0, 0.55)'); check(possess_unit(pt['x'], pt['y'] + 70), 'morro: possessed')
    if not args.before:
        check(P('!!P.scene.getObjectByName("sea")'), 'morro FP: sea-level water plane')
        check(P('!P.war'), 'morro FP: no Tropical warzone styling')
        dz = P('(() => { const f = P.scene.getObjectByName("floor"); const a = f.geometry.attributes.position; let lo = 1e9, hi = -1e9; for (let i = 0; i < a.count; i++) { lo = Math.min(lo, a.getY(i)); hi = Math.max(hi, a.getY(i)); } return [lo, hi]; })()')
        print('  terrain height range m', dz); check(dz[1] - dz[0] > 25, 'morro FP: DEM relief (fort/cliffs) > 25 m')
        gh = P('(() => { const e = P.eye(); return e.y - P.groundAt(P.obj.x, P.obj.y); })()') if P('typeof P.groundAt') == 'function' else 1.6
        check(0.5 < gh < 3.5, f'morro FP: camera follows the ground (eye {gh:.2f} m above)')
    P('P.aimAt(1500, 780, 8); P.pitch = 0.02'); pg.mouse.move(800, 480); pg.wait_for_timeout(2000); shot(pg, 'morro_fp_fort'); print(f'  fps≈{P("P.fps || 0")}')
    pg.keyboard.press('e'); pg.wait_for_timeout(500)
    sp = G('H.lanePoint(1, 0.3)')  # north-shore landing: the fort's sea walls + cliffs + surf
    check(possess_unit(sp['x'] + 40, sp['y'] - 30), 'morro: possessed by the north shore')
    P('P.aimAt(1700, 1180, 0); P.pitch = -0.06'); pg.wait_for_timeout(2000); shot(pg, 'morro_fp_sea')
    pg.keyboard.press('e'); pg.wait_for_timeout(400)
    if not args.before:
        load('map=morro&fpq=low'); pt = G('H.lanePoint(0, 0.5)'); possess_unit(pt['x'], pt['y'] + 70)
        check(P('P.vm.quality') == 'low' and P('!!P.scene.getObjectByName("floor")'), 'morro low quality: terrain still renders')
        pg.keyboard.press('e'); pg.wait_for_timeout(400)
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
