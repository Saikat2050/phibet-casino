import { sendSocketResponse } from '@src/helpers/response.helpers.js'
import { errorTypes } from '@src/utils/constants/error.constants.js'
import { SendMessageService } from '@src/services/chatModule/LiveChat/sendMessage.service.js'

/**
 * Demo Handler for handling all the request of /demo namespace
 *
 * @export
 * @class DemoHandler
 */
export default class ChatHandler {
  /**
   * Handler method to handle the request for helloWorld event
   *
   * @static
   * @param {import('middlewares/socket/contextSocket').SocketRequestData} reqData - object contains all the request params sent from the client
   * @param {function} resCallback - function to send acknowledgement with data to the emitter
   * @memberof ChatHandler
   */
  static async sendMessage (reqData, resCallback) {
    try {
      const { result, successful, errors } = await SendMessageService.execute({ ...reqData.payload, ...reqData.context.socket.operator }, reqData.context)

      sendSocketResponse({ reqData, resCallback }, { result, successful, serviceErrors: errors, defaultError: errorTypes.InternalServerErrorType })
    } catch (error) {
      resCallback({ data: {}, errors: [errorTypes.InternalServerErrorType] })
    }
  }
}
