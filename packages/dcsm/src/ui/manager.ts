import DC from '@dreadcast/ddk';
import type { Category, ScriptEntry, Section } from '@dreadcast/registry';

import type { ListSource } from '../list.ts';
import * as state from '../state.ts';
import { scriptRows } from './rows.ts';
import { listStatus } from './status.ts';

const { h } = DC.dom;

const MODAL_ID = 'scripts_modal';
const GAME_URL = 'https://www.dreadcast.net/Main';

const SECTIONS = [
  { id: 'all', label: 'Tous' },
  { id: 'game', label: 'Jeu' },
  { id: 'forum', label: 'Forum' },
  { id: 'edc', label: 'EDC' },
];

const CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'mailing', label: 'Messagerie' },
  { id: 'chat', label: 'Chat' },
  { id: 'silhouette', label: 'Silhouette' },
  { id: 'ui', label: 'UI' },
  { id: 'mech', label: 'Mécaniques' },
  { id: 'fix', label: 'Correctifs' },
  { id: 'misc', label: 'Autres' },
];

const radioGroup = (name: string, entries: { id: string; label: string }[]): HTMLElement =>
  h(
    'div',
    { style: { display: 'flex', gap: '1rem', marginBottom: '1rem' } },
    h('legend', { style: { marginRight: '1rem', minWidth: '60px' } }, 'Filtrer :'),
    h(
      'div',
      { style: { display: 'flex', gap: '5%', flexWrap: 'wrap', width: '100%' } },
      entries.map((entry, index) =>
        h(
          'div',
          null,
          h('input', {
            type: 'radio',
            id: `${entry.id}_${name}`,
            name,
            value: entry.id,
            ...(index === 0 ? { checked: true } : {}),
          }),
          h('label', { for: `${entry.id}_${name}` }, entry.label),
        ),
      ),
    ),
  );

const download = (data: Record<string, unknown>): void => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  const anchor = h('a', {
    href: url,
    download: 'dcsm_config.json',
    style: { display: 'none' },
  });

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const upload = (onLoaded: (data: Record<string, unknown>) => void): void => {
  const input = h('input', {
    type: 'file',
    accept: 'application/json',
    style: { display: 'none' },
    on: {
      change: (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const raw = reader.result;
          if (typeof raw !== 'string') return;

          try {
            onLoaded(JSON.parse(raw) as Record<string, unknown>);
          } catch (error) {
            console.error(`DCSM - Fichier de configuration illisible : ${String(error)}`);
          }
        };
        reader.readAsText(file);
      },
    },
  });

  document.body.appendChild(input);
  input.click();
  input.remove();
};

export interface ManagerOptions {
  scripts: ScriptEntry[];
  state: state.ManagerState;
  source: ListSource;
  ts: number;
}

const openManager = (options: ManagerOptions): void => {
  // Copie profonde, et non la référence : fermer la fenêtre sans sauvegarder
  // doit laisser la configuration intacte. La version précédente partageait
  // l'objet, si bien que chaque case cochée était déjà appliquée.
  const draft: state.ManagerState = structuredClone(options.state);

  const tbody = h('tbody');

  const filters: {
    section: Section | 'all';
    category: Category | 'all';
    search: string;
  } = {
    section: 'all',
    category: 'all',
    search: '',
  };

  const renderRows = (): void => {
    tbody.replaceChildren();

    options.scripts
      .filter((script) => draft.devMode || !script.experimental)
      .filter((script) => filters.section === 'all' || script.section.includes(filters.section))
      .filter((script) => filters.category === 'all' || script.category.includes(filters.category))
      .filter(
        (script) =>
          script.name.toLowerCase().includes(filters.search) ||
          script.description.toLowerCase().includes(filters.search),
      )
      .forEach((script, index) => {
        tbody.appendChild(scriptRows(script, index, draft.enabled));
      });
  };

  const devModeSwitch = h(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '1rem',
        marginBottom: '1rem',
      },
    },
    h('p', null, 'Mode développeur'),
    DC.ui.tooltip(
      'Attention, ces scripts sont encore en développement !',
      DC.ui.checkbox('developper_mode_check', draft.devMode, (checked) => {
        draft.devMode = checked;
        renderRows();
      }),
    ),
  );

  const allSwitch = h(
    'div',
    { style: { display: 'flex', gap: '1rem', marginBottom: '1rem' } },
    h('p', null, 'Tout désactiver'),
    DC.ui.checkbox('scripts_all_check', draft.allDisabled, (checked) => {
      draft.allDisabled = checked;
    }),
  );

  const search = h('input', {
    id: 'search_script',
    name: 'search_script',
    type: 'text',
    size: '50',
    style: { color: 'white' },
  });

  const table = h(
    'div',
    {
      style: {
        overflowY: 'scroll',
        overflowX: 'hidden',
        maxHeight: '350px',
      },
    },
    h(
      'table',
      {
        style: {
          borderCollapse: 'collapse',
          width: '100%',
          border: '1px solid white',
          padding: '5px',
          fontSize: '15px',
          textAlign: 'center',
        },
      },
      h(
        'thead',
        null,
        h('th', { scope: 'col', style: { padding: '5px 0 5px 5px' } }, '#'),
        h('th', { class: 'short', style: { width: '58px' } }),
        h('th', { scope: 'col', style: { padding: '5px 0' } }, 'Nom'),
        h('th', { scope: 'col', style: { padding: '5px 0' } }, 'Auteurs'),
        h('th', { scope: 'col', style: { padding: '5px 0' } }, 'Actif'),
        h('th', { class: 'short', style: { width: '40px' } }),
        h('th', { class: 'short', style: { width: '40px' } }),
        h('th', { class: 'short', style: { width: '40px' } }),
        h('th', { class: 'short', style: { width: '40px' } }),
      ),
      tbody,
    ),
  );

  const configButtons = h(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'end',
        gap: '1rem',
        marginBottom: '1rem',
      },
    },
    DC.ui.textButton('config_reset', '<i class="fas fa-undo"></i> Réinitialiser', () => {
      state.reset();
      location.replace(GAME_URL);
    }),
    DC.ui.textButton(
      'config_import',
      '<i class="fas fa-upload"></i> Importer la configuration',
      () => {
        upload((data) => {
          state.reset();
          state.importConfig(data);
          location.replace(GAME_URL);
        });
      },
    ),
    DC.ui.textButton(
      'config_export',
      '<i class="fas fa-download"></i> Exporter la configuration',
      () => download(state.exportConfig()),
    ),
  );

  const content = h(
    'div',
    { style: { color: 'white' } },
    listStatus(options.source, options.ts),
    devModeSwitch,
    h(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between' } },
      allSwitch,
      h(
        'div',
        { style: { display: 'flex', gap: '1rem', marginBottom: '1rem' } },
        h('label', { for: 'search_script' }, 'Recherche'),
        search,
      ),
    ),
    radioGroup('section', SECTIONS),
    radioGroup('category', CATEGORIES),
    table,
    DC.ui.textButton('scripts_refresh', 'Sauvegarder', () => {
      state.save(draft);
      // `replace` plutôt que `reload` : sur Chrome, un rechargement ici
      // rejoue la dernière requête au lieu de repartir de la page du jeu.
      location.replace(GAME_URL);
    }),
    h(
      'p',
      null,
      h(
        'em',
        { class: 'couleur5' },
        '⚠ Sauvegarder votre configuration va rafraîchir la page.',
        h('br'),
        'Pensez à sauvegarder votre travail en cours avant.',
      ),
    ),
    configButtons,
  );

  // Les écouteurs vivent sur la fenêtre, pas sur `document` : ils disparaissent
  // avec elle. La version précédente en empilait un jeu complet à chaque
  // ouverture, sur des contenus déjà détruits.
  DC.dom.on(content, 'change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    if (target.name === 'section') filters.section = target.value as Section | 'all';
    else if (target.name === 'category') filters.category = target.value as Category | 'all';
    else return;

    renderRows();
  });

  DC.dom.on(content, 'input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.name !== 'search_script') {
      return;
    }

    filters.search = target.value.toLowerCase();
    renderRows();
  });

  renderRows();

  DC.ui.popUp(MODAL_ID, 'Scripts & Skins', content);
};

/** Ajoute l'entrée « Scripts & Skins » au menu Paramètres. */
export const installMenu = (options: ManagerOptions): void => {
  DC.ui.addSubMenuTo(
    'Paramètres ▾',
    DC.ui.subMenu('Scripts & Skins', () => openManager(options), true),
    5,
  );
};

/** Ouvre la fenêtre directement, sans passer par le menu. Utile aux tests. */
export { openManager };
