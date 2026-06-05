import { useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { marque } from '@content/marque';
import { navigationPrincipale, type EntreeNav } from '@content/navigation';
import { Embleme } from './Embleme';

export function Entete() {
  const [ouvert, setOuvert] = useState(false);
  const fermer = () => setOuvert(false);

  return (
    <header className="rt-header">
      <div className="rt-header__inner">
        <Link to="/" className="rt-marque" onClick={fermer} aria-label="Accueil">
          <span className="rt-marque__embleme">
            <Embleme taille={48} />
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
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            {ouvert ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <nav className={`rt-nav ${ouvert ? 'rt-nav--ouvert' : ''}`} aria-label="Navigation principale">
          {navigationPrincipale.map((e) =>
            e.enfants && e.enfants.length > 0 ? (
              <ItemMenu key={e.href} entree={e} fermer={fermer} />
            ) : /^https?:/i.test(e.href) ? (
              <div className="rt-nav__item" key={e.href}>
                <a
                  className="rt-nav__lien"
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={fermer}
                >
                  {e.libelle}
                </a>
              </div>
            ) : (
              <div className="rt-nav__item" key={e.href}>
                <NavLink
                  to={e.href}
                  className={({ isActive }) => `rt-nav__lien ${isActive ? 'actif' : ''}`}
                  onClick={fermer}
                  end={e.href === '/'}
                >
                  {e.libelle}
                </NavLink>
              </div>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}

function ItemMenu({ entree, fermer }: { entree: EntreeNav; fermer: () => void }) {
  const [ouvert, setOuvert] = useState(false);
  const refItem = useRef<HTMLDivElement>(null);
  const refBouton = useRef<HTMLButtonElement>(null);
  const idMenu = `sousmenu-${entree.libelle.toLowerCase().replace(/\s+/g, '-')}`;

  // Ferme le sous-menu quand le focus quitte l'élément (navigation clavier).
  function onBlurItem(e: React.FocusEvent<HTMLDivElement>) {
    if (!refItem.current?.contains(e.relatedTarget as Node | null)) setOuvert(false);
  }
  // Échap ferme et rend le focus au bouton.
  function onKeyDownItem(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' && ouvert) {
      setOuvert(false);
      refBouton.current?.focus();
    }
  }

  return (
    <div
      className="rt-nav__item"
      ref={refItem}
      onMouseLeave={() => setOuvert(false)}
      onBlur={onBlurItem}
      onKeyDown={onKeyDownItem}
    >
      <button
        type="button"
        className="rt-nav__lien"
        ref={refBouton}
        aria-haspopup="true"
        aria-expanded={ouvert}
        aria-controls={idMenu}
        onClick={() => setOuvert((o) => !o)}
      >
        {entree.libelle}
        <svg className="rt-nav__chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`rt-sousmenu ${ouvert ? 'ouvert' : ''}`} id={idMenu} role="menu">
        {entree.enfants!.map((c) => (
          <Link
            key={c.href}
            to={c.href}
            className="rt-sousmenu__lien"
            role="menuitem"
            onClick={() => {
              setOuvert(false);
              fermer();
            }}
          >
            <span className="rt-sousmenu__titre">{c.libelle}</span>
            {c.description && <span className="rt-sousmenu__desc">{c.description}</span>}
          </Link>
        ))}
        <Link
          to={entree.href}
          className="rt-sousmenu__tous"
          role="menuitem"
          onClick={() => {
            setOuvert(false);
            fermer();
          }}
        >
          Tout voir →
        </Link>
      </div>
    </div>
  );
}
