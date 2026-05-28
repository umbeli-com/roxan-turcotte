import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Charge le .env du dossier racine si présent (et le .env local sinon).
dotenv.config({ path: resolve(__dirname, '../../../.env') });
dotenv.config({ path: resolve(__dirname, '../../.env') });

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3010),

  databasePath: process.env.DATABASE_PATH || './data/roxan.sqlite',

  sessionSecret: process.env.SESSION_SECRET || 'changez-moi-en-production',
  cookieSecure: process.env.COOKIE_SECURE === 'true',

  mail: {
    transport: process.env.MAIL_TRANSPORT || 'smtp',
    host: process.env.MAIL_HOST || 'smtp.office365.com',
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER || '',
    password: process.env.MAIL_PASSWORD || '',
    from: process.env.MAIL_FROM || 'Roxan Turcotte <roxan@example.com>',
    notifInternalTo: process.env.MAIL_NOTIF_INTERNAL_TO || '',
  },

  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'https://turcotte.umbeli.com',

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    max: Number(process.env.RATE_LIMIT_MAX || 10),
  },
};
