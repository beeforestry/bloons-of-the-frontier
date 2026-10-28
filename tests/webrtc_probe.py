"""Real-network probe: two SEPARATE Chrome processes, public PeerJS broker + STUN/TURN, no test relay.
Reports each stage (broker, room claim, join signalling, ICE, DataChannel) so a failure is attributable."""
import sys, time, json, os
from playwright.sync_api import sync_playwright
URL = (sys.argv[1] if len(sys.argv) > 1 else 'https://beeforestry.github.io/bloons-of-the-frontier/').rstrip('/') + '/'
Q = sys.argv[2] if len(sys.argv) > 2 else ''
CHROME = os.environ.get('CHROME', '/usr/bin/google-chrome')
logs = {'host': [], 'client': []}
def page(b, name):
    ctx = b.new_context(viewport={'width': 1280, 'height': 760})
    ctx.add_init_script("localStorage.setItem('bof.tutorialDone','1');localStorage.removeItem('bof.relay');" + """
      (() => { const O = window.RTCPeerConnection; window.__ice = [];
        window.RTCPeerConnection = function (...a) { const pc = new O(...a); window.__ice.push({cfg: JSON.stringify((a[0]||{}).iceServers||[]).length, st: []});
          const rec = window.__ice[window.__ice.length-1];
          pc.addEventListener('iceconnectionstatechange', () => rec.st.push('ice:' + pc.iceConnectionState));
          pc.addEventListener('icecandidate', (e) => rec.st.push('cand:' + (e.candidate ? (e.candidate.type || '?') : 'end')));
          pc.addEventListener('icecandidateerror', (e) => rec.st.push('candErr:' + e.errorCode));
          return pc; }; window.RTCPeerConnection.prototype = O.prototype; })();""")
    pg = ctx.new_page(); pg.on('console', lambda m: logs[name].append(m.text[:200])); return pg
def until(pg, js, ms):
    t = time.time()
    while time.time() - t < ms / 1000:
        try:
            v = pg.evaluate(js)
            if v: return v
        except Exception: pass
        time.sleep(0.3)
with sync_playwright() as p:
    bh = p.chromium.launch(executable_path=CHROME, headless=True)
    bc = p.chromium.launch(executable_path=CHROME, headless=True)
    host = page(bh, 'host'); cli = page(bc, 'client')
    host.goto(URL + 'index.html' + Q); host.wait_for_selector('.mode-pick', timeout=20000)
    host.click('.mode-pick[data-mode="coop"]'); host.click('#mp-host')
    code = until(host, "(() => { const e = document.getElementById('room-code'); return e && e.textContent })()", 30000)
    print('stage broker+room claim:', 'OK code ' + code if code else 'FAIL', '| host status:', host.evaluate("document.getElementById('mp-status')?.textContent"))
    if code:
        cli.goto(URL + f'index.html?room={code}')
        joined = until(host, "document.querySelectorAll('.lobby-players li:not(.empty)').length === 2", 45000)
        print('stage join (DataChannel open):', 'OK' if joined else 'FAIL')
        print('client status:', cli.evaluate("document.getElementById('mp-status')?.textContent"))
        for n, pg in (('host', host), ('client', cli)): print(n, 'ICE:', json.dumps(pg.evaluate('window.__ice'))[:600])
    for n in logs: print(n, 'console tail:', logs[n][-6:])
    bh.close(); bc.close()
