"""Wet shore e2e (autopilot 2026-11-25): in first person the band just above the waterline and the cliff / sea-wall /
riprap faces the spray reaches are darker, more saturated and glossy (El Morro: tall spray-soaked cliffs + a dark algae
film at the wave-washed foot; Isla de Cabras: a wet-sand / wet-rubble band). src/fps/groundTex.ts (GWET), Ocean.wetAt,
Possess.bakeWet. Checks via window.__possess.cur.vm.wet: per-vertex wetness baked on the 3 m floor + the 0.5 m fine mesh
(after the fine heights load), band / soaked vertex counts, bake time; the shore view gets darker with wet on vs off
(pixel diff), an inland view doesn't change, El Morro has more spray-soaked rock than Cabras, the ?fpq=low path, no
shader / console errors. Usage: /workspace/.venv-pw/bin/python tests/e2e_wet.py [--url URL] [--tag local] [--no-shots]"""
import argparse, functools, http.server, io, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local')
ap.add_argument('--only'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 'wet'); os.makedirs(OUT, exist_ok=True)
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
def diff_px(on, off):
    a = Image.open(io.BytesIO(on)).convert('L').resize((320, 180)); c = Image.open(io.BytesIO(off)).convert('L').resize((320, 180))
    pa, pc = a.tobytes(), c.tobytes()
    return sum(1 for x, y in zip(pa, pc) if y - x > 10), sum(1 for x, y in zip(pa, pc) if x - y > 10)
# (map, deploy x/y, ready cond, kind, shore spot px (El Morro: the cliff foot under the north-west bluff; Cabras: the wet sand
#  by the south-east beach), metres to stand back inland, inland view (stand x/y, look x/y, dh), min band verts, min soaked verts)
MAPS = (('morro', 1700, 1500, 'fort', 'morro', (1664, 2912), 14, (1700, 1500, 1500, 1500, -2), 3000, 3000),
        ('tropical', 1460, 1500, 'cabras', 'cabras', (4292, 2012), 10, (1460, 1500, 1300, 1500, -2), 3000, 300))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 720}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    W = lambda: P('({ ...P.vm.wet })')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=200); return True
        except Exception: return False
    def load(mp, q):
        pg.goto(URL + f'?map={mp}&diff=medium&fpq={q}', timeout=90000); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1000)
        pg.mouse.click(5, 5); pg.keyboard.press('Shift'); pg.wait_for_timeout(300)
    def possess_odst(x, y, cond):
        G('H.sandbox(); H.addCredits(90000)'); G('H.g.deployCd = {}'); G(f'H.deploy("odst", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=8000); pg.click('#sp-possess')
        return until(f'window.__possess && window.__possess.cur && window.__possess.cur.vm.{cond} && window.__possess.cur.vm.ocean && window.__possess.cur.vm.ocean.fine && window.__possess.cur.vm.wet && window.__possess.cur.vm.wet.bakes >= 2', 90000)
    def stand(x, y, ax, ay, dh, wait=3000):
        P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(2000); P(f'P.aimAt({ax}, {ay}, P.eye().y + ({dh}))'); P('P.el.msg && (P.el.msg.style.visibility = "hidden")'); pg.wait_for_timeout(wait)
    def shore_view(px, py, back, wait=3000):
        # stand `back` m inland of the spot (up the distance-to-water gradient) and look at the waterline just past it
        g = P(f'(() => {{ const o = P.ocean, x = {px} * 0.125, z = {py} * 0.125; return [o.wetAt(x + 3, z)[0] - o.wetAt(x - 3, z)[0], o.wetAt(x, z + 3)[0] - o.wetAt(x, z - 3)[0]]; }})()')
        l = (g[0] ** 2 + g[1] ** 2) ** 0.5 or 1; gx, gz = g[0] / l, g[1] / l
        P(f'P.obj.x = {px + gx * back / 0.125}; P.obj.y = {py + gz * back / 0.125}'); pg.wait_for_timeout(2000)
        P(f'P.aimAt({px - gx * 24}, {py - gz * 24}, P.ocean.level)'); P('P.el.msg && (P.el.msg.style.visibility = "hidden")'); pg.wait_for_timeout(wait)
    def onoff():
        # game paused (overlay + swaying gun hidden), sea + spray frozen so only the wet shading differs between the two frames
        G('H.g.paused = true'); P('P.el["pause-ov"].style.display = "none"; P.gun.visible = false'); P('P.spray && (P.spray.points.visible = false)'); P('P.ocean.update = () => {}'); P('P.setWet(true)'); pg.wait_for_timeout(600); on = pg.screenshot()
        P('P.setWet(false)'); pg.wait_for_timeout(400); off = pg.screenshot(); P('P.setWet(true)'); P('delete P.ocean.update'); P('P.spray && (P.spray.points.visible = true)'); G('H.g.paused = false'); P('P.el["pause-ov"].style.display = ""; P.gun.visible = true')
        return on, off
    soaked = {}
    for mp, x, y, cond, kind, spot, back, inland, min_band, min_soak in MAPS:
        if args.only and args.only != kind: continue
        load(mp, 'high')
        check(possess_odst(x, y, cond), f'{kind}: possessed an ODST, fine heights + wet shore baked')
        w = W(); print('  wet', w)
        check(w['meshes'] >= 2 and w['verts'] > 50000 and w['band'] >= min_band and w['soaked'] >= min_soak and w['ms'] < 1500,
              f'{kind}: wetness baked on floor + fine mesh ({w["meshes"]} meshes, {w["verts"]} verts, band {w["band"]}, soaked {w["soaked"]}, {w["ms"]} ms)')
        soaked[kind] = w['tall']
        sa = P('P.samplerAudit()'); print('  samplers', sa)
        check(sa['errors'] == 0 and sa['max'] <= 15, f'{kind}: no shader errors, no extra texture units ({sa["max"]} of {sa["limit"]})')
        live = P(f'P.ocean.wetAt({spot[0]} * 0.125, {spot[1]} * 0.125)'); check(live[0] < 4, f'{kind}: shore spot is by the water ({live[0]:.1f} m, spray {live[1]:.2f})')
        shore_view(*spot, back)
        on, off = onoff(); dk, br = diff_px(on, off); print('  shore darker/brighter px', dk, br)
        check(dk > 400, f'{kind}: the shore / cliff foot reads wet on screen ({dk} px darker with wet on vs off, of 57600)')
        if not args.no_shots:
            open(os.path.join(OUT, f'{args.tag}_fp_{kind}_wet.png'), 'wb').write(on); open(os.path.join(OUT, f'{args.tag}_fp_{kind}_dry.png'), 'wb').write(off)
        stand(*inland)
        on, off = onoff(); dk2, br2 = diff_px(on, off); print('  inland darker/brighter px', dk2, br2)
        if not args.no_shots: open(os.path.join(OUT, f'{args.tag}_fp_{kind}_inland.png'), 'wb').write(on); open(os.path.join(OUT, f'{args.tag}_fp_{kind}_inland_dry.png'), 'wb').write(off)
        check(dk2 + br2 < 60, f'{kind}: inland ground unchanged ({dk2 + br2} px differ)')
        P('P.exit()'); pg.wait_for_timeout(800)
    if not args.only:
        check(soaked['morro'] > 20 and soaked['cabras'] == 0, f'only El Morro\'s cliffs are soaked more than 2 m up ({soaked["morro"]} vs {soaked["cabras"]} verts)')
        load('morro', 'low'); check(possess_odst(1700, 1500, 'fort'), 'low: possessed on El Morro, wet shore baked')
        shore_view(*MAPS[0][5], MAPS[0][6]); on, off = onoff(); dk, br = diff_px(on, off); print('  low darker px', dk)
        check(dk > 300 and P('P.vm.quality') == 'low', f'low: the wet shore still shows ({dk} px darker)')
        if not args.no_shots: open(os.path.join(OUT, f'{args.tag}_fp_morro_low_wet.png'), 'wb').write(on)
        P('P.exit()'); pg.wait_for_timeout(500)
    check(not errors, f'no console errors ({errors[:3]})')
    b.close()
print('PASS' if not fails else f'FAIL ({len(fails)})', fails)
raise SystemExit(1 if fails else 0)
