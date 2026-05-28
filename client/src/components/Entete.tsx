import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { marque } from '@content/marque';
import { navigationPrincipale } from '@content/navigation';
import { Embleme } from './Embleme';

export function Entete() {
  const [ouvert, setOuvert] = useState(false);
  const fermer = () => setOuvert(false);

  return (
    <header className="rt-header">
      <div className="rt-header__inner">
        <Link to="/" className="rt-marque" onClick={fermer} aria-label="Accueil">
          <span className="rt-marque__embleme">
            <Embleme taille={44} />
          </span>
          <span className="rt-marque__texte">
            <span className="rt-marque__nom">{marque.nomCourt}</span>
            <span className="rt-marque__profession">Courtier immobilier</span>
          </span>
        </Link>

        <button
          className="rt-burger"
          aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={ouvert}
          onClick={() => setOuvert((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            {ouvert ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <nav className={`rt-nav ${ouvert ? 'rt-nav--ouvert' : ''}`} aria-label="Navigation principale">
          {navigationPrincipale.map((e) => (
            <NavLink
              key={e.href}
              to={e.href}
              className={({ isActive }) => `rt-nav__lien ${isActive ? 'actif' : ''}`}
              onClick={fermer}
              end={e.href === '/'}
            >
              {e.libelle}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
