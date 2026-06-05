import { Link } from 'react-router-dom';
import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection, BoutonInterne, CtaBandeau } from '@/components/blocs';
import { HeroActivites } from '@/components/HeroActivites';
import { BandeauConfiance } from '@/components/BandeauConfiance';
import { asset } from '@/lib/asset';
import { contenuAccueil } from '@content/pages/accueil';
import { marque } from '@content/marque';
import { activitesAccueil } from '@content/activites';

const routesActivite: Record<string, string> = {
  'royal-lepage': '/services/courtier-immobilier',
  sunset: '/services/sunset',
  'chalets-airbnb': '/services/chalets',
};

export default function Accueil() {
  return (
    <>
      <PageHead
        titre={`${marque.nomCourt} | Courtier immobilier, Trois-Rivières et la Mauricie`}
        description="Roxan Turcotte, courtier immobilier résidentiel et commercial chez Royal LePage Centre. Vente, achat, investissement, immobilier dans le Sud (Sunset) et chalets en location courte durée. Top 10 % National Royal LePage 2025."
        cheminCanonique="/"
        schema={schemaAgent}
      />

      <HeroActivites />

      {/* Bande de confiance fixe (ne change pas avec le slider d'activité) */}
      <Section variante="blanc">
        <BandeauConfiance />
      </Section>

      {/* Qui est Roxan — photo + texte */}
      <Section variante="creme">
        <div className="rt-portrait">
          <div className="rt-portrait__media">
            <img src={contenuAccueil.intro.image.src} alt={contenuAccueil.intro.image.alt} loading="lazy" decoding="async" />
          </div>
          <div>
            <span className="rt-eyebrow">{contenuAccueil.intro.eyebrow}</span>
            <h2>{contenuAccueil.intro.titre}</h2>
            {contenuAccueil.intro.paragraphes.map((p, i) => (
              <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>
            ))}
            <div style={{ marginTop: 'var(--rt-esp-5)' }}>
              <BoutonInterne href={contenuAccueil.intro.cta.href} variante="secondaire">
                {contenuAccueil.intro.cta.libelle}
              </BoutonInterne>
            </div>
          </div>
        </div>
      </Section>

      {/* Types de projets / propriétés avec photos */}
      <Section variante="ivoire">
        <TitreSection
          eyebrow={contenuAccueil.typesProprietes.eyebrow}
          titre={contenuAccueil.typesProprietes.titre}
          description={contenuAccueil.typesProprietes.description}
        />
        <div className="rt-grille rt-grille--3x">
          {contenuAccueil.typesProprietes.items.map((it) => (
            <Link key={it.titre} to={it.lien} className="rt-carte-photo">
              <span className="rt-carte-photo__media">
                <img src={it.image.src} alt={it.image.alt} loading="lazy" decoding="async" />
                <span className="rt-carte-photo__etiquette">{it.etiquette}</span>
              </span>
              <span className="rt-carte-photo__corps">
                <h3>{it.titre}</h3>
                <p>{it.texte}</p>
                <span className="rt-carte-photo__lien">En savoir plus →</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Les 3 activités */}
      <Section variante="creme">
        <TitreSection
          eyebrow={contenuAccueil.activites.eyebrow}
          titre={contenuAccueil.activites.titre}
          description={contenuAccueil.activites.description}
        />
        <div className="rt-grille rt-grille--3">
          {activitesAccueil.map((a) => (
            <Link key={a.slug} to={routesActivite[a.slug] ?? '/contact'} className="rt-carte-photo">
              <span className="rt-carte-photo__media">
                <img src={a.apercu.src} alt={a.apercu.alt} loading="lazy" decoding="async" />
                <span className="rt-logo-plaque" style={{ position: 'absolute', top: 12, left: 12, height: 38, padding: '6px 10px' }}>
                  <img src={asset(a.logo.chemin)} alt="" style={{ height: 24, width: 'auto' }} />
                </span>
              </span>
              <span className="rt-carte-photo__corps">
                <span className="rt-service-carte__entite">{a.entite}</span>
                <h3>{a.titre}</h3>
                <p>{a.accroche}</p>
                <span className="rt-carte-photo__lien">Découvrir →</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Outils gratuits */}
      <Section variante="ivoire">
        <TitreSection
          eyebrow={contenuAccueil.outils.eyebrow}
          titre={contenuAccueil.outils.titre}
          description={contenuAccueil.outils.description}
        />
        <div className="rt-plus-loin">
          {contenuAccueil.outils.cartes.map((c) => (
            <div key={c.titre} className="rt-plus-loin__carte">
              <h3>{c.titre}</h3>
              <p>{c.texte}</p>
              <BoutonInterne href={c.bouton.href} variante="secondaire">{c.bouton.libelle}</BoutonInterne>
            </div>
          ))}
        </div>
      </Section>

      {/* Témoignages */}
      <Section variante="creme">
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

      {/* Pour aller plus loin */}
      <Section variante="ivoire">
        <TitreSection
          eyebrow={contenuAccueil.plusLoin.eyebrow}
          titre={contenuAccueil.plusLoin.titre}
          description={contenuAccueil.plusLoin.description}
        />
        <div className="rt-plus-loin">
          {contenuAccueil.plusLoin.cartes.map((c) => (
            <div key={c.titre} className="rt-plus-loin__carte">
              <h3>{c.titre}</h3>
              <p>{c.texte}</p>
              <BoutonInterne href={c.bouton.href}>{c.bouton.libelle}</BoutonInterne>
            </div>
          ))}
        </div>
      </Section>

      <Section variante="creme">
        <CtaBandeau
          titre={contenuAccueil.cta.titre}
          sousTitre={contenuAccueil.cta.sousTitre}
          bouton={contenuAccueil.cta.bouton}
        />
      </Section>
    </>
  );
}
