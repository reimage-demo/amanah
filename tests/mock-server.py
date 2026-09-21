"""Local-only browser QA server. Every fetch is intercepted; no form traffic leaves the browser."""
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
import os
os.chdir(Path(__file__).resolve().parent.parent)
mock='''<script>
window.AMANAH_CONFIG={physicianFormId:'testphys',hospitalFormId:'testhosp'};
let requestCount=0;
window.fetch=async()=>{document.getElementById('qa-count').textContent=String(++requestCount);const mode=document.getElementById('qa-response').value;await new Promise(r=>setTimeout(r,900));if(mode==='network')throw new TypeError('Mock network failure');return {ok:mode==='success',json:async()=>({ok:mode==='success'})};};
window.addEventListener('DOMContentLoaded',()=>{const qa=document.createElement('aside');qa.style='position:fixed;bottom:0;right:0;background:#fff;border:2px solid #17685f;padding:8px;z-index:99;font-size:12px';qa.innerHTML='<label for="qa-response">Mock response</label><select id="qa-response"><option value="success">Success</option><option value="error">Server error</option><option value="network">Network error</option></select><span>Mock requests: <b id="qa-count">0</b></span>';document.body.append(qa);});
</script>'''
class Handler(SimpleHTTPRequestHandler):
 def do_GET(self):
  if self.path.endswith('config.js'):
   self.send_response(200);self.send_header('Content-Type','text/javascript');self.end_headers();self.wfile.write(b'/* Configuration supplied by local mock server. */');return
  p=self.path.split('?')[0].lstrip('/') or 'index.html'
  if p in ['index.html','physicians.html','partners.html','about.html']:
   data=Path(p).read_text().replace('</head>',mock+'</head>').encode()
   self.send_response(200);self.send_header('Content-Type','text/html');self.end_headers();self.wfile.write(data);return
  super().do_GET()
HTTPServer(('127.0.0.1',8001),Handler).serve_forever()
