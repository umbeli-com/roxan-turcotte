// Helpers partagés pour les blocs « services pour vous aider » et « pour aller
// plus loin / faire affaire avec Roxan », réutilisés sur les pages outils,
// guides et activités.

import { servicesParSlug } from './services';

export type ServiceAide = { titre: string; texte: string; href: string };

// Convertit une liste de slugs de services en items affichables.
export function servicesAide(slugs: string[]): ServiceAide[] {
  return slugs
    .map((s) => servicesParSlug[s])
    .filter(Boolean)
    .map((s) => ({ titre: s.titre, texte: s.resume, href: s.route }));
}

export type CartePlusLoin = { titre: string; texte: string; bouton: { libelle: string; href: string } };

// Bloc « faire affaire avec Roxan » par défaut (les 3 activités).
export const cartesPlusLoinDefaut: CartePlusLoin[] = [
  { titre: 'Vendre ou acheter', texte: 'Courtage résidentiel chez Royal LePage Centre.', bouton: { libelle: 'Parler de mon projet', href: '/contact' } },
  { titre: 'Une propriété au Sud', texte: 'Résidence secondaire, retraite ou investissement avec Sunset.', bouton: { libelle: 'Explorer Sunset', href: '/services/sunset' } },
  { titre: 'Un chalet rentable', texte: 'Acquisition et location courte durée de type Airbnb.', bouton: { libelle: 'Évaluer un chalet', href: '/services/chalets' } },
];
