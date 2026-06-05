// Profils « personnes à contacter » affichés sur les pages outils / guides /
// activités. Cliquer une personne ouvre le formulaire pré-rempli avec elle.
//
// Données PUBLIQUES uniquement (pas de courriel ici : l'adresse à qui le lead
// est transféré est gérée côté serveur, dans la table `partenaires`, par
// l'administrateur). Le `slug` fait le lien entre les deux.
//
// `photo` est optionnelle : à défaut, on affiche un médaillon avec les
// initiales. L'administrateur pourra fournir les vraies photos plus tard.

export type Profil = {
  slug: string;
  nom: string;
  role: string;
  description: string;
  entite: string;       // royal-lepage | sunset | chalets | partenaire
  tag: string;          // étiquette CRM appliquée au lead
  photo?: string;
};

export const profils: Profil[] = [
  {
    slug: 'roxan-turcotte',
    nom: 'Roxan Turcotte',
    role: 'Courtier immobilier · Royal LePage Centre',
    description:
      'Votre courtier pour la vente, l’achat et l’investissement à Trois-Rivières et en Mauricie. 23 ans d’expertise en construction neuve.',
    entite: 'royal-lepage',
    tag: 'royal-lepage',
  },
  {
    slug: 'roxan-sunset',
    nom: 'Roxan Turcotte',
    role: 'Sunset · Immobilier dans le Sud',
    description:
      'Pour vos projets de propriété au soleil : résidence secondaire, retraite ou investissement, avec coordination locale.',
    entite: 'sunset',
    tag: 'sunset',
  },
  {
    slug: 'roxan-chalets',
    nom: 'Roxan Turcotte',
    role: 'Chalets & Airbnb',
    description:
      'Pour acquérir et exploiter un chalet en location courte durée : rentabilité, règlements et repérage.',
    entite: 'chalets',
    tag: 'chalet',
  },
  {
    slug: 'courtier-hypothecaire',
    nom: 'Courtier hypothécaire partenaire',
    role: 'Financement hypothécaire',
    description:
      'Pour comparer les meilleurs taux et structurer votre financement, sans frais pour vous dans la plupart des cas.',
    entite: 'partenaire',
    tag: 'reference-partenaire',
  },
  {
    slug: 'notaire',
    nom: 'Notaire partenaire',
    role: 'Acte de vente · vérification des titres',
    description:
      'Pour l’acte notarié, la vérification des titres et la signature, en toute sécurité juridique.',
    entite: 'partenaire',
    tag: 'reference-partenaire',
  },
  {
    slug: 'inspecteur',
    nom: 'Inspecteur en bâtiment',
    role: 'Inspection préachat',
    description:
      'Pour une inspection rigoureuse avant de vous engager, et acheter en toute connaissance de cause.',
    entite: 'partenaire',
    tag: 'reference-partenaire',
  },
];

export const profilsParSlug: Record<string, Profil> = Object.fromEntries(
  profils.map((p) => [p.slug, p]),
);

// Renvoie les profils correspondant à une liste de slugs (dans l'ordre donné).
export function profilsPour(slugs: string[]): Profil[] {
  return slugs.map((s) => profilsParSlug[s]).filter(Boolean);
}
