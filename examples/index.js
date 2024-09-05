$(document).ready(function () {
  DC.Network.loadSpreadsheet(
    '1Ygt9q6WEU8cR_86GptLpHZ6qLHATfX42R0qcPKaqvqo',
    'BDD',
    'A:C',
    'AIzaSyCSnNrK0PQMz20JVuUmuO9rl9iSWRHrPm4',
    (response) => console.log(response),
  );

  DC.TopMenu.add(DC.UI.Separator(), 3);
  DC.TopMenu.add(
    DC.UI.DropMenu('Test', [
      DC.UI.SubMenu(
        'Ping!',
        () =>
          DC.UI.PopUp(
            'test45',
            `Test`,
            `<h1>Test de fou de la mort qui tue !</h1>`,
          ),
        true,
      ),
    ]),
    4,
  );
  DC.UI.addSubMenuTo(
    'Paramètres ▾',
    DC.UI.SubMenu('Ping!', () => console.log('Pong!'), true),
    4,
  );

  DC.UI.SideMenu('test', 'Test', '<p>Coucou</p>');
  DC.UI.SideMenu('test2', 'Test 2', '<p>Coucou encore</p>');

  console.log(
    DC.Chat.t('coucou', { bold: true, italic: true, color: 'ababab' }),
  );

  nav.getChat().onSend((message, next, abort) => {
    console.log('BEFORE');
    return next();
  });
  nav.getChat().onAfterSend(() => {
    console.log('AFTER');
  });
});
