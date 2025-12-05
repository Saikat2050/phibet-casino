import { newNamespaceRegistrationMiddleware } from '@src/socket-resources/middlewares/newNamespaceRegistration.middleware'
import publicNamespace from './public.namespace'
import jackpotAdminNamespace from './jackpotAdmin.namespace'
import jackpotUserNamespace from './jackpotUser.namespace'

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

  publicNamespace(socket)
  jackpotUserNamespace(socket)
  jackpotAdminNamespace(socket)
}
