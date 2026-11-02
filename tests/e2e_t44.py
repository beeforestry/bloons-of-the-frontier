"""t44 e2e: every tower tier renders a procedural 3D model in first person; Sniper Monkey line of sight (palm blocks, open hits).
Screenshots -> screenshots/t44/.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t44.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't44'); os.makedirs(OUT, exist_ok=True)
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
    pg.on('pageerror', lambda e: errors.append(str(e)))
    sep = '&' if '?' in URL else '?'
    def load(m):
        pg.goto(URL + sep + 'map=' + m); pg.wait_for_function('window.__game', timeout=20000); pg.wait_for_timeout(400); G('H.sandbox(); H.addCredits(900000)')
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    def possess(i):
        G(f'H.selectTower({i})'); pg.wait_for_selector('#sp-possess', timeout=4000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur && window.__possess.cur.scene', 30000); pg.wait_for_timeout(1500); return ok
    # ---- 1. every tower, every tier, as a 3D model in first person (fortress: open ground)
    load('fortress')
    ids = G('H.towerList()')
    check(bool(ids), f'tower list ({len(ids or [])} placeable)')
    placed = G(f"""(() => {{ const g = H.g, out = []; for (const [id, fp] of {json.dumps(ids)}) {{ let ok = false;
        for (let r = 1; r < g.grid.rows - fp && !ok; r++) for (let c = 1; c < g.grid.cols - fp && !ok; c++) if (g.grid.fits(c, r, fp) && (fp === 1 || true)) ok = H.placeTower(id, c, r);
        out.push([id, ok]); }} return out; }})()""")
    check(all(ok for _, ok in placed), f'placed one of every tower {[i for i, ok in placed if not ok]}')
    di = G('H.g.towers.findIndex(t => t.data.id === "dart_monkey")')
    check(possess(di), 'possessed the Dart Monkey')
    want = {}
    for tier in range(3):
        if tier: G('H.upgradeAll()'); pg.wait_for_timeout(900)
        for id_, fp, n in ids:
            if id_ in ('unsc_tank', 'unsc_heli') or tier >= n: continue
            want[f'{id_}:{tier}'] = 1
    got = P('P.vm.towers3d'); miss = [k for k in want if k not in got]
    check(not miss, f'3D model rendered for every tower tier ({len(want)} id:tier combos, {len(got)} built) missing={miss}')
    tiers = G('H.g.towers.map(t => t.tier)'); check(min(tiers) >= 1, f'towers upgraded in place (tiers {sorted(set(tiers))})')
    meshes = P('P.scene.children.filter(o => o.userData.tower3d).length'); check(meshes >= len(ids) - 2, f'{meshes} tower meshes in the FP scene')
    check(P('P.vm.vehicles') >= 2, 'tank + gunship real-size models loaded')
    P('P.el.msg.style.visibility = "hidden"')
    me = G(f'[H.g.towers[{di}].x, H.g.towers[{di}].y]')
    near = G(f"""(() => {{ const g = H.g, [x, y] = {me}; return g.towers.filter(t => t.data.id !== 'dart_monkey').map(t => [Math.hypot(t.x - x, t.y - y), t.x, t.y]).sort((a, b) => a[0] - b[0]).slice(0, 4).map(a => [a[1], a[2]]); }})()""")
    cx = sum(p[0] for p in near) / len(near); cy = sum(p[1] for p in near) / len(near)
    P(f'P.aimAt({cx}, {cy}, 1.4); P.pitch = -0.08'); pg.mouse.move(800, 480); pg.wait_for_timeout(900); shot(pg, 'fp_among_towers')
    pg.keyboard.press('e'); pg.wait_for_timeout(500)
    # cockpits (not verified in t42)
    for vid, nm in (('unsc_tank', 'cockpit_tank'), ('unsc_heli', 'cockpit_gunship')):
        i = G(f'H.g.towers.findIndex(t => t.data.id === "{vid}")')
        if possess(i):
            P('P.el.msg.style.visibility = "hidden"'); P('P.aimNearest && P.aimNearest()'); pg.wait_for_timeout(1200); shot(pg, nm)
            check(P('P.vm.kind').startswith(('tank', 'heli')), f'{vid} cockpit viewmodel: {P("P.vm.kind")}')
        pg.keyboard.press('e'); pg.wait_for_timeout(500)
    # ---- 2. Sniper line of sight on Tropical Island (palms)
    load('tropical')
    found = G("""(() => { const g = H.g, B = H.los.blockers(), palms = B.filter(b => b.h >= 8), pts = [];
      for (let L = 0; L < g.paths.length; L++) for (let f = 0.06; f < 0.95; f += 0.004) { const p = H.lanePoint(L, f); pts.push([L, f, p.x, p.y]); }
      const segD = (ax, ay, bx, by, px, py) => { const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))); return Math.hypot(ax + dx * t - px, ay + dy * t - py); };
      for (const pm of palms) for (let r = 1; r < g.grid.rows - 1; r++) for (let c = 1; c < g.grid.cols - 1; c++) {
        if (!g.grid.fits(c, r, 1)) continue; const q = g.grid.cellCenter(c, r), d = Math.hypot(q.x - pm.x, q.y - pm.y); if (d < 90 || d > 260) continue;
        if (!H.placeTower('sniper_monkey', c, r)) continue; const i = g.towers.length - 1, t = g.towers[i];
        let hid = null, open = null;
        for (const [L, f, x, y] of pts) { const dd = Math.hypot(x - t.x, y - t.y); if (dd < 150) continue; const see = H.los.canSee(i, x, y);
          const byPalm = segD(t.x, t.y, x, y, pm.x, pm.y) < pm.r * 0.5 && Math.hypot(pm.x - t.x, pm.y - t.y) < dd - 60;
          if (!see && byPalm && !hid) hid = [L, f, x, y]; if (see && !open && dd < 900) { open = [L, f, x, y]; } }
        if (hid && open) return { i, c, r, hid, open, palm: [pm.x, pm.y] };
        g.sellTower(t); }
      return null; })()""")
    check(bool(found), f'sniper spot with a lane point hidden behind a palm and one in the open: {found and {k: found[k] for k in ("c", "r", "palm")}}')
    if found:
        si = found['i']; h, o = found['hid'], found['open']
        uids = G(f"""(() => {{ const a = H.spawn('pink', {h[0]}, {h[1]}, 120), b = H.spawn('red', {o[0]}, {o[1]}, 400); const es = H.g.enemies.filter(e => e.uid === a || e.uid === b); es.forEach(e => e.speedK = 0); return [a, b]; }})()""")
        hp0 = G(f'H.g.enemies.filter(e => [{uids[0]}, {uids[1]}].includes(e.uid)).map(e => [e.uid, e.hp])')
        G('H.startWave && 0'); pg.wait_for_timeout(3500)
        hp1 = dict(G(f'H.g.enemies.filter(e => [{uids[0]}, {uids[1]}].includes(e.uid)).map(e => [e.uid, e.hp])')); hp0 = dict(hp0)
        check(hp1.get(uids[0]) == hp0.get(uids[0]), f'sniper ignores the (stronger) target behind the palm: hp {hp0.get(uids[0])} -> {hp1.get(uids[0])}')
        check(hp1.get(uids[1], 0) < hp0.get(uids[1], 0), f'sniper hits the target in the open: hp {hp0.get(uids[1])} -> {hp1.get(uids[1], "dead")}')
        st = G(f'[H.g.towers[{si}].x, H.g.towers[{si}].y]')
        G(f'H.selectTower({si}); H.camFocus({st[0]}, {st[1]}, 0.8)'); pg.wait_for_timeout(800); shot(pg, 'sniper_los_ring')
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
