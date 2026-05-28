import { db } from '../connection.js';

export const municipalitesRepo = {
  lister() { return db.prepare('SELECT * FROM municipalities ORDER BY nom').all(); },
  creer(m) {
    const r = db.prepare(`INSERT INTO municipalities (nom, region, tranches_mutation, taux_scolaire, taux_municipal, actif)
      VALUES (@nom, @region, @tranches_mutation, @taux_scolaire, @taux_municipal, @actif)`).run({
        nom: m.nom, region: m.region ?? null,
        tranches_mutation: m.tranches_mutation ? JSON.stringify(m.tranches_mutation) : null,
        taux_scolaire: m.taux_scolaire ?? null, taux_municipal: m.taux_municipal ?? null,
        actif: m.actif ? 1 : 0,
      });
    return db.prepare('SELECT * FROM municipalities WHERE id = ?').get(r.lastInsertRowid);
  },
  modifier(id, champs) {
    const updates = []; const params = { id };
    for (const [k, v] of Object.entries(champs)) {
      updates.push(`${k} = @${k}`);
      params[k] = k === 'tranches_mutation' && v ? JSON.stringify(v) : v;
    }
    if (updates.length) db.prepare(`UPDATE municipalities SET ${updates.join(', ')} WHERE id = @id`).run(params);
    return db.prepare('SELECT * FROM municipalities WHERE id = ?').get(id);
  },
  supprimer(id) { db.prepare('DELETE FROM municipalities WHERE id = ?').run(id); },
};

export const exportProfilesRepo = {
  lister() { return db.prepare('SELECT * FROM export_profiles ORDER BY nom').all(); },
  creer(p) {
    const r = db.prepare('INSERT INTO export_profiles (nom, colonnes, separateur) VALUES (?, ?, ?)')
      .run(p.nom, JSON.stringify(p.colonnes), p.separateur ?? ',');
    return db.prepare('SELECT * FROM export_profiles WHERE id = ?').get(r.lastInsertRowid);
  },
  modifier(id, champs) {
    const updates = []; const params = { id };
    for (const [k, v] of Object.entries(champs)) {
      updates.push(`${k} = @${k}`);
      params[k] = k === 'colonnes' ? JSON.stringify(v) : v;
    }
    if (updates.length) db.prepare(`UPDATE export_profiles SET ${updates.join(', ')} WHERE id = @id`).run(params);
    return db.prepare('SELECT * FROM export_profiles WHERE id = ?').get(id);
  },
  supprimer(id) { db.prepare('DELETE FROM export_profiles WHERE id = ?').run(id); },
};

export const dataRequestsRepo = {
  lister() { return db.prepare('SELECT * FROM data_requests ORDER BY demande_le DESC').all(); },
  creer({ courriel, type, message }) {
    const r = db.prepare('INSERT INTO data_requests (courriel, type, message) VALUES (?, ?, ?)').run(courriel, type, message ?? null);
    return db.prepare('SELECT * FROM data_requests WHERE id = ?').get(r.lastInsertRowid);
  },
  marquerTraitee(id) {
    db.prepare("UPDATE data_requests SET statut='traitee', traite_le=datetime('now') WHERE id = ?").run(id);
  },
};

export const incidentsRepo = {
  lister() { return db.prepare('SELECT * FROM privacy_incidents ORDER BY consigne_le DESC').all(); },
  consigner(i) {
    const r = db.prepare('INSERT INTO privacy_incidents (description, gravite, mesures, survenu_le) VALUES (?, ?, ?, ?)')
      .run(i.description, i.gravite ?? null, i.mesures ?? null, i.survenu_le ?? null);
    return db.prepare('SELECT * FROM privacy_incidents WHERE id = ?').get(r.lastInsertRowid);
  },
};

export const adminUsersRepo = {
  parNomUtilisateur(nom) { return db.prepare('SELECT * FROM admin_users WHERE nom_utilisateur = ?').get(nom); },
  creer({ nom_utilisateur, mot_de_passe_hash, role }) {
    const r = db.prepare('INSERT INTO admin_users (nom_utilisateur, mot_de_passe_hash, role) VALUES (?, ?, ?)')
      .run(nom_utilisateur, mot_de_passe_hash, role ?? 'admin');
    return db.prepare('SELECT id, nom_utilisateur, role FROM admin_users WHERE id = ?').get(r.lastInsertRowid);
  },
};

export const emailLogRepo = {
  journaliser({ lead_id, destinataire, type, sujet, statut, erreur }) {
    db.prepare('INSERT INTO email_log (lead_id, destinataire, type, sujet, statut, erreur) VALUES (?, ?, ?, ?, ?, ?)')
      .run(lead_id ?? null, destinataire, type, sujet ?? null, statut, erreur ?? null);
  },
};
