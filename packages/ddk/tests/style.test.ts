import { beforeEach, describe, expect, it } from 'vitest';

import { apply } from '../src/style.ts';

beforeEach(() => {
  document.head.replaceChildren();
});

describe('style.apply', () => {
  it("n'injecte qu'une fois une feuille identifiee", () => {
    for (let index = 0; index < 5; index += 1) apply('.a { color: red; }', 'test-a');

    expect(document.querySelectorAll('[data-dc-style="test-a"]')).toHaveLength(1);
  });

  it('marque les feuilles pour les distinguer de celles du jeu', () => {
    apply('.b { color: blue; }', 'test-b');

    // La page du jeu compte des dizaines de <style> : sans marqueur, les notres
    // sont introuvables quand on cherche d'ou vient une regle.
    const node = document.querySelector('[data-dc-style="test-b"]');
    expect(node?.textContent).toContain('color: blue');
  });

  it('injecte sans marqueur quand aucun identifiant n est donne', () => {
    apply('.c { color: green; }');
    apply('.c { color: green; }');

    // Sans identifiant, pas de deduplication possible : c'est l'appelant qui
    // decide, et les deux feuilles sont bien la.
    expect(document.querySelectorAll('style')).toHaveLength(2);
    expect(document.querySelectorAll('[data-dc-style]')).toHaveLength(0);
  });
});
