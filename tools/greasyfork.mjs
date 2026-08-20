#!/usr/bin/env node
// Interroge l'API Greasy Fork pour retrouver l'URL epinglee d'une version
// publiee.
//
//   node tools/greasyfork.mjs resolve  <scriptId> <version>
//   node tools/greasyfork.mjs wait     <scriptId> <version> [--timeout=900] [--interval=20]
//   node tools/greasyfork.mjs outdated [catalogue]
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
// n'atteint jamais les joueurs, et rien ne le signale.
//
// N'utilise que la bibliotheque standard.

import { readFile } from 'node:fs/promises';

const API = 'https://api.greasyfork.org/en/scripts';

/** Pause entre deux scripts : cinquante appels d'affilee seraient impolis. */
const CATALOGUE_INTERVAL_MS = 300;

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

/** Derniere version publiee, celle que l'auteur sert aujourd'hui. */
const latestVersion = (versions) =>
  versions.reduce(
    (newest, entry) =>
      newest === undefined || Date.parse(entry.created_at) > Date.parse(newest.created_at)
        ? entry
        : newest,
    undefined,
  );

const pinnedId = (url) => {
  try {
    return new URL(url).searchParams.get('version');
  } catch {
    return null;
  }
};

/**
 * Identifiant du script Greasy Fork porte par une URL, ou undefined.
 *
 * Deux formes cohabitent dans le catalogue, et il faut les couvrir toutes deux :
 *   /scripts/17200/Com'back.user.js
 *   /scripts/530389-dc-deckexportdata.user.js
 */
const scriptIdOf = (url) => {
  try {
    const { hostname, pathname } = new URL(url);
    if (!hostname.endsWith('greasyfork.org')) return undefined;

    const [, section, segment] = pathname.split('/');
    if (section !== 'scripts') return undefined;

    return /^([0-9]+)/.exec(segment ?? '')?.[1];
  } catch {
    return undefined;
  }
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

/**
 * Compare chaque entree du catalogue a la derniere version publiee par son
 * auteur, et rend les ecarts.
 *
 * Les entrees qui ne sont pas sur Greasy Fork -- celles servies depuis ce depot
 * -- n'ont pas de notion de version : elles sont signalees a part plutot
 * qu'ignorees en silence.
 */
const outdated = async (file) => {
  const catalogue = JSON.parse(await readFile(file, 'utf8'));
  const ecarts = [];
  const horsGreasyFork = [];
  const erreurs = [];

  for (const script of catalogue) {
    const id = scriptIdOf(script.url);

    if (id === undefined) {
      horsGreasyFork.push(script);
      continue;
    }

    const epinglee = pinnedId(script.url);

    try {
      const versions = await fetchVersions(id);
      const derniere = latestVersion(versions);

      if (derniere === undefined) {
        erreurs.push(`${script.name} : aucune version publiee`);
        continue;
      }

      const derniereId = pinnedId(derniere.code_url);

      if (epinglee === null) {
        // L'entree suit la derniere version sans l'epingler : rien a signaler,
        // mais rien ne protege non plus d'une mise a jour hostile.
        continue;
      }

      if (epinglee !== derniereId) {
        const actuelle =
          versions.find((entry) => pinnedId(entry.code_url) === epinglee)?.version ??
          `revision ${epinglee}`;

        ecarts.push({
          nom: script.name,
          id: script.id,
          de: actuelle,
          vers: derniere.version,
          url: derniere.code_url,
        });
      }
    } catch (error) {
      erreurs.push(`${script.name} : ${String(error)}`);
    }

    await sleep(CATALOGUE_INTERVAL_MS / 1000);
  }

  return { ecarts, horsGreasyFork, erreurs };
};

const [, , command, scriptId, version] = process.argv;

if (command !== 'resolve' && command !== 'wait' && command !== 'outdated') {
  fail(`commande inconnue '${command ?? ''}'. Attendu : resolve | wait | outdated.`);
}

if (command === 'outdated') {
  const { ecarts, horsGreasyFork, erreurs } = await outdated(scriptId ?? 'data/scripts.json').catch(
    (error) => fail(String(error)),
  );

  for (const { nom, id, de, vers } of ecarts) {
    console.log(`- **${nom}** (\`${id}\`) : ${de} -> ${vers}`);
  }

  console.error(
    `greasyfork: ${ecarts.length} script(s) en retard, ` +
      `${horsGreasyFork.length} hors Greasy Fork, ${erreurs.length} en erreur.`,
  );

  for (const erreur of erreurs) console.error(`greasyfork: ${erreur}`);

  process.exit(0);
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
