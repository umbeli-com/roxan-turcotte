// Navigation publique. Les entrées « Services », « Guides » et « Calculateurs »
// portent des `enfants` rendus en méga-menu déroulant (au survol et au clavier),
// avec un court descriptif, pour que l'information soit visible sans cliquer.

import guidesContent from './guides.json';
import { calculateurs } from './calculateurs';

export type EntreeNav = {
  libelle: string;
  href: string;
  description?: string;
  enfants?: EntreeNav[];
};

const enfantsGuides: EntreeNav[] = guidesContent.guides.map((g) => ({
  libelle: g.titre,
  href: `/guides/${g.slug}`,
  description: g.sousTitre,
}));

const enfantsCalculateurs: EntreeNav[] = calculateurs.map((c) => ({
  libelle: c.titre,
  href: c.route,
  description: c.description,
}));

export const navigationPrincipale: EntreeNav[] = [
  { libelle: 'Accueil', href: '/' },
  { libelle: 'À propos', href: '/a-propos' },
  {
    libelle: 'Services',
    href: '/services/courtier-immobilier',
    enfants: [
      { libelle: 'Courtage résidentiel', href: '/services/courtier-immobilier', description: 'Vendre ou acheter une résidence à Trois-Rivières et en Mauricie.' },
      { libelle: 'Investissement immobilier', href: '/services/investissement-immobilier', description: 'Rentabilité et état réel des immeubles à revenus.' },
      { libelle: 'Immobilier commercial', href: '/services/commercial', description: 'Bureaux, locaux et immeubles mixtes, en toute discrétion.' },
      { libelle: 'Sunset — immobilier dans le Sud', href: '/services/sunset', description: 'Résidence secondaire, retraite ou investissement au soleil.' },
      { libelle: 'Chalets & Airbnb', href: '/services/chalets', description: 'Acquisition et location courte durée en Mauricie.' },
      { libelle: 'Immobilier international', href: '/services/international', description: 'Coordination avec le réseau Royal LePage à l’étranger.' },
    ],
  },
  { libelle: 'Vendre', href: '/vendre-ma-maison' },
  { libelle: 'Acheter', href: '/acheter-une-maison' },
  {
    libelle: 'Guides',
    href: '/guides',
    enfants: enfantsGuides,
  },
  {
    libelle: 'Calculateurs',
    href: '/calculateurs',
    enfants: enfantsCalculateurs,
  },
  { libelle: 'Club Privilège', href: '/club-privilege' },
  { libelle: 'Contact', href: '/contact' },
];

export const navigationPiedDePage = {
  decouvrir: [
    { libelle: 'Accueil', href: '/' },
    { libelle: 'À propos', href: '/a-propos' },
    { libelle: 'Club Privilège', href: '/club-privilege' },
    { libelle: 'Contact', href: '/contact' },
  ],
  services: [
    { libelle: 'Vendre ma maison', href: '/vendre-ma-maison' },
    { libelle: 'Acheter une maison', href: '/acheter-une-maison' },
    { libelle: 'Investissement', href: '/services/investissement-immobilier' },
    { libelle: 'Commercial', href: '/services/commercial' },
    { libelle: 'Sunset (Sud)', href: '/services/sunset' },
    { libelle: 'Chalets et Airbnb', href: '/services/chalets' },
    { libelle: 'International', href: '/services/international' },
  ],
  ressources: [
    { libelle: 'Guides', href: '/guides' },
    { libelle: 'Calculateurs', href: '/calculateurs' },
    { libelle: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
    { libelle: 'Mentions légales', href: '/mentions-legales' },
    { libelle: 'Demande Loi 25', href: '/demande-de-donnees' },
  ],
};
