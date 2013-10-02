/*
* SparqlService - all SPARQL queries
*/
var SparqlClient = require('sparql');

module.exports = function () {
  var config = {prefixes: "PREFIX dc: <http://purl.org/dc/terms/>\n\
                           PREFIX deich: <http://data.deichman.no/>\n"};
  return {
    setConfig: function(c) {
      config.client = new SparqlClient.Client(c.endpoint);
    },
    checkFormat: function(uri, callback) {
      var q = config.prefixes + 'ASK FROM <http://data.deichman.no/books> \
      WHERE { <'+uri+'> dc:title ?title . \
        <'+uri+'> dc:format ?format . \
        FILTER(?format = <http://data.deichman.no/format/Book> || ?format = <http://data.deichman.no/format/Audiobook>) }';

      config.client.query(q, function(err, res) {
        if (err) { throw new Error(err); }
        if (res) { callback(res.boolean); }
      });
    }
  };
}();