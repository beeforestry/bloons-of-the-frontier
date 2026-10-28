"""Stage-B multiplayer e2e: lobby errors (not found / full / host left), 3- and 4-player co-op with
4 owner colours, client drop + rejoin by code (restores slot, wallet, tower ownership), and a long
4x host-vs-client drift check (quantized state hash, host paused) incl. a forced client corruption
that host snapshots must correct. Every player runs in its OWN browser process.
Usage: python tests/e2e_mp2.py [--url URL] [--webrtc] [--waves N]"""
import argparse, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
import mp_relay
ROOT = mp_relay.ROOT
ap = argparse.ArgumentParser(); ap.add_argument('--url', default=''); ap.add_argument('--webrtc', action='store_true'); ap.add_argument('--waves', type=int, default=14); ap.add_argument('--map', default='garden'); ap.add_argument('--shots', default='screenshots/mp')
args = ap.parse_args()
SHOTS = os.path.join(ROOT, args.shots); os.makedirs(SHOTS, exist_ok=True)
RELAY, LOCAL = mp_relay.serve()
BASE = args.url.rstrip('/') + '/' if args.url else LOCAL
fails, errors = [], []
def check(ok, msg):
    print(('  ok  ' if ok else '  FAIL ') + msg, flush=True)
    if not ok: fails.append(msg)
def until(pg, js, ms=20000, step=0.25):
    t = time.time()
    while time.time() - t < ms / 1000:
        try:
            v = pg.evaluate(js)
            if v: return v
        except Exception: pass
        time.sleep(step)
    return None
CHROME = os.environ.get('CHROME', '/usr/bin/google-chrome')
def ctx_of(b, name, vp=(1280, 760), mobile=False):
    ctx = b.new_context(viewport={'width': vp[0], 'height': vp[1]}, is_mobile=mobile, has_touch=mobile, device_scale_factor=2 if mobile else 1)
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1');" + ("localStorage.removeItem('bof.relay')" if args.webrtc else f"localStorage.setItem('bof.relay','{RELAY}')"))
    return ctx
def page_of(ctx, name):
    pg = ctx.new_page()
    pg.on('console', lambda m: errors.append(f'[{name}] {m.text}') if m.type == 'error' and 'peerjs' not in m.text.lower() and 'favicon' not in m.text else None)
    pg.on('pageerror', lambda e: errors.append(f'[{name}] PAGEERROR {e}'))
    return pg
status = lambda pg: pg.evaluate("document.getElementById('mp-status')?.textContent || ''")
nplayers = "document.querySelectorAll('.lobby-players li:not(.empty)').length"

with sync_playwright() as p:
    procs = [p.chromium.launch(executable_path=CHROME, headless=True) for _ in range(5)]
    ctxs = [ctx_of(procs[i], f'P{i+1}') for i in range(5)]
    host = page_of(ctxs[0], 'P1')
    # ---------- normal main menu shows the 3 modes (no ?mp=1)
    host.goto(BASE); host.wait_for_selector('.mode-pick')
    check(host.evaluate("document.querySelectorAll('.mode-pick').length") == 3, 'main menu shows Single Player / Co-Op / Versus without ?mp=1')
    # ---------- room not found
    c1 = page_of(ctxs[1], 'P2'); c1.goto(BASE); c1.wait_for_selector('.mode-pick'); c1.click('.mode-pick[data-mode="coop"]')
    c1.fill('#mp-code', '0999'); c1.click('#mp-joinb')
    s = until(c1, "(() => { const s = document.getElementById('mp-status'); return s && s.classList.contains('err') && s.textContent })()", 40000) or ''
    check('not found' in s, f'room not found error: "{s}"')
    c1.fill('#mp-code', '12'); c1.click('#mp-joinb'); check('4-digit' in status(c1), 'bad code -> "Enter the 4-digit room code"')
    # ---------- host a co-op room, 3 clients join (link) -> 4 players
    host.click('.mode-pick[data-mode="coop"]'); host.click('#mp-host')
    code = until(host, "(() => { const e = document.getElementById('room-code'); return e && e.textContent })()", 30000)
    check(bool(code), f'host opened room {code}; status "{status(host)}"')
    check('Room open' in status(host), 'host status says the room is open')
    link = host.evaluate("document.getElementById('room-link').value")
    host.click('#copy-link'); check(bool(until(host, "(document.getElementById('mp-status')?.textContent || '').includes('copied')", 5000)), 'copy invite link button gives feedback')
    clients = [c1]
    c1.goto(link)
    for i in (2, 3):
        c = page_of(ctxs[i], f'P{i+1}'); c.goto(link); clients.append(c)
        if i == 2:
            check(bool(until(host, f"{nplayers} === 3", 30000)), '3 players in lobby (3-player co-op)')
    check(bool(until(host, f"{nplayers} === 4", 30000)), 'host lists 4 players')
    pids = sorted(until(c, "window.__lobby && window.__lobby.localPid", 8000) or 0 for c in clients)
    check(pids == [1, 2, 3], f'clients got seats {pids}')
    # ---------- 5th player -> room full
    c5 = page_of(ctxs[4], 'P5'); c5.goto(link)
    s = until(c5, "(() => { const s = document.getElementById('mp-status'); return s && s.classList.contains('err') && s.textContent })()", 30000) or ''
    check('full' in s, f'5th player gets "room full": "{s}"')
    # ---------- ready + start
    for c in clients: until(c, "!!document.getElementById('btn-ready')", 10000); c.click('#btn-ready')
    check(bool(until(host, "!document.getElementById('btn-mpstart').disabled", 10000)), 'all ready -> Start enabled')
    host.click('#btn-mpstart')
    for c in clients: check(bool(until(c, "window.__game && __game.mp() && __game.mp().snaps > 3", 25000)), f'client {c.evaluate("__game.mp().pid")} receives snapshots')
    H = host.evaluate
    cells = H('__game.freeCells().filter(([c,r]) => { const g = __game.g, q = g.grid.cellCenter(c,r), d = g.nearestLane(q).dist; return d > 70 && d < 120; })')
    picks = [cells[0]]
    for cc in cells:
        if len(picks) == 4: break
        if all(abs(cc[0] - q[0]) + abs(cc[1] - q[1]) >= 3 for q in picks): picks.append(cc)
    H(f'__game.addCredits(5000)')
    H(f'__game.placeTower("dart_monkey",{picks[0][0]},{picks[0][1]})')
    for i, c in enumerate(clients): c.evaluate(f'__game.placeTower("dart_monkey",{picks[i+1][0]},{picks[i+1][1]})')
    ok = until(host, "(() => { const o = new Set(__game.mp().towers.map(t => t.owner)); return o.size === 4; })()", 10000)
    check(bool(ok), f'4 players each own a tower: owners {H("__game.mp().towers.map(t => t.owner)")}')
    check(bool(until(clients[2], "__game.mp().towers.length === 4", 8000)), 'client mirrors show all 4 towers')
    host.evaluate(f'__game.camFocus({picks[0][0]*48}, {picks[0][1]*48})') if False else None
    time.sleep(0.5); host.screenshot(path=f'{SHOTS}/coop_four_players.png')
    # ---------- drop + rejoin by code (P3 = pid 2)
    drop = clients[1]; dpid = drop.evaluate('__game.mp().pid')
    before = H(f'__game.mp().all[__game.mp().players.indexOf({dpid})]')
    drop.close()
    check(bool(until(host, f"!__game.mp().players.includes({dpid})", 20000)), f'host notices P{dpid+1} dropped (heartbeat)')
    check(H(f'__game.mp().towers.some(t => t.owner === {dpid})'), "dropped player's tower keeps fighting")
    # an outsider can't take a seat while P3 is away? (seat is free -> gets it). Rejoin from the same browser:
    rj = page_of(ctxs[2], 'P3-rejoin'); rj.goto(BASE + f'?room={code}')
    check(bool(until(rj, "window.__game && __game.mp() && __game.mp().snaps > 3", 30000)), 'rejoined player is back in the match')
    check(rj.evaluate('__game.mp().pid') == dpid, f'rejoin restored seat P{dpid+1}')
    check(bool(until(host, f"__game.mp().players.includes({dpid})", 8000)), 'host roster has the player again')
    after = rj.evaluate('__game.mp().credits')
    check(abs(after - before) <= 5, f'wallet restored ({before} -> {after})')
    rj.evaluate(f'(() => {{ const t = __game.g.towers.find(t => t.owner === {dpid}); t.upgrade(__game.g); }})()')
    check(bool(until(host, f"__game.mp().towers.some(t => t.owner === {dpid} && t.tier >= 1)", 8000)), 'rejoined player can upgrade their own tower (ownership restored)')
    clients[1] = rj
    # ---------- long 4x game: drift check
    def drift(tag):
        H('__game.mpPause(true)'); time.sleep(1.8)
        hh = H('__game.mpStateHash()'); bad = []
        for c in clients:
            ch = c.evaluate('__game.mpStateHash()')
            if ch['h'] != hh['h']:
                ks = [k for k in hh['parts'] if hh['parts'][k] != ch['parts'][k]]; bad.append((c.evaluate('__game.mp().pid'), ks))
                for k in ks[:1]:
                    a2, b2 = hh['parts'][k].split(';'), ch['parts'][k].split(';')
                    print('     host-only', [x for x in a2 if x not in b2][:4], 'client-only', [x for x in b2 if x not in a2][:4])
        H('__game.mpPause(false)')
        check(not bad, f'[{tag}] state hash host {hh["h"]} == all clients' + (f' MISMATCH {bad}' if bad else ''))
        return bad
    H('__game.setSpeed(4)'); H('__game.addCredits(30000)')
    heal = '(() => { const h = __game.g.hq.health; h.hp = h.max; })()'
    # strong defense so the game lasts
    for cc in cells[::5][:14]: H(f'__game.placeTower("ninja_monkey",{cc[0]},{cc[1]})')
    H('__game.startWave()'); t0 = time.time(); checks = 0; mism = 0
    while time.time() - t0 < 240 and H('__game.g.waves.index') < args.waves and H('__game.g.state') == 'playing':
        for _ in range(12): time.sleep(1); H(heal)
        H('(() => { if (!__game.g.waves.active) __game.startWave(); })()')
        mism += bool(drift(f'wave {H("__game.g.waves.index")}')); checks += 1; H(heal)
    print(f'  drift: {checks} checks, {mism} mismatches, wave {H("__game.g.waves.index")}, state {H("__game.g.state")}, {time.time()-t0:.0f}s at 4x')
    check(checks >= 5, f'long 4x game ran {checks} drift checks')
    # forced corruption on a client: snapshots must correct it
    c = clients[0]
    c.evaluate('(() => { const g = __game.g; g.hq.health.hp = 1; const t = g.towers.find(t => t.tier + 1 < t.data.tiers.length); if (t) t.tier += 1; for (const e of g.enemies.slice(0, 5)) e.progress += 400; })()')
    time.sleep(0.3); drift('after forced client corruption')
    print('console errors:', len(errors)); [print('  ', e) for e in errors[:10]]
    check(not errors, 'no console errors')
    for b in procs: b.close()
print(f'\n{"PASS" if not fails else "FAIL"}: {len(fails)} failures'); [print('  -', f) for f in fails]
sys.exit(1 if fails else 0)
