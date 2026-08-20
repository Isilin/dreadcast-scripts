/// <reference types="@dreadcast/game-types" />
/// <reference types="vite-plugin-monkey/client" />

// `clientAlias: 'monkey'` renomme le module client de vite-plugin-monkey, dont
// les types sont declares en dur sous le nom `$`. On reexporte pour que
// `import { GM_getValue } from 'monkey'` reste type -- et pour ne pas ecrire
// `from '$'`, qui prete a confusion avec le jQuery de la page.
declare module 'monkey' {
  export * from '$';
}

// Extension historique du prototype jQuery, conservee pour les scripts publies.
// Voir legacy.installJQueryPlugin().
interface JQuery {
  insertAt(index: number, element: unknown): JQuery;
}
