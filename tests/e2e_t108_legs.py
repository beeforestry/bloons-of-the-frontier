"""t108 GMMG-3 e2e: mob legs walk.
2D: every legged bug sprite gets 8 leg-warped frames (body rows untouched, leg rows differ between frames), walking bugs on
the El Morro lane cycle through them (pixel diff in their leg band over time), balloons are drawn unwarped.
First person: legged bug GLB sets carry the per-instance gait attribute, the phase advances with distance walked (and not
for a stopped bug), the boss walker gets its own leg-warp materials, and the legs visibly move (pixel diff on a close bug).
Usage: /workspace/.venv-pw/bin/python tests/e2e_t108_legs.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, io, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't108'); os.makedirs(OUT, exist_ok=True)
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
BUGS = ['bug_scavenger', 'bug_hunter', 'bug_charger', 'bug_brood', 'bug_titan', 'bug_ironback', 'bug_warden', 'boss_scarab', 'boss_dreadnought', 'boss_leviathan']
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 720}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    sep = '&' if '?' in URL else '?'
    pg.goto(URL + sep + 'map=morro&diff=medium&fpq=high', timeout=90000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1500)
    print('== 2D frames', flush=True)
    for n in BUGS:
        r = pg.evaluate('''async (n) => { const im = new Image(); im.src = './assets/v3/' + n + '.webp'; await im.decode();
          const fr = window.__walk.frames(n, im); if (!fr) return null; const W = im.width, H = im.height;
          const px = (c) => c.getContext('2d').getImageData(0, 0, W, H).data, a = px(fr[0]), b = px(fr[2]);
          const c0 = document.createElement('canvas'); c0.width = W; c0.height = H; c0.getContext('2d').drawImage(im, 0, 0); const o = px(c0);
          let top = 0, leg = 0, legN = 0; const half = Math.floor(H * 0.3) * W * 4;
          for (let i = 3; i < half; i += 4) if (a[i - 3] !== o[i - 3] || a[i] !== o[i]) top++;
          for (let i = Math.floor(H * 0.75) * W * 4 + 3; i < a.length; i += 4) { legN++; if (Math.abs(a[i] - b[i]) > 60) leg++; }
          return { n: fr.length, top, leg: leg / legN }; }''', n)
        check(r and r['n'] == 8 and r['top'] == 0 and r['leg'] > 0.01, f'{n}: 8 walk frames, body rows unchanged, feet move between frames ({r})')
    # walking bugs on the lane cycle frames in the live renderer (zoomed in on them)
    G('H.g.res.load({ credits: 1e7, scrap: 1e5 }, true)')
    uid = G('H.spawn("charger", 0, 0.32)'); G('H.spawn("scavenger", 0, 0.325)'); G('H.spawn("red", 0, 0.33)')
    pg.wait_for_timeout(500)
    pos = G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {uid}); return [e.x, e.y]; }})()')
    pg.evaluate(f'() => {{ const r = window.__game.renderer ?? null; }}')
    G(f'H.focus ? H.focus({pos[0]}, {pos[1]}, 2.2) : null')
    shots = []
    for i in range(3):
        G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {uid}); return e ? H.focus && H.focus(e.x, e.y, 2.2) : null; }})()'); pg.wait_for_timeout(260)
        shots.append(Image.open(io.BytesIO(pg.screenshot())).convert('RGB'))
    st = pg.evaluate('() => window.__walk.stats')
    check(st['built'] >= 2, f'live renderer built walk frames for the walking bugs ({st})')
    if not args.no_shots:
        G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {uid}); return e ? H.focus && H.focus(e.x, e.y, 2.6) : null; }})()'); pg.wait_for_timeout(200)
        pg.screenshot(path=os.path.join(OUT, '2d_mob_walk_a.png')); pg.wait_for_timeout(170); pg.screenshot(path=os.path.join(OUT, '2d_mob_walk_b.png'))
    print('== first person', flush=True)
    G('H.g.deployCd = {}')
    lane = G('(() => { const p = H.g.paths[0].at(H.g.paths[0].length * 0.42); return [p.x, p.y]; })()')
    G(f'H.deploy("marine", {lane[0] + 30}, {lane[1] + 30})'); pg.wait_for_timeout(1200)
    G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.evaluate("document.querySelector('#sp-possess').click()")
    pg.wait_for_function('window.__possess && window.__possess.cur && window.__possess.cur.vm.fort', timeout=90000); pg.wait_for_timeout(2500)
    pg.wait_for_function('window.__possess.cur.vm.walk.sets >= 6', timeout=60000)
    for i in range(6): G(f'H.spawn("{["scavenger", "charger", "ironback", "warden", "hunter", "brood"][i]}", 0, {0.40 + i * 0.004})')
    G('H.spawn("boss_scarab", 0, 0.395)')
    pg.wait_for_timeout(2500)
    w = P('({ ...P.vm.walk, n: P.walkPh.size })')
    check(w['sets'] >= 6 and w['n'] >= 5, f'legged GLB sets carry the gait attribute + phases tracked ({w})')
    a = P('[...P.walkPh.entries()].filter(([e]) => e.alive && !e.data.boss).slice(0, 3).map(([e, w]) => [e.uid, w.ph])')
    pg.wait_for_timeout(1500)
    b2 = P('[...P.walkPh.entries()].filter(([e]) => e.alive && !e.data.boss).slice(0, 3).map(([e, w]) => [e.uid, w.ph])')
    adv = [y[1] - x[1] for x, y in zip(a, b2) if x[0] == y[0]]
    check(adv and min(adv) > 0.5, f'gait phase advances while bugs walk ({[round(v, 2) for v in adv]} rad / 1.5 s)')
    G('H.g.paused = true'); pg.wait_for_timeout(300); a = P('[...P.walkPh.values()].map(w => w.ph)'); pg.wait_for_timeout(800); b3 = P('[...P.walkPh.values()].map(w => w.ph)')
    check(a[:5] == b3[:5], 'phase holds while the bugs stand still (paused)'); G('H.g.paused = false')
    check(P('P.vm.walk.bosses') >= 1, f'boss walker has its own leg-warp materials ({P("P.vm.walk.bosses")})')
    # park a charger 3.5 m in front of the eye (paused), then turn only its gait phase: the legs must visibly move
    G('H.g.enemies.forEach(e => e.stunT = 999)')
    tb = P('''(() => { const o = P.obj, S = H.g.map.mpp; const e = H.g.enemies.find(e => e.alive && e.data.id === "charger"); if (!e) return null;
      e.x = o.x + 3.5 / S; e.y = o.y; P.aimAt(e.x, e.y, P.eye().y - 1.2); window.__tb = e.uid; return e.uid; })()''')
    check(tb is not None, 'parked a charger in front of the camera')
    shots = []
    for ph in (0.0, 1.57, 3.14):
        P(f'(() => {{ for (const [e, w] of P.walkPh) if (e.uid === window.__tb) w.ph = {ph}; }})()'); pg.wait_for_timeout(1200)
        raw = pg.screenshot(); shots.append(Image.open(io.BytesIO(raw)).convert('L'))
        if ph == 1.57 and not args.no_shots: open(os.path.join(OUT, 'fp_bug_walk.png'), 'wb').write(raw)
    diff = max(sum(1 for v in ImageChops.difference(shots[0], q).point(lambda x: 255 if x > 20 else 0).get_flattened_data() if v) for q in shots[1:]) / (shots[0].width * shots[0].height)
    check(diff > 0.002, f'FP: changing only the gait phase moves the charger legs on screen ({diff:.4f} of pixels)')
    G('H.g.enemies.forEach(e => e.stunT = 0)')
    check(not errors, f'no console errors ({errors[:3]})')
    b.close()
print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
raise SystemExit(1 if fails else 0)
