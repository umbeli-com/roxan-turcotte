import { PageHead } from '@/components/Head';
import { Section } from '@/components/blocs';
import { politiqueConfidentialite, mentionsLegales } from '@content/pages/legales';
import { FormulaireContact } from '@/components/FormulaireContact';

function PagesLegalesShell({
  titre,
  derniereMaj,
  cheminCanonique,
  sections,
}: {
  titre: string;
  derniereMaj?: string;
  cheminCanonique: string;
  sections: { titre: string; paragraphes: string[] }[];
}) {
  return (
    <>
      <PageHead
        titre={`${titre} | Roxan Turcotte`}
        description={titre}
        cheminCanonique={cheminCanonique}
      />
      <Section variante="noir">
        <div style={{ maxWidth: 'var(--rt-largeur-texte)', margin: '0 auto' }}>
          <span className="rt-eyebrow">Document légal</span>
          <h1 className="rt-titre-gravure">{titre}</h1>
          {derniereMaj && (
            <p style={{ color: 'var(--rt-gris-faible)', fontSize: '0.85rem' }}>
              Dernière mise à jour : {derniereMaj}
            </p>
          )}
          {sections.map((s) => (
            <section key={s.titre} style={{ marginTop: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--rt-font-sous-titre)', fontSize: '1.5rem' }}>{s.titre}</h2>
              {s.paragraphes.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}

export function PolitiqueConfidentialite() {
  return (
    <PagesLegalesShell
      titre={politiqueConfidentialite.titre}
      derniereMaj={politiqueConfidentialite.derniereMaj}
      cheminCanonique="/politique-de-confidentialite"
      sections={politiqueConfidentialite.sections}
    />
  );
}

export function MentionsLegales() {
  return (
    <PagesLegalesShell
      titre={mentionsLegales.titre}
      cheminCanonique="/mentions-legales"
      sections={mentionsLegales.sections}
    />
  );
}

export function Desinscription() {
  return (
    <>
      <PageHead
        titre="Désinscription | Roxan Turcotte"
        description="Désinscrivez-vous de l'infolettre."
        cheminCanonique="/desinscription"
        noindex
      />
      <Section variante="noir">
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <span className="rt-eyebrow">Désinscription</span>
          <h1 className="rt-titre-gravure">Vous quittez l'infolettre.</h1>
          <p className="lead">
            Saisissez votre adresse pour vous désinscrire immédiatement. Vous pouvez aussi cliquer directement sur le lien
            de désinscription dans tout courriel reçu.
          </p>
          <FormulaireContact
            typeFormulaire="desinscription"
            pageOrigine="/desinscription"
            etiquettes={['desinscription']}
            titre="Confirmer ma désinscription"
            champMessage={false}
            champTelephoneRequis={false}
            intro="Une fois votre demande reçue, votre adresse sera retirée de la liste."
          />
        </div>
      </Section>
    </>
  );
}

export function DemandeDeDonnees() {
  return (
    <>
      <PageHead
        titre="Demande Loi 25 | Roxan Turcotte"
        description="Formulaire de demande d'accès, de rectification ou de suppression de vos renseignements personnels, conforme à la Loi 25 (Québec)."
        cheminCanonique="/demande-de-donnees"
      />
      <Section variante="noir">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span className="rt-eyebrow">Loi 25</span>
          <h1 className="rt-titre-gravure">Demande relative à vos données</h1>
          <p className="lead">
            Conformément à la Loi 25, vous pouvez demander à consulter, rectifier ou supprimer les renseignements
            personnels que nous détenons à votre sujet. Cette demande sera traitée dans les délais prévus par la loi.
          </p>
          <FormulaireContact
            typeFormulaire="loi25"
            pageOrigine="/demande-de-donnees"
            etiquettes={['loi25']}
            titre="Formuler ma demande"
            intro="Précisez la nature de votre demande (accès, rectification, suppression) dans le champ message."
          />
        </div>
      </Section>
    </>
  );
}
