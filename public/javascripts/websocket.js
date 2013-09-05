// Initialize
var ws = new WebSocket("ws://localhost:4568");
var request;

$('button#avbryt-knapp').on('click', function() {
  $('#overlay').hide();
  $('#vi-leter').hide();
  if(request) {request.abort();} //abort running requests
});

// loading animation
i = 0;
setInterval(function() {
    i = ++i % 4;
    $("#loading").html(""+Array(i+1).join("."));
}, 500);

ws.onmessage = function(evt) {
  if (evt.data == "tag removed") {
    // do nothing...for now
  } else {
    // when titlenr is received from server via websocket:
    // show overlay
    $('button#retry-knapp').hide();
    $('#overlay').show();
    $('button#avbryt-knapp').html("Avbryt");
    $('#vi-leter p').html("Vi leter etter boka <span id=\"loading\"></span>");
    $('#vi-leter').show();

    check_format = $.getJSON('/checkformat/'+evt.data);
    check_format.done(function(data) {
      if (data) {
        $('div#vi-leter p').html("Henter info om \"" + data.book.title + '" <span id="loading"></span>' );

        //hent all info til omtalevisning her
        request = $.get('/populate');

        request.done(function(data) {
        //$.get('/copy', function(data) {
            window.location.replace("/omtale");
            console.log(data);
        //  });
        });

        request.fail(function(message) {
          console.log(message);
          $('div#vi-leter p').html("Beklager, fant ingenting om denne boka");
          $('button#avbryt-knapp').html('OK');
        });

      } else {
        $('div#vi-leter p').html("Beklager, vi støtter bare bøker og lydbøker");
        $('button#avbryt-knapp').html('OK');
      };
    });
  }
}

ws.onclose = function() {
  console.log("Websocket connection lost!");
}

ws.onopen = function() {
  console.log("Websocket connected!");
}
