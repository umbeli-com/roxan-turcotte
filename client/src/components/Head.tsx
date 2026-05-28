import { useEffect } from 'react';
import { Head as SSGHead } from 'vite-react-ssg';
import { marque } from '@content/marque';

export type HeadProps = {
  titre: string;
  description: string;
  cheminCanonique: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: object;
  noindex?: boolean;
};

// Composant unique qui prend en charge le titre, les meta, l'OpenGraph,
// la balise canonique et le JSON-LD. Compatible SSG (vite-react-ssg) ET
// rendu client : le serveur prend les balises depuis <Head> de SSG, et
// l'effet useEffect met aussi à jour le DOM lorsqu'on navigue en SPA.

const baseUrl = marque.siteUrl;

export function PageHead({
  titre,
  description,
  cheminCanonique,
  image,
  type = 'website',
  schema,
  noindex,
}: HeadProps) {
  const titreFinal = titre.includes(marque.nomCourt) ? titre : `${titre} | ${marque.nomCourt}`;
  const url = baseUrl.replace(/\/$/, '') + cheminCanonique;
  const imageUrl = image ? (image.startsWith('http') ? image : baseUrl + image) : baseUrl + '/og-default.png';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = titreFinal;
  }, [titreFinal]);

  return (
    <SSGHead>
      <title>{titreFinal}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={titreFinal} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={marque.nomCourt} />
      <meta property="og:locale" content="fr_CA" />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titreFinal} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </SSGHead>
  );
}

// JSON-LD réutilisable : agent immobilier + entreprise locale.
export const schemaAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: marque.nom,
  description: 'Courtier immobilier résidentiel et commercial à Trois-Rivières, Royal LePage Centre.',
  url: marque.siteUrl,
  telephone: marque.contact.telephone,
  email: marque.contact.courriel,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Trois-Rivières',
    addressRegion: 'QC',
    addressCountry: 'CA',
    streetAddress: marque.contact.adresse,
  },
  areaServed: ['Trois-Rivières', 'Mauricie', 'Québec'],
  brand: {
    '@type': 'Brand',
    name: marque.banniere,
  },
  award: marque.reconnaissances.map((r) => `${r.titre} ${r.mention}`),
  slogan: marque.slogan,
};
