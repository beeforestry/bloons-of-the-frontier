"""t101 e2e: first-person audio. Per-weapon report for your own gun (Marksman scope rifle, ODST SMG,
Raider chaingun, Scorpion cannon), scope-in click, hit tick + kill confirm, footsteps on foot, and the
vehicle engine loop that starts when you board a parked vehicle and stops when you step out / leave.
Counts come from the fpAudio hook (window.__game.fpSfx()); `played` proves WebAudio actually synthesized.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t101.py [--url URL] [--tag local] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't101'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url.rstrip('/') + '/index.html'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
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
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 1440, 'height': 860}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    F = lambda: G('H.fpSfx()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=150); return True
        except Exception: return False
    def exit_fp():
        P('P && P.exit()'); pg.wait_for_timeout(800)

    pg.goto(URL + '?map=morro&diff=medium&fpq=low', timeout=90000); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1000)
    pg.mouse.click(5, 5); pg.keyboard.press('Shift'); pg.wait_for_timeout(300)  # user gesture -> WebAudio unlock
    # ---------------------------------------------------------- Marksman Scout tower: scope click, rifle report, hit + kill
    placed = G("""(() => { const g = H.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true); g.paused = false;
      let ax = 0, ay = 0, best = 1e9;
      for (let y = 80; y < g.map.height; y += 24) for (let x = 80; x < g.map.width; x += 24) {
        if (g.isWaterAt(x, y) || !g.grid.isLandAt(x, y)) continue; const nl = g.nearestLane({ x, y });
        if (nl.dist > 50 && nl.dist < 130 && nl.dist < best) { best = nl.dist; ax = x; ay = y; } }
      let t = null; for (let r = 0; r < 300 && !t; r += 12) for (let a = 0; a < 16 && !t; a++) { const x = ax + Math.cos(a / 8 * Math.PI) * r, y = ay + Math.sin(a / 8 * Math.PI) * r;
        if (g.isWaterAt(x, y)) continue; const s = g.placementSpot('sniper_monkey', { x, y }); if (s) t = g.placeTower('sniper_monkey', s); }
      if (!t) return null; const nl = g.nearestLane(t);
      for (let i = 0; i < 8; i++) { const e = g.spawnEnemy('red', Math.max(20, nl.d - 30 + i * 10), (i % 3 - 1) * 8, nl.lane, 1); e.speedK = 0.03; }
      return { i: g.towers.indexOf(t), x: t.x, y: t.y }; })()""")
    print('  sniper', placed)
    check(placed is not None, 'Marksman Scout placed near a lane')
    G(f'H.selectTower({placed["i"]})'); pg.wait_for_timeout(300); pg.click('#sp-possess')
    check(until('window.__possess && window.__possess.cur', 30000), 'possessed the Marksman Scout'); pg.wait_for_timeout(3000)
    check(P('P.state().weaponSfx') == 'marksman', 'sniper uses the marksman report')
    pg.keyboard.down('Shift'); pg.wait_for_timeout(700); f = F(); pg.keyboard.up('Shift'); pg.wait_for_timeout(500)
    check(f.get('scope', 0) >= 1, f"scope-in click on ADS ({f.get('scope', 0)})")
    for _ in range(12):
        for _ in range(6): P('P.aimNearest()'); pg.wait_for_timeout(150)
        print('   aim', P('({ target: P.state().target, n: H.g.enemies.filter(e => e.alive).length, hits: P.hits, shots: P.shots })'))
        P('P.setFire(true)'); 
        for _ in range(8): P('P.aimNearest()'); pg.wait_for_timeout(150)
        P('P.setFire(false)')
        if P('P.state().kills') > 0: break
    s, f = P('P.state()'), F(); print('  sniper state', {k: s[k] for k in ('shots', 'hits', 'kills', 'sfx')}, f)
    check(s['shots'] > 0 and f.get('marksman', 0) >= 1, f"marksman shots heard ({f.get('marksman', 0)} for {s['shots']} shots)")
    check(f.get('hit', 0) >= 1 and s['hits'] >= 1, f"hit tick ({f.get('hit', 0)})")
    check(f.get('kill', 0) >= 1 and s['kills'] >= 1, f"kill confirm ({f.get('kill', 0)})")
    check(f.get('played', 0) >= 3, f"WebAudio actually synthesized the cues (played={f.get('played', 0)})")
    shot(pg, 'fp_sniper')
    exit_fp()
    # ---------------------------------------------------------- ODST on foot: SMG report + footsteps; parked vehicles: engine loop
    G('H.sandbox(); H.addCredits(90000)'); G('H.g.deployCd = {}'); G('H.deploy("odst", 1700, 1500)'); pg.wait_for_timeout(1200)
    G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
    check(until('window.__possess && window.__possess.cur && window.__possess.cur.vm.fort', 60000), 'possessed an ODST on El Morro')
    P('P.obj.x = 1700; P.obj.y = 1500'); pg.wait_for_timeout(2500)
    check(P('P.state().weaponSfx') == 'smg', f"ODST uses the SMG report ({P('P.state().weaponSfx')})")
    st0 = F().get('step', 0)
    # footsteps follow the walk bob in game time, so poll (headless swiftshader can run at a few fps under load)
    pg.keyboard.down('w')
    for _ in range(40):
        pg.wait_for_timeout(500)
        if P('P.state().steps') >= 3: break
    pg.keyboard.up('w'); pg.wait_for_timeout(300)
    s, f = P('P.state()'), F()
    check(s['steps'] >= 3 and f.get('step', 0) - st0 >= 3, f"footsteps while walking ({s['steps']})")
    check(not s['engine'] and f['engine'] == 0, 'no engine on foot')
    P('P.setFire(true)')
    for _ in range(20):
        pg.wait_for_timeout(300)
        if F().get('smg', 0) >= 1: break
    P('P.setFire(false)'); pg.wait_for_timeout(200)
    check(F().get('smg', 0) >= 1, f"ODST SMG report heard ({F().get('smg', 0)})")
    for kind, want, heavy in (('warthog', 'chaingun', 1), ('scorpion', 'cannon', 2)):
        pv = G(f'H.g.parked.find(p => p.kind === "{kind}")')
        if not pv: check(False, f'parked {kind} exists'); continue
        P(f'P.obj.x = {pv["x"] - 22}; P.obj.y = {pv["y"] + 14}'); pg.wait_for_timeout(1000)
        pg.keyboard.press('f'); pg.wait_for_timeout(1500)
        s, f = P('P.state()'), F()
        check(s['veh'] and s['unitId'] == kind, f'boarded the parked {kind}')
        check(s['engine'] and f['engine'] == heavy and f['level'] > 0, f"{kind}: engine loop running (kind {f['engine']}, level {f['level']})")
        check(s['weaponSfx'] == want, f"{kind}: weapon report is {s['weaponSfx']} (want {want})")
        st0 = F().get('step', 0); pg.keyboard.down('w'); pg.wait_for_timeout(1500); f = F(); pg.keyboard.up('w')
        check(f['level'] > 0 and f.get('step', 0) == st0, f"{kind}: revs while driving, no footsteps (level {f['level']})")
        shot(pg, f'fp_{kind}')
        pg.keyboard.press('f'); pg.wait_for_timeout(1200)
        s, f = P('P.state()'), F()
        check(not s['veh'] and not s['engine'] and f['engine'] == 0, f'{kind}: stepped out, engine stopped')
    exit_fp()
    check(F()['engine'] == 0, 'engine off after leaving first person')
    errs = [e for e in errors]
    check(not errs, f'no console errors ({errs[:3]})')
    b.close()
print('RESULT', 'PASS' if not fails else f'FAIL {len(fails)}: {fails}', flush=True)
raise SystemExit(1 if fails else 0)
