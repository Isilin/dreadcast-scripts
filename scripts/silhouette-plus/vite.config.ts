import { defineUserscript } from '@dreadcast/vite-config';

/**
 * Le DDK arrive par `@require`, comme pour le gestionnaire : `externalGlobals`
 * fait pointer les imports sur le `DC` global qu'il installe, au lieu de le
 * dupliquer dans ce bundle.
 *
 * Quand le gestionnaire charge ce script, la ligne `@require` n'est qu'un
 * commentaire dans le texte evalue, et `DC` est deja dans le bac a sable. Elle
 * sert a l'installation directe depuis Greasy Fork.
 */
const DDK_URL =
  'https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js';

/**
 * Revision du DDK, figee par `?version=`. La chaine de publication la fournit
 * une fois le DDK synchronise par Greasy Fork ; la valeur en dur n'est qu'un
 * repli pour un build local sans variable. Voir docs/publication.md.
 */
const DDK_VERSION = process.env['SILHOUETTE_PLUS_DDK_VERSION'] ?? '1941660';

/**
 * Build de verification locale : `SILHOUETTE_PLUS_LOCAL_DDK` contient l'URL du
 * DDK servi par `node tools/serve-dist.mjs`. L'horodatage force les
 * gestionnaires a relire un `@require` qu'ils mettent en cache.
 */
const localDdk = process.env['SILHOUETTE_PLUS_LOCAL_DDK'];
const isLocal = localDdk !== undefined && localDdk !== '';

const ddkRequire = isLocal
  ? `${localDdk}${localDdk.includes('?') ? '&' : '?'}t=${Date.now()}`
  : `${DDK_URL}?version=${DDK_VERSION}`;

/**
 * Le build local prend un nom et un namespace distincts, sans URL de mise a
 * jour : sinon il ecraserait l'installation Greasy Fork du joueur, ou serait
 * remplace par elle en pleine recette.
 */
const identity = isLocal
  ? { name: 'Silhouette+ (local)', namespace: 'Dreadcast-local' }
  : {
      name: 'Silhouette+',
      namespace: 'Dreadcast',
      // Fiche Greasy Fork existante : c'est par la que les installations
      // directes se mettent a jour.
      downloadURL: 'https://update.greasyfork.org/scripts/524423/Silhouette%2B.user.js',
      updateURL: 'https://update.greasyfork.org/scripts/524423/Silhouette%2B.meta.js',
    };

export default defineUserscript({
  root: import.meta.dirname,
  fileName: 'silhouette-plus',
  devPort: 5184,
  userscript: {
    ...identity,
    author: 'Pelagia/Isilin',
    description:
      'Personnalise entierement la fiche RP : silhouettes et disposition des emplacements. Reunit SkinSilhouette et ShowSilhouette.',
    license: 'https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file',
    match: 'https://www.dreadcast.net/Main',
    require: ddkRequire,
    // Le DDK est hors du bundle : `autoGrant` ne voit pas ce qu'il appelle.
    // Installe seul, le script doit donc declarer ce dont le DDK a besoin pour
    // lui -- stockage, style, et la requete vers le Google Sheet.
    grant: [
      'GM_addStyle',
      'GM_getValue',
      'GM_setValue',
      'GM_deleteValue',
      'GM_listValues',
      'GM_xmlhttpRequest',
    ],
    connect: ['sheets.googleapis.com'],
  },
  externalGlobals: {
    '@dreadcast/ddk': 'DC',
  },
});
