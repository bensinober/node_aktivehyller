
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

export function bindings(res) {
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

export function solutions(res) {
  // Parses the JSON response into solutions;
  // returns an array in the form [{"bound1":[...], "bound2":[..]}, {}]
  let result = []
  res.bindings.forEach(s => {
    let solution = {}
    for (var key in s) {
      if (s[key]) {
        solution[key] = s[key].value
      }
    }
    result.push(solution)
  })
  return result
}