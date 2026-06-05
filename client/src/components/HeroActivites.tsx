import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { activitesAccueil, type Activite, type CtaActivite } from '@content/activites';
import { marque } from '@content/marque';
import { asset } from '@/lib/asset';

// Slider plein écran de l'accueil. Le fond, le logo, les accréditations et les
// call-to-action changent selon l'activité active. Les deux activités non
// actives sont visibles à droite sous forme de rectangles cliquables ;
// cliquer un rectangle le promeut en fond.
export function HeroActivites() {
  const [actif, setActif] = useState(0);
  const activite = activitesAccueil[actif];
  const autres = activitesAccueil
    .map((a, i) => ({ a, i }))
    .filter(({ i }) => i !== actif);

  return (
    <section className="rt-heroact" aria-label="Les activités de Roxan Turcotte">
      <div className="rt-heroact__fonds" aria-hidden="true">
        {activitesAccueil.map((a, i) => (
          <div
            key={a.slug}
            className={`rt-heroact__fond ${i === actif ? 'actif' : ''}`}
            style={{ backgroundImage: `url(${a.image.src})` }}
          />
        ))}
        <div className="rt-heroact__voile" />
      </div>

      <img className="rt-heroact__portrait" src={asset(marque.portrait)} alt="Roxan Turcotte, courtier immobilier" />

      <div className="rt-heroact__inner">
        <div className="rt-heroact__contenu">
          <span className="rt-logo-plaque rt-heroact__logo">
            <img src={asset(activite.logo.chemin)} alt={activite.logo.alt} />
          </span>

          <h1 className="rt-heroact__titre">{activite.titre}</h1>
          <p className="rt-heroact__accroche">{activite.accroche}</p>

          <div className="rt-heroact__cta">
            {activite.ctas.map((c) => (
              <CtaHero key={c.libelle} cta={c} />
            ))}
          </div>
        </div>

        <div className="rt-heroact__apercus">
          {autres.map(({ a, i }) => (
            <div key={a.slug} className="rt-heroact__apercu-wrap">
              <button
                type="button"
                className="rt-heroact__apercu"
                onClick={() => setActif(i)}
                aria-label={`Voir l’activité ${nomCourt(a)} en arrière-plan`}
                style={{ backgroundImage: `url(${a.apercu.src})` }}
              >
                <span className="rt-heroact__apercu-voile" aria-hidden="true" />
                <span className="rt-logo-plaque rt-heroact__apercu-logo">
                  <img src={asset(a.logo.chemin)} alt="" />
                </span>
                <span className="rt-heroact__apercu-titre">{nomCourt(a)}</span>
              </button>
              <ApercuDecouvrir route={a.route} nom={nomCourt(a)} />
            </div>
          ))}
        </div>
      </div>

      <p className="rt-visuellement-cache" aria-live="polite">
        Activité affichée : {activite.entite}.
      </p>
    </section>
  );
}

function nomCourt(a: Activite): string {
  return a.entite.split('·')[0].trim();
}

// Bouton « Découvrir » du rectangle : va à la page dédiée (ou au lien externe
// Airbnb), distinct du clic sur la carte qui ne fait que changer le fond.
function ApercuDecouvrir({ route, nom }: { route: string; nom: string }) {
  const stop = (e: MouseEvent) => e.stopPropagation();
  const libelle = 'Découvrir →';
  if (/^https?:/i.test(route)) {
    return (
      <a className="rt-heroact__apercu-decouvrir" href={route} target="_blank" rel="noopener noreferrer" onClick={stop} aria-label={`Découvrir ${nom}`}>
        {libelle}
      </a>
    );
  }
  return (
    <Link className="rt-heroact__apercu-decouvrir" to={route} onClick={stop} aria-label={`Découvrir ${nom}`}>
      {libelle}
    </Link>
  );
}

function CtaHero({ cta }: { cta: CtaActivite }) {
  const classe = `rt-bouton ${cta.variante === 'primaire' ? 'rt-bouton--primaire' : 'rt-bouton--sur-sombre'}`;
  if (/^https?:/i.test(cta.href)) {
    return (
      <a className={classe} href={cta.href} target="_blank" rel="noopener noreferrer">
        {cta.libelle}
      </a>
    );
  }
  return (
    <Link className={classe} to={cta.href}>
      {cta.libelle}
    </Link>
  );
}
