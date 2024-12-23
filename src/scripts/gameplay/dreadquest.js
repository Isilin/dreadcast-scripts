// ==UserScript==
// @name        DreadQuest
// @namespace   Dreadcast
// @version     0.1.0
// @author      Isilin/Pelagia
// @match       https://www.dreadcast.net/Main
// @description système de jeu type JDR conçu pour Dreadcast
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

$(() => {
  const style = ``;

  const loadUI = () => {};

  $(document).ready(() => {
    const stats = {
      strength: $('.stat_1_entier:first').text() / 10,
      agility: $('.stat_2_entier:first').text() / 10,
      robustness: $('.stat_3_entier:first').text() / 10,
      perception: $('.stat_4_entier:first').text() / 10,
      stealth: $('.stat_5_entier:first').text() / 10,
      computing: $('.stat_6_entier:first').text() / 10,
      medecine: $('.stat_7_entier:first').text() / 10,
      engineering: $('.stat_8_entier:first').text() / 10,
    };

    DC.Chat.addCommand('test', function (label, content) {
      console.log('ok ?');
      const contents = content.split(' ');
      let diceNb, diceFaces, difficulty;
      let error = false;

      const result = contents[0].match(/(\d*)[d|D](\d*)/gm);
      console.log(result);
    });

    loadUI();
    DC.Style.apply(style);
  });
});
