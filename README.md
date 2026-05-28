# Roxan Turcotte — Plateforme web et back-office

Plateforme prestige pour Roxan Turcotte, Courtier Immobilier inc., bannière Royal LePage Centre (Trois-Rivières, Québec). Conçue et exploitée par Umbeli.

Ce dépôt contient :
- `client/` : le **site public**, pré-rendu en HTML statique avec `vite-react-ssg` (React + Vite + React Router), et la coquille du **back-office** SPA (CSR pur, sous `/admin`).
- `server/` : l'**API Express** + base **SQLite** (`better-sqlite3`) qui reçoit les leads, gère les guides, l'infolettre, les calculateurs, l'export CSV paramétré et les demandes Loi 25.

> Le site public peut être déployé seul sur **GitHub Pages** (phase 1 : démonstration au client). Le back-office et l'API se déploient ensuite sur le **VPS Umbeli**, où ils consomment le même domaine `turcotte.umbeli.com` derrière le reverse proxy nginx-proxy.

## Démarrage local

Prérequis : Node.js 20 ou plus récent, npm 10 ou plus récent.

```bash
# À la racine du dépôt
npm install --workspaces

# Initialiser la base SQLite (schéma + étiquettes + admin par défaut)
npm run seed

# Lancer le site (vite, port 5173) et l'API (Express, port 3010) en parallèle
npm run dev
```

Le site public est disponible sur `http://localhost:5173/` ; l'API sur `http://localhost:3010/api/health`.

Compte admin par défaut (créé au seed) : `roxan` / `Bonjour-2026!` — **à changer** immédiatement après la première connexion. On peut aussi définir `ADMIN_USERNAME` et `ADMIN_PASSWORD` avant de lancer `npm run seed`.

## Variables d'environnement

Copier `.env.example` en `.env` à la racine, puis ajuster :
- `PORT` (3010 par défaut)
- `DATABASE_PATH` (chemin vers le fichier SQLite)
- `SESSION_SECRET` (chaîne aléatoire)
- `COOKIE_SECURE` (`true` en production HTTPS)
- `MAIL_*` (connecteur Outlook / Microsoft 365)
- `PUBLIC_BASE_URL` (URL publique du site, utilisée dans les courriels)

## Build de production

```bash
# Construire le site statique (SSG) — sortie dans client/dist/
npm run build
# Le post-build génère sitemap.xml, copie 404.html (fallback SPA),
# pose le CNAME (turcotte.umbeli.com) et un .nojekyll pour GitHub Pages.

# Démarrer l'API en production
npm run start
```

## Déploiement GitHub Pages (phase 1 — site public uniquement)

Le workflow `.github/workflows/pages.yml` reconstruit et déploie automatiquement `client/dist/` à chaque commit sur `main` qui touche le client. Étapes pour la mise en place :

1. Activer GitHub Pages sur le dépôt (Settings → Pages → Source : « GitHub Actions »).
2. Ajouter un enregistrement CNAME chez GoDaddy (zone DNS de `umbeli.com`) :
   - Type : `CNAME`
   - Hôte : `turcotte`
   - Valeur : `bclain.github.io` (ou la valeur indiquée par GitHub Pages).
3. Pousser sur `main`. Le workflow `pages.yml` construit le site et le publie sous `https://turcotte.umbeli.com/`.

> Pendant cette phase, les formulaires basculent en mode démo : la confirmation s'affiche à l'écran et les tentatives sont gardées localement (`localStorage`) à des fins de démonstration. Aucune donnée n'est envoyée à un serveur tant que l'API n'est pas déployée.

## Déploiement VPS (phase 2 — site + back-office + API)

À cette étape, on aligne `turcotte.umbeli.com` sur le VPS via nginx-proxy + letsencrypt (même pattern que `umbeli-web` ou `fepi-web`).

1. Construire l'image Docker (à venir : `Dockerfile` et `docker-compose.prod.yml` sur le modèle de `umbeli-web`).
2. Mettre `PUBLIC_BASE_URL=https://turcotte.umbeli.com` et fournir les secrets SMTP.
3. Mettre à jour le DNS pour pointer `turcotte.umbeli.com` sur l'IP du VPS au lieu de GitHub Pages.

## Structure

```
roxan-turcotte/
├── client/             # Site public (SSG) + back-office (SPA)
│   ├── content/        # Contenu éditorial (baked-in dans le HTML)
│   ├── public/         # Logo, favicon, robots
│   ├── scripts/        # Génération sitemap, prep Pages
│   └── src/
│       ├── components/
│       ├── public-site/
│       └── admin/
├── server/             # API Express + SQLite
│   └── src/
│       ├── routes/
│       ├── db/
│       ├── services/
│       └── middleware/
└── .github/workflows/pages.yml
```

## Notes de conformité

- Tous les formulaires intègrent le consentement Loi 25 (case non pré-cochée), un honeypot anti-pourriel, et l'`autocomplete` natif. Aucune redirection externe.
- Les calculateurs s'exécutent côté client et affichent une mention légale obligatoire à chaque page.
- Les guides, les municipalités et les profils d'export CSV sont gérables depuis le back-office (phase 2).

## Réalisation

Umbeli — `umbeli.com`. Contact : `brice@umbeli.com`.
