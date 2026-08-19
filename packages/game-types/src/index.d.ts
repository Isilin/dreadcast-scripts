/// <reference types="jquery" />

// Declarations ecrites a la main : on ne type que ce dont le DDK et le DCSM ont
// besoin. Le catalogue complet extrait du bundle vit dans
// catalogue/ingame-api.d.ts et n'est pas compile.
//
// Fichier ambiant : ne jamais y ajouter d'import ou d'export de niveau
// superieur, cela le transformerait en module et ferait disparaitre toutes ces
// globales.

/**
 * Rappel appele avant l'envoi d'un message dans le chat.
 *
 * Renvoyer `next()` laisse le message partir, `abort()` l'annule.
 */
type DreadcastChatSendCallback = (message: string, next: () => true, abort: () => false) => boolean;

type DreadcastChatAfterSendCallback = (message: string) => boolean;

/**
 * Menu de chat du jeu. `onSend` / `onAfterSend` ne font pas partie du jeu :
 * ce sont les points d'accroche installes par le DDK sur `MenuChat.prototype`.
 */
interface DreadcastMenuChat {
  send(): void;
  onSend(callback: DreadcastChatSendCallback): void;
  onAfterSend(callback: DreadcastChatAfterSendCallback): void;
}

interface DreadcastMenuMessagerie {
  /**
   * Ouvre la fenetre de redaction. Le jeu accepte deux arguments
   * supplementaires dont l'usage n'a pas ete verifie.
   */
  newMessage(recipient: string, ...rest: unknown[]): void;
}

interface DreadcastNavigator {
  getChat(): DreadcastMenuChat;
  getMessagerie(): DreadcastMenuMessagerie;
  getCarnet(): unknown;
  getInventaire(): unknown;
  getVille(): unknown;
  ouvre(...args: unknown[]): unknown;
  ferme(...args: unknown[]): unknown;
}

interface DreadcastEngine {
  /** Injecte le HTML d'une fenetre et l'affiche. */
  displayDataBox(html: string, update?: boolean): void;
  /** Ferme la fenetre portant cet identifiant. */
  closeDataBox(id: string): void;
  /** Met au premier plan la fenetre contenant cet element. */
  switchDataBox(element: HTMLElement): void;
  regenerateDataBox(id: string, ...rest: unknown[]): void;
  getIdPersonnage(): string;
}

/** Constructeur du menu de chat, dont le DDK etend le prototype. */
interface DreadcastMenuChatConstructor {
  new (...args: unknown[]): DreadcastMenuChat;
  prototype: DreadcastMenuChat & {
    /** Pose par le DDK : `send` d'origine, avant interception. */
    originalSend?: () => void;
    sendCallbacks?: DreadcastChatSendCallback[];
    afterSendCallbacks?: DreadcastChatAfterSendCallback[];
  };
}

declare const engine: DreadcastEngine;
declare const nav: DreadcastNavigator;
declare const MenuChat: DreadcastMenuChatConstructor;
