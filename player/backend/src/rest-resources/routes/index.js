import { healthCheck } from '@src/libs/healthCheck'
import express from 'express'
import { apiRouter } from './api'
import { callbackRoutes } from './callback'

const router = express.Router()

router.use('/api', apiRouter)
router.use('/callback', callbackRoutes)
router.get('/health-check', healthCheck)

export default router
