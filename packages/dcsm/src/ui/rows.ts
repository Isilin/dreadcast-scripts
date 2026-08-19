import DC from '@dreadcast/ddk';
import type { ScriptEntry } from '@dreadcast/registry';

import type { EnabledMap } from '../state.ts';
import { hasSettings, openSettings } from './settings.ts';

const { h } = DC.dom;

const BORDER = '1px solid white';

const cell = (content: Node | null, style: Partial<CSSStyleDeclaration> = {}) =>
  h('td', { style: Object.assign({ padding: '5px 5px 0 0' }, style) }, content);

/**
 * Deux lignes par script : la première porte les commandes, la seconde la
 * description sur toute la largeur.
 */
export const scriptRows = (
  script: ScriptEntry,
  index: number,
  draft: EnabledMap,
): DocumentFragment => {
  const definition = DC.scripts.get(script.id);

  const commands = h(
    'tr',
    {
      style: {
        borderTop: BORDER,
        borderLeft: BORDER,
        borderRight: BORDER,
      },
    },
    h('td', { rowspan: '2', style: { padding: '5px 0 0 5px' } }, String(index)),
    script.icon === ''
      ? h('td', { class: 'short', rowspan: '2', style: { width: '58px' } })
      : h(
          'td',
          { rowspan: '2', style: { padding: '5px' } },
          h('img', { src: script.icon, width: '48', height: '48' }),
        ),
    h(
      'td',
      { style: { padding: '5px 0', minWidth: '120px', textAlign: 'left' } },
      script.experimental ? h('span', { style: { color: 'red' } }, '[DEV]') : null,
      script.experimental ? ' ' : null,
      script.name,
    ),
    h(
      'td',
      { style: { padding: '5px 0', minWidth: '120px', textAlign: 'left' } },
      h('small', null, script.authors),
    ),
    h(
      'td',
      {
        style: { padding: '5px 0', display: 'flex', justifyContent: 'center' },
      },
      DC.ui.tooltip(
        'Activer/Désactiver le script ne perdra pas sa configuration.',
        DC.ui.checkbox(`${script.id}_check`, draft[script.id] === true, (checked) => {
          draft[script.id] = checked;
        }),
      ),
    ),
    // Le bouton n'apparaît que si le script a déclaré un schéma de réglages
    // via DC.registerScript : sans schéma, il n'y a rien à afficher.
    cell(
      definition !== undefined && hasSettings(script.id)
        ? DC.ui.tooltip(
            'Réglages',
            DC.ui.button(`${script.id}_setting`, '<i class="fas fa-cog"></i>', () =>
              openSettings(script, definition),
            ),
          )
        : null,
    ),
    cell(
      script.doc === ''
        ? null
        : DC.ui.tooltip(
            'Documentation',
            DC.ui.button(`${script.id}_doc`, '<i class="fas fa-book"></i>', () =>
              window.open(script.doc, '_blank'),
            ),
          ),
    ),
    cell(
      script.rp === ''
        ? null
        : DC.ui.tooltip(
            'Topic RP',
            DC.ui.button(`${script.id}_rp`, '<div class="gridCenter">RP</div>', () =>
              window.open(script.rp, '_blank'),
            ),
          ),
    ),
    cell(
      script.contact === ''
        ? null
        : DC.ui.tooltip(
            'Contact',
            DC.ui.button(`${script.id}_contact`, '<i class="fas fa-envelope"></i>', () =>
              nav.getMessagerie().newMessage(script.contact),
            ),
          ),
    ),
  );

  const description = h(
    'tr',
    {
      style: {
        borderBottom: BORDER,
        borderLeft: BORDER,
        borderRight: BORDER,
      },
    },
    h(
      'td',
      {
        colspan: '7',
        style: { padding: '0 5px 5px 5px', textAlign: 'left' },
      },
      h('small', null, h('em', { class: 'couleur5' }, script.description)),
    ),
  );

  return DC.dom.frag(commands, description);
};
