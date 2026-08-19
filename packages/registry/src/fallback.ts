import { readFileSync, writeFileSync } from 'node:fs';

import { FALLBACK_FILE } from './paths.ts';
import type { Registry } from './schema.ts';

/**
 * Rend le module de secours embarque dans le gestionnaire.
 *
 * Un litteral TypeScript plutot qu'une chaine JSON : la liste est ainsi
 * verifiee par le compilateur, et une entree malformee echoue au build au lieu
 * d'echouer chez le joueur.
 */
export const renderFallback = (registry: Registry): string =>
  [
    "// Genere par 'pnpm registry:sync' -- ne pas editer a la main.",
    '//',
    '// Copie hors ligne du catalogue, utilisee en dernier recours quand le cache',
    '// local et la source distante sont tous les deux indisponibles. Elle peut',
    '// avoir du retard sur data/scripts.json.',
    '',
    "import type { ScriptEntry } from '@dreadcast/registry';",
    '',
    `export const FALLBACK_LIST: ScriptEntry[] = ${JSON.stringify(registry, null, 2)};`,
    '',
  ].join('\n');

export const readFallback = (file = FALLBACK_FILE): string | undefined => {
  try {
    return readFileSync(file, 'utf8');
  } catch {
    return undefined;
  }
};

export const writeFallback = (content: string, file = FALLBACK_FILE): void => {
  writeFileSync(file, content, 'utf8');
};
