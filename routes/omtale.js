
/*
 * GET book listing.
 */


exports.tnrlookup = function(req, res){
  var x = require('../book.js');
  var book = new x(req.params.tnr);
  find(function(err) {
    if(err) { throw err };
    res.render('omtale', { title: 'Omtale', path: req.path, book: book });
  });
};

exports.show = function(req, res){
  var book = require('../book.js');
  book.find(function(err) {
    if(err) { throw err };
    res.render('omtale', { title: 'Omtale', path: req.path, book: book });
  });
};
