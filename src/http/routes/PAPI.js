import express from 'express'
import * as pApiCtrl from '../controllers/PAPI'

export default function routes (config) {
  const router = express.Router()

  router.get('/categories/:categoryId', (req, res) => pApiCtrl.getCategory(req, res, config))
  router.get('/videos/', (req, res) => pApiCtrl.getVideo(req, res, config))

  return router
}
