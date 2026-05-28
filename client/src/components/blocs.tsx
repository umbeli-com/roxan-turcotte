import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Section({
  variante = 'noir',
  children,
  id,
}: {
  variante?: 'noir' | 'charbon';
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`rt-section rt-section--${variante} rt-anchor`}>
      <div className="rt-conteneur">{children}</div>
    </section>
  );
}

export function TitreSection({
  eyebrow,
  titre,
  description,
  align = 'centre',
}: {
  eyebrow?: string;
  titre: string;
  description?: string;
  align?: 'gauche' | 'centre';
}) {
  return (
    <div className="rt-section-titre" style={{ textAlign: align === 'centre' ? 'center' : 'left' }}>
      {eyebrow && <span className="rt-eyebrow">{eyebrow}</span>}
      <h2>{titre}</h2>
      {description && <p className="lead">{description}</p>}
    </div>
  );
}

export function BoutonInterne({
  href,
  enfants,
  variante = 'primaire',
}: {
  href: string;
  enfants: ReactNode;
  variante?: 'primaire' | 'secondaire' | 'ghost';
}) {
  // Lien externe (ancre ou autre) versus lien interne (react-router)
  if (href.startsWith('#') || href.startsWith('http')) {
    return (
      <a href={href} className={`rt-bouton rt-bouton--${variante}`}>
        {enfants}
      </a>
    );
  }
  return (
    <Link to={href} className={`rt-bouton rt-bouton--${variante}`}>
      {enfants}
    </Link>
  );
}

export function PastilleReco({ titre, mention }: { titre: string; mention: string }) {
  return (
    <span className="rt-pastille" aria-label={`${titre} ${mention}`}>
      <strong>{titre}</strong>
      <span>{mention}</span>
    </span>
  );
}

export function CtaBandeau({
  titre,
  sousTitre,
  bouton,
}: {
  titre: string;
  sousTitre?: string;
  bouton: { libelle: string; href: string };
}) {
  return (
    <div className="rt-cta-bandeau">
      <h2 className="rt-titre-gravure">{titre}</h2>
      {sousTitre && <p className="lead">{sousTitre}</p>}
      <BoutonInterne href={bouton.href}>{bouton.libelle}</BoutonInterne>
    </div>
  );
}

export function ListeAvantages({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
      {items.map((it) => (
        <li
          key={it}
          style={{
            display: 'grid',
            gridTemplateColumns: '24px 1fr',
            gap: '0.75rem',
            alignItems: 'baseline',
            color: 'var(--rt-ivoire)',
            lineHeight: 1.55,
          }}
        >
          <span aria-hidden="true" style={{ color: 'var(--rt-or)', fontWeight: 700 }}>
            ✦
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Processus({ etapes }: { etapes: { titre: string; description: string }[] }) {
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {etapes.map((e, i) => (
        <article key={e.titre} className="rt-etape">
          <span className="rt-etape__num">{String(i + 1).padStart(2, '0')}</span>
          <div className="rt-etape__corps">
            <h4>{e.titre}</h4>
            <p>{e.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
