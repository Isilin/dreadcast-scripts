$(() => {
  console.log('Hello World!');

  $('hello_world_setting').bind('click', () =>
    DC.UI.PopUp('hello_world_popup', 'Test', $('<p>YES</p>')),
  );
});
