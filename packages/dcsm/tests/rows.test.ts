import DC from '@dreadcast/ddk';
import type { ScriptEntry } from '@dreadcast/registry';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetStore } from '../../../tests/mocks/monkey.ts';
import { scriptRows } from '../src/ui/rows.ts';

const globals = globalThis as unknown as Record<string, unknown>;

const entry = (id: string, settings = false): ScriptEntry => ({
  id,
  name: id,
  description: '',
  authors: '',
  icon: '',
  url: `https://example.test/${id}.user.js`,
  doc: '',
  rp: '',
  contact: '',
  settings,
  section: ['game'],
  category: ['ui'],
  experimental: false,
});

/** Rend les lignes d'un script dans un tableau attache au document. */
const render = (script: ScriptEntry): void => {
  const body = document.createElement('tbody');
  body.appendChild(scriptRows(script, 1, { [script.id]: true }));
  const table = document.createElement('table');
  table.appendChild(body);
  document.body.appendChild(table);
};

const gear = (id: string): HTMLElement | null => document.querySelector(`#${id}_setting`);

/** Clic sur l'icone, a l'interieur du bouton : il doit remonter jusqu'a lui. */
const clickGear = (id: string): void => {
  const icon = gear(id)?.querySelector('.gridCenter');
  if (!icon) throw new Error(`l'engrenage de '${id}' est absent`);
  icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

// Les enregistrements v2 vivent dans l'etat du DDK : un identifiant par test.
const startV2 = async (definition: Parameters<typeof DC.registerScript>[0] & { id: string }) => {
  DC.registerScript(definition);
  const registration = DC.scripts.take(definition.id);
  if (registration === undefined) throw new Error(`'${definition.id}' n'a pas ete enregistre`);
  await DC.scripts.run(registration);
};

beforeEach(() => {
  resetStore();
  vi.spyOn(window, 'location', 'get').mockReturnValue({
    href: 'https://www.dreadcast.net/Main',
  } as unknown as Location);

  globals['engine'] = {
    displayDataBox: (html: string) => {
      document.body.insertAdjacentHTML('beforeend', html);
    },
  };
});

afterEach(() => {
  vi.restoreAllMocks();
  delete globals['engine'];
  document.body.replaceChildren();
});

describe('engrenage des reglages', () => {
  it("n'apparait pas pour un script sans reglages", () => {
    render(entry('sansreglages'));

    expect(gear('sansreglages')).toBeNull();
  });

  it("apparait pour un script historique marque `settings`, dont l'ecouteur delegue recoit le clic", () => {
    // Ce que fait le script historique : il ecoute lui-meme `#<id>_setting`.
    const open = vi.fn();
    const listener = (event: Event): void => {
      if (event.target instanceof Element && event.target.closest('#historique_setting')) open();
    };
    document.addEventListener('click', listener);

    try {
      render(entry('historique', true));
      clickGear('historique');

      expect(open).toHaveBeenCalledOnce();
    } finally {
      document.removeEventListener('click', listener);
    }
  });

  it('ouvre le formulaire du gestionnaire pour un script v2 a schema', async () => {
    await startV2({
      id: 'schema',
      settings: [{ key: 'actif', type: 'boolean', label: 'Actif', default: true }],
      init: () => undefined,
    });

    render(entry('schema'));
    clickGear('schema');

    expect(document.querySelector('#dcsm_settings_schema')).not.toBeNull();
  });
});
