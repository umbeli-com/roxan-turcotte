import type { RouteRecord } from 'vite-react-ssg';
import { lazy } from 'react';
import { Layout } from '@/components/Layout';
import { services } from '@content/services';
import guidesContent from '@content/guides.json';

// Pages publiques (SSG). Imports paresseux pour permettre le découpage.
const Accueil = lazy(() => import('./public-site/Accueil'));
const APropos = lazy(() => import('./public-site/APropos'));
const Contact = lazy(() => import('./public-site/Contact'));
const ClubPrivilege = lazy(() => import('./public-site/ClubPrivilege'));
const PageNonTrouvee = lazy(() => import('./public-site/PageNonTrouvee'));

const IndexGuides = lazy(() => import('./public-site/guides/IndexGuides'));
const IndexCalculateurs = lazy(() => import('./public-site/calculateurs/IndexCalculateurs'));
const CalculateurFinancement = lazy(() => import('./public-site/calculateurs/Financement'));
const CalculateurTaxeBienvenue = lazy(() => import('./public-site/calculateurs/TaxeBienvenue'));
const CalculateurTaxesMunicipales = lazy(() => import('./public-site/calculateurs/TaxesMunicipales'));
const CalculateurFraisAcquisition = lazy(() => import('./public-site/calculateurs/FraisAcquisition'));

// Pages dynamiques rendues comme statiques via getStaticPaths.
import { PageGuide } from './public-site/guides/PageGuide';
import { ServicePage } from './public-site/services/Service';
import { LandingVente, LandingAchat, LandingChalet } from './public-site/landings/Landing';
import { PolitiqueConfidentialite, MentionsLegales, Desinscription, DemandeDeDonnees } from './public-site/legal/Legal';

// Back-office (CSR pur).
const AdminApp = lazy(() => import('./admin/AdminApp'));

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Accueil />, entry: 'src/public-site/Accueil.tsx' },
      { path: 'a-propos', element: <APropos />, entry: 'src/public-site/APropos.tsx' },
      { path: 'contact', element: <Contact />, entry: 'src/public-site/Contact.tsx' },
      { path: 'club-privilege', element: <ClubPrivilege />, entry: 'src/public-site/ClubPrivilege.tsx' },

      // Landings
      { path: 'vendre-ma-maison', element: <LandingVente /> },
      { path: 'acheter-une-maison', element: <LandingAchat /> },
      { path: 'location-chalet', element: <LandingChalet /> },

      // Services : une route par service, en statique.
      ...services.map((s) => ({
        path: `services/${s.slug}`,
        element: <ServicePage slug={s.slug} />,
      })),

      // Guides
      { path: 'guides', element: <IndexGuides /> },
      ...guidesContent.guides.map((g) => ({
        path: `guides/${g.slug}`,
        element: <PageGuide slug={g.slug} />,
      })),

      // Calculateurs
      { path: 'calculateurs', element: <IndexCalculateurs /> },
      { path: 'calculateurs/financement-hypothecaire', element: <CalculateurFinancement /> },
      { path: 'calculateurs/taxe-de-bienvenue', element: <CalculateurTaxeBienvenue /> },
      { path: 'calculateurs/taxes-municipales-scolaires', element: <CalculateurTaxesMunicipales /> },
      { path: 'calculateurs/frais-acquisition', element: <CalculateurFraisAcquisition /> },

      // Pages légales / Loi 25
      { path: 'politique-de-confidentialite', element: <PolitiqueConfidentialite /> },
      { path: 'mentions-legales', element: <MentionsLegales /> },
      { path: 'desinscription', element: <Desinscription /> },
      { path: 'demande-de-donnees', element: <DemandeDeDonnees /> },

      // Back-office (rendu client seulement, noindex).
      { path: 'admin/*', element: <AdminApp />, entry: 'src/admin/AdminApp.tsx' },

      // 404
      { path: '*', element: <PageNonTrouvee /> },
    ],
  },
];
