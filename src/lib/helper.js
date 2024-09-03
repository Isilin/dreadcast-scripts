// ==UserScript==
// @name        Scouter
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Main
// @version     1.0.0
// @author      Pelagia/IsilinBN
// @description 13/11/2023 02:55:01
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @connect      docs.google.com
// @connect      googleusercontent.com
// @connect      sheets.googleapis.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL
// @updateURL
// ==/UserScript==

// ===== JQuery utilities =====

$.fn.insertAt = function (index, element) {
  var lastIndex = this.children().size();
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index);
  }
  this.append(element);
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last());
  }
  return this;
};

// ===== Lib =====

const Util = {
  guard: (condition, message) => {
    if (!condition) throw new Error(message);
    return;
  },

  isArray: (o, optional = false) =>
    $.type(o) === 'array' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isString: (o, optional = false) =>
    $.type(o) === 'string' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isBoolean: (o, optional = false) =>
    $.type(o) === 'boolean' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isNumber: (o, optional = false) =>
    $.type(o) === 'number' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isFunction: (o, optional = false) =>
    $.type(o) === 'function' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isDate: (o, optional = false) =>
    $.type(o) === 'date' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isError: (o, optional = false) =>
    $.type(o) === 'error' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isRegex: (o, optional = false) =>
    $.type(o) === 'regexp' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isObject: (o, optional = false) =>
    $.type(o) === 'object' ||
    (optional && ($.type(o) === 'undefined' || $.type(o) === 'null')),

  isColor: (o, optional = false) => {
    if (optional && ($.type(o) === 'undefined' || $.type(o) === 'null'))
      return true;
    else {
      const colors = ['rouge', 'bleu', 'vert', 'jaune'];
      return (
        $.type(o) === 'string' &&
        (colors.includes(o) ||
          o.match(/^[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3}$/gi))
      );
    }
  },
};

// ===== Overwrite DC functions =====

MenuChat.prototype.original_send = MenuChat.prototype.send;
MenuChat.prototype.sendCallbacks = [];
MenuChat.prototype.afterSendCallbacks = [];
MenuChat.prototype.send = function () {
  const $nextFn = () => true;
  const $abortFn = () => false;
  const $res = this.sendCallbacks.every((callback) =>
    callback($nextFn, $abortFn),
  );
  if (!$res) {
    throw new Error('MenuChat.prototype.send: Error on sending message.');
  }

  this.original_send();

  this.afterSendCallbacks.every((callback) => callback());
};
MenuChat.prototype.onSend = (callback) => {
  MenuChat.prototype.sendCallbacks.push(callback);
};
MenuChat.prototype.onAfterSend = (callback) => {
  MenuChat.prototype.afterSendCallbacks.push(callback);
};

// ============================

const DC = {};

DC.LocalMemory = {
  init: (label, defaultValue) => {
    const $currentVal = GM_getValue(label);
    if ($currentVal === undefined) {
      GM_setValue(label, defaultValue);
      return defaultValue;
    } else {
      return $currentVal;
    }
  },

  set: (label, value) => GM_setValue(label, value),

  get: (label) => GM_getValue(label),

  delete: (label) => GM_deleteValue(label),

  list: () => GM_listValues(),
};

DC.Style = {
  apply: (css) => {
    Util.guard(
      Util.isString(css, true),
      "DC.Style.apply: 'css' parameter should be a string.",
    );

    if (typeof GM_addStyle !== 'undefined') {
      GM_addStyle(css);
    } else {
      let $styleNode = document.createElement('style');
      $styleNode.appendChild(document.createTextNode(css));
      (document.querySelector('head') || document.documentElement).appendChild(
        $styleNode,
      );
    }
  },
};

DC.TopMenu = {
  get: () => {
    return $('.menus');
  },

  add: (element, index = 0) => {
    Util.guard(
      Util.isNumber(index),
      "DC.TopMenu.add: 'index' parameter should be a number.",
    );

    const $dom = DC.TopMenu.get();
    if (index === 0) {
      $dom.prepend(element);
    } else {
      $dom.insertAt(index, element);
    }
  },
};

DC.UI = {
  Separator: () => $('<li class="separator" />'),

  Menu: (label, fn) =>
    $(`<li id="${label}" class="couleur5">${label}</li>`).bind('click', fn),

  SubMenu: (label, fn, separatorBefore = false) =>
    $(
      `<li class="link couleur2 ${
        separatorBefore ? 'separator' : ''
      }">${label}</li>`,
    ).bind('click', fn),

  DropMenu: (label, submenu) => {
    const $label = label + '▾';

    const $list = $('<ul></ul>');
    if (!Array.isArray(submenu)) {
      throw new Error("'submenu' should be an array in DC.UI.DropMenu !");
    }
    submenu.forEach(($submenu) => {
      $($list).append($submenu);
    });

    return $(
      `<li id="${label}" class="parametres couleur5 right hover" onclick="$(this).find('ul').slideDown();">${$label}</li>`,
    ).append($list);
  },

  addSubMenuTo: (name, element, index = 0) => {
    const $menu = $(`.menus li:contains("${name}") ul`);

    if (index === 0) {
      $menu.prepend(element);
    } else {
      $menu.insertAt(index, element);
    }
  },

  TextButton: (id, label, fn) =>
    $(`<div id="${id}" class="btnTxt">${label}</div>`).bind('click', fn),

  Button: (id, label, fn) =>
    $(
      `<div id="${id}" class="btn add link infoAide"><div class="gridCenter">${label}</div></div>`,
    ).bind('click', fn),

  PopUp: (id, title, content) => {
    $('#loader').fadeIn('fast');

    const html = `
      <div id="${id}" class="dataBox"  onClick="engine.switchDataBox(this)" style="display: block; z-index: 5; left: 764px; top: 16px;">
        <relative>
          <div class="head" ondblclick="$('#${id}').toggleClass('reduced');">
          <div title="Fermer la fenêtre (Q)" class="info1 link close transition3s" onClick="engine.closeDataBox($(this).parent().parent().parent().attr('id'));" alt="$('${id}').removeClass('active')">
            <i class="fas fa-times"></i>
          </div>
          <div title="Reduire/Agrandir la fenêtre" class="info1 link reduce transition3s" onClick="$('#${id}').toggleClass('reduced');">
            <span>-</span>
          </div>
          <div class="title">${title}</div>
        </div>
        <div class="dbloader"></div>
        <div class="content">
          ${content}
        </div>
      </relative>
    </div>`;

    engine.displayDataBox(html);
    $('#loader').hide();
  },

  SideMenu: (id, label, content) => {
    const idContainer = id + '_container';
    const idButton = id + '_button';
    const idContent = id + '_content';

    if ($('div#zone_sidemenu').length === 0) {
      $('body').append('<div id="zone_sidemenu"></div>');
    }
    $('#zone_sidemenu').append(
      `<div id="${idContainer}" class="sidemenu_container"></div>`,
    );

    $(`#${idContainer}`).append(
      DC.UI.TextButton(
        idButton,
        '<i class="fas fa-chevron-left"></i>' + label,
        () => {
          const isOpen = $(`#${idButton}`).html().includes('fa-chevron-right');
          if (isOpen) {
            $(`#${idButton}`)
              .empty()
              .append('<i class="fas fa-chevron-left"></i>' + label);
            $(`#${idContainer}`).css('right', '-220px');
          } else {
            $(`#${idButton}`)
              .empty()
              .append('<i class="fas fa-chevron-right"></i>' + label);
            $(`#${idContainer}`).css('right', '0px');
          }
        },
      ),
    );

    $(`#${idContainer}`).append(
      `<div id="${idContent}" class="sidemenu_content">${content}</div>`,
    );

    DC.Style.apply(`
      #zone_sidemenu {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0px;
        top: 80px;
        z-index: 999999;
      }

      .sidemenu_container {
        display: flex;
        right: -220px;
      }

      #zone_sidemenu .btnTxt {
        margin: 0 auto;
        min-width: 100px;
        max-width: 100px;
        font-size: 1rem;
        padding: 1%;
        display: grid;
        height: 100%;
        box-sizing: border-box;
        grid-template-columns: 10% 1fr;
        align-items: center;
        text-transform: uppercase;
        font-family: Arial !important;
        line-height: normal !important;
      }

      #zone_sidemenu .btnTxt:hover {
        background: #0b9bcb;
        color: #fff;
      }

      .sidemenu_content {
        background-color: #000;
        color: #fff !important;
        box-shadow: 0 0 15px -5px inset #a2e4fc !important;
        padding: 10px;
        width: 200px;
      }
    `);
  },
};

DC.DB = {
  loadSpreadsheet: (sheetId, tabName, range, apiKey, onLoad) => {
    const urlGoogleSheetDatabase = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}!${range}?key=${apiKey}`;
    GM_xmlhttpRequest({
      method: 'GET',
      url: urlGoogleSheetDatabase,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
      onload: function (response) {
        const result = response.response.values;
        onLoad(result);
      },
      onerror: (err) => console.log(err),
    });
  },
};

DC.Chat = {
  sendMessage: (message) => {
    UTil.guard(
      Util.isString(message),
      "DC.Chat.sendMessage: 'message'parameter should be a string.",
    );

    $('#chatForm .text_chat').val(message);
    $('#chatForm .text_valider').click();
  },

  t: (message, decoration) => {
    Util.guard(
      Util.isBoolean(decoration.bold, true),
      "DC.Chat.t: 'bold' optional parameter should be a boolean.",
    );
    Util.guard(
      Util.isBoolean(decoration.italic, true),
      "DC.Chat.t: 'italic' optional parameter should be a boolean.",
    );
    Util.guard(
      Util.isColor(decoration.color, true),
      "DC.Chat.t: 'color' optional parameter should be a color string.",
    );

    var prefix = '';
    var suffix = '';

    if (decoration.bold) {
      prefix += '[b]';
      suffix += '[b]';
    }

    if (decoration.italic) {
      prefix += '[i]';
      suffix = '[/i]' + suffix;
    }

    if (decoration.color && decoration.color !== '') {
      prefix += '[c=' + decoration.color + ']';
      suffix = '[/c]' + suffix;
    }

    return prefix + message + suffix;
  },
};
