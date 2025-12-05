import Flatted from 'flatted'
import Logger from '@src/libs/logger.js'
import { socketEmitter } from '@src/libs/socketEmitter.js'
import { SOCKET_EMITTERS, NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants.js'

/**
 * Wallet Emitter for Emitting things related to the /wallet namespace
 *
 * @export
 * @class WalletEmitter
 */
export class LiveChatsEmitter {
  static async emitLiveChats (payload, groupId, userId) {
    try {
      // room to emit
      const room = ROOMS.PUBLIC.USER_CHAT + ':' + groupId

      // data to send
      payload = Flatted.parse(Flatted.stringify(payload))

      // emmiter
      socketEmitter.of(NAMESPACES.USER_CHAT).to(room).emit(SOCKET_EMITTERS.LIVE_USERS_CHATS, { data: payload, userId })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on user chat' })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
