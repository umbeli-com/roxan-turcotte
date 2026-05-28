import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { gestionnaireErreurs, pasTrouve } from './middleware/erreurs.js';
import { routesLeadsPublic } from './routes/public/leads.js';
import { routesDiverses } from './routes/public/divers.js';
import { routesAdmin } from './routes/admin/index.js';

export function creerApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({
    origin: [env.publicBaseUrl, /localhost/],
    credentials: true,
  }));
  app.use(express.json({ limit: '300kb' }));
  app.use(cookieParser());

  // Rate-limit sur les soumissions publiques (anti-pourriel).
  const limiteurPublic = rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.get('/api/health', (req, res) => res.json({ ok: true, env: env.nodeEnv }));

  app.use('/api', limiteurPublic, routesLeadsPublic);
  app.use('/api', limiteurPublic, routesDiverses);
  app.use('/api/admin', routesAdmin);

  // 404 et erreurs
  app.use('/api', pasTrouve);
  app.use(gestionnaireErreurs);

  return app;
}
