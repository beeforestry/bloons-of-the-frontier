"""t107 perf: FPS under a heavy, constantly dying wave on a MOBILE viewport (412x860 @2x, touch), old build vs new.
Usage: /workspace/.venv-pw/bin/python tests/perf_t107.py --a DIST_BEFORE --b DIST_AFTER [--rounds 2] [--secs 12]"""
import argparse, functools, http.server, socketserver, threading, json, os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--a', required=True); ap.add_argument('--b', default=os.path.join(ROOT, 'dist')); ap.add_argument('--rounds', type=int, default=2); ap.add_argument('--secs', type=float, default=12); ap.add_argument('--desktop', action='store_true'); args = ap.parse_args()
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
def serve(d):
    h = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Q, directory=d)); h.daemon_threads = True
    threading.Thread(target=h.serve_forever, daemon=True).start(); return f'http://127.0.0.1:{h.server_address[1]}/index.html'
URLS = {'before': serve(args.a), 'after': serve(args.b)}
PLACE = open(os.path.join(ROOT, 'tests', 'e2e_t106.py')).read().split('PLACE = """', 2)[2].split('"""')[0]
RUN = """async (secs) => { const H = window.__game, g = H.g; g.paused = false; H.addCredits(900000);
  const P = %s;
  const ids = ['dart_monkey', 'flame_melon_mortar', 'tesla_coil', 'dart_monkey', 'flame_melon_mortar', 'frost_wallnut_bastion', 'dart_monkey', 'tesla_coil', 'flame_melon_mortar', 'dart_monkey', 'unsc_autoturret', 'dart_monkey'];
  ids.forEach((id, i) => { const k = P(id, 0, 0.25 + i * 0.035, 70 + (i %% 2) * 40); if (k >= 0) { const t = g.towers[k]; while (t.upgrade(g, 0)) {} } });
  const t0 = g.towers[0]; if (H.focus && t0) H.focus(t0.x, t0.y, 1.0);
  let frames = 0, run = true; const k0 = g.stats.kills;
  const spawn = setInterval(() => { for (let i = 0; i < 6; i++) H.spawn('hunter', 0, 0.18 + Math.random() * 0.1, 1); for (let i = 0; i < 4; i++) H.spawn('pink', 0, 0.18 + Math.random() * 0.1, 1); }, 300);
  await new Promise((r) => setTimeout(r, 2500));
  const f = () => { frames++; if (run) requestAnimationFrame(f); }; requestAnimationFrame(f);
  const s0 = performance.now(); let peak = 0; const pk = setInterval(() => { const d = H.deathFx ? H.deathFx().debris : 0; peak = Math.max(peak, d); }, 200);
  await new Promise((r) => setTimeout(r, secs * 1000)); run = false; clearInterval(spawn); clearInterval(pk);
  const dt = (performance.now() - s0) / 1000;
  return { fps: +(frames / dt).toFixed(1), kills: g.stats.kills - k0, foes: g.enemies.length, debrisPeak: peak, towers: g.towers.length }; }""" % PLACE
res = {'before': [], 'after': []}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    for r in range(args.rounds):
        for tag in (['before', 'after'] if r % 2 == 0 else ['after', 'before']):
            ctx = b.new_context(**({'viewport': {'width': 1280, 'height': 760}} if args.desktop else {'viewport': {'width': 412, 'height': 860}, 'device_scale_factor': 2, 'is_mobile': True, 'has_touch': True}))
            ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')"); pg = ctx.new_page()
            pg.goto(URLS[tag] + '?map=morro&diff=medium', timeout=90000); pg.wait_for_function('window.__game', timeout=60000); pg.wait_for_timeout(1500)
            out = pg.evaluate(f'({RUN})({args.secs})'); res[tag].append(out); print(tag, r, out, flush=True); ctx.close()
    b.close()
avg = {k: round(sum(x['fps'] for x in v) / len(v), 1) for k, v in res.items()}
print('AVG FPS', avg, 'delta', round(avg['after'] - avg['before'], 1))
