/*
* SparqlService - all SPARQL queries
*/
var SparqlClient = require('sparql');

module.exports = function () {
  var config = {prefixes: "PREFIX dc: <http://purl.org/dc/terms/>\n\
                           PREFIX deich: <http://data.deichman.no/>\n"};
/*
* Bindings - iterates SPARQL results and creates Hash of Arrays
*            where hash key is binding
*/  
  var bindings = function(res) {
    var result = {};
      res.head.vars.forEach(function(binding) {
        result[binding] = [];
        res.results.bindings.forEach(function(solutions) {
          result[binding].push(solutions[binding].value)
        });
      });
    return result ;
  }

  return {
    setConfig: function(c) {
      config.client = new SparqlClient.Client(c.endpoint);
    },
    getFormatAndTitle: function(uri, callback) {
      var q = config.prefixes + 'SELECT ?title ?format FROM <http://data.deichman.no/books> \
      WHERE { <'+uri+'> dc:title ?title . \
        <'+uri+'> dc:format ?format . }';

      config.client.query(q, function(err, res) {
        if (err) { throw new Error(err); }
        if (res) { 
          var data = bindings(res);
          callback({
            title: data.title[0], 
            formats: data.format
          }); 
        }
      });
    }
  };
}();