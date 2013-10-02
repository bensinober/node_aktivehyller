var assert = require('assert'),
    expect = require('expect.js'),
    app = require('../app').app,
    Book = require('../lib/book.js');
 
describe('BOOK API', function() {

  describe('book lookup', function() {

    var config = {"endpoint": "http://data.deichman.no/sparql",
                  "base_uri": "http://data.deichman.no/resource/tnr_"};
    var book = new Book(config);
    
    it('creates a book from tnr', function(){
      book.from_tnr(1, function() {
        expect(book.tnr).to.equal(1);
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
        expect(book.valid_format).to.equal(true); 
        done();
      });      
    });

    it('returns invalid format for music CD', function(done){
      book.from_tnr(1031239, function() {
        expect(book.valid_format).to.equal(false); 
        done();
      });
    });

  });

});
