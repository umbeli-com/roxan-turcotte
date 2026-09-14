import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';

// Base jetable : aucune lecture ou écriture dans la base du projet.
const repertoire = mkdtempSync(join(tmpdir(), 'turcotte-export-test-'));
process.env.DATABASE_PATH = join(repertoire, 'test.sqlite');
process.env.SESSION_SECRET = 'session-reservee-aux-tests-export';
process.env.NODE_ENV = 'test';
// Cette suite enchaîne plus de requêtes que la limite publique par défaut.
process.env.RATE_LIMIT_MAX = '1000';
let db, serveur, base, cookie, leadId;

before(async () => {
  // Les repositories préparent leurs requêtes au chargement : migrer avant de les importer.
  const { appliquerMigrations } = await import('../src/db/migrate.js');
  appliquerMigrations();
  ({ db } = await import('../src/db/connection.js'));
  const { creerLead, modifier, archiver } = await import('../src/db/repositories/leads.js');
  const { newsletterRepo } = await import('../src/db/repositories/newsletter.js');
  const { exportProfilesRepo } = await import('../src/db/repositories/divers.js');
  const { creerApp } = await import('../src/app.js');
  const { signerSession } = await import('../src/middleware/auth.js');
  const lead = creerLead({
    prenom: 'Éloïse', nom: 'Lévesque', courriel: 'eloise@example.test',
    telephone: '8195550101', type_formulaire: 'contact', source_entite: 'royal-lepage',
    consentement: true, consentement_infolettre: true,
    consentement_horodatage: '2026-09-14T23:59:59Z',
  }, ['achat', 'royal-lepage']);
  leadId = lead.id;
  modifier(lead.id, { cree_le: '2026-09-14 23:59:59' });
  newsletterRepo.inscrire({ courriel: 'ELOISE@example.test' });
  newsletterRepo.desinscrireParCourriel('ELOISE@example.test');
  const autre = creerLead({ prenom: 'Autre', nom: 'Entité', courriel: 'autre@example.test', type_formulaire: 'contact', source_entite: 'sunset' }, ['achat']);
  modifier(autre.id, { cree_le: '2026-09-14T22:00:00Z' });
  const lendemain = creerLead({ prenom: 'Hors', nom: 'Période', courriel: 'hors@example.test', type_formulaire: 'contact', source_entite: 'royal-lepage' }, ['achat']);
  modifier(lendemain.id, { cree_le: '2026-09-15 00:00:00' });
  const archive = creerLead({ prenom: 'Contact', nom: 'Archivé', courriel: 'archive@example.test', type_formulaire: 'contact' });
  archiver(archive.id);
  exportProfilesRepo.creer({ nom: 'personnalise', colonnes: [{ cle: 'courriel', titre: 'Adresse' }], separateur: ';' });
  cookie = `rt_session=${signerSession({ id: 1, nom: 'test', role: 'admin' })}`;
  serveur = creerApp().listen(0, '127.0.0.1');
  await once(serveur, 'listening');
  base = `http://127.0.0.1:${serveur.address().port}/api/admin`;
});

after(async () => {
  if (serveur) await new Promise((resolve, reject) => serveur.close((erreur) => erreur ? reject(erreur) : resolve()));
  db?.close();
  rmSync(repertoire, { recursive: true, force: true });
});

function requete(chemin) {
  return fetch(`${base}${chemin}`, { headers: { Cookie: cookie } });
}

test('protège le téléchargement et laisse les fiches de contacts accessibles', async () => {
  assert.equal((await fetch(`${base}/leads/export?profil=kvcore`)).status, 401);
  const detail = await requete(`/leads/${leadId}`);
  assert.equal(detail.status, 200);
  assert.equal((await detail.json()).lead.prenom, 'Éloïse');
});

test('télécharge le vrai CSV kvCORE avec filtres combinés et désinscription actuelle', async () => {
  const reponse = await requete('/leads/export?profil=kvcore&sourceEntite=royal-lepage&etiquette=achat&statut=nouveau&depuis=2026-09-14&jusqu=2026-09-14&agent=courtier%40example.test&separateur=%3B');
  assert.equal(reponse.status, 200);
  assert.match(reponse.headers.get('content-type'), /^text\/csv/);
  assert.match(reponse.headers.get('content-disposition'), /leads-kvcore.csv/);
  const octets = Buffer.from(await reponse.arrayBuffer());
  assert.deepEqual([...octets.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
  const csv = octets.toString('utf8');
  assert.match(csv, /Éloïse,Lévesque,eloise@example.test,new lead,achat\|royal-lepage,8195550101,buyer,courtier@example.test,,rlp,,,0,0,0,/);
  assert.doesNotMatch(csv, /autre@example.test|hors@example.test|archive@example.test/);
  assert.match(csv, /Reçu le : 2026-09-14 23:59:59/);
  assert.ok(csv.endsWith('\r\n'));
});

test('inclut aussi les horodatages ISO dans la dernière journée', async () => {
  const reponse = await requete('/leads/export?profil=kvcore&sourceEntite=sunset&jusqu=2026-09-14');
  assert.equal(reponse.status, 200);
  assert.match(await reponse.text(), /autre@example.test/);
});

test('exporte les archives et produit uniquement les en-têtes quand aucun contact ne correspond', async () => {
  const archives = await requete('/leads/export?profil=kvcore&statut=archive');
  assert.equal(archives.status, 200);
  assert.match(await archives.text(), /Contact,Archivé,archive@example.test,archive/);
  const vide = await requete('/leads/export?profil=kvcore&etiquette=inexistante');
  assert.equal(vide.status, 200);
  assert.equal((await vide.text()).trim().split('\r\n').length, 1);
});

test('conserve le format standard et les profils enregistrés', async () => {
  const standard = await requete('/leads/export?separateur=%3B&sourceEntite=royal-lepage&jusqu=2026-09-14');
  assert.equal(standard.status, 200);
  assert.match(await standard.text(), /^Prénom;Nom;Courriel;Téléphone;Source du formulaire;Entité;Statut;Reçu le\r\nÉloïse;/);
  const personnalise = await requete('/leads/export?profil=personnalise&sourceEntite=royal-lepage&jusqu=2026-09-14');
  assert.equal(personnalise.status, 200);
  assert.equal(await personnalise.text(), 'Adresse\r\neloise@example.test\r\n');
});

test('rejette les paramètres invalides sans masquer les profils inconnus', async () => {
  for (const query of ['agent=invalide', 'depuis=2026-09-15&jusqu=2026-09-14', 'jusqu=2026-02-30', 'separateur=x', 'profil=kvcore&profil=autre']) {
    assert.equal((await requete(`/leads/export?${query}`)).status, 400, query);
  }
  assert.equal((await requete('/leads/export?profil=inconnu')).status, 404);
});
