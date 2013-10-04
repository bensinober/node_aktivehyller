/*
 * Check book format and populate initial Bok object.
 * Takes Book class as argument
 */
var config = require('../config/settings.json');
//var session = require('../app').session;
var mySparqlService = require('../lib/sparqlservice.js');
mySparqlService.setConfig(config);

function BookRoute(Book, session) {

	this.checkFormat = function(req, res) {
		// Checks that the item is a valid format (currently Book & Audiobook),
		// and sets the title
		var book = new Book(config);
		book.fromTnr(req.params.tnr, function(err) {
			valid = book.validFormat();
			res.json({
				valid: valid,
				title: book.title
			});
		});
	}

  this.omtale = function(req, res) {
    // takes a tnr and populates book, renders omtale view
    var book = new Book(config);
    book.fromTnr(req.params.tnr, function(err) {
      if (err) { res.send(500, 'Something broke!' + err ); }
      book.populate(function(err) {
        if (err) { res.send(500, 'Something broke!' + err ); }
        res.render('omtale', {title: 'Omtale', path: req.path, book: book})
      });
    }) 
  }

}
module.exports = BookRoute;