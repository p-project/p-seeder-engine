import parseTorrent from 'parse-torrent'
import createTorrent from 'create-torrent'
import fs from 'fs'

import client from '../vendor/webtorrent'
import * as pMonitor from '../vendor/pMonitor'
import * as pApi from '../vendor/pApi'
import * as Errors from '../errors'
import { config } from '../config'

const opts = {
  announce: [`ws://${config.pseeder.monitor.announce}`],
  path: config.pseeder.download_path
}

export function seed (req, res) {
  const path = req.body.path
  const pieces = path.split('.')
  const nameWithExt = req.body.name + '.' + pieces[pieces.length - 1]
  fs.stat(path, function (err, exists) {
    if (err == null) {
      createTorrent(path, {name: nameWithExt}, (createTorrentErr, torrentBuf) => {
        if (createTorrentErr) {
          return Errors.sendUnexpectedError(res, createTorrentErr)
        }

        let existingTorrent = client.get(torrentBuf)
        if (existingTorrent) {
          return Errors.sendError(res, Errors.ERR_TORRENT_ALREADY_ADDED)
        }

        client.seed(path, Object.assign(opts, {name: nameWithExt}), async (torrent) => {
          try {
            const resVideo = await pApi.createVideo(torrent,
              {
                name: req.body.name,
                desc: req.body.desc,
                path: req.body.categories
              })
            res.send(Object.assign(resVideo, { torrentHashInfo: torrent.infoHash }))
          } catch (e) {
            console.error(e.message)
          }
        })
      })
    } else {
      Errors.sendError(res, Errors.ERR_SEED_FILE_NOT_FOUND)
    }
  })
}

export async function seedMonitored (req, res) {
  try {
    const infoHash = await pMonitor.getSeedTorrent()
    if (infoHash) {
      client.add(infoHash, opts, (torrent) => {
        pMonitor.notifySeeding()
        res.send(torrent.infoHash)
      })
    } else {
      Errors.sendError(res, Errors.ERR_INFOHASH_MONITOR)
    }
  } catch (e) {
    console.error(e.message)
  }
}

export function list (req, res) {
  let torrentHashes = client.torrents.map((t) => t.infoHash)
  res.json(torrentHashes)
}

export function add (req, res) {
  let infoHash = req.params.infoHash !== undefined
    ? req.params.infoHash
    : req.body.infoHash

  try {
    parseTorrent(infoHash)
  } catch (e) {
    return Errors.sendError(res, Errors.ERR_INFOHASH_PARSE)
  }

  if (client.get(infoHash)) {
    return Errors.sendError(res, Errors.ERR_TORRENT_ALREADY_ADDED)
  }

  client.add(infoHash, opts, (torrent) => {
    res.send(torrent.infoHash)
  })
}

export function deleteTorrent (req, res) {
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
    if (err) {
      res.send({error: err.message})
    } else {
      res.send('removed')
    }
  })
}

export function info (req, res) {
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
