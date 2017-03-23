import express from 'express'
import torrentRoutes from './torrent.route'
import pApiRoutes from './pApi.route'

const router = express.Router()

router.get('/health-check', (req, res) =>
  res.send('OK')
)

router.use('/', torrentRoutes)
router.use('/pApi/', pApiRoutes)

export default router
