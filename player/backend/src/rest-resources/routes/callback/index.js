import express from 'express'
import v1Router from './v1'

const callbackRoutes = express.Router()

callbackRoutes.use('/v1', v1Router)

export { callbackRoutes }
