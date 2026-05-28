import { Link } from 'react-router-dom';
import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection, BoutonInterne, PastilleReco, CtaBandeau } from '@/components/blocs';
import { Embleme } from '@/components/Embleme';
import { contenuAccueil } from '@content/pages/accueil';
import { marque } from '@content/marque';
import { servicesParSlug } from '@content/services';

export default function Accueil() {
  return (
    <>
      <PageHead
        titre={`${marque.nomCourt} | Courtier immobilier prestige, Trois-Rivières`}
        description="Courtier immobilier résidentiel et commercial à Trois-Rivières, Roxan Turcotte conjugue 23 ans d'expertise en construction neuve et une stratégie de mise en marché professionnelle. Top 10 % National Royal LePage 2025."
        cheminCanonique="/"
        schema={schemaAgent}
      />

      <section className="rt-hero">
        <div className="rt-hero__motif" aria-hidden="true" />
        <div className="rt-hero__halo" aria-hidden="true" />
        <div className="rt-hero__contenu">
          <div className="rt-hero__principal">
            <span className="rt-eyebrow">{contenuAccueil.hero.eyebrow}</span>
            <h1 className="rt-titre-gravure">{contenuAccueil.hero.titre}</h1>
            <p className="rt-hero__sous-titre">{contenuAccueil.hero.sousTitre}</p>
            <p className="rt-hero__accroche">{contenuAccueil.hero.accroche}</p>
            <div className="rt-hero__cta">
              <BoutonInterne href={contenuAccueil.hero.ctaPrimaire.href}>
                {contenuAccueil.hero.ctaPrimaire.libelle}
              </BoutonInterne>
              <BoutonInterne href={contenuAccueil.hero.ctaSecondaire.href} variante="secondaire">
                {contenuAccueil.hero.ctaSecondaire.libelle}
              </BoutonInterne>
            </div>
            <div className="rt-hero__reconnaissances">
              {marque.reconnaissances.map((r) => (
                <PastilleReco key={r.titre} titre={r.titre} mention={r.mention} />
              ))}
            </div>
          </div>
          <div className="rt-hero__visuel" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="rt-hero__embleme-grand">
              <Embleme taille={260} />
            </div>
          </div>
        </div>
      </section>

      <Section variante="charbon">
        <TitreSection
          eyebrow={contenuAccueil.intro.eyebrow}
          titre={contenuAccueil.intro.titre}
        />
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          {contenuAccueil.intro.paragraphes.map((p, i) => (
            <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>
          ))}
        </div>
      </Section>

      <Section variante="noir">
        <TitreSection
          eyebrow="Services"
          titre="Un service par projet, une stratégie par client."
          description="Six pôles d'expertise pour répondre à chaque ambition immobilière."
        />
        <div className="rt-grille rt-grille--3">
          {contenuAccueil.servicesAffiches.map((slug) => {
            const s = servicesParSlug[slug];
            if (!s) return null;
            return (
              <Link key={s.slug} to={s.route} className="rt-service-carte">
                <span className="rt-service-carte__entite">{s.entite}</span>
                <h3>{s.titre}</h3>
                <p>{s.resume}</p>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section variante="charbon">
        <TitreSection
          eyebrow={contenuAccueil.reconnaissances.eyebrow}
          titre={contenuAccueil.reconnaissances.titre}
        />
        <div className="rt-grille rt-grille--4">
          {contenuAccueil.reconnaissances.items.map((r) => (
            <article key={r.titre} className="rt-carte">
              <h3 style={{ fontFamily: 'var(--rt-font-titre)', fontSize: '1.1rem', letterSpacing: '0.06em' }}>
                {r.titre}
              </h3>
              <p>{r.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section variante="noir">
        <TitreSection
          eyebrow={contenuAccueil.temoignages.eyebrow}
          titre={contenuAccueil.temoignages.titre}
        />
        <div className="rt-grille rt-grille--3">
          {contenuAccueil.temoignages.items.map((t) => (
            <blockquote key={t.auteur} className="rt-temoignage">
              <span>{t.citation}</span>
              <span className="rt-temoignage__auteur">{t.auteur}</span>
            </blockquote>
          ))}
        </div>
      </Section>

      <Section variante="charbon">
        <CtaBandeau
          titre={contenuAccueil.cta.titre}
          sousTitre={contenuAccueil.cta.sousTitre}
          bouton={contenuAccueil.cta.bouton}
        />
      </Section>
    </>
  );
}
