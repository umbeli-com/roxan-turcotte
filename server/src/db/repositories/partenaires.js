import { db } from '../connection.js';

// Partenaires / profils « personnes à contacter ». Le `slug` fait le lien avec
// les profils publics (client/content/profils.ts) ; le courriel (privé) sert au
// transfert du lead. L'administrateur peut tout éditer depuis le dashboard.
export const partenairesRepo = {
  lister() {
    return db.prepare('SELECT * FROM partenaires ORDER BY actif DESC, nom').all();
  },

  parSlug(slug) {
    return db.prepare('SELECT * FROM partenaires WHERE slug = ?').get(slug);
  },

  trouver(id) {
    return db.prepare('SELECT * FROM partenaires WHERE id = ?').get(id);
  },

  creer(p) {
    const r = db
      .prepare(`INSERT INTO partenaires (slug, nom, role, courriel, entite, description, actif)
        VALUES (@slug, @nom, @role, @courriel, @entite, @description, @actif)`)
      .run({
        slug: p.slug,
        nom: p.nom,
        role: p.role ?? null,
        courriel: p.courriel ?? null,
        entite: p.entite ?? null,
        description: p.description ?? null,
        actif: p.actif === 0 || p.actif === false ? 0 : 1,
      });
    return this.trouver(r.lastInsertRowid);
  },

  modifier(id, champs) {
    const updates = [];
    const params = { id };
    for (const [k, v] of Object.entries(champs)) {
      if (k === 'id') continue;
      updates.push(`${k} = @${k}`);
      params[k] = typeof v === 'boolean' ? (v ? 1 : 0) : v;
    }
    if (updates.length) {
      db.prepare(`UPDATE partenaires SET ${updates.join(', ')} WHERE id = @id`).run(params);
    }
    return this.trouver(id);
  },

  supprimer(id) {
    db.prepare('DELETE FROM partenaires WHERE id = ?').run(id);
  },

  // Crée le partenaire seulement s'il n'existe pas déjà (utilisé au seed,
  // pour ne pas écraser un courriel saisi par l'administrateur).
  upsertSiAbsent(p) {
    const existe = this.parSlug(p.slug);
    if (existe) return existe;
    return this.creer(p);
  },

  // Leads dirigés vers ce partenaire (pour la revente du lead).
  leadsParSlug(slug, limite = 200) {
    return db
      .prepare('SELECT * FROM leads WHERE profil_slug = ? ORDER BY cree_le DESC LIMIT ?')
      .all(slug, limite);
  },
};
