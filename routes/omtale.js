
/*
 * GET book listing.
 */


exports.start = function(req, res){
  var book = require('../book.js');
  //var book = new Book(req.params.tnr);
  
  var omtale = new book("882715");
  omtale.find();
  res.render('omtale', { title: 'Omtale', path: req.path, book: omtale });
};
