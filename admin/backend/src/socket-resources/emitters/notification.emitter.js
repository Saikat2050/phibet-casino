import { socketEmitter } from '@src/libs/socketEmitter'
import { EVENTS, NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants'

/**
 * @param {string | number} userId
 * @param {object} payload
 */
export function emitNotification (payload) {
  socketEmitter.of(NAMESPACES.PUBLIC).to(`${ROOMS.PUBLIC.NOTIFICATION}`).emit(EVENTS.NOTIFICATION, payload)
  return true
}

export function emitUserNotification (userIds, payload) {
  const namespace = socketEmitter.of(NAMESPACES.PRIVATE)
  const rooms = userIds.map(userId => `${ROOMS.PRIVATE.NOTIFICATION}:${userId}`)

  // namespace.socketsJoin(rooms) // Join all rooms at once
  namespace.to(rooms).emit(EVENTS.NOTIFICATION, payload)

  return true
}
