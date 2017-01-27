import client from '../config/webtorrent'
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
      res.send({ error: err })
    }
  })
}
