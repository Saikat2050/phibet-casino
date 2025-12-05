import express from 'express'
import DashboardController from '../controllers/dashboard.controller'

const dashboardRouter = express.Router()

dashboardRouter.use(DashboardController.dashboard())

export default dashboardRouter
