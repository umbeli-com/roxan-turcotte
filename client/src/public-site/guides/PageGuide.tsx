import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { FormulaireContact } from '@/components/FormulaireContact';
import guidesContent from '@content/guides.json';

type Guide = (typeof guidesContent.guides)[number];

export function PageGuide({ slug }: { slug: string }) {
  const guide = guidesContent.guides.find((g: Guide) => g.slug === slug);
  if (!guide) return <Section variante="noir"><h1>Guide introuvable</h1></Section>;
  return <PageGuideTemplate guide={guide} />;
}

export function PageGuideTemplate({ guide }: { guide: Guide }) {
  return (
    <>
      <PageHead
        titre={`${guide.titre} | Guide gratuit | Roxan Turcotte`}
        description={guide.description}
        cheminCanonique={`/guides/${guide.slug}`}
        schema={schemaAgent}
      />

      <Section variante="noir">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '3rem', alignItems: 'start' }}>
          <div className="rt-guide-carte__couverture" style={{ height: '420px', borderRadius: '10px' }}>
            <span className="rt-guide-carte__couverture-titre" style={{ fontSize: '1.6rem' }}>
              {guide.couvertureMot}
            </span>
          </div>
          <div>
            <span className="rt-eyebrow">Guide gratuit · {guide.categorie}</span>
            <h1 className="rt-titre-gravure">{guide.titre}</h1>
            <p className="lead" style={{ fontStyle: 'italic', color: 'var(--rt-or-clair)' }}>
              {guide.sousTitre}
            </p>
            <p>{guide.description}</p>
            {guide.provisoire && (
              <p className="rt-mention-legale">
                <strong>Contenu provisoire :</strong> le guide définitif est en cours de rédaction. La version
                téléchargée en attendant comporte l'ossature et les principaux conseils.
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section variante="charbon">
        <TitreSection eyebrow="Sommaire" titre="Ce que vous trouverez dans ce guide" />
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <ol style={{ counterReset: 'rt 0' }}>
            {guide.tableMatieres.map((s, i) => (
              <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--rt-ivoire)' }}>{s}</li>
            ))}
          </ol>
        </div>
      </Section>

      <Section variante="noir" id="formulaire">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <TitreSection
            eyebrow="Téléchargement"
            titre="Recevez votre guide en quelques secondes."
            description="Le guide vous est envoyé immédiatement par courriel. Confidentialité respectée, désinscription en un clic."
          />
          <FormulaireContact
            typeFormulaire={`guide-${guide.slug}`}
            pageOrigine={`/guides/${guide.slug}`}
            etiquettes={['guide', guide.etiqueteCRM]}
            sourceEntite="royal-lepage"
            titre={`Recevoir « ${guide.titre} »`}
            intro="Vos coordonnées servent uniquement à vous envoyer ce guide et à vous recontacter si vous en faites la demande."
            champMessage={false}
            champInfolettre={true}
          />
        </div>
      </Section>
    </>
  );
}
