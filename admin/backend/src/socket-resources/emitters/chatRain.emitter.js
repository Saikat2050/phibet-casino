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
export class LiveChatsRainEmitter {
  static async emitLiveChatRain (payload, groupId) {
    try {
      const room = ROOMS.PUBLIC.USER_CHAT + ':' + groupId
      payload = Flatted.parse(Flatted.stringify(payload))

      socketEmitter.of(NAMESPACES.USER_CHAT).to(room).emit(SOCKET_EMITTERS.LIVE_CHAT_RAIN, { data: payload })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on User Chat Rain' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitClosedChatRain (payload, groupId) {
    try {
      const room = ROOMS.PUBLIC.USER_CHAT + ':' + groupId
      payload = Flatted.parse(Flatted.stringify(payload))

      socketEmitter.of(NAMESPACES.USER_CHAT).to(room).emit(SOCKET_EMITTERS.CLOSED_CHAT_RAIN, { data: payload })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on User Chat Rain' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitDeleteChatRain (payload, groupId) {
    try {
      const room = ROOMS.PUBLIC.USER_CHAT + ':' + groupId
      payload = Flatted.parse(Flatted.stringify(payload))

      socketEmitter.of(NAMESPACES.USER_CHAT).to(room).emit(SOCKET_EMITTERS.DELETE_CHAT_RAIN, { data: payload })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on User Chat Rain Delete' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitUpdateChatRain (payload, groupId) {
    try {
      const room = ROOMS.PUBLIC.USER_CHAT + ':' + groupId
      payload = Flatted.parse(Flatted.stringify(payload))

      socketEmitter.of(NAMESPACES.USER_CHAT).to(room).emit(SOCKET_EMITTERS.UPDATE_CHAT_RAIN, { data: payload })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on User Chat Rain Update' })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
