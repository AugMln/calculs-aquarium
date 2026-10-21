# rembourse-claude

Projet de revenu quasi passif (~20 €/mois, pour rembourser l'abonnement Claude Pro) : un site statique de calculateurs
pour l'aquariophilie (volume, chauffage, éclairage, CO2, dureté, engrais), en français, monétisé par affiliation + un petit produit numérique.

**Le plan complet et l'avancement sont dans [PLAN.md](PLAN.md). Le lire avant toute action et cocher les étapes terminées.**

## Principes non négociables (passivité)
- Zéro serveur, zéro base de données, zéro compte utilisateur : site 100 % statique.
- Coût fixe ~0 € (Cloudflare Pages gratuit + domaine).
- Aucune dépendance à des données qui changent (barèmes fiscaux, sites tiers à scraper).
- Pas de cookies ni de bannière de consentement en v1 (analytics Cloudflare sans cookies, pas d'AdSense).
- Paiements uniquement via un vendeur officiel qui gère la TVA (Lemon Squeezy).

## Stack
- Astro + TypeScript, Vitest, déploiement Cloudflare Pages.
- Calculs dans `src/lib/` (fonctions pures), données dans `src/data/`, pages dans `src/pages/`.

## Règles de code
- **Exactitude critique** : chaque calcul doit être couvert par des tests contre des valeurs de référence (sources publiées, calculateurs reconnus), écart < 1 %.
- Chaque constante ou table de référence (`src/data/`) doit citer sa source.
- Avertissements visibles sur les pages concernées (surdosage de CO2 dangereux pour les poissons, vérifier les dosages avec un test, poids du bac).
- Contenu et interface en français.

## Commandes (PowerShell)
- `npm run dev` — serveur de développement
- `npm run test` — tests Vitest
- `npm run build` ; `npm run preview` — build et prévisualisation
