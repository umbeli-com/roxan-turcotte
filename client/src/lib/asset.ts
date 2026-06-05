// Résout un chemin d'asset public en tenant compte de la base de déploiement
// (PUBLIC_BASE peut être un sous-chemin sur GitHub Pages, ex: /roxan-turcotte/).
// Les chemins passés sont relatifs au dossier public, sans slash de tête :
//   asset('marque/sunset.webp') -> '/marque/sunset.webp' (ou '/roxan-turcotte/marque/...').
export function asset(chemin: string): string {
  const base = (import.meta as any).env?.BASE_URL ?? '/';
  const propre = chemin.replace(/^\/+/, '');
  return `${base}${propre}`;
}
