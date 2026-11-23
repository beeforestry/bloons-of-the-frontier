"""Bug report e2e: 🐞 modal in 2D and first person (button + F8), non-empty PNG screenshot,
prefilled GitHub issue URL (labels bug,beta, <7000 chars), PNG + JSON downloads, pause/resume, mobile 390x844 button size.
Usage: /workspace/.venv-pw/bin/python tests/e2e_bug_report.py [--url URL] [--shots DIR]"""
import argparse, functools, http.server, json, os, socketserver, threading, base64, urllib.parse
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--shots', default=os.path.join(ROOT, 'screenshots', 'bugreport')); args = ap.parse_args()
os.makedirs(args.shots, exist_ok=True)
if args.url: URL = args.url.rstrip('/') + '/index.html'
else:
    import posixpath, urllib.parse
    DIST=os.path.join(ROOT,'dist'); BASE='/bloons-of-the-frontier'
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
        def translate_path(self, path):
            path=urllib.parse.unquote(urllib.parse.urlparse(path).path)
            if path.startswith(BASE): path=path[len(BASE):]
            path=posixpath.normpath(path).lstrip('/')
            return os.path.join(DIST, path)
    httpd = socketserver.TCPServer(('127.0.0.1', 0), Q)
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}{BASE}/index.html'
fails = []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def png_ok(d):
    if not d or not d.startswith('data:image/png;base64,'): return 0
    raw = base64.b64decode(d.split(',', 1)[1]); return len(raw) if raw[:8] == b'\x89PNG\r\n\x1a\n' else 0
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    for vw, vh, mob in ((1920, 1080, False), (390, 844, True)):
        ctx = b.new_context(viewport={'width': vw, 'height': vh}, accept_downloads=True, has_touch=mob)
        ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1'); window.open = (u) => { window.__opened = u; return null; };")
        pg = ctx.new_page(); tag = f'{vw}x{vh}'
        pg.goto(URL + '?map=morro&diff=medium', timeout=90000)
        try: pg.wait_for_function('window.__game', timeout=20000)
        except Exception:
            pg.evaluate("document.getElementById('menu') && document.querySelector('#maps button') && document.querySelector('#maps button').click()")
            pg.wait_for_function('window.__game', timeout=30000)
        pg.wait_for_timeout(2500)

        bb = pg.locator('#btn-bug').bounding_box()
        check(bb and bb['width'] >= 44 and bb['height'] >= 44, f'{tag}: 🐞 button visible and ≥44px ({bb})')
        pg.screenshot(path=f'{args.shots}/button_2d_{tag}.png')
        pg.evaluate('document.getElementById("btn-bug").click()')
        pg.wait_for_selector('#bug-report', timeout=5000)
        check(pg.evaluate('window.__game.g.paused'), f'{tag}: game paused while modal open')
        n = png_ok(pg.evaluate('window.__game.report.last.png')); check(n > 5000, f'{tag}: 2D screenshot PNG ({n} bytes)')
        check(pg.locator('#br-preview').is_visible(), f'{tag}: preview shown')
        pg.fill('#br-desc', 'Test: tower vanished at wave 3 ñ'); pg.fill('#br-name', 'Beta Tester')
        pg.screenshot(path=f'{args.shots}/modal_2d_{tag}.png')
        downs=[]
        def on_d(d): downs.append(d.suggested_filename)
        pg.on('download', on_d)
        pg.click('#br-send')
        pg.wait_for_selector('#br-steps:not([hidden])', timeout=5000); pg.wait_for_timeout(800)
        u = pg.evaluate('window.__opened || ""')
        q = urllib.parse.parse_qs(urllib.parse.urlparse(u).query)
        check(u.startswith('https://github.com/beeforestry/bloons-of-the-frontier/issues/new') and len(u) < 7000, f'{tag}: issue URL ok ({len(u)} chars)')
        check(q.get('labels') == ['bug,beta'] and 'tower vanished' in q.get('title', [''])[0], f'{tag}: labels + title')
        body = q.get('body', [''])[0]
        check('morro' in body and 'Beta Tester' in body and 'view: 2D' in body and 'wave' in body, f'{tag}: body has map/name/view/wave')
        dls = pg.evaluate('window.__game.report.last.downloads')
        check(any(x.endswith('.png') for x in downs+dls) and any(x.endswith('.json') for x in downs+dls), f'{tag}: PNG + JSON downloads ({downs} {dls})')
        pg.screenshot(path=f'{args.shots}/modal_sent_{tag}.png')
        try:
            with pg.expect_download(timeout=4000):
                pg.click('#br-dl')
        except Exception:
            pass
        pg.click('#br-cancel'); pg.wait_for_timeout(300)
        check(not pg.evaluate('window.__game.g.paused'), f'{tag}: resumed after close')
        # first person
        pg.evaluate('window.__game.g.deployCd = {}; window.__game.deploy("marine", 1700, 1500)'); pg.wait_for_timeout(1200)
        pg.evaluate('window.__game.selectSquad(window.__game.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000)
        pg.evaluate("document.querySelector('#sp-possess').click()")
        pg.wait_for_function('window.__possess && window.__possess.cur', timeout=90000); pg.wait_for_timeout(6000)
        pg.screenshot(path=f'{args.shots}/button_fp_{tag}.png')
        fb = pg.locator('#ps-bug').bounding_box(); check(fb and fb['width'] >= 44, f'{tag}: FP 🐞 button ≥44px')
        if mob: pg.click('#ps-bug')
        else: pg.keyboard.press('F8')
        pg.wait_for_selector('#bug-report', timeout=5000)
        n = png_ok(pg.evaluate('window.__game.report.last.png')); check(n > 5000, f'{tag}: FP screenshot PNG ({n} bytes)')
        pg.screenshot(path=f'{args.shots}/modal_fp_{tag}.png')
        try:
            with pg.expect_download(timeout=4000): pg.click('#br-send')
        except Exception: pg.evaluate('document.getElementById("br-send").click()')
        pg.wait_for_timeout(800)
        body = urllib.parse.parse_qs(urllib.parse.urlparse(pg.evaluate('window.__opened')).query).get('body', [''])[0]
        check('view: FP' in body, f'{tag}: FP report marks view FP')
        pg.click('#br-cancel'); ctx.close()
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
