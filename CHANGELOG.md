# Changelog

Tous changement notable dans ce projet sera référencé dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
et le projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Ce fichier retrace la migration vers la stack Vite+, et s'arrête là.**
> Chaque userscript suit désormais sa propre numérotation, et son changelog est
> produit par release-please à partir des commits :
> [Development Kit](packages/ddk/CHANGELOG.md) et
> [Script Manager](packages/dcsm/CHANGELOG.md).

## [Unreleased]

### Changed

- Le dépôt passe sur une stack Vite+ : monorepo pnpm, Vite 8 + Rolldown,
  vite-plugin-monkey, TypeScript 7, Oxlint/Oxfmt, Vitest, Node 24. L'ancienne
  configuration yarn + webpack déclarait des workspaces qui n'existaient pas et
  ne construisait rien.
- DDK 1.2.0 : réécriture en TypeScript, en DOM natif. L'API historique (`DC.UI`,
  `DC.LocalMemory`, `DC.Network`, `DC.Chat`, `DC.Deck`, `DC.TopMenu`, `Util`)
  est conservée à l'identique et continue de renvoyer des objets jQuery.
- DCSM 1.5.0 : réécriture en TypeScript. Le comportement visible ne change pas,
  hors correctifs ci-dessous.
- Les scripts chargés par le gestionnaire s'exécutent via `new Function` et non
  `eval` : chacun retrouve la portée de fonction non stricte que lui donnerait
  un gestionnaire de userscripts, au lieu d'hériter du mode strict du bundle et
  de voir ses variables internes.

### Added

- Readme, licence, guide de contribution, code de conduite, changelog.
- Les fonctionnalités de la bibliothèque, et les scripts existants.
- DreadCast Development Kit et DreadCast Script Manager.
- DCSM : mise en cache de la liste des scripts pendant une heure, et liste de
  secours embarquée dans le userscript. Les scripts continuent de se charger
  quand la source distante est indisponible.
- API v2 pour les scripts : `DC.registerScript({ id, settings, init })`, stockage
  persistant cloisonné par script, et écran de réglages généré par le
  gestionnaire depuis le schéma déclaré. Le bouton engrenage, jusqu'ici sans
  effet, ouvre cet écran.
- `@dreadcast/registry` : schéma du catalogue vérifié en intégration, et
  génération de la liste de secours embarquée par `vp run registry:sync`.
- `@dreadcast/game-types` : déclarations TypeScript des globales du jeu, plus un
  inventaire de 47 classes extrait du bundle par `tools/extract-game-api.mjs`.
- Suite de tests Vitest, jusqu'aux userscripts construits : résolution de la
  liste dans ses quatre modes, synchronisation de la configuration, couche de
  compatibilité vérifiée contre le vrai jQuery 1.8.2, et démarrage complet du
  gestionnaire dans les deux façons dont un gestionnaire assemble un `@require`.
- Une [recette de vérification en jeu](docs/recette-dcsm.md), et l'outillage qui
  va avec : `tools/serve-dist.mjs` et le build local `DCSM_LOCAL_DDK`.

### Fixed

- Catalogue : `Details!` (1.5.5 → 1.9.3, quinze révisions de retard), `ChatBulle`
  (1.3.4 → 1.4.0) et `Copy Paste all` (1.5 → 1.5.1) sont repincés sur la version
  publiée aujourd'hui par leurs auteurs. Les correctifs parus depuis
  n'atteignaient personne.
- Catalogue : `kobsteak` était épinglé sur une révision que son auteur a
  supprimée, et répondait 410. Repincé sur la 3.1, la version publiée
  aujourd'hui.
- Catalogue : `deckExportData` et `fixUsine` portaient une URL de la forme
  `/scripts/<id>-<slug>.user.js`, celle du site et non celle des mises à jour.
  Les deux répondaient 404 : ces scripts n'ont jamais pu se charger. La révision
  épinglée est inchangée, seule la forme de l'URL est corrigée.
- DCSM 1.5.1 : le `@require` publié épinglait l'identifiant du DDK 1.1.8. Le
  gestionnaire chargeait donc une bibliothèque dépourvue des modules attendus et
  échouait au démarrage sur `DC.dom is undefined`. L'épingle suit désormais la
  version réellement publiée.
- DCSM : les scripts chargés ne voyaient ni `DC`, ni `Util`, ni les fonctions
  `GM_*`. Une fonction construite par `new Function` a pour portée globale celle
  de la page, et non celle du bac à sable du gestionnaire de userscripts, où
  vivent ces valeurs. Elles lui sont désormais passées explicitement, dans la
  limite exacte des `@grant` du gestionnaire.
- DCSM : `GM_setClipboard` n'a jamais figuré dans les `@grant`, alors que le
  script `copyterminal` du catalogue en dépend. Il ne fonctionnait donc pas à
  travers le gestionnaire, seulement installé seul.
- DCSM : fermer la fenêtre sans sauvegarder laisse enfin la configuration
  intacte. La configuration temporaire partageait sa référence avec la
  configuration réelle, si bien que chaque case cochée était déjà appliquée.
- DCSM : le bouton « Topic RP » ouvre le topic RP, et non la documentation.
- DCSM : les boutons RP et Contact avaient le même identifiant HTML.
- DCSM : les filtres n'empilent plus un jeu d'écouteurs sur `document` à chaque
  ouverture de la fenêtre, sur des contenus déjà détruits.
- DCSM : changer un filtre ne révèle plus les scripts expérimentaux quand le
  mode développeur est désactivé.
- DCSM : la configuration des scripts n'est plus purgée quand la liste distante
  est indisponible. Auparavant, les scripts absents de la liste utilisée voyaient
  leur activation supprimée.
- DCSM : le chargement de la liste des scripts expire au bout de huit secondes.
  Sans délai maximal, une source qui ne répondait plus laissait la requête en
  suspens et aucun script n'était jamais chargé.
- DDK : `DC.Chat.t` fermait le gras avec `[b]` au lieu de `[/b]`, laissant la
  balise ouverte. La chaîne vide est désormais acceptée comme « pas de couleur ».
- DDK : une commande de chat personnalisée laissait systématiquement une
  exception non rattrapée dans la console — l'interruption de l'envoi était
  implémentée en levant une erreur.
- DDK : `DC.UI.Tooltip` et `DC.UI.Checkbox` réinjectaient leur feuille de style
  à chaque appel, laissant des centaines de balises `<style>` identiques dans la
  page du gestionnaire.
- DDK : `DC.UI.ColorPicker` produisait une balise `<input>` non fermée.
- DDK : les messages d'erreur des contrôles de paramètres citaient tous
  `MenuChat.prototype.onSend`, quelle que soit la fonction appelée.

---

## 🔖 Format utilisé

| Tag          | Description                                               |
| ------------ | --------------------------------------------------------- |
| `Added`      | Pour les nouvelles fonctionnalités.                       |
| `Changed`    | Pour les changements dans des fonctionnalités existantes. |
| `Deprecated` | Pour les fonctionnalités bientôt obsolètes.               |
| `Removed`    | Pour les fonctionnalités supprimées.                      |
| `Fixed`      | Pour les bugs corrigés.                                   |
| `Security`   | Pour les corrections de failles de sécurité.              |

---
