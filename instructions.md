# PROMPT MAITRE — Plateforme web et back-office « Roxan Turcotte, Courtier Immobilier »

> **Pour l'agent constructeur (Opus ou équivalent).** Ce document est ta spécification complète et ta seule source de vérité. Tu dois livrer un projet fonctionnel, complet, et copier-collable, sans extraits partiels. Lis tout avant de commencer. À la fin du document tu trouveras la liste exacte des livrables et les critères d'acceptation. Construis le projet section par section, dans l'ordre des priorités définies.
>
> **Règles de rédaction du code et du contenu :** aucun tiret cadratin nulle part. Tout le contenu visible côté public est en français du Québec. Le code doit être complet, prêt à l'emploi, commenté en français là où c'est utile. Pas de pseudo-code, pas de « … à compléter ».

---

## 1. Mission

Construire une plateforme web sur mesure pour **Roxan Turcotte**, courtier immobilier résidentiel et commercial chez **Royal LePage Centre** (Trois-Rivières, Québec), qui opère aussi une activité secondaire **Sunset** (immobilier dans le Sud) et une activité **chalets / location de type Airbnb**.

La plateforme remplace entièrement un ancien site WordPress jugé inadapté. Elle se compose de deux applications dans un seul dépôt :

1. **Le site façade (public)** : vitrine prestige, multi sections, optimisée pour le référencement, dont le rôle central est la **génération de leads**. Aucune redirection vers des outils externes. L'internaute reste sur le site du début à la fin.
2. **Le back-office (privé)** : un **mini-CRM** qui regroupe tous les leads provenant de toutes les sources (formulaires, téléchargements de guides, calculateurs, infolettre), avec gestion par étiquettes, export CSV paramétré par entité, gestion des guides, et envoi d'infolettres.

L'objectif d'affaires : capter le maximum de prospects qualifiés sur le site lui-même, les organiser par source, et permettre à Roxan de les exporter ou de les recontacter sans friction.

---

## 2. Le client et son positionnement

* **Nom commercial :** Roxan Turcotte, Courtier Immobilier inc.
* **Bannière :** Royal LePage Centre, agence immobilière franchisée indépendante et autonome.
* **Territoire principal :** Trois-Rivières et la Mauricie (Québec).
* **Slogan existant :** « Passionné, ouvert sur le monde ! »
* **Reconnaissances à mettre en valeur :** Top 10 % National Royal LePage 2025, Prix Platine du Directeur 2025, 23 années d'expérience en construction neuve, 8 années comme entrepreneur général en construction neuve.
* **Promesse type (accroche bannière fournie) :** « Vous pensez vendre votre maison ? Obtenez une stratégie de mise en marché professionnelle ! »
* **Domaine :** rturcotte.ca (géré chez GoDaddy par le client). Hébergement pris en charge par Umbeli.
* **Page agent de référence :** royallepage.ca, profil Trois-Rivières, Roxan Turcotte.

Positionnement de marque visé : **prestige, confiance, expertise**. On vise le haut de gamme sobre, pas le tape-à-l'œil. Le client a une expertise rare en construction neuve qui doit transparaître.

---

## 3. Stack technique imposée

Cette stack est imposée par le donneur d'ordre. Ne la remplace pas.

* **Frontend :** React (avec Vite).
* **Backend :** Node.js avec Express.
* **Base de données :** SQLite (via `better-sqlite3`), pour l'instant. Le code d'accès aux données doit être isolé dans une couche `repository` afin qu'une migration future vers PostgreSQL soit simple.
* **Langage :** JavaScript moderne (ES Modules). TypeScript accepté et recommandé si tu peux le livrer entièrement typé et fonctionnel, sinon JavaScript propre.

### 3.1 Contrainte SEO critique : rendu statique des pages publiques

Le donneur d'ordre exige que **les pages publiques soient rendues avec du vrai HTML et du vrai CSS, avec les vraies valeurs présentes dès le chargement initial**. Les pages publiques ne doivent **pas** aller chercher leur contenu dans l'API au moment de l'affichage. Raisons : performance et référencement (le contenu doit être dans le HTML servi).

**Approche imposée :** génération statique au moment du build (SSG).

* Utilise **`vite-react-ssg`** avec **React Router** pour pré-rendre chaque page publique en HTML statique au build. Chaque page publique a donc son fichier HTML complet avec le contenu réel à l'intérieur.
* Le **contenu éditorial** des pages publiques (textes, titres, descriptions de services, métadonnées des guides, données des municipalités pour les calculateurs) est stocké dans des **modules de contenu locaux** (fichiers `.ts` ou `.json` dans `content/`), pas dans la base de données. Ce contenu est compilé dans le build. Modifier le contenu = modifier le fichier et rebuild.
* **Seules les actions dynamiques** appellent l'API par `fetch` côté client après interaction de l'utilisateur :
  * soumission d'un formulaire de contact ou de demande de service,
  * téléchargement d'un guide (échange de coordonnées),
  * calculs des calculateurs (le calcul peut se faire entièrement côté client en JavaScript ; l'API ne sert qu'à journaliser le lead si l'utilisateur laisse ses coordonnées),
  * inscription à l'infolettre.
* Le **back-office** est une **SPA classique en rendu client (CSR)**, protégée par authentification, qui elle consomme l'API normalement. Aucun besoin de SEO sur le back-office, qui doit même être `noindex`.

Chaque page publique doit inclure ses balises `<title>`, `<meta name="description">`, balises Open Graph, données structurées **JSON-LD** de type `RealEstateAgent` et `LocalBusiness`, et une URL canonique. Génère un `sitemap.xml` et un `robots.txt` au build (le back-office et les routes privées en `Disallow`).

---

## 4. Identité de marque complète

Le client fournira son logo (emblème : un **félin doré majestueux**, un lion stylisé avec une crinière travaillée, sur fond sombre). Tu dois construire tout le système visuel autour de cet emblème. Esthétique générale : **or et noir, prestige**, inspirée de la bannière fournie (fond charbon, fines lignes de plan d'architecte en filigrane, lettrage gravé doré).

### 4.1 Palette de couleurs (variables CSS à utiliser partout)

```css
:root {
  /* Fonds sombres */
  --rt-noir:        #0B0B0C; /* fond principal */
  --rt-charbon:     #161618; /* surfaces, sections alternées */
  --rt-charbon-2:   #1F1F22; /* cartes, encarts */
  --rt-ligne:       #2C2C30; /* filets, bordures discrètes */

  /* Or (accent signature, usage parcimonieux = luxe) */
  --rt-or:          #C8A24A; /* or principal */
  --rt-or-clair:    #E6C878; /* or champagne, survols, dégradés hauts */
  --rt-or-fonce:    #9A7B2E; /* or bronze, dégradés bas, ombrages */
  --rt-or-soft:     rgba(200, 162, 74, 0.12); /* fonds d'accent très légers */

  /* Texte */
  --rt-ivoire:      #F5F2EA; /* texte principal sur fond sombre */
  --rt-gris-texte:  #B7B3AB; /* texte secondaire */
  --rt-gris-faible: #6E6B65; /* texte tertiaire, légendes */

  /* Co-branding Royal LePage (usage strictement limité aux blocs RLP) */
  --rlp-rouge:      #E2231A;

  /* États (surtout pour le back-office) */
  --rt-succes:      #3FA66A;
  --rt-alerte:      #E0A92E;
  --rt-erreur:      #D2493B;

  /* Dégradé or signature (titres, filets, boutons accent) */
  --rt-degrade-or:  linear-gradient(135deg, #E6C878 0%, #C8A24A 45%, #9A7B2E 100%);
}
```

Mode dominant : **sombre**. Le site public est majoritairement sur fond noir et charbon, l'or sert d'accent rare et précieux, l'ivoire pour la lecture. Le back-office peut proposer un thème plus clair et neutre pour la lisibilité des données, tout en gardant l'or comme couleur primaire d'action.

### 4.2 Typographie

Charge les polices via Google Fonts ou en auto-hébergement (préférable pour la performance et le SEO).

* **Titres signature (H1, héros, nom de marque) :** **Cinzel** (serif gravé, tout en capitales) pour rappeler le lettrage du logo. Prestige immédiat.
* **Sous-titres et accroches éditoriales :** **Cormorant Garamond** (serif élégant, italique possible pour les citations et accroches).
* **Corps de texte, navigation, interface :** **Inter** (sans serif lisible et moderne). Le back-office utilise Inter exclusivement.

Échelle typographique indicative (à adapter en `clamp()` responsive) :

* H1 héros : Cinzel, 48 à 72 px, lettrage espacé (`letter-spacing: 0.04em`).
* H2 : Cinzel ou Cormorant, 32 à 44 px.
* H3 : Cormorant Garamond 600, 24 à 28 px.
* Corps : Inter, 16 à 18 px, interligne 1.7.
* Légendes et mentions légales : Inter, 12 à 13 px, `--rt-gris-faible`.

### 4.3 Composants et motifs visuels

* **Emblème du lion doré** : présent dans l'en-tête, en favicon, et en filigrane discret dans certains fonds de section (très faible opacité).
* **Motif de plan d'architecte** en filigrane (lignes fines dorées sur noir), comme dans la bannière, pour les fonds de sections héros. Opacité 4 à 8 %.
* **Filets dorés** fins comme séparateurs de sections plutôt que de gros blocs colorés.
* **Cartes** : fond `--rt-charbon-2`, bordure 1 px `--rt-ligne`, liseré ou coin supérieur doré au survol. Coins légèrement arrondis (6 à 8 px), pas plus : le luxe reste sobre.
* **Boutons primaires** : fond dégradé or `--rt-degrade-or`, texte `--rt-noir`, lettrage Inter 600. Survol : légère élévation et éclaircissement.
* **Boutons secondaires** : contour doré 1 px, texte or, fond transparent.
* **Badges de reconnaissance** (Top 10 %, Prix Platine, 23 ans, 8 ans) : pastilles circulaires contour doré sur fond sombre, reprises de la bannière.
* **Espacements généreux**, beaucoup de respiration, sections hautes. Le vide fait partie du luxe.
* **Animations** : sobres et lentes (apparitions au défilement en fondu et translation douce, survols progressifs). Rien de clinquant.
* **Accessibilité** : contraste suffisant (l'or clair `--rt-or-clair` sur noir pour le texte courant si besoin, l'or principal réservé aux accents et aux gros titres), focus visibles, navigation clavier complète, attributs `aria` corrects, balises sémantiques.

### 4.4 Ton de voix

Professionnel, confiant, chaleureux, haut de gamme sans prétention. On parle de **stratégie de mise en marché**, d'**accompagnement**, d'**expertise en construction neuve**. On valorise les reconnaissances obtenues. On vouvoie le visiteur. On évite le jargon inutile. Chaque section publique doit avoir un appel à l'action clair qui mène à un formulaire interne.

---

## 5. Arborescence du site public

Toutes les pages ci-dessous sont **pré-rendues en HTML statique** (sauf mention privée). Navigation principale claire, pied de page complet avec liens sociaux, mentions légales et politique de confidentialité.

### 5.1 Pages principales

| Route | Page | Rôle |
|---|---|---|
| `/` | Accueil | Héros prestige, présentation de Roxan, reconnaissances, aperçu des services, témoignages, appels à l'action vers les formulaires et les guides. |
| `/a-propos` | À propos | Parcours, expertise construction neuve (23 ans), valeurs, photo, slogan « Passionné, ouvert sur le monde ! ». |
| `/contact` | Contact | Coordonnées, carte, formulaire de contact général. |

### 5.2 Landing pages (pages d'atterrissage de conversion)

Chaque landing page est une page de vente focalisée avec un formulaire interne pré-étiqueté selon la page d'origine.

| Route | Landing | Étiquette de lead par défaut |
|---|---|---|
| `/vendre-ma-maison` | Vente de maison | `vente` + `royal-lepage` |
| `/acheter-une-maison` | Achat de maison | `achat` + `royal-lepage` |
| `/location-chalet` | Chalet / location courte durée | `chalet` |

Contenu type d'une landing : accroche forte, bénéfices, preuve sociale, processus en étapes, formulaire de capture, mentions de réassurance. Aucun lien sortant vers un outil externe.

### 5.3 Pages de services et formulaires dédiés

Un formulaire de demande par service. Chaque soumission est **pré-étiquetée** selon le service et l'entité, pour le tri dans le CRM. Liste des services et de leurs étiquettes :

| Route | Service | Entité / source | Étiquette CRM | Priorité |
|---|---|---|---|---|
| `/services/courtier-immobilier` | Courtage immobilier résidentiel | Royal LePage | `royal-lepage`, `immobilier` | Priorité 1 |
| `/services/sunset` | Immobilier dans le Sud (Sunset) | Sunset | `sunset`, `immo-sud` | Secondaire |
| `/services/chalets` | Chalets et location courte durée (Airbnb) | Chalets | `chalet`, `airbnb` | Secondaire |
| `/services/investissement-immobilier` | Investissement immobilier | Royal LePage | `investissement` | Standard |
| `/services/commercial` | Immobilier commercial | Royal LePage | `commercial` | Standard |
| `/services/international` | Immobilier international | Réseau | `international` | Standard |

> Le client opère sous deux entités avec des CRM externes distincts (Royal LePage avec Bold Trail / Sper, et Sunset sans accès direct). Le mini-CRM du site centralise tout, puis l'export CSV paramétré permet de réinjecter manuellement les leads dans le bon CRM externe selon l'étiquette. Aucun lead ne doit échapper au mini-CRM interne.

### 5.4 Section « Club Privilège »

| Route | Page |
|---|---|
| `/club-privilege` | Présentation d'un programme de fidélité ou d'accès privilégié (avantages, contenus exclusifs, inscription par formulaire qui alimente l'infolettre et le CRM avec l'étiquette `club-privilege`). |

### 5.5 Guides téléchargeables

Page index des guides plus une page par guide. **Chaque guide se télécharge en échange du nom, du numéro de téléphone et du courriel**, ce qui crée un lead dans le CRM et déclenche l'envoi du guide par courriel.

| Route | Page |
|---|---|
| `/guides` | Index de tous les guides, présentation prestige avec visuels de couverture. |
| `/guides/:slug` | Page d'un guide : description, table des matières, aperçu, formulaire de capture (nom, téléphone, courriel, consentement). |

Guides prévus au lancement (la liste est gérable depuis le back-office) :

* `guide-de-lacheteur` : Guide de l'acheteur.
* `guide-du-vendeur` : Guide du vendeur.
* `guide-home-staging` : Guide de la valorisation résidentielle (home staging).
* `guide-investisseur` : Guide de l'investisseur immobilier.
* Prévoir l'ajout facile d'autres guides depuis le back-office.

Flux de téléchargement :
1. L'utilisateur remplit le formulaire (nom, téléphone, courriel, case de consentement Loi 25).
2. `POST /api/guides/:slug/download` crée ou met à jour le lead, journalise le téléchargement, et déclenche l'envoi du courriel contenant le guide (voir section connecteur courriel).
3. Le fichier est servi (lien sécurisé temporaire) et envoyé par courriel. Le visiteur reçoit une confirmation à l'écran sans quitter le site.

### 5.6 Calculateurs pour acheteurs

Section dédiée. **Tous les calculs se font côté client en JavaScript** (rendu statique, aucune dépendance API pour calculer). Chaque calculateur affiche une **mention légale obligatoire** indiquant que les résultats sont approximatifs et doivent être validés auprès de professionnels. Les calculateurs privilégient l'affichage de **fourchettes** plutôt que de montants fixes lorsque les données varient.

| Route | Calculateur |
|---|---|
| `/calculateurs` | Index des calculateurs. |
| `/calculateurs/financement-hypothecaire` | Versements hypothécaires (référence : outil Desjardins). |
| `/calculateurs/taxe-de-bienvenue` | Droits de mutation immobilière (taxe de bienvenue), par municipalité. |
| `/calculateurs/taxes-municipales-scolaires` | Taxes municipale et scolaire, par municipalité (menu déroulant). |
| `/calculateurs/frais-acquisition` | Estimation globale des frais d'acquisition : notaire, inspection, ajustements chez le notaire, fourchettes. |

Détails dans la section 8.

À la fin de chaque calcul, proposer (sans l'imposer) un appel à l'action : « Recevez une analyse personnalisée » qui ouvre un formulaire de capture pré-étiqueté `calculateur` plus le type. Le calcul reste utilisable sans laisser de coordonnées.

### 5.7 Pages légales et système

| Route | Page |
|---|---|
| `/politique-de-confidentialite` | Politique de confidentialité conforme à la Loi 25 (Québec). |
| `/mentions-legales` | Mentions légales. |
| `/desinscription` | Page de désinscription de l'infolettre (jeton dans l'URL). |
| `/demande-de-donnees` | Formulaire de demande d'accès ou de suppression de données personnelles (Loi 25). |

### 5.8 Sections exclues du lancement

Certaines sections ne sont **pas finalisées** et ne doivent **pas** être affichées ni liées dans la navigation au lancement, afin d'éviter toute frustration du visiteur. Exemple connu : **podcast**. Architecture le projet pour qu'on puisse activer ces sections plus tard via un simple drapeau de configuration (`features.podcast = false`), mais ne les expose pas tant qu'elles ne sont pas prêtes.

---

## 6. Système de formulaires et génération de leads

C'est le cœur de la valeur d'affaires. Soigne-le.

### 6.1 Principes

* **Aucune redirection externe.** Tous les formulaires sont internes au site. Rediriger vers Bold Trail, Sunset ou tout autre outil externe casse la confiance et fait abandonner l'utilisateur.
* **Pré-étiquetage automatique** : chaque formulaire transmet l'étiquette de sa page d'origine et son type. Le lead arrive déjà classé dans le CRM.
* **Pas de compte client.** Le client ne veut imposer aucune création de compte (friction). Pour le confort des visiteurs récurrents, on s'appuie uniquement sur l'**autocomplétion native du navigateur** (attributs `autocomplete` corrects sur tous les champs : `name`, `given-name`, `family-name`, `email`, `tel`). On n'implémente pas de logique de mémorisation côté serveur ni de compte.
* **Consentement Loi 25** : case à cocher explicite et non pré-cochée sur chaque formulaire, avec texte clair sur l'usage des données et lien vers la politique de confidentialité. On enregistre la date et l'heure du consentement.
* **Anti-pourriel** : champ honeypot caché plus limitation de débit côté serveur (voir sécurité). Pas de CAPTCHA bloquant au lancement (friction), mais le code doit être prêt à en ajouter un.
* **Confirmation à l'écran** après soumission, sans quitter la page, avec message rassurant.

### 6.2 Champs standards d'un lead

Minimum : prénom, nom, courriel, téléphone, message (optionnel selon le formulaire), consentement. Champs systèmes ajoutés automatiquement : étiquettes, page d'origine, type de formulaire, source d'entité, horodatage, adresse IP (pour la conformité et l'anti-abus, mentionnée dans la politique de confidentialité).

### 6.3 Formulaires de référence vers partenaires

Prévoir des formulaires de mise en relation avec des partenaires (assurance Beneva, courtiers hypothécaires, notaires). Ces formulaires **restent internes** : ils capturent le lead dans le CRM avec une étiquette `reference-partenaire` plus le nom du partenaire, et déclenchent un envoi de courriel interne. On ne redirige pas vers le site du partenaire. (Priorité d'implémentation : après le site et le CRM.)

---

## 7. Back-office : mini-CRM et gestion

Application SPA privée, protégée par authentification, en rendu client. Thème lisible (l'or reste la couleur d'action). En `noindex`. Toutes les routes sous `/admin`.

### 7.1 Authentification et sécurité d'accès

* Connexion par nom d'utilisateur et mot de passe, mots de passe hachés avec `bcrypt`.
* Session par **cookie HTTP-only sécurisé** (préférable) ou jeton JWT en cookie HTTP-only. Pas de jeton en `localStorage`.
* Rôles : `admin` (Roxan et Umbeli). Prévoir le champ `role` pour une extension future, mais un seul rôle suffit au lancement.
* Le compte initial est créé par une commande de seed, pas par une page d'inscription publique. **Ne jamais créer de page d'inscription publique pour le back-office.**

### 7.2 Tableau de bord

Vue d'ensemble : nombre de leads par source et par étiquette, leads des 7 et 30 derniers jours, derniers leads reçus, téléchargements de guides, abonnés à l'infolettre, demandes Loi 25 en attente. Graphiques simples et lisibles.

### 7.3 Gestion des leads

* Liste filtrable et triable : par étiquette, par entité (Royal LePage, Sunset, chalets, etc.), par type de formulaire, par statut, par date, par recherche texte (nom, courriel, téléphone).
* Statuts de lead : `nouveau`, `contacte`, `qualifie`, `client`, `perdu`, `archive`. Modifiable.
* Fiche de lead détaillée : toutes les coordonnées, l'historique (formulaire d'origine, guides téléchargés, calculateurs utilisés, page d'origine), notes internes ajoutables, étiquettes modifiables, statut, horodatages, état du consentement.
* Ajout, modification, et **archivage** (suppression douce) des leads. La suppression définitive est réservée aux demandes Loi 25 et journalisée.

### 7.4 Système d'étiquettes (tags)

* Étiquettes gérables depuis le back-office (création, renommage, couleur, association à une entité).
* Étiquettes par défaut à initialiser au seed : `royal-lepage`, `sunset`, `chalet`, `airbnb`, `investissement`, `commercial`, `international`, `achat`, `vente`, `club-privilege`, `guide`, `calculateur`, `infolettre`, `reference-partenaire`.
* Un lead peut porter plusieurs étiquettes (relation plusieurs à plusieurs).

### 7.5 Export CSV paramétré

Fonction clé pour réinjecter les leads dans les CRM externes (Bold Trail pour Royal LePage, etc.).

* Export **filtré** par étiquette, par entité, par plage de dates, par statut.
* **Colonnes paramétrables** : l'utilisateur choisit les colonnes et leur ordre, car le format d'import attendu par Bold Trail doit être respecté. Le format CSV cible de Bold Trail sera fourni par le client et devra être validé avant mise en service. Prévois donc un système de **profils d'export** (mappage de colonnes nommé et réutilisable) afin de pouvoir enregistrer un profil « Bold Trail », un profil « Sunset », etc.
* Encodage UTF-8 avec BOM (compatibilité Excel et imports québécois avec accents), séparateur configurable (virgule ou point-virgule).
* Prévoir une **automatisation d'envoi** des exports (quotidien ou hebdomadaire) par courriel : tâche planifiée côté serveur qui génère l'export selon un profil et l'envoie à une adresse définie. Implémentable après le socle CRM.

### 7.6 Gestion des guides

* CRUD complet des guides : titre, slug, description, table des matières, image de couverture, fichier à téléverser (PDF), catégorie, étiquette associée, état actif ou inactif.
* Les guides actifs apparaissent automatiquement sur le site public (mais souviens-toi : le contenu éditorial des pages publiques est en SSG, donc prévois que l'ajout d'un guide nécessite un rebuild du site public, ou bien sers la liste des guides via un fichier de contenu régénéré au build. Documente clairement ce comportement pour le client).
* Statistiques par guide : nombre de téléchargements, derniers leads ayant téléchargé.

### 7.7 Infolettre

* Liste des abonnés (issus des formulaires avec consentement infolettre, du Club Privilège, et des téléchargements de guides si la case infolettre est cochée).
* Composition et envoi de campagnes d'infolettre (sujet, corps en HTML simple, sélection d'un segment par étiquette).
* Envoi via le connecteur courriel (voir section 9).
* **Désinscription en un clic** via jeton unique dans chaque courriel, page `/desinscription`. Obligation légale.
* Journal des envois.

### 7.8 Gestion de la conformité Loi 25

* Vue des **demandes d'accès et de suppression** de données reçues via `/demande-de-donnees`.
* Traitement d'une demande : marquer comme traitée, exporter les données d'une personne (droit d'accès), ou supprimer définitivement les données d'une personne (droit à l'effacement) avec journalisation de l'action.
* Registre des incidents de confidentialité (table simple, saisie manuelle), exigé par la Loi 25.

### 7.9 Paramètres et données des calculateurs

* Gestion des **municipalités** et de leurs taux : taux de droits de mutation par tranche, taux de taxe scolaire, taux de taxe municipale. Ces données alimentent les calculateurs du site public (régénérées dans un fichier de contenu au build).
* Gestion des **fourchettes de coûts** (notaire, inspection, ajustements) utilisées par le calculateur de frais d'acquisition. Ces données seront fournies et validées par le client avant intégration. Tant qu'elles ne sont pas fournies, utilise des valeurs d'exemple clairement marquées comme provisoires.

---

## 8. Spécifications des calculateurs

Tous côté client, en JavaScript, avec mention légale obligatoire. Valeurs paramétrables via les fichiers de contenu générés depuis le back-office.

### 8.1 Calculateur de versements hypothécaires

Entrées : prix de la propriété, mise de fonds (montant ou pourcentage), taux d'intérêt annuel, période d'amortissement (années), fréquence des versements (mensuelle, aux deux semaines, hebdomadaire). Sortie : versement périodique, intérêts totaux, coût total. Affiche aussi l'estimation de l'assurance prêt SCHL si la mise de fonds est inférieure à 20 % (avec mention que c'est approximatif).

Formule du versement (amortissement classique) :

```
i = taux_annuel / nombre_de_periodes_par_an
n = annees * nombre_de_periodes_par_an
P = montant_emprunte
versement = P * i / (1 - (1 + i)^(-n))
```

### 8.2 Calculateur de taxe de bienvenue (droits de mutation immobilière)

Calcul progressif par tranches sur la base d'imposition (le plus élevé du prix de vente, du montant de la contrepartie, ou de la valeur municipale uniformisée). Les tranches de base provinciales sont indexées annuellement et certaines municipalités ajoutent des tranches supérieures. **Ne code pas les taux en dur comme vérité absolue** : rends-les entièrement configurables par municipalité via les données du back-office, et affiche la mention que les taux doivent être validés et qu'ils sont indexés chaque année.

Structure attendue (exemple de configuration, à valider et indexer) :

```js
// Exemple de structure, valeurs à confirmer et indexer annuellement
const tranchesParDefaut = [
  { plafond: 61500,  taux: 0.005 },
  { plafond: 307800, taux: 0.010 },
  { plafond: Infinity, taux: 0.015 }
];
// Une municipalité peut surcharger avec des tranches supplémentaires
```

Menu déroulant de sélection de la municipalité, qui charge la configuration de tranches correspondante. Affichage du résultat en montant et rappel que c'est une estimation.

### 8.3 Calculateur de taxes municipales et scolaires

Entrée : municipalité (menu déroulant) et valeur de l'évaluation municipale. Sortie : taxe municipale annuelle estimée et taxe scolaire annuelle estimée, à partir des taux configurés par municipalité dans le back-office. Affiche des fourchettes si les taux varient. Mention légale.

### 8.4 Calculateur de frais d'acquisition

Agrège des estimations en **fourchettes** : frais de notaire, inspection préachat, ajustements chez le notaire (taxes payées d'avance, etc.), et autres frais courants. Les fourchettes proviennent des données fournies par le client. Affiche un total estimé sous forme de fourchette. Mention légale appuyée : ces montants sont approximatifs et doivent être confirmés auprès des professionnels concernés.

### 8.5 Mention légale type (à afficher sur chaque calculateur)

> Les résultats fournis par cet outil sont approximatifs et présentés à titre informatif seulement. Ils ne constituent pas un avis professionnel, financier, fiscal ou juridique. Les montants réels peuvent varier. Validez toujours ces estimations auprès des professionnels concernés (institution financière, notaire, évaluateur, municipalité) avant toute décision.

---

## 9. Connecteur courriel (envois automatiques)

Le client dispose d'un **connecteur Outlook** permettant l'envoi automatique de courriels depuis l'adresse de Roxan. Umbeli fournit ce connecteur.

* Conçois une **couche d'envoi courriel abstraite** (`services/mail`) avec une interface unique (`sendMail({ to, subject, html, attachments })`), et une implémentation par transport. Au lancement, prévois un transport **SMTP** (via `nodemailer`) configurable par variables d'environnement (compatible Outlook / Microsoft 365), et garde la possibilité d'ajouter un transport API Microsoft Graph plus tard sans toucher au reste du code.
* Les paramètres de connexion (hôte, port, identifiants, adresse d'expéditeur) sont dans des **variables d'environnement**, jamais en dur dans le code.
* Cas d'usage : envoi du guide après capture, courriel de confirmation au lead, notification interne à Roxan à chaque nouveau lead, campagnes d'infolettre, exports CSV planifiés, courriels de désinscription et de réponse aux demandes Loi 25.
* Tous les courriels marketing incluent un lien de désinscription. Gabarits de courriels aux couleurs de la marque (or et noir, sobres, compatibles clients de messagerie).

---

## 10. Conformité Loi 25 (protection des renseignements personnels, Québec)

Obligatoire. À intégrer dès le départ.

* **Consentement explicite** et éclairé à la collecte, sur chaque formulaire (case non pré-cochée), avec finalité claire et lien vers la politique de confidentialité.
* **Politique de confidentialité** complète et accessible, expliquant les données collectées, les finalités, la conservation, les droits de la personne, et les coordonnées du responsable de la protection des renseignements personnels.
* **Droit d'accès** : possibilité pour une personne de demander ses données ; le back-office permet d'exporter les données d'une personne.
* **Droit de rectification et d'effacement** : suppression définitive sur demande, journalisée.
* **Désinscription** simple de l'infolettre.
* **Registre des incidents de confidentialité** dans le back-office.
* **Minimisation** : ne collecte que les données nécessaires. Conserve l'IP et l'horodatage du consentement à des fins de preuve et de sécurité, mentionnés dans la politique.
* Les demandes peuvent être traitées manuellement par Roxan via le back-office (réponse par courriel ou suppression).

---

## 11. Schéma de base de données SQLite

Couche d'accès isolée dans `server/db` avec un module `repository` par entité. Migrations versionnées (fichiers SQL numérotés ou via une petite fonction de migration au démarrage). Voici le schéma cible.

```sql
-- Leads (prospects), cœur du CRM
CREATE TABLE leads (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  prenom          TEXT NOT NULL,
  nom             TEXT NOT NULL,
  courriel        TEXT NOT NULL,
  telephone       TEXT,
  message         TEXT,
  type_formulaire TEXT NOT NULL,       -- ex: contact, service-courtier, guide, calculateur, club-privilege
  source_entite   TEXT,                -- ex: royal-lepage, sunset, chalets, reseau
  page_origine    TEXT,                -- URL ou identifiant de la page d'origine
  statut          TEXT NOT NULL DEFAULT 'nouveau', -- nouveau, contacte, qualifie, client, perdu, archive
  consentement            INTEGER NOT NULL DEFAULT 0, -- 0/1
  consentement_horodatage TEXT,
  consentement_infolettre INTEGER NOT NULL DEFAULT 0,
  adresse_ip      TEXT,
  notes_internes  TEXT,
  cree_le         TEXT NOT NULL DEFAULT (datetime('now')),
  modifie_le      TEXT NOT NULL DEFAULT (datetime('now')),
  archive         INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_leads_courriel ON leads(courriel);
CREATE INDEX idx_leads_statut   ON leads(statut);
CREATE INDEX idx_leads_cree_le  ON leads(cree_le);

-- Étiquettes
CREATE TABLE tags (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  nom     TEXT NOT NULL UNIQUE,
  couleur TEXT,
  entite  TEXT
);

-- Relation leads <-> tags (plusieurs à plusieurs)
CREATE TABLE lead_tags (
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lead_id, tag_id)
);

-- Guides téléchargeables
CREATE TABLE guides (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  titre           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  table_matieres  TEXT,
  image_couverture TEXT,
  fichier_chemin  TEXT NOT NULL,
  categorie       TEXT,
  tag_id          INTEGER REFERENCES tags(id),
  actif           INTEGER NOT NULL DEFAULT 1,
  nb_telechargements INTEGER NOT NULL DEFAULT 0,
  cree_le         TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Téléchargements de guides (lien lead <-> guide)
CREATE TABLE guide_downloads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id     INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  guide_id    INTEGER NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  telecharge_le TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Soumissions de calculateurs (journalisation optionnelle si le lead laisse ses coordonnées)
CREATE TABLE calculator_submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id     INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  type        TEXT NOT NULL, -- financement, taxe-bienvenue, taxes, frais-acquisition
  entrees     TEXT,          -- JSON
  resultat    TEXT,          -- JSON
  cree_le     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Abonnés infolettre
CREATE TABLE newsletter_subscribers (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  courriel        TEXT NOT NULL UNIQUE,
  prenom          TEXT,
  statut          TEXT NOT NULL DEFAULT 'actif', -- actif, desinscrit
  jeton_desinscription TEXT NOT NULL UNIQUE,
  abonne_le       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Campagnes infolettre
CREATE TABLE newsletter_campaigns (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  sujet     TEXT NOT NULL,
  corps_html TEXT NOT NULL,
  segment_tag_id INTEGER REFERENCES tags(id),
  statut    TEXT NOT NULL DEFAULT 'brouillon', -- brouillon, envoyee
  envoye_le TEXT,
  cree_le   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Municipalités et taux (alimentent les calculateurs)
CREATE TABLE municipalities (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nom           TEXT NOT NULL,
  region        TEXT,
  tranches_mutation TEXT,   -- JSON des tranches de droits de mutation
  taux_scolaire REAL,
  taux_municipal REAL,
  actif         INTEGER NOT NULL DEFAULT 1
);

-- Profils d'export CSV (mappage de colonnes réutilisable)
CREATE TABLE export_profiles (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nom       TEXT NOT NULL,   -- ex: Bold Trail, Sunset
  colonnes  TEXT NOT NULL,   -- JSON ordonné du mappage colonnes
  separateur TEXT NOT NULL DEFAULT ',',
  cree_le   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Demandes Loi 25 (accès / suppression)
CREATE TABLE data_requests (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  courriel    TEXT NOT NULL,
  type        TEXT NOT NULL, -- acces, suppression, rectification
  message     TEXT,
  statut      TEXT NOT NULL DEFAULT 'en-attente', -- en-attente, traitee
  demande_le  TEXT NOT NULL DEFAULT (datetime('now')),
  traite_le   TEXT
);

-- Registre des incidents de confidentialité (Loi 25)
CREATE TABLE privacy_incidents (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  gravite     TEXT,
  mesures     TEXT,
  survenu_le  TEXT,
  consigne_le TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Journal des courriels envoyés
CREATE TABLE email_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id   INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  destinataire TEXT NOT NULL,
  type      TEXT NOT NULL, -- guide, confirmation, notification-interne, infolettre, desinscription, loi25
  sujet     TEXT,
  statut    TEXT NOT NULL, -- envoye, echec
  erreur    TEXT,
  envoye_le TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Utilisateurs du back-office
CREATE TABLE admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_utilisateur TEXT NOT NULL UNIQUE,
  mot_de_passe_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',
  cree_le       TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 12. Spécifications de l'API (Express)

API REST sous `/api`. Réponses JSON. Validation systématique des entrées (avec `zod` ou équivalent). Gestion d'erreurs centralisée. Codes HTTP corrects.

### 12.1 Routes publiques

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/leads` | Créer un lead depuis un formulaire (contact, service, club privilège). Corps : coordonnées, type_formulaire, source_entite, page_origine, tags, consentement. |
| POST | `/api/guides/:slug/download` | Capturer le lead, journaliser le téléchargement, envoyer le guide par courriel, retourner le lien sécurisé du fichier. |
| POST | `/api/newsletter/subscribe` | Inscrire un courriel à l'infolettre. |
| GET | `/api/newsletter/unsubscribe/:jeton` | Désinscrire via jeton. |
| POST | `/api/calculators/log` | Journaliser une soumission de calculateur si le lead laisse ses coordonnées (optionnel). |
| POST | `/api/data-requests` | Enregistrer une demande Loi 25 (accès, suppression, rectification). |

### 12.2 Routes privées (authentifiées, sous `/api/admin`)

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/admin/login` | Connexion. |
| POST | `/api/admin/logout` | Déconnexion. |
| GET | `/api/admin/me` | Vérifier la session. |
| GET | `/api/admin/dashboard` | Statistiques. |
| GET | `/api/admin/leads` | Lister avec filtres (tag, entité, statut, dates, recherche, pagination). |
| GET | `/api/admin/leads/:id` | Détail d'un lead avec historique. |
| POST | `/api/admin/leads` | Créer un lead manuellement. |
| PATCH | `/api/admin/leads/:id` | Modifier (statut, notes, tags). |
| POST | `/api/admin/leads/:id/archive` | Archiver. |
| DELETE | `/api/admin/leads/:id` | Suppression définitive (Loi 25, journalisée). |
| GET | `/api/admin/leads/export` | Export CSV paramétré (profil, filtres). |
| GET POST PATCH DELETE | `/api/admin/tags` | CRUD étiquettes. |
| GET POST PATCH DELETE | `/api/admin/guides` | CRUD guides plus téléversement de fichier. |
| GET | `/api/admin/newsletter/subscribers` | Lister les abonnés. |
| GET POST | `/api/admin/newsletter/campaigns` | Lister et créer des campagnes. |
| POST | `/api/admin/newsletter/campaigns/:id/send` | Envoyer une campagne. |
| GET POST PATCH DELETE | `/api/admin/municipalities` | CRUD municipalités et taux. |
| GET POST PATCH DELETE | `/api/admin/export-profiles` | CRUD profils d'export. |
| GET PATCH | `/api/admin/data-requests` | Traiter les demandes Loi 25. |
| GET | `/api/admin/data-requests/export/:courriel` | Exporter les données d'une personne (droit d'accès). |
| GET POST | `/api/admin/privacy-incidents` | Registre des incidents. |

---

## 13. Structure du projet

Monorepo simple et clair, un seul dépôt.

```
roxan-turcotte/
├── package.json                 # scripts racine (dev, build, start, seed)
├── README.md                    # doc d'installation et d'exploitation (en français)
├── .env.example                 # toutes les variables d'environnement documentées
├── client/                      # site public (SSG) + back-office (SPA)
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── public/
│   │   ├── logo-roxan-lion.svg  # emplacement réservé pour le logo fourni
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── content/                 # CONTENU ÉDITORIAL baked-in (SEO), pas la BD
│   │   ├── pages/               # textes des pages publiques
│   │   ├── services.ts
│   │   ├── guides.json          # métadonnées des guides (régénéré au build depuis la BD)
│   │   └── municipalities.json  # taux des calculateurs (régénéré au build)
│   ├── src/
│   │   ├── main.tsx
│   │   ├── routes.tsx           # config vite-react-ssg + React Router
│   │   ├── styles/              # variables CSS de marque, thème
│   │   ├── components/          # composants partagés (boutons, cartes, formulaires)
│   │   ├── public-site/         # pages publiques pré-rendues
│   │   │   ├── Accueil.tsx
│   │   │   ├── landings/
│   │   │   ├── services/
│   │   │   ├── guides/
│   │   │   ├── calculateurs/
│   │   │   └── legal/
│   │   └── admin/               # back-office SPA (CSR, protégé, noindex)
│   │       ├── AdminApp.tsx
│   │       ├── pages/
│   │       └── lib/api.ts
├── server/                      # API Express + SQLite
│   ├── package.json
│   ├── src/
│   │   ├── index.js             # bootstrap Express
│   │   ├── app.js               # middlewares, routes
│   │   ├── config/              # env, constantes
│   │   ├── db/
│   │   │   ├── connection.js     # better-sqlite3
│   │   │   ├── migrations/       # fichiers SQL versionnés
│   │   │   ├── seed.js           # données initiales (tags, admin, municipalités exemple)
│   │   │   └── repositories/     # une couche par entité
│   │   ├── routes/
│   │   │   ├── public/
│   │   │   └── admin/
│   │   ├── middleware/           # auth, rate-limit, validation, erreurs
│   │   ├── services/
│   │   │   ├── mail/             # couche d'envoi abstraite + transport SMTP
│   │   │   ├── csv-export.js
│   │   │   └── scheduler.js      # exports planifiés
│   │   └── utils/
│   └── data/
│       └── roxan.sqlite          # base SQLite (hors versionnement)
└── docs/
    └── exploitation.md           # comment ajouter un guide, rebuild, déployer
```

Scripts attendus à la racine : `dev` (lance client et serveur en parallèle), `build` (build du client SSG, après régénération des fichiers de contenu depuis la BD), `start` (serveur de production qui sert le client pré-rendu et l'API), `seed` (initialise la BD), `migrate`.

---

## 14. Sécurité et exploitation

* Variables d'environnement pour tous les secrets (`.env`, documenté dans `.env.example`). Jamais de secret en dur.
* `helmet`, en-têtes de sécurité, CORS restreint au domaine.
* **Limitation de débit** sur les routes publiques de soumission (anti-pourriel et anti-abus), par exemple `express-rate-limit`.
* Validation et assainissement de toutes les entrées. Protection contre l'injection (requêtes paramétrées avec `better-sqlite3`, jamais de concaténation SQL).
* Honeypot sur les formulaires publics.
* Mots de passe hachés `bcrypt`. Cookies HTTP-only, `Secure`, `SameSite`.
* Téléversements de fichiers (guides) limités au PDF, taille maximale, noms de fichiers assainis, stockés hors de la racine web publique, servis via lien contrôlé.
* Journalisation des erreurs serveur.
* `README.md` complet en français : installation, configuration des variables d'environnement, lancement en développement, build, déploiement, ajout d'un guide, régénération du contenu, sauvegarde de la base SQLite.

---

## 15. Priorités de construction (ordre imposé)

Construis dans cet ordre, chaque étape doit être fonctionnelle avant la suivante.

1. **Socle et site façade** : structure du projet, système de marque (couleurs, typo, composants), pages publiques pré-rendues (accueil, à propos, contact, landings, services, club privilège, légales), SEO complet, formulaires internes pré-étiquetés branchés sur l'API. Premier rendu visuel sous une semaine, c'est le livrable attendu en premier par le client.
2. **Mini-CRM et génération de leads** : authentification back-office, base SQLite, réception et stockage des leads, gestion par étiquettes, liste et fiche de lead, export CSV paramétré avec profils. Mis en place en parallèle du site.
3. **Guides téléchargeables** : capture de lead, envoi par courriel, gestion des guides dans le back-office.
4. **Calculateurs** : financement, taxe de bienvenue, taxes municipale et scolaire, frais d'acquisition, avec mentions légales et données configurables. À faire après la livraison du site de base.
5. **Automatisations** : envoi automatique des guides et notifications internes, exports CSV planifiés, formulaires de référence vers partenaires (Beneva, courtiers hypothécaires, notaires).
6. **Infolettre** : abonnés, campagnes, désinscription.
7. **Conformité Loi 25** : à intégrer transversalement dès l'étape 1 (consentement, politique), puis compléter le back-office (demandes, registre).

Reporté, ne pas construire au lancement : calculateur d'optimisation d'immeuble (multiplex), section podcast, et toute section non finalisée. Garde des drapeaux de configuration prêts.

---

## 16. Critères d'acceptation

Le projet est accepté si, et seulement si :

* Les pages publiques sont servies en **HTML statique avec le contenu réel dans le HTML initial** (vérifiable en désactivant JavaScript : le contenu éditorial reste visible). Aucun appel API n'est nécessaire pour afficher le contenu des pages.
* Le SEO est complet : titres, méta descriptions, Open Graph, JSON-LD `RealEstateAgent`, `sitemap.xml`, `robots.txt`, URLs propres en français.
* L'identité visuelle or et noir prestige est appliquée de façon cohérente, avec Cinzel et Cormorant pour les titres et Inter pour le corps, et l'emplacement du logo du lion doré est prévu.
* Tous les formulaires sont internes, pré-étiquetés, avec consentement Loi 25, et créent bien des leads dans le CRM. Aucune redirection externe.
* Le back-office permet de lister, filtrer, étiqueter, et **exporter en CSV paramétré** les leads par entité, avec profils d'export réutilisables.
* Les guides se téléchargent en échange des coordonnées et déclenchent un envoi de courriel.
* Les quatre calculateurs fonctionnent côté client avec mentions légales et données configurables.
* La Loi 25 est respectée : consentement, politique de confidentialité, droits d'accès et de suppression, désinscription, registre d'incidents.
* Le code est **complet et copier-collable**, sans extraits partiels. Le projet démarre avec `npm install`, `npm run seed`, `npm run dev`, puis se build et se déploie selon le `README`.
* Aucun tiret cadratin dans le contenu généré. Contenu public en français du Québec.

---

## 17. Éléments à fournir par le client (à intégrer ou laisser en emplacement réservé)

Ces éléments seront fournis. Prévois des emplacements clairs et des données d'exemple provisoires en attendant.

* Le **logo** (emblème du lion doré) et la déclinaison Royal LePage Centre.
* Les **photos haute résolution** et maquettes (via Google Drive).
* La **structure exacte du fichier d'export CSV de Bold Trail** (à valider avant mise en service de l'export).
* Les **fourchettes de coûts** réelles (notaire, inspection, taxes, ajustements) et la liste des municipalités avec leurs taux, à valider avant la mise en service des calculateurs.
* Le **contenu rédactionnel final** des guides (PDF) et des textes de pages, ainsi que les coordonnées exactes, liens des réseaux sociaux, et informations légales de l'entreprise.

Tant que ces éléments ne sont pas fournis, utilise des valeurs et textes d'exemple **clairement marqués comme provisoires** dans le code et l'interface.

---

*Fin de la spécification. Construis maintenant le projet complet en respectant l'ordre des priorités et tous les critères d'acceptation.*