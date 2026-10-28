"""Shared test relay (SSE + POST) + static server for ./dist, used by the MP e2e suites."""
import functools, http.server, json, os, queue, socketserver, threading
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
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
def serve():
    """Start the server; returns (relay_url, base_url)."""
    h = TS(('127.0.0.1', 0), functools.partial(Q, directory=os.path.join(ROOT, 'dist'))); threading.Thread(target=h.serve_forever, daemon=True).start()
    return f'http://127.0.0.1:{h.server_address[1]}/__relay', f'http://127.0.0.1:{h.server_address[1]}/'
