import { G_SOFT_CASINO_ACTIONS } from '../../utils/constants/constant'
import { sendCasinoCallbackResponse } from '../../helpers/casinoCallback.helper'
import { BetAndWinGSoftCasinoService, BetGSoftCasinoService, GetAccountGSoftCasinoService, GetBalanceGSoftCasinoService, RollbackGSoftCasinoService, WinGSoftCasinoService } from '../../services/casino/gsoft/index'
export default class GSoftCasinoController {
  static async gSoftCallbacks (req, res, next) {
    try {
      switch (req.query.request) {
        case G_SOFT_CASINO_ACTIONS.ACCOUNT: {
          const { result, successful } = await GetAccountGSoftCasinoService.execute({ ...req.body, ...req.query }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case G_SOFT_CASINO_ACTIONS.BALANCE: {
          const { result, successful } = await GetBalanceGSoftCasinoService.execute({ ...req.body, ...req.query }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case G_SOFT_CASINO_ACTIONS.BET: {
          const { result, successful } = await BetGSoftCasinoService.execute({ ...req.body, ...req.query }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case G_SOFT_CASINO_ACTIONS.WIN: {
          const { result, successful } = await WinGSoftCasinoService.execute({ ...req.body, ...req.query }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case G_SOFT_CASINO_ACTIONS.JACKPOT: {
          req.query.result = req.query.amount
          const { result, successful } = await WinGSoftCasinoService.execute({ ...req.body, ...req.query }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case G_SOFT_CASINO_ACTIONS.BET_WIN: {
          const { result, successful } = await BetAndWinGSoftCasinoService.execute({ ...req.body, ...req.query }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case G_SOFT_CASINO_ACTIONS.CANCEL: {
          const { result, successful } = await RollbackGSoftCasinoService.execute({ ...req.body, ...req.query }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case G_SOFT_CASINO_ACTIONS.CANCEL_BET_WIN: {
          const { result, successful } = await RollbackGSoftCasinoService.execute({ ...req.body, ...req.query }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        default:
          break
      }
    } catch (error) {
      next(error)
    }
  }
}
