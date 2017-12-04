
// Book MIXINS
// array mixin for distinct()
/*
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
*/
export function distinct(arr) {
  let u = {}
  for(let i = 0;i < arr.length;i++) {
    u[arr[i].uri.Value] = arr[i]
  }
  return u
}

// check material type
export function checkFormat(uri) {

  console.log("checking format: " + uri)

  var query = `ASK FROM <http://data.deichman.no/books> \
  { <${uri}> <http://purl.org/dc/terms/title> ?title . \
    <${uri}> <http://purl.org/dc/terms/format> ?format . \
    FILTER(?format = <http://data.deichman.no/format/Book> || ?format = <http://data.deichman.no/format/Audiobook>) }`
    
  return new Promise((resolve, reject) => {
    
  })
}
