function Book(tnr) {
  sparql = require('sparql');
  client = new sparql.Client('http://data.deichman.no/sparql');

  //:book_id, :title, :format, :cover_url, :isbn, :authors, :responsible, :rating, :tnr,
  //:lang, :work_tnrs, :book_on_shelf, :work_id, :work_isbns, :review_collection, :same_author_collection, 
  //:similar_works_collection, :abstract, :krydder, :randomized_books
  if (tnr) {
    this.tnr = parseInt(tnr);
    this.uri = 'http://data.deichman.no/resource/tnr_' + this.tnr;
    this.title, this.format,this.cover_url, this.isbn, this.responsible, this.rating, this.lang, this.book_on_shelf = '';
    this.authors = [];
    this.work_isbns = [];
    this.review_collection = [];
    this.same_author_collection = [];
    this.similar_works_collection = [];
    this.randomized_books = [];
  }
}

// MIXINS
// array mixin for distinct()
Array.prototype.distinct = function(){
  var u = {}, a = [];
  for(var i = 0, l = this.length; i < l; ++i){
    if(u.hasOwnProperty(this[i])) {
       continue;
    }
    a.push(this[i]);
    u[this[i]] = 1;
  }
  return a;
}

// lookup by tnr
Book.prototype.find = function(callback){
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
    callback();
  });
}

Book.prototype.fetch_local_reviews = function(callback){
   var self = this;
   self.review_collection = [];
   console.log("fetching reviews for: " + this.work_id);
   
  // get reviews from work id
  var query = 'SELECT DISTINCT ?review_id ?review_title ?review_text ?review_source ?reviewer   \
    FROM <http://data.deichman.no/reviews>   \
    FROM NAMED <http://data.deichman.no/books>   \
    FROM NAMED <http://data.deichman.no/sources>   \
    WHERE {   \
      \
    GRAPH <http://data.deichman.no/books> { <'+this.work_id+'> <http://purl.org/stuff/rev#hasReview> ?review_id . }  \
     ?review_id <http://purl.org/stuff/rev#title> ?review_title .   \
    ?review_id <http://purl.org/stuff/rev#text> ?review_text .   \
    ?review_id <http://purl.org/dc/terms/issued> ?issued .   \
    OPTIONAL { ?review_id <http://purl.org/dc/terms/source> ?source_id .   \
      \
    GRAPH <http://data.deichman.no/sources> { ?source_id <http://xmlns.com/foaf/0.1/name> ?review_source . }  \
     }  \
     OPTIONAL { ?review_id <http://purl.org/stuff/rev#reviewer> ?reviewer . } \
     }';

  client.query(query, function(err,res) {
   if(err) {
     throw err;
   }
   res.results.bindings.forEach(function(item) {
      var review = {};
      for (key in item) {
         var i = String(key);
         review[i] = item[i].value;
      }
      self.review_collection.push(review);
    });
    callback();
  });
}

Book.prototype.fetch_isbns = function(callback){
  var self = this;
  self.work_isbns = [];
  self.work_tnrs  = [];
  
  console.log("fetching work isbns & titlenrs for: " + this.work_id);
  // SPARQL - get work isbns & titlenrs:
  var query = 'SELECT ?work_isbns ?work_tnrs WHERE { \
    <'+self.work_id+'> <http://purl.org/ontology/bibo/isbn> ?work_isbns . \
    <'+self.work_id+'> <http://purl.org/spar/fabio/hasManifestation> ?work_tnrs . \
    <'+self.uri+'> <http://purl.org/dc/terms/language> ?language . \
    FILTER("?language = <http://lexvo.org/id/iso639-3/dan> || ?language = <http://lexvo.org/id/iso639-3/nob> || ?language = <http://lexvo.org/id/iso639-3/nno> || ?language = <http://lexvo.org/id/iso639-3/swe> || ?language = <http://lexvo.org/id/iso639-3/eng>") \
    }';

  client.query(query, function(err,res) {
    if(err) {
     throw err;
    }
    res.results.bindings.forEach(function(item) {
      self.work_isbns.push(item.work_isbns.value);
      self.work_tnrs.push(item.work_tnrs.value);
    });
    self.work_isbns = self.work_isbns.distinct();
    self.work_tnrs  = self.work_tnrs.distinct();
    callback();
  });
}    

// author similar works
Book.prototype.fetch_same_author_books = function(callback){
  var self = this;
  self.same_author_collection = [];
  
  console.log("fetching same author book for: " + self.work_id);
  
  var query = 'SELECT DISTINCT (sql:SAMPLE (?cover_url) AS ?cover_url) (sql:SAMPLE (?alt_cover_url) AS ?alt_cover_url) \
    ?similar_work ?lang ?original_language ?title ?book_id \
    FROM <http://data.deichman.no/books> \
    WHERE { <http://data.deichman.no/resource/tnr_1267837> <http://purl.org/dc/terms/creator> ?creator . \
    ?work <http://purl.org/spar/fabio/hasManifestation> <'+self.uri+'> . \
    ?similar_work <http://purl.org/dc/terms/creator> ?creator . \
    ?similar_work <http://purl.org/spar/fabio/hasManifestation> ?book_id . \
    ?book_id <http://purl.org/dc/terms/language> ?lang . \
    ?book_id <http://purl.org/dc/terms/title> ?title . \
    ?book_id <http://purl.org/dc/terms/format> <http://data.deichman.no/format/Book> . \
    OPTIONAL { ?book_id <http://xmlns.com/foaf/0.1/depiction> ?cover_url . } \
    OPTIONAL { ?book_id <http://www.multimedian.nl/projects/n9c/interface#altDepictedBy> ?alt_cover_url . } \
    OPTIONAL { ?book_id <http://data.deichman.no/originalLanguage> ?original_language . } \
    MINUS { ?work <http://purl.org/spar/fabio/hasManifestation> ?book_id . } \
    }';

  client.query(query, function(err,res) {
    if(err) {
     throw err;
    }
    res.results.bindings.forEach(function(item) {
      var sameAuthor = {};
      for (key in item) {
         var i = String(key);
         sameAuthor[i] = item[i].value;
      }
      self.same_author_collection.push(sameAuthor);
    });
    callback();
  })
}

// similar_works 
// missing autogenerated similarities
Book.prototype.fetch_similar_works = function(callback){
  var self = this;
  self.similar_works_collection = [];
  
  console.log("fetching similar works for: " + self.work_id);
  var query = 'SELECT DISTINCT (sql:SAMPLE (?cover_url) AS ?cover_url) (sql:SAMPLE (?alt_cover_url) AS ?alt_cover_url) \
    ?book_id ?title ?lang ?creatorName ?creator_id ?original_language ?format ?similar_work \
    FROM <http://data.deichman.no/books> \
    FROM NAMED <http://data.deichman.no/noeSomLigner> \
    WHERE { ?work <http://purl.org/spar/fabio/hasManifestation> <'+self.uri+'> . \
    ?work <http://purl.org/dc/terms/creator> ?creator_id . \
    GRAPH <http://data.deichman.no/noeSomLigner> { ?work <http://data.deichman.no/autoGeneratedSimilarity> ?similar_work . } \
    ?similar_work <http://purl.org/spar/fabio/hasManifestation> ?book_id . \
    ?book_id <http://purl.org/dc/terms/title> ?title . \
    ?book_id <http://purl.org/dc/terms/language> ?lang . \
    ?book_id <http://purl.org/dc/terms/format> ?format . \
    OPTIONAL { ?book_id <http://xmlns.com/foaf/0.1/depiction> ?cover_url . } \
    OPTIONAL { ?book_id <http://www.multimedian.nl/projects/n9c/interface#altDepictedBy> ?alt_cover_url . } \
    OPTIONAL { ?book_id <http://data.deichman.no/originalLanguage> ?original_language . } \
    OPTIONAL { ?book_id <http://purl.org/dc/terms/creator> ?similar_book_creator . \
    ?similar_book_creator <http://xmlns.com/foaf/0.1/name> ?creatorName . } \
    MINUS { ?similar_work <http://purl.org/dc/terms/creator> ?creator_id . } }';
  //console.log(query);
  client.query(query, function(err,res) {
    if(err) {
     throw err;
    }
    res.results.bindings.forEach(function(item) {
      var similarWork = {};
      for (key in item) {
         var i = String(key);
         similarWork[i] = item[i].value;
      }
      self.similar_works_collection.push(similarWork);
    });
    callback();
  });
}

// CALLBACK FUNCTIONS

/* check material format
book.checkformat(function(res) {
  if(res) { console.log("jippi!") };
});
*/
Book.prototype.checkformat = function(callback){
  var self = this;
  console.log("checking format: " + this.uri);

  var query = 'ASK FROM <http://data.deichman.no/books> \
  { <'+this.uri+'> <http://purl.org/dc/terms/title> ?title . \
    <'+this.uri+'> <http://purl.org/dc/terms/format> ?format . \
    FILTER(?title = <http://data.deichman.no/format/Book> || <http://data.deichman.no/format/Audiobook>) }';
    
  client.query(query, function(err,res) {
    if (err) callback(err);
    if (res) callback(res.boolean);
  });
}

// a synchronuous method to populate entire book
Book.prototype.populate = function(callback){
  var self = this;
  self.fetch_local_reviews(function(err) {
    if (err) throw err;
    self.fetch_isbns(function(err) {
      if (err) throw err;
      self.fetch_similar_works(function(err) {
        if (err) throw err;
        self.fetch_same_author_books(function(err) {
          //console.log(self);
          if (err) throw err;
          callback();
        });
      });
    });
  });
}

module.exports = Book;

/* implemented functions
var Book = require('./book.js');
var book = new Book("882715");

book.checkformat(function(data) {
  if (data) {
    console.log("Book found: "+data);
    book.find(function(err) {
      if(err) { throw err };
      console.log(book);
    });
  } else {
    console.log("Book not found");
  }
});

book.fetch_local_reviews(function() { console.log(book) });
book.fetch_isbns();
book.fetch_similar_works();
book.fetch_same_author_books();
*/
