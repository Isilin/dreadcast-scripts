# Dreadcast Scripts

Il s'agit d'un projet de joueurs autour du jeu [Dreadcast](https://www.dreadcast.net), sans aucune intention commerciale, dans l'objectif d'offrir une meilleure qualité de jeu.

## Introduction

Ce dépôt a été créé pour répertorier les scripts, bibliothèques, skins, et autres qui peuvent être utilisé en jeu.
Quelques outils, tel le gestionnaire de script sont également proposés aux utilisateurs.

![Scripts Manager](https://i.imgur.com/ZmJfpau.png)

## Démarrage

Dans un premier temps, il est nécessaire d'installer un gestionnaire de scripts pour votre navigateur : [Tampermonkey](https://www.tampermonkey.net/) ou [Violentmonkey](https://violentmonkey.github.io/).

> **Greasemonkey 4 et FireMonkey ne fonctionnent pas.** Ils ont abandonné les fonctions `GM_*` synchrones au profit de leurs équivalents asynchrones `GM.*`, dont les scripts Dreadcast dépendent depuis toujours pour lire et écrire leur configuration. Greasemonkey 3 fonctionne, mais n'est plus distribué.

Un guide complet sur les gestionnaires de scripts est également disponible [ICI](https://github.com/Isilin/dreadcast-scripts/wiki/Gestionnaires-de-scripts).

Dans un second temps, il vous faudra installer les scripts que vous souhaitez. Deux approches sont proposées dans ce wiki, et qui vous sont détaillées ici : [Installation de scripts](https://github.com/Isilin/dreadcast-scripts/wiki/Installation).

## Développement

Le dépôt est un monorepo piloté par [Vite+](https://viteplus.dev) : une seule
CLI (`vp`) pour le serveur de développement, le build, les tests, le lint et le
formatage.

```bash
irm https://viteplus.dev/install.ps1 | iex
```

Sous Linux ou macOS : `curl -fsSL https://vite.plus | bash`. Vite+ gère aussi la
version de Node (24, épinglée dans `.node-version`) et s'appuie sur pnpm.

```bash
vp install
```

| Commande                                    | Effet                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `vp run -r build`                           | Construit tous les userscripts dans `packages/*/dist/`                |
| `vp check`                                  | Formatage (Oxfmt), lint (Oxlint) et types (TypeScript 7) en une passe |
| `vp test --run`                             | Lance la suite Vitest                                                 |
| `vp dev -C packages/dcsm`                   | Serveur de développement du gestionnaire, avec HMR                    |
| `vp run --filter @dreadcast/registry check` | Valide `data/scripts.json` et la liste de secours                     |

### Contenu

| Paquet                | Rôle                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `packages/ddk`        | Dreadcast Development Kit, la bibliothèque partagée ([API](packages/ddk/README.md))            |
| `packages/dcsm`       | Dreadcast Script Manager, le gestionnaire intégré au jeu                                       |
| `packages/registry`   | Schéma de `data/scripts.json` et génération de la liste de secours                             |
| `packages/game-types` | Déclarations TypeScript des globales du jeu                                                    |
| `src/`                | Scripts hérités, encore en JavaScript, migrés progressivement                                  |
| `published/`          | Les userscripts construits, tels que Greasy Fork les sert ([publication](docs/publication.md)) |

`data/scripts.json` est le catalogue des scripts autorisés. Il ne change jamais
d'emplacement : les gestionnaires déjà installés le téléchargent depuis cette
adresse exacte.

## Contribuer

Les [tickets](https://github.com/Isilin/dreadcast-scripts/issues) et les [pull request](https://github.com/Isilin/dreadcast-scripts/pulls) sur Github sont les bienvenues. Si vous êtes intéressé pour contribuer au code ou remonter une erreur ou une possible amélioration, merci d'ouvrir un ticket pour en discuter.

Un guide détaillé de contribution peut-être trouvé [ICI](https://github.com/Isilin/dreadcast-scripts/blob/main/CONTRIBUTING.md).

## License

Le code source et la documentation de ce projet sont sous licence [GNU-GPLv3](https://github.com/Isilin/dreadcast-scripts/blob/main/LICENSE.md). Toutes les images, graphismes et autres ressources hors code sont sous licences [CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/4.0/). Merci d'ouvrir un ticket si vous avez une question à ce sujet.

Tous les assets et bibliothèques tiers utilisées dans ce projet demeurent sous leurs licences respectives.

## Remerciements

Merci à tous les joueurs qui ont contribués à ces scripts, en les écrivant, en les relisant, en les testant, ou en en profitant en jeu.
