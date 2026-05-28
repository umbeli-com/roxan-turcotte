import { Router } from 'express';
import { z } from 'zod';
import * as leadsRepo from '../../db/repositories/leads.js';
import { notifierInterneNouveauLead } from '../../services/mail/index.js';

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
      { ...corps, adresse_ip: req.ip },
      corps.tags ?? [],
    );
    // Notification interne, ne bloque pas la réponse.
    notifierInterneNouveauLead(lead).catch(() => {});
    res.status(201).json({ ok: true, id: lead.id });
  } catch (e) { next(e); }
});
