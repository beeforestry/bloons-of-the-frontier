"""Cliff spray e2e (autopilot 2026-11-23): white water where the swell hits El Morro's cliffs / sea walls and the
Isla de Cabras riprap, in first person (src/fps/spray.ts, sites from Ocean.setShore).
Checks via window.__possess.cur.vm.spray / .spray: spray sites found along the shore from the fine heights, swell-timed
bursts near the eye, spray visible on screen (pixels with the spray on vs hidden), El Morro spray taller than Cabras',
ambience breaker crashes throw synced bursts, the particle cap holds under spam, freezes while paused, the low-quality
path (smaller cap, timer bursts) via the slow-frame drop and ?fpq=low, no console errors.
Usage: /workspace/.venv-pw/bin/python tests/e2e_spray.py [--url URL] [--tag local] [--no-shots]"""
import argparse, functools, http.server, io, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 'spray'); os.makedirs(OUT, exist_ok=True)
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
def white_px(on, off):
    a = Image.open(io.BytesIO(on)).convert('L').resize((320, 180)); c = Image.open(io.BytesIO(off)).convert('L').resize((320, 180))
    return sum(1 for x, y in zip(a.tobytes(), c.tobytes()) if x - y > 14)
# (map, deploy x/y, ready cond, kind, cliff view: stand x/y, look x/y, dh, min sites, min spray height m)
MAPS = (('morro', 1700, 1500, 'fort', 'morro', (3136, 1464, 3280, 1320, -6), 200, 3.0),
        ('tropical', 1460, 1500, 'cabras', 'cabras', (3096, 1072, 3096, 880, -2), 200, 0.8))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 720}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    S = lambda: P('({ ...P.vm.spray })')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=200); return True
        except Exception: return False
    def load(mp, q):
        pg.goto(URL + f'?map={mp}&diff=medium&fpq={q}', timeout=90000); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1000)
        pg.mouse.click(5, 5); pg.keyboard.press('Shift'); pg.wait_for_timeout(300)
    def possess_odst(x, y, cond):
        G('H.sandbox(); H.addCredits(90000)'); G('H.g.deployCd = {}'); G(f'H.deploy("odst", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=8000); pg.click('#sp-possess')
        return until(f'window.__possess && window.__possess.cur && window.__possess.cur.vm.{cond} && window.__possess.cur.vm.ocean && window.__possess.cur.vm.ocean.fine && window.__possess.cur.vm.spray', 90000)
    def stand(x, y, ax, ay, dh, wait=3000):
        P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(2000); P(f'P.aimAt({ax}, {ay}, P.eye().y + ({dh}))'); P('P.el.msg && (P.el.msg.style.visibility = "hidden")'); pg.wait_for_timeout(wait)
    tall = {}
    for mp, x, y, cond, kind, view, min_sites, min_h in MAPS:
        load(mp, 'high')
        check(possess_odst(x, y, cond), f'{kind}: possessed an ODST, fine shore heights + spray ready')
        s = S(); print('  spray', s)
        check(s['sites'] >= min_sites and s['mode'] == 'full' and s['cap'] == 900, f'{kind}: spray sites along the cliffs / sea walls / riprap ({s["sites"]} sites, cap {s["cap"]})')
        check(P('(() => { const o = P.scene.getObjectByName("spray"); return !!o && o.type === "Points"; })()'), f'{kind}: one pooled "spray" Points draw')
        stand(*view)
        s0 = S(); pg.wait_for_timeout(6000); s1 = S(); print('  spray', s1)
        swell = (s1['bursts'] - s1['crashBursts']) - (s0['bursts'] - s0['crashBursts'])
        check(s1['near'] > 20 and swell > 0 and s1['spawned'] > s0['spawned'], f'{kind}: swell-timed bursts near the eye ({swell} in 6 s, {s1["near"]} sites in range)')
        mh = 0
        for _ in range(12): pg.wait_for_timeout(500); mh = max(mh, S()['maxH'])
        tall[kind] = mh
        check(mh >= min_h, f'{kind}: spray thrown up the wall ({mh:.2f} m above sea level, want >= {min_h})')
        # synced breaker: the ambience crash counter drives a big burst
        amb = G('H.ambSfx()'); print('  amb', amb)
        if amb['crashes'] > 0: check(S()['crashBursts'] >= 1, f'{kind}: ambience breaker crashes ({amb["crashes"]}) threw synced bursts ({S()["crashBursts"]})')
        cb = S()['crashBursts']; best = P('P.spray.crash(P.camera)')
        check(best >= 0 and S()['crashBursts'] == cb + 1, f'{kind}: breaker burst lands on a cliff site in view (site {best})')
        pg.wait_for_timeout(600)
        on = pg.screenshot(); P('P.spray.points.visible = false'); pg.wait_for_timeout(250); off = pg.screenshot(); P('P.spray.points.visible = true')
        wp = white_px(on, off)
        check(wp > 60, f'{kind}: spray visible on screen ({wp} px whiter with spray vs hidden, of 57600)')
        if not args.no_shots: open(os.path.join(OUT, f'{args.tag}_fp_{kind}_spray.png'), 'wb').write(on)
        # cap under spam
        P('for (let i = 0; i < 40; i++) P.spray.crash(P.camera)'); pg.wait_for_timeout(300); s = S()
        check(0 < s['live'] <= s['cap'], f'{kind}: particle cap holds under spam ({s["live"]}/{s["cap"]})')
        # paused: frozen
        G('H.g.paused = true'); pg.wait_for_timeout(500); b0 = S()['bursts']; pg.wait_for_timeout(2500); b1 = S()['bursts']; G('H.g.paused = false')
        check(b1 == b0, f'{kind}: no new spray while paused ({b0} -> {b1})')
        # slow frames -> low: smaller cap, still some white water (timer bursts)
        P('P.dropToLow()'); pg.wait_for_timeout(2500); s = S(); b0 = s['bursts']
        until(f'window.__possess.cur.vm.spray.bursts > {b0}', 20000); s = S()
        check(s['mode'] == 'low' and s['cap'] == 220 and s['live'] <= 220 and s['bursts'] > b0, f'{kind}: slow frames -> low spray (cap {s["cap"]}, live {s["live"]}, bursts {b0}->{s["bursts"]})')
        P('P.exit()'); pg.wait_for_timeout(800)
    check(tall['morro'] > tall['cabras'] * 1.5, f'El Morro cliff spray taller than the Cabras riprap splash ({tall["morro"]:.2f} vs {tall["cabras"]:.2f} m)')
    # ?fpq=low (phones)
    load('morro', 'low'); check(possess_odst(1700, 1500, 'fort'), 'low: possessed on El Morro')
    stand(*MAPS[0][5][:5]); s = S(); b0 = s['bursts']; until(f'window.__possess.cur.vm.spray.bursts > {b0}', 20000); s = S(); print('  spray low', s)
    check(s['mode'] == 'low' and s['cap'] == 220 and s['bursts'] > b0, f'low: timer bursts, cap {s["cap"]} ({s["bursts"]} bursts)')
    P('P.exit()'); pg.wait_for_timeout(500)
    check(not errors, f'no console errors ({errors[:3]})')
    b.close()
print('PASS' if not fails else f'FAIL ({len(fails)})', fails)
raise SystemExit(1 if fails else 0)
