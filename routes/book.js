/*
 * Check book format and populate initial Bok object.
 * Takes Book class as argument
 */

function BookRoute(Book) {
  var self = Book;
  this.checkFormat = function(req,res) {
    var book = new Book(req.params.tnr);
    console.log(book);
    book.checkformat(function(data) {
      if (data) {
        res.json({book: book});
      } else {
        res.send(false);
      }
    });
  }
  
  this.tnrLookup = function(req, res){
    var book = new Book(req.params.tnr);
    book.find(function(err) {
      if(err) { throw err };
      book.populate(function(err){
        if(err) { throw err };
        module.exports.book = book;  // export book object to this module
        res.render('omtale', { title: 'Omtale', path: req.path, book: book });
      });
    })
  }
  
  this.populate = function(req, res){
    var book = new Book(req.params.tnr);
    book.find(function(err) {
      if(err) { throw err };
      book.populate(function(err){
        if(err) { throw err };
        module.exports.book = book;  // export book object to this module
        res.json({book: book});
      });
    })
  }

  this.more = function(req,res) { 
    var book = require('./book.js').book;
    res.render('flere', { title: 'Flere', path: req.path, book: book });
  }
  
  this.related = function(req,res) { 
    var book = require('./book.js').book;
    res.render('relaterte', { title: 'Relaterte', path: req.path, book: book });
  }
}
module.exports = BookRoute;
