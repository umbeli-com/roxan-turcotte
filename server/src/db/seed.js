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
import { partenairesRepo } from './repositories/partenaires.js';
import { checklistRepo } from './repositories/checklist.js';

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

// Partenaires « personnes à contacter » (slugs alignés sur client/content/profils.ts).
// Le courriel reste vide : l'administrateur le renseignera dans le dashboard.
const PARTENAIRES_DEFAUT = [
  { slug: 'roxan-turcotte', nom: 'Roxan Turcotte', role: 'Courtier immobilier · Royal LePage Centre', entite: 'royal-lepage', description: 'Vente, achat et investissement à Trois-Rivières et en Mauricie.' },
  { slug: 'roxan-sunset', nom: 'Roxan Turcotte', role: 'Sunset · Immobilier dans le Sud', entite: 'sunset', description: 'Projets de propriété au soleil : résidence secondaire, retraite, investissement.' },
  { slug: 'roxan-chalets', nom: 'Roxan Turcotte', role: 'Chalets & Airbnb', entite: 'chalets', description: 'Acquisition et exploitation de chalets en location courte durée.' },
  { slug: 'courtier-hypothecaire', nom: 'Courtier hypothécaire partenaire', role: 'Financement hypothécaire', entite: 'partenaire', description: 'Comparaison des taux et structuration du financement.' },
  { slug: 'notaire', nom: 'Notaire partenaire', role: 'Acte de vente · vérification des titres', entite: 'partenaire', description: 'Acte notarié, vérifications de titres et signature.' },
  { slug: 'inspecteur', nom: 'Inspecteur en bâtiment', role: 'Inspection préachat', entite: 'partenaire', description: 'Inspection rigoureuse avant l’engagement.' },
];

// Items par défaut de la check-list d'inclusions / exclusions (immobilier QC).
// `e` = état par défaut : inclus | exclus | non-disponible | autre.
const CHECKLIST_DEFAUT = [
  // Électroménagers (souvent repris par le vendeur → exclus par défaut)
  { categorie: 'Électroménagers', libelle: 'Cuisinière', e: 'exclus' },
  { categorie: 'Électroménagers', libelle: 'Réfrigérateur', e: 'exclus' },
  { categorie: 'Électroménagers', libelle: 'Lave-vaisselle', e: 'exclus' },
  { categorie: 'Électroménagers', libelle: 'Four à micro-ondes / hotte', e: 'exclus' },
  { categorie: 'Électroménagers', libelle: 'Laveuse', e: 'exclus' },
  { categorie: 'Électroménagers', libelle: 'Sécheuse', e: 'exclus' },
  { categorie: 'Électroménagers', libelle: 'Congélateur', e: 'exclus' },
  // Luminaires et fenêtres
  { categorie: 'Luminaires et fenêtres', libelle: 'Luminaires', e: 'inclus' },
  { categorie: 'Luminaires et fenêtres', libelle: 'Ventilateurs de plafond', e: 'inclus' },
  { categorie: 'Luminaires et fenêtres', libelle: 'Stores', e: 'inclus' },
  { categorie: 'Luminaires et fenêtres', libelle: 'Toiles et persiennes', e: 'inclus' },
  { categorie: 'Luminaires et fenêtres', libelle: 'Rideaux et tringles', e: 'inclus' },
  // Chauffage, climatisation et eau
  { categorie: 'Chauffage, climatisation et eau', libelle: 'Thermopompe / climatiseur mural', e: 'inclus' },
  { categorie: 'Chauffage, climatisation et eau', libelle: 'Foyer / poêle', e: 'inclus' },
  { categorie: 'Chauffage, climatisation et eau', libelle: 'Échangeur d’air (VRC/VRE)', e: 'inclus' },
  { categorie: 'Chauffage, climatisation et eau', libelle: 'Réservoir d’eau chaude', e: 'autre' },
  { categorie: 'Chauffage, climatisation et eau', libelle: 'Adoucisseur d’eau', e: 'inclus' },
  { categorie: 'Chauffage, climatisation et eau', libelle: 'Système de filtration d’eau', e: 'inclus' },
  // Systèmes
  { categorie: 'Systèmes', libelle: 'Système d’alarme', e: 'inclus' },
  { categorie: 'Systèmes', libelle: 'Aspirateur central et accessoires', e: 'inclus' },
  { categorie: 'Systèmes', libelle: 'Ouvre-porte de garage et télécommandes', e: 'inclus' },
  { categorie: 'Systèmes', libelle: 'Détecteurs de fumée et de CO', e: 'inclus' },
  { categorie: 'Systèmes', libelle: 'Thermostats intelligents', e: 'inclus' },
  { categorie: 'Systèmes', libelle: 'Sonnette / caméra connectée', e: 'inclus' },
  // Extérieur
  { categorie: 'Extérieur', libelle: 'Remise / cabanon', e: 'inclus' },
  { categorie: 'Extérieur', libelle: 'Abri d’auto (abri Tempo)', e: 'inclus' },
  { categorie: 'Extérieur', libelle: 'Piscine et accessoires', e: 'inclus' },
  { categorie: 'Extérieur', libelle: 'Spa', e: 'inclus' },
  { categorie: 'Extérieur', libelle: 'Système d’arrosage', e: 'inclus' },
  { categorie: 'Extérieur', libelle: 'Aménagement paysager et plantations', e: 'inclus' },
  { categorie: 'Extérieur', libelle: 'Corde à linge', e: 'inclus' },
  { categorie: 'Extérieur', libelle: 'Module de jeu / balançoire', e: 'inclus' },
  { categorie: 'Extérieur', libelle: 'Barbecue au gaz fixe (relié)', e: 'inclus' },
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

  // Partenaires : ajoute ceux qui manquent (n'écrase pas les courriels saisis).
  let nbPartenaires = 0;
  for (const p of PARTENAIRES_DEFAUT) {
    const avant = partenairesRepo.parSlug(p.slug);
    partenairesRepo.upsertSiAbsent(p);
    if (!avant) nbPartenaires += 1;
  }
  if (nbPartenaires) log(`Partenaires créés (${nbPartenaires}).`);

  // Check-list d'inclusions / exclusions : items par défaut (seulement si vide,
  // pour ne pas écraser les modifications de l'administrateur).
  const existeChecklist = db.prepare('SELECT COUNT(*) AS c FROM checklist_items').get().c;
  if (existeChecklist === 0) {
    CHECKLIST_DEFAUT.forEach((it, i) =>
      checklistRepo.creer({ libelle: it.libelle, categorie: it.categorie, etat_defaut: it.e, ordre: (i + 1) * 10 }),
    );
    log(`Check-list par défaut créée (${CHECKLIST_DEFAUT.length} items).`);
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
