"""t93 e2e: El Morro first-person graphics pass (floors, main ramp + side stairs + arch, wide stair with casemates, walkable 3D plaza
arcade, brick gun rings, weathered walk-in garitas with their narrow parapet approach).
  * data: carved fine heights (plaza sunken below decks, ramp descends plaza -> battery deck, wide stair court -> deck), floor classes,
    ring / garita / casemate / bay counts, old smooth yellow garita primitives gone;
  * walking: W along the ramp, up the wide stair, and into a garita (first-person height follows);
  * pixels: plaza floor reads reddish earth, garita doorway reads dark; no console errors; 2D sim (349 walls) untouched.
Screenshots -> screenshots/t93/<tag>_*.png.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t93.py [--url URL] [--tag live] [--dist DIR] [--no-shots]"""
import argparse, functools, http.server, io, json, math, os, socketserver, threading
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--dist', default=''); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't93'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url if args.url.endswith('/') or args.url.endswith('.html') else args.url + '/'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=args.dist or os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    png = pg.screenshot()
    if not args.no_shots:
        path = os.path.join(OUT, f'{args.tag}_{name}.png'); open(path, 'wb').write(png); print('  shot', path, flush=True)
    return Image.open(io.BytesIO(png)).convert('RGB')
def region(im, fx0, fy0, fx1, fy1):
    W, H = im.size; c = im.crop((int(W * fx0), int(H * fy0), int(W * fx1), int(H * fy1))).resize((32, 32)); px = list(c.get_flattened_data()) if hasattr(c, 'get_flattened_data') else list(c.getdata())
    return tuple(sum(p[i] for p in px) / len(px) for i in range(3))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1440, 'height': 860}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=150); return True
        except Exception: return False
    def possess_at(x, y):
        G('H.g.deployCd = {}'); G(f'H.deploy("odst", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
        ok = until('window.__possess && window.__possess.cur && window.__possess.cur.vm.fort', 60000)
        P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(4000); P('P.el.msg.style.visibility = "hidden"')
        return ok
    def at(x, y, wait=1300): P(f'P.obj.x = {x}; P.obj.y = {y}'); pg.wait_for_timeout(wait)
    def look(ax, ay, dh, wait=2200): P(f'P.aimAt({ax}, {ay}, P.eye().y + ({dh}))'); pg.wait_for_timeout(wait)
    def walk(ms, key='w'):
        pg.keyboard.down(key); trace = []
        for _ in range(int(ms / 250)):
            pg.wait_for_timeout(250); s = P('({ x: P.obj.x, y: P.obj.y, h: P.groundAt(P.obj.x, P.obj.y) })'); trace.append(s)
        pg.keyboard.up(key); pg.wait_for_timeout(300); return trace

    pg.goto(URL + sep + 'map=morro&diff=medium&fpq=high', timeout=90000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1000)
    G('H.sandbox(); H.addCredits(90000)')
    check(G('(H.g.map.walls || []).length') == 349, 'the 349 lidar wall-face LOS blockers are unchanged (2D sim)')
    check(possess_at(2560, 1500), 'possessed a trooper in the Plaza de Armas')
    st = P('({ t: P.vm.t93, fort: P.vm.fort })'); t = st['t'] or {}; print('  t93', t)
    check(bool(t), 'the t93 set was built')
    check(t.get('garitas', 0) == 7 and t.get('approaches', 0) == 7, f"all 7 garitas rebuilt with a walk-in approach ({t.get('garitas')} / {t.get('approaches')})")
    check(not P('(() => { let n = 0; P.scene.traverse(o => { if (o.userData && o.userData.garita) n++; }); return n; })()'), 'old smooth yellow garita primitives are gone')
    check(t.get('bays', 0) >= 12 and t.get('chapel') == 1, f"3D plaza arcade: {t.get('bays')} walk-in vaulted bays + chapel front")
    check(t.get('rampSteps', 0) >= 60 and t.get('arches', 0) >= 2, f"main ramp: {t.get('rampSteps')} side steps, {t.get('arches')} arches (cut portal + terreplein arch)")
    check(t.get('wideSteps', 0) >= 25 and t.get('casemates', 0) >= 5, f"wide stair {t.get('wideSteps')} steps, {t.get('casemates')} casemate arches")
    check(t.get('rings', 0) >= 12 and t.get('cannons', 0) >= 6, f"brick gun-pivot rings on the gun decks ({t.get('rings')}, {t.get('cannons')} guns)")
    check(t.get('red', 0) > 6000 and t.get('deck', 0) > 50000, f"floor classes: {t.get('red')} reddish-earth cells, {t.get('deck')} pale deck cells")
    mats = P('(() => { const out = {}; P.scene.traverse(o => { if (o.isMesh && o.name === "morro_t93") { const m = o.material, u = m.map && m.map.image && m.map.image.src || (m.map && m.map.image && m.map.image.tagName) || ""; out[(u.split("/").pop() || "").split("?")[0] || "none"] = 1; } }); return Object.keys(out); })()')
    print('  t93 maps', mats)
    check(any('mr_plaster' in m for m in mats) and any('mr_brick' in m for m in mats) and any('mr_gravel' in m for m in mats), 'CC0 weathered plaster / brick / gravel textures in use')
    h = P('({ plaza: P.groundAt(2560, 1600), deckW: P.groundAt(2420, 1600), r0: P.groundAt(2660, 1590), ra: P.groundAt(2818, 1590), r1: P.groundAt(2980, 1590), band: P.groundAt(2740, 1540), sb: P.groundAt(3005, 1590), wc: P.groundAt(2750, 1917), wd: P.groundAt(2862, 1917), court: P.groundAt(2840, 1800), deck: P.groundAt(2950, 1920) })')
    print('  heights', {k: round(v, 2) for k, v in h.items()})
    check(h['deckW'] - h['plaza'] > 3, f"plaza sunken below its decks ({h['plaza']:.1f} vs {h['deckW']:.1f} m)")
    check(h['r0'] > h['ra'] > h['r1'] and h['r0'] - h['r1'] > 8 and abs(h['r1'] - h['sb']) < 1.5, f"ramp descends plaza {h['r0']:.1f} -> arch {h['ra']:.1f} -> battery {h['r1']:.1f} m")
    check(h['band'] - h['ra'] > 5, f"ramp cut runs below the terreplein ({h['band']:.1f} m above, {h['ra']:.1f} m in the cut)")
    check(h['court'] < h['deck'] - 4 and abs(h['wc'] - h['court']) < 1 and abs(h['wd'] - h['deck']) < 1, f"wide stair links the lower court {h['court']:.1f} m to the deck {h['deck']:.1f} m")
    # ---------------- shots
    at(2545, 1880); look(2560, 1560, -3.2); im = shot(pg, 'fp_plaza_floor')
    r, g, bb = region(im, 0.3, 0.72, 0.7, 0.95); print('  plaza floor rgb', (round(r), round(g), round(bb)))
    check(r > g * 1.08 and r > bb * 1.25, 'Plaza de Armas floor reads as reddish packed earth (not grey paving)')
    at(2590, 1560); look(2490, 1600, 1.5); shot(pg, 'fp_plaza_arcade_chapel')
    at(2560, 1860); look(2640, 1590, 2.5); shot(pg, 'fp_plaza_well_portal')
    rings = P('P.fort.t93.rings.map(r => [r.x, r.y, r.ca, r.sa])')
    best = min(rings, key=lambda r: math.hypot(r[0] - 3000, r[1] - 1900))
    at(best[0] - best[2] * 70 - best[3] * 25, best[1] - best[3] * 70 + best[2] * 25); look(best[0], best[1], -1.6); shot(pg, 'fp_gun_deck_rings')
    at(2840, 1760); look(2900, 1960, 3); shot(pg, 'fp_lower_court')
    at(3040, 1590); look(2818, 1590, 3.5); shot(pg, 'fp_ramp_up_to_arch')
    at(2800, 1590); look(2990, 1590, -4.5); shot(pg, 'fp_ramp_down_from_arch')
    at(2690, 1590); look(2560, 1600, 0); shot(pg, 'fp_ramp_cut_to_plaza')
    at(2800, 1830); look(2830, 1920, 0.5); shot(pg, 'fp_wide_stair_casemates')
    at(2725, 1917); look(2880, 1917, 3.5); shot(pg, 'fp_wide_stair_up')
    at(2960, 1770); look(2930, 1870, 0.5); shot(pg, 'fp_casemate_wall')
    # ---------------- the walkable surfaces are continuous (0.5 m samples) and really walked with W
    prof = P('Array.from({ length: 90 }, (_, i) => P.groundAt(2630 + i * 4, 1590))')
    jump = max(abs(a - b) for a, b in zip(prof, prof[1:]))
    check(prof[0] - prof[-1] > 10 and jump < 0.6, f"ramp surface plaza -> battery: {prof[0]:.1f} -> {prof[-1]:.1f} m, max 0.5 m step {jump:.2f} m")
    sp2 = P('Array.from({ length: 32 }, (_, i) => P.groundAt(2744 + i * 4, 1917))')
    check(sp2[-1] - sp2[0] > 5 and max(abs(a - b) for a, b in zip(sp2, sp2[1:])) < 0.6, f"wide stair surface court -> deck: {sp2[0]:.1f} -> {sp2[-1]:.1f} m")
    at(2645, 1590, 800); look(2990, 1590, 0, 600); tr = walk(10000)
    xs = [s['x'] for s in tr]; hs = [s['h'] for s in tr]; print('  walk plaza -> cut', [(round(s['x']), round(s['h'], 1)) for s in tr[::4]], 'fps', P('Math.round(P.fps)'))
    check(xs[-1] > 2665 and hs[-1] < hs[0] - 0.05, f"walked from the plaza through the portal into the ramp cut (x {xs[-1]:.0f}, floor {hs[0]:.2f} -> {hs[-1]:.2f} m)")
    at(2830, 1590, 800); look(2990, 1590, 0, 600); tr = walk(10000)
    xs = [s['x'] for s in tr]; hs = [s['h'] for s in tr]; print('  walk down ramp', [(round(s['x']), round(s['h'], 1)) for s in tr[::4]])
    jumps = max(abs(a - b) for a, b in zip(hs, hs[1:])) if len(hs) > 1 else 99
    check(xs[-1] - 2830 > 25 and hs[0] - hs[-1] > 1.5 and jumps < 1.0, f"walked down the ramp below the arch ({xs[-1] - 2830:.0f} px, -{hs[0] - hs[-1]:.1f} m)")
    shot(pg, 'walk_ramp_down')
    at(2748, 1917, 800); look(2900, 1917, 0, 600); tr = walk(10000)
    hs = [s['h'] for s in tr]; print('  walk wide stair', [(round(s['x']), round(s['h'], 1)) for s in tr[::4]])
    check(max(hs) - hs[0] > 1.5 and max(abs(a - b) for a, b in zip(hs, hs[1:])) < 1.0, f"walked up the wide stair (+{max(hs) - hs[0]:.1f} m)")
    shot(pg, 'walk_wide_stair_up')
    # ---------------- garitas: narrow approach, dark doorway, step inside
    spots = P('P.fort.t93.spots')
    dark_ok, walked = 0, 0
    for i, sp in enumerate(spots):
        sx, sy = sp['x'] - sp['ca'] * 52, sp['y'] - sp['sa'] * 52
        at(sx, sy); look(sp['x'], sp['y'], 0.2, 1800)
        im = shot(pg, f'fp_garita_{i}_approach') if i < 3 else shot(pg, f'fp_garita_{i}_approach') 
        dr = region(im, 0.47, 0.42, 0.53, 0.58); lum = sum(dr) / 3
        side = region(im, 0.30, 0.42, 0.40, 0.58); sl = sum(side) / 3
        print(f'  garita {i}: door lum {lum:.0f}, parapet lum {sl:.0f}, deck {sp["deck"]:.1f}')
        if lum < 75 and lum < sl * 0.75: dark_ok += 1
        if i < 3:
            at(sp['x'] - sp['ca'] * 22, sp['y'] - sp['sa'] * 22, 600); look(sp['x'], sp['y'], 0, 500)
            tr = walk(8000)
            ds = [(math.hypot(q['x'] - sp['x'], q['y'] - sp['y']) * 0.125, q['h']) for q in tr]; d, hh = min(ds)
            print(f'    walked in: closest {d:.2f} m from the centre at floor {hh:.2f} m (deck {sp["deck"]:.2f}), start 2.75 m')
            if d < 0.9 and abs(hh - sp['deck']) < 0.3: walked += 1
            if i == 0: shot(pg, 'walk_inside_garita')
    check(dark_ok >= 5, f'garita doorways read dark between the parapets ({dark_ok}/{len(spots)})')
    check(walked >= 2, f'walked the narrow approach into the garita ({walked}/3)')
    print('  spots', [(round(q['x']), round(q['y']), round(q['top'], 1), round(q['deck'], 1)) for q in spots])
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
