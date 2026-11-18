"""t104 predictive-aim hit-rate sim. For each finite-speed projectile tower (max tier, alone, next to lane 0), the same
stream of mixed-speed enemies (one every 1.5 s, very high HP so kills never end a shot early, despawned 700 px past
the tower so nothing leaks) walks past. We count tracked projectiles fired vs projectiles that hit something, with
leading OFF (old aim at the current position / old crude lob guess) and ON, same seed + schedule.
'aimed' = the centre shot of each volley (side shots of a spread volley miss by design); 'all' = every projectile.
Usage: /workspace/.venv-pw/bin/python tests/aim_sim.py [--maps morro,tropical] [--dist dir] [--out t104_aim]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--maps', default='morro,tropical'); ap.add_argument('--dist', default=''); ap.add_argument('--out', default='t104_aim'); args = ap.parse_args()
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=args.dist or os.path.join(ROOT, 'dist'))); threading.Thread(target=h.serve_forever, daemon=True).start()
TOWERS = ['dart_monkey', 'ninja_monkey', 'wizard_monkey', 'solar_pea_fusion', 'repeater_gatling', 'gatling_cherry_bomber', 'star_emperor',
          'unsc_autoturret', 'unsc_flak', 'unsc_tank', 'unsc_destroyer', 'flame_melon_mortar', 'glue_slinger']
RUN = r"""([id, lead]) => { const H = window.__game, g = H.g;
  g.leadAim = lead; let seed = 7; Math.random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (const e of g.enemies) e.alive = false; g.enemies = []; g.projectiles = []; for (const t of [...g.towers]) g.sellTower(t);
  g.res.add(1e7);
  const p = g.paths[0]; let tw = null;
  for (const o of [80, 100, 120, -80, -100, -120, 140, -140]) { for (const dd of [0, 40, -40, 80, -80]) {
    const b = p.at(p.length * 0.4 + dd), x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
    const s = g.placementSpot(id, { x, y }); if (s) { tw = g.placeTower(id, s); if (tw) break; } } if (tw) break; }
  if (!tw) return null;
  while (tw.upgrade(g)) { /* max tier */ }
  Object.assign(g.stats, { projShots: 0, projHits: 0, projAimShots: 0, projAimHits: 0 });
  const mix = ['red', 'blue', 'green', 'yellow', 'pink', 'scavenger', 'hunter', 'ceramic', 'yellow', 'pink', 'scavenger', 'green'];
  let t = 0, k = 0; const startProg = Math.max(0, p.length * 0.4 - 600), endProg = p.length * 0.4 + 700;
  while (t < 42) {
    if (k < 24 && t >= k * 1.5) { g.spawnEnemy(mix[k % mix.length], startProg, 0, 0, 400); k++; }
    g.update(0.05); t += 0.05;
    for (const e of g.enemies) if (e.alive && e.progress > endProg) e.alive = false;
    g.hq.health.hp = g.hq.health.max; if (g.state !== 'playing') return { id, err: g.state };
  }
  const r = { id, tier: tw.tier, shots: g.stats.projShots, hits: g.stats.projHits, aim: g.stats.projAimShots, aimHits: g.stats.projAimHits };
  for (const e of g.enemies) e.alive = false; g.enemies = []; g.projectiles = [];
  return r; }"""
res = []
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    for m in args.maps.split(','):
        pg = b.new_page(viewport={'width': 900, 'height': 600}); pg.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
        pg.goto(f'http://127.0.0.1:{h.server_address[1]}/index.html?map={m}&diff=medium'); pg.wait_for_function('window.__game'); pg.wait_for_timeout(500)
        for tid in TOWERS:
            row = {'map': m, 'tower': tid}
            for lead in (False, True):
                r = pg.evaluate(RUN, [tid, lead])
                if not r or 'err' in r: break
                row['on' if lead else 'off'] = r
            if 'on' not in row: continue
            f = lambda r: round(100 * r['hits'] / max(1, r['shots']), 1); fa = lambda r: round(100 * r['aimHits'] / max(1, r['aim']), 1)
            row.update({'off%': f(row['off']), 'on%': f(row['on']), 'offA%': fa(row['off']), 'onA%': fa(row['on'])})
            print(m, tid, 'aimed', row['offA%'], '->', row['onA%'], ' all', row['off%'], '->', row['on%'], flush=True); res.append(row)
        pg.close()
    b.close()
json.dump(res, open(os.path.join(ROOT, 'balance', args.out + '.json'), 'w'), indent=1)
tot = lambda m, k, hk, sk: (sum(r[k][hk] for r in res if r['map'] == m), sum(r[k][sk] for r in res if r['map'] == m))
pc = lambda x: round(100 * x[0] / max(1, x[1]), 1)
md = ['Aimed = centre shot of each volley (side shots of a spread volley miss by design); all = every tracked projectile.', '',
      '| map | tower | aimed shots | aimed hit % OFF | aimed hit % ON | Δ | all shots | all hit % OFF | all hit % ON | Δ |', '|---|---|---|---|---|---|---|---|---|---|']
for r in res: md.append(f"| {r['map']} | {r['tower']} | {r['off']['aim']} | {r['offA%']} | {r['onA%']} | {round(r['onA%'] - r['offA%'], 1)} | {r['off']['shots']} | {r['off%']} | {r['on%']} | {round(r['on%'] - r['off%'], 1)} |")
for m in args.maps.split(','):
    aa, ba, a, b2 = tot(m, 'off', 'aimHits', 'aim'), tot(m, 'on', 'aimHits', 'aim'), tot(m, 'off', 'hits', 'shots'), tot(m, 'on', 'hits', 'shots')
    md.append(f"| **{m} total** | | {aa[1]} | **{pc(aa)}** | **{pc(ba)}** | {round(pc(ba) - pc(aa), 1)} | {a[1]} | **{pc(a)}** | **{pc(b2)}** | {round(pc(b2) - pc(a), 1)} |")
open(os.path.join(ROOT, 'balance', args.out + '.md'), 'w').write('\n'.join(md) + '\n'); print('\n'.join(md))
