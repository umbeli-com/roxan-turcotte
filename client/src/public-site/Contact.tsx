import { PageHead, schemaAgent } from '@/components/Head';
import { Section, TitreSection } from '@/components/blocs';
import { FormulaireContact } from '@/components/FormulaireContact';
import { asset } from '@/lib/asset';
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
            <div className="rt-contact-portrait">
              <img src={asset(marque.portrait)} alt="Roxan Turcotte, courtier immobilier" loading="lazy" decoding="async" />
              <div>
                <strong>{marque.nomCourt}</strong>
                <span>Courtier immobilier · {marque.banniere}</span>
              </div>
            </div>
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
          }}
        >
          <iframe
            title="Carte — Trois-Rivières, Mauricie"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-72.6300%2C46.3210%2C-72.5100%2C46.3760&layer=mapnik&marker=46.3452%2C-72.5477"
            style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <a
            href="https://www.openstreetmap.org/?mlat=46.3452&mlon=-72.5477#map=13/46.3452/-72.5477"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ouvrir la carte en grand
          </a>
        </p>
      </Section>
    </>
  );
}
