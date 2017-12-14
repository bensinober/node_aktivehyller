export function doGetRequest(args) {
  return fetch(`http://localhost:5000${args.path}${args.params.join("/")}`)
  .then((res) => {
    if (res.status == 200) {
      return res.json()
    } else {
      console.log("Error: " + res.status)
      return Promise.reject(`Failed fetching external resource: ${res.statusText}`)
    }
  })
  .catch((err) => {
    console.log(err)
    return Promise.reject(`Failed fetching external resource: ${err}`)
  })
}

export function lookupBook(book) {
  console.log(book)
  // TODO: Rewrite into ractive
  // show overlay
  //$('button#retry-knapp').hide();
  //$('#overlay').show();
  //$('button#avbryt-knapp').html('Avbryt');
  //$('div#vi-leter p').html("Henter info om \"" + title + '" <div id="loading"></div>' );
  //$('#vi-leter').show();
/*  doGetRequest(`/populate/${book.bookId}`)
  .then(res => {
    console.log(res);
    this.set({book: response, reviewIndex: 0, reviewMode: true, moreFromAuthorMode: false, similarWorkMode: false});
    var authors = [];
    // comma, separated authors list
    response.authors.forEach(function(a) {
      authors.push(a.creatorName);
    });
    headerRactive.set({title: response.title, authors: authors.join(', ') });
    // save to history
    leftbarRactive.data.bookStable.push(response);
    $('#overlay').hide();
    $('#vi-leter').hide();
  })
  .catch(err => {
    console.log(err)
    $('div#vi-leter p').html('&#9760; Beklager, dette tok for lang tid!' );
    $('button#retry-knapp').show();
  })*/
}