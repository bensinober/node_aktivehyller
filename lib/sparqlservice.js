/*
* SparqlService - all SPARQL queries
* Anonymous function that is run on load
* Demands no instantiation, call to SparqlService returns public functions:
*   setConfig(config)
*   getFormatAndTitle(uri,callback)
*   fetchBookInfo(uri,callback)
*   fetchSameAuthorBooks(uri,callback)
*   fetchSimilarWorks(uri,callback)
*/
var SparqlClient = require('sparql');

module.exports = function () {

  /*
  * PRIVATE FUNCTIONS
  */

  var config = {prefixes: "PREFIX dct: <http://purl.org/dc/terms/>\n\
                           PREFIX deich: <http://data.deichman.no/>\n\
                           PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n\
                           PREFIX bibo: <http://purl.org/ontology/bibo/>\n\
                           PREFIX rda: <http://rdvocab.info/Elements/>\n\
                           PREFIX fabio: <http://purl.org/spar/fabio/>\n\
                           PREFIX rev: <http://purl.org/stuff/rev#>\n\
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

  /* 
  * PUBLIC FUNCTIONS
  */

  return {
    setConfig: function(c) {
      config.client = new SparqlClient.Client(c.endpoint);
    },
    getFormatAndTitle: function(uri, callback) {
      var q = config.prefixes + 'SELECT ?title ?format FROM <http://data.deichman.no/books> \
      WHERE { <'+uri+'> dct:title ?title . \
        <'+uri+'> dct:format ?format . }';

      config.client.query(q, function(err, res) {
        if (err) { callback(err, null); }
        if (res) { 
          var data = bindings(res);
          callback(null, {
            title: data.title[0], 
            formats: data.format
          }); 
        }
      });
    },
    fetchBookInfo: function(uri, callback) {
      var q = config.prefixes + 
      'SELECT DISTINCT (sql:SAMPLE (?coverUrl) AS ?coverUrl) (sql:SAMPLE (?altCoverUrl) AS ?altCoverUrl) \
      (sql:SAMPLE (?workAbstract) AS ?workAbstract) (sql:SAMPLE (?workKrydder) AS ?workKrydder)  \n\
      ?title ?format ?isbn ?workId ?creatorName ?creatorId ?responsible ?abstract ?krydder ?lang \n\
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
        OPTIONAL { ?workId fabio:hasManifestation <'+uri+'> . }\n\
        OPTIONAL { ?workId fabio:hasManifestation ?book . \n\
          ?book dct:abstract ?workAbstract . }\n\
        OPTIONAL { ?workId fabio:hasManifestation ?book . \n\
          ?book deich:krydder_beskrivelse ?workKrydder . }\n\
      }';

      config.client.query(q, function(err, res) {
        if (err) { callback(err, null); }
        if (res) {
          var b = bindings(res),
              s = solutions(res);
          callback(null, {bindings: b, solutions: s}); 
        }
      });
    },
    fetchLocalReviews: function(uri, callback) {
       var q = config.prefixes + 
       'SELECT DISTINCT ?reviewId ?reviewTitle ?reviewText ?reviewSource ?reviewer   \n\
        FROM <http://data.deichman.no/reviews>   \n\
        FROM NAMED <http://data.deichman.no/books>   \n\
        FROM NAMED <http://data.deichman.no/sources>   \n\
        WHERE {   \n\
          \n\
        GRAPH <http://data.deichman.no/books> { <'+uri+'> rev:hasReview ?reviewId . }  \n\
         ?reviewId rev:title ?reviewTitle .   \n\
        ?reviewId rev:text ?reviewText .   \n\
        ?reviewId dct:issued ?issued .   \n\
        OPTIONAL { ?reviewId dct:source ?sourceId .   \n\
          \n\
        GRAPH <http://data.deichman.no/sources> { ?sourceId foaf:name ?reviewSource . }  \n\
         }  \n\
         OPTIONAL { ?reviewId rev:reviewer ?reviewer . } \n\
         }';

         config.client.query(q, function(err, res) {
           if (err) { callback(err, null); }
           if (res) {
             var s = solutions(res);
             callback(null, s); 
           }
         });
    },
    fetchSameAuthorBooks: function(uri, callback) {
      var q = config.prefixes +
      'SELECT DISTINCT (sql:SAMPLE (?coverUrl) AS ?coverUrl) (sql:SAMPLE (?altCoverUrl) AS ?altCoverUrl) \n\
        ?authorWork ?lang ?originalLanguage ?title ?bookId \n\
        FROM <http://data.deichman.no/books> \n\
        WHERE { <'+uri+'> dct:creator ?creator . \n\
        ?work fabio:hasManifestation <'+uri+'> . \n\
        ?authorWork dct:creator ?creator . \n\
        ?authorWork fabio:hasManifestation ?bookId . \n\
        ?bookId dct:language ?lang . \n\
        ?bookId dct:title ?title . \n\
        ?bookId dct:format <http://data.deichman.no/format/Book> . \n\
        OPTIONAL { ?bookId foaf:depiction ?coverUrl . } \n\
        OPTIONAL { ?bookId iface:altDepictedBy ?altCoverUrl . } \n\
        OPTIONAL { ?bookId deich:originalLanguage ?originalLanguage . } \n\
        MINUS { ?work fabio:hasManifestation ?bookId . } \n\
        }';

      config.client.query(q, function(err, res) {
        if (err) { callback(err, null); }
        if (res) {
          var b = bindings(res),
              s = solutions(res);
          callback(null, {bindings: b, solutions: s}); 
        }
      });
    },
    fetchSimilarWorks: function(uri, callback) {
    var q = config.prefixes + 
    'SELECT DISTINCT (sql:SAMPLE (?coverUrl) AS ?coverUrl)\n\
      (sql:SAMPLE (?altCoverUrl) AS ?altCoverUrl)\n\
      ?bookId ?title ?lang ?creatorName ?creatorId ?originalLanguage ?format ?similarWork\n\
      FROM deich:books\n\
      FROM NAMED deich:noeSomLigner\n\
      WHERE { ?work fabio:hasManifestation <'+uri+'> .\n\
      ?work dct:creator ?creatorId .\n\
      GRAPH deich:noeSomLigner { ?work deich:autoGeneratedSimilarity ?similarWork . }\n\
      ?similarWork fabio:hasManifestation ?bookId .\n\
      ?bookId dct:title ?title .\n\
      ?bookId dct:language ?lang .\n\
      ?bookId dct:format ?format .\n\
      OPTIONAL { ?bookId foaf:depiction ?coverUrl . }\n\
      OPTIONAL { ?bookId iface:altDepictedBy ?altCoverUrl . }\n\
      OPTIONAL { ?bookId deich:originalLanguage ?originalLanguage . }\n\
      OPTIONAL { ?bookId dct:creator ?similarBookCreator .\n\
      ?similarBookCreator foaf:name ?creatorName . }\n\
      MINUS { ?similarWork dct:creator ?creatorId . } }';

      config.client.query(q, function(err, res) {
        if (err) { callback(err, null); }
        if (res) {
          var b = bindings(res),
              s = solutions(res);
          callback(null, {bindings: b, solutions: s}); 
        }
      });
    },
    fetchRandomBook: function(callback) {
      var q = config.prefixes + 
      'SELECT DISTINCT ?tnr FROM deich:books WHERE {\n\
        ?tnr a fabio:Manifestation ;\n\
        dct:format <http://data.deichman.no/format/Book> ;\n\
        deich:literaryFormat dbpedia:Fiction ;\n\
        dct:language <http://lexvo.org/id/iso639-3/nor> .\n\
        }\n\
        ORDER BY RAND()\n\
        LIMIT 1';
     
      config.client.query(q, function(err, res) {
        if (err) { callback(err, null); }
        if (res) {
          var data = bindings(res);
          callback(null, {
            tnr: data.tnr[0]
          });
        }
      });
    }
  };
}();