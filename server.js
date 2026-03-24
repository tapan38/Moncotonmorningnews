const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4173;
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

const staticRoutes = {
  about: 'about.html',
  privacy: 'privacy.html',
  terms: 'terms.html'
};

const server = http.createServer((req, res) => {
  const rawPath = req.url.split('?')[0];
  const urlPath = decodeURIComponent(rawPath);
  const trimmed = urlPath.replace(/^\/+/g, '').replace(/\/+$/g, '');
  let filePath;

  if (!trimmed) {
    filePath = path.join(ROOT, 'index.html');
  } else if (staticRoutes[trimmed]) {
    filePath = path.join(ROOT, staticRoutes[trimmed]);
  } else {
    filePath = path.join(ROOT, trimmed);
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      return send404(res);
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        return send404(res);
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
