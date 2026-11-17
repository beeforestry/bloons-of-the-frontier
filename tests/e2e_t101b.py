"""t101b e2e ("Métele con ganas" push):
  1. Marksman Scout: the horizon stays level after firing a scoped shot at a pitched / yawed target (camera roll ~0).
  2. Parked Raider Buggy / Bulwark Scorpion are solid: walking into one stops at its side (troops + walkable()), boarding still works.
  3. Isla de Cabras rocks: smooth textured procedural boulders (no faceted low-poly rocks) on the riprap / breakwaters.
  4. Tidebreaker Destroyer: tier-0 range reaches >= 95 % of every Isla de Cabras lane from valid water spots; tiers strictly better.
  5. Phone menu hint names the Build / Troops toggle (no 'bottom panel').
  6. El Morro: Old San Juan backdrop (lidar terrain + aerial + extruded roofs) loads behind the esplanade.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t101b.py [--url URL] [--tag live] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--only', default='123456'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't101'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url if args.url.endswith('/') or args.url.endswith('.html') else args.url + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if args.no_shots: return
    path = os.path.join(OUT, f'{args.tag}_{name}.png'); pg.screenshot(path=path); print('  shot', path, flush=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    def page(vw=1440, vh=860, mobile=False):
        ctx = b.new_context(viewport={'width': vw, 'height': vh}, is_mobile=mobile, has_touch=mobile); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
        pg = ctx.new_page()
        pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
        pg.on('pageerror', lambda e: errors.append(str(e)))
        return pg
    pg = page()
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=150); return True
        except Exception: return False
    def possess_unit(x, y, kind='marine'):
        G('H.g.res.load({ credits: 1e7, scrap: 1e5 }, true)'); G('H.g.deployCd = {}'); G(f'H.deploy("{kind}", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur && (window.__possess.cur.vm.fort || window.__possess.cur.vm.cabras)', 60000)
        P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(3000); P('P.el.msg.style.visibility = "hidden"')
        return ok
    def exit_fp():
        pg.evaluate("() => { try { window.__possess && window.__possess.exit && window.__possess.exit() } catch (e) {} }"); pg.wait_for_timeout(600)

    # ------------------------------------------------------------ El Morro: parked vehicles solid + Old San Juan backdrop
    if '2' in args.only or '6' in args.only:
        pg.goto(URL + sep + 'map=morro&diff=medium&fpq=high', timeout=90000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1000)
        check(possess_unit(1700, 1500), 'possessed a trooper on the El Morro esplanade')
    if '2' in args.only:
        for kind in ('warthog', 'scorpion'):
            pv = G(f'H.g.parked.find(p => p.kind === "{kind}")')
            inside = G(f'H.g.walkable({pv["x"]}, {pv["y"]})')
            check(not inside, f'{kind}: its centre is not walkable')
            # walk at it from 8 m away along its side axis, then along its length axis
            for axis, lab in ((0, 'end-on'), (1.5708, 'side-on')):
                d = 8 / 0.125
                P(f'P.obj.x = {pv["x"]} + Math.cos({pv["ang"]} + {axis}) * {d}; P.obj.y = {pv["y"]} + Math.sin({pv["ang"]} + {axis}) * {d}')
                pg.wait_for_timeout(500)
                P(f'P.aimAt({pv["x"]}, {pv["y"]}, P.eye().y - 0.6)'); pg.wait_for_timeout(1200)
                pg.keyboard.down('w'); deepest = 0
                for _ in range(14):
                    pg.wait_for_timeout(350); deepest = max(deepest, G('H.g.parkedDepth(H.g.units.find(u => u.possessedBy >= 0 || u.manual)?.x ?? 0, H.g.units.find(u => u.possessedBy >= 0 || u.manual)?.y ?? 0)'))
                pg.keyboard.up('w'); pg.wait_for_timeout(300)
                s = P('P.state()'); dist_m = ((s['x'] - pv['x']) ** 2 + (s['y'] - pv['y']) ** 2) ** 0.5 * 0.125
                check(deepest <= 0.05 and dist_m < 6.5, f'{kind} {lab}: walked up and stopped at the hull ({dist_m:.2f} m from centre, max overlap {deepest:.2f} m)')
                if kind == 'scorpion' and axis: shot(pg, 'fp_scorpion_blocks')
            # boarding still works from the stop point
            n0 = G('H.g.parked.length'); pg.keyboard.press('f'); pg.wait_for_timeout(1500)
            s1 = P('P.state()'); check(s1['veh'] and s1['unitId'] == kind and G('H.g.parked.length') == n0 - 1, f'{kind}: F still boards it')
            pg.keyboard.press('f'); pg.wait_for_timeout(1500)
            s2 = P('P.state()'); check(not s2['veh'], f'{kind}: F steps out again (beside it, not stuck)')
            pg.keyboard.down('a'); pg.wait_for_timeout(1500); pg.keyboard.up('a'); s3 = P('P.state()')
            check(((s3['x'] - s2['x']) ** 2 + (s3['y'] - s2['y']) ** 2) ** 0.5 > 2, f'{kind}: can walk away after stepping out')
    if '6' in args.only:
        ok = until('window.__possess.cur.vm.oldsj', 60000)
        o = P('P.vm.oldsj'); print('  oldsj', o)
        check(ok and o and o['tris'] > 50000 and o['built'] > 1000, f'Old San Juan backdrop loaded ({o})')
        P('P.obj.x = 900; P.obj.y = 1300'); pg.wait_for_timeout(800)
        P('P.aimAt(-3000, 900, P.eye().y + 6)'); pg.wait_for_timeout(4000); shot(pg, 'fp_old_san_juan')
        P('P.aimAt(-2600, 2900, P.eye().y - 2)'); pg.wait_for_timeout(3000); shot(pg, 'fp_old_san_juan_cemetery')
        exit_fp()

    # ------------------------------------------------------------ Isla de Cabras: boulders, destroyer coverage, sniper horizon
    if '1' in args.only or '3' in args.only or '4' in args.only:
        pg.goto(URL + sep + 'map=tropical&diff=medium&fpq=high', timeout=90000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1500)
    if '4' in args.only:
        r = G('''(() => { const g = H.g, m = g.map, W = m.width, Hh = m.height, step = 32, td = g.towerData ? g.towerData('unsc_destroyer') : null; const pts = [];
          for (let y = step/2; y < Hh; y += step) for (let x = step/2; x < W; x += step) if (g.spotOk('unsc_destroyer', x, y)) pts.push([x, y]);
          return { n: pts.length, cover: m.lanes.map((L, li) => { let n = 0, c = 0; const P = g.paths[li]; for (let d = 0; d < P.length; d += 40) { const q = P.at(d); if (q.x < 0 || q.y < 0 || q.x > W || q.y > Hh) continue; n++; if (pts.some(([x, y]) => Math.hypot(x - q.x, y - q.y) <= 260)) c++; } return +(c / n).toFixed(3); }) }; })()''')
        print('  destroyer', r)
        check(min(r['cover']) >= 0.95, f"destroyer (range 260) reaches >= 95 % of every lane: {r['cover']}")
        t = G('(() => { const g = H.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true); for (let y = 200; y < g.map.height; y += 40) for (let x = 200; x < g.map.width; x += 40) if (g.spotOk("unsc_destroyer", x, y)) { const sp = g.placementSpot("unsc_destroyer", { x, y }); const tw = sp && g.placeTower("unsc_destroyer", sp); if (tw) { const r = [tw.t.combat.range]; tw.upgrade(g); r.push(tw.t.combat.range); tw.upgrade(g); r.push(tw.t.combat.range); tw.sell ? tw.sell(g) : 0; return r; } } return null; })()')
        check(t == [260, 285, 315], f'destroyer tier ranges 260 / 285 / 315 ({t})')
    if '3' in args.only:
        check(possess_unit(*G('(() => { const g = H.g; return [1460, 1500]; })()')), 'possessed a trooper on Isla de Cabras')
        ok = until('window.__possess.cur.floraGrp', 60000)
        fl = P('(() => { const out = {}; P.floraGrp.traverse(o => { if (o.isInstancedMesh) { const k = o.userData.flora; out[k] = (out[k] || 0) + o.count; } }); return out; })()')
        print('  flora', fl)
        nb = sum(v for k, v in fl.items() if k.startswith('boulder'))
        check(ok and nb > 0 and not any(k.startswith('rock') for k in fl), f'rocks are procedural boulders ({nb} drawn near, no faceted Kenney rocks)')
        geo = P('(() => { let t = 0, sm = 0; P.floraGrp.traverse(o => { if (o.isInstancedMesh && /^boulder/.test(o.userData.flora) && !o.userData.lod) { t = o.geometry.attributes.position.count / 3; sm = o.material.normalMap ? 1 : 0; } }); return { tris: t, normalMap: sm }; })()')
        check(geo['tris'] >= 900 and geo['normalMap'] == 1, f'near boulder LOD is smooth + normal-mapped ({geo})')
        # close-up on the shore riprap: find a rock deco near land, stand 3 m from it
        rk = G('(() => { const d = H.g.map.deco.filter(x => x[0] === "mr_rock"); const r = d[Math.floor(d.length * 0.37)]; return [r[1], r[2]]; })()')
        P(f'P.obj.x = {rk[0]} + 26; P.obj.y = {rk[1]} + 10'); pg.wait_for_timeout(1500)
        P('P.floraGrp.userData.updateLod(P.camera, true)')
        P(f'P.aimAt({rk[0]}, {rk[1]}, P.eye().y - 1.4)'); pg.wait_for_timeout(3500); shot(pg, 'fp_cabras_boulders')
        exit_fp()
    if '1' in args.only:
        sp = G('''(() => { const g = H.g; g.res.load({ credits: 1e7, scrap: 1e5 }, true);
          for (let y = 300; y < g.map.height; y += 24) for (let x = 300; x < g.map.width; x += 24) { if (g.isWaterAt(x, y)) continue; const nl = g.nearestLane({ x, y }); if (nl.dist < 60 || nl.dist > 160) continue; const s = g.placementSpot('sniper_monkey', { x, y }); if (!s) continue; const t = g.placeTower('sniper_monkey', s); if (t) return g.towers.indexOf(t); } return -1; })()''')
        check(sp >= 0, 'placed a Marksman Scout')
        G(f'(() => {{ const g = H.g, t = g.towers[{sp}], nl = g.nearestLane(t); for (const k of [-300, 300, 600]) {{ const e = g.spawnEnemy("ceramic", Math.max(20, Math.min(g.paths[nl.lane].length - 30, nl.d + k)), 0, nl.lane, 5000); if (e) e.speedK = 0.02; }} return 1; }})()')
        G(f'H.selectTower({sp})'); pg.wait_for_timeout(300); pg.click('#sp-possess')
        until('window.__possess && window.__possess.cur', 60000); pg.wait_for_timeout(2500)
        worst = 0
        for tgt in range(3):
            P(f'(() => {{ const es = P.g.enemies.filter(e => e.alive); const e = es[{tgt} % es.length]; P.aimAt(e.x, e.y, P.eye().y - 4 + {tgt} * 5); }})()')
            P('P.yaw += 0.9'); pg.wait_for_timeout(300)
            pg.mouse.move(800, 480); pg.mouse.down(button='right'); pg.wait_for_timeout(1200)
            s0 = P('P.state()'); pg.mouse.down(); pg.wait_for_timeout(1500); pg.mouse.up(); pg.wait_for_timeout(500); s1 = P('P.state()')
            print('  sniper', {k: s1[k] for k in ('pitch', 'roll', 'shots', 'fov')})
            worst = max(worst, abs(s0['roll']), abs(s1['roll']))
            check(abs(s1['pitch']) > 0.01, f'shot {tgt}: camera pitched ({s1["pitch"]})')
            if tgt == 2: shot(pg, 'fp_sniper_level_horizon')
            pg.mouse.up(button='right'); pg.wait_for_timeout(500)
        check(worst < 0.2, f'Marksman horizon level before/after scoped shots (max roll {worst:.3f} deg)')
        exit_fp()
    # ------------------------------------------------------------ phone menu hint
    if '5' in args.only:
        mp = page(390, 844, True); mp.goto(URL + sep + 'diff=medium', timeout=90000); mp.wait_for_timeout(1500)
        mp.evaluate("() => { const m = document.getElementById('menu'); m && m.classList.add('show'); }")
        txt = mp.evaluate("() => { const e = document.querySelector('.mobile-hint'); return e ? [e.innerText, getComputedStyle(e).display] : null }")
        print('  hint', txt)
        check(txt and 'bottom panel' not in txt[0] and 'Build' in txt[0] and 'Troops' in txt[0] and txt[1] != 'none', f'phone menu hint names the Build / Troops toggle')
        if not args.no_shots: mp.screenshot(path=os.path.join(OUT, f'{args.tag}_mobile_menu_hint.png'))
    b.close()
real = [e for e in errors if 'oldsj' not in e]
check(not real, f'no console errors ({real[:3]})')
print('\n' + ('PASS' if not fails else 'FAIL (' + str(len(fails)) + ')'))
for f in fails: print(' -', f)
raise SystemExit(1 if fails else 0)
