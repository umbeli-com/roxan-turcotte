import { Link } from 'react-router-dom';
import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection, BoutonInterne } from '@/components/blocs';
import { images } from '@content/images';
import guidesContent from '@content/guides.json';

type Guide = (typeof guidesContent.guides)[number];

export default function IndexGuides() {
  return (
    <>
      <PageHead
        titre="Guides immobiliers gratuits | Roxan Turcotte"
        description="Téléchargez gratuitement nos guides : achat, vente, valorisation résidentielle (home staging), investissement. Conçus pour vous outiller à chaque étape."
        cheminCanonique="/guides"
        schema={schemaAgent}
      />

      <Section variante="ivoire">
        <TitreSection
          eyebrow="Guides gratuits"
          titre="Des guides pour décider en confiance."
          description="Quatre guides à télécharger gratuitement. Conçus pour vous outiller, pas pour vous vendre."
        />
        <div className="rt-grille rt-grille--2">
          {guidesContent.guides.map((g: Guide) => (
            <article key={g.slug} className="rt-guide-carte">
              <div className="rt-guide-carte__couverture">
                {images.guides[g.slug] && (
                  <img
                    className="rt-guide-carte__couverture-image"
                    src={images.guides[g.slug].src}
                    alt={images.guides[g.slug].alt}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className="rt-guide-carte__couverture-titre">{g.couvertureMot}</span>
              </div>
              <div className="rt-guide-carte__corps">
                {g.provisoire && <span className="rt-mention-provisoire">Contenu provisoire</span>}
                <h3>{g.titre}</h3>
                <p>{g.sousTitre}</p>
                <p style={{ fontSize: '0.9rem' }}>{g.description}</p>
                <div className="rt-guide-carte__actions">
                  <Link to={`/guides/${g.slug}`} className="rt-bouton rt-bouton--primaire">
                    Télécharger le guide
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section variante="creme">
        <div style={{ textAlign: 'center', maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <p className="lead">
            Vous préférez en parler avant ? Échangeons directement. Premier appel sans engagement.
          </p>
          <BoutonInterne href="/contact" variante="secondaire">Me joindre</BoutonInterne>
        </div>
      </Section>
    </>
  );
}
