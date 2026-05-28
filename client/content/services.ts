// Définition centralisée des services. Sert à la fois aux pages de service
// (génération SSG) et aux cartes de l'accueil.

export type Service = {
  slug: string;
  route: string;
  titre: string;
  entite: string;
  etiquettes: string[];
  resume: string;
  description: string;
  priorite: 'principale' | 'secondaire' | 'standard';
  benefices: string[];
  processus: { titre: string; description: string }[];
  ctaTitre: string;
  ctaSousTitre: string;
};

export const services: Service[] = [
  {
    slug: 'courtier-immobilier',
    route: '/services/courtier-immobilier',
    titre: 'Courtage immobilier résidentiel',
    entite: 'Royal LePage Centre',
    etiquettes: ['royal-lepage', 'immobilier'],
    priorite: 'principale',
    resume:
      'Accompagnement complet à la vente et à l\'achat d\'une résidence dans la grande région de Trois-Rivières.',
    description:
      'Mon expertise en construction neuve et mes 23 années dans le bâtiment me permettent de lire chaque propriété autrement. Évaluation rigoureuse, stratégie de mise en marché professionnelle, négociation tenace et suivi méticuleux jusqu\'à la signature chez le notaire.',
    benefices: [
      'Évaluation de marché basée sur des comparables récents et la valeur de remplacement.',
      'Stratégie de mise en marché professionnelle : photographie, visite virtuelle, marketing ciblé.',
      'Lecture technique de la propriété grâce à 23 ans d\'expérience en construction neuve.',
      'Négociation au service de vos intérêts, encadrement complet jusqu\'à la signature.',
    ],
    processus: [
      { titre: 'Rencontre stratégique', description: 'Visite, écoute de vos objectifs, lecture de la propriété et de son potentiel.' },
      { titre: 'Évaluation et plan d\'action', description: 'Analyse des comparables, plan de mise en marché, calendrier proposé.' },
      { titre: 'Mise en marché professionnelle', description: 'Photographie, visite virtuelle, mise en valeur en ligne et hors ligne, qualification des acheteurs.' },
      { titre: 'Négociation et accompagnement', description: 'Présentation des offres, négociation, suivi des conditions, accompagnement notarié.' },
    ],
    ctaTitre: 'Prêt à parler de votre projet ?',
    ctaSousTitre: 'Obtenez une analyse personnalisée de votre situation, sans engagement.',
  },
  {
    slug: 'investissement-immobilier',
    route: '/services/investissement-immobilier',
    titre: 'Investissement immobilier',
    entite: 'Royal LePage Centre',
    etiquettes: ['investissement'],
    priorite: 'standard',
    resume:
      'Lecture de la rentabilité, du potentiel de plus-value et des risques d\'un immeuble locatif.',
    description:
      'Un investisseur a besoin de chiffres clairs et d\'un regard expérimenté sur l\'état réel des bâtiments. J\'apporte les deux : analyse de la rentabilité, évaluation de l\'état du bien, projection des travaux à prévoir, et stratégie d\'acquisition adaptée à votre profil.',
    benefices: [
      'Analyse de rentabilité (revenus, dépenses, flux de trésorerie, taux de capitalisation).',
      'Évaluation technique des bâtiments par un ancien entrepreneur général.',
      'Repérage des opportunités hors marché et de plus-value latente.',
      'Stratégie d\'acquisition et de financement adaptée à votre profil.',
    ],
    processus: [
      { titre: 'Cadrage de votre stratégie', description: 'Objectifs de rendement, horizon, tolérance au risque, contraintes fiscales.' },
      { titre: 'Sourcing et préqualification', description: 'Repérage des immeubles pertinents, première analyse, présélection.' },
      { titre: 'Évaluation approfondie', description: 'Visite, lecture technique, analyse financière, étude de marché locatif.' },
      { titre: 'Négociation et fermeture', description: 'Stratégie d\'offre, négociation, accompagnement jusqu\'à la signature.' },
    ],
    ctaTitre: 'Vous évaluez un immeuble ?',
    ctaSousTitre: 'Je vous fournis une lecture technique et financière de la propriété.',
  },
  {
    slug: 'commercial',
    route: '/services/commercial',
    titre: 'Immobilier commercial',
    entite: 'Royal LePage Centre',
    etiquettes: ['commercial'],
    priorite: 'standard',
    resume:
      'Vente, achat et location d\'espaces commerciaux dans la grande région de Trois-Rivières.',
    description:
      'Bureaux, locaux commerciaux, immeubles à revenus mixtes : chaque dossier commercial demande une lecture distincte. J\'accompagne propriétaires et acquéreurs avec rigueur, discrétion et un solide réseau local.',
    benefices: [
      'Connaissance des secteurs commerciaux porteurs en Mauricie.',
      'Discrétion et confidentialité tout au long du mandat.',
      'Lecture des baux, des servitudes et des contraintes municipales.',
      'Réseau étendu pour atteindre les acquéreurs qualifiés.',
    ],
    processus: [
      { titre: 'Compréhension du besoin', description: 'Activité, surface, localisation, contraintes opérationnelles et financières.' },
      { titre: 'Analyse du marché commercial', description: 'Évaluation, comparables, lecture du contexte local et règlementaire.' },
      { titre: 'Mise en marché ou recherche ciblée', description: 'Approche directe, marketing confidentiel, qualification des parties.' },
      { titre: 'Négociation et conclusion', description: 'Offre, négociation, due diligence, signature.' },
    ],
    ctaTitre: 'Un projet commercial à discuter ?',
    ctaSousTitre: 'Parlons-en en toute confidentialité.',
  },
  {
    slug: 'sunset',
    route: '/services/sunset',
    titre: 'Immobilier dans le Sud (Sunset)',
    entite: 'Sunset',
    etiquettes: ['sunset', 'immo-sud'],
    priorite: 'secondaire',
    resume:
      'Acquisition de propriétés dans le Sud : résidence secondaire, retraite, investissement.',
    description:
      'L\'activité Sunset accompagne les Québécois qui rêvent d\'une propriété au soleil : résidence secondaire, lieu de retraite, propriété de location. Recherche, analyse, négociation, et coordination locale, tout est pris en charge.',
    benefices: [
      'Recherche personnalisée selon votre projet de vie ou d\'investissement.',
      'Réseau local sur place pour visites, vérifications et négociation.',
      'Accompagnement sur les enjeux légaux et fiscaux propres à l\'achat à l\'étranger.',
      'Coordination logistique de A à Z, sans déplacement inutile.',
    ],
    processus: [
      { titre: 'Définition du projet', description: 'Usage, budget, localisation cible, horizon.' },
      { titre: 'Sélection des propriétés', description: 'Présélection, fiches détaillées, repérage des opportunités.' },
      { titre: 'Visites et vérifications', description: 'Visites sur place ou à distance, vérifications légales et techniques.' },
      { titre: 'Négociation et fermeture', description: 'Offre, accompagnement notarié, coordination des intervenants locaux.' },
    ],
    ctaTitre: 'Un projet au soleil ?',
    ctaSousTitre: 'Parlons de votre vision et des options possibles.',
  },
  {
    slug: 'chalets',
    route: '/services/chalets',
    titre: 'Chalets et location courte durée',
    entite: 'Chalets et Airbnb',
    etiquettes: ['chalet', 'airbnb'],
    priorite: 'secondaire',
    resume:
      'Acquisition, exploitation et gestion de chalets en location courte durée (type Airbnb).',
    description:
      'Vous cherchez un chalet à habiter, à louer en courte durée, ou à exploiter pleinement ? Je connais les particularités du marché en Mauricie, les zones les plus performantes, et les règles municipales qui encadrent la location courte durée.',
    benefices: [
      'Analyse de la rentabilité potentielle d\'un chalet en location courte durée.',
      'Lecture des règlements municipaux et provinciaux applicables.',
      'Repérage des chalets les plus performants dans la région.',
      'Accompagnement à l\'acquisition et à la mise en marché.',
    ],
    processus: [
      { titre: 'Cadrage du projet', description: 'Usage personnel, location, rentabilité visée.' },
      { titre: 'Étude de marché et règlements', description: 'Zones permises, encadrement municipal et provincial, comparables de location.' },
      { titre: 'Visites et évaluation', description: 'Lecture technique, projection des coûts et des revenus.' },
      { titre: 'Acquisition et mise en exploitation', description: 'Négociation, signature, conseils pour la mise en marché.' },
    ],
    ctaTitre: 'Un chalet en tête ?',
    ctaSousTitre: 'Parlons de votre projet et de sa rentabilité réelle.',
  },
  {
    slug: 'international',
    route: '/services/international',
    titre: 'Immobilier international',
    entite: 'Réseau Royal LePage',
    etiquettes: ['international'],
    priorite: 'standard',
    resume:
      'Acquisition ou vente à l\'international, en s\'appuyant sur le réseau Royal LePage.',
    description:
      'Vous quittez le pays, vous emménagez chez nous, ou vous explorez une opportunité à l\'étranger ? Le réseau Royal LePage est présent à l\'international. Je coordonne votre dossier avec les bons interlocuteurs, pour que votre projet ne soit jamais laissé au hasard.',
    benefices: [
      'Coordination avec des courtiers fiables à l\'étranger.',
      'Suivi du dossier de bout en bout, depuis le Québec.',
      'Compréhension des particularités fiscales et légales transfrontalières.',
      'Communication claire, en français.',
    ],
    processus: [
      { titre: 'Compréhension du projet', description: 'Origine et destination, objectifs, contraintes spécifiques.' },
      { titre: 'Mise en relation', description: 'Sélection d\'un partenaire local compétent.' },
      { titre: 'Coordination du dossier', description: 'Suivi des étapes, traduction et clarification au besoin.' },
      { titre: 'Conclusion', description: 'Accompagnement jusqu\'à la signature et au-delà.' },
    ],
    ctaTitre: 'Un projet international ?',
    ctaSousTitre: 'Discutons-en avec vous, en français, depuis le Québec.',
  },
];

export const servicesParSlug = Object.fromEntries(services.map((s) => [s.slug, s])) as Record<string, Service>;
