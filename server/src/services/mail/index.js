// Couche d'envoi courriel abstraite. Implémentation initiale : SMTP via
// nodemailer (compatible Outlook / Microsoft 365). Une autre implémentation
// (par exemple Microsoft Graph) pourra être branchée sans toucher au reste
// du code, en exposant la même fonction `sendMail({ to, subject, html,
// attachments })`.

import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { emailLogRepo } from '../../db/repositories/divers.js';

let transporteur;
function getTransporteur() {
  if (transporteur) return transporteur;
  transporteur = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    auth: env.mail.user ? { user: env.mail.user, pass: env.mail.password } : undefined,
  });
  return transporteur;
}

export async function sendMail({ to, subject, html, attachments, leadId, type }) {
  try {
    const info = await getTransporteur().sendMail({
      from: env.mail.from,
      to,
      subject,
      html,
      attachments,
    });
    emailLogRepo.journaliser({
      lead_id: leadId ?? null,
      destinataire: Array.isArray(to) ? to.join(', ') : to,
      type: type ?? 'autre',
      sujet: subject,
      statut: 'envoye',
    });
    return info;
  } catch (e) {
    emailLogRepo.journaliser({
      lead_id: leadId ?? null,
      destinataire: Array.isArray(to) ? to.join(', ') : to,
      type: type ?? 'autre',
      sujet: subject,
      statut: 'echec',
      erreur: e.message,
    });
    throw e;
  }
}

export function notifierInterneNouveauLead(lead) {
  if (!env.mail.notifInternalTo) return Promise.resolve();
  const html = `
    <div style="font-family: sans-serif; padding: 16px;">
      <h2 style="color: #C8A24A;">Nouveau lead reçu</h2>
      <p><strong>${lead.prenom} ${lead.nom}</strong></p>
      <ul>
        <li>Courriel : ${lead.courriel}</li>
        <li>Téléphone : ${lead.telephone ?? '—'}</li>
        <li>Type de formulaire : ${lead.type_formulaire}</li>
        <li>Page d'origine : ${lead.page_origine ?? '—'}</li>
        <li>Source : ${lead.source_entite ?? '—'}</li>
      </ul>
      ${lead.message ? `<p><strong>Message :</strong><br>${lead.message}</p>` : ''}
    </div>
  `;
  return sendMail({
    to: env.mail.notifInternalTo,
    subject: `Nouveau lead — ${lead.prenom} ${lead.nom} (${lead.type_formulaire})`,
    html,
    leadId: lead.id,
    type: 'notification-interne',
  });
}
