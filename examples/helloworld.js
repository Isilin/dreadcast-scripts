$(() => {
  console.log('Hello World!');

  $('hello_world_setting').on('click', () =>
    DC.UI.PopUp('hello_world_popup', 'Test', $('<p>YES</p>')),
  );
});
