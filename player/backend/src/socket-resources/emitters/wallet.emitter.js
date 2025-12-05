import { socketEmitter } from '@src/libs/socketEmitter'
import { EVENTS, NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants'

/**
 * @param {string | number} userId
 * @param {object} payload
 */
export function emitUserWallet (userId, payload) {
  socketEmitter.of(NAMESPACES.PRIVATE).to(`${ROOMS.PRIVATE.WALLET}:${userId}`).emit(EVENTS.WALLET, payload)
  return true
}

export function emitPaymentTransaction (userId, payload) {
  socketEmitter.of(NAMESPACES.PRIVATE).to(`${ROOMS.PRIVATE.PAYMENT}:${userId}`).emit(EVENTS.PAYMENT, payload)
  return true
}
