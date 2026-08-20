#!/usr/bin/env node
// Sert les userscripts construits, pour les installer dans un gestionnaire sans
// passer par Greasy Fork.
//
//   node tools/serve-dist.mjs [port]
//
// N'utilise que la bibliotheque standard : aucune dependance a installer, et le
// serveur demarre meme sans node_modules.

import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGES = join(ROOT, 'packages');
const PORT = Number.parseInt(process.argv[2] ?? '8720', 10);

const TYPES = {
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
};

/** Fichiers servis : packages/<nom>/dist/<fichier> devient /<fichier>. */
const collect = () => {
  const files = new Map();

  if (!existsSync(PACKAGES)) return files;

  for (const pkg of readdirSync(PACKAGES)) {
    const dist = join(PACKAGES, pkg, 'dist');
    if (!existsSync(dist) || !statSync(dist).isDirectory()) continue;

    for (const file of readdirSync(dist)) {
      // Deux paquets ne produisent jamais le meme nom de fichier : le nom de
      // sortie est celui du userscript.
      files.set(`/${file}`, join(dist, file));
    }
  }

  return files;
};

const files = collect();

if (files.size === 0) {
  console.error("serve-dist: aucun fichier construit. Lancer 'vp run -r build' d'abord.");
  process.exit(1);
}

const server = createServer((request, response) => {
  const path = new URL(request.url ?? '/', `http://localhost:${PORT}`).pathname;

  if (path === '/') {
    const index = [...files.keys()].map((name) => `  ${name}`).join('\n');
    response.writeHead(200, { 'Content-Type': TYPES['.html'] });
    response.end(`<pre>Userscripts disponibles :\n\n${index}\n</pre>`);
    return;
  }

  const file = files.get(path);

  if (file === undefined) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('introuvable');
    return;
  }

  response.writeHead(200, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    // Les gestionnaires mettent les `@require` en cache de leur cote ; cet
    // en-tete evite au moins que le navigateur en rajoute une couche.
    'Cache-Control': 'no-store',
  });

  createReadStream(file).pipe(response);
});

server.listen(PORT, '127.0.0.1', () => {
  const base = `http://localhost:${PORT}`;

  console.log(`serve-dist: ${files.size} fichier(s) sur ${base}\n`);

  if (files.has('/ddk.user.js')) {
    console.log('  Rebuild du gestionnaire avec ce DDK :');
    console.log(`    DCSM_LOCAL_DDK=${base}/ddk.user.js vp run -r build\n`);
    console.log('  PowerShell :');
    console.log(`    $env:DCSM_LOCAL_DDK='${base}/ddk.user.js'; vp run -r build\n`);
  }

  if (files.has('/dcsm.user.js')) {
    console.log('  Userscript a installer (celui-la seulement) :');
    console.log(`    ${base}/dcsm.user.js\n`);
  }

  console.log('  Ctrl+C pour arreter.');
});
