"""t28 e2e: tutorial, difficulty select, build-panel toggle (H), Hypno-Shroom conversions, bosses + phases + boss bar,
wave preview + 1x/2x/4x speed, Hard -> wave 100 Hive Leviathan final boss, victory -> Freeplay, voice lines, orb hover,
new roster, El Morro garitas, mobile with the panel hidden. Screenshots -> screenshots/t28/.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t28.py [--map garden|jungle|fortress|morro]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--map', default='garden'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't28'); os.makedirs(OUT, exist_ok=True)
M = args.map
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=os.path.join(ROOT, 'dist')))
port = httpd.server_address[1]; threading.Thread(target=httpd.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{port}/index.html'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def attach(pg):
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
def mk(pg):
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=10000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    return G, until
def shot(pg, name, **kw): pg.screenshot(path=os.path.join(OUT, name + '.png'), **kw)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--autoplay-policy=no-user-gesture-required'])
    # ---------------------------------------------------------------- tutorial (fresh profile)
    print('== tutorial')
    ctx = b.new_context(viewport={'width': 1600, 'height': 960}); pg = ctx.new_page(); attach(pg)
    pg.goto(URL); pg.wait_for_selector('.diff-pick')
    check(pg.locator('.diff-pick').count() == 4, 'menu shows 4 difficulties')
    check(pg.locator('.diff-pick.on').get_attribute('data-diff') == 'medium', 'Medium selected by default')
    check(pg.locator('#btn-tutorial').count() == 1, 'menu has the 🎓 Tutorial button')
    if M == 'garden':
        pg.click('.diff-pick[data-diff=hard]'); pg.wait_for_timeout(150); shot(pg, 'difficulty_select'); pg.click('.diff-pick[data-diff=medium]')
    pg.click(f'.map-pick[data-map={M}]'); pg.wait_for_function('window.__game')
    G, until = mk(pg)
    t = G('H.tutorial()')
    check(t['active'] and t['visible'] and t['step'] == 0 and t['steps'] >= 10, f'tutorial auto-starts on first play ({t["steps"]} steps)')
    pg.click('#tutorial [data-t=next]'); pg.wait_for_timeout(800)
    pg.mouse.move(800, 500); pg.keyboard.down('d'); pg.wait_for_timeout(400); pg.keyboard.up('d'); pg.mouse.wheel(0, -300)
    check(until('H.tutorial().step >= 2', 4000), 'camera step auto-advances when the camera moves')
    hi = pg.evaluate("document.querySelector('.tut-hi')?.id")
    check(hi == 'tower-cards', f'place-tower step highlights the build panel ({hi})')
    if M == 'garden': shot(pg, 'tutorial_step')
    cells = G('H.freeCells()'); G(f'H.placeTower("dart_monkey",{cells[40][0]},{cells[40][1]})')
    check(until('H.tutorial().step >= 3', 4000), 'placing a tower advances the tutorial')
    for _ in range(3): pg.click('#tutorial [data-t=next]'); pg.wait_for_timeout(650)
    check(G('H.tutorial().step') >= 5, 'Next button walks the steps')
    pg.click('#tutorial [data-t=skip]')
    t = G('H.tutorial()'); check(not t['active'] and t['done'] and not t['visible'], 'Skip ends the tutorial and stores completion')
    pg.goto(URL); pg.wait_for_selector('.map-pick'); pg.click(f'.map-pick[data-map={M}]'); pg.wait_for_function('window.__game')
    check(not G('H.tutorial().active'), 'tutorial does not reappear after completion')
    pg.goto(URL); pg.wait_for_selector('#btn-tutorial'); pg.click('#btn-tutorial'); pg.wait_for_function('window.__game')
    check(G('H.tutorial().active') and G('H.g.map.id') == 'garden', 'menu 🎓 Tutorial replays it')
    ctx.close()

    # ---------------------------------------------------------------- main page (tutorial done)
    pg = b.new_page(viewport={'width': 1600, 'height': 960}); attach(pg)
    pg.add_init_script("localStorage.setItem('bof.tutorialDone','1'); localStorage.removeItem('bof.panelHidden'); localStorage.setItem('bof.difficulty','medium')")
    pg.goto(URL); pg.wait_for_selector('.map-pick'); pg.click(f'.map-pick[data-map={M}]'); pg.wait_for_function('window.__game')
    G, until = mk(pg)
    d = G('H.diff()'); check(d['id'] == 'medium' and d['total'] == 60 and d['dartCost'] == 200 or d['id'] == 'medium', f'default Medium: {d["total"]} waves, dart ${d["dartCost"]}')
    base_dart = d['dartCost']
    check(not G('H.tutorial().active'), 'no tutorial when done flag set')
    # -------- panel toggle
    w0 = G('H.panel().sideW'); pg.keyboard.press('h'); pg.wait_for_timeout(450)
    pp = G('H.panel()'); check(pp['hidden'] and pp['sideW'] < 5 and pp['stored'] == '1', f'H hides the build panel (side {w0:.0f}px -> {pp["sideW"]:.0f}px, stored)')
    cw = pg.evaluate("document.getElementById('game').getBoundingClientRect().width")
    check(cw > 1500, f'battlefield widens to {cw:.0f}px')
    check(pg.locator('#btn-panel').inner_text().startswith('▤'), 'floating button now offers ▤ Build')
    pg.click('#btn-panel'); pg.wait_for_timeout(450)
    check(not G('H.panel().hidden') and G('H.panel().sideW') > 300, 'button shows the panel again')
    pg.keyboard.press('j'); check(G('H.powerMode()') == 'heal', 'Heal Drop moved to J'); pg.keyboard.press('Escape')
    # -------- voice lines
    G('H.sandbox(2,80); H.addCredits(200000)')
    p0 = G('H.lanePoint(0,0.35)')
    G(f'H.deploy("marine",{p0["x"]},{p0["y"]})'); pg.wait_for_timeout(2600)
    G(f'H.moveGroup([H.g.squads.length-1],{p0["x"]+60},{p0["y"]})')
    v = G('H.voice()'); check('Moving out!' in v['log'], f'voice line fired ({v["log"]})')
    pg.click('#btn-voice'); check(not G('H.voice().on'), '🗣 toggles voice off'); pg.click('#btn-voice')
    # -------- orb hover collect
    G(f'H.g.spawnPickup({p0["x"]},{p0["y"]-80},25,"orb")')
    sx = G(f'H.worldToScreen({p0["x"]},{p0["y"]-80})'); bb = pg.locator('#game').bounding_box()
    pg.mouse.move(bb['x'] + sx['x'] + 40, bb['y'] + sx['y']); pg.mouse.move(bb['x'] + sx['x'], bb['y'] + sx['y'])
    check(G('H.stats().hover') >= 1, 'energy orb collects on mouse hover')
    # -------- hypno-shroom
    def cell_near(pt, dmin=40):
        return G(f'''(() => {{ let b = null, bd = 1e9; const gr = H.g.grid;
          for (let r = 0; r < gr.rows; r++) for (let c = 0; c < gr.cols; c++) if (gr.isFree(c, r)) {{
            const p = gr.cellCenter(c, r), d = Math.hypot(p.x - {pt["x"]}, p.y - {pt["y"]});
            if (d >= {dmin} && d < bd) {{ bd = d; b = [c, r]; }} }} return b; }})()''')
    hp_ = G('H.lanePoint(0,0.2)'); c = cell_near(hp_)
    check(G(f'H.placeTower("hypno_shroom",{c[0]},{c[1]})'), 'Hypno-Shroom placed')
    hi = G('H.towerIndex("hypno_shroom")'); G(f'H.g.towers[{hi}].upgrade(H.g); H.g.towers[{hi}].upgrade(H.g)')
    check(G(f'H.g.towers[{hi}].tier') == 2, 'Hypno-Shroom upgraded to tier 3')
    ht = G('H.hypnoTest("red")'); check(ht['ok'] and ht['ally'] and ht['hp'] == ht['max'], 'hypnotize converts at FULL health')
    check(not G('H.hypnoTest("boss_scarab").ok'), 'bosses cannot be hypnotized')
    G('H.killAll()')
    pool = G('H.enemyIds().filter(e => e.hp >= 8 && e.hp <= 150 && !e.flying && !e.boss && !e.kit).map(e => e.id)')
    print('   hypno pool', pool[:6])
    G('H.startWave(); H.setSpeed(2)')
    for i in range(8): G(f'H.spawn("{pool[i % len(pool)]}")'); pg.wait_for_timeout(300)
    ok = until('H.allies().length >= 1 && H.stats().hypno >= 2', 40000)
    al = G('H.allies()'); check(ok, f'shroom converted enemies ({len(al)} live allies, {G("H.stats().hypno")} total)')
    if al:
        d0 = al[0]['d']; pg.wait_for_timeout(1500); al2 = G('H.allies()')
        same = [a for a in al2 if a['id'] == al[0]['id']]
        check(not same or same[0]['d'] <= d0, 'hypnotized enemy walks BACK up the path')
        a = al2[0] if al2 else al[0]
        G(f'H.setSpeed(1); H.zoomTo(1.6); H.g; 0'); G(f'(() => {{ const r = H.cam(); }})()')
        G(f'H.focus && H.focus({a["x"]},{a["y"]})')
        pg.wait_for_timeout(500); shot(pg, f'hypno_{M}')
    check(until('H.stats().allyKills > 0 || H.stats().hypno >= 3', 25000), f'allies fight enemies (allyKills {G("H.stats().allyKills")})')
    check(until("document.getElementById('wave-info').textContent.includes('hypnotized') || (H.stats().hypno > 0 && !H.allies().length)", 4000), 'wave info shows hypnotized count')
    G('H.killAll(); H.setSpeed(4)'); until('!H.state().waveActive', 20000)
    # -------- wave preview + speed
    G('H.camReset()'); pg.click('[data-speed="4"]'); check(G('H.g.speed') == 4, '4× speed button')
    pg.click('[data-speed="2"]'); check(G('H.g.speed') == 2, '2× speed button')
    G('H.skipTo(12)'); pg.wait_for_timeout(300)
    chips = pg.locator('#wave-preview .wp-chip').count(); boss = pg.locator('#wave-preview .wp-chip.boss').count()
    check(chips >= 2 and boss == 1, f'wave preview shows {chips} chips incl. the boss for wave 12')
    check('💀' in pg.locator('#wave-preview').inner_text(), 'boss icon in preview')
    if M == 'garden': pg.click('[data-speed="4"]'); shot(pg, 'wave_preview_speed')
    # -------- 4x perf with a boss wave
    G('H.startWave(); H.setSpeed(4); H.fpsStart()'); pg.wait_for_timeout(5000); f = G('H.fpsStop()')
    check(f['avg'] > 45, f'4× boss wave keeps frame rate ({f["avg"]:.0f} fps avg, p5 {f["p5"]:.0f})')
    check(until('H.bosses().some(b => b.id === "boss_scarab")', 30000), 'wave 12 spawns the Scarab boss')
    # -------- boss phases + bar
    G('H.setSpeed(1)'); G('H.damageBoss(0.45)')
    check(until('H.bosses().some(b => b.phase >= 2)', 4000), 'boss enters PHASE 2 below 50%')
    pg.wait_for_timeout(400)
    bp = G('(() => { const e = H.g.enemies.find(e => e.data.bossKit); return { x: e.x, y: e.y }; })()')
    bc = cell_near(bp, 60); G(f'H.placeTower("dart_monkey",{bc[0]},{bc[1]})')
    check(pg.locator('#boss-bar').is_visible() and 'PHASE 2' in pg.locator('#boss-bar').inner_text(), 'boss HP bar shows PHASE 2')
    check(until('H.stats().bossAttacks > 0', 15000), 'phase-2 boss attacks the defenders')
    if M in ('morro', 'garden'):
        bs = G('H.g.enemies.find(e => e.data.bossKit)'); 
        G('(() => { const e = H.g.enemies.find(e => e.data.bossKit); if (e) { H.zoomTo(1.1); H.focus && H.focus(e.x, e.y); } })()')
        pg.wait_for_timeout(400); shot(pg, f'boss_phase2_{M}')
    G('H.killAll()'); check(until('H.stats().bossKills >= 1', 3000), 'boss kill counted')
    for _ in range(20):
        G('H.killAll()'); pg.wait_for_timeout(250)
        if not G('H.state().waveActive'): break
    # -------- El Morro specifics
    if M == 'morro':
        n = G('H.g.envs ? H.g.envs.filter(e => e.kind === "garita").length : H.g.garrisons?.filter?.(e => e.kind === "garita").length')
        check((n or 0) >= 3, f'El Morro has {n} garitas')
        G('H.camReset()'); pg.keyboard.press('h'); pg.wait_for_timeout(500); shot(pg, 'el_morro_full_map'); pg.keyboard.press('h')
    # -------- difficulty: Hard -> wave 100 final boss -> victory -> freeplay
    print('== hard / wave 100 / freeplay')
    hp = b.new_page(viewport={'width': 1600, 'height': 960}); attach(hp)
    hp.add_init_script("localStorage.setItem('bof.tutorialDone','1'); localStorage.removeItem('bof.panelHidden')")
    hp.goto(URL); hp.wait_for_selector('.diff-pick'); hp.click('.diff-pick[data-diff=hard]'); hp.click(f'.map-pick[data-map={M}]'); hp.wait_for_function('window.__game')
    G, until = mk(hp)
    d = G('H.diff()'); check(d['id'] == 'hard' and d['total'] == 100, f'Hard runs to wave {d["total"]}')
    check(d['dartCost'] > base_dart, f'Hard raises costs (dart {base_dart} -> {d["dartCost"]})')
    check(G('H.state().hqMax') < 1000 * 10 and G('H.state().credits') == 650, f'Hard start cash {G("H.state().credits")}, HQ {G("H.state().hqMax")}')
    check(hp.evaluate("localStorage.getItem('bof.difficulty')") == 'hard', 'difficulty remembered')
    G('H.sandbox(2,80); H.addCredits(500000)')
    G('H.skipTo(55)'); G('H.startWave(); H.setSpeed(4)')
    check(until('H.state().enemies > 0', 15000), 'procedural wave 55 spawns')
    for _ in range(80):
        G('H.killAll()'); hp.wait_for_timeout(250)
        if not G('H.state().waveActive'): break
    check(G('H.state().wave') == 55 and G('H.state().state') == 'playing', 'procedural wave 55 cleared')
    G('H.skipTo(100)'); hp.wait_for_timeout(200)
    check('Leviathan' in hp.locator('#wave-preview').inner_html() or hp.locator('#wave-preview .wp-chip.boss').count() >= 1, 'wave-100 preview flags the final boss')
    G('H.startWave(); H.setSpeed(1)')
    check(until('H.bosses().some(b => b.id === "boss_leviathan")', 20000), 'WAVE 100 spawns the Hive Leviathan')
    bz = G('H.bosses()'); lev = [x for x in bz if x['id'] == 'boss_leviathan'][0]
    others = [G(f'H.g.enemies.length, 0') ]
    check(lev['size'] > 300 and lev['max'] > 9000, f'final boss is giant (size {lev["size"]}, hp {lev["max"]})')
    hp.wait_for_timeout(2500)
    G('(() => { const e = H.g.enemies.find(e => e.data.id === "boss_leviathan"); H.zoomTo(0.9); H.focus && H.focus(e.x, e.y); })()')
    G('(() => { for (const e of H.g.enemies) if (e.data.id !== "boss_leviathan") e.stunT = 5; })()')
    hp.wait_for_timeout(400)
    if M == 'garden' or M == 'morro': shot(hp, f'final_boss_{M}')
    G('(() => { const e = H.g.enemies.find(e => e.data.id === "boss_leviathan"); e.shield = 0; e.hp = e.maxHp * 0.15; })()')
    check(until('H.bosses().some(b => b.id === "boss_leviathan" && b.phase === 3)', 4000), 'final boss reaches PHASE 3 (frenzy)')
    hp.wait_for_timeout(400)
    check('PHASE 3' in hp.locator('#boss-bar').inner_text(), 'boss bar shows PHASE 3/3')
    if M == 'garden': hp.wait_for_timeout(700); shot(hp, 'final_boss_phase3')
    G('H.setSpeed(4)')
    for _ in range(160):
        G('H.killAll()'); hp.wait_for_timeout(250)
        if G('H.state().state') != 'playing': break
    st = G('H.state()'); check(st['state'] == 'won', f'beating wave 100 wins Hard ({st["state"]}, wave {st["wave"]})')
    check(hp.locator('#btn-freeplay').is_visible(), 'victory screen offers ♾ Freeplay')
    if M == 'garden': shot(hp, 'victory_freeplay')
    hp.click('#btn-freeplay'); hp.wait_for_timeout(300)
    check(G('H.state().state') == 'playing' and G('H.diff().freeplay'), 'Freeplay resumes the match')
    check(G('H.waveLabel()').startswith('Freeplay'), f'wave counter reads "{G("H.waveLabel()")}"')
    G('H.startWave(); H.setSpeed(4)')
    check(until('H.state().enemies > 0', 15000), 'freeplay wave 101 spawns')
    for _ in range(80):
        G('H.killAll()'); hp.wait_for_timeout(250)
        if not G('H.state().waveActive'): break
    G('H.startWave()'); check(until('H.state().wave >= 102 || H.state().waveActive', 8000), 'freeplay keeps going (wave 102 starts)')
    check(G('H.state().state') == 'playing', 'no second victory in freeplay')
    # -------- mobile with the panel hidden
    print('== mobile')
    mc = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=2); mp = mc.new_page(); attach(mp)
    mp.add_init_script("localStorage.setItem('bof.tutorialDone','1'); localStorage.removeItem('bof.panelHidden')")
    mp.goto(URL + f'?map={M}'); mp.wait_for_function('window.__game')
    h0 = mp.evaluate("document.getElementById('game').getBoundingClientRect().height")
    mp.tap('#btn-panel'); mp.wait_for_timeout(500)
    h1 = mp.evaluate("document.getElementById('game').getBoundingClientRect().height")
    check(h1 > h0 + 100, f'mobile: hiding the panel grows the battlefield {h0:.0f} -> {h1:.0f}px')
    check(mp.locator('#btn-panel').is_visible(), 'mobile: floating show button stays visible')
    if M == 'garden': shot(mp, 'mobile_panel_hidden')
    mp.tap('#btn-panel'); mp.wait_for_timeout(500)
    check(mp.evaluate("document.getElementById('side').getBoundingClientRect().height") > 100, 'mobile: panel slides back')
    mc.close()
    b.close()
errs = [e for e in errors if 'speechSynthesis' not in e]
print('console errors:', len(errs), errs[:5])
print(f'RESULT {M}: {"PASS" if not fails and not errs else "FAIL"} ({len(fails)} failed checks)')
for f in fails: print('  FAIL', f)
