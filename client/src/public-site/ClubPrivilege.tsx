import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { FormulaireContact } from '@/components/FormulaireContact';
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

      <Section variante="noir">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <span className="rt-eyebrow">{contenuClubPrivilege.hero.eyebrow}</span>
          <h1 className="rt-titre-gravure">{contenuClubPrivilege.hero.titre}</h1>
          <p className="lead" style={{ fontStyle: 'italic', color: 'var(--rt-or-clair)' }}>
            {contenuClubPrivilege.hero.sousTitre}
          </p>
          <p style={{ marginTop: '2rem' }}>{contenuClubPrivilege.intro}</p>
        </div>
      </Section>

      <Section variante="charbon">
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

      <Section variante="noir" id="formulaire">
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
