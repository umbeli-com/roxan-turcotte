-- Migration 001 : schéma initial complet
-- Aligné sur la section 11 de instructions.md.

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  courriel TEXT NOT NULL,
  telephone TEXT,
  message TEXT,
  type_formulaire TEXT NOT NULL,
  source_entite TEXT,
  page_origine TEXT,
  statut TEXT NOT NULL DEFAULT 'nouveau',
  consentement INTEGER NOT NULL DEFAULT 0,
  consentement_horodatage TEXT,
  consentement_infolettre INTEGER NOT NULL DEFAULT 0,
  adresse_ip TEXT,
  notes_internes TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now')),
  modifie_le TEXT NOT NULL DEFAULT (datetime('now')),
  archive INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_leads_courriel ON leads(courriel);
CREATE INDEX IF NOT EXISTS idx_leads_statut ON leads(statut);
CREATE INDEX IF NOT EXISTS idx_leads_cree_le ON leads(cree_le);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL UNIQUE,
  couleur TEXT,
  entite TEXT
);

CREATE TABLE IF NOT EXISTS lead_tags (
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lead_id, tag_id)
);

CREATE TABLE IF NOT EXISTS guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  table_matieres TEXT,
  image_couverture TEXT,
  fichier_chemin TEXT NOT NULL,
  categorie TEXT,
  tag_id INTEGER REFERENCES tags(id),
  actif INTEGER NOT NULL DEFAULT 1,
  nb_telechargements INTEGER NOT NULL DEFAULT 0,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guide_downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  guide_id INTEGER NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  telecharge_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS calculator_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  entrees TEXT,
  resultat TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courriel TEXT NOT NULL UNIQUE,
  prenom TEXT,
  statut TEXT NOT NULL DEFAULT 'actif',
  jeton_desinscription TEXT NOT NULL UNIQUE,
  abonne_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sujet TEXT NOT NULL,
  corps_html TEXT NOT NULL,
  segment_tag_id INTEGER REFERENCES tags(id),
  statut TEXT NOT NULL DEFAULT 'brouillon',
  envoye_le TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS municipalities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  region TEXT,
  tranches_mutation TEXT,
  taux_scolaire REAL,
  taux_municipal REAL,
  actif INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS export_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  colonnes TEXT NOT NULL,
  separateur TEXT NOT NULL DEFAULT ',',
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS data_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courriel TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT,
  statut TEXT NOT NULL DEFAULT 'en-attente',
  demande_le TEXT NOT NULL DEFAULT (datetime('now')),
  traite_le TEXT
);

CREATE TABLE IF NOT EXISTS privacy_incidents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  gravite TEXT,
  mesures TEXT,
  survenu_le TEXT,
  consigne_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  destinataire TEXT NOT NULL,
  type TEXT NOT NULL,
  sujet TEXT,
  statut TEXT NOT NULL,
  erreur TEXT,
  envoye_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_utilisateur TEXT NOT NULL UNIQUE,
  mot_de_passe_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS _migrations (
  id INTEGER PRIMARY KEY,
  applique_le TEXT NOT NULL DEFAULT (datetime('now'))
);
