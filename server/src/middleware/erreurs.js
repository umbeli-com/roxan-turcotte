// Gestionnaire d'erreurs centralisé. Toute exception non capturée arrive ici.

export function gestionnaireErreurs(err, req, res, _next) {
  // Validation Zod
  if (err && err.issues) {
    return res.status(400).json({ erreur: 'donnees-invalides', details: err.issues });
  }
  console.error('[erreur]', err);
  const statut = err.statut || err.status || 500;
  res.status(statut).json({ erreur: err.code || 'erreur-serveur', message: err.message });
}

export function pasTrouve(req, res) {
  res.status(404).json({ erreur: 'route-non-trouvee' });
}
