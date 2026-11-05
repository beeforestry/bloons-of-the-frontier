"""t56 part C: Tropical Island (real Isla de Cabras) 2D + first-person screenshots and checks.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t56c.py --tag before|after [--url URL]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--tag', default='after'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't56'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url.rstrip('/') + '/index.html'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    pg.goto(URL + '?map=tropical&diff=medium', timeout=60000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1500)
    m = G('({ w: H.g.map.width, mpp: H.g.map.mpp, lanes: H.g.map.lanes.length, land: !!H.g.map.grid.land, props: (H.g.map.terrain?.props || []).length, walls: (H.g.map.walls || []).length })'); print('  map', m)
    check(G('JSON.stringify(H.g.squads.map(s => s.data.id)).includes("farmhand")'), 'Sprout Farmhand pre-placed')
    pg.screenshot(path=os.path.join(OUT, f'tropical_2d_{args.tag}.png'))
    G('H.sandbox(); H.addCredits(90000)'); G('H.startWave()'); pg.wait_for_timeout(9000)
    check(G('H.g.enemies.filter(e => e.alive).length') > 0, 'enemies walk the lanes'); pg.screenshot(path=os.path.join(OUT, f'tropical_2d_midwave_{args.tag}.png'))
    pt = G('H.lanePoint(0, 0.5)')
    G('H.g.deployCd = {}'); G(f'H.deploy("odst", {pt["x"]}, {pt["y"] + 90})'); pg.wait_for_timeout(1200)
    G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
    ok = until('window.__possess && window.__possess.cur && window.__possess.cur.scene', 40000)
    until('window.__possess.cur.vm.kind.startsWith("gun_")', 20000); pg.wait_for_timeout(4000)
    try: P('P.el.msg.style.visibility = "hidden"')
    except Exception: pass
    check(ok, 'first person entered'); pg.screenshot(path=os.path.join(OUT, f'tropical_fp_{args.tag}.png'))
    print('errors:', errors[:5]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails or 'none')
