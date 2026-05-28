import { db } from '../connection.js';

export const guidesRepo = {
  lister(actifsSeulement = false) {
    const where = actifsSeulement ? 'WHERE actif = 1' : '';
    return db.prepare(`SELECT * FROM guides ${where} ORDER BY titre`).all();
  },
  parSlug(slug) { return db.prepare('SELECT * FROM guides WHERE slug = ?').get(slug); },
  creer(g) {
    const r = db.prepare(`INSERT INTO guides (titre, slug, description, table_matieres, image_couverture, fichier_chemin, categorie, tag_id, actif)
      VALUES (@titre, @slug, @description, @table_matieres, @image_couverture, @fichier_chemin, @categorie, @tag_id, @actif)`).run({
        titre: g.titre, slug: g.slug, description: g.description ?? null,
        table_matieres: g.table_matieres ?? null, image_couverture: g.image_couverture ?? null,
        fichier_chemin: g.fichier_chemin, categorie: g.categorie ?? null,
        tag_id: g.tag_id ?? null, actif: g.actif ? 1 : 0,
      });
    return db.prepare('SELECT * FROM guides WHERE id = ?').get(r.lastInsertRowid);
  },
  modifier(id, champs) {
    const updates = []; const params = { id };
    for (const [k, v] of Object.entries(champs)) { updates.push(`${k} = @${k}`); params[k] = v; }
    if (updates.length) db.prepare(`UPDATE guides SET ${updates.join(', ')} WHERE id = @id`).run(params);
    return db.prepare('SELECT * FROM guides WHERE id = ?').get(id);
  },
  supprimer(id) { db.prepare('DELETE FROM guides WHERE id = ?').run(id); },
  enregistrerTelechargement(leadId, guideId) {
    db.prepare('INSERT INTO guide_downloads (lead_id, guide_id) VALUES (?, ?)').run(leadId, guideId);
    db.prepare('UPDATE guides SET nb_telechargements = nb_telechargements + 1 WHERE id = ?').run(guideId);
  },
};
