// subscribe to rfid events from server
var rfid = new EventSource("/rfid");

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

rfid.onopen = function() {
  console.log("opened!");
}

rfid.onclose = function() {
  console.log("closed!");
}

rfid.addEventListener('rfiddata', function(rfiddata) {
  console.log(rfiddata);
  if (rfiddata.data == "tag removed") {
    // do nothing...for now
  } else {
    // show overlay
    $('button#retry-knapp').hide();
    $('#overlay').show();
    $('button#avbryt-knapp').html("Avbryt");
    $('#vi-leter p').html("Vi leter etter boka <span id=\"loading\"></span>");
    $('#vi-leter').show();

    check_format = $.getJSON('/check/'+rfiddata.data);
    check_format.done(function(data) {
      if (data) {
        window.location.replace("/omtale/"+rfiddata.data);
      } else {
        $('div#vi-leter p').html("Beklager, vi støtter bare bøker og lydbøker");
        $('button#avbryt-knapp').html('OK');
      };
    });
  }
}, false);
