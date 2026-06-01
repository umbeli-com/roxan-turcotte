// Icônes inline pour les activités du slider et la météo. Stroke or doux.

import type { ReactNode } from 'react';

const stroke = 'currentColor';
const strokeWidth = 1.4;
const fill = 'none';

function Svg({ children, viewBox = '0 0 24 24' }: { children: ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export function IconeMaison() {
  return (
    <Svg>
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5 10.5V20h14V10.5" />
      <path d="M10 20v-5h4v5" />
    </Svg>
  );
}
export function IconePalmier() {
  return (
    <Svg>
      <path d="M12 21V8" />
      <path d="M12 8c0-2 3-3 6-3" />
      <path d="M12 8c0-2-3-3-6-3" />
      <path d="M12 8c1-2 4-3 7-2" />
      <path d="M12 8c-1-2-4-3-7-2" />
      <path d="M9 21l3-4 3 4" />
      <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  );
}
export function IconeSapin() {
  return (
    <Svg>
      <path d="M12 3l5 7h-3l4 5h-3l4 6H5l4-6H6l4-5H7l5-7z" />
      <path d="M12 21v-3" />
    </Svg>
  );
}
export function IconeImmeuble() {
  return (
    <Svg>
      <path d="M5 21V6h14v15" />
      <path d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2" />
      <path d="M3 21h18" />
    </Svg>
  );
}
export function IconeGlobe() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </Svg>
  );
}
export function IconeCles() {
  return (
    <Svg>
      <circle cx="8" cy="14" r="4" />
      <path d="M11 13l9-9M16 6l3 3M14 8l2 2" />
    </Svg>
  );
}

const map = {
  maison: IconeMaison,
  palmier: IconePalmier,
  sapin: IconeSapin,
  immeuble: IconeImmeuble,
  globe: IconeGlobe,
  cles: IconeCles,
};
export function IconeActivite({ nom }: { nom: keyof typeof map }) {
  const C = map[nom];
  return <C />;
}

// Icônes météo (jeu volontairement minimaliste, mappées sur WMO code de Open-Meteo)
export function IconeMeteo({ code }: { code: number }) {
  // Référence WMO : 0 clear, 1-3 partial cloud, 45/48 fog, 51-67 rain, 71-77 snow,
  // 80-82 showers, 85-86 snow showers, 95-99 thunder.
  if (code === 0) return (
    <Svg><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Svg>
  );
  if (code <= 3) return (
    <Svg><circle cx="9" cy="9" r="3" /><path d="M5 18h10a4 4 0 0 0 0-8 5 5 0 0 0-9.6 1.5A3.5 3.5 0 0 0 5 18z" /></Svg>
  );
  if (code === 45 || code === 48) return (
    <Svg><path d="M3 9h18M3 13h14M5 17h16M3 21h18" /></Svg>
  );
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return (
    <Svg><path d="M6 14a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.5A3.5 3.5 0 0 1 16 14H6z" /><path d="M9 18l-1 3M13 18l-1 3M17 18l-1 3" /></Svg>
  );
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return (
    <Svg><path d="M6 14a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.5A3.5 3.5 0 0 1 16 14H6z" /><path d="M9 18l1 0M13 18l1 0M17 18l1 0M11 20l1 0M15 20l1 0" /></Svg>
  );
  if (code >= 95) return (
    <Svg><path d="M6 12a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.5A3.5 3.5 0 0 1 16 12H6z" /><path d="M11 14l-2 4h3l-2 4" /></Svg>
  );
  return (
    <Svg><circle cx="12" cy="12" r="4" /></Svg>
  );
}

export function descriptionMeteo(code: number): string {
  if (code === 0) return 'Ciel dégagé';
  if (code <= 3) return 'Partiellement nuageux';
  if (code === 45 || code === 48) return 'Brouillard';
  if (code >= 51 && code <= 67) return 'Pluie';
  if (code >= 71 && code <= 77) return 'Neige';
  if (code >= 80 && code <= 82) return 'Averses';
  if (code === 85 || code === 86) return 'Neige sporadique';
  if (code >= 95) return 'Orages';
  return 'Conditions variables';
}
