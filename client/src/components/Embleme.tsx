// Emblème — utilise le logo PNG officiel fourni par le client (lion doré).
// `sansFond` est conservé pour compatibilité avec les appels existants : si
// vrai, on rogne l'arrière-plan visuel autour via un masque CSS doux.

export function Embleme({
  taille = 44,
  sansFond = false,
  className,
}: {
  taille?: number;
  sansFond?: boolean;
  className?: string;
}) {
  // Base path (vite) — gère le déploiement sous /roxan-turcotte/ comme à la racine.
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const src = `${baseUrl.replace(/\/$/, '')}/logo-roxan-lion.png`;
  return (
    <img
      src={src}
      width={taille}
      height={taille}
      alt="Roxan Turcotte — emblème"
      className={className}
      loading={taille > 120 ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        width: taille,
        height: taille,
        objectFit: 'contain',
        // Ombre douce adaptée au fond clair.
        filter: sansFond ? 'none' : 'drop-shadow(0 6px 14px rgba(43, 36, 18, 0.20))',
      }}
    />
  );
}
