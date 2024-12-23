// ==UserScript==
// @name        ECCB
// @namespace   Dreadcast
// @match       https://www.dreadcast.net/Main
// @version     1.2.0
// @author      Pelagia/Isilin
// @description Editeur de Commentaires de Conteneurs en Banque
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/488837/ECCB.user.js
// @updateURL   https://update.greasyfork.org/scripts/488837/ECCB.meta.js
// ==/UserScript==

GM_addStyle(`
      #liste_stocks .nom_item {
        top: 28px !important;
      }
   
      .nm_description_item_named_bank {
        position: absolute;
        top: 45px;
        right: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        width: 160px;
        max-height: 50px;
      }
   
      .nm_description_item_named_bank span {
        max-height: 30px;
      }
   
      .nm_description_box {
        left: 97px;
        top: 20px;
        inline-size: 350px;
        max-height: 15px;
        overflow: hidden;
      }
  `);

// ===== Core =====

const DATA_TAG = 'eccb_data';

const initPersistence = () => {
  DC.LocalMemory.init(DATA_TAG, []);

  return DC.LocalMemory.get(DATA_TAG);
};

let data = [];

// ===== Logic =====

const customDescription = (index) => {
  Util.guardNumber('ECCB:customDescription', 'index', index);

  var input = prompt(
    'Saisissez la description de votre coffre :',
    data[index].description,
  );
  if (input !== null) {
    data[index].description = input;
    DC.LocalMemory.set(DATA_TAG, data);
    $(`#nm_description_text_${index}`).text(input);
  }
};

const customColor = (value, index) => {
  Util.guardString('ECCB:customColor', 'value', value);
  Util.guardNumber('ECCB:customColor', 'index', index);

  data[index].color = value;
  DC.LocalMemory.set(DATA_TAG, data);
};

// ===== UI =====
$(document).ready(function () {
  data = initPersistence();

  $(document).ajaxSuccess(function (e, xhr, opt) {
    if (opt.url.includes('Company/Account/View')) {
      for (var i = 1; i <= 10; ++i) {
        $(`.stock${i}`).append(
          `<div class="eccb_description_item_named_bank" id="eccb_edit_description_block_${i}"></div>`,
        );
        $(`.stock${i}`).append(
          `<div class="eccb_description_box" id="eccb_description_text_${i}">${data[i].description}</div>`,
        );
        $(`#eccb_edit_description_block_${i}`).append(
          DC.UI.TextButton(`eccb_edit_description_${i}`, 'Éditer', () =>
            customDescription(i),
          ),
        );
        $(`#eccb_edit_description_block_${i}`).append(
          DC.UI.ColorPicker(`eccb_color_${i}`, data[i].color, (e) =>
            customColor(e, i),
          ),
        );
      }
    }
  });
});
