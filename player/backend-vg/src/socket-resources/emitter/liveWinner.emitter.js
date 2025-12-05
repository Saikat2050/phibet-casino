import Flatted from 'flatted'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'
import { ERROR_MSG } from '../../utils/constants/errors'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../utils/constants/socket'

/**
 * Wallet Emitter for Emitting things related to the /wallet namespace
 *
 * @export
 * @class LiveWinnerEmitter
 */
export default class LiveWinnerEmitter {
  static async emitLiveWinners (socketObj) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.LIVE_WINNERS
      socketEmitter.of(SOCKET_NAMESPACES.WINNER).to(room).emit(SOCKET_EMITTERS.LIVE_GAME_WINNERS, { data: socketObj })
    } catch (error) {
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
