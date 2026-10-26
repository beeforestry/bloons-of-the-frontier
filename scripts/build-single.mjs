// Packs dist/ into ONE self-contained HTML file (works from file://, no server).
// JS + CSS are inlined; every asset is embedded as a data URI.
// Usage: npm run build && node scripts/build-single.mjs [out.html]
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const out = path.resolve(process.argv[2] || 'bloons-frontier-single.html');
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
const assets = {};
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full);
    else if (MIME[path.extname(f.name).toLowerCase()]) {
      const rel = path.relative(dist, full).split(path.sep).join('/');
      assets[rel] = `data:${MIME[path.extname(f.name).toLowerCase()]};base64,${fs.readFileSync(full).toString('base64')}`;
    }
  }
})(path.join(dist, 'assets'));

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/<\/script/gi, '<\\/script');
// CSS
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g, (_, f) => {
  let css = fs.readFileSync(path.join(dist, f), 'utf8');
  css = css.replace(/url\((?:\.\.\/|\.\/|\/)?(assets\/[^)'"]+)\)/g, (m, a) => (assets[a] ? `url(${assets[a]})` : m));
  return `<style>${css}</style>`;
});
// JS (moved to end of body so the DOM exists; module scripts are deferred anyway)
let js = '';
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>\s*/g, (_, f) => { js += fs.readFileSync(path.join(dist, f), 'utf8'); return ''; });
// Static <img>/<link> asset refs in the HTML
html = html.replace(/(src|href)="\.?\/?(assets\/[^"]+)"/g, (m, attr, a) => (assets[a] ? `${attr}="${assets[a]}"` : m));
const boot = `<script>window.__BOTF_ASSETS=${JSON.stringify(assets)};</script>\n<script type="module">${esc(js)}</script>\n`;
html = html.replace('</body>', () => boot + '</body>');
fs.writeFileSync(out, html);
console.log(`wrote ${out} (${(fs.statSync(out).size / 1048576).toFixed(2)} MB, ${Object.keys(assets).length} assets)`);
