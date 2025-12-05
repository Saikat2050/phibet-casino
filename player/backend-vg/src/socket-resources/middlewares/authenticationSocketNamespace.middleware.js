import dbModels from '../../db/models'
import jwt from 'jsonwebtoken'
import config from '../../configs/app.config'
import { TokenRequiredErrorType, UserNotExistsErrorType } from '../../utils/constants/errors'
import Logger from '../../libs/logger'
import { error } from 'winston'

export default async function authenticationSocketNamespaceMiddleWare (socket, next) {
  try {
    const {
      User: UserModel
    } = dbModels

    const accessToken = socket.handshake?.auth?.accessToken
    if (!accessToken) {
      next(TokenRequiredErrorType)
    }
    const payLoad = await jwt.verify(accessToken, config.get('jwt.loginTokenSecret'))

    // const isTokenExistInRedis = await socketServer.redisClient.get(`user:${payLoad.uuid}`)

    // if (isTokenExistInRedis !== accessToken) {
    //   return next(InvalidTokenErrorType)
    // }

    const findUser = await UserModel.findOne({
      where:
    { userId: payLoad.id }
    })
    if (!findUser) {
      return next(UserNotExistsErrorType)
    }

    const operator = {}
    operator.userId = payLoad.id
    socket.operator = operator

    next()
  } catch (err) {
    Logger.error('Error in authenticationSocketMiddleware', {
      message: err.message,
      context: socket.handshake,
      exception: err
    })
    return next(error)
  }
}
