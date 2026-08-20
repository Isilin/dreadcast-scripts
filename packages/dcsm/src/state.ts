import DC from '@dreadcast/ddk';
import type { ScriptEntry } from '@dreadcast/registry';

/**
 * Cles de la memoire persistante.
 *
 * Elles sont gravees dans le marbre : ce sont celles des configurations deja
 * enregistrees chez les joueurs. Les renommer reinitialiserait tout le monde.
 */
export const KEYS = {
  enabled: 'dcsm_list',
  allDisabled: 'dcsm_all_disabled',
  introDisabled: 'dcsm_intro_disabled',
  devMode: 'dcsm_dev_mode',
  cache: 'dcsm_scripts_cache',
} as const;

/** Ancien prefixe, utilise avant le renommage en `dcsm_`. */
const LEGACY_KEYS = {
  enabled: 'dcm_list',
  allDisabled: 'dcm_all_disabled',
} as const;

export type EnabledMap = Record<string, boolean>;

export interface ManagerState {
  enabled: EnabledMap;
  allDisabled: boolean;
  introDisabled: boolean;
  devMode: boolean;
}

const migrate = (): void => {
  for (const [field, oldKey] of Object.entries(LEGACY_KEYS)) {
    const value = DC.storage.get(oldKey);
    if (value === undefined) continue;

    DC.storage.set(KEYS[field as keyof typeof LEGACY_KEYS], value);
    DC.storage.remove(oldKey);
  }
};

export const load = (): ManagerState => {
  DC.storage.init<EnabledMap>(KEYS.enabled, {});
  DC.storage.init(KEYS.allDisabled, false);
  DC.storage.init(KEYS.introDisabled, false);
  DC.storage.init(KEYS.devMode, false);

  migrate();

  return {
    enabled: DC.storage.get<EnabledMap>(KEYS.enabled) ?? {},
    allDisabled: DC.storage.get<boolean>(KEYS.allDisabled) ?? false,
    introDisabled: DC.storage.get<boolean>(KEYS.introDisabled) ?? false,
    devMode: DC.storage.get<boolean>(KEYS.devMode) ?? false,
  };
};

export const save = (state: ManagerState): void => {
  DC.storage.set(KEYS.enabled, state.enabled);
  DC.storage.set(KEYS.allDisabled, state.allDisabled);
  DC.storage.set(KEYS.devMode, state.devMode);
};

export const markIntroSeen = (): void => {
  DC.storage.set(KEYS.introDisabled, true);
};

/**
 * Complete la configuration avec les scripts inconnus, desactives par defaut.
 *
 * `prune` ne doit valoir `true` que pour la liste distante. Sur une liste
 * degradee -- cache ou copie embarquee -- retirer les entrees absentes
 * supprimerait silencieusement l'activation de scripts qui existent toujours.
 */
export const synchronize = (
  enabled: EnabledMap,
  scripts: ScriptEntry[],
  prune: boolean,
): EnabledMap => {
  const next: EnabledMap = { ...enabled };

  for (const script of scripts) {
    if (!Object.hasOwn(next, script.id)) next[script.id] = false;
  }

  const result = prune
    ? Object.fromEntries(
        Object.entries(next).filter(([id]) => scripts.some((script) => script.id === id)),
      )
    : next;

  DC.storage.set(KEYS.enabled, result);

  return result;
};

/** Efface toute la configuration, y compris celle des scripts. */
export const reset = (): void => {
  for (const key of DC.storage.keys()) DC.storage.remove(key);
};

/**
 * Configuration exportable.
 *
 * Le cache de la liste est exclu : il se reconstruit tout seul, et un fichier
 * de configuration n'a pas a le transporter.
 */
export const exportConfig = (): Record<string, unknown> =>
  Object.fromEntries(
    DC.storage
      .keys()
      .filter((key) => key !== KEYS.cache)
      .map((key) => [key, DC.storage.get(key)]),
  );

/**
 * Restaure une configuration exportee.
 *
 * Le cache de la liste est ignore : reprendre celui de quelqu'un d'autre
 * reviendrait a adopter son horodatage, et donc sa liste, comme la notre.
 */
export const importConfig = (data: Record<string, unknown>): void => {
  for (const [key, value] of Object.entries(data)) {
    if (key === KEYS.cache) continue;
    DC.storage.set(key, value);
  }
};
