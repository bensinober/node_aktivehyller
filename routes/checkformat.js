/*
 * Check book format and make initial Bok object.
 */

exports.checkFormat = function(req,res) {
  var Book = require('../book.js');
  var book = new Book(req.params.tnr);
  //console.log(book);
  book.checkformat(function(data) {
    if (data) {
      book.find(function(err) {
        if(err) { throw err };
        res.json({book: book});
      });
    } else {
      res.send(false);
    }
  });
}
