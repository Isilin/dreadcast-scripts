import DC from '@dreadcast/ddk';
import type { ScriptEntry } from '@dreadcast/registry';

import { FALLBACK_LIST } from './fallback.ts';
import { KEYS } from './state.ts';

export const LIST_URL =
  'https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/data/scripts.json';

/** Au dela d'une heure, on retente la source distante. */
export const CACHE_TTL = 60 * 60 * 1000;

/** Le catalogue est un petit fichier statique : huit secondes suffisent. */
export const FETCH_TIMEOUT = 8000;

export type ListSource = 'remote' | 'cache' | 'cache-stale' | 'embedded';

export interface ResolvedList {
  scripts: ScriptEntry[];
  source: ListSource;
  ts: number;
}

interface CacheEntry {
  ts: number;
  scripts: ScriptEntry[];
}

/**
 * Validation minimale, volontairement ecrite a la main.
 *
 * Le schema complet vit dans @dreadcast/registry et tourne en integration.
 * L'embarquer ici alourdirait le userscript de milliers de lignes de
 * bibliotheque, que les moderateurs de Greasy Fork devraient relire.
 */
export const isValidList = (value: unknown): value is ScriptEntry[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const script = entry as Partial<ScriptEntry>;
    return (
      typeof script.id === 'string' &&
      script.id !== '' &&
      typeof script.url === 'string' &&
      script.url !== '' &&
      Array.isArray(script.section) &&
      Array.isArray(script.category)
    );
  });

/** `undefined` des que le cache est absent ou corrompu : meme traitement. */
const readCache = (): CacheEntry | undefined => {
  const cache = DC.storage.get<Partial<CacheEntry>>(KEYS.cache);

  if (
    typeof cache !== 'object' ||
    cache === null ||
    !Number.isFinite(cache.ts) ||
    !isValidList(cache.scripts)
  ) {
    return undefined;
  }

  return cache as CacheEntry;
};

/** Une seule entree plutot que deux cles : la liste et sa date restent liees. */
const writeCache = (scripts: ScriptEntry[]): CacheEntry => {
  const cache: CacheEntry = { ts: Date.now(), scripts };
  DC.storage.set(KEYS.cache, cache);
  return cache;
};

const fetchList = async (): Promise<ScriptEntry[]> => {
  const list = await DC.net.json<unknown>(LIST_URL, FETCH_TIMEOUT);

  // La requete aboutit quel que soit le code HTTP : un 4xx ou un 5xx arrive ici
  // sous forme de `null` ou de page d'erreur. Seule la charge utile fait foi.
  if (!isValidList(list)) {
    throw new Error('la liste distante est vide ou malformee');
  }

  return list;
};

/**
 * Cache de moins d'une heure, sinon liste distante, sinon cache quel que soit
 * son age, sinon copie embarquee dans ce userscript.
 */
export const resolveList = async (): Promise<ResolvedList> => {
  const cache = readCache();

  if (cache !== undefined && Date.now() - cache.ts < CACHE_TTL) {
    console.info('DCSM - Liste des scripts lue depuis le cache.');
    return { scripts: cache.scripts, source: 'cache', ts: cache.ts };
  }

  try {
    const scripts = await fetchList();
    console.info('DCSM - Liste des scripts mise a jour depuis la source distante.');
    return { scripts, source: 'remote', ts: writeCache(scripts).ts };
  } catch (error) {
    if (cache !== undefined) {
      // L'horodatage n'est pas touche : la mise a jour sera retentee au
      // prochain chargement, et non dans une heure.
      console.warn(
        `DCSM - Mise a jour impossible, la liste en cache est conservee : ${String(error)}`,
      );
      return { scripts: cache.scripts, source: 'cache-stale', ts: cache.ts };
    }

    if (!isValidList(FALLBACK_LIST)) {
      throw new Error('ni cache, ni liste distante, ni liste embarquee utilisable');
    }

    console.error(
      `DCSM - Chargement impossible, la liste embarquee est utilisee : ${String(error)}`,
    );

    return {
      scripts: FALLBACK_LIST,
      source: 'embedded',
      ts: writeCache(FALLBACK_LIST).ts,
    };
  }
};
