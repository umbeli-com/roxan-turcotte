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

      <section className="rt-page-hero" aria-label={data.hero.titre}>
        <div className="rt-page-hero__fond" style={{ backgroundImage: `url(${data.hero.image.src})` }} aria-hidden="true" />
        <div className="rt-page-hero__voile" aria-hidden="true" />
        <div className="rt-page-hero__inner">
          <span className="rt-page-hero__eyebrow">{data.hero.eyebrow}</span>
          <h1>{data.hero.titre}</h1>
          <p className="rt-page-hero__accroche">{data.hero.accroche}</p>
          <div className="rt-page-hero__cta">
            <BoutonInterne href={data.hero.ctaPrimaire.href}>{data.hero.ctaPrimaire.libelle}</BoutonInterne>
            <BoutonInterne href={data.hero.ctaSecondaire.href} variante="sur-sombre">
              {data.hero.ctaSecondaire.libelle}
            </BoutonInterne>
          </div>
        </div>
      </section>

      <Section variante="creme">
        <TitreSection titre={data.benefices.titre} eyebrow="Bénéfices" />
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <ListeAvantages items={data.benefices.items} />
        </div>
      </Section>

      <Section variante="ivoire">
        <TitreSection titre={data.processus.titre} eyebrow="Processus" />
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Processus etapes={data.processus.etapes} />
        </div>
      </Section>

      <Section variante="creme" id="formulaire">
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

      <Section variante="ivoire">
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
