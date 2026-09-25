import { SLOTS, type Layout } from './positions.ts';

/**
 * Recentrage de la silhouette dans l'inventaire et la fiche RP, et mise en
 * forme de la fenetre de reglages.
 */
export const BASE_CSS = `
.inventaire_content .personnage_image {
  top: 10% !important;
  left: 20% !important;
}

.flipmobile-card-front .inventaire {
  left: 12.5% !important;
}

#silhouettePlus_content {
  color: white;
}

#silhouettePlus_content .sp_row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

#silhouettePlus_content .sp_row > span:first-child {
  min-width: 7rem;
}

#silhouettePlus_content input {
  width: 5rem;
  color: white;
}
`;

/** Reflet oblique que le jeu dessine sur les cases d'objet. */
const SHINE =
  '.case_objet.linkBox::before, .case_objet.linkBox::after, .case_objet.linkBox:hover::before, .case_objet.linkBox:hover::after';

/**
 * Position de chaque emplacement, et masquage du reflet.
 *
 * La regle du reflet n'est emise que s'il est masque : la version 1.0 forcait
 * sinon `display: block`, et reecrivait ce que le jeu decide.
 */
export const layoutCss = (layout: Layout, hideShine: boolean): string =>
  [
    ...SLOTS.map((slot) => {
      const point = layout[slot.key] ?? slot;
      return `${slot.selector} { left: ${point.x}% !important; top: ${point.y}% !important; }`;
    }),
    ...(hideShine ? [`${SHINE} { display: none !important; }`] : []),
  ].join('\n');

/**
 * Feuille de style reecrite en place.
 *
 * `DC.style.apply` est idempotent par identifiant : il ne sait pas remplacer
 * une feuille deja posee. La disposition, elle, change a chaque frappe dans
 * la fenetre de reglages ; la version 1.0 empilait une balise `<style>` par
 * modification.
 */
export const layoutSheet = (id: string): ((css: string) => void) => {
  const node = document.createElement('style');
  node.dataset['dcStyle'] = id;
  (document.head ?? document.documentElement).appendChild(node);

  return (css) => {
    node.textContent = css;
  };
};
