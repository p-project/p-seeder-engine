import parseTorrent from 'parse-torrent'

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

export function add (req, res, next) {
  let infoHash = req.params.infoHash

  try {
    parseTorrent(infoHash)
  } catch (e) {
    return Errors.sendError(res, Errors.ERR_INFOHASH_PARSE)
  }

  if (client.get(infoHash)) {
    return Errors.sendError(res, Errors.ERR_TORRENT_ALREADY_ADDED)
  }

  client.add(infoHash, opts, (torrent) => {
    console.log('added ' + infoHash)
    res.send(torrent.infoHash)
  })
}

export function deleteTorrent (req, res, next) {
  let infoHash = req.params.infoHash
  try {
    parseTorrent(infoHash)
  } catch (e) {
    return Errors.sendError(res, Errors.ERR_INFOHASH_PARSE)
  }

  let infoHashList = client.torrents.map((t) => t.infoHash)
  if (!infoHashList.includes(infoHash)) {
    return Errors.sendError(res, Errors.ERR_INFOHASH_NOT_FOUND)
  }

  client.remove(infoHash, (err) => {
    console.log('removed ' + infoHash)
    if (err) {
      res.send({error: err.message})
    } else {
      res.send('removed')
    }
  })
}

export function info (req, res, next) {
  function pick (o, ...fields) {
    let res = {}
    fields.forEach((f) => { res[f] = o[f] })
    return res
  }

  let infoHash = req.params.infoHash
  try {
    parseTorrent(infoHash)
  } catch (e) {
    return Errors.sendError(res, Errors.ERR_INFOHASH_PARSE)
  }

  let torrent = client.get(infoHash)
  if (!torrent) {
    return Errors.sendError(res, Errors.ERR_INFOHASH_NOT_FOUND)
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
}
