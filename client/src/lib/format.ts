// Utilitaires de formatage québécois (devise CAD, séparateur d'espace).

const formateurCAD = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

const formateurCADprecis = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 2,
});

const formateurPourcent = new Intl.NumberFormat('fr-CA', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});

export function dollarsArrondis(n: number) {
  if (!Number.isFinite(n)) return '—';
  return formateurCAD.format(Math.round(n));
}

export function dollars(n: number) {
  if (!Number.isFinite(n)) return '—';
  return formateurCADprecis.format(n);
}

export function fourchette(min: number, max: number) {
  return `${dollarsArrondis(min)} – ${dollarsArrondis(max)}`;
}

export function pourcent(n: number) {
  return formateurPourcent.format(n);
}
