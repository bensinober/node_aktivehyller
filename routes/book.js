/*
 * Check book format and populate initial Bok object.
 * Takes Book class as argument
 */

function BookRoute(Book) {

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
  
}
module.exports = BookRoute;
