// Identité de marque centralisée. Toutes les valeurs visibles côté public
// passent par ce fichier (et non par la BD), afin d'être inscrites dans le HTML
// statique au build, comme exigé par la contrainte SEO.

export const marque = {
  nom: 'Roxan Turcotte, Courtier Immobilier inc.',
  nomCourt: 'Roxan Turcotte',
  profession: 'Courtier immobilier résidentiel et commercial',
  banniere: 'Royal LePage Centre',
  banniereMention: 'Agence immobilière franchisée indépendante et autonome',
  slogan: 'Passionné, ouvert sur le monde !',
  promesse: 'Vous pensez vendre votre maison ? Obtenez une stratégie de mise en marché professionnelle.',
  territoire: 'Trois-Rivières et la Mauricie',
  province: 'Québec',
  pays: 'Canada',
  domaine: 'rturcotte.ca',
  siteUrl: 'https://turcotte.umbeli.com',
  langue: 'fr-CA',
  contact: {
    courriel: 'roxan@royallepage.ca',
    telephone: '+1 819 000 0000',
    telephoneAffiche: '819 000 0000',
    adresse: 'Royal LePage Centre, Trois-Rivières (Québec)',
    region: 'Mauricie',
    fuseau: 'America/Toronto',
    heuresOuverture: 'Lundi au samedi, de 9 h à 19 h',
  },
  reconnaissances: [
    { titre: 'Top 10 %', mention: 'National Royal LePage 2025' },
    { titre: 'Prix Platine', mention: 'du Directeur 2025' },
    { titre: '23 ans', mention: 'Expérience construction neuve' },
    { titre: '8 ans', mention: 'Entrepreneur général' },
  ],
  // Logos et badges (chemins relatifs au dossier public, résolus via lib/asset).
  logos: {
    lion: 'logo-roxan-lion.png',
    royalLepage: 'marque/royal-lepage-couleur.png',
    royalLepageBlanc: 'marque/royal-lepage-blanc.png',
    sunset: 'marque/sunset.webp',
    chaletsAirbnb: 'marque/airbnb.png',
    airbnb: 'marque/airbnb.png',
  },
  // Portrait détouré (fond transparent) de Roxan — présent sur le hero, la
  // page contact, l'à-propos, etc. « C'est toujours lui ».
  portrait: 'marque/roxan.png',
  badges: {
    top10: 'marque/top10-noir.png',
    top10Blanc: 'marque/top10-blanc.png',
    platine: 'marque/platine-couleur.png',
    platineBlanc: 'marque/platine-blanc.png',
  },
  // Liens externes. Airbnb : placeholder éditable — laisser vide tant que
  // l'URL réelle n'est pas fournie (le bouton retombe alors sur le formulaire).
  liens: {
    airbnb: '',
  },
  reseaux: {
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    linkedin: 'https://www.linkedin.com',
  },
};

export type Marque = typeof marque;
