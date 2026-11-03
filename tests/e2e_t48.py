"""t48 e2e: no black / blank frames under heavy action (2D + first-person). Samples every rendered frame's mean
luminance and listens for 2D/WebGL context loss.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t48.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't48'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, name + '.png'))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    SAMPLER = """(() => { if (window.__lum) return; const L = window.__lum = { n: 0, black: 0, min: 1e9, lost: 0, worst: [] };
      const s = document.createElement('canvas'); s.width = s.height = 16; const x = s.getContext('2d', { willReadFrequently: true });
      const hook = (c, ev) => c && !c.__h && (c.__h = 1, c.addEventListener(ev, () => L.lost++));
      const tick = () => { const fp = document.body.classList.contains('possess-on'), c = fp ? document.querySelector('canvas.p3d') : document.getElementById('game');
        hook(document.getElementById('game'), 'contextlost'); hook(document.querySelector('canvas.p3d'), 'webglcontextlost');
        if (c && c.width) { x.clearRect(0, 0, 16, 16); x.drawImage(c, 0, 0, 16, 16); const d = x.getImageData(0, 0, 16, 16).data; let v = 0;
          for (let i = 0; i < d.length; i += 4) v += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; v /= 256;
          L.n++; if (v < 14) { L.black++; if (L.worst.length < 5) L.worst.push([fp ? 'fp' : '2d', Math.round(v)]); } L.min = Math.min(L.min, v); }
        requestAnimationFrame(tick); }; requestAnimationFrame(tick); })()"""
    STRESS = """(() => { const g = H.g; clearInterval(window.__st); let k = 0;
      window.__st = setInterval(() => { k++;
        for (let i = 0; i < 12; i++) H.spawn(['red','pink','ceramic','moab','charger','brood'][i % 6], i, Math.random() * 0.8);
        if (k % 10 === 0) H.spawn(['boss_scarab','boss_zeppelin','boss_dreadnought','boss_leviathan'][(k / 10) % 4 | 0], k, 0.1);
        for (let i = 0; i < 6; i++) { const p = H.lanePoint(i % 3, Math.random()); g.bigBlast(p.x, p.y, 90 + Math.random() * 80, 40, 'explosive'); }
        for (const e of g.enemies.slice(0, 20)) g.shake(16);
        if (g.enemies.length > 900) g.enemies.splice(0, 300);
      }, 100); })()"""
    def run(label, secs):
        pg.evaluate('window.__lum && Object.assign(window.__lum, { n: 0, black: 0, min: 1e9, worst: [] })')
        G(STRESS); pg.wait_for_timeout(secs * 1000); pg.evaluate('clearInterval(window.__st)')
        L = pg.evaluate('window.__lum'); foes = G('H.g.enemies.length'); print(f'  {label}: frames={L["n"]} black={L["black"]} minLum={L["min"]:.0f} lost={L["lost"]} foes={foes} worst={L["worst"]}')
        return L
    pg.goto(URL + sep + 'map=fortress'); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(500)
    G('H.sandbox(); H.addCredits(900000)'); pg.evaluate(SAMPLER)
    ids = [i for i, fp, n in G('H.towerList()') if i not in ('unsc_tank', 'unsc_heli')]
    G(f"""(() => {{ const g = H.g, ids = {json.dumps(ids)}; let n = 0; for (let r = 2; r < g.grid.rows - 2 && n < 40; r += 3) for (let c = 2; c < g.grid.cols - 2 && n < 40; c += 3) if (H.placeTower(ids[n % ids.length], c, r)) n++; H.upgradeAll(); return n; }})()""")
    G('H.g.speed = 3')
    L = run('2D stress', 10); shot(pg, 'stress_2d')
    check(L['n'] > 20, f'2D: sampled {L["n"]} frames'); check(L['black'] == 0, '2D: no black frames under stress'); check(L['lost'] == 0, '2D: no canvas context loss')
    # one throwing frame must not kill the loop (was: rAF chain stopped)
    t0 = G('H.g.time'); G('(() => { const g = H.g, u = g.update.bind(g); let once = true; g.update = (dt) => { if (once) { once = false; throw new Error("t48 injected frame error"); } return u(dt); }; })()')
    pg.wait_for_timeout(1500); check(G('H.g.time') > t0 + 0.3, 'loop survives an exception inside a frame')
    errors[:] = [e for e in errors if 't48 injected' not in e]
    G('H.g.speed = 1'); G('H.selectTower(0)'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
    pg.wait_for_function('window.__possess && window.__possess.cur && window.__possess.cur.scene', timeout=30000); pg.wait_for_timeout(2500)
    L = run('FP stress', 8); shot(pg, 'stress_fp')
    check(L['n'] > 10, f'FP: sampled {L["n"]} frames'); check(L['black'] == 0, 'FP: no black frames under stress'); check(L['lost'] == 0, 'FP: no WebGL context loss')
    # simulated GPU reset in first person: context lost -> restored, rendering resumes
    pg.evaluate('window.__lx = window.__possess.cur.renderer.getContext().getExtension("WEBGL_lose_context"); window.__lx.loseContext()')
    pg.wait_for_timeout(600); pg.evaluate('window.__lx.restoreContext()'); pg.wait_for_timeout(2500)
    pg.evaluate('Object.assign(window.__lum, { n: 0, black: 0, min: 1e9, worst: [] })'); pg.wait_for_timeout(1500); L = pg.evaluate('window.__lum')
    print(f'  after GL restore: frames={L["n"]} black={L["black"]} minLum={L["min"]:.0f}')
    check(L['n'] > 3 and L['black'] == 0, 'FP renders again after a WebGL context loss + restore')
    errors[:] = [e for e in errors if 'CONTEXT_LOST' not in e and 'context lost' not in e.lower()]
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
