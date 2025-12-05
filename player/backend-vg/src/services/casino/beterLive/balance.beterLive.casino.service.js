import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import { resetSocketLoginToken } from '../../../utils/common'
import ServiceBase from '../../serviceBase'
import { INTERNAL_ERROR, scSum, userDetailsAndVerification, verifySignature } from './beterLive.helper'
import * as jwt from 'jsonwebtoken'
import { round } from 'number-precision'

export class BeterLiveBalanceService extends ServiceBase {
  async run () {
    const {
      dbModels: { Wallet: WalletModel }
    } = this.context

    const { playerId, sessionToken: sessionId } = this.args
    try {
      if (!verifySignature(this.args)) {
        return {
          status: 403,
          statusCode: 403,
          code: 'invalid.signature',
          message: 'Signature Incorrect'
        }
      }

      const jwtToken = await socketServer.redisClient.get(`gamePlay-${sessionId.split('_')[0]}`)

      if (!jwtToken) {
        return {
          status: 422,
          statusCode: 422,
          code: 'invalid.session.key',
          message: 'Session key is invalid or expired'
        }
      }

      const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))

      if (!payload?.userId || !payload?.coin || !payload?.gameId) {
        return {
          status: 422,
          statusCode: 422,
          code: 'invalid.session.key',
          message: 'Session key is invalid or expired'
        }
      }

      const [userId, coin] = playerId.split('_')

      if (+payload.userId !== +userId || payload.coin !== coin) {
        return {
          status: 422,
          statusCode: 422,
          code: 'player.not.found',
          message: 'Player is not found'
        }
      }

      const { isGameExist, userData } = payload
      if (!isGameExist) {
        return {
          status: 422,
          statusCode: 422,
          code: 'unknown.game',
          message: 'Launch alias not found'
        }
      }

      if (!userData) {
        return {
          status: 422,
          statusCode: 422,
          code: 'player.not.found',
          message: 'Player is not found'
        }
      }

      const [userWallet] = await Promise.all([
        WalletModel.findOne({ attributes: ['ownerId','scCoin', 'gcCoin'], where: { ownerId: userData.userId } }),
        resetSocketLoginToken({ key: `user:${sessionId.split('_')[0]}` })
      ])

      const accountBalance = coin === 'SC' ? scSum(userWallet) : +round(+userWallet.gcCoin, 2)
      return { balance: accountBalance }
    } catch (error) {
      return {
        status: 'ERROR',
        code: 'GENERAL_ERROR',
        statusCode: 503,
        message: 'Please contact casino for this with the initial request.'
      }
    }
  }
}
