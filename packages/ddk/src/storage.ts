import { GM_deleteValue, GM_getValue, GM_listValues, GM_setValue } from 'monkey';

/**
 * Memoire persistante du gestionnaire de scripts (`GM_*`).
 *
 * Attention : l'espace de stockage appartient au userscript qui detient les
 * `@grant`. Les scripts charges par le DCSM partagent donc tous le meme, d'ou
 * `namespace()` pour l'API v2.
 */
export const get = <T>(key: string): T | undefined => GM_getValue(key) as T | undefined;

export const set = <T>(key: string, value: T): void => {
  GM_setValue(key, value);
};

export const remove = (key: string): void => {
  GM_deleteValue(key);
};

export const keys = (): string[] => GM_listValues();

/** Lit la valeur, en l'initialisant a `defaultValue` si elle est absente. */
export const init = <T>(key: string, defaultValue: T): T => {
  const current = GM_getValue(key) as T | undefined;

  if (current === undefined) {
    GM_setValue(key, defaultValue);
    return defaultValue;
  }

  return current;
};

export interface Namespace {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  keys(): string[];
  init<T>(key: string, defaultValue: T): T;
}

/**
 * Vue cloisonnee du stockage, prefixee par l'identifiant du script.
 *
 * Deux scripts qui utilisent tous les deux la cle `config` ne se marchent plus
 * dessus.
 */
export const namespace = (id: string): Namespace => {
  const prefix = `dcs:${id}:`;

  return {
    get: (key) => get(prefix + key),
    set: (key, value) => set(prefix + key, value),
    remove: (key) => remove(prefix + key),
    keys: () =>
      keys()
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.slice(prefix.length)),
    init: (key, defaultValue) => init(prefix + key, defaultValue),
  };
};
