"""t32 collector e2e (+ legacy t28 header): tutorial, difficulty select, build-panel toggle (H), Hypno-Shroom conversions, bosses + phases + boss bar,
wave preview + 1x/2x/4x speed, Hard -> wave 100 Hive Leviathan final boss, victory -> Freeplay, voice lines, orb hover,
new roster, El Morro garitas, mobile with the panel hidden. Screenshots -> screenshots/t28/.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t28.py [--map garden|jungle|fortress|morro]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--map', default='garden'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't28'); os.makedirs(OUT, exist_ok=True)
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
def attach(pg):
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
def mk(pg):
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=10000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    return G, until
def shot(pg, name, **kw): pg.screenshot(path=os.path.join(OUT, name + '.png'), **kw)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page(); attach(pg)
    pg.goto(URL + f'?map={M}'); pg.wait_for_function('window.__game')
    G, until = mk(pg)
    G('H.addCredits(5000)')
    hq = G('({x: H.g.hq.x, y: H.g.hq.y})')
    check(G(f'H.deploy("farmhand", {hq["x"]} - 220, {hq["y"]} + 40)'), 'collector (Farmhand) deployed')
    until('H.g.workers().length === 1 && H.g.workers()[0].dropT <= 0', 5000)
    G('H.g.deployCd = {}')
    check(not G(f'H.deploy("farmhand", {hq["x"]} - 260, {hq["y"]} + 60)'), 'second collector refused (cap 1 per player)')
    check(G('H.g.workers().length') == 1 and not G('H.g.canDeploy("farmhand")'), 'exactly 1 collector, deploy button disabled')
    pg.wait_for_timeout(400)
    txt = pg.locator('#troop-bar').inner_text()
    check('(1/1)' in txt, 'troop bar shows the collector as 1/1')
    # ---- global pickup: drops in the four far corners of the map all bank at FULL value
    W, Hh = G('H.g.map.width'), G('H.g.map.height')
    c0, e0, s0 = G('H.g.res.credits'), G('H.g.energy'), G('H.g.res.scrap')
    G('H.g.energy = 0'); e0 = 0
    pts = [(60, 60, 30, 'credit'), (W - 60, 60, 10, 'orb'), (60, Hh - 60, 15, 'scrap'), (W - 60, Hh - 60, 30, 'credit'), (W / 2, Hh / 2, 15, 'scrap')]
    for x, y, v, k in pts: G(f'H.spawnPickup({x}, {y}, {v}, "{k}")')
    G('H.setSpeed(4)')
    check(until('H.g.pickups.length === 0', 30000), f'collector vacuumed every pickup on the whole map (left {G("H.g.pickups.length")})')
    pg.wait_for_timeout(200)
    G('H.setSpeed(1)')
    dc, de, ds = G('H.g.res.credits') - c0, G('H.g.energy') - e0, G('H.g.res.scrap') - s0
    check(dc >= 60 and de >= 10 and ds >= 30, f'all banked at full rate (+{dc}c, +{de:.0f} energy, +{ds} scrap)')
    check(G('H.g.stats.pickups.auto || 0') == 0, 'no pickup fell back to the lossy auto-collect')
    # ---- vacuum screenshot
    G(f'H.focus && H.focus({hq["x"]} - 300, {hq["y"]}, 1.2)')
    for i in range(10): G(f'H.spawnPickup({hq["x"]} - 700 + {i} * 40, {hq["y"]} - 200 + {i} * 30, 10, "{["credit", "orb", "scrap"][i % 3]}")')
    pg.wait_for_timeout(1700); shot(pg, f'collector_vacuum_{M}')
    # ---- immunity / untargetable
    w = G('(() => { const w = H.g.workers()[0]; return { x: w.x, y: w.y, hp: w.health.hp, max: w.health.max }; })()')
    G(f'H.g.hurtFriendlies({w["x"]}, {w["y"]}, 400, 99999)')
    G('H.g.workers()[0].takeDamage(H.g, 99999)')
    check(G('H.g.workers()[0].health.hp') == w['hp'] and G('H.g.workers()[0].alive'), 'collector immune to AoE / direct damage')
    nf = G(f'(() => {{ const f = H.g.nearestFriendly({{x: {w["x"]}, y: {w["y"]}}}, 60); return f ? (f.isWorker ? "worker" : "other") : "none"; }})()')
    check(nf != 'worker', f'enemies never pick the collector as a target ({nf})')
    G('H.addEnergy(100); H.g.powerCd = {}')
    G(f'H.g.castPower("mac", {{x: {w["x"]}, y: {w["y"]}}})'); pg.wait_for_timeout(2500)
    check(G('H.g.workers()[0].alive') and G('H.g.workers()[0].health.hp') == w['hp'], 'MAC Blast on the collector leaves it untouched')
    # bugs walk past it (no blocking) and a phase-2 boss never hits it
    uid = G('H.spawn("boss_scarab", 0, 0.5)')
    G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {uid}); const wk = H.g.workers()[0]; wk.x = e.x + 20; wk.y = e.y; e.bossPhase = 2; for (let i = 0; i < 12; i++) H.g.bossAttack(e); H.g.stompUnits(e, 9999); return 1; }})()')
    blk = G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {uid}); const b = H.g.findBlocker(e); return b && b.isWorker ? 1 : 0; }})()')
    check(blk == 0, 'collector never blocks / gets grabbed by enemies')
    pg.wait_for_timeout(600)
    check(G('H.g.workers()[0].alive') and G('H.g.workers()[0].health.hp') == w['hp'], 'boss laser sweeps / smashes / stomps skip the collector')
    print(f'console errors: {len(errors)} {errors[:3]}')
    check(not errors, 'zero console errors')
    b.close()
print(f'RESULT {M}: {"PASS" if not fails else "FAIL"} ({len(fails)} failed checks)')
for f in fails: print('  FAIL ' + f)
