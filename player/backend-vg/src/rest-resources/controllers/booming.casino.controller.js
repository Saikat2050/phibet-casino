
import { sendBoomingCasinoCallbackResponse } from '../../helpers/casinoCallback.helper'
import { BetWinBoomingCasinoService } from '../../services/casino/booming/betWin.booming.casino..service'
import { RollBackBoomingCasinoService } from '../../services/casino/booming/rollback.booming.casino.service'

export default class BoomingCasinoController {
  static async betWinCallback (req, res, next) {
    try {
      const { result, successful } = await BetWinBoomingCasinoService.execute({ ...req.body, ...req.query }, req.context)
      sendBoomingCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      next(error)
    }
  }

  static async rollbackCallback (req, res, next) {
    try {
      const { result, successful } = await RollBackBoomingCasinoService.execute({ ...req.body, ...req.query }, req.context)
      sendBoomingCasinoCallbackResponse({ req, res, next }, { result, successful })
    } catch (error) {
      next(error)
    }
  }
}
