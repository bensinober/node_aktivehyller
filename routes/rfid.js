/*
 * send Eventsource header to client and establish connection
 * takes rfid object as input
 */
 
function RfidRoute(rfid) {

this.eventSource = function(req, res) {
    // Eventsource header
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    });
    console.log('Client connect');
    
    // create rfid event listener
    rfid.on('rfiddata', function(data) {
      console.log("RFID data received in external app: "+data);
      res.write("event: rfiddata\r\n");
      res.write("data: "+data+"\r\n\n");
    });
                    
    res.on('close', function() {
      console.log("Client left");
    });
  }
}

module.exports = RfidRoute;
