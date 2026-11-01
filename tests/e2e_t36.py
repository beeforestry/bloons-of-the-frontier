"""t36 e2e: bug report (form, mocked send, queue + fallback, rate limit, retry-on-load), camera-shake decay
(1x / 4x / after pause, Settings Full/Reduced/Off), free auto-spawned Sprout Farmhand, and 👁 Possess / First-Person inside a live match
(tower + troop, fire / hit / move / ability / pause / exit / auto-exit, mobile touch). FormSubmit is ALWAYS mocked here (no real email is sent).
Screenshots -> screenshots/t36/.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t36.py [--map garden] [--no-fps]"""
import argparse, functools, http.server, json, os, socketserver, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--map', default='garden'); ap.add_argument('--no-fps', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't36'); os.makedirs(OUT, exist_ok=True)
M = args.map
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=os.path.join(ROOT, 'dist')))
port = httpd.server_address[1]; threading.Thread(target=httpd.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{port}/index.html'
errors, fails, posts = [], [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def attach(pg):
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'formsubmit' not in m.text and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
mode = {'ok': False}
def mock(route):
    posts.append(route.request.post_data or '')
    if mode['ok']: route.fulfill(status=200, content_type='application/json', body='{"success":"true","message":"mock"}')
    else: route.abort()
def mk(pg):
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    def until(js, ms=10000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=50); return True
        except Exception: return False
    return G, until
def shot(pg, name, **kw): pg.screenshot(path=os.path.join(OUT, name + '.png'), **kw)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    ctx.route('**/formsubmit.co/**', mock)
    pg = ctx.new_page(); attach(pg)
    pg.goto(URL + f'?map={M}'); pg.wait_for_function('window.__game')
    G, until = mk(pg)
    pg.wait_for_timeout(600)
    # ---- auto Sprout Farmhand
    w = G('H.g.workers().length')
    check(w == 1, f'free Sprout Farmhand auto-spawned at match start (workers={w})')
    check(G('H.g.stats.freeCollectors') == 1, 'stats.freeCollectors == 1')
    check(G('!!document.querySelector(".free .deploy:disabled")'), 'farmhand card shows as FREE (not purchasable)')
    pop = G('H.g.pop'); check(pop == 0, f'free collector does not use population (pop={pop})')
    if M == 'garden': shot(pg, 'sprout_auto_start')
    # ---- shake decay
    for spd in (1, 4):
        G(f'H.setSpeed({spd})'); amt = G('H.shakeTest(60, 30)')
        check(amt <= 14.01, f'{spd}x: 60 stacked shakes capped (amt={amt:.2f})')
        t0 = time.time(); ok = until('H.shakeState().amt === 0', 1500)
        check(ok, f'{spd}x: shake back to 0 in {time.time()-t0:.2f}s')
    G('H.setSpeed(1)'); G('H.shakeTest(30, 30)'); G('H.g.paused = true'); pg.wait_for_timeout(120)
    check(G('H.shakeState().amt') == 0, 'pause resets shake to 0')
    check(G('H.pauseMenu().visible'), 'pause menu visible while paused')
    pg.click('#pm-menu', trial=True)
    pg.click('[data-shake=off]'); check(G('H.shakeState().scale') == 0 and G('localStorage.getItem("bof.shake")').strip('"') == 'off', 'Settings: shake Off stored')
    check(G('H.shakeTest(5, 30)') == 0, 'shake Off -> no shake')
    pg.click('[data-shake=reduced]'); check(abs(G('H.shakeState().scale') - 0.4) < 1e-6, 'Settings: shake Reduced = 0.4')
    if M == 'garden': shot(pg, 'shake_settings')
    pg.click('[data-shake=full]'); G('H.g.paused = false'); pg.wait_for_timeout(100)
    # ---- bug report: form + offline queue + fallback
    G('localStorage.removeItem("bof.reportQueue"); localStorage.removeItem("bof.reportLast")')
    G('H.g.paused = true'); pg.click('#pm-bug'); pg.wait_for_selector('#bug-report:not([hidden])')
    pg.fill('#br-desc', 'Camera keeps shaking after the melon wave (automated test)')
    pg.check('input[name=br-cat][value=balance]')
    check(pg.is_visible('#br-shotbox'), 'screenshot toggle present')
    if M == 'garden': shot(pg, 'bug_report_form')
    mode['ok'] = False; pg.click('#br-send')
    pg.wait_for_selector('#br-fallback:not([hidden])', timeout=8000)
    q = G('H.report.queued()')
    check(len(q) == 1 and q[0]['category'] == 'balance', f'failed send -> queued in localStorage ({len(q)})')
    r = q[0] if q else {}
    ctxk = set((r.get('context') or {}).keys())
    check({'map', 'difficulty', 'wave', 'mode', 'fps'} <= ctxk and r.get('build'), f'auto context present ({sorted(ctxk)[:8]}…)')
    check(bool(r.get('screenshot', '').startswith('data:image/jpeg')) and len(r['screenshot']) < 300_000, f'screenshot JPEG < 300KB ({len(r.get("screenshot", ""))} chars)')
    href = pg.get_attribute('#br-issue', 'href') or ''
    check('github.com/beeforestry/bloons-of-the-frontier/issues/new' in href and 'labels=bug' in href and len(href) < 8000, f'prefilled GitHub issue link ({len(href)} chars)')
    check(G('H.report.reportText(H.report.queued()[0]).includes("Camera keeps shaking")'), 'copyable report text')
    check(len(posts) >= 1 and '[BotF bug] balance - Camera keeps shaking' in posts[-1], 'POST body has FormSubmit subject format')
    if M == 'garden': shot(pg, 'bug_report_fallback')
    pg.click('#br-done')
    check(G('H.report.submit(H.report.build("bug", "second", false))') == 'limited', 'rate limit: 2nd report within 30s is refused')
    # retry on next load succeeds
    mode['ok'] = True; n0 = len(posts)
    pg.reload(); pg.wait_for_function('window.__game')
    ok = until('H.report.queued().length === 0', 8000)
    check(ok and len(posts) > n0, 'queued report re-sent on next load and queue cleared')
    G('localStorage.removeItem("bof.reportLast")')
    check(G('H.report.submit(H.report.build("idea", "mocked success", false))') == 'sent', 'mocked FormSubmit success -> sent')
    pg.close()
    # ---- 👁 Possess / First-Person inside a live match (t37)
    if not args.no_fps:
        pg = ctx.new_page(); attach(pg); pg.goto(URL + f'?map={M}'); pg.wait_for_function('window.__game')
        G, until = mk(pg); pg.wait_for_timeout(400)
        check(not pg.query_selector('#btn-fps'), 'standalone First-Person menu mode removed')
        G('H.sandbox(); H.addCredits(20000)')
        # a dart tower on the free cell closest to 35% down lane 0
        cell = G("""(() => { const g = H.g, p = H.lanePoint(0, 0.35); let best = null, bd = 1e18;
            for (const [c, r] of H.freeCells()) { const q = g.grid.cellCenter(c, r), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd && d > 60 * 60) { bd = d; best = [c, r]; } } return best; })()""")
        check(bool(cell) and G(f'H.placeTower("dart_monkey", {cell[0]}, {cell[1]})'), f'placed a dart tower near the lane {cell}')
        ti = G('H.g.towers.findIndex(t => t.data.id === "dart_monkey")')
        G(f'H.selectTower({ti})'); pg.wait_for_selector('#sp-possess', timeout=3000)
        check(pg.is_visible('#sp-possess') and '👁' in pg.inner_text('#sp-possess'), 'tower panel shows 👁 Possess button')
        if M == 'garden': shot(pg, 'fps_possess_button')
        t0 = G('H.g.time'); G('H.setSpeed(3)')
        pg.click('#sp-possess'); ok = until('window.__possess && window.__possess.cur && document.querySelector("#possess-root canvas")', 20000)
        check(ok, 'Possess: three.js chunk lazy-loaded, 3D view open')
        P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
        check(G('H.g.towers[%d].manual !== null && H.g.towers[%d].possessedBy === 0' % (ti, ti)), 'tower is under manual control (possessedBy P1)')
        pg.wait_for_timeout(300); check(G('H.g.speed') == 1, 'game speed forced to 1x while possessed')
        # enemies walking past the tower
        for i in range(10): G(f'H.spawn("{"ceramic" if i % 3 == 0 else "pink"}", 0, {0.3 + i * 0.012:.3f})')
        k0 = G('H.g.stats.kills'); hp0 = G('H.g.enemies.filter(e => e.alive).reduce((a, e) => a + e.hp, 0)')
        for i in range(14):
            P('P.aimNearest()'); P('P.setFire(true)'); pg.wait_for_timeout(220)
        st = P('P.state()'); P('P.setFire(false)')
        hp1 = G('H.g.enemies.filter(e => e.alive).reduce((a, e) => a + e.hp, 0)'); k1 = G('H.g.stats.kills')
        ms = G('H.g.stats')
        check(ms['manualShots'] > 0 and st['shots'] > 0, f'tower fired from first person ({ms["manualShots"]} shots)')
        check(ms['manualHits'] > 0 and (hp1 < hp0 or k1 > k0), f'manual shots hit enemies (hits {ms["manualHits"]}, hp {hp0:.0f}->{hp1:.0f}, kills {k0}->{k1})')
        t1 = G('H.g.time'); check(t1 > t0 + 1, f'2D sim kept running while possessed (t {t0:.1f}->{t1:.1f})')
        check(P('P.state().fps') > 0, f'3D render loop running (fps={P("P.state().fps")}, software GL)')
        P('P.aimNearest()'); pg.wait_for_timeout(250)
        if M == 'garden': shot(pg, 'fps_tower_view')
        pg.keyboard.press('e'); pg.wait_for_timeout(200)
        check(not pg.query_selector('#possess-root') and G('H.g.towers[%d].manual === null && H.g.towers[%d].possessedBy === -1' % (ti, ti)), 'E exits: 3D view removed, tower back on AI')
        check(G('!document.body.classList.contains("possess-on") && getComputedStyle(document.getElementById("layout")).visibility === "visible"'), '2D view restored')
        # a troop: ODST squad -> possess the lead, walk with WASD, fire, EMP; squad follows
        p0 = G('H.lanePoint(0, 0.45)')
        check(G(f'H.deploy("odst", {p0["x"]:.0f}, {p0["y"]:.0f} + 70)'), 'deployed an ODST squad')
        pg.wait_for_timeout(600); si = G('H.squadIndex("odst")'); G(f'H.selectSquad({si})')
        pg.wait_for_selector('#sp-possess', timeout=3000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur && window.__possess.cur.state().kind === "unit"', 20000); check(ok, 'possessed an ODST troop')
        pg.wait_for_timeout(300)
        x0, y0 = P('[P.obj.x, P.obj.y]')
        pg.mouse.move(800, 480); pg.keyboard.down('w'); pg.wait_for_timeout(700); pg.keyboard.up('w')
        x1, y1 = P('[P.obj.x, P.obj.y]'); moved = ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5
        check(moved > 20, f'WASD moves the possessed troop ({moved:.0f}px)')
        check(G(f'(() => {{ const s = H.g.squads[{si}], u = window.__possess.cur.obj; return Math.hypot(s.rally.x - u.x, s.rally.y - u.y) < 60 && s.manual; }})()'), 'squad rally follows the possessed troop')
        for i in range(6): G(f'H.spawn("pink", 0, {0.42 + i * 0.01:.3f})')
        h0 = G('H.g.stats.manualHits')
        for i in range(12):
            P('P.aimNearest()'); P('P.setFire(true)'); pg.wait_for_timeout(200)
        P('P.setFire(false)')
        check(G('H.g.stats.manualHits') > h0, f'troop weapon hits from first person ({G("H.g.stats.manualHits") - h0} hits)')
        pg.keyboard.press('q'); pg.wait_for_timeout(150)
        check(G(f'(H.g.squads[{si}].abilityCd.stim ?? 0) > 0 || (H.g.squads[{si}].abilityCd.emp ?? 0) > 0'), 'Q fires the squad ability while possessed')
        P('P.aimNearest()'); pg.wait_for_timeout(250)
        if M == 'garden': shot(pg, 'fps_unit_view')
        G('H.g.paused = true'); pg.wait_for_timeout(150); check(pg.is_visible('#ps-pause-ov'), 'pause shows the in-view pause overlay')
        gt = G('H.g.time'); pg.wait_for_timeout(300); check(G('H.g.time') == gt, 'sim frozen while paused')
        pg.click('#ps-resume'); pg.wait_for_timeout(100); check(not G('H.g.paused'), 'resume from the 3D view')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
        check(not pg.query_selector('#possess-root') and G(f'H.g.squads[{si}].units.every(u => !u.manual)'), 'Esc exits troop possession')
        # auto-exit when the possessed tower is sold
        G(f'H.selectTower({ti})'); pg.wait_for_selector('#sp-possess'); pg.click('#sp-possess'); until('window.__possess && window.__possess.cur', 10000)
        G(f'H.g.sellTower(H.g.towers[{ti}])'); pg.wait_for_timeout(300)
        check(not pg.query_selector('#possess-root'), 'selling the possessed tower auto-exits first person')
        pg.close()
        # mobile: touch controls
        m = b.new_context(viewport={'width': 844, 'height': 390}, is_mobile=True, has_touch=True, device_scale_factor=2)
        m.add_init_script("localStorage.setItem('bof.tutorialDone','1')"); m.route('**/formsubmit.co/**', mock)
        mp = m.new_page(); attach(mp); mp.goto(URL + f'?map={M}'); mp.wait_for_function('window.__game')
        G2, until2 = mk(mp); G2('H.sandbox(); H.addCredits(5000)')
        q = G2('H.lanePoint(0, 0.4)'); G2(f'H.deploy("odst", {q["x"]:.0f}, {q["y"]:.0f} + 70)'); mp.wait_for_timeout(500)
        for i in range(6): G2(f'H.spawn("pink", 0, {0.36 + i * 0.01:.3f})')
        G2('H.selectSquad(H.squadIndex("odst"))'); mp.wait_for_timeout(200)
        ok = mp.evaluate('!!document.querySelector("#sp-possess")'); check(ok, 'mobile: Possess button in the squad panel')
        mp.evaluate('document.querySelector("#sp-possess").click()')
        ok = until2('window.__possess && window.__possess.cur', 20000); check(ok, 'mobile: possessed')
        check(mp.is_visible('#ps-fire') and mp.is_visible('#ps-touch') and mp.is_visible('#ps-exit'), 'mobile: FIRE / stick / Exit visible')
        for i in range(8): mp.evaluate('window.__possess.cur.aimNearest(); window.__possess.cur.setFire(true)'); mp.wait_for_timeout(180)
        mp.evaluate('window.__possess.cur.aimNearest()'); mp.wait_for_timeout(200)
        shot(mp, 'fps_mobile') if M == 'garden' else None
        mp.evaluate('window.__possess.cur.setFire(false)'); mp.tap('#ps-exit'); mp.wait_for_timeout(200)
        check(not mp.query_selector('#possess-root'), 'mobile: Exit button returns to the map')
        m.close()
    b.close()
real = [e for e in errors if 'WebGL' not in e and 'GPU stall' not in e and 'GL_' not in e]
check(not real, f'no console errors ({real[:3]})')
print(f'\n{"PASS" if not fails else "FAIL"} t36 [{M}]: {len(fails)} failure(s)', flush=True)
raise SystemExit(1 if fails else 0)
