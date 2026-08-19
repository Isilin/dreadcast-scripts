import { GM_addStyle } from 'monkey';

const applied = new Set<string>();

/**
 * Injecte une feuille de style.
 *
 * `id` rend l'appel idempotent : c'est indispensable pour les composants, que
 * l'appelant instancie en boucle. L'ancienne version injectait sa feuille a
 * chaque `Tooltip` ou `Checkbox` construit, ce qui laissait des centaines de
 * balises `<style>` identiques dans la page du DCSM.
 */
export const apply = (css: string, id?: string): void => {
  if (id !== undefined) {
    if (applied.has(id)) return;
    applied.add(id);
  }

  if (typeof GM_addStyle === 'function') {
    GM_addStyle(css);
    return;
  }

  const node = document.createElement('style');
  if (id !== undefined) node.dataset['dcStyle'] = id;
  node.appendChild(document.createTextNode(css));
  (document.head ?? document.documentElement).appendChild(node);
};
