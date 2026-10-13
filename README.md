# Atelier Digital — Portfolio React prêt à personnaliser

Une vitrine professionnelle **en français** pour lancer une activité de freelance (sites web, débogage, design) et présenter de futurs produits numériques.

## Lancer le projet

Pré-requis : Node.js récent (version 20.19+ ou 22.12+ pour Vite 7), npm.

```bash
npm install
npm run dev
```

Ouvre l'URL locale affichée dans le terminal, généralement `http://localhost:5173`.

Créer une version de production :

```bash
npm run build
```

Le dossier `dist/` pourra être publié sur Cloudflare Pages, Netlify, Vercel, etc.

## À changer AVANT publication

Dans `src/site.js` :

1. `name` et `initials` : remplace « Atelier Digital » par **ta marque**.
2. `email` : renseigne **ton adresse professionnelle réelle**. Le formulaire utilise `mailto:` : il ouvre le client e-mail du visiteur (il n'envoie pas directement via serveur). Tant que le champ est vide, le formulaire fonctionne en **mode démo** et permet de copier le message, sans transmission.
3. `services` : adapte les prestations, le périmètre, les prix et les promesses commerciales.
4. `projects` : deux **projets fictifs** sont présentés comme démonstrations. Remplace-les par tes projets réels quand tu en auras, avec autorisation du client si nécessaire.
5. `products` : les trois produits numériques sont **en préparation**. Aucun achat ni moyen de paiement n'est activé. Mets-les à jour uniquement après création et vérification des ressources.
6. `index.html` : personnalise le titre et la meta-description.
7. `public/favicon.svg` : personnalise le logo si tu changes de marque.

## Important : contact, paiements et obligations

- **Ce n'est pas une boutique en ligne** : aucun paiement n'est intégré. Pour vendre des ressources numériques, crée une boutique Payhip/Gumroad ou intègre un prestataire adapté **après** avoir vérifié ton cadre légal.
- **Ce n'est pas un formulaire serveur** : `mailto:` dépend d'une application e-mail configurée chez le visiteur. Pour un usage professionnel fiable, installe ensuite un service de formulaires ou une fonction backend avec protection contre le spam, confidentialité et information RGPD.
- **Ne présente pas les démos fictives comme des missions client réalisées.** Le site les signale explicitement.
- Avant de facturer ou vendre, vérifie que ton titre de séjour ou statut te permet **l'activité indépendante en France**, puis les obligations de déclaration, facturation, information précontractuelle, mentions légales, politique de confidentialité, cookies éventuels, droit de rétractation, TVA et droits sur les éléments vendus. Ce kit est une base technique, pas un conseil juridique.
- Les prix sont seulement des **hypothèses de lancement** à ajuster selon tes devis, coûts et prestations.

## Structure

- `src/main.jsx` : composants React et démos interactives.
- `src/styles.css` : design responsive.
- `src/site.js` : texte, tarifs, projets et configuration métier.
- `public/favicon.svg` : pictogramme.

## Prochaines étapes conseillées

1. Définis ta marque, ton adresse et tes coordonnées de contact.
2. Ajoute **deux projets personnels réellement développés**, présentés comme projets personnels.
3. Mets en ligne le portfolio.
4. Crée deux offres freelance détaillées avec devis et conditions.
5. Interroge 10 acheteurs potentiels sur ton premier ebook ou template avant de le produire intégralement.

## Aperçu immédiat hors ligne

Double-clique sur `apercu-statique.html` pour voir une **maquette visuelle autonome** sans installer Node.js. Cette version n'est pas l'application React et ne gère pas l'envoi de messages. Pour la version interactive, utilise `npm install` puis `npm run dev`.
