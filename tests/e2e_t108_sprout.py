"""t108 GMMG-4 e2e: the Sprout Farmhand collector has its own Blender GLB in first person (unit_farmhand_0 / _1, modelled on
public/assets/v3/farmhand_0/1.webp). Possess a marine beside the free farmhand, check the per-tier GLB loads and is drawn,
and save first-person shots next to the 2D sprite.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t108_sprout.py [--url URL] [--no-shots]"""
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
    G('H.g.res.load({ credits: 1e7, scrap: 1e5 }, true)')
    f = G('(() => { const f = H.g.units.find(u => u.alive && u.squad.data.id === "farmhand"); return f ? [f.x, f.y] : null; })()')
    check(f is not None, f'free Sprout Farmhand exists at match start ({f})')
    # open ground on the lane (the farmhand starts inside the fort by the HQ, where walls block the view)
    lane = G('(() => { const p = H.g.paths[0].at(H.g.paths[0].length * 0.42); return [p.x, p.y]; })()')
    G('H.g.deployCd = {}'); G(f'H.deploy("marine", {lane[0] + 30}, {lane[1] + 30})'); pg.wait_for_timeout(1200)
    G('H.selectSquad(H.g.squads.findIndex(s => s.data.id === "marine"))'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.evaluate("document.querySelector('#sp-possess').click()")
    pg.wait_for_function('window.__possess && window.__possess.cur && window.__possess.cur.vm', timeout=60000); pg.wait_for_timeout(2500)
    # freeze the farmhand ~2.6 m in front of the camera, facing it, and aim at its chest
    P('''(() => { const o = P.obj, S = H.g.map.mpp, f = H.g.units.find(u => u.alive && u.squad.data.id === "farmhand");
      const x = o.x + 2.6 / S, y = o.y + 0.45 / S; window.__pinXY = [x, y]; window.__pinF = true;
      f.update = () => {}; f.x = x; f.y = y; f.facing = -1; // freeze its AI (facing the camera)
      P.aimAt(x, y, P.groundAt(x, y) + 0.55); })()''')
    def wait_glb(n):
        try: pg.wait_for_function(f'window.__possess.cur.vm.unitGlbLoaded.includes("{n}")', timeout=60000); return True
        except Exception: return False
    def shot(name):
        P('P.aimAt(window.__pinXY[0], window.__pinXY[1], P.groundAt(window.__pinXY[0], window.__pinXY[1]) + 0.55)'); pg.wait_for_timeout(2500); raw = pg.screenshot()
        if not args.no_shots: open(os.path.join(OUT, name), 'wb').write(raw)
        im = Image.open(io.BytesIO(raw)).convert('RGB'); W, H = im.size; c = im.crop((W // 2 - 150, H // 2 - 220, W // 2 + 150, H // 2 + 60))
        green = sum(1 for (r, g, bb) in c.get_flattened_data() if g > r + 12 and g > bb + 20) / (c.width * c.height); return im, green
    for t, spr in ((0, 'farmhand_0'), (1, 'farmhand_1')):
        G(f'H.g.unitTiers.farmhand = {t}')
        glb = f'unit_farmhand_{t}'
        check(wait_glb(glb), f'{glb}.glb loads in first person')
        pg.wait_for_timeout(1500)
        ug = P('P.vm.unitGlb.farmhand || []')
        check(glb in ug, f'the farmhand is drawn with {glb} ({ug})')
        im, green = shot(f'fp_sprout_{t}.png')
        check(green > (0.08 if t == 0 else 0.04), f'leafy green sprout fills the view centre ({green:.3f}; the Foreman is half hi-vis vest)')
        # side by side with the 2D painted sprite
        sp = Image.open(os.path.join(ROOT, 'public/assets/v3', spr + '.webp')).convert('RGBA'); k = im.height * 0.55 / sp.height
        sp = sp.resize((int(sp.width * k), int(sp.height * k)), Image.LANCZOS)
        out = Image.new('RGB', (im.width + sp.width + 40, im.height), (34, 36, 40)); out.paste(im, (0, 0)); out.paste(sp, (im.width + 20, (im.height - sp.height) // 2), sp)
        if not args.no_shots: out.save(os.path.join(OUT, f'sprout3d_vs_2d_{t}.png'))
    check(not errors, f'no console errors ({errors[:3]})')
    b.close()
print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
