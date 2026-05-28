import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection, ListeAvantages, Processus, BoutonInterne } from '@/components/blocs';
import { FormulaireContact } from '@/components/FormulaireContact';
import { servicesParSlug, type Service } from '@content/services';

// Page de service unifiée. Une route SSG par service (cf. routes.tsx).
export function ServicePage({ slug }: { slug: string }) {
  const data = servicesParSlug[slug];
  if (!data) return <div>Service introuvable.</div>;

  return <ServiceTemplate data={data} />;
}

export function ServiceTemplate({ data }: { data: Service }) {
  return (
    <>
      <PageHead
        titre={`${data.titre} | ${data.entite}`}
        description={data.resume}
        cheminCanonique={data.route}
        schema={schemaAgent}
      />

      <Section variante="noir">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <span className="rt-eyebrow">{data.entite}</span>
          <h1 className="rt-titre-gravure">{data.titre}</h1>
          <p className="lead">{data.resume}</p>
          <div style={{ marginTop: '2rem' }}>
            <BoutonInterne href="#formulaire">Demander un échange</BoutonInterne>
          </div>
        </div>
      </Section>

      <Section variante="charbon">
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <p className="lead">{data.description}</p>
        </div>
      </Section>

      <Section variante="noir">
        <TitreSection titre="Ce que vous obtenez" eyebrow="Bénéfices" />
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <ListeAvantages items={data.benefices} />
        </div>
      </Section>

      <Section variante="charbon">
        <TitreSection titre="Comment ça se passe" eyebrow="Processus" />
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Processus etapes={data.processus} />
        </div>
      </Section>

      <Section variante="noir" id="formulaire">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <TitreSection titre={data.ctaTitre} eyebrow="Demande" description={data.ctaSousTitre} />
          <FormulaireContact
            typeFormulaire={`service-${data.slug}`}
            pageOrigine={data.route}
            etiquettes={data.etiquettes}
            sourceEntite={data.etiquettes[0]}
            titre={`Je veux en savoir plus sur ${data.titre.toLowerCase()}`}
          />
        </div>
      </Section>
    </>
  );
}
