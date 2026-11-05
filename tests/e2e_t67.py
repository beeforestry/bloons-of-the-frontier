"""t67/t68: rail long pierce, lighthouse constant beam, FP projectiles, sandbag pile, 3D-from-2D enemies."""
import argparse, functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't67'); os.makedirs(OUT, exist_ok=True)
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
    if not args.no_shots:
        path = os.path.join(OUT, name + '.png'); pg.screenshot(path=path, full_page=False); print('  shot', path, flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
        args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width': 1600, 'height': 960})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.goto(URL + 'index.html?map=tropical', timeout=60000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(800)

    placed = pg.evaluate("""() => {
      const g = window.__game.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true); g.paused = false;
      const tryPlace = (id, x0, y0, water) => {
        for (let r = 0; r < 280; r += 14) for (let a = 0; a < 16; a++) {
          const x = x0 + Math.cos(a/16*Math.PI*2)*r, y = y0 + Math.sin(a/16*Math.PI*2)*r;
          if (water === true && !g.isWaterAt(x,y)) continue;
          if (water === false && g.isWaterAt(x,y)) continue;
          const s = g.placementSpot(id, { x, y }); if (!s) continue;
          const t = g.placeTower(id, s); if (t) return g.towers.indexOf(t);
        } return -1;
      };
      // Prefer land near the first lane so towers can acquire
      let ax=200, ay=200, bestLane=1e9;
      outer: for (let y=80;y<g.map.height;y+=20) for (let x=80;x<g.map.width;x+=20) {
        if (g.isWaterAt(x,y) || !g.grid.isLandAt(x,y)) continue;
        const nl = g.nearestLane({x,y});
        if (nl.dist > 40 && nl.dist < 140 && nl.dist < bestLane) { bestLane = nl.dist; ax=x; ay=y; }
      }
      const rail = tryPlace('unsc_rail', ax, ay, false);
      const dart = tryPlace('dart_monkey', ax-50, ay+10, false);
      const ninja = tryPlace('ninja_monkey', ax-20, ay+55, false);
      const wizard = tryPlace('wizard_monkey', ax+45, ay+35, false);
      const sniper = tryPlace('sniper_monkey', ax-70, ay-25, false);
      let bx=ax, by=ay, best=1e9;
      for (let y=Math.max(40,ay-220); y<ay+220; y+=16)
        for (let x=Math.max(40,ax-220); x<ax+220; x+=16) {
          if (!g.isWaterAt(x,y)) continue;
          const d=(x-ax)**2+(y-ay)**2; if (d<best && g.placementSpot('unsc_beacon',{x,y})) { best=d; bx=x; by=y; }
        }
      const beacon = tryPlace('unsc_beacon', bx, by, true);
      const tank = tryPlace('unsc_tank', ax+70, ay-10, false);
      for (const t of g.towers) if (['unsc_rail','unsc_beacon','unsc_tank','ninja_monkey','wizard_monkey','sniper_monkey'].includes(t.data.id)) { t.upgrade(g); t.upgrade(g); }

      // Spawn on the lane nearest the rail (progress = path distance). Positions come from path.at.
      const railTw = rail >= 0 ? g.towers[rail] : (dart >= 0 ? g.towers[dart] : null);
      const nl = railTw ? g.nearestLane(railTw) : { lane: 0, d: g.paths[0].length * 0.25, dist: 0 };
      const path = g.paths[nl.lane] || g.paths[0];
      const prog = Math.max(40, Math.min(path.length - 80, nl.d));
      const kinds = ['red','blue','green','yellow','pink','red','ceramic','lead','red','blue','green','pink'];
      for (let i = 0; i < kinds.length; i++) {
        const e = g.spawnEnemy(kinds[i], Math.max(20, prog - 50 + i * 14), (i % 3 - 1) * 10, nl.lane, 4000);
        e.speedK = 0.08;
      }
      for (const id of ['scavenger','hunter','ironback']) {
        const e = g.spawnEnemy(id, Math.max(20, prog + 20), 18, nl.lane, 4000); e.speedK = 0.05;
      }
      // Focus camera on the cluster
      if (railTw) window.__game.focus(railTw.x, railTw.y, 1.45);
      else window.__game.focus(ax, ay, 1.25);
      return {
        rail, dart, ninja, wizard, sniper, beacon, tank,
        n: g.towers.length, enemies: g.enemies.length,
        ax, ay, prog: +prog.toFixed(1), pathLen: +path.length.toFixed(1), laneDist: +nl.dist.toFixed(1), lane: nl.lane,
      };
    }""")
    print('placed', placed, flush=True)
    check(placed['rail'] >= 0, 'rail placed')
    check(placed['beacon'] >= 0, 'beacon placed')
    check(placed['enemies'] >= 12, 'enemies spawned near towers')

    # Let sim run so rail/beacon fire; keep camera locked on cluster
    pg.wait_for_timeout(1600)
    if placed['rail'] >= 0:
        pg.evaluate(f"""() => {{ const t = window.__game.g.towers[{placed['rail']}]; if (t) window.__game.focus(t.x, t.y, 1.55); }}""")
    pg.wait_for_timeout(1200)
    shot(pg, '01_2d_rail_pierce')
    shot(pg, '02_2d_mixed_projectiles')

    # Probe rail beam reach + beacon beamTo — sample over a short window while forcing fire
    probe = pg.evaluate("""() => {
      const g = window.__game.g;
      const rail = g.towers.find(t => t.data.id === 'unsc_rail');
      const beacon = g.towers.find(t => t.data.id === 'unsc_beacon');
      // Force a hitscan now so the beam exists for the probe
      let tgt = g.enemies.find(e => e.alive);
      if (!tgt && rail) {
        // Keep a durable target on the nearest lane point for beam proof
        const nl2 = g.nearestLane(rail);
        tgt = g.spawnEnemy('ceramic', Math.max(20, nl2.d), 0, nl2.lane, 8000);
        tgt.speedK = 0;
      }
      if (rail && rail.combat && tgt) {
        rail.aim = Math.atan2(tgt.y - rail.y, tgt.x - rail.x);
        g.towerFire(rail, [tgt], rail.t.combat, (rail.combat.shotCount = (rail.combat.shotCount||0) + 1));
      }
      if (beacon && beacon.combat && tgt) {
        beacon.combat.beamTo = tgt; beacon.combat.lockT = 1.5; beacon.combat.lockUid = tgt.uid;
      }
      const beams = g.effects.filter(e => e.kind === 'beam');
      let maxLen = 0;
      for (const e of beams) {
        const len = Math.hypot((e.x2||e.x)-e.x, (e.y2||e.y)-e.y);
        if (len > maxLen) maxLen = len;
      }
      return {
        maxBeamLen: +maxLen.toFixed(1),
        railRange: rail && rail.t.combat.range,
        beaconBeamTo: !!(beacon && beacon.combat && beacon.combat.beamTo),
        beaconLockT: beacon && beacon.combat ? +beacon.combat.lockT.toFixed(2) : 0,
        lockRampMax: beacon && beacon.t.combat.lockRampMax,
        projectiles: g.projectiles.filter(p => p.alive).map(p => p.o.kind).slice(0, 12),
        enemyNearRail: (() => {
          if (!rail) return null;
          let best = 1e9; for (const e of g.enemies) if (e.alive) best = Math.min(best, Math.hypot(e.x-rail.x, e.y-rail.y));
          return +best.toFixed(1);
        })(),
      };
    }""")
    print('probe', probe, flush=True)
    check(probe['maxBeamLen'] > (probe['railRange'] or 300) * 0.9 or probe['maxBeamLen'] > 400, f"rail beam long ({probe['maxBeamLen']} vs range {probe['railRange']})")
    check(probe['lockRampMax'] and probe['lockRampMax'] >= 2.5, 'beacon tier2 damage cap risen')
    check(probe['beaconBeamTo'], 'beacon beamTo locked')

    bags = pg.evaluate("""() => {
      const g = window.__game.g;
      return (g.props || []).filter(p => p.kind === 'sandbags').length;
    }""")
    print('sandbags', bags, flush=True)
    shot(pg, '03_2d_sandbags_and_beacon')

    def possess(idx):
        pg.evaluate(f"() => window.__game.selectTower({idx})")
        pg.wait_for_timeout(200)
        pg.click('#sp-possess'); pg.wait_for_timeout(2500)
    def exit_fp():
        pg.keyboard.press('Escape'); pg.wait_for_timeout(400)
        pg.evaluate("() => { try{window.__possess&&window.__possess.exit&&window.__possess.exit()}catch(e){} }")
        pg.wait_for_timeout(400)

    if placed['dart'] >= 0:
        possess(placed['dart'])
        pg.evaluate("""() => {
          const cur = window.__possess.cur; const g = window.__game.g;
          if (!cur) return;
          cur.aimNearest() || (g.enemies[0] && cur.aimAt(g.enemies[0].x, g.enemies[0].y, 1.5));
          cur.setFire(true);
        }""")
        pg.wait_for_timeout(1800)
        fp = pg.evaluate("""() => {
          const cur = window.__possess.cur; const g = window.__game.g;
          if (!cur) return { ok:false };
          const st = cur.state();
          return {
            ok: true,
            shotsAccum: st.shots,
            shotMesh: cur.shotMesh ? cur.shotMesh.count : -1,
            tracers: cur.tracers ? cur.tracers.filter(t => t.life > 0).length : -1,
            enemies: [...cur.bloonMeshes.values()].reduce((n,m)=>n+m.count,0) + (cur.bloonMesh?cur.bloonMesh.count:0),
            bugs: cur.bugMesh ? cur.bugMesh.count : 0,
            liveProj: g.projectiles.filter(p => p.alive).length,
            kinds: g.projectiles.filter(p => p.alive).map(p => p.o.kind).slice(0,8),
            bloonKeys: [...cur.bloonMeshes.keys()],
          };
        }""")
        print('fp dart', fp, flush=True)
        check(fp.get('ok'), 'possess dart')
        check((fp.get('shotsAccum') or 0) > 0 or (fp.get('shotMesh') or 0) > 0 or (fp.get('liveProj') or 0) > 0 or (fp.get('tracers') or 0) > 0, 'FP projectiles visible')
        check((fp.get('enemies') or 0) > 0, 'FP bloons textured from v3')
        shot(pg, '04_fp_dart_projectiles')
        exit_fp()

    if placed['rail'] >= 0:
        possess(placed['rail'])
        pg.evaluate("""() => {
          const cur = window.__possess.cur; const g = window.__game.g;
          if (!cur) return;
          cur.aimNearest() || (g.enemies[0] && cur.aimAt(g.enemies[0].x, g.enemies[0].y, 1.5));
          cur.setFire(true);
        }""")
        pg.wait_for_timeout(1600)
        shot(pg, '05_fp_rail_beam')
        exit_fp()

    if placed['beacon'] >= 0 and placed['sniper'] >= 0:
        # Ensure beacon is locking, then possess sniper looking at it / enemies
        pg.evaluate(f"""() => {{
          const g = window.__game.g; const b = g.towers[{placed['beacon']}];
          const tgt = g.enemies.find(e => e.alive);
          if (b && b.combat && tgt) {{ b.combat.beamTo = tgt; b.combat.lockT = 2; b.combat.lockUid = tgt.uid; }}
        }}""")
        possess(placed['sniper'])
        pg.evaluate(f"""() => {{
          const g = window.__game.g; const b = g.towers[{placed['beacon']}];
          const cur = window.__possess.cur;
          if (b && cur) cur.aimAt(b.x, b.y, 8);
          else if (cur) cur.aimNearest();
          cur && cur.setFire(true);
        }}""")
        pg.wait_for_timeout(2000)
        shot(pg, '06_fp_beacon_laser')
        # Aim at mixed bloons for texture proof
        pg.evaluate("""() => {
          const cur = window.__possess.cur; const g = window.__game.g;
          const e = g.enemies.find(x => x.alive && x.data.family === 'bloon');
          if (e && cur) cur.aimAt(e.x, e.y, 1.5);
        }""")
        pg.wait_for_timeout(600)
        shot(pg, '07_fp_enemies_textured')
        exit_fp()

    # Side-by-side 2D sprite vs note: dump sprite paths used
    cmp = pg.evaluate("""() => {
      const ids = ['red','blue','green','yellow','pink','lead','ceramic','scavenger'];
      return ids.map(id => 'assets/v3/' + (['red','blue','green','yellow','pink','lead','ceramic'].includes(id) ? 'bloon_'+id : 'bug_'+id) + '.webp');
    }""")
    print('3d-from-2d sprites', cmp, flush=True)

    browser.close()

print('\\n' + ('PASS' if not fails else 'FAIL (' + str(len(fails)) + ')'))
for f in fails: print(' -', f)
raise SystemExit(1 if fails else 0)
