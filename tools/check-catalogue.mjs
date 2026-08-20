#!/usr/bin/env node
// Verifie que chaque script du catalogue repond encore.
//
//   node tools/check-catalogue.mjs [catalogue]
//
// Un script retire de Greasy Fork, ou dont l'auteur a supprime la revision
// epinglee, casse en silence chez les joueurs qui l'avaient active : le
// gestionnaire signale l'echec en console, et personne ne le lit. Ce controle
// tourne une fois par semaine.
//
// N'echoue jamais : il imprime ce qu'il trouve, et c'est l'appelant qui decide
// quoi en faire. Un controle qui rougit toutes les semaines finit ignore.
//
// N'utilise que la bibliotheque standard.

import { readFile } from 'node:fs/promises';

/** Cinquante requetes d'affilee sur le meme hote seraient impolies. */
const INTERVAL_MS = 300;
const TIMEOUT_MS = 15_000;

const sleep = (ms) =>
  new Promise((done) => {
    setTimeout(done, ms);
  });

/**
 * Etat d'une URL.
 *
 * On demande le fichier en GET et non en HEAD : Greasy Fork sert les
 * userscripts par une redirection que tous les hotes ne traitent pas de la
 * meme facon en HEAD, et un 405 ne dirait rien de la disponibilite reelle.
 */
const verifier = async (url) => {
  const abandon = AbortSignal.timeout(TIMEOUT_MS);

  try {
    const reponse = await fetch(url, { signal: abandon, redirect: 'follow' });

    if (!reponse.ok) return `HTTP ${reponse.status}`;

    const corps = await reponse.text();

    // Une reponse vide, ou une page d'erreur HTML servie en 200, ne fait pas un
    // userscript chargeable.
    if (corps.trim() === '') return 'reponse vide';
    if (/^\s*<(!doctype|html)/i.test(corps)) return 'page HTML au lieu du script';

    return undefined;
  } catch (error) {
    return String(error instanceof Error ? error.message : error);
  }
};

const fichier = process.argv[2] ?? 'data/scripts.json';
const catalogue = JSON.parse(await readFile(fichier, 'utf8'));
const injoignables = [];

for (const script of catalogue) {
  const probleme = await verifier(script.url);

  if (probleme !== undefined) {
    injoignables.push({ nom: script.name, id: script.id, probleme });
  }

  await sleep(INTERVAL_MS);
}

for (const { nom, id, probleme } of injoignables) {
  console.log(`- **${nom}** (\`${id}\`) : ${probleme}`);
}

console.error(
  `check-catalogue: ${catalogue.length} script(s) verifie(s), ` +
    `${injoignables.length} injoignable(s).`,
);
