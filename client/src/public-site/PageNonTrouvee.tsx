import { PageHead } from '@/components/Head';
import { Section, BoutonInterne } from '@/components/blocs';

export default function PageNonTrouvee() {
  return (
    <>
      <PageHead
        titre="Page introuvable"
        description="La page demandée n'existe pas."
        cheminCanonique="/404"
        noindex
      />
      <Section variante="noir">
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
          <span className="rt-eyebrow">Erreur 404</span>
          <h1 className="rt-titre-gravure">Page introuvable</h1>
          <p className="lead">La page que vous cherchez n'existe pas ou a été déplacée.</p>
          <div style={{ marginTop: '2rem' }}>
            <BoutonInterne href="/">Retour à l'accueil</BoutonInterne>
          </div>
        </div>
      </Section>
    </>
  );
}
