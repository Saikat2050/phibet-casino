import dayjs from 'dayjs'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { appConfig } from '@src/configs'
import { Logger } from '@src/libs/logger'
import { ALEA_PROVIDER } from './alea.helper'
import ServiceBase from '@src/libs/serviceBase'
import { CURRENCY_TYPES, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { aleaCasinoConfig } from '@src/configs/casinoproviders/alea.config'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    game: { type: 'object' },
    userId: { type: 'string' },
    lang: { type: 'string' },
    coinType: { type: 'string' },
    isDemo: { type: 'boolean' },
    isMobile: { type: 'boolean' },
    ipAddress: { type: 'string' }
  }
})

/**
This service is used to accept game launch in real mode
@export
@class GameLaunchService
@extends {ServiceBase}
*/
export class AleaGameLaunchService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { game, isMobile, userId, isDemo, coinType, user } = this.args
    let sessionId

    const coin = (coinType === CURRENCY_TYPES.GOLD_COIN) ? 'GC' : 'SC'

    // get provider software id
    const providerSoftwareId = game?.casinoProvider.uniqueId

    // if not game
    if (!game || !providerSoftwareId) return ALEA_ERROR_TYPES.GAME_NOT_FOUND

    try {
      const environmentId = (ALEA_PROVIDER.PARGMATIC_PLAY === providerSoftwareId && coin !== SWEEPS_COINS.GC) ? aleaCasinoConfig.ppEnvironmentId : aleaCasinoConfig.environmentId

      if (isDemo) sessionId = `${dayjs().valueOf()}_${new Date()}_${coin}`
      else {
        sessionId = `${dayjs().valueOf()}_${userId}_${coin}`
        await Cache.set(`gamePlay-${userId}`, JSON.stringify({ sessionId, userId, coin, gameId: game.id, uniqueGameId: game.uniqueId, user }), 5400)
      }

      const gameUrl = `https://play.aleaplay.com/api/v1/games/${game.uniqueId}?casinoSessionId=${sessionId}&environmentId=${environmentId}&&locale=en&device=${isMobile ? 'MOBILE' : 'DESKTOP'}&gameMode=${isDemo ? 'DEMO' : 'REAL'}&lobbyUrl=${appConfig.app.userFeUrl}`
      return gameUrl
    } catch (error) {
      Logger.error(`Error in ALEA game launch - ${error}`)
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
