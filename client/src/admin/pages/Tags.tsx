import { FormEvent, useEffect, useState } from 'react';
import { PageHead } from '@/components/Head';
import { api, type Etiquette } from '../lib/api';

export default function AdminTags() {
  const [tags, setTags] = useState<Etiquette[]>([]);
  const [nouveau, setNouveau] = useState({ nom: '', entite: '', couleur: '' });
  const [erreur, setErreur] = useState<string | null>(null);

  function recharger() {
    api.listerTags().then((r) => setTags(r.tags)).catch((e) => setErreur(e.message));
  }
  useEffect(recharger, []);

  async function onCreer(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    if (!nouveau.nom.trim()) return;
    try {
      await api.creerTag(nouveau);
      setNouveau({ nom: '', entite: '', couleur: '' });
      recharger();
    } catch (e: any) { setErreur(e.message); }
  }

  async function onSupprimer(id: number) {
    if (!confirm('Supprimer cette étiquette ? Elle sera retirée de tous les leads associés.')) return;
    try {
      await api.supprimerTag(id);
      recharger();
    } catch (e: any) { setErreur(e.message); }
  }

  return (
    <>
      <PageHead titre="Étiquettes — Back-office" description="" cheminCanonique="/admin/tags" noindex />
      <div className="rt-admin-page__entete">
        <div>
          <h1 className="rt-admin-page__titre">Étiquettes</h1>
          <p className="rt-admin-page__intro">Catégoriser les leads par source, entité ou objectif.</p>
        </div>
      </div>

      {erreur && <div className="rt-adm-message rt-adm-message--erreur">{erreur}</div>}

      <div className="rt-adm-bloc" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '1rem' }}>Créer une étiquette</h3>
        <form onSubmit={onCreer} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <div className="rt-adm-champ" style={{ margin: 0 }}>
            <label>Nom</label>
            <input value={nouveau.nom} onChange={(e) => setNouveau((n) => ({ ...n, nom: e.target.value }))} placeholder="ex. nouvelle-construction" required />
          </div>
          <div className="rt-adm-champ" style={{ margin: 0 }}>
            <label>Entité</label>
            <input value={nouveau.entite} onChange={(e) => setNouveau((n) => ({ ...n, entite: e.target.value }))} placeholder="royal-lepage, sunset…" />
          </div>
          <div className="rt-adm-champ" style={{ margin: 0 }}>
            <label>Couleur (#hex)</label>
            <input value={nouveau.couleur} onChange={(e) => setNouveau((n) => ({ ...n, couleur: e.target.value }))} placeholder="#C8A24A" />
          </div>
          <button type="submit" className="rt-adm-btn rt-adm-btn--primaire">Ajouter</button>
        </form>
      </div>

      {tags.length === 0 ? (
        <div className="rt-adm-vide">Aucune étiquette pour l'instant.</div>
      ) : (
        <div className="rt-adm-tableau-wrap">
          <table className="rt-adm-tableau">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Entité</th>
                <th>Couleur</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t) => (
                <tr key={t.id} style={{ cursor: 'default' }}>
                  <td><span className="rt-adm-tag">{t.nom}</span></td>
                  <td>{t.entite ?? '—'}</td>
                  <td>{t.couleur ?? '—'}</td>
                  <td>
                    <button className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small" onClick={() => onSupprimer(t.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
