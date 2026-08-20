# @dreadcast/game-types

Declarations TypeScript des globales que le client Dreadcast expose a la page :
`engine`, `nav`, `MenuChat`, et le `$` du jeu.

## Ce qui est type, et ce qui ne l'est pas

`src/index.d.ts` est **ecrit a la main** et ne couvre que ce que le DDK et le
DCSM utilisent reellement. C'est volontaire : une signature inventee est pire
qu'une absence de type.

`catalogue/ingame-api.d.ts` est **genere** par `tools/extract-game-api.mjs`
depuis le bundle du jeu (47 classes, 884 methodes). Il n'est pas compile : il
sert d'inventaire quand on cherche le nom d'une methode a typer. Pour le
regenerer, il faut le bundle du jeu dans `vendor/dreadcast.net/` (non
versionne) puis :

```
pnpm --filter @dreadcast/game-types run extract
```

## jQuery

Le jeu embarque **jQuery 1.8.2**. `@types/jquery` est donc epingle sur la ligne
1.10, et non sur la derniere version : `$.type()`, `.bind()` et `.size()`
existent sur ce runtime alors qu'ils ont disparu de jQuery 3 et 4. Ne pas
"mettre a jour" cette dependance sans changer le jQuery de la page, ce qui
n'est pas de notre ressort.
