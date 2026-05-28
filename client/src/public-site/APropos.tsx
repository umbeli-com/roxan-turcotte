import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection, CtaBandeau, PastilleReco } from '@/components/blocs';
import { contenuAPropos } from '@content/pages/a-propos';
import { marque } from '@content/marque';

export default function APropos() {
  return (
    <>
      <PageHead
        titre="À propos | Roxan Turcotte, Courtier immobilier"
        description="Avant le courtage, 23 ans en construction neuve. Roxan Turcotte, courtier immobilier chez Royal LePage Centre, conjugue lecture technique du bâtiment et stratégie de mise en marché professionnelle."
        cheminCanonique="/a-propos"
        schema={schemaAgent}
      />

      <Section variante="noir">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <span className="rt-eyebrow">{contenuAPropos.hero.eyebrow}</span>
          <h1 className="rt-titre-gravure">{contenuAPropos.hero.titre}</h1>
          <p className="lead" style={{ fontStyle: 'italic', color: 'var(--rt-or-clair)' }}>
            {contenuAPropos.hero.sousTitre}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '2rem' }}>
            {marque.reconnaissances.map((r) => (
              <PastilleReco key={r.titre} titre={r.titre} mention={r.mention} />
            ))}
          </div>
        </div>
      </Section>

      <Section variante="charbon">
        <TitreSection eyebrow="Parcours" titre={contenuAPropos.parcours.titre} />
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          {contenuAPropos.parcours.paragraphes.map((p, i) => (
            <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>
          ))}
        </div>
      </Section>

      <Section variante="noir">
        <TitreSection eyebrow="Valeurs" titre={contenuAPropos.valeurs.titre} />
        <div className="rt-grille rt-grille--2">
          {contenuAPropos.valeurs.items.map((v) => (
            <article key={v.titre} className="rt-carte">
              <h3>{v.titre}</h3>
              <p>{v.texte}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section variante="charbon">
        <blockquote className="rt-temoignage" style={{ fontSize: '1.6rem', maxWidth: '780px', margin: '0 auto' }}>
          <span>{contenuAPropos.citation.texte}</span>
          <span className="rt-temoignage__auteur">— {contenuAPropos.citation.auteur}</span>
        </blockquote>
      </Section>

      <Section variante="noir">
        <CtaBandeau
          titre={contenuAPropos.cta.titre}
          sousTitre={contenuAPropos.cta.sousTitre}
          bouton={contenuAPropos.cta.bouton}
        />
      </Section>
    </>
  );
}
