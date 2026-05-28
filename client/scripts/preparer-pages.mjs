// Prépare le dossier dist/ pour un déploiement GitHub Pages :
//   1. Copie index.html en 404.html (fallback SPA pour l'admin et les routes non générées)
//   2. Écrit un fichier CNAME pour le domaine personnalisé (turcotte.umbeli.com)
//   3. Pose un .nojekyll afin que Pages ne masque pas les fichiers commençant par _

import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

if (existsSync(join(DIST, 'index.html'))) {
  copyFileSync(join(DIST, 'index.html'), join(DIST, '404.html'));
  console.log('404.html créé (copie de index.html, fallback SPA).');
}

const cname = process.env.PAGES_CNAME || 'turcotte.umbeli.com';
writeFileSync(join(DIST, 'CNAME'), cname + '\n', 'utf8');
console.log(`CNAME = ${cname}`);

writeFileSync(join(DIST, '.nojekyll'), '', 'utf8');
console.log('.nojekyll posé.');
