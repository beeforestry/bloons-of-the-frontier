"""t108 GMMG-1 e2e: first-person walking on El Morro and Isla de Cabras.
- no invisible walls: every solid (towers, rocks, logs, the HQ keep) blocks only where its 3D model is drawn
  (walkable just outside the measured model edge; solid at the model centre)
- Isla de Cabras / El Morro have a visible floor under every land sample (ray down hits drawn ground within 1 m of standing height)
- every linked shader stays within the GPU's sampler limit (the Cabras fine-ground shader used 18 > 16 -> vanished on real GPUs)
- the fine-ground shader linked (fineOk), and a scripted walk (WASD) actually moves the trooper across both maps
Usage: /workspace/.venv-pw/bin/python tests/e2e_t108_walk.py [--url URL] [--no-shots]"""
import argparse, functools, http.server, json, os, socketserver, threading, math
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't108'); os.makedirs(OUT, exist_ok=True)
if args.url: URL = args.url.rstrip('/') + '/index.html'
else:
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
    threading.Thread(target=httpd.serve_forever, daemon=True).start(); URL = f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
IGNORE = ('Failed to load resource', 'WebGL context lost', 'no image data found', 'GPU stall', 'peerjs', 'PeerJS')
errors, fails = [], []
WALK = {'morro': ((1700, 1500), (2600, 1560), (2100, 1420)), 'tropical': ((1460, 1500), (2020, 1180), (3100, 1150))}
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
MEASURE = '''(() => { const g = H.g, S = g.map.mpp, V = P.v.constructor, ray = P.ray, out = [];
  const solids = [...g.towers.filter(t => t.alive).map(t => ['tower:' + t.data.id, t.x, t.y, P.towerModels.get(t)?.root]),
    ...g.obstacles.filter(o => o.alive).map(o => ['obs:' + o.kind, o.x, o.y, null]), ...g.buildings.filter(b => b.alive).map(b => ['hq', b.x, b.y, null])];
  for (const [k, bx, by, root] of solids) {
    P.camera.position.set(bx * S + 4, P.groundAt(bx, by) + 1.6, by * S); P.camera.updateMatrixWorld(); P.floraGrp && P.floraGrp.userData.updateLod(P.camera, true); P.scene.updateMatrixWorld(true); P.scene.traverse(o => { if (o.isInstancedMesh) o.computeBoundingSphere(); });
    const objs = []; if (root) root.traverse(o => { if (o.isMesh) objs.push(o); }); else P.scene.traverse(o => { if ((o.isMesh || o.isInstancedMesh) && o.visible && !/floor|fort3d|ocean|sea|sky|hills|ring|cabras/.test(o.name)) objs.push(o); });
    const gh = P.groundAt(bx, by); let worst = 0, wa = 0;
    for (let a = 0; a < 16; a++) { const ca = Math.cos(a / 16 * 6.283), sa = Math.sin(a / 16 * 6.283); let ext = 0;
      for (const hh of [0.3, 0.9, 1.5]) { ray.set(new V(bx * S + ca * 7, gh + hh, by * S + sa * 7), new V(-ca, 0, -sa)); ray.far = 7; const h = ray.intersectObjects(objs, false)[0]; if (h) ext = Math.max(ext, 7 - h.distance); }
      // first metre-step outside the drawn model (+0.6 m for the body) must be walkable
      const d = ext + 0.6, ok = g.walkable(bx + ca * d / S, by + sa * d / S); if (!ok) { worst++; wa = a; } }
    out.push([k, worst, g.walkable(bx + 0.05 / S, by)]);
  } return out; })()'''
FLOOR = '''(() => { const g = H.g, S = g.map.mpp, V = P.v.constructor, ray = P.ray, objs = [], W = g.map.terrain.water; let land = 0, bad = [];
  P.scene.traverse(o => { if (o.isMesh && (o.name === 'floor' || o.name === 'fort3d_chunk')) objs.push(o); });
  for (let j = 1; j < 30; j++) for (let i = 1; i < 44; i++) { const x = i * g.map.width / 44, y = j * g.map.height / 30, st = P.groundAt(x, y); if (st < W + 0.3) continue; land++;
    ray.set(new V(x * S, 400, y * S), new V(0, -1, 0)); ray.far = 800; const h = ray.intersectObjects(objs, false)[0]; if (!h || h.point.y < st - 1.0) bad.push([x | 0, y | 0, +st.toFixed(1), h ? +h.point.y.toFixed(1) : null]); }
  return { land, bad: bad.slice(0, 8), nBad: bad.length }; })()'''
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 720}); ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and not any(k in m.text for k in IGNORE) else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
    G = lambda js: pg.evaluate(f'(async () => {{ const H = window.__game; return await eval({json.dumps(js)}); }})()')
    P = lambda js: pg.evaluate(f'(() => {{ const P = window.__possess.cur, H = window.__game; return eval({json.dumps(js)}); }})()')
    def until(js, ms):
        try: pg.wait_for_function(js, timeout=ms); return True
        except Exception: return False
    sep = '&' if '?' in URL else '?'
    for mp, (x, y), tag in (('morro', (1700, 1500), 'El Morro'), ('tropical', (1460, 1500), 'Isla de Cabras')):
        print(f'== {tag}', flush=True)
        pg.goto(URL + sep + f'map={mp}&diff=medium&fpq=high', timeout=90000); pg.wait_for_function('window.__game', timeout=30000); pg.wait_for_timeout(1500)
        G('H.g.res.load({ credits: 1e8, scrap: 1e6 }, true)')
        # a spread of towers (person-sized scouts, plant pots, turrets, the big Beacon) around the start
        for i, tid in enumerate(['dart_monkey', 'sniper_monkey', 'repeater_gatling', 'unsc_rail', 'unsc_firebase', 'unsc_beacon', 'stone_wall', 'money_monkey']):
            G(f'''(() => {{ const g = H.g; for (let r = 120; r < 900; r += 40) for (let a = 0; a < 12; a++) {{ const x = {x} + Math.cos(a / 12 * 6.283 + {i}) * r, y = {y} + Math.sin(a / 12 * 6.283 + {i}) * r;
               if (g.towers.some(t => Math.hypot(t.x - x, t.y - y) < 160)) continue; const s = g.placementSpot("{tid}", {{ x, y }}); if (s && !s.bad && H.placeTower("{tid}", s.c, s.r)) return true; }} return false; }})()''')
        G('H.g.deployCd = {}'); G(f'H.deploy("marine", {x}, {y})'); pg.wait_for_timeout(1200)
        G('H.selectSquad(H.g.squads.length - 1)'); pg.wait_for_selector('#sp-possess', timeout=6000); pg.evaluate("document.querySelector('#sp-possess').click()")
        ok = until('window.__possess && window.__possess.cur && (window.__possess.cur.vm.fort || window.__possess.cur.vm.cabras)', 90000)
        check(ok, f'{tag}: possessed a trooper, fine ground loaded'); pg.wait_for_timeout(5000)
        au = P('P.samplerAudit()')
        check(au['max'] <= 16 and au['max'] <= au['limit'], f'{tag}: max texture samplers per shader {au["max"]} ({au["name"]}) <= 16 (GPU limit {au["limit"]})')
        check(au['fineOk'] is True and au['errors'] == 0, f'{tag}: fine-ground shader linked (fineOk={au["fineOk"]}, shader errors {au["errors"]})')
        fl = P(FLOOR)
        check(fl['land'] > 50 and fl['nBad'] == 0, f'{tag}: visible floor under every land sample ({fl["land"]} land samples, {fl["nBad"]} floating {fl["bad"]})')
        # the boulder models stream in after the ground (slow over the network on the live site): wait for the first rock to be hit
        until('''(() => { const P = window.__possess.cur, g = window.__game.g, S = g.map.mpp, o = g.obstacles.find(o => o.alive && o.kind === 'rock'); if (!o) return true;
          const V = P.v.constructor, gh = P.groundAt(o.x, o.y), objs = []; P.floraGrp && P.floraGrp.userData.updateLod(P.camera, true);
          P.scene.traverse(m => { if ((m.isMesh || m.isInstancedMesh) && m.visible && !/floor|fort3d|ocean|sea|sky|hills|ring|cabras/.test(m.name)) { if (m.isInstancedMesh) m.computeBoundingSphere(); objs.push(m); } });
          P.ray.set(new V(o.x * S + 7, gh + 0.9, o.y * S), new V(-1, 0, 0)); P.ray.far = 7; return P.ray.intersectObjects(objs, false).length > 0; })()''', 90000)
        ms = P(MEASURE)
        for k, worst, centre in ms:
            check(worst == 0, f'{tag}: {k} — no invisible wall just outside its model ({worst}/16 blocked)')
            if not k.startswith('obs:log'): check(not centre, f'{tag}: {k} — solid at its centre')
        # scripted walk at 3 spots per map: WASD legs, the trooper must keep covering ground (no stuck-on-nothing)
        moved, fps = 0, P('P.fps')
        for sx, sy in WALK[mp]:
            G(f'(() => {{ const u = H.g.units.find(u => u.manual); u.x = {sx}; u.y = {sy}; }})()'); pg.wait_for_timeout(600)
            for fwd, side, yaw in ((1, 0, 0), (1, 0, 1.57), (1, 0, 3.14), (0, 1, 4.71)):
                q0 = G('(() => { const u = H.g.units.find(u => u.manual); return [u.x, u.y]; })()')
                P(f'(P.yaw = {yaw}, P.setMove({fwd}, {side}))'); pg.wait_for_timeout(1500); P('P.setMove(0, 0)')
                q = G('(() => { const u = H.g.units.find(u => u.manual); return [u.x, u.y]; })()'); moved += math.hypot(q[0] - q0[0], q[1] - q0[1]) * 0.125
        check(moved > 1.5, f'{tag}: WASD walk at {len(WALK[mp])} spots covered {moved:.1f} m (fps {fps:.0f} under swiftshader)')
        if not args.no_shots:
            P('P.pitch = -0.32'); pg.wait_for_timeout(900)
            pg.screenshot(path=os.path.join(OUT, f'fp_{mp}_walk.png'))
        pg.evaluate("() => { try { window.__possess.exit() } catch (e) {} }"); pg.wait_for_timeout(600)
    check(not errors, f'no console errors ({errors[:3]})')
    b.close()
print('\nRESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})', fails)
raise SystemExit(1 if fails else 0)
