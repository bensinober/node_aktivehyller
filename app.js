
/**
 * Module dependencies.
 */

var express = require('express');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var http = require('http');
var path = require('path');

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
// Book class
var Book = require('./book.js');
/**
 * Routes
 */
 
var routes = require('./routes');    // automatically requires 'routes/index.js'
var omtaleRoute = require('./routes/omtale');
var checkformatRoute = require('./routes/checkformat');

app.get('/', routes.index);
app.get('/checkformat/:tnr', checkformatRoute.checkFormat); 
app.get('/omtale/:tnr', omtaleRoute.tnrLookup);
app.get('/populate', omtaleRoute.populateBook);
app.get('/omtale', omtaleRoute.displayBook);
 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
