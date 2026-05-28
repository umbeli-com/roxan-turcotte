// Applique les migrations SQL versionnées au démarrage et/ou via `npm run migrate`.

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { db } from './connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, 'migrations');

export function appliquerMigrations() {
  db.exec(`CREATE TABLE IF NOT EXISTS _migrations (id INTEGER PRIMARY KEY, applique_le TEXT NOT NULL DEFAULT (datetime('now')));`);
  const dejaApplique = new Set(db.prepare('SELECT id FROM _migrations').all().map((r) => r.id));
  const fichiers = readdirSync(DIR).filter((n) => n.endsWith('.sql')).sort();
  for (const fichier of fichiers) {
    const id = Number(fichier.split('_')[0]);
    if (dejaApplique.has(id)) continue;
    const sql = readFileSync(join(DIR, fichier), 'utf8');
    db.exec(sql);
    db.prepare('INSERT INTO _migrations (id) VALUES (?)').run(id);
    console.log(`Migration ${fichier} appliquée.`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  appliquerMigrations();
  console.log('Migrations terminées.');
}
