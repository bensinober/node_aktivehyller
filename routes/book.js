/*
 * Check book format and make initial Bok object.
 */

function BookRoute() {
var Book = require('../book.js');

this.checkFormat = function(req,res) {
  var book = new Book(req.params.tnr);
  console.log(book);
  book.checkformat(function(data) {
    if (data) {
      req.session.book = book;
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
      //res.json({book: book});
      req.session.book = book;
      console.log(book.similar_works_collection);
      res.render('omtale', { title: 'Omtale', path: req.path, book: book });
    });
  })
}

}
module.exports = BookRoute;
