import { EVENTS, NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants'
import { Emitter } from '@socket.io/redis-emitter'
import { publisherClient } from '@src/libs/redis'

const socketEmitter = new Emitter(publisherClient)
/**
 * @param {string | number} userId
 * @param {object} payload
 */
export function emitLogOut (userId, payload) {
  socketEmitter.of(NAMESPACES.PRIVATE).to(`${ROOMS.PRIVATE.LOGOUT}:${userId}`).emit(EVENTS.LOGOUT, payload)
  return true
}
