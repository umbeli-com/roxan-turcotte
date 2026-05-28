import { useState, FormEvent } from 'react';
import { marque } from '@content/marque';

export type FormulaireProps = {
  typeFormulaire: string;
  pageOrigine: string;
  etiquettes: string[];
  sourceEntite?: string;
  titre?: string;
  intro?: string;
  champMessage?: boolean;
  champTelephoneRequis?: boolean;
  champInfolettre?: boolean;
};

type Statut = 'idle' | 'envoi' | 'succes' | 'erreur';

const apiBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '/api';

// Formulaire universel pré-étiqueté. Toute soumission part vers /api/leads.
// Si l'API est indisponible (cas du déploiement statique GitHub Pages sans
// back-end), on bascule sur un message de confirmation visuel afin de ne
// pas casser l'expérience client lors d'une démonstration.

export function FormulaireContact({
  typeFormulaire,
  pageOrigine,
  etiquettes,
  sourceEntite,
  titre = 'Demander à être recontacté',
  intro = 'Décrivez-moi brièvement votre projet. Je vous reviens rapidement, en toute confidentialité.',
  champMessage = true,
  champTelephoneRequis = true,
  champInfolettre = false,
}: FormulaireProps) {
  const [statut, setStatut] = useState<Statut>('idle');
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    setStatut('envoi');

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot anti-pourriel : si rempli, on simule un succès mais on n'envoie rien.
    if ((fd.get('rt_pour_les_robots') as string) !== '') {
      setStatut('succes');
      form.reset();
      return;
    }

    const corps = {
      prenom: (fd.get('prenom') as string) ?? '',
      nom: (fd.get('nom') as string) ?? '',
      courriel: (fd.get('courriel') as string) ?? '',
      telephone: (fd.get('telephone') as string) ?? '',
      message: (fd.get('message') as string) ?? '',
      consentement: fd.get('consentement') === 'on',
      consentement_infolettre: fd.get('consentement_infolettre') === 'on',
      type_formulaire: typeFormulaire,
      page_origine: pageOrigine,
      source_entite: sourceEntite ?? null,
      tags: etiquettes,
      consentement_horodatage: new Date().toISOString(),
    };

    try {
      const r = await fetch(`${apiBase}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corps),
        credentials: 'omit',
      });
      if (!r.ok) throw new Error(`Réponse ${r.status}`);
      setStatut('succes');
      form.reset();
    } catch (err) {
      // En l'absence d'API (déploiement statique), on confirme à l'écran et on
      // journalise localement la tentative pour la phase de pré-lancement.
      const stub = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_STUB_FORMS) === 'true';
      if (stub) {
        try {
          const tampon = JSON.parse(localStorage.getItem('rt_demos_leads') || '[]');
          tampon.push({ ...corps, recu_le: new Date().toISOString() });
          localStorage.setItem('rt_demos_leads', JSON.stringify(tampon.slice(-50)));
        } catch {}
        setStatut('succes');
        form.reset();
        return;
      }
      setStatut('erreur');
      setErreur(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  return (
    <form
      className="rt-formulaire"
      id="formulaire"
      onSubmit={onSubmit}
      noValidate
      aria-label={titre}
    >
      <div className="rt-formulaire__entete">
        <h3 className="rt-formulaire__titre">{titre}</h3>
        <span className="rt-badge">Loi 25 conforme</span>
      </div>
      {intro && <p className="rt-formulaire__intro">{intro}</p>}

      <div className="rt-champ--double">
        <div className="rt-champ">
          <label htmlFor={`f-prenom-${typeFormulaire}`}>Prénom</label>
          <input id={`f-prenom-${typeFormulaire}`} type="text" name="prenom" autoComplete="given-name" required />
        </div>
        <div className="rt-champ">
          <label htmlFor={`f-nom-${typeFormulaire}`}>Nom</label>
          <input id={`f-nom-${typeFormulaire}`} type="text" name="nom" autoComplete="family-name" required />
        </div>
      </div>

      <div className="rt-champ--double">
        <div className="rt-champ">
          <label htmlFor={`f-courriel-${typeFormulaire}`}>Courriel</label>
          <input id={`f-courriel-${typeFormulaire}`} type="email" name="courriel" autoComplete="email" required />
        </div>
        <div className="rt-champ">
          <label htmlFor={`f-telephone-${typeFormulaire}`}>Téléphone</label>
          <input
            id={`f-telephone-${typeFormulaire}`}
            type="tel"
            name="telephone"
            autoComplete="tel"
            required={champTelephoneRequis}
            inputMode="tel"
          />
        </div>
      </div>

      {champMessage && (
        <div className="rt-champ">
          <label htmlFor={`f-message-${typeFormulaire}`}>Votre message ou projet (optionnel)</label>
          <textarea
            id={`f-message-${typeFormulaire}`}
            name="message"
            placeholder="Quelques mots sur votre projet, votre échéance, vos questions."
          />
        </div>
      )}

      <label className="rt-honeypot" aria-hidden="true">
        Ne remplissez pas ce champ.
        <input type="text" name="rt_pour_les_robots" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="rt-consentement">
        <input type="checkbox" name="consentement" required />
        <span>
          J'autorise {marque.nomCourt} à utiliser mes coordonnées pour répondre à ma demande, conformément à la{' '}
          <a href="/politique-de-confidentialite">politique de confidentialité</a>. Je peux retirer mon consentement à tout moment.
        </span>
      </label>

      {champInfolettre && (
        <label className="rt-consentement">
          <input type="checkbox" name="consentement_infolettre" />
          <span>
            Je souhaite également recevoir l'infolettre et les contenus exclusifs (désinscription en un clic à tout moment).
          </span>
        </label>
      )}

      <button type="submit" className="rt-bouton rt-bouton--primaire" disabled={statut === 'envoi'}>
        {statut === 'envoi' ? 'Envoi en cours' : 'Envoyer ma demande'}
      </button>

      {statut === 'succes' && (
        <div className="rt-message rt-message--succes" role="status">
          Merci. Votre demande est enregistrée. Je vous recontacte dans les meilleurs délais.
        </div>
      )}
      {statut === 'erreur' && (
        <div className="rt-message rt-message--erreur" role="alert">
          Une erreur est survenue ({erreur ?? 'inconnue'}). Vous pouvez réessayer ou m'écrire directement à{' '}
          <a href={`mailto:${marque.contact.courriel}`}>{marque.contact.courriel}</a>.
        </div>
      )}
    </form>
  );
}
