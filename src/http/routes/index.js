import express from 'express'
import torrentRoutes from './torrent'
import pApiRoutes from './PAPI'

export default function routes (config, torrent, pMonitor) {
  const router = express.Router()
  router.get('/health-check', (req, res) => res.send('OK'))

  router.use('/', torrentRoutes(config, torrent, pMonitor))
  router.use('/pApi/', pApiRoutes(config))

  return router
}
