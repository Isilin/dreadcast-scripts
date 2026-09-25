import { describe, expect, it } from 'vitest';

import { SLOTS, overridesOf, parseCoordinate, readLayout } from '../src/positions.ts';

describe('parseCoordinate', () => {
  it('accepte les nombres et les chaines numeriques de la version 1.0', () => {
    expect(parseCoordinate(12)).toBe(12);
    expect(parseCoordinate('-1850')).toBe(-1850);
    expect(parseCoordinate('12.5')).toBe(12.5);
  });

  it('rejette le vide, le texte et les non-finis', () => {
    expect(parseCoordinate('')).toBeUndefined();
    expect(parseCoordinate('  ')).toBeUndefined();
    expect(parseCoordinate('abc')).toBeUndefined();
    expect(parseCoordinate(Number.NaN)).toBeUndefined();
    expect(parseCoordinate(Number.POSITIVE_INFINITY)).toBeUndefined();
    expect(parseCoordinate(null)).toBeUndefined();
  });
});

describe('readLayout', () => {
  it('rend les valeurs par defaut sans rien de stocke', () => {
    const layout = readLayout(undefined);

    expect(Object.keys(layout)).toEqual(SLOTS.map((slot) => slot.key));
    expect(layout['head']).toEqual({ x: 0, y: 1 });
    expect(layout['rp1']).toEqual({ x: 0, y: -1850 });
  });

  it('reprend la forme de la version 1.0 : x et y en chaines, tag et label ignores', () => {
    const layout = readLayout({
      head: { x: '5', y: '3', tag: '.autre_selecteur', label: 'Autre' },
      stock: { x: '90', y: '80', tag: '#stockInventaire', label: 'Stock' },
    });

    expect(layout['head']).toEqual({ x: 5, y: 3 });
    expect(layout['stock']).toEqual({ x: 90, y: 80 });
    expect(layout['chest']).toEqual({ x: 0, y: 21 });
  });

  it('ignore les cles inconnues et retombe sur le defaut pour un axe invalide', () => {
    const layout = readLayout({
      inconnu: { x: 1, y: 2 },
      head: { x: 'abc', y: 7 },
      feet: 'pas un objet',
    });

    expect(layout).not.toHaveProperty('inconnu');
    expect(layout['head']).toEqual({ x: 0, y: 7 });
    expect(layout['feet']).toEqual({ x: 0, y: 61 });
  });
});

describe('overridesOf', () => {
  it('ne garde que ce qui differe des valeurs par defaut', () => {
    const layout = readLayout({ head: { x: 5, y: 1 }, chest: { x: 0, y: 21 } });

    expect(overridesOf(layout)).toEqual({ head: { x: 5, y: 1 } });
  });

  it('rend un objet vide pour la disposition par defaut', () => {
    expect(overridesOf(readLayout(undefined))).toEqual({});
  });
});
