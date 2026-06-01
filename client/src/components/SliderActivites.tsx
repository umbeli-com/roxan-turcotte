import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { activitesAccueil, type Activite } from '@content/activites';
import { Embleme } from './Embleme';
import { IconeActivite, IconeMeteo, descriptionMeteo } from './icones';

type EtatMeteo =
  | { etat: 'chargement' }
  | { etat: 'erreur' }
  | { etat: 'ok'; tempC: number; code: number };

const ROTATION_MS = 8000;
const INTERVALLE_TICK = 80;

// Météo Open-Meteo (gratuit, sans clé). Si le navigateur est offline ou
// si la requête échoue (CORS, etc.), on dégrade gracieusement.
async function chargerMeteo(activite: Activite, signal: AbortSignal): Promise<EtatMeteo> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', activite.lat.toString());
    url.searchParams.set('longitude', activite.lon.toString());
    url.searchParams.set('current', 'temperature_2m,weather_code');
    url.searchParams.set('timezone', 'auto');
    const r = await fetch(url.toString(), { signal });
    if (!r.ok) return { etat: 'erreur' };
    const d = await r.json();
    const t = d?.current?.temperature_2m;
    const code = d?.current?.weather_code;
    if (typeof t !== 'number' || typeof code !== 'number') return { etat: 'erreur' };
    return { etat: 'ok', tempC: Math.round(t), code };
  } catch {
    return { etat: 'erreur' };
  }
}

export function SliderActivites() {
  const [index, setIndex] = useState(0);
  const [meteo, setMeteo] = useState<Record<string, EtatMeteo>>(() =>
    Object.fromEntries(activitesAccueil.map((a) => [a.slug, { etat: 'chargement' as const }])),
  );
  const [pause, setPause] = useState(false);
  const [progression, setProgression] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Chargement météo (une seule fois côté client, après hydratation).
  useEffect(() => {
    const ctl = new AbortController();
    Promise.all(
      activitesAccueil.map(async (a) => [a.slug, await chargerMeteo(a, ctl.signal)] as const),
    ).then((paires) => {
      const m: Record<string, EtatMeteo> = {};
      for (const [k, v] of paires) m[k] = v;
      setMeteo(m);
    });
    return () => ctl.abort();
  }, []);

  // Rotation automatique avec jauge de progression.
  useEffect(() => {
    if (pause) return;
    setProgression(0);
    const debut = performance.now();
    tickRef.current = setInterval(() => {
      const elapsed = performance.now() - debut;
      const pct = Math.min(100, (elapsed / ROTATION_MS) * 100);
      setProgression(pct);
      if (elapsed >= ROTATION_MS) {
        setIndex((i) => (i + 1) % activitesAccueil.length);
      }
    }, INTERVALLE_TICK);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [index, pause]);

  function naviguer(delta: number) {
    setIndex((i) => (i + delta + activitesAccueil.length) % activitesAccueil.length);
  }

  return (
    <div
      className="rt-slider"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={() => setPause(false)}
      aria-roledescription="carrousel"
      aria-label="Activités principales de Roxan Turcotte"
    >
      <div className="rt-slider__piste">
        {activitesAccueil.map((a, i) => (
          <CarteActivite
            key={a.slug}
            activite={a}
            actif={i === index}
            meteo={meteo[a.slug]}
            indice={i + 1}
            total={activitesAccueil.length}
          />
        ))}
      </div>

      <div className="rt-slider__navigation" role="group" aria-label="Naviguer dans les activités">
        <button
          className="rt-slider__nav-bouton"
          onClick={() => naviguer(-1)}
          aria-label="Activité précédente"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="rt-slider__points" role="tablist">
          {activitesAccueil.map((a, i) => (
            <button
              key={a.slug}
              className={`rt-slider__point ${i === index ? 'actif' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Aller à ${a.titre}`}
              aria-selected={i === index}
              role="tab"
            />
          ))}
        </div>
        <span className="rt-slider__compteur">{String(index + 1).padStart(2, '0')} / {String(activitesAccueil.length).padStart(2, '0')}</span>
        <button
          className="rt-slider__nav-bouton"
          onClick={() => naviguer(+1)}
          aria-label="Activité suivante"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="rt-slider__progression" aria-hidden="true">
        <div className="rt-slider__progression-jauge" style={{ width: `${progression}%` }} />
      </div>
    </div>
  );
}

function CarteActivite({
  activite,
  actif,
  meteo,
  indice,
  total,
}: {
  activite: Activite;
  actif: boolean;
  meteo?: EtatMeteo;
  indice: number;
  total: number;
}) {
  return (
    <article
      className={`rt-slider__carte ${actif ? 'actif' : ''}`}
      aria-hidden={!actif}
      aria-roledescription="diapositive"
      aria-label={`${indice} sur ${total} — ${activite.titre}`}
    >
      <div className={`rt-slider__visuel rt-slider__visuel--${activite.motif}`}>
        <div className="rt-slider__motif" />
        <div className="rt-slider__embleme-fond">
          <Embleme taille={280} sansFond />
        </div>
        <div className="rt-slider__icone">
          <IconeActivite nom={activite.icone} />
        </div>
      </div>

      <div className="rt-slider__corps">
        <span className="rt-slider__surtitre">{activite.surtitre}</span>
        <span className="rt-slider__entite">{activite.entite}</span>
        <h3 className="rt-slider__titre">{activite.titre}</h3>
        <p className="rt-slider__accroche">{activite.accroche}</p>

        <WidgetMeteo meteo={meteo} lieu={activite.villeAffichee} />

        <div className="rt-slider__actions">
          <Link to={activite.route} className="rt-bouton rt-bouton--primaire">
            {activite.ctaLibelle}
          </Link>
        </div>
      </div>
    </article>
  );
}

function WidgetMeteo({ meteo, lieu }: { meteo?: EtatMeteo; lieu: string }) {
  if (!meteo || meteo.etat === 'chargement') {
    return (
      <div className="rt-slider__meteo" aria-live="polite">
        <div className="rt-slider__meteo-icone">
          <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="50 30" opacity="0.45">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
        <div className="rt-slider__meteo-texte">
          <span className="rt-slider__meteo-temp">&middot;&middot;&middot;</span>
          <span className="rt-slider__meteo-lieu">{lieu}</span>
          <span className="rt-slider__meteo-statut">Météo en cours de chargement</span>
        </div>
      </div>
    );
  }
  if (meteo.etat === 'erreur') {
    return (
      <div className="rt-slider__meteo">
        <div className="rt-slider__meteo-texte">
          <span className="rt-slider__meteo-lieu">{lieu}</span>
          <span className="rt-slider__meteo-statut">Météo indisponible</span>
        </div>
      </div>
    );
  }
  const temp = meteo.tempC;
  return (
    <div className="rt-slider__meteo">
      <div className="rt-slider__meteo-icone"><IconeMeteo code={meteo.code} /></div>
      <div className="rt-slider__meteo-texte">
        <span className="rt-slider__meteo-temp">{temp > 0 ? `+${temp}` : `${temp}`}&nbsp;°C</span>
        <span className="rt-slider__meteo-lieu">{lieu}</span>
        <span className="rt-slider__meteo-statut">{descriptionMeteo(meteo.code)} · en direct</span>
      </div>
    </div>
  );
}
