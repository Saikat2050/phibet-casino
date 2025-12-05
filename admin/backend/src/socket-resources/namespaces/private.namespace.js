import { appConfig } from '@src/configs'
import { errorTypes } from '@src/utils/constants/error.constants'
import { NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants'
import Jwt from 'jsonwebtoken'
import AuthenticationError from '@src/errors/authentication.error'

/**
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(NAMESPACES.PRIVATE)

  namespace.use(async (socket, next) => {
    try {
      const accessToken = socket.handshake.headers['access-token']
      if (!accessToken) return next(errorTypes.InvalidTokenErrorType)
      try {
        const decodedToken = Jwt.verify(accessToken, appConfig.jwt.secret)
        socket.operator = {
          adminUserId: decodedToken.adminUserId
        }
      } catch (error) {
        return next(new AuthenticationError(error))
      }
      next()
    } catch (error) {
      next(error)
    }
  })
  namespace.on('connection', (socket) => {
    socket.join(`${ROOMS.PRIVATE.DISPUTE}`)
  })
}
