// ==UserScript==
// @name        ExportEM
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Main
// @version     1.0.0
// @author      Pelagia/IsilinBN
// @description 20/03/2025 18:39:00
// @license     http://creativecommons.org/licenses/by-nc-nd/4.0/
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js?version=1533476
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     update.greasyfork.org
// ==/UserScript==

$(() => {
  function copyToClipboard(text) {
    const textarea = $('<textarea>')
      .css({ position: 'absolute', opacity: 0 })
      .val(text)
      .appendTo('body');
    textarea.select();

    try {
      document.execCommand('copy');
      alert('✅ Copié dans le presse-papier !');
    } catch (err) {
      alert('⚠️ Échec de la copie :', err);
    }

    textarea.remove();
  }

  const formatMessageForForum = (html) => {
    // Crée un objet jQuery temporaire pour manipuler facilement le HTML
    var $html = $('<div>').html(html);

    // 1. Supprimer la dernière div spécifique (signature) si elle existe
    $html
      .find('div[style="clear:both;text-align:center;color:#8ea6aa;"]')
      .last()
      .remove();

    // 2. Remplacer les <br /> par des sauts de ligne
    $html.find('br').replaceWith('');

    // 3. Remplacer les balises <center><a><img></center> par [img=src]
    $html.find('center a img').each(function () {
      var src = $(this).attr('src');
      $(this)
        .closest('center')
        .replaceWith('[img=' + src + ']');
    });

    // Retourner le texte formaté
    return $html.text().trim();
  };

  const exportEM = (id) => {
    var $children = $(
      '#db_message_' + id + ' .content .zone_conversation',
    ).children();
    const message = $children.get().slice(1).reverse();

    const results = [];
    const queue = message.slice();

    const name = $('#txt_pseudo').html();

    function processQueue() {
      if (!queue.length) {
        const finalResult = results
          .map((msg, index) => {
            if (msg.avatar.includes(name)) {
              return `[droite]${msg.date} [img=${msg.avatar} taille=70][/droite][quote][droite]${msg.formattedContent}[/droite][/quote]`;
            } else {
              return `[img=${msg.avatar} taille=70] ${msg.date}[quote]${msg.formattedContent}[/quote]`;
            }
          })
          .join('\n'); // format personnalisé

        copyToClipboard(finalResult);

        return;
      }

      const currentChild = $(queue.shift());
      const id_message = currentChild.attr('id').match(/convers_(\d+)/)[1];
      const date = $('.ligne1', currentChild).html();

      nav.getMessagerie().openConversationMessage(id, id_message);
      console.log(id_message);

      $(document).one('ajaxSuccess', function (event, xhr, settings) {
        if (settings.url.indexOf('action=ReadMessage') !== -1) {
          const avatar = $(
            '#db_message_' + id + ' .content .contenu .avatar',
          ).attr('src');
          const content = $(
            '#db_message_' + id + ' .content .contenu .texte',
          ).html();
          const formattedContent = formatMessageForForum(content);

          results.push({ id_message, date, avatar, formattedContent });

          // Traiter le message suivant après celui-ci
          processQueue();
        }
      });
    }
    processQueue();
  };

  $(document).ready(function () {
    $(document).ajaxComplete(function (event, xhr, settings) {
      if (settings.url.indexOf('action=OpenMessage') !== -1) {
        var id_conversation = settings.url.match(/id_conversation=(\d+)/)[1];

        var intervalCheck = setInterval(function () {
          var $div = $('#db_message_' + id_conversation);
          if ($div.length) {
            console.log('ok ?');
            clearInterval(intervalCheck);

            $('#db_message_' + id_conversation + ' .head .title').before(
              '<div title="Exporter sur EM" class="info1 link edit" id="exportEM"></div>',
            );
            $('#db_message_' + id_conversation + ' #exportEM')
              .css({
                position: 'absolute',
                right: '130px',
                top: '-1px',
                width: '34px',
                height: '34px',
                background:
                  'url(../../../images/fr/design/boutons/boutons.png) -229px -382px no-repeat',
              })
              .hover(
                function () {
                  $(this).css({ 'background-position': '-264px -382px' });
                },
                function () {
                  $(this).css({ 'background-position': '-229px -382px' });
                },
              )
              .click(function () {
                exportEM(id_conversation);
              });
          }
        }, 100);
      }
    });
  });
});
