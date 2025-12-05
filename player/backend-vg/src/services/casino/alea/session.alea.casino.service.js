import * as jwt from 'jsonwebtoken'
import ServiceBase from '../../serviceBase'
import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import crypto from 'crypto'
import { GAME_NOT_FOUND, INTERNAL_ERROR, INVALID_SIGNATURE, PLAYER_BLOCKED, PLAYER_NOT_FOUND, SESSION_EXPIRED } from './alea.helper'

export class GetSessionAleaCasinoService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel }
    } = this.context

    const { casinoSessionId, signature } = this.args

    try {
      const str = `${casinoSessionId}${config.get('alea.secret_key')}`
      const calculatedSignature = `SHA-512=${crypto.createHash('sha512').update(str).digest('hex')}`
      if (calculatedSignature !== signature) throw INVALID_SIGNATURE

      const jwtToken = await socketServer.redisClient.get(`gamePlay-${casinoSessionId.split('_')[0]}`)
      if (!jwtToken) return SESSION_EXPIRED

      const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))

      if (!payload?.userId || !payload?.coin || !payload?.gameId) return SESSION_EXPIRED

      const users = await UserModel.findOne({ attributes: ['isActive', 'isInternalUser', 'isBan'], where: { userId: payload?.userId } })

      const { isGameExist } = payload

      if (!isGameExist) return GAME_NOT_FOUND

      if (!users) return PLAYER_NOT_FOUND
      if (users.isBan || !users.isActive) {
        return PLAYER_BLOCKED
      }
      return {
        country: 'US',
        currency: payload.coin,
        casinoPlayerId: payload.userId + '_' + payload.coin,
        isTest: users.isInternalUser
      }
    } catch (error) {
      console.log('Error in Alea Balance call service', error)
      return INTERNAL_ERROR
    }
  }
}
