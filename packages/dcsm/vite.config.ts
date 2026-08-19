import { defineUserscript } from '@dreadcast/vite-config';

/**
 * Le DDK reste un userscript separe, charge par `@require` et partage avec les
 * scripts que le gestionnaire lance. Il ne doit donc surtout pas etre inclus
 * dans ce bundle : `externalGlobals` fait pointer les imports sur le `DC`
 * global que le DDK installe.
 *
 * A REPINNER apres chaque publication du DDK sur Greasy Fork : le parametre
 * `version` fige la revision utilisee.
 */
const DDK_REQUIRE =
  'https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js?version=1533476';

export default defineUserscript({
  root: import.meta.dirname,
  fileName: 'dcsm',
  devPort: 5181,
  userscript: {
    name: 'Dreadcast Script Manager',
    namespace: 'Dreadcast',
    author: 'Pelagia/Isilin',
    description: 'Centralize all dreadcast scripts in one single source, integrated to the game.',
    license: 'https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file',
    match: [
      'https://www.dreadcast.net/Main',
      'https://www.dreadcast.net/Forum',
      'https://www.dreadcast.net/Forum/*',
      'https://www.dreadcast.net/EDC',
      'https://www.dreadcast.net/EDC/*',
    ],
    require: DDK_REQUIRE,
    grant: [
      'GM_setValue',
      'GM_getValue',
      'GM_deleteValue',
      'GM_listValues',
      'GM_xmlhttpRequest',
      'GM_addStyle',
    ],
    connect: [
      'update.greasyfork.org',
      'docs.google.com',
      'googleusercontent.com',
      'sheets.googleapis.com',
      'raw.githubusercontent.com',
    ],
    downloadURL:
      'https://update.greasyfork.org/scripts/507383/Dreadcast%20Script%20Manager.user.js',
    updateURL: 'https://update.greasyfork.org/scripts/507383/Dreadcast%20Script%20Manager.meta.js',
  },
  externalGlobals: {
    '@dreadcast/ddk': 'DC',
  },
});
