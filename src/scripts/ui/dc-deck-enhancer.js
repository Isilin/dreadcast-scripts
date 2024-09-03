// ==UserScript==
// @name DC Deck Enhancer
// @author Secret
// @version 0.01
// @grant none
// @description Montre la durabilité d'un deck lorsque utilisé.
// @match https://www.dreadcast.net/Main
// @copyright 2021+, None
// @namespace InGame
// ==/UserScript==
$(document).ready(function () {
  function addInfoBox() {
    if ($('#deckHP').length === 0) {
      $('#zone_dataBox [class=deck_type_]').append(' En attente de commande ');
    }
  }

  function updateInfoBox(b) {
    var pv = b.responseText.match(/item_pv">(d)/);
    var max_pv = b.responseText.match(/item_pv_max">(d*)/);
    if (pv?.length & max_pv?.length) {
      $('#deckHP').html(`${pv[1]}/${max_pv[1]}`);
    }
  }

  $(document).ajaxComplete(function (a, b, c) {
    if (/Activate/.test(c.url)) {
      addInfoBox();
    }
    if (/Command/.test(c.url)) {
      updateInfoBox(b);
    }
  });
});
console.log('DC - Deck Enhancer OK');
