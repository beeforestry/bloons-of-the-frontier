"""t35 screenshots -> screenshots/t35/: el_morro_v2_full_map, el_morro_v2_closeup, collector_hud_cap,
auto_army_toggle, auto_army_in_action, mobile_view. Usage: /workspace/.venv-pw/bin/python tests/shots_t35.py"""
import functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'screenshots', 't35'); os.makedirs(OUT, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist'))); threading.Thread(target=h.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{h.server_address[1]}/index.html?map=morro'
errors = []
def page(b, **ctxkw):
    ctx = b.new_context(**ctxkw); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page(); pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(URL); pg.wait_for_function('window.__game')
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game, g = H.g; return eval({json.dumps(js)}); }})()')
    return pg, G
shot = lambda pg, n: (pg.screenshot(path=os.path.join(OUT, n + '.png')), print('shot', n, flush=True))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    pg, G = page(b, viewport={'width': 1600, 'height': 960})
    pg.wait_for_timeout(800); G('H.camReset()'); pg.wait_for_timeout(400); shot(pg, 'el_morro_v2_full_map')
    G('H.camFocus(1560, 800, 1.25)'); pg.wait_for_timeout(500); shot(pg, 'el_morro_v2_closeup')
    # collector cap
    G('H.addCredits(60000)'); hq = G('({x: g.hq.x, y: g.hq.y})')
    G(f'H.deploy("farmhand", {hq["x"]} - 220, {hq["y"]} + 40)'); pg.wait_for_timeout(1500)
    for i in range(8): G(f'H.spawnPickup({hq["x"]} - 800 + {i} * 70, {hq["y"]} - 250 + {i} * 40, 10, "{["credit", "orb", "scrap"][i % 3]}")')
    G(f'H.camFocus({hq["x"]} - 450, {hq["y"]}, 1.0)'); pg.wait_for_timeout(900); shot(pg, 'collector_hud_cap')
    # auto army toggle + in action
    G('g.deployCd = {}; for (const [i, id] of ["marine", "ranger", "line_watch", "monkey_soldier", "paladin"].entries()) { const p = H.lanePoint(i % g.paths.length, 0.55); H.deploy(id, p.x + 40, p.y + 40); g.deployCd = {}; }')
    pg.wait_for_timeout(1500)
    pg.keyboard.press('g'); pg.wait_for_timeout(500)
    G('H.selectSquads && H.selectSquads([0])'); pg.wait_for_timeout(300)
    c = G('g.squads[0].center'); G(f'H.camFocus({c["x"]}, {c["y"]}, 1.2)'); pg.wait_for_timeout(500); shot(pg, 'auto_army_toggle')
    G('H.startWave(); H.setSpeed(2)'); pg.wait_for_timeout(9000)
    c = G('(() => { const e = g.enemies.find((e) => e.alive && !e.ally); return e ? {x: e.x, y: e.y} : g.squads[0].center; })()')
    G(f'H.camFocus({c["x"]} + 120, {c["y"]}, 1.0)'); pg.wait_for_timeout(600); shot(pg, 'auto_army_in_action')
    print('auto tasks', G('g.squads.map((q) => q.autoTask)'))
    # mobile
    mp, MG = page(b, viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    mp.wait_for_timeout(1200); shot(mp, 'mobile_view')
    print('console errors', len(errors), errors[:3])
    b.close()
