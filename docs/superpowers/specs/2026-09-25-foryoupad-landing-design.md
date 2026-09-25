# ForYouPad — Landing page (design)

Date : 2026-09-25
Statut : en revue

## Contexte

ForYouPad (foryoupad.fun) est un launchpad Solana construit sur pump.fun. La meta actuelle : des launchpads qui
redirigent les creator fees ailleurs (associations, buybacks, holders, trésorerie, créatrices OnlyFans — ex. FansPad,
qui est créateur on-chain via sa trésorerie et garde 20 %). ForYouPad prend le contre-pied au premier degré :
**les creator fees sont pour toi** — ce qui est le comportement par défaut de pump.fun. L'humour vient du décalage
entre ce pitch évident et une DA extrêmement sérieuse (Apple, glassmorphisme).

Positionnement : « The next generation of launchpads. »

Le produit complet (hors de ce document) comprendra : `/launch` (création de token via le SDK officiel
`@pump-fun/pump-sdk`, l'utilisateur signe et est créateur on-chain, mint vanity finissant par `fyp`), `/board`,
`/coin/[mint]`, `/fees` (claim des creator fees). Il nécessitera un backend (Vercel + Supabase + Helius + Pinata)
et fera l'objet d'une spec séparée.

## Périmètre de ce document

Une **landing page statique**, en anglais, hébergée sur **GitHub Pages**, prête à migrer vers foryoupad.fun.

Hors périmètre : wallet, on-chain, backend, board, formulaire de création, stats en direct.

## Décisions

- **Stack** : Next.js (App Router) + TypeScript + Tailwind CSS v4 + Motion (ex-Framer Motion), `output: "export"`.
  Même base de code réutilisée plus tard pour l'app complète sur Vercel.
- **Hébergement** : GitHub Pages via GitHub Actions (build + deploy à chaque push sur `main`). `basePath`
  configurable par variable d'environnement (sous-chemin `/<repo>` sur Pages, vide avec un domaine custom).
- **Pré-lancement** : les CTA « Launch a coin » affichent un état *Coming soon* (pas de lien mort). Aucune
  statistique inventée : la section stats en direct n'existe pas tant que l'app n'est pas lancée.
- **Concurrents** : jamais nommés sur le site (« Other launchpads »), pour rester factuel et éviter tout litige.
- **Langue** : tout le contenu du site en anglais.

## Direction artistique

- Fond sombre profond (quasi noir, légère teinte), mode sombre uniquement pour cette première version.
- Surfaces en verre dépoli : `backdrop-filter: blur()` + saturation, bordure fine semi-transparente, reflet
  lumineux discret en haut des cartes. Dégradés d'ambiance flous en arrière-plan (lueurs lentes).
- Une seule couleur d'accent, utilisée avec parcimonie (CTA, éléments actifs).
- Typographie : Geist (auto-hébergée via `next/font`), titres très grands avec tracking serré, corps sobre.
  Chiffres/adresses en Geist Mono.
- Mouvements : apparitions au scroll, ressorts doux, rien de gratuit. `prefers-reduced-motion` respecté
  (animations remplacées par de simples fondus ou supprimées).
- Responsive : mobile d'abord ; toutes les sections lisibles à 375 px.

## Structure de la page et contenu (copy EN)

1. **Nav** (verre, collante) : logo `ForYouPad`, liens `How it works`, `Compare`, `$FYP`, `FAQ`, bouton
   `Launch a coin` (*Coming soon*).

2. **Hero**
   - Eyebrow : `The next generation of launchpads.`
   - Titre : `Creator fees.` / `For you.`
   - Sous-titre : `Launch on pump.fun and keep 100% of your creator fees. No treasury. No middleman. No cut.`
   - CTA : `Launch a coin` (*Coming soon*), `See how it works` (ancre).
   - Visuel : une carte de coin en verre flottante (nom, ticker, adresse `…fyp`, ligne `Creator fees → You`).

3. **The problem**
   - Titre : `Everyone found somewhere to send your fees.`
   - Liste animée, chaque ligne barrée à son tour : `To charity.` `To buybacks.` `To holders.`
     `To a treasury.` `To someone's OnlyFans.`
   - Chute : `We found a better place.` → grand `You.`

4. **Compare** — tableau `Other launchpads` vs `ForYouPad` :
   | | Other launchpads | ForYouPad |
   |---|---|---|
   | On-chain creator | Their treasury | You |
   | Platform cut | Up to 20% | 0% |
   | Who holds your fees | They do, until payout | Nobody. They're yours. |
   | How you get paid | Thresholds, verification | One signature |
   | Trust required | A lot | None |

5. **How it works** — 3 cartes :
   - `01 Connect.` `Any Solana wallet. We never see your keys.`
   - `02 Launch.` `Name, ticker, image. Your coin goes live on pump.fun, with you as its creator.`
   - `03 Earn.` `Every trade pays you. Claim whenever you want.`

6. **Details** — grille « bento » :
   - `Ends in fyp.` Chaque coin a une adresse qui se termine par `fyp`.
   - `Non-custodial.` You sign every transaction. We never hold funds.
   - `Zero platform fee.` Only pump.fun's standard costs.
   - `Built on pump.fun.` Same curve, same liquidity, same terminals.

7. **$FYP**
   - Titre : `$FYP.`
   - Texte : `Our own token, launched on ForYouPad. Its creator fees go to its creators. Like every coin here.`
   - Badge *Coming soon*.

8. **FAQ** (accordéon) :
   - `Isn't this just how pump.fun already works?` → `Yes. That's the point. Every other launchpad added a detour. We removed it.`
   - `What's the catch?` → `There isn't one. We earn the same way you do: from the creator fees of our own coin, $FYP.`
   - `Do you ever hold my funds?` → `Never. You sign every transaction from your own wallet. Your coin's creator is your address, not ours.`
   - `How much does it cost?` → `Pump.fun's standard creation cost and network rent (around 0.02–0.04 SOL). ForYouPad adds nothing.`
   - `Why do addresses end in fyp?` → `So everyone knows where the coin came from. And where its fees go.`
   - `Is this financial advice?` → `No. Memecoins are extremely volatile and most go to zero. Only use money you can afford to lose.`

9. **Footer** : `Designed for you. Fees included.` + mention de risque courte, liens X / Telegram
   (placeholders désactivés tant que les comptes n'existent pas), © 2026 ForYouPad.

## Organisation du code

- `src/app/` : `layout.tsx` (polices, métadonnées, fond d'ambiance), `page.tsx` (assemblage des sections).
- `src/components/sections/` : un fichier par section (`Hero`, `Problem`, `Compare`, `HowItWorks`, `Details`,
  `Token`, `Faq`, `Footer`, `Nav`).
- `src/components/ui/` : primitives réutilisables (`GlassCard`, `Button`, `Badge`, `Reveal` pour l'apparition
  au scroll).
- `src/content/site.ts` : toute la copy et les constantes (nom, suffixe `fyp`, liens) en un seul endroit.
- `.github/workflows/deploy.yml` : build + déploiement Pages.

## Vérification

- `lint`, `typecheck` et `next build` (export statique) passent sans erreur.
- Contrôle visuel via captures (Playwright) à 375 px et 1440 px, avec et sans `prefers-reduced-motion`.
- Liens d'ancre fonctionnels, aucun lien mort, métadonnées Open Graph présentes.
- Déploiement Pages réussi et page accessible à l'URL publique.
