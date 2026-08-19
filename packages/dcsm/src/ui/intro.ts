import DC from '@dreadcast/ddk';

const { h } = DC.dom;

/** Fenêtre de bienvenue, affichée une seule fois après l'installation. */
export const openIntro = (): void => {
  DC.ui.popUp(
    'dcsm_intro',
    'Bienvenue sur le Dreadcast Script Manager !',
    h(
      'div',
      { style: { color: 'white' } },
      h('h3', null, "Merci d'avoir installé le Dreadcast Script Manager (DCSM)."),
      h('br'),
      h(
        'p',
        null,
        'Cet utilitaire va vous permettre de gérer vos scripts directement en jeu. Pensez à désactiver ou désinstaller, dans votre Greasemonkey/Tampermonkey (ou équivalent), les scripts que vous activerez dans le DCSM, pour éviter les doublons.',
      ),
      h('br'),
      h('p', null, 'La suite se passe dans Paramètres > Scripts & Skins.'),
      h('br'),
      h(
        'p',
        null,
        'Vous pourrez obtenir des réponses à vos questions sur le ',
        h(
          'a',
          { href: 'https://github.com/Isilin/dreadcast-scripts/wiki', target: '_blank' },
          'wiki',
        ),
        ", sur le forum, ou en me contactant directement par Com' HRP (",
        h('em', null, 'JD Pelagia'),
        ').',
      ),
      h('br'),
      h('p', null, "Bon jeu ! Vous ne verrez plus cette fenêtre d'information par la suite."),
    ),
  );
};
