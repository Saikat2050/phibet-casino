import dayjs from 'dayjs'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { appConfig } from '@src/configs'
import { Logger } from '@src/libs/logger'
import ServiceBase from '@src/libs/serviceBase'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'
import { ICONIC21_ERROR_TYPES } from '@src/utils/constants/casinoProviders/iconic21.constant'
import { iconic21CasinoConfig } from '@src/configs/casinoproviders/iconic21.config'
import axios from 'axios'
import crypto from 'crypto'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    lang: { type: 'string' },
    game: { type: 'object' },
    coinType: { type: 'string' },
    isMobile: { type: 'boolean' },
    ipAddress: { type: 'string' },
    user: { type: 'object' }
  }
})

/**
This service is used to accept game launch in real mode for iconic 21
@export
@class GameLaunchService
@extends {ServiceBase}
*/
export class Iconic21GameLaunchService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, coinType, user, game } = this.args

    const coin = (coinType === CURRENCY_TYPES.GOLD_COIN) ? 'GC' : 'SC'

    if (!user || !user.isActive) return ICONIC21_ERROR_TYPES.PLAYER_NOT_FOUND
    if (!game) return ICONIC21_ERROR_TYPES.GAME_NOT_FOUND // if not game

    try {
      const { baseUrl: endPoint, secretKey, casino } = iconic21CasinoConfig
      const playerId = `${userId}_${coin}`
      const sessionId = `${dayjs().valueOf()}_${user.uniqueId}_${coin}`

      await Cache.set(`gamePlay-${userId}`, JSON.stringify({ sessionId, userId, coin, gameId: game?.id, uniqueGameId: game?.uniqueId, user, game }), 5400)
      const data = {
        sessionToken: sessionId,
        casino,
        playerId,
        launchAlias: game?.uniqueId,
        // testAccount: user?.userTags?.flat()?.length > 0,
        // homepage: `${appConfig.app.userFeUrl}`
        // brand
      }

      Logger.info(`Game URL Data - ${JSON.stringify(data)}`)
      const signature = crypto.createHash('sha256').update(`${secretKey}${JSON.stringify(data)}`).digest('hex')

      const option = {
        url: `${endPoint}/sw/v2/launch`,
        method: 'POST',
        headers: {
          'X-REQUEST-SIGN': signature,
          'Content-Type': 'application/json'
        },
        data: data
      }

      const { data: { launchUrl } } = await axios(option)
      Logger.info(`Game URL - ${launchUrl}`)
      return launchUrl
    } catch (error) {
      Logger.error(`Error in ICONIC21 game launch - ${error}`)
      return ICONIC21_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
