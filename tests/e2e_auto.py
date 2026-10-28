"""t35 Auto Army e2e: HUD toggle + hotkey G + unit-panel toggle, A/II badges, lane defence spread by threat,
leak interception near the HQ, take cover in garrisons when enemies approach, retreat to heal at low HP and return,
manual orders override then auto resumes, ODST auto-EMP, anti-air shoots flyers first, Farmhand auto-organizes farms,
Paladin medics follow the wounded, auto OFF leaves squads alone, tutorial step, FPS. Screenshots -> screenshots/t35/.
Usage: /workspace/.venv-pw/bin/python tests/e2e_auto.py [--map morro]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--map', default='morro'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't35'); os.makedirs(OUT, exist_ok=True)
M = args.map
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=os.path.join(ROOT, 'dist')))
port = httpd.server_address[1]; threading.Thread(target=httpd.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{port}/index.html'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(URL + f'?map={M}'); pg.wait_for_function('window.__game')
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game, g = H.g; return eval({json.dumps(js)}); }})()')
    def until(js, ms=10000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game, g = H.g; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    G('H.addCredits(60000); H.sandbox(5, 200)')
    nl = G('g.paths.length')
    # ---- auto OFF: squads keep their post through enemy traffic
    pt = G('H.lanePoint(0, 0.6)')
    G(f'H.deploy("marine", {pt["x"]} + 60, {pt["y"]} + 60)'); until('g.squads.length === 1 && g.units.every((u) => u.dropT <= 0)', 4000)
    r0 = G('({...g.squads[0].rally})')
    for l in range(nl): G(f'H.spawn("ceramic", {l}, 0.5)')
    pg.wait_for_timeout(1500)
    r1 = G('({...g.squads[0].rally})')
    check(not G('g.squads[0].auto') and abs(r0['x'] - r1['x']) < 1 and abs(r0['y'] - r1['y']) < 1, 'Auto OFF (default): squad stays where it was ordered')
    G('H.killAllEnemies()')
    # ---- HUD toggle
    check(pg.locator('#btn-autoarmy').inner_text().strip().endswith('OFF'), 'HUD shows 🤖 Auto: OFF')
    pg.click('#btn-autoarmy'); pg.wait_for_timeout(300)
    check(G('g.autoArmy[0] && g.squads.every((q) => q.auto)') and 'ON' in pg.locator('#btn-autoarmy').inner_text(), 'HUD Auto Army button turns every squad auto')
    G('g.deployCd = {}')
    pt2 = G('H.lanePoint(1 % g.paths.length, 0.6)')
    G(f'H.deploy("marine", {pt2["x"]} + 60, {pt2["y"]} - 60)'); until('g.squads.length === 2 && g.units.every((u) => u.dropT <= 0)', 4000)
    check(G('g.squads[1].auto'), 'new squads inherit Auto Army ON')
    # ---- lane defence spread by threat
    G('H.killAllEnemies(); g.deployCd = {}')
    G('for (let i = 0; i < 6; i++) H.spawn("ceramic", 0, 0.3 + i * 0.01, 3); for (let i = 0; i < 6; i++) H.spawn("ceramic", 1 % g.paths.length, 0.3 + i * 0.01, 3)')
    G('for (const e of g.enemies) e.speedK = 0')  # freeze so the test is deterministic
    pg.wait_for_timeout(1500)
    lanes = G('g.squads.map((q) => q.autoLane)'); tasks = G('g.squads.map((q) => q.autoTask)')
    check(nl < 2 or sorted(lanes) == [0, 1], f'two auto squads spread over the two threatened lanes {lanes} {tasks}')
    check(all(t.startswith('defending lane') for t in tasks), f'tasks read "defending lane N" {tasks}')
    d = G('Math.min(...g.squads.map((q) => { const p = g.paths[q.autoLane]; let b = 1e9; for (let f = 0; f <= 1; f += 0.01) { const a = p.at(p.length * f); b = Math.min(b, Math.hypot(a.x - q.rally.x, a.y - q.rally.y)); } return b; }))')
    check(d < 20, f'auto posts sit on the lane they defend ({d:.0f}px)')
    # threat shift: kill lane-1 enemies, pile on lane 0 -> both squads on lane 0 eventually
    if nl >= 3:
        G('for (const e of g.enemies) if (e.lane === 1) e.alive = false; for (let i = 0; i < 25; i++) H.spawn("moab", 2, 0.35 + i * 0.002, 1)')
        G('for (const e of g.enemies) e.speedK = 0')
        check(until('g.squads.some((q) => q.autoLane === 2)', 4000), f'a squad shifts to the newly threatened lane 3 {G("g.squads.map((q) => q.autoLane)")}')
    shot = lambda n: pg.screenshot(path=os.path.join(OUT, n + '.png'))
    G('H.camFocus && H.camFocus(g.squads[0].center.x, g.squads[0].center.y)'); pg.wait_for_timeout(400); shot('auto_badges')
    G('H.killAllEnemies()')
    # ---- intercept a leak near the HQ
    G('const L = g.paths[0]; window.__lk = H.spawn("ceramic", 0, (L.length - 380) / L.length, 20); for (const e of g.enemies) e.speedK = 0')
    check(until('g.squads.some((q) => q.autoTask === "intercepting a leak")', 3000), 'a squad intercepts the leak close to the HQ')
    check(until('(() => { const e = g.enemies.find((x) => x.uid === window.__lk); return !e || g.squads.some((q) => Math.hypot(q.center.x - e.x, q.center.y - e.y) < 160); })()', 12000), 'interceptor reaches the leaking enemy')
    G('H.killAllEnemies()')
    # ---- retreat to heal at low HP, then return
    G('for (const u of g.squads[0].units) u.health.hp = u.health.max * 0.2')
    check(until('g.squads[0].autoHeal && g.squads[0].autoTask === "healing at HQ"', 3000), 'low-HP squad falls back to heal at the HQ')
    G('H.setSpeed(4)')
    check(until('!g.squads[0].autoHeal', 25000), f'healed up at the HQ and released ({G("g.squads[0].units.map((u) => Math.round(u.health.frac * 100))")}%)')
    G('for (const e of g.enemies) e.alive = false; H.spawn("ceramic", 0, 0.5, 3); for (const e of g.enemies) e.speedK = 0')
    check(until('g.squads[0].autoTask.startsWith("defending lane")', 4000), 'healed squad returns to lane duty')
    G('H.setSpeed(1); H.killAllEnemies()')
    # ---- manual orders override, then auto resumes
    hq = G('({x: g.hq.x, y: g.hq.y})')
    G(f'H.move(0, {hq["x"]} - 250, {hq["y"]} + 120)')
    check(G('g.squads[0].manual') and until('g.squads[0].autoTask === "manual order"', 1500), 'manual move pauses auto for that squad (II badge)')
    shot('auto_manual_override')
    G('H.setSpeed(4)')
    check(until('!g.squads[0].manual', 20000), 'auto resumes once the manual order is finished')
    G('H.setSpeed(1)')
    # ---- take cover in a garrison when enemies approach
    envs = G('g.garrisonables().filter((x) => x.gSlots() >= 4).map((x) => ({x: x.x, y: x.y}))')
    if envs:
        ex, ey = envs[0]['x'], envs[0]['y']
        G(f'g.deployCd = {{}}; H.deploy("marine", {ex} + 50, {ey} + 50)')
        until('g.squads.length === 3 && g.units.every((u) => u.dropT <= 0)', 4000)
        G(f'g.squads[2].autoT = 0; g.squads[2].autoLane = -1; const q = g.squads[2]; q.rally = {{x: {ex} + 50, y: {ey} + 50}}; for (const u of q.units) {{ u.x = {ex} + 50; u.y = {ey} + 50; }}')
        # nearest lane point to the cover, enemy parked there
        G(f'(() => {{ let best = null, bd = 1e9; g.paths.forEach((p, l) => {{ for (let f = 0.05; f < 0.95; f += 0.01) {{ const a = p.at(p.length * f); const d = Math.hypot(a.x - {ex}, a.y - {ey}); if (d < bd) {{ bd = d; best = [l, f]; }} }} }}); window.__cv = best; window.__cvd = bd; }})()')
        cv, cvd = G('window.__cv'), G('window.__cvd')
        G(f'const e = g.spawnEnemy("moab", g.paths[{cv[0]}].length * {cv[1]}, 0, {cv[0]}, 5); e.speedK = 0; g.squads[2].autoT = 0')
        if cvd < 260:
            check(until('g.squads[2].units.some((u) => u.garrison)', 8000), f'auto squad garrisons nearby cover when enemies approach ({G("g.squads[2].autoTask")}, enemy {cvd:.0f}px from cover)')
        else:
            G(f'const e = g.enemies[g.enemies.length - 1]; e.x = {ex} + 120; e.y = {ey} + 60; e.speedK = 0; window.__pin = e')
            print('  note: no lane within 260px of a garrison; enemy pinned near cover')
            check(until('g.squads[2].units.some((u) => u.garrison) || g.squads[2].garrisonTarget', 6000), f'auto squad takes cover when an enemy approaches ({G("g.squads[2].autoTask")})')
        G('H.killAllEnemies()')
    else: print('  note: no garrisonable on this map; cover check skipped')
    # ---- ODST auto-EMP
    G(f'g.deployCd = {{}}; H.deploy("odst", {pt["x"]} + 40, {pt["y"]} + 40)')
    until('g.squads.some((q) => q.data.id === "odst") && g.units.every((u) => u.dropT <= 0)', 4000)
    G('const q = g.squads.find((q) => q.data.id === "odst"); q.autoT = 999; const c = q.center; for (let i = 0; i < 4; i++) { const e = g.spawnEnemy("ceramic", 0, 0, 0, 30); e.speedK = 0; e.x = c.x + 40 * Math.cos(i * 1.6); e.y = c.y + 40 * Math.sin(i * 1.6); e.progress = 1; } q.autoT = 0')
    G('const L = g.paths[0]; const q = g.squads.find((q) => q.data.id === "odst"); const c = q.center; let bf = 0, bd = 1e9; for (let f = 0; f < L.length; f += 8) { const a = L.at(f); const d = Math.hypot(a.x - c.x, a.y - c.y); if (d < bd) { bd = d; bf = f; } } for (const e of g.enemies) { e.progress = bf; e.speedK = 0; }')
    check(until('(g.squads.find((q) => q.data.id === "odst").abilityCd.emp ?? 0) > 0', 5000), 'ODST auto-casts EMP on a cluster')
    G('H.killAllEnemies()')
    # ---- anti-air shoots flyers first
    G(f'g.deployCd = {{}}; H.deploy("marine", {pt["x"]} + 50, {pt["y"]} + 50)')  # a fresh squad (earlier steps leave others healing / garrisoned)
    until('g.squads[g.squads.length - 1].data.id === "marine" && g.units.every((u) => u.dropT <= 0)', 4000); 
    G('const q = g.squads[g.squads.length - 1]; q.autoT = 1e9; q.manual = false; q.autoHeal = false; q.rally = {...q.center}; window.__aaq = q; const c = q.center; const gr = g.spawnEnemy("ironback", 0, 0, 0, 50); const fl = g.spawnEnemy("gargoyle", 0, 0, 0, 50); for (const e of [gr, fl]) { e.speedK = 0; } window.__gr = gr; window.__fl = fl;')
    G('const q = window.__aaq; const c = q.center; let bf = 0, bd = 1e9, bl = 0; g.paths.forEach((L, li) => { for (let f = 0; f < L.length; f += 6) { const a = L.at(f); const d = Math.hypot(a.x - c.x, a.y - c.y); if (d < bd) { bd = d; bf = f; bl = li; } } }); for (const e of [window.__gr, window.__fl]) { e.lane = bl; e.progress = bf; } window.__gr.progress = bf + 4; window.__h0 = [window.__gr.hp, window.__fl.hp]; window.__aaShots = {fl: 0, gr: 0}; if (!window.__aaHook) { window.__aaHook = 1; const o = g.unitAttack.bind(g); g.unitAttack = (u, t, tt) => { if (window.__aaq && u.squad === window.__aaq) { if (t === window.__fl) window.__aaShots.fl++; else if (t === window.__gr) window.__aaShots.gr++; } return o(u, t, tt); }; } 1')
    pg.wait_for_timeout(1500)
    h = G('[window.__h0, [window.__gr.hp, window.__fl.hp], window.__fl.alive]')
    check(h[0][1] - h[1][1] > 0 or not h[2], f'anti-air marines shoot the flyer first (flyer {h[0][1]:.0f}->{h[1][1]:.0f}, ground {h[0][0]:.0f}->{h[1][0]:.0f})')
    sh = G('window.__aaShots')
    print('  aa diag', G('(() => { const q = window.__aaq; const c = q.center; return {id: q.data.id, n: g.squads.length, task: q.autoTask, heal: q.autoHeal, manual: q.manual, units: q.units.map((u) => [u.alive, !!u.garrison, Math.round(Math.hypot(u.x - window.__fl.x, u.y - window.__fl.y)), Math.round(u.range(g)), +u.dropT.toFixed(2)]), stance: q.stance}; })()'))
    check(sh['fl'] > 0 and sh['fl'] >= sh['gr'], f'the auto squad aims at the flyer over the closer ground target (shots flyer {sh["fl"]} / ground {sh["gr"]})')
    G('window.__aaq.autoT = 0; H.killAllEnemies()')
    # ---- Farmhand auto-organizes farms
    G(f'g.deployCd = {{}}; H.deploy("farmhand", {hq["x"]} - 200, {hq["y"]} + 40)'); until('g.workers().length === 1', 4000)
    cells = G('H.freeCells()'); import random; random.seed(3); pick = random.sample(cells, 3)
    for c, r in pick: G(f'H.placeTower("money_monkey", {c}, {r})')
    check(until('g.workers()[0].task?.kind === "organize" || g.workers()[0].squad.autoOrgN >= 2', 4000), 'auto Farmhand heads off to organize the new farms')
    # ---- Paladin medic follows the wounded and mends
    G(f'g.deployCd = {{}}; H.deploy("paladin", {hq["x"]} - 300, {hq["y"]} - 100); H.research && H.research("paladin")')
    until('g.squads.some((q) => q.data.id === "paladin") && g.units.every((u) => u.dropT <= 0)', 4000)
    G('const q = g.squads[1]; q.autoT = 1e9; for (const u of q.units) u.health.hp = u.health.max * 0.5; window.__hw = q.units.map((u) => u.health.hp)')
    check(until('g.squads.find((q) => q.data.id === "paladin").autoTask === "healing the wounded"', 4000), 'Paladin medics head to the wounded squad')
    G('H.setSpeed(4)')
    check(until('g.squads[1].units.some((u, i) => u.health.hp > window.__hw[i] + 5)', 20000), 'wounded squad gets mended')
    G('H.setSpeed(1); g.squads[1].autoT = 0')
    # ---- unit-panel toggle + hotkey G
    G('H.selectSquad(0)'); pg.wait_for_timeout(300)
    check(pg.locator('#sp-auto').count() == 1 and 'ON' in pg.locator('#sp-auto').inner_text(), 'unit panel shows 🤖 Auto ON for the squad')
    shot('auto_unit_panel')
    pg.click('#sp-auto'); pg.wait_for_timeout(200)
    check(not G('g.squads[0].auto') and G('g.squads[1].auto'), 'unit-panel toggle switches only that squad off')
    pg.keyboard.press('g'); pg.wait_for_timeout(200)
    check(G('g.squads[0].auto'), 'G with a selection toggles the selected squad back on')
    G('H.selectSquad(-1)'); pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    pg.keyboard.press('g'); pg.wait_for_timeout(200)
    check(not G('g.autoArmy[0]') and not any(G('g.squads.map((q) => q.auto)')), 'G with nothing selected toggles the global Auto Army off')
    pg.keyboard.press('g'); pg.wait_for_timeout(200)
    # ---- FPS with a busy auto army
    G('g.deployCd = {}; for (const id of ["marine", "ranger", "line_watch", "monkey_soldier"]) { const p = H.lanePoint(0, 0.5); H.deploy(id, p.x + 30, p.y + 30); g.deployCd = {}; }')
    G('H.startWave(); H.setSpeed(2)'); G('H.fpsStart()'); pg.wait_for_timeout(4000); f = G('H.fpsStop()')
    check(f['avg'] >= 55, f'FPS with auto army + wave: avg {f["avg"]:.0f}')
    shot('auto_army_wave')
    # ---- tutorial step
    pg2 = ctx.new_page(); pg2.add_init_script("localStorage.removeItem('bof.tutorialDone')"); pg2.goto(URL + f'?map={M}&tutorial=1'); pg2.wait_for_function('window.__game')
    seen = False
    for _ in range(20):
        el = pg2.locator('#tutorial')
        if el.is_visible() and 'Auto Army' in el.inner_text(): seen = True; break
        pg2.evaluate('window.__game.tutNext()'); pg2.wait_for_timeout(150)
    check(seen, 'tutorial has the Auto Army step')
    if seen: pg2.screenshot(path=os.path.join(OUT, 'auto_tutorial.png'))
    b.close()
real = [e for e in errors if 'favicon' not in e]
check(not real, f'no console errors {real[:3]}')
print(f'RESULT {M}: ' + ('PASS (0 failed checks)' if not fails else f'FAIL ({len(fails)}) {fails}'))
