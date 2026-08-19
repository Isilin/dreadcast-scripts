import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Racine du depot, depuis packages/registry/src. */
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

/**
 * Le catalogue reste a cet emplacement exact : les DCSM deja installes chez
 * les joueurs le telechargent depuis
 * raw.githubusercontent.com/.../main/data/scripts.json. Le deplacer couperait
 * le chargement de scripts pour tout le monde.
 */
export const REGISTRY_FILE = join(ROOT, 'data', 'scripts.json');

/** Copie de secours embarquee dans le userscript du gestionnaire. */
export const FALLBACK_FILE = join(ROOT, 'packages', 'dcsm', 'src', 'fallback.ts');
