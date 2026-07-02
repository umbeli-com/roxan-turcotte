// Couche d'envoi courriel abstraite. Implémentation initiale : SMTP via
// nodemailer (compatible Outlook / Microsoft 365). Une autre implémentation
// (par exemple Microsoft Graph) pourra être branchée sans toucher au reste
// du code, en exposant la même fonction `sendMail({ to, subject, html,
// attachments })`.

import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { emailLogRepo } from '../../db/repositories/divers.js';

// --- Helpers de rendu courriel -------------------------------------------
function escapeHtml(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function dateFrCA() {
  try {
    return new Date().toLocaleString('fr-CA', {
      timeZone: 'America/Toronto',
      dateStyle: 'long',
      timeStyle: 'short',
    });
  } catch {
    return new Date().toISOString();
  }
}

// Une ligne label / valeur de la table de détails (charte or/encre).
function ligneDetail(label, valeurHtml) {
  if (!valeurHtml) return '';
  return (
    '<tr>' +
    '<td style="padding:11px 0; border-bottom:1px solid #F3ECDD; color:#6C746A; font-size:13px; width:170px; vertical-align:top;">' +
    escapeHtml(label) +
    '</td>' +
    '<td style="padding:11px 0; border-bottom:1px solid #F3ECDD; color:#1E2420; font-size:14px; vertical-align:top;">' +
    valeurHtml +
    '</td>' +
    '</tr>'
  );
}

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

export async function sendMail({ to, cc, subject, html, attachments, replyTo, leadId, type }) {
  try {
    const info = await getTransporteur().sendMail({
      from: env.mail.from,
      to,
      cc,
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

  const nomComplet = `${lead.prenom ?? ''} ${lead.nom ?? ''}`.trim() || 'Contact';
  const courrielHtml = lead.courriel
    ? `<a href="mailto:${escapeHtml(lead.courriel)}" style="color:#8A6826; text-decoration:none; font-weight:600;">${escapeHtml(lead.courriel)}</a>`
    : '';
  const telHtml = lead.telephone
    ? `<a href="tel:${escapeHtml(String(lead.telephone).replace(/[^0-9+]/g, ''))}" style="color:#8A6826; text-decoration:none; font-weight:600;">${escapeHtml(lead.telephone)}</a>`
    : '';

  const lignes =
    ligneDetail('Courriel', courrielHtml) +
    ligneDetail('Téléphone', telHtml) +
    ligneDetail('Personne à contacter', lead.profil_slug ? escapeHtml(lead.profil_slug) : '') +
    ligneDetail('Source', lead.source_entite ? escapeHtml(lead.source_entite) : '') +
    ligneDetail('Page d’origine', lead.page_origine ? escapeHtml(lead.page_origine) : '') +
    ligneDetail('Infolettre', lead.consentement_infolettre ? 'Oui — inscrit(e) à l’infolettre' : 'Non') +
    ligneDetail('Reçu le', dateFrCA());

  const messageBloc = lead.message
    ? `<tr><td style="padding:8px 32px 4px;">
         <div style="background:#FAF7F0; border-left:3px solid #B0863A; border-radius:8px; padding:16px 18px; color:#1E2420; font-size:14px; line-height:1.55;">
           <div style="font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#8A6826; font-weight:600; margin-bottom:6px;">Message</div>
           ${escapeHtml(lead.message).replace(/\n/g, '<br>')}
         </div>
       </td></tr>`
    : '';

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; padding:0; background:#F3ECDD;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3ECDD; padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%; background:#FFFFFF; border:1px solid #E6DECD; border-radius:14px; overflow:hidden; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <tr><td style="background:#1E2420; padding:26px 32px; border-bottom:3px solid #B0863A;">
          <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#C8A24A; font-weight:600;">Roxan Turcotte &middot; Courtier immobilier</div>
          <div style="font-size:23px; color:#FFFFFF; font-weight:700; margin-top:6px;">Nouveau lead reçu</div>
        </td></tr>
        <tr><td style="padding:26px 32px 6px;">
          <div style="font-size:20px; color:#1E2420; font-weight:700;">${escapeHtml(nomComplet)}</div>
          <span style="display:inline-block; margin-top:10px; padding:4px 13px; background:rgba(176,134,58,0.12); color:#8A6826; border:1px solid #B0863A; border-radius:999px; font-size:12px; font-weight:600;">${escapeHtml(lead.type_formulaire ?? 'contact')}</span>
        </td></tr>
        <tr><td style="padding:12px 32px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${lignes}</table>
        </td></tr>
        ${messageBloc}
        <tr><td style="padding:22px 32px 26px;">
          <div style="font-size:12px; color:#6C746A; line-height:1.5;">Notification automatique — <a href="${escapeHtml(env.publicBaseUrl)}" style="color:#8A6826; text-decoration:none;">${escapeHtml(env.publicBaseUrl.replace(/^https?:\/\//, ''))}</a>. Répondez directement à ce courriel pour écrire à la personne.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return sendMail({
    to: env.mail.notifInternalTo,
    cc: env.mail.notifCc || undefined,
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
