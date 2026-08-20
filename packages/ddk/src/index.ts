// Dreadcast Development Kit -- point d'entree.
//
// Le fichier construit est publie sur Greasy Fork et consomme par `@require`
// depuis le gestionnaire de scripts. Il ne fait rien tout seul : il installe
// les points d'accroche dans le jeu et expose `DC` et `Util`.

import * as context from './context.ts';
import * as dom from './dom.ts';
import * as chat from './game/chat.ts';
import * as deck from './game/deck.ts';
import * as guards from './guards.ts';
import * as legacy from './legacy.ts';
import * as net from './net.ts';
import * as plugin from './plugin.ts';
import * as storage from './storage.ts';
import * as style from './style.ts';
import * as ui from './ui/index.ts';

export type {
  BooleanSetting,
  ColorSetting,
  NumberSetting,
  RegisteredScript,
  ScriptContext,
  ScriptDefinition,
  SelectSetting,
  SettingValue,
  Setting,
  Settings,
  TextSetting,
} from './plugin.ts';

const DC = {
  // --- API v2, native ---
  context,
  dom,
  guards,
  net,
  storage,
  style,
  ui,
  game: { chat, deck },

  /** Declaration d'un script aupres du gestionnaire. Voir plugin.ts. */
  registerScript: plugin.registerScript,

  /** Reserve au gestionnaire de scripts. */
  scripts: {
    setCurrent: plugin.setCurrentScript,
    get: plugin.getRegistration,
    started: plugin.startedScripts,
    take: plugin.takeRegistration,
    run: plugin.runScript,
    defaults: plugin.defaultSettings,
    readSettings: plugin.readSettings,
    writeSettings: plugin.writeSettings,
  },

  // --- API v1, conservee pour les scripts publies ---
  LocalMemory: legacy.LocalMemory,
  Style: legacy.Style,
  TopMenu: legacy.TopMenu,
  UI: legacy.UI,
  Network: legacy.Network,
  Chat: legacy.Chat,
  Deck: legacy.Deck,
};

export type DreadcastKit = typeof DC;
export type DreadcastUtil = typeof legacy.Util;

declare global {
  // eslint-disable-next-line no-var
  var DC: DreadcastKit;
  // eslint-disable-next-line no-var
  var Util: DreadcastUtil & { isDSM?: () => boolean };
}

// Les points d'accroche s'installent au chargement : un script charge plus tard
// doit pouvoir appeler `onSend` sans se soucier de l'ordre.
chat.install();
legacy.installJQueryPlugin();

// Le bundle est une IIFE : sans exposition explicite, `DC` resterait invisible.
// La version 1 s'appuyait sur le fait que `@require` concatene les fichiers
// dans une meme portee, ce qui n'est plus vrai une fois le code empaquete.
// On ecrit dans la portee globale du bac a sable, jamais dans `unsafeWindow` :
// la page du jeu n'a pas a voir ces objets.
const globalScope = globalThis as unknown as Record<string, unknown>;
globalScope['DC'] = DC;
globalScope['Util'] = legacy.Util;

export default DC;
