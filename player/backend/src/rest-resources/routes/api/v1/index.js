import express from 'express'
import { amoeRouter } from './amoe.routes'
import { approvelyRouter } from './payment/approvely.routes'
import { reportedUserRoutes } from './blockedUser.routes'
import { bonusRouter } from './bonus.routes'
import { casinoRouter } from './casino.routes'
import { commonRouter } from './common.routes'
import { crmRouter } from './crm.routes'
import { internalRouter } from './internal.routes'
import { liveChatRoutes } from './liveChat.routes'
import { responsibleGamblingRouter } from './responsibleGambling.routes'
import { storeRouter } from './store.routes'
import { tournamentRouter } from './tournament.routes'
import { userRouter } from './user.routes'
import { phoneRouter } from './verification.routes'
import paymentRouter from './payment'
import { spinWheelRouter } from './spinWheel.routes'
import { vaultRouter } from './vault.routes'
import kycRouter from './kyc.routes'
import { chatRoutes } from './chat.routes'
import { jackpotRouter } from './jackpot.route'

const v1Router = express.Router()

v1Router.use('/user', userRouter)
v1Router.use('/bonus', bonusRouter)
v1Router.use('/common', commonRouter)
v1Router.use('/casino', casinoRouter)
v1Router.use('/internal', internalRouter)
v1Router.use('/responsible-gambling', responsibleGamblingRouter)
v1Router.use('/payment', paymentRouter)
v1Router.use('/tournament', tournamentRouter)
v1Router.use('/crm', crmRouter)
v1Router.use('/report-user', reportedUserRoutes)
v1Router.use('/live-chat', liveChatRoutes)
v1Router.use('/chat', chatRoutes)
v1Router.use('/store', storeRouter)
v1Router.use('/amoe', amoeRouter)
v1Router.use('/approvely', approvelyRouter)
v1Router.use('/phone', phoneRouter)
v1Router.use('/spin-wheel', spinWheelRouter)
v1Router.use('/vault', vaultRouter)
v1Router.use('/kyc', kycRouter)
v1Router.use('/jackpot', jackpotRouter)

export default v1Router
