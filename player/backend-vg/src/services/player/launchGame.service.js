import axios from 'axios'
import crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { generateHash } from '../casino/beterLive/beterLive.helper'
import { generateSessionToken } from '../casino/gsoft/helper.gsoft.casino'
import { AGGREGATORS, ALEA_PROVIDERS, CACHE_KEYS } from '../../utils/constants/constant'
import { GSOFT_PROVIDERS_LANG_PARAM, deleteRedisToken, encryptData, getClientIp, setGamePlayRedisToken } from '../../utils/common'
import socketServer from '../../libs/socketServer'
import { round, plus, minus } from 'number-precision'

export class LaunchGameService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: {
        Country: CountryModel,
        Tournament: TournamentModel,
        MasterCasinoGame: MasterCasinoGameModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel
      }
    } = this.context

    let tournament
    let gameUrl = ''
    const {
      gameId,
      coin,
      isMobile = false,
      isDemo = false,
      tournamentId
    } = this.args
    if (!user) return this.addError('UserNotExistsErrorType')

    if (user.isRestrict) return this.addError('RestrictedUserErrorType')
    if (coin === 'SC' && +user.userWallet.totalScCoin <= 0) return this.addError('InsufficientScBalanceErrorType')

    // if (coin === 'SC' && !user.phoneVerified) return this.addError('PhoneNotVerifiedErrorType')
    let isGameExist, provider, aggregator
    try {
      const [gamesCache, providersCache, aggregatorCache] = await Promise.all([socketServer.redisClient.get(CACHE_KEYS.GAMES), socketServer.redisClient.get(CACHE_KEYS.PROVIDERS), socketServer.redisClient.get(CACHE_KEYS.AGGREGATOR)])

      const parsedGames = JSON.parse(gamesCache || '[]')
      const parsedProviders = JSON.parse(providersCache || '[]')
      const parsedAggregators = JSON.parse(aggregatorCache || '[]')

      if (parsedGames.length && parsedProviders.length && parsedAggregators.length) {
        isGameExist = parsedGames.find(game => game.masterCasinoGameId === gameId)
        if (isGameExist) {
          provider = parsedProviders.find(p => p.masterCasinoProviderId === isGameExist.masterCasinoProviderId)
          if (provider) {
            aggregator = parsedAggregators.find(a => a.masterGameAggregatorId === provider.masterGameAggregatorId)
            aggregator = aggregator.name
          }
          provider = provider.name
        }
      }
    } catch (error) {
      console.error('Cache retrieval error:', error)
    }
    if (!isGameExist) {
      const include = [
        {
          model: MasterCasinoProviderModel,
          where: { isActive: true },
          attributes: ['name', 'masterGameAggregatorId'],
          include: [
            {
              model: MasterGameAggregatorModel,
              attributes: ['name'],
              where: { isActive: true }
            }
          ]
        }
      ]
      
      isGameExist = await MasterCasinoGameModel.findOne({
        where: { masterCasinoGameId: gameId, isActive: true },
        include: include,
        attributes: ['masterCasinoGameId', 'identifier', 'masterCasinoProviderId']
      })
      if (!isGameExist) return this.addError('GameNotFoundErrorType')
      aggregator =
      isGameExist.MasterCasinoProvider.MasterGameAggregator.name

      provider = isGameExist?.MasterCasinoProvider?.name
    }
    if (tournamentId) {
      tournament = await TournamentModel.findOne({
        where: {
          tournamentId,
          isActive: true
        }
      })
    }

    const gameToken = await jwt.sign(
      {
        userId: user.userId,
        coin,
        gameId,
        identifier: isGameExist.identifier,
        tournamentId: tournament?.tournamentId,
        isGameExist: isGameExist,
        userData: user.get({ plain: true })
      },
      config.get('jwt.casinoGamePlaySecret'),
      { expiresIn: config.get('jwt.casinoGamePlayExpiry') }
    )
    await deleteRedisToken({ key: `gamePlay-${user.uniqueId}` })

    await setGamePlayRedisToken({
      key: `gamePlay-${user.uniqueId}`,
      token: gameToken
    })

    const lobbyUrl = `${config.get('frontendUrl')}/`
    const depositUrl = `${config.get('frontendUrl')}/user/store`

    if (aggregator === AGGREGATORS.GSOFT) {
      //  GSOFT
      const {
        gsoft_start_game_api_url: endPoint,
        operator_id: operatorId,
        license
      } = config.getProperties().gsoft

      let sessionId = `${operatorId}_${user.userId}`

      sessionId = generateSessionToken(sessionId).substring(0, 27)

      if (+sessionId.split('_')[1] !== +user.userId) return this.addError('InternalServerErrorType')

      const countryCode = user.countryCode
        ? (await CountryModel.findOne({
            where: { countryId: user.countryCode },
            raw: true
          }).code) ?? 'US'
        : 'US'

      gameUrl = `${endPoint}/game?accountid=${
        user.userId
      }_${coin}&country=${countryCode}&device_type=${
        isMobile ? 'mobile' : 'desktop'
      }&historyUrl=${`${config.get(
        'frontendUrl'
      )}/user/account-details`}&homeurl=${lobbyUrl}&is_test_account=${
        user.isInternalUser
      }&license=${license}&nogscurrency=${coin}&nogsgameid=${
        isGameExist.identifier
      }&nogslang=${
        GSOFT_PROVIDERS_LANG_PARAM[isGameExist.MasterCasinoProvider.name] ?? 'en_US'
      }&nogsmode=${
        isDemo ? 'demo' : 'real'
      }&nogsoperatorid=${operatorId}&sessionid=${sessionId}`
    } else if (aggregator === AGGREGATORS.ALEA) {
      // ALEA Play
      const {
        base_url: endPoint,
        secret_key: secret,
        environment_id: envId,
        pp_environment_id: ppEnvId
      } = config.getProperties().alea

      const countryCode = 'US'

      const sessionId = generateSessionToken(user.uniqueId)
      const signature = crypto.createHash('sha512')
      isDemo ? signature.update(`${countryCode}${coin}${secret}`) : signature.update(`${user.userId}_${coin}${sessionId}${countryCode}${coin}${secret}`)
      gameUrl = `${endPoint}/${isGameExist.identifier}?casinoSessionId=${sessionId || 'demoSession'}&environmentId=${+(provider === ALEA_PROVIDERS.PRAGMATIC_PLAY && coin === 'SC') ? ppEnvId : envId}&locale=en&device=${isMobile ? 'MOBILE' : 'DESKTOP'}&gameMode=REAL&lobbyUrl=${lobbyUrl}&depositUrl=${depositUrl}&isTest=true`
    } else if (aggregator === AGGREGATORS.BETERLIVE) {
      const {
        base_url: endPoint,
        casino
      } = config.getProperties().beterLive

      const playerId = `${user.userId}_${coin}`
      const sessionId = generateSessionToken(user.uniqueId)

      const data = {
        sessionToken: sessionId,
        casino: casino,
        playerId: playerId,
        launchAlias: isGameExist.identifier,
        testAccount: user.isInternalUser
      }
      const signature = generateHash(data)
      const option = {
        url: `${endPoint}/sw/v2/launch`,
        method: 'POST',
        headers: {
          'X-REQUEST-SIGN': signature,
          'Content-Type': 'application/json'
        },
        data: data
      }
      try {
        const {
          data: { launchUrl }
        } = await axios(option)
        gameUrl = `${launchUrl}&sessionId=${sessionId}`
      } catch (error) {
        console.log(error.response.data)
        return this.addError('InternalServerErrorType', error)
      }
    } else if (aggregator === AGGREGATORS.BOOMING) {
      const { boomingApiSecret, boomingRequestPath, boomingGameUrl, boomingApiKey, boomingCallback: callback, boomingRollBackCallback } = config.getProperties().boomingConfig
      const sessionId = generateSessionToken(user.uniqueId)
      const playerData = { id: user.userId + '_' + coin + '_' + sessionId }
      const isScActive = coin === 'SC'
      const accountBalance = isScActive ? +round(+user.userWallet.totalScCoin, 2) : +round(+user.userWallet.gcCoin, 2)
      const playerIp = getClientIp(this.context.req)
      const payload = {
        game_id: isGameExist.identifier,
        balance: accountBalance,
        locale: 'en_social',
        currency: coin === 'SC' ? 'VEGASCOINS_SC' : 'VEGASCOINS_GC',
        player_id: user.userId,
        operator_launch_data: JSON.stringify(playerData),
        player_ip: playerIp,
        callback,
        rollback_callback: boomingRollBackCallback,
        demo: 'false',
        variant: 'desktop'
      }
      const requestBody = JSON.stringify(payload, null, 2)

      const nonce = Date.now()
      const baseUrl = boomingGameUrl.replace(/\/+$/, '')
      const endpoint = boomingRequestPath.replace(/^\/+/, '')
      const bodyHash =  crypto.createHash('sha256').update(requestBody).digest('hex')
      const reqPayload = '/' + endpoint + nonce + bodyHash
      const signature = crypto
        .createHmac('sha512', boomingApiSecret)
        .update(reqPayload)
        .digest('hex')

      const option = {
        url: `${baseUrl}/${endpoint}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bg-Api-Key': boomingApiKey,
          'X-Bg-Nonce': nonce,
          'X-Bg-Signature': signature
        },
        data: requestBody
      }
      try {
        const { data: { play_url: playUrl } } = await axios(option)
        gameUrl = `${playUrl}&sessionId=${sessionId}&userId=${user.userId}&coinType=${coin}`
        
      } catch (error) {
        console.error('API Error:', error)
        return this.addError('InternalServerErrorType', error)
      }
    }else if (aggregator === AGGREGATORS.TINYREX) {
      const {
        base_url: endPoint,
        operator_id,
      } = config.getProperties().tinyrex

      const payload = {
        userId: user.userId,
        gameId: isGameExist.identifier,
        currencyCode: coin,
        date: Date.now()
      }
      const token = encryptData(payload)
      gameUrl= `${endPoint}/games/open?game_id=${isGameExist.identifier}&operator_id=${operator_id}&user_id=${user.userId}&coin=${coin}&session_id=${token}`
      console.log("gameeeeeeeeeee", gameUrl)
    }
    return {
      success: !!gameUrl,
      gameUrl: gameUrl,
      currency: coin,
      identifier: isGameExist?.identifier,
      gameId,
      casinoPlayerId: `${user.userId}_${coin}`,
      timestamp: new Date(),
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
