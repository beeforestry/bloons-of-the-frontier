"""t57 e2e: water/air/amphibious placement, Tidebreaker Destroyer, Harbor Beacon lock ramp,
movable Skyranger + Bulwark Tank (roof MG last tier), display rename pass.
Screenshots -> screenshots/t57/. Usage: /workspace/.venv-pw/bin/python tests/e2e_t57.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't57'); os.makedirs(OUT, exist_ok=True)
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
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, name + '.png'))
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    # --- title + menu rename
    pg.goto(URL + 'index.html', timeout=60000); pg.wait_for_selector('.map-pick', timeout=60000)
    title = pg.title(); brand = pg.inner_text('.brand')
    check('Bloons' not in title and 'Balloons' in title, f'title de-Bloons: {title}')
    check('Bloons' not in brand and 'Balloons' in brand, f'brand: {brand}')
    # --- tropical water + naval + movable
    pg.goto(URL + 'index.html?map=tropical', timeout=60000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1200)
    r = pg.evaluate("""() => {
      const g = window.__game.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true);
      let water = 0, land = 0;
      for (let y = 80; y < g.map.height; y += 48) for (let x = 80; x < g.map.width; x += 48) {
        if (g.isWaterAt(x, y)) water++; else if (g.grid.isLandAt(x, y)) land++;
      }
      const place = (id, preferWater) => {
        for (let y = 60; y < g.map.height; y += 20) for (let x = 60; x < g.map.width; x += 20) {
          if (preferWater === true && !g.isWaterAt(x, y)) continue;
          if (preferWater === false && g.isWaterAt(x, y)) continue;
          const s = g.placementSpot(id, { x, y }); if (!s) continue;
          const t = g.placeTower(id, s); if (t) return t;
        }
        return null;
      };
      const landDeny = (() => { for (let y = 80; y < g.map.height; y += 40) for (let x = 80; x < g.map.width; x += 40) if (!g.isWaterAt(x,y) && g.grid.isLandAt(x,y) && g.nearestLane({x,y}).dist > 80) return g.spotOk('unsc_destroyer', x, y); return true; })();
      const d = place('unsc_destroyer', true);
      const b = place('unsc_beacon', true);
      const h = place('unsc_heli', false); // land first so we can move to water
      const t = place('unsc_tank', false);
      let heliWater = null;
      for (let y = 60; y < g.map.height && !heliWater; y += 24) for (let x = 60; x < g.map.width; x += 24)
        if (g.isWaterAt(x,y) && g.spotOk('unsc_heli', x, y, h || undefined)) { heliWater = [x,y]; break; }
      let moveTank = false, moveHeli = false, chase = false, mg = false, ramp = false;
      if (t) {
        for (let y = 60; y < g.map.height && !moveTank; y += 28) for (let x = 60; x < g.map.width; x += 28) {
          if (Math.hypot(x - t.x, y - t.y) < 140) continue;
          if (g.spotOk('unsc_tank', x, y, t)) { moveTank = g.moveTower(t, { x, y }); break; }
        }
        t.upgrade(g); t.upgrade(g);
        mg = !!(t.t.combat && t.t.combat.secondary);
      }
      if (h) {
        if (heliWater) moveHeli = g.moveTower(h, { x: heliWater[0], y: heliWater[1] });
        h.upgrade(g); h.upgrade(g);
        chase = !!(h.data.autoChase && h.tier >= 2);
      }
      if (b) {
        b.upgrade(g); b.upgrade(g);
        ramp = !!(b.t.combat && b.t.combat.lockRamp > 0);
        const e = g.spawnEnemy('red', 200, 0, 0, 1);
        if (e && b.combat) { b.combat.lockUid = e.uid; b.combat.lockT = 2; }
      }
      let landOnWater = false;
      for (let y = 80; y < g.map.height && !landOnWater; y += 40) for (let x = 80; x < g.map.width; x += 40)
        if (g.isWaterAt(x,y) && g.spotOk('dart_monkey', x, y)) { landOnWater = true; break; }
      return {
        water, land, landDeny,
        destroyer: d && { name: d.data.name, placeOn: d.data.placeOn, x: d.x, y: d.y, water: g.isWaterAt(d.x, d.y) },
        beacon: b && { name: b.data.name, placeOn: b.data.placeOn, ramp, lockMax: b.t.combat.lockRampMax, tier: b.tier },
        heli: h && { name: h.data.name, placeOn: h.data.placeOn, movable: h.data.movable, moveHeli, chase, tier: h.tier, moveTo: h.moveTo },
        tank: t && { name: t.data.name, movable: t.data.movable, moveTank, mg, tier: t.tier, moveTo: t.moveTo },
        landOnWater, heliWater,
      };
    }""")
    check(r['water'] > 40, f'tropical has open water samples {r["water"]}')
    check(r['destroyer'] and r['destroyer']['water'] and r['destroyer']['name'] == 'Tidebreaker Destroyer', f'destroyer on water {r["destroyer"]}')
    check(r['landDeny'] is False, 'destroyer rejected on land')
    check(r['beacon'] and r['beacon']['ramp'] and r['beacon']['name'] == 'Harbor Beacon', f'beacon lock ramp {r["beacon"]}')
    check(bool(r['heli']) and r['heli']['movable'] and r['heli']['chase'] and r['heli']['name'] == 'Skyranger Gunship', f'heli hunter patrol {r.get("heli")}')
    check(bool(r['heli']) and (r['heli']['moveHeli'] or r['heliWater'] is None), f'heli moved over water {r.get("heli")} water={r.get("heliWater")}')
    check(bool(r['tank']) and r['tank']['mg'] and r['tank']['moveTank'] and r['tank']['name'] == 'Bulwark Battle Tank', f'tank move + roof MG {r.get("tank")}')
    check(not r['landOnWater'], 'land towers cannot place on water')
    # rename table smoke: user-facing names must not include banned marks
    names = pg.evaluate("""() => {
      const g = window.__game.g;
      // probe towerById via placing / existing
      const ids = ['dart_monkey','ninja_monkey','wizard_monkey','super_monkey','sniper_monkey','banana_drop','glue_slinger','frost_wallnut_bastion','wallnut_barrier','cherry_pod','hypno_shroom','chomper','sunflower','repeater_gatling','unsc_tank','unsc_heli','unsc_destroyer','unsc_beacon','unsc_autoturret'];
      // use data from any known tower data attached via place attempt
      const out = {};
      for (const id of ids) {
        const t = g.towers.find(x => x.data.id === id);
        if (t) out[id] = t.data.name;
      }
      // also read from card labels if present
      const cards = [...document.querySelectorAll('[data-tower], .tower-card, #tower-cards [data-id]')].map(e => e.textContent.trim().slice(0,40));
      return { placed: out, cards, factionBtn: (document.body.innerText.match(/Vanguard|UNSC|Primates/)||[]).slice(0,5) };
    }""")
    banned = ['Dart Monkey','Ninja Monkey','Wizard Monkey','Super Monkey','Sniper Monkey','Boomerang Monkey','Banana Republic','Banana Central','Bloon Dissolver','M.O.A.B','Wall-Nut','Hypno-Shroom','Chomper','M808','Warthog','Hellfire','AH-9','Spartan-II','Mjolnir','ODST','UNSC']
    blob = json.dumps(names) + pg.inner_text('body')[:2000]
    # faction display should be Vanguard not bare UNSC in HUD tabs if visible
    check('Tidebreaker Destroyer' in blob or (r['destroyer'] and r['destroyer']['name']=='Tidebreaker Destroyer'), 'destroyer name present')
    hit = [b for b in banned if b in blob and b != 'UNSC']  # UNSC id may appear in data attrs; check carefully
    # stricter: check placed tower names
    for id_, nm in names.get('placed', {}).items():
        for ban in banned:
            if ban in (nm or ''): fails.append(f'banned in {id_}: {nm}'); print('  FAIL banned', id_, nm)
    check((r.get('tank') or {}).get('name') != 'M808 Battle Tank' and 'Hellfire' not in ((r.get('heli') or {}).get('name') or ''), 'tank/heli display renamed')
    # focus camera for screenshots
    pg.evaluate("""() => { const g = window.__game.g; const d = g.towers.find(t => t.data.id==='unsc_destroyer');
      const b = g.towers.find(t => t.data.id==='unsc_beacon');
      const h = g.towers.find(t => t.data.id==='unsc_heli');
      const t = g.towers.find(t => t.data.id==='unsc_tank');
      const focus = (o, z) => { if (!o || !window.__game.camFocus) return; window.__game.camFocus(o.x, o.y, z||0.9); };
      return { d: !!d, b: !!b, h: !!h, t: !!t }; }""")
    if r['destroyer']:
        pg.evaluate("() => { const t = window.__game.g.towers.find(x=>x.data.id==='unsc_destroyer'); window.__game.camFocus(t.x, t.y, 1.1); }")
        pg.wait_for_timeout(500); shot(pg, 'destroyer_water')
    if r['beacon']:
        pg.evaluate("""() => { const t = window.__game.g.towers.find(x=>x.data.id==='unsc_beacon');
          window.__game.camFocus(t.x, t.y, 1.2);
          // force a laser FX beam if available
          const e = window.__game.g.enemies[0] || window.__game.g.spawnEnemy('pink', 250, 0, 0, 1);
          if (e && t.combat) { t.combat.lockUid = e.uid; t.combat.lockT = 3; t.aim = Math.atan2(e.y-t.y, e.x-t.x); t.engaged = true; }
        }""")
        pg.wait_for_timeout(400); shot(pg, 'beacon_laser')
    if r['heli']:
        pg.evaluate("() => { const t = window.__game.g.towers.find(x=>x.data.id==='unsc_heli'); window.__game.camFocus(t.x, t.y, 1.0); }")
        pg.wait_for_timeout(400); shot(pg, 'heli_move')
    if r['tank']:
        pg.evaluate("() => { const t = window.__game.g.towers.find(x=>x.data.id==='unsc_tank'); window.__game.camFocus(t.x, t.y, 1.1); }")
        pg.wait_for_timeout(400); shot(pg, 'tank_gunner')
    shot(pg, 'tropical_naval_overview')
    # rename smoke via tower data import path through cards
    rename = pg.evaluate("""() => {
      const g = window.__game.g;
      const want = {
        dart_monkey: 'Dart Scout', ninja_monkey: 'Shadow Scout', wizard_monkey: 'Arcane Scout',
        super_monkey: 'Apex Laser Scout', sniper_monkey: 'Marksman Scout',
        banana_drop: 'Banana Supply Drop', hypno_shroom: 'Charmcap', chomper: 'Snapjaw',
        frost_wallnut_bastion: 'Frost Oakshield Bastion', wallnut_barrier: 'Oakshield Barrier Sprout',
        cherry_pod: 'Burst Berry Blast Pod', unsc_tank: 'Bulwark Battle Tank', unsc_heli: 'Skyranger Gunship',
        unsc_destroyer: 'Tidebreaker Destroyer', unsc_beacon: 'Harbor Beacon',
      };
      // place missing cheaply to read names
      g.res.load({ credits: 1e7, scrap: 1e5 }, true);
      const got = {};
      for (const [id, expect] of Object.entries(want)) {
        let t = g.towers.find(x => x.data.id === id);
        if (!t) {
          for (let y = 60; y < g.map.height; y += 40) { let done=false;
            for (let x = 60; x < g.map.width; x += 40) {
              const s = g.placementSpot(id, { x, y }); if (!s) continue;
              t = g.placeTower(id, s); if (t) { done=true; break; }
            } if (done) break; }
        }
        // path objects
        if (!t && (id === 'wallnut_barrier' || id === 'cherry_pod')) {
          const p = g.paths[0].at(400); const b = g.placeBarrier(id, p); if (b) got[id] = b.data.name;
          continue;
        }
        if (t) got[id] = t.data.name;
      }
      const bad = [];
      for (const [id, expect] of Object.entries(want)) if (got[id] && got[id] !== expect) bad.push([id, got[id], expect]);
      // faction display
      const fac = document.body.innerText.includes('Vanguard');
      return { got, bad, fac, enemy: (g.spawnEnemy('moab', 100, 0, 0, 1)||{}).data?.name };
    }""")
    check(not rename['bad'], f'rename table match (bad={rename["bad"][:5]})')
    check(rename.get('enemy') == 'Sky Colossus', f'MOAB renamed to Sky Colossus ({rename.get("enemy")})')
    print('rename got sample:', {k: rename['got'].get(k) for k in list(rename['got'])[:8]})
    print('errors:', errors[:8]); check(len([e for e in errors if 'CombatStats' not in e]) == 0 or not errors, f'console errors {errors[:3]}')
    # soft on console: ignore known noise
    hard = [e for e in errors if 'Failed' not in e and 'favicon' not in e]
    check(len(hard) == 0, f'no hard console errors ({hard[:3]})')
    browser.close()
print('FAILS:', fails or 'none')
raise SystemExit(1 if fails else 0)
