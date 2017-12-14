//const config = { graph: 'http://data.lillehammer.folkebibl.no' }
const config = { graph: 'http://data.deichman.no' }
const queries = require('./queries.js')(config)

const bindings = function(res) {
  // Parses the JSON response into bindings;
  // returns an object in the form {"bound variable": [b1, b2...]}
  let result = {}
    res.head.vars.forEach(bound => {
      result[bound] = []
      res.results.bindings.forEach(sol => {
        if(sol[bound] && result[bound].indexOf(sol[bound].value) < 0) {
          result[bound].push(sol[bound].value)
        }
      })
    })
  return result
}

const solutions = function(res) {
  // Parses the JSON response into solutions;
  // returns an array in the form [{"bound1":[...], "bound2":[..]}, {}]
  let result = []
  res.results.bindings.forEach(s => {
    solution = {}
    for (let key in s) {
      if (s[key]) {
        solution[key] = s[key].value
      }
    }
    result.push(solution)
  })
  return result
}

module.exports = (app) => {

  app.get('/random', (request, response) => {
    queries.fetchRandomBook()
    .then(res => {
      response.json(res.results.bindings[0].tnr.value)
    })
    .catch(err => {
      console.log(err)
      response.sendStatus(500)
    })
  })

  app.get('/format/:uri', (request, response) => {
    queries.getFormatAndTitle("http://dbpedia.org/David_Jones")
    .then(res => {
      response.json(exampleBook)
      //response.json(res)
    })
    .catch(err => {
      console.log(err)
      response.sendStatus(500)
    })
  })

  app.get('/info/:uri', (request, response) => {
    console.dir(request.params)
    queries.fetchBookInfo(request.params.uri)
    .then(res => {
      //console.dir(res.results)
      response.json(res.results.bindings)
    })
    .catch(err => {
      console.log(err)
      response.sendStatus(500)
    })
  })

  app.get('/localreviews/:uri', (request, response) => {
    queries.fetchLocalReviews(request.params.uri)
    .then(res => {
      console.dir(res.results)
      response.json(res.results)
    })
    .catch(err => {
      console.log(err)
      response.sendStatus(500)
    })
  })

  app.get('/sameauthor/:uri', (request, response) => {
    queries.fetchSameAuthorBooks(request.params.uri)
    .then(res => {
      console.dir(res.results)
      response.json(res.results)
    })
    .catch(err => {
      console.log(err)
      response.sendStatus(500)
    })
  })

  app.get('/similarworks/:uri', (request, response) => {
    queries.fetchSimilarWorks(request.params.uri)
    .then(res => {
      console.dir(res.results)
      response.json(res.results)
    })
    .catch(err => {
      console.log(err)
      response.sendStatus(500)
    })
  })
}
