"""t71: FP screenshots of Blender GLB bloons, towers, viewmodels."""
import argparse, functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'screenshots', 't71'); os.makedirs(OUT, exist_ok=True)
ap = argparse.ArgumentParser(); ap.add_argument('--url'); args = ap.parse_args()
if args.url: URL = args.url.rstrip('/') + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/'
fails=[]
def check(c,msg):
    print(('  ok  ' if c else '  FAIL ')+msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    path=os.path.join(OUT, name+'.png'); pg.screenshot(path=path, full_page=False); print('  shot', path, flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'), headless=True,
        args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width':1600,'height':960})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.goto(URL+'index.html?map=tropical', timeout=60000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(800)

    placed = pg.evaluate("""() => {
      const g = window.__game.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true); g.paused = false;
      const tryPlace = (id, x0, y0) => {
        for (let r=0;r<300;r+=12) for (let a=0;a<16;a++) {
          const x=x0+Math.cos(a/16*Math.PI*2)*r, y=y0+Math.sin(a/16*Math.PI*2)*r;
          if (g.isWaterAt(x,y)) continue;
          const s=g.placementSpot(id,{x,y}); if(!s) continue;
          const t=g.placeTower(id,s); if(t) return g.towers.indexOf(t);
        } return -1;
      };
      let ax=200, ay=200, best=1e9;
      for (let y=80;y<g.map.height;y+=20) for (let x=80;x<g.map.width;x+=20) {
        if (g.isWaterAt(x,y)||!g.grid.isLandAt(x,y)) continue;
        const nl=g.nearestLane({x,y});
        if (nl.dist>40 && nl.dist<140 && nl.dist<best) { best=nl.dist; ax=x; ay=y; }
      }
      const dart=tryPlace('dart_monkey', ax, ay);
      const ninja=tryPlace('ninja_monkey', ax+40, ay);
      const wizard=tryPlace('wizard_monkey', ax-40, ay+30);
      const sniper=tryPlace('sniper_monkey', ax+20, ay-40);
      const apex=tryPlace('super_monkey', ax-60, ay-20);
      const glue=tryPlace('glue_slinger', ax+70, ay+20);
      for (const t of g.towers) { t.upgrade(g); t.upgrade(g); }
      const railTw = g.towers[dart>=0?dart:0];
      const nl = railTw ? g.nearestLane(railTw) : {lane:0,d:g.paths[0].length*0.3};
      const kinds=['red','blue','green','yellow','pink','lead','ceramic','red','blue','green'];
      for (let i=0;i<kinds.length;i++) {
        const e=g.spawnEnemy(kinds[i], Math.max(20, nl.d - 40 + i*16), (i%3-1)*10, nl.lane, 5000);
        e.speedK=0.05;
      }
      for (const id of ['scavenger','hunter']) {
        const e=g.spawnEnemy(id, Math.max(20, nl.d+10), 20, nl.lane, 5000); e.speedK=0.04;
      }
      if (railTw) window.__game.focus(railTw.x, railTw.y, 1.4);
      return {dart,ninja,wizard,sniper,apex,glue,n:g.towers.length,enemies:g.enemies.length};
    }""")
    print('placed', placed, flush=True)
    check(placed['dart']>=0, 'dart placed')
    check(placed['enemies']>=8, 'enemies placed')
    pg.wait_for_timeout(1500)

    def possess(idx):
        pg.evaluate(f"() => window.__game.selectTower({idx})")
        pg.wait_for_timeout(200)
        pg.click('#sp-possess'); pg.wait_for_timeout(2800)
    def exit_fp():
        pg.keyboard.press('Escape'); pg.wait_for_timeout(400)
        pg.evaluate("() => { try{window.__possess&&window.__possess.exit&&window.__possess.exit()}catch(e){} }")
        pg.wait_for_timeout(400)

    if placed['dart']>=0:
        possess(placed['dart'])
        info = pg.evaluate("""() => {
          const cur = window.__possess.cur; if (!cur) return {ok:false};
          cur.aimNearest();
          // wait a tick for GLB upgrade
          return {
            ok: true,
            vmKind: cur.vm.kind,
            towers3d: cur.vm.towers3d,
            bloonKeys: [...cur.bloonMeshes.keys()],
            size: cur.vm.size,
          };
        }""")
        print('fp info', info, flush=True)
        check(info.get('ok'), 'possess dart')
        check(info.get('vmKind','').startswith('glb_gun') or info.get('vmKind')=='glb_gun_dart' or 'gun' in str(info.get('vmKind','')), f"viewmodel glb ({info.get('vmKind')})")
        # Give GLB geos time to swap
        pg.wait_for_timeout(1200)
        pg.evaluate("""() => { const cur=window.__possess.cur; const g=window.__game.g; const e=g.enemies.find(x=>x.alive&&x.data.family==='bloon'); if(e&&cur) cur.aimAt(e.x,e.y,1.5); }""")
        pg.wait_for_timeout(400)
        shot(pg, '01_fp_bloons_glb')
        shot(pg, '02_fp_dart_viewmodel')
        exit_fp()

    if placed['wizard']>=0:
        possess(placed['wizard'])
        pg.evaluate("""() => { const cur=window.__possess.cur; if(cur) cur.aimNearest(); }""")
        pg.wait_for_timeout(1500)
        shot(pg, '03_fp_wizard_tower_glb')
        exit_fp()

    if placed['apex']>=0:
        possess(placed['apex'])
        pg.evaluate("""() => { const cur=window.__possess.cur; if(cur){ cur.aimNearest(); cur.setFire(true);} }""")
        pg.wait_for_timeout(1500)
        shot(pg, '04_fp_apex_laser_viewmodel')
        exit_fp()

    if placed['sniper']>=0:
        possess(placed['sniper'])
        pg.evaluate("""() => {
          const cur=window.__possess.cur; const g=window.__game.g;
          const e=g.enemies.find(x=>x.alive);
          if(e&&cur) cur.aimAt(e.x,e.y,1.4);
        }""")
        pg.wait_for_timeout(1500)
        shot(pg, '05_fp_enemies_and_towers')
        # Confirm GLB tower loaded in scene for another tower
        glb = pg.evaluate("""() => {
          const cur=window.__possess.cur; if(!cur) return {};
          return cur.vm.towers3d || {};
        }""")
        print('glb towers3d', glb, flush=True)
        check(any(k.startswith('glb_') for k in (glb or {})), 'blender tower/bloon glbs registered')
        exit_fp()

    browser.close()

print('\\n'+('PASS' if not fails else 'FAIL ('+str(len(fails))+')'))
for f in fails: print(' -', f)
raise SystemExit(1 if fails else 0)
