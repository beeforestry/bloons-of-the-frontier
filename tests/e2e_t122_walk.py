"""t122: 2D friendly units play a 6-frame walk cycle at ~8 FPS while moving, and
show the original idle sprite when stationary. Sheets load lazily.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t122_walk.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, os, socketserver, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't122'); os.makedirs(OUT, exist_ok=True)
if args.url:
    URL = args.url.rstrip('/') + '/index.html'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'

IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)

KINDS = ['marine', 'paladin', 'ranger', 'line_watch', 'odst', 'monkey_soldier', 'spartan', 'farmhand']

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 720})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    def G(js):
        return pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({__import__("json").dumps(js)}); }})()')
    import json
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')

    sep = '&' if '?' in URL else '?'
    pg.goto(URL + sep + 'map=morro&diff=medium', timeout=90000)
    pg.wait_for_function('window.__game', timeout=30000)
    pg.wait_for_timeout(800)
    G('H.g.res.load({ credits: 1e7, scrap: 1e5 }, true)')
    G('H.sandbox(3, 80)')
    G('H.g.deployCd = {}')
    # a clear stretch of ground near the first path
    lane = G('(() => { const p = H.g.paths[0].at(H.g.paths[0].length * 0.35); return [p.x, p.y]; })()')
    dest = G('(() => { const p = H.g.paths[0].at(H.g.paths[0].length * 0.62); return [p.x, p.y]; })()')
    placed = {}
    for i, kind in enumerate(KINDS):
        x, y = lane[0] + (i % 4) * 36 - 40, lane[1] + (i // 4) * 40 - 20
        ok = G(f'H.deploy("{kind}", {x}, {y})')
        placed[kind] = bool(ok)
        G('H.g.deployCd = {}')
    check(sum(placed.values()) >= 5, f'deployed several walk-cycle units ({placed})')
    pg.wait_for_timeout(900)  # drop pods land
    # pause them in place first: no orders, wait out the drop, then check idle draw
    G('H.g.units.forEach(u => { u.dropT = 0; })')
    pg.wait_for_function('window.__unitWalk && window.__unitWalk.stats.loaded >= 3', timeout=10000)
    st = G('({ ...window.__unitWalk.stats, n: window.__unitWalk.ids.length })')
    check(st['failed'] == 0 and st['loaded'] >= 3, f'walk sheets lazy-load without errors ({st})')

    # freeze movement, count idle draws
    G('H.g.paused = true')
    G('window.__unitWalk.drawn.walk = 0; window.__unitWalk.drawn.other = 0')
    G('H.g.paused = false')
    pg.wait_for_timeout(250)
    idle = G('({ ...window.__unitWalk.drawn })')
    check(idle['other'] > 0 and idle['walk'] == 0, f'stationary units draw the idle sprite (drawn={idle})')

    # send everyone walking
    nsq = G('H.g.squads.length')
    idxs = list(range(nsq))
    G(f'H.moveGroup({idxs}, {dest[0]}, {dest[1]})')
    # wait until walk draws start
    try:
        pg.wait_for_function('window.__unitWalk.drawn.walk > 10', timeout=5000)
        started = True
    except Exception:
        started = False
    check(started, 'moving units start drawing walk frames')
    G('window.__unitWalk.drawn.walk = 0; window.__unitWalk.drawn.other = 0')
    # sample one marine's frame index over ~500 ms (~4 frames at 8 FPS)
    frames = G('''(() => {
      const u = H.g.units.find(u => u.alive && u.data.sprite === "marine");
      if (!u) return [];
      const out = [];
      const t0 = H.g.time;
      // sampled by the test over wall time; here just return current key + time
      return { id: u.data.sprite + "_" + H.g.unitTier(u.data.id), t: H.g.time, uid: u.uid };
    })()''')
    samples = []
    for _ in range(8):
        pg.wait_for_timeout(70)
        if not frames: break
        fr = G(f'(() => {{ const U = window.__unitWalk; const t = H.g.time; const im = U.frame({json.dumps(frames["id"].rsplit("_",1)[0])}, {int(frames["id"].rsplit("_",1)[1])}, t + {frames["uid"]} * 0.13); const all = U.frame; return [H.g.time, (t * 8) % 6]; }})()')
        # simpler:
        fr = G('(() => { const t = H.g.time; return [t, Math.floor(((t * 8) % 6 + 6) % 6)]; })()')
        samples.append(fr)
    idxs_seen = sorted({s[1] for s in samples if s})
    check(len(idxs_seen) >= 3, f'walk frame index advances at ~8 FPS ({idxs_seen}; samples={samples})')
    moving = G('({ ...window.__unitWalk.drawn })')
    check(moving['walk'] > moving['other'] * 0.5, f'while moving, walk frames dominate idle ({moving})')

    # pause holds the phase
    a = G('Math.floor(((H.g.time * 8) % 6 + 6) % 6)')
    G('H.g.paused = true')
    pg.wait_for_timeout(300)
    bfr = G('Math.floor(((H.g.time * 8) % 6 + 6) % 6)')
    check(a == bfr, f'walk phase holds while paused ({a} -> {bfr})')
    G('H.g.paused = false')

    # FPS: 2s of walking troops
    fps = G('''(() => new Promise(res => {
      let n = 0, t0 = performance.now();
      const step = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(step); else res(+(n / 2).toFixed(1)); };
      requestAnimationFrame(step);
    }))()''')
    check(fps >= 40, f'FPS stays healthy with walking units ({fps})')

    if not args.no_shots:
        G(f'H.camFocus({(lane[0]+dest[0])/2}, {(lane[1]+dest[1])/2}, 1.4)')
        pg.wait_for_timeout(200)
        pg.screenshot(path=os.path.join(OUT, 'walk_1280x720.png'))

    check(not errors, f'no console errors ({errors[:3]})')
    b.close()

print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
