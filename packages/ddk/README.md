# @dreadcast/ddk

Bibliothèque partagée par les scripts Dreadcast, publiée sur Greasy Fork sous
le nom **Dreadcast Development Kit** ([507382](https://greasyfork.org/scripts/507382)).
Elle est chargée par `@require` : le gestionnaire de scripts et les scripts
qu'il lance la trouvent sous le nom global `DC`.

## Deux API dans le même objet

`DC` expose une API moderne, et l'intégralité de l'API historique.

| API v2 (nouveau code)           | API v1 (scripts publiés)             |
| ------------------------------- | ------------------------------------ |
| `DC.dom`                        | —                                    |
| `DC.ui`                         | `DC.UI` (renvoie des objets jQuery)  |
| `DC.style`                      | `DC.Style`                           |
| `DC.storage`                    | `DC.LocalMemory`                     |
| `DC.net`                        | `DC.Network`                         |
| `DC.game.chat` / `DC.game.deck` | `DC.Chat` / `DC.Deck` / `DC.TopMenu` |
| `DC.context` / `DC.guards`      | `Util`                               |
| `DC.registerScript`             | —                                    |

L'API v1 ne bougera pas : une cinquantaine de scripts publiés par d'autres
auteurs l'appellent, sans copie dans ce dépôt. Le nouveau code passe par les
modules natifs — il n'y a plus de jQuery côté DDK, seulement dans la couche de
compatibilité, parce que le jeu embarque un jQuery 1.8.2 que nous ne
contrôlons pas.

## Déclarer un script (API v2)

Un script qui s'enregistre n'est plus responsable de son démarrage : le
gestionnaire l'appelle avec son stockage cloisonné et ses réglages, et sait
afficher son écran de configuration.

```ts
DC.registerScript({
  // Facultatif : le gestionnaire fournit l'identifiant du catalogue.
  id: 'monscript',

  settings: [
    { key: 'couleur', type: 'color', label: 'Couleur des alertes', default: 'ff0000' },
    { key: 'delai', type: 'number', label: 'Délai (s)', default: 30, min: 5, max: 300 },
    { key: 'actif', type: 'boolean', label: 'Alerte sonore', default: true },
  ],

  init(ctx) {
    ctx.log('démarrage en contexte', ctx.context);

    // Cloisonné : `dcs:monscript:vu`, sans collision avec les autres scripts.
    const dejaVu = ctx.storage.init('vu', false);

    if (ctx.settings['actif'] === true) {
      // …
    }
  },
});
```

Types de réglages : `boolean`, `number`, `text`, `color`, `select`.

Les réglages sont lus au démarrage : une modification prend effet au
rechargement de la page, comme l'activation d'un script.

Un script qui n'appelle pas `registerScript` continue de s'exécuter tel quel au
chargement — c'est le cas de tous les scripts existants.

## Points d'attention

- **Le bundle est une IIFE.** `DC` et `Util` sont posés explicitement sur la
  portée globale du bac à sable, jamais sur `unsafeWindow` : la page du jeu n'a
  pas à les voir.
- **Le chat est intercepté une seule fois.** `MenuChat.prototype.send` est
  enveloppé au chargement ; `DC.game.chat.onSend` s'ajoute à la file.
- **`DC.net.run` utilise `new Function`, pas `eval`.** Un script chargé
  retrouve ainsi la portée de fonction non stricte que lui donnerait un
  gestionnaire de userscripts, au lieu d'hériter du mode strict du bundle et de
  voir ses variables internes.
