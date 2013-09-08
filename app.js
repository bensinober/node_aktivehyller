
/**
 * Module dependencies.
 */

var express = require('express');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var http = require('http');
var path = require('path');

/**
 * Local classes
 */

var Book = require('./book.js');
var Rfidgeek = require('rfidgeek');
var rfid = new Rfidgeek();
rfid.scan();

/**
 * Environment
 */
 
var app = express();

// all environments
app.set('port', process.env.PORT || 4567);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); 
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTYÆØÅ'}));
app.use(expressLayouts);
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * Routes
 */
 
var routes = require('./routes');    // automatically requires 'routes/index.js'
var omtaleRoute = require('./routes/omtale');
var checkformatRoute = require('./routes/checkformat');

app.get('/', routes.index);
app.get('/checkformat/:tnr', checkformatRoute.checkFormat); 
app.get('/omtale/:tnr', omtaleRoute.tnrLookup);
app.get('/rfid', function(req, res) {
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
}); 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
