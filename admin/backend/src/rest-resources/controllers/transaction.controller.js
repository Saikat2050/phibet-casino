import { decorateResponse } from '@src/helpers/response.helpers'
import { GetBankingTransactionsService } from '@src/services/transaction/getBankingTransactions.service'
import { GetCasinoTransactionsService } from '@src/services/transaction/getCasinoTransactions.service'
import { GetLedgersService } from '@src/services/transaction/getLedgers.service'

export class TransactionController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getBankingTransactions (req, res, next) {
    try {
      const result = await GetBankingTransactionsService.execute({ ...req.query, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async getCasinoTransactions (req, res, next) {
    try {
      const result = await GetCasinoTransactionsService.execute({ ...req.query, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async getLedgers (req, res, next) {
    try {
      const result = await GetLedgersService.execute({ ...req.query, adminUserId: req.authenticated.adminUserId }, req.context)
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
}
