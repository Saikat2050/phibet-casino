import express from 'express'
import { aleaRouter } from './aleaCasino.routes'
import { paymentRouter } from './payment.routes'
import { shuftiRouter } from './shuftiKyc.routes'
import { iconic21Router } from './iconic21Casino.routes'

const v1Router = express.Router()

v1Router.use('/alea', aleaRouter)
v1Router.use('/payment', paymentRouter)
v1Router.use('/shufti', shuftiRouter)
v1Router.use('/sw/v2', iconic21Router)

export default v1Router
