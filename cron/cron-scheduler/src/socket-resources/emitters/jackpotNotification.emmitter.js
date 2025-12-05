import { socketEmitter } from '@src/libs/sockerEmitter'
import { NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants'

/**
 * @param {object} payload
 */
export function emitAdminEndJackpotNotification (payload) {
  socketEmitter.of(NAMESPACES.JACKPOT_ADMIN).to(ROOMS.PUBLIC.JACKPOT).emit(ROOMS.PUBLIC.JACKPOT_ADMIN, payload)
  return true
}

/**
 * @param {object} payload
 */
export function emitUserEndJackpotNotification (payload) {
  socketEmitter.of(NAMESPACES.JACKPOT_USER).to(ROOMS.PUBLIC.JACKPOT).emit(ROOMS.PUBLIC.JACKPOT_USER, payload)
  return true
}
