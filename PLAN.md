# Plan — Site de calculateurs pour l'aquariophilie (FR)

## Contexte
Objectif : générer ~20 €/mois (rembourser Claude Pro) de façon quasi passive (< 1 h/trimestre après lancement).
Choix retenu : **site statique de calculateurs basés sur des formules stables** (volumes, physique, chimie de l'eau) pour l'aquariophilie, en français,
monétisé par **affiliation** + **petit produit numérique** (PDF/tableur 3–5 €) via un vendeur officiel qui gère la TVA (Lemon Squeezy).
Contraintes : 0 serveur, 0 compte utilisateur, ~0 coût fixe (domaine ~10 €/an), aucune dépendance à des barèmes/sites tiers qui changent.
Risque assumé : SEO lent (6–12 mois avant revenus significatifs) ; niche passionnée mais volume de recherche inconnu.

### Historique de la décision
- Niche initiale « savonnerie & cosmétique maison » abandonnée en phase 0 : calculateurs de saponification FR saturés par des outils récents
  (détails : [docs/phase0-validation.md](docs/phase0-validation.md)).
- Niches comparées : aquariophilie ★★★, brassage ★★, pain/levain ★★, piscine ★, bricolage ★ → **aquariophilie** validée le 21/10/2026.
- Repli possible : brassage amateur ou pain au levain (même architecture).

### Pistes écartées (et pourquoi)
- Micro-SaaS / API (RapidAPI) : serveur, support, churn → pas passif.
- Bot de trading / crypto : surveillance constante, risque de perte en capital.
- Contenu IA généré en masse : pénalisé par Google (« scaled content abuse »).
- Extension Chrome payante (B1) : plan B si on veut des revenus plus rapides, mais concurrence plus forte.

## Phase 0 — Validation de la demande
Faite (voir Avancement). Concurrence FR = uniquement des calculateurs génériques (Omni, miniwebtool, calculover, macalculatriceenligne) ;
outils spécialisés (CO2 KH/pH, éclairage lm/L) uniquement en anglais.
- Contrôle manuel google.fr fait : 4 requêtes sur 6 bonnes, 1 correcte (CO2), 1 mauvaise (engrais : résumé IA + calculateurs de marques).

## Phase 1 — Développement (1–2 semaines)
Stack : **Astro + TypeScript** (HTML statique, JS uniquement sur les îlots calculateurs), **Vitest**, déployé sur **Cloudflare Pages** (gratuit, déploiement auto depuis GitHub).

Structure prévue :
- `src/data/` — constantes et tables de référence (densités, conversions de dureté, repères lm/L, W/L, composition des sels d'engrais), **avec source citée** pour chaque valeur.
- `src/lib/volume.ts`, `chauffage.ts`, `eclairage.ts`, `co2.ts`, `durete.ts` — fonctions de calcul pures, testées.
- `src/components/*Calculateur.tsx|astro` — interfaces des calculateurs.
- `src/pages/` — une page par calculateur + un vrai guide rédigé autour (indispensable pour le SEO), mentions légales, divulgation d'affiliation.

Calculateurs v1 (par ordre de priorité, d'après le contrôle google.fr) :
1. **Volume réel du bac** : dimensions intérieures, hauteur d'eau, épaisseur du verre, déduction sol/décor ; formes rectangulaire, cylindrique, panoramique ; poids total (eau + verre + sol) pour le meuble. Section « tailles courantes » (60×30×30, 100 L…).
2. **Chauffage** : puissance (W) selon le volume, l'écart entre la température de la pièce et la cible, bac couvert ou ouvert ; arrondi à la puissance commerciale.
3. **Dureté et mélange d'eau** : conversions °dGH / °dKH / °f / ppm ; mélange eau osmosée + eau du robinet pour atteindre une dureté cible.
4. **Éclairage** : lumens nécessaires selon le niveau de plantation (repères ~15 / 30 / 60 lm/L).
5. **CO2 à partir du KH et du pH** (+ avertissement sur les limites du tableau : acides humiques, sols actifs). Le résumé IA donne déjà la formule : se différencier par le résultat immédiat, le code couleur et le tableau.

Reportés en v2 : engrais (résumé IA + calculateurs de marques JBL/Easy Life en top 5), population de poissons (nécessite des données par espèce).

Exigences :
- **Exactitude** : chaque calcul couvert par des tests contre des valeurs de référence (sources publiées, calculateurs reconnus), écart < 1 %.
- Avertissements visibles quand c'est pertinent (CO2 : risque pour les poissons ; dosage : vérifier avec un test ; poids : capacité du meuble/plancher).
- Analytics sans cookies (Cloudflare Web Analytics) → pas de bannière de consentement. **Pas d'AdSense en v1** (il faudrait une CMP et du trafic).
- Données structurées (schema.org), sitemap, Lighthouse ≥ 95.

## Phase 2 — Monétisation
- Liens d'affiliation contextuels dans les guides (chauffages, rampes LED, kits CO2, tests de paramètres, osmoseurs, engrais).
- Programmes : Amazon Partenaires FR ; Zoomalia (via Affilae, à confirmer) ; chercher d'autres animaleries/aquascaping FR.
- Produit Lemon Squeezy : « carnet de maintenance + tableur de suivi des paramètres » (PDF + .xlsx/Google Sheet), 3–5 €. Généré une fois, aucun stock.
- Administratif : statut micro-entrepreneur à prévoir avant les premiers revenus, déclaration des revenus d'affiliation.

## Phase 3 — Lancement (2–4 semaines d'effort, puis arrêt)
- Google Search Console + Bing Webmaster, sitemap soumis.
- **Pinterest** (trafic long terme, aquascaping très visuel) : 10–20 épingles par calculateur ou guide.
- Partages honnêtes sur les forums FR d'aquariophilie et groupes Facebook, réponses utiles avec lien.
- Objectif : 5–10 backlinks naturels (blogs, forums, annuaires).

## Mode passif (après lancement)
Checklist trimestrielle (< 1 h) : liens d'affiliation morts, alertes Search Console, mise à jour des dépendances via Dependabot (fusion automatique des correctifs).

## Vérification
- `npm run test` : les calculs correspondent aux valeurs de référence (écart < 1 %).
- `npm run build` puis `npm run preview` : test manuel de chaque calculateur dans le navigateur.
- Lighthouse (performance, SEO, accessibilité) sur chaque page.
- Après déploiement : pages indexées dans Search Console sous 2 à 4 semaines.

## Avancement
- [x] Phase 0 — Validation de la demande — 21/10/2026 ([résultats](docs/phase0-validation.md)) : savonnerie abandonnée (saturée),
  **aquariophilie validée**, confirmée par le contrôle manuel google.fr (4 bonnes requêtes sur 6, 1 correcte).
- [ ] Phase 1 — Développement
  - [x] Socle : Astro 7 + TypeScript 6 (astro check ne supporte pas TS 7) + Vitest 5 + sitemap ; gabarit, accueil, mentions légales (éditeur à compléter)
  - [x] Calculateur 1 — Volume et poids (`src/lib/volume.ts`, 14 tests, page guide + tableau des tailles courantes)
  - [ ] Calculateur 2 — Chauffage
  - [ ] Calculateur 3 — Dureté et mélange d'eau
  - [ ] Calculateur 4 — Éclairage
  - [ ] Calculateur 5 — CO2
  - [ ] Choisir et acheter le domaine (remplacer `SITE` dans `astro.config.mjs`), dépôt GitHub, Cloudflare Pages + Web Analytics
  - [ ] Lighthouse ≥ 95 sur chaque page
- [ ] Phase 2 — Monétisation
- [ ] Phase 3 — Lancement
