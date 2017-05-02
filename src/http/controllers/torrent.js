import parseTorrent from 'parse-torrent'
import createTorrent from 'create-torrent'
import fs from 'fs'

import * as pApi from '../../PAPI'
import * as Errors from '../../errors'

function opts (config) {
  return {
    announce: [`ws://${config.pseeder.monitor.announce}`],
    path: config.pseeder.download_path
  }
}

export function seed (req, res, config, client, pMonitor) {
  const path = req.body.path
  const pieces = path.split('.')
  const nameWithExt = req.body.name + '.' + pieces[pieces.length - 1]
  try {
    fs.accessSync(path) // check that file exists

    createTorrent(path, {name: nameWithExt}, (err, torrentBuf) => {
      if (err) {
        return Errors.sendUnexpectedError(res, err)
      }

      const existingTorrent = client.get(torrentBuf)
      if (existingTorrent) {
        return Errors.sendError(res, Errors.ERR_TORRENT_ALREADY_ADDED)
      }

      client.seed(path, Object.assign(opts(config), {name: nameWithExt}), async (torrent) => {
        try {
          const resVideo = await pApi.createVideo(torrent, {
            name: req.body.name,
            desc: req.body.desc,
            path: req.body.categories
          }, config)

          pMonitor.notifySeeding(torrent.infoHash)

          res.send(Object.assign(resVideo, { torrentHashInfo: torrent.infoHash }))
        } catch (e) {
          console.error(e.message)
          res.send({ torrentHashInfo: torrent.infoHash })
        }
      })
    })
  } catch (err) {
    return Errors.sendError(res, Errors.ERR_SEED_FILE_NOT_FOUND)
  }
}

export async function seedMonitored (req, res, config, client, pMonitor) {
  try {
    const infoHash = await pMonitor.getSeedTorrent(config)
    if (infoHash) {
      client.add(infoHash, opts(config), (torrent) => {
        pMonitor.notifySeeding(config)
        res.send(torrent.infoHash)
      })
    } else {
      Errors.sendError(res, Errors.ERR_INFOHASH_MONITOR)
    }
  } catch (e) {
    console.error(e.message)
  }
}

export function list (req, res, config, client) {
  let torrentHashes = client.torrents.map((t) => t.infoHash)
  res.json(torrentHashes)
}

export function add (req, res, config, client) {
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

  client.add(infoHash, opts(config), (torrent) => {
    res.send(torrent.infoHash)
  })
}

export function deleteTorrent (req, res, config, client, pMonitor) {
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
      pMonitor.removeSeed(infoHash)
      res.send('removed')
    }
  })
}

export function info (req, res, config, client) {
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
