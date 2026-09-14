import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2);
const value = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const port = Number(value('--port', '4173'));
const inputBase = value('--base', '/');
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Use a port between 1024 and 65535.');
if (!inputBase || !/^\/(?:[\w-]+\/)*$/.test(inputBase)) throw new Error('Base must look like / or /portfolio/.');
const base = inputBase;
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

const server = http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (base !== '/' && pathname === base.slice(0, -1)) {
      response.writeHead(302, { Location: base }).end();
      return;
    }
    if (!pathname.startsWith(base)) throw new Error('Not found');
    const resource = pathname.slice(base.length) || 'index.html';
    if (resource !== 'index.html' && !resource.startsWith('assets/')) throw new Error('Not found');
    const target = resolve(root, resource);
    const allowedRoot = resource === 'index.html' ? root : resolve(root, 'assets');
    const pathWithin = relative(allowedRoot, target);
    if (pathWithin.startsWith('..') || pathWithin.includes(':') || !mime[extname(target)]) throw new Error('Not found');
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[extname(target)], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 Not found');
  }
});
server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', async () => {
  const url = `http://127.0.0.1:${port}${base}`;
  const readiness = await fetch(url);
  if (!readiness.ok) {
    console.error(`Preview did not become ready: HTTP ${readiness.status}`);
    server.close();
    process.exitCode = 1;
    return;
  }
  console.log(`Local: ${url} (HTTP ${readiness.status})`);
});
