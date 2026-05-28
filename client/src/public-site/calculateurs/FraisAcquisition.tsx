import { useMemo } from 'react';
import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { MentionLegaleCalc } from './MentionLegaleCalc';
import { dollarsArrondis, fourchette } from '@/lib/format';
import municipalitiesData from '@content/municipalities.json';

type Fourchette = { min: number; max: number };

const labels: Record<string, string> = {
  notaire: 'Honoraires de notaire',
  inspectionPrachat: 'Inspection préachat',
  ajustementsNotaire: 'Ajustements chez le notaire',
  evaluationFinanciere: 'Évaluation financière',
  fraisDivers: 'Frais divers',
};

export default function CalculateurFraisAcquisition() {
  const sources = municipalitiesData.fraisAcquisition as Record<string, Fourchette>;

  const totaux = useMemo(() => {
    const min = Object.values(sources).reduce((a, b) => a + b.min, 0);
    const max = Object.values(sources).reduce((a, b) => a + b.max, 0);
    return { min, max };
  }, [sources]);

  return (
    <>
      <PageHead
        titre="Calculateur de frais d'acquisition"
        description="Estimez globalement les frais d'acquisition à prévoir le jour de la signature : notaire, inspection, ajustements chez le notaire, et plus, sous forme de fourchettes."
        cheminCanonique="/calculateurs/frais-acquisition"
        schema={schemaAgent}
      />

      <Section variante="noir">
        <TitreSection
          eyebrow="Calculateur"
          titre="Frais d'acquisition"
          description="Estimation par fourchettes des principaux frais à prévoir le jour de la signature. Les montants varient selon le notaire, l'inspecteur et la propriété."
        />

        <div className="rt-calc">
          <div className="rt-calc__panneau">
            <p style={{ marginBottom: '1rem' }}>
              Ce calculateur affiche des <strong>fourchettes</strong> plutôt que des montants fixes, car les coûts
              varient d'un dossier à l'autre. Les fourchettes affichées ci-dessous sont fournies par défaut et seront
              ajustées avec les valeurs fournies par votre courtier.
            </p>
            <span className="rt-mention-provisoire">Données provisoires à valider</span>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
              {Object.entries(sources).map(([cle, f]) => (
                <li key={cle} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--rt-ligne)' }}>
                  <span>{labels[cle] ?? cle}</span>
                  <span className="rt-calc__fourchette">
                    {dollarsArrondis(f.min)} <span className="sep">à</span> {dollarsArrondis(f.max)}
                  </span>
                </li>
              ))}
            </ul>
            <MentionLegaleCalc />
          </div>

          <div className="rt-calc__resultat" aria-live="polite">
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Total estimé (fourchette)</span>
              <span className="rt-calc__fourchette rt-calc__valeur--mise-en-avant">
                {fourchette(totaux.min, totaux.max)}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem' }}>
              Ces frais s'ajoutent à la mise de fonds et ne sont pas inclus dans le prêt hypothécaire. Prévoyez-les
              en liquidités disponibles le jour de la signature.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
