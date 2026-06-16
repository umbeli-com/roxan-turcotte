-- Migration 003 : check-list d'inclusions / exclusions de la propriété.
-- Modèle d'items configurable par l'administrateur (le « remplissage » par
-- transaction se fait côté client et produit un Markdown copiable).

CREATE TABLE IF NOT EXISTS checklist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  libelle TEXT NOT NULL,
  categorie TEXT,
  -- état par défaut : inclus | exclus | non-disponible | autre
  etat_defaut TEXT NOT NULL DEFAULT 'inclus',
  ordre INTEGER NOT NULL DEFAULT 0,
  actif INTEGER NOT NULL DEFAULT 1,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_checklist_ordre ON checklist_items(ordre);
