import { useEffect, useState } from 'react';
import { PageHead } from '@/components/Head';
import { api, type Etiquette } from '../lib/api';

export default function AdminExport() {
  const [filtres, setFiltres] = useState({
    etiquette: '',
    statut: '',
    depuis: '',
    jusqu: '',
    separateur: ',',
  });
  const [tags, setTags] = useState<Etiquette[]>([]);
  const [enVol, setEnVol] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.listerTags().then((r) => setTags(r.tags)).catch(() => {});
  }, []);

  async function telecharger() {
    setEnVol(true);
    setMessage(null);
    try {
      const url = api.urlExport(filtres);
      const r = await fetch(url, { credentials: 'include' });
      if (!r.ok) throw new Error(`Statut ${r.status}`);
      const blob = await r.blob();
      const date = new Date().toISOString().slice(0, 10);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `leads-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMessage('Export téléchargé.');
    } catch (e: any) {
      setMessage(`Erreur : ${e.message}`);
    } finally {
      setEnVol(false);
    }
  }

  return (
    <>
      <PageHead titre="Export CSV — Back-office" description="" cheminCanonique="/admin/export" noindex />
      <div className="rt-admin-page__entete">
        <div>
          <h1 className="rt-admin-page__titre">Export CSV des leads</h1>
          <p className="rt-admin-page__intro">
            Sélectionnez les filtres puis téléchargez. Encodage UTF-8 avec BOM, compatible Excel et Bold Trail.
          </p>
        </div>
      </div>

      {message && (
        <div className={`rt-adm-message rt-adm-message--${message.startsWith('Erreur') ? 'erreur' : 'succes'}`}>
          {message}
        </div>
      )}

      <div className="rt-adm-bloc">
        <div className="rt-adm-fiche" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="rt-adm-champ">
            <label>Étiquette</label>
            <select value={filtres.etiquette} onChange={(e) => setFiltres((f) => ({ ...f, etiquette: e.target.value }))}>
              <option value="">Toutes</option>
              {tags.map((t) => <option key={t.id} value={t.nom}>{t.nom}</option>)}
            </select>
          </div>
          <div className="rt-adm-champ">
            <label>Statut</label>
            <select value={filtres.statut} onChange={(e) => setFiltres((f) => ({ ...f, statut: e.target.value }))}>
              <option value="">Tous</option>
              <option value="nouveau">Nouveau</option>
              <option value="contacte">Contacté</option>
              <option value="qualifie">Qualifié</option>
              <option value="client">Client</option>
              <option value="perdu">Perdu</option>
            </select>
          </div>
          <div className="rt-adm-champ">
            <label>Depuis</label>
            <input type="date" value={filtres.depuis} onChange={(e) => setFiltres((f) => ({ ...f, depuis: e.target.value }))} />
          </div>
          <div className="rt-adm-champ">
            <label>Jusqu'au</label>
            <input type="date" value={filtres.jusqu} onChange={(e) => setFiltres((f) => ({ ...f, jusqu: e.target.value }))} />
          </div>
          <div className="rt-adm-champ">
            <label>Séparateur</label>
            <select value={filtres.separateur} onChange={(e) => setFiltres((f) => ({ ...f, separateur: e.target.value }))}>
              <option value=",">Virgule (Bold Trail)</option>
              <option value=";">Point-virgule (Excel FR)</option>
            </select>
          </div>
        </div>
        <button className="rt-adm-btn rt-adm-btn--primaire" onClick={telecharger} disabled={enVol} style={{ marginTop: '1rem' }}>
          {enVol ? 'Génération…' : 'Télécharger le CSV'}
        </button>
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--adm-texte-faible)' }}>
        Les profils d'export nommés (mappage de colonnes spécifique à Bold Trail, Sunset, etc.) sont configurables côté serveur.
        La colonne d'export par défaut couvre les champs standards : prénom, nom, courriel, téléphone, source, entité, statut, date.
      </p>
    </>
  );
}
