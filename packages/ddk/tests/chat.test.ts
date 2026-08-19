import { describe, expect, it } from 'vitest';

import { decorate } from '../src/game/chat.ts';

describe('chat.decorate', () => {
  it('imbrique correctement les balises', () => {
    expect(decorate('coucou', { bold: true, italic: true, color: 'ababab' })).toBe(
      '[b][i][c=ababab]coucou[/c][/i][/b]',
    );
  });

  it('ferme le gras avec [/b]', () => {
    // La version 1 fermait avec [b], ce qui laissait la balise ouverte.
    expect(decorate('x', { bold: true })).toBe('[b]x[/b]');
  });

  it('laisse le message intact sans decoration', () => {
    expect(decorate('x', {})).toBe('x');
    expect(decorate('x', { color: '' })).toBe('x');
  });

  it('refuse une couleur invalide', () => {
    expect(() => decorate('x', { color: 'mauve' })).toThrowError(/couleur/);
  });
});
