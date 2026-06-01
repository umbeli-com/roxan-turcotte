// Initialise la base SQLite avec :
//  - le schéma (migrations)
//  - les étiquettes par défaut
//  - les municipalités d'exemple
//  - un compte admin initial
//
// Utilisable de deux manières :
//   1) en CLI : `npm run seed` (à la racine ou dans server/)
//   2) au démarrage de l'API : `await semer()` depuis index.js (idempotent,
//      ne crée que ce qui manque, ne touche rien sinon).

import bcrypt from 'bcrypt';
import { db } from './connection.js';
import { appliquerMigrations } from './migrate.js';
import { tagsRepo } from './repositories/tags.js';
import { municipalitesRepo, adminUsersRepo } from './repositories/divers.js';

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

export async function semer({ silencieux = false } = {}) {
  appliquerMigrations();

  const log = (m) => !silencieux && console.log(m);

  const existeTag = db.prepare('SELECT COUNT(*) AS c FROM tags').get().c;
  if (existeTag === 0) {
    for (const e of ETIQUETTES_DEFAUT) tagsRepo.creer(e);
    log(`Étiquettes par défaut créées (${ETIQUETTES_DEFAUT.length}).`);
  }

  const existeMun = db.prepare('SELECT COUNT(*) AS c FROM municipalities').get().c;
  if (existeMun === 0) {
    for (const m of MUNICIPALITES_DEFAUT) municipalitesRepo.creer(m);
    log(`Municipalités par défaut créées (${MUNICIPALITES_DEFAUT.length}).`);
  }

  // Compte admin initial : ne crée QUE s'il n'existe aucun admin du tout
  // (et pas seulement si l'admin avec ce nom-là n'existe pas) pour éviter
  // de recréer un admin de seed après que le client en ait créé un autre.
  const nbAdmin = db.prepare('SELECT COUNT(*) AS c FROM admin_users').get().c;
  if (nbAdmin === 0) {
    const nomAdmin = process.env.ADMIN_USERNAME || 'roxan';
    const motDePasse = process.env.ADMIN_PASSWORD || 'Bonjour-2026!';
    const hash = await bcrypt.hash(motDePasse, 12);
    adminUsersRepo.creer({ nom_utilisateur: nomAdmin, mot_de_passe_hash: hash, role: 'admin' });
    log(`Compte admin créé : ${nomAdmin}`);
    log(`Mot de passe initial : ${motDePasse} (à changer dès la première connexion).`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  semer()
    .then(() => { console.log('Seed terminé.'); process.exit(0); })
    .catch((e) => { console.error(e); process.exit(1); });
}
