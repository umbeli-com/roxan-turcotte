import { Link } from 'react-router-dom';
import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { BlocAllerPlusLoin } from '@/components/blocsAide';
import { calculateurs } from '@content/calculateurs';

export default function IndexCalculateurs() {
  return (
    <>
      <PageHead
        titre="Calculateurs immobiliers gratuits | Roxan Turcotte"
        description="Versements hypothécaires, taxe de bienvenue, taxes municipales et scolaires, frais d'acquisition : utilisez nos calculateurs gratuits pour préparer votre projet immobilier."
        cheminCanonique="/calculateurs"
        schema={schemaAgent}
      />
      <Section variante="ivoire">
        <TitreSection
          eyebrow="Calculateurs gratuits"
          titre="Préparer sa décision avec des chiffres clairs."
          description="Quatre outils simples pour estimer rapidement. Les résultats sont approximatifs et doivent être validés auprès des professionnels concernés — et à côté de chaque outil, les bonnes personnes pour vous aider."
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

      <Section variante="creme">
        <TitreSection eyebrow="Pour aller plus loin" titre="Faire affaire avec Roxan" />
        <BlocAllerPlusLoin />
      </Section>
    </>
  );
}
