import {} from './cleanupExit'

import WebTorrent from 'webtorrent'
import express from 'express'
import bodyParser from 'body-parser'

const web = express()

const opts = {
  announce: ['http://localhost:8000/announce']
}

const client = new WebTorrent(opts)
console.log('[PeerId] ' + client.peerId)

// Seed test torrent
let buffer = new Buffer('TestFileContent')
buffer.name = 'TestFileName'
client.seed(buffer, opts, (torrent) => {
  console.log('seeding test file' + torrent.infoHash + ' peerId=' + torrent.discovery.peerId)
})

web.use(bodyParser.json())
web.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'access-control-allow-origin, content-type')
  next()
})

web.get('/list', (req, res) => {
  let torrentHashes = client.torrents.map((t) => t.infoHash)
  res.json(torrentHashes)
})

web.get('/seed', (req, res) => {
  // Contacter p-monitor pour savoir quel fichier seed
  // DL & Seed (use client.add)
})

web.post('/add/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash
  if (client.get(infoHash)) {
    return res.sendStatus(400).send('Torrent already added')
  }
  client.add(infoHash, opts, (torrent) => {
    console.log('added ' + infoHash)
    res.send(torrent.infoHash)
  })
})

web.post('/add', (req, res) => {
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

web.delete('/delete/:infoHash', (req, res) => {
  let infoHash = req.params.infoHash
  client.remove(infoHash, (err) => {
    console.log('removed ' + infoHash)
    res.send(err)
  })
})

web.get('/info/:infoHash', (req, res) => {
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

const port = 2342
web.listen(port, () => console.log('listening on port ' + port))

function pick (o, ...fields) {
  let res = {}
  fields.forEach((f) => { res[f] = o[f] })
  return res
}

export default client
