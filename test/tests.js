var assert = require('assert'),
    expect = require('expect.js'),
    app = require('../app').app,
    Book = require('../lib/book.js');
 
describe('BOOK API', function() {

  describe('book lookup', function() {
    
    it('creates a book from tnr', function(){
      var config = {"base_uri": "http://data.deichman.no/resource/tnr_"};
      var book = new Book(config);
      book.from_tnr(1);
      expect(book.tnr).to.equal(1);
    });

    it('creates a book uri', function(){
      var config = {"base_uri": "http://data.deichman.no/resource/tnr_"};
      var book = new Book(config);
      book.from_tnr(1);
      expect(book.uri).to.equal('http://data.deichman.no/resource/tnr_1');
    });

    it('creates a book uri from configuration', function(){
      var config = {"base_uri": "http://data.lillehammer.no/resource/tnr_"};
      var book = new Book(config);
      book.from_tnr(1);
      expect(book.uri).to.equal('http://data.lillehammer.no/resource/tnr_1');
    });
  });

});
