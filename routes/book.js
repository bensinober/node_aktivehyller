/*
 * Check book format and populate initial Bok object.
 * Takes Book class as argument
 */
var config = require('../config/settings.json');
var mySparqlService = require('../lib/sparqlservice.js');
mySparqlService.setConfig(config);

function BookRoute(Book) {

	this.checkFormat = function(req, res) {
		var book = new Book(config);
		book.fromTnr(req.params.tnr, function() {
			valid = book.validFormat();
			res.json({
				valid: valid,
				title: book.title
			});
		});

	};

}
module.exports = BookRoute;