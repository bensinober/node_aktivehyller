/*
 * Create initial book by lookup and populate.
 */
var Book = require('../book.js');

exports.tnrLookup = function(req, res){
  var book = new Book(req.params.tnr);
  book.find(function(err) {
    if(err) { throw err };
    res.render('omtale', { title: 'Omtale', path: req.path, book: book });
  });
};

exports.displayBook = function(req, res){
  var Book = require('../book.js');
  Book.find(function(err) {
    if(err) { throw err };
    res.render('omtale', { title: 'Omtale', path: req.path, book: Book });
  });
};

exports.populateBook = function(req,res) {
  var Book = require('../book.js');
  Book.populate(function(err){
    res.json({book: Book});
  });
};

