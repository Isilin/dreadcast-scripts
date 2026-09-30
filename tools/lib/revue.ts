// Preparation des pull requests de repin du catalogue : modification de
// data/scripts.json, analyse du code amont, titres et corps de PR.
//
// Tout ici est pur : pas de reseau, pas de git. tools/catalogue-pr.ts
// orchestre, ce module calcule -- et c'est lui que les tests couvrent.
//
// L'analyse n'est pas une relecture. Elle pointe ce qu'un relecteur doit
// regarder en premier (une permission de plus, un appel reseau qui apparait),
// mais ne dit jamais qu'une revision est saine.
//
// N'utilise que la bibliotheque standard.

import { createHash } from 'node:crypto';

import type { Ecart } from './greasyfork.ts';

/** Prefixe des branches ouvertes par le bot. */
export const BRANCH_PREFIX = 'catalogue/';

/** Ce que le rendu lit d'un ecart : tout sauf la liste des versions. */
export type EcartRendu = Omit<Ecart, 'versions' | 'catalogueUrl'>;

export interface Marque {
  id: string;
  revision: string;
}

export interface HeaderChange {
  cle: string;
  ajouts: string[];
  retraits: string[];
}

export interface SensitiveHit {
  motif: string;
  avant: number;
  apres: number;
}

export interface Empreinte {
  taille: number;
  sha256: string;
}

export interface Analyse {
  /** Absente quand l'auteur a supprime la revision epinglee. */
  avant: Empreinte | undefined;
  apres: Empreinte;
  identique: boolean;
  entete: HeaderChange[];
  sensibles: SensitiveHit[];
  domaines: string[];
}

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

/** URL du catalogue repincee sur une autre revision, le reste intact. */
export const repinnedUrl = (url: string, from: string, to: string): string => {
  const pattern = new RegExp(`([?&]version=)${from}(?=&|#|$)`);

  if (!pattern.test(url)) {
    throw new Error(`l'URL ${url} n'est pas epinglee sur la revision ${from}`);
  }

  return url.replace(pattern, `$1${to}`);
};

/**
 * Remplace l'URL d'une entree dans le texte de data/scripts.json.
 *
 * On travaille sur le texte et non sur le JSON reserialise : tout le reste du
 * fichier doit rester au bit pres, fins de ligne comprises. Une
 * reserialisation a deja reecrit le fichier entier dans un commit de repin, et
 * rendu son diff illisible.
 */
export const repin = (text: string, oldUrl: string, newUrl: string): string => {
  const before = `"url": ${JSON.stringify(oldUrl)}`;
  const count = text.split(before).length - 1;

  if (count !== 1) {
    throw new Error(`${count} occurrence(s) de ${oldUrl} dans le catalogue, 1 attendue`);
  }

  return text.replace(before, () => `"url": ${JSON.stringify(newUrl)}`);
};

/**
 * Branche du bot pour un script. Les identifiants du catalogue portent parfois
 * des accents (`séparationsujets`) : on les retire pour garder des noms de
 * branche sans surprise.
 */
export const branchName = (id: string): string =>
  BRANCH_PREFIX +
  id
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ---------------------------------------------------------------------------
// Marqueurs
// ---------------------------------------------------------------------------

/**
 * Le bot retrouve ses pull requests par ce commentaire cache, pas par le nom
 * de branche : il porte l'identifiant exact du script et la revision proposee.
 */
export const marker = (id: string, revision: string): string =>
  `<!-- catalogue-bot id=${encodeURIComponent(id)} revision=${revision} -->`;

export const parseMarker = (body: string | undefined): Marque | undefined => {
  const found = /<!-- catalogue-bot id=(\S+) revision=(\d+) -->/.exec(body ?? '');
  if (!found) return undefined;

  return { id: decodeURIComponent(found[1] ?? ''), revision: found[2] ?? '' };
};

/**
 * Corps de PR dont le marqueur ne se lit plus. Une PR du bot fermee sans
 * fusion vaut refus de sa revision ; quand c'est le bot qui la ferme, faute
 * d'objet, il neutralise d'abord le marqueur pour ne pas passer pour un refus.
 */
export const retireMarker = (body: string | undefined): string =>
  (body ?? '').replace(/(<!-- catalogue-bot id=\S+ revision=\d+) -->/, '$1 sans-objet -->');

/** Marqueur d'un commentaire, pour ne jamais poster deux fois le meme. */
export const noteMarker = (key: string): string => `<!-- catalogue-bot note=${key} -->`;

// ---------------------------------------------------------------------------
// Analyse du code amont
// ---------------------------------------------------------------------------

/** Directives d'en-tete qui changent ce qu'un script a le droit de faire. */
export const WATCHED_KEYS = [
  'grant',
  'connect',
  'require',
  'resource',
  'match',
  'include',
  'exclude',
  'run-at',
  'inject-into',
  'sandbox',
] as const;

/** Directives de l'en-tete `==UserScript==`, par cle. */
export const parseHeader = (code: string | undefined): Map<string, string[]> => {
  const header = new Map<string, string[]>();
  const block = /\/\/\s*==UserScript==([\s\S]*?)\/\/\s*==\/UserScript==/.exec(code ?? '');
  if (!block) return header;

  for (const line of (block[1] ?? '').split(/\r?\n/)) {
    const directive = /^\s*\/\/\s*@(\S+)\s*(.*?)\s*$/.exec(line);
    if (!directive) continue;

    const [, key = '', value = ''] = directive;
    header.set(key, [...(header.get(key) ?? []), value]);
  }

  return header;
};

/** Valeurs ajoutees ou retirees sur les directives surveillees. */
export const headerChanges = (before: string | undefined, after: string): HeaderChange[] => {
  const old = parseHeader(before);
  const next = parseHeader(after);

  return WATCHED_KEYS.flatMap((key) => {
    const avant = new Set(old.get(key) ?? []);
    const apres = new Set(next.get(key) ?? []);
    const ajouts = [...apres].filter((value) => !avant.has(value));
    const retraits = [...avant].filter((value) => !apres.has(value));

    return ajouts.length + retraits.length > 0 ? [{ cle: key, ajouts, retraits }] : [];
  });
};

/** Motifs a regarder en priorite quand ils se multiplient. */
export const SENSITIVE_PATTERNS: readonly { motif: string; regex: RegExp }[] = [
  { motif: 'fetch(', regex: /\bfetch\s*\(/g },
  { motif: 'XMLHttpRequest', regex: /\bXMLHttpRequest\b/g },
  { motif: 'GM_xmlhttpRequest', regex: /\bGM_xmlhttpRequest\b/g },
  { motif: 'GM.xmlHttpRequest', regex: /\bGM\.xmlHttpRequest\b/g },
  { motif: 'WebSocket', regex: /\bWebSocket\b/g },
  { motif: 'sendBeacon', regex: /\bsendBeacon\b/g },
  { motif: 'EventSource', regex: /\bEventSource\b/g },
  { motif: 'eval(', regex: /\beval\s*\(/g },
  { motif: 'new Function', regex: /\bnew\s+Function\b/g },
  { motif: 'import(', regex: /\bimport\s*\(/g },
  { motif: 'document.cookie', regex: /\bdocument\.cookie\b/g },
  { motif: 'localStorage', regex: /\blocalStorage\b/g },
  { motif: 'sessionStorage', regex: /\bsessionStorage\b/g },
  { motif: 'indexedDB', regex: /\bindexedDB\b/g },
  { motif: 'navigator.clipboard', regex: /\bnavigator\.clipboard\b/g },
  { motif: "execCommand('copy')", regex: /\bexecCommand\s*\(\s*['"](copy|cut|paste)['"]/g },
  { motif: 'innerHTML', regex: /\binnerHTML\b/g },
  { motif: 'insertAdjacentHTML', regex: /\binsertAdjacentHTML\b/g },
  { motif: 'document.write', regex: /\bdocument\.write(ln)?\b/g },
  { motif: 'atob(', regex: /\batob\s*\(/g },
  { motif: 'fromCharCode', regex: /\bfromCharCode\b/g },
];

const count = (code: string | undefined, regex: RegExp): number =>
  (code ?? '').match(regex)?.length ?? 0;

/** Motifs sensibles dont le nombre d'occurrences augmente. */
export const sensitiveDelta = (before: string | undefined, after: string): SensitiveHit[] =>
  SENSITIVE_PATTERNS.flatMap(({ motif, regex }) => {
    const avant = count(before, regex);
    const apres = count(after, regex);
    return apres > avant ? [{ motif, avant, apres }] : [];
  });

const hostsOf = (code: string | undefined): Set<string> =>
  new Set(
    [...(code ?? '').matchAll(/https?:\/\/([a-z0-9.-]+)/gi)].map(([, host = '']) =>
      host.toLowerCase(),
    ),
  );

/** Domaines cites par la nouvelle revision et absents de l'ancienne. */
export const newDomains = (before: string | undefined, after: string): string[] => {
  const old = hostsOf(before);

  return [...hostsOf(after)]
    .filter((host) => !old.has(host))
    .filter((host) => host !== 'dreadcast.net' && !host.endsWith('.dreadcast.net'))
    .sort((a, b) => a.localeCompare(b));
};

const fingerprint = (code: string): Empreinte => ({
  taille: Buffer.byteLength(code, 'utf8'),
  sha256: createHash('sha256').update(code).digest('hex'),
});

/**
 * Analyse d'une revision proposee face a la revision epinglee. `before` vaut
 * undefined quand l'auteur a supprime la revision epinglee : il n'y a alors
 * rien a comparer.
 */
export const analyse = (before: string | undefined, after: string): Analyse => {
  const avant = before === undefined ? undefined : fingerprint(before);
  const apres = fingerprint(after);

  return {
    avant,
    apres,
    identique: avant !== undefined && avant.sha256 === apres.sha256,
    entete: headerChanges(before, after),
    sensibles: sensitiveDelta(before, after),
    domaines: newDomains(before, after),
  };
};

// ---------------------------------------------------------------------------
// Rendu
// ---------------------------------------------------------------------------

const dateFR = (iso: string | undefined): string =>
  iso === undefined ? '?' : new Date(iso).toLocaleDateString('fr-FR', { timeZone: 'UTC' });

const tailleFR = (octets: number | undefined): string =>
  octets === undefined
    ? '?'
    : `${(octets / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Ko`;

/**
 * Titre de la PR, repris tel quel comme sujet du commit. Sans accents, comme
 * les autres commits du depot.
 */
export const renderTitle = (ecart: EcartRendu, resultat: Analyse): string => {
  const cible =
    ecart.de === ecart.vers ? `la revision ${ecart.derniereId} (${ecart.vers})` : ecart.vers;

  return (
    `chore(catalogue): repince ${ecart.nom} sur ${cible}` +
    (resultat.identique ? ' -- contenu identique' : '')
  );
};

export const renderCommitMessage = (ecart: EcartRendu, resultat: Analyse): string =>
  [
    renderTitle(ecart, resultat),
    '',
    `Revision Greasy Fork ${ecart.epingleeId} (${ecart.de}) -> ${ecart.derniereId} ` +
      `(${ecart.vers}), publiee le ${dateFR(ecart.publieeLe)}.`,
    ...(resultat.identique ? ['Contenu identique octet pour octet a la revision epinglee.'] : []),
    'Liste de secours regeneree.',
    '',
    'Ouvert par tools/catalogue-pr.ts : relire le code amont avant de fusionner.',
    '',
  ].join('\n');

const code = (value: string): string => `\`${value.replaceAll('`', "'")}\``;

export const renderBody = (ecart: EcartRendu, resultat: Analyse): string => {
  const { avant, apres } = resultat;
  const greasyfork = `https://greasyfork.org/en/scripts/${ecart.scriptId}`;
  const lignes = [
    marker(ecart.id, ecart.derniereId),
    '',
    `Mise à jour de **${ecart.nom}** (${code(ecart.id)}), relevée par la veille du catalogue ` +
      '(`.github/workflows/catalogue.yml`).',
    '',
    '> [!IMPORTANT]',
    '> Le catalogue engage la responsabilité du projet : relire le code amont avant de fusionner.',
    '> Fusionner déploie : le gestionnaire lit `data/scripts.json` sur `main`.',
    '',
    '| | Épinglée | Proposée |',
    '|---|---|---|',
    `| Version | ${ecart.de} | ${ecart.vers} |`,
    `| Révision | ${ecart.epingleeId} | ${ecart.derniereId} |`,
    `| Publiée le | ${dateFR(ecart.epingleeLe)} | ${dateFR(ecart.publieeLe)} |`,
    `| Taille | ${tailleFR(avant?.taille)} | ${tailleFR(apres.taille)} |`,
    `| SHA-256 | ${avant ? code(avant.sha256.slice(0, 12)) : 'introuvable'} | ${code(apres.sha256.slice(0, 12))} |`,
    '',
  ];

  if (resultat.identique) {
    lignes.push(
      '**Contenu identique octet pour octet** à la révision épinglée : seule l’URL change.',
      '',
    );
  }

  if (avant === undefined) {
    lignes.push(
      '> [!WARNING]',
      '> La révision épinglée n’est plus publiée (supprimée par son auteur ?). Aucune',
      '> comparaison possible : relire la révision proposée en entier.',
      '',
    );
  }

  lignes.push('### En-tête', '');
  if (resultat.entete.length === 0) {
    lignes.push(`Aucun changement sur ${WATCHED_KEYS.map((key) => `\`@${key}\``).join(', ')}.`);
  } else {
    for (const { cle, ajouts, retraits } of resultat.entete) {
      const details = [
        ...ajouts.map((value) => `+ ${code(value)}`),
        ...retraits.map((value) => `− ${code(value)}`),
      ];
      lignes.push(`- \`@${cle}\` : ${details.join(', ')}`);
    }
  }

  lignes.push('', '### Motifs à regarder', '');
  if (resultat.sensibles.length === 0 && resultat.domaines.length === 0) {
    lignes.push('Aucun motif sensible en hausse, aucun nouveau domaine.');
  } else {
    if (resultat.sensibles.length > 0) {
      lignes.push('| Motif | Avant | Après |', '|---|---|---|');
      for (const { motif, avant: n, apres: m } of resultat.sensibles) {
        lignes.push(`| ${code(motif)} | ${n} | ${m} |`);
      }
      lignes.push('');
    }
    if (resultat.domaines.length > 0) {
      lignes.push(`Nouveaux domaines cités : ${resultat.domaines.map(code).join(', ')}.`);
    }
  }

  lignes.push(
    '',
    '### Liens',
    '',
    ...(avant === undefined
      ? []
      : [
          `- [Diff sur Greasy Fork](${greasyfork}/diff?v1=${ecart.epingleeId}&v2=${ecart.derniereId})`,
        ]),
    `- [Historique des versions](${greasyfork}/versions)`,
    ...(ecart.doc ? [`- [Fil du forum](${ecart.doc})`] : []),
    '',
    '### Avant de fusionner',
    '',
    '- [ ] Diff relu : pas de comportement caché, pas d’envoi de données.',
    `- [ ] \`section\` toujours juste (aujourd’hui ${ecart.section.map(code).join(', ')}) : ` +
      'une nouvelle fonction peut viser un autre contexte (`game`, `forum`, `edc`, `wiki`).',
    `- [ ] \`description\` et \`category\` (aujourd’hui ${ecart.category.map(code).join(', ')}) toujours justes.`,
    '- [ ] `experimental` toujours juste.',
    '',
    'Pour corriger l’entrée, ajouter un commit sur cette branche : le bot ne la réécrira plus. ' +
      'Fermer cette PR sans la fusionner refuse cette révision : le bot n’en rouvrira une qu’à la suivante.',
    '',
    '---',
    '<sub>Ouverte par `tools/catalogue-pr.ts`. Une nouvelle révision en amont met cette PR à jour ; ' +
      'elle est fermée si le script n’est plus en retard.</sub>',
    '',
  );

  return lignes.join('\n');
};
