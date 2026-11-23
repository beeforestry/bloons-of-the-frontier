"""e2e: procedural 2D SFX (feat/sfx-2d). Web Audio only, no audio files.
Checks that tower fire, death types, and game cues trigger without errors,
the 12-voice cap holds under a 400-shot burst and during a heavy wave, and
the existing mute button silences the new engine.
Usage: /workspace/.venv-pw/bin/python tests/e2e_sfx2d.py [--url URL] [--tag local] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local')
args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 'sfx2d'); os.makedirs(OUT, exist_ok=True)
if args.url:
    URL = args.url if args.url.endswith('/') or args.url.endswith('.html') else args.url + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    URL = f'http://127.0.0.1:{httpd.server_address[1]}/'
if URL.endswith('index.html'):
    BASE = URL[:-len('index.html')]
else:
    BASE = URL if URL.endswith('/') else URL + '/'
    URL = BASE + 'index.html'

IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS', 'favicon')
errors, fails = [], []

def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)

PLACE = """(id, lane, frac, off) => { const g = H.g, n = g.paths.length;
  for (const L of [lane % n, ...[...Array(n).keys()].filter((i) => i !== lane % n)]) { const p = g.paths[L];
    for (const df of [0, 0.03, -0.03, 0.06, -0.06, 0.1, -0.1, 0.15]) { const f = Math.min(0.95, Math.max(0.05, frac + df));
      for (const o of [off, off + 18, off + 36, -off, -off - 18, off + 54, -off - 36]) for (const dd of [0, 30, -30, 60]) {
        const b = p.at(Math.max(0, Math.min(p.length, p.length * f + dd))); const x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
        const s = g.placementSpot(id, { x, y }); if (!s) continue; const t = g.placeTower(id, s); if (t) return g.towers.indexOf(t);
      }
    }
  } return -1; }"""

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 1440, 'height': 860})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    pg.goto(URL + '?map=tropical&diff=medium', timeout=90000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000)
    pg.wait_for_timeout(800)
    # user gesture unlocks both the existing Sfx context and the 2D engine
    pg.mouse.click(5, 5); pg.keyboard.press('Shift'); pg.wait_for_timeout(200)

    G('H.sfx2dReset()')
    inv = G("""(() => {
      const cues = ['place','upgrade','sell','fusion','rage-start','rage-end','overload-level','wave-start','wave-end'];
      const deaths = ['normal','explosion','burn','ice','electric','shock','boom','boss'];
      const towers = ['dart_monkey','sniper_monkey','tesla_coil','unsc_rail','flame_melon_mortar'];
      for (const c of cues) H.sfx2dCue(c);
      for (const d of deaths) H.sfx2dDeath(d);
      for (const [i, id] of towers.entries()) H.sfx2dFire(id, i);
      return H.sfx2d();
    })()""")
    check(inv and inv.get('contextState') == 'running', f'AudioContext running after gesture ({inv})')
    check(inv and inv.get('compressorEnabled') is True, 'shared dynamics compressor is connected')
    check(inv and inv.get('played', 0) > 0, f'inventory cues played without errors ({inv.get("played") if inv else None})')
    check(inv and inv.get('voiceCap') == 12, f'voice cap is 12 ({inv.get("voiceCap") if inv else None})')

    G('H.sfx2dReset()')
    burst = G("""(() => {
      for (let i = 0; i < 400; i++) H.sfx2dFire('stress-' + i, i % 6);
      return H.sfx2d();
    })()""")
    check(burst and burst['peakVoices'] <= burst['voiceCap'], f'400-shot burst peak {burst.get("peakVoices") if burst else None} <= cap {burst.get("voiceCap") if burst else None}')
    check(burst and burst['skippedVoiceCap'] > 0, f'voice cap skipped extras ({burst})')
    check(burst and burst['played'] > 0, f'burst still played some voices ({burst.get("played") if burst else None})')

    # existing mute button must silence the 2D engine (default 🔉 -> 🔊 -> 🔇)
    muted_btn = False
    for _ in range(4):
        if pg.inner_text('#btn-sfx') == '🔇':
            muted_btn = True
            break
        pg.click('#btn-sfx'); pg.wait_for_timeout(80)
    check(muted_btn, f'mute button reached 🔇 ({pg.inner_text("#btn-sfx")})')
    G('H.sfx2dReset()')
    muted = G("""(() => { H.sfx2dFire('muted-test'); H.sfx2dCue('place'); H.sfx2dDeath('normal'); return H.sfx2d(); })()""")
    check(muted and muted['played'] == 0 and muted['skippedMuted'] > 0, f'mute skips 2D voices ({muted})')
    # restore default modest volume 🔉
    for _ in range(4):
        if pg.inner_text('#btn-sfx') == '🔉':
            break
        pg.click('#btn-sfx'); pg.wait_for_timeout(80)

    # heavy wave: many towers + many balloons; cap must still hold, no page errors
    G('H.sfx2dReset()'); G('H.sandbox()'); G('H.addCredits(90000)')
    placed = G(f"""(() => {{
      const ids = ['dart_monkey','dart_monkey','sniper_monkey','tesla_coil','repeater_gatling','unsc_autoturret','flame_melon_mortar','wizard_monkey'];
      const idx = [];
      for (let i = 0; i < ids.length; i++) idx.push(({PLACE})(ids[i], 0, 0.25 + (i % 4) * 0.12, 70 + (i % 3) * 16));
      return idx;
    }})()""")
    check(isinstance(placed, list) and sum(1 for i in placed if i >= 0) >= 4, f'placed combat towers for the wave ({placed})')
    G("""(() => {
      for (let i = 0; i < 40; i++) H.spawn('red', 0, 0.05 + (i % 20) * 0.03, 1);
      for (let i = 0; i < 8; i++) H.spawn('ceramic', 0, 0.2 + i * 0.05, 1);
    })()""")
    G('H.startWave()')
    pg.wait_for_timeout(2500)
    wave = G('H.sfx2d()')
    check(wave and wave['peakVoices'] <= wave['voiceCap'], f'heavy wave peak {wave.get("peakVoices") if wave else None} <= cap {wave.get("voiceCap") if wave else None}')
    check(wave and wave['played'] > 0, f'heavy wave played 2D voices ({wave})')
    if not args.no_shots:
        path = os.path.join(OUT, f'{args.tag}_heavy_wave.png')
        pg.screenshot(path=path); print('  shot', path, flush=True)

    check(not errors, f'no console errors ({errors[:4]})')
    b.close()

print('PASS' if not fails else f'FAIL ({len(fails)})', fails)
raise SystemExit(1 if fails else 0)
