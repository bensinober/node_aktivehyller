/*
 * Check book format and populate initial Bok object.
 * Takes Book class as argument
 */

function BookRoute(Book) {

  var session = require('../app').session; // Inherit session

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
        session.book = book;
        session.books.tnr = book;
        session.current = session.books.tnr;
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
        session.book = book;
        res.json({book: book});
      });
    })
  }

  this.more = function(req,res) { 
    var book = session.book;
    session.log.flere += 1;
    session.history.push({path: '/flere', tnr: session.current.tnr})
    res.render('flere', { title: 'Flere', path: req.path, book: book });
  }
  
  this.related = function(req,res) { 
    var book = session.book;
    session.log.relaterte += 1
    session.history.push({path: '/relaterte', tnr: session.current.tnr})
    res.render('relaterte', { title: 'Relaterte', path: req.path, book: book });
  }
  
  this.back = function(req,res) { 
    var book = session.book;
    session.history = session.history //[0...-1]
    var back = session.history.pop
    session.current = session.books.back.tnr
    res.redirect(back.path)
  }
}
module.exports = BookRoute;
