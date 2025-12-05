import { decorateResponse } from '@src/helpers/response.helpers'
import { GetStatsSummaryService } from '@src/services/dashboard/getStatsSummary.service'
import { GetDemographService } from '@src/services/dashboard/getDemograph.service'
import { GetKpiSummaryService } from '@src/services/dashboard/getKpiSummary.service'
import { GetMatricsService } from '@src/services/dashboard/getLivePlayerDetails.service'
import { GetGameReportServiceV1 } from '@src/services/dashboard/getGameReportV1.service'
import { GetGameReportPlayerCountService } from '@src/services/dashboard/getGameReportPlayerCount.service'
import { GetPlayerPerformanceReportServiceV1 } from '@src/services/dashboard/playerStatsReportV1.service'
// import { GetStatsSummaryV2Service } from '@src/services/dashboard/getStatsSummaryV2.service'
import { GetStatsSummaryV3Service } from '@src/services/dashboard/getStatsSummaryV3.service'
import { GetActiveUserService } from '@src/services/dashboard/getActiveUser.service'
import { GetBonusReportService } from '@src/services/dashboard/getBonusReport.service'

export default class DashboardController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getMatrics (req, res, next) {
    try {
      const result = await GetMatricsService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getDemograph (req, res, next) {
    try {
      const result = await GetDemographService.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getGameReport (req, res, next) {
    try {
      // const result = await GetGameReportService.execute(req.query, req.context)  -- using transaction table
      const result = await GetGameReportServiceV1.execute(req.query, req.context) // --using cumulative approach + transaction table
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
      if (result?.result && result?.result?.stream) {
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv')

        result.result.stream.on('data', (chunk) => {
          console.log('Streaming chunk:', chunk.toString().slice(0, 50))
        })

        result.result.stream.pipe(res)

        result.result.stream.on('error', (error) => {
          console.error('Stream error:', error)
          res.status(500).end()
        })

        result.result.stream.on('end', () => console.log('Stream completed successfully.'))
      } else decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getKipSummary (req, res, next) {
    try {
      const result = await GetKpiSummaryService.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getPlayerPerformanceReport (req, res, next) {
    try {
      // const result = await GetPlayerPerformanceReportService.execute(req.query, req.context)
      const result = await GetPlayerPerformanceReportServiceV1.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
      if (result?.result && result?.result?.stream) {
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv')

        result.result.stream.on('data', (chunk) => {
          console.log('Streaming chunk:', chunk.toString().slice(0, 50))
        })

        result.result.stream.pipe(res)

        result.result.stream.on('error', (error) => {
          console.error('Stream error:', error)
          res.status(500).end()
        })

        result.result.stream.on('end', () => console.log('Stream completed successfully.'))
      } else decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getStatsSummary (req, res, next) {
    try {
      const result = await GetStatsSummaryService.execute(req.query, req.context)
      // if (req.query.csvDownload) result.result.demograph = await configureCsvFile('demograph', result.result.demograph, res)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getGameReportPlayerCount (req, res, next) {
    try {
      const result = await GetGameReportPlayerCountService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getStatsSummaryV2 (req, res, next) {
    try {
      // const result = await GetStatsSummaryV2Service.execute(req.query, req.context)
      const result = await GetStatsSummaryV3Service.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getActiveUserService (req, res, next) {
    try {
      const result = await GetActiveUserService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async bonusReport (req, res, next) {
    try {
      const result = await GetBonusReportService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
