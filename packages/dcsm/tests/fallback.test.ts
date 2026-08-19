import { registrySchema } from '@dreadcast/registry';
import { describe, expect, it } from 'vitest';

import { FALLBACK_LIST } from '../src/fallback.ts';
import { isValidList } from '../src/list.ts';

describe('liste de secours embarquee', () => {
  it('respecte le schema du catalogue', () => {
    // Le fichier est genere depuis data/scripts.json : s'il s'en ecarte, c'est
    // que quelqu'un l'a edite a la main.
    expect(registrySchema.safeParse(FALLBACK_LIST).success).toBe(true);
  });

  it('passe le controle allege du gestionnaire', () => {
    expect(isValidList(FALLBACK_LIST)).toBe(true);
  });
});

describe('isValidList', () => {
  it('est plus permissif que le schema, volontairement', () => {
    // Embarquer le schema complet dans le userscript ajouterait des milliers de
    // lignes de bibliotheque a relire pour les moderateurs de Greasy Fork. Le
    // controle embarque se limite donc au strict necessaire au chargement, et
    // c'est l'integration continue qui fait autorite sur le reste.
    const minimal = [{ id: 'x', url: 'https://x', section: [], category: [] }];

    expect(isValidList(minimal)).toBe(true);
    expect(registrySchema.safeParse(minimal).success).toBe(false);
  });

  it('rejette ce qui rendrait un script inchargeable', () => {
    expect(isValidList([])).toBe(false);
    expect(isValidList({})).toBe(false);
    expect(isValidList([{ id: 'x', section: ['game'], category: ['ui'] }])).toBe(false);
    expect(isValidList([{ id: '', url: 'https://x', section: [], category: [] }])).toBe(false);
  });
});
