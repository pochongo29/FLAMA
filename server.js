const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__filename);
const PORT = 3001;
const MIME = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'text/javascript',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon'
};

http.createServer((req, res) => {
  const filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
    } else {
      const ext = path.extname(filePath).slice(1);
      const mime = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    }
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log('Servidor corriendo en:');
  console.log('  http://localhost:' + PORT);
  console.log('  http://192.168.1.69:' + PORT);
});
