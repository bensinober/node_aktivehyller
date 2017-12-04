export function doGetRequest (args) {
  return fetch(`http://localhost:8009${args.path}${args.params.join("/")}`)
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
