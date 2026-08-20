# Recette du gestionnaire en jeu

Protocole de vérification du Dreadcast Script Manager dans un vrai navigateur,
avant publication sur Greasy Fork. À rejouer à chaque version qui touche au
gestionnaire ou à la bibliothèque.

Ce que les tests automatiques ne peuvent pas couvrir : la sémantique exacte du
bac à sable du gestionnaire de userscripts, c'est-à-dire le fait que le `DC`
posé par le DDK chargé en `@require` soit visible depuis le script principal.
Tout le reste est vérifié par `vp test --run`, y compris sur les fichiers
construits.

## Gestionnaires couverts

**Tampermonkey**, **Violentmonkey** et **Greasemonkey 3**, qui fournissent les
`GM_*` synchrones.

**Greasemonkey 4 et FireMonkey ne fonctionnent pas**, et n'ont jamais
fonctionné : ils sont passés exclusivement aux `GM.*` asynchrones, alors que
`DC.LocalMemory` est synchrone depuis la version 1. Les rendre compatibles
demanderait de rendre le stockage asynchrone, donc de casser l'API que les
cinquante scripts publiés utilisent.

---

## Préparation

1. **Exporter la configuration existante** : Paramètres ▾ > Scripts & Skins >
   Exporter la configuration. C'est le filet de sécurité, et le jeu de données
   de l'étape 9.

2. **Désactiver dans le gestionnaire** les deux userscripts Greasy Fork :

   | Userscript                | Pourquoi                                                                                                                                                                                                                             |
   | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | Dreadcast Script Manager  | Sinon deux gestionnaires tournent et chargent chacun les scripts.                                                                                                                                                                    |
   | Dreadcast Development Kit | **Non optionnel.** Installé seul, il patche `MenuChat.prototype` sur l'objet de la page ; le nouveau DDK verrait `originalSend` déjà défini et renoncerait à poser le sien. Les commandes de chat garderaient l'ancien comportement. |

3. **Construire et servir** :

   ```bash
   vp run -r build && node tools/serve-dist.mjs
   ```

   Puis, dans un second terminal, reconstruire le gestionnaire contre le DDK
   local — la commande exacte est affichée par le serveur :

   ```bash
   DCSM_LOCAL_DDK=http://localhost:8720/ddk.user.js vp run -r build
   ```

   Le build local prend le nom `Dreadcast Script Manager (local)` et le
   namespace `Dreadcast-local` : il n'écrase pas l'installation Greasy Fork et
   démarre sur une mémoire vierge. Il n'a pas d'URL de mise à jour, sinon le
   gestionnaire le remplacerait par la version officielle en pleine recette.

   L'URL du `@require` porte un horodatage regénéré à chaque build. Les
   gestionnaires mettent les `@require` en cache et ne les resollicitent pas au
   rechargement de la page : sans URL neuve, le DDK servi resterait celui du
   build précédent.

4. **Installer** `http://localhost:8720/dcsm.user.js`, et lui seul. Le DDK n'est
   pas installé : il arrive par `@require`.

---

## Recette

| #   | Action                                                              | Ce que ça prouve                                                                                                                                                           |
| --- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Ouvrir `https://www.dreadcast.net/Main`, console ouverte            | **Le point décisif.** Aucune `ReferenceError: DC is not defined`, aucune `TypeError` sur `DC.storage` : le `DC` du `@require` est bien visible depuis le script principal. |
| 2   | Lire la console                                                     | `DCSM - Liste des scripts mise a jour depuis la source distante.`                                                                                                          |
| 3   | Fermer la fenêtre d'accueil, recharger                              | Elle ne revient pas : `dcsm_intro_disabled` est écrit.                                                                                                                     |
| 4   | Paramètres ▾ > Scripts & Skins                                      | Entrée injectée dans le bon menu ; bandeau indiquant la source de la liste ; les scripts non expérimentaux listés.                                                         |
| 5   | Filtres section, catégorie, recherche                               | Le rendu unique remplace les trois blocs dupliqués de la version précédente.                                                                                               |
| 6   | Cocher deux scripts, **fermer sans sauvegarder**, rouvrir           | Les cases sont revenues à leur état initial. La version précédente appliquait déjà chaque clic.                                                                            |
| 7   | Cocher un script simple, Sauvegarder                                | Rechargement, puis `DCSM - Le script '<nom>' a ete charge.`                                                                                                                |
| 8   | Boutons Documentation, Topic RP, Contact                            | Le bouton RP ouvre le topic RP, et non la documentation. Le bouton Contact ouvre un message.                                                                               |
| 9   | Importer la configuration exportée en préparation                   | Configuration réelle reprise. `dcsm_scripts_cache` est volontairement ignoré à l'import comme à l'export.                                                                  |
| 10  | Basculer le mode développeur                                        | `dcmobilefix` et `ddm` apparaissent immédiatement, et disparaissent au retour.                                                                                             |
| 11  | Ouvrir et fermer la fenêtre cinq fois, puis le contrôle ci-dessous  | Ni écouteurs ni feuilles de style accumulés.                                                                                                                               |
| 12  | Devtools > Network > bloquer `raw.githubusercontent.com`, recharger | Bandeau rouge « liste en cache ». Après vidage du cache : « liste de secours embarquée ». Les scripts se chargent dans les deux cas.                                       |
| 13  | Ouvrir `/Forum` puis `/EDC`                                         | Pas de fenêtre — elle n'existe qu'en jeu — mais les scripts de la section correspondante se chargent.                                                                      |
| 14  | Réinitialiser                                                       | Mémoire vidée, retour à l'état d'installation.                                                                                                                             |

Contrôle objectif à coller en console à l'étape 11 :

```js
({
  styles: document.querySelectorAll('style').length,
  tooltips: [...document.querySelectorAll('style')].filter((s) =>
    s.textContent.includes('.tooltiptext'),
  ).length,
  modales: document.querySelectorAll('#scripts_modal').length,
});
```

`tooltips` doit valoir 1 quel que soit le nombre d'ouvertures. La version
précédente réinjectait la feuille à chaque infobulle construite, soit cinq par
ligne de script.

### Passage sur Violentmonkey

Étapes 1, 2, 4, 7 et 12 uniquement : il s'agit de confirmer que le partage de
`DC` et le chargement des scripts tiennent sur un autre bac à sable.

---

## Si l'étape 1 échoue

C'est le seul scénario qui remet en cause la conception.

1. En console, dans le contexte du userscript : `typeof DC`. S'il vaut
   `"undefined"`, le `@require` n'a pas partagé sa portée globale.
2. Vérifier dans l'onglet Externals du gestionnaire que le `@require` a bien été
   téléchargé depuis `localhost` et non servi depuis le cache.
3. Le correctif serait d'ajouter, en pied du fichier du DDK et hors de son
   IIFE, `var DC = globalThis.DC, Util = globalThis.Util;` — le mécanisme de
   portée partagée sur lequel s'appuyait la version 1. Attention :
   `build.rolldownOptions.output.footer` injecte la ligne **deux fois**, dont
   une à l'intérieur de l'IIFE où elle redéclare le `DC` du bundle. Il faut
   passer par un greffon Vite qui écrit dans l'artefact émis.

## Retour en arrière

Supprimer le userscript `(local)`, réactiver les deux userscripts Greasy Fork.
La configuration d'origine n'a pas été touchée : le build local utilise un
namespace distinct, donc une mémoire distincte.
