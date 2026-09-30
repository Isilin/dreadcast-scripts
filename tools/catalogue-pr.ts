#!/usr/bin/env node
// Ouvre une pull request par script du catalogue en retard sur son auteur,
// a la maniere de Dependabot.
//
//   node tools/catalogue-pr.ts [--dry-run] [--catalogue=data/scripts.json]
//
// Pour chaque script dont la revision epinglee n'est plus la derniere publiee :
//
// - une PR existe deja sur la bonne revision et fusionne proprement : rien ;
// - quelqu'un a pousse sur la branche du bot : on n'y touche plus, et on
//   signale par un commentaire une eventuelle nouvelle revision ;
// - sinon : branche `catalogue/<id>` refaite depuis `origin/main`, URL
//   repincee, liste de secours regeneree, push force, PR ouverte ou mise a
//   jour avec un rapport d'aide a la relecture.
//
// Les PR du bot dont le script n'est plus en retard sont fermees. Une PR du
// bot fermee sans fusion vaut refus de sa revision : comme avec Dependabot,
// seule une revision plus recente en rouvre une.
//
// Rien n'est fusionne ici : le catalogue engage la responsabilite du projet,
// la decision reste humaine.
//
// `--dry-run` n'ecrit rien, ni fichier, ni branche, ni PR : il imprime ce qui
// serait fait. Il lit les PR existantes si `gh` est disponible.
//
// Demande `git` et `gh` authentifie (GH_TOKEN). Le jeton doit pouvoir ouvrir
// des PR, ce que le GITHUB_TOKEN de ce depot ne peut pas : la veille passe
// RELEASE_TOKEN (voir .github/workflows/catalogue.yml).
//
// N'utilise que la bibliotheque standard, plus le rendu de la liste de secours
// de @dreadcast/registry, qui n'en demande pas davantage. Node execute ce
// fichier tel quel : pas d'installation, pas de compilation.

import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

import { renderFallback, writeFallback } from '../packages/registry/src/fallback.ts';
import type { Registry } from '../packages/registry/src/schema.ts';
import { fetchRevision, outdated, type Ecart } from './lib/greasyfork.ts';
import {
  analyse,
  BRANCH_PREFIX,
  branchName,
  noteMarker,
  parseMarker,
  renderBody,
  renderCommitMessage,
  renderTitle,
  repin,
  repinnedUrl,
  retireMarker,
  type Marque,
} from './lib/revue.ts';

const LABEL = 'catalogue';
const FALLBACK = 'packages/dcsm/src/fallback.ts';
const BOT_NAME = 'github-actions[bot]';
const BOT_EMAIL = '41898282+github-actions[bot]@users.noreply.github.com';

const DRY_RUN = process.argv.includes('--dry-run');
const CATALOGUE =
  process.argv.find((argument) => argument.startsWith('--catalogue='))?.slice(12) ??
  'data/scripts.json';

const log = (message: string): void => {
  console.error(`catalogue-pr: ${message}`);
};

// Les branches sont faites depuis `origin/main` : un autre catalogue n'a de
// sens que pour un essai a blanc.
if (!DRY_RUN && CATALOGUE !== 'data/scripts.json') {
  log('--catalogue ne se combine qu’avec --dry-run.');
  process.exit(2);
}

/** PR du bot, telle que `gh pr list` la rend, et son marqueur. */
interface BotPr {
  number: number;
  headRefName: string;
  body: string;
  mergeable: string;
  marque: Marque;
}

interface Commit {
  authors?: { login?: string; email?: string; name?: string }[];
}

interface Details {
  commits?: Commit[];
  comments?: { body?: string }[];
}

/** Ce qu'un passage sait avant de traiter les scripts un a un. */
interface Contexte {
  labelDisponible: boolean;
  /** Revisions refusees, `<id>@<revision>` -> numero de la PR fermee. */
  refusees: Map<string, number>;
}

/** Resume ecrit dans le recapitulatif du job GitHub Actions, s'il y en a un. */
const resume: string[] = [];

const run = (command: string, args: string[], input?: string): string =>
  execFileSync(command, args, {
    encoding: 'utf8',
    ...(input === undefined ? {} : { input }),
    stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'inherit'],
  }).trim();

const git = (...args: string[]): string => run('git', args);
const gh = (...args: string[]): string => run('gh', args);

/** Commande qui modifie quelque chose : jamais en dry-run. */
const write = (command: string, args: string[], input?: string): string => {
  if (DRY_RUN) {
    log(`[dry-run] ${command} ${args.join(' ')}`);
    return '';
  }
  return run(command, args, input);
};

/**
 * PR du bot dans un etat donne, avec leur marqueur.
 *
 * Reconnues a leur branche `catalogue/*` et a leur marqueur, pas au label :
 * celui-ci n'est qu'un confort, que le jeton n'a peut-etre pas le droit de
 * creer.
 *
 * Ni commits ni commentaires ici : demandes sur toute la liste, ils font
 * depasser a GitHub sa limite de noeuds GraphQL. `details` les lit PR par PR,
 * seulement quand il faut decider.
 */
const botPullRequests = <T extends { headRefName: string; body: string }>(
  state: 'open' | 'closed',
  fields: string,
): (T & { marque: Marque })[] => {
  let raw: string;

  try {
    raw = gh('pr', 'list', '--state', state, '--limit', '200', '--json', fields);
  } catch (error) {
    if (DRY_RUN) {
      log(`PR ${state} illisibles, on fait comme s'il n'y en avait pas (${String(error)}).`);
      return [];
    }
    throw error;
  }

  return (JSON.parse(raw) as T[]).flatMap((pr) => {
    const marque = parseMarker(pr.body);
    return marque && pr.headRefName.startsWith(BRANCH_PREFIX) ? [{ ...pr, marque }] : [];
  });
};

/**
 * Revisions refusees : une PR du bot fermee sans etre fusionnee. Comme avec
 * Dependabot, fermer une PR ecarte cette revision ; seule une revision plus
 * recente en rouvre une.
 */
const rejectedRevisions = (): Map<string, number> =>
  new Map(
    botPullRequests<{ number: number; headRefName: string; body: string; mergedAt: string | null }>(
      'closed',
      'number,headRefName,body,mergedAt',
    )
      .filter((pr) => !pr.mergedAt)
      .map((pr) => [`${pr.marque.id}@${pr.marque.revision}`, pr.number]),
  );

const isBot = (commit: Commit): boolean =>
  (commit.authors ?? []).every((author) =>
    [author.login, author.email, author.name].some((value) => (value ?? '').includes(BOT_NAME)),
  );

/** Commits et commentaires d'une PR. */
const details = (pr: BotPr): Details =>
  JSON.parse(gh('pr', 'view', String(pr.number), '--json', 'commits,comments')) as Details;

/** Un humain a pousse sur la branche : le bot ne doit plus la reecrire. */
const touchedByHand = (pr: BotPr): boolean =>
  (details(pr).commits ?? []).some((commit) => !isBot(commit));

/** Poste un commentaire, une seule fois par cle. */
const noteOnce = (pr: BotPr, key: string, text: string): void => {
  const marque = noteMarker(key);
  if ((details(pr).comments ?? []).some((comment) => comment.body?.includes(marque))) return;

  write('gh', ['pr', 'comment', String(pr.number), '--body-file', '-'], `${marque}\n${text}`);
};

/** Branche refaite depuis main, avec le repin et la liste de secours. */
const commitRepin = (ecart: Ecart, message: string): string => {
  const branche = branchName(ecart.id);

  // `-f` : un script en echec a mi-parcours ne doit pas laisser ses
  // modifications au suivant.
  git('checkout', '-q', '-f', '-B', branche, 'origin/main');

  const nouvelle = repinnedUrl(ecart.catalogueUrl, ecart.epingleeId, ecart.derniereId);
  const texte = repin(readFileSync(CATALOGUE, 'utf8'), ecart.catalogueUrl, nouvelle);
  writeFileSync(CATALOGUE, texte, 'utf8');
  writeFallback(renderFallback(JSON.parse(texte) as Registry));

  git('add', CATALOGUE, FALLBACK);
  run(
    'git',
    ['-c', `user.name=${BOT_NAME}`, '-c', `user.email=${BOT_EMAIL}`, 'commit', '-q', '-F', '-'],
    message,
  );
  git('push', '-q', '--force-with-lease', 'origin', `${branche}:${branche}`);

  return branche;
};

const traiter = async (ecart: Ecart, pr: BotPr | undefined, contexte: Contexte): Promise<void> => {
  const revisionChangee = pr !== undefined && pr.marque.revision !== ecart.derniereId;
  const refus = contexte.refusees.get(`${ecart.id}@${ecart.derniereId}`);

  if (pr === undefined && refus !== undefined) {
    log(`${ecart.nom} : revision ${ecart.derniereId} refusee (PR #${refus} fermee).`);
    resume.push(`- ${ecart.nom} : révision ${ecart.derniereId} refusée (PR #${refus} fermée).`);
    return;
  }

  if (pr && !revisionChangee && pr.mergeable !== 'CONFLICTING') {
    log(`${ecart.nom} : PR #${pr.number} deja a jour.`);
    resume.push(`- ${ecart.nom} : PR #${pr.number} déjà à jour.`);
    return;
  }

  if (pr && touchedByHand(pr)) {
    if (revisionChangee) {
      noteOnce(
        pr,
        `revision-${ecart.derniereId}`,
        `Une nouvelle révision est publiée en amont : **${ecart.vers}** (${ecart.derniereId}). ` +
          'Cette PR a été modifiée à la main : le bot ne la met plus à jour. ' +
          'Repincer à la main, ou fermer cette PR : le bot en ouvrira une pour la nouvelle révision.',
      );
    } else {
      noteOnce(
        pr,
        'conflit',
        'Cette PR est en conflit avec `main`. Elle a été modifiée à la main : ' +
          'le bot ne la réécrit pas. Résoudre le conflit sur la branche.',
      );
    }
    log(`${ecart.nom} : PR #${pr.number} modifiee a la main, laissee en l'etat.`);
    resume.push(`- ${ecart.nom} : PR #${pr.number} modifiée à la main, laissée en l’état.`);
    return;
  }

  const [avant, apres] = await Promise.all([
    fetchRevision(ecart.versions, ecart.epingleeId),
    fetchRevision(ecart.versions, ecart.derniereId),
  ]);

  if (apres === undefined) {
    throw new Error(`la revision proposee ${ecart.derniereId} est introuvable`);
  }

  const resultat = analyse(avant, apres);
  const titre = renderTitle(ecart, resultat);
  const corps = renderBody(ecart, resultat);

  if (DRY_RUN) {
    console.log(`\n## ${titre}\n\n${corps}`);
    resume.push(
      `- ${ecart.nom} : ${pr ? `PR #${pr.number} serait mise à jour` : 'PR serait ouverte'}.`,
    );
    return;
  }

  const branche = commitRepin(ecart, renderCommitMessage(ecart, resultat));

  if (pr) {
    write('gh', ['pr', 'edit', String(pr.number), '--title', titre, '--body-file', '-'], corps);

    if (revisionChangee) {
      write(
        'gh',
        ['pr', 'comment', String(pr.number), '--body-file', '-'],
        `Révision proposée mise à jour : ${pr.marque.revision} → **${ecart.derniereId}** (${ecart.vers}). ` +
          'Toute relecture antérieure est caduque.',
      );
    }

    log(`${ecart.nom} : PR #${pr.number} mise a jour.`);
    resume.push(`- ${ecart.nom} : PR #${pr.number} mise à jour.`);
    return;
  }

  const url = write(
    'gh',
    [
      'pr',
      'create',
      '--base',
      'main',
      '--head',
      branche,
      '--title',
      titre,
      ...(contexte.labelDisponible ? ['--label', LABEL] : []),
      '--body-file',
      '-',
    ],
    corps,
  );

  log(`${ecart.nom} : PR ouverte, ${url}`);
  resume.push(`- ${ecart.nom} : PR ouverte, ${url}`);
};

// ---------------------------------------------------------------------------

const { ecarts, erreurs, idsEnErreur } = await outdated(CATALOGUE);
for (const erreur of erreurs) log(`API : ${erreur}`);

if (!DRY_RUN) git('fetch', '-q', '--prune', 'origin');

// `gh pr create --label` echoue si le label n'existe pas. Le jeton peut ne pas
// avoir le droit de le creer : les PR s'ouvrent alors sans, le bot les
// retrouvant a leur branche et a leur marqueur.
let labelDisponible = true;

try {
  write('gh', [
    'label',
    'create',
    LABEL,
    '--force',
    '--color',
    '5319e7',
    '--description',
    'Repin automatique du catalogue (tools/catalogue-pr.ts)',
  ]);
} catch (error) {
  labelDisponible = false;
  log(`label '${LABEL}' indisponible, PR ouvertes sans (${String(error)}).`);
}

const prs = new Map(
  botPullRequests<Omit<BotPr, 'marque'>>('open', 'number,headRefName,body,mergeable').map((pr) => [
    pr.marque.id,
    pr,
  ]),
);
const contexte: Contexte = { labelDisponible, refusees: rejectedRevisions() };
const catalogueIds = new Set(
  (JSON.parse(readFileSync(CATALOGUE, 'utf8')) as Registry).map((script) => script.id),
);
let echecs = 0;

try {
  for (const ecart of ecarts) {
    try {
      await traiter(ecart, prs.get(ecart.id), contexte);
    } catch (error) {
      echecs += 1;
      log(`${ecart.nom} : echec, ${String(error)}`);
      resume.push(`- ${ecart.nom} : **échec**, ${String(error)}`);
    }
  }
} finally {
  // La branche de travail ne doit pas rester extraite apres le passage.
  if (!DRY_RUN) git('checkout', '-q', '--detach', 'origin/main');
}

// PR devenues sans objet. Un script dont l'API n'a pas repondu n'est pas
// considere comme a jour : sa PR reste ouverte.
const enRetard = new Set(ecarts.map((ecart) => ecart.id));

for (const [id, pr] of prs) {
  if (enRetard.has(id) || idsEnErreur.includes(id)) continue;

  const raison = catalogueIds.has(id)
    ? 'Le script n’est plus en retard : `data/scripts.json` pointe déjà sur la dernière révision publiée.'
    : 'Le script a été retiré du catalogue.';

  try {
    // Une PR que le bot ferme lui-meme n'est pas un refus : son marqueur est
    // neutralise d'abord, pour que la revision puisse etre reproposee.
    write('gh', ['pr', 'edit', String(pr.number), '--body-file', '-'], retireMarker(pr.body));
    write('gh', ['pr', 'close', String(pr.number), '--delete-branch', '--comment', raison]);
    log(`PR #${pr.number} (${id}) fermee.`);
    resume.push(`- ${id} : PR #${pr.number} fermée, sans objet.`);
  } catch (error) {
    echecs += 1;
    log(`PR #${pr.number} (${id}) : fermeture en echec, ${String(error)}`);
  }
}

if (ecarts.length === 0 && prs.size === 0) resume.push('- Catalogue à jour, aucune PR.');

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `## Mises à jour du catalogue${DRY_RUN ? ' (essai à blanc)' : ''}\n\n${resume.join('\n')}\n`,
  );
}

log(`${ecarts.length} script(s) en retard, ${echecs} echec(s).`);
process.exit(echecs > 0 ? 1 : 0);
