import { sendCasinoCallbackResponse, sendCasinoErrorResponse } from '@src/helpers/casinoCallback.helper'
import { Iconic21BalanceService } from '@src/services/casino/providers/iconic21/balance.iconic21.casino.service'
import { Iconic21BetService } from '@src/services/casino/providers/iconic21/bet.iconic21.casino.service'
import { Iconic21RollBackService } from '@src/services/casino/providers/iconic21/rollback.iconic21.casino'
import { Iconic21SessionInfoService } from '@src/services/casino/providers/iconic21/session.iconic21.casino.service'
import { Iconic21WinService } from '@src/services/casino/providers/iconic21/win.iconic21.casino.service'
import { ICONIC21_ERROR_TYPES } from '@src/utils/constants/casinoProviders/iconic21.constant'

export class Iconic21CasinoController {
  static async sessionInfoIconic21Casino (req, res, next) {
    try {
      const { result, success, errors } = await Iconic21SessionInfoService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, success, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ICONIC21_ERROR_TYPES.INTERNAL_ERROR })
      }
    }
  }

  static async getBalanceIconic21Casino (req, res, next) {
    try {
      const { result, success, errors } = await Iconic21BalanceService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, success, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ICONIC21_ERROR_TYPES.INTERNAL_ERROR })
      }
    }
  }

  static async betIconic21Casino (req, res, next) {
    try {
      const { result, success, errors } = await Iconic21BetService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, success, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ICONIC21_ERROR_TYPES.INTERNAL_ERROR })
      }
    }
  }

  static async winIconic21Casino (req, res, next) {
    try {
      const { result, success, errors } = await Iconic21WinService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, success, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ICONIC21_ERROR_TYPES.INTERNAL_ERROR })
      }
    }
  }

  static async rollbackIconic21Casino (req, res, next) {
    try {
      const { result, success, errors } = await Iconic21RollBackService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, success, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ICONIC21_ERROR_TYPES.INTERNAL_ERROR })
      }
    }
  }
}
