"""Wave-clear balance sim: a fixed bot plays every map x difficulty headless (sim fast-forwarded, no rendering)
and records waves survived / HQ left. Output: balance/sim.json + balance/sim.md.
Usage: /workspace/.venv-pw/bin/python tests/balance_sim.py [--maps garden,jungle,fortress,morro] [--diffs easy,medium,hard,impoppable]"""
import argparse, functools, http.server, json, os, socketserver, threading, time
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('--maps', default='garden,jungle,fortress,morro'); ap.add_argument('--diffs', default='easy,medium,hard,impoppable'); ap.add_argument('--out', default='sim'); args = ap.parse_args()
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist'))); threading.Thread(target=h.serve_forever, daemon=True).start()
BOT = open(os.path.join(ROOT, 'tests', 'balance_bot.js')).read()
res = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), headless=True)
    for m in args.maps.split(','):
        for d in args.diffs.split(','):
            pg = b.new_page(viewport={'width': 900, 'height': 600}); pg.add_init_script("localStorage.setItem('bof.tutorialDone','1')")
            pg.goto(f'http://127.0.0.1:{h.server_address[1]}/index.html?map={m}&diff={d}'); pg.wait_for_function('window.__game')
            pg.evaluate(BOT)
            t0 = time.time(); last = None; total = pg.evaluate('window.__game.diff().total'); curve = []
            while True:
                r = pg.evaluate('window.__bot.runWave()')
                if not r.get('started'): break
                last = r; curve.append((r['wave'], r['hq'], r['credits'], r['towers']))
                if r['state'] != 'playing' or r['wave'] >= total or time.time() - t0 > 420: break
            row = {'map': m, 'diff': d, 'total': total, 'reached': last['wave'] if last else 0, 'won': bool(last and last['state'] == 'won'),
                   'hq': last['hq'] if last else 0, 'hqMax': last['hqMax'] if last else 0, 'towers': last['towers'] if last else 0, 'leaked': last['leaked'] if last else 0, 'secs': round(time.time() - t0), 'curve': curve}
            print({k: v for k, v in row.items() if k != 'curve'}, curve[-6:], flush=True); res.append(row); pg.close()
    b.close()
os.makedirs(os.path.join(ROOT, 'balance'), exist_ok=True)
json.dump(res, open(os.path.join(ROOT, 'balance', args.out + '.json'), 'w'), indent=1)
md = ['| map | difficulty | waves | bot reached | result | HQ left | towers |', '|---|---|---|---|---|---|---|'] + [f"| {r['map']} | {r['diff']} | {r['total']} | {r['reached']} | {'WIN' if r['won'] else 'lost' if r['reached'] < r['total'] else 'timeout'} | {r['hq']}/{r['hqMax']} | {r['towers']} |" for r in res]
open(os.path.join(ROOT, 'balance', args.out + '.md'), 'w').write('\n'.join(md) + '\n'); print('\n'.join(md))
