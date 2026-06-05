import type { Photo } from '@content/images';

type Ratio = '16-9' | '4-3' | '3-2' | '1-1' | 'auto';

// Image responsive avec ratio réservé (évite le décalage de mise en page).
// L'alternative textuelle est obligatoire (accessibilité).
export function Image({
  photo,
  src,
  alt,
  ratio = 'auto',
  eager = false,
  className,
}: {
  photo?: Photo;
  src?: string;
  alt?: string;
  ratio?: Ratio;
  eager?: boolean;
  className?: string;
}) {
  const url = photo?.src ?? src ?? '';
  const texte = photo?.alt ?? alt ?? '';
  const classes = ['rt-img', ratio !== 'auto' ? `rt-img--ratio-${ratio}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      <img
        src={url}
        alt={texte}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </span>
  );
}
