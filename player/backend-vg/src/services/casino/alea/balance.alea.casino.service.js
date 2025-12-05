import * as jwt from 'jsonwebtoken'
import { round } from 'number-precision'
import ServiceBase from '../../serviceBase'
import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import { GAME_NOT_FOUND, INTERNAL_ERROR, INVALID_CURRENCY, INVALID_SIGNATURE, PLAYER_BLOCKED, PLAYER_NOT_FOUND, scSum, verifySignature } from './alea.helper'

export class GetBalanceAleaCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: { Wallet: WalletModel }
    } = this.context

    const { playerId, currency, casinoSessionId, gameId } = this.args

    try {
      if (!verifySignature(this.args)) return INVALID_SIGNATURE

      const jwtToken = await socketServer.redisClient.get(`gamePlay-${casinoSessionId.split('_')[0]}`)
      if (!jwtToken) {
        return {
          statusCode: 403,
          status: 'DENIED',
          code: 'SESSION_EXPIRED',
          message: 'Game Session Expired'
        }
      }

      const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))

      if (!payload?.userId || !payload?.coin || !payload?.gameId) {
        return {
          statusCode: 403,
          status: 'DENIED',
          code: 'SESSION_EXPIRED',
          message: 'Game Session Expired'
        }
      }

      if (+payload.identifier !== +gameId) return GAME_NOT_FOUND

      const [userId, coin] = playerId.split('_')

      if (+payload.userId !== +userId || payload.coin !== coin) return PLAYER_NOT_FOUND

      if (currency !== payload.coin) return INVALID_CURRENCY

      const { isGameExist, userData } = payload

      if (!isGameExist) return GAME_NOT_FOUND

      if (!userData) return PLAYER_NOT_FOUND
      if (userData.isBan) return PLAYER_BLOCKED

      const isScActive = coin === 'SC'

      const userWallet = await WalletModel.findOne({ attributes: ['ownerId', 'scCoin', 'gcCoin'], where: { ownerId: userData.userId } })

      const accountBalance = isScActive ? +scSum(userWallet) : +round(+userWallet.gcCoin, 2)

      return {
        realBalance: accountBalance,
        bonusBalance: 0.0
      }
    } catch (error) {
      console.log('Error in Alea Balance call service', error)
      return INTERNAL_ERROR
    }
  }
}
