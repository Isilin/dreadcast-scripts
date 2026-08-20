import { guardGame, isGame } from '../context.ts';
import { qs } from '../dom.ts';
import { guardColor, guardString } from '../guards.ts';

export type SendCallback = DreadcastChatSendCallback;
export type AfterSendCallback = DreadcastChatAfterSendCallback;

const CHAT_INPUT = '#chatForm .text_chat';
const CHAT_SUBMIT = '#chatForm .text_valider';

const readInput = (): string => qs<HTMLInputElement>(CHAT_INPUT)?.value ?? '';

/**
 * Intercepte l'envoi de messages du jeu.
 *
 * Le jeu n'expose aucun point d'accroche : on enveloppe `MenuChat.prototype.send`
 * une seule fois, en gardant l'original de cote.
 */
export const install = (): void => {
  if (!isGame()) return;
  if (typeof MenuChat === 'undefined') return;
  if (MenuChat.prototype.originalSend !== undefined) return;

  // L'original est rappele avec `.call(this)` plus bas : le `this` n'est
  // jamais perdu.
  // oxlint-disable-next-line typescript/unbound-method
  const original = MenuChat.prototype.send;
  const sendCallbacks: SendCallback[] = [];
  const afterSendCallbacks: AfterSendCallback[] = [];

  MenuChat.prototype.originalSend = original;
  MenuChat.prototype.sendCallbacks = sendCallbacks;
  MenuChat.prototype.afterSendCallbacks = afterSendCallbacks;

  MenuChat.prototype.send = function send(this: DreadcastMenuChat): void {
    const message = readInput();
    const next = (): true => true;
    const abort = (): false => false;

    // Un rappel qui renvoie `abort()` interrompt l'envoi. L'ancienne version
    // levait une erreur a la place : chaque commande personnalisee -- donc le
    // fonctionnement nominal de `addCommand` -- laissait une exception non
    // rattrapee dans la console.
    const allowed = sendCallbacks.every((callback) => callback(message, next, abort));
    if (!allowed) return;

    original.call(this);

    for (const callback of afterSendCallbacks) {
      if (!callback(message)) break;
    }
  };

  MenuChat.prototype.onSend = (callback: SendCallback): void => {
    sendCallbacks.push(callback);
  };

  MenuChat.prototype.onAfterSend = (callback: AfterSendCallback): void => {
    afterSendCallbacks.push(callback);
  };
};

export const onSend = (callback: SendCallback): void => {
  guardGame('chat.onSend');
  nav.getChat().onSend(callback);
};

export const onAfterSend = (callback: AfterSendCallback): void => {
  guardGame('chat.onAfterSend');
  nav.getChat().onAfterSend(callback);
};

/** Ecrit un message dans le chat et l'envoie. */
export const sendMessage = (message: string): void => {
  guardGame('chat.sendMessage');
  guardString('chat.sendMessage', 'message', message);

  const input = qs<HTMLInputElement>(CHAT_INPUT);
  if (input) input.value = message;
  qs<HTMLElement>(CHAT_SUBMIT)?.click();
};

export interface Decoration {
  bold?: boolean;
  italic?: boolean;
  /** Nom de couleur du jeu, ou hexadecimal sans diese. */
  color?: string;
}

/** Habille un message avec les balises de mise en forme du chat. */
export const decorate = (message: string, decoration: Decoration): string => {
  guardString('chat.decorate', 'message', message);
  // La chaine vide vaut "pas de couleur" : la version 1 la refusait au controle
  // alors que le reste de la fonction la traitait comme absente.
  if (decoration.color !== undefined && decoration.color !== '') {
    guardColor('chat.decorate', 'decoration.color', decoration.color);
  }

  let prefix = '';
  let suffix = '';

  if (decoration.bold) {
    prefix += '[b]';
    suffix = `[/b]${suffix}`;
  }

  if (decoration.italic) {
    prefix += '[i]';
    suffix = `[/i]${suffix}`;
  }

  if (decoration.color !== undefined && decoration.color !== '') {
    prefix += `[c=${decoration.color}]`;
    suffix = `[/c]${suffix}`;
  }

  return prefix + message + suffix;
};

/** Commandes reservees par le jeu : les redefinir casserait le chat. */
const RESERVED = ['me', 'y', 'ye', 'yme', 'w', 'we', 'wme', 'roll', ''];

/**
 * Declare une commande de chat `/label`.
 *
 * `handler` renvoie `true` pour laisser le message partir malgre tout, `false`
 * pour l'intercepter.
 */
export const addCommand = (
  label: string,
  handler: (label: string, content: string) => boolean,
): void => {
  guardGame('chat.addCommand');
  guardString('chat.addCommand', 'label', label);

  if (RESERVED.includes(label)) {
    throw new Error(`chat.addCommand: '${label}' est reservee par le jeu.`);
  }

  onSend((message, next, abort) => {
    if (message[0] !== '/') return next();

    const used = message.split(' ')[0]?.slice(1) ?? '';
    if (used !== label || RESERVED.includes(used)) return next();

    const content = message.slice(used.length + 1).trim();

    return handler(used, content) ? next() : abort();
  });
};
