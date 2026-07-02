import { Router } from 'express';
import { z } from 'zod';
import * as leadsRepo from '../../db/repositories/leads.js';
import { partenairesRepo } from '../../db/repositories/partenaires.js';
import { newsletterRepo } from '../../db/repositories/newsletter.js';
import { dataRequestsRepo } from '../../db/repositories/divers.js';
import {
  notifierInterneNouveauLead,
  notifierPartenaireNouveauLead,
  accuserReceptionLead,
} from '../../services/mail/index.js';

export const routesLeadsPublic = Router();

const schemaLead = z.object({
  prenom: z.string().min(1).max(100),
  nom: z.string().min(1).max(100),
  courriel: z.string().email().max(200),
  telephone: z.string().max(40).optional().nullable(),
  message: z.string().max(4000).optional().nullable(),
  type_formulaire: z.string().min(1).max(60),
  source_entite: z.string().max(60).optional().nullable(),
  page_origine: z.string().max(500).optional().nullable(),
  profil: z.string().max(80).optional().nullable(),
  tags: z.array(z.string().max(60)).max(20).default([]),
  consentement: z.boolean(),
  consentement_horodatage: z.string().optional(),
  consentement_infolettre: z.boolean().optional().default(false),
});

routesLeadsPublic.post('/leads', async (req, res, next) => {
  try {
    const corps = schemaLead.parse(req.body);
    if (!corps.consentement) return res.status(400).json({ erreur: 'consentement-requis' });
    const lead = leadsRepo.creerLead(
      { ...corps, profil_slug: corps.profil ?? null, adresse_ip: req.ip },
      corps.tags ?? [],
    );

    // Le formulaire universel sert plusieurs intentions. On finalise ici le
    // traitement propre à chaque type pour que « tout soit géré » côté backend.
    if (corps.type_formulaire === 'desinscription') {
      // Retire réellement l'adresse de l'infolettre.
      try { newsletterRepo.desinscrireParCourriel(lead.courriel); } catch {}
    } else if (corps.type_formulaire === 'loi25') {
      // Consigne une demande d'accès/rectification/suppression conforme Loi 25.
      // Le type précis est indiqué dans le message par le visiteur ; on garde
      // « acces » par défaut et l'administrateur qualifie ensuite la demande.
      try {
        dataRequestsRepo.creer({ courriel: lead.courriel, type: 'acces', message: lead.message });
      } catch {}
    } else if (corps.consentement_infolettre) {
      // Consentement infolettre coché sur un formulaire de contact / club :
      // on inscrit effectivement l'adresse à la liste.
      try { newsletterRepo.inscrire({ courriel: lead.courriel, prenom: lead.prenom }); } catch {}
    }

    // Notifications, ne bloquent pas la réponse.
    notifierInterneNouveauLead(lead).catch(() => {});
    // Accusé de réception au visiteur (sauf désinscription : le message serait
    // contradictoire).
    if (corps.type_formulaire !== 'desinscription') {
      accuserReceptionLead(lead).catch(() => {});
    }
    if (lead.profil_slug) {
      const partenaire = partenairesRepo.parSlug(lead.profil_slug);
      if (partenaire && partenaire.actif) {
        notifierPartenaireNouveauLead(lead, partenaire).catch(() => {});
      }
    }
    res.status(201).json({ ok: true, id: lead.id });
  } catch (e) { next(e); }
});
