"""t97 e2e: only El Morro and Isla de Cabras are selectable/loadable.
Checks the main-menu picker, co-op / versus / Overrun lobbies, starting both maps,
URL fallback for hidden maps, and a hidden-map save (no crash). Desktop + mobile.
Screenshots -> screenshots/t97/.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t97.py [--url URL] [--tag local] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't97'); os.makedirs(OUT, exist_ok=True)
if args.url:
    URL = args.url if args.url.endswith('/') or args.url.endswith('.html') else args.url + '/'
    if URL.endswith('/'): URL = URL + 'index.html'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
SEP = '&' if '?' in URL else '?'
BASE = URL.split('?')[0]
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if args.no_shots: return
    path = os.path.join(OUT, f'{args.tag}_{name}.png'); pg.screenshot(path=path); print('  shot', path, flush=True)
def menu_maps(pg):
    return pg.eval_on_selector_all('.map-pick', 'els => els.map(e => ({id: e.dataset.map, name: (e.querySelector("span")||e).textContent.trim()}))')
def lobby_opts(pg, sel='#set-map, #ov-map'):
    return pg.evaluate("""(sel) => {
      const e = document.querySelector(sel);
      return e ? [...e.querySelectorAll('option')].map(o => ({id: o.value, name: o.textContent.trim()})) : null;
    }""", sel)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    for tag, vp in [('desktop', {'width': 1600, 'height': 960}), ('mobile', {'width': 390, 'height': 844})]:
        ctx = b.new_context(viewport=vp); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
        pg = ctx.new_page()
        errs = []
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and not any(s in (m.text or '') for s in IGNORE) else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL, timeout=60000); pg.wait_for_selector('.map-pick', timeout=60000)
        maps = menu_maps(pg)
        ids = [m['id'] for m in maps]; names = [m['name'] for m in maps]
        check(sorted(ids) == ['morro', 'tropical'], f'{tag} menu ids {ids}')
        check(len(maps) == 2, f'{tag} menu count {len(maps)}')
        check(any(n == 'Isla de Cabras' and i == 'tropical' for i, n in zip(ids, names)), f'{tag} tropical label {names}')
        check(any('El Morro' in n and i == 'morro' for i, n in zip(ids, names)), f'{tag} morro label {names}')
        check(not any(x in ' '.join(names) for x in ('Garden', 'Jungle', 'Fortress', 'Tropical Island')), f'{tag} no hidden labels {names}')
        shot(pg, f'{tag}_menu')

        # Overrun solo picker (visible without hosting)
        pg.click('.mode-pick[data-mode="overrun"]'); pg.wait_for_selector('#ov-map', timeout=10000)
        ov = lobby_opts(pg, '#ov-map')
        check(ov is not None and sorted(x['id'] for x in ov) == ['morro', 'tropical'] and len(ov) == 2, f'{tag} overrun solo maps {ov}')
        check(any(x['id'] == 'tropical' and x['name'] == 'Isla de Cabras' for x in (ov or [])), f'{tag} overrun solo tropical label {ov}')
        shot(pg, f'{tag}_overrun_solo')

        # Co-op / versus / overrun hosted lobby: render without a live PeerJS room
        for mode in ('coop', 'versus', 'overrun'):
            opts = pg.evaluate("""(mode) => {
              const L = window.__lobby;
              L.settings.mode = mode; L.settings.map = 'tropical'; L.code = '0000';
              L.players = [{pid:0,name:'P1 (host)',ready:true}];
              L.net = { role: 'host' };
              L.el.hidden = false; document.body.classList.add('menu-mp');
              L.renderLobby();
              const e = document.querySelector('#set-map');
              return e ? [...e.querySelectorAll('option')].map(o => ({id: o.value, name: o.textContent.trim()})) : null;
            }""", mode)
            check(opts is not None and sorted(x['id'] for x in opts) == ['morro', 'tropical'] and len(opts) == 2, f'{tag} {mode} lobby maps {opts}')
            check(any(x['id'] == 'tropical' and x['name'] == 'Isla de Cabras' for x in (opts or [])), f'{tag} {mode} lobby tropical label {opts}')
            shot(pg, f'{tag}_{mode}_lobby')

        # Start each available map from the menu
        for mid, expect_name in [('morro', 'El Morro'), ('tropical', 'Isla de Cabras')]:
            pg.goto(BASE, timeout=60000); pg.wait_for_selector(f'.map-pick[data-map="{mid}"]', timeout=60000)
            pg.click(f'.map-pick[data-map="{mid}"]')
            pg.wait_for_function('window.__game && window.__game.g', timeout=60000)
            info = pg.evaluate('() => ({id: window.__game.g.map.id, name: window.__game.g.map.name})')
            check(info['id'] == mid, f'{tag} start {mid} id={info}')
            check(expect_name in info['name'], f'{tag} start {mid} name={info}')
            shot(pg, f'{tag}_ingame_{mid}')
            # back via navigation
        # URL fallback: hidden / unknown maps load El Morro, not crash
        for q, expect in [('garden', 'morro'), ('jungle', 'morro'), ('fortress', 'morro'), ('nope', 'morro'), ('tropical', 'tropical'), ('morro', 'morro')]:
            pg.goto(BASE + f'?map={q}', timeout=60000)
            pg.wait_for_function('window.__game && window.__game.g', timeout=60000)
            got = pg.evaluate('() => window.__game.g.map.id')
            check(got == expect, f'{tag} ?map={q} -> {got} (want {expect})')
        shot(pg, f'{tag}_url_fallback')

        # Hidden-map save: menu must not crash; Continue for Garden must not appear
        pg.evaluate("""() => { localStorage.setItem('bof.tutorialDone','1'); localStorage.setItem('bof.save', JSON.stringify({
          v:2, at: Date.now(), map:'garden', mapW:2208, mapH:1488, diff:'medium', wave:3, freeplay:false,
          credits:400, scrap:0, energy:0, hq:100, unitTiers:{}, armory:[], towers:[], buildings:[], squads:[]
        })); }""")
        pg.goto(BASE, timeout=60000); pg.wait_for_selector('.map-pick', timeout=60000)
        cont = pg.evaluate("() => { const b = document.getElementById('btn-continue'); return b ? b.textContent : null; }")
        check(cont is None or 'Garden' not in (cont or ''), f'{tag} hidden-save continue {cont!r}')
        check(pg.locator('.map-pick').count() == 2, f'{tag} menu still 2 maps after hidden save')
        shot(pg, f'{tag}_hidden_save')
        real = [e for e in errs if not any(s in e for s in IGNORE)]
        check(not real, f'{tag} no console errors {real[:6]}')
        errors.extend(real)
        ctx.close()
    b.close()
print('FAILS:', fails or 'none')
print('errors:', errors[:8] or 'none')
raise SystemExit(1 if fails else 0)
