// Initialise la base SQLite avec :
//  - le schéma (migrations)
//  - les étiquettes par défaut
//  - les municipalités d'exemple
//  - un compte admin initial
//
// Usage : `npm run seed` (à la racine ou dans server/).

import bcrypt from 'bcrypt';
import { db } from './connection.js';
import { appliquerMigrations } from './migrate.js';
import { tagsRepo } from './repositories/tags.js';
import { municipalitesRepo } from './repositories/divers.js';
import { adminUsersRepo } from './repositories/divers.js';

const ETIQUETTES_DEFAUT = [
  { nom: 'royal-lepage', entite: 'royal-lepage' },
  { nom: 'sunset', entite: 'sunset' },
  { nom: 'chalet', entite: 'chalets' },
  { nom: 'airbnb', entite: 'chalets' },
  { nom: 'investissement', entite: 'royal-lepage' },
  { nom: 'commercial', entite: 'royal-lepage' },
  { nom: 'international', entite: 'royal-lepage' },
  { nom: 'achat', entite: 'royal-lepage' },
  { nom: 'vente', entite: 'royal-lepage' },
  { nom: 'club-privilege', entite: 'royal-lepage' },
  { nom: 'guide', entite: 'royal-lepage' },
  { nom: 'calculateur', entite: 'royal-lepage' },
  { nom: 'infolettre', entite: 'royal-lepage' },
  { nom: 'reference-partenaire', entite: 'royal-lepage' },
];

const MUNICIPALITES_DEFAUT = [
  { nom: 'Trois-Rivières', region: 'Mauricie', taux_municipal: 0.0095, taux_scolaire: 0.0010, actif: true },
  { nom: 'Shawinigan', region: 'Mauricie', taux_municipal: 0.0110, taux_scolaire: 0.0010, actif: true },
  { nom: 'Bécancour', region: 'Centre-du-Québec', taux_municipal: 0.0090, taux_scolaire: 0.0010, actif: true },
  { nom: 'Louiseville', region: 'Mauricie', taux_municipal: 0.0100, taux_scolaire: 0.0010, actif: true },
];

async function run() {
  appliquerMigrations();

  const existeTag = db.prepare('SELECT COUNT(*) AS c FROM tags').get().c;
  if (existeTag === 0) {
    for (const e of ETIQUETTES_DEFAUT) tagsRepo.creer(e);
    console.log(`Étiquettes par défaut créées (${ETIQUETTES_DEFAUT.length}).`);
  }

  const existeMun = db.prepare('SELECT COUNT(*) AS c FROM municipalities').get().c;
  if (existeMun === 0) {
    for (const m of MUNICIPALITES_DEFAUT) municipalitesRepo.creer(m);
    console.log(`Municipalités par défaut créées (${MUNICIPALITES_DEFAUT.length}).`);
  }

  const nomAdmin = process.env.ADMIN_USERNAME || 'roxan';
  const motDePasse = process.env.ADMIN_PASSWORD || 'Bonjour-2026!';
  if (!adminUsersRepo.parNomUtilisateur(nomAdmin)) {
    const hash = await bcrypt.hash(motDePasse, 12);
    adminUsersRepo.creer({ nom_utilisateur: nomAdmin, mot_de_passe_hash: hash, role: 'admin' });
    console.log(`Compte admin créé : ${nomAdmin}`);
    console.log(`Mot de passe initial : ${motDePasse} (à changer dès la première connexion).`);
  }

  console.log('Seed terminé.');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
