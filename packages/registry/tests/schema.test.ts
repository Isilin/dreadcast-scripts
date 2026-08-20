import { describe, expect, it } from 'vitest';

import { loadRegistry } from '../src/load.ts';
import { registrySchema } from '../src/schema.ts';

describe('catalogue', () => {
  it('data/scripts.json respecte le schema', () => {
    const loaded = loadRegistry();

    expect(loaded.ok ? [] : loaded.errors).toEqual([]);
  });

  it('refuse une categorie inconnue', () => {
    const loaded = loadRegistry();
    if (!loaded.ok) throw new Error(loaded.errors.join(', '));

    const modifie = [{ ...loaded.registry[0]!, category: ['inventee'] }];
    expect(registrySchema.safeParse(modifie).success).toBe(false);
  });

  it('refuse une entree sans identifiant ou sans URL', () => {
    const loaded = loadRegistry();
    if (!loaded.ok) throw new Error(loaded.errors.join(', '));

    const sansId = [{ ...loaded.registry[0]!, id: '' }];
    const sansUrl = [{ ...loaded.registry[0]!, url: '' }];

    expect(registrySchema.safeParse(sansId).success).toBe(false);
    expect(registrySchema.safeParse(sansUrl).success).toBe(false);
  });

  it('accepte une URL vide pour les champs facultatifs', () => {
    const loaded = loadRegistry();
    if (!loaded.ok) throw new Error(loaded.errors.join(', '));

    // `icon`, `doc` et `rp` valent la chaine vide plutot que d'etre absents :
    // c'est la forme historique, que les DCSM installes lisent telle quelle.
    const facultatifs = [{ ...loaded.registry[0]!, icon: '', doc: '', rp: '' }];
    expect(registrySchema.safeParse(facultatifs).success).toBe(true);

    const urlCassee = [{ ...loaded.registry[0]!, doc: 'pas-une-url' }];
    expect(registrySchema.safeParse(urlCassee).success).toBe(false);
  });

  it('refuse un catalogue vide', () => {
    expect(registrySchema.safeParse([]).success).toBe(false);
  });
});
