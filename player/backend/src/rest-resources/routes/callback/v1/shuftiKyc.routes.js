import express from 'express'
import { VerificationController } from '@src/rest-resources/controllers/verification.controller'

const shuftiRouter = express.Router()

// POST REQUESTS
shuftiRouter.post('/status', VerificationController.getKycStatus)

export { shuftiRouter }
