// ==UserScript==
// @name        Dreadcast Script Manager
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Main
// @version     1.0.0
// @author      Pelagia/IsilinBN
// @description 13/11/2023 02:55:01
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @require      https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/src/lib/helper.js?version=1.0.5
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL
// @updateURL
// ==/UserScript==

const LIST_TAG = 'dcm_list';
const ALL_DISABLED_TAG = 'dcm_all_disabled';

let newSettings, newAllDisabled;

const initPersistence = () => {
  // Init persistent memory if needed.
  DC.LocalMemory.init(LIST_TAG, {});
  DC.LocalMemory.init(ALL_DISABLED_TAG, false);

  // Load the current settings.
  let settings = DC.LocalMemory.get(LIST_TAG);
  let allDisabled = DC.LocalMemory.get(ALL_DISABLED_TAG);

  return { settings, allDisabled };
};

const synchronizeSettings = (settings, scripts) => {
  let tmp = settings;

  scripts.forEach((script) => {
    if (!Object.hasOwn(tmp, script.id)) {
      // Update the settings, if there is new scripts.
      tmp[script.id] = false;
    }
  });

  // Remove in settings, scripts that doesn't exist anymore.
  tmp = Object.keys(tmp)
    .filter((key) => scripts.find((script) => script.id === key) !== undefined)
    .reduce((obj, key) => {
      obj[key] = tmp[key];
      return obj;
    }, {});

  // Save the new settings in persistent memory.
  DC.LocalMemory.set(LIST_TAG, tmp);

  return tmp;
};

const createScriptLine = (script, index) => {
  const line = $(`
    <tr style="border-top: 1px solid white; border-left: 1px solid white; border-right: 1px solid white;">
      <td style="padding: 5px 0 0 5px">${index}</td>
      <td style="padding: 5px 0">${script.name}</td>
      <td class="enabled_cell" style="padding: 5px 0; display: flex; justify-content: center;"></td>
      <td class="setting_cell" style="padding: 5px 5px 0 0;"></td>
      <td class="doc_cell" style="padding: 5px 5px 0 0;"></td>
      <td class="rp_cell" style="padding: 5px 5px 0 0;"></td>
      <td class="contact_cell" style="padding: 5px 5px 0 0;"></td>
    </tr>
    <tr style="border-bottom: 1px solid white; border-left: 1px solid white; border-right: 1px solid white;">
      <td /><td colspan="2" style="padding: 0 5px 5px 5px"><small><em class="couleur5">${script.description}</em></small></td>
    </tr>
  `);
  $('.enabled_cell', line).append(
    DC.UI.Checkbox(
      `${script.id}_check`,
      newSettings[script.id],
      () => (newSettings[script.id] = !newSettings[script.id]),
    ),
  );
  if (script.settings) {
    $('.setting_cell', line).append(
      DC.UI.Tooltip(
        'Settings',
        DC.UI.Button(
          `${script.id}_setting`,
          '<i class="fas fa-cog"></i>',
          () => {},
        ),
      ),
    );
  }
  if (script.doc && script.doc !== '') {
    $('.doc_cell', line).append(
      DC.UI.Tooltip(
        'Documentation',
        DC.UI.Button(`${script.id}_doc`, '<i class="fas fa-book"></i>', () =>
          window.open(script.doc, '_blank'),
        ),
      ),
    );
  }
  if (script.rp && script.rp !== '') {
    $('.rp_cell', line).append(
      DC.UI.Tooltip(
        'Topic RP',
        DC.UI.Button(
          `${script.id}_rp`,
          '<div class=""gridCenter>RP</div>',
          () => window.open(script.doc, '_blank'),
        ),
      ),
    );
  }
  if (script.contact && script.contact !== '') {
    $('.contact_cell', line).append(
      DC.UI.Tooltip(
        'Contact',
        DC.UI.Button(`${script.id}_rp`, '<i class="fas fa-envelope"></i>', () =>
          nav.getMessagerie().newMessage(script.contact),
        ),
      ),
    );
  }

  return line;
};

$(() => {
  let { settings, allDisabled } = initPersistence();

  // Load list of scripts
  DC.Network.loadJson(
    'https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/data/scripts.json',
  )
    .then((scripts) => {
      settings = synchronizeSettings(settings, scripts);

      // Create the interface.
      DC.UI.addSubMenuTo(
        'Paramètres ▾',
        DC.UI.SubMenu(
          'Scripts & Skins',
          () => {
            // TODO ajouter dans la liste tous les scripts (en utilisant le lien greasemonkey) et remplacer petit à petit par les versions locales nettoyées.

            // On récupère une config temporaire qu'on appliquera uniquement si sauvegardée.
            newSettings = settings;
            newAllDisabled = allDisabled;

            const content = $(`<div style="color: white; max-width: 450px;">
              <div id="scripts_all_switch" style="display: flex;gap: 1rem;margin-bottom: 1rem;">
                <p>Tout désactiver</p>
              </div>
              <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <legend style="margin-right: 1rem; min-width: 60px;">Filtrer :</legend>
                <div style="display: flex; gap: 5%; flex-wrap: wrap;">
                  <div>
                    <input type="radio" id="all_category" name ="category" value ="all" checked />
                    <label for="all_category">All</label>
                  </div>
                  <div>
                    <input type="radio" id="mailing_category" name ="category" value ="mailing" />
                    <label for="mailing_category">Messagerie</label>
                  </div>
                  <div>
                    <input type="radio" id="chat_category" name ="category" value ="chat" />
                    <label for="chat_category">Chat</label>
                  </div>
                  <div>
                    <input type="radio" id="silhouette_category" name ="category" value ="silhouette" />
                    <label for="silhouette_category">Silhouette</label>
                  </div>
                  <div>
                    <input type="radio" id="forum_category" name ="category" value ="forum" />
                    <label for="forum_category">Forum</label>
                  </div>
                  <div>
                    <input type="radio" id="ui_category" name ="category" value ="ui" />
                    <label for="ui_category">UI</label>
                  </div>
                  <div>
                    <input type="radio" id="misc_category" name ="category" value ="misc" />
                    <label for="misc_category">Autres</label>
                  </div>
                </div>
              </div>
              <table style="border-collapse: collapse; width: 100%; border: 1px solid white; padding: 5px; font-size: 15px; text-align: center;">
                <thead>
                  <th style="padding: 5px 0 5px 5px" scope="col">#</th>
                  <th style="padding: 5px 0 5px 0" scope="col">Nom</th>
                  <th style="padding: 5px 5px 5px 0" scope="col">Actif</th>
                  <th class="short" />
                  <th class="short" />
                  <th class="short" />
                  <th class="short" />
                </thead>
                <tbody></tbody>
              </table>
            </div>`);

            $(document).on('change', "input[name='category']", (e) => {
              const filter = e.target.value;

              // Empty the table
              $('tbody', content).empty();
              // Add filtered lines
              scripts
                .filter(
                  (script) => script.category === filter || filter === 'all',
                )
                .forEach((script, index) => {
                  const line = createScriptLine(script, index);
                  $('tbody', content).append(line);
                });
            });

            // Sauvegarder les paramètres.
            content.append(
              DC.UI.TextButton('scripts_refresh', 'Sauvegarder', () => {
                settings = newSettings;
                allDisabled = newAllDisabled;
                DC.LocalMemory.set(LIST_TAG, settings);
                DC.LocalMemory.set(ALL_DISABLED_TAG, allDisabled);
                location.reload();
              }),
            );
            content.append(
              $(
                `<p><em class="couleur5">⚠ Sauvegarder votre configuration va raffraichir la page.<br />
             Pensez à sauvegarder votre travail en cours avant.</em></p>`,
              ),
            );

            // Switch button pour désactiver tous les scripts.
            $('#scripts_all_switch', content).append(
              DC.UI.Checkbox(
                'scripts_all_check',
                newAllDisabled,
                () => (newAllDisabled = !newAllDisabled),
              ),
            );

            scripts.forEach((script, index) => {
              const line = createScriptLine(script, index);
              $('tbody', content).append(line);
            });

            return DC.UI.PopUp('scripts_modal', 'Scripts & Skins', content);
          },
          true,
        ),
        5,
      );

      // Load the scripts
      if (!allDisabled) {
        scripts.forEach((script) => {
          if (settings[script.id]) {
            DC.Network.loadScript(script.url)
              .then(() => {
                console.info(
                  `DSM - '${script.name}' script has been loaded successfully.`,
                );
              })
              .catch((err) => {
                console.error(
                  `DSM - Error loading '${script.name}' script: ` + err,
                );
              });
          }
        });
      }
    })
    .catch((err) => {
      console.error('DSM - Error loading the list of scripts :' + err);
    });
});
