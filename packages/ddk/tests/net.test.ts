import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { resetStore, setResponder } from '../../../tests/mocks/monkey.ts';
import { json, run, text } from '../src/net.ts';

const globals = globalThis as unknown as Record<string, unknown>;

beforeEach(() => {
  resetStore();
});

afterEach(() => {
  for (const name of ['DC', 'Util', '__vu', '__gm', '__ordre']) delete globals[name];
});

describe('net.run', () => {
  it('execute le code et lui donne sa propre portee', () => {
    run('var interne = 1; globalThis.__vu = interne;');

    expect(globals['__vu']).toBe(1);
    // Les declarations du script ne fuient pas dans la portee globale.
    expect(globals['interne']).toBeUndefined();
  });

  it('passe DC en parametre, et non par la portee globale', () => {
    // C'est tout l'enjeu : une fonction construite par `new Function` a pour
    // portee globale celle de la page, pas celle du bac a sable du
    // gestionnaire de userscripts, ou vivent `DC` et `Util`. Le script les
    // recoit donc en parametres.
    //
    // Le code ci-dessous ecrase la globale avant de lire `DC` : si la valeur
    // lue venait de la portee globale, elle vaudrait 'ecrase'.
    globals['DC'] = { marqueur: 'bac a sable' };

    run("globalThis.DC = 'ecrase'; globalThis.__vu = DC.marqueur;");

    expect(globals['__vu']).toBe('bac a sable');
  });

  it('passe aussi Util et les fonctions GM_*', () => {
    globals['Util'] = { marqueur: 'util' };

    run(`
      globalThis.Util = undefined;
      globalThis.GM_setValue = undefined;
      globalThis.__vu = Util.marqueur;
      globalThis.__gm = [
        typeof GM_getValue,
        typeof GM_setValue,
        typeof GM_deleteValue,
        typeof GM_listValues,
        typeof GM_addStyle,
        typeof GM_setClipboard,
        typeof GM_xmlhttpRequest,
      ];
    `);

    expect(globals['__vu']).toBe('util');
    expect(globals['__gm']).toEqual(Array.from({ length: 7 }, () => 'function'));
  });

  it('execute en mode non strict, comme un userscript installe seul', () => {
    // Un `eval` direct depuis ce module aurait herite de son mode strict, et
    // fait echouer les scripts historiques sur une affectation sans
    // declaration.
    expect(() => run('sansDeclaration = 1; globalThis.__vu = sansDeclaration;')).not.toThrow();

    expect(globals['__vu']).toBe(1);
  });

  it('annote le code pour que la console montre son origine', () => {
    // Sans cela, toutes les erreurs des scripts charges se ressemblent.
    expect(() => run('throw new Error("boum");', 'https://example.test/x.user.js')).toThrowError(
      'boum',
    );
  });
});

describe('net.text et net.json', () => {
  it('rendent la charge utile de la reponse', async () => {
    setResponder(() => ({ response: 'contenu' }));
    await expect(text('https://example.test/a')).resolves.toBe('contenu');

    setResponder(() => ({ response: { a: 1 } }));
    await expect(json('https://example.test/b')).resolves.toEqual({ a: 1 });
  });

  it('rejettent quand l hote ne repond pas', async () => {
    setResponder(() => {
      throw new Error('hote injoignable');
    });

    await expect(text('https://example.test/c')).rejects.toThrow(/example.test/);
  });
});
