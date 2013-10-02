/*
* SparqlService - all SPARQL queries
*/
var SparqlClient = require('sparql');

module.exports = function () {
  var config = {prefixes: "PREFIX dc: <http://purl.org/dc/terms/>\n\
                           PREFIX deich: <http://data.deichman.no/>\n"};
  
  var parseJson = function(res) {
    var json = {};
    res.results.bindings.forEach(function(item) {
      for (key in item) {
        var i = String(key);
        json[i] = item[i].value;
      }
    });
    return json;
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
        console.dir(res)
        if (err) { throw new Error(err); }
        if (res) { 
          var data = parseJson(res);
          callback({
            title: data.title, 
            format: data.format
          }); 
        }
      });
    }
  };
}();