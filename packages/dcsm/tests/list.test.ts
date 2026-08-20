import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetStore, setOffline, setResponder, snapshot } from '../../../tests/mocks/monkey.ts';
import type { ScriptEntry } from '@dreadcast/registry';
import { FALLBACK_LIST } from '../src/fallback.ts';
import { CACHE_TTL, resolveList } from '../src/list.ts';
import { KEYS } from '../src/state.ts';

const remoteList: ScriptEntry[] = [
  {
    id: 'distant',
    name: 'Distant',
    description: '',
    authors: '',
    icon: '',
    url: 'https://example.test/distant.user.js',
    doc: '',
    rp: '',
    contact: '',
    settings: false,
    section: ['game'],
    category: ['ui'],
    experimental: false,
  },
];

const cached: ScriptEntry[] = [{ ...remoteList[0]!, id: 'du-cache', name: 'Du cache' }];

const NOW = 1_700_000_000_000;

beforeEach(() => {
  resetStore();
  vi.spyOn(Date, 'now').mockReturnValue(NOW);
  setOffline();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('resolveList', () => {
  it('utilise le cache tant qu il a moins d une heure, sans requete', async () => {
    resetStore({ [KEYS.cache]: { ts: NOW - 1000, scripts: cached } });

    await expect(resolveList()).resolves.toEqual({
      scripts: cached,
      source: 'cache',
      ts: NOW - 1000,
    });
  });

  it('interroge la source distante quand le cache est absent', async () => {
    setResponder(() => ({ response: remoteList }));

    const result = await resolveList();

    expect(result.source).toBe('remote');
    expect(result.scripts).toEqual(remoteList);
    expect(snapshot()[KEYS.cache]).toEqual({ ts: NOW, scripts: remoteList });
  });

  it('rafraichit un cache perime', async () => {
    resetStore({ [KEYS.cache]: { ts: NOW - CACHE_TTL - 1, scripts: cached } });
    setResponder(() => ({ response: remoteList }));

    await expect(resolveList()).resolves.toMatchObject({ source: 'remote' });
  });

  it('garde le cache perime, et sa date, quand la source est injoignable', async () => {
    const staleTs = NOW - CACHE_TTL - 1;
    resetStore({ [KEYS.cache]: { ts: staleTs, scripts: cached } });

    const result = await resolveList();

    expect(result).toEqual({ scripts: cached, source: 'cache-stale', ts: staleTs });
    // La date n'est pas touchee : la mise a jour sera retentee au prochain
    // chargement, et non dans une heure.
    expect(snapshot()[KEYS.cache]).toEqual({ ts: staleTs, scripts: cached });
  });

  it('retombe sur la liste embarquee sans cache ni source', async () => {
    const result = await resolveList();

    expect(result.source).toBe('embedded');
    expect(result.scripts).toBe(FALLBACK_LIST);
  });

  it('traite une reponse malformee comme un echec', async () => {
    // Un 404 revient ici sous forme de page d erreur, pas de rejet.
    setResponder(() => ({ response: '<html>404</html>', status: 404 }));

    await expect(resolveList()).resolves.toMatchObject({ source: 'embedded' });
  });

  it('ignore un cache corrompu', async () => {
    resetStore({ [KEYS.cache]: { ts: 'hier', scripts: cached } });
    setResponder(() => ({ response: remoteList }));

    await expect(resolveList()).resolves.toMatchObject({ source: 'remote' });
  });
});
