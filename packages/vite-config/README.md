# @dreadcast/vite-config

Fabrique de configuration Vite partagée par tous les userscripts du dépôt.
Paquet interne, jamais publié.

Le `vite.config.ts` d'un userscript ne contient que ce qui lui est propre —
nom, `@match`, `@grant`, URLs Greasy Fork — et appelle `defineUserscript` pour
le reste.

```ts
import { defineUserscript } from '@dreadcast/vite-config';

export default defineUserscript({
  root: import.meta.dirname,
  fileName: 'ddk', // produit ddk.user.js et ddk.meta.js
  devPort: 5180,
  userscript: {
    name: 'Dreadcast Development Kit',
    match: 'https://www.dreadcast.net/Main',
  },
});
```

## Ce que la fabrique impose, et pourquoi

| Réglage                                          | Raison                                                                                                                                                                                                      |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@version` lu depuis le `package.json` du paquet | Une seule source de vérité. Une version saisie à deux endroits finit par diverger.                                                                                                                          |
| `minify: false`                                  | Le code publié est relu par les modérateurs de Greasy Fork et par les joueurs. C'est une décision d'auditabilité, pas de packaging.                                                                         |
| Serveur de développement en https                | La page du jeu est servie en https ; un script chargé depuis `http://localhost` est bloqué en mixed content. Le certificat auto-signé doit être accepté une fois, en ouvrant `https://localhost:<devPort>`. |
| Un `devPort` par paquet                          | Deux userscripts de développement ne peuvent pas pointer sur la même adresse.                                                                                                                               |
| `clientAlias: 'monkey'`                          | Nom sous lequel les `GM_*` sont importés. S'il diverge, l'alias de test du `vite.config.ts` racine ne correspond plus.                                                                                      |
| `autoGrant`                                      | Les `@grant` sont déduits du code plutôt que maintenus à la main.                                                                                                                                           |

jQuery n'est ni embarqué ni déclaré en dépendance : le jeu expose son propre
`$` (1.8.2), utilisé comme global ambiant par le code hérité.

## externalGlobals

Laisse un module hors du bundle et le remplace par un global. Le gestionnaire
s'en sert pour le DDK, qu'il reçoit par `@require` :

```ts
externalGlobals: { '@dreadcast/ddk': 'DC' },
```

Sans cela, le DDK serait dupliqué dans le bundle du gestionnaire, et les
scripts chargés ne partageraient plus le même `DC`.

## extend

Échappatoire pour les besoins ponctuels d'un paquet. La fusion est **profonde**
(`mergeConfig` de Vite) : les tableaux se concatènent, les objets se complètent.

```ts
extend: { build: { sourcemap: true } }, // conserve minify: false et target
```

Un simple spread aurait remplacé le bloc `build` entier — et réactivé la
minification en silence. C'est ce que vérifie
[tests/define-userscript.test.ts](tests/define-userscript.test.ts).
