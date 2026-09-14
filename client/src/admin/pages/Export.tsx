import { useEffect, useState } from 'react';
import { PageHead } from '@/components/Head';
import { api, type Etiquette } from '../lib/api';

export default function AdminExport() {
  const [filtres, setFiltres] = useState({
    profil: 'kvcore',
    sourceEntite: '',
    agent: '',
    etiquette: '',
    statut: '',
    depuis: '',
    jusqu: '',
    separateur: ',',
  });
  const [tags, setTags] = useState<Etiquette[]>([]);
  const [profils, setProfils] = useState<{ id: number; nom: string; separateur: string }[]>([]);
  const [enVol, setEnVol] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const kvcore = filtres.profil === 'kvcore';

  useEffect(() => {
    api.listerTags().then((r) => setTags(r.tags)).catch(() => {});
    api.listerProfilsExport().then((r) => setProfils(r.profils)).catch(() => {});
  }, []);

  async function telecharger() {
    setEnVol(true);
    setMessage(null);
    try {
      const url = api.urlExport({ ...filtres, agent: kvcore ? filtres.agent.trim() : '', separateur: kvcore ? ',' : filtres.separateur });
      const r = await fetch(url, { credentials: 'include' });
      if (!r.ok) {
        const erreur = await r.json().catch(() => null);
        throw new Error(erreur?.erreur ?? `Statut ${r.status}`);
      }
      const blob = await r.blob();
      const date = new Date().toISOString().slice(0, 10);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `leads-${kvcore ? 'kvcore-' : ''}${date}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      setMessage('Export téléchargé.');
    } catch (e: any) {
      setMessage(`Erreur : ${e.message}`);
    } finally {
      setEnVol(false);
    }
  }

  return (
    <>
      <PageHead titre="Export CSV | Back-office" description="" cheminCanonique="/admin/export" noindex />
      <div className="rt-admin-page__entete">
        <div>
          <h1 className="rt-admin-page__titre">Export CSV des leads</h1>
          <p className="rt-admin-page__intro">
            Choisissez le format de votre CRM, filtrez les contacts puis téléchargez le fichier à importer.
          </p>
        </div>
      </div>

      {message && (
        <div role="status" className={`rt-adm-message rt-adm-message--${message.startsWith('Erreur') ? 'erreur' : 'succes'}`}>
          {message}
        </div>
      )}

      <form className="rt-adm-bloc" onSubmit={(e) => { e.preventDefault(); void telecharger(); }}>
        <div className="rt-adm-fiche" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="rt-adm-champ">
            <label htmlFor="export-profil">Format d'export</label>
            <select id="export-profil" value={filtres.profil} onChange={(e) => setFiltres((f) => ({ ...f, profil: e.target.value }))}>
              <option value="kvcore">kvCORE / BoldTrail (modèle fourni)</option>
              <option value="">Standard (colonnes en français)</option>
              {profils.filter((p) => p.nom !== 'kvcore').map((p) => <option key={p.id} value={p.nom}>{p.nom}</option>)}
            </select>
          </div>
          <div className="rt-adm-champ">
            <label htmlFor="export-entite">Entité</label>
            <input id="export-entite" list="export-entites" value={filtres.sourceEntite}
              placeholder="Toutes les entités"
              onChange={(e) => setFiltres((f) => ({ ...f, sourceEntite: e.target.value }))} />
            <datalist id="export-entites">
              <option value="royal-lepage">Royal LePage</option>
              <option value="sunset">Sunset</option>
              <option value="chalets">Chalets</option>
              <option value="investissement">Investissement</option>
              <option value="commercial">Commercial</option>
              <option value="international">International</option>
            </datalist>
          </div>
          <div className="rt-adm-champ">
            <label htmlFor="export-etiquette">Étiquette</label>
            <select id="export-etiquette" value={filtres.etiquette} onChange={(e) => setFiltres((f) => ({ ...f, etiquette: e.target.value }))}>
              <option value="">Toutes</option>
              {tags.map((t) => <option key={t.id} value={t.nom}>{t.nom}</option>)}
            </select>
          </div>
          <div className="rt-adm-champ">
            <label htmlFor="export-statut">Statut</label>
            <select id="export-statut" value={filtres.statut} onChange={(e) => setFiltres((f) => ({ ...f, statut: e.target.value }))}>
              <option value="">Tous</option>
              <option value="nouveau">Nouveau</option>
              <option value="contacte">Contacté</option>
              <option value="qualifie">Qualifié</option>
              <option value="client">Client</option>
              <option value="perdu">Perdu</option>
              <option value="archive">Archivé</option>
            </select>
          </div>
          <div className="rt-adm-champ">
            <label htmlFor="export-depuis">Depuis</label>
            <input id="export-depuis" type="date" max={filtres.jusqu || undefined} value={filtres.depuis} onChange={(e) => setFiltres((f) => ({ ...f, depuis: e.target.value }))} />
          </div>
          <div className="rt-adm-champ">
            <label htmlFor="export-jusqu">Jusqu'au (inclus)</label>
            <input id="export-jusqu" type="date" min={filtres.depuis || undefined} value={filtres.jusqu} onChange={(e) => setFiltres((f) => ({ ...f, jusqu: e.target.value }))} />
          </div>
          {kvcore ? (
            <div className="rt-adm-champ">
              <label htmlFor="export-agent">Courriel du courtier dans kvCORE (facultatif)</label>
              <input id="export-agent" type="email" value={filtres.agent}
                onChange={(e) => setFiltres((f) => ({ ...f, agent: e.target.value }))} />
            </div>
          ) : !filtres.profil ? (
            <div className="rt-adm-champ">
              <label htmlFor="export-separateur">Séparateur</label>
              <select id="export-separateur" value={filtres.separateur} onChange={(e) => setFiltres((f) => ({ ...f, separateur: e.target.value }))}>
                <option value=",">Virgule</option>
                <option value=";">Point-virgule (Excel FR)</option>
              </select>
            </div>
          ) : null}
        </div>
        <button type="submit" className="rt-adm-btn rt-adm-btn--primaire" disabled={enVol} style={{ marginTop: '1rem' }}>
          {enVol ? 'Génération…' : 'Télécharger le CSV'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--adm-texte-faible)' }}>
        {kvcore
          ? "Le format kvCORE reprend les 37 colonnes du modèle fourni, les étiquettes et les notes. Les renseignements non recueillis restent vides. Les courriels suivent le consentement à l'infolettre et les désinscriptions; les SMS et les appels sont désactivés."
          : filtres.profil
            ? "Les colonnes et le séparateur du profil enregistré sont appliqués au téléchargement."
            : 'Le format standard contient le prénom, le nom, le courriel, le téléphone, le formulaire, l’entité, le statut et la date de réception.'}
      </p>
    </>
  );
}
