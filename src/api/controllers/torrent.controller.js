import client from '../config/webtorrent'
import * as pMonitor from '../config/pMonitor'
import * as Errors from '../config/errors'

import fs from 'fs'

const opts = {
  announce: ['http://localhost:8000/announce']
}

export function seedNewVideo (req, res, next) {
  console.log('seedNewVideo')
  const videoPath = req.body.videoPath
  fs.stat(videoPath, function (err, exists) {
    if (err == null) {
      client.seed(videoPath, opts, (torrent) => {
        console.log('seeding test file' + torrent.infoHash + ' peerId=' + torrent.discovery.peerId)
        res.send({ torrentHashInfo: torrent.infoHash })
      })
    } else {
      Errors.sendError(res, Errors.ERR_SEED_FILE_NOT_FOUND)
    }
  })
}

export function seed (req, res, next) {
  console.log('Received seed request');
  (async() => {
    const infoHash = await pMonitor.getSeedTorrent()
    if (infoHash) {
      client.add(infoHash, opts, (torrent) => {
        console.log('added ' + infoHash)
        pMonitor.notifySeeding()
        res.send(torrent.infoHash)
      })
    } else {
      Errors.sendError(res, Errors.ERR_INFOHASH_MONITOR)
    }
  })().catch(next)
}

export function list (req, res, next) {
  let torrentHashes = client.torrents.map((t) => t.infoHash)
  res.json(torrentHashes)
}
