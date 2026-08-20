import { guardGame } from '../context.ts';
import { escapeHtml, frag, h, qs, type Child } from '../dom.ts';
import { apply } from '../style.ts';
import { textButton } from './controls.ts';

const toggleLoader = (visible: boolean): void => {
  const loader = qs('#loader');
  if (loader) loader.style.display = visible ? 'block' : 'none';
};

/**
 * Ouvre une fenetre au format du jeu.
 *
 * Le balisage reprend celui d'`engine.displayDataBox`, gestionnaires en dur
 * compris : ils s'executent dans le contexte de la page, ou vivent `engine` et
 * le jQuery du jeu.
 */
export const popUp = (id: string, title: string, content: Child): void => {
  guardGame('popUp');

  toggleLoader(true);

  engine.displayDataBox(`
    <div id="${id}" class="dataBox" onClick="engine.switchDataBox(this)" style="display: block; z-index: 5; left: 764px; top: 16px;">
      <relative>
        <div class="head" ondblclick="$('#${id}').toggleClass('reduced');">
          <div title="Fermer la fenetre (Q)" class="info1 link close transition3s" onClick="engine.closeDataBox($(this).parent().parent().parent().attr('id'));">
            <i class="fas fa-times"></i>
          </div>
          <div title="Reduire/Agrandir la fenetre" class="info1 link reduce transition3s" onClick="$('#${id}').toggleClass('reduced');">
            <span>-</span>
          </div>
          <div class="title">${escapeHtml(title)}</div>
        </div>
        <div class="dbloader"></div>
        <div class="content" style="max-width: 800px; max-height: 600px; overflow-y: auto; overflow-x: hidden;"></div>
      </relative>
    </div>`);

  const body = qs(`#${id} .content`);
  if (body) body.appendChild(frag(content));

  toggleLoader(false);
};

const SIDE_MENU_CSS = `
#zone_sidemenu {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0px;
  top: 80px;
  z-index: 999999;
}
.sidemenu_container {
  display: flex;
}
.sidemenu_container > .btnTxt:first-child {
  margin: 0 auto;
  min-width: 100px;
  max-width: 100px;
  font-size: 1rem;
  padding: 1%;
  display: grid;
  height: 100%;
  box-sizing: border-box;
  grid-template-columns: 10% 1fr;
  align-items: center;
  text-transform: uppercase;
  font-family: Arial !important;
  line-height: normal !important;
}
.sidemenu_container .btnTxt:hover {
  background: #0b9bcb;
  color: #fff;
}
.sidemenu_content {
  background-color: #000;
  color: #fff !important;
  box-shadow: 0 0 15px -5px inset #a2e4fc !important;
  padding: 10px;
  width: 200px;
  display: none;
}
`;

/** Panneau lateral repliable, ancre a droite de la page. */
export const sideMenu = (id: string, label: string, content: Child): void => {
  apply(SIDE_MENU_CSS, 'dc-sidemenu');

  let zone = qs('#zone_sidemenu');
  if (!zone) {
    zone = h('div', { id: 'zone_sidemenu' });
    document.body.appendChild(zone);
  }

  const panel = h('div', { id: `${id}_content`, class: 'sidemenu_content' }, content);

  let open = false;
  const button = textButton(
    `${id}_button`,
    `<i class="fas fa-chevron-left"></i>${escapeHtml(label)}`,
    () => {
      open = !open;
      button.innerHTML = `<i class="fas fa-chevron-${open ? 'right' : 'left'}"></i>${escapeHtml(label)}`;
      panel.style.display = open ? 'block' : 'none';
    },
  );

  zone.appendChild(h('div', { id: `${id}_container`, class: 'sidemenu_container' }, button, panel));
};
