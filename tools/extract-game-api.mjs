#!/usr/bin/env node
// Extrait la surface d'API du jeu depuis le bundle minifie recupere dans
// vendor/, et genere un point de depart pour @dreadcast/game-types.
//
//   node tools/extract-game-api.mjs
//
// Le resultat n'est PAS une source de verite : les signatures sont inconnues et
// sortent en `(...args: any[]) => any`. On affine a la main, dans
// packages/game-types/src/game.d.ts, ce que le DDK et le DCSM utilisent
// vraiment. Ce fichier genere sert de catalogue.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'vendor', 'dreadcast.net', 'ingame.min.4.15.3.js');
const TARGET = join(ROOT, 'packages', 'game-types', 'catalogue', 'ingame-api.d.ts');

// Le jeu etend aussi les prototypes natifs : ces ajouts existent bien, mais ils
// n'ont rien a faire dans une declaration de classe du jeu.
const NATIVES = new Set([
  'Array',
  'Object',
  'String',
  'Number',
  'Date',
  'Function',
  'RegExp',
  'Error',
  'Math',
  'JSON',
]);

// Les noms d'un ou deux caracteres sont des variables locales minifiees, pas des
// classes du jeu.
const isGameClass = (name) => /^[A-Z][A-Za-z0-9_]{2,}$/.test(name) && !NATIVES.has(name);

if (!existsSync(SOURCE)) {
  console.error(
    `extract-game-api: ${SOURCE} est absent.\n` +
      "Le bundle du jeu n'est pas versionne : recuperez-le depuis le navigateur " +
      'et placez-le dans vendor/dreadcast.net/.',
  );
  process.exit(1);
}

const source = readFileSync(SOURCE, 'utf8');

const classes = new Map();
for (const [, name, member] of source.matchAll(
  /\b([A-Za-z_$][A-Za-z0-9_$]*)\.prototype\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=/g,
)) {
  if (!isGameClass(name)) continue;
  if (!classes.has(name)) classes.set(name, new Set());
  classes.get(name).add(member);
}

if (classes.size === 0) {
  console.error('extract-game-api: aucune classe trouvee, le format du bundle a change.');
  process.exit(1);
}

const sorted = [...classes.entries()].sort(([a], [b]) => a.localeCompare(b));

const body = sorted
  .map(([name, members]) => {
    const methods = [...members]
      .sort((a, b) => a.localeCompare(b))
      .map((member) => `  ${member}(...args: any[]): any;`)
      .join('\n');
    return `declare class ${name} {\n${methods}\n}`;
  })
  .join('\n\n');

const header = [
  '/* eslint-disable */',
  '// Genere par tools/extract-game-api.mjs -- ne pas editer a la main.',
  `// Source : vendor/dreadcast.net/${basename(SOURCE)}`,
  `// ${sorted.length} classes, ${sorted.reduce((n, [, m]) => n + m.size, 0)} methodes.`,
  '',
].join('\n');

writeFileSync(TARGET, `${header}\n${body}\n`, 'utf8');

console.log(
  `extract-game-api: ${sorted.length} classes ecrites dans ${TARGET.slice(ROOT.length + 1)}.`,
);
