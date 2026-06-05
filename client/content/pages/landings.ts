import { images } from '../images';

export const landings = {
  vendre: {
    slug: 'vendre',
    route: '/vendre-ma-maison',
    typeFormulaire: 'vente',
    etiquettes: ['vente', 'royal-lepage'],
    hero: {
      image: images.proprietes.residentiel,
      eyebrow: 'Vous pensez vendre',
      titre: 'Obtenez une stratégie de mise en marché professionnelle.',
      sousTitre: 'Vente résidentielle, Trois-Rivières et Mauricie.',
      accroche:
        'Une vraie évaluation, un vrai plan, et un courtier qui sait lire votre propriété autrement. Vous méritez mieux qu\'une simple annonce en ligne.',
      ctaPrimaire: { libelle: 'Demander une analyse', href: '#formulaire' },
      ctaSecondaire: { libelle: 'Estimer en ligne', href: '/calculateurs' },
    },
    benefices: {
      titre: 'Ce que vous obtenez en travaillant avec moi.',
      items: [
        'Évaluation rigoureuse, basée sur des comparables récents et la valeur de remplacement.',
        'Stratégie de mise en marché : photographie, visite virtuelle, mise en valeur ciblée.',
        'Lecture technique de votre propriété par un ancien entrepreneur général.',
        'Négociation au service de vos intérêts, encadrement complet jusqu\'à la signature.',
        'Communication claire à chaque étape, pas de zones d\'ombre.',
      ],
    },
    processus: {
      titre: 'Comment ça se passe.',
      etapes: [
        { titre: 'Visite et écoute', description: 'Je viens visiter, je vous écoute, je lis la propriété.' },
        { titre: 'Analyse et plan', description: 'Évaluation, comparables, plan de mise en marché et calendrier.' },
        { titre: 'Mise en marché professionnelle', description: 'Photographie, visite virtuelle, mise en valeur, qualification des acheteurs.' },
        { titre: 'Négociation et signature', description: 'Présentation des offres, négociation, suivi notarié.' },
      ],
    },
    formulaireTitre: 'Demandez votre analyse personnalisée',
    formulaireIntro:
      'Décrivez-moi brièvement votre projet de vente. Je vous reviens dans les meilleurs délais, en toute confidentialité.',
    ctaFinal: {
      titre: 'Prenez la décision avec toutes les cartes en main.',
      sousTitre: 'Un échange sans engagement, et déjà des éléments concrets pour avancer.',
      bouton: { libelle: 'Demander une analyse', href: '#formulaire' },
    },
  },
  acheter: {
    slug: 'acheter',
    route: '/acheter-une-maison',
    typeFormulaire: 'achat',
    etiquettes: ['achat', 'royal-lepage'],
    hero: {
      image: images.proprietes.interieur,
      eyebrow: 'Vous cherchez une propriété',
      titre: 'Trouvez la bonne, sans mauvaise surprise.',
      sousTitre: 'Achat résidentiel, Trois-Rivières et Mauricie.',
      accroche:
        'Une recherche ciblée, des visites éclairées par un œil de bâtisseur, et une négociation qui protège votre investissement.',
      ctaPrimaire: { libelle: 'Définir mon projet', href: '#formulaire' },
      ctaSecondaire: { libelle: 'Estimer mes versements', href: '/calculateurs/financement-hypothecaire' },
    },
    benefices: {
      titre: 'Ce que vous obtenez en travaillant avec moi.',
      items: [
        'Cadrage du projet : besoins, budget, quartiers, contraintes.',
        'Recherche active des propriétés correspondantes, parfois hors marché.',
        'Visites avec lecture technique et anticipation des travaux.',
        'Préparation et présentation d\'offres solides, négociation ferme.',
        'Coordination des inspections, du financement et du notaire.',
      ],
    },
    processus: {
      titre: 'Comment ça se passe.',
      etapes: [
        { titre: 'Cadrage du projet', description: 'Vos besoins, votre budget, vos critères. La base, posée clairement.' },
        { titre: 'Recherche et présélection', description: 'Je trouve, je trie, je vous présente l\'essentiel.' },
        { titre: 'Visites et analyses', description: 'Lecture technique, lecture financière, lecture stratégique.' },
        { titre: 'Offre, inspection, signature', description: 'On négocie, on inspecte, on signe en confiance.' },
      ],
    },
    formulaireTitre: 'Démarrez votre projet d\'achat',
    formulaireIntro:
      'Décrivez votre projet (type de propriété, quartiers, budget, échéance). Je vous reviens rapidement.',
    ctaFinal: {
      titre: 'L\'achat d\'une propriété mérite un regard expérimenté.',
      sousTitre: 'Posons les bases ensemble, et avançons à votre rythme.',
      bouton: { libelle: 'Définir mon projet', href: '#formulaire' },
    },
  },
  chalet: {
    slug: 'chalet',
    route: '/location-chalet',
    typeFormulaire: 'chalet',
    etiquettes: ['chalet', 'airbnb'],
    hero: {
      image: images.chalets.chalet,
      eyebrow: 'Chalet et location courte durée',
      titre: 'Un chalet à habiter, à louer, ou à exploiter.',
      sousTitre: 'Acquisition et stratégie de location courte durée (type Airbnb).',
      accroche:
        'Mauricie, Laurentides, Lanaudière : je connais les zones, je comprends les règlements, et je sais lire la rentabilité d\'un chalet de location.',
      ctaPrimaire: { libelle: 'Parler de mon projet', href: '#formulaire' },
      ctaSecondaire: { libelle: 'Voir le service chalets', href: '/services/chalets' },
    },
    benefices: {
      titre: 'Ce que vous obtenez en travaillant avec moi.',
      items: [
        'Analyse de la rentabilité potentielle en location courte durée.',
        'Lecture des règlements municipaux et provinciaux applicables.',
        'Repérage des chalets les plus performants dans la région.',
        'Accompagnement à l\'acquisition et à la mise en exploitation.',
      ],
    },
    processus: {
      titre: 'Comment ça se passe.',
      etapes: [
        { titre: 'Cadrage du projet', description: 'Usage personnel, location, mixte. Rentabilité visée.' },
        { titre: 'Étude de marché et règlements', description: 'Zones permises, comparables de location, encadrement légal.' },
        { titre: 'Visites et évaluation', description: 'Lecture technique, projection des coûts et des revenus.' },
        { titre: 'Acquisition et mise en marché', description: 'Négociation, signature, conseils pour bien démarrer.' },
      ],
    },
    formulaireTitre: 'Parlez-moi de votre projet de chalet',
    formulaireIntro:
      'Décrivez votre projet (achat, location, mixte), votre zone d\'intérêt et votre budget approximatif.',
    ctaFinal: {
      titre: 'Le chalet, mais sans les mauvaises surprises.',
      sousTitre: 'On cadre, on analyse, on décide en connaissance de cause.',
      bouton: { libelle: 'Parler de mon projet', href: '#formulaire' },
    },
  },
};

export type LandingContenu = (typeof landings)[keyof typeof landings];
