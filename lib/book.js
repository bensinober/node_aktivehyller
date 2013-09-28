function Book(tnr) {
  sparql = require('sparql');
  client = new sparql.Client('http://data.deichman.no/sparql');

  if (tnr) {
    this.tnr = parseInt(tnr);
    this.uri = 'http://data.deichman.no/resource/tnr_' + this.tnr;
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
    FILTER(?format = <http://data.deichman.no/format/Book> || ?format = <http://data.deichman.no/format/Audiobook>) }';
    
  client.query(query, function(err,res) {
    if (err) callback(err);
    if (res) callback(res.boolean);
  });
}

module.exports = Book;