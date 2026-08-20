import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetStore } from '../../../tests/mocks/monkey.ts';

// La couche de compatibilité est la surface la plus exposée du DDK : une
// cinquantaine de scripts publiés par d'autres auteurs, sans copie dans ce
// dépôt, l'appellent en attendant des objets jQuery en retour. Elle est donc
// testée contre le vrai jQuery 1.8.2, celui que le jeu embarque, et contre un
// extrait fidèle de sa page.
const FIXTURE = join(import.meta.dirname, '..', '..', '..', 'tests', 'fixtures', 'game.html');

let legacy: typeof import('../src/legacy.ts');

beforeAll(async () => {
  // On évalue le build navigateur de jQuery dans le document de test, comme le
  // jeu l'évalue dans le sien. Le fichier est versionné plutôt que tiré de npm :
  // voir tests/fixtures/vendor/README.md.
  const source = readFileSync(
    join(import.meta.dirname, '..', '..', '..', 'tests', 'fixtures', 'vendor', 'jquery-1.8.2.js'),
    'utf8',
  );
  // oxlint-disable-next-line no-implied-eval
  new Function(source).call(window);

  // Le `$` du jeu est un global de page, pas un import : les scripts hérités
  // l'utilisent tel quel.
  const $ = (window as unknown as Record<string, unknown>)['jQuery'];
  (globalThis as unknown as Record<string, unknown>)['$'] = $;
  (globalThis as unknown as Record<string, unknown>)['jQuery'] = $;

  legacy = await import('../src/legacy.ts');
  legacy.installJQueryPlugin();
});

describe('harnais', () => {
  it('charge le vrai jQuery 1.8.2, lié au document de test', () => {
    const $ = (globalThis as unknown as Record<string, Record<string, unknown>>)['$']!;
    const fn = $['fn'] as Record<string, unknown>;

    expect(fn['jquery']).toBe('1.8.2');
    // Les API dont dépend le code hérité, disparues depuis jQuery 3.
    expect(typeof $['type']).toBe('function');
    expect(typeof fn['size']).toBe('function');
    expect(typeof fn['bind']).toBe('function');
  });
});

beforeEach(() => {
  resetStore();
  document.body.innerHTML = readFileSync(FIXTURE, 'utf8');
  // La page du jeu est en https ; plusieurs fonctions refusent de s'exécuter
  // hors du jeu.
  vi.spyOn(window, 'location', 'get').mockReturnValue({
    href: 'https://www.dreadcast.net/Main',
  } as Location);
});

const isJQuery = (value: unknown): boolean =>
  value instanceof (globalThis as unknown as { $: new () => unknown })['$'];

describe('DC.UI rend des objets jQuery', () => {
  it('pour tous les composants simples', () => {
    const composants = [
      legacy.UI.Separator(),
      legacy.UI.Menu('Test', () => undefined),
      legacy.UI.SubMenu('Test', () => undefined),
      legacy.UI.TextButton('id1', 'Libellé', () => undefined),
      legacy.UI.Button('id2', 'Libellé', () => undefined),
      legacy.UI.Checkbox('id3', false, () => undefined),
      legacy.UI.ColorPicker('id4', '#ff0000', () => undefined),
    ];

    for (const composant of composants) {
      expect(isJQuery(composant)).toBe(true);
      expect((composant as { length: number }).length).toBe(1);
    }
  });

  it('et accepte en entrée du jQuery, un noeud, ou une chaine de HTML', () => {
    const $ = (globalThis as unknown as { $: (html: string) => unknown })['$'];

    const depuisJQuery = legacy.UI.Tooltip('aide', $('<p>via jQuery</p>'));
    const depuisNoeud = legacy.UI.Tooltip('aide', document.createElement('b'));
    // jQuery analysait les chaines comme du HTML : un noeud texte serait une
    // régression silencieuse.
    const depuisChaine = legacy.UI.Tooltip('aide', '<p>via chaine</p>');

    for (const tooltip of [depuisJQuery, depuisNoeud, depuisChaine]) {
      expect(isJQuery(tooltip)).toBe(true);
    }

    const html = (depuisChaine as { html: () => string }).html();
    expect(html).toContain('<p>via chaine</p>');
  });

  it('sans réinjecter la feuille de style à chaque appel', () => {
    for (let index = 0; index < 5; index += 1) {
      legacy.UI.Tooltip('aide', document.createElement('b'));
    }

    // La version 1 réinjectait sa feuille à chaque construction : le
    // gestionnaire finissait avec des centaines de <style> identiques.
    const feuilles = [...document.querySelectorAll('style')].filter((style) =>
      style.textContent?.includes('.tooltiptext'),
    );

    expect(feuilles).toHaveLength(1);
  });
});

describe('DC.UI.Checkbox', () => {
  it('bascule la classe et annonce son nouvel état', () => {
    const états: boolean[] = [];
    const checkbox = legacy.UI.Checkbox('interrupteur', false, (état) => états.push(état));

    document.body.appendChild((checkbox as { get: (i: number) => Node }).get(0));
    const node = document.querySelector('#interrupteur');

    node?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    node?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(états).toEqual([true, false]);
    expect(node?.classList.contains('dc_ui_checkbox_on')).toBe(false);
  });
});

describe('DC.UI.addSubMenuTo', () => {
  it('vise le bon menu déroulant, pas le premier venu', () => {
    legacy.UI.addSubMenuTo(
      'Paramètres ▾',
      legacy.UI.SubMenu('Scripts & Skins', () => undefined, true),
      5,
    );

    const parametres = document.querySelector('.parametres ul');
    const navigation = document.querySelector('.navigation ul');

    expect(parametres?.textContent).toContain('Scripts & Skins');
    expect(navigation?.textContent).not.toContain('Scripts & Skins');
    // Position 5 : après les quatre entrées d'origine.
    expect(parametres?.children[4]?.textContent).toBe('Scripts & Skins');
  });

  it('échoue clairement quand le menu n existe pas', () => {
    expect(() => legacy.UI.addSubMenuTo('Menu inexistant', legacy.UI.Separator())).toThrowError(
      /Menu inexistant/,
    );
  });
});

describe('$.fn.insertAt', () => {
  it('reste disponible pour les scripts publiés', () => {
    const $ = (globalThis as unknown as { $: (html: string) => any })['$'];
    const liste = $('<ul><li>a</li><li>c</li></ul>');

    liste.insertAt(1, $('<li>b</li>'));

    expect(liste.text()).toBe('abc');
  });
});

describe('Util et DC.LocalMemory', () => {
  it('exposent toute la surface de la version 1', () => {
    for (const nom of [
      'guard',
      'deprecate',
      'isArray',
      'isString',
      'isBoolean',
      'isNumber',
      'isFunction',
      'isDate',
      'isError',
      'isRegex',
      'isObject',
      'isColor',
      'isJQuery',
      'guardArray',
      'guardString',
      'guardBoolean',
      'guardNumber',
      'guardFunction',
      'guardDate',
      'guardError',
      'guardRegex',
      'guardObject',
      'guardColor',
      'guardJQuery',
      'isGame',
      'isForum',
      'isEDC',
      'isWiki',
      'getContext',
    ]) {
      expect(typeof (legacy.Util as unknown as Record<string, unknown>)[nom]).toBe('function');
    }
  });

  it('reconnaissent un objet jQuery', () => {
    const $ = (globalThis as unknown as { $: (html: string) => unknown })['$'];

    expect(legacy.Util.isJQuery($('<p></p>'))).toBe(true);
    expect(legacy.Util.isJQuery(document.createElement('p'))).toBe(false);
    expect(legacy.Util.isJQuery(null, true)).toBe(true);
  });

  it('lisent et écrivent la mémoire persistante', () => {
    expect(legacy.LocalMemory.init('cle', 'valeur')).toBe('valeur');
    legacy.LocalMemory.set('autre', 1);

    expect(legacy.LocalMemory.get('autre')).toBe(1);
    expect(legacy.LocalMemory.list()).toEqual(['cle', 'autre']);

    legacy.LocalMemory.delete('cle');
    expect(legacy.LocalMemory.list()).toEqual(['autre']);
  });
});
