import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { defineUserscript } from '../src/index.ts';

const PACKAGE_ROOT = join(import.meta.dirname, '..');

const build = (extend?: Parameters<typeof defineUserscript>[0]['extend']) =>
  defineUserscript({
    root: PACKAGE_ROOT,
    fileName: 'test',
    devPort: 5999,
    userscript: { name: 'Test', match: 'https://www.dreadcast.net/Main' },
    ...(extend === undefined ? {} : { extend }),
  });

describe('defineUserscript', () => {
  it('lit la version depuis le package.json du paquet', () => {
    expect(() =>
      defineUserscript({
        root: join(PACKAGE_ROOT, 'src'),
        fileName: 'test',
        devPort: 5999,
        userscript: { name: 'Test' },
      }),
    ).toThrowError();
  });

  it('impose les reglages de publication', () => {
    const config = build();

    // Le code publie est relu par les moderateurs de Greasy Fork.
    expect(config.build?.minify).toBe(false);
    expect(config.server?.port).toBe(5999);
  });

  it('complete le bloc build sans effacer le reste', () => {
    // Un spread aurait remplace l'objet `build` entier, et donc reactive la
    // minification sans que personne ne le demande.
    const config = build({ build: { sourcemap: true } });

    expect(config.build?.sourcemap).toBe(true);
    expect(config.build?.minify).toBe(false);
    expect(config.build?.target).toBe('chrome120');
  });

  it('ajoute des plugins sans retirer vite-plugin-monkey', () => {
    const base = build().plugins?.length ?? 0;
    const config = build({ plugins: [{ name: 'test-plugin' }] });

    expect(config.plugins?.length).toBe(base + 1);
  });
});
