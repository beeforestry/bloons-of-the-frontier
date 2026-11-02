"""t42 e2e: UNSC Tank + Gunship towers (3x3 pads, tiers), military props on every map, first-person gun viewmodel + real-scale vehicles.
Screenshots -> screenshots/t40/.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t40.py [--url URL]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't42'); os.makedirs(OUT, exist_ok=True)
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
    pg.goto(URL + ('&' if '?' in URL else '?') + 'map=garden'); pg.wait_for_function('window.__game', timeout=20000)
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    pg.wait_for_timeout(600)
    sep = '&' if '?' in URL else '?'
    # props on every map
    for m in ['jungle', 'fortress', 'morro', 'tropical', 'garden']:
        pg.goto(URL + sep + 'map=' + m); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(300)
        n = G('H.g.props.length'); kinds = G('[...new Set(H.g.props.map(p => p.kind))].length')
        blocked = G('H.g.props.every(p => !H.g.grid.fits(...(() => { const g = H.g, c = Math.floor(p.x / 48), r = Math.floor(p.y / 48); return [c - 1, r - 1, 3]; })()))')
        check(n >= 5 and kinds >= 4 and blocked, f'{m}: {n} prop clusters ({kinds} kinds), cells blocked for placement')
    G('H.sandbox(); H.addCredits(90000)')
    # three tanks side by side for the tier sheet + a gunship and a tank near the lane
    spots = G("""(() => { const g = H.g; for (let r = 3; r < g.grid.rows - 4; r++) for (let c = 2; c < g.grid.cols - 14; c++)
        if (g.grid.fits(c, r, 3) && g.grid.fits(c + 5, r, 3) && g.grid.fits(c + 10, r, 3)) return [[c, r], [c + 5, r], [c + 10, r]]; return null; })()""")
    check(bool(spots), f'found a row of three 3x3 pads {spots}')
    for c, r in spots: check(G(f'H.placeTower("unsc_tank", {c}, {r})'), f'Tank placed on 3x3 pad at {c},{r}')
    ids = G('H.g.towers.map((t, i) => [i, t.data.id]).filter(x => x[1] === "unsc_tank").map(x => x[0])')
    tk = lambda i: G(f'(() => {{ const t = H.g.towers[{i}]; return [t.tier, t.data.tiers ? 0 : 0, t.x, t.y, t.dps ? t.dps() : 0]; }})()')
    G(f'H.g.towers[{ids[1]}].upgrade(H.g)'); G(f'H.g.towers[{ids[2]}].upgrade(H.g)'); G(f'H.g.towers[{ids[2]}].upgrade(H.g)')
    tiers = [G(f'H.g.towers[{i}].tier') for i in ids]
    check(tiers == [0, 1, 2], f'Tank upgrades through all tiers {tiers}')
    occ = G(f'(() => {{ const t = H.g.towers[{ids[0]}], c = Math.floor(t.x / 48), r = Math.floor(t.y / 48); return H.g.grid.fits(c - 1, r - 1, 3) || H.g.grid.fits(c, r, 1); }})()')
    check(not occ, 'Tank occupies its whole 3x3 pad')
    mid = G(f'[H.g.towers[{ids[1]}].x, H.g.towers[{ids[1]}].y]')
    G(f'H.camFocus({mid[0]}, {mid[1]} - 40, 1.6)'); pg.wait_for_timeout(700); shot(pg, 'tank_tiers')
    cell = G("""(() => { const g = H.g, p = H.lanePoint(0, 0.45); let best = null, bd = 1e18;
        for (let r = 1; r < g.grid.rows - 3; r++) for (let c = 1; c < g.grid.cols - 3; c++) { if (!g.grid.fits(c, r, 3)) continue; const q = g.grid.cellCenter(c + 1, r + 1), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd && d > 100 * 100) { bd = d; best = [c, r]; } } return best; })()""")
    check(bool(cell) and G(f'H.placeTower("unsc_heli", {cell[0]}, {cell[1]})'), f'Gunship placed at {cell}')
    hi = G('H.g.towers.findIndex(t => t.data.id === "unsc_heli")')
    up = [G(f'H.g.towers[{hi}].upgrade(H.g)') for _ in range(2)]
    check(all(up) and G(f'H.g.towers[{hi}].tier') == 2, 'Gunship upgrades to tier 3')
    c2 = G(f"""(() => {{ const g = H.g, h = g.towers[{hi}]; let best = null, bd = 1e18;
        for (let r = 1; r < g.grid.rows - 3; r++) for (let c = 1; c < g.grid.cols - 3; c++) {{ if (!g.grid.fits(c, r, 3)) continue; const q = g.grid.cellCenter(c + 1, r + 1), d = (q.x - h.x) ** 2 + (q.y - h.y) ** 2; if (d < bd && d > 230 * 230) {{ bd = d; best = [c, r]; }} }} return best; }})()""")
    check(bool(c2) and G(f'H.placeTower("unsc_tank", {c2[0]}, {c2[1]})'), f'second Tank next to the Gunship at {c2}')
    G('H.startWave(); H.setSpeed(2)'); pg.wait_for_timeout(5000); G('H.setSpeed(1)')
    hp = G(f'[H.g.towers[{hi}].x, H.g.towers[{hi}].y]')
    t4 = G('(() => { const t = H.g.towers.filter(t => t.data.id === "unsc_tank").pop(); return [t.x, t.y]; })()')
    G(f'H.camFocus({(hp[0] + t4[0]) / 2}, {(hp[1] + t4[1]) / 2}, 1.0)'); pg.wait_for_timeout(600); shot(pg, 'map_tank_heli_props')
    # first person: trooper with a real gun, then near the tank to show scale
    t0 = G(f'[H.g.towers[{ids[0]}].x, H.g.towers[{ids[0]}].y]')
    G(f'H.deploy("odst", {t0[0]:.0f} - 40, {t0[1]:.0f} + 330)'); pg.wait_for_timeout(1200)
    G(f'H.selectSquad(H.squadIndex("odst"))'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
    check(until('window.__possess && window.__possess.cur && window.__possess.cur.vm.kind.startsWith("gun_")', 30000), 'Possess opened with a GLB gun viewmodel')
    pg.wait_for_timeout(1500)
    vm = P('({ ...P.vm, vis: P.gun.visible, kids: P.gun.children.length, sky: !!P.scene.getObjectByName("sky"), hills: !!P.scene.getObjectByName("hills"), mil: P.scene.children.filter(o => o.userData.mil).length })')
    check(vm['vis'] and vm['hands'] == 2, f'first-person gun visible with gloved hands {vm}')
    check(vm['sky'] and vm['hills'] and vm['mil'] >= 5, 'sky dome, distant hills and 3D props in first person')
    P('P.el.msg.style.visibility = "hidden"')
    P(f'P.aimAt({t0[0]} + 900, {t0[1]} - 700, 1.8); P.pitch = 0.03'); pg.wait_for_timeout(600); shot(pg, 'fps_gun')
    P(f'P.aimAt({t0[0]}, {t0[1]}, 1.2); P.pitch = 0.0'); pg.mouse.move(800, 480); pg.wait_for_timeout(700); shot(pg, 'fps_scale')
    sz = P('P.vm.size'); tl = max(sz.get('tank', [0, 0, 0])[0], sz.get('tank', [0, 0, 0])[2]); th = max(sz.get('heli', [0, 0, 0])[0], sz.get('heli', [0, 0, 0])[2])
    check(7 <= tl <= 12 and sz['tank'][1] >= 2.2, f'tank is real-size in first person: {sz.get("tank")} m (trooper eye 1.65 m)')
    check(th >= 10, f'gunship is real-size: {sz.get("heli")} m')
    pg.keyboard.press('e'); pg.wait_for_timeout(500)
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
