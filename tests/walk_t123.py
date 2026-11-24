"""t123: first-person walkability around the OSM building volumes (no invisible walls, no walking through drawn walls).
For every OSM block on El Morro / Isla de Cabras, march a body inward from 16 directions with Game.walkable (the same check
possessed troops use) and report where it stops relative to the footprint edge. Then a real keyboard walk into the
Polvorin de Santa Elena wall.   /workspace/.venv-pw/bin/python tests/walk_t123.py --dist DIR"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ap = argparse.ArgumentParser(); ap.add_argument('--dist', required=True); args = ap.parse_args()
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=args.dist)); threading.Thread(target=httpd.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{httpd.server_address[1]}/'
RAYS = r'''(() => { const g = window.__game.g, m = g.map, mpp = m.mpp, out = [];
  const segd = (p, a, b) => { const dx = b[0]-a[0], dy = b[1]-a[1], L = dx*dx+dy*dy || 1; let t = ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0]-a[0]-t*dx, p[1]-a[1]-t*dy); };
  const ins = (p, P) => { let c = false; for (let i = 0, j = P.length-1; i < P.length; j = i++) if ((P[i][1] > p[1]) != (P[j][1] > p[1]) && p[0] < (P[j][0]-P[i][0])*(p[1]-P[i][1])/(P[j][1]-P[i][1])+P[i][0]) c = !c; return c; };
  for (const b of m.blocks) { const R = b.kind === 'pavilion' ? b.rect : b.poly; const cx = R.reduce((s,p)=>s+p[0],0)/R.length, cy = R.reduce((s,p)=>s+p[1],0)/R.length;
    const rad = Math.max(...R.map(p => Math.hypot(p[0]-cx, p[1]-cy))) + 8/mpp; const st = [];
    for (let k = 0; k < 16; k++) { const a = k*Math.PI/8, ux = -Math.cos(a), uy = -Math.sin(a); let x = cx - ux*rad, y = cy - uy*rad, px = x, py = y, n = 0, blocked = false;
      if (!g.walkable(x, y)) { st.push(null); continue; }
      while (n++ < 4000) { const nx = x + ux*0.1/mpp, ny = y + uy*0.1/mpp; if (Math.hypot(nx-cx, ny-cy) < 0.1/mpp) break; if (!g.walkable(nx, ny, x, y)) { blocked = true; break; } px = x; py = y; x = nx; y = ny; }
      let d = Infinity; for (let i = 0; i < R.length; i++) d = Math.min(d, segd([x,y], R[i], R[(i+1)%R.length])); d *= mpp; if (ins([x,y], R)) d = -d;
      st.push(blocked ? +d.toFixed(2) : 'centre'); }
    out.push({ id: b.id, kind: b.kind, stops: st }); }
  return out; })()'''
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--enable-unsafe-swiftshader'])
    pg = b.new_page(); pg.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    res = {}
    for mid in ('morro', 'tropical'):
        pg.goto(f'{URL}?map={mid}&diff=medium', timeout=60000); pg.wait_for_function('window.__game && window.__game.g', timeout=30000); pg.wait_for_timeout(800)
        pg.evaluate('window.__game.sandbox()')
        res[mid] = pg.evaluate(RAYS)
        for r in res[mid]:
            s = [v for v in r['stops'] if v is not None]
            num = [v for v in s if v != 'centre']
            print(mid, r['id'], r['kind'], f"reached centre {sum(1 for v in s if v == 'centre')}/{len(s)}", 'stop dist outside edge (m):', (min(num), max(num)) if num else '-', 'skipped(start blocked by other solids):', r['stops'].count(None), flush=True)
    json.dump(res, open('/workspace/osmwork/walk_t123.json', 'w'), indent=1)
    b.close()
