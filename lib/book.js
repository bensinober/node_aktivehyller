/*
 * Main Book Class Object
 */

var config = require('../config/settings.json');
var mySparqlService = require('./sparqlservice.js');
mySparqlService.setConfig(config);

function Book(config) {
  this.base_uri = config["base_uri"];
}

Book.prototype.from_tnr = function(tnr) {
  var self = this;
  this.tnr = parseInt(tnr);
  this.uri = String(this.base_uri) + this.tnr;
  mySparqlService.checkFormat(this.uri, function(res) {
    console.log("URI: " + self.uri + " Res: " + res);
    self.valid_format = res;
  });
}

// CALLBACK FUNCTIONS

/* check material format
book.checkformat(function(res) {
  if(res) { console.log("jippi!") };
});
*/
Book.prototype.checkformat = function(callback){
  console.log("checking format: " + this.uri);

  var query = 'ASK FROM <http://data.deichman.no/books> \
  { <'+this.uri+'> <http://purl.org/dc/terms/title> ?title . \
    <'+this.uri+'> <http://purl.org/dc/terms/format> ?format . \
    FILTER(?format = <http://data.deichman.no/format/Book> || ?format = <http://data.deichman.no/format/Audiobook>) }';
    
  client.query(query, function(err,res) {
    if (err) callback(err);
    if (res) callback(res.boolean);
  });
}

// MIXINS
// array mixin for distinct()
Array.prototype.distinct = function(){
  var u = {}, a = [];
  for(var i = 0, l = this.length; i < l; ++i){
    if(u.hasOwnProperty(this[i])) {
       continue;
    }
    a.push(this[i]);
    u[this[i]] = 1;
  }
  return a;
}

module.exports = Book;