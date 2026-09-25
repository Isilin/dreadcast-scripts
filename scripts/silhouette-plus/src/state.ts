import DC from '@dreadcast/ddk';
import type { ScriptContext } from '@dreadcast/ddk';

import { overridesOf, readLayout, type Layout } from './positions.ts';

export interface SilhouetteState {
  layout: Layout;
  hideShine: boolean;
}

type Storage = ScriptContext['storage'];

/** Cles du stockage cloisonne : `dcs:silhouettePlus:<cle>`. */
export const KEYS = { layout: 'positions', hideShine: 'hideShine' } as const;

/**
 * Cles de la version 1.0, qui ecrivait a la racine du stockage de son hote --
 * le gestionnaire, ou le script lui-meme quand il etait installe seul.
 */
export const LEGACY_KEYS = { layout: 'sp_position', hideShine: 'sp_shiny_disable' } as const;

/**
 * Reprend les reglages de la version 1.0, au premier demarrage seulement.
 *
 * Les anciennes cles restent en place : la version 1.0 est encore servie par
 * les listes de secours des gestionnaires deja installes, qui la liraient.
 */
const migrate = (storage: Storage): void => {
  if (storage.get(KEYS.layout) === undefined) {
    const legacy = DC.storage.get<unknown>(LEGACY_KEYS.layout);
    if (legacy !== undefined) storage.set(KEYS.layout, overridesOf(readLayout(legacy)));
  }

  if (storage.get(KEYS.hideShine) === undefined) {
    const legacy = DC.storage.get<unknown>(LEGACY_KEYS.hideShine);
    if (typeof legacy === 'boolean') storage.set(KEYS.hideShine, legacy);
  }
};

export const loadState = (storage: Storage): SilhouetteState => {
  migrate(storage);

  return {
    layout: readLayout(storage.get(KEYS.layout)),
    hideShine: storage.get(KEYS.hideShine) === true,
  };
};

export const saveState = (storage: Storage, state: SilhouetteState): void => {
  storage.set(KEYS.layout, overridesOf(state.layout));
  storage.set(KEYS.hideShine, state.hideShine);
};
