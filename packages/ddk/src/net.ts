import {
  GM_addStyle,
  GM_deleteValue,
  GM_getValue,
  GM_listValues,
  GM_setClipboard,
  GM_setValue,
  GM_xmlhttpRequest,
  type GmResponseType,
  type GmResponseTypeMap,
  type GmXmlhttpRequestOption,
} from 'monkey';

/**
 * Sans delai maximal, un hote qui ne repond plus laisse la requete en suspens
 * pour toujours. Le DCSM en avait fait l'experience : plus aucun script ne se
 * chargeait tant que la liste distante ne repondait pas.
 */
export const DEFAULT_TIMEOUT = 30_000;

export type RequestOptions<R extends GmResponseType> = Omit<
  GmXmlhttpRequestOption<R>,
  'onload' | 'onerror' | 'ontimeout' | 'onabort'
>;

/**
 * `GM_xmlhttpRequest` en promesse. Resout la reponse, rejette sur erreur,
 * expiration ou annulation.
 *
 * La promesse resout quel que soit le code HTTP : un 404 arrive ici comme une
 * page d'erreur, pas comme un rejet. C'est a l'appelant de valider la charge
 * utile.
 */
export const request = <R extends GmResponseType = 'text'>(
  options: RequestOptions<R>,
): Promise<GmResponseTypeMap[R]> =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest<R>({
      timeout: DEFAULT_TIMEOUT,
      ...options,
      onload: (event) => resolve(event.response),
      onerror: () => reject(new Error(`echec de la requete vers ${options.url}`)),
      ontimeout: () => reject(new Error(`delai depasse pour la requete vers ${options.url}`)),
      onabort: () => reject(new Error(`requete vers ${options.url} annulee`)),
    });
  });

export const text = (url: string, timeout?: number): Promise<string> =>
  request({
    method: 'GET',
    url,
    ...(timeout === undefined ? {} : { timeout }),
  });

export const json = <T>(url: string, timeout?: number): Promise<T> =>
  request<'json'>({
    method: 'GET',
    url,
    responseType: 'json',
    headers: { 'Content-Type': 'application/json' },
    ...(timeout === undefined ? {} : { timeout }),
  }) as Promise<T>;

/**
 * Ce qu'un script charge recoit en plus des globales de la page.
 *
 * Une fonction construite par `new Function` a pour portee globale celle de la
 * page, et non celle du bac a sable du gestionnaire de userscripts. Les
 * globales du jeu -- `$`, `engine`, `nav`, `MenuChat` -- y sont donc visibles,
 * mais rien de ce qui n'existe que dans le bac a sable : ni `DC` et `Util`,
 * poses par le DDK charge en `@require`, ni les fonctions `GM_*`, que le
 * gestionnaire de userscripts passe en parametres au script hote.
 *
 * On les repasse donc explicitement. La liste correspond aux `@grant` du
 * gestionnaire : un script ne recoit rien de plus que ce qu'il aurait obtenu
 * en etant installe seul.
 */
const capabilities = (): Record<string, unknown> => {
  const scope = globalThis as unknown as Record<string, unknown>;

  return {
    DC: scope['DC'],
    Util: scope['Util'],
    GM_getValue,
    GM_setValue,
    GM_deleteValue,
    GM_listValues,
    GM_addStyle,
    GM_setClipboard,
    GM_xmlhttpRequest,
  };
};

/**
 * Execute du code distant.
 *
 * `new Function` plutot qu'un `eval` direct : chaque script recoit sa propre
 * portee de fonction, en mode non strict, comme lorsque le gestionnaire de
 * userscripts l'execute lui-meme. Un `eval` direct depuis ce module l'aurait
 * execute en mode strict -- ce bundle l'est -- et lui aurait ouvert les
 * variables internes du DDK.
 *
 * En contrepartie, il faut lui repasser ce que le bac a sable lui aurait
 * fourni : voir `capabilities`.
 */
export const run = (code: string, sourceUrl?: string): void => {
  const annotated = sourceUrl === undefined ? code : `${code}\n//# sourceURL=${sourceUrl}`;
  const scope = capabilities();

  // C'est precisement le comportement recherche : voir le commentaire de la
  // fonction.
  // oxlint-disable-next-line no-implied-eval
  new Function(...Object.keys(scope), annotated)(...Object.values(scope));
};

export const loadScript = async (url: string, onAfterLoad?: () => void): Promise<void> => {
  run(await text(url), url);
  onAfterLoad?.();
};

/** Lit une plage d'un Google Sheet public via l'API v4. */
export const loadSpreadsheet = async (
  sheetId: string,
  tabName: string,
  range: string,
  apiKey: string,
): Promise<string[][]> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}!${range}?key=${apiKey}`;
  const result = await json<{ values?: string[][] }>(url);
  return result.values ?? [];
};
