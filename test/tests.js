var assert = require('assert'),
    expect = require('expect.js'),
    _ = require('underscore'),
    app = require('../app').app,
    Book = require('../lib/book.js');
    //mySparqlService = require('../lib/sparqlservice.js');

describe('BOOK API', function() {
  var config = {"base_uri": "http://data.deichman.no/resource/tnr_"};
  var book = new Book(config);
  
  describe('check book', function() {
    
    it('creates a book from tnr', function(done){
      book.fromTnr(1, function(err) {
        if (err) { throw Error(err); }
        expect(book.tnr).to.equal(1);
        done();
      });
    });

    it('creates a book uri', function(done){
      book.fromTnr(1, function(err) {
        if (err) { throw Error(err); }
        expect(book.uri).to.equal('http://data.deichman.no/resource/tnr_1');
        done();
      });
    });

    it('creates a book uri from configuration', function(done){
      var config = {"endpoint": "http://data.deichman.no/sparql",
                     "base_uri": "http://data.lillehammer.no/resource/tnr_"};
      var book = new Book(config);
      book.fromTnr(1, function(err) {
        if (err) { throw Error(err); }
        expect(book.uri).to.equal('http://data.lillehammer.no/resource/tnr_1');
        done();
      });
    });    
 
    it('returns valid format for audiobook', function(done){
      book.fromTnr(974232, function(err) {
        if (err) { throw Error(err); }
        expect(book.validFormat()).to.equal(true); 
        done();
      });      
    });

    it('returns valid even if only one of many formats is valid', function(done){
      book.fromTnr(1447893, function(err) {
        if (err) { throw Error(err); }
        expect(book.validFormat()).to.equal(true); 
        done();
      });
    });

    it('returns invalid format for music CD', function(done){
      book.fromTnr(1031239, function(err) {
        if (err) { throw Error(err); }
        expect(book.validFormat()).to.equal(false); 
        done();
      });
    });

    it('returns title when a book has an accepted format', function(done){
      book.fromTnr(974232, function(err) {
        if (err) { throw Error(err); }
        expect(book.title).to.equal("Morgen i Jenin"); 
        done();
      });
    });

  });

  describe('find book info', function() {

    it('returns authors of a book to an array', function(done){
      book.fromTnr(974232, function(err) {
        if (err) { throw Error(err); }
        book.populate(function(err) {
          if (err) { throw Error(err); }
          expect(book.authors[0]).to.have.keys('creatorName');
          done();
        });
      });
    });

    it('sets responsible of book', function(done){
      book.fromTnr(1429670, function(err) {
        if (err) { throw Error(err); }
        book.populate(function(err) {
          if (err) { throw Error(err); }
          expect(book.responsible).to.match(/Nils\ Gaup/);
          done();
        });
      });
    });

    it('localReviews if empty if there are no local reviews', function(done){
      book.fromTnr(382695, function(err) {
        if (err) { throw Error(err); }
        book.populate(function(err) {
          if (err) { throw Error(err); }
          expect(book.localReviews).to.be.empty();
          done();
        });
      });
    });

    it('fetches local reviews', function(done){
      book.fromTnr(1058670, function(err) {
        if (err) { throw Error(err); }
        book.populate(function(err) {
          if (err) { throw Error(err); }
          expect(book.localReviews.length).to.be.greaterThan(1);
          expect(book.localReviews[0].reviewText.length).to.be.greaterThan(10);
          done();
        });
      });
    });

    it('fetches other works by author', function(done){
      book.fromTnr(72680, function(err) {
        if (err) { throw Error(err); }
        book.populate(function(err) {
          if (err) { throw Error(err); }
          expect(book.sameAuthorBooks).to.not.be.empty();
          expect(_.filter(book.sameAuthorBooks, function(s) { 
            return s.authorWork == 'http://data.deichman.no/work/x10293500_the_lord_of_the_rings';
          })[0].lang).to.match(/nob/);
          done();
        });
      });
    });

    it('fetches similar works', function(done){
      book.fromTnr(583095, function(err) {
        if (err) { throw Error(err); }
        book.populate(function(err) {
          if (err) { throw Error(err); }
          expect(book.similarWorks).to.not.be.empty();
          done();
        });
      });
    })

  });

});
