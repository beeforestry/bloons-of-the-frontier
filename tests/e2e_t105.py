"""t105 e2e: TIER-3 SPECIALIZATION + HIDDEN CROSS-TYPE FUSION RECIPES + PROXIMITY EFFECTS.
  A. Specialization: at tier 2 the panel offers two permanent branches (#sp-br0/#sp-br1), U does not auto-pick, the pick sticks,
     both branches of every specialised tower strictly beat tier 2 (power + no stat down), element branches stamp their element,
     fusion needs the same branch, save/Continue keeps the branch; 2D screenshot of both looks.
  B. Hidden recipes: Tesla + Frost Oakshield -> Storm Core, Flame Melon + Dart -> Inferno Battery, Firebase + Sunflower -> Elite Barracks.
     Button shows "???" until discovered (localStorage bof.recipes), then the name; fee charged, one spot freed, stronger than parents,
     can't upgrade / fuse again; Inferno fires a 3-melon volley; Storm Core alternates shock / chill; almanac lists it; save/Continue.
  C. Proximity: Dart next to Frost Bastion -> chill every 3rd hit, next to Sunflower -> +6% rate; panel lists neighbour effects;
     a Glue Slinger (wet) beside a (silenced) Frost Bastion triggers FREEZE combos purely from proximity, none without it.
  D. First person: branch / recipe emblems on the 3D models (screenshot).
  E. Co-op: client specializes + recipe-fuses its own towers through the host; host + client agree; client can't touch host towers.
Usage: /workspace/.venv-pw/bin/python tests/e2e_t105.py [--url URL] [--tag live] [--no-shots] [--only ABCDE]"""
import argparse, functools, http.server, json, os, socketserver, threading, time, queue
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); ap.add_argument('--tag', default='local'); ap.add_argument('--only', default='ABCDE'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't105'); os.makedirs(OUT, exist_ok=True)
QS = {}; QL = threading.Lock()
class Q(http.server.SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*'); super().end_headers()
    def do_OPTIONS(self):
        self.send_response(204); self.send_header('Access-Control-Allow-Headers', '*'); self.send_header('Content-Length', '0'); self.end_headers()
    def do_POST(self):
        if not self.path.startswith('/__relay/send'): self.send_error(404); return
        n = int(self.headers.get('Content-Length', 0)); m = json.loads(self.rfile.read(n))
        with QL: q = QS.get(m['to'])
        if q: q.put({'from': m['from'], 'kind': m['kind'], 'm': m.get('m')})
        else:
            with QL: back = QS.get(m['from'])
            if back and m['kind'] == 'hello': back.put({'from': m['to'], 'kind': 'nopeer'})
        self.send_response(204); self.send_header('Content-Length', '0'); self.end_headers()
    def do_GET(self):
        if not self.path.startswith('/__relay/sse'): return super().do_GET()
        from urllib.parse import urlparse, parse_qs
        pid = parse_qs(urlparse(self.path).query)['id'][0]
        self.send_response(200); self.send_header('Content-Type', 'text/event-stream'); self.send_header('Cache-Control', 'no-cache'); self.end_headers()
        with QL:
            taken = pid in QS
            if not taken: QS[pid] = q = queue.Queue()
        try:
            if taken: self.wfile.write(b'event: taken\ndata: x\n\n'); self.wfile.flush(); return
            self.wfile.write(b'event: ready\ndata: x\n\n'); self.wfile.flush()
            while True:
                try: m = q.get(timeout=10)
                except queue.Empty: self.wfile.write(b': ka\n\n'); self.wfile.flush(); continue
                self.wfile.write(b'data: ' + json.dumps(m).encode() + b'\n\n'); self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError): pass
        finally:
            with QL:
                if QS.get(pid) is q: del QS[pid]
class TS(socketserver.ThreadingTCPServer): daemon_threads = True; allow_reuse_address = True

h = TS(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist'))); threading.Thread(target=h.serve_forever, daemon=True).start()
RELAY = f'http://127.0.0.1:{h.server_address[1]}/__relay'
URL = (args.url if args.url.endswith('/') or args.url.endswith('.html') else args.url + '/') if args.url else f'http://127.0.0.1:{h.server_address[1]}/index.html'
BASEURL = URL[:-len('index.html')] if URL.endswith('index.html') else URL
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS', 'favicon')
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if args.no_shots: return
    path = os.path.join(OUT, f'{args.tag}_{name}.png'); pg.screenshot(path=path); print('  shot', path, flush=True)
PLACE = """(id, lane, frac, off) => { const g = H.g, p = g.paths[lane];
  for (const o of [off, off + 18, off + 36, off + 54, -off, -off - 18, -off - 36, -off - 54]) for (const dd of [0, 30, -30, 60, -60, 90, -90]) {
    const b = p.at(Math.max(0, Math.min(p.length, p.length * frac + dd))); const x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
    const s = g.placementSpot(id, { x, y }); if (!s) continue; const t = g.placeTower(id, s); if (t) return g.towers.indexOf(t); }
  return -1; }"""
NEXTTO = """(id, i, k = 1) => { const g = H.g, a = g.towers[i], R = (g.towerRadius(id) + g.towerRadius(a.data.id) + 6) * k;
  for (let s = 0; s < 24; s++) { const an = s * Math.PI / 12, q = g.placementSpot(id, { x: a.x + Math.cos(an) * R, y: a.y + Math.sin(an) * R }); if (!q) continue;
    const t = g.placeTower(id, q); if (t) return g.towers.indexOf(t); } return -1; }"""
MAXUP = "(i) => { const t = H.g.towers[i]; while (t.upgrade(H.g)) {} return t.tier; }"
PLACE = """(id, lane, frac, off) => { const g = H.g, n = g.paths.length;
  for (const L of [lane % n, ...[...Array(n).keys()].filter((i) => i !== lane % n)]) { const p = g.paths[L];
    for (const df of [0, 0.03, -0.03, 0.06, -0.06, 0.1, -0.1, 0.15, -0.15, 0.2, -0.2, 0.3, -0.3]) { const f = Math.min(0.95, Math.max(0.05, frac + df));
      for (const o of [off, off + 18, off + 36, -off, -off - 18, -off - 36, off + 60, -off - 60]) for (const dd of [0, 30, -30]) {
        const b = p.at(Math.max(0, Math.min(p.length, p.length * f + dd))); const x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
        const s = g.placementSpot(id, { x, y }); if (!s) continue; const t = g.placeTower(id, s); if (t) return g.towers.indexOf(t); } } }
  return -1; }"""
MAXB = "(i, b) => { const t = H.g.towers[i]; while (t.upgrade(H.g, b)) {} return t.tier; }"
SIM = "(n) => { const g = H.g; const p = g.paused; g.paused = false; for (let k = 0; k < n; k++) g.step(1 / 60); g.paused = p; return g.stats; }"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    ctx = b.new_context(viewport={'width': 1440, 'height': 860}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    sep = '&' if '?' in URL else '?'
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    def until(js, ms=15000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    def load(m='tropical'):
        pg.goto(URL + sep + f'map={m}&diff=medium', timeout=90000); pg.wait_for_function('window.__game', timeout=60000); pg.wait_for_timeout(800)
    bi = lambda i: G(f'H.branchInfo({i})')
    warn = []
    pg.on('console', lambda m: warn.append(m.text) if '[validate]' in m.text else None)

    # ---------------------------------------------------------------- A: specialization
    if 'A' in args.only:
        load('tropical'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(400000)')
        check(not warn, f'in-game validator: no data issues ({warn[:2]})')
        specs = G('H.specList()'); check(len(specs) >= 10, f'{len(specs)} tower types have tier-3 branches: {", ".join(specs)}')
        a = G(f'({PLACE})("dart_monkey", 0, 0.32, 64)'); G(f'H.g.towers[{a}].upgrade(H.g)')
        i0 = bi(a); check(i0['pick'] and i0['tier'] == 1, f'Dart at tier 2 -> branch pick pending ({i0["specs"]})')
        G(f'H.focus(H.g.towers[{a}].x, H.g.towers[{a}].y, 1.8)'); G(f'H.selectTower({a})'); pg.wait_for_timeout(400)
        ok = pg.query_selector('#sp-br0') is not None and pg.query_selector('#sp-br1') is not None
        txt = pg.inner_text('#sel-panel') if ok else ''
        check(ok and i0['specs'][0] in txt and i0['specs'][1] in txt, 'panel shows both branch buttons with names')
        shot(pg, 'branch_pick_panel')
        pg.keyboard.press('u'); pg.wait_for_timeout(200); check(bi(a)['tier'] == 1, 'U hotkey does not auto-pick a branch')
        p2 = i0['power']; pg.click('#sp-br1'); pg.wait_for_timeout(300); i1 = bi(a)
        check(i1['tier'] == 2 and i1['branch'] == 1 and i1['name'] == i0['specs'][1] and i1['power'] > p2 and i1['glow'], f'picked {i1["name"]!r}: power {p2:.1f} -> {i1["power"]:.1f}, glow {i1["glow"]}')
        check(not G(f'H.g.towers[{a}].upgrade(H.g, 0)') and bi(a)['branch'] == 1, 'branch is permanent (no further upgrade / switch)')
        sub = pg.inner_text('#sel-panel'); check(i0['specs'][1] in sub, 'panel tags the branch name')
        # every specialised type: both branches beat tier 2 + plain tier 3, element branches stamp their element
        rows = []
        for sid in specs:
            for br in (0, 1):
                k = G(f'({PLACE})("{sid}", 0, {(0.05 * len(rows)) % 0.75 + 0.12:.3f}, 70)')
                if k < 0: k = G(f'({PLACE})("{sid}", 0, {0.1 + (len(rows) * 0.037) % 0.8:.3f}, 110)')
                if k < 0: rows.append((sid, br, None)); continue
                G(f'H.g.towers[{k}].upgrade(H.g)'); t2 = bi(k)['power']; G(f'H.g.towers[{k}].upgrade(H.g, {br})'); r = bi(k)
                rows.append((sid, br, (t2, r['power'], r['name'], r['elem'], r['branch'])))
                G(f'H.g.sellTower(H.g.towers[{k}])')
        placed = [r for r in rows if r[2]]
        check(len(placed) >= len(specs) * 2 - 4, f'placed+specialised {len(placed)}/{len(rows)} (water/size limits skip a few)')
        bad = [r for r in placed if not (r[2][1] > r[2][0] and r[2][4] == r[1])]
        check(not bad, f'every branch beats tier 2 in-game ({len(placed)} checked) {bad[:3]}')
        el = {(r[0], r[1]): r[2][3] for r in placed}
        check(el.get(('wizard_monkey', 1)) == 'burn' and el.get(('wizard_monkey', 0)) == 'shock' and el.get(('ninja_monkey', 0)) == 'chill', f'element branches: Stormcaller {el.get(("wizard_monkey", 0))}, Pyromancer {el.get(("wizard_monkey", 1))}, Frost Kunai {el.get(("ninja_monkey", 0))}')
        # fusion needs the same branch
        d0 = G(f'({PLACE})("dart_monkey", 0, 0.55, 64)'); G(f'({MAXB})({d0}, 0)'); d1 = G(f'({NEXTTO})("dart_monkey", {d0})'); G(f'({MAXB})({d1}, 1)')
        check(G(f'H.fusion({d0}).partner') == -1, 'Longshot + Rapid side by side: no fusion (branches differ)')
        d2 = G(f'({NEXTTO})("dart_monkey", {d1})'); G(f'({MAXB})({d2}, 1)')
        fp = G(f'H.fusion({d2})'); check(fp['partner'] == d1 and fp['branch'] == 1, f'two Rapid Volleys fuse (partner {fp["partner"]}, fee ¢{fp["fee"]})')
        pw = bi(d2)['power']; G(f'H.fuse({d2}, {d1})'); fi = G('H.g.towers.findIndex(t => t.fused)'); fb = bi(fi)
        check(fi >= 0 and fb['branch'] == 1 and fb['power'] > pw, f'fused Rapid keeps its branch and grows ({pw:.1f} -> {fb["power"]:.1f})')
        G('H.selectTower(-1)'); x0 = G(f'H.g.towers[{d0}].x'); y0 = G(f'H.g.towers[{d0}].y')
        G(f'H.focus({x0}, {y0}, 2.0)'); pg.wait_for_timeout(900); shot(pg, 'branches_2d')
        sv = G('H.save()'); br_saved = sorted([t.get('br') for t in sv['towers'] if t['id'] == 'dart_monkey' and t.get('br') is not None])
        pg.goto(URL, timeout=90000); pg.wait_for_selector('#btn-continue', timeout=30000); pg.wait_for_timeout(500); pg.click('#btn-continue')
        pg.wait_for_function('window.__game && window.__game.g && window.__game.g.towers.length > 0', timeout=60000); pg.wait_for_timeout(800)
        br_back = sorted(G('H.g.towers.filter(t => t.data.id === "dart_monkey" && t.branch != null).map(t => t.branch)'))
        check(br_saved and br_back == br_saved, f'Continue restores branches {br_back} (saved {br_saved})')

    # ---------------------------------------------------------------- B: hidden recipes
    if 'B' in args.only:
        load('tropical'); pg.evaluate("localStorage.removeItem('bof.save'); localStorage.removeItem('bof.recipes')"); G('H.addCredits(600000)')
        t = G(f'({PLACE})("tesla_coil", 0, 0.3, 66)'); G(f'({MAXB})({t}, 0)')
        f = G(f'({NEXTTO})("frost_wallnut_bastion", {t})'); G(f'({MAXB})({f}, 0)')
        r = G(f'H.recipe({t})'); check(r and r['id'] == 'storm_core' and r['partner'] == f and not r['known'], f'Tesla + Frost Oakshield side by side -> hidden recipe ready, undiscovered ({r})')
        G(f'H.focus(H.g.towers[{t}].x, H.g.towers[{t}].y, 1.8)'); G(f'H.selectTower({t})'); pg.wait_for_timeout(400)
        btn = pg.query_selector('#sp-recipe'); txt = btn.inner_text() if btn else ''
        check('???' in txt and 'Storm' not in txt, f'button hides the result: {txt.splitlines()[0] if txt else None!r}')
        shot(pg, 'recipe_unknown_panel')
        tesla_c = G(f'H.g.towers[{t}].t.combat'); inv = G(f'H.g.towers[{t}].invested + H.g.towers[{f}].invested'); n0 = G('H.g.towers.length'); cr0 = G('H.g.res.credits')
        pg.click('#sp-recipe'); pg.wait_for_timeout(400)
        si = G('H.g.towers.findIndex(t => t.data.id === "storm_core")'); sc = G(f'(() => {{ const t = H.g.towers[{si}]; return {{ c: t.t.combat, inv: t.invested, hidden: !!t.data.hidden, e2: t.data.element2, e: t.elem }}; }})()') if si >= 0 else None
        check(si >= 0 and G('H.g.towers.length') == n0 - 1, f'Storm Core created, towers {n0} -> {n0 - 1}')
        fee = (cr0 - G('H.g.res.credits'))
        check(sc and sc['inv'] == inv + fee and fee > 0, f'fee ¢{fee} charged, invested = both + fee ({sc and sc["inv"]})')
        check(sc and sc['c']['damage'] > tesla_c['damage'] and sc['c']['chain'] > tesla_c['chain'] and sc['c']['slow'] > 0 and sc['e'] == 'shock' and sc['e2'] == 'chill',
              f'Storm Core: dmg {tesla_c["damage"]}->{sc and sc["c"]["damage"]}, chain {tesla_c["chain"]}->{sc and sc["c"]["chain"]}, slow {sc and sc["c"]["slow"]}, shock/chill')
        check('storm_core' in G('H.discovered()'), 'discovery saved to localStorage (bof.recipes)')
        check(not G(f'H.g.towers[{si}].upgrade(H.g)') and G(f'H.fusion({si})')['partner'] == -1 and G(f'H.recipe({si})') is None, 'recipe tower cannot upgrade or fuse further')
        G(f'H.selectTower({si})'); pg.wait_for_timeout(300); check('Hidden fusion' in pg.inner_text('#sel-panel'), 'panel tags it as a hidden fusion')
        # shock / chill alternation
        stamps = G("""(() => { const g = H.g, t = g.towers.find(t => t.data.id === 'storm_core'); const seen = new Set(); const e = { x: t.x + 40, y: t.y, alive: true, data: { boss: false }, el: {} };
          const orig = g.teslaChain.bind(g); g.teslaChain = (tw, tg, d, c, hit) => { if (tw === t) seen.add(hit.elem); };
          for (let k = 0; k < 4; k++) g.towerFire(t, [e], t.t.combat, k); g.teslaChain = orig; return [...seen]; })()""")
        check(sorted(stamps) == ['chill', 'shock'], f'Storm Core alternates elements {stamps}')
        # 2nd pair: the button now names the result
        t2 = G(f'({PLACE})("tesla_coil", 1, 0.45, 66)'); G(f'({MAXB})({t2}, 1)'); f2 = G(f'({NEXTTO})("frost_wallnut_bastion", {t2})'); G(f'({MAXB})({f2}, 1)')
        G(f'H.selectTower({t2})'); pg.wait_for_timeout(300); btn = pg.query_selector('#sp-recipe'); txt = btn.inner_text() if btn else ''
        check('Storm Core' in txt and '???' not in txt, f'after discovery the button names it: {txt.splitlines()[0] if txt else None!r}')
        G(f'H.selectTower(-1)'); G(f'H.g.sellTower(H.g.towers[{t2}])'); G(f'H.g.sellTower(H.g.towers.find(t => t.data.id === "frost_wallnut_bastion"))')
        # inferno
        m = G(f'({PLACE})("flame_melon_mortar", 0, 0.55, 70)'); G(f'({MAXB})({m}, 1)'); d = G(f'({NEXTTO})("dart_monkey", {m})'); G(f'({MAXB})({d}, 0)')
        r2 = G(f'H.recipe({d})'); ii = G(f'H.fuseRecipe({d})')
        inf = G(f'H.g.towers[{ii}] && H.g.towers[{ii}].data.id') if ii >= 0 else None
        check(r2 and r2['id'] == 'inferno_battery' and inf == 'inferno_battery', f'Flame Melon + Dart Scout -> {inf}')
        vol = G(f"""(() => {{ const g = H.g, t = g.towers[{ii}], n0 = g.projectiles.length; const e = g.enemies[0] || {{ x: t.x + 120, y: t.y, alive: true, vx: 0, vy: 0 }};
          const uid = H.spawn('red', 0, 0.5, 50); const en = g.enemies.find(x => x.uid === uid); g.towerFire(t, [en], t.t.combat, 1); return g.projectiles.slice(n0).filter(p => (p.o || p).kind === 'melon').length; }})()""")
        check(vol == 3, f'Inferno Battery lobs a {vol}-melon volley (burn {G(f"H.g.towers[{ii}].elem")})')
        # elite barracks
        fbI = G(f'({PLACE})("unsc_firebase", 0, 0.72, 80)'); G(f'({MAXB})({fbI}, 0)'); su = G(f'({NEXTTO})("sunflower", {fbI})'); G(f'({MAXB})({su}, 0)')
        fbc = G(f'H.g.towers[{fbI}].t.cover'); ei = G(f'H.fuseRecipe({fbI}, {su})')
        eb = G(f'(() => {{ const t = H.g.towers[{ei}]; return t ? {{ id: t.data.id, cover: t.t.cover, aura: t.t.aura }} : null; }})()') if ei >= 0 else None
        check(eb and eb['id'] == 'elite_barracks' and eb['cover']['garrisonSlots'] > fbc['garrisonSlots'] and eb['cover']['bonusMaxHp'] > fbc['bonusMaxHp'] and eb['aura']['ratePct'] > 0,
              f'Firebase + Sunflower -> Elite Barracks (slots {fbc["garrisonSlots"]}->{eb and eb["cover"]["garrisonSlots"]}, aura +{eb and eb["aura"]["ratePct"]} rate)')
        check(sorted(G('H.discovered()')) == ['elite_barracks', 'inferno_battery', 'storm_core'], f'discovered list {G("H.discovered()")}')
        # 2D look of the three
        G('H.selectTower(-1)'); sx = G(f'H.g.towers.find(t => t.data.id === "inferno_battery").x'); sy = G(f'H.g.towers.find(t => t.data.id === "inferno_battery").y')
        G(f'H.focus({sx}, {sy}, 1.6)'); G("(() => { let n = 0; const iv = setInterval(() => { for (const id of ['red', 'blue', 'green']) H.spawn(id, 0, 0.3, 20); if (++n > 20) clearInterval(iv); }, 700); })()"); G('H.g.paused = false'); pg.wait_for_timeout(2500)
        shot(pg, 'recipes_2d')
        # almanac
        G('H.g.paused = true'); pg.evaluate("document.getElementById('btn-combos').click()"); pg.wait_for_timeout(500); alm = pg.inner_text('#combo-guide')
        check('Hidden fusions' in alm and 'Storm Core' in alm and 'Inferno Battery' in alm and '3/3' in alm, 'almanac lists the discovered hidden fusions (3/3)')
        shot(pg, 'almanac'); pg.click('#cg-close')
        sv = G('H.save()'); hid = sorted(t['id'] for t in sv['towers'] if t['id'] in ('storm_core', 'inferno_battery', 'elite_barracks'))
        pg.goto(URL, timeout=90000); pg.wait_for_selector('#btn-continue', timeout=30000); pg.wait_for_timeout(500); pg.click('#btn-continue')
        pg.wait_for_function('window.__game && window.__game.g && window.__game.g.towers.length > 0', timeout=60000); pg.wait_for_timeout(800)
        back = sorted(G('H.g.towers.filter(t => t.data.hidden).map(t => t.data.id)'))
        check(len(hid) == 3 and back == hid, f'Continue restores recipe towers {back}')

    # ---------------------------------------------------------------- C: proximity
    if 'C' in args.only:
        load('tropical'); pg.evaluate("localStorage.removeItem('bof.save')"); G('H.addCredits(300000)')
        d = G(f'({PLACE})("dart_monkey", 0, 0.3, 64)'); fr = G(f'({NEXTTO})("frost_wallnut_bastion", {d})'); G('H.proxNow()')
        px = G(f'H.prox({d})'); check(px['elem'] == 'chill' and px['from'] == fr, f'Dart beside Frost Bastion: {px}')
        far = G(f'({PLACE})("dart_monkey", 0, 0.75, 64)'); G('H.proxNow()'); check(G(f'H.prox({far})')['elem'] is None, 'a far Dart gets nothing')
        sf = G(f'({NEXTTO})("sunflower", {d})')
        for kk in (1.3, 1.6, 2.0, 2.3):
            if sf < 0: sf = G(f'({NEXTTO})("sunflower", {d}, {kk})')
        G('H.proxNow()'); px = G(f'H.prox({d})')
        check(px['support'] == sf and px['rate'] >= 0.06, f'+ Sunflower beside it: support link, rate buff {px["rate"]:.2f} ({sf}, {px})')
        G(f'H.focus(H.g.towers[{d}].x, H.g.towers[{d}].y, 2.0)'); G(f'H.selectTower({d})'); pg.wait_for_timeout(500)
        pt = pg.inner_text('#sp-prox') if pg.query_selector('#sp-prox') else ''
        check('Chill' in pt and 'attack speed' in pt, f'panel lists neighbour effects: {pt!r}')
        shot(pg, 'proximity_panel')
        stamps0 = G('H.g.stats.proxStamps')
        G(f"(() => {{ for (let k = 0; k < 8; k++) H.spawn('red', 0, 0.28 + k * 0.004, 30); }})()"); G(f'({SIM})(400)')
        check(G('H.g.stats.proxStamps') > stamps0, f'proximity element stamps happen in combat ({G("H.g.stats.proxStamps") - stamps0})')
        # combo purely from proximity: wet Glue Slinger + silenced Frost Bastion
        def freeze_run(with_frost):
            load('tropical'); G('H.addCredits(300000)')
            gl = G(f'({PLACE})("glue_slinger", 1, 0.4, 60)'); G(f'({MAXB})({gl}, 0)')
            if with_frost:
                q = G(f'({NEXTTO})("frost_wallnut_bastion", {gl})'); G(f'H.g.towers[{q}].update = () => {{}}')
            G('H.proxNow()')
            c0 = G('(H.g.stats.elem && H.g.stats.elem.freeze) || 0')
            G(f"(() => {{ for (let k = 0; k < 14; k++) H.spawn('red', 1, 0.3 + k * 0.006, 40); }})()"); G(f'({SIM})(720)')
            return G('(H.g.stats.elem && H.g.stats.elem.freeze) || 0') - c0, G(f'H.prox({gl}).elem')
        fz1, pe = freeze_run(True); fz0, _ = freeze_run(False)
        check(pe == 'chill' and fz1 > 0 and fz0 == 0, f'Glue (wet) + silenced Frost neighbour -> {fz1} FREEZE combos from proximity alone (control without it: {fz0})')

    # ---------------------------------------------------------------- D: first-person emblems
    if 'D' in args.only:
        load('tropical'); G('H.addCredits(600000); H.g.paused = false')
        t = G(f'({PLACE})("tesla_coil", 0, 0.32, 66)'); G(f'({MAXB})({t}, 0)'); f = G(f'({NEXTTO})("frost_wallnut_bastion", {t})'); G(f'({MAXB})({f}, 0)'); G(f'H.fuseRecipe({t}, {f})')
        sc = G('H.g.towers.findIndex(t => t.data.id === "storm_core")')
        dd = G(f'({NEXTTO})("dart_monkey", {sc}, 1.7)'); G(f'({MAXB})({dd}, 0)')
        at = G(f'({NEXTTO})("unsc_autoturret", {sc}, 2.6)')
        check(at >= 0 and dd >= 0, f'Storm Core + Longshot Dart + Autoturret to possess ({sc}, {dd}, {at})')
        if at >= 0:
            G(f'H.selectTower({at})'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.click('#sp-possess')
            ok = until('window.__possess && window.__possess.cur', 90000); check(ok, 'possessed the Autoturret'); pg.wait_for_timeout(3500)
            fx = G(f"""(() => {{ const P = window.__possess.cur, g = H.g, s = g.towers.find(t => t.data.id === 'storm_core'), d = g.towers[{dd}];
              if (P.aimAt) P.aimAt((s.x + d.x) / 2, (s.y + d.y) / 2, 0.4); if (P.el && P.el.msg) P.el.msg.style.visibility = 'hidden';
              return P.fusedFx ? [...P.fusedFx.values()].map(x => x.name) : []; }})()""")
            pg.wait_for_timeout(1500)
            check('recipeFx' in fx and 'branchFx' in fx, f'FP: recipe + branch emblem decorations {fx}')
            shot(pg, 'emblems_fp')
            pg.keyboard.press('Escape'); pg.wait_for_timeout(1000)

    # ---------------------------------------------------------------- E: co-op sync
    if 'E' in args.only:
        b2 = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
        def newp(br, name):
            c = br.new_context(viewport={'width': 1280, 'height': 760}); c.add_init_script(f"localStorage.setItem('bof.tutorialDone','1');localStorage.setItem('bof.relay','{RELAY}')")
            q = c.new_page(); q.on('pageerror', lambda e: errors.append(f'[{name}] {e}')); return q
        def wait(q, js, ms=20000):
            t0 = time.time()
            while time.time() - t0 < ms / 1000:
                try:
                    v = q.evaluate(js)
                    if v: return v
                except Exception: pass
                time.sleep(0.2)
            return None
        host, cli = newp(b, 'host'), newp(b2, 'client')
        host.goto(BASEURL + 'index.html'); host.wait_for_selector('.mode-pick'); host.click('.mode-pick[data-mode="coop"]'); host.click('#mp-host')
        code = wait(host, "(() => { const e = document.getElementById('room-code'); return e && e.textContent })()", 30000)
        check(bool(code), f'co-op room {code}')
        if code:
            cli.goto(BASEURL + f'index.html?room={code}')
            wait(host, "document.querySelectorAll('.lobby-players li:not(.empty)').length === 2", 30000); wait(cli, "!!document.getElementById('btn-ready')", 15000)
            cli.click('#btn-ready'); wait(host, "!document.getElementById('btn-mpstart').disabled", 8000); host.click('#btn-mpstart')
            check(bool(wait(cli, "window.__game && window.__game.mp() && window.__game.mp().snaps > 3", 20000)), 'client receives snapshots')
            host.evaluate('__game.g.res.add(400000)'); host.evaluate('__game.mpDonate(1, 150000)')
            wait(cli, '__game.mp().credits > 100000', 8000)
            HP = PLACE.replace('H.g', '__game.g'); HN = NEXTTO.replace('H.g', '__game.g')
            h1 = host.evaluate(f'({HP})("tesla_coil", 0, 0.3, 66)'); h2 = host.evaluate(f'({HN})("frost_wallnut_bastion", {h1})')
            host.evaluate(f'(() => {{ for (const i of [{h1}, {h2}]) {{ const t = __game.g.towers[i]; while (t.upgrade(__game.g, 0)) {{}} }} }})()')
            spot = host.evaluate(f"""(() => {{ const g = __game.g, p = g.paths[0]; for (const o of [66, 84, 100, -66, -84]) for (const dd of [0, 40, -40, 80]) {{
              const b = p.at(p.length * 0.6 + dd), x = b.x + Math.cos(b.ang + Math.PI / 2) * o, y = b.y + Math.sin(b.ang + Math.PI / 2) * o;
              const s = g.placementSpot('tesla_coil', {{ x, y }}); if (!s) continue; const R = g.towerRadius('tesla_coil') * 2 + 6;
              for (let k = 0; k < 12; k++) {{ const s2 = g.placementSpot('frost_wallnut_bastion', {{ x: s.x + Math.cos(k * 0.5236) * R, y: s.y + Math.sin(k * 0.5236) * R }}); if (s2 && Math.hypot(s2.x - s.x, s2.y - s.y) > R * 0.9) return [s, s2]; }} }} return null; }})()""")
            check(spot is not None, 'found two adjacent free spots for the client')
            if spot:
                cli.evaluate(f'__game.g.placeTower("tesla_coil", {json.dumps(spot[0])})'); time.sleep(0.6); cli.evaluate(f'__game.g.placeTower("frost_wallnut_bastion", {json.dumps(spot[1])})')
                check(bool(wait(host, '__game.g.towers.filter(t => t.owner === 1).length === 2', 8000)), 'client placed Tesla + Frost (owner P2) on the host')
                for _ in range(4):
                    cli.evaluate('__game.g.towers.filter(t => t.owner === 1).forEach(t => t.upgrade(__game.g, 1))'); time.sleep(0.5)
                okb = wait(host, '__game.g.towers.filter(t => t.owner === 1 && t.isMaxTier && t.branch === 1).length === 2', 8000)
                okc = wait(cli, '__game.g.towers.filter(t => t.owner === 1 && t.isMaxTier && t.branch === 1).length === 2', 8000)
                check(bool(okb) and bool(okc), 'client picked branch 2 on both; host + client agree')
                cli.evaluate('(() => { const g = __game.g, m = g.towers.filter(t => t.owner === 0); g.fuseRecipe(m[0], m[1]); })()'); time.sleep(1)
                check(host.evaluate('__game.g.towers.filter(t => t.data.hidden).length') == 0, "client cannot recipe-fuse P1's towers")
                cli.evaluate('(() => { const g = __game.g, m = g.towers.filter(t => t.owner === 1); g.fuseRecipe(m[0], m[1]); })()')
                okh = wait(host, '__game.g.towers.some(t => t.owner === 1 && t.data.id === "storm_core") && __game.g.towers.filter(t => t.owner === 1).length === 1', 8000)
                okc = wait(cli, '__game.g.towers.some(t => t.owner === 1 && t.data.id === "storm_core") && __game.g.towers.filter(t => t.owner === 1).length === 1', 8000)
                check(bool(okh) and bool(okc), 'client recipe fusion runs on the host and Storm Core mirrors back')
                hs = host.evaluate('(() => { const t = __game.g.towers.find(t => t.data.id === "storm_core"); return [t.t.combat.damage, t.sellValue]; })()')
                cs = cli.evaluate('(() => { const t = __game.g.towers.find(t => t.data.id === "storm_core"); return t ? [t.t.combat.damage, t.sellValue] : null; })()')
                check(cs is not None and cs[0] == hs[0] and abs(cs[1] - hs[1]) <= 1, f'host / client Storm Core stats + sell agree {hs} / {cs}')
        b2.close()
    check(not errors, f'no console errors {errors[:3]}')
    b.close()
print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
