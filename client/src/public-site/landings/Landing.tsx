import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection, BoutonInterne, ListeAvantages, Processus, CtaBandeau } from '@/components/blocs';
import { FormulaireContact } from '@/components/FormulaireContact';
import type { LandingContenu } from '@content/pages/landings';

// Page d'atterrissage générique réutilisée pour vente / achat / chalet.
// Pré-rendue en HTML statique via vite-react-ssg (cf. routes.tsx).

export function LandingTemplate({ data }: { data: LandingContenu }) {
  return (
    <>
      <PageHead
        titre={`${data.hero.titre} | Roxan Turcotte`}
        description={data.hero.accroche}
        cheminCanonique={data.route}
        schema={schemaAgent}
      />

      <section className="rt-hero">
        <div className="rt-hero__motif" aria-hidden="true" />
        <div className="rt-hero__halo" aria-hidden="true" />
        <div className="rt-hero__contenu" style={{ gridTemplateColumns: '1fr' }}>
          <div className="rt-hero__principal" style={{ textAlign: 'center', margin: '0 auto' }}>
            <span className="rt-eyebrow">{data.hero.eyebrow}</span>
            <h1 className="rt-titre-gravure">{data.hero.titre}</h1>
            <p className="rt-hero__sous-titre">{data.hero.sousTitre}</p>
            <p className="rt-hero__accroche" style={{ margin: '0 auto' }}>{data.hero.accroche}</p>
            <div className="rt-hero__cta" style={{ justifyContent: 'center' }}>
              <BoutonInterne href={data.hero.ctaPrimaire.href}>{data.hero.ctaPrimaire.libelle}</BoutonInterne>
              <BoutonInterne href={data.hero.ctaSecondaire.href} variante="secondaire">
                {data.hero.ctaSecondaire.libelle}
              </BoutonInterne>
            </div>
          </div>
        </div>
      </section>

      <Section variante="charbon">
        <TitreSection titre={data.benefices.titre} eyebrow="Bénéfices" />
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <ListeAvantages items={data.benefices.items} />
        </div>
      </Section>

      <Section variante="noir">
        <TitreSection titre={data.processus.titre} eyebrow="Processus" />
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Processus etapes={data.processus.etapes} />
        </div>
      </Section>

      <Section variante="charbon" id="formulaire">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <FormulaireContact
            typeFormulaire={data.typeFormulaire}
            pageOrigine={data.route}
            etiquettes={data.etiquettes}
            sourceEntite={data.etiquettes[0] === 'chalet' ? 'chalets' : 'royal-lepage'}
            titre={data.formulaireTitre}
            intro={data.formulaireIntro}
            champInfolettre={true}
          />
        </div>
      </Section>

      <Section variante="noir">
        <CtaBandeau
          titre={data.ctaFinal.titre}
          sousTitre={data.ctaFinal.sousTitre}
          bouton={data.ctaFinal.bouton}
        />
      </Section>
    </>
  );
}

import { landings } from '@content/pages/landings';

export function LandingVente() { return <LandingTemplate data={landings.vendre} />; }
export function LandingAchat() { return <LandingTemplate data={landings.acheter} />; }
export function LandingChalet() { return <LandingTemplate data={landings.chalet} />; }
