import { readFileSync } from 'node:fs';

import { registrySchema, type Registry } from './schema.ts';
import { REGISTRY_FILE } from './paths.ts';

export interface LoadFailure {
  ok: false;
  errors: string[];
}

export interface LoadSuccess {
  ok: true;
  registry: Registry;
}

/** Lit et valide le catalogue. Ne leve pas : les erreurs sont renvoyees. */
export const loadRegistry = (file = REGISTRY_FILE): LoadSuccess | LoadFailure => {
  let raw: unknown;

  try {
    raw = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    return {
      ok: false,
      errors: [`${file} est illisible ou n'est pas du JSON valide : ${String(error)}`],
    };
  }

  const parsed = registrySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => {
        const path = issue.path.join('.');
        return `${path === '' ? '(racine)' : path} : ${issue.message}`;
      }),
    };
  }

  const seen = new Set<string>();
  const duplicates = parsed.data
    .map((script) => script.id)
    .filter((id) => (seen.has(id) ? true : (seen.add(id), false)));

  if (duplicates.length > 0) {
    return {
      ok: false,
      errors: [`identifiants en double : ${[...new Set(duplicates)].join(', ')}`],
    };
  }

  return { ok: true, registry: parsed.data };
};
