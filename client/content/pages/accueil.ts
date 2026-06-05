import { images } from '../images';

export const contenuAccueil = {
  intro: {
    eyebrow: 'Qui est Roxan Turcotte',
    titre: 'La rigueur du bâtisseur, l’écoute du courtier.',
    paragraphes: [
      'Pendant 23 ans, j’ai construit, rénové et lu des bâtiments dans tous leurs détails. Aujourd’hui, je mets cette expertise au service de votre projet immobilier : une lecture honnête de chaque propriété et une stratégie de mise en marché professionnelle.',
      'Du premier appel à la signature chez le notaire, vous êtes accompagné par quelqu’un qui défend vos intérêts — chez Royal LePage Centre, à Trois-Rivières et partout en Mauricie.',
    ],
    image: images.apropos.construction,
    cta: { libelle: 'Découvrir mon parcours', href: '/a-propos' },
  },

  typesProprietes: {
    eyebrow: 'Vos projets',
    titre: 'Un service pour chaque type de projet.',
    description:
      'Vendre, acheter, investir ou construire : à chaque besoin son accompagnement, avec des photos et des explications claires.',
    items: [
      { titre: 'Vendre ma maison', texte: 'Évaluation juste et mise en marché professionnelle pour vendre au bon prix.', image: images.proprietes.residentiel, etiquette: 'Résidentiel', lien: '/vendre-ma-maison' },
      { titre: 'Acheter une maison', texte: 'Des visites avec un œil de bâtisseur et une négociation à votre service.', image: images.proprietes.interieur, etiquette: 'Achat', lien: '/acheter-une-maison' },
      { titre: 'Investissement', texte: 'Lecture de la rentabilité et de l’état réel d’un immeuble à revenus.', image: images.proprietes.investissement, etiquette: 'Revenus', lien: '/services/investissement-immobilier' },
      { titre: 'Immobilier commercial', texte: 'Bureaux, locaux et immeubles mixtes, en toute discrétion.', image: images.proprietes.commercial, etiquette: 'Commercial', lien: '/services/commercial' },
      { titre: 'Construction neuve', texte: '23 ans de chantier pour lire un plan et anticiper les travaux.', image: images.proprietes.neuf, etiquette: 'Expertise', lien: '/a-propos' },
      { titre: 'Service sur mesure', texte: 'Un accompagnement adapté à votre situation, sans modèle imposé.', image: images.proprietes.surMesure, etiquette: 'Sur mesure', lien: '/contact' },
    ],
  },

  activites: {
    eyebrow: 'Trois façons d’avancer',
    titre: 'Royal LePage, Sunset et les chalets.',
    description:
      'Au-delà du courtage résidentiel, j’accompagne aussi les projets dans le Sud (Sunset) et les chalets en location courte durée.',
  },

  outils: {
    eyebrow: 'Outils gratuits',
    titre: 'Préparez votre projet, dès maintenant.',
    description:
      'Des calculateurs et des guides clairs — et, à côté de chaque outil, les bonnes personnes pour vous aider.',
    cartes: [
      {
        titre: 'Calculateurs',
        texte: 'Versements hypothécaires, taxe de bienvenue, taxes municipales, frais d’acquisition.',
        bouton: { libelle: 'Ouvrir les calculateurs', href: '/calculateurs' },
      },
      {
        titre: 'Guides pratiques',
        texte: 'Guide de l’acheteur, du vendeur, home staging, investisseur — à télécharger.',
        bouton: { libelle: 'Voir les guides', href: '/guides' },
      },
    ],
  },

  distinctions: {
    eyebrow: 'Reconnaissances',
    titre: 'Un parcours salué par le réseau Royal LePage.',
    items: [
      { badge: 'top10' as const, legende: 'Top 10 % National Royal LePage 2025 — parmi les courtiers les plus performants du réseau.' },
      { badge: 'platine' as const, legende: 'Prix Platine du Directeur 2025 — qualité de service et engagement professionnel.' },
    ],
  },

  temoignages: {
    eyebrow: 'Témoignages',
    titre: 'Ce que vivent les clients.',
    items: [
      {
        citation: 'Roxan a vendu notre maison plus rapidement que prévu, au prix demandé. Sa lecture du marché et son sens de la stratégie ont fait toute la différence.',
        auteur: 'Sylvie et Pierre — Trois-Rivières',
      },
      {
        citation: 'Pour notre premier achat, il a su nous rassurer, nous expliquer chaque étape et défendre nos intérêts dans la négociation.',
        auteur: 'Jonathan et Émilie — Bécancour',
      },
      {
        citation: 'Son expertise en construction est précieuse. Il voit les détails que les autres manquent.',
        auteur: 'Marc — investisseur immobilier',
      },
    ],
  },

  plusLoin: {
    eyebrow: 'Pour aller plus loin',
    titre: 'Faire affaire avec Roxan.',
    description: 'Choisissez le point de départ qui vous ressemble. Je vous reviens rapidement, en toute confidentialité.',
    cartes: [
      { titre: 'Vendre ou acheter', texte: 'Courtage résidentiel chez Royal LePage Centre.', bouton: { libelle: 'Parler de mon projet', href: '/contact' } },
      { titre: 'Une propriété au Sud', texte: 'Résidence secondaire, retraite ou investissement avec Sunset.', bouton: { libelle: 'Explorer Sunset', href: '/services/sunset' } },
      { titre: 'Un chalet rentable', texte: 'Acquisition et location courte durée de type Airbnb.', bouton: { libelle: 'Évaluer un chalet', href: '/services/chalets' } },
    ],
  },

  cta: {
    titre: 'Parlons de votre projet.',
    sousTitre: 'Un appel, une visite, une analyse personnalisée. Sans engagement, en toute confidentialité.',
    bouton: { libelle: 'Prendre contact', href: '/contact' },
  },
};
