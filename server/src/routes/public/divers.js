import { Router } from 'express';
import { z } from 'zod';
import { guidesRepo } from '../../db/repositories/guides.js';
import * as leadsRepo from '../../db/repositories/leads.js';
import { newsletterRepo } from '../../db/repositories/newsletter.js';
import { dataRequestsRepo } from '../../db/repositories/divers.js';
import { sendMail } from '../../services/mail/index.js';
import { env } from '../../config/env.js';

export const routesDiverses = Router();

// Téléchargement d'un guide (échange contre les coordonnées).
const schemaTelechargement = z.object({
  prenom: z.string().min(1),
  nom: z.string().min(1),
  courriel: z.string().email(),
  telephone: z.string().optional().nullable(),
  consentement: z.boolean(),
  consentement_infolettre: z.boolean().optional().default(false),
});

routesDiverses.post('/guides/:slug/download', async (req, res, next) => {
  try {
    const corps = schemaTelechargement.parse(req.body);
    if (!corps.consentement) return res.status(400).json({ erreur: 'consentement-requis' });
    const guide = guidesRepo.parSlug(req.params.slug);
    if (!guide || !guide.actif) return res.status(404).json({ erreur: 'guide-introuvable' });
    const lead = leadsRepo.creerLead(
      {
        ...corps,
        type_formulaire: `guide-${guide.slug}`,
        source_entite: 'royal-lepage',
        page_origine: `/guides/${guide.slug}`,
        adresse_ip: req.ip,
        consentement_horodatage: new Date().toISOString(),
      },
      ['guide'],
    );
    guidesRepo.enregistrerTelechargement(lead.id, guide.id);
    if (corps.consentement_infolettre) {
      newsletterRepo.inscrire({ courriel: lead.courriel, prenom: lead.prenom });
    }
    // Envoi du guide par courriel (non bloquant).
    sendMail({
      to: lead.courriel,
      subject: `Votre guide : ${guide.titre}`,
      html: `<p>Bonjour ${lead.prenom},</p><p>Voici votre guide « ${guide.titre} ».</p>`,
      leadId: lead.id,
      type: 'guide',
    }).catch(() => {});
    res.json({ ok: true, lienFichier: guide.fichier_chemin });
  } catch (e) { next(e); }
});

// Infolettre
routesDiverses.post('/newsletter/subscribe', (req, res, next) => {
  try {
    const corps = z.object({ courriel: z.string().email(), prenom: z.string().optional() }).parse(req.body);
    const sub = newsletterRepo.inscrire(corps);
    res.json({ ok: true, id: sub.id });
  } catch (e) { next(e); }
});
routesDiverses.get('/newsletter/unsubscribe/:jeton', (req, res) => {
  const sub = newsletterRepo.desinscrireParJeton(req.params.jeton);
  if (!sub) return res.status(404).json({ erreur: 'jeton-inconnu' });
  res.json({ ok: true });
});

// Loi 25
routesDiverses.post('/data-requests', (req, res, next) => {
  try {
    const corps = z.object({
      courriel: z.string().email(),
      type: z.enum(['acces', 'suppression', 'rectification']),
      message: z.string().max(4000).optional(),
    }).parse(req.body);
    const dr = dataRequestsRepo.creer(corps);
    if (env.mail.notifInternalTo) {
      sendMail({
        to: env.mail.notifInternalTo,
        subject: `Demande Loi 25 — ${dr.type}`,
        html: `<p>Demande #${dr.id} de ${dr.courriel} (${dr.type}).</p><p>${dr.message ?? ''}</p>`,
        type: 'loi25',
      }).catch(() => {});
    }
    res.status(201).json({ ok: true, id: dr.id });
  } catch (e) { next(e); }
});
