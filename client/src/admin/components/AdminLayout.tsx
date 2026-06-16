import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Embleme } from '@/components/Embleme';
import { useAuth } from '../lib/auth';
import type { ReactNode } from 'react';

const entrees: { libelle: string; href: string; icone: ReactNode }[] = [
  {
    libelle: 'Tableau de bord',
    href: '/admin/dashboard',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 13l4-4 4 4 7-7" />
        <path d="M21 6h-4M21 6v4" />
      </svg>
    ),
  },
  {
    libelle: 'Leads',
    href: '/admin/leads',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    ),
  },
  {
    libelle: 'Partenaires',
    href: '/admin/partenaires',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 20c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5" />
        <circle cx="17.5" cy="9" r="2.4" />
        <path d="M16 14.5c3 .3 5 2.4 5 5" />
      </svg>
    ),
  },
  {
    libelle: 'Étiquettes',
    href: '/admin/tags',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12V3h9l9 9-9 9-9-9z" />
        <circle cx="8" cy="8" r="1.6" />
      </svg>
    ),
  },
  {
    libelle: 'Inclusions / Exclusions',
    href: '/admin/checklist',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1z" />
        <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <path d="M8.5 12l1.5 1.5L13 10" />
        <path d="M16.5 16H17" />
      </svg>
    ),
  },
  {
    libelle: 'Export CSV',
    href: '/admin/export',
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12" />
        <path d="M6 9l6 6 6-6" />
        <path d="M4 19h16" />
      </svg>
    ),
  },
];

export function AdminLayout() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();

  async function onDeconnexion() {
    await deconnexion();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="rt-admin">
      <div className="rt-admin__corps">
        <aside className="rt-admin-side">
          <div className="rt-admin-side__marque">
            <Embleme taille={40} sansFond />
            <div>
              <div className="rt-admin-side__marque-nom">Roxan Turcotte</div>
              <div className="rt-admin-side__marque-sous">Back-office</div>
            </div>
          </div>

          <nav className="rt-admin-side__nav" aria-label="Navigation back-office">
            {entrees.map((e) => (
              <NavLink
                key={e.href}
                to={e.href}
                className={({ isActive }) => `rt-admin-side__lien ${isActive ? 'actif' : ''}`}
              >
                {e.icone}
                <span>{e.libelle}</span>
              </NavLink>
            ))}
          </nav>

          <div className="rt-admin-side__user">
            <div>
              <div className="rt-admin-side__user-nom">{utilisateur?.nom}</div>
              <div className="rt-admin-side__user-role">{utilisateur?.role}</div>
            </div>
            <button className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small" onClick={onDeconnexion}>
              Quitter
            </button>
          </div>
        </aside>

        <main className="rt-admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
