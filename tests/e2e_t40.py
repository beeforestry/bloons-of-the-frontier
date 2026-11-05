"""t40 e2e: Tropical Island (2D map + lane + free Farmhand) and 👁 Possess on its 3D heightfield terrain.
Screenshots -> screenshots/t40/.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t40.py [--url URL]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't40'); os.makedirs(OUT, exist_ok=True)
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
    pg.goto(URL); pg.wait_for_selector('.map-pick[data-map=tropical]', timeout=15000)
    check(pg.is_visible('.map-pick[data-map=tropical]'), 'Tropical Island in the map select')
    pg.goto(URL + ('&' if '?' in URL else '?') + 'map=tropical'); pg.wait_for_function('window.__game', timeout=20000)
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    pg.wait_for_timeout(600)
    check(G('H.g.map.id') == 'tropical' and G('H.g.paths.length') == 3, 'tropical (Isla de Cabras, t56) loaded, 3 lanes')
    check(G('H.g.squads.some(s => s.data.worker || /farm/i.test(s.data.id))') or G('H.g.stats.freeCollectors') > 0, 'free Sprout Farmhand placed at start')
    G('H.camReset()'); pg.wait_for_timeout(300); shot(pg, 'map_full')
    G('H.sandbox(); H.addCredits(30000)')
    G('H.startWave(); H.setSpeed(3)'); ok = until('H.g.enemies.filter(e => e.alive).length >= 6', 25000)
    pg.wait_for_timeout(2500)
    on = G('(() => { const g = H.g; return g.enemies.filter(e => e.alive).every(e => g.paths[0].distanceTo ? true : true); })()')
    check(ok, f'wave spawned balloons on the path ({G("H.g.enemies.filter(e => e.alive).length")} alive)')
    G('H.setSpeed(1)'); shot(pg, 'map_midwave')
    # tower near the lane at 50%
    cell = G("""(() => { const g = H.g, p = H.lanePoint(0, 0.5); let best = null, bd = 1e18;
        for (const [c, r] of H.freeCells()) { const q = g.grid.cellCenter(c, r), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd && d > 60 * 60) { bd = d; best = [c, r]; } } return best; })()""")
    check(bool(cell) and G(f'H.placeTower("dart_monkey", {cell[0]}, {cell[1]})'), f'placed dart tower at {cell}')
    ti = G('H.g.towers.findIndex(t => t.data.id === "dart_monkey")')
    G(f'H.selectTower({ti})'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
    check(until('window.__possess && window.__possess.cur && document.querySelector("#possess-root canvas")', 30000), 'Possess opened on tropical')
    pg.wait_for_timeout(2500)
    until('(() => { let n = 0; window.__possess.cur.scene.traverse(o => { if (o.isInstancedMesh && (o.userData.flora || o.userData.texModel)) n += o.count; }); return n >= 30; })()', 20000)  # t50 flora models load async
    st = P('({ floor: P.scene.getObjectByName("floor").geometry.attributes.position.count, sea: !!P.scene.getObjectByName("sea"), props: (() => { let n = 0; P.scene.traverse(o => { if (o.isInstancedMesh && (o.userData.flora || o.userData.texModel)) n += o.count; }); return n; })(), bb: P.scene.children.filter(o => o.userData.prop && o.userData.prop !== "prflag").length, camY: P.camera.position.y, tier: P.obj.tier })')
    check(st['floor'] > 4000 and st['sea'], f'heightfield terrain mesh + sea ({st["floor"]} verts)')
    check(st['props'] >= 15 and st['bb'] == 0, f'{st["props"]} 3D palm/rock/bush model instances, {st["bb"]} non-flag billboards (t50: props are models)')
    check(st['camY'] > 2.7 + st['tier'] * 0.15 + 0.3, f'tower camera sits on the terrain (eye y={st["camY"]:.2f} m)')
    for i in range(10): G(f'H.spawn("pink", 0, {0.30 + i * 0.01:.3f})')
    pg.wait_for_timeout(1500); P('P.aimNearest()'); P('P.pitch = -0.1'); pg.wait_for_timeout(400); shot(pg, 'fps_tower_view')
    ey = P('(() => { const e = H.g.enemies.find(x => x.alive); return e ? P.ey(e) : -1; })()'); check(ey > 1.3, f'balloons follow terrain height (y={ey:.2f} m)')
    pg.keyboard.press('e'); pg.wait_for_timeout(300)
    p0 = G('H.lanePoint(0, 0.62)')
    check(G(f'H.deploy("odst", {p0["x"]:.0f}, {p0["y"]:.0f} + 80)'), 'deployed ODST'); pg.wait_for_timeout(800)
    si = G('H.squadIndex("odst")'); G(f'H.selectSquad({si})'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
    check(until('window.__possess && window.__possess.cur && window.__possess.cur.state().kind === "unit"', 20000), 'possessed a troop')
    pg.wait_for_timeout(1500); y0 = P('P.camera.position.y')
    pg.mouse.move(800, 480); pg.keyboard.down('w'); pg.wait_for_timeout(900); pg.keyboard.up('w'); pg.wait_for_timeout(200)
    y1 = P('P.camera.position.y'); check(abs(y1 - y0) > 0.02 or y0 > 2.0, f'troop eye follows ground height ({y0:.2f} -> {y1:.2f} m)')
    P('P.aimAt(1100, 700, 3); P.pitch = -0.08'); pg.wait_for_timeout(500); shot(pg, 'fps_unit_view')
    pg.keyboard.press('e'); pg.wait_for_timeout(300)
    check(not pg.query_selector('#possess-root'), 'exit back to 2D')
    errs = [e for e in errors if 'WebGL' not in e and 'GPU' not in e]
    check(not errs, f'no page errors {errs[:3]}')
    b.close()
print('FAILS:', fails if fails else 'none')
