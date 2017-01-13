import express from 'express'
import torrentRoutes from './torrent.route'

const router = express.Router()

router.get('/health-check', (req, res) =>
  res.send('OK')
)

router.use('/', torrentRoutes)

export default router
