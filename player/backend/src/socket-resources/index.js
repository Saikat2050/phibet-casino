import { createAdapter } from '@socket.io/redis-adapter'
import { Server as SocketServer } from 'socket.io'
import { errorTypes } from '../utils/constants/error.constants'
import { i18n } from '../libs/i18n'
import Logger from '../libs/logger'
import { publisherClient, subscriberClient } from '@src/libs/redis'
import { getLocalizedError, isTrustedError } from '../utils/error.utils'
import { argumentsDecoratorMiddleware } from './middlewares/argumentsDecorator.middleware'
import { registerNamespaces } from './namespaces'

// TODO: specify the particular origin
const socketCorsOptions = {
  cors: { origin: '*' },
  path: '/api/socket'
}

const socketServer = new SocketServer(socketCorsOptions)

socketServer.on('new_namespace', (namespace) => {
  namespace.use((socket, next) => {
    const req = socket.request

    i18n.init(req)

    socket.on('error', (error) => {
      if (isTrustedError(error)) {
        socket.emit('error', { data: {}, errors: [getLocalizedError(error, socket.request.__)] })
      } else {
        Logger.error(
          (error.name || errorTypes.InternalServerErrorType.name),
          {
            message: error.message || error.description,
            fault: error.fields
          })
        socket.emit('error', { data: {}, errors: [getLocalizedError(errorTypes.InternalServerErrorType, socket.request.__)] })
      }
    })

    socket.use(argumentsDecoratorMiddleware(socket))

    next()
  })
})

socketServer.adapter(createAdapter(publisherClient, subscriberClient))

registerNamespaces(socketServer)

export default socketServer
