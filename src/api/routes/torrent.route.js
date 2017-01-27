import express from 'express'
import client from '../config/webtorrent'
import validate from 'express-validation'
import * as torrentCtrl from '../controllers/torrent.controller'
import Joi from 'joi'

const router = express.Router()

const opts = {
  announce: ['http://localhost:8000/announce']
}

/** POST /seedNewVideo - Seed a new video */
router.route('/seedNewVideo')
  .post(validate({body: {videoPath: Joi.string().required()}}), torrentCtrl.seedNewVideo)

/** POST /seed - Seed any video for the platform */
router.post('/seed', torrentCtrl.seed)

/** GET /list - Get a list of hashInfo seeded video */
router.get('/list', torrentCtrl.list)

/** GET /add/:infoHash - Download a torrent and seed it */
router.post('/add/:infoHash', torrentCtrl.add)

/** DELETE /delete/:infoHash - Delete a torrent */
router.delete('/delete/:infoHash', torrentCtrl.deleteTorrent)

router.get('/info/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash
  let torrent = client.get(infoHash)
  if (!torrent) {
    return res.status(400).send(`Torrent ${infoHash} not known`)
  }
  res.json(pick(torrent,
    'name',
    'infoHash',
    'timeRemaining',
    'received',
    'downloaded',
    'uploaded',
    'downloadSpeed',
    'uploadSpeed',
    'progress',
    'length',
    'ratio',
    'numPeers',
    'path'
  ))
})

function pick (o, ...fields) {
  let res = {}
  fields.forEach((f) => { res[f] = o[f] })
  return res
}
export default router
