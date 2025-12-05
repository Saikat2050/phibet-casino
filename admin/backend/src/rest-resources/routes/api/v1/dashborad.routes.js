import DashboardController from '@src/rest-resources/controllers/dashboard.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { getKPISummarySchema } from '@src/schema/dashboard/kpiSummary.schema'
// import { getPlayerPerformanceSchema } from '@src/schema/dashboard/playerPerfomance.schema'
import express from 'express'
import { resources } from '@src/utils/constants/permission.constant'

const dashboardRoutes = express.Router()

// dashboardRoutes.get('/get-demograph', isAuthenticated(), DashboardController.getDemograph, responseValidationMiddleware({ getDemoGraphSchema }))
dashboardRoutes.get('/get-kpi-summary', isAuthenticated(), DashboardController.getKipSummary, responseValidationMiddleware(getKPISummarySchema))
dashboardRoutes.get('/get-game-report', isAuthenticated(resources.gameReport.read), DashboardController.getGameReport, responseValidationMiddleware({}))
dashboardRoutes.get('/get-matrics', isAuthenticated(), DashboardController.getMatrics, responseValidationMiddleware({}))
dashboardRoutes.get('/player-performance-sapshot', isAuthenticated(resources.reportPlayerPerformance.read), DashboardController.getPlayerPerformanceReport, responseValidationMiddleware({}))
dashboardRoutes.get('/bonus-report', DashboardController.bonusReport, responseValidationMiddleware({}))

// new version apis
dashboardRoutes.get('/statistics-summary', DashboardController.getStatsSummary, responseValidationMiddleware({}))

// for getting distinct player count in get-game-report
dashboardRoutes.get('/get-game-report-player-count', isAuthenticated(resources.gameReport.read), DashboardController.getGameReportPlayerCount, responseValidationMiddleware({}))
dashboardRoutes.get('/statistics-summary-v2', DashboardController.getStatsSummaryV2, responseValidationMiddleware({}))
dashboardRoutes.get('/get-active-user', DashboardController.getActiveUserService, responseValidationMiddleware({}))
export { dashboardRoutes }
