import http.server
import socketserver
import os

os.chdir("/Users/vincenzogallina/Library/Mobile Documents/com~apple~CloudDocs/Project Codex/la-dimora-di-caro")
PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving on http://localhost:{PORT}")
    httpd.serve_forever()
