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

## La première publication est manuelle

Le workflow ne publie que ce qui a changé : il compare les fichiers construits à
ceux de `published/`. Or ceux-ci y sont déjà, aux versions à publier. Il ne
verrait donc rien à envoyer, puis attendrait en vain que Greasy Fork annonce une
version que personne ne lui a poussée.

Pour cette première fois, une fois les URL de synchronisation changées :

1. Synchroniser **le DDK** à la main sur sa fiche Greasy Fork.
2. Relever l'identifiant que Greasy Fork vient de lui attribuer :
   `node tools/greasyfork.mjs resolve 507382 <version du DDK>`.
3. **Le reporter dans `DDK_VERSION`**, packages/dcsm/vite.config.ts, puis
   reconstruire et recopier dans `published/`.
4. Synchroniser **le gestionnaire**.

L'étape 3 n'est pas facultative : sans elle, le gestionnaire publié réclame
l'identifiant de l'ancien DDK, charge une bibliothèque qui n'a pas les modules
attendus, et échoue au démarrage sur `DC.dom is undefined`. C'est précisément ce
que le workflow automatise, et qui manque quand on le court-circuite.

Les publications suivantes passent par le workflow, chaque version apportant par
construction un fichier différent.

## Publier

```bash
git tag v1.5.0 && git push origin v1.5.0
```

Le workflow [release.yml](../.github/workflows/release.yml) enchaîne :
vérification, tests, build, publication du DDK, attente de sa synchronisation
par Greasy Fork, puis construction et publication du gestionnaire épinglé sur
lui. Il publie toujours le contenu de `main` : le tag est donc à poser sur une
branche à jour. `workflow_dispatch` permet aussi de le déclencher à la main, et
de décocher la publication du gestionnaire pour un essai à blanc.

Les numéros de version viennent des `package.json` et se règlent à la main.
Greasy Fork refuse une version identique à la précédente : sans incrément, la
synchronisation ne fait rien.

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
