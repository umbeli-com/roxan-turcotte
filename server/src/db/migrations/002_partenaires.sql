-- Migration 002 : profils « personnes à contacter » (mini-CRM de revente).
-- Chaque lead peut être dirigé vers un partenaire (profil) ; l'administrateur
-- gère le courriel de transfert et l'état actif de chaque partenaire.

ALTER TABLE leads ADD COLUMN profil_slug TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_profil ON leads(profil_slug);

CREATE TABLE IF NOT EXISTS partenaires (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  nom TEXT NOT NULL,
  role TEXT,
  courriel TEXT,
  entite TEXT,
  description TEXT,
  actif INTEGER NOT NULL DEFAULT 1,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
