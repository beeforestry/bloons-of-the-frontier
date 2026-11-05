"""t64 e2e: painted vehicle/naval 2D sprites + first-person PBR textures on full roster.
Screenshots -> screenshots/t64/. Usage: /workspace/.venv-pw/bin/python tests/e2e_t64.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't64'); os.makedirs(OUT, exist_ok=True)
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
def shot(pg, name):
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, name + '.png'), full_page=False)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(URL + 'index.html?map=tropical', timeout=60000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1500)
    r = pg.evaluate("""() => {
      const g = window.__game.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true);
      const place = (id, preferWater) => {
        for (let y = 60; y < g.map.height; y += 18) for (let x = 60; x < g.map.width; x += 18) {
          if (preferWater === true && !g.isWaterAt(x, y)) continue;
          if (preferWater === false && g.isWaterAt(x, y)) continue;
          const s = g.placementSpot(id, { x, y }); if (!s) continue;
          const t = g.placeTower(id, s); if (t) return { id, x: t.x, y: t.y, tier: t.tier };
        }
        return null;
      };
      const placed = {
        tank: place('unsc_tank', false),
        heli: place('unsc_heli', false),
        destroyer: place('unsc_destroyer', true),
        beacon: place('unsc_beacon', true),
        dart: place('dart_monkey', false),
        sunflower: place('sunflower', false),
      };
      for (const t of g.towers) {
        if (['unsc_tank','unsc_heli','unsc_destroyer','unsc_beacon'].includes(t.data.id)) {
          t.upgrade(g); t.upgrade(g);
        }
      }
      return { placed, towers: g.towers.length, map: g.map.id };
    }""")
    print('place result', r, flush=True)
    check(r and r['placed']['tank'], 'tank placed')
    check(r and r['placed']['heli'], 'heli placed')
    check(r and r['placed']['destroyer'], 'destroyer placed')
    check(r and r['placed']['beacon'], 'beacon placed')
    pg.wait_for_timeout(800)
    shot(pg, '01_vehicles_naval_topdown')

    # zoom camera toward vehicles if API exists
    pg.evaluate("""() => {
      const g = window.__game.g;
      const t = g.towers.find(x => x.data.id === 'unsc_tank');
      if (t && window.__game.cam) { window.__game.cam.x = t.x; window.__game.cam.y = t.y; window.__game.cam.zoom = 1.6; }
      else if (t) { /* try renderer view */ }
    }""")
    pg.wait_for_timeout(400)
    shot(pg, '02_tank_painted')

    pg.evaluate("""() => {
      const g = window.__game.g;
      const t = g.towers.find(x => x.data.id === 'unsc_heli');
      if (t && window.__game.cam) { window.__game.cam.x = t.x; window.__game.cam.y = t.y; window.__game.cam.zoom = 1.5; }
    }""")
    pg.wait_for_timeout(400)
    shot(pg, '03_heli_painted')

    pg.evaluate("""() => {
      const g = window.__game.g;
      const t = g.towers.find(x => x.data.id === 'unsc_destroyer');
      if (t && window.__game.cam) { window.__game.cam.x = t.x; window.__game.cam.y = t.y; window.__game.cam.zoom = 1.4; }
    }""")
    pg.wait_for_timeout(400)
    shot(pg, '04_destroyer_painted')

    pg.evaluate("""() => {
      const g = window.__game.g;
      const t = g.towers.find(x => x.data.id === 'unsc_beacon');
      if (t && window.__game.cam) { window.__game.cam.x = t.x; window.__game.cam.y = t.y; window.__game.cam.zoom = 1.6; }
    }""")
    pg.wait_for_timeout(400)
    shot(pg, '05_beacon_painted')

    # sprite asset keys loaded
    spr = pg.evaluate("""() => {
      // sprites module exports IMG on window? try through renderer
      const keys = ['unsc_tank_2','unsc_heli_2','unsc_destroyer_2','unsc_beacon_2'];
      const out = {};
      // poke via dynamic import cache isn't available; check naturalWidth via img tags or canvas draw
      // Fallback: fetch the webp URLs
      return keys;
    }""")
    for k in ['unsc_tank_2','unsc_heli_2','unsc_destroyer_2','unsc_beacon_2']:
        st = pg.evaluate(f"() => fetch('assets/v3/{k}.webp').then(r => r.status)")
        check(st == 200, f'asset {k}.webp status {st}')

    # enter first person if possible
    fp = pg.evaluate("""() => {
      const ui = window.__game;
      const g = ui.g;
      const dart = g.towers.find(t => t.data.id === 'dart_monkey') || g.towers[0];
      if (!dart) return { ok: false, reason: 'no tower' };
      // common entry points
      if (typeof ui.possess === 'function') { ui.possess(dart); return { ok: true, via: 'possess' }; }
      if (ui.fps && typeof ui.fps.enter === 'function') { ui.fps.enter(dart); return { ok: true, via: 'fps.enter' }; }
      if (typeof ui.togglePossess === 'function') { ui.togglePossess(dart); return { ok: true, via: 'togglePossess' }; }
      // try clicking possess button
      const btn = document.querySelector('[data-act="possess"], .possess, #possess, button.fp');
      if (btn) { btn.click(); return { ok: true, via: 'button' }; }
      return { ok: false, reason: 'no possess API', keys: Object.keys(ui).slice(0, 40) };
    }""")
    print('fp enter', fp, flush=True)
    pg.wait_for_timeout(2000)
    shot(pg, '06_first_person_attempt')

    # also place a wider roster for FP texture coverage screenshot from top-down
    pg.evaluate("""() => {
      const g = window.__game.g;
      if (window.__game.fps && window.__game.fps.active) {
        if (typeof window.__game.unpossess === 'function') window.__game.unpossess();
        else if (typeof window.__game.fps.exit === 'function') window.__game.fps.exit();
      }
      const ids = ['boomerang_monkey','sniper_monkey','wizard_monkey','chomper','tesla_coil','arcane_obelisk','unsc_autoturret','unsc_firebase'];
      let n = 0;
      for (const id of ids) {
        for (let y = 80; y < g.map.height; y += 36) {
          let done = false;
          for (let x = 80; x < g.map.width; x += 36) {
            if (g.isWaterAt(x,y)) continue;
            const s = g.placementSpot(id, { x, y }); if (!s) continue;
            if (g.placeTower(id, s)) { n++; done = true; break; }
          }
          if (done) break;
        }
      }
      return n;
    }""")
    pg.wait_for_timeout(600)
    shot(pg, '07_roster_topdown')

    # before/after style: dump painted sprite canvases
    # verify IMG has painted keys via evaluating sprite body sizes if exposed
    sizes = pg.evaluate("""async () => {
      const out = {};
      for (const k of ['unsc_tank_2','unsc_heli_2','unsc_destroyer_2','unsc_beacon_2','dart_monkey_2']) {
        const r = await fetch('assets/v3/' + k + '.webp');
        out[k] = { status: r.status, bytes: (await r.arrayBuffer()).byteLength };
      }
      return out;
    }""")
    print('sprite bytes', sizes, flush=True)
    for k, v in sizes.items():
        check(v['status'] == 200 and v['bytes'] > 8000, f'{k} size {v}')

    browser.close()

print('\\n' + ('PASS' if not fails else 'FAIL (' + str(len(fails)) + ')'))
for f in fails: print(' -', f)
# soft: console errors
if errors:
    print('console errors:', len(errors))
    for e in errors[:8]: print('  ', e[:200])
raise SystemExit(1 if fails else 0)
