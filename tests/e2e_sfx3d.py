"""Positional first-person sound e2e (autopilot 2026-11-24). While possessing, other towers' / troops' / teammates' shots
and nearby pops / splats / blasts play from where they happen: HRTF PannerNode per voice (equal-power on ?fpq=low),
inverse-distance falloff, distance lowpass, voice cap (14 desktop / 8 touch / 6 low) with quietest-voice stealing,
inaudible sounds culled. Checks via window.__game.sfx3d() / sfx3dAt() / sfx3dMeter() (L/R RMS of the real panner bus):
right source -> right ear louder, left -> left, near louder than far, far is duller, cull, cap + steal, a real fight
near the troop is heard positionally (and not doubled by the flat 2D ticks), own shots stay the close report, exit -> off,
low tier, and a touch/mobile pass (cap 8, per-call cost, peak voices in a busy fight). No console errors.
Usage: /workspace/.venv-pw/bin/python tests/e2e_sfx3d.py [--url URL] [--tag local] [--no-shots]"""
import argparse, functools, http.server, json, math, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 'sfx3d'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url.rstrip('/') + '/index.html'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS', 'GL_')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
SETUP = """(() => { const g = H.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true); g.paused = false;
  let ax = 0, ay = 0, best = 1e9;
  for (let y = 80; y < g.map.height; y += 24) for (let x = 80; x < g.map.width; x += 24) {
    if (g.isWaterAt(x, y) || !g.grid.isLandAt(x, y)) continue; const nl = g.nearestLane({ x, y });
    if (nl.dist > 50 && nl.dist < 130 && nl.dist < best) { best = nl.dist; ax = x; ay = y; } }
  const placed = [];
  for (const id of ['unsc_autoturret', 'dart_monkey', 'sniper_monkey']) { let t = null;
    for (let r = 0; r < 400 && !t; r += 12) for (let a = 0; a < 16 && !t; a++) { const x = ax + Math.cos(a / 8 * Math.PI) * r, y = ay + Math.sin(a / 8 * Math.PI) * r;
      if (g.isWaterAt(x, y)) continue; const s = g.placementSpot(id, { x, y }); if (s) t = g.placeTower(id, s); }
    if (t) placed.push({ id, x: t.x, y: t.y }); }
  return { ax, ay, placed }; })()"""
def run(b, mobile=False, fpq='medium'):
    kw = dict(viewport={'width': 915, 'height': 412}, is_mobile=True, has_touch=True, device_scale_factor=2) if mobile else dict(viewport={'width': 1440, 'height': 860})
    ctx = b.new_context(**kw); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    S3 = lambda: G('H.sfx3d()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=200); return True
        except Exception: return False
    tag = 'mobile' if mobile else fpq
    pg.goto(URL + '?map=morro&diff=medium' + (f'&fpq={fpq}' if fpq else ''), timeout=90000); pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(1000)
    if mobile: pg.tap('body', position={'x': 5, 'y': 5})
    else: pg.mouse.click(5, 5); pg.keyboard.press('Shift')
    pg.wait_for_timeout(300)  # user gesture -> WebAudio unlock
    check(S3()['on'] is False and G('H.sfx3dAt("cannon", 100, 100)') is False, f'[{tag}] 2D view: no positional sound (2D ticks as before)')
    G('H.sandbox()'); setup = G(SETUP); print('  setup', setup)
    check(len(setup['placed']) >= 2, f'[{tag}] placed towers near a lane ({[p["id"] for p in setup["placed"]]})')
    t0 = setup['placed'][0]; ox, oy = t0['x'] + 40, t0['y'] + 40
    G('H.g.deployCd = {}'); G(f'H.deploy("odst", {ox}, {oy})'); pg.wait_for_timeout(1200)
    G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=8000)
    if mobile: pg.evaluate('document.querySelector("#sp-possess").click()')
    else: pg.click('#sp-possess')
    check(until('window.__possess && window.__possess.cur && window.__possess.cur.vm.fort', 60000), f'[{tag}] possessed an ODST on El Morro')
    check(until('H.sfx3d().on', 15000), f'[{tag}] first person -> positional sound on')
    pg.wait_for_timeout(1500); s = S3(); q = P('P.vm.quality'); exp_cap = 6 if q == 'low' else 8 if mobile else 14
    if fpq: check(q == fpq, f'[{tag}] quality tier {q}')
    check(s['cap'] == exp_cap and s['hrtf'] == (q != 'low'), f'[{tag}] quality {q}: cap {s["cap"]} (want {exp_cap}), HRTF {s["hrtf"]}')
    G('H.g.paused = true'); pg.wait_for_timeout(600)
    # ear basis in map px (Possess: forward = (-sin yaw, -cos yaw), right = (cos yaw, -sin yaw) in x/z = px*S)
    def pt(fwd_m, right_m):
        q = P('({ x: P.obj.x, y: P.obj.y, yaw: P.yaw, S: H.g.map.mpp })'); Sx = q['S']
        fx, fz, rx, rz = -math.sin(q['yaw']), -math.cos(q['yaw']), math.cos(q['yaw']), -math.sin(q['yaw'])
        return q['x'] + (fx * fwd_m + rx * right_m) / Sx, q['y'] + (fz * fwd_m + rz * right_m) / Sx
    def meter(n, x, y, lift=1.6, ms=900):
        r = G(f'(async () => {{ const m = H.sfx3dMeter({ms}); await new Promise(r => setTimeout(r, 40)); const ok = H.sfx3dAt("{n}", {x}, {y}, {lift}); const v = await m; return {{ ok, ...v, last: H.sfx3d().last }}; }})()')
        pg.wait_for_timeout(1300); return r
    if not mobile:
        # a bright, high-frequency report (Arcane / dart hiss): HRTF level differences are strongest there, like real ears
        rx_, ry_ = pt(0, 12); R = meter('dart', rx_, ry_)
        lx_, ly_ = pt(0, -12); L = meter('dart', lx_, ly_)
        print('  right', R, '\n  left ', L)
        check(R['last'] and 70 <= R['last']['az'] <= 110, f'[{tag}] source to the right reads az +90 ({R["last"]})')
        check(L['last'] and -110 <= L['last']['az'] <= -70, f'[{tag}] source to the left reads az -90 ({L["last"]})')
        check(R['r'] > 1.3 * R['l'] and R['r'] > 0, f'[{tag}] right source: right ear louder on the real bus (L {R["l"]}, R {R["r"]})')
        check(L['l'] > 1.3 * L['r'] and L['l'] > 0, f'[{tag}] left source: left ear louder (L {L["l"]}, R {L["r"]})')
        nx, ny = pt(8, 0); N = meter('rifle', nx, ny); fx_, fy_ = pt(90, 0); Fr = meter('rifle', fx_, fy_)
        en, ef = N['l'] + N['r'], Fr['l'] + Fr['r']; print('  near', N, '\n  far  ', Fr)
        check(en > 2.5 * ef and ef > 0, f'[{tag}] distance falloff: 8 m rifle {en:.3f} vs 90 m {ef:.3f} (x{en / max(ef, 1e-9):.1f})')
        check(Fr['last']['lp'] < N['last']['lp'], f'[{tag}] air absorption: far shot is duller (lowpass {Fr["last"]["lp"]} Hz vs {N["last"]["lp"]} Hz)')
    c0 = S3()['culled']; cx, cy = pt(420, 0); G(f'H.sfx3dAt("dart", {cx}, {cy}, 1)')
    check(S3()['culled'] == c0 + 1, f'[{tag}] a dart 420 m away is culled before any audio node is made')
    # cap: 60 quiet far sounds in distinct cells, then a near cannon steals a slot
    G(f'''(() => {{ for (let i = 0; i < 60; i++) {{ const a = i / 60 * Math.PI * 2; H.sfx3dAt("rifle", {ox} + Math.cos(a) * (240 + i * 3), {oy} + Math.sin(a) * (240 + i * 3), 2); }} }})()''')
    s = S3(); print('  cap', {k: s[k] for k in ('active', 'peak', 'dropped', 'stolen', 'culled', 'played')})
    check(s['active'] <= s['cap'] and s['peak'] <= s['cap'], f'[{tag}] voice cap holds under spam (active {s["active"]}, peak {s["peak"]} <= {s["cap"]})')
    check(s['dropped'] + s['stolen'] > 0, f'[{tag}] extra voices dropped / stolen ({s["dropped"]} / {s["stolen"]})')
    st0 = s['stolen']; nx, ny = pt(6, 2); G(f'H.sfx3dAt("cannon", {nx}, {ny}, 1.5)')
    s = S3(); check(s['stolen'] == st0 + 1 and s['last']['n'] == 'cannon', f'[{tag}] a near cannon steals the quietest voice when full')
    check(G('H.sfx3dTime(400)') < 0.6, f'[{tag}] per-sound cost {G("H.sfx3dTime(400)")} ms')
    pg.wait_for_timeout(2500)
    # a real fight next to the troop: towers + the squad's AI mates shoot, bloons pop -> positional, no doubled 2D ticks
    G('H.sfx2dReset()'); p0 = S3()
    G(f'''(() => {{ const g = H.g, nl = g.nearestLane({{ x: {t0['x']}, y: {t0['y']} }}); for (let i = 0; i < 16; i++) {{ const e = g.spawnEnemy(i % 2 ? 'red' : 'blue', Math.max(20, nl.d - 60 + i * 9), (i % 3 - 1) * 8, nl.lane, 1); e.speedK = 0.05; }} g.paused = false; }})()''')
    peak = 0
    for _ in range(14): pg.wait_for_timeout(500); peak = max(peak, S3()['active'])
    s = S3(); d2 = G('H.sfx2d()'); by = {k: s['byName'].get(k, 0) - p0['byName'].get(k, 0) for k in s['byName']}
    print('  fight', by, 'peak', peak, 'sfx2d played', d2['played'])
    shots = sum(v for k, v in by.items() if k not in ('pop', 'splat', 'explosion', 'zap'))
    check(shots >= 5, f'[{tag}] towers / troops nearby are heard positionally ({shots} shots: {by})')
    check(by.get('pop', 0) + by.get('splat', 0) + by.get('zap', 0) + by.get('explosion', 0) >= 1, f'[{tag}] nearby pops play positionally')
    check(d2['played'] <= 2, f'[{tag}] no doubled flat 2D tower / pop ticks in first person (2D played {d2["played"]})')
    check(peak <= s['cap'], f'[{tag}] peak voices in the fight {peak} <= cap {s["cap"]}')
    o0 = s['own']; G('H.g.paused = false')
    for _ in range(5):  # fire in slices until the trooper's own shot lands (reload / aim can eat a slice)
        P('P.aimNearest && P.aimNearest(); P.setFire ? P.setFire(true) : (P.firing = true)'); pg.wait_for_timeout(1500); P('P.setFire ? P.setFire(false) : (P.firing = false)')
        if S3()['own'] > o0: break
    check(S3()['own'] > o0, f'[{tag}] own shots keep the close first-person report, not a positional copy (own {S3()["own"] - o0})')
    if not args.no_shots: pg.screenshot(path=os.path.join(OUT, f'{args.tag}_{tag}_fp_fight.png'))
    P('P.exit()'); pg.wait_for_timeout(800)
    check(S3()['on'] is False and G('H.sfx3dAt("cannon", 100, 100)') is False, f'[{tag}] leaving first person -> back to 2D sound')
    ctx.close()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    run(b, fpq='medium'); run(b, fpq='low'); run(b, mobile=True, fpq='medium'); run(b, mobile=True, fpq='')
    check(not errors, f'no console errors ({errors[:3]})')
    b.close()
print('PASS' if not fails else f'FAIL ({len(fails)})', fails)
raise SystemExit(1 if fails else 0)
