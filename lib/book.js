/*
 * Main Book Class Object
 */

var config = require('../config/settings.json');
var mySparqlService = require('./sparqlservice.js');
mySparqlService.setConfig(config);

var extractProperties = function(solutions, properties) {
  // This function extracts chosen properties from solutions
  // takes a solutions object and an array with properties to extract
  // returns an array in the form [{"prop": {"uri1": "name1",..}
  result = [];
  solutions.forEach(function(solution) {
    var tmp = {};
    properties.forEach(function(property) {
      if(solution[property]) {
        tmp[property] = solution[property];
      }
    });
    if(Object.keys(tmp).length == properties.length) {
        result.push(tmp);
    }
  });
  return result.distinct();
}

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
    if (self.formats.indexOf(format) != -1) {
      validated = true;
    }
  });
  return validated;
}

Book.prototype.populate = function(callback) {
  var self = this;
  mySparqlService.fetchBookInfo(this.uri, function(data) {
    self.formats = data.bindings.formats;
    self.title = data.bindings.title;
    self.authors = extractProperties(data.solutions, ["creatorId", "creatorName"]);
    self.responsible = data.bindings.responsible;
    callback();
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