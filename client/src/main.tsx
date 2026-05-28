import './styles/index.css';
import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';

// `basename` doit refléter le `base` Vite, sinon React Router ne match pas
// les routes quand le site est servi sous un sous-chemin (ex. GitHub Pages
// à /roxan-turcotte/) et bascule en 404 après hydratation.
const baseUrl: string = (import.meta as any).env?.BASE_URL || '/';
const basename = baseUrl.replace(/\/+$/, '') || '/';

export const createRoot = ViteReactSSG({
  routes,
  basename,
});
