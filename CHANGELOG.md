# Changelog

Tous changement notable dans ce projet sera référencé dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
et le projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Les scripts chargés par le gestionnaire s'exécutent désormais via
  `new Function` et non `eval` : chacun retrouve la portée de fonction non
  stricte que lui donnerait un gestionnaire de userscripts, au lieu d'hériter du
  mode strict du bundle et de voir ses variables internes.

### Added

- API v2 pour les scripts : `DC.registerScript({ id, settings, init })`, stockage
  persistant cloisonné par script, et écran de réglages généré par le
  gestionnaire depuis le schéma déclaré. Le bouton engrenage, jusqu'ici sans
  effet, ouvre cet écran.
- `@dreadcast/registry` : schéma du catalogue vérifié en intégration, et
  génération de la liste de secours embarquée.
- `@dreadcast/game-types` : déclarations TypeScript des globales du jeu, plus un
  inventaire de 47 classes extrait du bundle par `tools/extract-game-api.mjs`.
- Suite de tests Vitest : résolution de la liste dans ses quatre modes,
  synchronisation de la configuration, contrôles de type, mise en forme du chat,
  couche DOM.

### Fixed

- DCSM : fermer la fenêtre sans sauvegarder laisse enfin la configuration
  intacte. La configuration temporaire partageait sa référence avec la
  configuration réelle, si bien que chaque case cochée était déjà appliquée.
- DCSM : le bouton « Topic RP » ouvre le topic RP, et non la documentation.
- DCSM : les boutons RP et Contact avaient le même identifiant HTML.
- DCSM : les filtres n'empilent plus un jeu d'écouteurs sur `document` à chaque
  ouverture de la fenêtre, sur des contenus déjà détruits.
- DCSM : changer un filtre ne révèle plus les scripts expérimentaux quand le
  mode développeur est désactivé.
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

- Readme
- License
- Contributing guide
- Code of conduct
- Changelog
- Helpers functionalities
- Existing scripts
- DreadCast Development Kit
- DreadCast Script Manager
- DCSM : mise en cache de la liste des scripts pendant une heure, et liste de
  secours embarquée dans le userscript. Les scripts continuent de se charger
  quand la source distante est indisponible.
- Un outil `yarn sync:fallback` régénère la liste de secours embarquée depuis
  `data/scripts.json`, avec un contrôle en intégration continue.

### Fixed

- DCSM : la configuration des scripts n'est plus purgée quand la liste distante
  est indisponible. Auparavant, les scripts absents de la liste utilisée voyaient
  leur activation supprimée.
- DCSM : le chargement de la liste des scripts expire au bout de huit secondes.
  Sans délai maximal, une source qui ne répondait plus laissait la requête en
  suspens et aucun script n'était jamais chargé.

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
