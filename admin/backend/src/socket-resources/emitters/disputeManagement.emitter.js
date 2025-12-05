import { socketEmitter } from '@src/libs/socketEmitter'
import { EVENTS, NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants'

/**
 * @param {string | number} userId
 * @param {object} payload
 */
export function emitDisputeMessage (userId, payload) {
  socketEmitter.of(NAMESPACES.PRIVATE).to(`${ROOMS.PRIVATE.DISPUTE}:${userId}`).emit(EVENTS.DISPUTE, payload)
  return true
}
