// Référence : kvCORE-Lead-Import-French.xlsx, kvcore_import_template!A1:AK1.
// Garder les intitulés et l'ordre du modèle; les champs non collectés restent vides.
export const colonnesKvcore = [
  'first_name', 'last_name', 'email', 'status', 'hashtags', 'cell_phone_1',
  'deal_type', 'assigned agent', 'home_phone', 'lang', 'consent_type',
  'consent_date', 'email_optin', 'text_on', 'phone_on', 'primary_address',
  'primary_city', 'primary_state', 'primary_zip', 'last_closing_date',
  'spouse_first_name', 'spouse_last_name', 'spouse_email', 'spouse_phone',
  'area', 'price', 'min_sqft', 'max_sqft', 'min_year', 'max_year',
  'min_acres', 'max_acres', 'beds', 'baths', 'type', 'agent_notes', 'birthday',
].map((titre) => ({ cle: titre, titre }));

const statuts = {
  nouveau: 'new lead',
  contacte: 'active lead',
  qualifie: 'active lead',
  client: 'client',
  perdu: 'archive',
  archive: 'archive',
};

function formaterDate(valeur) {
  const date = String(valeur ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  const horodatage = Date.parse(date);
  return !Number.isNaN(horodatage) && new Date(horodatage).toISOString().slice(0, 10) === date ? date : '';
}

export function preparerLeadKvcore(lead, agent = '') {
  const etiquettes = JSON.parse(lead.etiquettes_export ?? '[]');
  const hashtags = [...new Set(etiquettes.map((nom) =>
    nom.trim().replace(/#/g, '').replace(/[\s|]+/g, '-'),
  ).filter(Boolean))].join('|');
  const types = [];
  if (etiquettes.includes('achat') || etiquettes.includes('guide-acheteur')) types.push('buyer');
  if (etiquettes.includes('vente') || etiquettes.includes('guide-vendeur')) types.push('seller');
  if (lead.page_origine === '/location-chalet') types.push('renter');

  // Le consentement à la collecte ne constitue pas un opt-in aux communications.
  // Une désinscription actuelle prime sur la case cochée lors de la soumission.
  const accepteCourriels = (lead.consentement_infolettre === 1 || lead.consentement_infolettre === true) &&
    lead.infolettre_desinscrit !== 1 && !['desinscription', 'loi25'].includes(lead.type_formulaire);
  const notes = [
    lead.message && `Message : ${lead.message}`,
    lead.notes_internes && `Notes internes : ${lead.notes_internes}`,
    lead.type_formulaire && `Formulaire : ${lead.type_formulaire}`,
    lead.source_entite && `Entité : ${lead.source_entite}`,
    lead.page_origine && `Page d'origine : ${lead.page_origine}`,
    lead.statut && `Statut du site : ${lead.statut}`,
    lead.cree_le && `Reçu le : ${lead.cree_le}`,
  ].filter(Boolean).join('\n');

  return {
    first_name: lead.prenom,
    last_name: lead.nom,
    email: lead.courriel,
    status: lead.archive ? 'archive' : (Object.hasOwn(statuts, lead.statut) ? statuts[lead.statut] : 'prospect'),
    hashtags,
    cell_phone_1: lead.telephone ?? '',
    deal_type: types.join('|'),
    'assigned agent': agent,
    lang: 'rlp',
    consent_type: accepteCourriels ? 'express' : '',
    consent_date: accepteCourriels ? formaterDate(lead.consentement_horodatage) : '',
    email_optin: accepteCourriels ? 1 : 0,
    // Aucune autorisation distincte de SMS ou d'appels n'est collectée sur le site.
    text_on: 0,
    phone_on: 0,
    agent_notes: notes,
  };
}
