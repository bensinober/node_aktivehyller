
/*
 * GET book listing.
 */


exports.start = function(req, res){
  var book = require('../book.js');
  //var book = new Book(req.params.tnr);
  
  var omtale = new book("882715");
  omtale.find(function(data) {
    console.log(data);
    res.render('omtale', { title: 'Omtale', path: req.path, book: data });
  });
};
