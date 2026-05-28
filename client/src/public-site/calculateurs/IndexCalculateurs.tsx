import { Link } from 'react-router-dom';
import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';

const calculateurs = [
  {
    titre: 'Versements hypothécaires',
    description: 'Calculez votre versement périodique selon le prix, la mise de fonds, le taux et l\'amortissement.',
    route: '/calculateurs/financement-hypothecaire',
  },
  {
    titre: 'Taxe de bienvenue',
    description: 'Estimez les droits de mutation immobilière selon la municipalité.',
    route: '/calculateurs/taxe-de-bienvenue',
  },
  {
    titre: 'Taxes municipales et scolaires',
    description: 'Estimez les taxes annuelles à prévoir, selon la municipalité et la valeur d\'évaluation.',
    route: '/calculateurs/taxes-municipales-scolaires',
  },
  {
    titre: 'Frais d\'acquisition',
    description: 'Estimez les frais à prévoir le jour de la signature : notaire, inspection, ajustements et plus.',
    route: '/calculateurs/frais-acquisition',
  },
];

export default function IndexCalculateurs() {
  return (
    <>
      <PageHead
        titre="Calculateurs immobiliers gratuits | Roxan Turcotte"
        description="Versements hypothécaires, taxe de bienvenue, taxes municipales et scolaires, frais d'acquisition : utilisez nos calculateurs gratuits pour préparer votre projet immobilier."
        cheminCanonique="/calculateurs"
        schema={schemaAgent}
      />
      <Section variante="noir">
        <TitreSection
          eyebrow="Calculateurs gratuits"
          titre="Préparer sa décision avec des chiffres clairs."
          description="Quatre outils simples pour estimer rapidement, en respectant la nuance des fourchettes lorsque c'est pertinent. Les résultats sont approximatifs et doivent être validés auprès des professionnels concernés."
        />
        <div className="rt-grille rt-grille--2">
          {calculateurs.map((c) => (
            <Link key={c.route} to={c.route} className="rt-service-carte">
              <h3>{c.titre}</h3>
              <p>{c.description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
