import { beforeEach, describe, expect, it } from 'vitest';

import { resetStore, snapshot } from '../../../tests/mocks/monkey.ts';
import type { ScriptEntry } from '@dreadcast/registry';
import { KEYS, exportConfig, importConfig, load, synchronize } from '../src/state.ts';

const entry = (id: string): ScriptEntry => ({
  id,
  name: id,
  description: '',
  authors: '',
  icon: '',
  url: `https://example.test/${id}.user.js`,
  doc: '',
  rp: '',
  contact: '',
  settings: false,
  section: ['game'],
  category: ['ui'],
  experimental: false,
});

beforeEach(() => {
  resetStore();
});

describe('state.load', () => {
  it('pose les valeurs par defaut au premier demarrage', () => {
    expect(load()).toEqual({
      enabled: {},
      allDisabled: false,
      introDisabled: false,
      devMode: false,
    });
  });

  it('reprend la configuration de l ancien prefixe dcm_', () => {
    resetStore({ dcm_list: { comback: true }, dcm_all_disabled: true });

    const state = load();

    expect(state.enabled).toEqual({ comback: true });
    expect(state.allDisabled).toBe(true);
    expect(Object.keys(snapshot())).not.toContain('dcm_list');
  });
});

describe('state.synchronize', () => {
  it('ajoute les nouveaux scripts, desactives', () => {
    expect(synchronize({ a: true }, [entry('a'), entry('b')], true)).toEqual({
      a: true,
      b: false,
    });
  });

  it('retire les scripts disparus quand la liste vient de la source distante', () => {
    expect(synchronize({ a: true, parti: true }, [entry('a')], true)).toEqual({
      a: true,
    });
  });

  it('conserve la configuration inconnue sur une liste degradee', () => {
    // Sans cette garantie, une source injoignable effacerait l activation de
    // tous les scripts absents du cache ou de la liste embarquee.
    expect(synchronize({ a: true, absent: true }, [entry('a')], false)).toEqual({
      a: true,
      absent: true,
    });
  });

  it('ecrit le resultat en memoire persistante', () => {
    synchronize({}, [entry('a')], true);

    expect(snapshot()[KEYS.enabled]).toEqual({ a: false });
  });
});

describe('state import/export', () => {
  it('exclut le cache de la liste dans les deux sens', () => {
    resetStore({
      [KEYS.enabled]: { a: true },
      [KEYS.cache]: { ts: 1, scripts: [] },
    });

    const exported = exportConfig();
    expect(Object.keys(exported)).not.toContain(KEYS.cache);

    resetStore();
    importConfig({ ...exported, [KEYS.cache]: { ts: 999, scripts: [] } });

    expect(Object.keys(snapshot())).not.toContain(KEYS.cache);
    expect(snapshot()[KEYS.enabled]).toEqual({ a: true });
  });
});
