/**
 * Scripts effectivement charges dans la page courante.
 *
 * Distinct de la configuration : un script coche mais pas encore recharge, ou
 * dont le chargement a echoue, n'y figure pas. C'est ce qui decide si
 * l'engrenage d'un script historique a quelqu'un pour l'ecouter.
 */
const loaded = new Set<string>();

export const markLoaded = (id: string): void => {
  loaded.add(id);
};

export const isLoaded = (id: string): boolean => loaded.has(id);
