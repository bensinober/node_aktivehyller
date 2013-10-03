/*
* SparqlService - all SPARQL queries
*/
var SparqlClient = require('sparql');

module.exports = function () {
  var config = {prefixes: "PREFIX dct: <http://purl.org/dc/terms/>\n\
                           PREFIX deich: <http://data.deichman.no/>\n\
                           PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n\
                           PREFIX bibo: <http://purl.org/ontology/bibo/>\n\
                           PREFIX rda: <http://rdvocab.info/Elements/>\n\
                           PREFIX fabio: <http://purl.org/spar/fabio/>\n\
                           PREFIX iface: <http://www.multimedian.nl/projects/n9c/interface#>\n"};

  var bindings = function(res) {
    // Parses the JSON response into bindings;
    // returns an object in the form {"bound variable": [b1, b2...]}
    var result = {};
      res.head.vars.forEach(function(bound) {
        result[bound] = [];
        res.results.bindings.forEach(function(sol) {
          if(sol[bound] && result[bound].indexOf(sol[bound].value) < 0) {
            result[bound].push(sol[bound].value);
          }
        });
      });
    return result;
  }

  var solutions = function(res) {
    // Parses the JSON response into solutions;
    // returns an array in the form [{"bound1":[...], "bound2":[..]}, {}]
    var result = [];
    res.results.bindings.forEach(function(s) {
      solution = {};
      for (var key in s) {
        if (s[key]) {
          solution[key] = s[key].value;
        }
      }
      result.push(solution);
    });
    return result;
  }

  return {
    setConfig: function(c) {
      config.client = new SparqlClient.Client(c.endpoint);
    },
    getFormatAndTitle: function(uri, callback) {
      var q = config.prefixes + 'SELECT ?title ?format FROM <http://data.deichman.no/books> \
      WHERE { <'+uri+'> dct:title ?title . \
        <'+uri+'> dct:format ?format . }';

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
    },
    fetchBookInfo: function(uri, callback) {
      var q = config.prefixes + 'SELECT DISTINCT (sql:SAMPLE (?coverUrl) AS ?coverUrl) (sql:SAMPLE (?altCoverUrl) AS ?altCoverUrl) \
    (sql:SAMPLE (?workAbstract) AS ?workAbstract) (sql:SAMPLE (?workKrydder) AS ?workKrydder)  \n\
    ?title ?format ?isbn ?work_id ?creatorName ?creatorId ?responsible ?abstract ?krydder ?lang \n\
    FROM <http://data.deichman.no/books> \n\
    WHERE { \n\
      <'+uri+'> dct:title ?title . \n\
      <'+uri+'> dct:language ?lang . \n\
      <'+uri+'> dct:format ?format . \n\
      OPTIONAL { <'+uri+'> foaf:depiction ?coverUrl . }\n\
      OPTIONAL { <'+uri+'> iface:altDepictedBy ?altCoverUrl . }\n\
      OPTIONAL { <'+uri+'> dct:abstract ?abstract . }\n\
      OPTIONAL { <'+uri+'> deich:krydder_beskrivelse ?krydder . }\n\
      OPTIONAL { <'+uri+'> bibo:isbn ?isbn . }\n\
      OPTIONAL { <'+uri+'> dct:creator ?creatorId . \n\
        ?creatorId foaf:name ?creatorName . }\n\
      OPTIONAL { <'+uri+'> rda:statementOfResponsibility ?responsible . }\n\
      OPTIONAL { ?work_id fabio:hasManifestation <'+uri+'> . }\n\
      OPTIONAL { ?work_id fabio:hasManifestation ?book . \n\
        ?book dct:abstract ?workAbstract . }\n\
      OPTIONAL { ?work_id fabio:hasManifestation ?book . \n\
        ?book deich:krydder_beskrivelse ?workKrydder . }\n\
    }';

      config.client.query(q, function(err, res) {
        if (err) { throw new Error(err); }
        if (res) {
          var b = bindings(res),
              s = solutions(res);
          callback({bindings: b, solutions: s}); 
        }
      });
    }
  };
}();