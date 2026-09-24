import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetStore, setOffline, setResponder, snapshot } from '../../../tests/mocks/monkey.ts';
import type { ScriptEntry } from '@dreadcast/registry';
import { KEYS, type ManagerState } from '../src/state.ts';
import { type ManagerOptions, openManager } from '../src/ui/manager.ts';

const globals = globalThis as unknown as Record<string, unknown>;

const entry = (id: string): ScriptEntry => ({
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
});

const NOW = 1_700_000_000_000;

const managerState = (): ManagerState => ({
  enabled: { ancien: true },
  allDisabled: false,
  introDisabled: true,
  devMode: false,
});

const options = (): ManagerOptions => ({
  scripts: [entry('ancien')],
  state: managerState(),
  source: 'cache',
  ts: NOW - 1000,
});

const refreshButton = (): HTMLElement => {
  const button = document.querySelector<HTMLElement>('#scripts_list_refresh');
  if (!button) throw new Error("le bouton d'actualisation est absent");
  return button;
};

// Un clic qui ne remonte pas : la fenetre du jeu porte un `onclick` en ligne,
// evalue dans la portee de la page jsdom, ou `engine` n'existe pas.
const clickRefresh = (): void => {
  refreshButton().dispatchEvent(new MouseEvent('click'));
};

const names = (): string[] =>
  [...document.querySelectorAll('#scripts_modal tbody tr:nth-child(odd) td:nth-child(3)')].map(
    (cell) => cell.textContent ?? '',
  );

beforeEach(() => {
  resetStore({ [KEYS.cache]: { ts: NOW - 1000, scripts: [entry('ancien')] } });
  vi.spyOn(Date, 'now').mockReturnValue(NOW);
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

describe("bouton d'actualisation de la liste", () => {
  it('est une icone seule, expliquee par une infobulle', () => {
    openManager(options());

    const button = refreshButton();
    expect(button.textContent?.trim()).toBe('');
    expect(button.querySelector('i.fa-sync-alt')).not.toBeNull();
    expect(button.closest('.tooltip')?.querySelector('.tooltiptext')?.textContent).toBe(
      'Actualiser la liste des scripts',
    );
  });

  it('ignore le cache encore frais et remplace la liste sur place', async () => {
    setResponder(() => ({ response: [entry('ancien'), entry('nouveau')] }));
    const opts = options();
    openManager(opts);

    expect(names()).toEqual(['ancien']);

    clickRefresh();

    await vi.waitFor(() => {
      expect(names()).toEqual(['ancien', 'nouveau']);
    });

    expect(document.querySelector('#scripts_modal')?.textContent).toContain('Liste à jour');
    expect(snapshot()[KEYS.cache]).toEqual({
      ts: NOW,
      scripts: [entry('ancien'), entry('nouveau')],
    });
    // Le menu repasse ces options a chaque ouverture : elles portent la
    // nouvelle liste.
    expect(opts.scripts.map((script) => script.id)).toEqual(['ancien', 'nouveau']);
    expect(refreshButton().querySelector('i.fa-spin')).toBeNull();
  });

  it('ne touche pas a la configuration enregistree', async () => {
    setResponder(() => ({ response: [entry('nouveau')] }));
    resetStore({
      [KEYS.cache]: { ts: NOW - 1000, scripts: [entry('ancien')] },
      [KEYS.enabled]: { ancien: true },
    });
    openManager(options());

    clickRefresh();

    await vi.waitFor(() => {
      expect(names()).toEqual(['nouveau']);
    });

    // Seule la sauvegarde ecrit la configuration : un script disparu du
    // catalogue n'est pas elague par l'actualisation.
    expect(snapshot()[KEYS.enabled]).toEqual({ ancien: true });
  });

  it('signale une source injoignable et garde la liste en cache', async () => {
    setOffline();
    openManager(options());

    clickRefresh();

    await vi.waitFor(() => {
      expect(document.querySelector('#scripts_modal')?.textContent).toContain('Source injoignable');
    });

    expect(names()).toEqual(['ancien']);
  });
});
