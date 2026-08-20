import { defineConfig } from 'vite-plus';

// Le code herite de `src/` et `examples/` est publie tel quel (deux entrees de
// data/scripts.json pointent directement dessus) : on ne le lint ni ne le
// formate tant qu'il n'est pas migre dans `scripts/`.
//
// Le catalogue d'API du jeu est un inventaire genere depuis un bundle minifie,
// pas du code : il redeclare des noms de lib.dom (`Navigator`) et n'a rien a
// faire dans la verification de types.
//
// `fallback.ts` est genere par `vp run registry:sync` a partir de
// data/scripts.json : le reformater ferait diverger la verification d'ecart.
const IGNORED = [
  'src/**',
  'examples/**',
  // Sources du jeu, et build navigateur de jQuery 1.8.2 verse pour les tests :
  // du code tiers, qui doit rester tel quel au bit pres.
  'vendor/**',
  'tests/fixtures/vendor/**',
  'dist/**',
  'data/**',
  'packages/game-types/catalogue/**',
  'packages/dcsm/src/fallback.ts',
  // Le code publie doit rester au bit pres ce que le build a produit : c'est
  // ce fichier exact que Greasy Fork sert aux joueurs.
  'published/**',
  // Changelogs produits par release-please depuis les commits. Les formater
  // ferait echouer la verification sur chaque pull request de release, que
  // personne ne peut corriger a la main sans que l'outil la reecrive.
  // Le CHANGELOG.md racine, lui, est redige et reste verifie.
  'packages/*/CHANGELOG.md',
];

export default defineConfig({
  lint: {
    ignorePatterns: IGNORED,
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      // Les userscripts n'ont pas d'autre canal de diagnostic que la console.
      'no-console': 'off',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['packages/*/tests/**/*.test.ts'],
    // Les sources importent le module client de vite-plugin-monkey, qui n'est
    // fourni qu'au moment du build. Les tests lui substituent une memoire et
    // un client HTTP simules.
    alias: [{ find: /^monkey$/, replacement: '/tests/mocks/monkey.ts' }],
  },
  fmt: {
    ignorePatterns: IGNORED,
    singleQuote: true,
    semi: true,
    sortPackageJson: true,
  },
});
