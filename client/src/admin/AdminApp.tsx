import { useEffect, useState } from 'react';
import { PageHead } from '@/components/Head';

// Coquille SPA du back-office, en rendu client uniquement.
// Pour la première publication (GitHub Pages), seul un placeholder est rendu.
// La SPA complète (auth, tableau de bord, leads, étiquettes, exports, guides,
// infolettre, calendrier Loi 25) sera branchée sur l'API Express une fois
// le serveur déployé sur le VPS.

export default function AdminApp() {
  const [horsLigne, setHorsLigne] = useState(false);

  useEffect(() => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    fetch(`${apiBase}/admin/me`, { credentials: 'include' })
      .then((r) => {
        if (!r.ok) setHorsLigne(true);
      })
      .catch(() => setHorsLigne(true));
  }, []);

  return (
    <>
      <PageHead
        titre="Back-office | Roxan Turcotte"
        description="Espace privé."
        cheminCanonique="/admin"
        noindex
      />
      <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '4rem 1.5rem' }}>
        <div style={{
          maxWidth: '620px',
          background: 'var(--rt-charbon-2)',
          border: '1px solid var(--rt-ligne)',
          borderRadius: '10px',
          padding: '2.5rem',
          textAlign: 'center',
        }}>
          <span className="rt-eyebrow">Espace réservé</span>
          <h1 style={{ fontFamily: 'var(--rt-font-titre)', fontSize: '1.8rem', marginBottom: '1rem' }}>
            Back-office
          </h1>
          {horsLigne ? (
            <>
              <p>
                Le mini-CRM n'est pas accessible depuis la version statique du site (déploiement GitHub Pages de la
                première phase).
              </p>
              <p style={{ color: 'var(--rt-or-clair)' }}>
                Le back-office est disponible une fois le serveur Express déployé sur le VPS (étape 2 du plan).
              </p>
            </>
          ) : (
            <p>Connexion à l'API en cours…</p>
          )}
        </div>
      </div>
    </>
  );
}
