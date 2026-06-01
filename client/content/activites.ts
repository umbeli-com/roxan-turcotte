// Activités mises en avant dans le slider d'accueil. Chaque carte montre un
// gros aperçu visuel et la météo en direct sur sa zone d'opération.

export type Activite = {
  slug: string;
  route: string;
  titre: string;
  entite: string;
  surtitre: string;
  accroche: string;
  ctaLibelle: string;
  // Coordonnées approximatives pour interroger Open-Meteo (sans clé d'API).
  lat: number;
  lon: number;
  villeAffichee: string;
  // Habillage visuel
  motif: 'mauricie' | 'sud' | 'foret' | 'commerce' | 'metropole';
  icone: 'maison' | 'palmier' | 'sapin' | 'immeuble' | 'globe' | 'cles';
};

export const activitesAccueil: Activite[] = [
  {
    slug: 'vendre',
    route: '/vendre-ma-maison',
    titre: 'Vendre votre résidence',
    entite: 'Royal LePage Centre',
    surtitre: 'Stratégie de mise en marché',
    accroche:
      'Une vraie évaluation, un vrai plan, et un courtier qui sait lire votre propriété autrement.',
    ctaLibelle: 'Faire évaluer ma maison',
    lat: 46.3432,
    lon: -72.5432,
    villeAffichee: 'Trois-Rivières, Mauricie',
    motif: 'mauricie',
    icone: 'maison',
  },
  {
    slug: 'acheter',
    route: '/acheter-une-maison',
    titre: 'Acheter votre prochaine maison',
    entite: 'Royal LePage Centre',
    surtitre: 'Recherche éclairée par 23 ans en construction neuve',
    accroche:
      'Cadrage du projet, visites avec œil de bâtisseur, négociation au service de vos intérêts.',
    ctaLibelle: 'Définir mon projet',
    lat: 46.3432,
    lon: -72.5432,
    villeAffichee: 'Trois-Rivières, Mauricie',
    motif: 'metropole',
    icone: 'cles',
  },
  {
    slug: 'sunset',
    route: '/services/sunset',
    titre: 'Immobilier dans le Sud',
    entite: 'Sunset',
    surtitre: 'Résidence secondaire, retraite, investissement',
    accroche:
      'Recherche personnalisée et coordination locale pour une propriété au soleil, sans déplacement inutile.',
    ctaLibelle: 'Explorer le Sud',
    lat: 18.5601,
    lon: -68.3725,
    villeAffichee: 'Punta Cana, République dominicaine',
    motif: 'sud',
    icone: 'palmier',
  },
  {
    slug: 'chalets',
    route: '/services/chalets',
    titre: 'Chalets et location courte durée',
    entite: 'Chalets et Airbnb',
    surtitre: 'Acquisition et exploitation type Airbnb',
    accroche:
      'Analyse de rentabilité, lecture des règlements municipaux, repérage des chalets les plus performants.',
    ctaLibelle: 'Évaluer un chalet',
    lat: 46.7333,
    lon: -73.05,
    villeAffichee: 'Saint-Mathieu-du-Parc, Mauricie',
    motif: 'foret',
    icone: 'sapin',
  },
  {
    slug: 'commercial',
    route: '/services/commercial',
    titre: 'Immobilier commercial',
    entite: 'Royal LePage Centre',
    surtitre: 'Bureaux, locaux, immeubles à revenus',
    accroche:
      'Connaissance des secteurs porteurs en Mauricie, discrétion et négociation au service de votre activité.',
    ctaLibelle: 'Parler en confidentialité',
    lat: 46.35,
    lon: -72.55,
    villeAffichee: 'Trois-Rivières, Mauricie',
    motif: 'commerce',
    icone: 'immeuble',
  },
  {
    slug: 'international',
    route: '/services/international',
    titre: 'Immobilier international',
    entite: 'Réseau Royal LePage',
    surtitre: 'Coordination avec un courtier local à l’étranger',
    accroche:
      'Mauricie ↔ monde : votre dossier suivi de bout en bout, en français, depuis le Québec.',
    ctaLibelle: 'Préparer mon dossier',
    lat: 48.8566,
    lon: 2.3522,
    villeAffichee: 'Paris, France',
    motif: 'metropole',
    icone: 'globe',
  },
];
