/*
 * Check book format and make initial Bok object.
 */

exports.checkformat = function(req,res) {
  var x = require('../book.js');
  var book = new x(req.params.tnr);
  console.log(book);
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
