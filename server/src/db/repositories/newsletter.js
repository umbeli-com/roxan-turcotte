import { db } from '../connection.js';
import { randomBytes } from 'node:crypto';

export const newsletterRepo = {
  inscrire({ courriel, prenom }) {
    const existe = db.prepare('SELECT * FROM newsletter_subscribers WHERE courriel = ?').get(courriel);
    if (existe) {
      if (existe.statut !== 'actif') {
        db.prepare("UPDATE newsletter_subscribers SET statut='actif' WHERE id = ?").run(existe.id);
      }
      return existe;
    }
    const jeton = randomBytes(24).toString('hex');
    const r = db.prepare('INSERT INTO newsletter_subscribers (courriel, prenom, jeton_desinscription) VALUES (?, ?, ?)').run(courriel, prenom ?? null, jeton);
    return db.prepare('SELECT * FROM newsletter_subscribers WHERE id = ?').get(r.lastInsertRowid);
  },
  desinscrireParJeton(jeton) {
    const sub = db.prepare('SELECT * FROM newsletter_subscribers WHERE jeton_desinscription = ?').get(jeton);
    if (!sub) return null;
    db.prepare("UPDATE newsletter_subscribers SET statut='desinscrit' WHERE id = ?").run(sub.id);
    return sub;
  },
  lister() { return db.prepare('SELECT * FROM newsletter_subscribers ORDER BY abonne_le DESC').all(); },
  campagnes() { return db.prepare('SELECT * FROM newsletter_campaigns ORDER BY cree_le DESC').all(); },
  creerCampagne({ sujet, corps_html, segment_tag_id }) {
    const r = db.prepare('INSERT INTO newsletter_campaigns (sujet, corps_html, segment_tag_id) VALUES (?, ?, ?)').run(sujet, corps_html, segment_tag_id ?? null);
    return db.prepare('SELECT * FROM newsletter_campaigns WHERE id = ?').get(r.lastInsertRowid);
  },
  marquerCampagneEnvoyee(id) {
    db.prepare("UPDATE newsletter_campaigns SET statut='envoyee', envoye_le=datetime('now') WHERE id = ?").run(id);
  },
};
