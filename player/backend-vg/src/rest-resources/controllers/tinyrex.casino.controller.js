import { sendCasinoCallbackResponse, sendCasinoErrorResponse } from '../../helpers/casinoCallback.helper'
import { TinyrexBalanceService } from '../../services/casino/tinyrex/balance.tinyrex.casino.service'
import { TinyrexBetService } from '../../services/casino/tinyrex/bet.tinyrex.casino.service'
import { TinyrexRollBackService } from '../../services/casino/tinyrex/rollback.tinyrex.casino.service'
import { TinyrexWinService } from '../../services/casino/tinyrex/win.tinyrex.casino.service'

export default class TinyrexCasinoController {
  static async getBalance (req, res, next) {
    try {
      const { result, successful } = await TinyrexBalanceService.execute({ ...req.query, ...req.body }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async betBeterCasino (req, res, next) {
    try {
      const { result, successful } = await TinyrexBetService.execute({ ...req.query, ...req.body }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async winConfirmCasino (req, res, next) {
    try {
      const { result, successful } = await TinyrexWinService.execute({ ...req.query, ...req.body }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

  static async rollbackBetBeterLiveCasino (req, res, next) {
    try {
      const { result, successful } = await TinyrexRollBackService.execute({ ...req.query, ...req.body }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      sendCasinoErrorResponse({ req, res, next }, { error })
    }
  }

}
