export type Tranche = { plafond: number | null; taux: number };

// Calcul progressif : chaque taux s'applique uniquement à sa tranche.
export function calculerTranches(base: number, tranches: Tranche[]): number {
  let restant = base;
  let cumul = 0;
  let total = 0;
  for (const t of tranches) {
    const plafond = t.plafond ?? Infinity;
    const largeur = plafond - cumul;
    if (largeur <= 0) continue;
    const part = Math.min(restant, largeur);
    if (part <= 0) break;
    total += part * t.taux;
    restant -= part;
    cumul = plafond;
    if (restant <= 0) break;
  }
  return total;
}
