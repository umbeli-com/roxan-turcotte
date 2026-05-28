// Liste centralisée des entrées de navigation publique. Les sections non
// finalisées sont volontairement absentes (cf. spécification section 5.8).

export type EntreeNav = {
  libelle: string;
  href: string;
  enfants?: EntreeNav[];
};

export const navigationPrincipale: EntreeNav[] = [
  { libelle: 'Accueil', href: '/' },
  { libelle: 'À propos', href: '/a-propos' },
  {
    libelle: 'Services',
    href: '/services/courtier-immobilier',
    enfants: [
      { libelle: 'Courtage résidentiel', href: '/services/courtier-immobilier' },
      { libelle: 'Investissement immobilier', href: '/services/investissement-immobilier' },
      { libelle: 'Immobilier commercial', href: '/services/commercial' },
      { libelle: 'Immobilier dans le Sud (Sunset)', href: '/services/sunset' },
      { libelle: 'Chalets et location courte durée', href: '/services/chalets' },
      { libelle: 'Immobilier international', href: '/services/international' },
    ],
  },
  { libelle: 'Vendre', href: '/vendre-ma-maison' },
  { libelle: 'Acheter', href: '/acheter-une-maison' },
  { libelle: 'Guides', href: '/guides' },
  { libelle: 'Calculateurs', href: '/calculateurs' },
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
