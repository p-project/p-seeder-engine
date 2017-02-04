import express from 'express'
import validate from 'express-validation'
import * as torrentCtrl from '../controllers/torrent.controller'
import Joi from 'joi'

const router = express.Router()

/** POST /seedNewVideo - Seed a new video */
router.route('/seedNewVideo')
  .post(validate({body: {videoPath: Joi.string().required()}}), torrentCtrl.seedNewVideo)

/** POST /seed - Seed any video for the platform */
router.post('/seed', torrentCtrl.seed)

/** GET /list - Get a list of hashInfo seeded video */
router.get('/list', torrentCtrl.list)

/** POST /add/:infoHash - Download a torrent and seed it */
router.post('/add/:infoHash', torrentCtrl.add)

/** POST /add - Download a torrent and seed it */
router.route('/add')
  .post(validate({body: {infoHash: Joi.string().required()}}), torrentCtrl.add)

/** DELETE /delete/:infoHash - Delete a torrent */
router.delete('/delete/:infoHash', torrentCtrl.deleteTorrent)

/** GET /info/:infoHash - Get info about a torrent */
router.get('/info/:infoHash', torrentCtrl.info)

export default router
