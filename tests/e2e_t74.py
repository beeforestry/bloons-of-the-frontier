"""t74: Marksman Scout aim-down-scope (hold RMB / Shift) in Possess."""
import argparse, functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'screenshots', 't74'); os.makedirs(OUT, exist_ok=True)
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
    pg = ctx.new_page(); pg.on('console', lambda m: print('CONSOLE', m.type, m.text[:300], flush=True) if m.type in ('warning','error') else None)
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

    possess(placed['sniper'])
    for _ in range(10):
        k = pg.evaluate("() => { const c=window.__possess.cur; return c ? [c.vm.kind, !!(c.obj&&c.obj.t&&c.obj.t.combat), c.obj&&c.obj.data&&c.obj.data.projectile, c.alive] : null }")
        if k and k[0] == 'glb_gun_sniper': break
        pg.wait_for_timeout(500)
    print('vm poll', k, flush=True)
    info = pg.evaluate("""() => { const cur = window.__possess.cur; if (!cur) return {ok:false}; cur.aimNearest();
      return {ok:true, vmKind: cur.vm.kind, towers3d: cur.vm.towers3d, size: cur.vm.size}; }""")
    st = lambda: pg.evaluate("() => window.__possess.cur.state()")
    s0 = st(); print('hip', s0, flush=True)
    check(s0['canScope'] and not s0['adsActive'] and abs(s0['fov']-70) < 1, 'sniper hipfire fov 70, can scope')
    pg.evaluate("""() => { const cur=window.__possess.cur; const g=window.__game.g; const e=g.enemies.find(x=>x.alive&&x.data.family==='bloon'); if(e&&cur) cur.aimAt(e.x,e.y,1.5); }""")
    pg.wait_for_timeout(500); shot(pg, '01_fp_sniper_hipfire')
    # real right-mouse hold on the canvas
    pg.mouse.move(800, 480); pg.mouse.down(button='right'); pg.wait_for_timeout(700)
    s1 = st(); print('ads', s1, flush=True)
    check(s1['adsActive'] and s1['fov'] < 20, f"RMB hold -> scoped, fov {s1['fov']}")
    vis = pg.evaluate("() => { const e=document.getElementById('ps-scope'); return !!e && !e.hidden; }")
    check(vis, 'scope sight picture shown')
    shot(pg, '02_fp_sniper_ads_scope')
    # distant target while scoped: farthest live enemy inside range, then fire
    far = pg.evaluate("""() => { const cur=window.__possess.cur; const g=window.__game.g; const o=cur.obj; const r=cur.rangePx();
      // drop a few slow bloons far down the lane (long-range shot)
      const nl=g.nearestLane(o); for (const k of [700,900,1100]) { const e=g.spawnEnemy('red', Math.min(g.paths[nl.lane].length-30, nl.d+k), 0, nl.lane, 5000); if(e) e.speedK=0.02; }
      const es=g.enemies.filter(x=>x.alive).map(x=>[x,Math.hypot(x.x-o.x,x.y-o.y)]).filter(p=>p[1]<r).sort((a,b)=>b[1]-a[1]);
      if(!es.length) return null; const e=es[0][0]; cur.aimAt(e.x,e.y,cur.ey?cur.ey(e):1.5); return {d:Math.round(es[0][1]), r:Math.round(r), id:e.data.id}; }""")
    print('far target', far, flush=True)
    shots0 = st()['shots']; pg.mouse.down(button='left'); pg.wait_for_timeout(1800); pg.mouse.up(button='left')
    s2 = st(); print('after fire', s2, flush=True)
    check(s2['adsActive'] and s2['shots'] > shots0, f"fires while scoped ({shots0}->{s2['shots']})")
    shot(pg, '03_fp_sniper_ads_far_target')
    pg.mouse.up(button='right'); pg.wait_for_timeout(600)
    s3 = st(); check(not s3['adsActive'] and abs(s3['fov']-70) < 1, f"release -> hipfire fov {s3['fov']}")
    pg.keyboard.down('Shift'); pg.wait_for_timeout(600); s4 = st(); pg.keyboard.up('Shift'); pg.wait_for_timeout(600); s5 = st()
    check(s4['adsActive'] and s4['fov'] < 20 and not s5['adsActive'], 'Shift hold scopes / release unscopes')
    exit_fp()
    possess(placed['dart']); pg.wait_for_timeout(800)
    pg.mouse.move(800, 480); pg.mouse.down(button='right'); pg.wait_for_timeout(500); sd = st(); pg.mouse.up(button='right')
    check(not sd['canScope'] and not sd['adsActive'] and abs(sd['fov']-70) < 1, 'dart (other towers) unchanged: no scope')
    exit_fp()
    browser.close()

print('\\n'+('PASS' if not fails else 'FAIL ('+str(len(fails))+')'))
for f in fails: print(' -', f)
raise SystemExit(1 if fails else 0)
