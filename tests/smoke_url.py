"""Smoke test any build URL (file:// single HTML or a live site).
Usage: python tests/smoke_url.py <url> <screenshot.png>"""
import os, sys
from playwright.sync_api import sync_playwright
url, shot = sys.argv[1], sys.argv[2]
errors, failed = [], []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    pg = b.new_page(viewport={'width': 1600, 'height': 960})
    pg.on('console', lambda m: m.type == 'error' and errors.append(m.text))
    pg.on('console', lambda m: m.type == 'warning' and 'missing asset' in m.text and errors.append(m.text))
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('requestfailed', lambda r: failed.append(r.url[:120]))
    pg.goto(url)
    pg.wait_for_selector('.map-pick', timeout=20000)
    imgs_ok = pg.evaluate("[...document.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0)")
    print('menu loaded; maps:', pg.locator('.map-pick').count(), 'all <img> decoded:', imgs_ok)
    pg.click('.map-pick[data-map="garden"]')
    pg.wait_for_function('window.__game')
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game; return {js}; }})()')
    G('H.addCredits(3000)')
    cells = G('H.freeCells()')
    placed = sum(G(f'H.placeTower("{t}", {c[0]}, {c[1]})') for t, c in zip(['dart_monkey', 'solar_pea_fusion', 'unsc_autoturret', 'ninja_monkey'], cells[::7]))
    G('H.startWave()'); G('H.setSpeed(4)')
    pg.wait_for_timeout(6000)
    st = G('H.state()')
    print('placed', placed, 'state', st)
    # canvas actually painted (not blank)
    painted = pg.evaluate("(() => { const c = document.getElementById('game'); const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data; let n=0; for (let i=0;i<d.length;i+=4000) if (d[i]+d[i+1]+d[i+2]>30) n++; return n; })()")
    print('canvas painted samples:', painted)
    pg.screenshot(path=shot)
    b.close()
ok = not errors and st['wave'] >= 1 and (st['enemies'] > 0 or st['kills'] > 0) and painted > 50 and imgs_ok
print('console errors:', errors); print('failed requests:', failed)
print('RESULT', 'PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
