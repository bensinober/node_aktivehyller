var assert = require('assert'),
    expect = require('expect.js'),
    app = require('../app').app,
    Book = require('../lib/book.js');
    //mySparqlService = require('../lib/sparqlservice.js');

describe('BOOK API', function() {
  var config = {"base_uri": "http://data.deichman.no/resource/tnr_"};
  var book = new Book(config);
  
  describe('check book', function() {
    
    it('creates a book from tnr', function(done){
      book.from_tnr(1, function() {
        expect(book.tnr).to.equal(1);
        done();
      });
    });

    it('creates a book uri', function(done){
      book.from_tnr(1, function() {
        expect(book.uri).to.equal('http://data.deichman.no/resource/tnr_1');
        done();
      });
    });

    it('creates a book uri from configuration', function(done){
      var config = {"endpoint": "http://data.deichman.no/sparql",
                     "base_uri": "http://data.lillehammer.no/resource/tnr_"};
      var book = new Book(config);
      book.from_tnr(1, function() {
        expect(book.uri).to.equal('http://data.lillehammer.no/resource/tnr_1');
        done();
      });
    });    
 
    it('returns valid format for audiobook', function(done){
      book.from_tnr(974232, function() {
        expect(book.validFormat()).to.equal(true); 
        done();
      });      
    });

    it('returns valid even if only one of many formats is valid', function(done){
      book.from_tnr(1447893, function() {
        expect(book.validFormat()).to.equal(true); 
        done();
      });
    });

    it('returns invalid format for music CD', function(done){
      book.from_tnr(1031239, function() {
        expect(book.validFormat()).to.equal(false); 
        done();
      });
    });

    it('returns title when a book has an accepted format', function(done){
      book.from_tnr(974232, function() {
        expect(book.title).to.equal("Morgen i Jenin"); 
        done();
      });
    });

  });

  describe('find book info', function() {
    it('returns authors of a book to an array', function(done){
      book.from_tnr(974232, function() {
        book.populate(function() {
          expect(book.authors[0]).to.have.keys('creatorName');
          done();
        });
      });
    });

    it('sets responsible of book', function(done){
      book.from_tnr(1429670, function() {
        book.populate(function() {
          expect(book.responsible).to.match(/Nils\ Gaup/);
          done();
        });
      });
    });

  });

});
