import { SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../utils/constants/socket'
import dbModels from '../../db/models'
import jwt from 'jsonwebtoken'
import config from '../../configs/app.config'
import Logger from '../../libs/logger'
import { error } from 'winston'
/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(SOCKET_NAMESPACES.WALLET)

  // namespace.use(authenticationSocketNamespaceMiddleWare)
  namespace.use(async (socket, next) => {
    try {
      const {
        User: UserModel
      } = dbModels
      const accessToken = socket.handshake?.auth?.token
      if (!accessToken) {
        return next(new Error('TokenRequiredErrorType'))
      }
      const payLoad = await jwt.verify(accessToken, config.get('jwt.loginTokenSecret'))

      const findUser = await UserModel.findOne({
        where:
      { userId: payLoad.id }
      })
      if (!findUser) {
        return next(new Error('UserNotExistsErrorType'))
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
  })
  namespace.on('connection', (socket) => {
    socket.join(SOCKET_ROOMS.USER_WALLET + ':' + socket.operator.userId)
    socket.join(socket.handshake?.auth?.token)
    socket.join(SOCKET_ROOMS.KYC_STATUS + ':' + socket.operator.userId)
  })
}
