import express from 'express'
import client from '../config/webtorrent'

const router = express.Router()

const opts = {
  announce: ['http://localhost:8000/announce']
}

router.get('/list', (req, res) => {
  let torrentHashes = client.torrents.map((t) => t.infoHash)
  res.json(torrentHashes)
})

router.get('/seed', (req, res) => {
  // Contacter p-monitor pour savoir quel fichier seed
  // DL & Seed (use client.add)
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
