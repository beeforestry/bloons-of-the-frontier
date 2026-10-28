"""Live Stage-B smoke: main menu has 3 modes; El Morro fit zoom. Usage: python tests/live_stageb.py [URL]"""
import sys, time
from playwright.sync_api import sync_playwright
URL = (sys.argv[1] if len(sys.argv) > 1 else 'https://beeforestry.github.io/bloons-of-the-frontier/').rstrip('/') + '/'
fails = []
def check(ok, msg):
    print(('  ok  ' if ok else '  FAIL ') + msg, flush=True)
    if not ok: fails.append(msg)
fit_js = """(() => { const H = __game, g = H.g; H.camReset(); const c = H.cam(), vw = c.vw / c.zoom, vh = c.vh / c.zoom;
  const pts = g.map.lanes.flatMap((l) => [l[0], l[l.length - 1]]);
  return { inside: pts.every(([x, y]) => x >= c.x - 1 && x <= c.x + vw + 1 && y >= c.y - 1 && y <= c.y + vh + 1),
    mapIn: c.x <= 0.5 && c.y <= 0.5 && c.x + vw >= g.map.width - 0.5 && c.y + vh >= g.map.height - 0.5 }; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True)
    pg = b.new_page(viewport={'width': 1280, 'height': 800}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); time.sleep(2.5)
    txt = pg.inner_text('body')
    check(all(s in txt for s in ('Single Player', 'Co-Op', 'Versus')), 'live main menu shows Single Player / Co-Op Defense / 1v1 Versus')
    pg.screenshot(path='/tmp/live_menu.png')
    q = b.new_page(viewport={'width': 1600, 'height': 960})
    q.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    q.on('pageerror', lambda e: errs.append(str(e)))
    q.goto(URL + 'index.html?map=morro'); q.wait_for_function('window.__game', timeout=30000); time.sleep(1.5)
    f = q.evaluate(fit_js); check(f['inside'] and f['mapIn'], f'live El Morro full zoom-out fits map + sea lane start {f}')
    q.screenshot(path='/tmp/live_morro_fit.png')
    check(not errs, f'no page errors {errs[:3]}')
print('RESULT:', 'PASS' if not fails else f'FAIL {len(fails)}')
