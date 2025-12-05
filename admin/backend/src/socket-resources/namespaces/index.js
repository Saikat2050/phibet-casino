import { newNamespaceRegistrationMiddleware } from '@src/socket-resources/middlewares/newNamespaceRegistration.middleware'
import publicNamespace from './public.namespace'
import privateNamespace from './private.namespace'

/**
 * @export
 * @param {import('socket.io').Socket} socket
 * @param {SocketSchemas} socketSchemas
 * @return {*}
 */
export function registerNamespaces (socket) {
  socket.on('new_namespace', (namespace) => {
    namespace.use(newNamespaceRegistrationMiddleware)
  })

  privateNamespace(socket)
  publicNamespace(socket)
}
