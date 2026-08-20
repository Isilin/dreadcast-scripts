#!/usr/bin/env node
// Interroge l'API Greasy Fork pour retrouver l'URL epinglee d'une version
// publiee.
//
//   node tools/greasyfork.mjs resolve <scriptId> <version>
//   node tools/greasyfork.mjs wait    <scriptId> <version> [--timeout=900] [--interval=20]
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
// N'utilise que la bibliotheque standard.

const API = 'https://api.greasyfork.org/en/scripts';

const fail = (message) => {
  console.error(`greasyfork: ${message}`);
  process.exit(1);
};

const flag = (name, fallback) => {
  const found = process.argv.find((argument) => argument.startsWith(`--${name}=`));
  if (found === undefined) return fallback;

  const value = Number.parseInt(found.slice(name.length + 3), 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

/** Versions publiees, de la plus recente a la plus ancienne. */
const fetchVersions = async (scriptId) => {
  const response = await fetch(`${API}/${scriptId}/versions.json`);

  if (!response.ok) {
    throw new Error(`${response.status} sur les versions du script ${scriptId}`);
  }

  const versions = await response.json();

  if (!Array.isArray(versions)) {
    throw new Error(`reponse inattendue pour le script ${scriptId}`);
  }

  return versions;
};

/**
 * Identifiant numerique de la version demandee, ou undefined si elle n'est pas
 * publiee.
 */
const resolve = async (scriptId, version) => {
  const match = (await fetchVersions(scriptId)).find((entry) => entry?.version === version);

  if (typeof match?.code_url !== 'string') return undefined;

  const id = new URL(match.code_url).searchParams.get('version');

  if (id === null) {
    throw new Error(`la version ${version} du script ${scriptId} n'est pas epinglable`);
  }

  return id;
};

const sleep = (seconds) =>
  new Promise((done) => {
    setTimeout(done, seconds * 1000);
  });

const [, , command, scriptId, version] = process.argv;

if (command !== 'resolve' && command !== 'wait') {
  fail(`commande inconnue '${command ?? ''}'. Attendu : resolve | wait.`);
}

if (!scriptId || !version) {
  fail(`usage : node tools/greasyfork.mjs ${command} <scriptId> <version>`);
}

if (command === 'resolve') {
  const id = await resolve(scriptId, version).catch((error) => fail(String(error)));

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
  const id = await resolve(scriptId, version).catch((error) => {
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
