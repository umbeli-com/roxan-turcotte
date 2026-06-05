// Les 3 activités principales de Roxan, mises en avant dans le slider plein
// écran de l'accueil. Royal LePage (courtage) est l'activité phare et l'état
// par défaut ; Sunset (Sud) et Chalets/Airbnb sont les activités secondaires.
//
// Chaque activité pilote : le fond plein écran, le logo, les accréditations et
// le call-to-action — qui changent quand on bascule d'une activité à l'autre.

import { marque } from './marque';
import { images, type Photo } from './images';

export type CtaActivite = {
  libelle: string;
  href: string;
  variante: 'primaire' | 'sur-sombre';
};

export type BadgeActivite = { chemin: string; alt: string };

export type Activite = {
  slug: string;
  entite: string;
  surtitre: string;
  titre: string;
  accroche: string;
  logo: { chemin: string; alt: string };
  image: Photo;   // fond plein écran
  apercu: Photo;  // vignette du rectangle quand l'activité n'est pas active
  route: string;  // page dédiée (bouton « Découvrir » du rectangle)
  accent: string; // couleur d'accent (indicateur actif)
  badges: BadgeActivite[]; // vraies images d'accréditation (ex. Royal LePage)
  ctas: CtaActivite[];
};

// Lien Airbnb : constante éditable. Tant qu'elle est vide, on retombe sur le
// formulaire de contact de l'activité chalets (tagué « chalet »).
const lienAirbnb = marque.liens.airbnb || '/services/chalets#formulaire';
const airbnbConfigure = Boolean(marque.liens.airbnb);

export const activitesAccueil: Activite[] = [
  {
    slug: 'royal-lepage',
    entite: 'Royal LePage Centre',
    surtitre: 'Courtier immobilier résidentiel et commercial',
    titre: 'Vendre et acheter en toute confiance',
    accroche:
      'Votre projet immobilier à Trois-Rivières et en Mauricie, mené par un courtier qui lit chaque propriété avec 23 ans d’expérience en construction neuve.',
    logo: { chemin: marque.logos.royalLepage, alt: 'Royal LePage Centre' },
    image: images.heros.royalLepage,
    apercu: images.activites.royalLepage,
    route: '/services/courtier-immobilier',
    accent: '#C8A24A',
    badges: [
      { chemin: marque.badges.top10Blanc, alt: 'Top 10 % National Royal LePage 2025' },
      { chemin: marque.badges.platineBlanc, alt: 'Prix Platine du Directeur 2025' },
    ],
    ctas: [
      { libelle: 'Faire évaluer ma maison', href: '/vendre-ma-maison', variante: 'primaire' },
      { libelle: 'Découvrir mes services', href: '/services/courtier-immobilier', variante: 'sur-sombre' },
    ],
  },
  {
    slug: 'sunset',
    entite: 'Sunset · Immobilier dans le Sud',
    surtitre: 'Résidence secondaire, retraite, investissement au soleil',
    titre: 'Une propriété au soleil, sans tracas',
    accroche:
      'Recherche personnalisée, vérifications et coordination locale pour acheter dans le Sud en toute sérénité — sans déplacement inutile.',
    logo: { chemin: marque.logos.sunset, alt: 'Sunset Real Estate' },
    image: images.heros.sunset,
    apercu: images.activites.sunset,
    route: '/services/sunset',
    accent: '#F0A45A',
    badges: [],
    ctas: [
      { libelle: 'Parler de mon projet au Sud', href: '/services/sunset#formulaire', variante: 'primaire' },
      { libelle: 'Explorer Sunset', href: '/services/sunset', variante: 'sur-sombre' },
    ],
  },
  {
    slug: 'chalets-airbnb',
    entite: 'Chalets & Airbnb',
    surtitre: 'Acquisition et location courte durée en Mauricie',
    titre: 'Un chalet qui travaille pour vous',
    accroche:
      'Analyse de rentabilité, lecture des règlements municipaux et repérage des chalets les plus performants pour la location de type Airbnb.',
    logo: { chemin: marque.logos.chaletsAirbnb, alt: 'Chalets & Airbnb' },
    image: images.heros.chalets,
    apercu: images.activites.chalets,
    route: lienAirbnb,
    accent: '#3C5444',
    badges: [],
    ctas: [
      {
        libelle: airbnbConfigure ? 'Voir mes locations (Airbnb)' : 'Évaluer un projet de chalet',
        href: lienAirbnb,
        variante: 'primaire',
      },
      { libelle: 'Parler à Roxan', href: '/services/chalets#formulaire', variante: 'sur-sombre' },
    ],
  },
];
