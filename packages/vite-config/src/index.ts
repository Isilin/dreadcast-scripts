import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import basicSsl from '@vitejs/plugin-basic-ssl';
import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import monkey, { type MonkeyUserScript } from 'vite-plugin-monkey';

export interface UserscriptOptions {
  /**
   * Racine du package. Passer `import.meta.dirname` depuis le vite.config.ts.
   */
  root: string;
  /**
   * Nom du fichier produit, sans extension : `ddk` donne `ddk.user.js` et
   * `ddk.meta.js`.
   */
  fileName: string;
  /**
   * En-tete userscript. La version est ignoree : elle est toujours lue depuis
   * le package.json, seule source de verite.
   */
  userscript: Omit<MonkeyUserScript, 'version'>;
  /** Defaut : `src/index.ts`. */
  entry?: string;
  /**
   * Port du serveur de developpement. Un port fixe par package evite que deux
   * userscripts de developpement pointent sur la meme adresse.
   */
  devPort: number;
  /**
   * Modules laisses hors du bundle, associes au nom global qui les fournit.
   *
   * Le gestionnaire y declare `@dreadcast/ddk`, fourni par `@require` sous le
   * nom `DC`.
   */
  externalGlobals?: Record<string, string>;
  /**
   * Configuration Vite additionnelle, fusionnee en profondeur par
   * `mergeConfig` : les tableaux sont concatenes, les objets completes. Un
   * `extend` ne peut donc pas faire disparaitre `vite-plugin-monkey` ni
   * `minify: false`.
   */
  extend?: UserConfig;
}

const readVersion = (root: string): string => {
  const pkg: unknown = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

  if (
    typeof pkg !== 'object' ||
    pkg === null ||
    !('version' in pkg) ||
    typeof pkg.version !== 'string'
  ) {
    throw new Error(`${root}/package.json : champ 'version' absent ou invalide.`);
  }

  return pkg.version;
};

/**
 * Configuration commune a tous les userscripts du depot.
 *
 * - jQuery n'est jamais embarque ni meme dependance : le jeu expose deja son
 *   propre `$` (1.8.2), que le code herite utilise comme global ambiant. Deux
 *   jQuery dans la meme page se marcheraient dessus.
 * - Le serveur de developpement est en https : la page du jeu est servie en
 *   https, et un script charge depuis http://localhost est bloque en mixed
 *   content. Le certificat auto-signe doit etre accepte une fois, en ouvrant
 *   https://localhost:<devPort> dans le navigateur.
 */
export const defineUserscript = (options: UserscriptOptions): UserConfig => {
  const base = defineConfig({
    plugins: [
      basicSsl(),
      monkey({
        entry: options.entry ?? 'src/index.ts',
        userscript: {
          ...options.userscript,
          version: readVersion(options.root),
        },
        clientAlias: 'monkey',
        server: {
          open: false,
        },
        build: {
          fileName: `${options.fileName}.user.js`,
          metaFileName: `${options.fileName}.meta.js`,
          ...(options.externalGlobals === undefined
            ? {}
            : { externalGlobals: options.externalGlobals }),
          autoGrant: true,
        },
      }),
    ],
    server: {
      port: options.devPort,
      strictPort: true,
    },
    build: {
      // Les userscripts sont lus et audites par des joueurs et par les
      // moderateurs de Greasy Fork : le code publie reste lisible.
      minify: false,
      target: 'chrome120',
      sourcemap: false,
    },
  });

  return options.extend === undefined ? base : mergeConfig(base, options.extend);
};
