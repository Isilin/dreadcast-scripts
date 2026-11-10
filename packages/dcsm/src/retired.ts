import type { ScriptEntry } from '@dreadcast/registry';

// Pimp My Pion est integre au jeu, meme les anciens caches ne doivent plus le charger.
const RETIRED_IDS = new Set(['pimpmypion']);

export const isRetired = (id: string): boolean => RETIRED_IDS.has(id);

export const withoutRetiredScripts = (scripts: ScriptEntry[]): ScriptEntry[] =>
  scripts.filter((script) => !isRetired(script.id));
