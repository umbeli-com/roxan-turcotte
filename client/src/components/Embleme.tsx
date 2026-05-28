// Emblème du lion doré.
// SVG stylisé en attendant la version définitive fournie par le client.
// Couleurs alignées à la palette de marque (or signature sur fond charbon).

export function Embleme({ taille = 44, sansFond = false }: { taille?: number; sansFond?: boolean }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Emblème Roxan Turcotte"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rt-grad-or" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C878" />
          <stop offset="55%" stopColor="#C8A24A" />
          <stop offset="100%" stopColor="#9A7B2E" />
        </linearGradient>
        <radialGradient id="rt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(230, 200, 120, 0.45)" />
          <stop offset="100%" stopColor="rgba(11, 11, 12, 0)" />
        </radialGradient>
      </defs>

      {!sansFond && <circle cx="32" cy="32" r="30" fill="#0B0B0C" stroke="url(#rt-grad-or)" strokeWidth="1.2" />}
      {!sansFond && <circle cx="32" cy="32" r="30" fill="url(#rt-glow)" opacity="0.55" />}

      {/* Silhouette stylisée d'un lion héraldique : crinière travaillée + visage */}
      <g fill="url(#rt-grad-or)" transform="translate(12 11)">
        {/* Crinière (rayons) */}
        <path d="M20 0 L22.5 4 L25 0.6 L26.5 5 L29.6 1.5 L30.8 5.7 L34.5 3.4 L34.6 8 L38.6 6.5 L38 11 L41.5 11 L39.5 14.5 L41 17 L37.5 17.5 L38.5 21 L35 21 L35 25 L32 23 L31 27 L28 24 L25 27 L23 23 L20 25 L20 21 L16.5 21 L17.5 17.5 L14 17 L15.5 14.5 L13.5 11 L17 11 L16.4 6.5 L20.4 8 Z" />
        {/* Tête centrale */}
        <ellipse cx="20" cy="17" rx="6.5" ry="6" fill="#0B0B0C" />
        <ellipse cx="20" cy="17" rx="6.5" ry="6" fill="none" stroke="url(#rt-grad-or)" strokeWidth="0.9" />
        {/* Yeux */}
        <circle cx="17.6" cy="15.5" r="0.95" fill="#E6C878" />
        <circle cx="22.4" cy="15.5" r="0.95" fill="#E6C878" />
        {/* Nez et museau */}
        <path d="M19.2 18.4 L20.8 18.4 L20 19.6 Z" fill="#E6C878" />
        <path d="M20 19.6 L20 21.4" stroke="#9A7B2E" strokeWidth="0.6" />
        <path d="M17 21 Q20 22.6 23 21" stroke="#9A7B2E" strokeWidth="0.6" fill="none" />
        {/* Moustache stylisée */}
        <path d="M15 18.5 L17.4 18.6" stroke="#9A7B2E" strokeWidth="0.5" />
        <path d="M25 18.5 L22.6 18.6" stroke="#9A7B2E" strokeWidth="0.5" />
      </g>

      {/* Initiales RT discrètes en bas (marque) */}
      {!sansFond && (
        <text
          x="32"
          y="55"
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="5"
          letterSpacing="0.25em"
          fill="url(#rt-grad-or)"
        >
          R T
        </text>
      )}
    </svg>
  );
}
