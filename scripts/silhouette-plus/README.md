# Silhouette+

Personnalise entièrement la fiche RP : silhouette de chaque personnage, et
disposition des emplacements de l'inventaire. Réunit SkinSilhouette et
ShowSilhouette.

Distribué par le catalogue du gestionnaire et par Greasy Fork
([524423](https://greasyfork.org/scripts/524423)), qui synchronise
`published/silhouette-plus.user.js`.

## Réglages

| Réglage               | Effet                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------- |
| Masquer brillance     | Retire le reflet oblique que le jeu dessine sur les cases d'objet.                       |
| X / Y par emplacement | Position en pourcentage, de 19 emplacements. Les cases RP se règlent de 50 en 50.        |
| Changer la silhouette | Ouvre un message pré-rempli aux animateurs qui tiennent le Google Sheet des silhouettes. |

Les modifications s'appliquent en direct, sans rechargement.

La fenêtre s'ouvre depuis l'engrenage du gestionnaire (`openSettings`). Hors du
gestionnaire, ou sous un gestionnaire dont le DDK ne connaît pas encore
`openSettings`, le script ajoute une entrée « Paramètres ▾ > Silhouette+ ».

## Comment il s'applique

Uniquement par des feuilles de style :

- **Silhouettes** : une règle par personnage du Sheet,
  `#ib_persoBox_<id> .personnage_image`, plus `#zone_inventaire .personnage_image`
  pour le joueur. `!important` l'emporte sur le `style` en ligne que pose le
  jeu. La règle vise l'identifiant de la fenêtre, quel que soit le chemin qui l'a
  ouverte (`openPersoBox`, `openPersoBoxAtXY`…).
- **Disposition** : une règle par emplacement, dans une seule balise
  `<style data-dc-style="silhouettePlus-layout">` réécrite à chaque
  modification.

La version 1.0 enveloppait `Engine.prototype.openPersoBox` et rappelait
l'original sur le prototype plutôt que sur l'instance `engine`. Le jeu y lisait
`this.getIB()` — `undefined` sur le prototype, `'on'` sur l'instance — et
vidait alors le `title` de toutes les infobulles de la fiche RP, dont celle de
`.connec_0` qui donne la dernière connexion. Le script ne remplace plus aucune
méthode du jeu ; `tests/script.test.ts` le vérifie.

Les URL du Sheet sont validées (http ou https seulement) et normalisées par le
parseur d'URL avant d'être interpolées dans `url("…")` : une cellule saisie à la
main ne peut pas injecter de CSS.

## Stockage

Cloisonné sous `dcs:silhouettePlus:` : `positions` (seulement ce qui diffère des
valeurs par défaut) et `hideShine`.

Au premier démarrage, les réglages de la version 1.0 (`sp_position`,
`sp_shiny_disable`) sont repris. Les anciennes clés restent en place : les
listes de secours des gestionnaires déjà installés servent encore la
version 1.0.

## Démarrage

Sous le gestionnaire, c'est lui qui appelle `init`. Installé seul — depuis
Greasy Fork, ou en build local —, le script démarre de lui-même par le même
chemin (`DC.scripts.take` puis `DC.scripts.run`), une fois le DOM prêt. Il
distingue les deux cas par `Util.isDSM()`, que le gestionnaire pose.

## Recette locale

```bash
vp run -r build && node tools/serve-dist.mjs
```

Puis, dans un second terminal, reconstruire contre le DDK servi en local :

```bash
SILHOUETTE_PLUS_LOCAL_DDK=http://localhost:8720/ddk.user.js vp run -r build
```

Installer `http://localhost:8720/silhouette-plus.user.js`. Le build local prend
le nom `Silhouette+ (local)` et le namespace `Dreadcast-local` : désactiver
l'installation Greasy Fork pendant la recette, sans quoi les deux tournent.
