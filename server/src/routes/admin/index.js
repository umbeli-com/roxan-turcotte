import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import * as leadsRepo from '../../db/repositories/leads.js';
import { tagsRepo } from '../../db/repositories/tags.js';
import { guidesRepo } from '../../db/repositories/guides.js';
import { newsletterRepo } from '../../db/repositories/newsletter.js';
import {
  municipalitesRepo,
  exportProfilesRepo,
  dataRequestsRepo,
  incidentsRepo,
  adminUsersRepo,
} from '../../db/repositories/divers.js';
import { partenairesRepo } from '../../db/repositories/partenaires.js';
import { checklistRepo } from '../../db/repositories/checklist.js';
import { genererCSV } from '../../services/csv-export.js';
import { exigerAdmin, signerSession, optionsCookieSession } from '../../middleware/auth.js';

export const routesAdmin = Router();

// Auth
routesAdmin.post('/login', async (req, res, next) => {
  try {
    const { nom, motDePasse } = z.object({ nom: z.string().min(1), motDePasse: z.string().min(1) }).parse(req.body);
    const user = adminUsersRepo.parNomUtilisateur(nom);
    if (!user) return res.status(401).json({ erreur: 'identifiants-invalides' });
    const ok = await bcrypt.compare(motDePasse, user.mot_de_passe_hash);
    if (!ok) return res.status(401).json({ erreur: 'identifiants-invalides' });
    const jeton = signerSession({ id: user.id, nom: user.nom_utilisateur, role: user.role });
    res.cookie('rt_session', jeton, optionsCookieSession);
    res.json({ ok: true, utilisateur: { id: user.id, nom: user.nom_utilisateur, role: user.role } });
  } catch (e) { next(e); }
});
routesAdmin.post('/logout', (req, res) => { res.clearCookie('rt_session'); res.json({ ok: true }); });
routesAdmin.get('/me', exigerAdmin, (req, res) => { res.json({ utilisateur: req.utilisateur }); });

// Tableau de bord
routesAdmin.get('/dashboard', exigerAdmin, (req, res) => {
  const total = leadsRepo.compter();
  const recents = leadsRepo.lister({ limite: 10 });
  res.json({ totalLeads: total, derniersLeads: recents });
});

// Leads CRUD
routesAdmin.get('/leads', exigerAdmin, (req, res) => {
  res.json({ leads: leadsRepo.lister(req.query) });
});
routesAdmin.get('/leads/:id', exigerAdmin, (req, res) => {
  const lead = leadsRepo.trouver(Number(req.params.id));
  if (!lead) return res.status(404).json({ erreur: 'lead-introuvable' });
  const partenaire = lead.profil_slug ? partenairesRepo.parSlug(lead.profil_slug) : null;
  res.json({ lead, etiquettes: leadsRepo.etiquettesDuLead(lead.id), partenaire });
});
routesAdmin.patch('/leads/:id', exigerAdmin, (req, res) => {
  const lead = leadsRepo.modifier(Number(req.params.id), req.body);
  res.json({ lead });
});
routesAdmin.post('/leads/:id/archive', exigerAdmin, (req, res) => {
  res.json({ lead: leadsRepo.archiver(Number(req.params.id)) });
});
routesAdmin.delete('/leads/:id', exigerAdmin, (req, res) => {
  leadsRepo.supprimer(Number(req.params.id));
  res.json({ ok: true });
});

// Export CSV paramétré : profil = nom du profil OU JSON inline
routesAdmin.get('/leads/export', exigerAdmin, (req, res) => {
  const { profil, etiquette, statut, depuis, jusqu, separateur } = req.query;
  let colonnes = [
    { cle: 'prenom', titre: 'Prénom' },
    { cle: 'nom', titre: 'Nom' },
    { cle: 'courriel', titre: 'Courriel' },
    { cle: 'telephone', titre: 'Téléphone' },
    { cle: 'type_formulaire', titre: 'Source du formulaire' },
    { cle: 'source_entite', titre: 'Entité' },
    { cle: 'statut', titre: 'Statut' },
    { cle: 'cree_le', titre: 'Reçu le' },
  ];
  let sep = (separateur || ',').toString();
  if (profil) {
    const p = exportProfilesRepo.lister().find((x) => x.nom === profil);
    if (!p) return res.status(404).json({ erreur: 'profil-introuvable' });
    colonnes = JSON.parse(p.colonnes);
    sep = p.separateur || ',';
  }
  const lignes = leadsRepo.lister({ etiquette, statut, depuis, jusqu, limite: 50_000 });
  const csv = genererCSV(colonnes, lignes, sep);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
  res.send(csv);
});

// Tags
routesAdmin.get('/tags', exigerAdmin, (req, res) => res.json({ tags: tagsRepo.lister() }));
routesAdmin.post('/tags', exigerAdmin, (req, res) => res.json({ tag: tagsRepo.creer(req.body) }));
routesAdmin.patch('/tags/:id', exigerAdmin, (req, res) => res.json({ tag: tagsRepo.modifier(Number(req.params.id), req.body) }));
routesAdmin.delete('/tags/:id', exigerAdmin, (req, res) => { tagsRepo.supprimer(Number(req.params.id)); res.json({ ok: true }); });

// Partenaires (profils « personnes à contacter » — mini-CRM de revente)
routesAdmin.get('/partenaires', exigerAdmin, (req, res) => res.json({ partenaires: partenairesRepo.lister() }));
routesAdmin.post('/partenaires', exigerAdmin, (req, res) => res.json({ partenaire: partenairesRepo.creer(req.body) }));
routesAdmin.patch('/partenaires/:id', exigerAdmin, (req, res) => res.json({ partenaire: partenairesRepo.modifier(Number(req.params.id), req.body) }));
routesAdmin.delete('/partenaires/:id', exigerAdmin, (req, res) => { partenairesRepo.supprimer(Number(req.params.id)); res.json({ ok: true }); });
routesAdmin.get('/partenaires/:slug/leads', exigerAdmin, (req, res) => res.json({ leads: partenairesRepo.leadsParSlug(req.params.slug) }));

// Check-list d'inclusions / exclusions (modèle d'items configurable)
routesAdmin.get('/checklist-items', exigerAdmin, (req, res) => res.json({ items: checklistRepo.lister() }));
routesAdmin.post('/checklist-items', exigerAdmin, (req, res) => res.json({ item: checklistRepo.creer(req.body) }));
routesAdmin.patch('/checklist-items/:id', exigerAdmin, (req, res) => res.json({ item: checklistRepo.modifier(Number(req.params.id), req.body) }));
routesAdmin.delete('/checklist-items/:id', exigerAdmin, (req, res) => { checklistRepo.supprimer(Number(req.params.id)); res.json({ ok: true }); });

// Guides
routesAdmin.get('/guides', exigerAdmin, (req, res) => res.json({ guides: guidesRepo.lister() }));
routesAdmin.post('/guides', exigerAdmin, (req, res) => res.json({ guide: guidesRepo.creer(req.body) }));
routesAdmin.patch('/guides/:id', exigerAdmin, (req, res) => res.json({ guide: guidesRepo.modifier(Number(req.params.id), req.body) }));
routesAdmin.delete('/guides/:id', exigerAdmin, (req, res) => { guidesRepo.supprimer(Number(req.params.id)); res.json({ ok: true }); });

// Infolettre
routesAdmin.get('/newsletter/subscribers', exigerAdmin, (req, res) => res.json({ abonnes: newsletterRepo.lister() }));
routesAdmin.get('/newsletter/campaigns', exigerAdmin, (req, res) => res.json({ campagnes: newsletterRepo.campagnes() }));
routesAdmin.post('/newsletter/campaigns', exigerAdmin, (req, res) => res.json({ campagne: newsletterRepo.creerCampagne(req.body) }));
routesAdmin.post('/newsletter/campaigns/:id/send', exigerAdmin, (req, res) => {
  newsletterRepo.marquerCampagneEnvoyee(Number(req.params.id));
  res.json({ ok: true });
});

// Municipalités
routesAdmin.get('/municipalities', exigerAdmin, (req, res) => res.json({ municipalites: municipalitesRepo.lister() }));
routesAdmin.post('/municipalities', exigerAdmin, (req, res) => res.json({ municipalite: municipalitesRepo.creer(req.body) }));
routesAdmin.patch('/municipalities/:id', exigerAdmin, (req, res) => res.json({ municipalite: municipalitesRepo.modifier(Number(req.params.id), req.body) }));
routesAdmin.delete('/municipalities/:id', exigerAdmin, (req, res) => { municipalitesRepo.supprimer(Number(req.params.id)); res.json({ ok: true }); });

// Profils d'export
routesAdmin.get('/export-profiles', exigerAdmin, (req, res) => res.json({ profils: exportProfilesRepo.lister() }));
routesAdmin.post('/export-profiles', exigerAdmin, (req, res) => res.json({ profil: exportProfilesRepo.creer(req.body) }));
routesAdmin.patch('/export-profiles/:id', exigerAdmin, (req, res) => res.json({ profil: exportProfilesRepo.modifier(Number(req.params.id), req.body) }));
routesAdmin.delete('/export-profiles/:id', exigerAdmin, (req, res) => { exportProfilesRepo.supprimer(Number(req.params.id)); res.json({ ok: true }); });

// Demandes Loi 25 et incidents
routesAdmin.get('/data-requests', exigerAdmin, (req, res) => res.json({ demandes: dataRequestsRepo.lister() }));
routesAdmin.patch('/data-requests/:id', exigerAdmin, (req, res) => { dataRequestsRepo.marquerTraitee(Number(req.params.id)); res.json({ ok: true }); });
routesAdmin.get('/privacy-incidents', exigerAdmin, (req, res) => res.json({ incidents: incidentsRepo.lister() }));
routesAdmin.post('/privacy-incidents', exigerAdmin, (req, res) => res.json({ incident: incidentsRepo.consigner(req.body) }));
