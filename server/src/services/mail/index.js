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

export async function sendMail({ to, subject, html, attachments, replyTo, leadId, type }) {
  try {
    const info = await getTransporteur().sendMail({
      from: env.mail.from,
      to,
      replyTo,
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
    // Répondre au courriel de notification écrit directement au prospect.
    replyTo: lead.courriel,
    subject: `Nouveau lead — ${lead.prenom} ${lead.nom} (${lead.type_formulaire})`,
    html,
    leadId: lead.id,
    type: 'notification-interne',
  });
}

// Accusé de réception envoyé au visiteur qui vient de soumettre une demande.
// Envoyé depuis l'adresse d'envoi (contact@umbeli.com), avec « répondre à »
// pointant vers Roxan. No-op gracieux si le SMTP n'est pas configuré.
export function accuserReceptionLead(lead) {
  if (!env.mail.host || !lead?.courriel) return Promise.resolve();
  const html = `
    <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1E2420;">
      <h2 style="color: #B0863A; font-weight: 600;">Merci ${lead.prenom}, votre demande est bien reçue.</h2>
      <p>Bonjour ${lead.prenom} ${lead.nom},</p>
      <p>
        J'ai bien reçu votre demande et je vous recontacte dans les meilleurs délais, en toute
        confidentialité. Si votre projet est urgent, vous pouvez aussi me joindre directement.
      </p>
      ${lead.message ? `<p style="background:#F6F1E7; border-radius:8px; padding:12px 16px; color:#4A5148;"><strong>Votre message :</strong><br>${lead.message}</p>` : ''}
      <p style="margin-top: 24px;">
        Au plaisir de vous accompagner,<br>
        <strong>Roxan Turcotte</strong><br>
        <span style="color:#6C746A;">Courtier immobilier · Royal LePage Centre</span>
      </p>
      <p style="color:#9AA096; font-size: 12px; margin-top: 24px;">
        Ce courriel confirme la réception de votre demande sur ${env.publicBaseUrl}. Vous le recevez
        parce que vous avez soumis un formulaire sur notre site.
      </p>
    </div>
  `;
  return sendMail({
    to: lead.courriel,
    replyTo: env.mail.notifInternalTo || undefined,
    subject: 'Votre demande est bien reçue — Roxan Turcotte',
    html,
    leadId: lead.id,
    type: 'accuse-reception',
  });
}

// Transfère le lead à un partenaire (« personne à contacter » sélectionnée par
// le visiteur), depuis l'adresse de Roxan. No-op gracieux si le SMTP n'est pas
// configuré ou si le partenaire n'a pas encore de courriel renseigné.
export function notifierPartenaireNouveauLead(lead, partenaire) {
  // No-op si le SMTP n'est pas configuré (pas d'identifiant) ou si le
  // partenaire n'a pas encore de courriel renseigné.
  if (!env.mail.host || !env.mail.user || !partenaire?.courriel) return Promise.resolve();
  const html = `
    <div style="font-family: sans-serif; padding: 16px; color: #1E2420;">
      <h2 style="color: #B0863A;">Un client potentiel vous est transféré</h2>
      <p>Bonjour ${partenaire.nom},</p>
      <p>Une personne a demandé à être mise en relation avec vous depuis le site de Roxan Turcotte.</p>
      <ul>
        <li><strong>${lead.prenom} ${lead.nom}</strong></li>
        <li>Courriel : <a href="mailto:${lead.courriel}">${lead.courriel}</a></li>
        <li>Téléphone : ${lead.telephone ?? '—'}</li>
        <li>Origine : ${lead.page_origine ?? '—'}</li>
      </ul>
      ${lead.message ? `<p><strong>Message :</strong><br>${lead.message}</p>` : ''}
      <p style="color:#6C746A; font-size: 13px;">Vous pouvez répondre directement à ce courriel pour joindre la personne.</p>
    </div>
  `;
  return sendMail({
    to: partenaire.courriel,
    replyTo: lead.courriel,
    subject: `Client potentiel transféré — ${lead.prenom} ${lead.nom}`,
    html,
    leadId: lead.id,
    type: 'notification-partenaire',
  });
}
