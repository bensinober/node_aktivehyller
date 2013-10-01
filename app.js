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

var config = require('./config/settings.json');
var Book = require('./lib/book.js');
var Rfidgeek = require('rfidgeek');
var rfid = new Rfidgeek();
rfid.init();
rfid.start();

/**
 * Environment
 */
 
var app = express();

// All environments
app.set('port', process.env.PORT || 4567);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); 
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressLayouts);
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * App in-memory session hash
 */ 

var session = {};

/**
 * Routes
 */

var BookRoute = require('./routes/book.js');
var RfidRoute = require('./routes/rfid.js');

/*
 * Route Handlers
 */

var Handlers = {
    Book: new BookRoute(Book),
    Rfid: new RfidRoute()
};

var routes = require('./routes');    // automatically requires 'routes/index.js'

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * export modules
 */

module.exports.session = session;
module.exports.rfid    = rfid;
module.exports.app     = app; // export app for testing
module.exports.config  = config; 