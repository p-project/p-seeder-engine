import express from 'express'
import validate from 'express-validation'
import * as torrentCtrl from '../controllers/torrent'
import Joi from 'joi'

export default function routes (config, torrent, pMonitor) {
  const router = express.Router()

  // Seed a new file
  router.route('/seed')
    .post(validate({body: {
      name: Joi.string().required(),
      desc: Joi.string().required(),
      path: Joi.string().required(),
      categories: Joi.string().required()}}),
    (req, res) => torrentCtrl.seed(req, res, config, torrent, pMonitor))

  // Seed files sent by the monitor
  router.put('/seedMonitored',
    (req, res) => torrentCtrl.seedMonitored(req, res, config, torrent, pMonitor))

  // List all currently known infoHashes
  router.get('/list',
    (req, res) => torrentCtrl.list(req, res, config, torrent))

  // Add a torrent to be downloaded by infohash
  router.post('/add/:infoHash',
    (req, res) => torrentCtrl.add(req, res, config, torrent))

  // Add a torrent to be downloaded by infohash or magnet link
  router.route('/add')
    .post(validate({body: {
      infoHash: Joi.string().required() }}),
    (req, res) => torrentCtrl.add(req, res, config, torrent))

  // Delete a torrent by infohash
  router.delete('/delete/:infoHash',
    (req, res) => torrentCtrl.deleteTorrent(req, res, config, torrent, pMonitor))

  // Get information about a torrent by infohash
  router.get('/info/:infoHash',
    (req, res) => torrentCtrl.info(req, res, config, torrent))

  return router
}
