"""t46 e2e: textured first-person ground (Poly Haven CC0 detail textures) on tropical, morro, garden.
Screenshots -> screenshots/t46/.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t46.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='after'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't46'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, name + '.png'))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    for m, f, off in (('tropical', 0.35, (60, 70)), ('morro', 0.55, (50, 60)), ('garden', 0.4, (60, 60))):
        pg.goto(URL + sep + 'map=' + m); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(400); G('H.sandbox(); H.addCredits(90000)')
        p = G(f'H.lanePoint(0, {f})'); q = G(f'H.lanePoint(0, {f + 0.06})')
        G(f'H.deploy("odst", {p["x"] + off[0]}, {p["y"] + off[1]})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.squadIndex("odst"))'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
        check(until('window.__possess && window.__possess.cur && window.__possess.cur.scene', 30000), f'{m}: possessed')
        pg.wait_for_timeout(2500); P('P.el.msg.style.visibility = "hidden"')
        P(f'P.aimAt({q["x"]}, {q["y"]}, 0); P.pitch = -0.32'); pg.mouse.move(800, 480); pg.wait_for_timeout(1200)
        tex = P('(() => { const f = P.scene.getObjectByName("floor"); return !!(f && f.userData.detail); })()')
        if args.tag == 'after': check(tex, f'{m}: floor uses tiled detail textures')
        fps = P('P.fps || 0'); print(f'  {m} fps≈{fps}')
        shot(pg, f'{m}_{args.tag}')
        pg.keyboard.press('e'); pg.wait_for_timeout(400)
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
