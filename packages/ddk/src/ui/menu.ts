import { guardGame } from '../context.ts';
import { h, insertAt, qs, qsa } from '../dom.ts';

/** Barre de menus du jeu. */
export const topMenu = (): HTMLElement | null => {
  guardGame('topMenu');
  return qs('.menus');
};

/** Ajoute une entree dans la barre de menus, a la position demandee. */
export const addToTopMenu = (element: Node, index = 0): void => {
  const menu = topMenu();
  if (!menu) throw new Error('addToTopMenu: la barre de menus est introuvable.');

  insertAt(menu, index, element);
};

export const menu = (label: string, onClick: (event: MouseEvent) => void): HTMLLIElement =>
  h('li', {
    id: label,
    class: 'couleur5',
    html: label,
    on: { click: onClick as EventListener },
  });

export const subMenu = (
  label: string,
  onClick: (event: MouseEvent) => void,
  separatorBefore = false,
): HTMLLIElement =>
  h('li', {
    class: `link couleur2${separatorBefore ? ' separator' : ''}`,
    html: label,
    on: { click: onClick as EventListener },
  });

/**
 * Menu deroulant.
 *
 * L'attribut `onclick` en dur est conserve : il s'execute dans le contexte de
 * la page, ou vit le jQuery du jeu et son `slideDown`.
 */
export const dropMenu = (label: string, items: Node[]): HTMLLIElement => {
  const item = h(
    'li',
    {
      id: label,
      class: 'parametres couleur5 right hover',
      onclick: "$(this).find('ul').slideDown();",
    },
    `${label}\u25be`,
  );

  item.appendChild(h('ul', null, items));

  return item;
};

/**
 * Ajoute une entree dans le sous-menu dont le libelle contient `name`.
 *
 * Remplace le selecteur `:contains()` de jQuery, qui n'existe pas en CSS.
 */
export const addSubMenuTo = (name: string, element: Node, index = 0): void => {
  guardGame('addSubMenuTo');

  const target = qsa('.menus li').find(
    (item) => item.textContent?.includes(name) && qs('ul', item),
  );

  if (!target) {
    throw new Error(`addSubMenuTo: aucun menu ne contient '${name}'.`);
  }

  const list = qs('ul', target);
  if (list) insertAt(list, index, element);
};
