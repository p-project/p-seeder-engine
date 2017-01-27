import express from 'express'
import bodyParser from 'body-parser'

import routes from '../routes/index.route'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET', 'PUT', 'POST', 'DELETE', 'OPTIONS')
  res.header('Access-Control-Allow-Headers', 'access-control-allow-origin, content-type')
  next()
})

app.use('/', routes)

export default app
