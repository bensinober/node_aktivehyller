
/*
 * GET book listing.
 */


exports.start = function(req, res){
  var book = require('../book.js');
  //var book = new Book(req.params.tnr);
  var omtale = new book("397877");
  omtale.populate(function(result) {
    var data = result
    //console.log(data);
    //if (err) throw err;
    //console.log(result.similar_works_collection);
    res.render('omtale', { title: 'Omtale', path: req.path, book: data });
  });
};
