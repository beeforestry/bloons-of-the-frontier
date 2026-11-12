"""t76: every first-person (Possess) enemy renders its own Blender GLB, modelled from its v3 2D sprite."""
import argparse, functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'screenshots', 't76'); os.makedirs(OUT, exist_ok=True)
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--tag', default=''); args = ap.parse_args()
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
    path = os.path.join(OUT, name + args.tag + '.png'); pg.screenshot(path=path, full_page=False); print('  shot', path, flush=True)

ALL_GLB = ['bloon_red','bloon_blue','bloon_green','bloon_yellow','bloon_pink','bloon_lead','bloon_ceramic','bloon_moab',
  'bug_scavenger','bug_hunter','bug_charger','bug_brood','bug_ironback','bug_warden','bug_gargoyle','bug_titan',
  'boss_scarab','boss_zeppelin','boss_dreadnought','boss_leviathan']

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
        args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width': 1600, 'height': 960})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page(); pg.on('console', lambda m: print('CONSOLE', m.type, m.text[:300], flush=True) if m.type in ('warning', 'error') else None)
    glb_status = {}
    pg.on('response', lambda r: glb_status.__setitem__(r.url.rsplit('/', 1)[-1], r.status) if '/assets/glb/' in r.url else None)
    pg.goto(URL + 'index.html?map=tropical', timeout=60000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(800)

    placed = pg.evaluate("""() => {
      const g = window.__game.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true); g.paused = false;
      let ax=200, ay=200, best=1e9;
      for (let y=80;y<g.map.height;y+=20) for (let x=80;x<g.map.width;x+=20) {
        if (g.isWaterAt(x,y)||!g.grid.isLandAt(x,y)) continue;
        const nl=g.nearestLane({x,y}); if (nl.dist>70 && nl.dist<130 && nl.dist<best) { best=nl.dist; ax=x; ay=y; }
      }
      for (let r=0;r<300;r+=12) for (let a=0;a<16;a++) {
        const x=ax+Math.cos(a/16*Math.PI*2)*r, y=ay+Math.sin(a/16*Math.PI*2)*r;
        if (g.isWaterAt(x,y)) continue; const s=g.placementSpot('glue_slinger',{x,y}); if(!s) continue;
        const t=g.placeTower('glue_slinger',s); if(t) { window.__game.focus(t.x,t.y,1.4); return g.towers.indexOf(t); }
      } return -1; }""")
    check(placed >= 0, 'tower placed')
    pg.evaluate(f"() => window.__game.selectTower({placed})"); pg.wait_for_timeout(200)
    pg.click('#sp-possess'); pg.wait_for_timeout(2500)
    for _ in range(40):
        t3 = pg.evaluate("() => window.__possess.cur ? window.__possess.cur.vm.towers3d : {}")
        if all(('glb_' + n) in t3 for n in ALL_GLB): break
        pg.wait_for_timeout(500)
    missing = [n for n in ALL_GLB if ('glb_' + n) not in t3]
    check(not missing, f'all 20 enemy GLBs loaded in first person (missing {missing})')

    def scene(ids, back, spread, lift, hp=50000):
        """Clear enemies, spawn ids along the lane in front of the possessed tower, aim at their centre."""
        return pg.evaluate("""([ids, back, spread, lift, hp]) => {
          const g=window.__game.g, cur=window.__possess.cur, o=cur.obj;
          for (const e of g.enemies) e.alive=false; g.enemies.length=0;
          const nl=g.nearestLane(o); const out=[]; let cx=0, cy=0;
          ids.forEach((id,i) => { const d=Math.max(30, nl.d + back + (i-(ids.length-1)/2)*spread);
            const e=g.spawnEnemy(id, d, ((i%2)*2-1)*6, nl.lane, hp); if(!e) return; e.speedK=0.0001; if (e.shield!==undefined) e.shield=1e6; out.push(id); cx+=e.x; cy+=e.y; });
          cx/=Math.max(1,out.length); cy/=Math.max(1,out.length);
          // freeze towers so nothing pops during the photo
          for (const t of g.towers) { t.cooldown = 1e9; }
          cur.aimAt(cx, cy, lift); return {out, cx, cy}; }""", [ids, back, spread, lift, hp])

    def kinds():
        return pg.evaluate("() => window.__possess.cur.vm.enemyGlb")

    # --- 03: mixed bloons
    r = scene(['red', 'blue', 'green', 'yellow', 'pink', 'lead', 'ceramic'], 0, 18, 1.3); print('bloons', r, flush=True)
    pg.wait_for_timeout(3500); k = kinds(); print('kinds', k, flush=True)
    for id in ['red', 'blue', 'green', 'yellow', 'pink', 'lead', 'ceramic']:
        check(k.get(id) == 'bloon_' + id, f'{id} uses its own GLB ({k.get(id)})')
    shot(pg, '03_fp_bloons_mixed')
    # --- 04: bugs
    r = scene(['scavenger', 'hunter', 'charger', 'brood', 'ironback', 'warden', 'scavenger'], 0, 22, 0.6); print('bugs', r, flush=True)
    pg.wait_for_timeout(3500); k = kinds(); print('kinds', k, flush=True)
    check(k.get('scavenger') == 'bug_scavenger', f"scavenger GLB ({k.get('scavenger')})")
    for id in ['hunter', 'charger', 'brood', 'ironback', 'warden']:
        check(k.get(id) == 'bug_' + id and k.get(id) != 'bug_scavenger', f'{id} uses its own GLB, not scavenger geo ({k.get(id)})')
    shot(pg, '04_fp_bugs')
    # --- 05: Sky Colossus + bosses
    r = scene(['moab', 'boss_scarab', 'bile_titan'], 230, 95, 3.0); print('bosses', r, flush=True)
    pg.wait_for_timeout(4500); k = kinds(); print('kinds', k, flush=True)
    check(k.get('moab') == 'bloon_moab', f"Sky Colossus GLB ({k.get('moab')})")
    check(k.get('boss_scarab') == 'boss_scarab', f"Scarab boss GLB ({k.get('boss_scarab')})")
    check(k.get('bile_titan') == 'bug_titan', f"Bile Titan GLB ({k.get('bile_titan')})")
    shot(pg, '05_fp_moab_bosses')
    r = scene(['boss_zeppelin', 'boss_dreadnought', 'gargoyle'], 240, 110, 4.0); print('bosses2', r, flush=True)
    pg.wait_for_timeout(4500); k = kinds(); print('kinds', k, flush=True)
    for id, n in [('boss_zeppelin', 'boss_zeppelin'), ('boss_dreadnought', 'boss_dreadnought'), ('gargoyle', 'bug_gargoyle')]:
        check(k.get(id) == n, f'{id} GLB ({k.get(id)})')
    shot(pg, '06_fp_zeppelin_dreadnought')
    r = scene(['boss_leviathan'], 330, 0, 4.0); pg.wait_for_timeout(4500); k = kinds()
    check(k.get('boss_leviathan') == 'boss_leviathan', f"leviathan GLB ({k.get('boss_leviathan')})")
    shot(pg, '07_fp_leviathan')
    bad = {n: s for n, s in glb_status.items() if n.split('?')[0].replace('.glb', '') in ALL_GLB and s not in (200, 304)}
    check(not bad, f'GLB HTTP status ok {bad}')
    print('glb responses', {k: v for k, v in glb_status.items() if any(n in k for n in ALL_GLB)}, flush=True)
    browser.close()

print('\n' + ('PASS' if not fails else 'FAIL (' + str(len(fails)) + ')'))
for f in fails: print(' -', f)
raise SystemExit(1 if fails else 0)
