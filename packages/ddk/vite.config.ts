import { defineUserscript } from '@dreadcast/vite-config';

export default defineUserscript({
  root: import.meta.dirname,
  fileName: 'ddk',
  devPort: 5180,
  userscript: {
    name: 'Dreadcast Development Kit',
    namespace: 'Dreadcast',
    author: 'Pelagia/Isilin',
    description: 'Development kit to ease Dreadcast scripts integration.',
    license: 'https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file',
    match: 'https://www.dreadcast.net/Main',
    grant: [
      'GM_xmlhttpRequest',
      'GM_addStyle',
      'GM_setValue',
      'GM_getValue',
      'GM_deleteValue',
      'GM_listValues',
    ],
    connect: [
      'docs.google.com',
      'googleusercontent.com',
      'sheets.googleapis.com',
      'raw.githubusercontent.com',
    ],
    // Entree Greasy Fork existante : ne pas changer, c'est par la que les
    // installations en place se mettent a jour.
    downloadURL:
      'https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js',
    updateURL: 'https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.meta.js',
  },
});
