import Flatted from 'flatted'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'
import { ERROR_MSG } from '../../utils/constants/errors'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../utils/constants/socket'

/**
 * Leader Board Emitter for Emitting things related to the /leader-board namespace
 *
 * @export
 * @class LeaderBoardEmitter
 */
export default class LeaderBoardEmitter {
  static async emitLeaderBoardEmitter (socketObj) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.LEADER_BOARD
      socketEmitter.of(SOCKET_NAMESPACES.LEADER_BOARD).to(room).emit(SOCKET_EMITTERS.LEADER_BOARD_UPDATE, { data: socketObj })
    } catch (error) {
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
