import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetStore } from '../../../tests/mocks/monkey.ts';
import {
  openScriptSettings,
  registerScript,
  runScript,
  takeRegistration,
  type ScriptContext,
} from '../src/plugin.ts';

// Les enregistrements vivent dans l'etat du module : chaque test prend un
// identifiant qui lui est propre.
const start = async (id: string, openSettings?: (context: ScriptContext) => void) => {
  let received: ScriptContext | undefined;

  registerScript({
    id,
    init: (context) => {
      received = context;
    },
    ...(openSettings === undefined ? {} : { openSettings }),
  });

  const registration = takeRegistration(id);
  if (registration === undefined) throw new Error(`'${id}' n'a pas ete enregistre`);
  await runScript(registration);

  return received;
};

beforeEach(() => {
  resetStore();
  vi.spyOn(window, 'location', 'get').mockReturnValue({
    href: 'https://www.dreadcast.net/Main',
  } as unknown as Location);
});

describe('openScriptSettings', () => {
  it("appelle l'ecran du script avec le contexte deja passe a init", async () => {
    const openSettings = vi.fn();
    const context = await start('ecran', openSettings);

    expect(openScriptSettings('ecran')).toBe(true);
    expect(openSettings).toHaveBeenCalledOnce();
    expect(openSettings).toHaveBeenCalledWith(context);
  });

  it('renvoie faux pour un script sans ecran propre : le formulaire reste a la charge du gestionnaire', async () => {
    await start('formulaire');

    expect(openScriptSettings('formulaire')).toBe(false);
  });

  it('renvoie faux pour un script enregistre mais pas demarre', () => {
    const openSettings = vi.fn();
    registerScript({ id: 'endormi', init: () => undefined, openSettings });

    expect(openScriptSettings('endormi')).toBe(false);
    expect(openSettings).not.toHaveBeenCalled();
  });

  it('renvoie faux pour un script inconnu', () => {
    expect(openScriptSettings('inconnu')).toBe(false);
  });
});
