import { describe, expect, it } from 'vitest';

import {
  analyse,
  branchName,
  headerChanges,
  marker,
  newDomains,
  parseMarker,
  renderBody,
  renderTitle,
  repin,
  repinnedUrl,
  retireMarker,
  sensitiveDelta,
} from '../../tools/lib/revue.mjs';

const OLD = 'https://update.greasyfork.org/scripts/595206/Agenda.user.js?version=1939188';
const NEW = 'https://update.greasyfork.org/scripts/595206/Agenda.user.js?version=1943170';

const entry = (id: string, url: string) =>
  [
    '  {',
    `    "id": "${id}",`,
    `    "url": ${JSON.stringify(url)},`,
    '    "section": [',
    '      "game"',
    '    ]',
    '  }',
  ].join('\n');

const header = (...directives: string[]) =>
  [
    '// ==UserScript==',
    '// @name         Test',
    ...directives.map((directive) => `// ${directive}`),
    '// ==/UserScript==',
    '',
  ].join('\n');

const ecart = {
  nom: 'Agenda perso',
  id: 'agendaperso',
  scriptId: '595206',
  de: '2.0-solo',
  vers: '2.1-solo',
  epingleeId: '1939188',
  derniereId: '1943170',
  epingleeLe: '2026-09-22T10:11:00.000Z',
  publieeLe: '2026-09-26T09:26:54.000Z',
  catalogueUrl: OLD,
  doc: 'https://www.dreadcast.net/Forum/2-164889-script-agenda-dreadcast',
  section: ['game'],
  category: ['mech'],
};

describe('repinnedUrl', () => {
  it('ne change que la revision', () => {
    expect(repinnedUrl(OLD, '1939188', '1943170')).toBe(NEW);
  });

  it("garde les caracteres d'une URL deja encodee", () => {
    const url = "https://update.greasyfork.org/scripts/17200/Com'back.user.js?version=1074459";
    expect(repinnedUrl(url, '1074459', '2')).toBe(
      "https://update.greasyfork.org/scripts/17200/Com'back.user.js?version=2",
    );
  });

  it("refuse une URL qui n'est pas sur la revision annoncee", () => {
    expect(() => repinnedUrl(OLD, '19391', '1')).toThrow(/n'est pas epinglee/);
  });
});

describe('repin', () => {
  it("remplace l'URL de l'entree et rien d'autre", () => {
    const text = `[\n${entry('a', 'https://example.org/a.user.js?version=1')},\n${entry('agendaperso', OLD)}\n]\n`;
    const result = repin(text, OLD, NEW);

    expect(result).toBe(text.replace(OLD, NEW));
  });

  it('preserve les fins de ligne CRLF', () => {
    const text = `[\r\n${entry('agendaperso', OLD).replaceAll('\n', '\r\n')}\r\n]\r\n`;
    const result = repin(text, OLD, NEW);

    expect(result).toContain(NEW);
    expect(result.split('\r\n')).toHaveLength(text.split('\r\n').length);
  });

  it('echoue si l’URL est absente ou en double', () => {
    expect(() => repin('[]', OLD, NEW)).toThrow(/0 occurrence/);

    const double = `[\n${entry('a', OLD)},\n${entry('b', OLD)}\n]`;
    expect(() => repin(double, OLD, NEW)).toThrow(/2 occurrence/);
  });
});

describe('branchName', () => {
  it('retire accents et caracteres speciaux', () => {
    expect(branchName('séparationsujets')).toBe('catalogue/separationsujets');
    expect(branchName('copyPasteAll')).toBe('catalogue/copypasteall');
    expect(branchName('DC_MapOverlay fouilleur')).toBe('catalogue/dc-mapoverlay-fouilleur');
  });
});

describe('marker', () => {
  it('fait l’aller-retour, accents compris', () => {
    expect(parseMarker(`intro\n${marker('séparationsujets', '42')}\n`)).toEqual({
      id: 'séparationsujets',
      revision: '42',
    });
  });

  it('ne se lit plus une fois retire', () => {
    const body = `${marker('agendaperso', '1943170')}\nCorps.`;

    expect(parseMarker(retireMarker(body))).toBeUndefined();
    expect(retireMarker(body)).toContain('Corps.');
  });

  it('ignore un corps sans marqueur', () => {
    expect(parseMarker('Bumps vitest')).toBeUndefined();
    expect(parseMarker(undefined)).toBeUndefined();
  });
});

describe('headerChanges', () => {
  it('signale une permission ou un domaine ajoute', () => {
    const before = header('@grant GM_getValue', '@match https://www.dreadcast.net/*');
    const after = header(
      '@grant GM_getValue',
      '@grant GM_xmlhttpRequest',
      '@connect example.org',
      '@match https://www.dreadcast.net/*',
    );

    expect(headerChanges(before, after)).toEqual([
      { cle: 'grant', ajouts: ['GM_xmlhttpRequest'], retraits: [] },
      { cle: 'connect', ajouts: ['example.org'], retraits: [] },
    ]);
  });

  it('ignore les directives non surveillees', () => {
    expect(headerChanges(header('@version 1'), header('@version 2'))).toEqual([]);
  });
});

describe('sensitiveDelta', () => {
  it('ne remonte que les hausses', () => {
    const before = 'el.innerHTML = a; el.innerHTML = b; fetch("/x");';
    const after = 'el.innerHTML = a; eval(code); eval(more);';

    expect(sensitiveDelta(before, after)).toEqual([{ motif: 'eval(', avant: 0, apres: 2 }]);
  });

  it('signale un nouvel acces au presse-papiers', () => {
    const after = "navigator.clipboard.writeText(t); document.execCommand('copy');";

    expect(sensitiveDelta('', after)).toEqual([
      { motif: 'navigator.clipboard', avant: 0, apres: 1 },
      { motif: "execCommand('copy')", avant: 0, apres: 1 },
    ]);
  });
});

describe('newDomains', () => {
  it('ignore dreadcast.net et les domaines deja presents', () => {
    const before = 'https://www.dreadcast.net/Main https://cdn.example.org/lib.js';
    const after = `${before} https://evil.example.com/collect https://forum.dreadcast.net/x`;

    expect(newDomains(before, after)).toEqual(['evil.example.com']);
  });
});

describe('analyse et rendu', () => {
  const code = `${header('@grant none')}console.log(1);\n`;

  it('reconnait un contenu identique et le dit dans le titre', () => {
    const resultat = analyse(code, code);
    const memeVersion = { ...ecart, de: '0.6.3', vers: '0.6.3', nom: 'Pimp My Pion' };

    expect(resultat.identique).toBe(true);
    expect(renderTitle(memeVersion, resultat)).toBe(
      'chore(catalogue): repince Pimp My Pion sur la revision 1943170 (0.6.3) -- contenu identique',
    );
  });

  it('titre ordinaire quand la version change', () => {
    const resultat = analyse(code, `${code}// suite\n`);

    expect(resultat.identique).toBe(false);
    expect(renderTitle(ecart, resultat)).toBe(
      'chore(catalogue): repince Agenda perso sur 2.1-solo',
    );
  });

  it('porte le marqueur, le lien de diff et la checklist', () => {
    const body = renderBody(ecart, analyse(code, `${code}// suite\n`));

    expect(parseMarker(body)).toEqual({ id: 'agendaperso', revision: '1943170' });
    expect(body).toContain('https://greasyfork.org/en/scripts/595206/diff?v1=1939188&v2=1943170');
    expect(body).toContain('- [ ] `section` toujours juste');
  });

  it('previent quand la revision epinglee a disparu', () => {
    const resultat = analyse(undefined, code);
    const body = renderBody(ecart, resultat);

    expect(resultat.identique).toBe(false);
    expect(body).toContain('n’est plus publiée');
    expect(body).not.toContain('/diff?');
  });
});
