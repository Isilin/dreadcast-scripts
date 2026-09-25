import DC from '@dreadcast/ddk';
import { beforeEach, describe, expect, it } from 'vitest';

import { resetStore, snapshot } from '../../../tests/mocks/monkey.ts';
import { readLayout } from '../src/positions.ts';
import { loadState, saveState } from '../src/state.ts';

const storage = () => DC.storage.namespace('silhouettePlus');

beforeEach(() => {
  resetStore();
});

describe('loadState', () => {
  it('part des valeurs par defaut sur une memoire vierge', () => {
    const state = loadState(storage());

    expect(state.hideShine).toBe(false);
    expect(state.layout).toEqual(readLayout(undefined));
    expect(snapshot()).toEqual({});
  });

  it('reprend les reglages de la version 1.0, sans effacer les anciennes cles', () => {
    const legacy = {
      head: { x: '5', y: '1', tag: '.zone_case1', label: 'Tête' },
      chest: { x: '0', y: '21', tag: '.zone_case5', label: 'Buste' },
    };
    resetStore({ sp_position: legacy, sp_shiny_disable: true });

    const state = loadState(storage());

    expect(state.layout['head']).toEqual({ x: 5, y: 1 });
    expect(state.hideShine).toBe(true);
    expect(snapshot()).toEqual({
      sp_position: legacy,
      sp_shiny_disable: true,
      'dcs:silhouettePlus:positions': { head: { x: 5, y: 1 } },
      'dcs:silhouettePlus:hideShine': true,
    });
  });

  it("ne reprend l'ancienne version qu'une fois", () => {
    resetStore({ sp_position: { head: { x: '5', y: '1' } } });
    const state = loadState(storage());

    // Le joueur revient a la position par defaut : elle ne doit pas etre
    // ecrasee par la migration au chargement suivant.
    state.layout['head'] = { x: 0, y: 1 };
    saveState(storage(), state);

    expect(loadState(storage()).layout['head']).toEqual({ x: 0, y: 1 });
  });
});

describe('saveState', () => {
  it("n'enregistre que ce qui differe des valeurs par defaut", () => {
    const state = loadState(storage());
    state.layout['stock'] = { x: 50, y: 50 };
    state.hideShine = true;

    saveState(storage(), state);

    expect(snapshot()).toEqual({
      'dcs:silhouettePlus:positions': { stock: { x: 50, y: 50 } },
      'dcs:silhouettePlus:hideShine': true,
    });
  });
});
