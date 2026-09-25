/// <reference types="@dreadcast/game-types" />
/// <reference types="vite-plugin-monkey/client" />

declare module 'monkey' {
  export * from '$';
}

/**
 * URL du catalogue de recette, definie par le build local seulement. Voir
 * `DCSM_LOCAL_LIST` dans vite.config.ts.
 */
declare const __DCSM_LIST_URL__: string | undefined;
