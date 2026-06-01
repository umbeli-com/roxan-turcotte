import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHead } from '@/components/Head';
import { api, type Lead, type Etiquette } from '../lib/api';
import { formaterDateHeure, libelleStatut } from '../lib/format';

const STATUTS = ['nouveau', 'contacte', 'qualifie', 'client', 'perdu', 'archive'];

export default function AdminLeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [etiquettes, setEtiquettes] = useState<Etiquette[]>([]);
  const [notes, setNotes] = useState('');
  const [statut, setStatut] = useState('nouveau');
  const [enVol, setEnVol] = useState(false);
  const [message, setMessage] = useState<{ type: 'succes' | 'erreur'; texte: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    api.detailLead(Number(id))
      .then((r) => {
        setLead(r.lead);
        setEtiquettes(r.etiquettes);
        setNotes(r.lead.notes_internes ?? '');
        setStatut(r.lead.statut);
      })
      .catch((e) => setMessage({ type: 'erreur', texte: e.message }));
  }, [id]);

  async function sauvegarder() {
    if (!lead) return;
    setEnVol(true);
    setMessage(null);
    try {
      const r = await api.modifierLead(lead.id, { statut: statut as Lead['statut'], notes_internes: notes });
      setLead(r.lead);
      setMessage({ type: 'succes', texte: 'Modifications enregistrées.' });
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
    } finally {
      setEnVol(false);
    }
  }

  async function archiver() {
    if (!lead) return;
    if (!confirm(`Archiver le lead de ${lead.prenom} ${lead.nom} ?`)) return;
    setEnVol(true);
    try {
      await api.archiverLead(lead.id);
      navigate('/admin/leads', { replace: true });
    } catch (e: any) {
      setMessage({ type: 'erreur', texte: e.message });
      setEnVol(false);
    }
  }

  if (!lead) {
    return (
      <>
        <PageHead titre="Détail du lead" description="" cheminCanonique={`/admin/leads/${id}`} noindex />
        <div className="rt-adm-vide">{message?.texte ?? 'Chargement…'}</div>
      </>
    );
  }

  return (
    <>
      <PageHead titre={`${lead.prenom} ${lead.nom} — Lead`} description="" cheminCanonique={`/admin/leads/${id}`} noindex />
      <div className="rt-admin-page__entete">
        <div>
          <h1 className="rt-admin-page__titre">{lead.prenom} {lead.nom}</h1>
          <p className="rt-admin-page__intro">
            Reçu le {formaterDateHeure(lead.cree_le)} via <strong>{lead.type_formulaire}</strong>
            {lead.source_entite && <> — entité <strong>{lead.source_entite}</strong></>}.
          </p>
        </div>
        <Link to="/admin/leads" className="rt-adm-btn rt-adm-btn--ghost">← Liste des leads</Link>
      </div>

      {message && <div className={`rt-adm-message rt-adm-message--${message.type}`}>{message.texte}</div>}

      <div className="rt-adm-fiche" style={{ marginTop: '1rem' }}>
        <div className="rt-adm-bloc">
          <h3>Coordonnées et message</h3>
          <dl className="rt-adm-prop">
            <dt>Courriel</dt><dd><a href={`mailto:${lead.courriel}`}>{lead.courriel}</a></dd>
            <dt>Téléphone</dt><dd>{lead.telephone ? <a href={`tel:${lead.telephone}`}>{lead.telephone}</a> : '—'}</dd>
            <dt>Page d'origine</dt><dd>{lead.page_origine ?? '—'}</dd>
            <dt>Adresse IP</dt><dd>{lead.adresse_ip ?? '—'}</dd>
            <dt>Consentement</dt><dd>{lead.consentement ? `Oui (${formaterDateHeure(lead.consentement_horodatage)})` : 'Non'}</dd>
            <dt>Infolettre</dt><dd>{lead.consentement_infolettre ? 'Oui' : 'Non'}</dd>
            <dt>Étiquettes</dt>
            <dd>
              {etiquettes.length === 0 ? <span style={{ color: 'var(--adm-texte-faible)' }}>Aucune</span>
                : etiquettes.map((t) => <span key={t.id} className="rt-adm-tag">{t.nom}</span>)}
            </dd>
          </dl>
          {lead.message && (
            <>
              <h3 style={{ marginTop: '1.5rem' }}>Message du lead</h3>
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--adm-texte)', background: 'var(--adm-fond)', border: '1px solid var(--adm-ligne)', padding: '1rem', borderRadius: '6px' }}>
                {lead.message}
              </div>
            </>
          )}
        </div>

        <div className="rt-adm-bloc">
          <h3>Suivi</h3>
          <div className="rt-adm-champ">
            <label htmlFor="statut">Statut</label>
            <select id="statut" value={statut} onChange={(e) => setStatut(e.target.value)}>
              {STATUTS.map((s) => <option key={s} value={s}>{libelleStatut(s)}</option>)}
            </select>
          </div>
          <div className="rt-adm-champ">
            <label htmlFor="notes">Notes internes</label>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Suivi de l'appel, contexte, prochaine action…" />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="rt-adm-btn rt-adm-btn--primaire" onClick={sauvegarder} disabled={enVol}>
              {enVol ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button className="rt-adm-btn rt-adm-btn--ghost" onClick={archiver} disabled={enVol}>
              Archiver
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
