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

// Cartes de profils (présentation). Cliquer « Contacter » remonte le choix.
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
    <div className="rt-profils">
      {profils.map((p) => (
        <article
          key={p.slug}
          className="rt-profil-carte"
          aria-current={p.slug === selectionne ? 'true' : undefined}
        >
          <div className="rt-profil-carte__tete">
            {p.photo ? (
              <img className="rt-profil-carte__photo" src={asset(p.photo)} alt="" />
            ) : (
              <span className="rt-profil-carte__photo rt-profil-carte__photo--initiales" aria-hidden="true">
                {initiales(p.nom)}
              </span>
            )}
            <div>
              <h3 className="rt-profil-carte__nom">{p.nom}</h3>
              <span className="rt-profil-carte__role">{p.role}</span>
            </div>
          </div>
          <p className="rt-profil-carte__desc">{p.description}</p>
          <button
            type="button"
            className="rt-bouton rt-bouton--secondaire"
            onClick={() => onSelect(p.slug)}
            aria-label={`Contacter ${p.nom}`}
          >
            {p.slug === selectionne ? 'Sélectionné ✓' : 'Contacter'}
          </button>
        </article>
      ))}
    </div>
  );
}

type BlocProps = Omit<FormulaireProps, 'profils' | 'profilSelectionne' | 'onProfilChange'> & {
  profils: Profil[];
};

// Bloc complet : cartes de profils + formulaire pré-rempli. Cliquer une
// personne la sélectionne dans le formulaire et fait défiler jusqu'à lui.
export function BlocContactProfils({ profils, ...formProps }: BlocProps) {
  const [sel, setSel] = useState<string | undefined>(profils[0]?.slug);
  const refForm = useRef<HTMLDivElement>(null);

  const choisir = (slug: string) => {
    setSel(slug);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() =>
        refForm.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      );
    }
  };

  return (
    <div className="rt-contact-profils">
      <ProfilsContact profils={profils} selectionne={sel} onSelect={choisir} />
      <div ref={refForm} id="formulaire" className="rt-contact-profils__form">
        <FormulaireContact
          {...formProps}
          profils={profils}
          profilSelectionne={sel}
          onProfilChange={setSel}
        />
      </div>
    </div>
  );
}
