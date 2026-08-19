#!/usr/bin/env node
// Outillage du catalogue de scripts.
//
//   node src/cli.ts check   valide data/scripts.json et signale toute derive
//                           de la liste de secours (utilise en integration)
//   node src/cli.ts sync    regenere la liste de secours

import { readFallback, renderFallback, writeFallback } from './fallback.ts';
import { loadRegistry } from './load.ts';

const command = process.argv[2] ?? 'check';

if (command !== 'check' && command !== 'sync') {
  console.error(`dc-registry: commande inconnue '${command}'. Attendu : check | sync.`);
  process.exit(2);
}

const loaded = loadRegistry();

if (!loaded.ok) {
  console.error('dc-registry: data/scripts.json est invalide.');
  for (const error of loaded.errors) console.error(`  - ${error}`);
  process.exit(1);
}

const { registry } = loaded;
const expected = renderFallback(registry);
const actual = readFallback();

if (actual === expected) {
  console.log(
    `dc-registry: catalogue valide, liste de secours a jour (${registry.length} scripts).`,
  );
  process.exit(0);
}

if (command === 'check') {
  console.error(
    "dc-registry: la liste de secours a derive de data/scripts.json. Lancer 'pnpm registry:sync'.",
  );
  process.exit(1);
}

writeFallback(expected);
console.log(`dc-registry: liste de secours regeneree (${registry.length} scripts).`);
