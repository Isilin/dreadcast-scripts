// ==UserScript==
// @name        Séparation sujets
// @namespace   Dreadcast
// @match       https://www.dreadcast.net/Forum
// @match       https://www.dreadcast.net/Forum#
// @match       https://www.dreadcast.net/FAQ
// @match       https://www.dreadcast.net/FAQ#
// @match       https://www.dreadcast.net/Forum/*
// @match       https://www.dreadcast.net/FAQ/*
// @version     2.2.0
// @author      Aversiste, MockingJay, Odul, Pelagia
// @description Separe le RP du HRP dans la section 'Derniers Sujets'.
// @license     http://creativecommons.org/licenses/by-nc-nd/4.0/
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

(() => {
  const DATA_TAG = 'ss_data';
  let data;

  const initPersistence = () => {
    // Init persistent memory if needed.
    DC.LocalMemory.init(DATA_TAG, {
      blacklist: [],
      categories: {
        hrp: 'on',
        rp: 'on',
        ecoreb: 'on',
        polreb: 'on',
        ecoimp: 'on',
        polimp: 'on',
        annonces: 'on',
      },
    });

    // Load the current settings.
    data = DC.LocalMemory.get(DATA_TAG);
  };

  const getId = (url) => {
    return url.substring(34, url.indexOf('-', 35));
  };

  const isOnOrOff = (node, id) => {
    if (data.categories[id] === 'on') {
      $('span.symbol:first', node).css('display', 'inline');
      $('span.symbol:last', node).css('display', 'none');
      $('ul', node).css('display', 'block');
    } else {
      $('span.symbol:first', node).css('display', 'none');
      $('span.symbol:last', node).css('display', 'inline');
      $('ul', node).css('display', 'none');
    }
  };

  const addClickEvent = (node, id) => {
    $('h3', node).bind('click', () => {
      data.categories[id] =
        $('.symbol:first', node).css('display') === 'none' ? 'off' : 'on';
      DC.LocalMemory.set(DATA_TAG, data);
    });
  };

  const sortSection = (node, filter) => {
    $('li', node).each((i, el) => {
      var category = parseInt(
        $('a', el).attr('class').split(' ')[0].substring(2),
        10,
      ); //En déduit la catégorie forum
      var id = getId($('a', el).attr('href'));
      if (!filter.includes(category) || data.blacklist.includes(id)) {
        el.remove();
      }
    });
  };

  const createSectionNode = (orig, id, name, filter) => {
    var $node = orig.clone(true);
    $node.attr('id', id);
    sortSection($node, filter);
    $('h3.link span:last-child', $node).text(
      name + ` (${$('li', $node).length})`,
    );
    isOnOrOff($node, id);
    $('#menu_droite').prepend($node);
    addClickEvent($node, id);
  };

  const blacklist = (node) => {
    $('li', node).each((i, el) => {
      const elName = $(el)
        .find('a')
        .attr('href')
        .substring(32, $(el).find('a').attr('href').indexOf('-', 33));
      var off = localStorage.getItem(elName); //Récupère le texte de l'élément (lien)
      if (off !== null && off == 'off') {
        //Vérifie si à blacklister
        node.children[1].removeChild(node.children[1].children[i]);
        --i;
      }
    });
  };

  function addClickEventHide(node) {
    node.bind('click', () => {
      var currentTopicId = getId(window.location.href);
      if (data.blacklist.includes(currentTopicId)) {
        data.blacklist.splice(data.blacklist.indexOf(currentTopicId, 1));
        $('#hideTopic').text('Masquer ce sujet');
      } else {
        data.blacklist.push(currentTopicId);
        $('#hideTopic').text('Afficher ce sujet');
      }
      DC.LocalMemory.set(DATA_TAG, data);
    });
  }

  //****************
  //***DEBUT MAIN***
  //****************
  $(document).ready(() => {
    try {
      initPersistence();

      var origList = $('#list_derniers_sujets'); // Récupération du div des derniers sujets
      blacklist(origList); //Masquage de tous les topics qui doivent l'être, avant clonage et tri des catégories

      const sections = [
        {
          id: 'hrp',
          name: 'Derniers Sujets HRP',
          categories: [3, 4, 7, 8, 9, 10],
        },
        { id: 'rp', name: 'Derniers Sujets RP', categories: [12, 13, 14, 15] },
        { id: 'ecoreb', name: 'Matrice Rebelle', categories: [20] },
        { id: 'polreb', name: 'Politique Rebelle', categories: [19] },
        { id: 'ecoimp', name: 'Matrice Impériale', categories: [18] },
        { id: 'polimp', name: 'Politique Impériale', categories: [17] },
        { id: 'annonces', name: 'Annonces Officielles', categories: [2, 5] },
      ];

      //Clonage et tri des nouvelles catégories. Dans l'ordre inversé, car utilisation de prepend.
      sections.forEach(($section) => {
        createSectionNode(
          origList,
          $section.id,
          $section.name,
          $section.categories,
        );
      });

      origList.remove(); //Enlever la liste originale une fois le tri effectué.

      //Ne pas afficher une catégorie si elle est vide
      $('#menu_droite > div > ul').each(function () {
        if ($(this).text().trim() === '') {
          $(this).parent().css('display', 'none');
        }
      });

      //Ajout du lien pour activer la fonction 'cacher'
      if ($('#header_sujet').length) {
        $('.list_tags').css('display', 'flex').css('gap', '0.5rem');
        const hideTopic = $(
          '<div id="hideTopic" class="link" style="text-align: right;">Masquer ce sujet</div>',
        ).appendTo($('.list_tags'));
        if (data.blacklist.includes(getId(window.location.href))) {
          $('#hideTopic').text('Afficher ce sujet');
        }
        addClickEventHide(hideTopic);
      }
    } catch (err) {
      console.error(error);
    }
  });
})();
