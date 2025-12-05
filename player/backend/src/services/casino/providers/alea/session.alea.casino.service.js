import { Cache } from '@src/libs/cache'
import { Logger } from '@src/libs/logger'
import ServiceBase from '@src/libs/serviceBase'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import { SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'

export class GetSessionAleaCasinoService extends ServiceBase {
  async run () {
    const { casinoSessionId } = this.args

    try {
      const payload = await Cache.get(`alea_${casinoSessionId}`)
      const data = JSON.parse(payload)
      if (!payload || (payload && !Object.keys(payload).length)) return ALEA_ERROR_TYPES.SESSION_EXPIRED

      const player = await this.context.sequelize.models.user.findByPk(data.userId, { attributes: ['id'] })
      if (!player) return ALEA_ERROR_TYPES.PLAYER_NOT_FOUND

      return {
        country: 'US',
        currency: data.coin === SWEEPS_COINS.GC ? 'GC' : 'SC',
        casinoPlayerId: data.coin === SWEEPS_COINS.GC ? `${data.userId}_GC` : `${data.userId}_SC`
      }
    } catch (error) {
      Logger.error(`Error in Alea Balance call service - ${error}`)
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
