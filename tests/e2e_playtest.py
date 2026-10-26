"""Headless playtest for Bloons of the Frontier (serves dist/ and drives the game via window.__game).
Usage: /workspace/.venv-pw/bin/python tests/e2e_playtest.py [--map garden|jungle] [--waves N]"""
import argparse, functools, http.server, json, os, socketserver, sys, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, 'screenshots')
ap = argparse.ArgumentParser(); ap.add_argument('--map', default='garden'); ap.add_argument('--waves', type=int, default=8); args = ap.parse_args()
if args.map != 'garden': SHOTS = os.path.join(SHOTS, args.map)
os.makedirs(SHOTS, exist_ok=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=os.path.join(ROOT, 'dist')))
port = httpd.server_address[1]
threading.Thread(target=httpd.serve_forever, daemon=True).start()

errors, warnings = [], []
fails = []
def check(cond, msg):
    print(('  ok  ' if cond else '  FAIL ') + msg)
    if not cond: fails.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    pg = b.new_page(viewport={'width': 1600, 'height': 960})
    pg.on('console', lambda m: (errors if m.type == 'error' else warnings if m.type == 'warning' else []).append(m.text))
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(f'http://127.0.0.1:{port}/index.html')
    pg.wait_for_selector('.map-pick')
    pg.screenshot(path=f'{SHOTS}/01_menu.png')
    pg.click(f'.map-pick[data-map="{args.map}"]')
    pg.wait_for_function('window.__game')
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game; return {js}; }})()')
    st = lambda: G('H.state()')
    print('start', st())

    # --- faction tabs + placement UI path (real clicks)
    for f in ['primates', 'flora', 'unsc']:
        pg.click(f'.tab[data-faction="{f}"]')
        n = pg.locator('#tower-cards .card').count()
        check(n >= 4, f'{f} tab shows {n} tower cards')
    pg.click('.tab[data-faction="primates"]')
    pg.click('.card[data-tower="dart_monkey"]')
    free = G('H.freeCells()')
    # pick a cell near the path start by clicking through canvas coordinates
    c0 = free[len(free)//3]
    box = pg.locator('#game').bounding_box()
    cell = G(f'H.g.grid.cellCenter({c0[0]},{c0[1]})')
    sx = box['x'] + cell['x'] / 1168 * box['width']; sy = box['y'] + cell['y'] / 784 * box['height']
    pg.mouse.move(sx, sy); pg.wait_for_timeout(100)
    pg.screenshot(path=f'{SHOTS}/02_placing_ghost.png')
    pg.mouse.click(sx, sy)
    check(st()['towers'] == 1, 'placed Dart Monkey by clicking the canvas')

    # --- place towers from every faction (via hooks), spreading across free cells
    G('H.addCredits(20000)')
    path_near = G('''(() => { const g = H.g; return H.freeCells().map(([c,r]) => { const p = g.grid.cellCenter(c,r); return [c, r, g.path.project(p).dist]; }).sort((a,b)=>a[2]-b[2]).map(x=>[x[0],x[1]]); })()''')
    combat = ['ninja_monkey', 'wizard_monkey', 'super_monkey', 'solar_pea_fusion', 'gatling_cherry_bomber', 'flame_melon_mortar', 'star_emperor',
              'frost_wallnut_bastion', 'unsc_autoturret', 'unsc_rail', 'unsc_firebase']
    placed = 0
    for i, tid in enumerate(combat):
        cr = path_near[i * 3]
        placed += G(f'H.placeTower("{tid}", {cr[0]}, {cr[1]})')
    check(placed == len(combat), f'placed {placed}/{len(combat)} towers across 3 factions')

    # --- spread-out farms (far from each other), then Organize Farms
    far = G('''(() => { const fc = H.freeCells(); const pick = []; for (const cell of fc) { if (pick.every(p => Math.abs(p[0]-cell[0]) + Math.abs(p[1]-cell[1]) >= 5)) pick.push(cell); if (pick.length >= 5) break; } return pick; })()''')
    farms = ['money_monkey', 'unsc_depot', 'money_monkey', 'unsc_depot', 'money_monkey']
    for tid, cr in zip(farms, far): G(f'H.placeTower("{tid}", {cr[0]}, {cr[1]})')
    before = G('H.farmCells()')
    print('farms before', before)
    check(len(before) == 5, '5 spread-out farms placed')

    # --- troops (Halo Wars style deploy)
    pts = G('''(() => { const g = H.g; const L = g.path.length; return [0.25,0.4,0.55,0.7].map(k => { const a = g.path.at(L*k); return {x: a.x, y: a.y}; }); })()''')
    check(G(f'H.deploy("marine", {pts[0]["x"]}, {pts[0]["y"]})'), 'deployed Frontier Marines')
    check(G(f'H.deploy("monkey_soldier", {pts[1]["x"]}, {pts[1]["y"]})'), 'deployed Monkey Soldiers')
    check(G(f'H.deploy("line_watch", {pts[2]["x"]}, {pts[2]["y"]})'), 'deployed Line Watch')
    fx = sum(c[0] for c in before) / len(before); fy = sum(c[1] for c in before) / len(before)
    wpos = G(f'H.g.grid.cellCenter({round(fx)},{round(fy)})')
    check(G(f'H.deploy("farmhand", {wpos["x"]}, {wpos["y"]})'), 'deployed Sprout Farmhand')
    # deploy via the real UI: troop button, then click the map where the drop pod lands
    pg.wait_for_function('window.__game.g.canDeploy("monkey_soldier")', timeout=15000)
    nsq = st()['squads']
    pg.click('.deploy[data-unit="monkey_soldier"]')
    sx2 = box['x'] + pts[3]['x'] / 1168 * box['width']; sy2 = box['y'] + pts[3]['y'] / 784 * box['height']
    pg.mouse.click(sx2, sy2)
    check(st()['squads'] == nsq + 1, 'deployed Monkey Soldiers via troop bar + map click (drop pod)')
    pg.wait_for_timeout(400)
    pg.screenshot(path=f'{SHOTS}/03a_squad_selected_rally.png')
    pg.keyboard.press('Escape')
    # garrison: order marines into the Firebase Bunker (they walk there, then enter)
    G('H.garrison(H.g.squads.findIndex(s => s.data.id === "marine"))')
    try:
        pg.wait_for_function('window.__game.state().garrisoned > 0', timeout=20000)
    except Exception: pass
    gar = st()['garrisoned']
    check(gar > 0, f'garrisoned {gar} marine(s) in Firebase Bunker')
    pg.wait_for_timeout(600)
    s = st(); print('after deploy', s)
    check(s['buffed'] > 0, f'Cover aura buffing {s["buffed"]} entities')
    # stacking check: no entity should have two 'cover' buffs counted twice -> verify via totals bounded by max single cover
    maxb = G('Math.max(...H.g.towers.concat(H.g.units).map(e => e.buffs.totals.bonusMaxHp))')
    check(maxb <= 55 + 80, f'max stacked bonus HP {maxb} (no double stacking from same-type cover)')
    pg.screenshot(path=f'{SHOTS}/03_built_and_deployed.png')

    # --- Organize Farms (UI button)
    region_before = G('H.g.grid.largestFreeRegion()')
    pg.click('#btn-organize')
    pg.wait_for_function('window.__game.state().organizes > 0', timeout=20000)
    pg.wait_for_timeout(750)
    pg.screenshot(path=f'{SHOTS}/04_organizing_slide.png')
    pg.wait_for_function('window.__game.state().sliding === 0', timeout=10000)
    after = G('H.farmCells()')
    print('farms after', after)
    def bbox(cells):
        xs = [c[0] for c in cells]; ys = [c[1] for c in cells]
        return (max(xs) - min(xs) + 1) * (max(ys) - min(ys) + 1)
    check(bbox(after) < bbox(before), f'farm footprint shrank {bbox(before)} -> {bbox(after)} cells')
    occ_ok = G('H.g.farms().every(f => H.g.grid.occupant(f.cell.c, f.cell.r) === f)')
    stale = G('''(() => { let n = 0; for (let r = 0; r < H.g.grid.rows; r++) for (let c = 0; c < H.g.grid.cols; c++) { const o = H.g.grid.occupant(c, r); if (o && (o.cell.c !== c || o.cell.r !== r)) n++; } return n; })()''')
    region = G('H.g.grid.largestFreeRegion()')
    print('largest free build region after organize:', region, 'before:', region_before)
    check(occ_ok and stale == 0, 'grid occupancy matches moved farms (no stale cells)')
    G('H.selectTower(H.g.towers.findIndex(t => t.isFarm))')
    pg.wait_for_timeout(200)
    pg.screenshot(path=f'{SHOTS}/05_farms_organized.png')

    # --- upgrade path & selection panel
    G('H.selectTower(1)')
    pg.wait_for_timeout(200)
    pg.screenshot(path=f'{SHOTS}/06_selection_panel.png')
    pg.click('#sp-up')
    pg.click('#sp-tgt')
    check(G('H.g.towers[1].tier') == 1, 'upgraded via selection panel')
    check(G('H.g.towers[1].targeting') == 'last', 'targeting cycled First -> Last')
    G('H.upgradeAll(); H.upgradeAll();')
    G('H.research("marine"); H.research("line_watch"); H.research("line_watch"); H.research("farmhand")')
    pg.keyboard.press('Escape')

    # --- run waves at high speed
    G('H.setSpeed(4)')
    for w in range(args.waves):
        G('H.startWave()')
        pg.wait_for_function('!window.__game.state().waveActive || window.__game.state().state !== "playing"', timeout=180000, polling=250)
        s = st()
        print(f'wave {s["wave"]}: lives={s["lives"]} credits={s["credits"]} kills={s["kills"]} pickups={s["pickups"]} offline={s["offline"]}')
        if s['state'] != 'playing': break
        if w in (1, 4):
            G('H.startWave()'); pg.wait_for_timeout(2500)
            pg.screenshot(path=f'{SHOTS}/07_wave_{s["wave"]+1}_combat.png')
            pg.wait_for_function('!window.__game.state().waveActive', timeout=180000, polling=250)
    s = st()
    check(s['wave'] >= min(args.waves, 3), f'cleared {s["wave"]} waves')
    check(s['kills'] > 50, f'{s["kills"]} kills')
    check(s['pickups'].get('Farmhand', 0) > 0, f'Farmhand collected dropped credits {s["pickups"]}')
    # bug waves: jump ahead to the Bile Titan wave for a screenshot
    G('H.g.waves.index = 17; H.setSpeed(2)')
    G('H.startWave()')
    pg.wait_for_function('window.__game.g.enemies.some(e => e.data.family === "bug" && e.progress > 250)', timeout=60000)
    pg.screenshot(path=f'{SHOTS}/08_bug_wave.png')
    pg.wait_for_function('!window.__game.state().waveActive || window.__game.state().state !== "playing"', timeout=240000, polling=250)
    print('final', st())
    pg.screenshot(path=f'{SHOTS}/09_final.png')
    b.close()

httpd.shutdown()
print(f'console errors: {len(errors)}'); [print('  ', e) for e in errors[:20]]
print(f'console warnings: {len(warnings)}'); [print('  ', w) for w in warnings[:10]]
check(not errors, 'zero console errors')
print('RESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})')
sys.exit(1 if fails else 0)
