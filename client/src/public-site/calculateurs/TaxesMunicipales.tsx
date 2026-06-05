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

const calc = calculateursParSlug['taxes-municipales-scolaires'];

export default function CalculateurTaxesMunicipales() {
  const muns = municipalitiesData.municipalites;
  const [slug, setSlug] = useState(muns[0]?.slug ?? '');
  const [evaluation, setEvaluation] = useState(350000);

  const municipalite = muns.find((m) => m.slug === slug) ?? muns[0];

  const calcul = useMemo(() => {
    if (!municipalite) return { municipale: 0, scolaire: 0, total: 0 };
    const municipale = evaluation * (municipalite.tauxMunicipal ?? 0);
    const scolaire = evaluation * (municipalite.tauxScolaire ?? 0);
    return { municipale, scolaire, total: municipale + scolaire };
  }, [evaluation, municipalite]);

  return (
    <>
      <PageHead
        titre="Calculateur de taxes municipales et scolaires"
        description="Estimez vos taxes municipales et scolaires annuelles selon votre municipalité (Mauricie et Centre-du-Québec) et votre évaluation."
        cheminCanonique="/calculateurs/taxes-municipales-scolaires"
        schema={schemaAgent}
      />

      <Section variante="creme">
        <TitreSection
          eyebrow="Calculateur"
          titre="Taxes municipales et scolaires"
          description="Estimation annuelle, basée sur l'évaluation municipale et les taux configurés. Les taux varient chaque année."
        />

        <div className="rt-calc">
          <div className="rt-calc__panneau">
            <div className="rt-formulaire" style={{ background: 'transparent', border: 0, padding: 0 }}>
              <div className="rt-champ">
                <label htmlFor="mun">Municipalité</label>
                <select id="mun" value={slug} onChange={(e) => setSlug(e.target.value)}>
                  {muns.map((m) => (
                    <option key={m.slug} value={m.slug}>{m.nom}{m.provisoire ? ' (taux à valider)' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="rt-champ">
                <label htmlFor="eval">Évaluation municipale ($)</label>
                <input id="eval" type="number" min={0} step={1000} value={evaluation}
                  onChange={(e) => setEvaluation(Number(e.target.value) || 0)} />
              </div>
            </div>
            <MentionLegaleCalc />
          </div>

          <div className="rt-calc__resultat" aria-live="polite">
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Taxe municipale annuelle</span>
              <span className="rt-calc__valeur">{dollarsArrondis(calcul.municipale)}</span>
            </div>
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Taxe scolaire annuelle</span>
              <span className="rt-calc__valeur">{dollarsArrondis(calcul.scolaire)}</span>
            </div>
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Total annuel estimé</span>
              <span className="rt-calc__valeur rt-calc__valeur--mise-en-avant">{dollarsArrondis(calcul.total)}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--rt-gris-faible)' }}>
              Taux indicatifs pour la municipalité sélectionnée. À valider auprès de la municipalité et du centre de
              services scolaire concerné.
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
