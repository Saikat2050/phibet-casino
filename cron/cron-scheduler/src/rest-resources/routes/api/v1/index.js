import express from 'express'
import { internalRouter } from './internal.routes'
import tierRouter from './vipTier.routes'
import referralRouter from './referral.routes'
import optimoveRouter from './optimove.routes'
import userRouter from './user.routes'
import scaleoRouter from './scaleo.routes'
import jackpotRouter from './jackpot.routes'

const v1Routes = express.Router()

v1Routes.use('/internal', internalRouter)
v1Routes.use('/vip-tier', tierRouter)
v1Routes.use('/avail-referral-deposit', referralRouter)
v1Routes.use('/optimove', optimoveRouter)
v1Routes.use('/user', userRouter)
v1Routes.use('/scaleo', scaleoRouter)
v1Routes.use('/jackpot', jackpotRouter)

export { v1Routes }
