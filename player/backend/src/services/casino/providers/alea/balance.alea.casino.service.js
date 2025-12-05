import { Cache } from '@src/libs/cache'
import { Logger } from '@src/libs/logger'
import ServiceBase from '@src/libs/serviceBase'
import { verifySignature } from './alea.helper'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'

export class GetBalanceAleaCasinoService extends ServiceBase {
  async run () {
    const { playerId, currency, casinoSessionId, gameId } = this.args

    try {
      if (!verifySignature(this.args)) {
        return ALEA_ERROR_TYPES.INVALID_SIGNATURE
      }

      const payload = await Cache.get(`alea_${casinoSessionId}`)
      if (!payload || (payload && !Object.keys(payload).length)) return ALEA_ERROR_TYPES.SESSION_EXPIRED

      const { userId, coin, uniqueGameId } = JSON.parse(payload)
      if (!userId) return ALEA_ERROR_TYPES.SESSION_EXPIRED
      if (String(uniqueGameId) !== String(gameId)) return ALEA_ERROR_TYPES.GAME_NOT_FOUND
      if (currency !== coin) return ALEA_ERROR_TYPES.INVALID_CURRENCY

      const [userIdFromPlayerId, coinFromPlayerId] = playerId.split('_')
      if (+userId !== +userIdFromPlayerId || coin !== coinFromPlayerId) return ALEA_ERROR_TYPES.PLAYER_NOT_FOUND

      const currencyType = coin === 'GC' ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN

      const wallets = await this.context.sequelize.models.wallet.findAll({
        where: { userId },
        include: [{
          model: this.context.sequelize.models.currency,
          where: { type: currencyType }
        }]
      })

      const realBalance = wallets.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

      return {
        realBalance,
        bonusBalance: 0.0
      }
    } catch (error) {
      Logger.error(`Error in Alea Balance call service - ${error}`)
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
