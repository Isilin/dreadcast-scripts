// Petite couche DOM native, en remplacement de jQuery pour tout le code neuf.
// Le `$` du jeu (1.8.2) reste disponible pour le code herite ; il n'est utilise
// ici que par la couche de compatibilite.

export type Child = Node | string | number | false | null | undefined | Child[];

/**
 * Valeur d'attribut. `false`, `null` et `undefined` n'ecrivent rien : cela
 * permet d'ecrire `{ checked: index === 0 }` sans condition autour.
 */
export type AttributeValue = string | number | boolean | null | undefined;

export interface Props {
  class?: AttributeValue;
  id?: AttributeValue;
  style?: string | Partial<CSSStyleDeclaration>;
  dataset?: Record<string, string>;
  /** Ecouteurs, poses directement sur l'element cree. */
  on?: Record<string, EventListener>;
  /** HTML brut. Ne jamais y injecter de contenu venant d'un joueur. */
  html?: string;
  /** Tout autre attribut. */
  [attribute: string]: unknown;
}

const appendChild = (parent: Node, child: Child): void => {
  if (child === null || child === undefined || child === false) return;

  if (Array.isArray(child)) {
    for (const nested of child) appendChild(parent, nested);
    return;
  }

  parent.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
};

const applyProps = (element: HTMLElement, props: Props): void => {
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === 'on') {
      for (const [type, listener] of Object.entries(value as Props['on'] & {})) {
        element.addEventListener(type, listener);
      }
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key === 'dataset') {
      Object.assign(element.dataset, value);
    } else if (key === 'html') {
      if (typeof value === 'string') element.innerHTML = value;
    } else if (value === true) {
      element.setAttribute(key, '');
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      element.setAttribute(key, String(value));
    } else {
      throw new Error(`h(): l'attribut '${key}' doit etre une primitive, pas un ${typeof value}.`);
    }
  }
};

/** Cree un element. `h('div', { class: 'x' }, 'texte')`. */
export const h = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Props | null,
  ...children: Child[]
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (props) applyProps(element, props);
  for (const child of children) appendChild(element, child);
  return element;
};

/** Regroupe plusieurs noeuds sans element parent. */
export const frag = (...children: Child[]): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  for (const child of children) appendChild(fragment, child);
  return fragment;
};

/** Analyse un fragment de HTML et renvoie ses noeuds racine. */
export const parse = (html: string): Node[] => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return [...template.content.childNodes];
};

export const qs = <E extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document,
): E | null => scope.querySelector<E>(selector);

export const qsa = <E extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document,
): E[] => [...scope.querySelectorAll<E>(selector)];

export type Dispose = () => void;

/**
 * Pose un ecouteur et renvoie de quoi le retirer.
 *
 * Le retour n'est pas cosmetique : la fenetre du DCSM est reconstruite a chaque
 * ouverture, et l'ancienne version accumulait ses ecouteurs sur `document`
 * a chaque fois.
 */
export const on = (
  target: EventTarget,
  type: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
): Dispose => {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
};

/** Variante deleguee : ne reagit qu'aux evenements issus de `selector`. */
export const delegate = (
  root: ParentNode & EventTarget,
  type: string,
  selector: string,
  handler: (event: Event, matched: HTMLElement) => void,
  options?: AddEventListenerOptions,
): Dispose =>
  on(
    root,
    type,
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const matched = target.closest<HTMLElement>(selector);
      if (matched && root.contains(matched)) handler(event, matched);
    },
    options,
  );

/** Echappe un texte destine a etre interpole dans du HTML. */
export const escapeHtml = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character] ?? character,
  );

/**
 * Insere `node` a la position `index` parmi les enfants de `parent`.
 *
 * Un index negatif compte depuis la fin, comme la version jQuery historique.
 */
export const insertAt = (parent: Element, index: number, node: Node): void => {
  const count = parent.children.length;
  const position = index < 0 ? Math.max(0, count + 1 + index) : index;
  parent.insertBefore(node, parent.children[position] ?? null);
};
