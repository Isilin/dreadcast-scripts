// Dreadcast Script Manager — point d'entrée.
//
// Le gestionnaire récupère le catalogue de scripts autorisés, affiche la
// fenêtre « Scripts & Skins » en jeu, et charge les scripts que le joueur a
// activés. Le DDK est fourni par `@require` : il est déjà en mémoire quand ce
// fichier s'exécute.

import DC from '@dreadcast/ddk';

import { resolveList } from './list.ts';
import { loadAll } from './loader.ts';
import * as state from './state.ts';
import { openIntro } from './ui/intro.ts';
import { installMenu } from './ui/manager.ts';

/** Permet à un script de savoir qu'il tourne sous le gestionnaire. */
const markManagedContext = (): void => {
  globalThis.Util.isDSM = () => true;
};

const boot = async (): Promise<void> => {
  markManagedContext();

  const managerState = state.load();

  if (DC.context.isGame() && !managerState.introDisabled) {
    state.markIntroSeen();
    openIntro();
  }

  const { scripts, source, ts } = await resolveList();

  // L'élagage n'a lieu que sur la liste distante : sur une liste dégradée, il
  // effacerait la configuration des scripts qui en sont absents.
  managerState.enabled = state.synchronize(managerState.enabled, scripts, source === 'remote');

  if (DC.context.isGame()) {
    installMenu({ scripts, state: managerState, source, ts });
  }

  if (managerState.allDisabled) return;

  await loadAll({
    scripts,
    enabled: managerState.enabled,
    devMode: managerState.devMode,
  });
};

const start = (): void => {
  boot().catch((error: unknown) => {
    console.error(`DCSM - Démarrage impossible : ${String(error)}`);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
