import { healthCheck } from '@src/libs/healthCheck'
import express from 'express'
import { apiRouter } from './api'

const router = express.Router()

router.use('/api', apiRouter)
router.get('/health-check', healthCheck)

export { router }
