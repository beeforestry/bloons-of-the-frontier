"""Stage-B shots: screenshots/t35/el_morro_fit_zoom.png + mobile_hud_tidy.png (+ mobile_hud_menu.png),
screenshots/mp/mobile_lobby.png. Also asserts the fit + HUD rows. Usage: python tests/shots_stageb.py"""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
import mp_relay
ROOT = mp_relay.ROOT; RELAY, BASE = mp_relay.serve()
T35 = os.path.join(ROOT, 'screenshots', 't35'); MP = os.path.join(ROOT, 'screenshots', 'mp')
for d in (T35, MP): os.makedirs(d, exist_ok=True)
fails, errors = [], []
def check(ok, msg):
    print(('  ok  ' if ok else '  FAIL ') + msg, flush=True)
    if not ok: fails.append(msg)
CH = os.environ.get('CHROME', '/usr/bin/google-chrome')
PHONE = dict(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
def page(b, url, relay=False, **kw):
    ctx = b.new_context(**kw); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1');" + (f"localStorage.setItem('bof.relay','{RELAY}')" if relay else ''))
    pg = ctx.new_page(); pg.on('pageerror', lambda e: errors.append(str(e))); pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'favicon' not in m.text else None)
    pg.goto(url); return pg
fit_js = """(() => { const H = __game, g = H.g; H.camReset(); const c = H.cam(), vw = c.vw / c.zoom, vh = c.vh / c.zoom;
  const pts = g.map.lanes.flatMap((l) => [l[0], l[l.length - 1]]);
  const inside = pts.every(([x, y]) => x >= c.x - 1 && x <= c.x + vw + 1 && y >= c.y - 1 && y <= c.y + vh + 1);
  return { inside, mapIn: c.x <= 0.5 && c.y <= 0.5 && c.x + vw >= g.map.width - 0.5 && c.y + vh >= g.map.height - 0.5, pts, cam: c }; })()"""
rows_js = """(() => { const ys = new Set(); for (const e of document.querySelectorAll('#topbar > *')) { if (e.id === 'hud-more') continue; const r = e.getBoundingClientRect(); if (r.width && r.height) ys.add(Math.round(r.top / 8)); } return ys.size; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CH, headless=True)
    pg = page(b, BASE + 'index.html?map=morro', viewport={'width': 1600, 'height': 960}); pg.wait_for_function('window.__game'); time.sleep(1.2)
    f = pg.evaluate(fit_js); time.sleep(0.4)
    check(f['inside'] and f['mapIn'], f"El Morro full zoom-out shows the whole map + every lane end (sea lane start {f['pts'][-2:]}) cam {f['cam']}")
    pg.screenshot(path=f'{T35}/el_morro_fit_zoom.png')
    for m in ('garden', 'jungle', 'fortress'):
        q = page(b, BASE + f'index.html?map={m}', viewport={'width': 1280, 'height': 760}); q.wait_for_function('window.__game'); time.sleep(0.5)
        f2 = q.evaluate(fit_js); check(f2['inside'] and f2['mapIn'], f'{m}: full zoom-out still fits'); q.context.close()
    # phone HUD
    ph = page(b, BASE + 'index.html?map=morro', **PHONE); ph.wait_for_function('window.__game'); time.sleep(1.2)
    rows = ph.evaluate(rows_js); check(rows <= 2, f'phone top HUD rows = {rows}')
    check(ph.evaluate("!document.getElementById('btn-more').hidden && !document.getElementById('btn-speed').hidden"), 'phone shows ☰ and the speed-cycle button')
    ph.screenshot(path=f'{T35}/mobile_hud_tidy.png')
    ph.tap('#btn-speed'); time.sleep(0.2); check(ph.evaluate('__game.g.speed') == 2, 'speed button cycles 1x -> 2x')
    ph.tap('#btn-more'); time.sleep(0.3)
    check(ph.evaluate("!document.getElementById('hud-more').hidden && !!document.querySelector('#hud-more #btn-auto') && !!document.querySelector('#hud-more [data-speed=\"4\"]')"), '☰ opens the menu with Auto / speeds / voice / tech / orbs')
    ph.screenshot(path=f'{T35}/mobile_hud_menu.png')
    ph.tap('#hud-more [data-speed="4"]'); time.sleep(0.2); check(ph.evaluate('__game.g.speed') == 4, 'menu 4x works')
    ph.tap('#game', position={'x': 200, 'y': 400}); time.sleep(0.3); check(ph.evaluate("document.getElementById('hud-more').hidden"), 'tapping outside closes the menu')
    # desktop unchanged: items back in the bar
    dk = page(b, BASE + 'index.html?map=garden', viewport={'width': 1600, 'height': 960}); dk.wait_for_function('window.__game'); time.sleep(0.5)
    check(dk.evaluate("document.getElementById('btn-more').hidden && document.querySelectorAll('#topbar > [data-speed]').length === 3"), 'desktop: speed buttons stay in the top bar, no ☰')
    dk.set_viewport_size({'width': 600, 'height': 900}); time.sleep(0.4)
    check(dk.evaluate("!document.getElementById('btn-more').hidden && document.querySelectorAll('#hud-more [data-speed]').length === 3"), 'resize to narrow moves items into ☰')
    dk.set_viewport_size({'width': 1600, 'height': 960}); time.sleep(0.4)
    check(dk.evaluate("document.querySelectorAll('#topbar > [data-speed]').length === 3 && document.querySelector('#btn-voice').previousElementSibling.id === 'btn-speed'"), 'resize back restores original order')
    # phone lobby (host on phone, friend on desktop in another browser process)
    b2 = p.chromium.launch(executable_path=CH, headless=True)
    hp = page(b, BASE + 'index.html', relay=True, **PHONE); hp.wait_for_selector('.mode-pick')
    menu_w = hp.evaluate("Math.max(...[...document.querySelectorAll('.mode-pick')].map(e => e.getBoundingClientRect().right))")
    check(menu_w <= 390, f'phone: mode buttons fit the screen (right edge {menu_w:.0f}px)')
    hp.tap('.mode-pick[data-mode="coop"]'); hp.tap('#mp-host')
    hp.wait_for_function("document.getElementById('room-code')?.textContent?.length === 4", timeout=20000)
    code = hp.evaluate("document.getElementById('room-code').textContent")
    fr = page(b2, BASE + f'index.html?room={code}', relay=True, viewport={'width': 1280, 'height': 760})
    hp.wait_for_function("document.querySelectorAll('.lobby-players li:not(.empty)').length === 2", timeout=20000)
    over = hp.evaluate("[...document.querySelectorAll('#mp-panel *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).map(e => e.id || e.className).slice(0, 5)")
    check(not over, f'phone lobby: nothing overflows horizontally {over}')
    hp.evaluate("document.getElementById('mp-panel').scrollIntoView({block: 'start'})"); time.sleep(0.3)
    hp.screenshot(path=f'{MP}/mobile_lobby.png')
    check(not errors, f'no console errors {errors[:4]}')
    b.close(); b2.close()
print(f'\n{"PASS" if not fails else "FAIL"}: {len(fails)} failures'); [print('  -', x) for x in fails]
sys.exit(1 if fails else 0)
