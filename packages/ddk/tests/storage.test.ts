import { beforeEach, describe, expect, it } from 'vitest';

import { resetStore, snapshot } from '../../../tests/mocks/monkey.ts';
import { init, keys, namespace, remove, set } from '../src/storage.ts';

beforeEach(() => {
  resetStore();
});

describe('storage', () => {
  it('initialise une valeur absente sans ecraser une valeur existante', () => {
    expect(init('cle', 1)).toBe(1);
    expect(init('cle', 2)).toBe(1);
  });

  it('liste et supprime', () => {
    set('a', 1);
    set('b', 2);
    remove('a');

    expect(keys()).toEqual(['b']);
  });
});

describe('storage.namespace', () => {
  it('cloisonne les cles par script', () => {
    namespace('alpha').set('config', 1);
    namespace('beta').set('config', 2);

    expect(namespace('alpha').get('config')).toBe(1);
    expect(namespace('beta').get('config')).toBe(2);
    expect(Object.keys(snapshot())).toEqual(['dcs:alpha:config', 'dcs:beta:config']);
  });

  it('ne liste que ses propres cles, sans le prefixe', () => {
    set('dcsm_list', {});
    namespace('alpha').set('config', 1);

    expect(namespace('alpha').keys()).toEqual(['config']);
  });
});
