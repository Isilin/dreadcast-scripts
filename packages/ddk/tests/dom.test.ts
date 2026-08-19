import { describe, expect, it, vi } from 'vitest';

import { delegate, escapeHtml, frag, h, insertAt, on, parse } from '../src/dom.ts';

describe('dom.h', () => {
  it('pose attributs, styles et enfants', () => {
    const node = h(
      'div',
      { id: 'x', class: 'y', style: { color: 'red' }, dataset: { role: 'test' } },
      'texte',
      h('span', null, '!'),
    );

    expect(node.id).toBe('x');
    expect(node.className).toBe('y');
    expect(node.style.color).toBe('red');
    expect(node.dataset['role']).toBe('test');
    expect(node.textContent).toBe('texte!');
  });

  it('ignore les enfants et attributs vides', () => {
    const node = h('div', { title: false, id: null }, null, undefined, false, 'ok');

    expect(node.hasAttribute('title')).toBe(false);
    expect(node.hasAttribute('id')).toBe(false);
    expect(node.textContent).toBe('ok');
  });

  it('interprete `html` comme du balisage', () => {
    expect(h('div', { html: '<b>gras</b>' }).querySelector('b')).not.toBeNull();
  });

  it('refuse un attribut non primitif plutot que d ecrire [object Object]', () => {
    expect(() => h('div', { title: { a: 1 } })).toThrowError(/primitive/);
  });
});

describe('dom.insertAt', () => {
  it('insere a la position demandee', () => {
    const parent = h('ul', null, h('li', null, 'a'), h('li', null, 'c'));
    insertAt(parent, 1, h('li', null, 'b'));

    expect(parent.textContent).toBe('abc');
  });

  it('compte depuis la fin pour un index negatif', () => {
    // Semantique historique : -1 designe la position apres le dernier enfant.
    const fin = h('ul', null, h('li', null, 'a'), h('li', null, 'b'));
    insertAt(fin, -1, h('li', null, 'c'));
    expect(fin.textContent).toBe('abc');

    const avant = h('ul', null, h('li', null, 'a'), h('li', null, 'c'));
    insertAt(avant, -2, h('li', null, 'b'));
    expect(avant.textContent).toBe('abc');
  });

  it('ajoute a la fin quand l index depasse', () => {
    const parent = h('ul', null, h('li', null, 'a'));
    insertAt(parent, 9, h('li', null, 'b'));

    expect(parent.textContent).toBe('ab');
  });
});

describe('dom.on', () => {
  it('rend un desabonnement qui retire vraiment l ecouteur', () => {
    const node = h('div');
    const handler = vi.fn();
    const dispose = on(node, 'click', handler);

    node.dispatchEvent(new Event('click'));
    dispose();
    node.dispatchEvent(new Event('click'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('delegue aux seuls descendants correspondants', () => {
    const inner = h('button', { class: 'cible' }, 'ok');
    const root = h('div', null, inner, h('span', null, 'autre'));
    const handler = vi.fn();

    delegate(root, 'click', '.cible', handler);
    inner.dispatchEvent(new Event('click', { bubbles: true }));
    root.querySelector('span')?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('dom divers', () => {
  it('analyse un fragment de HTML', () => {
    expect(parse('<p>a</p><p>b</p>')).toHaveLength(2);
  });

  it('regroupe sans element parent', () => {
    expect(frag('a', h('b', null, 'c')).childNodes).toHaveLength(2);
  });

  it('echappe le HTML', () => {
    expect(escapeHtml('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  });
});
