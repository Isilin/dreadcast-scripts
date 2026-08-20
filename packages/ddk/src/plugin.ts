import { getContext, type GameContext } from './context.ts';
import { namespace, type Namespace } from './storage.ts';

interface SettingBase {
  key: string;
  label: string;
  /** Texte d'aide affiche sous le champ. */
  help?: string;
}

export interface BooleanSetting extends SettingBase {
  type: 'boolean';
  default: boolean;
}

export interface NumberSetting extends SettingBase {
  type: 'number';
  default: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface TextSetting extends SettingBase {
  type: 'text';
  default: string;
  placeholder?: string;
}

export interface ColorSetting extends SettingBase {
  type: 'color';
  default: string;
}

export interface SelectSetting extends SettingBase {
  type: 'select';
  default: string;
  options: { value: string; label: string }[];
}

export type Setting = BooleanSetting | NumberSetting | TextSetting | ColorSetting | SelectSetting;

export type SettingValue = boolean | number | string;
export type Settings = Record<string, SettingValue>;

export interface ScriptContext {
  /** Identifiant du script, tel que declare dans data/scripts.json. */
  id: string;
  context: GameContext;
  /** Stockage persistant cloisonne : voir storage.namespace(). */
  storage: Namespace;
  /** Valeurs courantes, defauts du schema compris. */
  settings: Settings;
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export interface ScriptDefinition {
  /**
   * Identifiant du script. Facultatif : quand le gestionnaire est aux
   * commandes, c'est celui du catalogue qui fait foi.
   */
  id?: string;
  /** Schema des reglages, rendu par le gestionnaire. */
  settings?: Setting[];
  init: (context: ScriptContext) => void | Promise<void>;
}

export interface RegisteredScript extends ScriptDefinition {
  id: string;
}

// `pending` recoit les enregistrements ; `started` garde ceux dont `init` a
// ete appele, pour que le gestionnaire puisse encore lire leur schema de
// reglages une fois le script demarre.
const pending = new Map<string, RegisteredScript>();
const started = new Map<string, RegisteredScript>();

let currentId: string | undefined;

/**
 * Declare quel script du catalogue est en cours d'execution.
 *
 * Appele par le gestionnaire juste avant d'evaluer le code : c'est ce qui
 * permet a un script de s'enregistrer sans repeter son identifiant, et au
 * gestionnaire de retrouver l'enregistrement sous la cle du catalogue.
 */
export const setCurrentScript = (id?: string): void => {
  currentId = id;
};

/**
 * Declare un script aupres du gestionnaire.
 *
 * Un script qui s'enregistre n'est plus execute au chargement : c'est le
 * gestionnaire qui appelle son `init`, avec son stockage et ses reglages. Les
 * scripts qui ne l'appellent pas continuent de s'executer directement, comme
 * avant.
 */
export const registerScript = (definition: ScriptDefinition): void => {
  if (typeof definition?.init !== 'function') {
    throw new Error("registerScript: 'init' est absent.");
  }

  const declared = definition.id;
  const id = currentId ?? declared;

  if (typeof id !== 'string' || id === '') {
    throw new Error(
      "registerScript: 'id' est absent, et aucun script du catalogue n'est en cours de chargement.",
    );
  }

  if (declared !== undefined && currentId !== undefined && declared !== currentId) {
    console.warn(
      `registerScript: '${declared}' est enregistre sous '${currentId}', l'identifiant du catalogue.`,
    );
  }

  pending.set(id, { ...definition, id });
};

/** Enregistrement d'un script, qu'il soit deja demarre ou seulement declare. */
export const getRegistration = (id: string): RegisteredScript | undefined =>
  started.get(id) ?? pending.get(id);

/** Scripts demarres via l'API v2, dans leur ordre de demarrage. */
export const startedScripts = (): RegisteredScript[] => [...started.values()];

/** Retire et renvoie l'enregistrement : le gestionnaire consomme la file. */
export const takeRegistration = (id: string): RegisteredScript | undefined => {
  const definition = pending.get(id);
  pending.delete(id);
  return definition;
};

/** Valeurs par defaut issues du schema. */
export const defaultSettings = (definition: ScriptDefinition): Settings =>
  Object.fromEntries((definition.settings ?? []).map((setting) => [setting.key, setting.default]));

const SETTINGS_KEY = 'settings';

export const readSettings = (definition: RegisteredScript): Settings => ({
  ...defaultSettings(definition),
  ...namespace(definition.id).get<Settings>(SETTINGS_KEY),
});

export const writeSettings = (id: string, settings: Settings): void => {
  namespace(id).set(SETTINGS_KEY, settings);
};

/** Construit le contexte d'execution d'un script et appelle son `init`. */
export const runScript = async (definition: RegisteredScript): Promise<void> => {
  const prefix = `[${definition.id}]`;

  started.set(definition.id, definition);

  await definition.init({
    id: definition.id,
    context: getContext(),
    storage: namespace(definition.id),
    settings: readSettings(definition),
    log: (...args) => console.info(prefix, ...args),
    warn: (...args) => console.warn(prefix, ...args),
    error: (...args) => console.error(prefix, ...args),
  });
};
