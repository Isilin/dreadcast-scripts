import DC from '@dreadcast/ddk';
import type { ScriptEntry } from '@dreadcast/registry';

import type { EnabledMap } from './state.ts';

/**
 * Charge un script et le demarre.
 *
 * Deux chemins cohabitent :
 *
 * - historique : le code telecharge s'execute et fait son travail lui-meme ;
 * - v2 : le code appelle `DC.registerScript`, et c'est le gestionnaire qui
 *   appelle son `init` avec son stockage cloisonne et ses reglages.
 *
 * `DC.net.run` s'appuie sur `new Function` et non sur `eval` : le script
 * retrouve ainsi la portee de fonction non stricte que lui donnerait un
 * gestionnaire de userscripts, au lieu d'heriter du mode strict et des
 * variables internes de ce bundle.
 */
export const loadScript = async (script: ScriptEntry): Promise<void> => {
  const code = await DC.net.text(script.url);

  DC.scripts.setCurrent(script.id);
  try {
    DC.net.run(code, script.url);
  } finally {
    DC.scripts.setCurrent(undefined);
  }

  const definition = DC.scripts.take(script.id);
  if (definition) await DC.scripts.run(definition);
};

export interface LoadOptions {
  scripts: ScriptEntry[];
  enabled: EnabledMap;
  devMode: boolean;
}

/** Scripts a charger dans le contexte courant, dans l'ordre du catalogue. */
export const selectScripts = ({ scripts, enabled, devMode }: LoadOptions): ScriptEntry[] => {
  const context = DC.context.getContext();

  return scripts
    .filter((script) => script.section.includes(context))
    .filter((script) => devMode || !script.experimental)
    .filter((script) => enabled[script.id] === true);
};

/**
 * Charge tous les scripts actifs.
 *
 * Un script en echec ne doit pas empecher les autres de demarrer : chacun est
 * isole dans sa propre promesse.
 */
export const loadAll = async (options: LoadOptions): Promise<void> => {
  await Promise.all(
    selectScripts(options).map(async (script) => {
      try {
        await loadScript(script);
        console.info(`DCSM - Le script '${script.name}' a ete charge.`);
      } catch (error) {
        console.error(`DCSM - Erreur au chargement du script '${script.name}' : ${String(error)}`);
      }
    }),
  );
};
