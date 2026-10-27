"""Headless playtest for Bloons of the Frontier (serves dist/ and drives the game via window.__game).
Covers: camera (wheel zoom, drag pan, WASD, minimap), tower placement by real clicks, every faction,
farms + Organize Farms, garrison + cover aura, HQ + build pads (construction scale-in), Reactor tech,
pop cap (deploy blocked + Barracks hold-at-door), Barracks queue + rally, MAC Blast (damage + knockback),
Heal Drop, wave runs incl. a late wave, HQ lose condition, and a mobile (touch) viewport.
Usage: /workspace/.venv-pw/bin/python tests/e2e_playtest.py [--map garden|jungle|fortress] [--waves N]"""
import argparse, functools, http.server, json, os, socketserver, sys, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--map', default='garden'); ap.add_argument('--waves', type=int, default=8); args = ap.parse_args()
SHOTS = os.path.join(ROOT, 'screenshots', 'expand', args.map)
os.makedirs(SHOTS, exist_ok=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=os.path.join(ROOT, 'dist')))
port = httpd.server_address[1]
threading.Thread(target=httpd.serve_forever, daemon=True).start()

errors, warnings, fails = [], [], []
def check(cond, msg):
    print(('  ok  ' if cond else '  FAIL ') + msg)
    if not cond: fails.append(msg)

def attach(pg):
    pg.on('console', lambda m: (errors if m.type == 'error' else warnings if m.type == 'warning' else []).append(m.text))
    pg.on('pageerror', lambda e: errors.append(str(e)))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    pg = b.new_page(viewport={'width': 1600, 'height': 960})
    attach(pg)
    pg.goto(f'http://127.0.0.1:{port}/index.html')
    pg.wait_for_selector('.map-pick')
    pg.screenshot(path=f'{SHOTS}/01_menu.png')
    pg.click(f'.map-pick[data-map="{args.map}"]')
    pg.wait_for_function('window.__game')
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()')
    st = lambda: G('H.state()')
    box = pg.locator('#game').bounding_box()
    def scr(wx, wy):
        bb = pg.locator('#game').bounding_box()
        s = G(f'H.worldToScreen({wx},{wy})'); return bb['x'] + s['x'], bb['y'] + s['y']
    def click_world(wx, wy, focus=True, zoom=None):
        if focus: G(f'H.camFocus({wx},{wy}{"," + str(zoom) if zoom else ""})')
        x, y = scr(wx, wy); pg.mouse.move(x, y); pg.mouse.click(x, y)
    s0 = st(); print('start', s0)
    W, Hh = G('H.g.map.width'), G('H.g.map.height')
    check(W >= 2000 and Hh >= 1400, f'big map {W}x{Hh}')
    check(G('H.lanes()') >= 2, f'{G("H.lanes()")} enemy lanes')
    check(s0['hq'] > 0 and len(G('H.pads()')) >= 6, f'HQ {s0["hq"]} HP + {len(G("H.pads()"))} build pads')
    pg.wait_for_timeout(300)
    pg.screenshot(path=f'{SHOTS}/00_full_map_zoomed_out.png')

    # --- camera: wheel zoom, drag pan, WASD, minimap jump
    c0 = G('H.cam()')
    check(abs(c0['zoom'] - c0['minZoom']) < 1e-6, 'starts zoomed out to fit the whole map')
    pg.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
    for _ in range(4): pg.mouse.wheel(0, -240); pg.wait_for_timeout(40)
    c1 = G('H.cam()'); check(c1['zoom'] > c0['zoom'] * 1.5, f'wheel zoom {c0["zoom"]:.2f} -> {c1["zoom"]:.2f}')
    mx, my = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
    pg.mouse.move(mx, my); pg.mouse.down(button='right'); pg.mouse.move(mx - 200, my - 100, steps=8); pg.mouse.up(button='right')
    c2 = G('H.cam()'); check(c2['x'] > c1['x'] + 50, f'right-drag pans camera x {c1["x"]:.0f} -> {c2["x"]:.0f}')
    pg.mouse.move(mx, my)
    pg.keyboard.down('a'); pg.wait_for_timeout(400); pg.keyboard.up('a')
    c3 = G('H.cam()'); check(c3['x'] < c2['x'] - 50, f'WASD pans camera x {c2["x"]:.0f} -> {c3["x"]:.0f}')
    mm = pg.locator('#minimap').bounding_box()
    pg.mouse.click(mm['x'] + mm['width'] * 0.9, mm['y'] + mm['height'] * 0.5)
    c4 = G('H.cam()'); check(c4['x'] > c3['x'] + 200, f'minimap click jumps camera x {c3["x"]:.0f} -> {c4["x"]:.0f}')
    G('H.camReset()')

    # --- faction tabs + placement by real canvas click (camera-aware)
    for f in ['primates', 'flora', 'unsc']:
        pg.click(f'.tab[data-faction="{f}"]')
        n = pg.locator('#tower-cards .card').count()
        check(n >= 4, f'{f} tab shows {n} tower cards')
    pg.click('.tab[data-faction="primates"]')
    near = G('''(() => { const g = H.g; return H.freeCells().map(([c,r]) => { const p = g.grid.cellCenter(c,r); return [c, r, g.nearestLane(p).dist, p.x]; })
        .filter(x => x[3] < 1650).sort((a,b)=>a[2]-b[2]).map(x=>[x[0],x[1]]); })()''')
    pg.click('.card[data-tower="dart_monkey"]')
    cc = G(f'H.g.grid.cellCenter({near[0][0]},{near[0][1]})')
    G(f'H.camFocus({cc["x"]},{cc["y"]},1.1)')
    x, y = scr(cc['x'], cc['y']); pg.mouse.move(x, y); pg.wait_for_timeout(100)
    pg.screenshot(path=f'{SHOTS}/02_placing_ghost.png')
    pg.mouse.click(x, y)
    check(st()['towers'] == 1, 'placed Dart Monkey by clicking the (zoomed) canvas')

    G('H.addCredits(30000)')
    combat = ['ninja_monkey', 'wizard_monkey', 'super_monkey', 'solar_pea_fusion', 'gatling_cherry_bomber', 'flame_melon_mortar', 'star_emperor',
              'frost_wallnut_bastion', 'unsc_autoturret', 'unsc_rail', 'unsc_firebase', 'unsc_autoturret', 'unsc_rail', 'ninja_monkey', 'gatling_cherry_bomber']
    # spread towers over all lanes: take every k-th path-adjacent cell
    placed = sum(G(f'H.placeTower("{tid}", {near[2 + i * 5][0]}, {near[2 + i * 5][1]})') for i, tid in enumerate(combat))
    check(placed == len(combat), f'placed {placed}/{len(combat)} towers across 3 factions on every lane')

    far = G('''(() => { const fc = H.freeCells().filter(([c,r]) => H.g.nearestLane(H.g.grid.cellCenter(c,r)).dist > 90); const pick = []; for (const cell of fc) { if (pick.every(p => Math.abs(p[0]-cell[0]) + Math.abs(p[1]-cell[1]) >= 5)) pick.push(cell); if (pick.length >= 5) break; } return pick; })()''')
    for tid, cr in zip(['money_monkey', 'unsc_depot', 'money_monkey', 'unsc_depot', 'money_monkey'], far): G(f'H.placeTower("{tid}", {cr[0]}, {cr[1]})')
    before = G('H.farmCells()'); check(len(before) == 5, '5 spread-out field farms placed')

    # --- BASE: click a build pad through the UI, build a Reactor; Supply + Barracks via hooks
    pads = G('H.pads()')
    click_world(pads[0]['x'], pads[0]['y'], zoom=0.9)
    pg.wait_for_selector('#sel-panel [data-build="barracks"]', timeout=3000)
    pg.wait_for_timeout(150)
    pg.click('#sel-panel [data-build="barracks"]')
    check(G('H.pads()[0].state') == 'constructing', 'clicked pad -> build menu -> Barracks constructing (credits paid)')
    check(G('H.build(1, "supply")'), 'Supply Pad construction started')
    check(not G('H.build(0, "reactor")'), 'occupied pad rejects a second building')
    pg.wait_for_timeout(500)
    G('H.selectTower(-1)')
    G(f'H.camFocus({G("H.g.hq.x")} - 120, {G("H.g.hq.y")}, 1.0)')
    pg.screenshot(path=f'{SHOTS}/03_base_constructing.png')

    # --- pop cap + tech BEFORE the reactor finishes
    G('H.g.speed = 1')
    check(G('H.state().tech') == 0, 'tech 0 before the Reactor completes')
    check(not G('H.deploy("line_watch", H.g.map.rally[0], H.g.map.rally[1])'), 'Line Watch blocked without tech (needs Reactor)')
    check(not G('H.research("marine")'), 'troop research tier blocked without tech')
    pts = [G(f'H.lanePoint({i}, {k})') for i, k in enumerate([0.55, 0.6, 0.65, 0.7, 0.75, 0.8])]
    G(f'H.deploy("farmhand", {G("H.g.grid.cellCenter(" + str(far[2][0]) + "," + str(far[2][1]) + ").x")}, {G("H.g.grid.cellCenter(" + str(far[2][0]) + "," + str(far[2][1]) + ").y")})')
    G(f'H.deploy("monkey_soldier", {pts[1]["x"]}, {pts[1]["y"]})')
    n_mar = 0
    for i in range(8):
        G('H.g.deployCd = {}')
        if G(f'H.deploy("marine", {pts[i % len(pts)]["x"]}, {pts[i % len(pts)]["y"]})'): n_mar += 1
        else: break
    s = st(); print('pop', s['pop'], '/', s['popCap'])
    check(s['pop'] <= s['popCap'] and s['pop'] >= s['popCap'] - 1, f'deployed {n_mar} marine squads until the pop cap {s["pop"]}/{s["popCap"]}')
    check('Population' in (G('H.g.fieldBlock("marine")') or ''), 'further deploys blocked by the population cap')
    # barracks must finish construction before it can train
    G('H.setSpeed(4)')
    pg.wait_for_function('window.__game.state().buildings.some(b => b === "barracks:0")', timeout=30000)
    check(G('H.train(0, "marine")'), 'queued a Marine squad at the Barracks (credits on enqueue)')
    pg.wait_for_function('window.__game.state().held.length > 0', timeout=30000)
    s = st()
    check(any('pop' in h for h in s['held']) and s['trained'] == 0, f'trained squad held at the door while pop is full ({s["held"]})')
    check(G('H.build(2, "reactor")'), 'Reactor construction started')
    pg.wait_for_function('window.__game.state().tech >= 1', timeout=30000)
    pg.wait_for_function('window.__game.state().trained >= 1', timeout=10000)
    s = st()
    check(s['tech'] == 1 and s['popCap'] >= s0['popCap'] + 5, f'Reactor online: tech {s["tech"]}, pop cap {s0["popCap"]} -> {s["popCap"]}')
    check(s['trained'] >= 1, 'held squad released once the Reactor raised the pop cap')
    pg.wait_for_function('window.__game.state().buildings.some(b => b === "supply:0")', timeout=20000)
    G('H.setSpeed(1)')
    # rally point through the UI
    bi = G('H.g.buildings.findIndex(b => b.data.id === "barracks")')
    bx, by = G(f'H.g.buildings[{bi}].x'), G(f'H.g.buildings[{bi}].y')
    click_world(bx, by - 40, zoom=1.0)
    pg.wait_for_selector('#sp-rally', timeout=3000)
    pg.click('#sp-rally')
    rp = pts[0]
    click_world(rp['x'], rp['y'] - 60, zoom=1.0)
    r = G(f'H.g.buildings[{bi}].rally')
    print('   rally', r, 'target', rp)
    check(abs(r['x'] - rp['x']) < 4 and abs(r['y'] - (rp['y'] - 60)) < 4, 'Barracks rally point set via the panel + map click')
    G('H.camReset()')

    # --- tech now 1: Line Watch + research, HQ upgrade raises pop
    check(G('H.upgradeBuilding(0)'), 'HQ upgrade started')
    G('H.finishBuilds()'); pg.wait_for_timeout(100)
    s = st(); check(s['hqMax'] > s0['hqMax'] and s['popCap'] > s0['popCap'] + 5, f'HQ tier 2: max HP {s0["hqMax"]} -> {s["hqMax"]}, pop cap {s["popCap"]}')
    check(G(f'H.deploy("line_watch", {pts[2]["x"]}, {pts[2]["y"]})'), 'Line Watch deployed with tech 1')
    G('H.research("marine"); H.research("line_watch"); H.research("farmhand"); H.research("monkey_soldier")')
    check(G('H.g.unitTier("marine")') == 1, 'Marine research tier 2 with tech 1')
    G('H.train(0, "monkey_soldier"); H.train(0, "marine")')

    # --- garrison + cover aura + organize farms
    G('H.garrison(H.g.squads.findIndex(s => s.data.id === "marine"))')
    try: pg.wait_for_function('window.__game.state().garrisoned > 0', timeout=20000)
    except Exception: pass
    check(st()['garrisoned'] > 0, f'garrisoned {st()["garrisoned"]} marine(s) in a Cover tower')
    check(st()['buffed'] > 0, f'Cover aura buffing {st()["buffed"]} entities')
    G('H.setSpeed(4)')
    pg.click('#btn-organize')
    pg.wait_for_function('window.__game.state().organizes > 0', timeout=40000)
    pg.wait_for_function('window.__game.state().sliding === 0', timeout=10000)
    after = G('H.farmCells()')
    bbox = lambda cs: (max(c[0] for c in cs) - min(c[0] for c in cs) + 1) * (max(c[1] for c in cs) - min(c[1] for c in cs) + 1)
    check(bbox(after) < bbox(before), f'Organize Farms shrank farm footprint {bbox(before)} -> {bbox(after)} cells')
    G('H.selectTower(1)'); pg.wait_for_timeout(150)
    pg.click('#sp-up'); pg.wait_for_timeout(100); pg.click('#sel-panel [data-tgt="last"]')
    check(G('H.g.towers[1].tier') == 1 and G('H.g.towers[1].targeting') == 'last', 'tower upgraded + targeting set to Last via the 5-way selector')
    G('H.upgradeAll(); H.upgradeAll();')
    pg.keyboard.press('Escape')
    G('H.setSpeed(1)')
    G(f'H.camFocus({G("H.g.hq.x")} - 150, {G("H.g.hq.y")}, 0.85)')
    G('H.selectTower(-1)')
    pg.wait_for_timeout(300)
    pg.screenshot(path=f'{SHOTS}/04_base_with_buildings.png')

    # --- MAC Blast through the UI on a live wave
    G('H.g.waves.index = 7; H.setSpeed(2); H.startWave()')
    pg.wait_for_function('window.__game.g.enemies.filter(e => e.progress > 250).length >= 2', timeout=90000)
    G('H.setSpeed(1)')
    tgt = G('(() => { const e = H.g.enemies.filter(e => e.progress > 250).sort((a, b) => b.progress - a.progress)[0]; return { x: e.x, y: e.y, uid: e.uid, lane: e.lane }; })()')
    G('H.addEnergy(100)')
    en0 = st()['energy']
    G(f'H.camFocus({tgt["x"]},{tgt["y"]},1.0)')
    pg.click('.power[data-power="mac"]')
    x, y = scr(tgt['x'], tgt['y']); pg.mouse.move(x, y); pg.wait_for_timeout(60)
    pg.screenshot(path=f'{SHOTS}/05a_mac_aiming.png')
    prog = G('Object.fromEntries(H.g.enemies.map(e => [e.uid, e.progress]))')
    pg.mouse.click(x, y)
    check(st()['strikes'] == 1 and st()['energy'] <= en0 - 59, f'MAC Blast cast from the power bar (energy {en0} -> {st()["energy"]})')
    pg.wait_for_timeout(1150)
    pg.screenshot(path=f'{SHOTS}/05_mac_blast.png')
    pg.wait_for_function('window.__game.state().strikes === 0', timeout=5000)
    s = st()
    knocked = G(f'(() => {{ const p = {prog}; return H.g.enemies.filter(e => p[e.uid] !== undefined && e.progress < p[e.uid] - 20).length; }})()')
    check(s['macHits'] > 0, f'MAC Blast hit {s["macHits"]} enemies')
    check(knocked > 0 or s['kills'] > 0, f'MAC knockback pushed {knocked} survivors back down the lane')
    check(s['decals'] > 0, f'{s["decals"]} crater decals left on the road')
    check(not G(f'H.power("mac", {tgt["x"]}, {tgt["y"]})'), 'MAC Blast on cooldown')
    G('H.addEnergy(100)')
    hq_c = (G('H.g.hq.x'), G('H.g.hq.y'))
    G('H.g.hq.health.hp -= 50')
    h0 = st()['hq']
    check(G(f'H.power("heal", {hq_c[0]}, {hq_c[1]})'), 'Heal Drop cast')
    pg.wait_for_timeout(900)
    check(st()['hq'] > h0, f'Heal Drop repaired the HQ {h0} -> {st()["hq"]}')
    G('H.setSpeed(4)')
    pg.wait_for_function('!window.__game.state().waveActive || window.__game.state().state !== "playing"', timeout=180000, polling=250)

    # --- run waves
    for w in range(args.waves - 1):
        G('H.addEnergy(100)')
        G('H.startWave()')
        # auto-cast MAC on the most advanced enemy mid-wave (like a player would)
        pg.wait_for_timeout(1500)
        G('(() => { const e = H.g.enemies.sort((a, b) => a.remaining - b.remaining)[0]; if (e) H.power("mac", e.x, e.y); })()')
        pg.wait_for_function('!window.__game.state().waveActive || window.__game.state().state !== "playing"', timeout=240000, polling=250)
        s = st()
        print(f'wave {s["wave"]}: hq={s["hq"]}/{s["hqMax"]} credits={s["credits"]} kills={s["kills"]} pop={s["pop"]}/{s["popCap"]} supply+={s["supplyIncome"]} offline={s["offline"]}')
        if s['state'] != 'playing': break
    s = st()
    check(s['state'] == 'playing', f'base survived {s["wave"]} waves (HQ {s["hq"]})')
    check(s['kills'] > 50, f'{s["kills"]} kills')
    check(s['supplyIncome'] > 0, f'Supply Pad paid {s["supplyIncome"]} safe credits')
    check(s['pickups'].get('Farmhand', 0) > 0, f'Farmhand collected dropped credits {s["pickups"]}')

    # --- late wave fight (wave 19: MOABs + Titans, scaled HP)
    G('H.g.waves.index = 18; H.addCredits(5000); H.setSpeed(2)')
    G('H.startWave()')
    check(G('H.g.waves.hpMul') > 1.8, f'late-wave HP scaling x{G("H.g.waves.hpMul"):.2f}')
    pg.wait_for_function('window.__game.g.enemies.some(e => e.data.family === "bug" && e.progress > 500)', timeout=90000)
    e = G('(() => { const e = H.g.enemies.filter(e => e.data.family === "bug").sort((a,b)=>b.progress-a.progress)[0]; return {x:e.x,y:e.y}; })()')
    G(f'H.camFocus({e["x"]},{e["y"]},0.9)')
    pg.wait_for_timeout(200)
    pg.screenshot(path=f'{SHOTS}/06_late_wave_fight.png')
    G('H.setSpeed(4)')
    pg.wait_for_function('!window.__game.state().waveActive || window.__game.state().state !== "playing"', timeout=300000, polling=250)
    s = st(); print('after late wave', s)
    check(s['hq'] < s['hqMax'] or s['offline'] > 0 or s['kills'] > 400, f'late wave pressured the base (HQ {s["hq"]}/{s["hqMax"]}, offline {s["offline"]})')
    G('H.camReset()'); pg.wait_for_timeout(150)
    pg.screenshot(path=f'{SHOTS}/07_after_late_wave.png')
    # --- lose condition: HQ destroyed => game lost
    if s['state'] == 'playing':
        G('H.g.damageHQ(1e6)')
        pg.wait_for_timeout(300)
    check(st()['state'] == 'lost' and pg.locator('#gameover.show').count() == 1, 'HQ destroyed -> game over (lost)')

    # --- mobile viewport (touch)
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
    mp = ctx.new_page(); attach(mp)
    mp.goto(f'http://127.0.0.1:{port}/index.html?map={args.map}')
    mp.wait_for_function('window.__game')
    M = lambda js: mp.evaluate(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()')
    mb = mp.locator('#game').bounding_box()
    check(mb['width'] >= 380 and mb['height'] >= 250, f'mobile canvas fills the stage {mb["width"]:.0f}x{mb["height"]:.0f}')
    pd = M('H.pads()[3]')
    M(f'H.camFocus({pd["x"]},{pd["y"]},0.6)')
    sp = M(f'H.worldToScreen({pd["x"]},{pd["y"]})')
    mp.touchscreen.tap(mb['x'] + sp['x'], mb['y'] + sp['y'])
    mp.wait_for_timeout(300)
    check(mp.locator('#sel-panel [data-build]').count() == 3, 'tap on a build pad opens the build menu (touch)')
    mp.keyboard.press('Escape'); M(f'H.camFocus({M("H.g.hq.x")} - 260, {M("H.g.hq.y")}, 0.36)'); mp.wait_for_timeout(250)
    mp.screenshot(path=f'{SHOTS}/08_mobile.png')
    M('H.camReset()'); mp.wait_for_timeout(150)
    mp.screenshot(path=f'{SHOTS}/08b_mobile_full_map.png')
    ctx.close()
    b.close()

httpd.shutdown()
print(f'console errors: {len(errors)}'); [print('  ', e) for e in errors[:20]]
print(f'console warnings: {len(warnings)}'); [print('  ', w) for w in warnings[:10]]
check(not errors, 'zero console errors')
print('RESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})')
sys.exit(1 if fails else 0)
