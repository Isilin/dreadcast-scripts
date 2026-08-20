import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as gm from '../../../tests/mocks/monkey.ts';
import type { ScriptEntry } from '@dreadcast/registry';

// Ce test ne porte pas sur les sources mais sur les deux fichiers construits,
// assembles comme un gestionnaire de userscripts les assemble. C'est le seul
// endroit ou l'on verifie le contrat qui lie les deux bundles : le DDK, charge
// par `@require`, pose `DC` ; le gestionnaire le lit comme identifiant nu.
//
// Il ne remplace pas la recette en jeu -- la semantique exacte du bac a sable
// n'appartient qu'au gestionnaire -- mais il attrape tout le reste avant
// d'ouvrir un navigateur.

const ROOT = join(import.meta.dirname, '..', '..', '..');
const DDK = join(ROOT, 'packages', 'ddk', 'dist', 'ddk.user.js');
const DCSM = join(ROOT, 'packages', 'dcsm', 'dist', 'dcsm.user.js');
const FIXTURE = join(ROOT, 'tests', 'fixtures', 'game.html');

for (const artefact of [DDK, DCSM]) {
  if (!existsSync(artefact)) {
    throw new Error(`${artefact} est absent. Lancer 'vp run -r build' avant les tests.`);
  }
}

const ddkSource = readFileSync(DDK, 'utf8');
const dcsmSource = readFileSync(DCSM, 'utf8');

const CATALOGUE_URL =
  'https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/data/scripts.json';

const entry = (id: string, overrides: Partial<ScriptEntry> = {}): ScriptEntry => ({
  id,
  name: id,
  description: '',
  authors: '',
  icon: '',
  url: `https://example.test/${id}.user.js`,
  doc: '',
  rp: '',
  contact: '',
  settings: false,
  section: ['game'],
  category: ['ui'],
  experimental: false,
  ...overrides,
});

/** Script historique : il s'execute de lui-meme au chargement. */
const LEGACY_CODE = 'globalThis.__legacy = (globalThis.__legacy ?? 0) + 1;';

/** Script v2 : il se declare, et attend que le gestionnaire l'appelle. */
const PLUGIN_CODE = `
  DC.registerScript({
    settings: [{ key: 'couleur', type: 'color', label: 'Couleur', default: 'ff0000' }],
    init(ctx) {
      ctx.storage.set('demarre', true);
      globalThis.__plugin = { id: ctx.id, contexte: ctx.context, reglages: ctx.settings };
    },
  });
`;

const CATALOGUE = [entry('legacy'), entry('plugin', { settings: true })];

const globals = globalThis as unknown as Record<string, unknown>;

/**
 * Installe ce que le gestionnaire de userscripts fournit a un script : les
 * `GM_*`, et les globales que la page du jeu expose.
 *
 * Les bundles capturent les `GM_*` a leur initialisation : elles doivent donc
 * exister avant toute evaluation.
 */
const installEnvironment = (): void => {
  for (const name of [
    'GM_getValue',
    'GM_setValue',
    'GM_deleteValue',
    'GM_listValues',
    'GM_addStyle',
    'GM_xmlhttpRequest',
  ]) {
    globals[name] = (gm as unknown as Record<string, unknown>)[name];
  }

  document.body.innerHTML = readFileSync(FIXTURE, 'utf8');

  globals['engine'] = {
    displayDataBox: (html: string) => {
      document.body.insertAdjacentHTML('beforeend', html);
    },
    closeDataBox: (id: string) => document.querySelector(`#${id}`)?.remove(),
    switchDataBox: () => undefined,
    regenerateDataBox: () => undefined,
    getIdPersonnage: () => '1',
  };

  globals['nav'] = {
    getChat: () => ({ onSend: () => undefined, onAfterSend: () => undefined }),
    getMessagerie: () => ({ newMessage: () => undefined }),
  };

  vi.spyOn(window, 'location', 'get').mockReturnValue({
    href: 'https://www.dreadcast.net/Main',
    replace: () => undefined,
  } as unknown as Location);

  gm.setResponder((request) => {
    if (request.url === CATALOGUE_URL) return { response: CATALOGUE };
    if (request.url.endsWith('/legacy.user.js')) return { response: LEGACY_CODE };
    if (request.url.endsWith('/plugin.user.js')) return { response: PLUGIN_CODE };
    throw new Error(`URL non simulee : ${request.url}`);
  });
};

const clearGlobals = (): void => {
  for (const name of ['DC', 'Util', '__legacy', '__plugin', 'engine', 'nav']) {
    delete globals[name];
  }
};

/** Deux facons d'assembler `@require` et script principal selon le gestionnaire. */
type Assembly = 'portees-separees' | 'concatenation';

const run = (assembly: Assembly): void => {
  if (assembly === 'concatenation') {
    // Certains gestionnaires collent les fichiers bout a bout dans une seule
    // portee : rien ne doit entrer en conflit.
    // oxlint-disable-next-line no-implied-eval
    new Function(`${ddkSource}\n${dcsmSource}`).call(window);
    return;
  }

  // oxlint-disable-next-line no-implied-eval
  new Function(ddkSource).call(window);
  // oxlint-disable-next-line no-implied-eval
  new Function(dcsmSource).call(window);
};

beforeEach(() => {
  gm.resetStore({ dcsm_list: { legacy: true, plugin: true } });
  installEnvironment();
});

afterEach(() => {
  vi.restoreAllMocks();
  clearGlobals();
  document.head.replaceChildren();
});

describe.each<Assembly>(['portees-separees', 'concatenation'])(
  'les deux userscripts construits, assemblage %s',
  (assembly) => {
    it('exposent DC, et le gestionnaire le lit comme identifiant nu', async () => {
      expect(() => run(assembly)).not.toThrow();

      const DC = globals['DC'] as Record<string, unknown>;
      expect(DC).toBeDefined();
      for (const module of ['storage', 'net', 'ui', 'dom', 'context', 'scripts']) {
        expect(DC[module]).toBeDefined();
      }
      expect(typeof DC['registerScript']).toBe('function');
      expect(globals['Util']).toBeDefined();
    });

    it('injectent l entree du menu apres avoir resolu le catalogue', async () => {
      run(assembly);

      await vi.waitFor(() => {
        const menu = document.querySelector('.parametres ul');
        expect(menu?.textContent).toContain('Scripts & Skins');
      });

      // Le second menu deroulant de la page ne doit pas etre touche.
      expect(document.querySelector('.navigation ul')?.textContent).not.toContain(
        'Scripts & Skins',
      );
    });

    it('chargent un script historique, qui s execute de lui-meme', async () => {
      run(assembly);

      await vi.waitFor(() => {
        expect(globals['__legacy']).toBe(1);
      });
    });

    it('demarrent un script v2 avec son contexte et son stockage cloisonne', async () => {
      run(assembly);

      await vi.waitFor(() => {
        expect(globals['__plugin']).toBeDefined();
      });

      expect(globals['__plugin']).toEqual({
        id: 'plugin',
        contexte: 'game',
        // La valeur par defaut du schema, faute de reglage enregistre.
        reglages: { couleur: 'ff0000' },
      });

      // Le stockage du script est prefixe : il ne peut pas ecraser celui d'un
      // autre, ni celui du gestionnaire.
      expect(gm.snapshot()['dcs:plugin:demarre']).toBe(true);
    });

    it('mettent le catalogue en cache pour le prochain chargement', async () => {
      run(assembly);

      await vi.waitFor(() => {
        expect(gm.snapshot()['dcsm_scripts_cache']).toBeDefined();
      });

      const cache = gm.snapshot()['dcsm_scripts_cache'] as { scripts: unknown[] };
      expect(cache.scripts).toHaveLength(CATALOGUE.length);
    });

    it('retombent sur la liste embarquee quand la source est injoignable', async () => {
      gm.setOffline();
      run(assembly);

      await vi.waitFor(() => {
        const cache = gm.snapshot()['dcsm_scripts_cache'] as { scripts: unknown[] } | undefined;
        expect(cache).toBeDefined();
        // La liste embarquee compte les 52 scripts du catalogue reel, la ou la
        // reponse simulee n'en aurait rendu que deux.
        expect(cache?.scripts.length).toBeGreaterThan(CATALOGUE.length);
      });
    });
  },
);
