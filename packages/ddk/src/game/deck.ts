import { guardGame } from '../context.ts';
import { h, qs, qsa } from '../dom.ts';
import { guardNumber, guardString } from '../guards.ts';

/**
 * Niveau d'informatique du personnage, lu dans la feuille de personnage.
 */
export const skillLevel = (): number => {
  guardGame('deck.skillLevel');
  return Number.parseInt(qs('.stat_6_entier')?.textContent ?? '0', 10);
};

/** Le personnage a-t-il le niveau requis pour cette commande ? */
export const hasSkill = (required: number): boolean => {
  guardNumber('deck.hasSkill', 'required', required);
  return required <= skillLevel();
};

/**
 * Ecrit dans la zone de resultat d'un deck.
 *
 * Le jeu regroupe les sorties d'une meme commande dans une ligne unique : on
 * complete la derniere ligne si elle est encore ouverte, sinon on en cree une.
 */
export const write = (node: Node, deckId: string): void => {
  guardGame('deck.write');
  guardString('deck.write', 'deckId', deckId);

  const zone = qs(`#${deckId} .zone_ecrit`);
  if (!zone) return;

  const last = zone.lastElementChild;

  if (last?.className === 'ligne_resultat_fixed') {
    last.appendChild(node);
    return;
  }

  zone.appendChild(h('div', { class: 'ligne_resultat_fixed' }, node));
};

/**
 * Declare une commande de deck.
 *
 * Le jeu envoie les commandes en AJAX et ne previent personne : le seul point
 * d'accroche disponible est `ajaxComplete` de jQuery, d'ou la dependance au `$`
 * de la page dans cette fonction precise.
 */
export const addCommand = (
  requiredSkill: number,
  command: string,
  run: (line: string, deckId: string) => void,
  showHelp: (deckId: string) => void,
  helpLine: string,
): void => {
  guardGame('deck.addCommand');
  guardNumber('deck.addCommand', 'requiredSkill', requiredSkill);
  guardString('deck.addCommand', 'command', command);
  guardString('deck.addCommand', 'helpLine', helpLine);

  $(document).ajaxComplete((_event, _xhr, settings) => {
    if (!/Command/.test(String(settings.url))) return;

    const deckNumber = /[0-9]*$/.exec(String(settings.data))?.[0] ?? '';
    const deckId = `db_deck_${deckNumber}`;

    const inputs = qsa<HTMLInputElement>(`#${deckId} .ligne_ecrite_fixed input`);
    const line = inputs.at(-1)?.value ?? '';

    if (new RegExp(`^${command}`, 'i').test(line)) {
      if (hasSkill(requiredSkill)) {
        run(line, deckId);
      } else {
        write(
          h(
            'span',
            null,
            'Votre niveau en informatique est trop faible pour reussir cette commande',
          ),
          deckId,
        );
      }
      return;
    }

    if (new RegExp(`^help ${command}`, 'i').test(line)) {
      showHelp(deckId);
      return;
    }

    if (/^help$/i.test(line)) {
      write(h('span', { html: `<br />${helpLine}` }), deckId);
    }
  });
};
