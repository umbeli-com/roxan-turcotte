import { useRef, useState } from 'react';
import type { Profil } from '@content/profils';
import { asset } from '@/lib/asset';
import { FormulaireContact, type FormulaireProps } from './FormulaireContact';

function initiales(nom: string): string {
  return nom
    .split(/\s+/)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase() ?? '')
    .join('');
}

// Sélecteur compact « choisir une personne » (liste verticale de boutons).
export function ProfilsContact({
  profils,
  selectionne,
  onSelect,
}: {
  profils: Profil[];
  selectionne?: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="rt-profils-choix" role="group" aria-label="Choisir la personne à contacter">
      <span className="rt-profils-choix__libelle">Choisissez votre interlocuteur</span>
      {profils.map((p) => {
        const actif = p.slug === selectionne;
        return (
          <button
            key={p.slug}
            type="button"
            className="rt-profil-choix"
            aria-pressed={actif}
            onClick={() => onSelect(p.slug)}
          >
            {p.photo ? (
              <img className="rt-profil-choix__photo" src={asset(p.photo)} alt="" />
            ) : (
              <span className="rt-profil-choix__photo rt-profil-choix__photo--initiales" aria-hidden="true">
                {initiales(p.nom)}
              </span>
            )}
            <span className="rt-profil-choix__texte">
              <span className="rt-profil-choix__nom">{p.nom}</span>
              <span className="rt-profil-choix__role">{p.role}</span>
            </span>
            <span className="rt-profil-choix__check" aria-hidden="true">✓</span>
          </button>
        );
      })}
    </div>
  );
}

type BlocProps = Omit<
  FormulaireProps,
  'profils' | 'profilSelectionne' | 'onProfilChange' | 'selecteurExterne'
> & { profils: Profil[] };

// Bloc « personnes à contacter + formulaire ». Quand il y a plusieurs personnes,
// la liste est à gauche et le formulaire à droite (on voit qui est sélectionné
// en même temps que le formulaire). Avec une seule personne, le formulaire
// rappelle simplement le destinataire.
export function BlocContactProfils({ profils, ...formProps }: BlocProps) {
  const [sel, setSel] = useState<string | undefined>(profils[0]?.slug);
  const refForm = useRef<HTMLDivElement>(null);
  const multi = profils.length > 1;

  const choisir = (slug: string) => {
    setSel(slug);
    // En écran étroit, la liste passe au-dessus du formulaire : on défile.
    if (multi && typeof window !== 'undefined' && window.innerWidth <= 880) {
      requestAnimationFrame(() =>
        refForm.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      );
    }
  };

  return (
    <div className={`rt-contact-profils ${multi ? 'rt-contact-profils--double' : ''}`}>
      {multi && <ProfilsContact profils={profils} selectionne={sel} onSelect={choisir} />}
      <div ref={refForm} id="formulaire" className="rt-contact-profils__form">
        <FormulaireContact
          {...formProps}
          profils={profils}
          profilSelectionne={sel}
          onProfilChange={setSel}
          selecteurExterne={multi}
        />
      </div>
    </div>
  );
}
