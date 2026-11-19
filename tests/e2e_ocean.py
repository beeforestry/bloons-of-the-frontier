"""Ocean e2e (autopilot 2026-11-19): the living first-person sea on El Morro and Isla de Cabras.
Checks via window.__possess.cur.vm.ocean / .ocean: Gerstner swell mode + params per map (El Morro: deep Atlantic, bigger
swell; Cabras: turquoise, calmer), the swell actually animating, the shore foam texture rebuilt from the 0.5 m fine
heights, foam visibly on screen at the shore (pixels with foam on vs off), surf ambience proximity, the low-quality
fallback (coarse grid, no vertex waves) both via ?fpq=low and the runtime slow-frame drop, no console errors.
Usage: /workspace/.venv-pw/bin/python tests/e2e_ocean.py [--url URL] [--tag local] [--no-shots]"""
import argparse, functools, http.server, io, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 'ocean'); os.makedirs(OUT, exist_ok=True)
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
def foam_px(on, off):
    """pixels that get clearly whiter with foam on (same view, foam uniform 0 vs on) -> isolates the foam."""
    a = Image.open(io.BytesIO(on)).convert('L').resize((320, 180)); c = Image.open(io.BytesIO(off)).convert('L').resize((320, 180))
    return sum(1 for x, y in zip(a.tobytes(), c.tobytes()) if x - y > 18)
# (map, deploy x/y, ready cond, kind, shore view: stand x/y, look x/y, dh, inland x/y)
MAPS = (('morro', 1700, 1500, 'fort', 'morro', (3150, 1600, 3800, 1700, -10), (1700, 1500)),
        ('tropical', 1460, 1500, 'cabras', 'cabras', (2900, 935, 3300, 880, -1.6), (2300, 1220)))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 720}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    O = lambda: P('P.vm.ocean')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=200); return True
        except Exception: return False
    def load(mp, q):
        pg.goto(URL + f'?map={mp}&diff=medium&fpq={q}', timeout=90000); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1000)
        pg.mouse.click(5, 5); pg.keyboard.press('Shift'); pg.wait_for_timeout(300)
    def possess_odst(x, y, cond):
        G('H.sandbox(); H.addCredits(90000)'); G('H.g.deployCd = {}'); G(f'H.deploy("odst", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=8000); pg.click('#sp-possess')
        return until(f'window.__possess && window.__possess.cur && window.__possess.cur.vm.{cond} && window.__possess.cur.vm.ocean && window.__possess.cur.vm.ocean.fine', 90000)
    def stand(x, y, ax, ay, dh, wait=3000):
        P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(2000); P(f'P.aimAt({ax}, {ay}, P.eye().y + ({dh}))'); P('P.el.msg && (P.el.msg.style.visibility = "hidden")'); pg.wait_for_timeout(wait)
    amp = {}
    for mp, x, y, cond, kind, view, inland in MAPS:
        load(mp, 'high')
        check(possess_odst(x, y, cond), f'{kind}: possessed an ODST, fine shore heights loaded')
        o = O(); print('  ocean', o)
        check(o['kind'] == kind and o['mode'] == 'full' and o['waves'] == 5 and o['verts'] > 60000, f'{kind}: full ocean ({o["waves"]} Gerstner waves, {o["verts"]} verts)')
        check(P('(() => { const s = P.scene.getObjectByName("sea"); return !!s && s.userData.ocean === true && s.material.type === "ShaderMaterial"; })()'), f'{kind}: "sea" mesh is the ocean shader')
        check(o['shoreCells'] > 100 and o['foamCells'] > o['shoreCells'], f'{kind}: shore / surf zone texture ({o["shoreCells"]} shoreline cells, {o["foamCells"]} surf cells)')
        amp[kind] = o['amp']
        # animation: shader clock + CPU mirror of the swell height move
        t0, h0 = o['time'], P('P.ocean.heightAt(300, 120)'); until(f'window.__possess.cur.vm.ocean.time > {t0} + 0.3', 20000); t1, h1 = O()['time'], P('P.ocean.heightAt(300, 120)')
        check(t1 > t0 and abs(h1 - h0) > 0.003, f'{kind}: swell animating (t {t0}->{t1}, h {h0:.3f}->{h1:.3f} m)')
        lum = P('(() => { const c = P.ocean.mat.uniforms.uDeep.value; return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b; })()'); amp[kind + '_lum'] = lum
        # foam on screen at the shore: near-white pixels with foam on vs off
        stand(*view[:5])
        on = pg.screenshot(); P('P.ocean.mat.uniforms.uFoam.value = 0'); pg.wait_for_timeout(1500); off = pg.screenshot(); P(f'P.ocean.mat.uniforms.uFoam.value = {0.9 if kind == "cabras" else 1.0}')
        fp = foam_px(on, off)
        check(fp > 100, f'{kind}: shore foam visible on screen ({fp} px whiter with foam on vs off, of 57600)')
        if not args.no_shots: open(os.path.join(OUT, f'{args.tag}_fp_{kind}_shore.png'), 'wb').write(on)
        near_shore = O()['near']; P(f'P.obj.x = {inland[0]}; P.obj.y = {inland[1]}'); pg.wait_for_timeout(2500); near_in = O()['near']
        check(near_shore > near_in, f'{kind}: surf ambience proximity louder at the shore ({near_shore} vs inland {near_in})')
        # runtime slow-frame fallback -> cheap ocean
        P('P.dropToLow()'); pg.wait_for_timeout(1500); o = O()
        check(o['mode'] == 'low' and o['waves'] == 0 and o['verts'] < 1000, f'{kind}: slow frames -> low ocean ({o["mode"]}, {o["verts"]} verts)')
        P('P.exit()'); pg.wait_for_timeout(800)
    check(amp['morro'] > amp['cabras'] * 1.5, f'El Morro swell stronger than Cabras ({amp["morro"]} vs {amp["cabras"]} m)')
    check(amp['morro_lum'] < amp['cabras_lum'], f'El Morro deep water darker than Cabras turquoise ({amp["morro_lum"]:.4f} vs {amp["cabras_lum"]:.4f})')
    # ?fpq=low (phones): coarse grid, no vertex waves, single normal sample, foam kept
    load('tropical', 'low'); check(possess_odst(1460, 1500, 'cabras'), 'low: possessed on Isla de Cabras')
    o = O(); print('  ocean low', o)
    check(o['mode'] == 'low' and o['waves'] == 0 and o['amp'] == 0 and o['verts'] < 1000, f'low: no vertex waves, coarse grid ({o["verts"]} verts)')
    check(P('!!(P.ocean.mat.defines && P.ocean.mat.defines.OCEAN_LOW)') and o['foamCells'] > 0, 'low: cheap shader path, foam still on')
    t0 = o['time']; until(f'window.__possess.cur.vm.ocean.time > {t0} + 0.2', 20000); check(O()['time'] > t0, 'low: normal-map ripples still animate')
    P('P.exit()'); pg.wait_for_timeout(500)
    check(not errors, f'no console errors ({errors[:3]})')
    b.close()
print('PASS' if not fails else f'FAIL ({len(fails)})', fails)
raise SystemExit(1 if fails else 0)
