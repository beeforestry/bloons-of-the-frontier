"""Animation close-up sheet: monkeys (arm swing / throw / recoil), plants (sway + wind-up), eased turret heads,
troop walk cycles. Captures 8 frames of a zoomed-in firefight -> screenshots/t28/animation_closeup_sheet.png"""
import functools, http.server, json, os, socketserver, threading, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist'))); threading.Thread(target=h.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    pg = b.new_page(viewport={'width': 1400, 'height': 900}); pg.add_init_script("localStorage.setItem('bof.tutorialDone','1'); localStorage.setItem('bof.panelHidden','1')")
    pg.goto(f'http://127.0.0.1:{h.server_address[1]}/index.html?map=garden'); pg.wait_for_function('window.__game')
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()')
    G('H.sandbox(2,80); H.addCredits(100000)')
    pt = G('H.lanePoint(0,0.3)')
    ids = ['dart_monkey', 'boomerang_monkey', 'ninja_monkey', 'chomper', 'solar_pea_fusion', 'repeater_gatling', 'tesla_coil', 'unsc_autoturret', 'hypno_shroom', 'gatling_cherry_bomber']
    cells = G(f'''(() => {{ const gr = H.g.grid, out = []; for (let r = 0; r < gr.rows; r++) for (let c = 0; c < gr.cols; c++) if (gr.isFree(c, r)) {{ const q = gr.cellCenter(c, r), d = Math.hypot(q.x-{pt["x"]}, q.y-{pt["y"]}); if (d > 50 && d < 260) out.push([c, r, d]); }} return out.sort((a,b)=>a[2]-b[2]); }})()''')
    used = []
    for tid in ids:
        for c in cells:
            if all(abs(c[0]-u[0]) + abs(c[1]-u[1]) >= 2 for u in used) and G(f'H.placeTower("{tid}",{c[0]},{c[1]})'):
                used.append(c); G(f'(() => {{ const t = H.g.towers[H.g.towers.length-1]; t.upgrade(H.g); }})()'); break
    G(f'H.deploy("marine",{pt["x"]+120},{pt["y"]+40})'); G(f'H.deploy("ranger",{pt["x"]-120},{pt["y"]-40})')
    pg.wait_for_timeout(2500)
    G(f'H.moveGroup([0],{pt["x"]-160},{pt["y"]+60}); H.moveGroup([1],{pt["x"]+160},{pt["y"]-60})')
    G('H.setSpeed(1)')
    G(f'H.moveGroup([0],{pt["x"]+40},{pt["y"]+90}); H.moveGroup([1],{pt["x"]-60},{pt["y"]-90})')
    spawn = 'for (let i = 0; i < 6; i++) { const L = H.g.paths[0].length; H.g.spawnEnemy(["ceramic","hunter","green","ironback","pink","warden"][i], L * 0.2 + i * 30, 0, 0); }'
    G(spawn); pg.wait_for_timeout(1800); G(spawn)
    G(f'H.focus({pt["x"]},{pt["y"]},1.9)')
    frames = []
    for i in range(8):
        pg.wait_for_timeout(220)
        if i == 4: G(spawn)
        bb = pg.locator('#game').bounding_box()
        frames.append(Image.open(io.BytesIO(pg.screenshot(clip={'x': bb['x'] + bb['width']/2 - 420, 'y': bb['y'] + bb['height']/2 - 260, 'width': 840, 'height': 520}))))
    b.close()
W, H_ = 840, 520; sheet = Image.new('RGB', (W * 2 // 1, H_ * 4 + 40), (20, 24, 30))
sheet = Image.new('RGB', (W * 2, H_ * 4 + 44), (20, 24, 30)); d = ImageDraw.Draw(sheet)
d.text((12, 12), 'Animation close-up: 8 frames @220 ms - monkey arms aim/throw/recoil, plant sway + wind-up, eased turret heads, troop walk cycles', fill=(255, 230, 120))
for i, f in enumerate(frames):
    x, y = (i % 2) * W, 44 + (i // 2) * H_; sheet.paste(f, (x, y)); d.text((x + 8, y + 6), f'frame {i+1}', fill=(255, 255, 255))
os.makedirs(os.path.join(ROOT, 'screenshots', 't28'), exist_ok=True)
sheet.save(os.path.join(ROOT, 'screenshots', 't28', 'animation_closeup_sheet.png')); print('ok')
