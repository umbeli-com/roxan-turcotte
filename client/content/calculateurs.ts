// Source unique pour les calculateurs : sert à la fois à l'index, au menu
// déroulant de la navigation et aux blocs d'aide affichés sur chaque page.

export type Calculateur = {
  slug: string;
  titre: string;
  description: string;
  route: string;
  // Profils « personnes à contacter » pertinents pour cet outil.
  profils: string[];
  // Services de Roxan qui peuvent aider à côté de l'outil.
  aide: string[];
};

export const calculateurs: Calculateur[] = [
  {
    slug: 'financement-hypothecaire',
    titre: 'Versements hypothécaires',
    description: 'Calculez votre versement périodique selon le prix, la mise de fonds, le taux et l’amortissement.',
    route: '/calculateurs/financement-hypothecaire',
    profils: ['courtier-hypothecaire', 'roxan-turcotte'],
    aide: ['courtier-immobilier', 'investissement-immobilier'],
  },
  {
    slug: 'taxe-de-bienvenue',
    titre: 'Taxe de bienvenue',
    description: 'Estimez les droits de mutation immobilière selon la municipalité.',
    route: '/calculateurs/taxe-de-bienvenue',
    profils: ['notaire', 'roxan-turcotte'],
    aide: ['courtier-immobilier'],
  },
  {
    slug: 'taxes-municipales-scolaires',
    titre: 'Taxes municipales et scolaires',
    description: 'Estimez les taxes annuelles à prévoir, selon la municipalité et la valeur d’évaluation.',
    route: '/calculateurs/taxes-municipales-scolaires',
    profils: ['roxan-turcotte'],
    aide: ['courtier-immobilier'],
  },
  {
    slug: 'frais-acquisition',
    titre: 'Frais d’acquisition',
    description: 'Estimez les frais à prévoir le jour de la signature : notaire, inspection, ajustements et plus.',
    route: '/calculateurs/frais-acquisition',
    profils: ['notaire', 'inspecteur', 'roxan-turcotte'],
    aide: ['courtier-immobilier'],
  },
];

export const calculateursParSlug: Record<string, Calculateur> = Object.fromEntries(
  calculateurs.map((c) => [c.slug, c]),
);
