"""t109 Phase 1: Threat Brief (preview == actual on wave 19), one-wave contracts,
and Overload Routing. Also checks Cabras-only wave-19 Variant A (2 Colossi) and
that El Morro still scales the authored 3 up.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t109_brief.py [--url URL]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); args = ap.parse_args()
if args.url:
    URL = args.url.rstrip('/') + '/index.html'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'

IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
CHROME = os.environ.get('CHROME', '/usr/bin/google-chrome')

def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)

def counts(queue):
    m = {}
    for s in queue:
        i = s['id'] if isinstance(s, dict) else s
        m[i] = m.get(i, 0) + 1
    return m

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 720})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')

    def load(mp, diff='medium'):
        sep = '&' if '?' in URL else '?'
        pg.goto(URL + sep + f'map={mp}&diff={diff}', timeout=90000)
        pg.wait_for_function('window.__game && window.__game.g', timeout=30000)
        pg.wait_for_timeout(400)

    # ---------------------------------------------------------------- A: wave 19 preview == actual (both maps)
    print('== Threat Brief / wave 19 preview', flush=True)
    for mp, expect_moab in (('tropical', 2), ('morro', 5)):
        load(mp)
        G('H.skipTo(19)')
        G('H.g.paused = true')
        tb = G('H.threatBrief()')
        w19 = next((w for w in tb['waves'] if w['wave'] == 19), None)
        check(w19 is not None, f'{mp}: brief lists wave 19')
        preview = counts(w19['queue']) if w19 else {}
        check(preview.get('moab', 0) == expect_moab, f'{mp}: preview Sky Colossi = {preview.get("moab")} (want {expect_moab})')
        vis_js = '(() => { const e = document.getElementById("threat-brief"); return !!(e && !e.hidden && document.body.classList.contains("tb-on") && e.textContent.includes("Wave 19")); })()'
        try:
            pg.wait_for_function(vis_js, timeout=5000)
            vis = True
        except Exception:
            vis = False
        check(vis, f'{mp}: Threat Brief panel is shown at wave 19')
        started = G('H.startWave()')
        check(started is True, f'{mp}: startWave 19')
        actual = counts(G('H.g.waves.pendingSpawns()'))
        check(preview == actual, f'{mp}: wave-19 preview == actual spawns ({preview} vs {actual})')
        # mid-wave contract changes are refused
        if mp == 'tropical':
            refused = G('H.setContract("sky")')
            check(refused is False and G('H.g.contract') == 'neutral', 'cannot change contract after the wave starts')

    # ---------------------------------------------------------------- B: contracts (unlock, mul, lock, save, income)
    print('== Contracts', flush=True)
    load('tropical')
    G('H.skipTo(20)')
    check(G('H.threatBrief().contracts') is False, 'contracts locked before wave 21')
    check(G('H.setContract("sky")') is False, 'setContract refused before wave 21')
    G('H.skipTo(21)')
    try:
        pg.wait_for_function('document.querySelectorAll("#threat-brief [data-ct]").length === 4', timeout=5000)
    except Exception:
        pass
    tb = G('H.threatBrief()')
    check(tb['contracts'] is True and tb['unlocked'] is True, 'contracts + brief unlocked at wave 21')
    check(G('H.setContract("sky")') is True and G('H.g.contract') == 'sky', 'Sky Watch accepted')
    # multipliers: gargoyle is air; scavenger/ironback/bile are ground; ironback plated; bile boss
    m_air = G('H.towerDmgMul("gargoyle")')
    m_gnd = G('H.towerDmgMul("scavenger")')
    check(abs(m_air - 1.25) < 1e-9 and abs(m_gnd - 0.9) < 1e-9, f'Sky Watch mul air={m_air} ground={m_gnd}')
    check(G('H.setContract("plate")') is True, 'Plate Watch accepted')
    m_pl = G('H.towerDmgMul("ironback")')
    m_boss = G('H.towerDmgMul("bile_titan")')
    m_oth = G('H.towerDmgMul("scavenger")')
    check(abs(m_pl - 1.2) < 1e-9 and abs(m_boss - 1.2) < 1e-9 and abs(m_oth - 0.9) < 1e-9,
          f'Plate Watch plated={m_pl} boss={m_boss} other={m_oth}')
    check(G('H.setContract("supply")') is True, 'Supply Run accepted')
    check(abs(G('H.towerDmgMul("scavenger")') - 0.88) < 1e-9, 'Supply Run tower damage ×0.88')
    check(abs(G('H.incomeMul()') - 1.15) < 1e-9 and abs(G('H.waveBonusMul()') - 1.2) < 1e-9, 'Supply Run +15% farm / +20% wave bonus')
    # UI buttons exist
    nbtn = G('document.querySelectorAll("#threat-brief [data-ct]").length')
    check(nbtn == 4, f'contract buttons in brief ({nbtn})')
    # save / resume keeps the pending contract
    G('H.save()')
    pg.goto(URL, timeout=90000)
    pg.wait_for_selector('#btn-continue', timeout=30000)
    pg.wait_for_timeout(300)
    pg.click('#btn-continue')
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000)
    pg.wait_for_timeout(500)
    check(G('H.g.contract') == 'supply' and G('H.g.waves.index') == 20, f'Continue restores Supply Run at wave 21 (ct={G("H.g.contract")} index={G("H.g.waves.index")})')
    # after the wave, contract returns to Neutral (start + skip combat by killing)
    G('H.startWave()')
    check(G('H.g.contract') == 'supply' and G('H.setContract("sky")') is False, 'Supply Run locked for the duration of the wave')
    ended = G('(() => { const g = H.g, w = g.waves; w.queue.length = 0; H.killAll(); const p = g.paused; g.paused = false; for (let i = 0; i < 20; i++) g.step(1/60); g.paused = p; return { active: w.active, index: w.index, ct: g.contract }; })()')
    check(ended['ct'] == 'neutral' and ended['active'] is False, f'contract resets to Neutral after the wave ({ended})')

    # Auto Waves default Neutral: skip to 22, turn auto on without picking, start happens Neutral
    G('(() => { const g = H.g, w = g.waves; w.queue.length = 0; H.killAll(); const p = g.paused; g.paused = false; for (let i = 0; i < 20; i++) g.step(1/60); g.paused = p; })()')
    G('H.skipTo(22)')
    G('H.g.waves.auto = true')
    started_ct = G('(() => { const g = H.g, p = g.paused; g.paused = false; g.waves.start(g); g.paused = p; return g.contract; })()')
    check(started_ct == 'neutral', f'Auto Waves starts the wave on Neutral when nobody picked (ct={started_ct})')
    G('H.g.waves.auto = false')

    # ---------------------------------------------------------------- C: Overload Routing
    print('== Overload Routing', flush=True)
    load('morro')
    G('H.skipTo(31)')
    G('H.setOverload(3)')
    check(G('H.threatBrief().routing') is False, 'routing locked at wave 31 with Overload < 4')
    check(G('H.setOverloadRoute("sky")') is False, 'setOverloadRoute refused before Lv 4')
    G('H.setOverload(8)')
    try:
        pg.wait_for_function('document.querySelectorAll("#threat-brief [data-or]").length === 4', timeout=5000)
    except Exception:
        pass
    check(G('H.threatBrief().routing') is True, 'routing unlocks at wave 31 with Overload Lv 8')
    # default Balanced +5% * 8 = 1.40
    bal = G('H.towerDmgMul("gargoyle")')
    check(abs(bal - 1.40) < 1e-9, f'Balanced Lv 8 = {bal} (want 1.40)')
    check(G('H.setOverloadRoute("sky")') is True and G('H.g.overloadRoute') == 'sky', 'Sky routing accepted')
    sky_air = G('H.towerDmgMul("gargoyle")')  # 1 + 0.09*6 + 0.05*2 = 1.64
    sky_gnd = G('H.towerDmgMul("scavenger")')  # 1 + 0.01*6 + 0.05*2 = 1.16
    sky_plt = G('H.towerDmgMul("ironback")')
    check(abs(sky_air - 1.64) < 1e-9 and abs(sky_gnd - 1.16) < 1e-9 and abs(sky_plt - 1.16) < 1e-9,
          f'Sky routing Lv 8 air={sky_air} rush={sky_gnd} plated={sky_plt}')
    check(G('H.setOverloadRoute("plated")') is True, 'Plated routing accepted')
    check(abs(G('H.towerDmgMul("ironback")') - 1.64) < 1e-9 and abs(G('H.towerDmgMul("gargoyle")') - 1.16) < 1e-9,
          'Plated routing +9% plated / +1% sky')
    check(G('H.setOverloadRoute("rush")') is True, 'Rush routing accepted')
    check(abs(G('H.towerDmgMul("scavenger")') - 1.64) < 1e-9 and abs(G('H.towerDmgMul("ironback")') - 1.16) < 1e-9,
          'Rush routing +9% rush / +1% plated')
    nroute = G('document.querySelectorAll("#threat-brief [data-or]").length')
    check(nroute == 4, f'routing buttons in brief ({nroute})')
    # save / resume
    G('H.save()')
    pg.goto(URL, timeout=90000)
    pg.wait_for_selector('#btn-continue', timeout=30000)
    pg.wait_for_timeout(300)
    pg.click('#btn-continue')
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000)
    pg.wait_for_timeout(500)
    check(G('H.g.overloadRoute') == 'rush' and G('H.g.overload') == 8, f'Continue restores Rush routing at Lv 8 (or={G("H.g.overloadRoute")} ov={G("H.g.overload")})')
    G('H.startWave()')
    check(G('H.setOverloadRoute("sky")') is False and G('H.g.overloadRoute') == 'rush', 'cannot change routing during a wave')

    # mobile chip (44×44) is present and tappable
    print('== Mobile chip', flush=True)
    pg.set_viewport_size({'width': 390, 'height': 844})
    load('tropical')
    G('H.skipTo(21)')
    pg.wait_for_timeout(200)
    chip = G('''(() => { document.body.classList.add("hud-compact"); const c = document.getElementById("tb-chip");
      const r = c && c.getBoundingClientRect(); return c ? { hidden: c.hidden, w: Math.round(r.width), h: Math.round(r.height) } : null; })()''')
    check(chip and not chip['hidden'] and chip['w'] >= 44 and chip['h'] >= 44, f'mobile Threat Brief chip is at least 44×44 ({chip})')

    print('\n' + ('PASS' if not fails else f'{len(fails)} FAILED: ' + '; '.join(fails)))
    if errors:
        print('console errors:', *errors[:8], sep='\n  ')
    b.close()

raise SystemExit(1 if fails or errors else 0)
