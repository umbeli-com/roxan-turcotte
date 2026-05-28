import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Entete } from './Entete';
import { PiedDePage } from './PiedDePage';

export function Layout() {
  return (
    <>
      <a
        href="#contenu-principal"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '1rem';
          e.currentTarget.style.top = '1rem';
          e.currentTarget.style.width = 'auto';
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.padding = '0.5rem 1rem';
          e.currentTarget.style.background = 'var(--rt-or)';
          e.currentTarget.style.color = 'var(--rt-noir)';
        }}
      >
        Aller au contenu principal
      </a>
      <Entete />
      <main id="contenu-principal">
        <Outlet />
      </main>
      <PiedDePage />
      <ScrollRestoration />
    </>
  );
}
