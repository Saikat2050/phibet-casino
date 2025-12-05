import Flatted from 'flatted'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'
import { ERROR_MSG } from '../../utils/constants/errors'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../utils/constants/socket'

/**
 * Wallet Emitter for Emitting things related to the /wallet namespace
 *
 * @export
 * @class WalletEmitter
 */
export default class KycCompletedStatusEmitter {
  static async emitKycStatus (socketObj, playerId) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.KYC_STATUS + ':' + +playerId
      socketEmitter.of(SOCKET_NAMESPACES.WALLET).to(room).emit(SOCKET_EMITTERS.KYC_STATUS, { data: { ...socketObj, playerId } })
    } catch (error) {
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
