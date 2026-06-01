// Formatage des dates et nombres pour le back-office (locale Québec).

const dateFormat = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric', month: 'short', day: '2-digit',
});

const dateTimeFormat = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
});

export function formaterDate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return iso;
  return dateFormat.format(d);
}

export function formaterDateHeure(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return iso;
  return dateTimeFormat.format(d);
}

export function libelleStatut(s: string) {
  switch (s) {
    case 'nouveau': return 'Nouveau';
    case 'contacte': return 'Contacté';
    case 'qualifie': return 'Qualifié';
    case 'client': return 'Client';
    case 'perdu': return 'Perdu';
    case 'archive': return 'Archivé';
    default: return s;
  }
}
