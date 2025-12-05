import { createAdapter } from '@socket.io/redis-adapter'
import { publisherClient, subscriberClient } from '@src/libs/redis'
import { Server as SocketServer } from 'socket.io'
import { registerNamespaces } from './namespaces'

const socketServer = new SocketServer({
  cors: { origin: '*' },
  path: '/api/socket'
})

socketServer.adapter(createAdapter(publisherClient, subscriberClient))
registerNamespaces(socketServer)

export { socketServer }
