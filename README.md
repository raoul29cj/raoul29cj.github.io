# Raoul.CJ — Portfolio, services et ressources numériques

Site vitrine **en français** de Raoul.CJ : développement web, design graphique et (bientôt) ebooks.
React 19 + Vite 7, pré-rendu statique des pages pour le référencement, déployable sur Cloudflare Pages.

## Lancer le projet

Pré-requis : Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev        # http://localhost:5173 (uniquement sur ce PC)
npm run dev:lan    # accessible depuis un téléphone sur le même Wi-Fi
npm run build      # génère dist/ (pages pré-rendues, robots.txt, sitemap)
npm run preview    # teste la version de production
```

## Où modifier quoi

| Fichier | Contenu |
|---|---|
| `src/config.js` | Nom, e-mail, téléphone, formulaire Formspree, domaine, **mentions légales**, services et tarifs, ebooks, parcours |
| `src/projects.js` | Projets du portfolio et contenu des démonstrations |
| `src/main.jsx` | Page d'accueil (sections, menu, pied de page) et routage |
| `src/Pages.jsx` | Pages projet, pages légales, page 404, écran d'erreur |
| `src/Contact.jsx` | Formulaire de contact (Formspree) |
| `src/Effects.jsx` | Animations, visuels des projets, rubans lumineux |
| `src/styles.css` | Design complet, responsive |
| `scripts/seo.mjs` | Pré-rendu HTML, balises SEO, robots.txt, sitemap |
| `public/_headers` | En-têtes de sécurité et de cache (Cloudflare Pages / Netlify) |

## Avant la mise en ligne

1. Renseigner `siteUrl` (domaine HTTPS) et tous les champs `legal` dans `src/config.js`, puis passer `indexable: true`.
   Le build refuse l'indexation tant que ces informations sont incomplètes.
2. Dans le tableau de bord Formspree : limiter le formulaire au domaine du site et garder le filtre anti-spam.
3. Ebooks : renseigner `url` (lien HTTPS Payhip, Gumroad, Lemon Squeezy…) dans `products` ; sans lien, le bouton affiche « Bientôt disponible ».
4. Images : préférer le WebP et des dimensions proches de l'affichage (le portrait s'affiche en 58 px).
   Le CV (`public/cv-raoul.pdf`) doit rester léger (< 1 Mo idéalement).

## Rappels

- Les projets présentés sont des **concepts fictifs**, signalés comme tels sur le site.
- Aucun paiement n'est intégré au site : la vente passera par une plateforme externe.
- Avant de facturer ou vendre, vérifier le statut permettant l'activité indépendante en France
  et les obligations (déclaration, facturation, TVA, mentions légales, droit de rétractation).
