"""t55 e2e: El Morro gameplay scale, upgrade-delta tooltip, explosion FX, volume toggle + new SFX cues,
single-player save/resume round trip (Continue menu), incompatible save ignored.
Screenshots -> screenshots/t55/. Usage: /workspace/.venv-pw/bin/python tests/e2e_t55.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't55'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url.rstrip('/') + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name, clip=None):
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, name + '.png'), clip=clip)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    def goto(q=''):
        for i in range(3):
            try: pg.goto(URL + 'index.html' + q, timeout=60000); break
            except Exception as e: print('  retry goto', e)
    # --- El Morro scale
    goto('?map=morro'); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1500)
    m = G('({ w: H.g.map.width, h: H.g.map.height, mpp: H.g.map.mpp, cols: H.g.grid.cols, hq: [H.g.hq.x, H.g.hq.y] })')
    check(m['w'] == 4416 and abs(m['mpp'] - 0.125) < 1e-9 and m['cols'] == 92, f'morro world 2x at 0.125 m/px ({m})')
    G('H.camFocus && H.camFocus(2208, 1488, 0.25)'); pg.wait_for_timeout(600); shot(pg, 'morro_2d_after_e2e')
    # --- volume toggle
    v0 = pg.inner_text('#btn-sfx'); pg.click('#btn-sfx'); v1 = pg.inner_text('#btn-sfx')
    check(v0 == '🔉' and v1 == '🔊' and pg.evaluate("localStorage.getItem('bof.vol')") == '0.7', f'volume button cycles + saves ({v0}->{v1})')
    pg.click('#btn-sfx'); check(pg.inner_text('#btn-sfx') == '🔇' and pg.evaluate("localStorage.getItem('bof.vol')") == '0', 'mute step saved')
    pg.click('#btn-sfx'); pg.click('#btn-sfx')  # back to default 🔉
    # --- tropical: tooltip, FX, sfx cues, save
    pg.evaluate("localStorage.removeItem('bof.save')")
    goto('?map=tropical'); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1200)
    G('H.addCredits(20000)')
    cells = G("""(() => { const g = H.g, p = H.lanePoint(0, 0.4), out = [];
        for (const [c, r] of H.freeCells()) { const q = g.grid.cellCenter(c, r), d = Math.hypot(q.x - p.x, q.y - p.y); if (d > 70 && d < 260) out.push([c, r, d]); }
        out.sort((a, b) => a[2] - b[2]); const pick = []; for (const c of out) if (pick.every(q => Math.abs(q[0] - c[0]) > 1 || Math.abs(q[1] - c[1]) > 1)) { pick.push(c); if (pick.length === 3) break; } return pick; })()""")
    ids = ['dart_monkey', 'sniper_monkey', 'dart_monkey']
    for (c, r, _), tid in zip(cells, ids): G(f'H.placeTower("{tid}", {c}, {r})')
    G('H.g.towers[0].upgrade(H.g); H.g.towers[0].upgrade(H.g); H.g.towers[1].upgrade(H.g); H.g.towers[2].targeting = H.g.towers[2].targeting === "strong" ? "last" : "strong"')
    G('H.selectTower(2)'); pg.wait_for_selector('#sp-up', state='attached', timeout=5000); pg.locator('#sp-up').scroll_into_view_if_needed(); pg.hover('#sp-up'); pg.wait_for_timeout(400)
    tip = pg.get_attribute('#sp-up', 'title') or ''; chips = pg.locator('#sp-up .delta i.up').count()
    check('→' in tip and chips >= 1, f'upgrade tooltip with stat deltas ({tip[:60]}…, {chips} + chips)')
    box = pg.locator('#sel-panel').bounding_box() or pg.locator('#sp-up').bounding_box()
    shot(pg, 'upgrade_tooltip', clip={'x': max(0, box['x'] - 10), 'y': max(0, box['y'] - 10), 'width': min(560, box['width'] + 20), 'height': min(700, box['height'] + 20)})
    G('H.setSpeed(0)'); G('(() => { const p = H.lanePoint(0, 0.45); H.camFocus(p.x, p.y, 1.4); for (let i = 0; i < 3; i++) H.g.fx({ kind: i ? "boom_fire" : "boom", x: p.x + i * 50 - 50, y: p.y + (i % 2) * 30, r: 60 + i * 10, dur: 0.6 }); for (const e of H.g.effects) e.t = 0.12; })()')
    pg.wait_for_timeout(250); shot(pg, 'explosion_fx'); G('H.setSpeed(1)')
    G('H.startWave()'); pg.wait_for_timeout(500)
    check((G('H.sfxCount ? H.sfxCount() : {}') or {}).get('wave', 0) >= 1, 'wave-start SFX cue fired')
    G('H.g.waves.active = false; H.g.enemies.length = 0; H.g.waves.skipTo(6)'); G('H.g.res.load({ credits: 4321, scrap: 77 }, true); H.g.hq.health.hp = 150')
    G('H.g.deployCd = {}'); G('H.deploy("marine", H.g.hq.x - 120, H.g.hq.y + 60)')
    before = G('H.save()')
    check(before['wave'] == 5 and len(before['towers']) == 3 and before['credits'] == G('Math.floor(H.g.res.credits)'), f'snapshot: wave {before["wave"]+1}, {len(before["towers"])} towers, ¢{before["credits"]}, {len(before["squads"])} squads')
    # --- reload: Continue menu
    goto(''); pg.wait_for_selector('#btn-continue', timeout=30000); pg.wait_for_timeout(600)
    txt = pg.inner_text('#continue-box'); check('Wave 6' in txt and 'single player only' in txt, f'Continue menu: {txt.splitlines()[0][:80]}')
    shot(pg, 'continue_menu')
    pg.click('#btn-continue'); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1200)
    after = G('H.g.towers.map(t => [t.data.id, t.cell.c, t.cell.r, t.tier, t.targeting])')
    exp = [[t['id'], t['c'], t['r'], t['tier'], t['tg']] for t in before['towers']]
    check(after == exp, f'towers + tiers + targeting restored {after}')
    st = G('({ wave: H.g.waves.index, cr: Math.floor(H.g.res.credits), hq: Math.ceil(H.g.hq.health.hp), sq: H.g.squads.filter(s => s.alive).map(s => s.data.id).sort(), map: H.g.map.id })')
    check(st['wave'] == 5 and st['cr'] == before['credits'] and st['hq'] == 150 and st['map'] == 'tropical', f'wave/credits/HQ/map restored {st}')
    check(st['sq'] == sorted(s['id'] for s in before['squads']), f'squads restored (incl. the pre-placed Farmhand, no duplicate) {st["sq"]}')
    # --- incompatible save ignored
    goto(''); pg.wait_for_selector('#maps .map-pick', timeout=30000)  # leave the match first (its pagehide autosaves)
    pg.evaluate("localStorage.setItem('bof.save', JSON.stringify({ v: 0, map: 'tropical' }))")
    goto(''); pg.wait_for_selector('#maps .map-pick', timeout=30000); pg.wait_for_timeout(500)
    check(pg.locator('#btn-continue').count() == 0 and pg.evaluate("localStorage.getItem('bof.save')") is None, 'old/incompatible save ignored and cleared')
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails or 'none')
