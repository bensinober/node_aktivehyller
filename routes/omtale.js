/*
 * Create initial book by lookup and populate.
 */
var Book = require('../book.js');

exports.tnrLookup = function(req, res){
  var book = new Book(req.params.tnr);
  book.find(function(err) {
    if(err) { throw err };
    book.populate(function(err){
      if(err) { throw err };
      //res.json({book: book});
      res.render('omtale', { title: 'Omtale', path: req.path, book: book });
    });
  });
};

