"""Ambience e2e (autopilot 2026-11-18): first-person ambience bed. El Morro: deep cliff surf + strong Atlantic wind (more up high) + rare gulls;
Isla de Cabras: brighter lapping surf + breeze + frequent gulls. All WebAudio-synthesized. Checks via
window.__game.ambSfx(): kind per map, level > 0, gull calls + wave crashes actually scheduled, off on pause /
mute / leaving first person, no console errors.
Usage: /workspace/.venv-pw/bin/python tests/e2e_ambience.py [--url URL] [--tag local] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 'ambience'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url.rstrip('/') + '/index.html'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 1440, 'height': 860}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    A = lambda: G('H.ambSfx()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=200); return True
        except Exception: return False
    def possess_odst(x, y, cond):
        G('H.sandbox(); H.addCredits(90000)'); G('H.g.deployCd = {}'); G(f'H.deploy("odst", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=8000); pg.click('#sp-possess')
        ok = until(f'window.__possess && window.__possess.cur && window.__possess.cur.vm.{cond}', 60000)
        P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(1500); return ok
    for mp, x, y, cond, kind in (('morro', 1700, 1500, 'fort', 'morro'), ('tropical', 1460, 1500, 'cabras', 'cabras')):
        pg.goto(URL + f'?map={mp}&diff=medium&fpq=low', timeout=90000); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1000)
        pg.mouse.click(5, 5); pg.keyboard.press('Shift'); pg.wait_for_timeout(300)  # user gesture -> WebAudio unlock
        check(A()['kind'] is None, f'{kind}: no ambience in the 2D view')
        check(possess_odst(x, y, cond), f'{kind}: possessed an ODST')
        check(until(f'H.ambSfx().kind === "{kind}"', 20000), f'{kind}: ambience bed is {kind} ({A()})')
        a = A(); check(a['level'] > 0 and a['wind'] > 0, f'{kind}: surf + wind audible (level {a["level"]}, wind {a["wind"]}, eye h {a["h"]} m)')
        ok = until('H.ambSfx().gulls >= 1 && H.ambSfx().crashes >= 1', 40000); a = A()
        check(ok, f'{kind}: gull call + breaker crash synthesized (gulls {a["gulls"]}, crashes {a["crashes"]})')
        if kind == 'morro':
            # higher eye -> more wind: lift the camera reading by standing on the walls is map-specific, so compare the formula ends
            w0 = a['wind']; check(0.15 <= w0 <= 0.47, f'morro wind in range ({w0})')
            G('H.g.paused = true'); check(until('H.ambSfx().kind === null', 10000), 'paused -> ambience fades out'); G('H.g.paused = false')
            check(until('H.ambSfx().kind === "morro"', 10000), 'unpaused -> ambience back')
            # mute via the 🔉 button: 0.35 -> 0.7 -> muted
            G('document.getElementById("btn-sfx").click()'); G('document.getElementById("btn-sfx").click()'); check(until('H.ambSfx().kind === null', 10000), 'muted -> ambience off')
            G('document.getElementById("btn-sfx").click()'); check(until('H.ambSfx().kind === "morro"', 10000), 'unmuted -> ambience back')
        if not args.no_shots: pg.screenshot(path=os.path.join(OUT, f'{args.tag}_fp_{kind}.png'))
        P('P.exit()'); pg.wait_for_timeout(800)
        check(A()['kind'] is None, f'{kind}: leaving first person stops the ambience')
    check(not errors, f'no console errors ({errors[:3]})')
    b.close()
print('PASS' if not fails else f'FAIL ({len(fails)})', fails)
raise SystemExit(1 if fails else 0)
