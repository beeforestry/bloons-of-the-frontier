"""t80 e2e: El Morro first-person accuracy pass.
  * 3D fort walls extruded from the USGS lidar (0.5 m, sharpened faces, embrasures) line up with the NOAA aerial
    (plaza lower than its decks, moat lower than the bastions, steep wall faces), garitas / lighthouse / plaza arcades / flags.
  * flora placed from the aerial (scrub thicket, long-grass bank, lawn-edge tufts) — no generic palm ring.
  * parked Raider Buggies / Bulwark Scorpions: walk up, F to enter, drive, F to exit (sandbox match + Overrun on El Morro);
    Overrun E/Tab tactical map still works.
Screenshots -> screenshots/t80/<tag>_*.png (tag 'local' or 'live').
Usage: /workspace/.venv-pw/bin/python tests/e2e_t80.py [--url URL] [--tag live] [--dist DIR] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--dist', default=''); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't80'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url if args.url.endswith('/') or args.url.endswith('.html') else args.url + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=args.dist or os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if args.no_shots: return
    path = os.path.join(OUT, f'{args.tag}_{name}.png'); pg.screenshot(path=path); print('  shot', path, flush=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1440, 'height': 860}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=150); return True
        except Exception: return False
    def possess_at(x, y):
        G('H.g.deployCd = {}'); G(f'H.deploy("odst", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur && window.__possess.cur.vm.fort', 60000)
        P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(4000); P('P.el.msg.style.visibility = "hidden"')
        return ok
    def look(ax, ay, dh, wait=2500):
        P(f'P.aimAt({ax}, {ay}, P.eye().y + ({dh}))'); pg.wait_for_timeout(wait)

    # ------------------------------------------------------------ 2D: data
    pg.goto(URL + sep + 'map=morro&diff=medium&fpq=high', timeout=90000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1000)
    G('H.sandbox(); H.addCredits(90000)')
    m = G('({ deco: (H.g.map.deco || []).length, keys: [...new Set((H.g.map.deco || []).map(d => d[0]))], parked: H.g.parked.map(p => p.kind), walls: (H.g.map.walls || []).length })')
    print('  map', m)
    check(m['deco'] > 1000 and all(k.startswith('mr_') for k in m['keys']), f"El Morro flora placed from the aerial ({m['deco']} spots: {m['keys']})")
    check('palm' not in ''.join(m['keys']), 'no generic palm ring / palms in the El Morro flora')
    check(m['parked'].count('warthog') >= 2 and m['parked'].count('scorpion') >= 2, f"parked Raider Buggies + Bulwark Scorpions on the grounds ({m['parked']})")
    check(m['walls'] == 349, 'the 349 lidar wall-face LOS blockers are unchanged (2D sim)')
    G('H.camFocus && H.camFocus(1640, 1500, 0.7)'); pg.wait_for_timeout(900); shot(pg, '2d_parked')

    # ------------------------------------------------------------ first person: fort walls aligned to the aerial
    check(possess_at(1700, 1500), 'possessed a trooper on the esplanade lawn')
    st = P('({ fort: P.vm.fort, chunks: P.vm.fortChunks, flora: P.vm.flora, parked: P.vm.parked, glb: P.vm.parkedGlb, q: P.vm.quality })'); print('  vm', st)
    f = st['fort'] or {}
    check(f.get('tris', 0) > 100000 and st['chunks'] >= 16, f"3D fort mesh built from the lidar ({f.get('tris')} tris in {st['chunks']} chunks)")
    check(f.get('garitas', 0) >= 6 and f.get('arcades', 0) >= 4 and f.get('lighthouse') == 1, f"garitas {f.get('garitas')}, plaza arcades {f.get('arcades')}, lighthouse")
    check(st['flora'] > 1000, f"first-person flora from the aerial ({st['flora']} plants)")
    check(st['glb'] == st['parked'] and st['parked'] >= 4, f"parked vehicles rendered with the t77 GLBs ({st['glb']}/{st['parked']})")
    h = P('({ plaza: P.groundAt(2510, 1600), deckW: P.groundAt(2420, 1600), moat: P.groundAt(1900, 1300), bastion: P.groundAt(2150, 1180), lawn: P.groundAt(1600, 1500), coarse: H.g && 0 })')
    print('  heights', h)
    check(h['deckW'] - h['plaza'] > 3, f"Plaza de Armas sits below its decks (plaza {h['plaza']:.1f} m, deck {h['deckW']:.1f} m)")
    check(h['bastion'] - h['moat'] > 6, f"bastion top above the moat floor (bastion {h['bastion']:.1f} m, moat {h['moat']:.1f} m)")
    steep = P('(() => { let best = 0; for (let x = 1900; x < 2300; x += 4) { const a = P.groundAt(x, 1130), b = P.groundAt(x + 16, 1130); best = Math.max(best, Math.abs(a - b)); } for (let y = 1100; y < 1500; y += 4) { const a = P.groundAt(2020, y), b = P.groundAt(2036, y); best = Math.max(best, Math.abs(a - b)); } return best; })()')
    check(steep > 4, f'vertical wall faces: >4 m drop within 2 m across the NW bastion ({steep:.1f} m)')
    check(not P('P.scene.children.some(o => o.userData && o.userData.ring)'), 'no generic tree ring object')
    look(2300, 1500, 2); shot(pg, 'fp_esplanade_walls')
    P('P.obj.x = 2200; P.obj.y = 1000'); pg.wait_for_timeout(1500); look(2010, 1060, 3); shot(pg, 'fp_moat_bastion')
    P('P.obj.x = 2510; P.obj.y = 1460'); pg.wait_for_timeout(1500); look(2520, 1900, 1.5); shot(pg, 'fp_plaza_arcades')
    P('P.obj.x = 2380; P.obj.y = 1240'); pg.wait_for_timeout(1500); look(2330, 1900, 6); shot(pg, 'fp_flags_lighthouse')
    P('P.obj.x = 2130; P.obj.y = 1130'); pg.wait_for_timeout(1500); look(2000, 1030, 1); shot(pg, 'fp_garita')
    P('P.obj.x = 1900; P.obj.y = 2300'); pg.wait_for_timeout(1500); look(1800, 2650, -3); shot(pg, 'fp_south_scrub')
    P('P.obj.x = 3000; P.obj.y = 1500'); pg.wait_for_timeout(1500); look(3600, 1800, -6); shot(pg, 'fp_upper_battery_sea')

    # ------------------------------------------------------------ parked vehicles: walk up, F in, drive, F out
    def board_cycle(kind, label):
        pv = G(f'H.g.parked.find(p => p.kind === "{kind}")')
        if not pv: check(False, f'{label}: a parked {kind} exists'); return
        P(f'P.obj.x = {pv["x"] - 22}; P.obj.y = {pv["y"] + 14}'); pg.wait_for_timeout(1200)
        look(pv['x'], pv['y'], -1.2, 2500)
        prompt = pg.inner_text('#ps-veh') if pg.is_visible('#ps-veh') else ''
        check('enter' in prompt.lower(), f'{label}: walk-up prompt "{prompt}"')
        shot(pg, f'fp_walkup_{kind}')
        n0 = G('H.g.parked.length'); pg.keyboard.press('f'); pg.wait_for_timeout(1500)
        s1 = P('P.state()')
        check(s1['veh'] and s1['unitId'] == kind and G('H.g.parked.length') == n0 - 1, f'{label}: F entered the {kind} (driving {s1["unitId"]})')
        pg.wait_for_timeout(2500)
        pg.keyboard.down('w'); pg.wait_for_timeout(3500); pg.keyboard.up('w'); pg.wait_for_timeout(400)
        s2 = P('P.state()'); moved = ((s2['x'] - s1['x']) ** 2 + (s2['y'] - s1['y']) ** 2) ** 0.5
        check(moved > 3, f'{label}: drove the {kind} ({moved:.0f} px)')
        shot(pg, f'fp_driving_{kind}')
        prompt = pg.inner_text('#ps-veh') if pg.is_visible('#ps-veh') else ''
        check('exit' in prompt.lower(), f'{label}: in-vehicle prompt "{prompt}"')
        pg.keyboard.press('f'); pg.wait_for_timeout(1500)
        s3 = P('P.state()')
        check(not s3['veh'] and s3['unitId'] == 'odst' and G('H.g.parked.length') == n0, f'{label}: F stepped out on foot, vehicle left parked')
    board_cycle('warthog', 'sandbox'); board_cycle('scorpion', 'sandbox')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(800)
    check(G('H.g.units.filter(u => u.alive && u.onFoot).length') == 0, 'nobody left stuck in a vehicle')

    # ------------------------------------------------------------ Overrun on El Morro: spawn on foot, parked vehicles near spawn, F + Tab
    pg.goto(URL + ('index.html' if not URL.endswith('.html') else ''), timeout=90000)
    pg.wait_for_selector('.mode-pick[data-mode="overrun"]', timeout=60000); pg.click('.mode-pick[data-mode="overrun"]')
    pg.wait_for_selector('#ov-solo', timeout=8000); pg.select_option('#ov-map', 'morro'); pg.select_option('#ov-min', '3'); pg.select_option('#ov-bots', '0')
    pg.click('#ov-solo'); pg.wait_for_selector('.ov-pick[data-cls="marine"]', timeout=20000); pg.click('.ov-pick[data-cls="marine"]')
    check(until('window.__possess && window.__possess.cur && window.__overrun.inFP() && window.__possess.cur.vm.fort', 60000), 'Overrun on El Morro: spawned in first person on foot, fort loaded')
    pg.evaluate('() => window.__overrun.noSpawn(true)')
    s0 = P('P.state()'); check(not s0['veh'], f"Overrun: survivor starts on foot ({s0['unitId']})")
    near = P('(() => { const u = P.obj; return P.g.parked.map(p => ({ k: p.kind, d: Math.hypot(p.x - u.x, p.y - u.y), x: p.x, y: p.y })).sort((a, b) => a.d - b.d); })()')
    print('  overrun parked', [(n['k'], round(n['d'])) for n in near])
    check(len(near) >= 6 and near[0]['d'] < 400, 'Overrun: parked vehicles wait near the spawn (plus the El Morro grounds ones)')
    v = near[0]; P(f'P.obj.x = {v["x"] - 20}; P.obj.y = {v["y"] + 12}'); pg.wait_for_timeout(1200); look(v['x'], v['y'], -1.2, 2000)
    pg.keyboard.press('f'); pg.wait_for_timeout(1500); s1 = P('P.state()')
    check(s1['veh'] and s1['unitId'] == v['k'], f"Overrun: F entered the parked {v['k']}")
    shot(pg, 'overrun_in_vehicle')
    pg.keyboard.press('f'); pg.wait_for_timeout(1500); s2 = P('P.state()')
    check(not s2['veh'] and s2['unitId'] == 'marine', 'Overrun: F stepped out as the Frontier Marine again')
    pg.keyboard.press('Tab'); pg.wait_for_timeout(1500)
    check(pg.evaluate('() => !(window.__possess && window.__possess.cur) && !window.__overrun.inFP()'), 'Overrun: Tab still opens the tactical map (F is separate)')
    shot(pg, 'overrun_tactical')
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
