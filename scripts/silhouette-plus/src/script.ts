// Silhouette+ -- silhouettes personnalisees et disposition de la fiche RP.
//
// Tout passe par des feuilles de style : la silhouette de chaque personnage
// connu, la position de chaque emplacement. Le script ne remplace aucune
// methode du jeu. La version 1.0 enveloppait `Engine.prototype.openPersoBox`
// et rappelait l'original sur le prototype : `this.getIB()` y valait
// `undefined`, et le jeu vidait alors les infobulles de la fiche RP -- dont
// celle de la derniere connexion.

import DC from '@dreadcast/ddk';
import type { ScriptContext, ScriptDefinition } from '@dreadcast/ddk';

import {
  RECIPIENTS,
  REQUEST_SUBJECT,
  openSettingsWindow,
  requestMessage,
} from './settings-window.ts';
import { parseSheet, silhouetteCss, type Self } from './silhouettes.ts';
import { loadState, saveState, type SilhouetteState } from './state.ts';
import { BASE_CSS, layoutCss, layoutSheet } from './style.ts';

/** Identifiant du catalogue, et prefixe du stockage cloisonne. */
export const ID = 'silhouettePlus';

/** Google Sheet public des silhouettes, tenu par les animateurs. */
const SHEET = {
  id: '1Ygt9q6WEU8cR_86GptLpHZ6qLHATfX42R0qcPKaqvqo',
  tab: 'BDD',
  range: 'A:C',
  apiKey: 'AIzaSyCSnNrK0PQMz20JVuUmuO9rl9iSWRHrPm4',
};

interface Runtime {
  storage: ScriptContext['storage'];
  state: SilhouetteState;
  render: (css: string) => void;
}

let runtime: Runtime | undefined;

const self = (): Self => ({
  id: String(engine.getIdPersonnage()),
  name: document.querySelector('#txt_pseudo')?.textContent ?? '',
});

const openWindow = (): void => {
  if (runtime === undefined) return;
  const { storage, state, render } = runtime;

  openSettingsWindow({
    state,
    onChange: () => {
      saveState(storage, state);
      render(layoutCss(state.layout, state.hideShine));
    },
    onRequest: () => {
      const { id, name } = self();
      nav.getMessagerie().newMessage(RECIPIENTS, REQUEST_SUBJECT, requestMessage(name, id));
    },
  });
};

/**
 * Faut-il une entree dans le menu Parametres ?
 *
 * Sous le gestionnaire, c'est son engrenage qui ouvre la fenetre, par
 * `openSettings`. Deux cas y echappent : le script installe seul, et un
 * gestionnaire dont le DDK ne connait pas encore `openSettings` -- sans
 * l'entree de menu, les reglages y seraient inaccessibles.
 */
const needsMenuEntry = (): boolean =>
  Util.isDSM?.() !== true ||
  typeof (DC.scripts as Partial<typeof DC.scripts>).openSettings !== 'function';

const loadSilhouettes = async (context: ScriptContext): Promise<void> => {
  try {
    const rows = await DC.net.loadSpreadsheet(SHEET.id, SHEET.tab, SHEET.range, SHEET.apiKey);
    const index = parseSheet(rows);

    DC.style.apply(silhouetteCss(index, self()), `${ID}-silhouettes`);
    context.log(`${index.byId.size} silhouettes chargees.`);
  } catch (error) {
    context.error('silhouettes indisponibles :', error);
  }
};

export const definition: ScriptDefinition = {
  id: ID,

  async init(context) {
    if (context.context !== 'game') return;

    const state = loadState(context.storage);
    const render = layoutSheet(`${ID}-layout`);

    DC.style.apply(BASE_CSS, `${ID}-base`);
    render(layoutCss(state.layout, state.hideShine));

    runtime = { storage: context.storage, state, render };

    if (needsMenuEntry()) {
      try {
        DC.ui.addSubMenuTo('Paramètres', DC.ui.subMenu('Silhouette+', openWindow), 6);
      } catch (error) {
        context.warn('entree de menu impossible :', error);
      }
    }

    await loadSilhouettes(context);
  },

  openSettings: openWindow,
};
