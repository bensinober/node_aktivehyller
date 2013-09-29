var assert = require('assert'),
    expect = require('expect.js'),
    request = require('supertest'),
    app = require('../app.js').app,
    Book = require('../lib/book.js');
 
describe('BOOK API', function() {

  describe('book format', function() {
    
    it('validates on accepted book format', function(done){
      var book = new Book(882715);
      book.checkformat(function(res) {
        expect(res).to.be(true);
        done();
      });
    });
    
    it('returns false on wrong book format', function(done){
      var book = new Book(1283626);
      book.checkformat(function(res) {
        expect(res).to.be(false);
        done();
      });
    });
    
  });
});

describe('APP', function(){
  it('respond with plain text', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('fails on wrong page', function(done){
    request(app)
      .get('/bogus')
      .expect(404, done);
  });
})



