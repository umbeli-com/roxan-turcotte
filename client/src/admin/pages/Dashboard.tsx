import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '@/components/Head';
import { api, type Lead } from '../lib/api';
import { formaterDateHeure, libelleStatut } from '../lib/format';

export default function AdminDashboard() {
  const [total, setTotal] = useState<number | null>(null);
  const [derniers, setDerniers] = useState<Lead[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    api.dashboard()
      .then((r) => { setTotal(r.totalLeads); setDerniers(r.derniersLeads); })
      .catch((e) => setErreur(e.message));
  }, []);

  const enAttente = derniers.filter((l) => l.statut === 'nouveau').length;
  const infolettre = derniers.filter((l) => l.consentement_infolettre).length;

  return (
    <>
      <PageHead titre="Tableau de bord — Back-office" description="" cheminCanonique="/admin/dashboard" noindex />
      <div className="rt-admin-page__entete">
        <div>
          <h1 className="rt-admin-page__titre">Tableau de bord</h1>
          <p className="rt-admin-page__intro">Vue d'ensemble de l'activité récente.</p>
        </div>
        <Link to="/admin/leads" className="rt-adm-btn rt-adm-btn--ghost">Voir tous les leads</Link>
      </div>

      {erreur && <div className="rt-adm-message rt-adm-message--erreur">{erreur}</div>}

      <div className="rt-adm-stat-grille">
        <div className="rt-adm-stat">
          <div className="rt-adm-stat__libelle">Total leads</div>
          <div className="rt-adm-stat__valeur">{total ?? '—'}</div>
          <div className="rt-adm-stat__sous">Depuis le lancement</div>
        </div>
        <div className="rt-adm-stat">
          <div className="rt-adm-stat__libelle">À traiter</div>
          <div className="rt-adm-stat__valeur">{enAttente}</div>
          <div className="rt-adm-stat__sous">Statut « nouveau » dans les 10 derniers</div>
        </div>
        <div className="rt-adm-stat">
          <div className="rt-adm-stat__libelle">Infolettre</div>
          <div className="rt-adm-stat__valeur">{infolettre}</div>
          <div className="rt-adm-stat__sous">Consentement parmi les 10 derniers</div>
        </div>
        <div className="rt-adm-stat">
          <div className="rt-adm-stat__libelle">Dernière entrée</div>
          <div className="rt-adm-stat__valeur" style={{ fontSize: '1.05rem' }}>
            {derniers[0] ? formaterDateHeure(derniers[0].cree_le) : '—'}
          </div>
          <div className="rt-adm-stat__sous">{derniers[0]?.type_formulaire ?? ''}</div>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--rt-font-sous-titre)', fontSize: '1.3rem', margin: '2rem 0 1rem' }}>
        Derniers leads reçus
      </h2>

      {derniers.length === 0 ? (
        <div className="rt-adm-vide">
          Aucun lead enregistré pour l'instant. Dès qu'un formulaire est soumis sur le site public, il apparaîtra ici.
        </div>
      ) : (
        <div className="rt-adm-tableau-wrap">
          <table className="rt-adm-tableau">
            <thead>
              <tr>
                <th>Reçu le</th>
                <th>Personne</th>
                <th>Formulaire</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {derniers.map((l) => (
                <tr key={l.id}>
                  <td>{formaterDateHeure(l.cree_le)}</td>
                  <td>
                    <strong>{l.prenom} {l.nom}</strong><br />
                    <span style={{ color: 'var(--adm-texte-faible)', fontSize: '0.85em' }}>{l.courriel}</span>
                  </td>
                  <td>{l.type_formulaire}</td>
                  <td><span className={`rt-adm-statut rt-adm-statut--${l.statut}`}>{libelleStatut(l.statut)}</span></td>
                  <td><Link to={`/admin/leads/${l.id}`} className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small">Voir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
