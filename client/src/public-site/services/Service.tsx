import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection, ListeAvantages, Processus } from '@/components/blocs';
import { FormulaireContact } from '@/components/FormulaireContact';
import { BlocContactProfils } from '@/components/ProfilsContact';
import { BlocServicesAide, BlocAllerPlusLoin } from '@/components/blocsAide';
import { Image } from '@/components/Image';
import { asset } from '@/lib/asset';
import { servicesParSlug, servicesExtra, type Service } from '@content/services';
import { profilsPour } from '@content/profils';
import { servicesAide } from '@content/aide';

// Page de service / activité unifiée. Une route SSG par service (cf. routes.tsx).
export function ServicePage({ slug }: { slug: string }) {
  const data = servicesParSlug[slug];
  if (!data) return <div>Service introuvable.</div>;
  return <ServiceTemplate data={data} />;
}

export function ServiceTemplate({ data }: { data: Service }) {
  const extra = servicesExtra[data.slug] ?? {};
  const profils = profilsPour(extra.profils ?? []);
  const aide = servicesAide(extra.aide ?? []);

  return (
    <>
      <PageHead
        titre={`${data.titre} | ${data.entite}`}
        description={data.resume}
        cheminCanonique={data.route}
        schema={schemaAgent}
        image={extra.image?.src}
      />

      {extra.image ? (
        <section className="rt-page-hero" aria-label={data.titre}>
          <div className="rt-page-hero__fond" style={{ backgroundImage: `url(${extra.image.src})` }} aria-hidden="true" />
          <div className="rt-page-hero__voile" aria-hidden="true" />
          <div className="rt-page-hero__inner">
            {extra.logo ? (
              <div className="rt-page-hero__logo-zone">
                <span className="rt-logo-plaque rt-page-hero__logo">
                  <img src={asset(extra.logo)} alt={data.entite} />
                </span>
              </div>
            ) : (
              <span className="rt-page-hero__eyebrow">{data.entite}</span>
            )}
            <h1>{data.titre}</h1>
            <p className="rt-page-hero__accroche">{data.resume}</p>
            <div className="rt-page-hero__cta">
              <a className="rt-bouton rt-bouton--primaire" href="#formulaire">Demander un échange</a>
            </div>
          </div>
        </section>
      ) : (
        <Section variante="creme">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
            <span className="rt-eyebrow">{data.entite}</span>
            <h1 className="rt-titre-gravure">{data.titre}</h1>
            <p className="lead">{data.resume}</p>
            <div style={{ marginTop: '2rem' }}>
              <a className="rt-bouton rt-bouton--primaire" href="#formulaire">Demander un échange</a>
            </div>
          </div>
        </Section>
      )}

      <Section variante="ivoire">
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <p className="lead">{data.description}</p>
        </div>
      </Section>

      <Section variante="creme">
        <TitreSection titre="Ce que vous obtenez" eyebrow="Bénéfices" />
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <ListeAvantages items={data.benefices} />
        </div>
      </Section>

      {extra.galerie && extra.galerie.length > 0 && (
        <Section variante="ivoire">
          <TitreSection eyebrow="Aperçu" titre="En images" />
          <div className="rt-galerie">
            {extra.galerie.map((p, i) => (
              <Image key={i} photo={p} ratio="4-3" />
            ))}
          </div>
        </Section>
      )}

      <Section variante="creme">
        <TitreSection titre="Comment ça se passe" eyebrow="Processus" />
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Processus etapes={data.processus} />
        </div>
      </Section>

      <Section variante="ivoire" id="formulaire">
        <TitreSection titre={data.ctaTitre} eyebrow="Demande" description={data.ctaSousTitre} />
        {profils.length > 0 ? (
          <BlocContactProfils
            profils={profils}
            typeFormulaire={`service-${data.slug}`}
            pageOrigine={data.route}
            etiquettes={data.etiquettes}
            sourceEntite={data.etiquettes[0]}
            titre={`Je veux en savoir plus sur ${data.titre.toLowerCase()}`}
          />
        ) : (
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <FormulaireContact
              typeFormulaire={`service-${data.slug}`}
              pageOrigine={data.route}
              etiquettes={data.etiquettes}
              sourceEntite={data.etiquettes[0]}
              titre={`Je veux en savoir plus sur ${data.titre.toLowerCase()}`}
            />
          </div>
        )}
      </Section>

      {aide.length > 0 && (
        <Section variante="creme">
          <BlocServicesAide titre="Des services complémentaires" services={aide} />
        </Section>
      )}

      <Section variante="ivoire">
        <TitreSection eyebrow="Pour aller plus loin" titre="Faire affaire avec Roxan" />
        <BlocAllerPlusLoin />
      </Section>
    </>
  );
}
