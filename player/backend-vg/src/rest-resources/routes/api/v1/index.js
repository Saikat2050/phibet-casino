import express from 'express'
import playerRoutes from './player.routes'
import casinoRoutes from './casino.routes'
import paymentRoutes from './payment.routes'
import pageContentRoutes from './page-content.routes'
import rewardsRouter from './reward.route'
import tournamentRouter from './tournament.routes'

const v1Router = express.Router()

v1Router.use('/user', playerRoutes)
v1Router.use('/casino', casinoRoutes)
v1Router.use('/payment', paymentRoutes)
v1Router.use('/pages', pageContentRoutes)
v1Router.use('/rewards', rewardsRouter)
v1Router.use('/tournament', tournamentRouter)

export default v1Router
