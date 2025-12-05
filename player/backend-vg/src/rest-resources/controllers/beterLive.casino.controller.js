import { sendCasinoCallbackResponse, sendCasinoErrorResponse } from '../../helpers/casinoCallback.helper'
import { TipsBeterLiveCasinoService, CancelTipsBeterLiveCasinoService, BeterLiveSessionInfoService, BeterLiveBalanceService, BeterLiveBetService, BeterLiveWinService, BeterLiveRollBackService, BeterLivePromoWinService } from '../../services/casino/beterLive'

export default class BeterLiveCasinoController {
  static async sessionInfo (req, res, next) {
    try {
      const { result, successful } = await BeterLiveSessionInfoService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async getBalance (req, res, next) {
    try {
      const { result, successful } = await BeterLiveBalanceService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async betBeterCasino (req, res, next) {
    try {
      const { result, successful } = await BeterLiveBetService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async winConfirmCasino (req, res, next) {
    try {
      const { result, successful } = await BeterLiveWinService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async rollbackBetBeterLiveCasino (req, res, next) {
    try {
      const { result, successful } = await BeterLiveRollBackService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async promoWinBetBeterLiveCasino (req, res, next) {
    try {
      const { result, successful } = await BeterLivePromoWinService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async tipsBetBeterLiveCasino (req, res, next) {
    try {
      const { result, successful } = await TipsBeterLiveCasinoService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async cancelTipsBetBeterLiveCasino (req, res, next) {
    try {
      const { result, successful } = await CancelTipsBeterLiveCasinoService.execute({ ...req.query, ...req.body, signature: req.headers['x-request-sign'], rawBody: req.rawBody.toString('utf-8') }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }
}
