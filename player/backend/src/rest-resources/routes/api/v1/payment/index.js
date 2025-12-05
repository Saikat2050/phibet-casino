import express from 'express'
import { approvelyRouter } from './approvely.routes'
import { paysafeRouter } from './paysafe.routes'

const paymentRouter = express.Router()

paymentRouter.use('/paysafe', paysafeRouter)
paymentRouter.use('/approvely', approvelyRouter)

export default paymentRouter
