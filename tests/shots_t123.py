"""t123 screenshots: El Morro / Isla de Cabras top view with the enemy lanes drawn over the map (desktop 1920x1080 and
phone 390x844), plus first-person views of the OSM-placed buildings and the Old San Juan backdrop.
Usage: /workspace/.venv-pw/bin/python tests/shots_t123.py --dist DIR --tag before|after [--no-fp]
Output: screenshots/t123/<tag>_<map>_2d_1920.png, <tag>_<map>_2d_390.png, <tag>_<map>_fp_*.png"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--dist', default=os.path.join(ROOT, 'dist')); ap.add_argument('--tag', default='after'); ap.add_argument('--no-fp', action='store_true'); ap.add_argument('--no-2d', action='store_true'); ap.add_argument('--views', default=''); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't123'); os.makedirs(OUT, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=args.dist)); threading.Thread(target=httpd.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
OSM = json.load(open(os.path.join(ROOT, 'src', 'data', 'osm.generated.json')))['maps']
OVERLAY = r"""(([lanes, blds, label]) => {
  const H = window.__game, cv = document.querySelector('canvas'), r = cv.getBoundingClientRect();
  let o = document.getElementById('t123ov'); if (o) o.remove();
  o = document.createElement('canvas'); o.id = 't123ov'; o.width = innerWidth; o.height = innerHeight;
  Object.assign(o.style, { position: 'fixed', left: '0', top: '0', pointerEvents: 'none', zIndex: 99999 }); document.body.appendChild(o);
  const c = o.getContext('2d'), P = (x, y) => { const s = H.worldToScreen(x, y); return [s.x + r.left, s.y + r.top]; };
  const cols = ['#00e5ff', '#ffd400', '#ff5ad1'];
  lanes.forEach((L, i) => { c.lineWidth = 4; c.strokeStyle = '#000a'; c.beginPath(); L.forEach(([x, y], k) => { const [a, b] = P(x, y); k ? c.lineTo(a, b) : c.moveTo(a, b); }); c.stroke();
    c.lineWidth = 2.2; c.strokeStyle = cols[i % 3]; c.stroke();
    const m = L[Math.floor(L.length * 0.3)], [a, b] = P(m[0], m[1]); c.font = 'bold 14px sans-serif'; c.fillStyle = cols[i % 3]; c.strokeStyle = '#000'; c.lineWidth = 3; c.strokeText('L' + i, a + 6, b - 6); c.fillText('L' + i, a + 6, b - 6); });
  for (const p of blds) { c.lineWidth = 2; c.strokeStyle = '#ff40ff'; c.beginPath(); p.forEach(([x, y], k) => { const [a, b] = P(x, y); k ? c.lineTo(a, b) : c.moveTo(a, b); }); c.closePath(); c.stroke(); }
  c.font = 'bold 15px sans-serif'; c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 3; c.strokeText(label, 12, innerHeight - 14); c.fillText(label, 12, innerHeight - 14);
})"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    for vw, vh, mob in (() if args.no_2d else ((1920, 1080, False), (390, 844, True))):
        ctx = b.new_context(viewport={'width': vw, 'height': vh}, is_mobile=mob, has_touch=mob, device_scale_factor=2 if mob else 1)
        ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
        pg = ctx.new_page()
        for mid in ('morro', 'tropical'):
            pg.goto(f'{URL}?map={mid}&diff=medium', timeout=60000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1500)
            lanes = pg.evaluate('window.__game.g.map.lanes')
            pg.evaluate('window.__game.camReset()'); pg.wait_for_timeout(600)
            blds = [x['poly'] for x in OSM.get(mid, {}).get('buildings', [])] if args.tag == 'after' else []
            lbl = f"{args.tag.upper()} · {'El Morro' if mid == 'morro' else 'Isla de Cabras'} · lanes" + (' + OSM buildings' if blds else '')
            pg.evaluate(OVERLAY + '(' + json.dumps([lanes, blds, lbl]) + ')'); pg.wait_for_timeout(300)
            pg.screenshot(path=os.path.join(OUT, f'{args.tag}_{mid}_2d_{vw}.png')); print('shot', args.tag, mid, vw, flush=True)
        ctx.close()
    if not args.no_fp:
        ctx = b.new_context(viewport={'width': 1920, 'height': 1080}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
        pg = ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
        Pz = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
        def possess(x, y):
            G('H.sandbox(); H.addCredits(90000); H.g.deployCd = {}'); G(f'H.deploy("odst", {x}, {y})'); pg.wait_for_timeout(1200)
            G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
            pg.wait_for_function('window.__possess && window.__possess.cur && window.__possess.cur.scene', timeout=60000)
            pg.wait_for_timeout(9000); Pz('P.el.msg.style.visibility = "hidden"')
        VIEWS = {'morro': [((60, 330), (300, 590), 'polvorin'), ((1500, 260), (1800, 450), 'battery'), ((1700, 700), (-2500, 1200), 'oldsj'), ((700, 1250), (2300, 1600), 'walk')],
                 'tropical': [((2560, 1180), (2828, 1301), 'pavilion'), ((2050, 1330), (2400, 1440), 'kiosks'), ((700, 760), (100, 300), 'causeway')]}
        if args.views: VIEWS = json.loads(args.views)
        for mid, views in VIEWS.items():
            for (sx, sy), (ax, ay), name in views:
                pg.goto(f'{URL}?map={mid}&diff=medium&fpq=high', timeout=60000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(800)
                try:
                    possess(sx, sy); Pz(f'P.aimAt({ax}, {ay}, 3); P.pitch = 0.0'); pg.mouse.move(960, 540); pg.wait_for_timeout(2500)
                    pg.screenshot(path=os.path.join(OUT, f'{args.tag}_{mid}_fp_{name}.png')); print('fp shot', mid, name, flush=True)
                except Exception as e: print('fp fail', mid, name, e, flush=True)
        print('page errors:', errs[:5])
    b.close()
