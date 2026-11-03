"""t45 e2e: Glue Slinger acid delivery per tier (vial / spray / canister), splash + pools.
Screenshots -> screenshots/t45/.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t45.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't45'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, name + '.png'))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    pg.goto(URL + sep + 'map=fortress'); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(400); G('H.sandbox(); H.addCredits(90000)')
    want = ['acid_vial', 'acid_spray', 'acid_can']; crops = []
    for tier in range(3):
        setup = G(f"""(() => {{ const g = H.g; g.enemies.forEach(e => e.alive = false); g.towers.slice().forEach(t => g.sellTower(t)); g.acidPools.length = 0;
          for (let f = 0.25; f < 0.8; f += 0.01) {{ const p = H.lanePoint(0, f);
            for (let r = 1; r < g.grid.rows - 1; r++) for (let c = 1; c < g.grid.cols - 1; c++) {{ if (!g.grid.fits(c, r, 1)) continue; const q = g.grid.cellCenter(c, r), d = Math.hypot(q.x - p.x, q.y - p.y);
              if (d > 95 && d < 135 && H.placeTower('glue_slinger', c, r)) {{ const t = g.towers[g.towers.length - 1]; for (let i = 0; i < {tier}; i++) t.upgrade(g);
                const ids = [-0.003, 0, 0.003, 0.006].map(df => H.spawn('red', 0, f + df, 60)); g.enemies.filter(e => ids.includes(e.uid)).forEach(e => e.speedK = 0);
                return {{ ids, tier: t.tier, x: t.x, y: t.y, px: p.x, py: p.y }}; }} }} }} return null; }})()""")
        if not setup: check(False, f'T{tier+1} setup'); continue
        ids = setup['ids']; hp0 = G(f'H.g.enemies.filter(e => {ids}.includes(e.uid)).map(e => e.hp)')
        G(f'H.camFocus({(setup["x"] + setup["px"]) / 2}, {(setup["y"] + setup["py"]) / 2} - 20, 2.2)')
        pg.wait_for_timeout(1300); seen = set(); shot_taken = False
        for _ in range(40):
            ks = G('H.g.projectiles.filter(p => p.alive).map(p => p.o.kind + ":" + Math.round(p.height))'); seen.update(k.split(':')[0] for k in ks)
            if not shot_taken and any(k.startswith(want[tier]) and (tier == 1 or int(k.split(':')[1]) > 25) for k in ks):
                path = f'/tmp/t45_tier{tier}.png'; pg.screenshot(path=path); crops.append(path); shot_taken = True
            pg.wait_for_timeout(100)
        pg.wait_for_timeout(600)
        hp1 = G(f'H.g.enemies.filter(e => {ids}.includes(e.uid)).map(e => e.alive ? e.hp : 0)')
        hurt = sum(1 for a, b2 in zip(hp0, hp1) if b2 < a)
        pools = G('H.g.acidPools.length')
        check(setup['tier'] == tier, f'Glue Slinger at tier {tier+1}')
        check(want[tier] in seen and not (seen - {want[tier]}), f'T{tier+1} fires {want[tier]} only (seen {sorted(seen)})')
        check(hurt >= 2, f'T{tier+1} acid splash hit {hurt}/4 clustered balloons')
        check(pools >= 1, f'T{tier+1} leaves a corrosive pool ({pools})')
        check(shot_taken, f'T{tier+1} captured mid-shot')
    if crops and not args.no_shots:
        from PIL import Image, ImageDraw
        ims = [Image.open(c).crop((400, 180, 1200, 780)) for c in crops]; sheet = Image.new('RGB', (800 * len(ims), 640), (20, 24, 20)); d = ImageDraw.Draw(sheet)
        for i, im in enumerate(ims): sheet.paste(im, (800 * i, 40)); d.text((800 * i + 12, 12), ['T1 Glue Slinger - slingshot acid vial (lob, shatter, puddle)', 'T2 Corrosive Glue - acid sprayer 3-jet stream', 'T3 Bloon Dissolver - hazmat cannon acid canister'][i], fill=(220, 255, 160))
        sheet.save(os.path.join(OUT, 'glue_acid_tiers.png'))
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
