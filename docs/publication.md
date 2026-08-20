# Publier sur Greasy Fork

Les deux userscripts sont distribués par Greasy Fork, qui se synchronise tout
seul depuis ce dépôt.

| Script                    | Greasy Fork                                     | Fichier synchronisé      |
| ------------------------- | ----------------------------------------------- | ------------------------ |
| Dreadcast Development Kit | [507382](https://greasyfork.org/scripts/507382) | `published/ddk.user.js`  |
| Dreadcast Script Manager  | [507383](https://greasyfork.org/scripts/507383) | `published/dcsm.user.js` |

`published/` est **versionné**, contrairement à `packages/*/dist`. C'est
volontaire : Greasy Fork lit un fichier à une URL GitHub, et le dépôt montre
ainsi exactement ce que reçoivent les joueurs.

## Configuration, une fois pour toutes

Sur la fiche de chaque script, dans les paramètres de synchronisation, l'URL du
code :

```
https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/published/ddk.user.js
https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/published/dcsm.user.js
```

Le webhook GitHub reste celui déjà en place : seul le chemin change, l'ancien
pointant sur `src/lib/helper.js` et `src/scripts/script-manager.js`.

Si `main` est protégée, le push du workflow demande un jeton autorisé à
contourner la protection.

## Amorcer un nouveau script

Le workflow ne publie que ce qui a changé, et le gestionnaire s'épingle sur une
révision du DDK que Greasy Fork n'attribue qu'après synchronisation. Un script
publié pour la première fois demande donc quelques gestes manuels :

1. Synchroniser le nouveau script à la main sur sa fiche Greasy Fork.
2. Si le gestionnaire en dépend, relever la révision attribuée :
   `node tools/greasyfork.mjs resolve <scriptId> <version>`, et la reporter dans
   la constante correspondante de sa configuration Vite.

C'est cette seconde étape, omise lors de la bascule vers la version TypeScript,
qui a livré un gestionnaire 1.5.0 réclamant l'identifiant de l'ancien DDK : il
chargeait une bibliothèque dépourvue des modules attendus et échouait au
démarrage sur `DC.dom is undefined`.

## Publier

Rien à taguer, rien à incrémenter : les numéros de version viennent des commits.

1. Fusionner les changements vers `main`, en Conventional Commits. Le paquet
   concerné est déduit des **chemins modifiés** — un commit qui touche
   `packages/ddk/**` fait monter le DDK — et non du scope, qui reste une aide à
   la lecture.
2. release-please ouvre ou met à jour une **pull request de release** : elle
   porte les nouveaux numéros et les changelogs. Elle s'accumule tant qu'on ne
   la fusionne pas.
3. La fusionner déclenche la publication, dans le même workflow : vérification,
   tests, build, publication du DDK, attente de sa synchronisation par Greasy
   Fork, puis construction et publication du gestionnaire épinglé sur lui.

`workflow_dispatch` permet de forcer une publication sans release, et de
décocher le gestionnaire pour un essai à blanc.

Greasy Fork refuse une version identique à la précédente. C'est exactement ce
que cette mécanique supprime : l'incrément n'est plus à penser.

> Une pull request ouverte par `GITHUB_TOKEN` ne déclenche pas les workflows :
> la pull request de release n'aura donc pas de passage en intégration. Elle ne
> touche que des numéros et des changelogs.

## Deux règles à ne pas enfreindre

**Le fichier doit apparaître en `modified`.** Greasy Fork inspecte la charge
utile du push et ignore un fichier qui y figure en `added` — son webhook répond
alors « No commits found in this push », avec un code 200 trompeur. Le workflow
écrit donc par-dessus des fichiers existants, sans jamais les supprimer d'abord
et sans `--force`. C'est aussi pourquoi `published/` est commité avec du contenu
dès sa création, plutôt que rempli par la première exécution.

**Le DDK part avant le gestionnaire.** Celui-ci l'épingle par `?version=NNNN`,
identifiant que Greasy Fork n'attribue qu'après avoir synchronisé. Le workflow
attend donc, via `tools/greasyfork.mjs`, que la version attendue apparaisse dans
l'API avant de construire le gestionnaire. Publier le gestionnaire d'abord
livrerait un fichier réclamant l'ancien DDK, dont l'API a changé : il ne
démarrerait pas.

## Diagnostic

| Symptôme                                        | Cause                                                                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Webhook 200, « No commits found in this push »  | Le fichier était en `added`. Vérifier avec `git show --stat` que le commit le donne bien en modification.                            |
| L'attente expire au bout de quinze minutes      | Greasy Fork n'a pas synchronisé : webhook mal configuré, URL de code erronée, ou version identique à la précédente.                  |
| Le `@require` publié porte l'ancien identifiant | Le gestionnaire a été construit sans `DCSM_DDK_VERSION`. Le workflow le vérifie et échoue, mais un build local n'a pas ce garde-fou. |

## À surveiller

Le DDK est publié comme script et non comme bibliothèque, alors que la
[politique sur le code externe](https://greasyfork.org/en/help/external-scripts)
parle de « scripts publiés comme bibliothèques ». Le gestionnaire le requiert
ainsi depuis toujours sans avoir été inquiété, mais la question mérite d'être
posée à la modération.

`raw.githubusercontent.com` n'est pas un CDN reconnu par Greasy Fork : il
convient comme source de synchronisation, jamais comme cible d'un `@require`.
