import { marque } from '@content/marque';
import { asset } from '@/lib/asset';

// Bande de confiance : reconnaissances officielles (vraies images Top 10 % et
// Prix Platine) + années d'expérience. Élément FIXE (ne change pas avec le
// slider d'activité), utilisé sur l'accueil et la page À propos.
export function BandeauConfiance() {
  const [top10, platine, ...medaillons] = marque.reconnaissances;
  return (
    <div className="rt-confiance">
      <img
        className="rt-confiance__image"
        src={asset(marque.badges.top10)}
        alt={`${top10.titre} — ${top10.mention}`}
        loading="lazy"
        decoding="async"
      />
      <img
        className="rt-confiance__image"
        src={asset(marque.badges.platine)}
        alt={`${platine.titre} — ${platine.mention}`}
        loading="lazy"
        decoding="async"
      />
      {medaillons.map((r) => (
        <span className="rt-confiance__medaillon" key={r.titre}>
          <strong>{r.titre}</strong>
          <span>{r.mention}</span>
        </span>
      ))}
    </div>
  );
}
