# Rapport de nuit — ForYouPad (landing page)

_25 septembre 2026_

## En bref

- **Le site est en ligne : https://letaih.github.io/newpad/**
- Il y a 9 sections, en anglais, et la page s'affiche proprement du petit téléphone (320 px) au grand écran.
- **Lighthouse** (l'outil de Google qui note la vitesse, l'accessibilité, les bonnes pratiques et le référencement) :
  - mobile : **97 / 100 / 100 / 100** ;
  - ordinateur : **100 / 100 / 100 / 100**.
- **Sécurité** : aucune faille connue dans les dépendances, aucun secret dans le code. Le site ne contacte aucun service extérieur, et une politique de sécurité du contenu (CSP) est en place.
- **Tests** : 64 tests automatiques passent, et ils tournent aussi sur les serveurs de GitHub avant chaque mise en ligne.

## ⚠️ À faire au réveil (2 minutes)

Le site est en ligne grâce à un hasard de configuration. Mon premier envoi sur GitHub a été la branche `feat/landing`, donc GitHub en a fait la **branche par défaut** et l'a autorisée à publier. `main` n'est pas autorisée, et la publication automatique ne se déclenche que sur `main`. Pour remettre les choses dans l'ordre :

1. Sur GitHub, dans le repo **newpad**, ouvre **Settings → Environments → github-pages**. Sous **Deployment branches and tags**, clique **Add deployment branch or tag rule** et tape `main`.
   _(J'ai essayé de le faire cette nuit, mais le système d'autorisations de Claude Code l'a bloqué, et je n'ai pas cherché à le contourner.)_
2. Dans **Settings → General → Default branch**, choisis `main`.
3. Dis-moi « merge sur main » et je fais le reste : je mets `main` à jour et la publication se relance toute seule.

Tant que ce n'est pas fait, le site reste en ligne tel quel. Seules les futures mises à jour ne partiront pas automatiquement.

## Ce qui a été construit

Tous les textes sont dans un seul fichier (`src/content/site.ts`), donc tu peux corriger une phrase sans toucher au reste. Les captures d'écran sont dans `docs/rapport/screens/`, avec pour chaque section une version à 320, 375, 768, 1024 et 1440 px et une en paysage (812×375).

| Section | Contenu | Captures |
|---|---|---|
| Barre du haut | Logo + liens + bouton « Launch a coin · Soon » | [ordi](rapport/screens/nav-1440.png) · [mobile](rapport/screens/nav-375.png) |
| Hero | « Creator fees. For you. » + carte de coin exemple (adresse finissant par `fyp`) | [ordi](rapport/screens/hero-1440.png) · [mobile](rapport/screens/hero-375.png) |
| Le problème | « To charity. To buybacks. … To someone's OnlyFans. » barrés un par un, puis « You. » | [ordi](rapport/screens/problem-1440.png) · [mobile](rapport/screens/problem-375.png) |
| Comparatif | Tableau « Other launchpads » vs « ForYouPad » (aucun concurrent n'est cité) | [ordi](rapport/screens/compare-1440.png) · [mobile](rapport/screens/compare-375.png) |
| How it works | Connect. Launch. Earn. | [ordi](rapport/screens/how-it-works-1440.png) · [mobile](rapport/screens/how-it-works-375.png) |
| Details | Grille de 4 cartes (fyp, non-custodial, 0 %, pump.fun) | [ordi](rapport/screens/details-1440.png) · [mobile](rapport/screens/details-375.png) |
| $FYP | Le token de la plateforme, avec un badge « Coming soon » | [ordi](rapport/screens/token-1440.png) · [mobile](rapport/screens/token-375.png) |
| FAQ | 6 questions en accordéon, qui s'ouvrent aussi au clavier | [ordi](rapport/screens/faq-1440.png) · [mobile](rapport/screens/faq-375.png) |
| Footer | « Designed for you. Fees included. » + mention des risques | [ordi](rapport/screens/footer-1440.png) · [mobile](rapport/screens/footer-375.png) |

**En plus :**
- **Page 404 sombre** : « Nothing here. Your fees are still yours. This page just isn't one of ours. », avec un bouton de retour.
- **Image d'aperçu** pour X et Telegram (`public/og.png`).
- **Favicon « fyp »** (la petite icône de l'onglet).

## Ce que la relecture critique a corrigé

- **Les halos lumineux du fond ne s'affichaient pas du tout.** Le verre dépoli n'avait donc rien à flouter et paraissait gris et plat. C'est corrigé, et c'est ce qui change le plus le rendu.
- **Sur petit téléphone**, le bouton du haut touchait le logo. Il a maintenant sa propre taille.
- **Sur tablette**, la carte du hero sortait de l'écran. Le hero s'empile désormais en dessous de 1024 px.
- **En paysage sur téléphone**, les boutons du hero étaient sous la ligne de flottaison. Ils sont maintenant visibles sans défiler.
- **Section « problème »** : quand une ligne passait sur deux lignes, la seconde n'était pas barrée. C'est corrigé.
- **Comparatif sur mobile** : les mots se coupaient (« ForYouPa-d »). Chaque ligne s'empile maintenant proprement.
- **Details** : trois cartes étaient vides. Chacune a reçu un petit visuel : cadenas, « 0% », courbe.
- **FAQ, footer et titres** : lignes mieux équilibrées.

## Accessibilité

- **Audit automatique (axe)** : 0 violation. Quelques fonds en dégradé que l'outil ne sait pas mesurer ont été vérifiés à la main.
- **Contrastes relevés** : sur les liens du menu, sur la carte du hero, sur les badges « Soon » du footer et sur le texte barré (qui reste volontairement atténué).
- **Clavier** : tout le site se navigue au clavier, et le focus est toujours visible.
- **Animations réduites** : si l'appareil demande moins d'animations, tout apparaît directement, sans balayage.
- **Sans JavaScript** : le contenu reste visible.

## Performance (Lighthouse)

| | Mobile avant → après | Ordi avant → après |
|---|---|---|
| Performance | 96 → **97** | 100 → **100** |
| Accessibilité | 100 → **100** | 96 → **100** |
| Bonnes pratiques | 100 → **100** | 100 → **100** |
| Référencement | 100 → **100** | 100 → **100** |

Le titre du hero s'affiche maintenant immédiatement au lieu d'apparaître en fondu. Le délai d'affichage principal est passé de 2,3 s à 0,1 s.

Le 97 sur mobile vient du poids de la librairie d'animation. On pourrait gagner les 3 derniers points en la chargeant autrement, mais je ne l'ai pas fait : le gain est minime.

## Sécurité

- **Dépendances** : `npm audit` ne signale aucune vulnérabilité.
- **Secrets** : aucun, ni dans le code ni dans l'historique Git. Le repo peut rester public sans risque, et ton email de commit est l'adresse anonyme de GitHub.
- **Publication automatique** : chaque mise en ligne passe d'abord par la vérification du code et les 64 tests. Les droits de publication ne sont donnés qu'à l'étape qui publie.
- **Services extérieurs** : aucun. Les polices sont hébergées sur le site lui-même, et un test le vérifie.
- **CSP** : seuls les scripts du site peuvent s'exécuter. Chaque script est identifié par son empreinte, et la compilation s'arrête si quelque chose ne colle pas.
- **Limite connue** : GitHub Pages ne permet pas certains réglages de sécurité avancés, comme l'anti-iframe. On pourra les ajouter quand le site passera sur Railway.

## Décisions que j'ai prises seul (à valider)

1. **Titres de sections ajoutés** : « The difference is you. », « Three steps. All yours. », « Everything else. Obviously. », « Questions. Answered. ».
2. **Menu** : l'ordre suit maintenant celui de la page (Compare avant How it works). Sur mobile, il n'y a que le logo et le bouton, sans menu déroulant.
3. **Details** : j'ai ajouté des visuels (cadenas, « 0% », courbe de bonding).
4. **Comparatif sur mobile** : la colonne ForYouPad n'est plus teintée. Elle reste repérable par sa couleur de texte.
5. **Texte de la page 404** : voir plus haut.
6. **Le titre du hero n'est plus animé**, pour la vitesse d'affichage. Le reste de la page garde ses apparitions au défilement.
7. **Fichiers `AGENTS.md` et `CLAUDE.md`** : Next.js les génère tout seul, et je les ai exclus de Git.
8. **Tests** : j'ai corrigé deux tests du plan qui ne pouvaient pas marcher tels quels, et j'en ai durci deux autres.

## Questions ouvertes

- **Les chiffres de la FAQ** (« around 0.02–0.04 SOL », « Up to 20% ») viennent de nos recherches. Fais-les vérifier par ton ami avant le lancement.
- **Comptes X et Telegram** : les liens du footer affichent « Soon » en attendant.
- **Favicon pour iPhone** : une version PNG pour l'écran d'accueil serait un plus. C'est rapide à ajouter.

## Prochaines étapes

1. Faire les 2 réglages GitHub ci-dessus, puis je fusionne sur `main`.
2. Acheter **foryoupad.fun** (~2,57 $ la 1re année, puis ~31 $/an), puis le brancher sur GitHub Pages ou Railway. Il n'y aura rien à changer dans le code.
3. **L'app complète** sur Railway + Postgres :
   - `/launch` : création du coin avec le SDK officiel de pump.fun. C'est toi qui signes, et tu es le créateur on-chain.
   - `/board` : la liste des coins lancés via le site.
   - `/coin/[adresse]` : la page de chaque coin.
   - `/fees` : réclamer ses creator fees.
   - Le token **$FYP**.

   Ça fera l'objet d'une spec séparée, comme pour la landing.
