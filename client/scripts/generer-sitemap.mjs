// Génère un sitemap.xml à partir des routes pré-rendues par vite-react-ssg.
// Exécuté en post-build (cf. package.json).

import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = process.env.PUBLIC_SITE_URL || 'https://turcotte.umbeli.com';

function listerHtmls(dir) {
  const sortie = [];
  for (const nom of readdirSync(dir)) {
    const chemin = join(dir, nom);
    const stat = statSync(chemin);
    if (stat.isDirectory()) {
      sortie.push(...listerHtmls(chemin));
    } else if (nom === 'index.html') {
      sortie.push(chemin);
    } else if (nom.endsWith('.html')) {
      sortie.push(chemin);
    }
  }
  return sortie;
}

function urlPour(htmlPath) {
  const rel = relative(DIST, htmlPath).replace(/\\/g, '/');
  let url = '/' + rel.replace(/index\.html$/, '');
  url = url.replace(/\.html$/, '/');
  if (!url.endsWith('/')) url += '/';
  if (url === '/' || url === '') return SITE + '/';
  return SITE + url;
}

function ressemble404Ou(htmlPath) {
  return htmlPath.includes(`${DIST}admin`) || htmlPath.endsWith('404.html');
}

const html = listerHtmls(DIST).filter((p) => !ressemble404Ou(p));
const urls = [...new Set(html.map(urlPour))].sort();

const date = new Date().toISOString().slice(0, 10);
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url><loc>${u}</loc><lastmod>${date}</lastmod><changefreq>monthly</changefreq><priority>${u === SITE + '/' ? '1.0' : '0.7'}</priority></url>`,
    )
    .join('\n') +
  `\n</urlset>\n`;

writeFileSync(join(DIST, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml généré (${urls.length} URLs).`);
