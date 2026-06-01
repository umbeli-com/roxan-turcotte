import { FormEvent, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Embleme } from '@/components/Embleme';
import { useAuth } from '../lib/auth';
import { ErreurApi } from '../lib/api';
import { PageHead } from '@/components/Head';

export default function AdminLogin() {
  const { utilisateur, connexion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const retour = (location.state as { retour?: string } | null)?.retour || '/admin/dashboard';

  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [enVol, setEnVol] = useState(false);

  if (utilisateur) return <Navigate to={retour} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnVol(true);
    try {
      await connexion(nom, motDePasse);
      navigate(retour, { replace: true });
    } catch (e) {
      const msg = e instanceof ErreurApi && e.statut === 401
        ? 'Identifiants invalides.'
        : 'Connexion impossible. Vérifiez votre réseau.';
      setErreur(msg);
    } finally {
      setEnVol(false);
    }
  }

  return (
    <div className="rt-admin">
      <PageHead titre="Connexion — Back-office" description="Espace privé" cheminCanonique="/admin/login" noindex />
      <div className="rt-admin-auth">
        <form className="rt-admin-auth__carte" onSubmit={onSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Embleme taille={68} sansFond />
          </div>
          <h1 className="rt-admin-auth__titre">Back-office</h1>
          <p className="rt-admin-auth__sous-titre">Connexion réservée à Roxan et Umbeli.</p>

          <div className="rt-adm-champ">
            <label htmlFor="adm-nom">Nom d'utilisateur</label>
            <input
              id="adm-nom"
              type="text"
              autoComplete="username"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="rt-adm-champ">
            <label htmlFor="adm-mdp">Mot de passe</label>
            <input
              id="adm-mdp"
              type="password"
              autoComplete="current-password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          {erreur && <div className="rt-adm-message rt-adm-message--erreur" role="alert">{erreur}</div>}

          <button type="submit" className="rt-adm-btn rt-adm-btn--primaire" style={{ width: '100%', marginTop: '0.5rem' }} disabled={enVol}>
            {enVol ? 'Connexion…' : 'Me connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
