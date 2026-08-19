// Portage des controles de type historiques (`Util.isX` / `Util.guardX`).
//
// La version d'origine s'appuyait sur `$.type()`, deprecie dans jQuery 3 et
// supprime dans jQuery 4. On reprend la meme semantique -- celle de
// `Object.prototype.toString` -- sans dependre de jQuery.

const tag = (value: unknown): string =>
  Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

const isNullish = (value: unknown): boolean => value === undefined || value === null;

const is =
  (expected: string) =>
  (value: unknown, optional = false): boolean =>
    tag(value) === expected || (optional && isNullish(value));

export const isArray = (value: unknown, optional = false): boolean =>
  Array.isArray(value) || (optional && isNullish(value));

export const isString = is('string');
export const isBoolean = is('boolean');
export const isNumber = is('number');
// `typeof` plutot que le tag : `Object.prototype.toString` rend
// `[object AsyncFunction]` pour une fonction async, que l'ancienne version
// rejetait donc a tort.
export const isFunction = (value: unknown, optional = false): boolean =>
  typeof value === 'function' || (optional && isNullish(value));

export const isDate = is('date');
export const isRegex = is('regexp');
export const isObject = is('object');

export const isError = (value: unknown, optional = false): boolean =>
  value instanceof Error || (optional && isNullish(value));

const NAMED_COLORS = ['rouge', 'bleu', 'vert', 'jaune'];
// Les couleurs du jeu s'ecrivent en hexadecimal court ou long, sans diese.
const HEX_COLOR = /^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export const isColor = (value: unknown, optional = false): boolean => {
  if (optional && isNullish(value)) return true;
  if (typeof value !== 'string') return false;
  return NAMED_COLORS.includes(value) || HEX_COLOR.test(value);
};

export const isJQuery = (value: unknown, optional = false): boolean => {
  if (optional && isNullish(value)) return true;
  return typeof $ !== 'undefined' && value instanceof $;
};

/** Leve une erreur si la condition n'est pas remplie. */
export const guard = (condition: boolean, message: string): void => {
  if (!condition) throw new Error(message);
};

type Predicate = (value: unknown, optional?: boolean) => boolean;

const guardWith =
  (predicate: Predicate, expected: string) =>
  (context: string, name: string, value: unknown, optional = false): void =>
    guard(
      predicate(value, optional),
      `${context}: le parametre ${optional ? 'optionnel ' : ''}'${name}' doit etre ${expected}.`,
    );

export const guardArray = guardWith(isArray, 'un tableau');
export const guardString = guardWith(isString, 'une chaine');
export const guardBoolean = guardWith(isBoolean, 'un booleen');
export const guardNumber = guardWith(isNumber, 'un nombre');
export const guardFunction = guardWith(isFunction, 'une fonction');
export const guardDate = guardWith(isDate, 'une date');
export const guardError = guardWith(isError, 'une erreur');
export const guardRegex = guardWith(isRegex, 'une expression reguliere');
export const guardObject = guardWith(isObject, 'un objet');
export const guardColor = guardWith(isColor, 'une couleur');
export const guardJQuery = guardWith(isJQuery, 'un element jQuery');
