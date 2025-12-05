import { sendCasinoCallbackResponse, sendCasinoErrorResponse } from '@src/helpers/casinoCallback.helper'
import { BetAleaCasinoService } from '@src/services/casino/providers/alea/bet.alea.casino.service'
import { ALEA_ERROR_TYPES, ALEA_PLAY_CASINO_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { WinAleaCasinoService } from '@src/services/casino/providers/alea/win.alea.casino.service'
import { RollBackAleaCasinoService } from '@src/services/casino/providers/alea/rollback.alea.casino.service'
import { GetBalanceAleaCasinoService } from '@src/services/casino/providers/alea/balance.alea.casino.service'
import { GetSessionAleaCasinoService } from '@src/services/casino/providers/alea/session.alea.casino.service'
import { BetAndWinAleaCasinoService } from '@src/services/casino/providers/alea/betWin.alea.casino.service'
import { EndRoundAleaCasinoService } from '@src/services/casino/providers/alea/endRound.alea.casino.service'

export class AleaCasinoController {
  static async aleaCallbacks (req, res, next) {
    const stringData = (req?.rawBody) ? req?.rawBody?.toString('utf-8')?.replace(/\s/g, '') : ''

    try {
      switch (req.body.type) {
        case ALEA_PLAY_CASINO_TYPES.BET: {
          const { result, success, errors } = await BetAleaCasinoService.execute({ ...req.body, signature: req?.headers?.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, success, errors })
          break
        }
        case ALEA_PLAY_CASINO_TYPES.WIN: {
          const { result, success, errors } = await WinAleaCasinoService.execute({ ...req.body, signature: req?.headers?.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, success, errors })
          break
        }
        case ALEA_PLAY_CASINO_TYPES.BET_WIN: {
          const { result, success, errors } = await BetAndWinAleaCasinoService.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, success, errors })
          break
        }
        case ALEA_PLAY_CASINO_TYPES.ROLLBACK: {
          const { result, success, errors } = await RollBackAleaCasinoService.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, success, errors })
          break
        }
        case ALEA_PLAY_CASINO_TYPES.END_ROUND: {
          const { result, success, errors } = await EndRoundAleaCasinoService.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, { result, success, errors })
          break
        }
        default:
          sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ALEA_ERROR_TYPES.INTERNAL_ERROR })
          break
      }
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ALEA_ERROR_TYPES.INTERNAL_ERROR })
      }
    }
  }

  static async aleaBalanceCallback (req, res, next) {
    try {
      const { result, success, errors } = await GetBalanceAleaCasinoService.execute({ playerId: req.params.userId, ...req.query, signature: req.headers.digest, type: 'BALANCE' }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, success, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ALEA_ERROR_TYPES.INTERNAL_ERROR })
      }
    }
  }

  static async aleaSessionCallback (req, res, next) {
    try {
      const { result, success, errors } = await GetSessionAleaCasinoService.execute({ casinoSessionId: req.params.casinoSessionId, ...req.query, signature: req.headers.digest }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, { result, success, serviceErrors: errors })
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ALEA_ERROR_TYPES.INTERNAL_ERROR })
      }
    }
  }
}
