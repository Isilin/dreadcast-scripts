#!/usr/bin/env node
// Interroge l'API Greasy Fork pour retrouver l'URL epinglee d'une version
// publiee.
//
//   node tools/greasyfork.ts resolve  <scriptId> <version>
//   node tools/greasyfork.ts wait     <scriptId> <version> [--timeout=900] [--interval=20]
//   node tools/greasyfork.ts outdated [catalogue] [--json]
//
// Les deux impriment l'identifiant numerique de version, celui qui sert de
// `?version=NNNN` dans une URL de mise a jour. On rend cet identifiant plutot
// que l'URL complete de l'API : celle-ci pointe sur `greasyfork.org`, alors que
// les `@require` doivent viser `update.greasyfork.org`, l'hote prevu pour les
// mises a jour. L'appelant reconstruit donc l'URL a partir de la forme deja
// eprouvee en production.
//
// `wait` fait la meme chose en boucle : apres un push, Greasy Fork met un
// moment a synchroniser, et le gestionnaire ne doit surtout pas etre epingle
// sur la version precedente du DDK. Le delai expire en erreur, jamais en
// silence.
//
// `outdated` compare, pour chaque entree du catalogue, la revision epinglee a
// la derniere publiee par son auteur. Les URL du catalogue portent un
// `?version=NNNN` : sans cette veille, la correction qu'un auteur tiers publie
// n'atteint jamais les joueurs, et rien ne le signale. `--json` rend les ecarts
// sous une forme lisible par un autre outil (voir tools/catalogue-pr.ts).
//
// N'utilise que la bibliotheque standard. Node execute ce fichier tel quel :
// pas d'installation, pas de compilation.

import { fetchVersions, outdated, pinnedId, sleep } from './lib/greasyfork.ts';

function fail(message: string): never {
  console.error(`greasyfork: ${message}`);
  process.exit(1);
}

const flag = (name: string, fallback: number): number => {
  const found = process.argv.find((argument) => argument.startsWith(`--${name}=`));
  if (found === undefined) return fallback;

  const value = Number.parseInt(found.slice(name.length + 3), 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

/**
 * Identifiant numerique de la version demandee, ou undefined si elle n'est pas
 * publiee.
 */
const resolve = async (scriptId: string, version: string): Promise<string | undefined> => {
  const match = (await fetchVersions(scriptId)).find((entry) => entry.version === version);

  if (typeof match?.code_url !== 'string') return undefined;

  const id = pinnedId(match.code_url);

  if (id === null) {
    throw new Error(`la version ${version} du script ${scriptId} n'est pas epinglable`);
  }

  return id;
};

const [command, scriptId, version] = process.argv
  .slice(2)
  .filter((argument) => !argument.startsWith('--'));

if (command !== 'resolve' && command !== 'wait' && command !== 'outdated') {
  fail(`commande inconnue '${command ?? ''}'. Attendu : resolve | wait | outdated.`);
}

if (command === 'outdated') {
  const { ecarts, horsGreasyFork, erreurs } = await outdated(scriptId ?? 'data/scripts.json').catch(
    (error: unknown) => fail(String(error)),
  );

  if (process.argv.includes('--json')) {
    // La liste complete des versions de chaque script ne sert qu'en interne.
    const lisibles = ecarts.map(({ versions: _versions, ...ecart }) => ecart);
    console.log(
      JSON.stringify({ ecarts: lisibles, horsGreasyFork: horsGreasyFork.length, erreurs }),
    );
  } else {
    for (const { nom, id, de, vers } of ecarts) {
      console.log(`- **${nom}** (\`${id}\`) : ${de} -> ${vers}`);
    }
  }

  console.error(
    `greasyfork: ${ecarts.length} script(s) en retard, ` +
      `${horsGreasyFork.length} hors Greasy Fork, ${erreurs.length} en erreur.`,
  );

  for (const erreur of erreurs) console.error(`greasyfork: ${erreur}`);

  process.exit(0);
}

if (!scriptId || !version) {
  fail(`usage : node tools/greasyfork.ts ${command} <scriptId> <version>`);
}

if (command === 'resolve') {
  const id = await resolve(scriptId, version).catch((error: unknown) => fail(String(error)));

  if (id === undefined) {
    fail(`la version ${version} du script ${scriptId} n'est pas publiee.`);
  }

  console.log(id);
  process.exit(0);
}

const timeout = flag('timeout', 900);
const interval = flag('interval', 20);
const deadline = Date.now() + timeout * 1000;

console.error(
  `greasyfork: attente de la version ${version} du script ${scriptId} (${timeout} s max).`,
);

for (;;) {
  // Une erreur reseau ponctuelle ne doit pas interrompre l'attente : seul le
  // delai maximal decide.
  const id = await resolve(scriptId, version).catch((error: unknown) => {
    console.error(`greasyfork: tentative en echec, on reessaie (${String(error)}).`);
    return undefined;
  });

  if (id !== undefined) {
    console.error(`greasyfork: version ${version} synchronisee (id ${id}).`);
    console.log(id);
    process.exit(0);
  }

  if (Date.now() >= deadline) {
    fail(
      `la version ${version} du script ${scriptId} n'est toujours pas publiee ` +
        `apres ${timeout} s. Verifier la synchronisation Greasy Fork ` +
        '(docs/publication.md).',
    );
  }

  await sleep(interval);
}
