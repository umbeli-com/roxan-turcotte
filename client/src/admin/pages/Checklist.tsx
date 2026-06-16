import { useEffect, useMemo, useState } from 'react';
import { PageHead } from '@/components/Head';
import { api, type ChecklistItem, type EtatChecklist } from '../lib/api';

const ETATS: { val: EtatChecklist; libelle: string }[] = [
  { val: 'inclus', libelle: 'Inclus' },
  { val: 'exclus', libelle: 'Exclus' },
  { val: 'non-disponible', libelle: 'Non dispo.' },
  { val: 'autre', libelle: 'Autre' },
];

function genererMarkdown(
  items: ChecklistItem[],
  etats: Record<number, EtatChecklist>,
  notes: Record<number, string>,
): string {
  const par = (etat: EtatChecklist) => items.filter((i) => (etats[i.id] ?? i.etat_defaut) === etat);
  const inclus = par('inclus');
  const exclus = par('exclus');
  const autres = par('autre');
  const blocs: string[] = [];
  if (inclus.length) blocs.push('**INCLUSIONS**\n' + inclus.map((i) => `- ${i.libelle}`).join('\n'));
  if (exclus.length) blocs.push('**EXCLUSIONS**\n' + exclus.map((i) => `- ${i.libelle}`).join('\n'));
  if (autres.length)
    blocs.push(
      '**PRÉCISIONS**\n' +
        autres
          .map((i) => {
            const n = (notes[i.id] || '').trim();
            return `- ${i.libelle}${n ? ` : ${n}` : ''}`;
          })
          .join('\n'),
    );
  return blocs.join('\n\n');
}

export default function AdminChecklist() {
  const [items, setItems] = useState<ChecklistItem[] | null>(null);
  const [etats, setEtats] = useState<Record<number, EtatChecklist>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [mode, setMode] = useState<'remplir' | 'parametres'>('remplir');
  const [message, setMessage] = useState<{ type: 'succes' | 'erreur'; texte: string } | null>(null);
  const [nouveau, setNouveau] = useState<{ libelle: string; categorie: string; etat_defaut: EtatChecklist }>({
    libelle: '',
    categorie: '',
    etat_defaut: 'inclus',
  });

  function charger() {
    api
      .listerChecklist()
      .then((r) => {
        setItems(r.items);
        // Conserve les choix en cours ; les nouveaux items prennent leur défaut.
        setEtats((prev) => Object.fromEntries(r.items.map((i) => [i.id, prev[i.id] ?? i.etat_defaut])));
      })
      .catch((e) => setMessage({ type: 'erreur', texte: e.message }));
  }

  useEffect(charger, []);

  const groupes = useMemo(() => {
    const g: Record<string, ChecklistItem[]> = {};
    (items ?? []).forEach((i) => {
      const c = i.categorie || 'Autres';
      (g[c] ??= []).push(i);
    });
    return g;
  }, [items]);

  const markdown = useMemo(() => genererMarkdown(items ?? [], etats, notes), [items, etats, notes]);

  function reinitialiser() {
    if (!items) return;
    setEtats(Object.fromEntries(items.map((i) => [i.id, i.etat_defaut])));
    setNotes({});
    setMessage({ type: 'succes', texte: 'Choix réinitialisés selon les valeurs par défaut.' });
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(markdown);
      setMessage({ type: 'succes', texte: 'Markdown copié dans le presse-papiers.' });
    } catch {
      setMessage({ type: 'erreur', texte: 'Copie automatique impossible — sélectionnez le texte et copiez (Ctrl/Cmd+C).' });
    }
  }

  async function majItem(id: number, champs: Partial<ChecklistItem>) {
    try {
      await api.modifierChecklistItem(id, champs);
      charger();
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    }
  }

  async function supprimer(item: ChecklistItem) {
    if (!confirm(`Supprimer « ${item.libelle} » de la check-list ?`)) return;
    try {
      await api.supprimerChecklistItem(item.id);
      charger();
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    }
  }

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    if (!nouveau.libelle.trim()) {
      setMessage({ type: 'erreur', texte: 'Le libellé est requis.' });
      return;
    }
    try {
      await api.creerChecklistItem({
        libelle: nouveau.libelle.trim(),
        categorie: nouveau.categorie.trim() || null,
        etat_defaut: nouveau.etat_defaut,
      });
      setNouveau({ libelle: '', categorie: '', etat_defaut: 'inclus' });
      charger();
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    }
  }

  async function deplacer(item: ChecklistItem, dir: 'up' | 'down') {
    if (!items) return;
    const tri = [...items].sort((a, b) => a.ordre - b.ordre);
    const idx = tri.findIndex((i) => i.id === item.id);
    const cible = dir === 'up' ? idx - 1 : idx + 1;
    if (cible < 0 || cible >= tri.length) return;
    const autre = tri[cible];
    try {
      await api.modifierChecklistItem(item.id, { ordre: autre.ordre });
      await api.modifierChecklistItem(autre.id, { ordre: item.ordre });
      charger();
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    }
  }

  return (
    <>
      <PageHead titre="Inclusions / Exclusions — Back-office" description="" cheminCanonique="/admin/checklist" noindex />
      <div className="rt-admin-page__entete">
        <div>
          <h1 className="rt-admin-page__titre">Inclusions / Exclusions</h1>
          <p className="rt-admin-page__intro">
            Cochez ce que le client veut inclure, exclure ou ce qui n’est pas disponible, puis copiez la liste Markdown
            dans la section « inclusions et exclusions » du contrat.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`rt-adm-btn ${mode === 'remplir' ? 'rt-adm-btn--primaire' : 'rt-adm-btn--ghost'}`}
            onClick={() => setMode('remplir')}
          >
            Remplir
          </button>
          <button
            className={`rt-adm-btn ${mode === 'parametres' ? 'rt-adm-btn--primaire' : 'rt-adm-btn--ghost'}`}
            onClick={() => setMode('parametres')}
          >
            Paramètres
          </button>
        </div>
      </div>

      {message && <div className={`rt-adm-message rt-adm-message--${message.type}`}>{message.texte}</div>}

      {items === null ? (
        <div className="rt-adm-vide">Chargement…</div>
      ) : mode === 'remplir' ? (
        <div className="checklist-layout">
          <div className="checklist-items">
            {Object.entries(groupes).map(([cat, lignes]) => (
              <div className="checklist-groupe" key={cat}>
                <h3 className="checklist-groupe__titre">{cat}</h3>
                {lignes.map((it) => {
                  const etat = etats[it.id] ?? it.etat_defaut;
                  return (
                    <div className="checklist-ligne" key={it.id}>
                      <span className="checklist-ligne__libelle">{it.libelle}</span>
                      <div className="checklist-seg" role="group" aria-label={it.libelle}>
                        {ETATS.map((e) => (
                          <button
                            key={e.val}
                            type="button"
                            className={`checklist-seg__btn checklist-seg__btn--${e.val} ${etat === e.val ? 'actif' : ''}`}
                            aria-pressed={etat === e.val}
                            onClick={() => setEtats((p) => ({ ...p, [it.id]: e.val }))}
                          >
                            {e.libelle}
                          </button>
                        ))}
                      </div>
                      {etat === 'autre' && (
                        <input
                          className="checklist-note"
                          placeholder="Précision (ex. loué, à négocier)"
                          value={notes[it.id] ?? ''}
                          onChange={(ev) => setNotes((p) => ({ ...p, [it.id]: ev.target.value }))}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ marginTop: '1rem' }}>
              <button className="rt-adm-btn rt-adm-btn--ghost" onClick={reinitialiser}>
                Réinitialiser les choix
              </button>
            </div>
          </div>

          <aside className="checklist-resultat">
            <div className="checklist-resultat__tete">
              <h3>Résultat (Markdown)</h3>
              <button className="rt-adm-btn rt-adm-btn--primaire rt-adm-btn--small" onClick={copier}>
                Copier
              </button>
            </div>
            <textarea className="checklist-md" readOnly value={markdown} aria-label="Liste en Markdown" />
            <p className="checklist-resultat__aide">
              « Non dispo. » est ignoré. « Autre » apparaît sous Précisions avec sa note.
            </p>
          </aside>
        </div>
      ) : (
        <div className="rt-adm-bloc">
          <h3>Paramètres du modèle</h3>
          <p style={{ color: 'var(--adm-texte-faible)', marginTop: 0 }}>
            Modifiez les items proposés et leur état coché par défaut. Ces réglages s’appliquent à toutes les futures
            check-lists.
          </p>
          <div className="rt-adm-tableau-wrap">
            <table className="rt-adm-tableau">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Catégorie</th>
                  <th>Par défaut</th>
                  <th>Ordre</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {[...items]
                  .sort((a, b) => a.ordre - b.ordre)
                  .map((it) => (
                    <tr key={it.id}>
                      <td>
                        <input
                          defaultValue={it.libelle}
                          onBlur={(e) => e.target.value.trim() && e.target.value !== it.libelle && majItem(it.id, { libelle: e.target.value.trim() })}
                          style={{ minWidth: 200 }}
                        />
                      </td>
                      <td>
                        <input
                          defaultValue={it.categorie ?? ''}
                          onBlur={(e) => e.target.value !== (it.categorie ?? '') && majItem(it.id, { categorie: e.target.value.trim() || null })}
                          style={{ minWidth: 160 }}
                        />
                      </td>
                      <td>
                        <select
                          value={it.etat_defaut}
                          onChange={(e) => majItem(it.id, { etat_defaut: e.target.value as EtatChecklist })}
                        >
                          {ETATS.map((e) => (
                            <option key={e.val} value={e.val}>{e.libelle}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small" onClick={() => deplacer(it, 'up')} aria-label="Monter">↑</button>
                          <button className="rt-adm-btn rt-adm-btn--ghost rt-adm-btn--small" onClick={() => deplacer(it, 'down')} aria-label="Descendre">↓</button>
                        </div>
                      </td>
                      <td>
                        <button className="rt-adm-btn rt-adm-btn--danger rt-adm-btn--small" onClick={() => supprimer(it)}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={ajouter} className="rt-adm-filtres" style={{ marginTop: '1.5rem', alignItems: 'end' }}>
            <label>
              Nouvel item
              <input value={nouveau.libelle} onChange={(e) => setNouveau({ ...nouveau, libelle: e.target.value })} placeholder="Ex. Cabanon de jardin" />
            </label>
            <label>
              Catégorie
              <input value={nouveau.categorie} onChange={(e) => setNouveau({ ...nouveau, categorie: e.target.value })} placeholder="Ex. Extérieur" />
            </label>
            <label>
              Par défaut
              <select value={nouveau.etat_defaut} onChange={(e) => setNouveau({ ...nouveau, etat_defaut: e.target.value as EtatChecklist })}>
                {ETATS.map((e) => (
                  <option key={e.val} value={e.val}>{e.libelle}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="rt-adm-btn rt-adm-btn--primaire">Ajouter</button>
          </form>
        </div>
      )}
    </>
  );
}
