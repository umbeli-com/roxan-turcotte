import test from 'node:test';
import assert from 'node:assert/strict';
import { colonnesKvcore, preparerLeadKvcore } from '../src/services/kvcore-export.js';
import { genererCSV } from '../src/services/csv-export.js';

test('reprend les 37 en-têtes anglais du modèle, sans les exemples ni les instructions', () => {
  const enteteModele = 'first_name,last_name,email,status,hashtags,cell_phone_1,deal_type,assigned agent,home_phone,lang,consent_type,consent_date,email_optin,text_on,phone_on,primary_address,primary_city,primary_state,primary_zip,last_closing_date,spouse_first_name,spouse_last_name,spouse_email,spouse_phone,area,price,min_sqft,max_sqft,min_year,max_year,min_acres,max_acres,beds,baths,type,agent_notes,birthday';
  assert.equal(genererCSV(colonnesKvcore, []), `\uFEFF${enteteModele}\r\n`);
});

test('traduit et classe un contact en conservant ses coordonnées et son contexte', () => {
  const resultat = preparerLeadKvcore({
    prenom: 'Éloïse', nom: 'Lévesque', courriel: 'eloise@example.test',
    telephone: '+1 819 555-0101', statut: 'qualifie',
    etiquettes_export: JSON.stringify(['achat', 'vente', '#Club privilège', 'achat']),
    message: 'Maison, avec garage', notes_internes: 'Appeler lundi',
    type_formulaire: 'contact', source_entite: 'royal-lepage',
    page_origine: '/contact', cree_le: '2026-09-14 18:30:00',
  }, 'courtier@example.test');
  assert.equal(resultat.first_name, 'Éloïse');
  assert.equal(resultat.last_name, 'Lévesque');
  assert.equal(resultat.email, 'eloise@example.test');
  assert.equal(resultat.cell_phone_1, '+1 819 555-0101');
  assert.equal(resultat.status, 'active lead');
  assert.equal(resultat.hashtags, 'achat|vente|Club-privilège');
  assert.equal(resultat.deal_type, 'buyer|seller');
  assert.equal(resultat['assigned agent'], 'courtier@example.test');
  assert.equal(resultat.lang, 'rlp');
  assert.match(resultat.agent_notes, /Message : Maison, avec garage\nNotes internes : Appeler lundi/);
  assert.match(resultat.agent_notes, /Entité : royal-lepage/);
  assert.match(resultat.agent_notes, /Reçu le : 2026-09-14 18:30:00/);
  assert.equal(resultat.primary_address, undefined);
  assert.equal(resultat.price, undefined);
});

test('un consentement à la collecte ne devient pas une permission de communication', () => {
  const resultat = preparerLeadKvcore({ consentement: 1, consentement_horodatage: '2026-09-14T19:00:00Z' });
  assert.deepEqual([resultat.email_optin, resultat.text_on, resultat.phone_on], [0, 0, 0]);
  assert.equal(resultat.consent_type, '');
  assert.equal(resultat.consent_date, '');
});

test('exporte un opt-in explicite et sa date, sauf désinscription ou demande administrative', () => {
  const lead = { consentement_infolettre: 1, consentement_horodatage: '2026-09-14T19:00:00Z' };
  const resultat = preparerLeadKvcore(lead);
  assert.equal(resultat.email_optin, 1);
  assert.equal(resultat.consent_type, 'express');
  assert.equal(resultat.consent_date, '2026-09-14');
  assert.deepEqual([resultat.text_on, resultat.phone_on], [0, 0]);
  for (const exception of [{ infolettre_desinscrit: 1 }, { type_formulaire: 'desinscription' }, { type_formulaire: 'loi25' }]) {
    const sansOptin = preparerLeadKvcore({ ...lead, ...exception });
    assert.equal(sansOptin.email_optin, 0);
    assert.equal(sansOptin.consent_type, '');
    assert.equal(sansOptin.consent_date, '');
  }
  assert.equal(preparerLeadKvcore({ ...lead, consentement_horodatage: null }).consent_date, '');
  assert.equal(preparerLeadKvcore({ ...lead, consentement_horodatage: '2026-02-30' }).consent_date, '');
});

test('préserve la distinction client/transaction fermée et reconnaît les contacts archivés', () => {
  assert.equal(preparerLeadKvcore({ statut: 'nouveau' }).status, 'new lead');
  assert.equal(preparerLeadKvcore({ statut: 'contacte' }).status, 'active lead');
  assert.equal(preparerLeadKvcore({ statut: 'client' }).status, 'client');
  assert.equal(preparerLeadKvcore({ statut: 'perdu' }).status, 'archive');
  assert.equal(preparerLeadKvcore({ statut: 'nouveau', archive: 1 }).status, 'archive');
  assert.equal(preparerLeadKvcore({ page_origine: '/location-chalet' }).deal_type, 'renter');
  assert.equal(preparerLeadKvcore({ etiquettes_export: '["chalet"]' }).deal_type, '');
});

test('échappe les accents, guillemets, séparateurs et retours à la ligne sans décaler les champs', () => {
  const colonnes = [{ cle: 'nom', titre: 'Nom' }, { cle: 'notes', titre: 'Notes' }, { cle: 'vide', titre: 'Vide' }];
  assert.equal(genererCSV(colonnes, [{ nom: 'Éloïse, Lévesque', notes: 'Un "garage"\rDeuxième ligne' }]),
    '\uFEFFNom,Notes,Vide\r\n"Éloïse, Lévesque","Un ""garage""\rDeuxième ligne",\r\n');
  assert.equal(genererCSV(colonnes, [{ nom: 'Éloïse; Lévesque', notes: 'Oui\nNon' }], ';'),
    '\uFEFFNom;Notes;Vide\r\n"Éloïse; Lévesque";"Oui\nNon";\r\n');
});
