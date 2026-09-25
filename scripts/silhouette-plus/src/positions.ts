// Emplacements de la fiche RP et de l'inventaire, et leur position.
//
// Les coordonnees sont des pourcentages, relatifs au bloc de l'inventaire. Les
// valeurs par defaut sont celles de la version 1.0 : les changer deplacerait
// les cases chez tous les joueurs qui ne les ont jamais reglees.

export interface Point {
  x: number;
  y: number;
}

export interface Slot extends Point {
  key: string;
  /** Element deplace, dans l'inventaire comme dans la fiche RP. */
  selector: string;
  label: string;
  /** Pas du champ Y : les cases RP se reglent de 50 en 50. */
  stepY: number;
}

export const SLOTS: readonly Slot[] = [
  { key: 'head', selector: '.zone_case1', label: 'Tête', x: 0, y: 1, stepY: 1 },
  { key: 'chest', selector: '.zone_case5', label: 'Buste', x: 0, y: 21, stepY: 1 },
  { key: 'legs', selector: '.zone_case-1', label: 'Jambes', x: 0, y: 41, stepY: 1 },
  { key: 'feet', selector: '.zone_case6', label: 'Pieds', x: 0, y: 61, stepY: 1 },
  { key: 'implant', selector: '.zone_case-2', label: 'Implant', x: 60, y: 1, stepY: 1 },
  { key: 'right_arm', selector: '.zone_case3', label: 'Main D', x: 60, y: 21, stepY: 1 },
  { key: 'left_arm', selector: '.zone_case4', label: 'Main G', x: 60, y: 41, stepY: 1 },
  { key: 'secondary', selector: '.zone_case2', label: 'Secondaire', x: 60, y: 61, stepY: 1 },
  { key: 'bag1', selector: '.zone_case7', label: 'Sac 1', x: 80, y: 1, stepY: 1 },
  { key: 'bag2', selector: '.zone_case8', label: 'Sac 2', x: 80, y: 21, stepY: 1 },
  { key: 'bag3', selector: '.zone_case9', label: 'Sac 3', x: 80, y: 41, stepY: 1 },
  { key: 'rp1', selector: '.zone_case10', label: 'Case RP 1', x: 0, y: -1850, stepY: 50 },
  { key: 'rp2', selector: '.zone_case11', label: 'Case RP 2', x: 20, y: -1850, stepY: 50 },
  { key: 'rp3', selector: '.zone_case12', label: 'Case RP 3', x: 40, y: -1850, stepY: 50 },
  { key: 'rp4', selector: '.zone_case13', label: 'Case RP 4', x: 60, y: -1850, stepY: 50 },
  { key: 'cut', selector: '#ciseauxInventaire', label: 'Séparation', x: 80, y: 72, stepY: 1 },
  { key: 'delete', selector: '#poubelleInventaire', label: 'Poubelle', x: 80, y: 83, stepY: 1 },
  { key: 'stats', selector: '#statsInventaire', label: 'Stats', x: 91, y: 72, stepY: 1 },
  { key: 'stock', selector: '#stockInventaire', label: 'Stock', x: 91, y: 83, stepY: 1 },
];

/** Position de chaque emplacement, par cle. */
export type Layout = Record<string, Point>;

/**
 * Lit une coordonnee. La version 1.0 les enregistrait en chaines -- la valeur
 * brute du champ --, d'ou l'acceptation des chaines numeriques.
 */
export const parseCoordinate = (value: unknown): number | undefined => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string' || value.trim() === '') return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Positions enregistrees, completees par les valeurs par defaut.
 *
 * Accepte aussi la forme de la version 1.0, qui enregistrait chaque
 * emplacement en entier -- `tag` et `label` compris. Seuls x et y sont repris :
 * le selecteur et le libelle viennent toujours du code.
 */
export const readLayout = (stored: unknown): Layout => {
  const source =
    typeof stored === 'object' && stored !== null ? (stored as Record<string, unknown>) : {};

  return Object.fromEntries(
    SLOTS.map((slot) => {
      const entry = source[slot.key];
      const point =
        typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {};

      return [
        slot.key,
        {
          x: parseCoordinate(point['x']) ?? slot.x,
          y: parseCoordinate(point['y']) ?? slot.y,
        },
      ];
    }),
  );
};

/**
 * Ce qui differe des valeurs par defaut : c'est tout ce qui est enregistre.
 * Un emplacement jamais regle suit donc le defaut du code.
 */
export const overridesOf = (layout: Layout): Layout =>
  Object.fromEntries(
    SLOTS.flatMap((slot) => {
      const point = layout[slot.key];
      if (point === undefined || (point.x === slot.x && point.y === slot.y)) return [];
      return [[slot.key, { x: point.x, y: point.y }]];
    }),
  );
