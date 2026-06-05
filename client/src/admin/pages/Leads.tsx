import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHead } from '@/components/Head';
import { api, type Lead, type Etiquette, type Partenaire } from '../lib/api';
import { formaterDateHeure, libelleStatut } from '../lib/format';

const STATUTS = ['', 'nouveau', 'contacte', 'qualifie', 'client', 'perdu', 'archive'];

export default function AdminLeads() {
  const [params, setParams] = useSearchParams();
  const recherche = params.get('recherche') ?? '';
  const statut = params.get('statut') ?? '';
  const etiquette = params.get('etiquette') ?? '';
  const sourceEntite = params.get('sourceEntite') ?? '';
  const profil = params.get('profil') ?? '';

  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [tags, setTags] = useState<Etiquette[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    api.listerTags().then((r) => setTags(r.tags)).catch(() => {});
    api.listerPartenaires().then((r) => setPartenaires(r.partenaires)).catch(() => {});
  }, []);

  useEffect(() => {
    setLeads(null);
    api.listerLeads({ recherche, statut, etiquette, sourceEntite, profil, limite: 100 })
      .then((r) => setLeads(r.leads))
      .catch((e) => setErreur(e.message));
  }, [recherche, statut, etiquette, sourceEntite, profil]);

  function setParam(cle: string, val: string) {
    const next = new URLSearchParams(params);
    if (val) next.set(cle, val); else next.delete(cle);
    setParams(next, { replace: true });
  }

  return (
    <>
      <PageHead titre="Leads — Back-office" description="" cheminCanonique="/admin/leads" noindex />
      <div className="rt-admin-page__entete">
        <div>
          <h1 className="rt-admin-page__titre">Leads</h1>
          <p className="rt-admin-page__intro">{leads?.length ?? '…'} résultat{(leads?.length ?? 0) > 1 ? 's' : ''} avec les filtres actuels.</p>
        </div>
        <Link to="/admin/export" className="rt-adm-btn rt-adm-btn--primaire">Exporter en CSV</Link>
      </div>

      <div className="rt-adm-filtres">
        <label>
          Recherche
          <input type="search" value={recherche} placeholder="Nom, courriel, téléphone…"
            onChange={(e) => setParam('recherche', e.target.value)} />
        </label>
        <label>
          Statut
          <select value={statut} onChange={(e) => setParam('statut', e.target.value)}>
            {STATUTS.map((s) => <option key={s} value={s}>{s ? libelleStatut(s) : 'Tous'}</option>)}
          </select>
        </label>
        <label>
          Étiquette
          <select value={etiquette} onChange={(e) => setParam('etiquette', e.target.value)}>
            <option value="">Toutes</option>
            {tags.map((t) => <option key={t.id} value={t.nom}>{t.nom}</option>)}
          </select>
        </label>
        <label>
          Entité
          <select value={sourceEntite} onChange={(e) => setParam('sourceEntite', e.target.value)}>
            <option value="">Toutes</option>
            <option value="royal-lepage">Royal LePage</option>
            <option value="sunset">Sunset</option>
            <option value="chalets">Chalets</option>
          </select>
        </label>
        <label>
          Partenaire
          <select value={profil} onChange={(e) => setParam('profil', e.target.value)}>
            <option value="">Tous</option>
            {partenaires.map((p) => <option key={p.id} value={p.slug}>{p.nom} — {p.role}</option>)}
          </select>
        </label>
      </div>

      {erreur && <div className="rt-adm-message rt-adm-message--erreur">{erreur}</div>}

      {leads === null ? (
        <div className="rt-adm-vide">Chargement…</div>
      ) : leads.length === 0 ? (
        <div className="rt-adm-vide">Aucun lead ne correspond aux filtres.</div>
      ) : (
        <div className="rt-adm-tableau-wrap">
          <table className="rt-adm-tableau">
            <thead>
              <tr>
                <th>Reçu le</th>
                <th>Personne</th>
                <th>Formulaire</th>
                <th>Entité</th>
                <th>Partenaire</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>{formaterDateHeure(l.cree_le)}</td>
                  <td>
                    <strong>{l.prenom} {l.nom}</strong><br />
                    <span style={{ color: 'var(--adm-texte-faible)', fontSize: '0.85em' }}>{l.courriel}</span><br />
                    {l.telephone && <span style={{ color: 'var(--adm-texte-faible)', fontSize: '0.85em' }}>{l.telephone}</span>}
                  </td>
                  <td>
                    {l.type_formulaire}
                    {l.page_origine && <div style={{ color: 'var(--adm-texte-faible)', fontSize: '0.78em' }}>{l.page_origine}</div>}
                  </td>
                  <td>{l.source_entite ?? '—'}</td>
                  <td>{l.profil_slug ? <span className="rt-adm-tag">{l.profil_slug}</span> : '—'}</td>
                  <td><span className={`rt-adm-statut rt-adm-statut--${l.statut}`}>{libelleStatut(l.statut)}</span></td>
                  <td><Link to={`/admin/leads/${l.id}`} className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small">Ouvrir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
