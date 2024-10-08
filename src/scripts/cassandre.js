// ==UserScript==
// @name        Cassandre
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Main
// @version     0.0.1
// @author      M0lly, Pelagia/IsilinBN
// @description
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @downloadURL
// @updateURL
// ==/UserScript==

$(() => {
  $(document).ready(() => {
    DC.Deck.createCommand(
      40,
      'cassandre',
      (command, deckId) => {
        const syntaxes = [
          "Quelqu'un t'as trompé !",
          'Tu trouveras un trésor caché dans les souterrains.',
          'Attention à la marche en sortant du T-Cast !',
          'Ne mange pas le dernier cookiz.',
          'La chance te sourira demain, peut-être.',
          'Méfie-toi des étrangers avec des bonbons.',
          "Demain, tu te réveilleras... en retard, comme d'habitude.",
          'Attention ! Un drone conspirateur te surveille.',
          "Tu vas trouver quelque chose que tu n'as pas perdu.",
          "Si tu écoutes attentivement, tu entendras ton frigo qui t'appelle.",
          'Ta plante en plastique pense à te quitter pour une maison plus illuminée.',
          'Ne regarde pas maintenant, mais ta future ex est derrière toi.',
          'Tu vas bientôt le monde... sur World of Dreadcast.',
          "Les crédits ne font pas le bonheur, surtout dans la poche de quelqu'un d'autre.",
          'Un jour, tes talents de kobold seront utiles.',
          "C'est à cause des gens comme toi que les aliens hésitent encore à contacter Kepler, fais un effort.",
          'Bientôt, tu découvriras le royaume où se rendent les chaussettes disparues du sèche-linge.',
          "Aujourd'hui, tu auras une idée brillante... mais tu l'oublieras en sortant de la douche.",
          "La chance est de ton côté aujourd'hui... à moins qu'elle ne change d'avis.",
          'Tu es sur le point de battre ton record de respirations consécutives.',
          'Attention ! Les écureuils ont de nouveaux plans pour dominer le monde.',
          'Lao Tsou a dit : La réponse est toujours claire si tu oublies la question.',
        ];
        const selected = $(
          `<span>${
            syntaxes[Math.floor(Math.random() * syntaxes.length)]
          }</span>`,
        );

        DC.Deck.write(selected, deckId);
      },
      (deckId) => {
        DC.Deck.write(
          $(
            '<span class="couleur_jaune"><strong>cassandre</strong>:</span><br /><span>Fait une prédiction</span>',
          ),
          deckId,
        );
      },
      '<strong>cassandre</strong>',
    );
  });
});
