import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection, CtaBandeau } from '@/components/blocs';
import { BandeauConfiance } from '@/components/BandeauConfiance';
import { asset } from '@/lib/asset';
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

      <Section variante="ivoire">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <span className="rt-eyebrow">{contenuAPropos.hero.eyebrow}</span>
          <h1 className="rt-titre-gravure">{contenuAPropos.hero.titre}</h1>
          <p className="lead" style={{ fontStyle: 'italic', color: 'var(--rt-or-fonce)' }}>
            {contenuAPropos.hero.sousTitre}
          </p>
        </div>
        <div style={{ marginTop: '2.5rem' }}>
          <BandeauConfiance />
        </div>
      </Section>

      <Section variante="creme">
        <div className="rt-portrait rt-portrait--inverse">
          <div className="rt-portrait__media rt-portrait__media--detoure">
            <img src={asset(marque.portrait)} alt="Roxan Turcotte, courtier immobilier" loading="lazy" decoding="async" />
          </div>
          <div>
            <span className="rt-eyebrow">Parcours</span>
            <h2>{contenuAPropos.parcours.titre}</h2>
            {contenuAPropos.parcours.paragraphes.map((p, i) => (
              <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section variante="ivoire">
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

      <Section variante="creme">
        <blockquote className="rt-temoignage" style={{ fontSize: '1.6rem', maxWidth: '780px', margin: '0 auto' }}>
          <span>{contenuAPropos.citation.texte}</span>
          <span className="rt-temoignage__auteur">— {contenuAPropos.citation.auteur}</span>
        </blockquote>
      </Section>

      <Section variante="ivoire">
        <CtaBandeau
          titre={contenuAPropos.cta.titre}
          sousTitre={contenuAPropos.cta.sousTitre}
          bouton={contenuAPropos.cta.bouton}
        />
      </Section>
    </>
  );
}
