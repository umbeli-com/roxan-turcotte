import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signerSession(payload) {
  return jwt.sign(payload, env.sessionSecret, { expiresIn: '8h' });
}

export function exigerAdmin(req, res, next) {
  const jeton = req.cookies?.rt_session;
  if (!jeton) return res.status(401).json({ erreur: 'non-authentifie' });
  try {
    const charge = jwt.verify(jeton, env.sessionSecret);
    req.utilisateur = charge;
    next();
  } catch {
    res.status(401).json({ erreur: 'session-invalide' });
  }
}

export const optionsCookieSession = {
  httpOnly: true,
  sameSite: 'strict',
  secure: env.cookieSecure,
  maxAge: 8 * 60 * 60 * 1000,
};
