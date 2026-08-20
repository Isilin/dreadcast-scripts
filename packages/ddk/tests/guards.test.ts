import { describe, expect, it } from 'vitest';

import * as guards from '../src/guards.ts';

describe('guards', () => {
  it('distingue les types de base comme le faisait $.type', () => {
    expect(guards.isArray([])).toBe(true);
    expect(guards.isArray({})).toBe(false);
    expect(guards.isString('x')).toBe(true);
    expect(guards.isNumber(1)).toBe(true);
    expect(guards.isBoolean(false)).toBe(true);
    expect(guards.isDate(new Date())).toBe(true);
    expect(guards.isRegex(/x/)).toBe(true);
    expect(guards.isError(new Error('x'))).toBe(true);
    // Comme jQuery, un tableau n'est pas un objet.
    expect(guards.isObject({})).toBe(true);
    expect(guards.isObject([])).toBe(false);
  });

  it('accepte null et undefined quand le parametre est optionnel', () => {
    expect(guards.isString(undefined)).toBe(false);
    expect(guards.isString(undefined, true)).toBe(true);
    expect(guards.isString(null, true)).toBe(true);
  });

  it('reconnait les fonctions async, que la version 1 rejetait', () => {
    expect(guards.isFunction(() => undefined)).toBe(true);
    expect(guards.isFunction(async () => undefined)).toBe(true);
  });

  it('valide les couleurs du jeu et les hexadecimaux', () => {
    expect(guards.isColor('rouge')).toBe(true);
    expect(guards.isColor('ababab')).toBe(true);
    expect(guards.isColor('abc')).toBe(true);
    expect(guards.isColor('aabbccdd')).toBe(true);
    expect(guards.isColor('violet')).toBe(false);
    // L'expression d'origine n'etait pas ancree et laissait passer ceci.
    expect(guards.isColor('zzz123456zzz')).toBe(false);
  });

  it('leve un message nomme quand un garde echoue', () => {
    expect(() => guards.guardString('DC.Test', 'label', 42)).toThrowError(
      "DC.Test: le parametre 'label' doit etre une chaine.",
    );
    expect(() => guards.guardString('DC.Test', 'label', undefined, true)).not.toThrow();
  });
});
