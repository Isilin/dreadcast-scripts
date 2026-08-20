/** Les quatre contextes dans lesquels un script peut s'executer. */
export type GameContext = 'game' | 'forum' | 'edc' | 'wiki';

const at = (prefix: string): boolean => window.location.href.startsWith(prefix);

export const isGame = (): boolean => at('https://www.dreadcast.net/Main');

export const isForum = (): boolean =>
  at('https://www.dreadcast.net/Forum') || at('https://www.dreadcast.net/FAQ');

export const isEDC = (): boolean => at('https://www.dreadcast.net/EDC');

export const isWiki = (): boolean => at('http://wiki.dreadcast.eu/wiki');

/**
 * Contexte courant. Attention : `wiki` est la valeur par defaut historique,
 * renvoyee y compris hors des pages Dreadcast.
 */
export const getContext = (): GameContext => {
  if (isGame()) return 'game';
  if (isForum()) return 'forum';
  if (isEDC()) return 'edc';
  return 'wiki';
};

/** Leve si l'appel n'a pas lieu en jeu. */
export const guardGame = (context: string): void => {
  if (!isGame()) {
    throw new Error(`${context}: cette fonction n'est disponible qu'en jeu.`);
  }
};
