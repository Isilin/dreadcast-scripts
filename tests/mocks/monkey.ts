// Remplace le module client de vite-plugin-monkey dans les tests.
//
// En production, `monkey` expose les fonctions `GM_*` que le gestionnaire de
// userscripts injecte. Ici, elles sont simulees en memoire : c'est ce qui rend
// le DDK et le DCSM testables hors navigateur.

export interface XhrRequest {
  method?: string;
  url: string;
  responseType?: string;
  timeout?: number;
  headers?: Record<string, string>;
  onload?: (event: { response: unknown; status: number }) => void;
  onerror?: (event: unknown) => void;
  ontimeout?: (event: unknown) => void;
  onabort?: (event: unknown) => void;
}

export type Responder = (
  request: XhrRequest,
) => { response: unknown; status?: number } | Promise<{ response: unknown; status?: number }>;

const store = new Map<string, unknown>();

let clipboard = '';

/** Dernier contenu passe a GM_setClipboard, pour les assertions. */
export const readClipboard = (): string => clipboard;

let responder: Responder = () => {
  throw new Error('aucune reponse HTTP simulee : appeler setResponder() dans le test.');
};

/** Vide la memoire persistante simulee entre deux tests. */
export const resetStore = (entries: Record<string, unknown> = {}): void => {
  store.clear();
  clipboard = '';
  for (const [key, value] of Object.entries(entries)) store.set(key, value);
};

/** Etat brut de la memoire simulee, pour les assertions. */
export const snapshot = (): Record<string, unknown> => Object.fromEntries(store.entries());

/** Definit la reponse renvoyee par GM_xmlhttpRequest. */
export const setResponder = (next: Responder): void => {
  responder = next;
};

/** Fait echouer toute requete, comme une source injoignable. */
export const setOffline = (reason = 'hote injoignable'): void => {
  responder = () => {
    throw new Error(reason);
  };
};

export const GM_getValue = (key: string): unknown => store.get(key);

export const GM_setValue = (key: string, value: unknown): void => {
  // Le stockage des gestionnaires de userscripts serialise les valeurs : on
  // reproduit la copie, sans quoi les tests partageraient des references que
  // la vraie implementation n'aurait pas partagees.
  store.set(key, structuredClone(value));
};

export const GM_deleteValue = (key: string): void => {
  store.delete(key);
};

export const GM_listValues = (): string[] => [...store.keys()];

export const GM_setClipboard = (data: string): void => {
  clipboard = data;
};

export const GM_addStyle = (css: string): HTMLStyleElement => {
  const node = document.createElement('style');
  node.textContent = css;
  document.head.appendChild(node);
  return node;
};

export const GM_xmlhttpRequest = (request: XhrRequest): { abort: () => void } => {
  void (async () => {
    try {
      const { response, status = 200 } = await responder(request);
      request.onload?.({ response, status });
    } catch (error) {
      if (String(error).includes('timeout')) request.ontimeout?.(error);
      else request.onerror?.(error);
    }
  })();

  return { abort: () => undefined };
};

export const unsafeWindow = globalThis;
