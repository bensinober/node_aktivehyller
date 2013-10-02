/*
 * Main Book Class Object
 */

var config = require('../config/settings.json');
var mySparqlService = require('./sparqlservice.js');
mySparqlService.setConfig(config);

function Book(config) {
  this.base_uri = config["base_uri"];
}

Book.prototype.from_tnr = function(tnr, callback) {
  var self = this;
  this.tnr = parseInt(tnr);
  this.uri = String(this.base_uri) + this.tnr;
  mySparqlService.getFormatAndTitle(this.uri, function(data) {
    self.formats = data.formats;
    self.title = data.title;
    callback();
  });
}

Book.prototype.validFormat = function() {
  var self = this;
  var acceptedFormats = ['http://data.deichman.no/format/Book', 'http://data.deichman.no/format/Audiobook'];
  var validated = false;
  acceptedFormats.forEach(function(format) {
    console.dir(self);
    if (self.formats.indexOf(format) != -1) {
      validated = true;
    }
  });
  return validated;
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