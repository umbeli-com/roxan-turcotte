import { db } from '../connection.js';

export const tagsRepo = {
  lister() { return db.prepare('SELECT * FROM tags ORDER BY nom').all(); },
  creer({ nom, couleur, entite }) {
    const r = db.prepare('INSERT INTO tags (nom, couleur, entite) VALUES (?, ?, ?)').run(nom, couleur ?? null, entite ?? null);
    return db.prepare('SELECT * FROM tags WHERE id = ?').get(r.lastInsertRowid);
  },
  modifier(id, champs) {
    const updates = []; const params = { id };
    for (const [k, v] of Object.entries(champs)) { updates.push(`${k} = @${k}`); params[k] = v; }
    if (updates.length) db.prepare(`UPDATE tags SET ${updates.join(', ')} WHERE id = @id`).run(params);
    return db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
  },
  supprimer(id) { db.prepare('DELETE FROM tags WHERE id = ?').run(id); },
};
