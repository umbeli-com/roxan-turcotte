import { creerApp } from './app.js';
import { env } from './config/env.js';
import { appliquerMigrations } from './db/migrate.js';
import { semer } from './db/seed.js';

appliquerMigrations();
// Seed idempotent : crée seulement ce qui manque (étiquettes, municipalités,
// compte admin initial). Sans cet appel, une nouvelle BD reste sans admin
// et personne ne peut se connecter au back-office.
await semer({ silencieux: env.nodeEnv === 'production' }).catch((e) => {
  console.error('Échec du seed initial :', e);
});

const app = creerApp();
app.listen(env.port, () => {
  console.log(`API Roxan Turcotte en écoute sur le port ${env.port} (${env.nodeEnv}).`);
});
