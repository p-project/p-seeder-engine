import express from 'express'
import * as pApiCtrl from '../controllers/pApi.controller'

const router = express.Router()

router.get('/categories/:categoryId', pApiCtrl.getCategory)
router.get('/videos/', pApiCtrl.getVideo)

export default router
