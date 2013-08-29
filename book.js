var sparql = require('sparql');
var client = new sparql.Client('http://datatest.deichman.no/sparql');

function Book(tnr) {
  this.tnr = tnr
  this.uri = 'http://data.deichman.no/resource/tnr_' + tnr;
  this.review_collection = [];
  this.same_author_collection = [];
  this.similar_works_collection = [];
}
Book.prototype.find = function(err, callback){
  var self = this;
  console.log("looking for book: " + this.uri);
  // find book from book uri

  var query = 'SELECT DISTINCT (sql:SAMPLE (?cover_url) AS ?cover_url) (sql:SAMPLE (?alt_cover_url) AS ?alt_cover_url) \
   (sql:SAMPLE (?workAbstract) AS ?workAbstract) (sql:SAMPLE (?workKrydder) AS ?workKrydder)  \
   ?title ?format ?isbn ?work_id ?creatorName ?creator_id ?responsible ?abstract ?krydder ?lang \
   FROM <http://data.deichman.no/books> \
   WHERE { \
     <'+this.uri+'> <http://purl.org/dc/terms/title> ?title . \
     <'+this.uri+'> <http://purl.org/dc/terms/language> ?lang . \
     <'+this.uri+'> <http://purl.org/dc/terms/format> ?format . \
     OPTIONAL { <'+this.uri+'> <http://xmlns.com/foaf/0.1/depiction> ?cover_url . }\
     OPTIONAL { <'+this.uri+'> <http://www.multimedian.nl/projects/n9c/interface#altDepictedBy> ?alt_cover_url . }\
     OPTIONAL { <'+this.uri+'> <http://purl.org/dc/terms/abstract> ?abstract . }\
     OPTIONAL { <'+this.uri+'> <http://data.deichman.no/krydder_beskrivelse> ?krydder . }\
     OPTIONAL { <'+this.uri+'> <http://purl.org/ontology/bibo/isbn> ?isbn . }\
     OPTIONAL { <'+this.uri+'> <http://purl.org/dc/terms/creator> ?creator_id . \
       ?creator_id <http://xmlns.com/foaf/0.1/name> ?creatorName . }\
     OPTIONAL { <'+this.uri+'> <http://rdvocab.info/Elements/statementOfResponsibility> ?responsible . }\
     OPTIONAL { ?work_id <http://purl.org/spar/fabio/hasManifestation> <'+this.uri+'> . }\
     OPTIONAL { ?work_id <http://purl.org/spar/fabio/hasManifestation> ?book . \
       ?book <http://purl.org/dc/terms/abstract> ?workAbstract . }\
     OPTIONAL { ?work_id <http://purl.org/spar/fabio/hasManifestation> ?book . \
       ?book <http://data.deichman.no/krydder_beskrivelse> ?workKrydder . }\
   }';
  client.query(query, function(err,res) {
    if(err) {
      throw err;
    }
    res.results.bindings.forEach(function(item) {
      for (key in item) {
        var i = String(key);
        self[i] = item[i].value;
      }
    });
  });
}
module.exports = Book
