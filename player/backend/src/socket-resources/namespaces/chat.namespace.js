import { client } from '@src/libs/redis'
import ChatHandler from '../handlers/chat.handler'
import { NAMESPACES, ROOMS, SOCKET_LISTENERS } from '@src/utils/constants/socket.constants'
import { CACHE_STORE_PREFIXES } from '@src/utils/constants/app.constants'
import { errorTypes } from '@src/utils/constants/error.constants'
import { sequelize } from '@src/database/models'
/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(NAMESPACES.USER_CHAT)

  namespace.use(async (socket, next) => {
    try {
      // Try to get token from auth object first, then fallback to headers
      const accessToken = socket.handshake.auth?.token || socket.handshake.headers['access-token']
      // Try to get group from auth object first, then fallback to headers
      const groupId = socket.handshake.auth?.group || socket.handshake.headers.group

      console.log('Chat namespace connection attempt:', {
        accessToken: accessToken ? 'present' : 'missing',
        groupId: groupId,
        auth: socket.handshake.auth,
        headers: socket.handshake.headers
      })

      if (!groupId) {
        console.error('Group ID missing from auth object and headers')
        console.error('Available auth:', socket.handshake.auth)
        console.error('Available headers:', socket.handshake.headers)
        return next(new Error('GroupMissingrErrorType'))
      }

      let userId = null

      // if access token is send
      if (accessToken) {
        // verify
        const session = JSON.parse(await client.get(`${CACHE_STORE_PREFIXES.SESSION}${accessToken}`))
        if (!session) {
          console.error('Session not found for token')
          return next(errorTypes.SessionExpiredErrorType)
        }

        if (!session.userId) {
          console.error('User ID not found in session')
          return next(new Error('UserNotExistsErrorType'))
        } else userId = session.userId

        // check if user is part of group or not
        const groupJoin = await sequelize.models.userChatGroup.findOne({
          where: { chatGroupId: groupId, userId: session.userId }
        })

        if (!groupJoin || groupJoin.isActive === false) {
          console.error('User not joined to group or group inactive:', { groupId, userId })
          return next(new Error('UserDoesNotJoinedThisGroupErrorType'))
        }
      } else {
        // check if group is global
        const group = await sequelize.models.chatGroup.findOne({ where: { id: groupId } })
        if (!group || group.isGlobal === false) {
          console.error('Group not found or not global:', { groupId })
          return next(new Error('ThisGroupIsNotGlobalErrorType'))
        }
      }

      // data to be used
      socket.operator = {
        userId: userId,
        groupId: groupId
      }

      console.log('Chat namespace authentication successful:', { userId, groupId })
      next()
    } catch (err) {
      console.error('Chat namespace authentication error:', err)
      return next(new Error('AuthenticationErrorType'))
    }
  })
  namespace.on('connection', (socket) => {
    const roomName = `${ROOMS.PUBLIC.USER_CHAT}:${socket.operator.groupId}`
    console.log(`User joining chat room: ${roomName}`)
    socket.join(roomName)
    socket.on(SOCKET_LISTENERS.SEND_MESSAGE, ChatHandler.sendMessage)

    // leave the room if connection destroys
    socket.on('disconnect', () => {
      console.log(`User leaving chat room: ${roomName}`)
      socket.leave(roomName)
    })
  })
}
