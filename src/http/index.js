import express from 'express'
import bodyParser from 'body-parser'

import routes from './routes'

export default function http (config, torrent) {
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

  app.use('/', routes(config, torrent))
  return app
}
