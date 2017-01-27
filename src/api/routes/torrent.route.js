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

router.get('/list', (req, res) => {
  let torrentHashes = client.torrents.map((t) => t.infoHash)
  res.json(torrentHashes)
})

router.post('/add/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash
  if (client.get(infoHash)) {
    return res.sendStatus(400).send('Torrent already added')
  }
  client.add(infoHash, opts, (torrent) => {
    console.log('added ' + infoHash)
    res.send(torrent.infoHash)
  })
})

router.post('/add', (req, res) => {
  if (!req.body || !req.body.torrent) return res.sendStatus(400).send('Torrent is missing')
  let infoHash = req.body.torrent
  if (client.get(infoHash)) {
    return res.status(400).send('Torrent already added')
  }
  client.add(infoHash, opts, (torrent) => {
    console.log('added ' + infoHash)
    res.send(torrent.infoHash)
  })
})

router.delete('/delete/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash
  client.remove(infoHash, (err) => {
    console.log('removed ' + infoHash)
    res.send(err)
  })
})

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