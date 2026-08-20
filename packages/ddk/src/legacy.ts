// Couche de compatibilite : reconstruit a l'identique la surface publique
// `DC` / `Util` de la version 1.
//
// Elle n'est pas facultative. Une cinquantaine de scripts sont publies sur
// Greasy Fork par d'autres auteurs, sans copie dans ce depot, et appellent ces
// fonctions en attendant des objets jQuery en retour. Le code neuf, lui, passe
// par les modules natifs.

import * as context from './context.ts';
import { parse, type Child } from './dom.ts';
import * as chat from './game/chat.ts';
import * as deck from './game/deck.ts';
import * as guards from './guards.ts';
import * as net from './net.ts';
import * as storage from './storage.ts';
import * as style from './style.ts';
import * as ui from './ui/index.ts';

const hasJQuery = (): boolean => typeof $ !== 'undefined';

/** Emballe un noeud natif en objet jQuery, comme le faisait la version 1. */
const wrap = (node: Node): unknown => (hasJQuery() ? $(node as HTMLElement) : node);

/**
 * Accepte ce que la version 1 acceptait : objet jQuery, noeud DOM, ou chaine
 * de HTML -- que jQuery analysait, la ou `document.createTextNode` l'aurait
 * affichee telle quelle.
 */
const unwrap = (value: unknown): Child => {
  if (value === null || value === undefined) return null;
  if (value instanceof Node) return value;
  if (typeof value === 'string') return parse(value);

  if (hasJQuery() && value instanceof $) {
    return Array.from($(value as HTMLElement) as unknown as ArrayLike<Node>);
  }

  return value as Child;
};

const unwrapNode = (value: unknown): Node => {
  const child = unwrap(value);
  if (child instanceof Node) return child;

  const nodes = Array.isArray(child) ? child : [child];
  const first = nodes.find((node): node is Node => node instanceof Node);
  if (!first) throw new Error('un noeud DOM etait attendu.');

  return first;
};

export const Util = {
  guard: guards.guard,
  deprecate: (name: string, replacement?: string): void => {
    console.warn(
      `${name}: cette fonction est depreciee et ne devrait plus etre utilisee.` +
        (replacement ? ` Preferer : ${replacement}.` : ''),
    );
  },

  isArray: guards.isArray,
  isString: guards.isString,
  isBoolean: guards.isBoolean,
  isNumber: guards.isNumber,
  isFunction: guards.isFunction,
  isDate: guards.isDate,
  isError: guards.isError,
  isRegex: guards.isRegex,
  isObject: guards.isObject,
  isColor: guards.isColor,
  isJQuery: guards.isJQuery,

  guardArray: guards.guardArray,
  guardString: guards.guardString,
  guardBoolean: guards.guardBoolean,
  guardNumber: guards.guardNumber,
  guardFunction: guards.guardFunction,
  guardDate: guards.guardDate,
  guardError: guards.guardError,
  guardRegex: guards.guardRegex,
  guardObject: guards.guardObject,
  guardColor: guards.guardColor,
  guardJQuery: guards.guardJQuery,

  isGame: context.isGame,
  isForum: context.isForum,
  isEDC: context.isEDC,
  isWiki: context.isWiki,
  getContext: context.getContext,
};

export const LocalMemory = {
  init: <T>(label: string, defaultValue: T): T => storage.init(label, defaultValue),
  set: <T>(label: string, value: T): void => storage.set(label, value),
  get: <T>(label: string): T | undefined => storage.get<T>(label),
  delete: (label: string): void => storage.remove(label),
  list: (): string[] => storage.keys(),
};

export const UI = {
  Separator: (): unknown => wrap(ui.separator()),

  Menu: (label: string, fn: (event: MouseEvent) => void): unknown => wrap(ui.menu(label, fn)),

  SubMenu: (label: string, fn: (event: MouseEvent) => void, separatorBefore = false): unknown =>
    wrap(ui.subMenu(label, fn, separatorBefore)),

  DropMenu: (label: string, submenu: unknown[]): unknown =>
    wrap(ui.dropMenu(label, submenu.map(unwrapNode))),

  addSubMenuTo: (name: string, element: unknown, index = 0): void =>
    ui.addSubMenuTo(name, unwrapNode(element), index),

  TextButton: (id: string, label: string, fn: (event: MouseEvent) => void): unknown =>
    wrap(ui.textButton(id, label, fn)),

  Button: (id: string, label: string, fn: (event: MouseEvent) => void): unknown =>
    wrap(ui.button(id, label, fn)),

  ColorPicker: (id: string, value: string, fn: (value: string) => void): unknown =>
    wrap(ui.colorPicker(id, value, fn)),

  Tooltip: (text: string, content: unknown): unknown => wrap(ui.tooltip(text, unwrap(content))),

  Checkbox: (
    id: string,
    defaultEnable: boolean,
    onAfterClick?: (checked: boolean) => void,
  ): unknown => wrap(ui.checkbox(id, defaultEnable, onAfterClick)),

  PopUp: (id: string, title: string, content: unknown): void =>
    ui.popUp(id, title, unwrap(content)),

  SideMenu: (id: string, label: string, content: unknown): void =>
    ui.sideMenu(id, label, unwrap(content)),
};

export const TopMenu = {
  get: (): unknown => {
    const node = ui.topMenu();
    return node ? wrap(node) : node;
  },
  add: (element: unknown, index = 0): void => ui.addToTopMenu(unwrapNode(element), index),
};

export const Style = { apply: style.apply };

export const Network = {
  fetch: (args: Parameters<typeof net.request>[0]): Promise<unknown> => net.request(args),
  loadJson: <T>(url: string): Promise<T> => net.json<T>(url),
  loadScript: (url: string, onAfterLoad?: () => void): Promise<void> =>
    net.loadScript(url, onAfterLoad),
  loadSpreadsheet: async (
    sheetId: string,
    tabName: string,
    range: string,
    apiKey: string,
    onLoad: (values: string[][]) => void,
  ): Promise<void> => {
    onLoad(await net.loadSpreadsheet(sheetId, tabName, range, apiKey));
  },
};

export const Chat = {
  sendMessage: chat.sendMessage,
  t: (message: string, decoration: chat.Decoration): string => chat.decorate(message, decoration),
  addCommand: chat.addCommand,
};

export const Deck = {
  checkSkill: (info: number): boolean => deck.hasSkill(info),
  write: (node: unknown, deckId: string): void => deck.write(unwrapNode(node), deckId),
  createCommand: deck.addCommand,
};

/**
 * Ajout historique au prototype jQuery. Des scripts publies s'en servent, il
 * reste donc en place -- mais rien de neuf ne devrait l'utiliser.
 */
export const installJQueryPlugin = (): void => {
  if (!hasJQuery() || typeof $.fn.insertAt === 'function') return;

  $.fn.insertAt = function insertAtPlugin(index: number, element: unknown) {
    const parent = this[0];
    if (parent instanceof Element) {
      const count = parent.children.length;
      const position = index < 0 ? Math.max(0, count + 1 + index) : index;
      parent.insertBefore(unwrapNode(element), parent.children[position] ?? null);
    }
    return this;
  };
};
