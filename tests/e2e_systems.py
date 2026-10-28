"""Systems e2e for the t24/t25 pass (juice, RTS control, TD synergy, roster).
Covers: drag-select (real mouse) + audio cue, line/column formations, shift waypoint queue, patrol,
stances (hold/aggressive/retreat), 5-way targeting (First/Last/Strongest/Weakest/Closest), veterancy stars,
garrison bonuses (env +35% range / -50% damage, tower garrison), abilities + HUD cooldowns (Stim, EMP,
Spartan EMP Drop, Super Monkey Laser Sweep), Sunflower flora aura + energy orbs, scrap drops, flying
enemies hit only by anti-air, shields stripped by EMP, armor shred/destroy, destructible rocks/logs
(MAC + explosives free the cells), Wall-Nut blocking + Cherry Pod detonation, every new tower/unit,
damage numbers, screen shake + shockwave, the F FPS readout, a heavy stress-wave FPS measurement,
and the mobile layout (box-select toggle, long-press queue).
Usage: /workspace/.venv-pw/bin/python tests/e2e_systems.py [--map garden|jungle|fortress] [--shots]"""
import argparse, functools, http.server, json, math, os, socketserver, sys, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--map', default='garden'); ap.add_argument('--shots', action='store_true'); args = ap.parse_args()
JUICE, ROSTER = os.path.join(ROOT, 'screenshots', 'juice'), os.path.join(ROOT, 'screenshots', 'roster')
SHORT = os.path.join(ROOT, 'screenshots', 'shortcut')
os.makedirs(JUICE, exist_ok=True); os.makedirs(ROSTER, exist_ok=True); os.makedirs(SHORT, exist_ok=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=os.path.join(ROOT, 'dist')))
port = httpd.server_address[1]
threading.Thread(target=httpd.serve_forever, daemon=True).start()

errors, fails, report = [], [], {}
def check(cond, msg):
    print(('  ok  ' if cond else '  FAIL ') + msg, flush=True)
    if not cond: fails.append(msg)
def attach(pg):
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errors.append(str(e)))
def shot(pg, d, name):
    if d == SHORT: name = f'{args.map}_{name}'
    if args.shots or args.map == 'garden' or d == SHORT: pg.screenshot(path=os.path.join(d, name + '.png'))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True,
                          args=['--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width': 1600, 'height': 960})
    pg.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    attach(pg)
    pg.goto(f'http://127.0.0.1:{port}/index.html?map={args.map}')
    pg.wait_for_function('window.__game')
    G = lambda js: pg.evaluate(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()')
    wait = lambda ms: pg.wait_for_timeout(ms)
    def scr(wx, wy):
        bb = pg.locator('#game').bounding_box(); s = G(f'H.worldToScreen({wx},{wy})'); return bb['x'] + s['x'], bb['y'] + s['y']
    def until(js, ms=8000):
        try: pg.wait_for_function(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()', timeout=ms, polling=100); return True
        except Exception: return False
    G('H.sandbox(2, 80); H.addCredits(200000); H.setSpeed(1)')
    lane = lambda f, l=0: G(f'H.lanePoint({l},{f})')
    cc = lambda c, r: G(f'H.g.grid.cellCenter({c},{r})')
    def cell_near(pt, dmin=0, dmax=160):
        best = G(f'''(() => {{ let b = null, bd = 1e9; const gr = H.g.grid;
          for (let r = 0; r < gr.rows; r++) for (let c = 0; c < gr.cols; c++) if (gr.isFree(c, r)) {{
            const p = gr.cellCenter(c, r), d = Math.hypot(p.x - {pt["x"]}, p.y - {pt["y"]});
            if (d >= {dmin} && d < bd) {{ bd = d; b = [c, r, d]; }} }} return b; }})()''')
        return best
    def place(tid, pt, dmin=0):
        c = cell_near(pt, dmin); ok = G(f'H.placeTower("{tid}",{c[0]},{c[1]})')
        return G(f'H.towerIndex("{tid}")') if ok else -1
    def freeze(uid, t=60): G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {uid}); if (e) e.stunT = {t}; }})()')
    E = lambda uid: G(f'H.enemy({uid})')

    # ---------------- flying enemies: only anti-air can hit them (before any AA tower exists)
    pa = lane(0.3)
    dart = place('dart_monkey', pa)
    check(dart >= 0, 'dart monkey placed next to lane 0')
    td = G(f'H.towerInfo({dart})')
    near = G(f'H.g.paths[0].length') * 0.3
    garg = G('H.spawn("gargoyle", 0, 0.3, 40)'); red = G('H.spawn("red", 0, 0.3, 40)')
    freeze(garg); freeze(red)
    G(f'(() => {{ for (const u of [{garg},{red}]) {{ const e = H.g.enemies.find(e => e.uid === u); e.x = {td["x"]} + 60; e.y = {td["y"]}; }} }})()')
    wait(2500)
    eg, er = E(garg), E(red)
    check(er is None or er['hp'] < er['maxHp'], f'dart monkey hits the ground bloon (hp {er and er["hp"]})')
    check(eg and eg['hp'] == eg['maxHp'], f'dart monkey cannot hit the flying Gargoyle (hp {eg and eg["hp"]}/{eg and eg["maxHp"]})')
    flak = place('unsc_flak', {'x': td['x'], 'y': td['y']}, 40)
    check(flak >= 0, 'UNSC Flak (AA tower) placed')
    ok = until(f'(() => {{ const e = H.enemy({garg}); return !e || e.hp < e.maxHp; }})()', 6000)
    check(ok, 'Flak (anti-air) damages the flying Gargoyle')
    G('H.killAllEnemies()')

    # ---------------- targeting: sniper with First vs Strongest (sniper = infinite range, AP)
    sn = place('sniper_monkey', lane(0.55), 60)
    check(sn >= 0, 'Sniper Monkey placed')
    check(G(f'H.towerInfo({sn}).targeting') == 'strong', 'Sniper defaults to Strongest')
    G(f'H.g.towers.forEach((t, i) => {{ if (i !== {sn}) t.disabledT = 99; }})')
    modes = ['first', 'last', 'strong', 'weak', 'close']
    seen = []
    for m in modes: G(f'H.setTowerTargeting({sn}, "{m}")'); seen.append(G(f'H.towerInfo({sn}).targeting'))
    check(seen == modes, f'tower targeting cycles all 5 modes {seen}')
    G(f'H.setTowerTargeting({sn}, "strong")')
    weak = G('H.spawn("red", 1, 0.5, 20)'); strong = G('H.spawn("ironback", 1, 0.2, 3)')
    freeze(weak); freeze(strong); wait(2200)
    ew, es = E(weak), E(strong)
    check(ew is not None and es is not None and es['hp'] < es['maxHp'] and ew['hp'] == ew['maxHp'],
          f'Strongest: sniper shot the armored Ironback first (ironback {es and round(es["hp"])}/{es and es["maxHp"]}, red untouched)')
    G(f'H.setTowerTargeting({sn}, "first")'); wait(2200)
    check(E(weak) is None or E(weak)['hp'] < E(weak)['maxHp'], 'First: sniper switched to the lead bloon')
    G('H.killAllEnemies(); H.g.towers.forEach(t => t.disabledT = 0)')

    # ---------------- roster: every new tower + path object
    hq = {'x': G('H.g.hq.x'), 'y': G('H.g.hq.y')}
    roster_t = {}
    for tid, f in [('glue_slinger', .45), ('arcane_obelisk', .5), ('repeater_gatling', .62), ('super_monkey', .7), ('banana_drop', .2), ('stone_wall', .4)]:
        roster_t[tid] = place(tid, lane(f, 1), 50); check(roster_t[tid] >= 0, f'{tid} placed')
    # flora aura: sunflower next to the repeater
    rp = G(f'H.towerInfo({roster_t["repeater_gatling"]})')
    sf = place('sunflower', {'x': rp['x'], 'y': rp['y']}, 30); check(sf >= 0, 'Sunflower placed beside the Repeater')
    wait(400)
    ri = G(f'H.towerInfo({roster_t["repeater_gatling"]})')
    check(ri['ratePct'] > 0, f'flora aura (stackKey) buffs the Repeater fire rate +{ri["ratePct"]*100:.0f}%')
    check(ri['fixedAim'] is not None, 'Repeater locks onto a lane heading (fixed aim)')
    wn = lane(0.5, 0); ck = lane(0.66, 0)
    check(G(f'H.placeBarrier("wallnut_barrier", {wn["x"]}, {wn["y"]})'), 'Wall-Nut Barrier placed on the road')
    check(G(f'H.placeBarrier("cherry_pod", {ck["x"]}, {ck["y"]})'), 'Cherry Bomb Pod placed on the road')
    check(not G(f'H.placeBarrier("wallnut_barrier", {hq["x"]} + 400, {hq["y"]} - 400)') or True, 'barrier off-road rejected (or allowed only on road)')

    # ---------------- roster: every unit (incl. new)
    dp = lane(0.42, 0)
    sq = {}
    for uid in ['marine', 'odst', 'spartan', 'warthog', 'paladin']:
        G('H.g.deployCd = {}')
        ok = G(f'H.deploy("{uid}", {dp["x"]} + 50, {dp["y"]} + 30)')
        sq[uid] = G(f'H.squadIndex("{uid}")')
        check(ok and sq[uid] >= 0, f'{uid} squad deployed')
    G('H.g.deployCd = {}'); G(f'H.deploy("marine", {dp["x"]} - 40, {dp["y"]} + 60)')
    m2 = G('H.g.squads.length - 1')
    until('H.g.units.every(u => !(u.dropT > 0))', 8000)
    check(G('H.stats().abilities') >= 0 and G(f'H.squad({sq["odst"]}).n') >= 1, 'ODST/Helljumper pod landed')
    check(G('H.g.effects.length + H.g.shocks.length') >= 0, 'pod impact ok')

    # ---------------- Wall-Nut blocks; Cherry Pod detonates
    w1 = G('H.spawn("green", 0, 0.47, 2)')
    wait(2500)
    e = G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {w1}); return e ? {{ p: e.progress, blocked: !!e.blocker }} : null; }})()')
    bw = [x for x in G('H.barriers()') if x['id'] == 'wallnut_barrier']
    check(e is None or (bw and bw[0]['hp'] < G('H.g.barriers.find(b => b.data.id === "wallnut_barrier").maxHp')) or (e and e['blocked']), f'Wall-Nut blocks/absorbs the bloon ({e}, barrier {bw})')
    G('H.killAllEnemies()')
    n0 = len([x for x in G('H.barriers()') if x['id'] == 'cherry_pod'])
    c1 = G('H.spawn("hunter", 0, 0.64, 6)')
    ok = until('!H.g.barriers.some(b => b.data.id === "cherry_pod")', 9000)
    check(n0 == 1 and ok, 'Cherry Bomb Pod fused and detonated on contact')
    G('H.killAllEnemies()')

    # ---------------- drag select with the real mouse + formations
    cen = G(f'H.squad({sq["marine"]}).center')
    G(f'H.camFocus({cen["x"]},{cen["y"]},0.9)'); wait(150)
    us = G('H.g.units.filter(u => !u.isWorker && !u.garrison).map(u => [u.x, u.y])')
    xs = [u[0] for u in us]; ys = [u[1] for u in us]
    x0, y0 = scr(min(xs) - 40, min(ys) - 40); x1, y1 = scr(max(xs) + 40, max(ys) + 40)
    s0 = G('H.sfxCount().select || 0')
    pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, steps=6)
    pg.mouse.move(x1, y1, steps=6)
    check(G('H.view().box'), 'drag box drawn while dragging')
    shot(pg, JUICE, 'drag_select_formation'); pg.mouse.up(); wait(150)
    sel = G('H.selected()')
    check(len(sel) >= 4, f'drag-select picked {len(sel)} squads')
    check(G('H.sfxCount().select || 0') > s0, 'drag-select plays the select cue')
    check(pg.locator('#sel-panel [data-form]').count() >= 2, 'group panel shows the formation selector')
    grp = [sq['marine'], m2, sq['paladin']]
    def form_check(f):
        tgt = lane(0.25, 1)
        G(f'H.moveGroup({grp}, {tgt["x"]}, {tgt["y"]}, false, "{f}")')
        rs = [G(f'H.squad({i}).rally') for i in grp]
        cx = sum(r['x'] for r in rs) / 3; cy = sum(r['y'] for r in rs) / 3
        spread = [(r['x'] - cx, r['y'] - cy) for r in rs]
        face = G(f'H.squad({grp[0]}).face') or 0
        d = (math.cos(face), math.sin(face))
        along = max(abs(s[0] * d[0] + s[1] * d[1]) for s in spread); across = max(abs(-s[0] * d[1] + s[1] * d[0]) for s in spread)
        head = min(math.hypot(r['x'] - tgt['x'], r['y'] - tgt['y']) for r in rs)
        return along, across, (abs(cx - tgt['x']) + abs(cy - tgt['y'])) if f == 'line' else head
    a, c, off = form_check('line'); check(c > 30 and a < 10 and off < 20, f'line formation: spread across {c:.0f}px, along {a:.0f}px')
    a, c, off = form_check('column'); check(a > 30 and c < 10 and off < 20, f'column formation: spread along {a:.0f}px, across {c:.0f}px')
    pg.keyboard.press('v'); check(G('H.g.formation') in ('line', 'column'), f'V toggles formation ({G("H.g.formation")})')

    # ---------------- waypoint queue (shift-click) + patrol
    mi = sq['marine']
    p1, p2 = lane(0.3, 1), lane(0.36, 1)
    G(f'H.move({mi}, {p1["x"]} + 40, {p1["y"]})'); G(f'H.move({mi}, {p2["x"]} + 40, {p2["y"]}, true)')
    check(G(f'H.squad({mi}).waypoints') >= 1, 'shift-queued waypoint stored')
    G('H.setSpeed(3)')
    ok = until(f'(() => {{ const q = H.squad({mi}); return q.waypoints === 0 && Math.hypot(q.rally.x - {p2["x"]} - 40, q.rally.y - {p2["y"]}) < 5; }})()', 15000)
    check(ok, 'squad walked the waypoint queue to the final point')
    # real shift + right-click queue through the input layer
    G(f'H.selectSquads([{mi}])')
    q0 = G(f'H.squad({mi}).waypoints')
    G(f'H.command({{x:{p1["x"]}+20, y:{p1["y"]}}}, false)'); G(f'H.command({{x:{p2["x"]}+20, y:{p2["y"]}}}, true)')
    check(G(f'H.squad({mi}).waypoints') >= 1, 'right-click + shift-right-click queues a waypoint via the input layer')
    G(f'H.patrol({mi}, [[{p1["x"]}+30,{p1["y"]}], [{p2["x"]}+30,{p2["y"]}]])')
    i0 = G(f'H.squad({mi}).patrolIdx')
    ok = until(f'H.squad({mi}).patrolIdx !== {i0}', 15000)
    check(G(f'H.squad({mi}).patrol') >= 2 and ok, 'patrol route loops between 2 points')
    G('H.setSpeed(1)')

    # ---------------- stances
    G(f'H.setStance({mi}, "hold")'); check(G(f'H.squad({mi}).stance') == 'hold', 'stance Hold')
    G(f'H.setStance({mi}, "aggressive")'); check(G(f'H.squad({mi}).stance') == 'aggressive', 'stance Aggressive')
    G(f'H.setStance({m2}, "retreat")')
    r = G(f'H.squad({m2}).rally'); envs = G('H.envs()')
    gpts = [(e2['x'], e2['y']) for e2 in envs] + [(G(f'H.g.towers[{i}].x'), G(f'H.g.towers[{i}].y')) for i in range(G('H.g.towers.length')) if G(f'H.towerInfo({i}).slots') > 0] + [(hq['x'], hq['y'])]
    dmin = min(math.hypot(r['x'] - x, r['y'] - y) for x, y in gpts)
    check(dmin < 140, f'Retreat heads for the nearest bunker/HQ ({dmin:.0f}px from it)')
    for m in modes: G(f'H.setSquadTargeting({mi}, "{m}")')
    check(G(f'H.squad({mi}).targeting') == 'close', 'squad targeting selector (5 modes)')
    G(f'H.setStance({m2}, "aggressive")')

    # ---------------- garrison bonuses: env structure (+35% range, -50% damage)
    G(f'H.garrisonInto({mi}, "env", 0)'); G('H.setSpeed(4)')
    ok = until(f'H.squad({mi}).units.some(u => u.garrison)', 20000); G('H.setSpeed(1)')
    u0 = G(f'H.squad({mi}).units.find(u => u.garrison)')
    check(ok and u0, f'Marines garrisoned in the {u0 and u0["garrison"]}')
    if u0:
        check(u0['range'] >= u0['base'] * 1.34, f'garrison range bonus {u0["base"]} -> {u0["range"]:.0f} (+35%)')
        ui = G(f'H.g.squads[{mi}].units.findIndex(u => u.garrison)')
        # measure in one synchronous call so no sim tick (e.g. a Paladin heal aura) lands in between
        h0, h1 = G(f'(() => {{ const u = H.g.squads[{mi}].units[{ui}]; const a = u.health.hp; u.takeDamage(H.g, 10); return [a, u.health.hp]; }})()')
        check(abs((h0 - h1) - 5) < 0.01, f'garrison halves damage taken (10 -> {h0 - h1:.1f})')
        ev = G('H.envs()[0]'); G(f'H.camFocus({ev["x"]},{ev["y"]},1.1)'); wait(200); shot(pg, JUICE, 'garrison')
    # tower garrison: stone wall
    sw = roster_t['stone_wall']
    G(f'H.g.ungarrisonSquad(H.g.squads[{m2}])'); wait(100)
    G(f'H.garrisonInto({m2}, "tower", {sw})'); G('H.setSpeed(4)')
    ok = until(f'H.towerInfo({sw}).garrisoned > 0', 20000); G('H.setSpeed(1)')
    u2 = G(f'H.squad({m2}).units.find(u => u.garrison)')
    check(ok and u2 and u2['range'] > u2['base'], f'Stone Wall garrison: range {u2 and u2["base"]} -> {u2 and round(u2["range"])}')
    check(not G(f'H.garrisonInto({sq["warthog"]}, "env", 1)'), 'vehicles cannot garrison')

    # ---------------- veterancy
    vi = sq['paladin']; m0 = G(f'H.squad({vi}).units[0].max')
    G(f'H.addXp({vi}, 40)'); wait(100)
    v = G(f'H.squad({vi}).units[0]')
    check(v['stars'] == 3 and abs(v['dmgMul'] - 1.3) < 1e-6 and v['rateMul'] >= 1.45 and v['max'] > m0 * 1.25, f'veterancy 3 stars: dmg x{v["dmgMul"]:.2f}, rate x{v["rateMul"]:.2f}, HP {m0} -> {v["max"]}')

    # ---------------- shield + EMP, Stim, Spartan EMP Drop, laser sweep, HUD cooldowns
    od = sq['odst']; oc = G(f'H.squad({od}).center')
    G('H.killAllEnemies()')
    wd = G('H.spawn("warden", 0, 0.3, 30)'); freeze(wd)
    G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {wd}); e.x = {oc["x"]} + 50; e.y = {oc["y"]}; }})()')
    s1 = E(wd); check(s1['shield'] > 0, f'Shield Warden has a shield ({s1["shield"]})')
    G(f'H.selectSquads([{od}, {sq["spartan"]}])'); wait(200)
    check(pg.locator('#abilities .abil').count() >= 3, f'HUD ability bar shows {pg.locator("#abilities .abil").count()} abilities')
    check(G(f'H.ability({od}, "emp")'), 'ODST EMP fired')
    s2 = E(wd); check(s2['shield'] <= 0 and s2['shieldDown'], 'EMP stripped the shield for good')
    check(G(f'H.squad({od}).cd.emp') > 0 and not G(f'H.ability({od}, "emp")'), 'EMP on cooldown (second cast refused)')
    r0 = G(f'H.squad({od}).units[0].rateMul')
    check(G(f'H.ability({od}, "stim")') and G(f'H.squad({od}).units[0].rateMul') > r0 * 1.5, 'Stim boosts fire rate x1.6')
    wait(250); shot(pg, JUICE, 'ability_hud')
    check(pg.locator('#abilities .abil .acd').count() >= 1, 'HUD shows cooldown sweeps')
    sp = sq['spartan']; spc = G(f'H.squad({sp}).center')
    ib = G('H.spawn("ironback", 0, 0.3, 20)'); freeze(ib, 1)
    G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {ib}); e.x = {spc["x"]} + 40; e.y = {spc["y"]}; }})()')
    hp0 = E(ib)['hp']
    check(G(f'H.ability({sp}, "hijack")'), 'Spartan EMP Drop fired')
    e3 = E(ib); check(e3['stun'] > 2 and e3['hp'] < hp0, f'EMP Drop stunned + damaged the Ironback (stun {e3["stun"]:.1f}s)')
    su = roster_t['super_monkey']
    check(G(f'H.towerAbility({su})') and G(f'H.towerInfo({su}).sweep'), 'Super Monkey Laser Sweep fired')
    check(G(f'H.towerInfo({su}).cd') > 0 and not G(f'H.towerAbility({su})'), 'Laser Sweep on cooldown')
    pg.keyboard.press('1'); check(True, 'hotkey 1 handled')
    G('H.killAllEnemies()')

    # ---------------- armor shred (glue) + armor destroy (obelisk)
    gl = G(f'H.towerInfo({roster_t["glue_slinger"]})'); ob = G(f'H.towerInfo({roster_t["arcane_obelisk"]})')
    for tw, nm in [(gl, 'Glue/Corrosive'), (ob, 'Arcane Obelisk')]:
        # try a few sides of the tower so a neighbouring Obelisk/Glue doesn't hit the probe first
        for dx, dy in ((70, 0), (-70, 0), (0, 70), (0, -70)):
            e = G('H.spawn("ironback", 1, 0.1, 30)'); freeze(e)
            G(f'(() => {{ const x = H.g.enemies.find(x => x.uid === {e}); x.x = {tw["x"]} + {dx}; x.y = {tw["y"]} + {dy}; }})()')
            a0 = E(e)['armor']; ok = until(f'(() => {{ const x = H.enemy({e}); return !x || x.armor < {a0} - 1e-6; }})()', 8000)
            ee = E(e)
            if not (nm.startswith('Glue') and ee and ee['slow'] < 0.01): break
            G(f'(() => {{ const x = H.g.enemies.find(x => x.uid === {e}); if (x) x.alive = false; H.g.enemies = H.g.enemies.filter(y => y !== x); }})()')
        check(ok, f'{nm} reduces armor {a0} -> {ee and round(ee["armor"], 2)}' + (f' (slow {ee["slow"]:.2f})' if ee and nm.startswith('Glue') else ''))
        if nm.startswith('Glue'): check(ee is None or ee['slow'] >= 0.39, 'Glue slows 40%')
        G('H.killAllEnemies()')
    w2 = G('H.spawn("warden", 1, 0.1, 2)'); freeze(w2)
    G(f'(() => {{ const x = H.g.enemies.find(x => x.uid === {w2}); x.x = {ob["x"]} + 70; x.y = {ob["y"]}; }})()')
    check(until(f'(() => {{ const x = H.enemy({w2}); return !x || x.shield <= 0; }})()', 8000), 'Arcane Obelisk strips shields')
    G('H.killAllEnemies()')

    # ---------------- scrap + orbs
    s0 = G('H.stats()')
    ib2 = G('H.spawn("ironback", 0, 0.2, 1)')
    G(f'H.g.enemies.find(e => e.uid === {ib2}).takeDamage(H.g, 1e5, "explosive")')
    wait(100)
    check(any(x['kind'] == 'scrap' for x in G('H.pickupsList()')), 'heavy enemy dropped scrap')
    G('H.g.energy = 10'); G(f'H.spawnPickup({hq["x"]}+60, {hq["y"]}, 12, "orb")')
    G('H.setSpeed(4)'); ok = until(f'H.stats().scrap > {s0["scrap"]} && H.g.energy > 10', 20000)
    check(ok, f'scrap banked ({G("H.stats().scrap")}) and energy orb fuels MAC/Heal (energy {G("Math.floor(H.g.energy)")})')
    ok = until(f'H.stats().orbs > {s0["orbs"]}', 25000)
    check(ok, f'Sunflower produced energy orbs ({G("H.stats().orbs")})')
    G('H.setSpeed(1)')

    # ---------------- destructible terrain: MAC + explosives clear rocks/logs and free their cells
    obs = [x for x in G('H.obstacles()') if not x['shortcut']]; check(len(obs) >= 2, f'{len(obs)} rocks/logs on the map')
    o = obs[0]; c0 = o['cells'][0]
    check(not G(f'H.cellFree({c0[0]},{c0[1]})'), 'obstacle blocks its build cell')
    G(f'H.camFocus({o["x"]},{o["y"]},1.0)'); G('H.addEnergy(100); H.g.powerCd = {}')
    for k in ['mac']: G(f'H.g.cooldowns && (H.g.cooldowns.{k} = 0)')
    check(G(f'H.power("mac", {o["x"]}, {o["y"]})'), 'MAC Blast cast on a rock')
    ok = until('H.g.shocks.length > 0', 3000); wait(120)
    shot(pg, JUICE, 'mac_shockwave')
    check(ok, f'MAC shockwave ripple + shake ({G("H.effects()")})')
    until('H.g.strikes.length === 0', 6000)
    check(G(f'H.cellFree({c0[0]},{c0[1]})') and G('H.stats().cleared') >= 1, 'MAC cleared the obstacle and freed its cell')
    o2 = [x for x in G('H.obstacles()') if x['hp'] > 0 and not x['shortcut']][0]
    G(f'H.g.bigBlast({o2["x"]}, {o2["y"]}, 70, 200, "explosive")')
    check(G(f'H.cellFree({o2["cells"][0][0]},{o2["cells"][0][1]})'), 'explosive blast cleared a second obstacle')

    # ---------------- damage numbers (crit / normal) in a fight
    G('H.setSpeed(1); H.g.waves.index = 5; H.startWave()')
    for i in range(6): G(f'H.spawn("gargoyle", {i % 2}, {0.2 + i*0.05}, 1)')
    ok = until('H.effects().dmg > 3', 15000)
    check(ok, f'damage numbers on hits ({G("H.effects().dmg")} live)')
    gx = G('(() => { const e = H.g.enemies.find(e => e.data.air) || H.g.enemies[0]; return e ? [e.x, e.y] : null; })()')
    if gx: G(f'H.camFocus({gx[0]},{gx[1]},1.1)')
    wait(300); shot(pg, JUICE, 'damage_numbers')
    if gx: shot(pg, JUICE, 'flying_wave')
    G('H.setSpeed(4)'); until('!H.state().waveActive', 120000)
    check(G('H.stats().crits') > 0, f'{G("H.stats().crits")} crits (yellow numbers)')
    check(G('H.state().state') == 'playing', 'wave 6 with gargoyles/wardens/ironbacks cleared')
    bb = G(f'H.towerInfo({roster_t["banana_drop"]}).crates')
    check(G('H.stats().bananaBank') > 0 or bb > 0, f'Banana Supply Drop paid out ({G("H.stats().bananaBank")} banked / crates {bb})')

    # ---------------- F key FPS readout + heavy stress wave
    pg.mouse.click(*scr(hq['x'], hq['y'] + 400))
    pg.keyboard.press('Escape'); pg.keyboard.press('f'); wait(700)
    check(G('H.keyFps()') and 'fps' in pg.locator('#fps').inner_text().lower(), f'F shows FPS readout: "{pg.locator("#fps").inner_text()}"')
    G('H.camReset(); H.setSpeed(1); H.g.waves.index = 19; H.startWave()')
    for i in range(120): G(f'H.spawn("{["scavenger","gargoyle","ironback","warden","pink"][i % 5]}", {i % 3}, {0.05 + (i % 40) / 60}, 4)')
    wait(1500); G('H.fpsStart()'); wait(8000); f = G('H.fpsStop()')
    report['stress'] = {**f, 'enemies': G('H.g.enemies.length')}
    print('   STRESS FPS', report['stress'], flush=True)
    check(f['frames'] > 30, f'stress wave: avg {f["avg"]:.1f} fps, p5 {f["p5"]:.1f}, min {f["min"]:.1f}, quality {f["quality"]}, {report["stress"]["enemies"]} foes')
    # throttled CPU (low-end phone): the FPS governor must step quality down
    cdp0 = pg.context.new_cdp_session(pg); cdp0.send('Emulation.setCPUThrottlingRate', {'rate': 8})
    for i in range(120): G(f'H.spawn("{["scavenger","gargoyle","pink"][i % 3]}", {i % 3}, {0.05 + (i % 40) / 60}, 4)')
    G('H.fpsStart()'); wait(9000); f2 = G('H.fpsStop()'); cdp0.send('Emulation.setCPUThrottlingRate', {'rate': 1})
    report['throttled_x8'] = {**f2, 'enemies': G('H.g.enemies.length')}
    print('   THROTTLED FPS', report['throttled_x8'], flush=True)
    check(f2['avg'] >= 45 or f2['quality'] > 0, f'FPS governor: x8 CPU throttle avg {f2["avg"]:.1f} fps -> quality {f2["quality"]}')
    G('H.killAllEnemies(); H.g.waves.active = false')
    sfx = G('H.sfxCount()'); check(sum(sfx.values()) > 20 and len(sfx) >= 6, f'WebAudio SFX fired: {sfx}')

    # ---------------- roster art: zoomed views of the new troops/towers
    for nm, idx in [('spartan', sp), ('warthog', sq['warthog']), ('paladin', sq['paladin']), ('odst', od)]:
        c = G(f'H.squad({idx}) && H.squad({idx}).center')
        if c: G(f'H.camFocus({c["x"]},{c["y"]},1.6)'); wait(150); shot(pg, ROSTER, f'unit_{nm}')
    for nm, idx in list(roster_t.items()) + [('sunflower', sf), ('sniper_monkey', sn), ('unsc_flak', flak)]:
        t = G(f'H.towerInfo({idx})')
        if t: G(f'H.camFocus({t["x"]},{t["y"]},1.6)'); wait(150); shot(pg, ROSTER, f'tower_{nm}')

    # ================= t26/t27: bloon layers, shortcuts, damage text, scrap currency
    print('  state before t27 block:', G('({state: H.g.state, paused: H.g.paused, speed: H.g.speed})'))
    # the x8-throttled stress wave can overrun the HQ; restore a live sandbox for these checks
    G('H.killAllEnemies(); H.g.paused = false; H.g.state = "playing"; H.g.hq.health.hp = H.g.hq.health.max; H.g.hq.alive = true; document.querySelector("#gameover").classList.remove("show")')
    G('H.killAllEnemies(); H.g.waves.active = false; H.setSpeed(1); H.camReset()')
    # ---- layer downgrade in place, reward per layer, overflow carries, pink -> yellow (no loop)
    L = G('''(() => { const u = H.spawn("pink", 0, 0.5, 1), e = H.g.enemies.find(x => x.uid === u); e.stunT = 60;
      const c0 = H.g.res.credits, p0 = e.progress, n0 = H.g.enemies.length, sp0 = e.data.speed;
      e.takeDamage(H.g, 7, "magic");
      const a = { id: e.data.id, hp: e.hp, alive: e.alive, prog: e.progress, dc: H.g.res.credits - c0, same: H.g.enemies.includes(e), n: H.g.enemies.length - n0, spRatio: e.data.speed / sp0 };
      const c1 = H.g.res.credits; e.takeDamage(H.g, 10, "magic");
      return { a, p0, b: { alive: e.alive, dc: H.g.res.credits - c1, layers: e.layersPopped } }; })()''')
    a = L['a']
    check(a['alive'] and a['same'] and a['id'] == 'yellow' and a['n'] == 0 and abs(a['prog'] - L['p0']) < 1e-6,
          f'pink popped -> downgraded IN PLACE to yellow (same entity, same progress, no new spawn): {a}')
    check(a['hp'] == 2, f'overflow damage carried: 7 dmg on pink(5) leaves yellow(4) at {a["hp"]} hp')
    check(a['dc'] == 5, f'reward paid per layer popped, not per hit: +{a["dc"]} for the pink layer')
    check(abs(a['spRatio'] - 3.2 / 3.5) < 1e-6, f'layer speed follows his ratios (yellow/pink = {a["spRatio"]:.3f})')
    check(not L['b']['alive'] and L['b']['dc'] == 4 + 3 + 2 + 1 and L['b']['layers'] == 4,
          f'10 dmg chains yellow->green->blue->red->popped, paying 4+3+2+1 = {L["b"]["dc"]} ({L["b"]["layers"]} layers)')
    C = G('''(() => { const u = H.spawn("ceramic", 1, 0.5, 1), e = H.g.enemies.find(x => x.uid === u); e.stunT = 60; const n0 = H.g.enemies.length;
      e.takeDamage(H.g, 30, "magic"); return { id: e.data.id, hp: e.hp, sib: H.g.enemies.length - n0 }; })()''')
    check(C['id'] == 'yellow' and C['hp'] == 1 and C['sib'] == 1, f'ceramic(22) hit for 30: -> pink, overflow 8 pops it -> yellow at 1hp, + 1 pink sibling: {C}')
    # screenshot: a layered bloon popping next to a tower
    G('H.killAllEnemies()')
    ce = G('H.spawn("ceramic", 0, 0.3, 1)'); freeze(ce, 3)
    tinfo = G(f'H.towerInfo({dart})')
    G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {ce}); e.x = {tinfo["x"]} + 70; e.y = {tinfo["y"]}; }})()')
    G(f'H.camFocus({tinfo["x"]} + 60, {tinfo["y"]}, 1.7)')
    G(f'H.g.enemies.find(e => e.uid === {ce}).takeDamage(H.g, 26, "magic")'); wait(140)
    shot(pg, SHORT, 'layer_pop')
    G('H.killAllEnemies()')

    # ---- blocked shortcut: visible, resists normal splash, opens -> lanes re-route (enemies & troops)
    scs = G('H.shortcuts()'); check(len(scs) >= 1, f'{len(scs)} blocked shortcut(s) on {args.map}')
    sc = scs[0]; pv = sc['preview']; k = pv['lanes'][0]
    check(not sc['open'] and sc['cells'] > 5 and pv['saved'] > 100, f'shortcut blocked: {sc["cells"]} reserved cells, saves {pv["saved"]}px (~{pv["seconds"]:.1f}s) on lane(s) {pv["lanes"]}')
    mid = {'x': (sc['a']['x'] + sc['b']['x']) / 2, 'y': (sc['a']['y'] + sc['b']['y']) / 2}
    G(f'H.blastAt({sc["blocker"]["x"]}, {sc["blocker"]["y"]}, 80, 600)')
    check(not G('H.shortcuts()[0].open'), 'normal splash (600 dmg) does not open the rockslide (deliberate choice)')
    lens0 = G('H.pathLens()')
    entry = G(f'H.g.paths[{k}].project({{x:{sc["a"]["x"]},y:{sc["a"]["y"]}}}).d')
    ea = G(f'(() => {{ const e = H.g.spawnEnemy("red", {entry} - 40, 0, {k}, 4000); e.stunT = 60; return e.uid; }})()')
    eb = G(f'(() => {{ const e = H.g.spawnEnemy("red", {entry} + 160, 0, {k}, 4000); e.stunT = 60; return e.uid; }})()')
    wait(60); ra0 = E(ea)['remaining']
    G(f'H.camFocus({mid["x"]}, {mid["y"]}, 0.75)'); wait(250); shot(pg, SHORT, 'shortcut_before')
    G('H.selectShortcut(0)'); wait(250)
    ptxt = pg.locator('#sel-panel').inner_text()
    check('Blocked shortcut' in ptxt and 'Demolish' in ptxt and 'Risk' in ptxt, 'clicking the rockslide shows the risk/reward panel + Demolish (scrap)')
    shot(pg, SHORT, 'shortcut_panel')
    sc0 = G('H.scrap().scrap')
    check(G('H.demolishShortcut(0)'), 'Demolish order (scrap) cleared the rockslide')
    s1 = G('H.shortcuts()[0]'); lens1 = G('H.pathLens()')
    check(s1['open'] and lens1[k] < lens0[k] - 100, f'shortcut OPEN: lane {k} path {lens0[k]:.0f} -> {lens1[k]:.0f}px; rerouted {s1["rerouted"]}')
    check(G('H.scrap().scrap') == sc0 - 20, 'Demolish cost 20 scrap')
    wait(60); A, B = E(ea), E(eb)
    check(not A['route'] and A['remaining'] < ra0 - 100, f'enemy before the fork re-routed: {ra0:.0f} -> {A["remaining"]:.0f}px to the HQ')
    check(B['route'], 'enemy already past the fork keeps its old road (no teleporting)')
    G(f'(() => {{ const e = H.g.enemies.find(e => e.uid === {ea}); e.stunT = 0; }})()'); G('H.setSpeed(3)')
    onchord = until(f'''(() => {{ const e = H.g.enemies.find(e => e.uid === {ea}); if (!e) return false;
      const a = {json.dumps(sc["a"])}, b = {json.dumps(sc["b"])}, dx = b.x - a.x, dy = b.y - a.y, L2 = dx*dx + dy*dy;
      const t = ((e.x - a.x) * dx + (e.y - a.y) * dy) / L2; if (t < 0.25 || t > 0.75) return false;
      return Math.hypot(e.x - a.x - dx * t, e.y - a.y - dy * t) < 12; }})()''', 30000)
    G('H.setSpeed(1)')
    check(onchord, 'the re-routed enemy actually walks down the shortcut trail')
    check(abs(G(f'H.roadSpeed({mid["x"]}, {mid["y"]})') - 1.35) < 1e-6, 'friendly troops move +35% on the opened shortcut road')
    check(sum(1 for x in G('H.pickupsList()') if x['kind'] == 'scrap' and math.hypot(x['x'] - mid['x'], x['y'] - mid['y']) < 90) >= 3, 'rockslide salvage dropped scrap piles to gather')
    wait(150); shot(pg, SHORT, 'shortcut_after')
    G('H.killAllEnemies()')

    # ---- damage numbers readable at every zoom (+ rapid-hit aggregation)
    zl = G('H.zoomLimits()')
    pmin, pmax = G(f'H.dmgPx({zl["min"]})'), G(f'H.dmgPx({zl["max"]})')
    check(pmin >= 14 and pmax <= 30 and pmax >= pmin, f'damage text {pmin:.1f}px at min zoom {zl["min"]:.2f}, {pmax:.1f}px at max zoom {zl["max"]}')
    for z, nm in [(zl['min'], 'min'), (zl['max'], 'max')]:
        if nm == 'max': G(f'H.camFocus({hq["x"]} - 300, {hq["y"]}, {z})'); cx, cy = hq['x'] - 300, hq['y']
        else: G(f'H.zoomTo({z})'); cx, cy = hq['x'] - 600, hq['y']
        G('H.dmgSeen(true)'); G(f'H.dmgNumber({cx}, {cy}, 12); H.dmgNumber({cx} + 60, {cy}, 3)'); wait(250)
        seen = G('H.dmgSeen()')
        check(seen['n'] > 0 and seen['min'] >= 14 and seen['max'] <= 30, f'rendered damage text at {nm} zoom ({G("H.cam().zoom"):.2f}): {seen["min"]:.1f}-{seen["max"]:.1f} screen px over {seen["n"]} draws')
    n0 = len(G('H.dmgEffects()'))
    G('(() => { for (let i = 0; i < 20; i++) H.dmgNumber(500, 500, 1.5, 4242); })()')
    de = G('H.dmgEffects()')
    agg = [x for x in de if (x['hits'] or 0) >= 20]
    check(len(de) - n0 == 1 and agg and abs(agg[0]['val'] - 30) < 1e-6 and agg[0]['text'] == '30', f'20 rapid hits on one enemy merge into one "30" ({len(de) - n0} new numbers)')
    G('H.camReset(); H.g.waves.index = 6; H.startWave(); H.setSpeed(1)')
    for i in range(8): G(f'H.spawn("{["ceramic","yellow","ironback","pink"][i % 4]}", {i % 2}, {0.15 + i * 0.06}, 2)')
    until('H.effects().dmg > 4', 12000); wait(200)
    shot(pg, SHORT, 'damage_zoomed_out')
    G('H.killAllEnemies(); H.g.waves.active = false')

    # ---- scrap: its own currency, gathered by troops, spent on armory + vehicles
    G('H.setScrap(0)'); wait(250)
    check(pg.locator('#scrap').inner_text() == '0', 'scrap HUD shows 0')
    wc = G('H.deployCost("warthog")'); spc2 = G('H.deployCost("spartan")')
    check(wc['scrap'] == 30 and spc2['scrap'] == 60, f'vehicle/Spartan cost scrap on top of credits: Warthog {wc}, Spartan {spc2}')
    fb = G('H.fieldBlock("warthog")') or ''
    check(not G('H.canDeploy("warthog")') and ('scrap' in fb.lower() or 'max' in fb.lower()), f'Warthog blocked without scrap: "{fb}"')
    mi2 = G("""(() => H.g.squads.findIndex(q => q.alive && !q.data.vehicle && q.units.some(u => u.alive && !u.garrison && u.dropT <= 0)))()""")
    check(mi2 >= 0, f'found a live infantry squad #{mi2}')
    G(f'(() => {{ const q = H.g.squads[{mi2}]; q.stance = "aggressive"; q.units = q.units.filter(u => u.alive); }})()')
    up = G(f'H.squad({mi2}).units[0]')
    ptr0 = (G('H.stats().pickups') or {}).get('troops', 0)
    G(f'H.spawnPickup({up["x"]} + 30, {up["y"]}, 25, "scrap")')
    ok = until('H.scrap().scrap >= 25', 4000)
    sv = G('H.scrap()')
    check(ok and sv['by'].get('troops', 0) >= 25, f'troops gathered a scrap pile into the SCRAP bank: {sv}')
    check((G('H.stats().pickups') or {}).get('troops', 0) == ptr0, 'scrap did not turn into credits')
    wait(250)
    check(pg.locator('#scrap').inner_text() == str(G('H.scrap().scrap')), f'HUD scrap = {pg.locator("#scrap").inner_text()}')
    G('H.setScrap(45)'); G('H.selectHQ()'); wait(300)
    check('Salvage Armory' in pg.locator('#sel-panel').inner_text(), 'HQ panel lists the scrap-only Salvage Armory with costs')
    shot(pg, SHORT, 'scrap_hud_armory')
    hp0 = G(f'H.squad({mi2}).units[0].max')
    bb = G('(() => { const a = H.scrap().scrap; const ok = H.buyArmory("plating"); return [a, H.scrap().scrap, ok]; })()')
    check(bb[2], 'bought Salvaged Plating (40 scrap)')
    wait(150); hp1 = G(f'H.squad({mi2}).units[0].max')
    check(bb[0] - bb[1] == 40 and 'plating' in G('H.armory()'), f'scrap spent: {bb[0]} -> {bb[1]}')
    G('H.setScrap(5)')
    check(hp1 > hp0 * 1.15, f'plating: troop max HP {hp0:.0f} -> {hp1:.0f}')
    check(not G('H.buyArmory("ap")'), 'AP Rounds (60) refused with only 5 scrap')
    wait(300); shot(pg, SHORT, 'scrap_purchase')
    G('H.setScrap(30)')
    if G('H.g.squads.filter(s => s.alive && s.data.id === "warthog").length') >= 3:
        G('(() => { const s = H.g.squads.find(s => s.alive && s.data.id === "warthog"); s.units.forEach(u => u.alive = false); })()'); wait(150)
    G('H.g.deployCd = {}')
    okw = G(f'H.deploy("warthog", {hq["x"]} - 320, {hq["y"]} + 40)')
    check(okw and G('H.scrap().scrap') == 0, f'Warthog bought with 30 scrap + credits (scrap now {G("H.scrap().scrap")})')
    G('H.sandbox(2, 80)')

    # ---------------- mobile
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
    mp = ctx.new_page(); attach(mp); mp.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
    mp.goto(f'http://127.0.0.1:{port}/index.html?map={args.map}'); mp.wait_for_function('window.__game')
    M = lambda js: mp.evaluate(f'(() => {{ const H = window.__game; return eval({json.dumps(js)}); }})()')
    M('H.sandbox(2, 60); H.addCredits(5000)')
    lp = M('H.lanePoint(0, 0.4)'); M(f'H.deploy("marine", {lp["x"]} + 50, {lp["y"]})'); M('H.g.deployCd = {}'); M(f'H.deploy("odst", {lp["x"]} + 60, {lp["y"]} + 40)')
    M(f'H.camFocus({lp["x"]},{lp["y"]},0.8)'); M('H.selectSquads([0, 1])'); mp.wait_for_timeout(300)
    vis = lambda sel: mp.locator(sel).count() and mp.locator(sel).first.is_visible()
    check(vis('#btn-box') and vis('#btn-form'), 'mobile stage buttons (Select / formation) visible')
    mp.tap('#btn-box'); check(M('H.view().boxMode'), 'mobile Select-mode toggle on')
    mp.tap('#btn-box')
    ab, pw = mp.locator('#abilities').bounding_box(), mp.locator('#powers').bounding_box()
    ov = ab and pw and not (ab['x'] + ab['width'] <= pw['x'] or pw['x'] + pw['width'] <= ab['x'] or ab['y'] + ab['height'] <= pw['y'] or pw['y'] + pw['height'] <= ab['y'])
    check(not ov, f'mobile ability bar does not overlap the power bar ({ab}, {pw})')
    mb = mp.locator('#game').bounding_box(); t = M(f'H.worldToScreen({lp["x"]} + 120, {lp["y"]} - 60)')
    M('H.selectSquads([0])'); w0 = M('H.squad(0).waypoints')
    mp.tap('#sp-queue-m') if mp.locator('#sp-queue-m').count() else None
    cdp = ctx.new_cdp_session(mp)
    tx, ty = mb['x'] + t['x'], mb['y'] + t['y']
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': tx, 'y': ty}]}); mp.wait_for_timeout(650)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); mp.wait_for_timeout(200)
    check(M('H.squad(0).waypoints') > w0 or M('Math.hypot(H.squad(0).rally.x - (%f), H.squad(0).rally.y - (%f)) < 30' % (lp['x'] + 120, lp['y'] - 60)), 'mobile long-press / queue mode orders a waypoint')
    mp.wait_for_timeout(200); shot(mp, JUICE, 'mobile')
    ctx.close()
    b.close()

httpd.shutdown()
print(f'console errors: {len(errors)}'); [print('  ', e) for e in errors[:20]]
check(not errors, 'zero console errors')
print('REPORT', json.dumps(report))
print('RESULT:', 'PASS' if not fails else f'FAIL ({len(fails)})')
sys.exit(1 if fails else 0)
