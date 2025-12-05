import { healthCheck } from '@src/libs/healthCheck'
import express from 'express'
import { apiRouter } from './api'
import dashboardRouter from './dashboard.routes'
import { isBasicAuthenticatedMiddleware } from '../middlewares/isBasicAuthenticated.middleware'
const router = express.Router()

router.use('/dashboard', isBasicAuthenticatedMiddleware, dashboardRouter)
router.use('/api', apiRouter)
router.get('/health-check', healthCheck)

export { router }
