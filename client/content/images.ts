// Banque d'images du site.
//
// ⚠️ PLACEHOLDERS : photos libres de droits Unsplash (hébergées à distance),
// choisies pour donner un vrai site immobilier riche en images. À remplacer
// par les vraies photos de Roxan quand elles seront disponibles — il suffit
// de changer le `src` (et l'`alt`) de chaque entrée ci-dessous.
//
// Toutes les URLs ont été vérifiées (HTTP 200). Le paramètre de largeur est
// adapté à l'usage (héros large, cartes moyennes) pour limiter le poids.

export type Photo = { src: string; alt: string };

const U = 'https://images.unsplash.com/photo-';
const P = '&auto=format&fit=crop&q=80';

function photo(id: string, largeur: number, alt: string): Photo {
  return { src: `${U}${id}?w=${largeur}${P}`, alt };
}

export const images = {
  // Fonds plein écran du slider d'accueil (un par activité).
  heros: {
    royalLepage: photo('1570129477492-45c003edd2be', 1920, 'Belle résidence à galerie couverte entourée d’arbres en automne'),
    sunset: photo('1505228395891-9a51e7e86bf6', 1920, 'Plage de sable blanc et eaux turquoise vue du ciel'),
    chalets: photo('1542718610-a1d656d1884c', 1920, 'Chalet en bois sur une colline baignée par la lumière du soleil couchant'),
  },

  // Aperçus d'activité (cartes / vignettes du slider).
  activites: {
    royalLepage: photo('1600596542815-ffad4c1539a9', 900, 'Maison contemporaine haut de gamme avec piscine'),
    sunset: photo('1582268611958-ebfd161ef9cf', 900, 'Villa moderne ensoleillée avec piscine dans le Sud'),
    chalets: photo('1449158743715-0a90ebb6d2d8', 900, 'Chalet en bois rond niché dans la forêt'),
  },

  // Types de propriétés / services (grille de cartes-photo).
  proprietes: {
    residentiel: photo('1570129477492-45c003edd2be', 900, 'Résidence familiale avec galerie couverte'),
    interieur: photo('1600585154340-be6161a56a0c', 900, 'Salon lumineux et chaleureux d’une maison'),
    neuf: photo('1503387762-592deb58ef4e', 900, 'Plans de construction dessinés à la main sur une table'),
    commercial: photo('1486406146926-c627a92ad1ab', 900, 'Immeuble commercial moderne en façade de verre'),
    investissement: photo('1600596542815-ffad4c1539a9', 900, 'Propriété de prestige avec piscine, potentiel d’investissement'),
    surMesure: photo('1600585154340-be6161a56a0c', 900, 'Intérieur soigné illustrant un service sur mesure'),
  },

  // « Qui est Roxan » / à-propos (pas de visage anonyme : on illustre le métier).
  apropos: {
    construction: photo('1503387762-592deb58ef4e', 1100, 'Entrepreneur dessinant des plans — 23 ans en construction neuve'),
    accompagnement: photo('1560518883-ce09059eeffa', 1100, 'Poignée de main lors d’une transaction immobilière'),
  },

  // Activité Sunset (immobilier dans le Sud).
  sunset: {
    plage: photo('1505228395891-9a51e7e86bf6', 1200, 'Plage tropicale aux eaux turquoise'),
    villa: photo('1582268611958-ebfd161ef9cf', 900, 'Villa moderne avec piscine au soleil'),
    resort: photo('1571896349842-33c89424de2d', 900, 'Piscine d’un complexe en bord de mer à la tombée du jour'),
    tropical: photo('1520250497591-112f2f40a3f4', 900, 'Complexe avec piscine et cabanas entouré de palmiers'),
  },

  // Activité Chalets / Airbnb.
  chalets: {
    chalet: photo('1542718610-a1d656d1884c', 1200, 'Chalet en bois au soleil couchant'),
    foret: photo('1449158743715-0a90ebb6d2d8', 900, 'Chalet en bois rond dans la forêt'),
    sentier: photo('1441974231531-c6227db76b6e', 900, 'Sentier forestier baigné de lumière'),
    lac: photo('1507371341162-763b5e419408', 1200, 'Forêt aux couleurs d’automne se reflétant sur un lac'),
  },

  // Territoire / Mauricie.
  territoire: photo('1507371341162-763b5e419408', 1400, 'Paysage d’automne du Québec : lac bordé d’une forêt colorée'),

  // Couvertures des guides téléchargeables (clé = slug du guide).
  guides: {
    'guide-de-lacheteur': photo('1600585154340-be6161a56a0c', 1000, 'Salon lumineux d’une propriété — guide de l’acheteur'),
    'guide-du-vendeur': photo('1570129477492-45c003edd2be', 1000, 'Belle résidence à vendre — guide du vendeur'),
    'guide-home-staging': photo('1616486338812-3dadae4b4ace', 1000, 'Intérieur mis en scène pour la vente — valorisation résidentielle'),
    'guide-investisseur': photo('1600596542815-ffad4c1539a9', 1000, 'Propriété de prestige avec piscine — guide de l’investisseur'),
  } as Record<string, Photo>,
} as const;
