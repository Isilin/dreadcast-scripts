#!/usr/bin/env node
// Verifie que `published/` correspond bien a ce que le build produit.
//
//   node tools/check-published.mjs [--offline]
//
// `published/` est ce que Greasy Fork sert aux joueurs. Rien d'autre ne garde ce
// dossier : une retouche a la main, ou un rebuild oublie apres une modification
// de source, donnerait un fichier distribue qui ne correspond a aucun code du
// depot.
//
// Trois controles :
//
// 1. contenu identique au build, a une exception pres -- le `@require` du
//    gestionnaire porte l'identifiant de revision du DDK, injecte au moment de
//    la publication, qu'un build d'integration ne peut pas deviner ;
// 2. `@version` du fichier publie egal a celui du package.json, ce qui attrape
//    le rebuild oublie apres un increment ;
// 3. revision du DDK epinglee effectivement publiee sur Greasy Fork -- c'est
//    exactement le defaut qui a livre un gestionnaire 1.5.0 inutilisable.
//
// Le troisieme controle demande le reseau. Une panne de joignabilite avertit
// sans faire echouer ; seule une reponse formelle -- la revision n'existe pas --
// est une erreur.

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLISHED = join(ROOT, 'published');
const DDK_SCRIPT_ID = 507382;

const ARTEFACTS = [
  { paquet: 'ddk', fichiers: ['ddk.user.js', 'ddk.meta.js'] },
  { paquet: 'dcsm', fichiers: ['dcsm.user.js', 'dcsm.meta.js'] },
];

const erreurs = [];

/** Le `@require` est injecte a la publication : il ne peut pas etre compare. */
const comparable = (contenu) =>
  contenu
    .split('\n')
    .filter((ligne) => !ligne.startsWith('// @require'))
    .join('\n');

const premiereDifference = (attendu, obtenu) => {
  const a = attendu.split('\n');
  const b = obtenu.split('\n');

  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    if (a[index] !== b[index]) {
      // Echappe le contenu : une difference de fin de ligne serait invisible
      // autrement, et `published/` doit rester au bit pres ce qui est servi.
      const montre = (ligne) => (ligne === undefined ? '(fin de fichier)' : JSON.stringify(ligne));

      return `ligne ${index + 1}\n    build     : ${montre(a[index])}\n    published : ${montre(b[index])}`;
    }
  }

  return 'longueurs differentes';
};

const lire = async (chemin) => {
  try {
    return await readFile(chemin, 'utf8');
  } catch {
    return undefined;
  }
};

for (const { paquet, fichiers } of ARTEFACTS) {
  const manifeste = JSON.parse(
    await readFile(join(ROOT, 'packages', paquet, 'package.json'), 'utf8'),
  );

  for (const fichier of fichiers) {
    const construit = await lire(join(ROOT, 'packages', paquet, 'dist', fichier));
    const publie = await lire(join(PUBLISHED, fichier));

    if (construit === undefined) {
      erreurs.push(`packages/${paquet}/dist/${fichier} est absent : lancer 'vp run -r build'.`);
      continue;
    }

    if (publie === undefined) {
      erreurs.push(`published/${fichier} est absent.`);
      continue;
    }

    if (comparable(construit) !== comparable(publie)) {
      erreurs.push(
        `published/${fichier} differe du build : ${premiereDifference(comparable(construit), comparable(publie))}`,
      );
      continue;
    }

    const version = /^\/\/ @version\s+(\S+)/m.exec(publie)?.[1];

    if (version !== manifeste.version) {
      erreurs.push(
        `published/${fichier} annonce la version ${version ?? '(absente)'}, ` +
          `alors que packages/${paquet}/package.json est en ${manifeste.version}.`,
      );
    }
  }
}

if (!process.argv.includes('--offline')) {
  const publie = (await lire(join(PUBLISHED, 'dcsm.user.js'))) ?? '';
  const epinglee = /^\/\/ @require\s+\S*[?&]version=([0-9]+)/m.exec(publie)?.[1];

  if (epinglee === undefined) {
    erreurs.push("published/dcsm.user.js n'epingle aucune revision du DDK.");
  } else {
    try {
      const reponse = await fetch(
        `https://api.greasyfork.org/en/scripts/${DDK_SCRIPT_ID}/versions.json`,
      );

      if (!reponse.ok) throw new Error(`statut ${reponse.status}`);

      const versions = await reponse.json();
      const connue = versions.some(
        (entree) => new URL(entree.code_url).searchParams.get('version') === epinglee,
      );

      if (!connue) {
        erreurs.push(
          `la revision ${epinglee} epinglee par published/dcsm.user.js n'est pas ` +
            `publiee pour le DDK : le gestionnaire chargerait une bibliotheque inexistante.`,
        );
      }
    } catch (error) {
      // Injoignable n'est pas invalide.
      console.warn(`check-published: revision du DDK non verifiee (${String(error)}).`);
    }
  }
}

if (erreurs.length > 0) {
  console.error('check-published: published/ ne correspond pas au build.\n');
  for (const erreur of erreurs) console.error(`  - ${erreur}`);
  console.error("\nRelancer 'vp run -r build' puis recopier dans published/.");
  process.exit(1);
}

console.log('check-published: published/ correspond au build.');
