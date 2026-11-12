"""t78 Overrun over the network (2 players, each in its own browser, test relay): lobby -> both pick ->
both spawn in first person -> client falls -> client picks a monster on its own screen -> client plays the
turned monster -> host-side points + client tower placement (host-authoritative) -> timer win on both screens.
Usage: python tests/e2e_t78_mp.py"""
import os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
import mp_relay
RELAY, BASE = mp_relay.serve()
fails, errors = [], []
def check(ok, msg):
    print(('  ok  ' if ok else '  FAIL ') + msg, flush=True)
    if not ok: fails.append(msg)
def until(pg, js, ms=20000, step=0.25):
    t = time.time()
    while time.time() - t < ms / 1000:
        try:
            v = pg.evaluate(js)
            if v: return v
        except Exception: pass
        time.sleep(step)
    return None
CHROME = os.environ.get('CHROME', '/usr/bin/google-chrome')
with sync_playwright() as p:
    procs = [p.chromium.launch(executable_path=CHROME, headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']) for _ in range(2)]
    pages = []
    for i, b in enumerate(procs):
        ctx = b.new_context(viewport={'width': 1100, 'height': 700})
        ctx.add_init_script(f"localStorage.setItem('bof.tutorialDone','1');localStorage.setItem('bof.relay','{RELAY}')")
        pg = ctx.new_page(); name = f'P{i+1}'
        pg.on('console', lambda m, n=name: errors.append(f'[{n}] {m.text}') if m.type == 'error' and 'peerjs' not in m.text.lower() and 'favicon' not in m.text else None)
        pg.on('pageerror', lambda e, n=name: errors.append(f'[{n}] PAGEERROR {e}'))
        pages.append(pg)
    host, cl = pages
    host.goto(BASE); host.wait_for_selector('.mode-pick[data-mode="overrun"]'); host.click('.mode-pick[data-mode="overrun"]'); host.click('#mp-host')
    code = until(host, "(() => { const e = document.getElementById('room-code'); return e && e.textContent })()", 30000)
    check(bool(code), f'host opened an Overrun room {code}')
    check('Overrun' in host.inner_text('.lobby-code'), 'lobby labelled Overrun')
    link = host.evaluate("document.getElementById('room-link').value")
    cl.goto(link)
    check(bool(until(host, "document.querySelectorAll('.lobby-players li:not(.empty)').length === 2", 30000)), 'client joined')
    host.select_option('#set-bots', '0'); host.select_option('#set-match', '3')
    until(cl, "!!document.getElementById('btn-ready')", 10000); cl.click('#btn-ready')
    check(bool(until(host, "!document.getElementById('btn-mpstart').disabled", 10000)), 'ready -> start enabled')
    host.click('#btn-mpstart')
    for pg in pages: check(bool(until(pg, "!!document.querySelector('.ov-pick[data-cls=\"scorpion\"]')", 30000)), 'class select on both screens')
    check(bool(until(cl, "window.__game && __game.mp() && __game.mp().snaps > 3", 25000)), 'client receives snapshots')
    host.click('.ov-pick[data-cls="marine"]')
    check(bool(until(cl, "document.querySelector('.ov-roster') && document.querySelector('.ov-roster').innerText.includes('Frontier Marines')", 10000)), "client sees the host's pick in the roster")
    check(host.evaluate("window.__overrun.state().phase") == 'pick', 'match waits until every player picked')
    cl.click('.ov-pick[data-cls="warthog"]')
    check(bool(until(host, "window.__overrun.state().phase === 'live'", 10000)), 'both picked -> match live')
    check(bool(until(host, "window.__overrun.inFP()", 30000)), 'host spawned in first person')
    check(bool(until(cl, "window.__overrun.inFP() && window.__possess.cur.state().id === 'warthog'", 30000)), 'client spawned in first person as the Raider Buggy')
    st = host.evaluate("window.__overrun.state()")
    pl = {q['pid']: q for q in st['players']}
    check(pl[0]['unit']['id'] == 'marine' and pl[1]['unit']['id'] == 'warthog', 'host sim has both survivors')
    # client drives its buggy (predicted locally, host authoritative)
    x0 = pl[1]['unit']['x']
    cl.evaluate("() => window.__possess.cur.setMove(1, 0)"); time.sleep(3); cl.evaluate("() => window.__possess.cur.setMove(0, 0)")
    x1 = host.evaluate("window.__overrun.state().players.find((p) => p.pid === 1).unit")
    check(x1 and (abs(x1['x'] - x0) + abs(x1['y'] - pl[1]['unit']['y'])) > 10, 'client movement reaches the host')
    # monsters show up on the client too
    host.evaluate("() => { window.__overrun.noSpawn(true); window.__overrun.spawnNear('hunter', 2, 200, 1); }")
    check(bool(until(cl, "window.__overrun.state().monsters >= 2", 8000)), 'client mirrors the hive monsters')
    # client points + tower placement through the host
    host.evaluate("() => window.__overrun.addPoints(300, 1)")
    check(bool(until(cl, "window.__overrun.ov.me.points >= 300", 6000)), 'client sees its points')
    cl.keyboard.press('e'); check(bool(until(cl, "!window.__overrun.inFP()", 6000)), 'client opens the tactical map')
    u = cl.evaluate("window.__overrun.ov.me.unit && { x: window.__overrun.ov.me.unit.x, y: window.__overrun.ov.me.unit.y }")
    spot = cl.evaluate("""([ux, uy]) => { const g = window.__game.g; for (let r = 90; r < 400; r += 20) for (let a = 0; a < 6.28; a += 0.4) { const x = ux + Math.cos(a) * r, y = uy + Math.sin(a) * r; const s = g.placementSpot('dart_monkey', { x, y }); if (s && g.canPlace('dart_monkey', s)) return { x, y }; } return null; }""", [u['x'], u['y']])
    cl.evaluate("([x, y]) => window.__overrun.place('dart_monkey', x, y)", [spot['x'], spot['y']])
    check(bool(until(host, "window.__overrun.state().towers.some((t) => t.owner === 1 && t.id === 'dart_monkey')", 8000)), "client's tower placed on the host (owner P2)")
    check(bool(until(cl, "window.__game.g.towers.some((t) => t.owner === 1)", 6000)), 'tower mirrored on the client')
    check(bool(until(cl, "window.__overrun.ov.me.points === 180", 6000)), 'client points spent (300 -> 180)')
    cl.click('#ov-fp'); until(cl, "window.__overrun.inFP()", 15000)
    # client falls -> its own monster picker
    host.evaluate("() => window.__overrun.killUnit(1)")
    check(bool(until(cl, "window.__overrun.screen().includes('turn')", 8000)), 'fallen client gets the monster picker')
    check(host.evaluate("window.__overrun.screen()") == '', 'host keeps playing (no picker on the host)')
    cl.click('.ov-pick[data-mon="charger"]')
    check(bool(until(host, "window.__overrun.state().players.find((p) => p.pid === 1).mon === 'charger'", 8000)), 'client monster choice reaches the host')
    check(bool(until(host, "(() => { const p = window.__overrun.state().players.find((p) => p.pid === 1); return p.role === 'turned' && p.enemy && p.enemy.id === 'charger'; })()", 10000)), 'client respawned as a Charger')
    check(bool(until(cl, "window.__overrun.inFP() && window.__possess.cur.state().kind === 'bug'", 30000)), 'client in first person as its turned monster')
    e0 = host.evaluate("window.__overrun.state().players.find((p) => p.pid === 1).enemy")
    cl.evaluate("() => window.__possess.cur.setMove(1, 0)"); time.sleep(1.5)
    time.sleep(1.5); cl.evaluate("() => window.__possess.cur.setMove(0, 0)")
    e1 = host.evaluate("window.__overrun.state().players.find((p) => p.pid === 1).enemy")
    check(e1 and abs(e1['x'] - e0['x']) + abs(e1['y'] - e0['y']) > 8, f"turned monster moves on the host ({e0['x']},{e0['y']} -> {e1['x']},{e1['y']})")
    check(bool(until(host, "(() => { const e = window.__overrun.ov.player(1).enemy; return e && e.manual && e.possessedBy === 1; })()", 6000)), 'host sees the client driving its monster')
    # timer win -> both screens
    host.evaluate("() => window.__overrun.setTime(1)")
    check(bool(until(host, "window.__overrun.state().phase === 'done'", 8000)), 'match ends on the timer')
    check(bool(until(cl, "window.__overrun.screen().includes('end')", 10000)), 'client shows the end screen')
    ht, ct = host.inner_text('#ov-screen'), cl.inner_text('#ov-screen')
    print('host:', ht.split('\n')[0], '| client:', ct.split('\n')[0], flush=True)
    check('You survived' in ht and 'survivors held out' in ct, 'end screen per player (survivor won / turned lost)')
    for b in procs: b.close()
print('errors:', errors[:5])
check(not [e for e in errors if 'WebGL' not in e], 'no page errors')
print('FAILS:', len(fails))
for f in fails: print('  -', f)
raise SystemExit(1 if fails else 0)
