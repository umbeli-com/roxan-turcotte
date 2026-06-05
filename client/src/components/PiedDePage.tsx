import { Link } from 'react-router-dom';
import { marque } from '@content/marque';
import { navigationPiedDePage } from '@content/navigation';
import { Embleme } from './Embleme';

export function PiedDePage() {
  const annee = new Date().getFullYear();
  return (
    <footer className="rt-footer">
      <div className="rt-footer__haut">
        <div className="rt-footer__bloc">
          <Link to="/" className="rt-marque" aria-label="Accueil">
            <span className="rt-marque__embleme">
              <Embleme taille={56} />
            </span>
            <span className="rt-marque__texte">
              <span className="rt-marque__nom">{marque.nomCourt}</span>
              <span className="rt-marque__profession">Courtier immobilier</span>
            </span>
          </Link>
          <p style={{ marginTop: '1rem', fontFamily: 'var(--rt-font-sous-titre)', fontStyle: 'italic', color: 'var(--rt-or-clair)' }}>
            {marque.slogan}
          </p>
          <p style={{ fontSize: '0.85rem' }}>
            {marque.contact.adresse}
            <br />
            {marque.contact.region}, {marque.province}
            <br />
            <a href={`mailto:${marque.contact.courriel}`}>{marque.contact.courriel}</a>
            <br />
            <a href={`tel:${marque.contact.telephone.replace(/\s/g, '')}`}>{marque.contact.telephoneAffiche}</a>
          </p>
        </div>

        <div className="rt-footer__bloc">
          <h4>Découvrir</h4>
          <ul>
            {navigationPiedDePage.decouvrir.map((e) => (
              <li key={e.href}><Link to={e.href}>{e.libelle}</Link></li>
            ))}
          </ul>
        </div>

        <div className="rt-footer__bloc">
          <h4>Services</h4>
          <ul>
            {navigationPiedDePage.services.map((e) => (
              <li key={e.href}><Link to={e.href}>{e.libelle}</Link></li>
            ))}
          </ul>
        </div>

        <div className="rt-footer__bloc">
          <h4>Ressources</h4>
          <ul>
            {navigationPiedDePage.ressources.map((e) => (
              <li key={e.href}><Link to={e.href}>{e.libelle}</Link></li>
            ))}
          </ul>
          <div style={{ marginTop: '1rem' }}>
            <span className="rt-footer__rlp">{marque.banniere}</span>
          </div>
        </div>
      </div>

      <div className="rt-footer__bas">
        {/* Si le build a tourne une annee differente de celle du visiteur (build
            en decembre, ouverture en janvier), l'hydratation echoue avec #418.
            On supprime l'avertissement pour ce seul span. */}
        <span className="rt-footer__signature" suppressHydrationWarning>© {annee} — {marque.nom}</span>
        <br />
        <span style={{ display: 'inline-block', marginTop: '0.5rem' }}>
          {marque.banniere}, agence immobilière franchisée indépendante et autonome. Réalisation : Umbeli.
        </span>
      </div>
    </footer>
  );
}
