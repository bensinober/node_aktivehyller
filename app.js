const express = require('express')
const path = require('path')
const app = express()

// serve frontend app
app.use('/', express.static(path.join(__dirname, 'public')))

require(path.join(__dirname, 'server', 'routes.js'))(app)

app.listen(3000, () => console.log('Aktive hyller listening on port 3000!'))