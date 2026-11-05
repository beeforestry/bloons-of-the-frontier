"""Live smoke for t36/t37: menu, 👁 Possess a tower, one REAL bug report through FormSubmit.
Usage: python tests/live_t36.py [url]"""
import os, sys
from playwright.sync_api import sync_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else 'https://beeforestry.github.io/bloons-of-the-frontier/'
SH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'screenshots', 't36')
errs, fails = [], []
def check(c, m): print(('  ok  ' if c else '  FAIL ') + m); c or fails.append(m)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1280, 'height': 800}); pg.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg.on('pageerror', lambda e: errs.append(str(e)))
    posts = []; pg.on('response', lambda r: 'formsubmit.co' in r.url and posts.append((r.status, r.url)))
    pg.goto(URL + '?v=t36'); pg.wait_for_selector('.mode-pick', timeout=30000)
    bundle = pg.evaluate("[...document.scripts].map(s => s.src).find(s => s.includes('/assets/index-')) || ''")
    print('bundle', bundle); check(pg.locator('.mode-pick').count() == 3 and pg.locator('.map-pick').count() >= 4, 'main menu: 3 modes, 4+ maps')
    pg.click('.map-pick[data-map="tropical"]'); pg.wait_for_function('window.__game')
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game; return {js}; }})()')
    G('H.addCredits(5000)')
    cell = G("""(() => { const g = H.g, p = H.lanePoint(0, 0.35); let best = null, bd = 1e18;
        for (const [c, r] of H.freeCells()) { const q = g.grid.cellCenter(c, r), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd && d > 3600) { bd = d; best = [c, r]; } } return best; })()""")
    check(G(f'H.placeTower("dart_monkey", {cell[0]}, {cell[1]})'), 'placed a dart tower')
    G('H.selectTower(H.g.towers.findIndex(t => t.data.id === "dart_monkey"))'); pg.wait_for_selector('#sp-possess', timeout=5000)
    check(G('H.g.squads.some(q => q.data.id === "farmhand")'), 'free Sprout Farmhand present')
    pg.click('#sp-possess')
    check(bool(pg.wait_for_function('window.__possess && window.__possess.cur && document.querySelector("#possess-root canvas")', timeout=30000)), 'possessed the tower: 3D view up (lazy chunk loaded)')
    G('H.startWave()'); pg.wait_for_timeout(3000)
    pg.evaluate('(() => { const P = window.__possess.cur; P.aimNearest(); P.setFire(true); })()'); pg.wait_for_timeout(2500)
    pg.evaluate('window.__possess.cur.setFire(false)')
    check(G('H.g.stats.manualShots') > 0, f'manual shots fired: {G("H.g.stats.manualShots")}')
    pg.screenshot(path=os.path.join(SH, 'live_possess.png'))
    pg.keyboard.press('e'); pg.wait_for_timeout(500)
    check(not pg.query_selector('#possess-root') and G('H.g.towers[0].possessedBy') == -1, 'E exits back to 2D')
    G('H.g.paused = true'); pg.click('#pm-bug'); pg.wait_for_selector('#bug-report:not([hidden])')
    pg.fill('#br-desc', 'Live test report from the deployed site after t36/t37 (automated smoke, please ignore)')
    pg.check('input[name=br-cat][value=bug]'); pg.screenshot(path=os.path.join(SH, 'live_bug_form.png'))
    pg.click('#br-send'); pg.wait_for_timeout(8000)
    print('formsubmit responses', posts)
    check(any(s == 200 for s, _ in posts) and pg.is_hidden('#bug-report'), 'bug report sent through FormSubmit (form closed with thanks)')
    b.close()
print('page errors:', errs); check(not errs, 'no page errors')
print('RESULT', 'PASS' if not fails else f'FAIL ({len(fails)})')
