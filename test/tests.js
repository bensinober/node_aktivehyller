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
      book.from_tnr(1);
      expect(book.tnr).to.equal(1);
    });

    it('creates a book uri', function(){
      book.from_tnr(1);
      expect(book.uri).to.equal('http://data.deichman.no/resource/tnr_1');
    });

    it('creates a book uri from configuration', function(){
      var config = {"endpoint": "http://data.deichman.no/sparql",
                     "base_uri": "http://data.lillehammer.no/resource/tnr_"};
      var book = new Book(config);
      book.from_tnr(1);
      expect(book.uri).to.equal('http://data.lillehammer.no/resource/tnr_1');
    });

    it('returns valid format for audiobook', function(done){
      setTimeout(function(){
        book.from_tnr(974232);
        console.dir(book);
        expect(book.valid_format).to.equal(true); 
        // complete the async beforeEach
        done();
      }, 50);
    });

    it('returns invalid format for music CD', function(done){
      setTimeout(function(){
        book.from_tnr(1031239);
        expect(book.valid_format).to.equal(false); 
        // complete the async beforeEach
        done();
      }, 50);
    });

  });

});
