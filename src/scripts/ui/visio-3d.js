// ==UserScript==
// @name        Visio 3D
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Main
// @version     1.3.1
// @author      Pelagia/IsilinBN
// @description 13/11/2023 02:55:01
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @connect docs.google.com
// @connect googleusercontent.com
// @connect sheets.googleapis.com
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481981/Visio%203D.user.js
// @updateURL https://update.greasyfork.org/scripts/481981/Visio%203D.meta.js
// ==/UserScript==

// HACK ME IF YOU CAN
const hackMe = true;

// ====== Lib Functions =====
function getUrl(element) {
  var bg = $(element).css('background-image');
  bg = bg.replace('url(', '').replace(')', '').replace(/\"/gi, '');
  return bg;
}

function getIdFromUrl(url) {
  return url.replace(/(.*)[\_|\/](\d{1,5})\.(.*)/gi, '$2');
}

// ===== Core Functions =====
function getPlan(type) {
  if (type !== 'hd' && type !== 'ld') {
    throw new Error("Plan type should be 'hd' or 'ld' only !");
  }

  var id = getIdFromUrl(getUrl('#carte_fond'));
  return (
    'https://www.dreadcast.net/images/batiments/' +
    type +
    '/batiment_' +
    id +
    '.png'
  );
}

var originalPlan = getUrl('#carte_fond');
var simulatePlan = false;

function setPlan(url) {
  $('#carte_fond').css('background-image', 'url(' + url + ')');
  simulatePlan = true;
}

function resetPlan() {
  $('#carte_fond').css('background-image', 'url(' + originalPlan + ')');
  simulatePlan = false;
}

// ===== GUI =====
$('body').append(`
  <style>
    #scanPanel {
      position: absolute;
      right: -220px;
      top: 40px;
      z-index: 999999;
      display: none;
      font-family: Arial !important;
      line-height: normal !important;
    }

    #scanToggle {
      margin-top: 0px;
      height: fit-content;
      text-transform: uppercase;
      font-size: 1rem;
      background: #fff;
      color: #0296bb;
    }

    #scanToggle:hover {
      background: #0b9bcb;
      color: #fff;
    }

    #scanOptions {
      background-color: #000;
      color: #fff !important;
      box-shadow: 0 0 15px -5px inset #a2e4fc !important;
      padding: 10px;
      width: 200px;
    }

    .titre {
      text-transform: uppercase;
      font-size: 1rem;
    }

    .planButton, .overview, #formNewMap, .decoButton {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    #planHD, #planLD, #planDeco {
      font-size: 12px;
      text-transform: uppercase;
    }

    .overview {
      margin-bottom: 0.5rem;
    }

    #planOverview, #planOverlay {
      transform: rotateX(55deg) rotateY(0deg) rotateZ(-45deg);
      transform-style: preserve-3d;
    }

    #planOverlay {
      position: absolute;
      left: 25px;
      top: -5px;
      right: 25px;
      height: 120px;
      background: transparent url('http://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
      background-repeat: repeat;
      animation: overlay-anim .2s infinite;
      opacity: .9;
      visibility: visible;
    }

    @keyframes overlay-anim {
      0% { transform: translate(0,0) }
      10% { transform: translate(-5%,-5%) }
      20% { transform: translate(-10%,5%) }
      30% { transform: translate(5%,-10%) }
      40% { transform: translate(-5%,15%) }
      50% { transform: translate(-10%,5%) }
      60% { transform: translate(15%,0) }
      70% { transform: translate(0,10%) }
      80% { transform: translate(-15%,0) }
      90% { transform: translate(10%,5%) }
      100% { transform: translate(5%,0) }
    }

    #formNewMap {
      position: relative;
      width: 85%;
      border: 1px solid #7ec8d8 !important;
      height: fit-content;
    }

    #urlNewMap {
      border: none;
      background: 0 0;
      color: #7ec8d8;
      width: 90%;
      padding: 3px;
      box-sizing: border-box;
      font-size: 1rem;
    }

    #testMap {
      background: #7ec8d8;
      color: #10426b;
      width: 10%;
      height: 100%;
      position: absolute;
      bottom: 0;
      right: 0;
      border: 1px solid #7ec8d8;
      border-width: 0 0 0 1px;
      display: grid;
    }

    #resetMap {
      background: #7ec8d8;
      color: #10426b;
      width: 10%;
      height: 100%;
      position: absolute;
      bottom: 0;
      right: -15%;
      border: 1px solid #7ec8d8;
      display: grid;
    }

    #testMap:hover, #resetMap:hover {
      color: #7ec8d8;
      background: 0 0;
    }

    #scanNomLieu, #scanAdressLieu {
      color: #999;
      text-transform: uppercase;
      font-size: 10px;
    }

    #refreshScanPanel {
      position: absolute;
      right: 0px;
      top: 40px;
      z-index: 999999;
      display: flex;
      font-family: Arial !important;
      line-height: normal !important;
    }

    #refreshScanScript {
      margin-top: 0px;
      height: fit-content;
      text-transform: uppercase;
      font-size: 1rem;
      background: #fff;
      color: #0296bb;
    }

    #refreshScanScript:hover {
      background: #0b9bcb;
      color: #fff;
    }
  </style>
`);

$('body').append(`
  <div id="refreshScanPanel">
    <div class='btnTxt' id="refreshScanScript">⟳ Refresh</div>
  </div>
  <div id="scanPanel">
    <div class='btnTxt' id="scanToggle">&lt; Scan</div>
    <div id="scanOptions">
      <div id='scanTitre' class='titre'>Scan 3D - Lieu ID#${getIdFromUrl(
        originalPlan,
      )}</div>
      <div id='info'>
        <div id='scanNomLieu'>${$('#lieu_actuel .titre1').text()}</div>
        <div id='scanAdressLieu'>${$('#lieu_actuel .titre2').text()}</div>
      </div>
      <div class='planButton'>
        <div class='btnTxt' id="planHD">Plan HD</div>
        <div class='btnTxt' id="planLD">Plan LD</div>
      </div>
      <div class='overview'>
        <img id="planOverview" src="${originalPlan}" height="120" />
        <div id="planOverlay"></div>
      </div>
      <div class='decoButton'>
        <div class='btnTxt' id="planDeco">Décoration</div>
      </div>
      <div id='formNewMap'>
        <input id='urlNewMap' class='text_chat' type='text' placeholder="Url du plan..." />
        <button class='text_valider transition3s' id="testMap">▶</button>
        <button class='text_valider transition3s' id="resetMap">⟳</button>
      </div>
    </div>
  </div>
`);

// ===== GUI Interaction =====
let showScanGUI = false;
function onGuiOpen() {
  $('#scanPanel').css('right', '0px');
  $('#scanToggle').text('> Scan');
  showScanGUI = true;

  $('#planHD').click(function () {
    var url = getPlan('hd');
    window.open(url, '_blank').focus();
  });

  $('#planLD').click(function () {
    var url = getPlan('ld');
    window.open(url, '_blank').focus();
  });

  $('#planDeco').click(function () {
    var url = originalPlan;
    window.open(url, '_blank').focus();
  });

  if (!simulatePlan) {
    originalPlan = getUrl('#carte_fond');
  }

  $('#scanTitre').text(`Visio 3D - Lieu ID#${getIdFromUrl(originalPlan)}`);

  $('#planOverview').attr('src', originalPlan);

  $('#testMap').click(function () {
    setPlan($('#urlNewMap').val());
  });

  $('#resetMap').click(function () {
    resetPlan();
    $('#urlNewMap').val('');
  });

  $('#scanNomLieu').text($('#lieu_actuel .titre1').text());
  $('#scanAdressLieu').text($('#lieu_actuel .titre2').text());
}

function onGuiClose() {
  $('#scanPanel').css('right', '-220px');
  $('#scanToggle').text('< Scan');
  showScanGUI = false;

  $('#planHD').off();
  $('#planLD').off();
  $('#planDeco').off();
  $('testMap').off();
  $('resetMap').off();
}

// Close if click on map;
$('#zone_carte').click(function () {
  if (showScanGUI) {
    onGuiClose();
  }
});

$('#scanToggle').click(function () {
  if (showScanGUI) {
    onGuiClose();
  } else {
    onGuiOpen();
  }
});

// ===== Check equipments =====

const API_KEY = 'AIzaSyAgS_cjEerpTKyHEZa6JjfUwAdxM91Vpuc';
const SHEET_ID = '1AfzRlbZBh-DzpMNcXgM854D7xU6sxSuSbYQItMlUJKU';
const SHEET_NAME = 'DB';
const SHEET_RANGE = 'B2:B';
const urlGoogleSheetDatabase = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${SHEET_RANGE}?key=${API_KEY}`;

var allowedEquipments = [];
var equipments = [];

function checkEquipments() {
  equipments = [
    $('.zone_case1 > div > div > img').attr('id')?.split('_')[0],
    $('.zone_case2 > div > div > img').attr('id')?.split('_')[0],
    $('.zone_case3 > div > div > img').attr('id')?.split('_')[0],
    $('.zone_case4 > div > div > img').attr('id')?.split('_')[0],
    $('.zone_case5 > div > div > img').attr('id')?.split('_')[0],
    $('.zone_case6 > div > div > img').attr('id')?.split('_')[0],
    //  $('.zone_case-1 > div > div > img').attr('id').split('_')[0],
    //  $('.zone_case10 > div > div img').attr('id').split('_')[0],
    //  $('.zone_case11 > div > div img').attr('id').split('_')[0],
    //  $('.zone_case12 > div > div img').attr('id').split('_')[0],
    //  $('.zone_case13 > div > div img').attr('id').split('_')[0],
  ];

  if (
    allowedEquipments.filter((value) => equipments.includes(value)).length >
      0 ||
    hackMe
  ) {
    $('#scanPanel').css('display', 'flex');
    $('#refreshScanPanel').css('display', 'none');
  } else {
    $('#scanPanel').css('display', 'none');
    $('#refreshScanPanel').css('display', 'flex');
  }
}

var getIDs = function () {
  GM_xmlhttpRequest({
    method: 'GET',
    url: urlGoogleSheetDatabase,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
    onload: function (response) {
      allowedEquipments = response.response.values.flat();
      checkEquipments();
    },
    onerror: (err) => console.log(err),
  });
};

$(document).ready(function () {
  $.ajaxSetup({ async: false });
  getIDs();
  $.ajaxSetup({ async: true });
});

$('#refreshScanPanel').click(function () {
  checkEquipments();
});

console.log('Script Visio 3D - Actif');
