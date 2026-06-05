import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { FormulaireContact } from '@/components/FormulaireContact';
import { marque } from '@content/marque';

export default function Contact() {
  return (
    <>
      <PageHead
        titre="Contact | Roxan Turcotte, Courtier immobilier"
        description="Échangez avec Roxan Turcotte, courtier immobilier à Trois-Rivières. Premier contact sans engagement : par courriel, téléphone ou via le formulaire en ligne."
        cheminCanonique="/contact"
        schema={schemaAgent}
      />

      <Section variante="ivoire">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <span className="rt-eyebrow">Contact</span>
          <h1 className="rt-titre-gravure">Parlons de votre projet.</h1>
          <p className="lead">
            Premier échange sans engagement, en toute confidentialité. Choisissez le canal qui vous convient.
          </p>
        </div>
      </Section>

      <Section variante="creme">
        <div className="rt-coord">
          <div className="rt-coord__bloc">
            <h4>Téléphone</h4>
            <p>
              <a href={`tel:${marque.contact.telephone.replace(/\s/g, '')}`} className="rt-bouton rt-bouton--ghost">
                {marque.contact.telephoneAffiche}
              </a>
            </p>
            <h4 style={{ marginTop: '2rem' }}>Courriel</h4>
            <p>
              <a href={`mailto:${marque.contact.courriel}`} className="rt-bouton rt-bouton--ghost">
                {marque.contact.courriel}
              </a>
            </p>
            <h4 style={{ marginTop: '2rem' }}>Adresse</h4>
            <p>
              {marque.contact.adresse}<br />
              {marque.contact.region}, {marque.province}
            </p>
            <h4 style={{ marginTop: '2rem' }}>Heures d'ouverture</h4>
            <p>{marque.contact.heuresOuverture}</p>
          </div>

          <FormulaireContact
            typeFormulaire="contact"
            pageOrigine="/contact"
            etiquettes={['royal-lepage']}
            sourceEntite="royal-lepage"
            titre="Écrivez-moi"
            intro="Quelques mots sur votre projet ou votre question. Je vous reviens rapidement."
          />
        </div>
      </Section>

      <Section variante="ivoire">
        <TitreSection eyebrow="Carte" titre="Royal LePage Centre, Trois-Rivières" />
        <div
          style={{
            border: '1px solid var(--rt-ligne)',
            borderRadius: '10px',
            overflow: 'hidden',
            height: '420px',
            background: 'var(--rt-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--rt-texte-doux)',
            fontFamily: 'var(--rt-font-sous-titre)',
            fontStyle: 'italic',
          }}
        >
          Emplacement réservé pour la carte (Google Maps ou OpenStreetMap intégrés).
        </div>
      </Section>
    </>
  );
}
