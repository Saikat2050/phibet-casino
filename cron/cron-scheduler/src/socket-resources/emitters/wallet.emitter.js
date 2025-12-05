import { socketEmitter } from "@src/libs/sockerEmitter"
import { NAMESPACES, ROOMS } from "@src/utils/constants/socket.constants"


/**
 * @param {string | number} userId
 * @param {object} payload
 */
export function emitUserWallet (userId, payload) {
  socketEmitter.of(NAMESPACES.PRIVATE).to(`${ROOMS.PRIVATE.WALLET}:${userId}`).emit(ROOMS.PRIVATE.WALLET, payload)
  return true
}
