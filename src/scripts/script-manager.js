// ==UserScript==
// @name        Dreadcast Script Manager
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Main
// @version     1.0.0
// @author      Pelagia/IsilinBN
// @description 13/11/2023 02:55:01
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @require      https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/src/lib/helper.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL
// @updateURL
// ==/UserScript==

const PERSISTENCE_TAG = 'dcm_list';

$(() => {
  console.log('DCM START');

  // Init persistent memory if needed.
  DC.LocalMemory.init(PERSISTENCE_TAG, {});

  // Load the current settings.
  let settings = DC.LocalMemory.get(PERSISTENCE_TAG);

  // Load list of scripts
  DC.Network.loadJson(
    'https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/data/scripts.json',
  )
    .then((scripts) => {
      scripts.forEach((script) => {
        if (!Object.hasOwn(settings, script.id)) {
          // Update the settings, if there is new scripts.
          settings[script.id] = false;
        }
      });

      // Remove in settings, scripts that doesn't exist anymore.
      settings = Object.keys(settings)
        .filter(
          (key) => scripts.find((script) => script.id === key) !== undefined,
        )
        .reduce((obj, key) => {
          obj[key] = settings[key];
          return obj;
        }, {});

      // Save the new settings in persistent memory.
      DC.LocalMemory.set(PERSISTENCE_TAG, settings);

      // Create the interface.
      DC.UI.addSubMenuTo(
        'Paramètres ▾',
        DC.UI.SubMenu(
          'Scripts & Skins',
          () => {
            const content = $(`<div style="color: white;">
            <table style="border-collapse: collapse; width: 100%; border: 1px solid white; padding: 5px; font-size: 15px; text-align: center;">
              <thead>
                <th style="padding: 5px 0 5px 5px" scope="col">#</th>
                <th style="padding: 5px 0 5px 0" scope="col">Nom</th>
                <th style="padding: 5px 5px 5px 0" scope="col">Actif</th>
                <th />
              </thead>
              <tbody></tbody>
            </table>
          </div>`);
            content.append(
              DC.UI.TextButton('scripts_refresh', 'Sauvegarder', () => {
                DC.LocalMemory.set(PERSISTENCE_TAG, settings);
                location.reload();
              }),
            );
            content.append(
              $(
                `<p><em>⚠ Sauvegarder votre configuration va raffraichir la page.<br />
             Pensez à sauvegarder votre travail en cours avant.</em></p>`,
              ),
            );

            scripts.forEach((script, index) => {
              const line = $(`
              <tr style="border-top: 1px solid white; border-left: 1px solid white; border-right: 1px solid white;">
                <td style="padding: 5px 0 0 5px">${index}</td>
                <td style="padding: 5px 0">${script.name}</td>
                <td class="enabled_cell" style="padding: 5px 0; display: flex; justify-content: center;"></td>
                <td class="setting_cell" style="padding: 5px 5px 0 0;"></td>
              </tr>
              <tr style="border-bottom: 1px solid white; border-left: 1px solid white; border-right: 1px solid white;">
                <td /><td colspan="2" style="padding: 0 5px 5px 5px"><small><em>${script.description}</em></small></td>
              </tr>
              `);
              $('.enabled_cell', line).append(
                DC.UI.Checkbox(
                  `${script.id}_check`,
                  settings[script.id],
                  () => (settings[script.id] = !settings[script.id]),
                ),
              );
              if (script.settings) {
                $('.setting_cell', line).append(
                  DC.UI.Button(
                    `${script.id}_setting`,
                    '<i class="fas fa-cog"></i>',
                    () => {},
                  ),
                );
              }

              $('tbody', content).append(line);
            });

            return DC.UI.PopUp('scripts_modal', 'Scripts & Skins', content);
          },
          true,
        ),
        5,
      );

      // Load the scripts
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
    })
    .catch((err) => {
      console.error('DSM - Error loading the list of scripts :' + err);
    });
});
