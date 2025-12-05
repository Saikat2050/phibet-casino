import { client } from '@src/libs/redis'
import { CACHE_STORE_PREFIXES } from '@src/utils/constants/app.constants'
import { errorTypes } from '@src/utils/constants/error.constants'
import { NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants'

/**
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(NAMESPACES.PRIVATE)

  namespace.use(async (socket, next) => {
    try {
      const accessToken = socket.handshake.auth?.token || socket.handshake.headers['access-token']
      console.log('Access Token:', accessToken);
      
      if (!accessToken) {
        console.log('No access token provided');
        return next(errorTypes.AccessTokenNotFoundErrorType)
      }

      const sessionData = await client.get(`${CACHE_STORE_PREFIXES.SESSION}${accessToken}`)
      if (!sessionData) {
        console.log('Session not found for token:', accessToken);
        return next(errorTypes.SessionExpiredErrorType)
      }

      const session = JSON.parse(sessionData)
      if (!session || !session.userId) {
        console.log('Invalid session data');
        return next(errorTypes.SessionExpiredErrorType)
      }

      socket.operator = {
        userId: session.userId
      }
      console.log('Private namespace authentication successful for user:', session.userId);
      next()
    } catch (error) {
      console.error('Private namespace authentication error:', error);
      next(error)
    }
  })

  namespace.on('connection', (socket) => {    
    if (socket.operator?.userId) {
      socket.join(`${ROOMS.PRIVATE.BET}:${socket.operator.userId}`)
      socket.join(`${ROOMS.PRIVATE.PAYMENT}:${socket.operator.userId}`)
      socket.join(`${ROOMS.PRIVATE.WALLET}:${socket.operator.userId}`)
      socket.join(`${ROOMS.PRIVATE.EXCHANGE_BET}:${socket.operator.userId}`)
      socket.join(`${ROOMS.PRIVATE.DISPUTE}:${socket.operator.userId}`)
      socket.join(`${ROOMS.PRIVATE.NOTIFICATION}:${socket.operator.userId}`)
      socket.join(`${ROOMS.PRIVATE.LOGOUT}:${socket.operator.userId}`)
    }
  })

  namespace.on('disconnect', (reason) => {
    console.log('Private namespace disconnect:', reason);
  })
}
