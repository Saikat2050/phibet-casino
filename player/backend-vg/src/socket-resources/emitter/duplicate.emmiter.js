
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'
import { ERROR_MSG } from '../../utils/constants/errors'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES } from '../../utils/constants/socket'

/**
 * Wallet Emitter for Emitting things related to the /wallet namespace
 *
 * @export
 * @class WalletEmitter
 */
export default class DuplicateLoginEmitter {
  static async duplicate (token) {
    try {
      const room = token
      socketEmitter.of(SOCKET_NAMESPACES.WALLET).to(room).emit(SOCKET_EMITTERS.DUPLICATE_LOGIN, { data: { isDuplicate: true } })
    } catch (error) {
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
