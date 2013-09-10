/**
 * Module dependencies.
 */

var express = require('express');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var http = require('http');
var path = require('path');

/**
 * Instantiate Rfid reader and load Book class
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
//app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTYÆØÅ'}));
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
var BookRoute = require('./routes/book.js');
var RfidRoute = require('./routes/rfid.js');

var Handlers = {
    Book: new BookRoute(Book),
    Rfid: new RfidRoute(rfid)
};

var routes = require('./routes');    // automatically requires 'routes/index.js'

app.get('/', routes.index);
app.get('/checkformat/:tnr', Handlers.Book.checkFormat);
app.get('/populate/:tnr', Handlers.Book.populate); 
app.get('/copy', function(req,res) { console.log(Book) }); // does nothing, for now...
app.get('/omtale/:tnr', Handlers.Book.tnrLookup);
app.get('/rfid', Handlers.Rfid.eventSource);
app.get('/flere', Handlers.Book.more);
app.get('/relaterte', Handlers.Book.related);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
