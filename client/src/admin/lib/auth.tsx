import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, ErreurApi } from './api';

type Utilisateur = { id: number; nom: string; role: string };

type ContexteAuth = {
  utilisateur: Utilisateur | null;
  chargement: boolean;
  connexion: (nom: string, motDePasse: string) => Promise<void>;
  deconnexion: () => Promise<void>;
};

const ctx = createContext<ContexteAuth | null>(null);

export function FournisseurAuth({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let annule = false;
    api.me()
      .then((r) => { if (!annule) setUtilisateur(r.utilisateur); })
      .catch((e) => {
        if (annule) return;
        // 401 attendu si non connecté ; sinon on remonte l'erreur silencieusement.
        if (!(e instanceof ErreurApi && e.statut === 401)) console.error(e);
      })
      .finally(() => { if (!annule) setChargement(false); });
    return () => { annule = true; };
  }, []);

  async function connexion(nom: string, motDePasse: string) {
    const r = await api.login(nom, motDePasse);
    setUtilisateur(r.utilisateur);
  }

  async function deconnexion() {
    await api.logout().catch(() => {});
    setUtilisateur(null);
  }

  return <ctx.Provider value={{ utilisateur, chargement, connexion, deconnexion }}>{children}</ctx.Provider>;
}

export function useAuth() {
  const v = useContext(ctx);
  if (!v) throw new Error('useAuth doit être utilisé dans FournisseurAuth');
  return v;
}

export function RouteProtegee({ children }: { children: ReactNode }) {
  const { utilisateur, chargement } = useAuth();
  const location = useLocation();
  if (chargement) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--adm-texte-faible)' }}>
        Vérification de la session…
      </div>
    );
  }
  if (!utilisateur) {
    return <Navigate to="/admin/login" state={{ retour: location.pathname }} replace />;
  }
  return <>{children}</>;
}
