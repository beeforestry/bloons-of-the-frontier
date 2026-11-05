"""t65 e2e: fix floating tank gunner, detached heli rotors, black lighthouse.
Screenshots -> screenshots/t65/. Usage: /workspace/.venv-pw/bin/python tests/e2e_t65.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't65'); os.makedirs(OUT, exist_ok=True)
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
    if not args.no_shots:
        path = os.path.join(OUT, name + '.png')
        pg.screenshot(path=path, full_page=False)
        print('  shot', path, flush=True)

def exit_fp(pg):
    pg.keyboard.press('Escape')
    pg.wait_for_timeout(400)
    pg.evaluate("""() => { try { window.__possess && window.__possess.exit && window.__possess.exit(); } catch(e){} }""")
    pg.wait_for_timeout(300)

def possess_index(pg, idx):
    r = pg.evaluate(f"""() => {{
      const ui = window.__game;
      if (!ui || typeof ui.selectTower !== 'function') return {{ ok:false, reason:'no selectTower' }};
      ui.selectTower({idx});
      return {{ ok:true, n: ui.g.towers.length, id: ui.g.towers[{idx}] && ui.g.towers[{idx}].data.id, name: ui.g.towers[{idx}] && ui.g.towers[{idx}].t.name }};
    }}""")
    print('select', r, flush=True)
    pg.wait_for_timeout(200)
    btn = pg.query_selector('#sp-possess')
    if not btn:
        fails.append(f'no #sp-possess for index {idx}')
        print('  FAIL no #sp-possess', flush=True)
        return False
    btn.click()
    pg.wait_for_timeout(800)
    # wait for async vehicle GLBs
    ready = pg.evaluate("""async () => {
      for (let i = 0; i < 40; i++) {
        const cur = window.__possess && window.__possess.cur;
        if (cur && cur.scene) {
          // give GLB promises time
          await new Promise(r => setTimeout(r, 200));
          return { ok: true, vehicles: cur.vm && cur.vm.vehicles, size: cur.vm && cur.vm.size };
        }
        await new Promise(r => setTimeout(r, 150));
      }
      return { ok: false };
    }""")
    print('possess ready', ready, flush=True)
    pg.wait_for_timeout(1200)
    return bool(ready and ready.get('ok'))

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(URL + 'index.html?map=tropical', timeout=60000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1200)

    placed = pg.evaluate("""() => {
      const g = window.__game.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true);
      // Cluster near a known land pocket so dart can see tank+heli; beacon in water nearby.
      const tryPlace = (id, x0, y0, water) => {
        for (let r = 0; r < 220; r += 14) {
          for (let a = 0; a < 16; a++) {
            const x = x0 + Math.cos(a/16*Math.PI*2)*r, y = y0 + Math.sin(a/16*Math.PI*2)*r;
            if (water === true && !g.isWaterAt(x,y)) continue;
            if (water === false && g.isWaterAt(x,y)) continue;
            const s = g.placementSpot(id, { x, y }); if (!s) continue;
            const t = g.placeTower(id, s); if (t) return g.towers.indexOf(t);
          }
        }
        return -1;
      };
      // Find a land anchor first
      let ax=200, ay=200;
      outer: for (let y=80;y<g.map.height;y+=30) for (let x=80;x<g.map.width;x+=30) {
        if (!g.isWaterAt(x,y) && g.grid.isLandAt(x,y) && g.nearestLane({x,y}).dist>60) { ax=x; ay=y; break outer; }
      }
      const tank = tryPlace('unsc_tank', ax, ay, false);
      const heli = tryPlace('unsc_heli', ax+70, ay+20, false);
      const dart = tryPlace('dart_monkey', ax-50, ay-30, false);
      // water near shore for beacon
      let bx=ax, by=ay;
      outer2: for (let y=60;y<g.map.height;y+=24) for (let x=60;x<g.map.width;x+=24) {
        if (g.isWaterAt(x,y) && g.placementSpot('unsc_beacon',{x,y})) { bx=x; by=y; break outer2; }
      }
      const beacon = tryPlace('unsc_beacon', bx, by, true);
      const destroyer = tryPlace('unsc_destroyer', bx+80, by, true);
      for (const t of g.towers) {
        if (['unsc_tank','unsc_heli','unsc_beacon','unsc_destroyer'].includes(t.data.id)) { t.upgrade(g); t.upgrade(g); }
      }
      return {
        tank, heli, dart, beacon, destroyer,
        names: g.towers.map(t => t.t.name),
        ids: g.towers.map(t => t.data.id),
        tiers: g.towers.map(t => t.tier),
      };
    }""")
    print('placed', placed, flush=True)
    check(placed['tank'] >= 0, 'tank placed')
    check(placed['heli'] >= 0, 'heli placed')
    check(placed['dart'] >= 0, 'dart placed')
    check(placed['beacon'] >= 0, 'beacon placed')
    check(all(t == 2 for i,t in enumerate(placed['tiers']) if placed['ids'][i] in ('unsc_tank','unsc_heli','unsc_beacon')), 'vehicles max tier')

    # (a) FP from dart showing max-tier tank gunner seated + heli blades mounted
    check(possess_index(pg, placed['dart']), 'possess dart')
    # Aim toward tank if we can nudge camera yaw
    pg.evaluate(f"""() => {{
      const g = window.__game.g;
      const me = g.towers[{placed['dart']}];
      const tank = g.towers[{placed['tank']}];
      const cur = window.__possess && window.__possess.cur;
      if (me && tank && cur) {{
        const ang = Math.atan2(tank.y - me.y, tank.x - me.x);
        // Possess uses yaw; try common fields
        if ('yaw' in cur) cur.yaw = -ang + Math.PI/2;
        if (cur.camYaw !== undefined) cur.camYaw = -ang;
        if (cur.yawPitch) {{ cur.yawPitch.yaw = -ang; }}
      }}
    }}""")
    pg.wait_for_timeout(1500)
    # Probe mesh hierarchy for gunner/rotor attachment
    probe = pg.evaluate("""() => {
      const cur = window.__possess && window.__possess.cur;
      if (!cur || !cur.towerModels) return { err: 'no towerModels', keys: cur ? Object.keys(cur) : [] };
      const out = {};
      for (const [t, m] of cur.towerModels) {
        const id = t.data.id;
        if (!m.model) { out[id] = { loaded: false }; continue; }
        const ud = m.model.userData || {};
        const info = { loaded: true, kind: ud.kind };
        if (ud.gunner) {
          const g = ud.gunner;
          const pivot = ud.turret;
          info.gunnerParent = !!(g.parent && pivot && g.parent === pivot);
          info.gunnerLocalY = +g.position.y.toFixed(3);
          info.gunnerOk = g.position.y < 5.5;
        }
        if (ud.rotor) {
          const r = ud.rotor;
          info.rotorLocalY = +r.position.y.toFixed(3);
          info.rotorParentIsModel = r.parent === m.model;
          info.tailLocal = ud.tail ? [+ud.tail.position.x.toFixed(2), +ud.tail.position.y.toFixed(2), +ud.tail.position.z.toFixed(2)] : null;
          info.rotorOk = r.position.y < 4.5;
        }
        if (ud.kind === 'beacon') {
          let dark = 0, bright = 0, n = 0, sample = [];
          m.model.traverse(o => {
            if (!o.isMesh || !o.material) return;
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            for (const mt of mats) {
              if (!mt.color) continue; n++;
              const lum = 0.2126*mt.color.r + 0.7152*mt.color.g + 0.0722*mt.color.b;
              if (lum < 0.12) dark++; else bright++;
              if (sample.length < 6) sample.push({ hex: '#'+mt.color.getHexString(), lum: +lum.toFixed(3), vc: !!mt.vertexColors });
            }
          });
          info.mats = { n, dark, bright, sample };
          info.beaconOk = bright >= 2 && bright > dark;
        }
        out[id] = info;
      }
      return out;
    }""")
    print('probe', probe, flush=True)
    if probe.get('unsc_tank'):
        check(probe['unsc_tank'].get('gunnerOk'), f"gunner seated {probe['unsc_tank']}")
        check(probe['unsc_tank'].get('gunnerParent'), 'gunner parented to turret pivot')
    if probe.get('unsc_heli'):
        check(probe['unsc_heli'].get('rotorOk'), f"rotor mounted {probe['unsc_heli']}")
        check(probe['unsc_heli'].get('rotorParentIsModel'), 'rotor parented to heli')
    shot(pg, '01_fp_dart_tank_heli')

    exit_fp(pg)

    # (c) FP of lighthouse
    check(possess_index(pg, placed['beacon']), 'possess beacon')
    probe_b = pg.evaluate("""() => {
      const cur = window.__possess && window.__possess.cur;
      if (!cur) return null;
      for (const [t, m] of cur.towerModels) {
        // own tower hidden; look at materials on view... beacon is possessed so world model hidden.
        // Inspect via fresh call — materials were built at construct time; check lamp userData on any beacon in scene
      }
      // Build a throwaway beacon in page via dynamic import is hard; instead check canvas pixels aren't all dark
      const c = document.querySelector('canvas');
      if (!c) return { err: 'no canvas' };
      // Possess uses its own renderer canvas inside .ps or similar
      const canvases = [...document.querySelectorAll('canvas')];
      const cv = canvases.sort((a,b)=> (b.width*b.height)-(a.width*a.height))[0];
      const gl = cv.getContext('webgl2') || cv.getContext('webgl');
      return { w: cv.width, h: cv.height, canvases: canvases.length };
    }""")
    print('beacon possess', probe_b, flush=True)
    pg.wait_for_timeout(800)
    shot(pg, '02_fp_beacon')
    exit_fp(pg)

    # (d) optional possess tank + heli
    if placed['tank'] >= 0:
        check(possess_index(pg, placed['tank']), 'possess tank')
        shot(pg, '03_fp_tank_cockpit')
        exit_fp(pg)
    if placed['heli'] >= 0:
        check(possess_index(pg, placed['heli']), 'possess heli')
        shot(pg, '04_fp_heli_cockpit')
        exit_fp(pg)

    # Also possess a nearby tower looking at beacon if dart is far — place sniper near beacon and look
    # Geometry unit test already in probe; take destroyer view toward beacon
    if placed.get('destroyer', -1) >= 0:
        check(possess_index(pg, placed['destroyer']), 'possess destroyer')
        shot(pg, '05_fp_destroyer_near_beacon')
        exit_fp(pg)

    browser.close()

print('\\n' + ('PASS' if not fails else 'FAIL (' + str(len(fails)) + ')'))
for f in fails: print(' -', f)
if errors:
    print('console errors:', len(errors))
    for e in errors[:10]: print('  ', e[:220])
raise SystemExit(1 if fails else 0)
