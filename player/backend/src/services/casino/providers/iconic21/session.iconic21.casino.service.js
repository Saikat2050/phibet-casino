import { iconic21CasinoConfig } from '@src/configs/casinoproviders/iconic21.config'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { ICONIC21_ERROR_TYPES } from '@src/utils/constants/casinoProviders/iconic21.constant'
import { CURRENCY_TYPES, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { Logger } from '@src/libs/logger'
import crypto from 'crypto'

export class Iconic21SessionInfoService extends ServiceBase {
  async run () {
    const { playerId, sessionToken: sessionId, signature, rawBody } = this.args
    try {
      const { secretKey } = iconic21CasinoConfig
      const sign = crypto.createHash('sha256').update(`${secretKey}${rawBody}`).digest('hex')
      const verifySignature = signature === sign
      if (!verifySignature) { return ICONIC21_ERROR_TYPES.INVALID_SIGNATURE }
      const [userId, coin] = playerId.split('_')

      const redisData = await Cache.get(`gamePlay-${userId}`)
      if (!redisData || (redisData && !Object.keys(redisData).length)) { return ICONIC21_ERROR_TYPES.SESSION_EXPIRED }

      const payload = JSON.parse(redisData)
      if (!payload?.userId || !payload?.coin || !payload?.gameId) { return ICONIC21_ERROR_TYPES.SESSION_EXPIRED }

      if (+payload.userId !== +userId || payload.coin !== coin) { return ICONIC21_ERROR_TYPES.PLAYER_NOT_FOUND }

      const { game, user } = payload
      if (!game) { return ICONIC21_ERROR_TYPES.GAME_NOT_FOUND }
      if (!user) { return ICONIC21_ERROR_TYPES.PLAYER_NOT_FOUND }

      const userWallet = await this.context.sequelize.models.wallet.findAll({
        where: { userId },
        attributes: ['amount'],
        include: {
          model: this.context.sequelize.models.currency,
          where: { type: coin === SWEEPS_COINS.GC ? CURRENCY_TYPES.GOLD_COIN : CURRENCY_TYPES.SWEEP_COIN },
          required: true,
          attributes: []
        }
      })
      const balance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)

      return {
        playerId: `${userId}_${coin}`,
        currency: `${coin}.`,
        country: 'US',
        balance: balance + '',
        displayName: user?.username
      }
    } catch (error) {
      Logger.error(`Error in Iconic 21 session info service - ${error}`)
      return ICONIC21_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
