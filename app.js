/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');
var _ = require('underscore');

// Express with modules
var express = require('express');
//var ejs = require('ejs');
//var expressLayouts = require('express-ejs-layouts');
var errorHandler   = require('errorhandler')
var bodyParser     = require('body-parser');
var favicon        = require('express-favicon');
var methodOverride = require('method-override')
var logger         = require('morgan');

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
var router = express.Router();

// All environments
app.set('port', process.env.PORT || 4567);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'), {extensions: ['html']}));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
//app.use(expressLayouts);
app.use(router);


// Development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
}

/*
 * App locals, accessible to all routes and renderings
 */

var session = {history: []};
app.locals = {_: _, session: session, env: app.get('env')};

/**
 * Routes
 */
var routes = require('./routes');    // automatically requires 'routes/index.js'
var BookRoute = require('./routes/book.js');
var RfidRoute = require('./routes/rfid.js');

/*
 * Route Handlers
 */

var Handlers = {
    Book: new BookRoute(Book, session),
    Rfid: new RfidRoute()
  };



app.get('/', routes.index);
app.get('/check/:tnr', Handlers.Book.checkFormat);
app.get('/review/:tnr', Handlers.Book.reviewsFromTnr);
app.get('/review', Handlers.Book.review);
app.get('/populate/:tnr', Handlers.Book.populate);
app.get('/more', Handlers.Book.moreByAuthor);
app.get('/similar', Handlers.Book.similarWorks);

app.get('/rfid', Handlers.Rfid.eventSource);

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * export modules
 */

module.exports.rfid    = rfid;
module.exports.app     = app; // export app for testing
module.exports.config  = config;