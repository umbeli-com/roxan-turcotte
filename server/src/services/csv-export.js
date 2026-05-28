// Génération d'un export CSV paramétré (profils de colonnes).
// Encodage UTF-8 avec BOM (compatibilité Excel et imports québécois).

const BOM = '﻿';

function echapper(valeur, separateur) {
  if (valeur === null || valeur === undefined) return '';
  const s = String(valeur);
  if (s.includes('"') || s.includes('\n') || s.includes(separateur)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Génère un CSV à partir de lignes (objets) et d'un profil de colonnes.
 * @param {{cle: string, titre: string}[]} colonnes  Mappage colonnes (ordre maintenu).
 * @param {object[]} lignes
 * @param {string} separateur  Habituellement ',' ou ';'.
 */
export function genererCSV(colonnes, lignes, separateur = ',') {
  const entete = colonnes.map((c) => echapper(c.titre, separateur)).join(separateur);
  const corps = lignes.map((l) =>
    colonnes.map((c) => echapper(l[c.cle], separateur)).join(separateur),
  );
  return BOM + [entete, ...corps].join('\r\n') + '\r\n';
}
