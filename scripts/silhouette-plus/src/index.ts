// Point d'entree : declare Silhouette+ aupres du gestionnaire.
//
// Sous le gestionnaire, c'est lui qui appelle `init`, et son engrenage qui
// ouvre les reglages. Installe seul depuis Greasy Fork -- ou en build local
// --, personne ne le ferait : le script demarre alors par le meme chemin que
// le gestionnaire emprunterait.

import DC from '@dreadcast/ddk';

import { ID, definition } from './script.ts';

DC.registerScript(definition);

if (Util.isDSM?.() !== true) {
  const start = (): void => {
    const registration = DC.scripts.take(ID);
    if (registration === undefined) return;

    DC.scripts.run(registration).catch((error: unknown) => {
      console.error('Silhouette+ - demarrage impossible :', error);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}
