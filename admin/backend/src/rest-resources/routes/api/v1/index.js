import express from 'express'
import { adminRouter } from './admin.routes'
import { amoeRouter } from './amoe.routes'
import { bonusManagementRouter } from './bonusManagement.routes'
import { casinoManagementRouter } from './casinoManagement.routes'
import { contentManagementRoutes } from './contentManagement.routes'
import { dashboardRoutes } from './dashborad.routes'
import { internalRouter } from './internal.routes'
// import { liveChatRouter } from './liveChat.routes'
import { paymentRouter } from './payment.routes'
import { playerManagementRouter } from './playerManagement.routes'
import { settingsRoutes } from './settings.routes'
import { storeRouter } from './store.routes'
// import { tournamentRouter } from './tournament.routes'
import { transactioRouter } from './transaction.routes'
import { vipSystemManagementRouter } from './vipSystem.routes'
import { liveChatRouter } from './liveChat.routes'
import { affiliateRouter } from './affiliate.routes'
import { jackpotRouter } from './jackpot.routes'
import { kycRouter } from './kyc.routes'
import { chatRouter } from './chat.routes'
import { promoCodeRouter } from './promoCode.routes'

const v1Router = express.Router()

v1Router.use('/admin', adminRouter)
v1Router.use('/settings', settingsRoutes)
v1Router.use('/dashboard', dashboardRoutes)
v1Router.use('/internal', internalRouter)
v1Router.use('/transaction', transactioRouter)
v1Router.use('/player-management', playerManagementRouter)
v1Router.use('/casino-management', casinoManagementRouter)
v1Router.use('/content-management', contentManagementRoutes)
v1Router.use('/bonus-management', bonusManagementRouter)
// v1Router.use('/tournament', tournamentRouter)
v1Router.use('/payment', paymentRouter)
v1Router.use('/live-chat', liveChatRouter)
v1Router.use('/chat', chatRouter)
v1Router.use('/store', storeRouter)
v1Router.use('/amoe', amoeRouter)
v1Router.use('/vip', vipSystemManagementRouter)
v1Router.use('/affiliate', affiliateRouter)
v1Router.use('/kyc', kycRouter)
v1Router.use('/jackpot', jackpotRouter)
v1Router.use('/promo-code', promoCodeRouter)

export { v1Router }
