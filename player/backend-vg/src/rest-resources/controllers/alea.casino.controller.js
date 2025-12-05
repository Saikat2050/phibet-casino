import { ALEA_PLAY_CASINO_TYPES } from '../../utils/constants/constant'
import { sendCasinoErrorResponse, sendCasinoCallbackResponse } from '../../helpers/casinoCallback.helper'
import { INTERNAL_ERROR } from '../../services/casino/alea/alea.helper'
import { BetAleaCasinoService, BetAndWinAleaCasinoService, GetBalanceAleaCasinoService, GetSessionAleaCasinoService, RollBackAleaCasinoService, WinAleaCasinoService } from '../../services/casino/alea'
export default class AleaCasinoController {
  static async aleaCallbacks (req, res, next) {
    const stringData = req.rawBody.toString('utf-8').replace(/\s/g, '')
    try {
      switch (req.body.type) {
        case ALEA_PLAY_CASINO_TYPES.BET: {
          const { result, successful } = await BetAleaCasinoService.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case ALEA_PLAY_CASINO_TYPES.WIN: {
          const { result, successful } = await WinAleaCasinoService.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case ALEA_PLAY_CASINO_TYPES.BET_WIN: {
          const { result, successful } = await BetAndWinAleaCasinoService.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        case ALEA_PLAY_CASINO_TYPES.ROLLBACK: {
          const { result, successful } = await RollBackAleaCasinoService.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, successful })
          break
        }
        default:
          sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR })
          break
      }
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR })
      }
    }
  }

  static async aleaBalanceCallback (req, res, next) {
    try {
      const { result, successful, errors } = await GetBalanceAleaCasinoService.execute({ playerId: req.params.userId, ...req.query, signature: req.headers.digest, type: 'BALANCE' }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR })
      }
    }
  }

  static async aleaSessionCallback (req, res, next) {
    try {
      const { result, successful, errors } = await GetSessionAleaCasinoService.execute({ casinoSessionId: req.params.casinoSessionId, ...req.query, signature: req.headers.digest }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR })
      }
    }
  }
}
