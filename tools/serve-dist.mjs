#!/usr/bin/env node
// Sert les userscripts construits, pour les installer dans un gestionnaire sans
// passer par Greasy Fork.
//
//   node tools/serve-dist.mjs [port]
//
// N'utilise que la bibliotheque standard : aucune dependance a installer, et le
// serveur demarre meme sans node_modules.

import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACES = ['packages', 'scripts'].map((nom) => join(ROOT, nom));
const PORT = Number.parseInt(process.argv[2] ?? '8720', 10);

const TYPES = {
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
};

/**
 * Fichiers servis : <espace>/<nom>/dist/<fichier> devient /<fichier>, pour
 * `packages/` comme pour `scripts/`.
 */
const collect = () => {
  const files = new Map();

  for (const workspace of WORKSPACES) {
    if (!existsSync(workspace)) continue;

    for (const pkg of readdirSync(workspace)) {
      const dist = join(workspace, pkg, 'dist');
      if (!existsSync(dist) || !statSync(dist).isDirectory()) continue;

      for (const file of readdirSync(dist)) {
        // Deux paquets ne produisent jamais le meme nom de fichier : le nom de
        // sortie est celui du userscript.
        files.set(`/${file}`, join(dist, file));
      }
    }
  }

  return files;
};

const files = collect();

const SCRIPTS = join(ROOT, 'scripts');
const CATALOGUE = join(ROOT, 'data', 'scripts.json');

/**
 * Scripts de `scripts/` a substituer dans le catalogue : identifiant du
 * catalogue (`dreadcast.catalogueId` de leur package.json) -> fichier servi.
 */
const localScripts = () => {
  const found = new Map();
  if (!existsSync(SCRIPTS)) return found;

  for (const pkg of readdirSync(SCRIPTS)) {
    const manifest = join(SCRIPTS, pkg, 'package.json');
    if (!existsSync(manifest)) continue;

    const id = JSON.parse(readFileSync(manifest, 'utf8')).dreadcast?.catalogueId;
    const dist = join(SCRIPTS, pkg, 'dist');
    const file = [...files.keys()].find(
      (name) => name.endsWith('.user.js') && files.get(name).startsWith(dist),
    );

    if (typeof id === 'string' && file !== undefined) found.set(id, file);
  }

  return found;
};

/**
 * Catalogue de recette : data/scripts.json, ou les scripts de `scripts/`
 * pointent sur leur build local. Sans lui, un gestionnaire local charge ce que
 * sert `main` -- la version publiee, pas celle a verifier. Relu a chaque
 * requete, pour suivre les modifications du catalogue.
 */
const localCatalogue = () => {
  const substitutions = localScripts();

  return JSON.parse(readFileSync(CATALOGUE, 'utf8')).map((entry) =>
    substitutions.has(entry.id)
      ? { ...entry, url: `http://localhost:${PORT}${substitutions.get(entry.id)}` }
      : entry,
  );
};

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

  if (path === '/scripts.json') {
    response.writeHead(200, { 'Content-Type': TYPES['.json'], 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(localCatalogue(), null, 2));
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

  const substitutions = localScripts();

  if (substitutions.size > 0) {
    console.log('  Catalogue de recette, ou ces scripts pointent sur leur build local :');
    for (const [id, file] of substitutions) console.log(`    ${id} -> ${base}${file}`);
    console.log('  Pour que le gestionnaire le lise, ajouter au rebuild :');
    console.log(`    DCSM_LOCAL_LIST=${base}/scripts.json\n`);
  }

  if (files.has('/dcsm.user.js')) {
    console.log('  Userscript a installer (celui-la seulement) :');
    console.log(`    ${base}/dcsm.user.js\n`);
  }

  console.log('  Ctrl+C pour arreter.');
});
