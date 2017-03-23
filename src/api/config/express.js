import express from 'express'
import bodyParser from 'body-parser'

import routes from '../routes/index.route'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json('*/*'))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'access-control-allow-origin, content-type')
  next()
})

app.use('/docs', express.static('docs'))
console.log('Api Docs is available : http://localhost:2342/docs/static/')

app.use('/', routes)

export default app
