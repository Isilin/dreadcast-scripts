// Acces a l'API Greasy Fork, partage par tools/greasyfork.ts (la CLI) et
// tools/catalogue-pr.ts (les pull requests de repin).
//
// Attention : sur `update.greasyfork.org`, l'URL
// `/scripts/<id>/<nom>.user.js?version=N` ignore N et sert la derniere
// version. Seule la forme chemin `/scripts/<id>/N/<nom>.user.js` sert la
// revision N. Pour lire le code d'une revision precise, on passe donc par le
// `code_url` de l'API, qui redirige vers cette forme chemin.
//
// N'utilise que la bibliotheque standard. Node execute ce fichier tel quel :
// les types sont effaces, pas compiles.

import { readFile } from 'node:fs/promises';

import type { ScriptEntry } from '../../packages/registry/src/schema.ts';

const API = 'https://api.greasyfork.org/en/scripts';

/** Pause entre deux scripts : cinquante appels d'affilee seraient impolis. */
const CATALOGUE_INTERVAL_MS = 300;

/** Une version publiee, telle que la rend l'API. */
export interface VersionEntry {
  version: string;
  created_at: string;
  url: string;
  code_url: string;
}

/** Script du catalogue epingle sur une revision plus ancienne que la derniere. */
export interface Ecart {
  nom: string;
  id: string;
  scriptId: string;
  /** Version epinglee, ou `revision NNNN` si l'auteur l'a supprimee. */
  de: string;
  vers: string;
  epingleeId: string;
  derniereId: string;
  epingleeLe: string | undefined;
  publieeLe: string;
  catalogueUrl: string;
  doc: string;
  section: readonly string[];
  category: readonly string[];
  versions: VersionEntry[];
}

export interface OutdatedResult {
  ecarts: Ecart[];
  horsGreasyFork: ScriptEntry[];
  erreurs: string[];
  /**
   * Un script dont l'API n'a pas repondu n'est pas « a jour » : l'appelant
   * doit pouvoir faire la difference.
   */
  idsEnErreur: string[];
}

export const sleep = (seconds: number): Promise<void> =>
  new Promise((done) => {
    setTimeout(done, seconds * 1000);
  });

/** Versions publiees, de la plus recente a la plus ancienne. */
export const fetchVersions = async (scriptId: string): Promise<VersionEntry[]> => {
  const response = await fetch(`${API}/${scriptId}/versions.json`);

  if (!response.ok) {
    throw new Error(`${response.status} sur les versions du script ${scriptId}`);
  }

  const versions: unknown = await response.json();

  if (!Array.isArray(versions)) {
    throw new Error(`reponse inattendue pour le script ${scriptId}`);
  }

  return versions as VersionEntry[];
};

/** Derniere version publiee, celle que l'auteur sert aujourd'hui. */
export const latestVersion = (versions: VersionEntry[]): VersionEntry | undefined =>
  versions.reduce<VersionEntry | undefined>(
    (newest, entry) =>
      newest === undefined || Date.parse(entry.created_at) > Date.parse(newest.created_at)
        ? entry
        : newest,
    undefined,
  );

export const pinnedId = (url: string): string | null => {
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
export const scriptIdOf = (url: string): string | undefined => {
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

/** Entree de la liste des versions correspondant a une revision, ou undefined. */
export const versionOf = (versions: VersionEntry[], revision: string): VersionEntry | undefined =>
  versions.find((entry) => pinnedId(entry.code_url) === revision);

/**
 * Code d'une revision precise. Rend undefined si la revision n'est plus
 * publiee : un auteur peut supprimer une revision, c'est ce qui a casse
 * kobsteak.
 */
export const fetchRevision = async (
  versions: VersionEntry[],
  revision: string,
): Promise<string | undefined> => {
  const entry = versionOf(versions, revision);
  if (entry === undefined) return undefined;

  const response = await fetch(entry.code_url, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`${response.status} sur la revision ${revision}`);
  }

  return response.text();
};

/**
 * Compare chaque entree du catalogue a la derniere version publiee par son
 * auteur, et rend les ecarts.
 *
 * Les entrees qui ne sont pas sur Greasy Fork -- celles servies depuis ce depot
 * -- n'ont pas de notion de version : elles sont signalees a part plutot
 * qu'ignorees en silence.
 */
export const outdated = async (file: string): Promise<OutdatedResult> => {
  const catalogue = JSON.parse(await readFile(file, 'utf8')) as ScriptEntry[];
  const result: OutdatedResult = { ecarts: [], horsGreasyFork: [], erreurs: [], idsEnErreur: [] };

  for (const script of catalogue) {
    const scriptId = scriptIdOf(script.url);

    if (scriptId === undefined) {
      result.horsGreasyFork.push(script);
      continue;
    }

    const epingleeId = pinnedId(script.url);

    try {
      const versions = await fetchVersions(scriptId);
      const derniere = latestVersion(versions);

      if (derniere === undefined) {
        result.erreurs.push(`${script.name} : aucune version publiee`);
        result.idsEnErreur.push(script.id);
        continue;
      }

      const derniereId = pinnedId(derniere.code_url);

      if (epingleeId === null) {
        // L'entree suit la derniere version sans l'epingler : rien a signaler,
        // mais rien ne protege non plus d'une mise a jour hostile.
        continue;
      }

      if (derniereId !== null && epingleeId !== derniereId) {
        const actuelle = versionOf(versions, epingleeId);

        result.ecarts.push({
          nom: script.name,
          id: script.id,
          scriptId,
          de: actuelle?.version ?? `revision ${epingleeId}`,
          vers: derniere.version,
          epingleeId,
          derniereId,
          epingleeLe: actuelle?.created_at,
          publieeLe: derniere.created_at,
          catalogueUrl: script.url,
          doc: script.doc,
          section: script.section,
          category: script.category,
          versions,
        });
      }
    } catch (error) {
      result.erreurs.push(`${script.name} : ${String(error)}`);
      result.idsEnErreur.push(script.id);
    }

    await sleep(CATALOGUE_INTERVAL_MS / 1000);
  }

  return result;
};
