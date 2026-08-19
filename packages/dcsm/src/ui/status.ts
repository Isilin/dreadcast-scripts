import DC from '@dreadcast/ddk';

import type { ListSource } from '../list.ts';

/**
 * Indique d'où vient la liste affichée.
 *
 * Sans cette ligne, un script absent d'une liste dégradée est indiscernable
 * d'un script simplement désactivé.
 */
export const listStatus = (source: ListSource, ts: number): HTMLElement => {
  const date = new Date(ts).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const messages: Record<ListSource, string> = {
    remote: `Liste à jour (${date}).`,
    cache: `Liste en cache (${date}).`,
    'cache-stale': `⚠ Source injoignable : liste en cache du ${date}.`,
    embedded: '⚠ Source injoignable : liste de secours embarquée, potentiellement incomplète.',
  };

  const degraded = source === 'cache-stale' || source === 'embedded';

  return DC.dom.h(
    'p',
    { style: { marginBottom: '1rem' } },
    DC.dom.h(
      'small',
      null,
      DC.dom.h(
        'em',
        degraded ? { style: { color: 'red' } } : { class: 'couleur5' },
        messages[source],
      ),
    ),
  );
};
