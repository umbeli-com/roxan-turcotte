import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { FormulaireContact } from '@/components/FormulaireContact';
import { images } from '@content/images';
import { contenuClubPrivilege } from '@content/pages/club-privilege';

export default function ClubPrivilege() {
  return (
    <>
      <PageHead
        titre="Club Privilège | Roxan Turcotte"
        description="Rejoignez le Club Privilège : accès anticipé aux opportunités immobilières, analyses exclusives, accompagnement renforcé, avantages partenaires."
        cheminCanonique="/club-privilege"
        schema={schemaAgent}
      />

      <section className="rt-page-hero" aria-label={contenuClubPrivilege.hero.titre}>
        <div
          className="rt-page-hero__fond"
          style={{ backgroundImage: `url(${images.proprietes.investissement.src})` }}
          aria-hidden="true"
        />
        <div className="rt-page-hero__voile" aria-hidden="true" />
        <div className="rt-page-hero__inner">
          <span className="rt-page-hero__eyebrow">{contenuClubPrivilege.hero.eyebrow}</span>
          <h1>{contenuClubPrivilege.hero.titre}</h1>
          <p className="rt-page-hero__accroche" style={{ fontStyle: 'italic' }}>
            {contenuClubPrivilege.hero.sousTitre}
          </p>
          <div className="rt-page-hero__cta">
            <a className="rt-bouton rt-bouton--primaire" href="#formulaire">Rejoindre le Club</a>
          </div>
        </div>
      </section>

      <Section variante="ivoire">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <p className="lead">{contenuClubPrivilege.intro}</p>
        </div>
      </Section>

      <Section variante="creme">
        <TitreSection titre={contenuClubPrivilege.avantages.titre} eyebrow="Avantages" />
        <div className="rt-grille rt-grille--2">
          {contenuClubPrivilege.avantages.items.map((a) => (
            <article key={a.titre} className="rt-carte">
              <h3>{a.titre}</h3>
              <p>{a.texte}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section variante="ivoire" id="formulaire">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <TitreSection
            titre={contenuClubPrivilege.formulaireTitre}
            eyebrow="Inscription"
            description={contenuClubPrivilege.formulaireIntro}
          />
          <FormulaireContact
            typeFormulaire="club-privilege"
            pageOrigine="/club-privilege"
            etiquettes={['club-privilege', 'infolettre']}
            sourceEntite="royal-lepage"
            titre="Rejoindre le Club Privilège"
            champMessage={false}
            champInfolettre={true}
          />
        </div>
      </Section>
    </>
  );
}
