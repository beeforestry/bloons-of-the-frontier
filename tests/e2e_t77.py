"""t77: first-person (Possess) Vanguard troops render their own per-tier Blender GLBs, modelled from their v3 sprites:
Frontier Marines (marine), Orbital Drop Troopers (odst), Aegis Operative (spartan), Raider Buggy (warthog), Bulwark Scorpion (scorpion)."""
import argparse, functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'screenshots', 't77'); os.makedirs(OUT, exist_ok=True)
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--tag', default=''); args = ap.parse_args()
if args.url: URL = args.url.rstrip('/') + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/'
fails = []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    path = os.path.join(OUT, name + args.tag + '.png'); pg.screenshot(path=path, full_page=False); print('  shot', path, flush=True)

UNITS = ['marine', 'odst', 'spartan', 'warthog', 'scorpion']
INF = ['marine', 'odst', 'spartan']

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
        args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = browser.new_context(viewport={'width': 1600, 'height': 960})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page(); pg.on('console', lambda m: print('CONSOLE', m.type, m.text[:300], flush=True) if m.type in ('warning', 'error') else None)
    glb_status = {}; js_status = {}
    pg.on('response', lambda r: glb_status.__setitem__(r.url.rsplit('/', 1)[-1], r.status) if '/assets/glb/' in r.url else (js_status.__setitem__(r.url.rsplit('/', 1)[-1], r.status) if r.url.endswith('.js') else None))
    pg.goto(URL + 'index.html?map=tropical', timeout=60000)
    pg.wait_for_function('window.__game && window.__game.g', timeout=60000); pg.wait_for_timeout(800)

    # A land spot ~100 px off a lane; squads fanned out in front of it (far enough to clear the near-camera hide).
    setup = pg.evaluate("""() => {
      const H = window.__game, g = H.g; H.sandbox(3, 400); g.res.load({ credits: 1e7, scrap: 1e5 }, true);
      g.unitTiers = {};
      const land = (x, y) => !g.isWaterAt(x, y) && g.grid.isLandAt(x, y);
      let ax = 0, ay = 0, best = 1e9;
      for (let y = 160; y < g.map.height - 160; y += 20) for (let x = 160; x < g.map.width - 160; x += 20) {
        if (!land(x, y)) continue; const nl = g.nearestLane({ x, y }); if (nl.dist > 80 && nl.dist < 140 && nl.dist < best) { best = nl.dist; ax = x; ay = y; } }
      // look away from the low sun (sun sits towards -x/-y in map space) so the troops are front-lit
      let dir = [1, 0]; for (const d of [[-0.7, -0.7], [-1, 0], [0, -1], [1, 0], [0, 1]]) { let ok = true; for (let k = 30; k <= 240; k += 15) for (const s of [-50, 0, 50]) if (!land(ax + d[0] * k - d[1] * s, ay + d[1] * k + d[0] * s)) ok = false; if (ok) { dir = d; break; } }
      // capture each troop's data once (deploy, then retire) so later scenes can spawn any number of squads
      window.__t77d = {};
      for (const id of ['marine', 'odst', 'spartan', 'warthog', 'scorpion']) { H.deploy(id, ax + dir[0] * 120, ay + dir[1] * 120); const q = g.squads.find((q) => q.data.id === id); if (q) { window.__t77d[id] = q.data; for (const u of q.units) u.alive = false; } }
      g.units = g.units.filter((u) => u.alive); g.squads = g.squads.filter((q) => q.units.some((u) => u.alive)); g.deployCd = {};
      const ok = !!g.spawnSquad(window.__t77d.odst, { x: ax, y: ay }, false);
      return { ax, ay, dir, ok, got: Object.keys(window.__t77d), mpp: g.map.mpp };
    }""")
    print('setup', setup, flush=True)
    check(setup['ok'], 'possess squad (Orbital Drop Troopers) deployed')
    ax, ay, dr = setup['ax'], setup['ay'], setup['dir']

    def field(layout):
        """layout: [(id, fwd, side)] px in front of / beside the camera -> spawn a squad of each (no pod). Removes earlier field squads."""
        return pg.evaluate("""([layout, ax, ay, dir]) => {
          const H = window.__game, g = H.g;
          for (const q of g.squads) if (q.field) for (const u of q.units) u.alive = false;
          g.units = g.units.filter((u) => u.alive); g.squads = g.squads.filter((q) => !q.field);
          const out = [];
          for (const [id, f, s] of layout) {
            const q = g.spawnSquad(window.__t77d[id], { x: ax + dir[0] * f - dir[1] * s, y: ay + dir[1] * f + dir[0] * s }, false); q.field = true; out.push(id);
          }
          for (const e of g.enemies) e.alive = false; g.enemies.length = 0;
          return out; }""", [layout, ax, ay, dr])

    def aim(f, h, s=0):
        pg.evaluate("([x, y, h]) => window.__possess.cur.aimAt(x, y, h)", [ax + dr[0] * f - dr[1] * s, ay + dr[1] * f + dr[0] * s, h])

    def until(js, ms):
        for _ in range(ms // 500):
            if pg.evaluate(js): return True
            pg.wait_for_timeout(500)
        return False

    pg.evaluate("() => { const H = window.__game; H.selectSquad(H.squadIndex('odst')); }"); pg.wait_for_selector('#sp-possess', timeout=6000)
    pg.click('#sp-possess')
    check(until('!!(window.__possess && window.__possess.cur)', 30000), 'Possess opened on a Vanguard troop')
    check(until("window.__possess.cur.vm.kind === 'gun_vg_smg'", 30000), 'Drop Trooper (tier 0) viewmodel = own suppressed SMG GLB (' + pg.evaluate("window.__possess.cur.vm.kind") + ')')
    pg.wait_for_timeout(2500)

    def drawn():
        return pg.evaluate("() => window.__possess.cur.vm.unitGlb")
    def loaded():
        return pg.evaluate("() => window.__possess.cur.vm.unitGlbLoaded")

    results = {}
    for tier in (0, 1, 2):
        pg.evaluate(f"() => {{ const g = window.__game.g; for (const id of {UNITS!r}) g.unitTiers[id] = {tier}; }}")
        field([('marine', 52, -22), ('spartan', 46, 4), ('odst', 56, 26), ('marine', 95, 40), ('odst', 100, -40)])
        ok = until(f"(() => {{ const u = window.__possess.cur.vm.unitGlb; return {INF!r}.every((id) => (u[id] || []).includes('unit_' + id + '_{tier}')); }})()", 40000)
        pg.wait_for_timeout(1500)
        d = drawn(); results[tier] = d; print('tier', tier, 'drawn', d, flush=True)
        check(ok, f'tier {tier}: marine / odst / spartan each draw their own tier-{tier} GLB ({d})')
        aim(55, 1.0); pg.wait_for_timeout(1200)
        shot(pg, f'03_fp_infantry_t{tier}')
        field([('warthog', 70, -30), ('scorpion', 110, 45)])
        ok = until(f"(() => {{ const u = window.__possess.cur.vm.unitGlb; return (u.warthog || []).includes('unit_warthog_{tier}') && (u.scorpion || []).includes('unit_scorpion_{tier}'); }})()", 40000)
        pg.wait_for_timeout(1500)
        d2 = drawn(); results[(tier, 'veh')] = d2; print('tier', tier, 'veh', d2, flush=True)
        check(ok, f'tier {tier}: Raider + Scorpion draw their own tier-{tier} GLBs, not the box jeep / Bulwark tank ({d2})')
        aim(95, 1.4, 10); pg.wait_for_timeout(1200)
        shot(pg, f'04_fp_vehicles_t{tier}')

    for t in (0, 1, 2):
        names = [(results[t].get(i) or [''])[0] for i in INF]
        check(len(set(names)) == 3 and all(names), f'tier {t}: marine/odst/spartan meshes are distinct {names}')
    for u in INF:
        check(results[0].get(u) != results[2].get(u), f'{u}: tier 0 vs tier 2 GLB differ ({results[0].get(u)} vs {results[2].get(u)})')
    for u in ('warthog', 'scorpion'):
        check(results[(0, 'veh')].get(u) != results[(2, 'veh')].get(u), f'{u}: tier 0 vs tier 2 GLB differ')
    lo = loaded(); print('loaded', lo, flush=True)
    check(len([n for n in lo if n.startswith('unit_')]) == 15, f'all 15 unit GLBs loaded in first person ({len(lo)})')

    pg.evaluate("() => { const g = window.__game.g; for (const id of ['marine','odst','spartan','warthog','scorpion']) g.unitTiers[id] = 2; }")
    field([('marine', 50, -24), ('spartan', 44, 6), ('odst', 60, 30), ('warthog', 120, -50), ('scorpion', 150, 50)])
    pg.wait_for_timeout(4000); aim(80, 1.4); pg.wait_for_timeout(1200)
    shot(pg, '05_fp_mixed_t2')
    VMK = {'warthog': 'gun_raider_rotary_cyan', 'scorpion': 'gun_scorpion_cannon_blue', 'spartan': 'gun_aegis_beam'}
    for vid in ('warthog', 'scorpion', 'spartan'):
        pg.evaluate("() => window.__possess.exit()"); pg.wait_for_timeout(2500)
        pg.evaluate(f"() => {{ const H = window.__game, i = H.squadIndex('{vid}'); H.g.squads[i].field = false; H.selectSquad(i); }}"); pg.wait_for_timeout(800)
        try: pg.wait_for_selector('#sp-possess', timeout=8000); pg.click('#sp-possess')
        except Exception: pg.keyboard.press('e')
        check(until(f"!!(window.__possess.cur && window.__possess.cur.obj.squad.data.id === '{vid}')", 30000), f'possessed a {vid}')
        check(until(f"window.__possess.cur.vm.kind === '{VMK[vid]}'", 30000), f'{vid} (tier 2) viewmodel = {VMK[vid]} (' + pg.evaluate("window.__possess.cur.vm.kind") + ')')
        pg.wait_for_timeout(5000)
        o = pg.evaluate("() => { const o = window.__possess.cur.obj; return [o.x, o.y]; }"); ax, ay = o[0], o[1]
        other = 'warthog' if vid == 'scorpion' else 'scorpion'
        field([('marine', 60, -20)] + ([('spartan', 55, 10)] if vid != 'spartan' else [('marine', 50, 14)]) + [('odst', 70, 30), (other, 130, -50)]); pg.wait_for_timeout(4000)
        aim(80, 1.2); pg.wait_for_timeout(1500)
        d = drawn(); print('from', vid, d, flush=True)
        check(all(k.startswith('unit_') for v in d.values() for k in v) and other in d and len(d) >= 4, f'from the {vid}: every Vanguard troop in view is a t77 GLB ({d})')
        shot(pg, f'06_fp_from_{vid}')

    names = ['unit_%s_%d' % (u, t) for u in UNITS for t in range(3)]
    bad = {n: s for n, s in glb_status.items() if n.split('?')[0].replace('.glb', '') in names and s not in (200, 304)}
    got = [n for n in names if any(k.startswith(n + '.glb') for k in glb_status)]
    check(not bad and len(got) == 15, f'unit GLB HTTP 200 ({len(got)}/15) {bad}')
    poss = {k: v for k, v in js_status.items() if k.startswith('Possess')}
    check(bool(poss) and all(v in (200, 304) for v in poss.values()), f'Possess chunk HTTP ok {poss}')
    browser.close()

print('\n' + ('PASS' if not fails else 'FAIL (' + str(len(fails)) + ')'))
for f in fails: print(' -', f)
raise SystemExit(1 if fails else 0)
