"""t100: measure water placement on a map (tropical by default). Usage: water_measure.py [--dist DIR | --url URL] [--map tropical] [--json out.json]
Samples every STEP px: open-water area (isWaterAt), valid spots per tower (spotOk, empty map), and the reasons water points are rejected."""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ap = argparse.ArgumentParser(); ap.add_argument('--dist', default='dist'); ap.add_argument('--url'); ap.add_argument('--map', default='tropical'); ap.add_argument('--json'); ap.add_argument('--step', type=int, default=32)
args = ap.parse_args()
if args.url: URL = args.url
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=args.dist)); threading.Thread(target=httpd.serve_forever, daemon=True).start()
    URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
JS = r'''(step) => { const H = window.__game, g = H.g, m = g.map, W = m.width, Hh = m.height;
  const ids = ['unsc_destroyer', 'unsc_beacon', 'unsc_heli', 'dart_monkey', 'unsc_tank'];
  const res = { map: m.id, w: W, h: Hh, step, cell: g.grid.cell, water: 0, pts: 0, valid: {}, reasons: { lane: 0, edge: 0, surface: 0, env: 0, hq: 0 }, laneDist: {}, ranges: {} };
  for (const id of ids) { res.valid[id] = 0; res.laneDist[id] = [0, 0, 0]; const d = window.__towerById ? window.__towerById(id) : null; }
  for (let y = step / 2; y < Hh; y += step) for (let x = step / 2; x < W; x += step) {
    res.pts++; const wat = g.isWaterAt(x, y); if (wat) res.water++;
    for (const id of ids) if (g.spotOk(id, x, y)) { res.valid[id]++; const nl = g.nearestLane({ x, y }).dist; res.laneDist[id][nl < 300 ? 0 : nl < 600 ? 1 : 2]++; }
    if (wat && !g.spotOk('unsc_destroyer', x, y)) { const R = g.towerRadius('unsc_destroyer');
      if (x < R || y < R || x > W - R || y > Hh - R) res.reasons.edge++;
      else if (g.nearestLane({ x, y }).dist < m.pathWidth / 2 + R * 0.55) res.reasons.lane++;
      else if (g.buildings.some(b => b.alive && Math.hypot(b.x - x, b.y - y) < R + (b.isHQ ? 110 : 50))) res.reasons.hq++;
      else if (g.envs.some(e => Math.hypot(e.x - x, e.y - y) < R + 34)) res.reasons.env++;
      else res.reasons.surface++; }
  }
  res.waterKm2 = res.water * step * step * (m.mpp || 0) ** 2 / 1e6; res.waterM2 = Math.round(res.water * step * step * (m.mpp || 0) ** 2);
  res.landWaterOverlap = 0; for (let y = step / 2; y < Hh; y += step) for (let x = step / 2; x < W; x += step) if (g.isWaterAt(x, y) && g.grid.isLandAt(x, y)) res.landWaterOverlap++;
  // lane coverage: share of each lane (every 40 px, inside the map) within tier-0 range of at least one valid spot
  const okPts = {}; for (const id of ['unsc_destroyer', 'unsc_beacon']) { okPts[id] = []; for (let y = step / 2; y < Hh; y += step) for (let x = step / 2; x < W; x += step) if (g.spotOk(id, x, y)) okPts[id].push([x, y]); }
  res.cover = {}; for (const id of ['unsc_destroyer', 'unsc_beacon']) { const rg = g.towerStats ? 0 : 0; const R = (H.towerRange ? H.towerRange(id) : null) ?? ({ unsc_destroyer: 220, unsc_beacon: 240 })[id]; res.ranges[id] = R;
    res.cover[id] = m.lanes.map((L, li) => { let n = 0, c = 0; const P = g.paths[li]; for (let d = 0; d < P.length; d += 40) { const q = P.at(d); if (q.x < 0 || q.y < 0 || q.x > W || q.y > Hh) continue; n++; if (okPts[id].some(([x, y]) => Math.hypot(x - q.x, y - q.y) <= R)) c++; } return n ? +(c / n).toFixed(3) : 0; }); }
  res.pathWidth = m.pathWidth; res.lanes = m.lanes.length; res.waterLevel = m.terrain && m.terrain.water; return res; }'''
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 800}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page(); sep = '&' if '?' in URL else '?'
    pg.goto(URL + sep + f'map={args.map}&diff=medium', timeout=90000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1500)
    r = pg.evaluate(JS, args.step); print(json.dumps(r, indent=1))
    if args.json: json.dump(r, open(args.json, 'w'), indent=1)
    b.close()
