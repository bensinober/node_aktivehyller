/*
 * Main Book Class Object
 */

var config = require('../config/settings.json');
var mySparqlService = require('./sparqlservice.js');
var _ = require("underscore");
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

var selectManifestation = function(work, solutions, filterParam) {
  // This function selects one book (Manifestation) from a solutions list based on a Work
  // it narrows down results by filters on language 
  a = solutions;
  b = _.reject(a, function(s) { return s[filterParam] != work; });
  if (b.length == 0) { b = a; } else { a = b; }
  b = _.filter(a, function(s) { return /nob|nno/.test(s["lang"]); });
  if (b.length == 0) { b = a; } else { a = b; }
  b = _.filter(a, function(s) { return /eng|swe|dan/.test(s["originalLanguage"]); } );
  if (b.length == 0) { b = a; } else { a = b; }
  return b[0];
}

function Book(config) {
  this.base_uri = config["base_uri"];
}

Book.prototype.fromTnr = function(tnr, callback) {
  var self = this;
  this.tnr = parseInt(tnr);
  this.uri = String(this.base_uri) + this.tnr;
  mySparqlService.getFormatAndTitle(this.uri, function(err, data) {
    if (err) { callback(err); }
    console.log(data);
    if (data){
      self.formats = data.formats;
      self.title = data.title;
    }
    callback(null);
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
  mySparqlService.fetchBookInfo(this.uri, function(err, data) {
    if (err) { callback(err); }
    // set book info
    self.workId = data.bindings.workId[0];
    self.formats = data.bindings.formats;
    self.authors = extractProperties(data.solutions, ["creatorId", "creatorName"]);
    self.responsible = data.bindings.responsible;

    // fetch local reviews
    mySparqlService.fetchLocalReviews(self.workId, function(err, data) {
      if (err) { callback(err); }
      self.localReviews = data;

      // fetch other works by the same author
      mySparqlService.fetchSameAuthorBooks(self.uri, function(err, data) {
        if (err) { callback(err); }
        self.sameAuthorBooks = [];
        uniqueWorks = data.bindings["authorWork"];
        uniqueWorks.forEach(function(work) {
          self.sameAuthorBooks.push(selectManifestation(work, data.solutions, "authorWork"));
        });

        // fetch similar works
        mySparqlService.fetchSimilarWorks(self.uri, function(err, data){
          if (err) { callback(err); }
          self.similarWorks = [];
          uniqueWorks = data.bindings["similarWork"];
          uniqueWorks.forEach(function(work) {
            self.similarWorks.push(selectManifestation(work, data.solutions, "similarWork"));
          });
          callback(null);
        });
      });
    });
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