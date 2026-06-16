import { db } from '../connection.js';

// Modèle d'items de la check-list d'inclusions / exclusions (table
// `checklist_items`). Géré par l'administrateur ; le remplissage par
// transaction se fait côté client.
export const checklistRepo = {
  lister() {
    return db.prepare('SELECT * FROM checklist_items ORDER BY ordre, id').all();
  },

  trouver(id) {
    return db.prepare('SELECT * FROM checklist_items WHERE id = ?').get(id);
  },

  creer(it) {
    // Place le nouvel item à la fin par défaut.
    const max = db.prepare('SELECT COALESCE(MAX(ordre), 0) AS m FROM checklist_items').get().m;
    const r = db
      .prepare(`INSERT INTO checklist_items (libelle, categorie, etat_defaut, ordre, actif)
        VALUES (@libelle, @categorie, @etat_defaut, @ordre, @actif)`)
      .run({
        libelle: it.libelle,
        categorie: it.categorie ?? null,
        etat_defaut: it.etat_defaut ?? 'inclus',
        ordre: it.ordre ?? max + 1,
        actif: it.actif === 0 || it.actif === false ? 0 : 1,
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
      db.prepare(`UPDATE checklist_items SET ${updates.join(', ')} WHERE id = @id`).run(params);
    }
    return this.trouver(id);
  },

  supprimer(id) {
    db.prepare('DELETE FROM checklist_items WHERE id = ?').run(id);
  },

  // Crée l'item seulement s'il n'existe pas déjà (par libellé), pour le seed.
  upsertSiAbsent(it) {
    const existe = db.prepare('SELECT id FROM checklist_items WHERE libelle = ?').get(it.libelle);
    if (existe) return existe;
    return this.creer(it);
  },
};
