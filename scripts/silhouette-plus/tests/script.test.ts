import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import DC from '@dreadcast/ddk';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetStore, setOffline, setResponder, snapshot } from '../../../tests/mocks/monkey.ts';
import { ID, definition } from '../src/script.ts';

const FIXTURE = readFileSync(
  join(import.meta.dirname, '..', '..', '..', 'tests', 'fixtures', 'game.html'),
  'utf8',
);

const globals = globalThis as unknown as Record<string, unknown>;

const ROWS = [
  ['', 'Pseudo', 'URL'],
  ['553', 'Zalaniz', 'https://example.org/zalaniz.png'],
  ['76113', 'Pelagia', 'https://example.org/pelagia.png'],
];

// Methodes du jeu que la version 1.0 remplacait.
const openPersoBox = (): void => undefined;
const displayInfos = (): void => undefined;

const newMessage = vi.fn();

/** Demarre le script par le chemin du gestionnaire. */
const start = async (): Promise<void> => {
  DC.registerScript(definition);
  const registration = DC.scripts.take(ID);
  if (registration === undefined) throw new Error("Silhouette+ n'a pas ete enregistre");
  await DC.scripts.run(registration);
};

const sheet = (id: string): string =>
  [...document.querySelectorAll(`style[data-dc-style="${id}"]`)].at(-1)?.textContent ?? '';

const layout = (): string => sheet('silhouettePlus-layout');

const menuEntry = (): HTMLElement | undefined =>
  [...document.querySelectorAll<HTMLElement>('.menus li.parametres li')].find(
    (item) => item.textContent === 'Silhouette+',
  );

const element = <E extends HTMLElement>(selector: string): E => {
  const found = document.querySelector<E>(selector);
  if (!found) throw new Error(`'${selector}' est absent`);
  return found;
};

beforeEach(() => {
  resetStore();
  setResponder(() => ({ response: { values: ROWS } }));
  vi.spyOn(window, 'location', 'get').mockReturnValue({
    href: 'https://www.dreadcast.net/Main',
  } as unknown as Location);

  document.body.innerHTML = `${FIXTURE}
    <div id="txt_pseudo">Pelagia</div>
    <div id="zone_inventaire" class="inventaire_content"><div class="personnage_image"></div></div>`;

  globals['engine'] = {
    getIdPersonnage: () => '76113',
    displayDataBox: (html: string) => document.body.insertAdjacentHTML('beforeend', html),
    switchDataBox: () => undefined,
  };
  globals['nav'] = { getMessagerie: () => ({ newMessage }) };
  globals['Engine'] = { prototype: { openPersoBox } };
  globals['MenuInventaire'] = { prototype: { displayInfos } };
});

afterEach(() => {
  vi.restoreAllMocks();
  newMessage.mockReset();
  delete Util.isDSM;
  for (const name of ['engine', 'nav', 'Engine', 'MenuInventaire']) delete globals[name];
  document.body.replaceChildren();
  for (const node of document.querySelectorAll('style[data-dc-style="silhouettePlus-layout"]')) {
    node.remove();
  }
});

describe('Silhouette+', () => {
  it('ne remplace aucune methode du jeu : les infobulles de la fiche RP restent intactes', async () => {
    await start();

    const engine = globals['Engine'] as { prototype: Record<string, unknown> };
    const inventaire = globals['MenuInventaire'] as { prototype: Record<string, unknown> };
    expect(engine.prototype['openPersoBox']).toBe(openPersoBox);
    expect(inventaire.prototype['displayInfos']).toBe(displayInfos);
  });

  it("habille les fiches RP connues et l'inventaire du joueur", async () => {
    await start();

    const css = sheet('silhouettePlus-silhouettes');
    expect(css).toContain('#ib_persoBox_553 .personnage_image');
    expect(css).toContain(
      '#zone_inventaire .personnage_image { background-image: url("https://example.org/pelagia.png")',
    );
  });

  it('positionne les emplacements', async () => {
    await start();

    expect(layout()).toContain('.zone_case1 { left: 0% !important; top: 1% !important; }');
  });

  it('demarre malgre un Google Sheet injoignable, et le signale', async () => {
    setOffline();
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await start();

    expect(layout()).toContain('.zone_case1');
    expect(error).toHaveBeenCalledWith(
      '[silhouettePlus]',
      'silhouettes indisponibles :',
      expect.any(Error),
    );
  });

  it('ajoute son entree au menu Parametres hors du gestionnaire', async () => {
    await start();

    const entry = menuEntry();
    expect(entry).toBeDefined();

    entry?.dispatchEvent(new MouseEvent('click'));
    expect(document.querySelector('#silhouettePlus_modal')).not.toBeNull();
  });

  it("laisse l'engrenage du gestionnaire ouvrir les reglages, sans entree de menu", async () => {
    Util.isDSM = () => true;

    await start();

    expect(menuEntry()).toBeUndefined();
    expect(DC.scripts.openSettings(ID)).toBe(true);
    expect(document.querySelector('#silhouettePlus_modal')).not.toBeNull();
  });

  it('applique et enregistre chaque reglage en direct', async () => {
    await start();
    DC.scripts.openSettings(ID);

    const x = element<HTMLInputElement>('#silhouettePlus_head_x');
    x.value = '12';
    x.dispatchEvent(new Event('input'));

    expect(layout()).toContain('.zone_case1 { left: 12% !important; top: 1% !important; }');
    expect(snapshot()['dcs:silhouettePlus:positions']).toEqual({ head: { x: 12, y: 1 } });

    element('#silhouettePlus_shine').dispatchEvent(new MouseEvent('click'));

    expect(layout()).toContain('display: none !important;');
    expect(snapshot()['dcs:silhouettePlus:hideShine']).toBe(true);
  });

  it('ignore une saisie qui n est pas un nombre', async () => {
    await start();
    DC.scripts.openSettings(ID);

    const y = element<HTMLInputElement>('#silhouettePlus_head_y');
    y.value = '';
    y.dispatchEvent(new Event('input'));

    expect(layout()).toContain('.zone_case1 { left: 0% !important; top: 1% !important; }');
    expect(snapshot()).not.toHaveProperty('dcs:silhouettePlus:positions');
  });

  it('prepare la demande de changement de silhouette aux animateurs', async () => {
    await start();
    DC.scripts.openSettings(ID);

    element('#silhouettePlus_request').dispatchEvent(new MouseEvent('click'));

    expect(newMessage).toHaveBeenCalledWith(
      'Phylène, Izo, Pelagia',
      '[HRP] Silhouette',
      expect.stringContaining('Pseudo : Pelagia\nID : #76113\n'),
    );
  });
});
