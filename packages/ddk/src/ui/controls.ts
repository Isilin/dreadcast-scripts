import { h, type Child } from '../dom.ts';
import { apply } from '../style.ts';

/** Separateur de menu. */
export const separator = (): HTMLLIElement => h('li', { class: 'separator' });

export const textButton = (
  id: string,
  label: string,
  onClick: (event: MouseEvent) => void,
): HTMLDivElement =>
  h('div', {
    id,
    class: 'btnTxt',
    html: label,
    on: { click: onClick as EventListener },
  });

export const button = (
  id: string,
  label: string,
  onClick: (event: MouseEvent) => void,
): HTMLDivElement =>
  h(
    'div',
    { id, class: 'btn add link infoAide', on: { click: onClick as EventListener } },
    h('div', { class: 'gridCenter', html: label }),
  );

export const colorPicker = (
  id: string,
  value: string,
  onChange: (value: string) => void,
): HTMLInputElement =>
  h('input', {
    id,
    type: 'color',
    value,
    on: {
      input: (event) => onChange((event.target as HTMLInputElement).value),
    },
  });

const TOOLTIP_CSS = `
.tooltip {
  position: relative;
  display: inline-block;
}
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: rgba(24, 24, 24, 0.95);
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  font-size: 1rem;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
`;

/** Enrobe un contenu d'une infobulle affichee au survol. */
export const tooltip = (text: string, content: Child): HTMLDivElement => {
  apply(TOOLTIP_CSS, 'dc-tooltip');

  return h('div', { class: 'tooltip' }, content, h('span', { class: 'tooltiptext' }, text));
};

const CHECKBOX_CSS = `
.dc_ui_checkbox {
  cursor: pointer;
  width: 30px;
  height: 18px;
  background: url(../../../images/fr/design/boutons/b_0.png) 0 0 no-repeat;
}
.dc_ui_checkbox_on {
  background: url(../../../images/fr/design/boutons/b_1.png) 0 0 no-repeat;
}
`;

/**
 * Interrupteur au visuel du jeu.
 *
 * `onToggle` recoit le nouvel etat -- l'ancienne version obligeait l'appelant
 * a relire la classe CSS pour le connaitre.
 */
export const checkbox = (
  id: string,
  checked: boolean,
  onToggle?: (checked: boolean) => void,
): HTMLDivElement => {
  apply(CHECKBOX_CSS, 'dc-checkbox');

  const node = h('div', {
    id,
    class: `dc_ui_checkbox${checked ? ' dc_ui_checkbox_on' : ''}`,
  });

  node.addEventListener('click', () => {
    const next = node.classList.toggle('dc_ui_checkbox_on');
    onToggle?.(next);
  });

  return node;
};
