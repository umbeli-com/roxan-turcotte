import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '@/components/Head';
import { api, type Partenaire, type Lead } from '../lib/api';
import { formaterDateHeure } from '../lib/format';

const VIDE = { slug: '', nom: '', role: '', courriel: '', entite: 'partenaire', description: '' };

export default function AdminPartenaires() {
  const [partenaires, setPartenaires] = useState<Partenaire[] | null>(null);
  const [message, setMessage] = useState<{ type: 'succes' | 'erreur'; texte: string } | null>(null);
  const [nouveau, setNouveau] = useState({ ...VIDE });
  const [courriels, setCourriels] = useState<Record<number, string>>({});
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);

  function charger() {
    api.listerPartenaires()
      .then((r) => {
        setPartenaires(r.partenaires);
        setCourriels(Object.fromEntries(r.partenaires.map((p) => [p.id, p.courriel ?? ''])));
      })
      .catch((e) => setMessage({ type: 'erreur', texte: e.message }));
  }

  useEffect(charger, []);

  async function enregistrer(id: number, champs: Partial<Partenaire>) {
    try {
      await api.modifierPartenaire(id, champs);
      setMessage({ type: 'succes', texte: 'Partenaire mis à jour.' });
      charger();
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    }
  }

  async function creer(e: React.FormEvent) {
    e.preventDefault();
    if (!nouveau.slug || !nouveau.nom) {
      setMessage({ type: 'erreur', texte: 'Le slug et le nom sont requis.' });
      return;
    }
    try {
      await api.creerPartenaire(nouveau);
      setNouveau({ ...VIDE });
      setMessage({ type: 'succes', texte: 'Partenaire ajouté.' });
      charger();
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    }
  }

  async function supprimer(p: Partenaire) {
    if (!confirm(`Supprimer le partenaire « ${p.nom} » ? Les leads existants ne sont pas supprimés.`)) return;
    try {
      await api.supprimerPartenaire(p.id);
      charger();
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    }
  }

  async function voirLeads(slug: string) {
    if (ouvert === slug) { setOuvert(null); return; }
    setOuvert(slug);
    setLeads(null);
    try {
      const r = await api.leadsPartenaire(slug);
      setLeads(r.leads);
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    }
  }

  return (
    <>
      <PageHead titre="Partenaires — Back-office" description="" cheminCanonique="/admin/partenaires" noindex />
      <div className="rt-admin-page__entete">
        <div>
          <h1 className="rt-admin-page__titre">Partenaires</h1>
          <p className="rt-admin-page__intro">
            Personnes à contacter affichées sur le site. Renseignez leur courriel : chaque lead qui leur est dirigé
            leur est transféré automatiquement (depuis l’adresse configurée), et vous pouvez revendre les leads ici.
          </p>
        </div>
      </div>

      {message && <div className={`rt-adm-message rt-adm-message--${message.type}`}>{message.texte}</div>}

      {partenaires === null ? (
        <div className="rt-adm-vide">Chargement…</div>
      ) : (
        <div className="rt-adm-tableau-wrap">
          <table className="rt-adm-tableau">
            <thead>
              <tr>
                <th>Personne</th>
                <th>Entité</th>
                <th>Courriel de transfert</th>
                <th>Actif</th>
                <th>Leads</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {partenaires.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.nom}</strong><br />
                    <span style={{ color: 'var(--adm-texte-faible)', fontSize: '0.85em' }}>{p.role}</span><br />
                    <span style={{ color: 'var(--adm-texte-faible)', fontSize: '0.78em' }}>{p.slug}</span>
                  </td>
                  <td>{p.entite ?? '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="email"
                        value={courriels[p.id] ?? ''}
                        placeholder="courriel@exemple.ca"
                        onChange={(e) => setCourriels((c) => ({ ...c, [p.id]: e.target.value }))}
                        style={{ minWidth: 0, flex: 1 }}
                      />
                      <button
                        className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small"
                        onClick={() => enregistrer(p.id, { courriel: courriels[p.id] ?? '' })}
                      >
                        OK
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={p.actif === 1}
                      aria-label={`Partenaire actif : ${p.nom}`}
                      onChange={(e) => enregistrer(p.id, { actif: e.target.checked ? 1 : 0 })}
                    />
                  </td>
                  <td>
                    <button className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small" onClick={() => voirLeads(p.slug)}>
                      {ouvert === p.slug ? 'Masquer' : 'Voir'}
                    </button>
                  </td>
                  <td>
                    <button className="rt-adm-btn rt-adm-btn--danger rt-adm-btn--small" onClick={() => supprimer(p)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ouvert && (
        <div className="rt-adm-bloc" style={{ marginTop: '1.5rem' }}>
          <h3>Leads dirigés vers « {ouvert} »</h3>
          {leads === null ? (
            <div className="rt-adm-vide">Chargement…</div>
          ) : leads.length === 0 ? (
            <div className="rt-adm-vide">Aucun lead pour ce partenaire pour l’instant.</div>
          ) : (
            <div className="rt-adm-tableau-wrap">
              <table className="rt-adm-tableau">
                <thead>
                  <tr><th>Reçu le</th><th>Personne</th><th>Coordonnées</th><th></th></tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id}>
                      <td>{formaterDateHeure(l.cree_le)}</td>
                      <td><strong>{l.prenom} {l.nom}</strong></td>
                      <td>
                        <a href={`mailto:${l.courriel}`}>{l.courriel}</a>
                        {l.telephone && <><br />{l.telephone}</>}
                      </td>
                      <td><Link to={`/admin/leads/${l.id}`} className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small">Ouvrir</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="rt-adm-bloc" style={{ marginTop: '2rem' }}>
        <h3>Ajouter un partenaire</h3>
        <form onSubmit={creer} className="rt-adm-filtres" style={{ alignItems: 'end' }}>
          <label>Slug<input value={nouveau.slug} onChange={(e) => setNouveau({ ...nouveau, slug: e.target.value })} placeholder="ex. courtier-hypothecaire" /></label>
          <label>Nom<input value={nouveau.nom} onChange={(e) => setNouveau({ ...nouveau, nom: e.target.value })} placeholder="Nom affiché" /></label>
          <label>Rôle<input value={nouveau.role} onChange={(e) => setNouveau({ ...nouveau, role: e.target.value })} placeholder="Ex. Courtier hypothécaire" /></label>
          <label>Courriel<input type="email" value={nouveau.courriel} onChange={(e) => setNouveau({ ...nouveau, courriel: e.target.value })} /></label>
          <label>Entité
            <select value={nouveau.entite} onChange={(e) => setNouveau({ ...nouveau, entite: e.target.value })}>
              <option value="partenaire">Partenaire</option>
              <option value="royal-lepage">Royal LePage</option>
              <option value="sunset">Sunset</option>
              <option value="chalets">Chalets</option>
            </select>
          </label>
          <button type="submit" className="rt-adm-btn rt-adm-btn--primaire">Ajouter</button>
        </form>
      </div>
    </>
  );
}
