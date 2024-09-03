// ==UserScript==
// @name         TP Overhaul
// @namespace    https://greasyfork.org/en/scripts/488053-tp-overhaul
// @version      1.0.3
// @description  Améliorations des TPs de DC
// @author       Altaïr
// @match        https://www.dreadcast.net/Main
// @icon         https://www.dreadcast.net/images/objets/mini/TERMINAL%20PORTABLE2.png
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

/* globals $, Engine */
const A_SECOND = 1000;

let cAData = undefined;
let infoOI = undefined;
let cercleList = undefined;
let energyInfo = undefined;
let cryoData = undefined;
let gigaCryoData = undefined;
let isFetchingImperialData = false;
let isFetchingGigaCryoData = false;
let filteringCursor = 0;
let currentFiltering = undefined;

const logMonthHistory = (baseUrl, from, to) => {
  const dateFrom = new Date(`${from} GMT+0100`);
  const dateTo = new Date(`${to} GMT+0100`);
  const timestampFrom = Math.floor(dateFrom.getTime() / 1000);
  const timestampTo = Math.floor(dateTo.getTime() / 1000);

  const isValid = validateRange(timestampFrom, timestampTo);
  if (!isValid) {
    return;
  }

  let calls = [];
  let logs = new Map();

  for (let t = timestampFrom; t <= timestampTo; t += 86400) {
    calls.push(
      $.ajax({
        type: 'GET',
        url: `${baseUrl}&date=${t}`,
        success: (res) => {
          const html = $(res).find('.entreprise_historique_ligne');
          if (html.text() !== '') {
            logs.set(t, $(res).find('.entreprise_historique_ligne'));
          }
        },
      }),
    );
  }

  $.when(...calls).then(() => {
    $('#tpo_content').empty();
    $(`<div id="imperial_data" class="entreprise_historique"></div>`).appendTo(
      '#tpo_content',
    );

    if (logs.size === 0) {
      $(
        '<div class="tpo_alert">Aucune donnée disponible pour la plage sélectionnée.</div>',
      ).appendTo('.entreprise_historique');
      return;
    }

    for (let t = timestampFrom; t <= timestampTo; t += 86400) {
      logs.get(t)?.appendTo('.entreprise_historique');
    }

    addCopyButton();
  });
};

const validateRange = (from, to) => {
  if (from > to) {
    $('#tpo_content').empty();
    $(
      `<div id="imperial_data" class="entreprise_historique"><div class="tpo_alert"><span>&#9888;</span> Invalide. La date de fin doit être après la date de début.</div></div>`,
    ).appendTo('#tpo_content');
    return false;
  }

  if (from + 15 * (164 + 7 * 100) * 100 < to) {
    $('#tpo_content').empty();
    $(
      `<div id="imperial_data" class="entreprise_historique"><div class="tpo_alert"><span>&#9888;</span> Invalide. La plage limite est de 15 jours.</div></div>`,
    ).appendTo('#tpo_content');
    return false;
  }

  return true;
};

const showHistoryPage = (baseUrl, name) => {
  addOrRefreshSearchElements(baseUrl, name);
  appendHistory(baseUrl);
};

const addOrRefreshSearchElements = (baseUrl, name) => {
  updateHeader(name, "$('#tpo_history_range').css('display', 'none');");
  $('#tpo_header_text span').click(() => {
    $('#tpo_content').remove();
    backToInfoOIPage();
  });

  const historyRange = $('#tpo_history_range');
  if (historyRange?.length) {
    historyRange.find('#tpo_history_submit').unbind('click');
    historyRange
      .find('#tpo_history_submit')
      .click(() => appendHistory(baseUrl));
    historyRange.css('display', '');
  } else {
    addHistorySearchForm(baseUrl);
  }

  const historyContent = $('#tpo_history_content');
  if (historyContent?.length) {
    historyContent.empty();
  } else {
    $(`<div id="tpo_history_content"></div>`).appendTo(
      '.entreprise_historique',
    );
  }
};

const setKeyUpListeners = () => {
  $('#history_from').on('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      $('#tpo_history_submit').click();
    }
  });

  $('#history_to').on('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      $('#tpo_history_submit').click();
    }
  });
};

const addHistorySearchForm = (baseUrl) => {
  const today = new Date()
    .toLocaleString('en-CA', { timeZone: 'Europe/Paris' })
    .substring(0, 10);
  const submitButton = $(
    `<button id="tpo_history_submit" class="transition3s">Valider</button>`,
  );
  submitButton.click(() => appendHistory(baseUrl));

  $(`
        <div id="tpo_history_range">
            <input id="history_from" type="text" name="from" placeholder="À partir du..." maxlength="10" autocomplete="off" value="${today}"><span class="tpo_arrow_seperator tpo_one_dot_two_rem">⇒</span><input id="history_to" type="text" name="to" placeholder="Jusqu'au..." maxlength="10" autocomplete="off"  value="${today}">
        </div>`).appendTo('#tpo_header_extra');

  setKeyUpListeners();

  submitButton.appendTo($('#tpo_history_range'));
};

const appendHistory = (baseUrl) => {
  $('#tpo_content').empty();
  $(getTPOLoader()).appendTo('#tpo_content');

  let from = $('#history_from').val();
  let to = $('#history_to').val();

  const today = new Date()
    .toLocaleString('en-CA', { timeZone: 'Europe/Paris' })
    .substring(0, 10);

  if (from === '') {
    from = today;
    $('#history_from').val(today);
  }

  if (to === '') {
    to = today;
    $('#history_to').val(today);
  }

  logMonthHistory(baseUrl, from, to);
};

const addCopyButton = () => {
  if ($('#tpo_history_copy').length) {
    return;
  }

  const button = $('<span id="tpo_history_copy" class="link">Copier</span>');
  button.click(() => {
    $('#tpo_history_copy').text('Copié !');
    setTimeout(() => {
      $('#tpo_history_copy').text('Copier');
    }, A_SECOND);

    addHistoryToClipBoard();
  });
  button.appendTo('#tpo_content');
};

const addHistoryToClipBoard = () => {
  const dateColourReplacement = '';
  const userColourReplacement = '';
  const endColourTagReplacement = '';

  let text = '';
  $('.entreprise_historique_ligne').each((_, v) => {
    text += v.innerHTML
      .replace('\n', '')
      .replace(/\t/g, '')
      .replace(/<span style="color:#28858d;">/g, dateColourReplacement)
      .replace(/<span class="couleur4">/g, userColourReplacement)
      .replace(/<\/span>/g, endColourTagReplacement)
      .replace(/<div class="entreprise_historique_ligne">/g, '')
      .replace(/<\/div>/g, '')
      .replace('\n', ' ')
      .replace(/<em class="couleur.+;">/g, '')
      .replace(/<\/em>/g, '');
  });
  navigator.clipboard.writeText(text);
};

const applyTPModifications = () => {
  $('#zone_dataBox').ajaxComplete(function (_, __, opt) {
    if (!opt.url.includes('Item/Activate')) {
      return;
    }

    $('#zone_dataBox').unbind('ajaxComplete');
    fetchImperialData();

    if (
      $('#terminal_portable ul li')[0].innerText.startsWith('Terminal de la DA')
    ) {
      $('#terminal_portable ul li')[0].remove();
    }
    if ($('#tpo_menu').length === 0) {
      getTPOMenu().appendTo($('#terminal_portable'));
    }
  });
};

const getTPOMenu = () => {
  const element = $(`
    <div id="tpo_menu">
        <hr class="solid" style="color: white; margin-bottom: 10px;">
        <div id="tpo_cards">
            ${getCardElement(
              'Cercles publics',
              'Informations sur les cercles publics recensés à ce jour',
              '<svg viewBox="0 0 283.46 283.46" class=""><use xlink:href="#icon-tableaucercle" filter="url(#dropshadow)"></use></svg>',
              'tpo_cercle_button',
            )}
            ${getCardElement(
              'Organisations officielles',
              'Informations sur les organisations publiques du secteur',
              '<svg viewBox="0 0 192 192"><path d="M96 56V24H16v144h160V56zm-16 96H32v-16h48zm0-32H32v-16h48zm0-32H32V72h48zm0-32H32V40h48zm80 96h-64V72h64zm-16-64h-32v16h32zm0 32h-32v16h32z"></path></svg>',
              'tpo_info_oi_button',
            )}
            ${getCardElement(
              'Bulletin énergétique',
              "Informations sur l'activité énergétique du secteur",
              '<svg viewBox="0 0 192 192"><path d="M117.52 17.68 34.64 91.92c-5.12 4.64-2.24 13.2 4.64 13.84L104 112l-38.8 54.08c-1.76 2.48-1.52 5.92.64 8.08 2.4 2.4 6.16 2.48 8.64.16l82.88-74.24c5.12-4.64 2.24-13.2-4.64-13.84L88 80l38.8-54.08c1.76-2.48 1.52-5.92-.64-8.08-2.4-2.4-6.16-2.48-8.64-.16"></path></svg>',
              'tpo_energy_button',
            )}
            ${getCardElement(
              "Centre d'Arrivée",
              'Informations sur les nouveaux arrivants du secteur',
              '<svg viewBox="0 0 192 192"><path d="m 176 24 l -16 16 L 144 24 L 128 40 L 112 24 l -16 16 L 80 24 L 64 40 L 48 24 L 32 40 L 16 24 v 128 c 0 8.8 7.2 16 16 16 h 128 c 8.8 0 16 -7.2 16 -16 z M 88 152 H 32 v -48 h 56 z m 72 0 h -56 v -16 h 56 z m 0 -32 h -56 v -16 h 56 z m 0 -32 H 32 V 64 h 128 z"></path></svg>',
              'tpo_ca_button',
            )}
            ${getCardElement(
              'Centre de Cryogénisation',
              'Informations sur les citoyens cryogénisés',
              '<svg viewBox="0 0 283.46 283.46" class=""><use xlink:href="#icon-cryo" filter="url(#dropshadow)"></use></svg>',
              'tpo_cryo_button',
            )}
            ${getCardElement(
              'Cartes du secteur',
              'Informations graphiques du secteur',
              '<svg viewBox="0 0 283.46 283.46" class=""><use xlink:href="#icon-79" filter="url(#dropshadow)"></use></svg>',
              'tpo_map_button',
            )}
        </div>
    </div>
    `);
  element.find('#tpo_cercle_button').click(setCercleListPage);
  element.find('#tpo_info_oi_button').click(setInfoOIPage);
  element.find('#tpo_energy_button').click(setEnergyPage);
  element.find('#tpo_ca_button').click(setCAPage);
  element.find('#tpo_cryo_button').click(setCryoPage);
  element.find('#tpo_map_button').click(setMapPage);
  return element;
};

const getCardElement = (title, description, image, id) => {
  return `<div id="${id}" class="tpo_card">
        <div class="tpo_card_content">
            <div class="tpo_card_image">
                ${image}
            </div>
            <div class="tpo_card_info_wrapper">
                <div class="tpo_card_info">
                    <div class="tpo_card_info_title">
                        <h3 class="couleur4">${title}</h3>
                        <h4>${description}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

const setNewPageHeader = (title) => {
  $('#terminal_portable').attr('style', 'display:none;');

  if ($('#tpo_header').length) {
    updateHeader(
      title,
      "$(this).parents('#tpo_header').parent().find('#tpo_content').remove();$(this).parents('#tpo_header').hide().parent().find('#terminal_portable').show();",
    );
    $('#tpo_header').css('display', '');
  } else {
    const headerElement = $(`
        <div id="tpo_header" class="tpo_one_dot_two_rem">
            <div id="tpo_header_text">
                <h2>${title} <span class="couleur5 link" onclick="$(this).parents('#tpo_header').parent().find('#tpo_content').remove();$(this).parents('#tpo_header').hide().parent().find('#terminal_portable').show();">Retour</span></h2>
            </div>
            <div id="tpo_header_extra"></div>
        </div>`);
    headerElement.appendTo($('#db_portable_device .content'));
  }
};

const updateHeader = (title, action) => {
  $('#tpo_header_text').html(
    `<h2>${title} <span class="couleur5 link" onclick="${action}">Retour</span></h2>`,
  );
};

const fetchImperialData = () => {
  cercleList = undefined;
  infoOI = undefined;
  energyInfo = undefined;
  cAData = undefined;
  cryoData = undefined;
  isFetchingImperialData = true;
  $.ajax({
    type: 'GET',
    url: 'https://www.dreadcast.net/Main/DataBox/SeeImperialData',
    success: (res) => {
      cercleList = $(res).find('.infos_cercles');
      infoOI = $(res).find('.infos_oi');
      energyInfo = $(res).find('.infos_energy');
      cAData = $(res).find('.infos_nouveaux');
      cryoData = $(res).find('.infos_cryo');
      isFetchingImperialData = false;
    },
  }).then(() => {
    $(cercleList).find('h2').remove();
    if ($('#tpo_cercle_list').length) {
      showCercleList();
    }
    $(infoOI).find('h2').remove();
    if ($('#tpo_info_oi').length) {
      showInfoOI();
    }
    $(energyInfo).find('h2').remove();
    if ($('#tpo_energy_info').length) {
      showEnergyInfo();
    }
    if ($('#tpo_ca_data').length) {
      showCAData();
    }
    $(cryoData).find('h2').remove();
    if ($('#tpo_cryo_data').length) {
      showCryoData();
    }
  });
};

const getTPOLoader = () =>
  `<div id="tpo_loader" class="dbloader" style="color:#fff;font-size:12px;display:block;left:50%;margin-left:-100px;width:200px;height:100px;top:0px;text-align:center;background-position:bottom;margin-top:50px;margin-bottom:50px;">
    Accès aux données du serveur...
    </div>`;

const addOrRefreshSearchForm = (fn) => {
  const search = $('#tpo_search');
  if (search?.length) {
    search.css('display', '');
    $('#tpo_search input').on('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        fn();
      }
    });
    $('#tpo_search input').attr('value', '');
    $('#tpo_search_submit').unbind('click');
    $('#tpo_search_submit').click(fn);
  } else {
    addSearchForm(fn);
  }
};

const addSearchForm = (fn) => {
  const submitButton = $(
    `<button id="tpo_search_submit" class="transition3s">Rechercher</button>`,
  );
  submitButton.click(fn);

  $(`<div id="tpo_search">
        <input type="text" maxlength="100" autocomplete="on" value="" placeholder="Rechercher...">
    </div>`).appendTo('#tpo_header_extra');

  $('#tpo_search input').on('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      fn();
    }
  });

  submitButton.appendTo($('#tpo_search'));
};

/////////////////////
// Cercles publics //
/////////////////////
const setCercleListPage = () => {
  if (cercleList === undefined && !isFetchingImperialData) {
    fetchImperialData();
  }

  setNewPageHeader('Informations sur les Cercles Publics');
  $('#tpo_header_text span').click(() => {
    $('#tpo_search').css('display', 'none');
  });
  getCercleListPageContent().appendTo('#db_portable_device .content');

  if (cercleList !== undefined) {
    showCercleList();
  }
};

const getCercleListPageContent = () => {
  const element = $(`
        <div id="tpo_content">
            <div id="tpo_loader" class="dbloader" style="color:#fff;font-size:12px;display:block;left:50%;margin-left:-100px;width:200px;height:100px;top:0px;text-align:center;background-position:bottom;margin-top:50px;margin-bottom:50px;">Accès aux données du serveur...</div>
            <div id="imperial_data">
                <div id="tpo_cercle_list"></div>
            </div>
        </div>
    `);
  return element;
};

const showCercleList = () => {
  $('#tpo_loader').remove();
  addOrRefreshSearchForm(filterCercleList);
  $($(cercleList).clone()[0].innerHTML).appendTo('#tpo_cercle_list');
};

const filterCercleList = () => {
  const filterValue = $('#tpo_search input')[0].value.toLowerCase();

  $('#tpo_cercle_list ul li').each((_, v) => {
    v.style = '';
    if (
      !v.children[1].innerText.toLowerCase().includes(filterValue) &&
      !v.children[2].innerText.toLowerCase().includes(filterValue)
    ) {
      v.style = 'display: none;';
    }
  });
};

///////////////////////////////
// Organisations Officielles //
///////////////////////////////
const setInfoOIPage = () => {
  if (infoOI === undefined && !isFetchingImperialData) {
    fetchImperialData();
  }

  setNewPageHeader('Organisations Officielles');
  getInfoOIPageContent().appendTo('#db_portable_device .content');

  if (infoOI !== undefined) {
    showInfoOI();
  }
};

const backToInfoOIPage = () => {
  updateHeader(
    'Organisations Officielles',
    "$(this).parents('#tpo_header').parent().find('#tpo_content').remove();$(this).parents('#tpo_header').hide().parent().find('#terminal_portable').show();",
  );
  $('#tpo_content').remove();
  getInfoOIPageContent().appendTo('#db_portable_device .content');
  showInfoOI();
};

const showInfoOI = () => {
  $('#tpo_loader').remove();
  $($(infoOI).clone()[0].innerHTML).appendTo('#tpo_info_oi');
  changeHistoryLinkOnInfoOI();
};

const getInfoOIPageContent = () => {
  const element = $(`
        <div id="tpo_content">
            <div id="tpo_loader" class="dbloader" style="color:#fff;font-size:12px;display:block;left:50%;margin-left:-100px;width:200px;height:100px;top:0px;text-align:center;background-position:bottom;margin-top:50px;margin-bottom:50px;">Accès aux données du serveur...</div>
            <div id="imperial_data">
                <div id="tpo_info_oi" class="infos_oi"></div>
            </div>
        </div>
    `);
  return element;
};

const changeHistoryLinkOnInfoOI = () => {
  $('.infos_oi')
    .find('h3')
    .map((_, x) => {
      const path = $(x)
        .find('.link')
        .attr('onclick')
        .replace("engine.convertDataBox('", '')
        .replace("', 'db_imperial_data');", '');
      const baseUrl = `https://www.dreadcast.net/${path}`;
      const name = $(x).text().replace('Historique', '');
      $(x).find('.link').removeAttr('onclick');
      $(x)
        .find('.link')
        .click(() => showHistoryPage(baseUrl, name));
    });
};

//////////////////////////
// Bulletin énergétique //
//////////////////////////
const setEnergyPage = () => {
  if (energyInfo === undefined && !isFetchingImperialData) {
    fetchImperialData();
  }

  setNewPageHeader('Bulletin énergétique de la Centrale');
  getEnergyPageContent().appendTo('#db_portable_device .content');

  if (cercleList !== undefined) {
    showEnergyInfo();
  }
};

const getEnergyPageContent = () => {
  const element = $(`
        <div id="tpo_content">
            <div id="tpo_loader" class="dbloader" style="color:#fff;font-size:12px;display:block;left:50%;margin-left:-100px;width:200px;height:100px;top:0px;text-align:center;background-position:bottom;margin-top:50px;margin-bottom:50px;">Accès aux données du serveur...</div>
            <div id="imperial_data">
                <div id="tpo_energy_info"></div>
            </div>
        </div>
    `);
  return element;
};

const showEnergyInfo = () => {
  $('#tpo_loader').remove();
  $($(energyInfo).clone()[0].innerHTML).appendTo('#tpo_energy_info');
};

/////////////////////
// Centre d'arrivé //
/////////////////////
const setCAPage = () => {
  if (cAData === undefined && !isFetchingImperialData) {
    fetchImperialData();
  }

  setNewPageHeader("Compte-rendu du Centre d'Arrivée");
  getCAPageContent().appendTo('#db_portable_device .content');
  if (cAData !== undefined) {
    showCAData();
  }
};

const getCAPageContent = () => {
  const element = $(`
    <div id="tpo_content">
        ${getTPOLoader()}
        <div id="tpo_ca_data"></div>
    </div>
    `);
  return element;
};

const showCAData = () => {
  $('#tpo_loader').remove();
  $(cAData)
    .find('ul')
    .children()
    .get()
    .reverse()
    .map((c) => getCAProfileCard($(c).clone()).appendTo('#tpo_ca_data'));
};

const getCAProfileCard = (liElement) => {
  const name = liElement.find('.link').text();
  const date = liElement.find('.couleur5').text();
  const element = $(`
    <div class="tpo_profile_card">
        <div class="tpo_profile_image">
            <img src="https://www.dreadcast.net/images/avatars/${name}.png">
        </div>
        <div class="tpo_profile_info">
            <h3>${name}</h3>
            <p id="${name}_profile_info" class="couleur5 tpo_one_dot_two_rem">&nbsp;</p><br>
            <p class="couleur5 tpo_one_dot_two_rem">Maturation: <span class="couleur4">${date}</span></p>
        </div>
        <div class="tpo_profile_action">
            <button class="tpo_mail_button" onclick="nav.getMessagerie().newMessage('${name}')">
                <svg viewBox="0 0 283.5 283.5">
                    <use xlink:href="#icon-envelope" filter="url(#dropshadow)"></use>
                </svg>
            </button>
        </div>
    </div>
    `);

  return element;
};

//////////////////////////////
// Centre de cryogénisation //
//////////////////////////////
const setCryoPage = () => {
  if (cryoData === undefined && !isFetchingImperialData) {
    fetchImperialData();
  }

  setNewPageHeader('Centre de Cryogénisation');
  getCryoPageContent().appendTo('#db_portable_device .content');

  if (cryoData !== undefined) {
    showCryoData();
  }
};

const getCryoPageContent = () => {
  const element = $(`
    <div id="tpo_content">
        ${getTPOLoader()}
        <div id="imperial_data">
            <div id="tpo_cryo_data"></div>
        </div>
    </div>
    `);
  return element;
};

const showCryoData = () => {
  $('#tpo_loader').remove();
  $($(cryoData).clone()[0].innerHTML).appendTo('#tpo_cryo_data');
  $('#tpo_cryo_data span.link').removeAttr('onclick');
  $('#tpo_cryo_data span.link').click(setExtandedCryoPage);
};

const showGigaCryoData = () => {
  $('#tpo_loader').remove();
  $($(gigaCryoData).clone()[0].innerHTML).appendTo('#tpo_cryo_data');
};

const setExtandedCryoPage = () => {
  $('#tpo_content').empty();
  $(getTPOLoader()).appendTo('#tpo_content');
  $(`<div id="imperial_data"><div id="tpo_cryo_data"></div></div>`).appendTo(
    '#tpo_content',
  );

  if (gigaCryoData) {
    showGigaCryoData();
  } else {
    if (!isFetchingGigaCryoData) {
      fetchGigaCryoData();
    }
  }
};

const fetchGigaCryoData = () => {
  gigaCryoData = undefined;
  isFetchingGigaCryoData = true;
  $.ajax({
    type: 'GET',
    url: 'https://www.dreadcast.net/Main/DataBox/ListeCryoFull',
    success: (res) => {
      gigaCryoData = $(res).find('.infos_cryo');
      isFetchingGigaCryoData = false;
    },
  }).then(() => {
    $(gigaCryoData).find('h2').remove();
    if ($('#tpo_cryo_data').length) {
      showGigaCryoData();
    }
  });
};

const filterCryoList = () => {
  filteringCursor = 0;
  if (currentFiltering) {
    clearTimeout(currentFiltering);
  }

  filterCryoListBySlice();
};

const filterCryoListBySlice = () => {
  const filterValue = $('#tpo_search input')[0].value.toLowerCase();

  if (!$('#tpo_cryo_data').length) {
    filteringCursor = 0;
    return;
  }

  const upperBound = Math.min(
    $('#tpo_cryo_data ul li').length,
    filteringCursor + 100,
  );

  $('#tpo_cryo_data ul li')
    .slice(filteringCursor, upperBound)
    .each((_, v) => {
      v.style = 'float:left;width:50%;';
      if (
        !v.children[0].innerText.toLowerCase().includes(filterValue) &&
        !v.children[0].nextSibling.textContent
          .trim()
          .toLowerCase()
          .includes(filterValue)
      ) {
        v.style = 'float:left;width:50%;display:none;';
      }
    });

  if (filteringCursor + 100 >= $('#tpo_cryo_data ul li').length) {
    filteringCursor = 0;
    return;
  }

  filteringCursor += 100;

  currentFiltering = setTimeout(filterCryoListBySlice, 250);
};

////////////
// CARTES //
////////////
const setMapPage = () => {
  setNewPageHeader('Cartes du secteur');
  getMapPageContent().appendTo('#db_portable_device .content');
  setListeners();
};

const setListeners = () => {
  $('#db_portable_device').on('dragstop', () => {
    if ($('#tpo_map_container').length === 0) {
      $('#db_portable_device').off('dragstop');
      return;
    }
    updateImageDragProperties();
  });
};

const getMapPageContent = () => {
  const stepSize = 10;
  const element = $(`
    <div id="tpo_content">
        <div class="tpo_tabs">
            <button id="tpo_button_buildings" class="tpo_tab_btn tpo_tab_btn_active"
                onclick="$(this).parent().find('.tpo_tab_btn_active').removeClass('tpo_tab_btn_active');$(this).addClass('tpo_tab_btn_active');$('#tpo_map_container img').attr('src', 'https://www.dreadcast.net/Admin/Map/Buildings');">Bâtiments</button>
            <button id="tpo_button_crystals" class="tpo_tab_btn"
                onclick="$(this).parent().find('.tpo_tab_btn_active').removeClass('tpo_tab_btn_active');$(this).addClass('tpo_tab_btn_active');$('#tpo_map_container img').attr('src', 'https://www.dreadcast.net/Admin/Map/Crystals');">Cristaux farins</button>
            <button id="tpo_button_ground_quality" class="tpo_tab_btn"
                onclick="$(this).parent().find('.tpo_tab_btn_active').removeClass('tpo_tab_btn_active');$(this).addClass('tpo_tab_btn_active');$('#tpo_map_container img').attr('src', 'https://www.dreadcast.net/Admin/Map/Quality');">Qualité des sols</button>
        </div>
        <div class="tpo_map_section">
            <div id="tpo_map_container"><img src="https://www.dreadcast.net/Admin/Map/Buildings"></div>
            <div id="tpo_map_controls">
                <button id="zoomout" class="tpo_button">
                    <svg aria-hidden="true" viewBox="0 0 24 24" title="ZoomOut">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14M7 9h5v1H7z">
                        </path>
                    </svg>
                </button>
                <input id="zoomlevel" type="range" min="0" max="100" value="0">
                <button id="zoomin" class="tpo_button">
                    <svg aria-hidden="true" viewBox="0 0 24 24" title="ZoomIn">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path>
                        <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    `);

  const zoomOut = () => {
    const currentZoom = parseInt($('#zoomlevel').attr('value'));
    const newZoom = Math.max(0, currentZoom - stepSize);
    $('#zoomlevel').attr('value', newZoom);
    scaleImage(newZoom);
  };

  const zoomIn = () => {
    const currentZoom = parseInt($('#zoomlevel').attr('value'));
    const newZoom = Math.min(100, currentZoom + stepSize);
    $('#zoomlevel').attr('value', newZoom);
    scaleImage(newZoom);
  };

  element.find('#zoomout').click(zoomOut);
  element.find('#zoomin').click(zoomIn);

  element.find('#zoomlevel').on('change', () => {
    const currentZoom = parseInt($('#zoomlevel').attr('value'));
    scaleImage(currentZoom);
  });

  element.find('#tpo_map_container').on('wheel', (e) => {
    if (e.originalEvent.deltaY < 0) {
      zoomIn();
    }
    if (e.originalEvent.deltaY > 0) {
      zoomOut();
    }
  });

  element
    .find('#tpo_map_container img')
    .draggable({ containment: '#tpo_map_container', scroll: false });

  return element;
};

const scaleImage = (zoom) => {
  $('#tpo_map_container img').css('transform', `scale(${1 + zoom / 100})`);
  const imgElement = $('#tpo_map_container img');
  const xMax = imgElement[0].getBoundingClientRect().width / 2 - 200;
  const yMax = imgElement[0].getBoundingClientRect().height / 2 - 200;
  const xMin = xMax * -1;
  const yMin = yMax * -1;

  const currentLeft = imgElement.css('left');
  const currentTop = imgElement.css('top');

  if (currentLeft.substring(0, currentLeft.length - 2) > xMax) {
    imgElement.css('left', `${xMax}px`);
  }
  if (currentLeft.substring(0, currentLeft.length - 2) < xMin) {
    imgElement.css('left', `${xMin}px`);
  }

  if (currentTop.substring(0, currentTop.length - 2) > yMax) {
    imgElement.css('top', `${yMax}px`);
  }
  if (currentTop.substring(0, currentTop.length - 2) < yMin) {
    imgElement.css('top', `${yMin}px`);
  }

  updateImageDragProperties();
};

const updateImageDragProperties = () => {
  const width = $('#tpo_map_container img')[0].getBoundingClientRect().width;
  const height = $('#tpo_map_container img')[0].getBoundingClientRect().height;
  const x = $('#tpo_map_container')[0].getBoundingClientRect().x;
  const y = $('#tpo_map_container')[0].getBoundingClientRect().y;
  $('#tpo_map_container img').draggable('option', 'containment', [
    x + 400 - width,
    y + 400 - height,
    x,
    y,
  ]);
};

//////////
// MAIN //
//////////
const intercept = (urlMatch, callback) => {
  let send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener(
      'readystatechange',
      function () {
        if (this.responseURL.includes(urlMatch) && this.readyState === 4) {
          callback(this);
        }
      },
      false,
    );
    send.apply(this, arguments);
  };
};

$(document).ready(() => {
  setTimeout(() => {
    intercept('https://www.dreadcast.net/Item/Activate', applyTPModifications);
  }, A_SECOND);
});

GM_addStyle(`
    #tpo_header {
        border-bottom: 1px solid;
        padding-bottom: 5px;
        margin-bottom: 10px;
        color: #fff;
    }
     
    #tpo_header h2 span {
        position: absolute;
        right: 0;
        font-size: 1rem;
        font-weight: 400;
        font-variant: small-caps;
        padding-top: 10px;
        padding-bottom: 10px;
        top: -10px;
    }
     
    #tpo_header input {
        padding-left: 5px;
        border: 1px solid #7ec8d8;
        color: #7ec8d8;
    }
     
    #tpo_history_range input {
        width: 37%;
    }
     
    #tpo_search input {
        width: 80%;
        line-height: 1.2em;
    }
     
    #tpo_header button {
        border: 1px solid #7ec8d8;
        background: #7ec8d8;
        line-height: 1.2em;
        width: 17%;
        color: #10426b;
    }
     
    #tpo_header button:hover {
        background: #10426b;
        color: #7ec8d8;
    }
     
    #tpo_header_extra {
        margin-top: 10px;
    }
     
    .tpo_alert {
        width: 70%;
        text-align: center;
        margin: auto;
    }
     
    #tpo_history_copy {
        position: absolute;
        right: 0px;
        bottom: 0px;
        color: #7ec8d8;
        font-size: 1rem;
    }
     
    #tpo_menu {
        margin-top: 10px;
    }
     
    #tpo_content {
        width: 420px;
        max-height: 500px;
        overflow: auto;
    }
     
    .tpo_tabs {
        display: flex;
        align-items: center;
        justify-content: center;
    }
     
    .tpo_tab_btn {
       border: none;
       border-bottom: 1px solid gray;
       color: #eee;
       cursor: pointer;
       padding: 10px 0;
       margin: 0 0 5px 0;
       width: 30%;
    }
     
    .tpo_tab_btn_active {
        border-bottom: 2px solid #7ec8d8;
        color: #7ec8d8;
        font-weight: bold;
    }
     
    .tpo_map_section {
        padding-bottom: 50px;
    }
     
    #tpo_map_container {
        width: 400px;
        height: 400px;
        margin: auto;
        overflow: hidden;
    }
      
    #tpo_map_controls {
        position: absolute;
        bottom: 15px;
        right: 25px;
    }
     
    #tpo_map_controls button {
        width: 24px;
        height: 24px;
    }
     
    #tpo_map_controls button svg {
        width: 26px;
        height: 26px;
        overflow: hidden;
        top: -1px;
        left: -1px;
    }
     
    .tpo_button {
        background: white;
        padding: 0;
        color: #307998;
        text-align: center;
        border: 1px solid #fff;
        box-sizing: border-box;
        box-shadow: 0 0 5px #5298b4;
        border-radius: 3px;
    }
     
    .tpo_button:hover {
        background: #0b9bcb;
    }
     
    .tpo_button svg {
        stroke: none;
    }
     
    .tpo_button svg:hover {
        fill: #fff;
    }
     
    .tpo_mail_button {
        border: none;
    }
     
    .tpo_mail_button:hover {
        cursor: pointer;
    }
     
    .tpo_mail_button svg:hover {
        fill: #eee;
    }
     
    #tpo_map_controls input {
        height: 24px;
        margin: 0px 4px;
    }
     
    .tpo_profile_card {
    	border-radius: 4px;
    	box-shadow: 1px 1px 3px -1px rgba(0, 0, 0, 0.5);
    	max-height: 90px;
        height: 7vh;
    	margin: 0 auto 10px auto;
        display: flex;
    }
     
    .tpo_profile_info {
        padding: 5px;
        margin-right: auto;
        color: white;
        margin-left: 10px;
    }
     
    .tpo_profile_image img {
        max-height: 80px;
        height: 6.4vh;
        top: 3px;
        left: 3px;
    }
     
    .tpo_profile_action {
        padding: 10px;
        margin: auto 0px;
        float: right;
    }
     
    .tpo_profile_action button {
        width: 38px;
        height: 38px;
    }
     
    .tpo_arrow_seperator {
        font-weight: bold;
        padding: 0 2px 0 2px;
    }
     
    .tpo_one_dot_two_rem {
        line-height: 1.2rem;
        font-size: 1.2rem;
    }
     
    #tpo_cards {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        max-width: 45.2em;
    }
     
    .tpo_card {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        height: 170px;
        flex-direction: column;
        width: 14.8em;
    }
     
    .tpo_card > .tpo_card_content {
        border-radius: inherit;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        inset: 1px;
        padding: 0px 4px 10px 4px;
        position: absolute;
        z-index: 2;
        border: 1px solid #ffffff33;
    }
     
    .tpo_card > .tpo_card_content:hover {
        border: 1px solid #ffffff;
    }
     
    .tpo_card_image {
        display: flex;
        height: 140px;
        justify-content: center;
        overflow: hidden;
    }
     
    .tpo_card_info_wrapper {
        align-items: center;
        display: flex;
        flex-grow: 1;
        justify-content: flex-start;
    }
     
    .tpo_card_info {
        align-items: flex-start;
        display: flex;
        gap: 4px;
    }
     
    .tpo_card_info > i {  
        font-size: 1em;
        height: 20px;
        line-height: 20px;
    }
     
    .tpo_card_info_title > h3 {
        font-size: 1.1em;
        line-height: 20px;
    }
     
    .tpo_card_info_title > h4 {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.85em;
    }
    `);
