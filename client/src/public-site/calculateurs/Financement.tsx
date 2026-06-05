import { useMemo, useState } from 'react';
import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { MentionLegaleCalc } from './MentionLegaleCalc';
import { dollars, dollarsArrondis } from '@/lib/format';
import { BlocAideOutil } from '@/components/blocsAide';
import { calculateursParSlug } from '@content/calculateurs';
import { servicesAide } from '@content/aide';
import { profilsPour } from '@content/profils';

const calc = calculateursParSlug['financement-hypothecaire'];

type Frequence = 'mensuel' | 'aux-deux-semaines' | 'hebdomadaire';

const periodesParAn: Record<Frequence, number> = {
  mensuel: 12,
  'aux-deux-semaines': 26,
  hebdomadaire: 52,
};

const libelleFrequence: Record<Frequence, string> = {
  mensuel: 'mensuel',
  'aux-deux-semaines': 'aux deux semaines',
  hebdomadaire: 'hebdomadaire',
};

function tauxAssuranceSCHL(misePourcent: number): number {
  // Approximation indicative selon les barèmes SCHL connus en 2024-2026.
  // Toujours valider auprès du prêteur. À 20 % et plus, aucune assurance.
  if (misePourcent >= 20) return 0;
  if (misePourcent >= 15) return 0.028;
  if (misePourcent >= 10) return 0.031;
  return 0.04;
}

export default function CalculateurFinancement() {
  const [prix, setPrix] = useState(450000);
  const [miseMontant, setMiseMontant] = useState(67500);
  const [tauxAnnuel, setTauxAnnuel] = useState(4.99);
  const [annees, setAnnees] = useState(25);
  const [frequence, setFrequence] = useState<Frequence>('mensuel');

  const calculs = useMemo(() => {
    const prixOk = Math.max(0, prix);
    const miseOk = Math.min(Math.max(0, miseMontant), prixOk);
    const misePourcent = prixOk > 0 ? (miseOk / prixOk) * 100 : 0;
    const tauxPrime = tauxAssuranceSCHL(misePourcent);
    const montantEmprunteAvantAssurance = Math.max(0, prixOk - miseOk);
    const prime = montantEmprunteAvantAssurance * tauxPrime;
    const montantEmprunte = montantEmprunteAvantAssurance + prime;
    const n = periodesParAn[frequence];
    const i = tauxAnnuel / 100 / n;
    const N = annees * n;
    const versement = i === 0
      ? montantEmprunte / N
      : (montantEmprunte * i) / (1 - Math.pow(1 + i, -N));
    const total = versement * N;
    const interets = total - montantEmprunte;
    return { montantEmprunte, prime, misePourcent, tauxPrime, versement, total, interets };
  }, [prix, miseMontant, tauxAnnuel, annees, frequence]);

  return (
    <>
      <PageHead
        titre="Calculateur de versements hypothécaires"
        description="Estimez votre versement hypothécaire mensuel, aux deux semaines ou hebdomadaire selon le prix, la mise de fonds, le taux et la période d'amortissement."
        cheminCanonique="/calculateurs/financement-hypothecaire"
        schema={schemaAgent}
      />

      <Section variante="creme">
        <TitreSection
          eyebrow="Calculateur"
          titre="Versements hypothécaires"
          description="Tous les calculs s'exécutent localement dans votre navigateur. Aucune donnée n'est transmise."
        />

        <div className="rt-calc">
          <div className="rt-calc__panneau">
            <div className="rt-formulaire" style={{ background: 'transparent', border: 0, padding: 0 }}>
              <div className="rt-champ">
                <label htmlFor="prix">Prix de la propriété ($)</label>
                <input id="prix" type="number" value={prix} min={0} step={1000}
                  onChange={(e) => setPrix(Number(e.target.value) || 0)} />
              </div>
              <div className="rt-champ">
                <label htmlFor="mise">Mise de fonds ($)</label>
                <input id="mise" type="number" value={miseMontant} min={0} step={500}
                  onChange={(e) => setMiseMontant(Number(e.target.value) || 0)} />
                <span style={{ fontSize: '0.8rem', color: 'var(--rt-gris-faible)' }}>
                  Soit {(prix > 0 ? (miseMontant / prix) * 100 : 0).toFixed(1)} % du prix.
                </span>
              </div>
              <div className="rt-champ--double">
                <div className="rt-champ">
                  <label htmlFor="taux">Taux annuel (%)</label>
                  <input id="taux" type="number" value={tauxAnnuel} min={0} max={20} step={0.01}
                    onChange={(e) => setTauxAnnuel(Number(e.target.value) || 0)} />
                </div>
                <div className="rt-champ">
                  <label htmlFor="annees">Amortissement (années)</label>
                  <input id="annees" type="number" value={annees} min={1} max={35}
                    onChange={(e) => setAnnees(Number(e.target.value) || 0)} />
                </div>
              </div>
              <div className="rt-champ">
                <label htmlFor="freq">Fréquence des versements</label>
                <select id="freq" value={frequence} onChange={(e) => setFrequence(e.target.value as Frequence)}>
                  <option value="mensuel">Mensuel (12 par an)</option>
                  <option value="aux-deux-semaines">Aux deux semaines (26 par an)</option>
                  <option value="hebdomadaire">Hebdomadaire (52 par an)</option>
                </select>
              </div>
            </div>
            <MentionLegaleCalc />
          </div>

          <div className="rt-calc__resultat" aria-live="polite">
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Versement {libelleFrequence[frequence]}</span>
              <span className="rt-calc__valeur rt-calc__valeur--mise-en-avant">{dollars(calculs.versement)}</span>
            </div>
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Montant emprunté</span>
              <span className="rt-calc__valeur">{dollarsArrondis(calculs.montantEmprunte)}</span>
            </div>
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Prime SCHL (estimée)</span>
              <span className="rt-calc__valeur">{dollarsArrondis(calculs.prime)}</span>
            </div>
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Intérêts totaux sur l'amortissement</span>
              <span className="rt-calc__valeur">{dollarsArrondis(calculs.interets)}</span>
            </div>
            <div className="rt-calc__metric">
              <span className="rt-calc__libelle">Coût total</span>
              <span className="rt-calc__valeur">{dollarsArrondis(calculs.total)}</span>
            </div>
            {calculs.misePourcent < 20 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--rt-alerte)' }}>
                Mise de fonds inférieure à 20 % : une assurance prêt SCHL est généralement requise.
              </p>
            )}
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
