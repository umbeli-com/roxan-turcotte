import { useMemo, useState } from 'react';
import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { MentionLegaleCalc } from './MentionLegaleCalc';
import { dollarsArrondis } from '@/lib/format';
import municipalitiesData from '@content/municipalities.json';
import { BlocAideOutil } from '@/components/blocsAide';
import { calculateursParSlug } from '@content/calculateurs';
import { servicesAide } from '@content/aide';
import { profilsPour } from '@content/profils';

const calc = calculateursParSlug['taxe-de-bienvenue'];

type Tranche = { plafond: number | null; taux: number };

function calculerTranches(base: number, tranches: Tranche[]): number {
  let restant = base;
  let cumul = 0;
  let total = 0;
  for (const t of tranches) {
    const plafond = t.plafond ?? Infinity;
    const largeur = plafond - cumul;
    if (largeur <= 0) continue;
    const part = Math.min(restant, largeur);
    if (part <= 0) break;
    total += part * t.taux;
    restant -= part;
    cumul = plafond;
    if (restant <= 0) break;
  }
  return total;
}

export default function CalculateurTaxeBienvenue() {
  const muns = municipalitiesData.municipalites;
  const [slug, setSlug] = useState(muns[0]?.slug ?? '');
  const [base, setBase] = useState(450000);

  const municipalite = muns.find((m) => m.slug === slug) ?? muns[0];

  const calcul = useMemo(() => {
    if (!municipalite) return { montant: 0, tranches: [] as Tranche[] };
    const tranches = (municipalite.tranchesMutation as Tranche[] | null) ?? (municipalitiesData.tranchesParDefaut as Tranche[]);
    const montant = calculerTranches(Math.max(0, base), tranches);
    return { montant, tranches };
  }, [base, municipalite]);

  return (
    <>
      <PageHead
        titre="Calculateur de taxe de bienvenue"
        description="Estimez les droits de mutation immobilière (taxe de bienvenue) par municipalité au Québec. Calcul progressif par tranches, à valider selon les barèmes en vigueur."
        cheminCanonique="/calculateurs/taxe-de-bienvenue"
        schema={schemaAgent}
      />

      <Section variante="creme">
        <TitreSection
          eyebrow="Calculateur"
          titre="Taxe de bienvenue"
          description="Estimation des droits de mutation selon la municipalité et la base d'imposition (la plus élevée entre prix de vente, contrepartie et valeur municipale uniformisée)."
        />

        <div className="rt-calc">
          <div className="rt-calc__panneau">
            <div className="rt-formulaire" style={{ background: 'transparent', border: 0, padding: 0 }}>
              <div className="rt-champ">
                <label htmlFor="mun">Municipalité</label>
                <select id="mun" value={slug} onChange={(e) => setSlug(e.target.value)}>
                  {muns.map((m) => (
                    <option key={m.slug} value={m.slug}>{m.nom}{m.provisoire ? ' (à valider)' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="rt-champ">
                <label htmlFor="base">Base d'imposition ($)</label>
                <input id="base" type="number" min={0} step={1000} value={base}
                  onChange={(e) => setBase(Number(e.target.value) || 0)} />
                <span style={{ fontSize: '0.8rem', color: 'var(--rt-gris-faible)' }}>
                  La plus élevée du prix de vente, de la contrepartie ou de la valeur municipale uniformisée.
                </span>
              </div>
            </div>
            <MentionLegaleCalc />
          </div>

          <div className="rt-calc__resultat" aria-live="polite">
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Estimation des droits de mutation</span>
              <span className="rt-calc__valeur rt-calc__valeur--mise-en-avant">{dollarsArrondis(calcul.montant)}</span>
            </div>
            <div>
              <span className="rt-calc__libelle">Tranches appliquées</span>
              <ul style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {calcul.tranches.map((t, i) => {
                  const debut = i === 0 ? 0 : (calcul.tranches[i - 1].plafond ?? 0);
                  const fin = t.plafond === null ? null : t.plafond;
                  return (
                    <li key={i}>
                      {dollarsArrondis(debut)} {fin === null ? 'et plus' : `à ${dollarsArrondis(fin)}`} :{' '}
                      {(t.taux * 100).toFixed(2)} %
                    </li>
                  );
                })}
              </ul>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--rt-gris-faible)' }}>
              Les tranches sont indexées chaque année et peuvent varier d'une municipalité à l'autre.
            </p>
          </div>
        </div>
      </Section>

      <BlocAideOutil
        aide={servicesAide(calc.aide)}
        profils={profilsPour(calc.profils)}
        typeFormulaire={`calculateur-${calc.slug}`}
        pageOrigine={calc.route}
        etiquettes={['calculateur', calc.slug]}
        sourceEntite="royal-lepage"
      />
    </>
  );
}
