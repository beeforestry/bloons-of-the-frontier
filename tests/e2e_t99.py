"""t99 e2e: Isla de Cabras realism pass (El Morro's t53/t80/t93 methods applied to map 'tropical').
  * 2D: real NOAA aerial + USGS lidar frame moved south so El Canuelo is on the map; 3 lanes walk; waves run; free placement works;
    no warzone props; El Canuelo's walls are LOS blockers; flora + parked vehicles placed from the aerial.
  * First person: fine 0.5 m heights (fort deck / parapet / entrance stair from HABS PR-52), floor classes, aerial-placed palms /
    trees / rocks, El Canuelo set pieces (garita, cordon, guns), El Morro across the bay; spawn on terrain, walk to the fort,
    enter / drive / exit a parked Raider and Scorpion; Overrun on Isla de Cabras; no console errors; fps sampled.
Screenshots -> screenshots/t99/<tag>_*.png.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t99.py [--url URL] [--tag live] [--no-shots]"""
import argparse, functools, http.server, json, math, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--dist', default=''); ap.add_argument('--quick', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't99'); os.makedirs(OUT, exist_ok=True)
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
# El Canuelo frame (src/fps/cabras3d.ts CANUELO): centre map px, axes, half side 12.2 m, 0.125 m/px
C = (356, 1386); R2 = math.sqrt(0.5)
def fort_px(a, b): return (C[0] + (a * R2 - b * R2) / 0.125, C[1] + (a * R2 + b * R2) / 0.125)
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
        ok = until('window.__possess && window.__possess.cur && window.__possess.cur.vm.cabras', 90000)
        P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(4000); P('P.el.msg.style.visibility = "hidden"')
        return ok
    def look(ax, ay, dh, wait=2500):
        P(f'P.aimAt({ax}, {ay}, P.eye().y + ({dh}))'); pg.wait_for_timeout(wait)
    def at(x, y, wait=1500): P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(wait)

    # ------------------------------------------------------------ 2D: real aerial, lanes, waves, placement
    pg.goto(URL + sep + 'map=tropical&diff=medium&fpq=high', timeout=90000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1500)
    m = G('({ id: H.g.map.id, img: H.g.map.image, mpp: H.g.map.mpp, w: H.g.map.width, flavor: H.g.map.flavor, terr: !!H.g.map.terrain, props: (H.g.map.terrain && H.g.map.terrain.props || []).length, lanes: H.g.map.lanes.length, walls: (H.g.map.walls || []).length, deco: (H.g.map.deco || []).length, keys: [...new Set((H.g.map.deco || []).map(d => d[0]))], parked: H.g.parked.map(p => p.kind), imgOk: (() => { const i = [...document.images].find(i => /tropical\\.jpg/.test(i.src)); return true; })() })')
    print('  map', m)
    check(m['id'] == 'tropical' and m['terr'] and abs((m['mpp'] or 0) - 0.125) < 1e-6 and m['w'] == 4416, 'Isla de Cabras: real lidar terrain at 0.125 m/px, 4416 px wide')
    check(m['flavor'] == 'cabras' and m['props'] == 0, f"no t50 warzone props left (terrain props {m['props']})")
    check(m['lanes'] == 3, '3 lanes (causeway past El Canuelo, park road, bay landing)')
    check(m['walls'] >= 20, f"El Canuelo's walls are LOS blockers ({m['walls']})")
    check(m['deco'] > 1500 and all(k.startswith('mr_') for k in m['keys']) and 'mr_palm' in m['keys'] and 'mr_rock' in m['keys'], f"flora/rocks placed from the aerial ({m['deco']}: {m['keys']})")
    check(m['parked'].count('warthog') >= 2 and m['parked'].count('scorpion') >= 2, f"parked Raider Buggies + Bulwark Scorpions on the grounds ({m['parked']})")
    lit = pg.evaluate("""() => new Promise(r => { const i = new Image(); i.onload = () => { const c = document.createElement('canvas'); c.width = 64; c.height = 43; const x = c.getContext('2d'); x.drawImage(i, 0, 0, 64, 43);
      const d = x.getImageData(0, 0, 64, 43).data; let s = 0, s2 = 0, n = 0; for (let k = 0; k < d.length; k += 4) { const l = (d[k] + d[k+1] + d[k+2]) / 3; s += l; s2 += l * l; n++; } r({ w: i.naturalWidth, mean: s / n, sd: Math.sqrt(s2 / n - (s / n) ** 2) }); }; i.onerror = () => r(null); i.src = window.__game.g.map.image.replace(/^\\//, ''); })""")
    print('  aerial', lit)
    check(lit is not None and lit['w'] == 4416 and lit['sd'] > 12, f'the aerial map image loads ({lit})')
    G('H.camFocus && H.camFocus(2208, 1488, 0.25)'); pg.wait_for_timeout(1200); shot(pg, '2d_overview')
    G('H.camFocus && H.camFocus(500, 1380, 0.9)'); pg.wait_for_timeout(1000); shot(pg, '2d_canuelo')
    lp = [G(f'H.lanePoint({i}, 0.55)') for i in range(3)]
    G('H.sandbox(); H.addCredits(90000)')
    pl = G('(() => { const g = H.g; let free = 0, n = 0, at = null; for (let y = 900; y < 1700; y += 24) for (let x = 400; x < 4000; x += 24) { n++; if (g.spotOk("dart_monkey", x, y)) { free++; if (!at) at = [x, y]; } } const t = at && g.placeTower("dart_monkey", { c: 0, r: 0, x: at[0], y: at[1] }); return { free, n, at, placed: !!t }; })()')
    check(pl['placed'] and pl['free'] > 150, f"free placement on the island's land ({pl})")
    G('H.setSpeed(3)'); G('H.startWave()'); pg.wait_for_timeout(9000)
    en = G('H.g.enemies.filter(e => e.alive).map(e => ({ lane: e.lane, x: Math.round(e.x), y: Math.round(e.y) }))')
    check(len(en) > 0 and all(0 <= e['x'] <= 4416 + 400 for e in en), f'wave 1 enemies walk the lanes ({len(en)} alive)')
    shot(pg, '2d_midwave')
    G('H.setSpeed(1)'); G('H.killAll()')

    # ------------------------------------------------------------ first person: fine terrain, El Canuelo, flora, coast
    check(possess_at(700, 1320), 'possessed a trooper on the lawn by El Canuelo (fine grid loaded)')
    st = P('({ c: P.vm.cabras, flora: P.vm.flora, parked: P.vm.parked, glb: P.vm.parkedGlb, q: P.vm.quality, war: P.isWar, props: P.vm.props })'); print('  vm', st)
    c = st['c'] or {}
    check(c.get('tris', 0) > 150000 and c.get('chunks', 0) >= 20, f"fine 0.5 m lidar mesh ({c.get('tris')} tris, {c.get('chunks')} chunks; deep-sea chunks skipped)")
    check(c.get('garitas') == 1 and c.get('cordon') == 4 and c.get('cannons') == 2 and c.get('lintel') == 1, f"El Canuelo set pieces: garita {c.get('garitas')}, cordon {c.get('cordon')}, guns {c.get('cannons')}, entrance {c.get('lintel')}")
    check(not st['war'], 'warzone styling off (realistic park)')
    check(st['flora'] > 1500, f"first-person flora/rocks from the aerial ({st['flora']})")
    check(st['glb'] == st['parked'] and st['parked'] >= 4, f"parked vehicles rendered with the t77 GLBs ({st['glb']}/{st['parked']})")
    o = fort_px(0, 0); par = fort_px(11.4, -3.0); door_out = fort_px(-4, 15.5); door_in = fort_px(-4, 11.0); stair_mid = fort_px(-4, 5.0); lawn = (700, 1320)
    h = P(f'({{ deck: P.groundAt({o[0]}, {o[1]}), par: P.groundAt({par[0]}, {par[1]}), out: P.groundAt({door_out[0]}, {door_out[1]}), pass: P.groundAt({door_in[0]}, {door_in[1]}), mid: P.groundAt({stair_mid[0]}, {stair_mid[1]}), lawn: P.groundAt({lawn[0]}, {lawn[1]}), sea: P.groundAt(2000, 300) }})')
    print('  heights', h)
    check(abs(h['deck'] - 5.6) < 0.3 and h['par'] - h['deck'] > 0.8, f"El Canuelo gun deck {h['deck']:.1f} m, parapet {h['par']:.1f} m (HABS 22'1\")")
    check(0.8 < h['lawn'] < 2.5 and h['deck'] - h['lawn'] > 3.5, f"lawn {h['lawn']:.2f} m: fort walls rise {h['deck'] - h['lawn']:.1f} m above it")
    check(h['out'] < h['pass'] + 0.6 < h['mid'] + 0.6 < h['deck'] + 0.7, f"entrance + stair climb door {h['out']:.1f} -> passage {h['pass']:.1f} -> stair {h['mid']:.1f} -> deck {h['deck']:.1f}")
    check(h['sea'] <= 0.45, f"standing on the sea = water surface ({h['sea']:.2f} m)")
    top = fort_px(-4, -0.4)
    def seg(p0, p1):
        return P(f'(() => {{ let worst = 0, prev = null; for (let t = 0; t <= 1.0001; t += 0.01) {{ const x = {p0[0]} + ({p1[0]} - {p0[0]}) * t, y = {p0[1]} + ({p1[1]} - {p0[1]}) * t, hh = P.groundAt(x, y); if (prev != null) worst = Math.max(worst, Math.abs(hh - prev)); prev = hh; }} return worst; }})()')
    cont = max(seg(door_out, top), seg(top, o))
    check(cont < 0.45, f'walkable: door -> stair -> deck rises in steps of at most {cont:.2f} m (sampled every ~0.2 m)')
    look(o[0], o[1], 3); shot(pg, 'fp_canuelo_lawn')
    # walk to the fortlet: start 9 m out from the entrance, hold W facing the door
    at(door_out[0] + (door_out[0] - door_in[0]) * 1.2, door_out[1] + (door_out[1] - door_in[1]) * 1.2, 1200)
    s0 = P('P.state()'); look(door_in[0], door_in[1], 0.5, 1500); shot(pg, 'fp_canuelo_entrance')
    pg.keyboard.down('w'); pg.wait_for_timeout(5000); pg.keyboard.up('w'); pg.wait_for_timeout(400)
    s1 = P('P.state()'); d0 = math.hypot(s0['x'] - door_in[0], s0['y'] - door_in[1]); d1 = math.hypot(s1['x'] - door_in[0], s1['y'] - door_in[1])
    check(d1 < d0 - 3, f'walked toward El Canuelo\'s door ({d0:.0f} -> {d1:.0f} px)')
    at(*fort_px(8.0, 2.0)); look(*fort_px(13, -6), 1, 2000); shot(pg, 'fp_canuelo_deck_embrasures')
    at(*fort_px(6.5, 6.5)); look(*fort_px(12, 12), 1.5, 2000); shot(pg, 'fp_canuelo_garita')
    at(*fort_px(10.5, 4.0)); P('P.aimAt(4632, 11640, P.eye().y + 25)'); pg.wait_for_timeout(3500); shot(pg, 'fp_el_morro_across_bay')
    check(until('window.__possess.cur.vm.cabras.morro === 1', 30000), 'El Morro (its lidar fort grid) stands across the bay mouth')
    at(2900, 935); look(3450, 870, -0.3); shot(pg, 'fp_coast_beach')
    at(1300, 1560); look(1500, 2100, -1); shot(pg, 'fp_coast_breakwater')
    at(2300, 1220); look(2900, 1250, 1); shot(pg, 'fp_park_palms')
    if not args.quick:
        G('H.fpsStart && H.fpsStart()'); pg.wait_for_timeout(4000); fp = P('P.fps'); print('  fps (swiftshader)', fp)
        check(fp >= 1, f'renders frames under the software renderer ({fp} fps; real GPUs are far faster)')

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
        pg.keyboard.down('w'); pg.wait_for_timeout(6000); pg.keyboard.up('w'); pg.wait_for_timeout(400)
        s2 = P('P.state()'); moved = ((s2['x'] - s1['x']) ** 2 + (s2['y'] - s1['y']) ** 2) ** 0.5
        check(moved > 3, f'{label}: drove the {kind} ({moved:.0f} px)')
        shot(pg, f'fp_driving_{kind}')
        pg.keyboard.press('f'); pg.wait_for_timeout(1500)
        s3 = P('P.state()')
        check(not s3['veh'] and s3['unitId'] == 'odst' and G('H.g.parked.length') == n0, f'{label}: F stepped out on foot, vehicle left parked')
    board_cycle('warthog', 'sandbox'); board_cycle('scorpion', 'sandbox')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(800)

    # ------------------------------------------------------------ Overrun on Isla de Cabras
    pg.goto(URL + ('index.html' if not URL.endswith('.html') else ''), timeout=90000)
    pg.wait_for_selector('.mode-pick[data-mode="overrun"]', timeout=60000); pg.click('.mode-pick[data-mode="overrun"]')
    pg.wait_for_selector('#ov-solo', timeout=8000); pg.select_option('#ov-map', 'tropical'); pg.select_option('#ov-min', '3'); pg.select_option('#ov-bots', '0')
    pg.click('#ov-solo'); pg.wait_for_selector('.ov-pick[data-cls="marine"]', timeout=20000); pg.click('.ov-pick[data-cls="marine"]')
    check(until('window.__possess && window.__possess.cur && window.__overrun.inFP() && window.__possess.cur.vm.cabras', 90000), 'Overrun on Isla de Cabras: first person on foot, fine grid loaded')
    pg.evaluate('() => window.__overrun.noSpawn(true)')
    s0 = P('P.state()'); gh = P('P.groundAt(P.obj.x, P.obj.y)'); check(not s0['veh'] and gh > 0.6, f"Overrun: survivor starts on foot on land ({s0['unitId']}, ground {gh:.2f} m)")
    near = P('(() => { const u = P.obj; return P.g.parked.map(p => ({ k: p.kind, d: Math.hypot(p.x - u.x, p.y - u.y), x: p.x, y: p.y })).sort((a, b) => a.d - b.d); })()')
    print('  overrun parked', [(n['k'], round(n['d'])) for n in near])
    check(len(near) >= 6 and near[0]['d'] < 400, 'Overrun: parked vehicles near the spawn (plus the island ones)')
    v = near[0]; P(f'P.obj.x = {v["x"] - 20}; P.obj.y = {v["y"] + 12}'); pg.wait_for_timeout(1200); look(v['x'], v['y'], -1.2, 2000)
    pg.keyboard.press('f'); pg.wait_for_timeout(1500); s1 = P('P.state()')
    check(s1['veh'] and s1['unitId'] == v['k'], f"Overrun: F entered the parked {v['k']}")
    shot(pg, 'overrun_in_vehicle')
    pg.keyboard.press('f'); pg.wait_for_timeout(1500); s2 = P('P.state()')
    check(not s2['veh'] and s2['unitId'] == 'marine', 'Overrun: F stepped out as the Frontier Marine again')
    pg.keyboard.press('Tab'); pg.wait_for_timeout(1500)
    check(pg.evaluate('() => !(window.__possess && window.__possess.cur) && !window.__overrun.inFP()'), 'Overrun: Tab opens the tactical map')
    shot(pg, 'overrun_tactical')
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
