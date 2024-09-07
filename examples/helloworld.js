$(() => {
  if (Util.isGame()) {
    console.log('Hello World!');

    $(document).on('click', '#hello_world_setting', () =>
      DC.UI.PopUp('hello_world_popup', 'Test', $('<p>YES</p>')),
    );
  } else if (Util.isForum()) {
    console.log('Hello Forum!');
  }
});
