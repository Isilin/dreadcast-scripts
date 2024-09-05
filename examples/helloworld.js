$(() => {
  console.log('Hello World!');

  console.log($('hello_world_setting'));
  $('hello_world_setting').click(() =>
    DC.UI.PopUp('hello_world_popup', 'Test', $('<p>YES</p>')),
  );
});
