import express from 'express'
import validate from 'express-validation'
import * as torrentCtrl from '../controllers/torrent.controller'
import Joi from 'joi'

const router = express.Router()

// Seed a new file
router.route('/seed')
  .post(validate({body: {path: Joi.string().required()}}), torrentCtrl.seed)

// Seed files sent by the monitor
router.put('/seedMonitored', torrentCtrl.seedMonitored)

// List all currently known infoHashes
router.get('/list', torrentCtrl.list)

// Add a torrent to be downloaded by infohash
router.post('/add/:infoHash', torrentCtrl.add)

// Add a torrent to be downloaded by infohash or magnet link
router.route('/add')
  .post(validate({body: {infoHash: Joi.string().required()}}), torrentCtrl.add)

// Delete a torrent by infohash
router.delete('/delete/:infoHash', torrentCtrl.deleteTorrent)

// Get information about a torrent by infohash
router.get('/info/:infoHash', torrentCtrl.info)

export default router
