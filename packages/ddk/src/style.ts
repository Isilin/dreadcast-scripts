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

  const node = inject(css);

  // La page du jeu compte des dizaines de balises `<style>`, dont certaines
  // qu'il duplique lui-meme. Marquer les notres les rend identifiables :
  // `document.querySelectorAll('[data-dc-style]')` suffit a les isoler quand on
  // cherche d'ou vient une regle.
  if (node && id !== undefined) node.dataset['dcStyle'] = id;
};

/**
 * `GM_addStyle` renvoie l'element cree -- sauf sur les gestionnaires les plus
 * anciens, d'ou le retour optionnel.
 */
const inject = (css: string): HTMLStyleElement | undefined => {
  if (typeof GM_addStyle === 'function') return GM_addStyle(css);

  const node = document.createElement('style');
  node.appendChild(document.createTextNode(css));
  (document.head ?? document.documentElement).appendChild(node);

  return node;
};
