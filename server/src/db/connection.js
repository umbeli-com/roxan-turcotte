import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { env } from '../config/env.js';

const cheminAbsolu = resolve(process.cwd(), env.databasePath);
mkdirSync(dirname(cheminAbsolu), { recursive: true });

export const db = new Database(cheminAbsolu);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function fermerDb() {
  db.close();
}
