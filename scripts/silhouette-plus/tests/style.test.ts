import { afterEach, describe, expect, it } from 'vitest';

import { SLOTS, readLayout } from '../src/positions.ts';
import { layoutCss, layoutSheet } from '../src/style.ts';

afterEach(() => {
  document.head.replaceChildren();
});

describe('layoutCss', () => {
  it('positionne chaque emplacement', () => {
    const css = layoutCss(readLayout({ head: { x: 5, y: 3 } }), false);

    expect(css.split('\n')).toHaveLength(SLOTS.length);
    expect(css).toContain('.zone_case1 { left: 5% !important; top: 3% !important; }');
    expect(css).toContain('#stockInventaire { left: 91% !important; top: 83% !important; }');
  });

  it("ne touche au reflet des cases que s'il est masque", () => {
    const layout = readLayout(undefined);

    expect(layoutCss(layout, false)).not.toContain('linkBox');
    expect(layoutCss(layout, true)).toContain(
      '.case_objet.linkBox::before, .case_objet.linkBox::after, .case_objet.linkBox:hover::before, .case_objet.linkBox:hover::after { display: none !important; }',
    );
  });
});

describe('layoutSheet', () => {
  it('reecrit une seule balise, au lieu d en empiler une par modification', () => {
    const render = layoutSheet('essai');

    render('a { color: red; }');
    render('b { color: blue; }');

    const nodes = document.head.querySelectorAll('style[data-dc-style="essai"]');
    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.textContent).toBe('b { color: blue; }');
  });
});
