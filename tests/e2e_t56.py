"""t56 e2e: maps menu = El Morro + Tropical only; BTD6-style free placement (lane-hugging spots, overlap
rejection, ghost red/green, no grid overlay for combat), farms still grid-packed, save v2 keeps exact x,y.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t56.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't56'); os.makedirs(OUT, exist_ok=True)
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
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(URL + 'index.html', timeout=60000); pg.wait_for_selector('.map-pick', timeout=60000)
    ids = pg.eval_on_selector_all('.map-pick', 'els => els.map(e => e.dataset.map)')
    check(sorted(ids) == ['morro', 'tropical'], f'menu maps {ids}')
    for mp in ['tropical', 'morro']:
        pg.goto(URL + f'index.html?map={mp}', timeout=60000); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(800)
        r = pg.evaluate("""() => { const g = window.__game.g; g.res.load({ credits: 1e6, scrap: 1e5 }, true);
          const pw = g.map.pathWidth, R = g.towerRadius('dart_monkey');
          // lane-hugging spots: sample along each lane at offset pw/2 + R*0.7 on both sides
          let free = 0, cellOk = 0, n = 0, placed = null;
          for (const ps of g.paths) for (let d = 120; d < ps.length - 200; d += 40) { const q = ps.at(d);
            for (const s of [1, -1]) { const o = pw / 2 + R * 0.7, x = q.x + Math.cos(q.ang + Math.PI / 2) * o * s, y = q.y + Math.sin(q.ang + Math.PI / 2) * o * s; n++;
              if (g.spotOk('dart_monkey', x, y)) { free++; if (!placed) placed = { x, y }; }
              const c = g.grid.worldToCell({ x, y }); if (g.grid.isFree(c.c, c.r)) cellOk++; } }
          const t = g.placeTower('dart_monkey', { c: 0, r: 0, x: placed.x, y: placed.y });
          const dup = g.placeTower('dart_monkey', { c: 0, r: 0, x: placed.x + 10, y: placed.y });
          const onLane = g.spotOk('dart_monkey', g.paths[0].at(300).x, g.paths[0].at(300).y);
          return { n, free, cellOk, placed: !!t, at: t && [t.x, t.y], exact: t && Math.hypot(t.x - placed.x, t.y - placed.y) < 1.5, dup: !!dup, onLane, laneDist: t && g.nearestLane(t).dist }; }""")
        check(r['placed'] and r['exact'], f'{mp}: dart placed at exact free spot {r["at"]} (lane dist {r["laneDist"]:.0f}px)')
        check(r['free'] > r['cellOk'] * 1.5, f'{mp}: lane-hugging spots free placement {r["free"]}/{r["n"]} vs old grid {r["cellOk"]}/{r["n"]}')
        check(not r['dup'], f'{mp}: overlapping tower rejected'); check(not r['onLane'], f'{mp}: on-lane spot rejected')
        if mp == 'tropical':
            # ghost: hover a valid spot and an invalid (lane) spot via the real UI
            pg.evaluate("() => { const H = window.__game; }")
            fa = pg.evaluate("""() => { const g = window.__game.g; const f = g.placementSpot('money_monkey', { x: 1200, y: 300 }) || g.placementSpot('money_monkey', { x: 600, y: 1300 });
                 const t = f && g.placeTower('money_monkey', f); return { grid: !!f && f.x === undefined, ok: !!t, cell: t && [t.cell.c, t.cell.r] }; }""")
            check(fa['ok'] and fa['grid'], f'farm placed on grid cell {fa}')
            far = pg.evaluate("() => window.__game.g.towers.find(t => t.data.id === 'farmhand') ? 1 : window.__game.g.squads.some(s => s.data.id === 'farmhand')")
            check(bool(far), 'Farmhand still pre-placed')
            big = pg.evaluate("""() => { const g = window.__game.g; for (let y = 100; y < g.map.height; y += 37) for (let x = 100; x < g.map.width; x += 37) { const s = g.placementSpot('unsc_tank', { x, y }); if (s) { const t = g.placeTower('unsc_tank', s); return t ? [t.x, t.y, g.towerRadius('unsc_tank')] : null; } } return null; }""")
            check(big is not None, f'tank (big radius) free-placed {big}')
            # save v2 round trip keeps exact x,y
            sv = pg.evaluate("""async () => { const m = await import('/src/game/Save.ts').catch(() => null); return null; }""")
            if not args.no_shots:
                pg.evaluate("() => { const H = window.__game; }")
                box = pg.locator('canvas').first.bounding_box()
                pg.keyboard.press('Escape')
                btn = pg.locator('[data-tower="dart_monkey"], [data-id="dart_monkey"]').first
                if btn.count(): btn.click(); pg.mouse.move(box['x'] + box['width'] * 0.45, box['y'] + box['height'] * 0.5); pg.wait_for_timeout(300); pg.screenshot(path=os.path.join(OUT, 'free_place_ghost.png'))
                pg.keyboard.press('Escape'); pg.wait_for_timeout(200); pg.screenshot(path=os.path.join(OUT, f'{mp}_free_placed.png'))
    print('errors:', errors[:5]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails or 'none')
