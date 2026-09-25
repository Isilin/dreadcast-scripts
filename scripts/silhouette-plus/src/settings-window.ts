import DC from '@dreadcast/ddk';

import { SLOTS, parseCoordinate, type Point } from './positions.ts';
import type { SilhouetteState } from './state.ts';

const { h } = DC.dom;

export const WINDOW_ID = 'silhouettePlus_modal';

/** Animateurs a qui s'adresse une demande de silhouette. */
export const RECIPIENTS = 'Phylène, Izo, Pelagia';

export const REQUEST_SUBJECT = '[HRP] Silhouette';

export const requestMessage = (pseudo: string, id: string): string => `[[ Bonjour,

Je souhaiterais changer ma silhouette.
Pseudo : ${pseudo}
ID : #${id}
Silhouette : <url de la silhouette>
]]`;

export interface SettingsWindowOptions {
  /** Modifie en place, puis signale par `onChange`. */
  state: SilhouetteState;
  /** Appele a chaque modification : sauvegarde et apercu en direct. */
  onChange: () => void;
  /** Ouvre la demande de changement de silhouette. */
  onRequest: () => void;
}

const coordinate = (
  id: string,
  point: Point,
  axis: keyof Point,
  step: number,
  onChange: () => void,
): HTMLInputElement =>
  h('input', {
    id,
    type: 'number',
    value: String(point[axis]),
    step: String(step),
    on: {
      // `input` plutot que `change` : l'emplacement suit chaque frappe, ce qui
      // est tout l'interet de la fenetre.
      input: (event) => {
        const value = parseCoordinate((event.target as HTMLInputElement).value);
        if (value === undefined) return;

        point[axis] = value;
        onChange();
      },
    },
  });

/** Contenu de la fenetre. Les ecouteurs vivent sur ses elements, et partent avec eux. */
export const settingsContent = ({
  state,
  onChange,
  onRequest,
}: SettingsWindowOptions): HTMLElement =>
  h(
    'div',
    { id: 'silhouettePlus_content' },
    h(
      'div',
      { class: 'sp_row' },
      h('span', null, 'Masquer brillance'),
      DC.ui.checkbox('silhouettePlus_shine', state.hideShine, (checked) => {
        state.hideShine = checked;
        onChange();
      }),
    ),
    SLOTS.map((slot) => {
      const point = state.layout[slot.key] ?? { x: slot.x, y: slot.y };
      state.layout[slot.key] = point;

      return h(
        'div',
        { class: 'sp_row' },
        h('span', null, slot.label),
        'X',
        coordinate(`silhouettePlus_${slot.key}_x`, point, 'x', 1, onChange),
        'Y',
        coordinate(`silhouettePlus_${slot.key}_y`, point, 'y', slot.stepY, onChange),
      );
    }),
    DC.ui.textButton('silhouettePlus_request', 'Changer la silhouette', onRequest),
  );

export const openSettingsWindow = (options: SettingsWindowOptions): void => {
  DC.ui.popUp(WINDOW_ID, 'Silhouette+', settingsContent(options));
};
