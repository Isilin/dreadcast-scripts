// Silhouettes personnalisees, lues dans le Google Sheet tenu par les
// animateurs : colonne A l'identifiant du personnage, B son pseudo, C l'URL de
// l'image.
//
// Elles sont appliquees par une feuille de style, une regle par personnage,
// et non en retouchant le DOM a l'ouverture d'une fiche. Le script n'a ainsi
// aucune methode du jeu a remplacer : c'est ce remplacement qui, en rappelant
// `openPersoBox` sur le prototype au lieu de l'instance, vidait les infobulles
// de la fiche RP -- dont celle de la derniere connexion.

export interface SilhouetteIndex {
  /** Identifiant de personnage -> URL. */
  byId: Map<string, string>;
  /** Pseudo en minuscules -> URL. */
  byName: Map<string, string>;
}

/**
 * URL d'image exploitable, ou rien.
 *
 * Le Sheet est saisi a la main : la colonne C contient des cellules vides, des
 * notes, des fragments d'URL. Seules les URL http(s) completes passent.
 *
 * On rend `href`, normalise par le parseur : les guillemets, espaces et
 * retours a la ligne y sont encodes ou retires, si bien que la valeur ne peut
 * pas sortir du `url("...")` ou elle est interpolee.
 */
export const imageUrl = (raw: unknown): string | undefined => {
  if (typeof raw !== 'string' || raw.trim() === '') return undefined;

  try {
    const url = new URL(raw.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch {
    return undefined;
  }
};

const PERSO_ID = /^\d+$/;

/** Indexe les lignes du Sheet. La ligne d'en-tete tombe d'elle-meme : sa colonne C n'est pas une URL. */
export const parseSheet = (rows: readonly (readonly unknown[])[]): SilhouetteIndex => {
  const byId = new Map<string, string>();
  const byName = new Map<string, string>();

  for (const [rawId, rawName, rawUrl] of rows) {
    const url = imageUrl(rawUrl);
    if (url === undefined) continue;

    const id = typeof rawId === 'string' ? rawId.trim() : '';
    if (PERSO_ID.test(id)) byId.set(id, url);

    const name = typeof rawName === 'string' ? rawName.trim().toLowerCase() : '';
    if (name !== '') byName.set(name, url);
  }

  return { byId, byName };
};

export interface Self {
  id: string;
  name: string;
}

/**
 * Silhouette du joueur lui-meme : par son identifiant, puis par son pseudo --
 * la seule cle que la version 1.0 utilisait.
 */
export const ownSilhouette = (index: SilhouetteIndex, self: Self): string | undefined =>
  index.byId.get(self.id.trim()) ?? index.byName.get(self.name.trim().toLowerCase());

const rule = (selector: string, url: string): string =>
  `${selector} { background-image: url("${url}") !important; background-position: 0 0 !important; }`;

/**
 * Une regle par fiche RP connue, plus celles du joueur : son inventaire, et sa
 * propre fiche quand il n'est connu que par son pseudo.
 *
 * `!important` l'emporte sur le `style` en ligne que le jeu pose sur
 * `.personnage_image`. La regle vise l'identifiant de la fenetre : elle
 * s'applique quel que soit le chemin qui l'a ouverte.
 */
export const silhouetteCss = (index: SilhouetteIndex, self?: Self): string => {
  const byId = new Map(index.byId);
  const own = self === undefined ? undefined : ownSilhouette(index, self);
  const selfId = self?.id.trim() ?? '';

  if (own !== undefined && PERSO_ID.test(selfId) && !byId.has(selfId)) byId.set(selfId, own);

  return [
    ...[...byId].map(([id, url]) => rule(`#ib_persoBox_${id} .personnage_image`, url)),
    ...(own === undefined ? [] : [rule('#zone_inventaire .personnage_image', own)]),
  ].join('\n');
};
