import { creerApp } from './app.js';
import { env } from './config/env.js';
import { appliquerMigrations } from './db/migrate.js';

appliquerMigrations();

const app = creerApp();
app.listen(env.port, () => {
  console.log(`API Roxan Turcotte en écoute sur le port ${env.port} (${env.nodeEnv}).`);
});
