// Client API du back-office. Toutes les requêtes envoient le cookie httpOnly
// de session via credentials: 'include'. Lance une ErreurApi sur les
// statuts >= 400 pour que les écrans puissent afficher un message clair.

const apiBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '/api';

export class ErreurApi extends Error {
  constructor(public statut: number, public corps: unknown, message: string) {
    super(message);
  }
}

async function appel<T>(chemin: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${apiBase}${chemin}`, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  let corps: unknown = null;
  try { corps = await r.json(); } catch { /* pas de JSON */ }
  if (!r.ok) {
    const msg = (corps as any)?.erreur || (corps as any)?.message || `Erreur ${r.status}`;
    throw new ErreurApi(r.status, corps, msg);
  }
  return corps as T;
}

export const api = {
  // Auth
  login: (nom: string, motDePasse: string) =>
    appel<{ ok: true; utilisateur: { id: number; nom: string; role: string } }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ nom, motDePasse }),
    }),
  logout: () => appel<{ ok: true }>('/admin/logout', { method: 'POST' }),
  me: () => appel<{ utilisateur: { id: number; nom: string; role: string } }>('/admin/me'),

  // Dashboard
  dashboard: () => appel<{ totalLeads: number; derniersLeads: Lead[] }>('/admin/dashboard'),

  // Leads
  listerLeads: (filtres: Record<string, string | number | undefined>) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(filtres)) {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    }
    return appel<{ leads: Lead[] }>(`/admin/leads?${qs.toString()}`);
  },
  detailLead: (id: number) =>
    appel<{ lead: Lead; etiquettes: Etiquette[] }>(`/admin/leads/${id}`),
  modifierLead: (id: number, champs: Partial<Lead>) =>
    appel<{ lead: Lead }>(`/admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify(champs) }),
  archiverLead: (id: number) =>
    appel<{ lead: Lead }>(`/admin/leads/${id}/archive`, { method: 'POST' }),

  // Tags
  listerTags: () => appel<{ tags: Etiquette[] }>('/admin/tags'),
  creerTag: (t: Partial<Etiquette>) =>
    appel<{ tag: Etiquette }>('/admin/tags', { method: 'POST', body: JSON.stringify(t) }),
  modifierTag: (id: number, t: Partial<Etiquette>) =>
    appel<{ tag: Etiquette }>(`/admin/tags/${id}`, { method: 'PATCH', body: JSON.stringify(t) }),
  supprimerTag: (id: number) =>
    appel<{ ok: true }>(`/admin/tags/${id}`, { method: 'DELETE' }),

  // Export CSV : on retourne directement la réponse brute pour pouvoir
  // déclencher un téléchargement côté composant.
  urlExport: (filtres: Record<string, string | undefined>) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(filtres)) {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    }
    return `${apiBase}/admin/leads/export?${qs.toString()}`;
  },
};

export type Lead = {
  id: number;
  prenom: string;
  nom: string;
  courriel: string;
  telephone: string | null;
  message: string | null;
  type_formulaire: string;
  source_entite: string | null;
  page_origine: string | null;
  statut: 'nouveau' | 'contacte' | 'qualifie' | 'client' | 'perdu' | 'archive';
  consentement: number;
  consentement_horodatage: string | null;
  consentement_infolettre: number;
  adresse_ip: string | null;
  notes_internes: string | null;
  cree_le: string;
  modifie_le: string;
  archive: number;
};

export type Etiquette = {
  id: number;
  nom: string;
  couleur: string | null;
  entite: string | null;
};
