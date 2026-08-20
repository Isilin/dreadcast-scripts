import { defineUserscript } from '@dreadcast/vite-config';

/**
 * Le DDK reste un userscript separe, charge par `@require` et partage avec les
 * scripts que le gestionnaire lance. Il ne doit donc surtout pas etre inclus
 * dans ce bundle : `externalGlobals` fait pointer les imports sur le `DC`
 * global que le DDK installe.
 *
 * L'hote est `update.greasyfork.org`, celui que Greasy Fork destine aux mises a
 * jour. L'API rend une URL sur `greasyfork.org` : on n'en reprend que
 * l'identifiant de version.
 */
const DDK_SCRIPT_ID = 507382;
const DDK_URL = `https://update.greasyfork.org/scripts/${DDK_SCRIPT_ID}/Dreadcast%20Development%20Kit.user.js`;

/**
 * Revision du DDK utilisee, figee par `?version=`.
 *
 * La chaine de publication la fournit : `tools/greasyfork.mjs` attend que
 * Greasy Fork ait synchronise la version attendue, puis rend son identifiant.
 * La valeur en dur ci-dessous n'est qu'un repli, pour qu'un build local sans
 * variable produise malgre tout un fichier installable -- elle designe la
 * derniere revision publiee a la main.
 */
const DDK_VERSION = process.env['DCSM_DDK_VERSION'] ?? '1907758';

/**
 * Build de verification locale.
 *
 * `DCSM_LOCAL_DDK` doit contenir l'URL du DDK servi en local -- voir
 * `node tools/serve-dist.mjs`. Sans elle, le build est celui de production.
 *
 * L'URL recoit un horodatage : les gestionnaires mettent les `@require` en
 * cache et ne les resollicitent pas au rechargement de la page. Une URL neuve a
 * chaque build est le seul contournement fiable.
 */
const localDdk = process.env['DCSM_LOCAL_DDK'];
const isLocal = localDdk !== undefined && localDdk !== '';

const ddkRequire = isLocal
  ? `${localDdk}${localDdk.includes('?') ? '&' : '?'}t=${Date.now()}`
  : `${DDK_URL}?version=${DDK_VERSION}`;

/**
 * Le build local prend un nom et un namespace distincts : sans cela, il
 * ecraserait l'installation Greasy Fork du joueur, qui l'identifie par ce
 * couple. Il demarre donc aussi sur une memoire vierge, ce qui fait passer la
 * fenetre d'accueil et les valeurs par defaut dans la recette.
 *
 * Il n'a surtout pas d'URL de mise a jour : avec celles de Greasy Fork, le
 * gestionnaire remplacerait tot ou tard le build de test par la version
 * officielle, en pleine recette.
 */
const identity = isLocal
  ? {
      name: 'Dreadcast Script Manager (local)',
      namespace: 'Dreadcast-local',
    }
  : {
      name: 'Dreadcast Script Manager',
      namespace: 'Dreadcast',
      // Entrees Greasy Fork existantes : ne pas changer, c'est par la que les
      // installations en place se mettent a jour.
      downloadURL:
        'https://update.greasyfork.org/scripts/507383/Dreadcast%20Script%20Manager.user.js',
      updateURL:
        'https://update.greasyfork.org/scripts/507383/Dreadcast%20Script%20Manager.meta.js',
    };

export default defineUserscript({
  root: import.meta.dirname,
  fileName: 'dcsm',
  devPort: 5181,
  userscript: {
    ...identity,
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
    require: ddkRequire,
    // `autoGrant` deduit les `@grant` du code de ce bundle. Le DDK en est
    // exclu -- il arrive par `@require` -- donc ce qu'il appelle doit etre
    // declare ici, sinon la fonction reste indefinie dans le bac a sable.
    //
    // Cette liste est aussi la surface exacte que le DDK repasse aux scripts
    // charges : voir `capabilities` dans packages/ddk/src/net.ts.
    grant: [
      'GM_setValue',
      'GM_getValue',
      'GM_deleteValue',
      'GM_listValues',
      'GM_xmlhttpRequest',
      'GM_addStyle',
      // Utilise par le script 'copyterminal' du catalogue, qui n'a donc jamais
      // fonctionne a travers le gestionnaire.
      'GM_setClipboard',
    ],
    connect: [
      'update.greasyfork.org',
      'docs.google.com',
      'googleusercontent.com',
      'sheets.googleapis.com',
      'raw.githubusercontent.com',
    ],
  },
  externalGlobals: {
    '@dreadcast/ddk': 'DC',
  },
});
