import { db } from '../connection.js';

const INSERT = db.prepare(`
  INSERT INTO leads (
    prenom, nom, courriel, telephone, message,
    type_formulaire, source_entite, page_origine, profil_slug,
    consentement, consentement_horodatage, consentement_infolettre,
    adresse_ip
  ) VALUES (
    @prenom, @nom, @courriel, @telephone, @message,
    @type_formulaire, @source_entite, @page_origine, @profil_slug,
    @consentement, @consentement_horodatage, @consentement_infolettre,
    @adresse_ip
  )
`);

const SELECT_ID = db.prepare('SELECT * FROM leads WHERE id = ?');
const LIER_TAG = db.prepare('INSERT OR IGNORE INTO lead_tags (lead_id, tag_id) VALUES (?, ?)');
const TAG_PAR_NOM = db.prepare('SELECT id FROM tags WHERE nom = ?');
const CREER_TAG = db.prepare('INSERT INTO tags (nom) VALUES (?)');

export function creerLead(payload, etiquettes = []) {
  const tx = db.transaction((p, tags) => {
    const result = INSERT.run({
      prenom: p.prenom,
      nom: p.nom,
      courriel: p.courriel,
      telephone: p.telephone ?? null,
      message: p.message ?? null,
      type_formulaire: p.type_formulaire,
      source_entite: p.source_entite ?? null,
      page_origine: p.page_origine ?? null,
      profil_slug: p.profil_slug ?? null,
      consentement: p.consentement ? 1 : 0,
      consentement_horodatage: p.consentement_horodatage ?? new Date().toISOString(),
      consentement_infolettre: p.consentement_infolettre ? 1 : 0,
      adresse_ip: p.adresse_ip ?? null,
    });
    const leadId = result.lastInsertRowid;
    for (const nom of tags) {
      const tag = TAG_PAR_NOM.get(nom) ?? { id: CREER_TAG.run(nom).lastInsertRowid };
      LIER_TAG.run(leadId, tag.id);
    }
    return leadId;
  });
  const id = tx(payload, etiquettes);
  return SELECT_ID.get(id);
}

export function lister({ etiquette, statut, sourceEntite, profil, recherche, depuis, jusqu, limite = 50, offset = 0, avecDetailsExport = false } = {}) {
  const conditions = [];
  const params = {};
  if (statut) {
    conditions.push(statut === 'archive' ? '(l.statut = @statut OR l.archive = 1)' : '(l.statut = @statut AND l.archive = 0)');
    params.statut = statut;
  }
  if (sourceEntite) { conditions.push('l.source_entite = @sourceEntite'); params.sourceEntite = sourceEntite; }
  if (profil) { conditions.push('l.profil_slug = @profil'); params.profil = profil; }
  if (recherche) {
    conditions.push('(l.prenom LIKE @r OR l.nom LIKE @r OR l.courriel LIKE @r OR l.telephone LIKE @r)');
    params.r = `%${recherche}%`;
  }
  if (depuis) { conditions.push('l.cree_le >= @depuis'); params.depuis = depuis; }
  if (jusqu) {
    // Un filtre de date inclut toute la dernière journée, même avec un horodatage ISO.
    conditions.push(/^\d{4}-\d{2}-\d{2}$/.test(jusqu) ? 'substr(l.cree_le, 1, 10) <= @jusqu' : 'l.cree_le <= @jusqu');
    params.jusqu = jusqu;
  }
  if (etiquette) {
    conditions.push('l.id IN (SELECT lead_id FROM lead_tags lt JOIN tags t ON t.id = lt.tag_id WHERE t.nom = @etiquette)');
    params.etiquette = etiquette;
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const detailsExport = avecDetailsExport ? `,
    (SELECT json_group_array(nom) FROM (
      SELECT t.nom FROM tags t JOIN lead_tags lt ON lt.tag_id = t.id
      WHERE lt.lead_id = l.id ORDER BY t.nom
    )) AS etiquettes_export,
    EXISTS(SELECT 1 FROM newsletter_subscribers ns
      WHERE ns.courriel = l.courriel COLLATE NOCASE AND ns.statut = 'desinscrit'
    ) AS infolettre_desinscrit` : '';
  const sql = `SELECT l.*${detailsExport} FROM leads l ${where} ORDER BY l.cree_le DESC LIMIT @limite OFFSET @offset`;
  return db.prepare(sql).all({ ...params, limite, offset });
}

export function compter(filtres = {}) {
  return lister({ ...filtres, limite: 1_000_000 }).length;
}

export function modifier(id, champs) {
  const updates = [];
  const params = { id };
  for (const [k, v] of Object.entries(champs)) {
    updates.push(`${k} = @${k}`);
    params[k] = v;
  }
  if (!updates.length) return SELECT_ID.get(id);
  updates.push("modifie_le = datetime('now')");
  db.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = @id`).run(params);
  return SELECT_ID.get(id);
}

export function archiver(id) { return modifier(id, { archive: 1 }); }
export function supprimer(id) { db.prepare('DELETE FROM leads WHERE id = ?').run(id); }
export function trouver(id) { return SELECT_ID.get(id); }

export function etiquettesDuLead(leadId) {
  return db.prepare('SELECT t.* FROM tags t JOIN lead_tags lt ON lt.tag_id = t.id WHERE lt.lead_id = ?').all(leadId);
}
