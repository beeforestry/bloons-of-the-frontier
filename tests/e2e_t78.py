"""t78: Overrun — first-person survival mode. Menu entry -> class select (incl. both vehicles) -> team spawns in
first person -> AI hive monsters hunt the survivors -> kills earn points -> points place towers on the tactical map ->
death opens the monster picker -> respawn as a turned monster -> timer win / last-survivor loss end screens."""
import argparse, functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'screenshots', 't78'); os.makedirs(OUT, exist_ok=True)
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--tag', default=''); args = ap.parse_args()
if args.url: URL = args.url.rstrip('/') + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/'
fails = []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    path = os.path.join(OUT, name + args.tag + '.png'); pg.screenshot(path=path, full_page=False); print('  shot', path, flush=True)

def until(pg, js, ms, arg=None):
    for _ in range(max(1, ms // 250)):
        if pg.evaluate(js, arg) if arg is not None else pg.evaluate(js): return True
        pg.wait_for_timeout(250)
    return False

ST = '() => window.__overrun.state()'
ME = '() => window.__overrun.state().players.find((p) => p.pid === 0)'

def open_overrun(pg, bots, minutes=3, map_id='tropical'):
    pg.goto(URL + 'index.html', timeout=60000)
    pg.wait_for_selector('.mode-pick[data-mode="overrun"]', timeout=60000)
    pg.click('.mode-pick[data-mode="overrun"]')
    pg.wait_for_selector('#ov-solo', timeout=5000)
    pg.select_option('#ov-map', map_id); pg.select_option('#ov-min', str(minutes)); pg.select_option('#ov-bots', str(bots))
    return pg

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
        args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width': 1600, 'height': 960})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    errs = []
    pg.on('console', lambda m: (print('CONSOLE', m.type, m.text[:300], flush=True), errs.append(m.text) if m.type == 'error' else None) if m.type in ('warning', 'error') else None)
    pg.on('pageerror', lambda e: (print('PAGEERROR', str(e)[:300], flush=True), errs.append(str(e))))

    # ---------------------------------------------------------------- 1. menu -> class select
    print('== run 1: solo + 1 AI squadmate, Raider Buggy', flush=True)
    open_overrun(pg, bots=1)
    check(pg.is_visible('#ov-solo'), 'Overrun entry in the main menu (mode button + solo setup)')
    pg.wait_for_timeout(300); shot(pg, 'menu_overrun')
    pg.click('#ov-solo')
    pg.wait_for_function('window.__overrun && window.__overrun.state', timeout=60000)
    pg.wait_for_selector('.ov-pick[data-cls="warthog"]', timeout=10000)
    cards = pg.evaluate("() => [...document.querySelectorAll('.ov-pick')].map((b) => ({ id: b.dataset.cls, veh: b.classList.contains('veh'), img: b.querySelector('img').complete && b.querySelector('img').naturalWidth > 0, text: b.innerText }))")
    print('cards', [(c['id'], c['veh'], c['img']) for c in cards], flush=True)
    check([c['id'] for c in cards] == ['marine', 'odst', 'spartan', 'warthog', 'scorpion'], 'class select lists all 5 survivor units')
    check(all(c['veh'] for c in cards if c['id'] in ('warthog', 'scorpion')) and sum(c['veh'] for c in cards) == 2, 'both vehicles (Raider Buggy, Bulwark Scorpion) are pickable')
    pg.wait_for_function("() => [...document.querySelectorAll('.ov-pick img')].every((i) => i.complete && i.naturalWidth > 0)", timeout=15000)
    check(True, 'all class portraits loaded')
    txt = pg.inner_text('#ov-screen')
    check('Overrun' in txt and not any(w in txt for w in ('Halo', 'Warthog', 'Spartan', 'Bloons', 'Infection', 'Call of Duty')), 'display name is "Overrun"; no franchise names in the class select')
    st = pg.evaluate(ST); check(st['phase'] == 'pick' and st['monsters'] == 0, 'nobody spawned before the pick')
    shot(pg, 'class_select')

    # ---------------------------------------------------------------- 2. spawn straight into first person
    pg.click('.ov-pick[data-cls="warthog"]')
    check(until(pg, "() => window.__overrun.state().phase === 'live'", 5000), 'picking a class starts the match')
    check(until(pg, "() => !!(window.__possess && window.__possess.cur && window.__overrun.inFP())", 30000), 'spawned directly in first person (no place-then-possess)')
    me = pg.evaluate(ME)
    ps = pg.evaluate('() => window.__possess.cur.state()')
    nm = pg.inner_text('#possess-root .ps-me .nm')
    check(nm == 'Raider Buggy', f'first-person HUD uses the Overrun display name ("{nm}")')
    print('me', me, 'possess', {k: ps[k] for k in ('kind', 'id', 'ovr')}, flush=True)
    check(me['role'] == 'survivor' and me['unit'] and me['unit']['id'] == 'warthog' and ps['kind'] == 'unit' and ps['id'] == 'warthog', 'first person as the chosen Raider Buggy')
    check(me['unit']['max'] == 320, f"Overrun survivor HP (Raider 320) -> {me['unit']['max']}")
    team = [q for q in pg.evaluate(ST)['players'] if q['bot']]
    check(len(team) == 1 and team[0]['role'] == 'survivor' and team[0]['unit'], 'AI squadmate spawned with the team')
    if team and team[0]['unit']:
        d = ((team[0]['unit']['x'] - me['unit']['x']) ** 2 + (team[0]['unit']['y'] - me['unit']['y']) ** 2) ** 0.5
        check(d < 260, f'team spawns together ({d:.0f}px apart)')
    pg.evaluate("() => window.__overrun.noSpawn(true)")
    pg.wait_for_timeout(3500)
    bu = pg.evaluate(ST)['players'][1]['unit']
    pg.evaluate("([x, y]) => window.__possess.cur.aimAt(x, y, 1.2)", [bu['x'], bu['y']])
    pg.wait_for_timeout(1200)
    shot(pg, 'fp_survivors_raider')

    # ---------------------------------------------------------------- 3. monsters hunt the survivors
    pg.evaluate("() => window.__overrun.spawnNear('scavenger', 4, 230)")
    pg.evaluate("() => window.__overrun.spawnNear('hunter', 2, 260)")
    st = pg.evaluate(ST); check(st['monsters'] >= 6, f"hive monsters on the field ({st['monsters']})")
    me0 = pg.evaluate(ME)
    def mon_dist():
        return pg.evaluate("""() => { const o = window.__overrun.ov, sv = o.survivors().map((p) => p.unit).filter((u) => u && u.alive), out = {};
          for (const e of o.mobs) if (e.alive) out[e.uid] = Math.min(...sv.map((u) => Math.hypot(e.x - u.x, e.y - u.y))); return out; }""")
    d0 = mon_dist(); pg.wait_for_timeout(2000); d1 = mon_dist()
    both = [k for k in d0 if k in d1 and d0[k] > 60]
    closer = [k for k in both if d1[k] < d0[k] - 5]
    print('hunt', {k: (round(d0[k]), round(d1[k])) for k in both}, flush=True)
    check(len(both) > 0 and len(closer) >= len(both) * 0.6, f'monsters close in on the survivors ({len(closer)}/{len(both)} closer)')
    hurt = until(pg, "(hp0) => { const m = window.__overrun.state().players.find((p) => p.pid === 0); return !m.unit || m.unit.hp < hp0 || window.__overrun.state().players[1].unit?.hp < window.__overrun.state().players[1].unit?.max; }", 12000, me0['unit']['hp'])
    check(hurt, 'monsters bite the survivors')
    pg.evaluate("() => window.__possess.cur.aimNearest()"); pg.wait_for_timeout(1500); pg.evaluate("() => window.__possess.cur.aimNearest()"); pg.wait_for_timeout(400)
    shot(pg, 'fp_monsters_attacking')
    # fight: aim at the nearest monster and hold the trigger -> kills -> points
    pg.evaluate("() => window.__possess.cur.setFire(true)")
    got = False
    for _ in range(80):
        pg.evaluate("() => window.__possess.cur && window.__possess.cur.aimNearest()")
        pg.wait_for_timeout(250)
        m = pg.evaluate(ME)
        if m['points'] > 0: got = True; break
    pg.evaluate("() => window.__possess.cur && window.__possess.cur.setFire(false)")
    m = pg.evaluate(ME); print('after fight', {k: m[k] for k in ('points', 'kills', 'earned', 'role')}, flush=True)
    check(got and m['kills'] > 0, f"kills grant points ({m['kills']} kills, {m['earned']} pts)")
    pg.evaluate("() => window.__overrun.killMobs()"); pg.wait_for_timeout(400)

    # ---------------------------------------------------------------- 4. points -> tactical map -> tower
    pg.evaluate("() => window.__overrun.addPoints(400)")
    pts0 = pg.evaluate(ME)['points']
    pg.keyboard.press('e')
    check(until(pg, "() => !window.__overrun.inFP()", 5000), 'E opens the tactical map')
    pg.wait_for_selector('#ov-shop:not([hidden])', timeout=4000)
    check(pg.is_visible('#ov-fp'), '"Back to first person" button on the tactical map')
    pg.click('.ov-buy[data-id="dart_monkey"]')
    u = pg.evaluate(ME)['unit']
    pg.wait_for_timeout(500)
    # hover the ghost next to the unit, screenshot, then click via the real map click handler
    spot = pg.evaluate("""([ux, uy]) => { const g = window.__game.g; for (let r = 90; r < 400; r += 20) for (let a = 0; a < 6.28; a += 0.4) { const x = ux + Math.cos(a) * r, y = uy + Math.sin(a) * r; const s = g.placementSpot('dart_monkey', { x, y }); if (s && g.canPlace('dart_monkey', s)) return { x, y }; } return null; }""", [u['x'], u['y']])
    print('spot', spot, flush=True)
    check(bool(spot), 'a valid tower spot near the survivor (placement ghost green when affordable)')
    if spot:
        scr = pg.evaluate("([x, y]) => { const r = window.__game.r ?? null; return null; }", [spot['x'], spot['y']])
        res = pg.evaluate("([x, y]) => { window.__overrun.clickMap(x, y); return window.__overrun.state(); }", [spot['x'], spot['y']])
        mine = [t for t in res['towers'] if t['owner'] == 0]
        m2 = pg.evaluate(ME)
        check(len(mine) == 1 and mine[0]['id'] == 'dart_monkey' and m2['points'] == pts0 - 120 and m2['towers'] == 1, f"points place a tower ({pts0} -> {m2['points']} pts, towers {m2['towers']})")
        far = pg.evaluate("([x, y]) => window.__overrun.place('dart_monkey', x + 2000, y)", [u['x'], u['y']])
        check(bool(far), f'towers must be placed near your unit ("{far}")')
        broke = pg.evaluate("() => { window.__overrun.ov.me.points = 10; return window.__overrun.place('dart_monkey', 0, 0); }")
        check('Need' in broke, f'not enough points is refused ("{broke}")')
        pg.evaluate("() => window.__overrun.addPoints(500)")
        pg.click('.ov-buy[data-id="unsc_autoturret"]'); pg.wait_for_timeout(600)
        # put the placement ghost (green = affordable + in range) under the real mouse
        sp2 = pg.evaluate("""([ux, uy]) => { const g = window.__game.g; for (let r = 110; r < 400; r += 20) for (let a = 3.14; a < 9.4; a += 0.4) { const x = ux + Math.cos(a) * r, y = uy + Math.sin(a) * r; const s = g.placementSpot('unsc_autoturret', { x, y }); if (s && g.canPlace('unsc_autoturret', s)) return window.__overrun.toScreen(x, y); } return null; }""", [u['x'], u['y']])
        if sp2: pg.mouse.move(sp2['x'], sp2['y']); pg.mouse.move(sp2['x'] + 2, sp2['y'] + 1)
        pg.wait_for_timeout(700)
        shot(pg, 'tactical_points_tower_place')
        pg.keyboard.press('Escape')
        # the tower fires on monsters
        pg.evaluate("() => window.__overrun.spawnNear('scavenger', 3, 150)")
        fired = until(pg, "() => window.__game.g.towers.some((t) => t.owner === 0 && t.combat && t.combat.shotCount > 0)", 12000)
        check(fired, 'survivor tower fires on the monsters')
        pg.evaluate("() => window.__overrun.killMobs()")
    pg.click('#ov-fp')
    check(until(pg, "() => window.__overrun.inFP()", 15000), 'back to first person from the tactical map')

    # ---------------------------------------------------------------- 5. death -> monster picker -> turned
    pg.evaluate("() => window.__overrun.killUnit(0)")
    check(until(pg, "() => window.__overrun.screen().includes('turn')", 6000), 'dying (team still alive) opens the monster class picker')
    mons = pg.evaluate("() => [...document.querySelectorAll('.ov-pick[data-mon]')].map((b) => b.dataset.mon)")
    check(mons == ['scavenger', 'hunter', 'charger', 'brood'], f'monster classes offered: {mons}')
    pg.wait_for_function("() => [...document.querySelectorAll('.ov-pick img')].every((i) => i.complete && i.naturalWidth > 0)", timeout=15000)
    shot(pg, 'enemy_class_picker')
    pg.click('.ov-pick[data-mon="hunter"]')
    pg.evaluate("() => window.__overrun.skipRespawn()")
    check(until(pg, "() => { const m = window.__overrun.state().players.find((p) => p.pid === 0); return m.role === 'turned' && !!m.enemy; }", 8000), 'respawned as the chosen monster')
    check(until(pg, "() => window.__overrun.inFP() && window.__possess.cur && window.__possess.cur.state().kind === 'bug'", 20000), 'first person as the turned Hunter')
    me = pg.evaluate(ME); print('turned', me['enemy'], flush=True)
    check(me['enemy']['id'] == 'hunter' and me['enemy']['max'] == 140, 'turned monster uses the Hunter class stats')
    pg.evaluate("() => window.__overrun.addPoints(50)")
    refuse = pg.evaluate("() => window.__overrun.place('dart_monkey', 0, 0)")
    check('survivor' in refuse.lower(), f'turned players cannot place towers ("{refuse}")')
    # AI monsters ignore the turned player
    pg.evaluate("() => window.__overrun.spawnNear('scavenger', 2, 300, 10)")
    # stalk the AI survivor (test: drop the monster ~12 m from it) and bite
    pg.evaluate("""() => { const o = window.__overrun.ov, e = o.me.enemy, u = o.players[1].unit; if (!e || !u) return; e.x = u.x - 95; e.y = u.y + 20; }""")
    pg.wait_for_timeout(1500)
    pg.evaluate("() => window.__possess.cur.aimNearest()")
    pg.wait_for_timeout(1200); pg.evaluate("() => window.__possess.cur.aimNearest()"); pg.wait_for_timeout(300)
    shot(pg, 'playing_turned_bug')
    bot0 = pg.evaluate(ST)['players'][1]['unit']
    # teleport next to the bot (test only) and bite it
    pg.evaluate("""() => { const o = window.__overrun.ov, e = o.me.enemy, u = o.players[1].unit; if (!e || !u) return; e.x = u.x - 14; e.y = u.y; }""")
    pg.evaluate("() => window.__possess.cur.aimNearest()"); pg.evaluate("() => window.__possess.cur.setFire(true)")
    bit = until(pg, "() => { const p = window.__possess.cur && window.__possess.cur.state(); return p && p.shots > 0; }", 6000)
    pg.wait_for_timeout(1500); pg.evaluate("() => window.__possess.cur && window.__possess.cur.setFire(false)")
    bot1 = pg.evaluate(ST)['players'][1]['unit']
    print('bot hp', bot0 and bot0['hp'], '->', bot1 and bot1['hp'], flush=True)
    check(bit and (not bot1 or bot1['hp'] < bot0['hp']), 'turned monster bites the surviving squad')
    pg.evaluate("() => window.__possess.cur && window.__possess.cur.bugAbility()")
    check(until(pg, "() => window.__overrun.ov.me.enemy ? window.__overrun.ov.me.enemy.ov.abilCd > 0 : false", 6000), 'monster ability (Pounce) triggers')
    turned_hits = pg.evaluate("() => { const e = window.__overrun.ov.me.enemy; return e ? e.hp : -1; }")
    # timer runs out while the AI squadmate still stands -> survivors win (seen from the turned player)
    pg.evaluate("() => window.__overrun.setTime(1)")
    check(until(pg, "() => window.__overrun.state().phase === 'done'", 6000), 'timer expiry ends the match')
    st = pg.evaluate(ST)
    check(st['result'] == 'survivors' and st['gstate'] == 'won', f"survivors win on the timer ({st['result']}, {st['gstate']})")
    pg.wait_for_timeout(600)
    et = pg.inner_text('#ov-screen'); print('end text:', et.split('\n')[0], flush=True)
    check('survivors held out' in et, 'end screen from the turned player\'s side')

    # ---------------------------------------------------------------- 6. solo: survive the timer
    print('== run 2: solo, Bulwark Scorpion, timer win', flush=True)
    open_overrun(pg, bots=0, minutes=3); pg.click('#ov-solo')
    pg.wait_for_selector('.ov-pick[data-cls="scorpion"]', timeout=20000); pg.click('.ov-pick[data-cls="scorpion"]')
    check(until(pg, "() => window.__overrun.inFP() && window.__possess && window.__possess.cur && window.__possess.cur.state().id === 'scorpion'", 30000), 'solo: first person as the Bulwark Scorpion')
    check(until(pg, "() => window.__overrun.state().monsters > 0", 20000), 'solo: the director spawns monsters by itself')
    pg.wait_for_timeout(4000)
    pg.evaluate("() => window.__possess.cur.aimNearest()"); pg.wait_for_timeout(1200)
    shot(pg, 'fp_scorpion_solo')
    pg.evaluate("() => window.__overrun.setTime(1)")
    check(until(pg, "() => window.__overrun.state().phase === 'done'", 6000), 'solo timer ends the match')
    st = pg.evaluate(ST); check(st['result'] == 'survivors' and st['gstate'] == 'won', 'solo: surviving the timer = win')
    pg.wait_for_timeout(800)
    et = pg.inner_text('#ov-screen'); check('You survived' in et, 'win end screen')
    check(not pg.is_visible('#gameover'), 'TD game-over panel not shown in Overrun')
    shot(pg, 'end_screen_win')

    # ---------------------------------------------------------------- 7. solo: lone survivor dies -> loss
    print('== run 3: solo, Marines, last survivor falls', flush=True)
    open_overrun(pg, bots=0, minutes=5, map_id='morro'); pg.click('#ov-solo')
    pg.wait_for_selector('.ov-pick[data-cls="marine"]', timeout=20000); pg.click('.ov-pick[data-cls="marine"]')
    check(until(pg, "() => window.__overrun.inFP()", 30000), 'El Morro: spawned in first person')
    pg.wait_for_timeout(1500)
    pg.evaluate("() => window.__overrun.killUnit(0)")
    check(until(pg, "() => window.__overrun.state().phase === 'done'", 6000), 'lone survivor death ends the match')
    st = pg.evaluate(ST); check(st['result'] == 'turned' and st['gstate'] == 'lost', f"last survivor falls -> loss ({st['result']}, {st['gstate']})")
    check(not pg.evaluate("() => window.__overrun.screen().includes('turn')"), 'no monster picker when nobody is left to hunt')
    pg.wait_for_timeout(900)
    et = pg.inner_text('#ov-screen'); check('last survivor fell' in et, 'loss end screen')
    shot(pg, 'end_screen_lose')

    # ---------------------------------------------------------------- 8. classic TD still starts
    pg.goto(URL + 'index.html?map=tropical', timeout=60000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000)
    td = pg.evaluate("() => ({ mode: window.__game.g.mode, ov: !!window.__game.g.overrun, collectors: window.__game.g.units.length, tw: window.__game.g.towers.length })")
    check(td['mode'] == 'solo' and not td['ov'], f'classic TD unaffected ({td})')
    check(not [e for e in errs if 'favicon' not in e], f'no page errors ({errs[:3]})')
    browser.close()
print('FAILS:', len(fails))
for f in fails: print('  -', f)
raise SystemExit(1 if fails else 0)
