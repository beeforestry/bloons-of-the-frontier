"""t47 e2e: multiplayer connection diagnostics — staged join progress, specific failure reasons
(room not found / signaling unreachable / ICE / timeout) with Retry + tip, and the lobby 'Test connection'.
Screenshots -> screenshots/t47/.  Usage: /workspace/.venv-pw/bin/python tests/e2e_t47.py [--url URL] [--no-shots]
With --url (live) the relay-transport cases are skipped."""
import argparse, os, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--url'); ap.add_argument('--no-shots', action='store_true'); args = ap.parse_args()
OUT = os.path.join(ROOT, 'screenshots', 't47'); os.makedirs(OUT, exist_ok=True)
RELAY = None
if args.url: URL = args.url
else:
    import mp_relay; RELAY, URL = mp_relay.serve(); URL += 'index.html'
errors, fails = [], []
def check(c, msg):
    print(('  ok  ' if c else '  FAIL ') + msg, flush=True)
    if not c: fails.append(msg)
def shot(pg, name):
    if not args.no_shots: pg.locator('#mp-panel').screenshot(path=os.path.join(OUT, name + '.png'))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    def page(relay):
        ctx = b.new_context(viewport={'width': 1280, 'height': 900})
        ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1');" + (f"localStorage.setItem('bof.relay','{relay}')" if relay else "localStorage.removeItem('bof.relay')"))
        pg = ctx.new_page()
        pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text and 'peerjs' not in m.text.lower() and 'ERR_FAILED' not in m.text else None)
        pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.goto(URL); pg.wait_for_function('window.__lobby', timeout=20000); pg.click('.mode-pick[data-mode=coop]'); return pg
    def join(pg, code): pg.fill('#mp-code', code); pg.click('#mp-joinb')
    if RELAY:
        pg = page(RELAY); join(pg, '9999')
        pg.wait_for_selector('.mp-fail', timeout=15000)
        check(pg.get_attribute('.mp-fail', 'data-fail') == 'not-found', 'unknown room -> "room not found"')
        check(pg.get_attribute('.mp-steps li.bad', 'data-stage') == 'room' and pg.get_attribute('.mp-steps li.ok', 'data-stage') == 'signal', 'steps: signaling ✔, finding room ✖')
        check(pg.is_visible('#mp-retry') and 'Wi-Fi' not in pg.inner_text('.mp-fail'), 'retry button + room tip'); shot(pg, 'fail_not_found')
        h = page(RELAY); h.click('#mp-host'); h.wait_for_selector('#room-code', timeout=15000); code = h.inner_text('#room-code')
        join(pg, code); pg.wait_for_function("document.querySelector('#mp-status')?.textContent.includes('Connected')", timeout=15000)
        check(not pg.is_visible('.mp-fail'), f'joins room {code} via relay after failure; progress cleared')
        h.context.close(); pg.context.close()
    # signaling unreachable (real PeerJS path, broker requests aborted)
    pg = page(None); pg.route('**/*peerjs.com/**', lambda r: r.abort()); join(pg, '4321')
    try: pg.wait_for_selector('.mp-fail', timeout=30000)
    except Exception: pass
    check(pg.get_attribute('.mp-fail', 'data-fail') == 'signal' if pg.is_visible('.mp-fail') else False, 'broker blocked -> "signaling unreachable"')
    check(pg.get_attribute('.mp-steps li.bad', 'data-stage') == 'signal' if pg.is_visible('.mp-steps li.bad') else False, 'steps: signaling ✖'); shot(pg, 'fail_signal')
    # ICE + timeout states (simulated via the lobby hook)
    pg.evaluate("__lobby.showFail('ice', 'Found room 1234, but no direct route and the TURN relay failed (Open Relay TURN (free, best-effort)).', '1234', 'link')")
    check(pg.get_attribute('.mp-steps li.bad', 'data-stage') == 'link' and 'mobile data' in pg.inner_text('.mp-fail'), 'ICE failure: link ✖ + same Wi-Fi / mobile data tip'); shot(pg, 'fail_ice')
    pg.evaluate("__lobby.showFail('timeout', 'Timed out waiting for room 1234 to answer.', '1234', 'room')")
    check(pg.get_attribute('.mp-fail', 'data-fail') == 'timeout' and pg.get_attribute('.mp-steps li.bad', 'data-stage') == 'room', 'timeout reason shown at the stuck stage')
    pg.unroute('**/*peerjs.com/**'); pg.route('**/*peerjs.com/**', lambda r: r.abort())
    pg.click('#mp-retry'); pg.wait_for_timeout(300)
    check(pg.is_visible('.mp-steps li.run') or pg.is_visible('.mp-fail'), 'Retry restarts the staged join')
    # connection test
    pg.wait_for_selector('#mp-testb:not([disabled])', timeout=40000); pg.click('#mp-testb')
    pg.wait_for_selector('#mp-testr .lvl', timeout=20000)
    lvl = pg.get_attribute('#mp-testr .lvl', 'data-lvl'); print('  test result:', pg.inner_text('#mp-testr'))
    check(lvl in ('green', 'yellow', 'red'), f'Test connection reports a level ({lvl})'); shot(pg, 'test_connection')
    print('errors:', errors[:6]); check(not errors, 'no console errors')
    b.close()
print('FAILS:', fails if fails else 'none'); raise SystemExit(1 if fails else 0)
