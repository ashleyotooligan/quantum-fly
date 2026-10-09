"""Serve this folder on loopback using only the Python standard library."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import webbrowser

def main():
    root = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    server = ThreadingHTTPServer(('127.0.0.1', 4173), handler)
    server.RequestHandlerClass.func.extensions_map['.mjs'] = 'text/javascript'
    print('Quantum Fly: http://127.0.0.1:4173 — Ctrl+C to stop')
    webbrowser.open('http://127.0.0.1:4173')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == '__main__':
    main()
